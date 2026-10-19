import type { CSSProperties, ElementType } from 'react'
import styles from './KineticHeading.module.css'

interface Props {
  /** Lines of text; each line is masked and its letters rise in sequence. */
  lines: string[]
  as?: ElementType
  /** Accessible full text (read once, instead of letter by letter). */
  label?: string
  /** Style of line n: 'solid' (off-white), 'lime' (accent) or 'outline'. */
  lineStyles?: ('solid' | 'lime' | 'outline')[]
  className?: string
  delay?: number
}

/**
 * Oversized kinetic type. Pure CSS: letters rise through a mask on load (see the module).
 * The plain text is exposed once via aria-label; the per-letter spans are aria-hidden.
 */
export function KineticHeading({ lines, as: Tag = 'h1', label, lineStyles = [], className, delay = 0.1 }: Props) {
  let index = 0
  return (
    <Tag className={[styles.heading, className].filter(Boolean).join(' ')} aria-label={label ?? lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={line + li} className={[styles.line, lineStyles[li] ? styles[lineStyles[li] as string] : ''].filter(Boolean).join(' ')} aria-hidden="true">
          {Array.from(line).map((ch, ci) => {
            const i = index++
            return (
              <span key={ci} className={styles.char} style={{ '--i': i, '--base': `${delay}s` } as CSSProperties}>
                {ch === ' ' ? ' ' : ch}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
