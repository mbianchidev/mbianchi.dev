import adobeLogo from '@/assets/logos/adobe.svg'
import amazonLogo from '@/assets/logos/amazon.svg'
import Image from 'next/image'
import anthropicLogo from '@/assets/logos/anthropic.svg'
import appleLogo from '@/assets/logos/apple.svg'
import ederaLogo from '@/assets/logos/edera.svg'
import githubLogo from '@/assets/logos/github.svg'
import googleLogo from '@/assets/logos/google.svg'
import metaLogo from '@/assets/logos/meta.svg'
import microsoftLogo from '@/assets/logos/microsoft.svg'
import netflixLogo from '@/assets/logos/netflix.svg'
import nvidiaLogo from '@/assets/logos/nvidia.svg'
import openAiLogo from '@/assets/logos/openai.svg'
import replitLogo from '@/assets/logos/replit.svg'
import teslaLogo from '@/assets/logos/tesla.svg'
import uberLogo from '@/assets/logos/uber.svg'
import styles from '@/app/home.module.css'

const companies = [
  { name: 'GitHub', logo: githubLogo },
  { name: 'Google', logo: googleLogo },
  { name: 'Microsoft', logo: microsoftLogo },
  { name: 'Uber', logo: uberLogo },
  { name: 'Amazon', logo: amazonLogo },
  { name: 'Meta', logo: metaLogo },
  { name: 'Apple', logo: appleLogo },
  { name: 'Netflix', logo: netflixLogo },
  { name: 'Tesla', logo: teslaLogo },
  { name: 'NVIDIA', logo: nvidiaLogo },
  { name: 'Adobe', logo: adobeLogo },
  { name: 'Edera', logo: ederaLogo },
  { name: 'Replit', logo: replitLogo },
  { name: 'OpenAI', logo: openAiLogo },
  { name: 'Anthropic', logo: anthropicLogo },
]

function LogoGroup({ decorative = false }: { decorative?: boolean }) {
  return (
    <ul className={styles.logoGroup} aria-hidden={decorative || undefined}>
      {companies.map((company) => (
        <li key={company.name} className={styles.logoCell}>
          <Image
            src={company.logo}
            alt={decorative ? '' : company.name}
            width={150}
            height={72}
            className={styles.companyLogo}
            loading="eager"
          />
        </li>
      ))}
    </ul>
  )
}

export function TrustedBy() {
  return (
    <section className={styles.lovedBy} aria-labelledby="loved-by-title">
      <div className={styles.lovedByHeader}>
        <h2 id="loved-by-title">Worked with people at</h2>
        <p>
          People from these companies have hired Matteo, worked with him, learned
          from him, or built community alongside him. No endorsement implied.
          Legal can relax.
        </p>
      </div>
      <div className={styles.logoRunway}>
        <div className={styles.logoTrack}>
          <LogoGroup />
          <LogoGroup decorative />
        </div>
      </div>
    </section>
  )
}
