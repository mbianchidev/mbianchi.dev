import Link from 'next/link'
import { CareerIntentNotice } from '@/components/CareerIntentNotice'
import { PageHero } from '@/components/PageHero'
import {
  careerDepartments,
  careerLocations,
  careerRoles,
  careerRoleStatuses,
  getCareerRoleListing,
} from '@/data/jobs'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'
import { CareersSearch } from './CareersSearch'

export const metadata = {
  ...createPageMetadata({
    title: 'Matteo is looking for...',
    description: 'Matteo is looking for senior and staff roles in platform engineering, software, AI automation, customer work, and open source.',
    path: '/careers/',
  }),
  robots: {
    index: false,
    follow: true,
    nosnippet: true,
  },
}

const principles = [
  {
    id: 'have-fun',
    title: 'Have fun',
    description: 'I want to enjoy working with my teammates. Less hierarchy, more trust. Karaoke at offsites is a bonus, not a requirement.',
  },
  {
    id: 'start-with-problem',
    title: 'Start with the problem',
    description: 'I start with the workflow, the users, the constraints, and what failure costs. I want to solve the problem that exists, not the one that makes the architecture look clever.',
  },
  {
    id: 'stay-technical',
    title: 'Stay technical',
    description: 'I stay close to the code and systems, and test assumptions against reality. A role that keeps me away from the work is probably the wrong one.',
  },
  {
    id: 'automate-boring',
    title: 'Automate the boring bit',
    description: 'When work repeats, I map the workflow, remove unnecessary steps, and automate the rest with clear ownership. The third repetition should become a tool, not another calendar event.',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    description: 'I want to ship software I can stand behind, with tests, a sensible delivery process, and enough observability to know what happened after deployment.',
  },
  {
    id: 'explain-tradeoff',
    title: 'Explain the trade-off',
    description: 'I explain cost, risk, time, reversibility, and who owns the outcome. Engineers, leaders, customers, and internal users should understand what they are agreeing to.',
  },
]

const values = [
  {
    id: 'transparency',
    title: 'Transparency',
    description: 'Open and honest communication; a hard no is better than a sweet yes.',
  },
  {
    id: 'integrity',
    title: 'Integrity',
    description: 'Doing the right thing, even when no one is watching.',
  },
  {
    id: 'reliability',
    title: 'Reliability',
    description: 'Being dependable and consistent in delivering, even when it is hard.',
  },
  {
    id: 'creativity',
    title: 'Creativity',
    description: 'Thinking outside the box and innovating instead of sticking with the status quo.',
  },
]

const careerListings = careerRoles.map(getCareerRoleListing)

export default function CareersPage() {
  return (
    <div className={styles.page}>
      <PageHero
        path="/careers"
        title={
          <>
            Matteo is
            <br />
            looking for...
          </>
        }
        description={
          <CareerIntentNotice>
            Work with real impact, room to make decisions, and a team he likes working with.
          </CareerIntentNotice>
        }
        tone="cyan"
      />

      <section className={styles.sectionDark} aria-labelledby="roles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="roles-title">The roles.</h2>
            <p>Useful work, managers who trust him, and less bureaucracy.</p>
          </div>
          <CareersSearch
            locations={careerLocations}
            departments={careerDepartments}
            total={careerRoles.length}
          />
          <div className={styles.roleList}>
            {careerListings.map(({ role, department, locations }) => (
              <article
                key={role.id}
                data-career-role={role.id}
                data-career-search={[
                  role.title,
                  department.label,
                  ...locations.map(({ label }) => label),
                ].join(' ').toLowerCase()}
                data-career-locations={role.locationIds.join(' ')}
                data-career-department={department.id}
                className={styles.roleRow}
              >
                <h3>{role.title}</h3>
                <dl className={styles.roleDetails}>
                  <div>
                    <dt>Status</dt>
                    <dd data-career-status={role.status}>
                      {careerRoleStatuses[role.status]}
                    </dd>
                  </div>
                  <div>
                    <dt>Preferred team</dt>
                    <dd>{department.label}</dd>
                  </div>
                  <div>
                    <dt>Preferred locations</dt>
                    <dd data-career-location-list>
                      {locations.map(({ label }) => label).join(' · ')}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/job/${role.slug}`}
                  className={styles.primaryButton}
                  data-career-details
                >
                  View role
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionLight} aria-labelledby="principles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="principles-title">How I work.</h2>
          </div>
          <dl className={styles.principleList}>
            {principles.map((principle) => (
              <div key={principle.id} data-work-principle={principle.id}>
                <dt>{principle.title}</dt>
                <dd>{principle.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="values-title">
        <div className={styles.sectionInner}>
          <div className={styles.valuesHeader}>
            <div>
              <h2 id="values-title">What matters to me.</h2>
              <blockquote>What I look for in a team, and what you can expect from me.</blockquote>
            </div>
            <a
              href="https://github.com/mbianchidev/mbianchidev/blob/master/values-and-mission.md#core-values"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the source values and mission
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <dl className={styles.valueList}>
            {values.map((value) => (
              <div key={value.id} data-career-value={value.id}>
                <dt>{value.title}</dt>
                <dd>{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.careersClose} data-careers-close>
        <div>
          <p>Looks compatible.</p>
          <h2>Hiring someone who can leave a customer call and open the repo five minutes later? Let&apos;s talk.</h2>
        </div>
        <a
          href="https://cal.com/mbianchidev/intro"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.darkButton}
        >
          Book a call
          <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  )
}
