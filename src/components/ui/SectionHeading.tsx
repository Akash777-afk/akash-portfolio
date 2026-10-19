import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

interface Props {
  eyebrow: string
  title: ReactNode
  id?: string
  lead?: ReactNode
  as?: 'h1' | 'h2'
}

export function SectionHeading({ eyebrow, title, id, lead, as: Tag = 'h2' }: Props) {
  return (
    <header className={styles.heading}>
      <p className={styles.eyebrow}>
        <span className={styles.tick} aria-hidden="true" />
        {eyebrow}
      </p>
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  )
}
