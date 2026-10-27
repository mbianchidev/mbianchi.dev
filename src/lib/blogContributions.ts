import { siteConfig } from '@/lib/siteConfig'

export function getBlogEditUrl(slug: string) {
  const fileName = `${slug}.md`
  const { url, branch } = siteConfig.repository

  return `${url}/edit/${encodeURIComponent(branch)}/content/blog/${encodeURIComponent(fileName)}`
}
