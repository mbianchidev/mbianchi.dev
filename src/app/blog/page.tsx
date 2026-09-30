import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import type { BlogPostMetadata } from '@/lib/markdown'
import { getSortedPostsData } from '@/lib/markdown'
import {
  createPageMetadata,
  getSocialImageDefinition,
  withBasePath,
} from '@/lib/siteMetadata'
import { BlogArchiveSearch } from './BlogArchiveSearch'
import styles from './blog.module.css'

export const metadata = createPageMetadata({
  title: 'Debugging Notes — Matteo',
  description: 'Technical posts, conference survival guides, open-source rants, and whatever else Matteo felt like writing.',
  path: '/blog/',
})

function dateFromPost(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`)
}

function formatDate(date: string) {
  return dateFromPost(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function makeExcerpt(post: BlogPostMetadata, maxLength = 210) {
  const title = post.title
    .replace(/[\u00a0\u2009\u200a\u200b\u202f\u205f\u3000]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  let excerpt = post.excerpt
    .replace(/[\u00a0\u2009\u200a\u200b\u202f\u205f\u3000]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/([.!?])(?=[A-Z])/g, '$1 ')
    .trim()

  if (excerpt.toLowerCase().startsWith(title.toLowerCase())) {
    excerpt = excerpt.slice(title.length).replace(/^[\s:—-]+/, '')
  }

  if (excerpt.length <= maxLength) {
    return excerpt
  }

  const shortened = excerpt.slice(0, maxLength)
  const lastSpace = shortened.lastIndexOf(' ')

  return `${shortened.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : maxLength).trim()}…`
}

interface PostCoverProps {
  post: BlogPostMetadata
  className: string
  sizes: string
}

function PostCover({ post, className, sizes }: PostCoverProps) {
  const image = getSocialImageDefinition(post.image, post.imageAlt)

  if (!image.width || !image.height) {
    throw new Error(`Blog post "${post.slug}" requires image dimensions`)
  }

  return (
    <Image
      src={withBasePath(image.src)}
      alt={image.alt ?? post.imageAlt}
      width={image.width}
      height={image.height}
      className={className}
      sizes={sizes}
    />
  )
}

export default function BlogPage() {
  const posts = getSortedPostsData()
  const categoryCounts = new Map<string, number>()

  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1)
  }

  const categories = [...categoryCounts.entries()].sort(([categoryA], [categoryB]) =>
    categoryA.localeCompare(categoryB)
  )
  const topics = categories.map(([label, count]) => ({
    id: slugify(label),
    label,
    count,
  }))

  return (
    <div className={styles.blogPage}>
      <PageHero
        path="/blog"
        title="Debugging notes."
        description="Some posts go deep. Some stay shallow. Sometimes they are technical too."
        tone="light"
      />

      {posts.length === 0 && (
        <section className={styles.emptyState} aria-labelledby="empty-blog">
          <h2 id="empty-blog">No posts yet. That would be awkward.</h2>
          <p>Give me a minute.</p>
        </section>
      )}

      {posts.length > 0 && (
        <section className={styles.archive} aria-labelledby="archive-title">
          <div className={styles.sectionHeading}>
            <h2 id="archive-title">Some useful posts, some angry, some both.</h2>
            <p>Newest first. No paywall. I am not starting a newsletter.</p>
          </div>
          <BlogArchiveSearch topics={topics} total={posts.length} />
          <div className={styles.archiveList}>
            {posts.map((post, index) => {
              return (
                <article
                  key={post.slug}
                  className={styles.archiveRow}
                  data-blog-slug={post.slug}
                  data-blog-topic={slugify(post.category)}
                  data-blog-search={[
                    post.title,
                    post.excerpt,
                    post.category,
                    ...(post.tags ?? []),
                  ].join(' ').toLowerCase()}
                >
                  <div className={styles.archiveNumber}>
                    {String(posts.length - index).padStart(3, '0')}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.archiveMedia}
                  >
                    <PostCover
                      post={post}
                      className={styles.coverImage}
                      sizes="(max-width: 700px) calc(100vw - 82px), (max-width: 980px) 150px, 180px"
                    />
                  </Link>
                  <div className={styles.archiveDate}>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>{post.category}</span>
                  </div>
                  <div className={styles.archiveTitle}>
                    <h3>{post.title}</h3>
                    <p>{makeExcerpt(post, 130)}</p>
                  </div>
                  <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                    <span>{post.readTime}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
