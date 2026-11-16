import Image from 'next/image'
import type { CSSProperties } from 'react'
import styles from '@/app/home.module.css'
import {
  countGroupIntegrations,
  integrationCount,
  integrationGroups,
  type IntegrationGroup,
  type IntegrationLogo,
  type IntegrationMarkSize,
} from '@/data/integrations'

type IntegrationItemStyle = CSSProperties & {
  '--integration-color': string
}

type IntegrationAssetStyle = CSSProperties & {
  '--integration-mask': string
}

type IntegrationSubcategoryStyle = CSSProperties & {
  '--integration-span': number
}

const markSizeClass: Record<IntegrationMarkSize, string | undefined> = {
  square: undefined,
  wide: styles.integrationMarkWide,
  wordmark: styles.integrationMarkWordmark,
}

const compactGroupSize = 4

// Small landscape categories share a row in pairs; an unpaired one keeps the full width.
function getCompactGroupIds(groups: IntegrationGroup[]) {
  const compactIds = new Set<string>()
  let pending: string | undefined

  for (const group of groups) {
    if (!group.landscape || countGroupIntegrations(group) > compactGroupSize) {
      pending = undefined
      continue
    }

    if (pending) {
      compactIds.add(pending).add(group.id)
      pending = undefined
    } else {
      pending = group.id
    }
  }

  return compactIds
}

const compactGroupIds = getCompactGroupIds(integrationGroups)

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
        className={[styles.integrationMark, styles.integrationAssetMark, markSizeClass[logo.size]]
          .filter(Boolean)
          .join(' ')}
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
      className={[styles.integrationMark, markSizeClass[logo.size]].filter(Boolean).join(' ')}
      viewBox={logo.viewBox}
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
        <h2 id="toolchain-title">Integrations available</h2>
        <p>
          Sorted the way the CNCF landscape sorts them, because I have stared at that map for
          years. Everything it does not cover ships at the bottom.
        </p>
      </div>
      <div
        className={styles.integrationPanel}
        data-integration-panel
        data-integration-count={integrationCount}
      >
        <div className={styles.integrationPanelMeta}>
          <code>matteo.landscape</code>
          <span>{integrationCount} technologies loaded</span>
        </div>
        <div className={styles.integrationGroups}>
          {integrationGroups.map((group) => (
            <details
              key={group.id}
              open
              className={[
                styles.integrationGroup,
                compactGroupIds.has(group.id) ? styles.integrationGroupCompact : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
              data-integration-group={group.id}
              data-landscape={group.landscape}
            >
              <summary className={styles.integrationGroupSummary}>
                <span className={styles.integrationGroupTitle}>{group.title}</span>
                <span>{countGroupIntegrations(group)} loaded</span>
                <span className={styles.integrationDisclosure} aria-hidden="true" />
              </summary>
              <div className={styles.integrationLandscape}>
                {group.subcategories.map((subcategory) => {
                  const labelId = `integration-${group.id}-${subcategory.id}`

                  return (
                    <div
                      key={subcategory.id}
                      className={styles.integrationSubcategory}
                      data-integration-subcategory={subcategory.id}
                      style={
                        {
                          '--integration-span': subcategory.items.length,
                        } as IntegrationSubcategoryStyle
                      }
                    >
                      <p id={labelId} className={styles.integrationSubcategoryTitle}>
                        {subcategory.title}
                      </p>
                      <ul className={styles.integrationList} aria-labelledby={labelId}>
                        {subcategory.items.map((item) => (
                          <li
                            key={item.id}
                            data-integration={item.id}
                            style={
                              {
                                '--integration-color': item.logo.color,
                              } as IntegrationItemStyle
                            }
                          >
                            <IntegrationMark logo={item.logo} />
                            <span className={styles.integrationName} data-integration-name>
                              {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
