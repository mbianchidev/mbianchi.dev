import type { ReactNode } from 'react'
import { PageHero } from './PageHero'
import styles from '@/app/inner.module.css'

interface LegalSection {
  id?: string
  title: string
  paragraphs: ReactNode[]
}

interface LegalDocumentProps {
  path: string
  title: string
  description: string
  summary: string
  effectiveDate: string
  sections: LegalSection[]
}

export function LegalDocument({
  path,
  title,
  description,
  summary,
  effectiveDate,
  sections,
}: LegalDocumentProps) {
  return (
    <div className={styles.page}>
      <PageHero
        path={path}
        title={title}
        description={description}
        tone="light"
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>Effective</dt>
              <dd>{effectiveDate}</dd>
            </div>
            <div>
              <dt>Reading level</dt>
              <dd>Human</dd>
            </div>
            <div>
              <dt>Dark pattern count</dt>
              <dd>0</dd>
            </div>
          </dl>
        }
      />

      <section className={styles.legalSection} aria-label={`${title} document`}>
        <div className={styles.legalDocument}>
          <p className={styles.legalSummary}>{summary}</p>
          {sections.map((section, index) => (
            <section
              key={section.title}
              id={section.id}
              aria-labelledby={`legal-section-${index + 1}`}
            >
              <h2 id={`legal-section-${index + 1}`}>{index + 1}. {section.title}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
