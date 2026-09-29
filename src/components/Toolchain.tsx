import Image from 'next/image'
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
  if (logo.kind === 'image') {
    return (
      <Image
        data-integration-logo
        aria-hidden="true"
        src={logo.src}
        alt=""
        width={28}
        height={28}
        className={`${styles.integrationMark} ${styles.integrationImageMark}`}
        loading="eager"
      />
    )
  }

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
          Current and previous tools across cloud native, delivery,
          observability, and software. Some are daily drivers. Some are proof
          the migration happened.
        </p>
      </div>
      <div
        className={styles.integrationPanel}
        data-integration-panel
        data-integration-count={integrationCount}
      >
        <div className={styles.integrationPanelMeta}>
          <code>matteo.integrations</code>
          <span>{integrationCount} technologies loaded</span>
        </div>
        {integrationGroups.map((group) => (
          <details
            key={group.id}
            open
            className={styles.integrationGroup}
            data-integration-group={group.id}
          >
            <summary className={styles.integrationGroupSummary}>
              <span className={styles.integrationGroupTitle}>{group.title}</span>
              <span>{group.items.length} loaded</span>
              <span className={styles.integrationDisclosure} aria-hidden="true" />
            </summary>
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
          </details>
        ))}
      </div>
    </section>
  )
}