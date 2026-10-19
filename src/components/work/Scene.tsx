import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import styles from './Scene.module.css'

interface SceneProps {
  /** width / height of the scene box */
  aspect: number
  /** Accessible name of the whole device composition */
  label: string
  children: ReactNode
  /** Where a click on the composition goes (the project's primary destination). Omit for non-clickable scenes. */
  href?: string
  /** Visible hint shown on hover/focus, e.g. "Open live app". */
  hint?: string
}

/**
 * The 3D stage for one project: a perspective box (GSAP drives its opacity and the rig's rotation on scroll),
 * a preserve-3d rig, and a pointer-reactive tilt layer (mouse only). Everything inside is positioned in `cqw`,
 * so a composition scales as one piece. The overlay link makes the whole composition clickable without adding a
 * second tab stop (the title and buttons are the accessible links to the same place).
 */
export function Scene({ aspect, label, children, href, hint }: SceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = ((event.clientX - r.left) / r.width) * 2 - 1
    const py = ((event.clientY - r.top) / r.height) * 2 - 1
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
      el.style.setProperty('--gx', `${(50 + px * 45).toFixed(1)}%`)
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    ;['--px', '--py', '--gx'].forEach((n) => el.style.removeProperty(n))
  }

  return (
    <div ref={ref} className={styles.scene} style={{ aspectRatio: String(aspect) }} role="group" aria-label={label} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className={styles.stage} data-stage>
        <div className={styles.rig} data-rig>
          <div className={styles.tilt}>{children}</div>
        </div>
      </div>
      {href && (
        <a className={styles.hit} href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
          <span className={styles.hint}>
            {hint}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      )}
    </div>
  )
}

interface SlotProps {
  /** left / top / width in container-width percent (cqw) */
  x: number
  y: number
  w: number
  /** parallax depth for the scroll choreography (−1…1); 0 = none */
  depth?: number
  /** CSS transform that sets this device's resting pose */
  pose: string
  children: (vars: CSSProperties) => ReactNode
  z?: number
}

/** Positions one device in the scene. `.slot` is moved by GSAP (parallax); `.pose` holds the static 3D pose. */
export function Slot({ x, y, w, depth = 0, pose, z = 0, children }: SlotProps) {
  return (
    <div className={styles.slot} data-depth={depth} style={{ left: `${x}cqw`, top: `${y}cqw`, width: `${w}cqw`, zIndex: z }}>
      <div className={styles.pose} style={{ transform: pose }}>
        {children({ '--w': `${w}cqw` } as CSSProperties)}
      </div>
    </div>
  )
}
