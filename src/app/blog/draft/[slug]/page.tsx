import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogArticle } from '@/components/BlogArticle'
import { PageHero } from '@/components/PageHero'
import { getAllDraftSlugs, getDraftPostData } from '@/lib/markdown'
import { BlogDraftGate } from '../BlogDraftGate'
import { DraftPublishAction } from '../DraftPublishAction'
import styles from '@/app/inner.module.css'

interface BlogDraftPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export const metadata: Metadata = {
  title: 'Blog draft preview',
  description: null,
  alternates: null,
  openGraph: null,
  twitter: null,
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return getAllDraftSlugs().map((slug) => ({ slug }))
}

export default async function BlogDraftPage({ params }: BlogDraftPageProps) {
  const { slug } = await params
  const post = await getDraftPostData(slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogDraftGate key={slug}>
      <div className={styles.page}>
        <PageHero
          path={`/blog/draft/${post.slug}`}
          title={post.title}
          description={post.excerpt}
          actions={
            <Link href="/blog" className={styles.secondaryButton}>
              Back to the blog
            </Link>
          }
        />
        <BlogArticle content={post.content} />
        <DraftPublishAction slug={post.slug} source={post.source} />
      </div>
    </BlogDraftGate>
  )
}
