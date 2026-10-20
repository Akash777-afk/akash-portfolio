import { useRef, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from 'react'
import styles from './Slab.module.css'

interface Props {
  children: ReactNode
  /** The semantic element of the slab's face (article, div, …). */
  as?: ElementType
  /** Styles the face — the visible card (border, background, padding, radius). */
  className?: string
  /** Classes for the outer perspective wrapper (grid placement, margins). */
  wrapClassName?: string
  /** How many thickness layers sit behind the face. */
  layers?: number
  /** Resting pose in degrees — gives the slab visible edges while it is not hovered. */
  ry?: number
  rx?: number
  /** Maximum pointer tilt in degrees (mouse only). 0 turns it off. */
  tilt?: number
  /** Corner radius shared by the face and its layers. */
  radius?: string
  /** Opt in to the scroll "fly-in" (GSAP, see lib/choreography.ts). */
  fly?: boolean
  style?: CSSProperties
}

/**
 * A card with real thickness: a perspective wrapper, a preserve-3d slab, a few stacked layers behind the face and the face
 * itself — the same construction as the project devices. It rests at a slight angle so its edges show, tilts toward the
 * pointer (mouse only, never on touch or under reduced motion), and flies in with depth as it scrolls into view.
 * Layers are pointer-transparent, so everything inside the face stays clickable and selectable.
 */
export function Slab({ children, as: Tag = 'div', className, wrapClassName, layers = 6, ry = 0, rx = 0, tilt = 4, radius = 'var(--r-3)', fly, style }: Props) {
  const slab = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tilt || event.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = slab.current
    if (!el) return
    const r = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - r.left) / r.width) * 2 - 1
    const py = ((event.clientY - r.top) / r.height) * 2 - 1
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
    })
  }

  const onLeave = () => {
    const el = slab.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.removeProperty('--px')
    el.style.removeProperty('--py')
  }

  const vars = { '--ry': `${ry}deg`, '--rx': `${rx}deg`, '--tilt': tilt, '--radius': radius, ...style } as CSSProperties

  return (
    <div className={[styles.wrap, wrapClassName].filter(Boolean).join(' ')} onPointerMove={onMove} onPointerLeave={onLeave} {...(fly ? { 'data-fly': '' } : {})}>
      <div ref={slab} className={styles.slab} style={vars} data-slab>
        {Array.from({ length: layers }, (_, i) => (
          <i key={i} className={styles.layer} style={{ '--i': i + 1 } as CSSProperties} aria-hidden="true" />
        ))}
        <Tag className={[styles.face, className].filter(Boolean).join(' ')}>{children}</Tag>
      </div>
    </div>
  )
}
