import Link from 'next/link'
import styles from '@/app/home.module.css'

const issues = [
  {
    title: 'Job-title leakage',
    description:
      'May move from a customer call to architecture to implementation without requesting a handoff meeting.'
  },
  {
    title: 'Automation reflex',
    description:
      'If I do the same thing twice, the third attempt may be a script, agent, or internal tool.'
  },
  {
    title: 'Will explain everything',
    description:
      'Documentation, a talk, or an upstream pull request may appear after the work is done.'
  }
]

export function KnownIssues() {
  return (
    <section id="contact" className={styles.knownIssues} aria-labelledby="known-issues-title">
      <div className={styles.knownIssuesLead}>
        <p>Release notes / before somebody asks in an interview</p>
        <h2 id="known-issues-title">Known issues. I can live with them.</h2>
      </div>
      <ul className={styles.issueList}>
        {issues.map((issue) => (
          <li key={issue.title}>
            <strong>{issue.title}</strong>
            <span>{issue.description}</span>
          </li>
        ))}
      </ul>
      <div className={styles.closingActions}>
        <a
          href="https://cal.com/mbianchidev/intro"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.darkAction}
        >
          Start trial
          <span aria-hidden="true">↗</span>
        </a>
        <Link href="/roadmap" className={styles.inkAction}>
          See changelog
        </Link>
      </div>
      <p className={styles.responseSla}>Looking for full-time. Taking selective consulting work.</p>
    </section>
  )
}
