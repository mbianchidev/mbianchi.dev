import type { ReactNode } from 'react'
import Link from 'next/link'
import styles from '@/app/inner.module.css'

export function CareerIntentNotice({ children }: { children: ReactNode }) {
  return (
    <span className={styles.careerIntent} data-career-intent="seeking-role">
      {children}{' '}
      <Link href="/terms#no-scraping">No scraping or job aggregation.</Link>
    </span>
  )
}
