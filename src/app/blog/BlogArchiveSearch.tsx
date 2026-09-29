'use client'

import { useEffect, useId, useState } from 'react'
import styles from './blog.module.css'

interface TopicFilter {
  id: string
  label: string
  count: number
}

interface BlogArchiveSearchProps {
  topics: TopicFilter[]
  total: number
}

export function BlogArchiveSearch({ topics, total }: BlogArchiveSearchProps) {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [activeTopic, setActiveTopic] = useState('all')
  const [resultCount, setResultCount] = useState(total)

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const rows = [...document.querySelectorAll<HTMLElement>('[data-blog-search]')]
    let visible = 0

    for (const row of rows) {
      const matchesQuery =
        normalizedQuery === ''
        || (row.dataset.blogSearch ?? '').includes(normalizedQuery)
      const matchesTopic =
        activeTopic === 'all'
        || row.dataset.blogTopic === activeTopic
      const matches = matchesQuery && matchesTopic

      row.hidden = !matches
      if (matches) {
        visible += 1
      }
    }

    setResultCount(visible)
  }, [activeTopic, query])

  return (
    <div className={styles.searchPanel} role="search">
      <label className={styles.searchLabel} htmlFor={inputId}>
        Search blog posts
      </label>
      <div className={styles.searchRow}>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder="Search a topic. We probably have an opinion"
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
        />
        <output htmlFor={inputId} aria-live="polite">
          {resultCount} {resultCount === 1 ? 'post' : 'posts'}
        </output>
      </div>
      <div className={styles.topicFilters} role="group" aria-label="Filter posts by topic">
        <button
          type="button"
          data-blog-topic-filter="all"
          aria-pressed={activeTopic === 'all'}
          onClick={() => setActiveTopic('all')}
        >
          All topics
          <span>{total}</span>
        </button>
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            data-blog-topic-filter={topic.id}
            aria-pressed={activeTopic === topic.id}
            onClick={() => setActiveTopic(topic.id)}
          >
            {topic.label}
            <span>{topic.count}</span>
          </button>
        ))}
      </div>
      <p className={styles.noResults} hidden={resultCount !== 0}>
        No posts match that search. The opinion may still be loading.
      </p>
    </div>
  )
}
