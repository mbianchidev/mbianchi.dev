import Link from 'next/link'
import styles from '@/app/home.module.css'

const capabilities = [
  {
    key: 'platform.core',
    title: 'Developer platforms engineers actually use',
    description:
      'Built platform APIs and zero-touch onboarding for 70+ engineers. Earlier, helped run infrastructure and APIs used by 10M+ people every day.',
    signal: 'Platform engineering · Kubernetes · multi-cloud · SRE',
    evidence: 'See the roadmap',
    href: 'https://github.com/mbianchidev/platform-engineering-roadmap'
  },
  {
    key: 'solutions.interface',
    title: 'Customer conversations that end in working software',
    description:
      'Runs discovery, designs the architecture, builds the demo, guides implementation, and sends useful feedback to product. Reached 180% quota at GitHub and won Club FY26.',
    signal: 'Solutions engineering · discovery · GTM · product feedback',
    evidence: 'See the work history',
    href: '/customers'
  },
  {
    key: 'ai.automation',
    title: 'AI for work people are tired of doing',
    description:
      'Builds agents and internal tools for real workflows. One assistant removed 20–25% of recurring Solutions Engineering work.',
    signal: 'Python · TypeScript · MCP · agents · developer tooling',
    evidence: 'See the software work',
    href: '/portfolio'
  },
  {
    key: 'open.protocol',
    title: 'Open source, talks, and teaching',
    description:
      'Kubernetes release engineering maintainer with 40+ merged upstream pull requests, 20+ talks, 500+ learners, and 20+ mentees. Still rated 5/5, somehow.',
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
        <h2 id="capabilities-title">Four jobs that somehow fit in one human.</h2>
        <p>
          The startup framing is a joke. The work is very real.
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