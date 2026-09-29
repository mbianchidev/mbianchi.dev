import Link from 'next/link'
import styles from '@/app/home.module.css'

const capabilities = [
  {
    key: 'platform.core',
    title: 'Platforms developers do not need to fight',
    description:
      'I built platform APIs and zero-touch onboarding for 70+ engineers. Before that, I helped run infrastructure and APIs used by 10M+ people every day.',
    signal: 'Platform engineering · Kubernetes · multi-cloud · SRE',
    evidence: 'See the roadmap',
    href: 'https://github.com/mbianchidev/platform-engineering-roadmap'
  },
  {
    key: 'solutions.interface',
    title: 'Customer calls that end in working software',
    description:
      'I run discovery, design the architecture, build the demo, help with implementation, and send product feedback people can act on. I reached 185% quota at GitHub and won Club FY26.',
    signal: 'Solutions engineering · discovery · GTM · product feedback',
    evidence: 'See the work history',
    href: '/customers'
  },
  {
    key: 'ai.automation',
    title: 'AI for boring work, not fake magic',
    description:
      'I build agents and internal tools for jobs people already do. One assistant removed 20–25% of recurring Solutions Engineering work.',
    signal: 'Python · TypeScript · MCP · agents · developer tooling',
    evidence: 'See the software work',
    href: '/portfolio'
  },
  {
    key: 'open.protocol',
    title: 'Open source and an unreasonable amount of explaining',
    description:
      'I maintain Kubernetes release tooling, sent 40+ pull requests upstream, gave 20+ talks, taught 500+ people, and mentored 20+. Apparently the mentoring works too: 5/5.',
    signal: 'Kubernetes · OSS strategy · speaking · education',
    evidence: 'See the community work',
    href: '/about#community'
  }
]

export function Capabilities() {
  return (
    <section id="features" className={styles.capabilities} aria-labelledby="capabilities-title">
      <div className={styles.sectionHeader}>
        <p className={styles.sectionCode}>matteo.features()</p>
        <h2 id="capabilities-title">Never been good at staying in one lane.</h2>
        <p>
          Recruiters and some managers hate this.
          <br />
          I still do all four.
        </p>
      </div>

      <div className={styles.capabilityManifest}>
        {capabilities.map((capability) => (
          <article key={capability.key} className={styles.capabilityRow}>
            <code>{capability.key}</code>
            <div className={styles.capabilityCopy}>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </div>
            <div className={styles.capabilityMeta}>
              <span>{capability.signal}</span>
              {capability.href.startsWith('http') ? (
                <a href={capability.href} target="_blank" rel="noopener noreferrer">
                  {capability.evidence}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link href={capability.href}>
                  {capability.evidence}
                  <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}