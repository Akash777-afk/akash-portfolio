import { useEffect, useRef, useState } from 'react'
import { copyText } from '../../lib/clipboard'
import styles from './CopyButton.module.css'

interface Props {
  text: string
  /** What is being copied, for the accessible name: "Copy email address". */
  what: string
}

/**
 * Copies `text` to the clipboard. Reports the real outcome (including failure) in a polite live region,
 * so the visible label and the announcement never claim success that did not happen.
 */
export function CopyButton({ text, what }: Props) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    const ok = await copyText(text)
    setState(ok ? 'ok' : 'fail')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  return (
    <span className={styles.wrap}>
      <button type="button" className={styles.button} onClick={onClick} aria-label={`Copy ${what}`} data-state={state}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
          {state === 'ok' ? (
            <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <rect x="6.5" y="6.5" width="9" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4.5 12.5v-7a1.8 1.8 0 0 1 1.8-1.8h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </>
          )}
        </svg>
        <span aria-hidden="true">{state === 'ok' ? 'Copied' : state === 'fail' ? 'Failed' : 'Copy'}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'ok' ? `${what} copied to the clipboard.` : state === 'fail' ? `Could not copy the ${what}. Select it manually.` : ''}
      </span>
    </span>
  )
}
