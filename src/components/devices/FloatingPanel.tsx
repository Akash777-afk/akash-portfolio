import type { CSSProperties } from 'react'
import type { ResolvedImage } from '../../content/projects'
import styles from './FloatingPanel.module.css'

interface Props {
  image: ResolvedImage
  /** Short mono caption naming the real panel, e.g. "Device status". */
  tag: string
  sizes?: string
  className?: string
  style?: CSSProperties
}

/**
 * A real region of a project screenshot lifted off the screen as a floating card — layered analytics depth.
 * Decorative (the full screenshot, with its alt text, is shown in the browser frame), so it is hidden from assistive tech.
 */
export function FloatingPanel({ image, tag, sizes = '(min-width: 900px) 30vw, 60vw', className, style }: Props) {
  return (
    <figure className={[styles.panel, className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
      <img className={styles.image} src={image.small} srcSet={image.srcSet} sizes={sizes} width={image.w} height={image.h} alt="" decoding="async" loading="lazy" />
      <figcaption className={styles.tag}>{tag}</figcaption>
    </figure>
  )
}
