import styles from '@/app/inner.module.css'

interface BlogArticleProps {
  content: string
  editedAt?: Date | null
}

const editedAtFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
})

export function BlogArticle({ content, editedAt }: BlogArticleProps) {
  return (
    <article className={styles.articleSection}>
      <div
        className={styles.prose}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {editedAt ? (
        <p
          className={styles.articleEditHistory}
          aria-label="Article edit history"
        >
          Edited at{' '}
          <time dateTime={editedAt.toISOString()}>
            {editedAtFormatter.format(editedAt)}
          </time>
        </p>
      ) : null}
    </article>
  )
}
