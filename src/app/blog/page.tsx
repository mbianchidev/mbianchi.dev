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
import innerStyles from '@/app/inner.module.css'
import styles from './blog.module.css'

export const metadata = createPageMetadata({
  title: 'Field Notes — Matteo',
  description: 'Cloud-native field notes, technical essays, and lessons from production.',
  path: '/blog/',
})

function dateFromPost(date: string) {
  return new Date(`${date}T00:00:00Z`)
}

function formatDate(date: string) {
  return dateFromPost(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatMonthYear(date: string) {
  return dateFromPost(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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
  priority?: boolean
}

function PostCover({ post, className, sizes, priority = false }: PostCoverProps) {
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
      priority={priority}
    />
  )
}

export default function BlogPage() {
  const posts = getSortedPostsData()
  const [featuredPost, ...otherPosts] = posts
  const deskPosts = otherPosts.slice(0, 4)
  const [deskFeature, ...deskRail] = deskPosts
  const firstPostByCategory = new Map<string, string>()
  const categoryCounts = new Map<string, number>()

  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1)

    if (!firstPostByCategory.has(post.category)) {
      firstPostByCategory.set(post.category, post.slug)
    }
  }

  const categories = [...categoryCounts.entries()].sort(([categoryA], [categoryB]) =>
    categoryA.localeCompare(categoryB)
  )
  const firstPublishedYear = posts.at(-1)?.date.slice(0, 4)

  return (
    <div className={styles.blogPage}>
      <PageHero
        path="/blog"
        title="Field notes from the workbench."
        description="Essays on building systems, growing technical communities, surviving conferences, and learning in public."
        tone="light"
        actions={
          featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className={innerStyles.darkButton}>
              Read the latest field note
              <span aria-hidden="true">↗</span>
            </Link>
          )
        }
        aside={
          <dl className={innerStyles.heroSpecs}>
            <div>
              <dt>Archive</dt>
              <dd>{posts.length} field notes</dd>
            </div>
            <div>
              <dt>Coverage</dt>
              <dd>{categories.length} subjects</dd>
            </div>
            <div>
              <dt>Latest issue</dt>
              <dd>{featuredPost ? formatMonthYear(featuredPost.date) : 'Pending'}</dd>
            </div>
            <div>
              <dt>Publishing since</dt>
              <dd>{firstPublishedYear ?? 'Soon'}</dd>
            </div>
          </dl>
        }
      />

      {featuredPost ? (
        <section className={styles.leadSection} aria-label="Latest field note">
          <div className={styles.sectionLabel}>
            <span>Latest field note</span>
            <span>Edition {String(posts.length).padStart(3, '0')}</span>
          </div>
          <article className={styles.leadStory}>
            <div className={styles.leadMarker} aria-hidden="true">
              <span>Latest</span>
              <strong>{featuredPost.date.slice(0, 4)}</strong>
            </div>
            <div className={styles.leadBody}>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className={styles.leadMedia}
              >
                <PostCover
                  post={featuredPost}
                  className={styles.coverImage}
                  sizes="(max-width: 980px) 100vw, 44vw"
                  priority
                />
              </Link>
              <div className={styles.leadCopy}>
                <div className={styles.storyMeta}>
                  <span>{featuredPost.category}</span>
                  <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 id="latest-note">{featuredPost.title}</h2>
                <p>{makeExcerpt(featuredPost, 250)}</p>
                <Link href={`/blog/${featuredPost.slug}`}>
                  Read the latest field note
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className={styles.emptyState} aria-labelledby="empty-blog">
          <h2 id="empty-blog">The first field note is still on the workbench.</h2>
          <p>New writing will appear here when it is ready to ship.</p>
        </section>
      )}

      {deskPosts.length > 0 && (
        <section className={styles.readingDesk} aria-labelledby="reading-desk">
          <div className={styles.sectionHeading}>
            <h2 id="reading-desk">The reading desk.</h2>
            <p>
              The newest arguments, post-mortems, guides, and annual dispatches,
              selected from the top of the stack.
            </p>
          </div>
          <div className={styles.deskGrid}>
            {deskFeature && (
              <article className={styles.deskFeature}>
                <Link
                  href={`/blog/${deskFeature.slug}`}
                  className={styles.deskFeatureMedia}
                >
                  <PostCover
                    post={deskFeature}
                    className={styles.coverImage}
                    sizes="(max-width: 980px) 100vw, 52vw"
                  />
                </Link>
                <div className={styles.deskFeatureCopy}>
                  <div className={styles.storyMeta}>
                    <span>{deskFeature.category}</span>
                    <time dateTime={deskFeature.date}>{formatDate(deskFeature.date)}</time>
                  </div>
                  <h3>{deskFeature.title}</h3>
                  <p>{makeExcerpt(deskFeature, 190)}</p>
                  <Link
                    href={`/blog/${deskFeature.slug}`}
                    aria-label={`Read ${deskFeature.title}`}
                  >
                    <span>{deskFeature.readTime}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            )}
            <div className={styles.deskRail}>
              {deskRail.map((post) => (
                <article key={post.slug} className={styles.deskRow}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.deskRowMedia}
                  >
                    <PostCover
                      post={post}
                      className={styles.coverImage}
                      sizes="(max-width: 700px) 38vw, 140px"
                    />
                  </Link>
                  <div className={styles.storyMeta}>
                    <span>{post.category}</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <h3>{post.title}</h3>
                  <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                    <span>{post.readTime}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <nav className={styles.topicDirectory} aria-label="Browse field notes by topic">
          <h2>Follow the thread, not the algorithm.</h2>
          <div className={styles.topicList}>
            {categories.map(([category, count]) => (
              <a key={category} href={`#topic-${slugify(category)}`}>
                <span>{category}</span>
                <span>
                  {count} {count === 1 ? 'note' : 'notes'} ↓
                </span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {posts.length > 0 && (
        <section className={styles.archive} aria-labelledby="archive-title">
          <div className={styles.sectionHeading}>
            <h2 id="archive-title">The complete archive.</h2>
            <p>Newest first. No paywall, no newsletter gate, no engagement bait.</p>
          </div>
          <div className={styles.archiveList}>
            {posts.map((post, index) => {
              const isCategoryAnchor = firstPostByCategory.get(post.category) === post.slug

              return (
                <article
                  key={post.slug}
                  id={isCategoryAnchor ? `topic-${slugify(post.category)}` : undefined}
                  className={styles.archiveRow}
                  data-blog-slug={post.slug}
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
