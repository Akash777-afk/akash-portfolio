import { useEffect, useRef, type CSSProperties } from 'react'
import styles from './GlassVisual.module.css'

type Pt = [number, number]

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

const W = 600
const H = 240
/** Reporting devices (the lit series) and degraded devices (the quiet one). The curves are illustrative. */
const REPORTING: Pt[] = [[0, 92], [90, 84], [190, 98], [300, 70], [400, 78], [500, 44], [600, 38]]
const DEGRADED: Pt[] = [[0, 204], [90, 196], [190, 208], [300, 186], [400, 156], [500, 196], [600, 190]]
const MARK = REPORTING[5]

const reportingLine = smooth(REPORTING)
const degradedLine = smooth(DEGRADED)
const reportingArea = `${reportingLine} L${W} ${H} L0 ${H} Z`

/** Donut segments as stroke-dasharray lengths on a circle of circumference 100 (pathLength). Illustrative split. */
const DONUT = [
  { name: 'Good', value: 78, className: 'segGood' },
  { name: 'Fair', value: 16, className: 'segFair' },
  { name: 'Poor', value: 6, className: 'segPoor' },
]

const BARS = [
  { label: 'North', value: 34 },
  { label: 'West', value: 52 },
  { label: 'South', value: 100 },
  { label: 'East', value: 40 },
]

const PLATES = [1, 2, 3]

const pos = (p: Pt) => ({ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` }) as CSSProperties

/**
 * The hero's visual: one large frosted-glass interface floating over the lime perspective grid.
 * Built from plain DOM + SVG + CSS 3D — no canvas, no library. It is decorative and illustrative: the figures are the
 * ones shown by the IoT Observability project (100,114 devices; 8,103 out of reach; 22,025 applet rollouts; 702
 * blacklisted); the curves and the quality split are drawn for effect, not live data.
 *
 * Layers (back → front): floor grid and glow · backlight · stacked glass plates (thickness) · the glass panel with the
 * trend chart · two small floating glass cards. The pointer (mouse only) turns the object a few degrees.
 */
export function GlassVisual() {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stage.current
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
    <div
      ref={stage}
      className={styles.stage}
      role="img"
      aria-label="Illustration: a frosted-glass analytics interface showing a device trend chart, network quality and circle-wise issues, based on the IoT Observability project."
    >
      <div className={styles.floor} aria-hidden="true">
        <div className={styles.plane} />
        <div className={styles.glow} />
      </div>

      <div className={styles.rig} data-rig>
        <div className={styles.float}>
          <div className={styles.object} data-glass>
            <i className={styles.backlight} />
            {PLATES.map((i) => (
              <i key={i} className={styles.plate} style={{ '--i': i } as CSSProperties} />
            ))}

            {/* ---- the glass panel ------------------------------------------------------------------------ */}
            <div className={styles.panel}>
              <header className={styles.head}>
                <span className={styles.brand}>
                  <b className={styles.dot} />
                  Fleet observability
                </span>
              </header>

              <div className={styles.metric}>
                <p className={styles.big}>100,114</p>
                <p className={styles.cap}>devices in view</p>
                <p className={`${styles.legend} ${styles.fine}`}>
                  <span data-k="reporting">Reporting</span>
                  <span data-k="degraded">Degraded</span>
                </p>
              </div>

              <div className={styles.chart}>
                <div className={`${styles.yAxis} ${styles.fine}`}>
                  <span>102k</span>
                  <span>51k</span>
                  <span>0</span>
                </div>
                <div className={styles.plot}>
                  <div className={styles.canvas}>
                  <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" focusable="false" aria-hidden="true">
                    <defs>
                      <linearGradient id="gv-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" style={{ stopColor: 'var(--lime-500)', stopOpacity: 0.34 }} />
                        <stop offset="1" style={{ stopColor: 'var(--lime-500)', stopOpacity: 0 }} />
                      </linearGradient>
                      <linearGradient id="gv-line" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" style={{ stopColor: 'var(--lime-500)', stopOpacity: 0.55 }} />
                        <stop offset="1" style={{ stopColor: 'var(--lime-300)', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    {[40, 120, 200].map((y) => (
                      <line key={y} className={styles.gridLine} x1="0" x2={W} y1={y} y2={y} />
                    ))}
                    <path className={styles.area} d={reportingArea} fill="url(#gv-area)" />
                    <path className={styles.degraded} d={degradedLine} pathLength={1} />
                    <path className={styles.reporting} d={reportingLine} pathLength={1} stroke="url(#gv-line)" />
                    <line className={styles.guide} x1={MARK[0]} x2={MARK[0]} y1={MARK[1]} y2={H} />
                  </svg>
                  <span className={styles.mark} style={pos(MARK)} />
                  <span className={`${styles.tip} ${styles.fine}`} style={pos(MARK)}>
                    Sep · 100,114
                  </span>
                  </div>
                  <div className={`${styles.xAxis} ${styles.fine}`}>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </div>
              </div>

              <ul className={styles.kpis}>
                <li>
                  <span className={styles.kLabel}>Out of reach</span>
                  <span className={styles.kValue}>8,103</span>
                  <i className={styles.kBar} style={{ '--v': '8%' } as CSSProperties} />
                </li>
                <li>
                  <span className={styles.kLabel}>Applet rollout</span>
                  <span className={styles.kValue}>22,025</span>
                  <i className={styles.kBar} style={{ '--v': '22%' } as CSSProperties} />
                </li>
                <li>
                  <span className={styles.kLabel}>Blacklisted</span>
                  <span className={styles.kValue}>702</span>
                  <i className={styles.kBar} style={{ '--v': '3%' } as CSSProperties} />
                </li>
              </ul>
            </div>

            {/* ---- two small floating glass cards ---------------------------------------------------------- */}
            <div className={`${styles.card} ${styles.donut}`}>
              <p className={styles.cTitle}>Network quality</p>
              <div className={styles.ring}>
                <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
                  <circle className={styles.track} cx="50" cy="50" r="38" pathLength={100} />
                  {(() => {
                    let offset = 0
                    return DONUT.map((s) => {
                      const el = (
                        <circle
                          key={s.name}
                          className={`${styles.seg} ${styles[s.className]}`}
                          cx="50"
                          cy="50"
                          r="38"
                          pathLength={100}
                          strokeDasharray={`${s.value - 1.4} ${100 - s.value + 1.4}`}
                          strokeDashoffset={-offset}
                        />
                      )
                      offset += s.value
                      return el
                    })
                  })()}
                </svg>
                <span className={styles.ringValue}>100,114</span>
              </div>
              <p className={`${styles.keys} ${styles.fine}`}>
                {DONUT.map((s) => (
                  <span key={s.name} data-k={s.name.toLowerCase()}>
                    {s.name}
                  </span>
                ))}
              </p>
            </div>

            <div className={`${styles.card} ${styles.bars}`}>
              <p className={styles.cTitle}>Circle-wise issues</p>
              <div className={styles.cols}>
                {BARS.map((b) => (
                  <div key={b.label} className={styles.col}>
                    <i className={styles.colBar} style={{ '--v': `${b.value}%` } as CSSProperties} data-hot={b.value === 100 ? '' : undefined} />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
