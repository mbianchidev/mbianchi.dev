import styles from '@/app/home.module.css'
import { profilePortrait } from '@/lib/siteConfig'
import { ResponsivePortrait } from './ResponsivePortrait'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.releaseBadge}>
            <span aria-hidden="true" />
            Matteo v2026.8 is accepting deployments
          </p>
          <h1 id="hero-title" className={styles.heroTitle}>
            Platform as a Human
          </h1>
          <p className={styles.heroText}>
            Matteo builds developer platforms, ships software, works with
            customers, and automates the boring parts. Then he writes it down,
            contributes upstream, or explains it on stage.
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
              Run compatibility test
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className={styles.heroFinePrint}>
            Looking for a full-time role. Still available for the occasional consulting job.
          </p>
        </div>

        <aside className={styles.productShell} aria-label="Matteo product specifications">
          <div className={styles.shellHeader}>
            <span className={styles.productCode}>MATTEO / HUMAN PLATFORM</span>
            <span className={styles.productStatus}>
              <span className={styles.statusDot} aria-hidden="true" />
              Ready to deploy
            </span>
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
              <dt>Runtime</dt>
              <dd>Software engineering with customer-facing side effects</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Interfaces</dt>
              <dd>Platforms / Solutions / Open Source / AI</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Known quirk</dt>
              <dd>Will automate the recurring task before lunch</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
