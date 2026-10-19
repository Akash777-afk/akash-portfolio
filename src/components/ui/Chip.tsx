import type { ReactNode } from 'react'
import styles from './Chip.module.css'

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'lime' }) {
  return <span className={`${styles.chip} ${styles[tone]}`}>{children}</span>
}
