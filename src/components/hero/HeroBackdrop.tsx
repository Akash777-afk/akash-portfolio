import { useEffect, useRef, type CSSProperties } from 'react'
import styles from './HeroBackdrop.module.css'

type Pt = [number, number]

const W = 1600
const H = 900
const LINES = 17

/** A smooth curve through the points (Catmull-Rom converted to cubic Béziers). */
function smooth(points: Pt[], tension = 0.18): string {
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(points[0][0])} ${f(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) * tension)} ${f(p1[1] + (p2[1] - p0[1]) * tension)} ${f(p2[0] - (p3[0] - p1[0]) * tension)} ${f(p2[1] - (p3[1] - p1[1]) * tension)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

/**
 * One ribbon of the flowing bundle. The bundle sweeps along the lower half of the hero and rises toward the right edge, is
 * tight where it enters and fans out as it goes, and every line carries the same wave a little out of phase — so the lines read as one silk-like
 * surface seen edge-on, not as unrelated curves.
 */
function ribbon(i: number): string {
  const t = i / (LINES - 1)
  const points: Pt[] = []
  const steps = 10
  for (let k = 0; k <= steps; k++) {
    const u = k / steps
    const centre = H * (0.97 - 0.4 * u)
    const spread = H * (0.035 + 0.24 * Math.pow(u, 1.1))
    const wave = Math.sin(u * Math.PI * 2.1 + t * 1.9) * H * 0.05 * (0.4 + u)
    points.push([u * W, centre + (t - 0.5) * 2 * spread + wave])
  }
  return smooth(points)
}

const PATHS = Array.from({ length: LINES }, (_, i) => ribbon(i))

/**
 * The outline of "AG" in Unbounded ExtraBold (the site's display face; SIL Open Font License), converted to path data so the
 * monogram needs no web font and, being a path, is never counted as text by the browser's paint metrics. It sits in a
 * 0 40 920 420 box.
 */
const AG_PATH =
  'M375.7 365.2L129.0 365.2L129.0 275.9L375.7 275.9L375.7 365.2ZM180.3 70L328.2 70L489.4 430L369.9 430L239.4 118.5L269.6 118.5L138.6 430L19.5 430L180.3 70ZM815.4 273.0L862.9 274.5Q861.4 306.2 849.9 335.7Q838.4 365.2 816.3 388.5Q794.2 411.8 760.6 425.0Q727.0 438.2 681.9 438.2L681.9 438.2Q639.7 438.2 602.7 425.9Q565.8 413.7 537.4 389.9Q509.1 366.2 493.0 331.1Q477.0 296.1 477.0 250L477.0 250Q477.0 203.9 493.0 168.9Q509.1 133.8 538.2 110.1Q567.2 86.3 605.4 74.1Q643.5 61.8 687.7 61.8L687.7 61.8Q748.6 61.8 792.6 80.1Q836.5 98.3 863.4 130.5Q890.2 162.6 897.9 204.4L897.9 204.4L785.6 204.4Q781.3 188.6 767.6 177.3Q753.9 166 733.8 160Q713.6 154 688.6 154L688.6 154Q657.9 154 635.6 164.6Q613.3 175.1 601.3 196.2Q589.3 217.4 589.3 250L589.3 250Q589.3 282.6 602.5 304.7Q615.7 326.8 640.4 337.8Q665.1 348.9 698.7 348.9L698.7 348.9Q731.4 348.9 756.6 340.2Q781.8 331.6 797.1 314.8Q812.5 298 815.4 273.0L815.4 273.0ZM827.4 318.2L707.4 318.2L707.4 240.4L901.3 240.4L901.3 430L823.0 430L806.7 289.8L827.4 318.2Z'

/**
 * The hero's background — typography is the main event, so this stays quiet: a fading grid, two soft pools of lime light,
 * a bundle of flowing contour lines that fade out behind the copy, and a huge outlined "AG" monogram on the right.
 * All decorative (aria-hidden). The mouse (fine pointers only) shifts the contours and the monogram by a few pixels;
 * with reduced motion nothing moves and the lines are simply drawn.
 */
export function HeroBackdrop() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--py', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={root} className={styles.backdrop} aria-hidden="true" data-hero-visual>
      <div className={styles.light} />
      <div className={styles.grid} />
      <svg className={styles.contours} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        {PATHS.map((d, i) => (
          <path key={i} d={d} pathLength={1} className={styles.line} data-accent={i % 4 === 0 ? '' : undefined} style={{ '--i': i } as CSSProperties} />
        ))}
      </svg>
      <svg className={styles.monogram} viewBox="0 40 920 420" data-monogram focusable="false">
        {/* The outline is built with a mask — the letters stroked in white, then filled in black on top — so only the outer edge
            of each glyph is left. (Stroking the glyphs directly would also draw the overlapping contours inside them.) */}
        <defs>
          <mask id="hero-ag-outline" maskUnits="userSpaceOnUse" x="-20" y="20" width="960" height="460">
            <path className={styles.maskStroke} d={AG_PATH} />
            <path className={styles.maskFill} d={AG_PATH} />
          </mask>
        </defs>
        <rect className={styles.outline} x="-20" y="20" width="960" height="460" mask="url(#hero-ag-outline)" />
      </svg>
    </div>
  )
}
