import {
  statusIncidentCatalog,
  statusSystems,
  type IncidentSeverity,
  type StatusIncidentDefinition,
  type StatusSystemId,
  type SystemSeverity,
} from '@/data/status'

export const STATUS_WINDOW_DAYS = 90
export const STATUS_AVAILABILITY_WEIGHTS = {
  degraded: 0.5,
  critical: 1,
} as const

const minute = 60_000
const minutesPerDay = 24 * 60
const day = minutesPerDay * minute
const scheduleEpoch = Date.UTC(2000, 0, 1) / day
const minimumGapDays = STATUS_WINDOW_DAYS + 2
const componentMinimumGapDays = 47
const componentMaximumGapDays = 65

export interface AvailabilityInterval {
  startedAt: number
  resolvedAt: number
  severity: IncidentSeverity
}

export interface AvailabilityMetrics {
  observedMinutes: number
  operationalMinutes: number
  degradedMinutes: number
  criticalMinutes: number
  effectiveDowntimeMinutes: number
  availabilityPercentage: number
}

export interface ScheduledStatusIncident extends StatusIncidentDefinition {
  instanceId: string
  startedAt: number
  resolvedAt: number
}

export interface StatusIncidentUpdate {
  id: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  label: string
  timestamp: number
  message: string
}

export interface StatusDay {
  date: string
  severity: SystemSeverity
  metrics: AvailabilityMetrics
}

export interface StatusSystemHistory {
  id: (typeof statusSystems)[number]['id']
  name: string
  detail: string
  metrics: AvailabilityMetrics
  days: StatusDay[]
}

export interface StatusPeriod {
  id: string
  startedAt: number
  endedAt: number
  incidentCount: number
  incidents: ScheduledStatusIncident[]
  metrics: AvailabilityMetrics
}

export interface StatusSnapshot {
  asOf: number
  windowStart: number
  windowEnd: number
  overall: AvailabilityMetrics
  systems: StatusSystemHistory[]
  incidents: ScheduledStatusIncident[]
  periods: StatusPeriod[]
}

function utcDayStart(referenceDate: Date) {
  const timestamp = referenceDate.getTime()

  if (!Number.isFinite(timestamp)) {
    throw new RangeError('Status history requires a valid reference date')
  }

  return Math.floor(timestamp / day) * day
}

