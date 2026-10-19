import styles from './Ticker.module.css'

/** Slow looping line of disciplines. CSS-only; pauses on hover; static under reduced motion. */
export function Ticker({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
          <span className={styles.dot} aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
