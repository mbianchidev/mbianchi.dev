'use client'

import Image from 'next/image'
import { useState } from 'react'
import { customerLogos } from '@/data/customerLogos'
import type { Company } from '@/types'
import styles from '@/app/inner.module.css'

interface CustomersTimelineProps {
  companies: Company[]
}

const PAGE_SIZE = 7

function getFallbackLabel(company: Company) {
  if (company.code === 'KLB') {
    return 'KubeLab'
  }

  return company.companyName
    .replace(/\([^)]*\)/g, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function CustomersTimeline({ companies }: CustomersTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleCompanies = companies.slice(0, visibleCount)
  const remaining = companies.length - visibleCount

  return (
    <>
      <ol className={styles.historyList}>
        {visibleCompanies.map((company) => {
          const achievements = company.achievements.flatMap((achievement) => achievement.items)
          const logo = customerLogos[company.code]

          return (
            <li key={company.code} className={styles.historyRecord}>
              <div className={styles.historyYear}>{company.year}</div>
              <div
                className={styles.historyLogo}
                data-customer-logo={company.code}
                aria-hidden="true"
              >
                <span>{getFallbackLabel(company)}</span>
                {logo && (
                  <Image
                    src={logo}
                    alt=""
                    width={72}
                    height={72}
                    loading="eager"
                  />
                )}
              </div>
              <article className={styles.historyBody}>
                <div className={styles.historyHeader}>
                  <div>
                    <p>{company.companyType} · {company.companySector}</p>
                    <h3>{company.companyName} {company.countryFlag}</h3>
                  </div>
                  {company.year.includes('now') && <span>Current</span>}
                </div>
                <p className={styles.historyRole}>{company.role}</p>
                <p className={styles.historyStory}>{company.story}</p>
                {achievements.length > 0 && (
                  <ul className={styles.historyAchievements}>
                    {achievements.map((achievement) => (
                      <li key={achievement.text}>{achievement.text}</li>
                    ))}
                  </ul>
                )}
                {company.companyUrl && (
                  <a href={company.companyUrl} target="_blank" rel="noopener noreferrer">
                    Visit organisation
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            </li>
          )
        })}
      </ol>
      {remaining > 0 && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, companies.length))}
          aria-label={`Load ${Math.min(PAGE_SIZE, remaining)} more deployment history entries`}
        >
          Load more history
          <span>{remaining} remaining</span>
        </button>
      )}
    </>
  )
}
