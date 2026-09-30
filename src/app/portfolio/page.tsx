import ShortLinkPage, { shortLinkMetadata } from '@/components/ShortLinkPage'

export const metadata = shortLinkMetadata

export default function PortfolioRedirect() {
  return <ShortLinkPage source="/portfolio" />
}
