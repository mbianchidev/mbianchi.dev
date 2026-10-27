import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import { parseFrontMatter } from '@/lib/frontMatter'
import {
  isSocialImageKey,
} from '@/lib/siteConfig'
import {
  getGeneratedBlogSocialImage,
  isLocalBlogImageReference,
  isPublishedBlogPostFile,
  resolveLocalBlogImage,
} from '@/lib/blogSocialImages'
import type { SocialImageSource } from '@/lib/siteMetadata'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPostMetadata {
  title: string
  date: string
  author: string
  category: string
  excerpt: string
  slug: string
  image: SocialImageSource
  imageAlt: string
  updated?: string
  editedAt: string | null
  tags?: string[]
  readTime?: string
}

export interface BlogPostData extends BlogPostMetadata {
  content: string
}

export interface BlogDraftData {
  slug: string
  title: string
  excerpt: string
  content: string
  source: string
}

function requiredString(
  data: Record<string, unknown>,
  field: string,
  fileName: string
) {
  const value = data[field]

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Blog post "${fileName}" requires a non-empty "${field}" field`)
  }

  return value.trim()
}

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
const dateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/

function hasValidCalendarDate(value: string) {
  const calendarDate = value.slice(0, 10)

  if (!dateOnlyPattern.test(calendarDate)) {
    return false
  }

  return new Date(`${calendarDate}T00:00:00.000Z`).toISOString().slice(0, 10) === calendarDate
}

export function parseBlogDate(value: string) {
  const dateOnly = dateOnlyPattern.test(value)
  const dateTime = dateTimePattern.test(value)
  const parsedDate = new Date(dateOnly ? `${value}T00:00:00.000Z` : value)

  if (
    (!dateOnly && !dateTime)
    || !hasValidCalendarDate(value)
    || Number.isNaN(parsedDate.getTime())
  ) {
    throw new Error(`Invalid blog date: ${value}`)
  }

  return parsedDate
}

function validDate(value: string, field: string, fileName: string) {
  try {
    parseBlogDate(value)
  } catch {
    throw new Error(`Blog post "${fileName}" has an invalid "${field}" date: ${value}`)
  }

  return value
}

function validDateTime(value: string, field: string, fileName: string) {
  if (!dateTimePattern.test(value)) {
    throw new Error(
      `Blog post "${fileName}" has an invalid "${field}" timestamp: ${value}`
    )
  }

  return validDate(value, field, fileName)
}

function parseTags(value: unknown, fileName: string) {
  if (value === undefined) {
    return undefined
  }

  if (
    !Array.isArray(value)
    || value.length === 0
    || value.some((tag) => typeof tag !== 'string' || tag.trim() === '')
  ) {
    throw new Error(`Blog post "${fileName}" must use a non-empty string list for "tags"`)
  }

  return value.map((tag) => tag.trim())
}

function parsePostMetadata(
  postFile: string,
  slug: string,
  data: Record<string, unknown>,
  content: string
): BlogPostMetadata {
  const fileName = path.basename(postFile)
  const image = requiredString(data, 'image', fileName)
  let socialImage: SocialImageSource

  if (isSocialImageKey(image)) {
    socialImage = image
  } else if (isLocalBlogImageReference(image)) {
    resolveLocalBlogImage(postFile, image)
    socialImage = getGeneratedBlogSocialImage(slug)
  } else {
    throw new Error(`Blog post "${fileName}" references an unknown social image: ${image}`)
  }

  const date = validDate(requiredString(data, 'date', fileName), 'date', fileName)
  const updatedValue = data.updated
  const updated =
    updatedValue === undefined
      ? undefined
      : validDate(requiredString(data, 'updated', fileName), 'updated', fileName)
  const editedAtValue = data.editedAt
  const editedAt =
    editedAtValue === undefined || editedAtValue === null
      ? null
      : validDateTime(
          requiredString(data, 'editedAt', fileName),
          'editedAt',
          fileName
        )
  const readTimeValue = data.readTime
  const readTime =
    readTimeValue === undefined
      ? calculateReadTime(content)
      : requiredString(data, 'readTime', fileName)
  const tags = parseTags(data.tags, fileName)

  return {
    slug,
    title: requiredString(data, 'title', fileName),
    date,
    author: requiredString(data, 'author', fileName),
    category: requiredString(data, 'category', fileName),
    excerpt: requiredString(data, 'excerpt', fileName),
    image: socialImage,
    imageAlt: requiredString(data, 'imageAlt', fileName),
    ...(updated ? { updated } : {}),
    editedAt,
    ...(tags ? { tags } : {}),
    readTime,
  }
}

export function getSortedPostsData(): BlogPostMetadata[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(isPublishedBlogPostFile)
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = parseFrontMatter(fileContents, fullPath)

      return parsePostMetadata(
        fullPath,
        slug,
        matterResult.data,
        matterResult.content
      )
    })

  return allPostsData.sort(
    (a, b) => parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime()
  )
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(isPublishedBlogPostFile)
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

export function getAllDraftSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  return fs.readdirSync(postsDirectory)
    .filter((fileName) => fileName.startsWith('_') && fileName.endsWith('.md'))
    .map((fileName) => fileName.slice(1, -3))
}

export async function getPostData(slug: string): Promise<BlogPostData | null> {
  if (!getAllPostSlugs().includes(slug)) {
    return null
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = parseFrontMatter(fileContents, fullPath)
  const metadata = parsePostMetadata(
    fullPath,
    slug,
    matterResult.data,
    matterResult.content
  )

  return {
    ...metadata,
    content: await renderPostContent(matterResult.content),
  }
}

export async function getDraftPostData(slug: string): Promise<BlogDraftData | null> {
  if (!getAllDraftSlugs().includes(slug)) {
    return null
  }

  const fileName = `_${slug}.md`
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = parseFrontMatter(fileContents, fullPath)

  return {
    slug,
    title: requiredString(data, 'title', fileName),
    excerpt: requiredString(data, 'excerpt', fileName),
    content: await renderPostContent(content),
    source: fileContents,
  }
}

async function renderPostContent(content: string): Promise<string> {
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(content)

  return processedContent
    .toString()
    .replace(/<img(?![^>]*\bloading=)([^>]*)>/g, '<img loading="lazy" decoding="async"$1>')
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}
