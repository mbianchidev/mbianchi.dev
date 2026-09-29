import Link from 'next/link'
import styles from '@/app/home.module.css'

const capabilities = [
  {
    key: 'platform.core',
    title: 'Platform engineers and users do not need to fight',
    description:
      "We built software and automation around SDLC for over a decade. We've designed, built and maintained reliable and scalable infra and APIs used by millions of users every day.",
    signal: 'Platform Engineering · Site Reliability · Kubernetes',
    evidence: 'See the roadmap',
    href: 'https://github.com/mbianchidev/platform-engineering-roadmap'
  },
  {
    key: 'solutions.interface',
    title: 'Customer calls that end in issues solved and ARR added',
    description:
      'I run discovery, design the architecture, build the tailored demo, help with implementation, and send product feedback people can act on. I reached 185% quota at GitHub and won Club FY26.',
    signal: 'Solutions Engineering · Enablement · GTM · Product',
    evidence: 'See the work history',
    href: '/customers'
  },
  {
    key: 'ai.automation',
    title: 'AI for boring work, not fake magic',
    description:
      'I build agentic systems and internal tooling for jobs people already do. While keeping data secure.',
    signal: 'LLMs · MCPs · Agent SDKs · Evals',
    evidence: 'See the software work',
    href: '/portfolio'
  },
  {
    key: 'open.protocol',
    title: 'Open source and an unreasonable amount of explaining',
    description:
      'I maintained Kubernetes release tooling, improved processes, sent too many pull requests upstream, gave conference talks, taught to over 3000 people, advised companies on open source and mentored tens of engineers.',
    signal: 'DevRel · OSS strategy · Speaking · Education',
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