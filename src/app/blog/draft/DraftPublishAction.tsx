'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  getBlogEditUrl,
  prepareBlogPublication,
  type PreparedBlogPublication,
} from '@/lib/blogContributions'
import inner from '@/app/inner.module.css'
import styles from './draft.module.css'

const publishingPassword = '420'

interface DraftPublishActionProps {
  slug: string
  source: string
}

export function DraftPublishAction({ slug, source }: DraftPublishActionProps) {
  const [expanded, setExpanded] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [preparationError, setPreparationError] = useState<string | null>(null)
  const [publication, setPublication] = useState<PreparedBlogPublication | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle')
  const passwordInput = useRef<HTMLInputElement>(null)
  const preparedHeading = useRef<HTMLHeadingElement>(null)
  const copyOperation = useRef(0)

  useEffect(() => {
    if (publication) {
      preparedHeading.current?.focus()
    } else if (expanded) {
      passwordInput.current?.focus()
    }
  }, [expanded, publication])

  function toggle() {
    copyOperation.current += 1
    setExpanded(!expanded)
    setPasswordError(false)
    setPreparationError(null)
    setPublication(null)
    setCopyState('idle')
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (new FormData(event.currentTarget).get('publishing-password') !== publishingPassword) {
      setPasswordError(true)
      passwordInput.current?.focus()
      return
    }

    try {
      setPublication(prepareBlogPublication(source))
      setPreparationError(null)
    } catch (error) {
      console.error('Could not prepare the draft for publication', error)
      setPreparationError(
        'Could not prepare this draft. Check its YAML front matter and try again.'
      )
    }
  }

  async function copyMarkdown(prepared: PreparedBlogPublication) {
    const operation = ++copyOperation.current
    setCopyState('copying')

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('The Clipboard API is unavailable')
      }

      await navigator.clipboard.writeText(prepared.content)
      if (operation === copyOperation.current) {
        setCopyState('copied')
      }
    } catch (error) {
      console.error('Could not copy the prepared Markdown', error)
      if (operation === copyOperation.current) {
        setCopyState('failed')
      }
    }
  }

  return (
    <section className={inner.sectionDark} aria-labelledby="draft-publishing-title">
      <div className={styles.publishing}>
        <h2 id="draft-publishing-title">Draft publishing</h2>
        <p>Nothing goes live here. Prepare the changes, then open a PR on GitHub.</p>
        <button
          type="button"
          className={expanded ? inner.secondaryButton : inner.primaryButton}
          aria-expanded={expanded}
          aria-controls="draft-publishing-controls"
          onClick={toggle}
        >
          Publish draft
        </button>
        <div
          id="draft-publishing-controls"
          className={styles.publishingControls}
          hidden={!expanded}
        >
          {expanded && !publication ? (
            <form className={styles.form} onSubmit={prepare}>
              <label htmlFor="publishing-password">Publishing password</label>
              <input
                ref={passwordInput}
                id="publishing-password"
                name="publishing-password"
                type="password"
                autoComplete="off"
                required
                aria-invalid={passwordError || undefined}
                aria-describedby={passwordError ? 'publishing-password-error' : undefined}
                onChange={() => setPasswordError(false)}
              />
              {passwordError ? (
                <p id="publishing-password-error" className={styles.error} role="alert">
                  Wrong publishing password. Try again.
                </p>
              ) : null}
              {preparationError ? <p role="alert">{preparationError}</p> : null}
              <button type="submit" className={inner.primaryButton}>
                Prepare publishing PR
              </button>
            </form>
          ) : null}
          {publication ? (
            <>
              <h3 ref={preparedHeading} tabIndex={-1}>Ready for GitHub.</h3>
              <p>
                Sets <code>date</code> and <code>updated</code> to{' '}
                <time dateTime={publication.date}>{publication.date}</time> (UTC).
              </p>
              <ol>
                <li>Copy or download the prepared Markdown.</li>
                <li>
                  Open the GitHub editor, rename <code>_{slug}.md</code> to{' '}
                  <code>{slug}.md</code>, and replace its contents.
                </li>
                <li>
                  Commit to a new branch and open a pull request. Do not commit to main.
                  Check any remaining placeholders before submitting.
                </li>
              </ol>
              <div className={styles.publishingActions}>
                <button
                  type="button"
                  className={inner.primaryButton}
                  disabled={copyState === 'copying'}
                  onClick={() => copyMarkdown(publication)}
                >
                  {copyState === 'copying' ? 'Copying Markdown...' : 'Copy Markdown'}
                </button>
                <a
                  href={getBlogEditUrl(slug, 'draft')}
                  className={inner.secondaryButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open GitHub editor
                </a>
                <a
                  href={`data:text/markdown;charset=utf-8,${encodeURIComponent(publication.content)}`}
                  download={`${slug}.md`}
                  className={inner.secondaryButton}
                >
                  Download Markdown
                </a>
              </div>
              <p className={styles.copyStatus} role="status">
                {copyState === 'copied'
                  ? 'Markdown copied. Paste it into the GitHub editor.'
                  : ''}
              </p>
              {copyState === 'failed' ? (
                <p role="alert">
                  Could not copy the Markdown. Download it instead.
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
