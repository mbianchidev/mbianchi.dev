'use client'

import { useEffect, useState } from 'react'
import styles from '@/app/home.module.css'

type ProofItem = {
  text: string
  startsGroup?: boolean
}

type Scenario = {
  id: string
  label: string
  signal: string
  title: string
  summary: string
  proof: ProofItem[]
}

const scenarios: Scenario[] = [
  {
    id: 'platform',
    label: 'Platform adoption',
    signal: 'MATCH CONFIRMED / HIGH CONFIDENCE',
    title: 'Build the platform and make it usable.',
    summary:
      'Worked on platform APIs, self-service workflows, infrastructure, and reliability. Spent time with the developers using the thing, because a platform nobody wants is just expensive YAML.',
    proof: [
      {
        text: 'Designed platform APIs, self-service workflows, and zero-touch onboarding'
      },
      {
        text: 'Built production infrastructure, delivered reliability and performance work at scale'
      },
      {
        text: 'Led incident response across different domains and products, creating a blameless culture',
        startsGroup: true
      },
      {
        text: 'Worked directly with developers instead of designing from a slide deck'
      },
      {
        text: 'Fostered innovation, bootstrapped Kubernetes deployments and cloud migrations across enterprises',
        startsGroup: true
      }
    ]
  },
  {
    id: 'ai-automation',
    label: 'Automation backlog',
    signal: 'MATCH CONFIRMED / HUMAN JUDGMENT RETAINED',
    title: 'Automate the boring work. Keep a human responsible.',
    summary:
      'Turned repeated engineering work into tools and agents connected to real systems. The useful part was the workflow, not just the chatbot.',
    proof: [
      {
        text: 'Made CI/CD systems faster and more efficient'
      },
      {
        text: 'Made environments more automated than ever',
        startsGroup: true
      },
      {
        text: 'Mapped repeated Field Engineering work and automated it',
        startsGroup: true
      },
      {
        text: 'Connected AI agents to internal tooling and data'
      },
      {
        text: 'Added evaluation and observability to LLMs, and kept human ownership'
      }
    ]
  },
  {
    id: 'solutions',
    label: 'Customer product gap',
    signal: 'MATCH CONFIRMED / PRODUCT FEEDBACK ATTACHED',
    title: 'Stay technical after the customer call ends.',
    summary:
      'Ran discovery, designed architectures, built demos and proof-of-value work, helped teams implement, and sent the ugly details back to Product.',
    proof: [
      {
        text: 'Led technical discovery and turned vague requirements into architecture'
      },
      {
        text: 'Built demos and proof-of-value / proof-of-concept implementations'
      },
      {
        text: 'Worked with Product, Field Marketing, and open source teams'
      },
      {
        text: 'Delivered and closed across segments: corporate, mid market, enterprise and strategic accounts',
        startsGroup: true
      },
      {
        text: 'Covered markets across Sweden, Finland, UK, Middle East, South-East Europe and Italy',
        startsGroup: true
      }
    ]
  },
  {
    id: 'open-source',
    label: 'Unshared expertise',
    signal: 'MATCH CONFIRMED / BROADCAST ENABLED',
    title: 'Get useful knowledge in (or out) of people’s heads.',
    summary:
      'Worked on Kubernetes Release Engineering, contributed to various CNCF projects upstream, wrote documentation, taught workshops, mentored engineers, and spoke at many open source conferences. Usually with not too many slides.',
    proof: [
      {
        text: 'Contributed to Kubernetes v1.31, v1.32 and led Release Engineering efforts for v1.33 and v1.34'
      },
      {
        text: 'Wrote technical material and delivered talks and workshops around cloud native technology'
      },
      {
        text: 'Mentored engineers mainly to enhance their Platform Engineering knowledge'
      },
      {
        text: 'Run cloud native communities in the Netherlands',
        startsGroup: true
      },
      {
        text: 'Led Developer Relations and Field Engineering at a YC startup',
        startsGroup: true
      }
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
              <li
                key={item.text}
                className={item.startsGroup ? styles.proofGroupStart : undefined}
              >
                <span aria-hidden="true">✓</span>
                {item.text}
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