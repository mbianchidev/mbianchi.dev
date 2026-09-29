import styles from '@/app/home.module.css'
import { profilePortrait } from '@/lib/siteConfig'
import { ReleaseBadge } from './ReleaseBadge'
import { ResponsivePortrait } from './ResponsivePortrait'

export function Hero() {
  const now = new Date()
  const initialVersion = `${now.getUTCFullYear()}.${now.getUTCMonth() + 1}`

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <ReleaseBadge
            className={styles.releaseBadge}
            initialVersion={initialVersion}
          />
          <h1 id="hero-title" className={styles.heroTitle}>
            Platform as a Human
          </h1>
          <p className={styles.heroText}>
            <span>
              <strong>Build</strong> platforms and <strong>run</strong> software in the cloud.
            </span>
            <span>
              <strong>Acquire</strong> new customers and <strong>retain</strong> existing ones with ease.
            </span>
            <span>
              <strong>Automate</strong> the boring work.
            </span>
            <span className={styles.heroTextBreak}>
              Get a <strong>blog</strong>, <strong>talk</strong> and <strong>video</strong> about your tech.
            </span>
            <span className={styles.heroTextCallout}>Deploy Matteo today!</span>
          </p>
          <div className={styles.heroActions}>
            <a
              href="https://cal.com/mbianchidev/intro"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryAction}
            >
              Start trial
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#compatibility" className={styles.secondaryAction}>
              Run compatibility check
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className={styles.heroFinePrint}>
            Looking for a full-time role. Always available for consulting and advisory work.
          </p>
        </div>

        <aside className={styles.productShell} aria-label="Matteo product specifications">
          <div className={styles.shellHeader}>
            <span className={styles.productCode}>MATTEO</span>
          </div>
          <div className={styles.portraitFrame}>
            <ResponsivePortrait
              alt={profilePortrait.alt}
              className={styles.portrait}
              sizes="(max-width: 720px) calc(100vw - 60px), (max-width: 1050px) min(720px, calc(100vw - 120px)), 560px"
              priority
            />
            <span className={styles.portraitLabel}>LIVE SYSTEM</span>
          </div>
          <dl className={styles.productSpecs}>
            <div className={styles.specRow}>
              <dt>Known quirk</dt>
              <dd>VP of Karaoke at company offsites</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
