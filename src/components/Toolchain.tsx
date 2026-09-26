import styles from '@/app/home.module.css'

const tools = [
  { name: 'Kubernetes', note: 'orchestration' },
  { name: 'Go', note: 'systems' },
  { name: 'Python', note: 'AI + automation' },
  { name: 'Rust', note: 'systems tooling' },
  { name: 'TypeScript', note: 'products' },
  { name: 'React', note: 'interfaces' },
  { name: 'AWS', note: 'cloud' },
  { name: 'Azure', note: 'cloud' },
  { name: 'Google Cloud', note: 'cloud' },
  { name: 'GitHub', note: 'delivery' },
  { name: 'Docker', note: 'containers' },
  { name: 'OpenTofu', note: 'infrastructure' },
  { name: 'AI agents', note: 'workflow automation' },
  { name: 'MCP', note: 'tool integration' }
]

export function Toolchain() {
  return (
    <section id="integrations" className={styles.toolchain} aria-labelledby="toolchain-title">
      <div className={styles.toolchainLead}>
        <h2 id="toolchain-title">Tools I can use without turning them into a personality.</h2>
        <p>
          I work across cloud, backend, frontend, and AI tooling. I also know
          when Kubernetes is not the answer. Rare, but it happens.
        </p>
      </div>
      <ul className={styles.toolList}>
        {tools.map((tool) => (
          <li key={tool.name}>
            <strong>{tool.name}</strong>
            <span>{tool.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}