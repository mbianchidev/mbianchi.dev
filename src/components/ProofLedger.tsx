import Link from 'next/link'
import projectsData from '@/data/projects.json'
import styles from '@/app/home.module.css'

const ownedProjects = projectsData.projects
  .filter((project) => project.contribution.startsWith('Creator'))
  .slice(0, 2)

const [featuredProject, ...supportingProjects] = ownedProjects

export function ProofLedger() {
  return (
    <section id="proof" className={styles.proof} aria-labelledby="proof-title">
      <div className={styles.proofHeader}>
        <div>
          <h2 id="proof-title">Do not take the landing page’s word for it.</h2>
          <p>The code is public. Unfortunately, so is the commit history.</p>
        </div>
        <Link href="/portfolio" className={styles.textLink}>
          See all the code
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className={styles.proofLayout}>
        {featuredProject && (
          <article className={styles.featuredProof}>
            <p className={styles.repoPath}>github.com/mbianchidev/{featuredProject.url.split('/').pop()}</p>
            <h3>{featuredProject.name}</h3>
            <p>{featuredProject.description}</p>
            <dl className={styles.proofFacts}>
              <div>
                <dt>Role</dt>
                <dd>{featuredProject.contribution}</dd>
              </div>
              <div>
                <dt>Project signal</dt>
                <dd>{featuredProject.stars} GitHub stars</dd>
              </div>
            </dl>
            <ul className={styles.techTags} aria-label={`${featuredProject.name} technologies`}>
              {featuredProject.techStack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <a href={featuredProject.url} target="_blank" rel="noopener noreferrer">
              Inspect repository
              <span aria-hidden="true">↗</span>
            </a>
          </article>
        )}

        <div
          className={`${styles.proofRail} ${
            supportingProjects.length === 1 ? styles.proofRailSingle : ''
          }`}
        >
          {supportingProjects.map((project) => (
            <article key={project.name} className={styles.proofItem}>
              <div>
                <p>{project.contribution}</p>
                <h3>{project.name}</h3>
              </div>
              <p>{project.description}</p>
              <div className={styles.proofItemFooter}>
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
    </section>
  )
}
