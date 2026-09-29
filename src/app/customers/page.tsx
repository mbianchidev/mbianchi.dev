import { PageHero } from '@/components/PageHero'
import { CustomersTimeline } from '@/components/CustomersTimeline'
import customersData from '@/data/customers.json'
import type { CustomersData } from '@/types'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Customers — Matteo',
  description: 'Companies and communities where Matteo worked, built, advised, taught, or responded to incidents.',
  path: '/customers/',
})

const visibleCompanies = (customersData as CustomersData).companies.filter((company) => company.show)

export default function Customers() {
  return (
    <div className={styles.page}>
      <PageHero
        path="/customers"
        title="Where we worked, built, advised, taught, or got paged."
        description="We worked with, built, advised, taught, or got paged at 2AM by these companies."
        tone="light"
      />

      <section className={styles.sectionSoft} aria-label="Deployment history">
        <div className={styles.sectionInner}>
          <CustomersTimeline companies={visibleCompanies} />
        </div>
      </section>
    </div>
  )
}
