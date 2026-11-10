import { LegalDocument } from '@/components/LegalDocument'
import { createPageMetadata } from '@/lib/siteMetadata'

export const metadata = createPageMetadata({
  title: 'Terms — Matteo',
  description: 'Plain-language terms for using the Matteo portfolio website.',
  path: '/terms/',
})

const sections = [
  {
    title: 'Using the site',
    paragraphs: [
      <>You may browse, share links, inspect the source, and enjoy or ignore the startup parody.</>,
      <>Do not attempt to disrupt the site, misuse its content, or impersonate Matteo using material found here.</>,
    ],
  },
  {
    title: 'Accuracy and satire',
    paragraphs: [
      <>The site mixes real professional evidence with clearly satirical product language. Linked repositories and external records are provided so important claims can be inspected.</>,
      <>Content may change as projects, roles, and public work evolve.</>,
    ],
  },
  {
    id: 'no-scraping',
    title: 'No scraping or job aggregation',
    paragraphs: [
      <>This is my personal portfolio. The career pages describe roles I am looking for, not vacancies at Matteo, SyncTune, or another company. I am not hiring or accepting job applications.</>,
      <>Do not scrape, bulk collect, aggregate, or republish website content without my prior permission. In particular, do not import, index, distribute, or advertise the career pages as job offers. Role titles, locations, responsibilities, and compensation ranges describe my preferences, not an offer of employment.</>,
      <>Reading the site, sharing links, and contacting me about hiring me are welcome. Search engines may crawl the site for ordinary web search, but must respect the noindex instructions on career and role pages. This policy does not change the repository&apos;s source-code license.</>,
    ],
  },
  {
    title: 'External services',
    paragraphs: [
      <>External links and embeds are governed by the terms of their respective providers. This site is not responsible for their availability or content.</>,
    ],
  },
  {
    title: 'No warranty',
    paragraphs: [
      <>The website is provided as-is. Reasonable care is taken, but uninterrupted availability and complete accuracy are not guaranteed.</>,
    ],
  },
  {
    title: 'Liability',
    paragraphs: [
      <>To the extent permitted by law, SyncTune is not liable for indirect loss resulting solely from using or being unable to use this website.</>,
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      <>Questions about these terms can be sent to <a href="mailto:privacy@mb-consulting.dev">privacy@mb-consulting.dev</a>.</>,
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalDocument
      path="/terms"
      title="Terms that fit on one reasonable page."
      description="The rules for using this website, separating the product joke from the inspectable work beneath it."
      summary="Short version: browse responsibly, do not scrape the site, and do not turn my career preferences into job ads. I'm looking for a role, not hiring."
      effectiveDate="November 10, 2026"
      sections={sections}
    />
  )
}
