import Link from 'next/link'
import styles from '@/app/home.module.css'

const capabilities = [
  {
    key: 'platform.core',
    title: 'Platform engineers and users do not need to fight',
    description:
      'Built software and automation across the SDLC. Designed and maintained reliable, scalable infrastructure and production APIs.',
    evidence: 'See the roadmap',
    href: 'https://github.com/mbianchidev/platform-engineering-roadmap'
  },
  {
    key: 'solutions.interface',
    title: 'Customer calls that end in issues solved and ARR added',
    description:
      'Ran discovery, designed architecture, built tailored demos, helped with implementation, and sent product feedback people could act on. Exceeded quota at GitHub and earned President’s Club.',
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
      'Maintained Kubernetes release tooling, improved processes, sent too many pull requests upstream, delivered conference talks, taught technical audiences, advised companies on open source, and mentored engineers.',
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