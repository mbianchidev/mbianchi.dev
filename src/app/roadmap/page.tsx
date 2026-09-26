import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Changelog — Matteo',
  description: 'Matteo’s work history across software, platforms, open source, products, speaking, and community work.',
  path: '/roadmap/',
})

const releases = [
  {
    year: '2026',
    title: 'KubeCon EU Amsterdam 2026',
    summary:
      'Speaking about ephemeral Kubernetes environments in Pull Request Wars: The Flux Awakens.',
    signal: 'KubeCon EU · public speaking',
    links: [
      {
        label: 'View the session',
        href: 'https://kccnceu2026.sched.com/event/2CW37/pull-request-wars-the-flux-awakens-ephemeral-kubernetes-environments-strike-back-matteo-bianchi-github-stefan-prodan-controlplane?iframe=no&w=100%&sidebar=yes&bg=no',
      },
    ],
  },
  {
    year: '2025',
    title: 'Kubernetes SIG Release contributor award',
    summary:
      'Received the 2025 contributor award for sustained work with Kubernetes SIG Release.',
    signal: 'Kubernetes · contributor recognition',
    links: [
      {
        label: 'Kubernetes contributor awards 2025',
        href: 'https://www.kubernetes.dev/community/awards/2025/#release',
      },
    ],
  },
  {
    year: '2025',
    title: 'Kubernetes v1.34',
    summary: 'Released Kubernetes v1.34 as Branch Manager Lead.',
    signal: 'Release engineering · branch management',
    links: [],
  },
  {
    year: '2025',
    title: 'Kubernetes v1.33',
    summary: 'Released Kubernetes v1.33 as Branch Manager.',
    signal: 'Release engineering · branch management',
    links: [],
  },
  {
    year: '2025',
    title: 'Release leadership and bigger stages',
    summary:
      'Worked in Kubernetes release communications leadership, spoke three times at KubeCon EU London, and reached a keynote-sized stage at KCD Denmark.',
    signal: 'Release work · public speaking',
    links: [],
  },
  {
    year: '2024–2025',
    title: 'Cloud-native recognition',
    summary:
      'Became a CNCF Ambassador, led communications for Kubernetes v1.32, and reviewed conference programmes in several regions.',
    signal: 'Verifiable ecosystem work',
    links: [
      {
        label: 'CNCF Ambassador badge',
        href: 'https://www.credly.com/badges/bc458baf-3bd8-4c38-a73e-21c68b259798/public_url',
      },
      {
        label: 'Kubernetes v1.32 communications',
        href: 'https://github.com/kubernetes/sig-release/issues/2586#issuecomment-2290160721',
      },
    ],
  },
  {
    year: '2024',
    title: 'Deeper into open source',
    summary:
      'Joined the Kubernetes v1.31 release team as a communications shadow and taught Cloud Native Technologies 101 at the University of Turin.',
    signal: 'Open source · education',
    links: [
      {
        label: 'Kubernetes organisation record',
        href: 'https://github.com/kubernetes/org/issues/4975',
      },
    ],
  },
  {
    year: '2023–2024',
    title: 'Built the startup version for real',
    summary:
      'Co-founded KubeLab, led the technical direction, built the first platform-engineering MVP, and managed a distributed engineering team.',
    signal: 'Founder mode · product delivery',
    links: [
      {
        label: 'KubeLab company history',
        href: 'https://www.linkedin.com/company/kubelab/',
      },
    ],
  },
  {
    year: '2021–2023',
    title: 'Infrastructure with human consequences',
    summary:
      'Built Azure infrastructure for computational pathology and machine-learning workflows supporting breast-cancer diagnosis research.',
    signal: 'Healthcare · cloud · machine learning',
    links: [
      {
        label: 'Project background',
        href: 'https://www.linkedin.com/pulse/kubelab-netherlands-cancer-institute-partner-around-ai-peter-comstock/?utm_source=rss&utm_campaign=articles_sitemaps&utm_medium=google_news',
      },
    ],
  },
  {
    year: '2019–now',
    title: 'Started writing the field manual in public',
    summary:
      'Started publishing what I learned from production through articles, talks, workshops, mentoring, and community work.',
    signal: 'Writing · teaching · community',
    links: [
      {
        label: 'Current field notes',
        href: '/blog',
      },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className={styles.page}>
      <PageHero
        path="/roadmap"
        title="Changelog, because careers are messy."
        description="Things I shipped, learned, broke, fixed, or talked about in public. Links included when they exist."
        tone="cyan"
        actions={
          <Link href="/portfolio" className={styles.darkButton}>
            Inspect the source
            <span aria-hidden="true">↗</span>
          </Link>
        }
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>First release</dt>
              <dd>2015</dd>
            </div>
            <div>
              <dt>Current channel</dt>
              <dd>Still shipping</dd>
            </div>
            <div>
              <dt>Breaking changes</dt>
              <dd>Usually intentional</dd>
            </div>
          </dl>
        }
      />

      <section className={styles.sectionDark} aria-labelledby="release-history">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="release-history">Release history.</h2>
            <p>Newest first. Receipts included when available.</p>
          </div>
          <ol className={styles.releaseList}>
            {releases.map((release) => (
              <li key={`${release.year}-${release.title}`} className={styles.release}>
                <div className={styles.releaseYear}>{release.year}</div>
                <div className={styles.releaseBody}>
                  <p>{release.signal}</p>
                  <h3>{release.title}</h3>
                  <p>{release.summary}</p>
                  {release.links.length > 0 && (
                    <div className={styles.releaseLinks}>
                      {release.links.map((link) =>
                        link.href.startsWith('http') ? (
                          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                            <span aria-hidden="true">↗</span>
                          </a>
                        ) : (
                          <Link key={link.label} href={link.href}>
                            {link.label}
                            <span aria-hidden="true">↗</span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
