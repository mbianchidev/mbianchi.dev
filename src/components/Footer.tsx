import Link from 'next/link'
import { BrandLogo } from './BrandLogo'
import styles from './SiteShell.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <Link
            href="/"
            className={styles.footerLogo}
          >
            <BrandLogo />
          </Link>
          <p>
            I build platforms, software, and automation. I also work with customers
            and explain things without a 90-slide deck.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <nav className={styles.footerColumn} aria-label="Product">
            <h3>Product</h3>
            <Link href="/#features">Features</Link>
            <Link href="/#integrations">Integrations</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/roadmap">Changelog</Link>
          </nav>
          <nav className={styles.footerColumn} aria-label="Company">
            <h3>Company</h3>
            <Link href="/portfolio">Open source</Link>
            <Link href="/about">About</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/customers">Customers</Link>
          </nav>
          <nav className={styles.footerColumn} aria-label="Resources">
            <h3>Resources</h3>
            <Link href="/blog">Blog</Link>
            <Link href="/links">Links</Link>
            <Link href="/documentation">Documentation</Link>
            <Link href="/press">Press</Link>
            <Link href="/support">Support</Link>
            <Link href="/status">Status</Link>
          </nav>
          <nav className={styles.footerColumn} aria-label="Contact">
            <h3>Open a ticket</h3>
            <a href="https://github.com/mbianchidev" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/mbianchidev" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://cal.com/mbianchidev/intro" target="_blank" rel="noopener noreferrer">
              Start trial
            </a>
            <a href="mailto:info@mb-consulting.dev">Consulting inquiries</a>
          </nav>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerIdentity}>
          <p>&copy; {currentYear} SyncTune. No vendor lock-in.</p>
          <dl className={styles.businessIdentifiers} aria-label="Business registration details">
            <div>
              <dt>KVK</dt>
              <dd>91602289</dd>
            </div>
            <div>
              <dt>VAT</dt>
              <dd>NL004901960B70</dd>
            </div>
          </dl>
        </div>
        <p>Designed as a product. Operated as a human.</p>
        <p className={styles.legalLinks}>
          <Link href="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/cookies">Cookie Policy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms">Terms of Service</Link>
        </p>
      </div>
    </footer>
  )
}