import { expect, test } from '@playwright/test';
import { statusIncidentCatalog, statusSystems } from '../src/data/status';
import {
  buildStatusSnapshot,
  calculateAvailability,
  getIncidentUpdates,
  getScheduledStatusIncidents,
  STATUS_AVAILABILITY_WEIGHTS,
  STATUS_WINDOW_DAYS,
  type ScheduledStatusIncident,
} from '../src/lib/status';

const minute = 60_000;
const day = 24 * 60 * minute;
const origin = Date.UTC(2030, 0, 1);

test.describe('Status availability model', () => {
  test('keeps the approved downtime weights explicit', () => {
    expect(STATUS_AVAILABILITY_WEIGHTS).toEqual({
      degraded: 0.5,
      critical: 1,
    });
  });

  test('reports full availability without incidents', () => {
    expect(calculateAvailability([], origin, origin + 120 * minute)).toEqual({
      observedMinutes: 120,
      operationalMinutes: 120,
      degradedMinutes: 0,
      criticalMinutes: 0,
      effectiveDowntimeMinutes: 0,
      availabilityPercentage: 100,
    });
  });

  test('counts degraded minutes at half weight', () => {
    const metrics = calculateAvailability([
      { startedAt: origin, resolvedAt: origin + 60 * minute, severity: 'degraded' },
    ], origin, origin + 120 * minute);

    expect(metrics.degradedMinutes).toBe(60);
    expect(metrics.effectiveDowntimeMinutes).toBe(30);
    expect(metrics.availabilityPercentage).toBe(75);
  });

  test('counts critical minutes at full weight', () => {
    const metrics = calculateAvailability([
      { startedAt: origin, resolvedAt: origin + 60 * minute, severity: 'critical' },
    ], origin, origin + 120 * minute);

    expect(metrics.criticalMinutes).toBe(60);
    expect(metrics.effectiveDowntimeMinutes).toBe(60);
    expect(metrics.availabilityPercentage).toBe(50);
  });

  test('uses the worst severity during overlapping incidents', () => {
    const metrics = calculateAvailability([
      { startedAt: origin, resolvedAt: origin + 60 * minute, severity: 'degraded' },
      { startedAt: origin + 15 * minute, resolvedAt: origin + 45 * minute, severity: 'critical' },
      { startedAt: origin + 20 * minute, resolvedAt: origin + 40 * minute, severity: 'critical' },
    ], origin, origin + 120 * minute);

    expect(metrics.operationalMinutes).toBe(60);
    expect(metrics.degradedMinutes).toBe(30);
    expect(metrics.criticalMinutes).toBe(30);
    expect(metrics.effectiveDowntimeMinutes).toBe(45);
    expect(metrics.availabilityPercentage).toBe(62.5);
  });

  test('clips incidents to the requested window and ignores touching boundaries', () => {
    const metrics = calculateAvailability([
      { startedAt: origin - 60 * minute, resolvedAt: origin + 10 * minute, severity: 'critical' },
      { startedAt: origin + 50 * minute, resolvedAt: origin + 90 * minute, severity: 'degraded' },
      { startedAt: origin - 10 * minute, resolvedAt: origin, severity: 'critical' },
      { startedAt: origin + 60 * minute, resolvedAt: origin + 70 * minute, severity: 'critical' },
    ], origin, origin + 60 * minute);

    expect(metrics.operationalMinutes).toBe(40);
    expect(metrics.criticalMinutes).toBe(10);
    expect(metrics.degradedMinutes).toBe(10);
    expect(metrics.effectiveDowntimeMinutes).toBe(15);
    expect(metrics.availabilityPercentage).toBe(75);
  });

  test('handles adjacent outages without double-counting their shared boundary', () => {
    const metrics = calculateAvailability([
      { startedAt: origin, resolvedAt: origin + 30 * minute, severity: 'critical' },
      { startedAt: origin + 30 * minute, resolvedAt: origin + 60 * minute, severity: 'critical' },
    ], origin, origin + 60 * minute);

    expect(metrics.criticalMinutes).toBe(60);
    expect(metrics.effectiveDowntimeMinutes).toBe(60);
    expect(metrics.availabilityPercentage).toBe(0);
  });

  test('rejects invalid windows and incident durations', () => {
    expect(() => calculateAvailability([], origin, origin)).toThrow();
    expect(() => calculateAvailability([], Number.NaN, origin)).toThrow();
    expect(() => calculateAvailability([
      { startedAt: origin, resolvedAt: origin - minute, severity: 'critical' },
    ], origin, origin + day)).toThrow();
    expect(() => getScheduledStatusIncidents(new Date(Number.NaN))).toThrow();
  });

  test('returns the same absolute schedule on repeated visits', () => {
    const date = new Date('2026-09-30T12:00:00Z');
    expect(getScheduledStatusIncidents(date)).toEqual(getScheduledStatusIncidents(date));
    expect(getScheduledStatusIncidents(new Date('2026-09-30T00:01:00Z')))
      .toEqual(getScheduledStatusIncidents(new Date('2026-09-30T23:59:59Z')));
  });

  test('keeps existing incidents on their original dates as the window moves', () => {
    const before = getScheduledStatusIncidents(new Date('2026-09-30T12:00:00Z'));
    const after = getScheduledStatusIncidents(new Date('2026-10-01T12:00:00Z'));
    const previousDates = new Map(
      before.map((incident) => [incident.instanceId, [incident.startedAt, incident.resolvedAt]])
    );
    const shared = after.filter((incident) => previousDates.has(incident.instanceId));

    expect(shared.length).toBeGreaterThan(0);
    for (const incident of shared) {
      expect([incident.startedAt, incident.resolvedAt]).toEqual(
        previousDates.get(incident.instanceId)
      );
    }
  });

  test('never repeats an incident type in rolling 90-day windows over two years', () => {
    const firstDate = Date.UTC(2025, 0, 1);
    const occurrences = new Map<string, { id: string; startedAt: number; resolvedAt: number }>();

    for (let offset = 0; offset < 730; offset += 1) {
      const reference = firstDate + offset * day;
      const incidents = getScheduledStatusIncidents(new Date(reference));
      const ids = incidents.map(({ id }) => id);

      expect(new Set(ids).size).toBe(ids.length);
      for (const incident of incidents) {
        expect(incident.startedAt).toBeLessThan(reference);
        expect(incident.resolvedAt).toBeGreaterThan(reference - STATUS_WINDOW_DAYS * day);
        occurrences.set(incident.instanceId, incident);
      }
    }

    for (const definition of statusIncidentCatalog) {
      const history = [...occurrences.values()]
        .filter(({ id }) => id === definition.id)
        .sort((left, right) => left.startedAt - right.startedAt);

      expect(history.length).toBeGreaterThan(1);
      for (let index = 1; index < history.length; index += 1) {
        expect(history[index].startedAt - history[index - 1].resolvedAt)
          .toBeGreaterThanOrEqual(STATUS_WINDOW_DAYS * day);
      }
    }

    const calendarGaps = new Set<number>();
    for (const definition of statusIncidentCatalog) {
      const history = [...occurrences.values()]
        .filter(({ id }) => id === definition.id)
        .sort((left, right) => left.startedAt - right.startedAt);
      for (let index = 1; index < history.length; index += 1) {
        calendarGaps.add(
          Math.floor(history[index].startedAt / day)
          - Math.floor(history[index - 1].startedAt / day)
        );
      }
    }
    expect(calendarGaps.size).toBeGreaterThan(5);
  });

  test('uses 90 complete UTC days across leap years and timezone changes', () => {
    const snapshot = buildStatusSnapshot(new Date('2028-03-01T01:00:00+02:00'));

    expect(snapshot.asOf).toBe(Date.UTC(2028, 1, 29));
    expect(snapshot.windowEnd - snapshot.windowStart).toBe(STATUS_WINDOW_DAYS * day);
    expect(snapshot.overall.observedMinutes).toBe(STATUS_WINDOW_DAYS * 24 * 60);
    for (const system of snapshot.systems) {
      expect(system.days).toHaveLength(STATUS_WINDOW_DAYS);
      expect(new Set(system.days.map(({ date }) => date)).size).toBe(STATUS_WINDOW_DAYS);
    }
  });

  test('reconciles historical periods and component totals with the same incidents', () => {
    const snapshot = buildStatusSnapshot(new Date('2026-09-30T12:00:00Z'));

    expect(snapshot.systems).toHaveLength(statusSystems.length);
    expect(snapshot.periods).toHaveLength(3);
    expect(snapshot.periods[0].metrics).toEqual(snapshot.overall);
    for (let index = 0; index < snapshot.periods.length; index += 1) {
      const period = snapshot.periods[index];
      expect(period.endedAt - period.startedAt).toBe(STATUS_WINDOW_DAYS * day);
      const historicalIncidents = getScheduledStatusIncidents(new Date(period.endedAt));
      expect(period.metrics).toEqual(
        calculateAvailability(historicalIncidents, period.startedAt, period.endedAt)
      );
      if (index > 0) {
        expect(period.endedAt).toBe(snapshot.periods[index - 1].startedAt);
      }
    }
    expect(snapshot.incidents.some(({ severity }) => severity === 'degraded')).toBe(true);
    expect(snapshot.incidents.some(({ severity }) => severity === 'critical')).toBe(true);

    for (const system of snapshot.systems) {
      const incidents = snapshot.incidents.filter(({ systemIds }) =>
        systemIds.includes(system.id)
      );
      expect(system.metrics).toEqual(
        calculateAvailability(incidents, snapshot.windowStart, snapshot.windowEnd)
      );
      expect(system.days.reduce((sum, date) => sum + date.metrics.effectiveDowntimeMinutes, 0))
        .toBeCloseTo(system.metrics.effectiveDowntimeMinutes, 8);
      expect(system.days.some(({ severity }) => severity !== 'operational'))
        .toBe(incidents.length > 0);
    }
  });

  test('keeps incident catalogue IDs unique and postmortems complete', () => {
    expect(new Set(statusIncidentCatalog.map(({ id }) => id)).size)
      .toBe(statusIncidentCatalog.length);
    for (const incident of statusIncidentCatalog) {
      expect(incident.systemIds.length).toBeGreaterThan(0);
      expect(incident.durationMinutes).toBeGreaterThan(0);
      for (const field of [
        incident.summary,
        incident.impact,
        incident.cause,
        incident.mitigation,
        incident.resolution,
        incident.followUp,
      ]) {
        expect(field.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('includes infrastructure failures alongside the human incidents', () => {
    const ids = statusIncidentCatalog.map(({ id }) => id);
    const requiredIds = [
      'istio-sidecar',
      'kafka-consumer-lag',
      'postgres-overload',
      'valkey-cache-stampede',
      'coffee-unavailable',
      'personal-maintenance',
    ];
    expect(ids).toEqual(expect.arrayContaining(requiredIds));
    const snapshot = buildStatusSnapshot(new Date('2026-09-30T12:00:00Z'));
    expect(snapshot.periods.flatMap(({ incidents }) => incidents.map(({ id }) => id)))
      .toEqual(expect.arrayContaining(requiredIds));
  });

  test('keeps calculated service and historical availability inside the requested range', () => {
    const firstDate = Date.UTC(2025, 0, 1);
    for (let offset = 0; offset < 730; offset += 1) {
      const snapshot = buildStatusSnapshot(new Date(firstDate + offset * day));
      const series = [
        { id: 'overall', metrics: snapshot.overall },
        ...snapshot.systems,
        ...snapshot.periods,
      ];

      for (const { id, metrics } of series) {
        const label = `${new Date(snapshot.asOf).toISOString()} / ${id}`;
        expect(metrics.availabilityPercentage, label).toBeGreaterThanOrEqual(97.5);
        expect(metrics.availabilityPercentage, label).toBeLessThanOrEqual(99.8);
        expect(metrics.availabilityPercentage, label).toBeCloseTo(
          100 * (1 - metrics.effectiveDowntimeMinutes / metrics.observedMinutes),
          10
        );
      }
    }
  });

  test('timestamps the complete recovery timeline even for a three-minute incident', () => {
    const incident: ScheduledStatusIncident = {
      id: 'mock-incident',
      instanceId: 'mock-incident-0',
      title: 'Mock incident',
      severity: 'degraded',
      systemIds: [statusSystems[0].id],
      durationMinutes: 3,
      startedAt: origin,
      resolvedAt: origin + 3 * minute,
      summary: 'Mock investigation.',
      impact: 'Mock impact.',
      cause: 'Mock cause.',
      mitigation: 'Mock mitigation.',
      resolution: 'Mock resolution.',
      followUp: 'Mock follow-up.',
    };
    const updates = getIncidentUpdates(incident);

    expect(updates.map(({ id }) => id))
      .toEqual(['investigating', 'identified', 'monitoring', 'resolved']);
    expect(updates.map(({ timestamp }) => timestamp))
      .toEqual([origin, origin + minute, origin + 2 * minute, origin + 3 * minute]);
    expect(updates.at(-1)?.message).toBe(incident.resolution);
  });
});
