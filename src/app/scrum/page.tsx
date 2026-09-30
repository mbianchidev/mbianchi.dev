import ShortLinkPage, { shortLinkMetadata } from '@/components/ShortLinkPage'

export const metadata = shortLinkMetadata

export default function ScrumShortLink() {
  return <ShortLinkPage source="/scrum" />
}
