import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { careerRoles } from '@/data/jobs'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Careers — Matteo',
  description: 'Matteo is looking for a senior or staff engineering role spanning platforms, software, customers, AI automation, and open source.',
  path: '/careers/',
})

const principles = [
  ['Start with the problem', 'Before designing a system, we understand the workflow, the users, the constraints, and what failure costs. We solve the problem that exists, not the one that makes the architecture look clever.'],
  ['Stay technical', 'We stay close to the implementation, inspect the code and systems, and test assumptions against reality. If we cannot get close to the work, the strategy is probably decorative.'],
  ['Automate the boring bit', 'When work repeats, we map the workflow, remove unnecessary steps, and automate the rest with clear ownership. The third repetition should become a tool, not another calendar event.'],
  ['Deliver', 'We keep shipping high-quality, scalable, and maintainable software. We run extensive tests in CI, consider how to best handle CD and deploy to staging, test, and production, while keeping the loop observable and feeding insights back.'],
  ['Explain the trade-off', 'We explain cost, risk, time, reversibility, and who owns the outcome. Engineers, leaders, customers, and internal users should understand what they are agreeing to.'],
]

export default function CareersPage() {
  return (
    <div className={styles.page}>
      <PageHero
        path="/careers"
        title={
          <>
            Looking for a job?
            <br />
            Yes! See below.
          </>
        }
        description="A senior/staff full-time role where I can work on platforms and software, stay close to customers (or internal users), and keep contributing to open source."
        tone="cyan"
        actions={
          <a
            href="https://cal.com/mbianchidev/intro"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.darkButton}
          >
            Start trial
            <span aria-hidden="true">↗</span>
          </a>
        }
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>Availability</dt>
              <dd>Actively interviewing</dd>
            </div>
            <div>
              <dt>Primary model</dt>
              <dd>Full-time</dd>
            </div>
            <div>
              <dt>Consulting</dt>
              <dd>Selective</dd>
            </div>
          </dl>
        }
      />

      <section className={styles.sectionDark} aria-labelledby="roles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="roles-title">What are we looking for</h2>
            <p>Roles with a real impact, agency, out-of-the-way managers and low bureaucracy.</p>
          </div>
          <div className={styles.roleList}>
            {careerRoles.map((role) => (
              <article
                key={role.id}
                data-career-role={role.id}
                className={styles.roleRow}
              >
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <div className={styles.roleMeta}>
                  <ul className={styles.skillList}>
                    {role.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                  <Link href={`/job/${role.slug}`} className={styles.roleLink}>
                    Read role description
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionLight} aria-labelledby="principles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="principles-title">How we work.</h2>
            <p>If a principle disappears under deadline pressure, it was only decoration.</p>
          </div>
          <dl className={styles.principleList}>
            {principles.map(([name, description]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{description}</dd>
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
