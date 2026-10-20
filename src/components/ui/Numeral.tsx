import styles from './Numeral.module.css'

/**
 * A huge, faint section index drifting behind the content — solid, lit from the top left, with a stepped extrusion.
 * The outer span is what scroll parallax moves (GSAP); the inner span carries the 3D pose. Decorative.
 */
export function Numeral({ children, side = 'right' }: { children: string; side?: 'left' | 'right' }) {
  return (
    <span className={styles.numeral} data-side={side} data-numeral aria-hidden="true">
      <span className={styles.glyph}>{children}</span>
    </span>
  )
}
