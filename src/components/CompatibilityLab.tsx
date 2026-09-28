'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '@/app/home.module.css'

const scenarios = [
  {
    id: 'platform',
    label: 'Platform adoption',
    signal: 'MATCH CONFIRMED / HIGH CONFIDENCE',
    title: 'Build a platform developers stop working around.',
    summary:
      'I start with the developers who will use it, pick sensible defaults, and check whether anyone adopts it. The infrastructure is the easy part.',
    proof: [
      'Built platform APIs and zero-touch onboarding for 70+ engineers',
      'Led infrastructure and built APIs serving 10M+ daily users to this day',
      'Kubernetes release engineering maintainer and production operator'
    ],
    href: 'https://github.com/mbianchidev/platform-engineering-roadmap',
    action: 'See the platform work'
  },
  {
    id: 'ai-automation',
    label: 'Automation backlog',
    signal: 'MATCH CONFIRMED / HUMAN JUDGMENT RETAINED',
    title: 'Automate the boring work. Keep a human responsible.',
    summary:
      'I build agents when a workflow repeats enough to deserve one. I do not build AI demos in search of a problem, and “the model decided” is not an excuse.',
    proof: [
      'Built an internal assistant that automated 20–25% of Solutions Engineering work',
      'Built the assistant around real Solutions Engineering workflows and internal tools',
      'Keeps review, observability, and human ownership in the loop'
    ],
    href: '/portfolio',
    action: 'See the software work'
  },
  {
    id: 'solutions',
    label: 'Customer-product gap',
    signal: 'MATCH CONFIRMED / PRODUCT FEEDBACK ATTACHED',
    title: 'Turn customer pain into something product and engineering can use.',
    summary:
      'I keep discovery, architecture, demos, implementation, and product feedback in the same thread. Customers get an honest answer. Product gets enough detail to act.',
    proof: [
      'Won Club FY26 after reaching 185% quota at GitHub',
      'Worked across Sales, Product, Field Marketing, and OSPO',
      'Combines customer communication with hands-on engineering depth'
    ],
    href: '/customers',
    action: 'See the customer work'
  },
  {
    id: 'open-source',
    label: 'Expertise trapped in heads',
    signal: 'MATCH CONFIRMED / BROADCAST ENABLED',
    title: 'Get useful knowledge out of one person’s head.',
    summary:
      'I write down what worked, contribute upstream, teach it, and talk about the failures too. Hoarding knowledge is boring.',
    proof: [
      '40+ merged Kubernetes pull requests',
      'Kubernetes release engineering maintainer',
      '20+ talks, 500+ learners, and 20+ mentees coached to success (5/5 stars as a mentor)'
    ],
    href: '/about#community',
    action: 'See the open-source work'
  }
]

export function CompatibilityLab() {
  const [selectedId, setSelectedId] = useState(scenarios[0].id)
  const selected = scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0]

  useEffect(() => {
    console.info(
      '%cMatteo diagnostics: source available, ego load within operating limits. Trial endpoint: https://cal.com/mbianchidev/intro',
      'color:#00D9FF;font-weight:700'
    )
  }, [])

  return (
    <section id="compatibility" className={styles.compatibility} aria-labelledby="compatibility-title">
      <div className={styles.compatibilityIntro}>
        <h2 id="compatibility-title">Run a compatibility check.</h2>
        <p>
          Pick a problem. The diagnosis may vary, but the same suspiciously
          versatile engineer appears.
        </p>
      </div>

      <div className={styles.lab}>
        <div className={styles.scenarioList} role="group" aria-label="Compatibility scenarios">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selected.id

            return (
              <button
                key={scenario.id}
                type="button"
                data-scenario-id={scenario.id}
                className={`${styles.scenarioButton} ${isSelected ? styles.scenarioButtonActive : ''}`}
                aria-pressed={isSelected}
                aria-controls="compatibility-result"
                onClick={() => setSelectedId(scenario.id)}
              >
                <span>{scenario.label}</span>
                <span aria-hidden="true">{isSelected ? '●' : '○'}</span>
              </button>
            )
          })}
        </div>

        <div
          key={selected.id}
          id="compatibility-result"
          data-selected-scenario={selected.id}
          className={styles.compatibilityResult}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className={styles.resultSignal}>{selected.signal}</p>
          <h3>{selected.title}</h3>
          <p className={styles.resultSummary}>{selected.summary}</p>
          <ul>
            {selected.proof.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          {selected.href.startsWith('http') ? (
            <a href={selected.href} target="_blank" rel="noopener noreferrer">
              {selected.action}
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <Link href={selected.href}>
              {selected.action}
              <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}