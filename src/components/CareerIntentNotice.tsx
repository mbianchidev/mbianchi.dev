import Link from 'next/link'
import styles from '@/app/inner.module.css'

export function CareerIntentNotice() {
  return (
    <span className={styles.careerIntent} data-career-intent="seeking-role">
      <strong>I&apos;m Matteo. I&apos;m looking for a role, not hiring.</strong>{' '}
      These are my preferences, not job vacancies.{' '}
      <Link href="/terms#no-scraping">No scraping or job aggregation.</Link>
    </span>
  )
}
