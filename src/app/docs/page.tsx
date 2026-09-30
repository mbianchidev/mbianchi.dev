import { WorkInProgress } from '@/components/WorkInProgress'
import { createPageMetadata } from '@/lib/siteMetadata'

export const metadata = createPageMetadata({
  title: 'Docs — Matteo',
  description: 'Guides, source code, blog posts, and the scattered Matteo documentation system.',
  path: '/docs/',
})

export default function DocsPage() {
  return <WorkInProgress page="Documentation" />
}
