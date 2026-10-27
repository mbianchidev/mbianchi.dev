'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { PageHero } from '@/components/PageHero'
import inner from '@/app/inner.module.css'
import styles from './draft.module.css'

const previewPassword = 'thereisnocowlevel'

export function BlogDraftGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const passwordInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (unlocked) {
      document.getElementById('main-content')?.focus()
    }
  }, [unlocked])

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (new FormData(event.currentTarget).get('password') !== previewPassword) {
      setIncorrectPassword(true)
      passwordInput.current?.focus()
      return
    }

    setUnlocked(true)
  }

  if (unlocked) {
    return children
  }

  return (
    <div className={inner.page}>
      <PageHero
        path="/blog/draft"
        title="Draft preview."
        description="Not published yet. Enter the password to read it."
      />
      <section className={inner.articleSection} aria-label="Draft preview access">
        <form className={styles.form} onSubmit={unlock}>
          <label htmlFor="draft-password">Preview password</label>
          <input
            ref={passwordInput}
            id="draft-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={incorrectPassword || undefined}
            aria-describedby={incorrectPassword ? 'draft-password-error' : undefined}
            onChange={() => setIncorrectPassword(false)}
          />
          {incorrectPassword ? (
            <p id="draft-password-error" className={styles.error} role="alert">
              Wrong password. Try again.
            </p>
          ) : null}
          <button type="submit" className={inner.primaryButton}>
            Preview draft
          </button>
          <noscript>
            <p>Enable JavaScript to use this preview.</p>
          </noscript>
        </form>
      </section>
    </div>
  )
}
