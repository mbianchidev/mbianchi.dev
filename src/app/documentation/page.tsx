import ShortLinkPage, { shortLinkMetadata } from '@/components/ShortLinkPage'

export const metadata = shortLinkMetadata

export default function DocumentationPage() {
  return <ShortLinkPage source="/documentation" />
}
