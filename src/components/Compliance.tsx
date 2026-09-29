import Image, { type StaticImageData } from 'next/image'
import aicpaLogo from '@/assets/compliance/aicpa.png'
import cisLogo from '@/assets/compliance/cis.svg'
import europeanUnionLogo from '@/assets/compliance/european-union.svg'
import fedRampLogo from '@/assets/compliance/fedramp.png'
import hhsLogo from '@/assets/compliance/hhs.svg'
import isoLogo from '@/assets/compliance/iso.svg'
import nistLogo from '@/assets/compliance/nist.svg'
import openSsfLogo from '@/assets/compliance/openssf.svg'
import owaspLogo from '@/assets/compliance/owasp.svg'
import pciLogo from '@/assets/compliance/pci-ssc.svg'
import styles from '@/app/home.module.css'

interface ComplianceFramework {
  id: string
  logo: StaticImageData
  name: string
  wide?: boolean
}

const frameworks: ComplianceFramework[] = [
  {
    id: 'gdpr',
    logo: europeanUnionLogo,
    name: 'General Data Protection Regulation',
  },
  {
    id: 'soc-2',
    logo: aicpaLogo,
    name: 'Service Organization Control 2',
    wide: true,
  },
  {
    id: 'iso-27001',
    logo: isoLogo,
    name: 'ISO/IEC 27001',
  },
  {
    id: 'fedramp',
    logo: fedRampLogo,
    name: 'Federal Risk and Authorization Management Program',
    wide: true,
  },
  {
    id: 'hipaa',
    logo: hhsLogo,
    name: 'Health Insurance Portability and Accountability Act',
    wide: true,
  },
  {
    id: 'pci-dss',
    logo: pciLogo,
    name: 'Payment Card Industry Data Security Standard',
    wide: true,
  },
  {
    id: 'nist-csf',
    logo: nistLogo,
    name: 'NIST Cybersecurity Framework',
    wide: true,
  },
  {
    id: 'cis-controls',
    logo: cisLogo,
    name: 'CIS Controls and Benchmarks',
    wide: true,
  },
  {
    id: 'dora',
    logo: europeanUnionLogo,
    name: 'Digital Operational Resilience Act',
  },
  {
    id: 'nis2',
    logo: europeanUnionLogo,
    name: 'Network and Information Systems Directive',
  },
  {
    id: 'slsa',
    logo: openSsfLogo,
    name: 'Supply-chain Levels for Software Artifacts',
    wide: true,
  },
  {
    id: 'owasp-asvs',
    logo: owaspLogo,
    name: 'Application Security Verification Standard',
    wide: true,
  },
]

export function Compliance() {
  return (
    <section
      className={styles.compliance}
      data-compliance
      aria-labelledby="compliance-title"
    >
      <div className={styles.complianceInner}>
        <div className={styles.complianceLead}>
          <h2 id="compliance-title">Compliance boundaries.</h2>
        </div>
        <ul className={styles.complianceGrid} data-compliance-grid>
          {frameworks.map((framework) => (
            <li
              key={framework.id}
              data-compliance-framework={framework.id}
              aria-label={framework.name}
              title={framework.name}
            >
              <Image
                src={framework.logo}
                alt=""
                width={160}
                height={64}
                className={`${styles.complianceLogo} ${framework.wide ? styles.complianceLogoWide : ''}`}
                data-compliance-mark
                aria-hidden="true"
                loading="eager"
              />
              <span className={styles.complianceTooltip} aria-hidden="true">
                {framework.name}
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.complianceDisclaimer} data-compliance-disclaimer>
          These marks describe design constraints and customer requirements.
          They do not claim certification, attestation, authorization, or legal
          advice.
        </p>
      </div>
    </section>
  )
}
