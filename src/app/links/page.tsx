import type { Metadata } from 'next'
import { ResponsivePortrait } from '@/components/ResponsivePortrait'
import { linksPageConfig, type PublicLinkIcon } from '@/data/links'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from './links.module.css'

export const metadata: Metadata = createPageMetadata({
  title: 'Links — Matteo',
  description:
    'Matteo Bianchi’s mentoring, videos, and open-source work in one place.',
  path: '/links/',
})

function LinkIcon({ icon }: { icon: PublicLinkIcon }) {
  if (icon === 'mentor') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 11.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
        <path d="M3.75 19.25v-1.5a4.75 4.75 0 0 1 9.5 0v1.5" />
        <path d="M15.5 7.25h4.75v4.5H18l-2.5 2v-6.5Z" />
      </svg>
    )
  }

  if (icon === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.75" y="5.25" width="18.5" height="13.5" rx="4" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.75a9.5 9.5 0 0 0-3 18.51c.48.09.65-.2.65-.46v-1.84c-2.67.58-3.23-1.13-3.23-1.13-.44-1.11-1.07-1.4-1.07-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.46 2.25 1.04 2.8.8.09-.62.34-1.04.61-1.28-2.13-.24-4.37-1.07-4.37-4.74 0-1.05.37-1.9.99-2.58-.1-.24-.43-1.22.09-2.54 0 0 .8-.26 2.64.98A9.15 9.15 0 0 1 12 7.15c.82 0 1.63.11 2.4.32 1.82-1.24 2.63-.98 2.63-.98.52 1.32.19 2.3.09 2.54.61.68.98 1.53.98 2.58 0 3.68-2.24 4.5-4.38 4.74.35.3.65.88.65 1.77v2.68c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.75Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

export default function LinksPage() {
  return (
    <div className={styles.page}>
      <section className={styles.stage} aria-label="Public links">
        <div className={styles.shell}>
          <div className={styles.profile}>
            <div className={styles.avatarFrame}>
              <ResponsivePortrait
                alt="Matteo Bianchi speaking at KCD Denmark"
                className={styles.avatar}
                priority
                sizes="112px"
              />
              <span className={styles.onlineIndicator} aria-hidden="true" />
            </div>
            <h1>{linksPageConfig.handle}</h1>
            <p className={styles.availability}>
              <span aria-hidden="true" />
              Public interface online
            </p>
            <p className={styles.description}>{linksPageConfig.description}</p>
          </div>

          <div className={styles.manifestHeader}>
            <span>Links that actually go somewhere</span>
            <span>{linksPageConfig.links.length} routes online</span>
          </div>

          <ul className={styles.linkList}>
            {linksPageConfig.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRow}
                >
                  <span className={styles.icon}>
                    <LinkIcon icon={link.icon} />
                  </span>
                  <span className={styles.linkCopy}>
                    <span className={styles.service}>{link.service}</span>
                    <strong>{link.title}</strong>
                    <span>{link.description}</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
