import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import {
  careerDepartments,
  careerLocations,
  careerRoles,
  getCareerRoleBySlug,
} from '@/data/jobs'
import { createPageMetadata } from '@/lib/siteMetadata'
import innerStyles from '@/app/inner.module.css'
import styles from './job.module.css'

interface JobPageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return careerRoles.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params
  const role = getCareerRoleBySlug(slug)

  if (!role) {
    return createPageMetadata({
      title: 'Role Not Found — Matteo',
      description: 'The requested role description could not be found.',
      path: '/careers/',
    })
  }

  return createPageMetadata({
    title: `${role.title} — Matteo`,
    description: role.description,
    path: `/job/${role.slug}/`,
  })
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params
  const role = getCareerRoleBySlug(slug)

  if (!role) {
    notFound()
  }

  const department = careerDepartments.find(({ id }) => id === role.departmentId)
  const location = careerLocations.find(({ id }) => id === role.locationId)

  if (!department || !location) {
    throw new Error(`Job "${role.id}" has an invalid department or location`)
  }

  return (
    <div className={innerStyles.page} data-job-description={role.id}>
      <PageHero
        path={`/job/${role.slug}`}
        title={role.title}
        description={role.description}
        tone="dark"
        titleSize="compact"
        actions={
          <>
            <Link href="/careers" className={innerStyles.secondaryButton}>
              <span aria-hidden="true">←</span>
              Back to careers
            </Link>
            <a
              href="https://cal.com/mbianchidev/intro"
              target="_blank"
              rel="noopener noreferrer"
              className={innerStyles.primaryButton}
            >
              Discuss this role
              <span aria-hidden="true">↗</span>
            </a>
          </>
        }
        aside={
          <dl className={innerStyles.heroSpecs}>
            <div>
              <dt>Level</dt>
              <dd>{role.level}</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>Full-time</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{department.label}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{location.label}</dd>
            </div>
          </dl>
        }
      />

      <section className={styles.mandateSection} aria-labelledby="mandate-title">
        <div className={styles.jobInner}>
          <div className={styles.mandateGrid}>
            <div className={styles.sectionHeading}>
              <h2 id="mandate-title">The mandate.</h2>
              <p>Own the outcome, stay close to the implementation, and improve the system around the work.</p>
            </div>
            <div className={styles.mandateCopy}>
              {role.mandate.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <dl className={styles.operatingConditions}>
            <div>
              <dt>Impact</dt>
              <dd>Material</dd>
            </div>
            <div>
              <dt>Agency</dt>
              <dd>High</dd>
            </div>
            <div>
              <dt>Management</dt>
              <dd>Context, then space</dd>
            </div>
            <div>
              <dt>Bureaucracy</dt>
              <dd>Low</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.ownershipSection} aria-labelledby="ownership-title">
        <div className={styles.jobInner}>
          <div className={styles.darkSectionHeading}>
            <h2 id="ownership-title">What this role owns.</h2>
            <p>Responsibilities written as outcomes and systems, not a shopping list of meetings.</p>
          </div>
          <ol className={styles.ownershipLedger}>
            {role.responsibilities.map((responsibility, index) => (
              <li key={responsibility} data-job-responsibility>
                <code>OWN-{String(index + 1).padStart(2, '0')}</code>
                <p>{responsibility}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.specSection} aria-label="Role requirements and outcomes">
        <div className={`${styles.jobInner} ${styles.specGrid}`}>
          <section aria-labelledby="requirements-title">
            <h2 id="requirements-title">What this needs.</h2>
            <ul className={styles.specList}>
              {role.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="success-title">
            <h2 id="success-title">What success looks like.</h2>
            <ul className={styles.specList}>
              {role.success.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className={styles.compensationSection} aria-labelledby="compensation-title">
        <div className={styles.jobInner}>
          <div className={styles.compensationHeader}>
            <h2 id="compensation-title">Compensation target.</h2>
            <p>
              Top-quartile ranges for this scope.{' '}
              {role.compensationBasis === 'OTE'
                ? 'Ranges are on-target earnings; equity may be additional.'
                : 'Ranges are base salary; equity and bonus may be additional.'}{' '}
              The cash/stock split is negotiable.
            </p>
          </div>
          <dl className={styles.compensationGrid}>
            {role.compensation.map((band) => (
              <div
                key={band.id}
                data-job-compensation={band.id}
              >
                <dt>{band.market}</dt>
                <dd>
                  <strong>{band.range}</strong>
                  <span>{role.compensationBasis}</span>
                  <small>{band.context}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.evidenceSection} aria-labelledby="evidence-title">
        <div className={styles.jobInner}>
          <div className={styles.evidenceHeader}>
            <h2 id="evidence-title">Who you need to be</h2>
          </div>
          <ul className={styles.evidenceLedger}>
            {role.candidateProfile.map((item) => (
              <li key={item} data-job-profile>
                <span aria-hidden="true">✓</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.jobClose}>
        <div>
          <p>Looks compatible.</p>
          <h2>Real impact, useful autonomy, and enough technical depth to finish the job.</h2>
        </div>
        <a
          href="https://cal.com/mbianchidev/intro"
          target="_blank"
          rel="noopener noreferrer"
          className={innerStyles.primaryButton}
        >
          Discuss this role
          <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  )
}
