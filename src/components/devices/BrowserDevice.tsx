import type { CSSProperties } from 'react'
import type { ResolvedImage } from '../../content/projects'
import styles from './BrowserDevice.module.css'

interface Props {
  image: ResolvedImage
  alt: string
  /** The text shown in the address pill. Use the real host for live apps. */
  label: string
  /** Show a lock glyph (only for real https hosts). */
  secure?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  style?: CSSProperties
  decorative?: boolean
}

const LAYERS = Array.from({ length: 7 }, (_, i) => i)

/** A desktop browser window as a slab: window chrome, the real screenshot as content, thickness layers and a glare. Size via `--w`. */
export function BrowserDevice({ image, alt, label, secure, priority, sizes = '(min-width: 900px) 52vw, 94vw', className, style, decorative }: Props) {
  return (
    <div className={[styles.browser, className].filter(Boolean).join(' ')} style={style} {...(decorative ? { 'aria-hidden': true } : {})}>
      <div className={styles.body}>
        {LAYERS.map((i) => (
          <i key={i} className={styles.layer} style={{ transform: `translateZ(${-(i + 1) * 1.8}px)` }} />
        ))}
        <div className={styles.face}>
          <div className={styles.chrome} aria-hidden="true">
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.url}>
              {secure && (
                <svg viewBox="0 0 12 12" width="1em" height="1em" fill="none" aria-hidden="true">
                  <rect x="2" y="5.2" width="8" height="5.4" rx="1.2" fill="currentColor" opacity=".85" />
                  <path d="M4 5.2V3.9a2 2 0 0 1 4 0v1.3" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              )}
              <span>{label}</span>
            </span>
          </div>
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
              {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
            />
            <span className={styles.glare} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
