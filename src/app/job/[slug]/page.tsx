import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CareerIntentNotice } from '@/components/CareerIntentNotice'
import { PageHero } from '@/components/PageHero'
import {
  careerRoles,
  careerRoleStatuses,
  getCareerRoleListing,
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
    notFound()
  }

  return {
    ...createPageMetadata({
      title: `${role.title} | Matteo is looking for...`,
      description: `Matteo is looking for work as ${role.title}, including the responsibilities and compensation targets described here.`,
      path: `/job/${role.slug}/`,
    }),
    robots: {
      index: false,
      follow: true,
      nosnippet: true,
    },
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params
  const role = getCareerRoleBySlug(slug)

  if (!role) {
    notFound()
  }

  const { department, locations } = getCareerRoleListing(role)

  return (
    <div className={innerStyles.page} data-job-description={role.id}>
      <PageHero
        path={`/job/${role.slug}`}
        title={role.title}
        description={
          <>
            <CareerIntentNotice>
              Matteo is looking for work like this.
            </CareerIntentNotice>
            <br />
            {role.description}
          </>
        }
        tone="dark"
        titleSize="compact"
        actions={
          <>
            <Link
              href="/careers"
              className={innerStyles.secondaryButton}
              data-career-back
            >
              <span aria-hidden="true">←</span>
              Back to roles
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
              <dt>Status</dt>
              <dd data-career-status={role.status}>
                {careerRoleStatuses[role.status]}
              </dd>
            </div>
            <div>
              <dt>Target level</dt>
              <dd>{role.level}</dd>
            </div>
            <div>
              <dt>Preferred setup</dt>
              <dd>Full-time</dd>
            </div>
            <div>
              <dt>Preferred team</dt>
              <dd>{department.label}</dd>
            </div>
            <div>
              <dt>Preferred locations</dt>
              <dd data-job-location-list>
                {locations.map(({ label }) => label).join(' · ')}
              </dd>
            </div>
          </dl>
        }
      />

      <section className={styles.mandateSection} aria-labelledby="mandate-title">
        <div className={styles.jobInner}>
          <div className={styles.mandateGrid}>
            <div className={styles.sectionHeading}>
              <h2 id="mandate-title">The work he wants to do.</h2>
              <p>The kind of remit he has in mind.</p>
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
            <h2 id="ownership-title">What he&apos;d take on.</h2>
            <p>The responsibilities he&apos;s looking for, not a shopping list of meetings.</p>
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
            <h2 id="requirements-title">What the role calls for.</h2>
            <ul className={styles.specList}>
              {role.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="success-title">
            <h2 id="success-title">What he&apos;d aim to change.</h2>
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
            <h2 id="compensation-title">Compensation targets.</h2>
            <p>
              These are Matteo&apos;s targets for this scope.{' '}
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
            <h2 id="evidence-title">What he brings.</h2>
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
          <h2>Have a role with this kind of scope? Let&apos;s talk.</h2>
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
