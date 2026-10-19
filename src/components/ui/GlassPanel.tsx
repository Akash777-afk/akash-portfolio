import type { HTMLAttributes } from 'react'
import styles from './GlassPanel.module.css'

/** A single translucent layer. Use only where content sits over the 3D stage or other imagery. */
export function GlassPanel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.glass, className].filter(Boolean).join(' ')} {...rest} />
}
