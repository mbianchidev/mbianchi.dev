import Link from 'next/link'
import styles from '@/app/home.module.css'

const capabilities = [
  {
    key: 'platform.core',
    title: 'Platform engineers and users do not need to fight',
    description:
      'Built software and automation around SDLC for over a decade. Designed and maintained reliable and scalable infra, plus APIs used by millions of users daily.',
    evidence: 'See the roadmap',
    href: 'https://github.com/mbianchidev/platform-engineering-roadmap'
  },
  {
    key: 'solutions.interface',
    title: 'Customer calls that end in issues solved and ARR added',
    description:
      'Ran discovery, designed architecture, built tailored demos, helped with implementation, and sent product feedback people could act on. Reached 185% quota at GitHub and won Club FY26.',
    evidence: 'See the work history',
    href: '/customers'
  },
  {
    key: 'ai.automation',
    title: 'AI for boring work, not fake magic',
    description:
      'Built agentic systems and internal tooling for jobs people already do, while keeping data secure.',
    evidence: 'See the software work',
    href: '/portfolio'
  },
  {
    key: 'open.protocol',
    title: 'Open source and an unreasonable amount of explaining',
    description:
      'Maintained Kubernetes release tooling, improved processes, sent too many pull requests upstream, delivered conference talks, taught over 3,000 people, advised companies on open source, and mentored tens of engineers.',
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
          We still do all four.
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