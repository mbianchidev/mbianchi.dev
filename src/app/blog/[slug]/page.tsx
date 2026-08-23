import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { getPostData, getAllPostSlugs, parseBlogDate } from '@/lib/markdown'
import {
  createArticleMetadata,
  createPageMetadata,
} from '@/lib/siteMetadata'
import styles from '@/app/inner.module.css'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostData(slug)

  if (!post) {
    return createPageMetadata({
      title: 'Field Note Not Found — Matteo',
      description: 'The requested field note could not be found.',
      path: '/blog/',
    })
  }

  return createArticleMetadata({
    title: `${post.title} — Matteo`,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    image: post.image,
    imageAlt: post.imageAlt,
    publishedTime: parseBlogDate(post.date).toISOString(),
    ...(post.updated
      ? { modifiedTime: parseBlogDate(post.updated).toISOString() }
      : {}),
    authors: [post.author],
    tags: post.tags ?? [post.category],
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostData(slug)

  if (!post) {
    notFound()
  }

  const published = new Date(
    `${post.date.slice(0, 10)}T00:00:00.000Z`
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className={styles.page}>
      <PageHero
        path={`/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt}
        tone="dark"
        actions={
          <Link href="/blog" className={styles.secondaryButton}>
            <span aria-hidden="true">←</span>
            Back to field notes
          </Link>
        }
        aside={
          <dl className={styles.heroSpecs}>
            <div>
              <dt>Published</dt>
              <dd>{published}</dd>
            </div>
            <div>
              <dt>Author</dt>
              <dd>{post.author}</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>{post.readTime}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{post.category}</dd>
            </div>
          </dl>
        }
      />

      <article className={styles.articleSection}>
        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section className={styles.articleFooter} aria-label="Article navigation">
        <div>
          <p>End of field note.</p>
          <h2>Return to the archive before the next opinion ships.</h2>
        </div>
        <Link href="/blog" className={styles.darkButton}>
          Browse all notes
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  )
}
