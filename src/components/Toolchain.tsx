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

type IntegrationGroupStyle = CSSProperties & {
  '--group-tiles': number
}

const markSizeClass: Record<IntegrationMarkSize, string | undefined> = {
  square: undefined,
  wide: styles.integrationMarkWide,
  wordmark: styles.integrationMarkWordmark,
}

// Matches --integration-columns in home.module.css for the desktop layout.
const desktopColumns = 8

// Packs groups, in order, into rows of at most one desktop row of tiles. Larger groups get a
// row to themselves and wrap their subcategories inside it.
function getIntegrationRows(groups: IntegrationGroup[]) {
  const rows: IntegrationGroup[][] = []
  let rowTiles = desktopColumns

  for (const group of groups) {
    const tiles = countGroupIntegrations(group)
    if (rowTiles + tiles > desktopColumns) {
      rows.push([group])
      rowTiles = tiles
    } else {
      rows[rows.length - 1]!.push(group)
      rowTiles += tiles
    }
  }

  return rows
}

const integrationRows = getIntegrationRows(integrationGroups)

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
          Cloud-native tools follow the CNCF landscape, because I have stared at that map for
          years. Platform, SRE, and AI tools get their own shelves. Everything else ships at the
          bottom.
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
          {integrationRows.map((row) => (
            <div key={row[0]!.id} className={styles.integrationRow}>
              {row.map((group) => (
                <details
                  key={group.id}
                  open
                  className={styles.integrationGroup}
                  data-integration-group={group.id}
                  data-landscape={group.landscape}
                  style={{ '--group-tiles': countGroupIntegrations(group) } as IntegrationGroupStyle}
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
          ))}
        </div>
      </div>
    </section>
  )
}
