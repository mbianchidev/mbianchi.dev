import type { ReactNode } from 'react'
import styles from '@/app/inner.module.css'

type HeroTone = 'dark' | 'cyan' | 'green' | 'light'

interface PageHeroProps {
  path?: string
  title: string
  description: ReactNode
  tone?: HeroTone
  actions?: ReactNode
  aside?: ReactNode
}

const toneClasses: Record<HeroTone, string> = {
  dark: styles.heroDark,
  cyan: styles.heroCyan,
  green: styles.heroGreen,
  light: styles.heroLight,
}

export function PageHero({
  path,
  title,
  description,
  tone = 'dark',
  actions,
  aside,
}: PageHeroProps) {
  return (
    <section className={`${styles.hero} ${toneClasses[tone]}`} aria-labelledby="page-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          {path && <p className={styles.routePath}>{path}</p>}
          <h1 id="page-title">{title}</h1>
          <p className={styles.heroDescription}>{description}</p>
          {actions && <div className={styles.heroActions}>{actions}</div>}
        </div>
        {aside && <aside className={styles.heroAside}>{aside}</aside>}
      </div>
    </section>
  )
}
