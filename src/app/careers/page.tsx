import { PageHero } from '@/components/PageHero'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Careers — Matteo',
  description: 'Matteo is looking for a senior engineering role spanning platforms, software, customers, AI automation, and open source.',
  path: '/careers/',
})

const roles = [
  {
    title: 'Senior Platform Engineer',
    description: 'Developer platforms, Kubernetes, infrastructure as code, reliability, and self-service that engineers actually use.',
    skills: ['Platform engineering', 'Kubernetes', 'IaC', 'SRE'],
  },
  {
    title: 'Solutions Engineer, Technical Products',
    description: 'Customer discovery, architecture, demos, proof of value, implementation help, and product feedback with enough detail to be useful.',
    skills: ['Discovery', 'Architecture', 'Demos', 'GTM'],
  },
  {
    title: 'Senior Software Engineer',
    description: 'APIs, services, CLIs, interfaces, automation, and system design in Go, Python, TypeScript, Rust, and React.',
    skills: ['Go', 'Python', 'TypeScript', 'Rust'],
  },
  {
    title: 'AI Engineer, Developer Automation',
    description: 'Agents, assistants, MCP integrations, and automation for real work. No chatbot looking for a reason to exist.',
    skills: ['AI agents', 'MCP', 'Automation', 'Evaluation'],
  },
  {
    title: 'Open Source & Community Lead',
    description: 'Upstream contributions, open-source strategy, technical education, speaking, mentorship, and community work.',
    skills: ['Open source', 'Speaking', 'Training', 'Community'],
  },
]

const principles = [
  ['Start with the problem', 'Understand the workflow and the stakes before suggesting a system.'],
  ['Stay technical', 'If I cannot get close to the implementation, the strategy is probably decorative.'],
  ['Automate the boring bit', 'Repeated work should become a tool, not a recurring calendar event.'],
  ['Explain the trade-off', 'Engineers, leaders, and customers should understand what they are agreeing to.'],
]

export default function CareersPage() {
  return (
    <div className={styles.page}>
      <PageHero
        path="/careers"
        title="Looking for the next full-time problem."
        description="Best fit: a senior role where platform engineering, software, customer work, AI automation, and open source all matter."
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
            <h2 id="roles-title">Where I fit.</h2>
            <p>These are not five jobs at once. They are five honest descriptions of work I already do.</p>
          </div>
          <div className={styles.roleList}>
            {roles.map((role) => (
              <article key={role.title} className={styles.roleRow}>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <ul className={styles.skillList}>
                  {role.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionLight} aria-labelledby="principles-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="principles-title">How I work.</h2>
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

      <section className={styles.careersClose}>
        <div>
          <p>Looks compatible.</p>
          <h2>If you need someone who can move between customer calls and production code, let’s talk.</h2>
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
