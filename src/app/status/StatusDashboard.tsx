'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import {
  statusProbeMessages,
  statusSystems,
} from '@/data/status'
import {
  buildStatusSnapshot,
  getIncidentUpdates,
  STATUS_AVAILABILITY_WEIGHTS,
  STATUS_WINDOW_DAYS,
  type StatusSnapshot,
} from '@/lib/status'
import styles from '@/app/inner.module.css'
import { StatusTimeline } from './StatusTimeline'
import { dateFormatter, isoDate, minutes, percentage, severityLabels, timeFormatter } from './statusFormatting'

const day = 24 * 60 * 60_000

interface StatusDashboardProps {
  initialSnapshot: StatusSnapshot
}

export function StatusDashboard({ initialSnapshot }: StatusDashboardProps) {
  const historyControlId = useId()
  const historyRef = useRef<HTMLDetailsElement>(null)
  const [snapshot, setSnapshot] = useState(initialSnapshot)
  const [probeIndex, setProbeIndex] = useState(0)
  const [historyIndex, setHistoryIndex] = useState(0)
  const historyPeriod = snapshot.periods[historyIndex]

  useEffect(() => {
    let interval: number | undefined
    const refresh = () => {
      const now = new Date()
      const asOf = Math.floor(now.getTime() / day) * day
      setSnapshot((previous) =>
        previous.asOf === asOf ? previous : buildStatusSnapshot(now)
      )
    }
    const syncVisibility = () => {
      if (interval !== undefined) {
        window.clearInterval(interval)
        interval = undefined
      }
      if (!document.hidden) {
        refresh()
        interval = window.setInterval(refresh, 60_000)
      }
    }

    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval)
      }
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  return (
    <div
      className={`${styles.page} ${styles.statusPage}`}
      data-status-reference-date={isoDate(snapshot.asOf)}
    >
      <section className={styles.statusHero} aria-labelledby="page-title">
        <div className={styles.statusContainer}>
          <div className={styles.statusTopline}>
            <p className={styles.statusRoute}>/status / human-runtime</p>
            <a
              href="https://github.com/mbianchidev/mbianchi.dev/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.statusIssueLink}
            >
              Report an issue
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.statusHeroCopy}>
            <p>Matteo / Human Platform</p>
            <h1 id="page-title">Service status</h1>
          </div>

          <div className={styles.overallStatus} data-status-overall role="status">
            <span className={styles.overallStatusIcon} aria-hidden="true">✓</span>
            <div>
              <h2>Everything works. Even the human.</h2>
              <p>No active incidents. The history below is less impressive.</p>
            </div>
            <strong>
              <span aria-hidden="true" />
              Operational
            </strong>
          </div>

          <dl className={styles.statusSummary} data-status-summary>
            <div>
              <dt>{STATUS_WINDOW_DAYS}-day availability</dt>
              <dd data-status-availability>
                {percentage(snapshot.overall.availabilityPercentage)}
              </dd>
            </div>
            <div>
              <dt>Historical incidents</dt>
              <dd>{snapshot.incidents.length}</dd>
            </div>
            <div>
              <dt>As of 00:00 UTC</dt>
              <dd>
                <time dateTime={isoDate(snapshot.asOf)}>
                  {dateFormatter.format(snapshot.asOf)}
                </time>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className={styles.statusContent}>
        <section className={styles.statusSection} aria-labelledby="systems-title">
          <div className={styles.statusSectionHeader}>
            <div>
              <h2 id="systems-title">Components</h2>
              <p>
                The preceding {STATUS_WINDOW_DAYS} complete UTC days.
                Degraded and critical time are weighted differently.
              </p>
            </div>
            <a href="#availability-methodology">How the maths works</a>
          </div>
          <div className={styles.statusBoard}>
            {snapshot.systems.map((system) => (
              <article
                key={system.id}
                className={styles.statusRow}
                data-status-component={system.id}
              >
                <div className={styles.statusComponentHeader}>
                  <div>
                    <h3>{system.name}</h3>
                    <p>{system.detail}</p>
                  </div>
                  <span className={styles.statusComponentState}>
                    <span aria-hidden="true" />
                    Operational
                  </span>
                </div>
                <StatusTimeline system={system} incidents={snapshot.incidents} />
                <div className={styles.statusTimelineMeta}>
                  <time dateTime={isoDate(snapshot.windowStart)}>
                    {dateFormatter.format(snapshot.windowStart)}
                  </time>
                  <strong data-component-availability>
                    {percentage(system.metrics.availabilityPercentage)} availability
                  </strong>
                  <time dateTime={isoDate(snapshot.windowEnd - day)}>
                    {dateFormatter.format(snapshot.windowEnd - day)}
                  </time>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.statusLegend} aria-label="Uptime history legend">
            {(['operational', 'degraded', 'critical'] as const).map((severity) => (
              <span key={severity}>
                <span
                  className={styles.uptimeBar}
                  data-severity={severity}
                  aria-hidden="true"
                />
                {severityLabels[severity]}
              </span>
            ))}
          </div>
          <div className={styles.statusDiagnostics}>
            <button
              type="button"
              className={styles.secondaryButton}
              data-status-probe
              onClick={() => setProbeIndex((previous) =>
                (previous + 1) % statusProbeMessages.length
              )}
            >
              Run human checks
            </button>
            <output
              data-status-probe-result
              data-probe-step={probeIndex}
              aria-live="polite"
            >
              {statusProbeMessages[probeIndex]}
            </output>
          </div>
        </section>

        <section
          className={styles.statusSection}
          aria-labelledby="availability-history-title"
        >
          <div className={styles.statusSectionHeader}>
            <div>
              <h2 id="availability-history-title">Historical availability</h2>
              <p>The numbers come from the incident durations. Open a period to inspect them.</p>
            </div>
          </div>
          <div
            className={styles.availabilityTableScroll}
            role="region"
            aria-label="Historical availability table"
            tabIndex={0}
          >
            <table className={styles.availabilityTable} data-status-history-table>
              <caption>
                Three complete {STATUS_WINDOW_DAYS}-day periods, newest first.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Period</th>
                  <th scope="col">Incidents</th>
                  <th scope="col">Critical</th>
                  <th scope="col">Degraded</th>
                  <th scope="col">Counted downtime</th>
                  <th scope="col">Availability</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.periods.map((period, index) => (
                  <tr key={period.id} data-status-period={period.id}>
                    <th scope="row">
                      <time dateTime={isoDate(period.startedAt)}>
                        {dateFormatter.format(period.startedAt)}
                      </time>
                      <span>
                        through {dateFormatter.format(period.endedAt - 1)}
                      </span>
                    </th>
                    <td>
                      <a
                        href="#incidents-title"
                        onClick={() => {
                          setHistoryIndex(index)
                          if (historyRef.current) {
                            historyRef.current.open = true
                          }
                        }}
                        aria-label={`Inspect ${period.incidentCount} incidents from ${dateFormatter.format(period.startedAt)} through ${dateFormatter.format(period.endedAt - 1)}`}
                      >
                        {period.incidentCount}
                      </a>
                    </td>
                    <td>{minutes(period.metrics.criticalMinutes)}</td>
                    <td>{minutes(period.metrics.degradedMinutes)}</td>
                    <td>{minutes(period.metrics.effectiveDowntimeMinutes)}</td>
                    <td data-period-availability>
                      {percentage(period.metrics.availabilityPercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Current {STATUS_WINDOW_DAYS}-day window</th>
                  <td>{snapshot.incidents.length}</td>
                  <td>{minutes(snapshot.overall.criticalMinutes)}</td>
                  <td>{minutes(snapshot.overall.degradedMinutes)}</td>
                  <td>{minutes(snapshot.overall.effectiveDowntimeMinutes)}</td>
                  <td>{percentage(snapshot.overall.availabilityPercentage)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <details
          ref={historyRef}
          data-status-history
          className={`${styles.statusSection} ${styles.statusHistorySection}`}
          aria-labelledby="incidents-title"
        >
          <summary className={`${styles.statusSectionHeader} ${styles.statusHistorySummary}`}>
            <div>
              <h2 id="incidents-title">Incident history</h2>
              <p>What broke, why it broke, and what I actually did about it.</p>
            </div>
            <span className={styles.incidentToggle} aria-hidden="true" />
          </summary>
          <div className={styles.statusHistoryControls}>
            <div className={styles.statusPeriodControl}>
              <label htmlFor={historyControlId}>Incident history period</label>
              <select
                id={historyControlId}
                value={historyIndex}
                onChange={(event) => setHistoryIndex(Number(event.target.value))}
              >
                {snapshot.periods.map((period, index) => (
                  <option key={index} value={index}>
                    {dateFormatter.format(period.startedAt)} to{' '}
                    {dateFormatter.format(period.endedAt - 1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {historyPeriod.incidents.length === 0 && (
            <div className={styles.statusNoIncidents}>
              <span aria-hidden="true">✓</span>
              <div>
                <strong>Nothing broke in this window.</strong>
                <p>I am enjoying the lack of material for this section.</p>
              </div>
            </div>
          )}
          {historyPeriod.incidents.map((incident) => (
            <div className={styles.incidentDay} key={incident.instanceId}>
              <time dateTime={isoDate(incident.startedAt)}>
                {dateFormatter.format(incident.startedAt)}
              </time>
              <article
                className={styles.incident}
                data-status-incident={incident.id}
                data-incident-instance={incident.instanceId}
                data-incident-severity={incident.severity}
              >
                <details>
                  <summary className={styles.incidentHeader}>
                    <div>
                      <p>
                        Resolved <span aria-hidden="true">/</span>{' '}
                        <span
                          className={styles.incidentSeverity}
                          data-severity={incident.severity}
                        >
                          {severityLabels[incident.severity]}
                        </span>
                      </p>
                      <h3>{incident.title}</h3>
                    </div>
                    <span className={styles.incidentToggle} aria-hidden="true" />
                  </summary>
                  <dl className={styles.incidentMeta} data-incident-breakdown>
                    <div>
                      <dt>Duration</dt>
                      <dd>
                        <time dateTime={`PT${incident.durationMinutes}M`}>
                          {minutes(incident.durationMinutes)}
                        </time>
                      </dd>
                    </div>
                    <div>
                      <dt>Downtime weight</dt>
                      <dd>
                        {STATUS_AVAILABILITY_WEIGHTS[incident.severity] * 100}%
                      </dd>
                    </div>
                    <div>
                      <dt>Weighted duration</dt>
                      <dd>
                        {minutes(
                          incident.durationMinutes * STATUS_AVAILABILITY_WEIGHTS[incident.severity]
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Components</dt>
                      <dd>
                        {statusSystems
                          .filter(({ id }) => incident.systemIds.includes(id))
                          .map(({ name }) => name)
                          .join(', ')}
                      </dd>
                    </div>
                  </dl>
                  <div className={styles.incidentImpact}>
                    <h4>Impact</h4>
                    <p>{incident.impact}</p>
                  </div>
                  <ol className={styles.incidentUpdates}>
                    {getIncidentUpdates(incident).map((update) => (
                      <li key={update.id} data-incident-update={update.id}>
                        <time dateTime={new Date(update.timestamp).toISOString()}>
                          {timeFormatter.format(update.timestamp)} UTC
                        </time>
                        <div>
                          <strong>{update.label}</strong>
                          <p>{update.message}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className={styles.incidentFollowUp}>
                    <h4>Next time</h4>
                    <p>{incident.followUp}</p>
                    {incident.relatedLink && (
                      <Link href={incident.relatedLink.href}>
                        {incident.relatedLink.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </details>
              </article>
            </div>
          ))}
        </details>

        <aside
          id="availability-methodology"
          className={styles.statusMethodology}
          data-availability-policy
          data-degraded-weight={STATUS_AVAILABILITY_WEIGHTS.degraded}
          data-critical-weight={STATUS_AVAILABILITY_WEIGHTS.critical}
        >
          <h2>How the maths works</h2>
          <p>
            Degraded minutes count as {STATUS_AVAILABILITY_WEIGHTS.degraded * 100}% downtime.
            Critical minutes count as {STATUS_AVAILABILITY_WEIGHTS.critical * 100}% downtime.
            Overlapping incidents use the worst severity, so the same minute is never counted twice.
            Overall availability considers incidents across all components.
          </p>
          <code tabIndex={0}>100 * (1 - effectiveDowntimeMinutes / observedMinutes)</code>
          <p>
            Each incident shows its own weighted duration. Historical and overall totals merge overlaps
            and clip them to the observed period.
          </p>
          <p>
            This is fiction, not real outage telemetry. Dates follow a seeded calendar and stay fixed
            as the {STATUS_WINDOW_DAYS}-day window moves. The page refreshes at midnight UTC.
            The human still needs breaks.
          </p>
        </aside>
      </div>
    </div>
  )
}
