import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import styles from '@/app/inner.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <PageHero
        path="/404"
        title="Endpoint not implemented."
        description="This page does not exist. It may have moved, disappeared, or been sunset for strategic reasons."
        tone="green"
        actions={
          <>
            <Link href="/" className={styles.darkButton}>
              Go home
            </Link>
            <Link href="/portfolio" className={styles.lightButton}>
              See working code
            </Link>
          </>
        }
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>Status</dt>
              <dd>404</dd>
            </div>
            <div>
              <dt>Root cause</dt>
              <dd>Unknown route</dd>
            </div>
            <div>
              <dt>Recovery</dt>
              <dd>Safe and immediate</dd>
            </div>
          </dl>
        }
      />
    </div>
  )
}
