import styles from '@/app/home.module.css'

const benchmarks = [
  {
    value: '180%',
    label: 'quota reached at GitHub',
    source: 'Club FY26 winner · Corporate Solutions Engineering, EMEA'
  },
  {
    value: '70+',
    label: 'engineers enabled by platform APIs and zero-touch onboarding',
    source: 'Six product teams'
  },
  {
    value: '500+',
    label: 'learners trained in Platform Engineering and Kubernetes',
    source: '20+ talks · 20+ mentees · 5/5 stars as a mentor'
  }
]

export function Benchmarks() {
  return (
    <section className={styles.benchmarks} aria-labelledby="benchmarks-title">
      <div className={styles.benchmarkIntro}>
        <h2 id="benchmarks-title">Some numbers I can actually defend.</h2>
        <p>No fictional ARR. Just work that happened.</p>
      </div>
      <div className={styles.report}>
        <div className={styles.primaryBenchmark}>
          <span>20–25%</span>
          <p>recurring Solutions Engineering work automated</p>
          <small>Built for a real internal workflow. Humans still own the decisions and the customer.</small>
        </div>
        <dl className={styles.benchmarkList}>
          {benchmarks.map((benchmark) => (
            <div key={benchmark.label}>
              <dt>{benchmark.value}</dt>
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