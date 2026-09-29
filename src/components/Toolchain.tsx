import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from '@/app/home.module.css'
import {
  integrationCount,
  integrationGroups,
  type IntegrationLogo,
} from '@/data/integrations'

type IntegrationItemStyle = CSSProperties & {
  '--integration-color': string
}

type IntegrationAssetStyle = CSSProperties & {
  '--integration-mask': string
}

function IntegrationMark({ logo }: { logo: IntegrationLogo }) {
  if (logo.kind === 'asset') {
    return (
      <span
        data-integration-logo
        aria-hidden="true"
        className={`${styles.integrationMark} ${styles.integrationAssetMark} ${logo.wide ? styles.integrationMarkWide : ''}`}
        style={
          {
            '--integration-mask': `url("${logo.src.src}")`,
          } as IntegrationAssetStyle
        }
      />
    )
  }

  return (
    <svg
      data-integration-logo
      aria-hidden="true"
      className={styles.integrationMark}
      viewBox="0 0 24 24"
      focusable="false"
    >
      <path d={logo.icon.path} />
    </svg>
  )
}

export function Toolchain() {
  return (
    <section id="integrations" className={styles.toolchain} aria-labelledby="toolchain-title">
      <div className={styles.toolchainLead}>
        <h2 id="toolchain-title">Tools I can use without turning them into a personality.</h2>
        <p>
          Every mark below appears in the current resume. Some are daily
          drivers. Some are proof the migration happened.
        </p>
        <Link href="/resume" className={styles.inkAction}>
          Inspect resume
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div
        className={styles.integrationPanel}
        data-integration-panel
        data-integration-count={integrationCount}
      >
        <div className={styles.integrationPanelMeta}>
          <code>resume.integrations</code>
          <span>{integrationCount} technologies loaded</span>
        </div>
        {integrationGroups.map((group) => {
          const titleId = `integration-group-${group.id}`

          return (
            <section
              key={group.id}
              className={styles.integrationGroup}
              data-integration-group={group.id}
              aria-labelledby={titleId}
            >
              <div className={styles.integrationGroupHeader}>
                <h3 id={titleId}>{group.title}</h3>
                <span>{group.items.length} loaded</span>
              </div>
              <ul className={styles.integrationList}>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    data-integration={item.name}
                    style={
                      {
                        '--integration-color': item.logo.color,
                      } as IntegrationItemStyle
                    }
                  >
                    <IntegrationMark logo={item.logo} />
                    <strong>{item.name}</strong>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </section>
  )
}