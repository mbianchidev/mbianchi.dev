import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Status — Matteo',
  description: 'A completely serious status page for Matteo Bianchi.',
  path: '/status/',
})

const systems = [
  {
    name: 'Human runtime',
    detail: 'Engineering, judgment, and remembering to take breaks',
    uptime: '99.99%',
    incidentDays: [71],
  },
  {
    name: 'Platform interface',
    detail: 'Cloud native, platforms, and developer experience',
    uptime: '100.00%',
    incidentDays: [],
  },
  {
    name: 'Open-source uplink',
    detail: 'Repositories, upstream pull requests, and community work',
    uptime: '100.00%',
    incidentDays: [],
  },
  {
    name: 'Broadcast subsystem',
    detail: 'Talks, articles, workshops, and too many explanations',
    uptime: '100.00%',
    incidentDays: [],
  },
]

const uptimeWindow = Array.from({ length: 90 }, (_, index) => index)

export default function StatusPage() {
  return (
    <div className={`${styles.page} ${styles.statusPage}`}>
      <section className={styles.statusHero} aria-labelledby="page-title">
        <div className={styles.statusContainer}>
          <div className={styles.statusTopline}>
            <p className={styles.statusRoute}>/status / production</p>
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
            <p>
              Current availability and 90 days of suspiciously precise uptime
              data for one human.
            </p>
          </div>

          <div className={styles.overallStatus} role="status">
            <span className={styles.overallStatusIcon} aria-hidden="true">✓</span>
            <div>
              <h2>Everything works. Even the human.</h2>
              <p>No active incidents or scheduled maintenance.</p>
            </div>
            <strong>
              <span aria-hidden="true" />
              Operational
            </strong>
          </div>

          <dl className={styles.statusSummary}>
            <div>
              <dt>90-day uptime</dt>
              <dd>99.99%</dd>
            </div>
            <div>
              <dt>Active incidents</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>Planned maintenance</dt>
              <dd>None</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className={styles.statusContent}>
        <section className={styles.statusSection} aria-labelledby="systems-title">
          <div className={styles.statusSectionHeader}>
            <div>
              <h2 id="systems-title">Components</h2>
              <p>Availability across the last 90 days.</p>
            </div>
            <span>Current status</span>
          </div>
          <div className={styles.statusBoard}>
            {systems.map((system) => (
              <article key={system.name} className={styles.statusRow}>
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
                <div
                  className={styles.uptimeTrack}
                  role="img"
                  aria-label={`${system.name}: ${system.uptime} uptime over the last 90 days`}
                >
                  {uptimeWindow.map((day) => (
                    <span
                      key={day}
                      data-uptime-day
                      className={`${styles.uptimeBar} ${
                        system.incidentDays.includes(day) ? styles.uptimeBarIncident : ''
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className={styles.statusTimelineMeta}>
                  <span>90 days ago</span>
                  <strong>{system.uptime} uptime</strong>
                  <span>Today</span>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.statusLegend} aria-label="Uptime history legend">
            <span>
              <span className={styles.uptimeBar} aria-hidden="true" />
              Operational
            </span>
            <span>
              <span className={styles.uptimeBarIncident} aria-hidden="true" />
              Maintenance
            </span>
          </div>
        </section>

        <section className={styles.statusSection} aria-labelledby="incidents-title">
          <div className={styles.statusSectionHeader}>
            <div>
              <h2 id="incidents-title">Incident history</h2>
              <p>Timestamped updates for interruptions and maintenance.</p>
            </div>
            <span>Past 30 days</span>
          </div>

          <div className={styles.statusNoIncidents}>
            <span aria-hidden="true">✓</span>
            <div>
              <strong>No active incidents reported.</strong>
              <p>All monitored components are operating normally.</p>
            </div>
          </div>

          <div className={styles.incidentDay}>
            <time dateTime="2026-07-18">July 18, 2026</time>
            <article className={styles.incident}>
              <div className={styles.incidentHeader}>
                <div>
                  <p>Resolved incident</p>
                  <h3>Scheduled personal maintenance</h3>
                </div>
                <span>Resolved</span>
              </div>
              <div className={styles.incidentMeta}>
                <time dateTime="PT3M">3 minutes - PTO</time>
                <span>Human runtime</span>
              </div>
              <ol className={styles.incidentUpdates}>
                <li>
                  <time dateTime="2026-07-18T14:03:00+02:00">14:03 CEST</time>
                  <div>
                    <strong>Resolved</strong>
                    <p>Break completed. Full availability restored.</p>
                  </div>
                </li>
                <li>
                  <time dateTime="2026-07-18T14:02:00+02:00">14:02 CEST</time>
                  <div>
                    <strong>Monitoring</strong>
                    <p>Work resumed while coffee and basic health checks completed.</p>
                  </div>
                </li>
                <li>
                  <time dateTime="2026-07-18T14:00:00+02:00">14:00 CEST</time>
                  <div>
                    <strong>Identified</strong>
                    <p>Work paused for three scheduled minutes of personal maintenance.</p>
                  </div>
                </li>
              </ol>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}
