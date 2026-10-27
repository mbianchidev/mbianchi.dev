import { isMap, isScalar, parseDocument, Scalar } from 'yaml'
import { siteConfig } from '@/lib/siteConfig'

export interface PreparedBlogPublication {
  content: string
  date: string
}

export function getBlogEditUrl(
  slug: string,
  kind: 'published' | 'draft' = 'published'
) {
  const fileName = `${kind === 'draft' ? '_' : ''}${slug}.md`
  const { url, branch } = siteConfig.repository

  return `${url}/edit/${encodeURIComponent(branch)}/content/blog/${encodeURIComponent(fileName)}`
}

export function prepareBlogPublication(
  source: string,
  now = new Date()
): PreparedBlogPublication {
  const frontMatter = /^(\uFEFF?---\r?\n)([\s\S]*?)(\r?\n---)(?=\r?\n|$)/.exec(source)

  if (!frontMatter) {
    throw new Error('The draft needs fenced YAML front matter before publication')
  }

  const document = parseDocument(frontMatter[2])

  if (document.errors.length > 0) {
    throw new Error(
      `Could not read the draft front matter: ${document.errors.map((error) => error.message).join('; ')}`
    )
  }

  if (!isMap(document.contents)) {
    throw new Error('Draft front matter must be a YAML mapping')
  }

  const date = now.toISOString().slice(0, 10)

  for (const field of ['date', 'updated']) {
    const existing = document.get(field, true)

    if (isScalar(existing)) {
      existing.value = date
      existing.type = Scalar.QUOTE_DOUBLE
    } else {
      const value = new Scalar(date)
      value.type = Scalar.QUOTE_DOUBLE
      document.set(field, value)
    }
  }

  const newline = frontMatter[1].endsWith('\r\n') ? '\r\n' : '\n'
  const metadata = document.toString({ lineWidth: 0 })
    .replace(/\r?\n$/, '')
    .replace(/\r?\n/g, newline)

  return {
    date,
    content: `${frontMatter[1]}${metadata}${frontMatter[3]}${source.slice(frontMatter[0].length)}`,
  }
}
