import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import projectsData from '@/data/projects.json'
import { createPageMetadata } from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

export const metadata = createPageMetadata({
  title: 'Open Source — Matteo',
  description: 'Projects Matteo built and upstream work across developer platforms, AI tooling, Kubernetes, infrastructure, and education.',
  path: '/portfolio/',
})

const ownedProjects = projectsData.projects.filter((project) => {
  const url = new URL(project.url)
  return url.hostname === 'github.com' && url.pathname.startsWith('/mbianchidev/')
})

const ecosystemProjects = projectsData.projects.filter(
  (project) => !ownedProjects.some((ownedProject) => ownedProject.url === project.url)
)

export default function Portfolio() {
  const [featuredProject, ...otherOwnedProjects] = ownedProjects

  return (
    <div className={styles.page}>
      <PageHero
        path="/portfolio"
        title="The code is public. So are the receipts."
        description="Projects I built, projects I maintain, and code I sent upstream. The contribution label tells you which is which."
        tone="green"
        actions={
          <>
            <a
              href="https://github.com/mbianchidev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.darkButton}
            >
              Open GitHub
              <span aria-hidden="true">↗</span>
            </a>
            <Link href="/roadmap" className={styles.lightButton}>
              Read the changelog
            </Link>
          </>
        }
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>Owned projects</dt>
              <dd>30+</dd>
            </div>
            <div>
              <dt>Ecosystems contributed to</dt>
              <dd>Kubernetes, CNCF, Actions (ARC)... and more</dd>
            </div>
            <div>
              <dt>Field notes</dt>
              <dd>30+</dd>
            </div>
            <div>
              <dt>Mentioned in</dt>
              <dd>12 articles, 17 podcasts, 22 talks</dd>
            </div>
          </dl>
        }
      />

      {featuredProject && (
        <section className={styles.sectionDark} aria-labelledby="owned-projects">
          <div className={styles.sectionInner}>
            <div className={styles.sectionIntro}>
              <h2 id="owned-projects">Projects I actually own.</h2>
              <p>These repositories are mine. Their star counts are project signal, not a personality score.</p>
            </div>
            <div className={styles.ownedProjects}>
              <article className={styles.featuredRepository}>
                <p>Creator-owned repository</p>
                <h3>{featuredProject.name}</h3>
                <p>{featuredProject.description}</p>
                <dl>
                  <div>
                    <dt>Role</dt>
                    <dd>{featuredProject.contribution}</dd>
                  </div>
                  <div>
                    <dt>Project signal</dt>
                    <dd>{featuredProject.stars} GitHub stars</dd>
                  </div>
                </dl>
                <ul className={styles.tagList}>
                  {featuredProject.techStack.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <a href={featuredProject.url} target="_blank" rel="noopener noreferrer">
                  Inspect repository
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
              <div className={styles.repositoryRail}>
                {otherOwnedProjects.map((project) => (
                  <article key={project.url} className={styles.repositoryRecord}>
                    <div>
                      <p>{project.contribution}</p>
                      <h3>{project.name}</h3>
                    </div>
                    <p>{project.description}</p>
                    <div>
                      <span>{project.stars} stars on this project</span>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        Source
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.sectionSoft} aria-labelledby="ecosystem-work">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="ecosystem-work">Code I sent somewhere else.</h2>
            <p>The project may be famous. The contribution label says what I actually did.</p>
          </div>
          <div className={styles.contributionList}>
            {ecosystemProjects.map((project) => (
              <article key={project.url} className={styles.contributionRow}>
                <div>
                  <p>{project.contribution}</p>
                  <h3>{project.name}</h3>
                </div>
                <p>{project.description}</p>
                <div className={styles.contributionMeta}>
                  <span>{project.stars} project stars</span>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    Upstream repository
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionCyan} aria-labelledby="portfolio-output">
        <div className={styles.sectionInner}>
          <div className={styles.sectionIntro}>
            <h2 id="portfolio-output">Work, not startup metrics.</h2>
            <p>Pull requests, talks, teaching, and mentoring. No ARR cosplay.</p>
          </div>
          <dl className={styles.outputGrid}>
            <div>
              <dt>40+</dt>
              <dd>Merged Kubernetes pull requests</dd>
            </div>
            <div>
              <dt>20+</dt>
              <dd>Talks and workshops delivered</dd>
            </div>
            <div>
              <dt>500+</dt>
              <dd>Learners trained</dd>
            </div>
            <div>
              <dt>20+</dt>
              <dd>Mentees coached · 5/5 stars</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
