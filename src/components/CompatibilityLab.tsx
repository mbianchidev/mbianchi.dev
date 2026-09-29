'use client'

import { useEffect, useState } from 'react'
import styles from '@/app/home.module.css'

const scenarios = [
  {
    id: 'platform',
    label: 'Platform adoption',
    signal: 'MATCH CONFIRMED / HIGH CONFIDENCE',
    title: 'Build the platform and make it usable.',
    summary:
      'I worked on platform APIs, self-service workflows, infrastructure, and reliability. I also spent time with the developers using the thing, because a platform nobody wants is just expensive YAML.',
    proof: [
      'Designed platform APIs, self-service workflows, and zero-touch onboarding',
      'Ran production infrastructure, reliability work, and incident response',
      'Worked directly with developers instead of designing from a slide deck'
    ]
  },
  {
    id: 'ai-automation',
    label: 'Automation backlog',
    signal: 'MATCH CONFIRMED / HUMAN JUDGMENT RETAINED',
    title: 'Automate the boring work. Keep a human responsible.',
    summary:
      'I turned repeated Solutions Engineering work into tools and agents connected to real systems. The useful part was the workflow, not the chatbot.',
    proof: [
      'Mapped repeated Solutions Engineering work before automating it',
      'Connected assistants to internal tools and company data',
      'Added evaluation, observability, review, and human ownership'
    ]
  },
  {
    id: 'solutions',
    label: 'Customer-product gap',
    signal: 'MATCH CONFIRMED / PRODUCT FEEDBACK ATTACHED',
    title: 'Stay technical after the customer call ends.',
    summary:
      'I ran discovery, designed architectures, built demos and proof-of-value work, helped teams implement, and sent the ugly details back to Product.',
    proof: [
      'Led technical discovery and turned vague requirements into architecture',
      'Built demos and proof-of-value implementations',
      'Worked across Sales, Product, Field Marketing, and open source teams'
    ]
  },
  {
    id: 'open-source',
    label: 'Expertise trapped in heads',
    signal: 'MATCH CONFIRMED / BROADCAST ENABLED',
    title: 'Get useful knowledge out of one person’s head.',
    summary:
      'I maintained Kubernetes release work, contributed upstream, wrote documentation, taught workshops, mentored engineers, and spoke at conferences. Usually with too many slides.',
    proof: [
      'Maintained Kubernetes release engineering and contributed upstream',
      'Wrote technical material and delivered talks and workshops',
      'Mentored engineers and helped run cloud-native communities'
    ]
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
          <a href="#numbers">
            See the numbers
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}