import styles from '@/app/home.module.css'

interface Benchmark {
  value: string
  label: string
  source: string
  compact?: boolean
}

const benchmarks: Benchmark[] = [
  {
    value: '185%',
    label: 'quota reached at GitHub',
    source: 'Club FY26 winner · Corporate Solutions Engineering, EMEA'
  },
  {
    value: '20–25%',
    label: 'recurring Solutions Engineering work automated',
    source: 'Built for a real internal workflow with human ownership'
  },
  {
    value: '70+',
    label: 'engineers enabled by platform APIs and zero-touch onboarding',
    source: 'Six product teams'
  },
  {
    value: '€10M+',
    label: 'saved during an incident I led as SRE incident commander',
    source: 'Production incident response and recovery',
    compact: true
  },
  {
    value: '0 → 10s',
    label: 'customers brought to early-stage startups',
    source: 'Technical delivery, product work, and go-to-market support',
    compact: true
  },
  {
    value: '500+',
    label: 'learners trained in Platform Engineering and Kubernetes',
    source: '20+ talks · 20+ mentees · 5/5 stars as a mentor'
  }
]

export function Benchmarks() {
  return (
    <section
      id="numbers"
      className={styles.benchmarks}
      aria-labelledby="benchmarks-title"
      data-benchmarks
    >
      <div className={styles.benchmarkIntro}>
        <h2 id="benchmarks-title">Numbers. Yes, I checked them.</h2>
        <p>No fake ARR here. These came from real work.</p>
      </div>
      <div className={styles.report}>
        <div className={styles.primaryBenchmark}>
          <span data-primary-metric>$600K</span>
          <p>ARR reached as a first-time co-founder</p>
          <small>Bootstrapped startup growth.</small>
        </div>
        <dl className={styles.benchmarkList}>
          {benchmarks.map((benchmark) => (
            <div key={benchmark.label}>
              <dt className={benchmark.compact ? styles.compactBenchmarkValue : undefined}>
                {benchmark.value}
              </dt>
              <dd>
                <strong>{benchmark.label}</strong>
                <span>{benchmark.source}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}