import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import {
  careerDepartments,
  careerLocations,
  careerRoles,
  getCareerRoleListing,
} from '@/data/jobs'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'
import { CareersSearch } from './CareersSearch'

export const metadata = createPageMetadata({
  title: 'Careers — Matteo',
  description: 'Matteo is looking for a senior or staff engineering role spanning platforms, software, customers, AI automation, and open source.',
  path: '/careers/',
})

const principles = [
  {
    id: 'have-fun',
    title: 'Have fun',
    description: 'We have fun first and foremost, with our colleagues, with the managers (sometimes), and we do not believe in strict hierarchies. Karaoke is the go-to activity for offsites.',
  },
  {
    id: 'start-with-problem',
    title: 'Start with the problem',
    description: 'Before designing a system, we understand the workflow, the users, the constraints, and what failure costs. We solve the problem that exists, not the one that makes the architecture look clever.',
  },
  {
    id: 'stay-technical',
    title: 'Stay technical',
    description: 'We stay close to the implementation, inspect the code and systems, and test assumptions against reality. If we cannot get close to the work, the strategy is probably decorative.',
  },
  {
    id: 'automate-boring',
    title: 'Automate the boring bit',
    description: 'When work repeats, we map the workflow, remove unnecessary steps, and automate the rest with clear ownership. The third repetition should become a tool, not another calendar event.',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    description: 'We keep shipping high-quality, scalable, and maintainable software. We run extensive tests in CI, consider how to best handle CD and deploy to staging, test, and production, while keeping the loop observable and feeding insights back.',
  },
  {
    id: 'explain-tradeoff',
    title: 'Explain the trade-off',
    description: 'We explain cost, risk, time, reversibility, and who owns the outcome. Engineers, leaders, customers, and internal users should understand what they are agreeing to.',
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
            Looking for a job?
            <br />
            Yes!
          </>
        }
        tone="cyan"
      />

      <section className={styles.sectionDark} aria-labelledby="roles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="roles-title">What are we looking for</h2>
            <p>Roles with a real impact, agency, out-of-the-way managers and low bureaucracy.</p>
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
                    <dt>Department</dt>
                    <dd>{department.label}</dd>
                  </div>
                  <div>
                    <dt>Locations</dt>
                    <dd data-career-location-list>
                      {locations.map(({ label }) => label).join(' · ')}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/job/${role.slug}`}
                  className={styles.primaryButton}
                  data-career-apply
                >
                  Apply
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionLight} aria-labelledby="principles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="principles-title">How we work.</h2>
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
              <h2 id="values-title">Our Values</h2>
              <blockquote>Principles that guide our actions and decisions</blockquote>
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
          <h2>Need someone who can leave a customer call and open the repo five minutes later? Let’s talk.</h2>
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
