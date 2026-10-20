import type { CSSProperties } from 'react'
import styles from './DepthFloor.module.css'

/**
 * A decorative perspective floor: a lime grid receding to a horizon at the top of its section. It fades in as the
 * section arrives (scrubbed by GSAP in lib/choreography.ts, via [data-floor]) and is hidden from assistive tech.
 */
export function DepthFloor({ height = '30rem', strength = 1 }: { height?: string; strength?: number }) {
  return (
    <div className={styles.floor} aria-hidden="true" data-floor style={{ height, '--strength': strength } as CSSProperties}>
      <div className={styles.grid} />
    </div>
  )
}
