import type { CSSProperties } from 'react'
import type { ResolvedImage } from '../../content/projects'
import styles from './PhoneDevice.module.css'

interface Props {
  image: ResolvedImage
  alt: string
  /** Eager-load and high fetch priority (above-the-fold only). */
  priority?: boolean
  /** Camera punch-hole (off for screens that already contain their own status bar). */
  island?: boolean
  /** Slight zoom to hide edge pixels of an extracted screen. */
  zoom?: number
  sizes?: string
  className?: string
  style?: CSSProperties
  /** Decorative duplicate of a screen shown elsewhere — hidden from assistive technology. */
  decorative?: boolean
}

const LAYERS = Array.from({ length: 11 }, (_, i) => i)

/**
 * A smartphone built from real DOM layers: a rounded body with stacked layers for thickness, side keys, a bezel,
 * the real screenshot as the screen and a moving glare. All pose/rotation comes from the parent (CSS transform),
 * so the same device works in every composition. Size is controlled by the `--w` custom property.
 */
export function PhoneDevice({ image, alt, priority, island = true, zoom = 1, sizes = '(min-width: 900px) 30vw, 60vw', className, style, decorative }: Props) {
  return (
    <div className={[styles.phone, className].filter(Boolean).join(' ')} style={style} {...(decorative ? { 'aria-hidden': true } : {})}>
      <div className={styles.body}>
        {LAYERS.map((i) => (
          <i key={i} className={styles.layer} style={{ transform: `translateZ(${-(i + 1) * 2.2}px)` }} />
        ))}
        <i className={`${styles.key} ${styles.keyPower}`} />
        <i className={`${styles.key} ${styles.keyUp}`} />
        <i className={`${styles.key} ${styles.keyDown}`} />
        <div className={styles.face}>
          <div className={styles.screen} style={{ aspectRatio: `${image.w} / ${image.h}` }}>
            <img
              className={styles.image}
              src={image.small}
              srcSet={image.srcSet}
              sizes={sizes}
              width={image.w}
              height={image.h}
              alt={decorative ? '' : alt}
              decoding="async"
              loading={priority ? 'eager' : 'lazy'}
              style={zoom !== 1 ? { transform: `scale(${zoom})` } : undefined}
              {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
            />
            <span className={styles.glare} aria-hidden="true" />
          </div>
          {island && <span className={styles.island} aria-hidden="true" />}
        </div>
      </div>
    </div>
  )
}