function seededRandom(id: string) {
  let state = 2166136261
  for (const character of `status-calendar-v1/${id}`) {
    state = Math.imul(state ^ character.charCodeAt(0), 16777619)
  }

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = Math.imul(state ^ (state >>> 15), state | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

export function getScheduledStatusIncidents(
  referenceDate: Date,
  definitions: readonly StatusIncidentDefinition[] = statusIncidentCatalog
): ScheduledStatusIncident[] {
  const windowEnd = utcDayStart(referenceDate)
  const windowStart = windowEnd - STATUS_WINDOW_DAYS * day
  const incidents: ScheduledStatusIncident[] = []
  const ids = new Set<string>()
  const systemIds = new Set<string>(statusSystems.map(({ id }) => id))
  const groups = new Map<StatusSystemId, StatusIncidentDefinition[]>()

  const recordIncident = (
    definition: StatusIncidentDefinition,
    startedAt: number,
    occurrence: number
  ) => {
    const resolvedAt = startedAt + definition.durationMinutes * minute
    if (resolvedAt > windowStart && startedAt < windowEnd) {
      incidents.push({
        ...definition,
        instanceId: `${definition.id}-${occurrence}`,
        startedAt,
        resolvedAt,
      })
    }
    return resolvedAt
  }

  for (const definition of definitions) {
    if (ids.has(definition.id)) {
      throw new Error(`Duplicate status incident ID: "${definition.id}"`)
    }
    ids.add(definition.id)

    if (
      !Number.isInteger(definition.durationMinutes)
      || definition.durationMinutes < 3
      || definition.durationMinutes > minutesPerDay
    ) {
      throw new RangeError(`Incident "${definition.id}" must last between 3 and 1440 minutes`)
    }
    if (
      definition.systemIds.length === 0
      || definition.systemIds.some((id) => !systemIds.has(id))
    ) {
      throw new Error(`Incident "${definition.id}" must reference known status components`)
    }
    if (definition.severity !== 'critical' && definition.severity !== 'degraded') {
      throw new RangeError(`Unknown incident severity: "${definition.severity}"`)
    }

    if (definition.scheduleGroup) {
      const weightedDuration =
        definition.durationMinutes * STATUS_AVAILABILITY_WEIGHTS[definition.severity]
      if (
        !definition.systemIds.includes(definition.scheduleGroup)
        || weightedDuration < 260
        || weightedDuration > 350
      ) {
        throw new RangeError(
          `Scheduled component incident "${definition.id}" requires its component and 260-350 weighted minutes`
        )
      }
      const group = groups.get(definition.scheduleGroup) ?? []
      group.push(definition)
      groups.set(definition.scheduleGroup, group)
      continue
    }

    const random = seededRandom(definition.id)
    let calendarDay = scheduleEpoch + Math.floor(random() * STATUS_WINDOW_DAYS)
    let occurrence = 0

    // The seed belongs to the incident, not the visit date, so past events never move.
    while (calendarDay * day < windowEnd) {
      const startMinute = Math.floor(
        random() * (minutesPerDay - definition.durationMinutes + 1)
      )
      const startedAt = calendarDay * day + startMinute * minute
      recordIncident(definition, startedAt, occurrence)

      // Leave room for time-of-day jitter and a full-day incident between 90-day windows.
      calendarDay += minimumGapDays + Math.floor(random() * 76)
      occurrence += 1
    }
  }

  for (const [groupId, group] of groups) {
    if (group.length < 3) {
      throw new RangeError(`Status component "${groupId}" needs at least three distinct incident types`)
    }

    const catalogue = [...group].sort((left, right) => left.id.localeCompare(right.id))
    const random = seededRandom(`component/${groupId}`)
    const lastResolution = new Map<string, number>()
    const occurrences = new Map<string, number>()
    let remaining = [...catalogue]
    let calendarDay = scheduleEpoch + Math.floor(random() * componentMinimumGapDays)

    while (calendarDay * day < windowEnd) {
      const eligible = remaining.filter((definition) => {
        const resolvedAt = lastResolution.get(definition.id)
        return resolvedAt === undefined || calendarDay * day - resolvedAt >= STATUS_WINDOW_DAYS * day
      })
      if (eligible.length === 0) {
        throw new Error(`Status component "${groupId}" exhausted its incident cooldowns`)
      }

      const definition = eligible[Math.floor(random() * eligible.length)]
      const startMinute = Math.floor(
        random() * (minutesPerDay - definition.durationMinutes + 1)
      )
      const startedAt = calendarDay * day + startMinute * minute
      const occurrence = occurrences.get(definition.id) ?? 0
      lastResolution.set(definition.id, recordIncident(definition, startedAt, occurrence))
      occurrences.set(definition.id, occurrence + 1)
      remaining = remaining.filter(({ id }) => id !== definition.id)
      if (remaining.length === 0) {
        remaining = [...catalogue]
      }

      // Every 90-day window contains one or two full/partial component events.
      // Their real weighted durations bound availability without clamping the result.
      calendarDay += componentMinimumGapDays + Math.floor(
        random() * (componentMaximumGapDays - componentMinimumGapDays + 1)
      )
    }
  }

  return incidents.sort((left, right) =>
    right.startedAt - left.startedAt || left.instanceId.localeCompare(right.instanceId)
  )
}

export function calculateAvailability(
  incidents: readonly AvailabilityInterval[],
  windowStart: number,
  windowEnd: number
): AvailabilityMetrics {
  if (
    !Number.isFinite(windowStart)
    || !Number.isFinite(windowEnd)
    || windowEnd <= windowStart
  ) {
    throw new RangeError('Availability requires a finite, positive observation window')
  }

  const events: { timestamp: number; severity: IncidentSeverity; change: 1 | -1 }[] = []

  for (const incident of incidents) {
    if (
      !Number.isFinite(incident.startedAt)
      || !Number.isFinite(incident.resolvedAt)
      || incident.resolvedAt <= incident.startedAt
    ) {
      throw new RangeError('Availability incidents require valid start and resolution times')
    }
    if (incident.severity !== 'critical' && incident.severity !== 'degraded') {
      throw new RangeError(`Unknown status incident severity: "${incident.severity}"`)
    }

    const startedAt = Math.max(incident.startedAt, windowStart)
    const resolvedAt = Math.min(incident.resolvedAt, windowEnd)
    if (resolvedAt <= startedAt) {
      continue
    }

    events.push(
      { timestamp: startedAt, severity: incident.severity, change: 1 },
      { timestamp: resolvedAt, severity: incident.severity, change: -1 }
    )
  }
  events.sort((left, right) => left.timestamp - right.timestamp)

  let criticalActive = 0
  let degradedActive = 0
  let criticalMinutes = 0
  let degradedMinutes = 0
  let previousTimestamp = windowStart
  let index = 0

  while (index < events.length) {
    const timestamp = events[index].timestamp
    const elapsedMinutes = (timestamp - previousTimestamp) / minute
    if (criticalActive > 0) {
      criticalMinutes += elapsedMinutes
    } else if (degradedActive > 0) {
      degradedMinutes += elapsedMinutes
    }

    while (index < events.length && events[index].timestamp === timestamp) {
      const event = events[index]
      if (event.severity === 'critical') {
        criticalActive += event.change
      } else {
        degradedActive += event.change
      }
      index += 1
    }
    previousTimestamp = timestamp
  }

  const observedMinutes = (windowEnd - windowStart) / minute
  const effectiveDowntimeMinutes = Math.min(
    observedMinutes,
    criticalMinutes * STATUS_AVAILABILITY_WEIGHTS.critical
    + degradedMinutes * STATUS_AVAILABILITY_WEIGHTS.degraded
  )

  return {
    observedMinutes,
    operationalMinutes: Math.max(0, observedMinutes - criticalMinutes - degradedMinutes),
    degradedMinutes,
    criticalMinutes,
    effectiveDowntimeMinutes,
    availabilityPercentage: (1 - effectiveDowntimeMinutes / observedMinutes) * 100,
  }
}

export function getIncidentUpdates(
  incident: ScheduledStatusIncident
): StatusIncidentUpdate[] {
  const identifiedMinute = Math.max(1, Math.floor(incident.durationMinutes / 3))
  const monitoringMinute = Math.min(
    incident.durationMinutes - 1,
    Math.max(identifiedMinute + 1, Math.floor(incident.durationMinutes * 0.8))
  )

  return [
    {
      id: 'investigating',
      label: 'Investigating',
      timestamp: incident.startedAt,
      message: incident.summary,
    },
    {
      id: 'identified',
      label: 'Identified',
      timestamp: incident.startedAt + identifiedMinute * minute,
      message: incident.cause,
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      timestamp: incident.startedAt + monitoringMinute * minute,
      message: incident.mitigation,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      timestamp: incident.resolvedAt,
      message: incident.resolution,
    },
  ]
}

function severityFromMetrics(metrics: AvailabilityMetrics): SystemSeverity {
  if (metrics.criticalMinutes > 0) {
    return 'critical'
  }
  return metrics.degradedMinutes > 0 ? 'degraded' : 'operational'
}

export function buildStatusSnapshot(referenceDate: Date): StatusSnapshot {
  const asOf = utcDayStart(referenceDate)
  const windowStart = asOf - STATUS_WINDOW_DAYS * day
  const windowEnd = asOf
  const incidents = getScheduledStatusIncidents(referenceDate)
  const systems = statusSystems.map((system) => {
    const componentIncidents = incidents.filter(({ systemIds }) => systemIds.includes(system.id))
    const days = Array.from({ length: STATUS_WINDOW_DAYS }, (_, index) => {
      const startedAt = windowStart + index * day
      const metrics = calculateAvailability(componentIncidents, startedAt, startedAt + day)
      return {
        date: new Date(startedAt).toISOString().slice(0, 10),
        severity: severityFromMetrics(metrics),
        metrics,
      }
    })

    return {
      ...system,
      metrics: calculateAvailability(componentIncidents, windowStart, windowEnd),
      days,
    }
  })
  const periods = Array.from({ length: 3 }, (_, index): StatusPeriod => {
    const endedAt = windowEnd - index * STATUS_WINDOW_DAYS * day
    const startedAt = endedAt - STATUS_WINDOW_DAYS * day
    const historicalIncidents = index === 0
      ? incidents
      : getScheduledStatusIncidents(new Date(endedAt))

    return {
      id: new Date(endedAt).toISOString().slice(0, 10),
      startedAt,
      endedAt,
      incidentCount: historicalIncidents.length,
      incidents: historicalIncidents,
      metrics: calculateAvailability(historicalIncidents, startedAt, endedAt),
    }
  })

  return {
    asOf,
    windowStart,
    windowEnd,
    overall: calculateAvailability(incidents, windowStart, windowEnd),
    systems,
    incidents,
    periods,
  }
}
