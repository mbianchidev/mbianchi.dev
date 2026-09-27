import Link from 'next/link'
import { PageHero } from './PageHero'
import styles from '@/app/inner.module.css'

type Props = {
  page: 'Documentation' | 'Press' | 'Support'
}

const pageContent = {
  Documentation: {
    path: '/documentation',
    title: 'The docs are scattered. Very enterprise.',
    description:
      'There is no single manual yet. The useful bits already live in source, field notes, and the platform roadmap.',
    tone: 'cyan' as const,
    status: 'Documentation status: useful, scattered, not finished',
    links: [
      { label: 'Read the field notes', href: '/blog', detail: 'Cloud-native guides, opinions, and lessons from production.' },
      { label: 'Browse the source', href: 'https://github.com/mbianchidev', detail: 'Repositories, tools, experiments, and implementation details.' },
      { label: 'Open the changelog', href: '/roadmap', detail: 'Work history, milestones, and links that back it up.' },
    ],
  },
  Press: {
    path: '/press',
    title: 'For press, podcasts, and brave conference organizers.',
    description:
      'Speaker material, public sessions, and a direct human contact. No downloadable stock photo of people pointing at glass.',
    tone: 'green' as const,
    status: 'Media status: available, opinionated, usually responsive',
    links: [
      { label: 'Sessionize profile', href: 'https://sessionize.com/mbianchidev/', detail: 'Talks, sessions, and event history.' },
      { label: 'Speaker Deck', href: 'https://speakerdeck.com/mbianchidev', detail: 'Slides from cloud-native and platform talks.' },
      { label: 'Contact Matteo', href: 'mailto:info@mb-consulting.dev', detail: 'Interviews, quotes, podcasts, and events.' },
    ],
  },
  Support: {
    path: '/support',
    title: 'Human support. No chatbot escalation tree.',
    description:
      'Pick the channel that matches the problem. Bug report, private question, or a call with an actual person.',
    tone: 'light' as const,
    status: 'Support SLA: probably faster than enterprise procurement',
    links: [
      { label: 'Open a GitHub issue', href: 'https://github.com/mbianchidev/mbianchi.dev/issues', detail: 'Bugs and concrete repository feedback.' },
      { label: 'Send an email', href: 'mailto:info@mb-consulting.dev', detail: 'Questions that should not become public issues.' },
      { label: 'Book a conversation', href: 'https://cal.com/mbianchidev/intro', detail: 'Architecture, hiring, advisory, or collaboration.' },
    ],
  },
}

export function WorkInProgress({ page }: Props) {
  const content = pageContent[page]

  return (
    <div className={styles.page}>
      <PageHero
        path={content.path}
        title={content.title}
        description={content.description}
        tone={content.tone}
        aside={
          <div className={styles.statusPanel}>
            <span className={styles.statusLight} aria-hidden="true" />
            <p>{content.status}</p>
          </div>
        }
      />
      <section className={styles.resourceSection} aria-labelledby={`${page.toLowerCase()}-resources`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id={`${page.toLowerCase()}-resources`}>Useful links while I finish this page.</h2>
            <p>They all work. Low bar, apparently.</p>
          </div>
          <div className={styles.resourceGrid}>
            {content.links.map((link) => {
              const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto:')
              const body = (
                <>
                  <strong>{link.label}</strong>
                  <span>{link.detail}</span>
                  <span aria-hidden="true">↗</span>
                </>
              )

              return isExternal ? (
                <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  {body}
                </a>
              ) : (
                <Link key={link.label} href={link.href}>
                  {body}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
