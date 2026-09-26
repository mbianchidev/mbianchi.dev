import { PageHero } from '@/components/PageHero'
import { CustomersTimeline } from '@/components/CustomersTimeline'
import customersData from '@/data/customers.json'
import type { CustomersData } from '@/types'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Customers — Matteo',
  description: 'Matteo’s work history across employment, founding, consulting, mentoring, training, and advisory roles.',
  path: '/customers/',
})

const visibleCompanies = (customersData as CustomersData).companies.filter((company) => company.show)

export default function Customers() {
  const sectors = new Set(visibleCompanies.map((company) => company.companySector)).size

  return (
    <div className={styles.page}>
      <PageHero
        path="/customers"
        title="Where I worked, built, advised, taught, or got paged."
        description="Employment, consulting, founding, mentoring, training, and advisory work. A career history, not a wall of implied endorsements."
        tone="light"
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>Environment</dt>
              <dd>{visibleCompanies.length} recorded deployments</dd>
            </div>
            <div>
              <dt>Sectors</dt>
              <dd>{sectors} domains</dd>
            </div>
            <div>
              <dt>Current active deployment</dt>
              <dd>GitHub (Microsoft)</dd>
            </div>
          </dl>
        }
      />

      <section className={styles.sectionSoft} aria-labelledby="deployment-history">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="deployment-history">The long version.</h2>
            <p>Newest first. I label the relationship because not every logo means customer.</p>
          </div>
          <CustomersTimeline companies={visibleCompanies} />
        </div>
      </section>
    </div>
  )
}
