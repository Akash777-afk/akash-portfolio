import { AnimatePresence, motion } from 'framer-motion'
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { portfolioBuildStack, skillGroups } from '../../content/profile'
import { DepthFloor } from '../ui/DepthFloor'
import { Numeral } from '../ui/Numeral'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { Slab } from '../ui/Slab'
import styles from './Skills.module.css'

/**
 * Four skill groups as a keyboard-operable tab set (arrow keys, Home/End). Each group is a dimensional panel with
 * technical-grid detailing; switching groups animates a perspective flip. Skills are listed exactly as in the résumé —
 * no proficiency scores or years are shown because none were supplied.
 */
export function Skills() {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const panel = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const group = skillGroups[active]

  const move = (to: number) => {
    const next = (to + skillGroups.length) % skillGroups.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') move(active + 1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') move(active - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(skillGroups.length - 1)
    else return
    event.preventDefault()
  }

  // subtle pointer tilt on the panel (mouse only)
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const el = panel.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = ((event.clientX - r.left) / r.width) * 2 - 1
    const py = ((event.clientY - r.top) / r.height) * 2 - 1
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
    })
  }
  const onLeave = () => {
    const el = panel.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.removeProperty('--px')
    el.style.removeProperty('--py')
  }

  return (
    <section id="skills" className={styles.skills} aria-labelledby="skills-title">
      <DepthFloor height="26rem" strength={0.5} />
      <Numeral>03</Numeral>
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            eyebrow="03 — Skills"
            id="skills-title"
            title="What I design with, and build with."
            lead="Four groups, listed as they appear on my résumé."
          />
        </Reveal>

        <div className={styles.console} data-fly>
          <div className={styles.tabs} role="tablist" aria-label="Skill groups" onKeyDown={onKeyDown}>
            {skillGroups.map((g, i) => (
              <button
                key={g.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                id={`${baseId}-tab-${g.id}`}
                type="button"
                role="tab"
                aria-label={g.label}
                aria-selected={i === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabIndex}>0{i + 1}</span>
                <span className={styles.tabLabel}>
                  <span className={styles.long}>{g.label}</span>
                  <span className={styles.short} aria-hidden="true">
                    {g.short}
                  </span>
                </span>
                <span className={styles.count} aria-hidden="true">
                  {String(g.skills.length).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          <div ref={panel} className={styles.stage} onPointerMove={onMove} onPointerLeave={onLeave}>
            <div className={styles.frame}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <i key={i} className={styles.depth} style={{ '--i': i } as CSSProperties} aria-hidden="true" />
              ))}
              <span className={`${styles.tick} ${styles.tl}`} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.tr}`} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.bl}`} aria-hidden="true" />
              <span className={`${styles.tick} ${styles.br}`} aria-hidden="true" />

              <div className={styles.readout} aria-hidden="true">
                <span>SKILLS // {group.label.toUpperCase()}</span>
                <span>{String(group.skills.length).padStart(2, '0')} ITEMS</span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={group.id}
                  id={`${baseId}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${baseId}-tab-${group.id}`}
                  tabIndex={0}
                  className={styles.panel}
                  initial={{ opacity: 0, rotateX: -16, y: 16 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: 10, y: -10, transition: { duration: 0.14, ease: 'easeIn' } }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ul className={styles.tiles}>
                    {group.skills.map((skill, i) => (
                      <motion.li
                        key={skill}
                        className={styles.tile}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.025 * i, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Slab className={styles.tileFace} layers={4} ry={-6} rx={2} tilt={7} radius="var(--r-2)">
                          <span className={styles.tileIndex} aria-hidden="true">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={styles.tileName}>{skill}</span>
                        </Slab>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div role="group" className={styles.build} aria-labelledby="build-title">
          <h3 id="build-title" className={styles.buildTitle}>
            Used to build this website
          </h3>
          <p className={styles.buildNote}>Not part of the résumé skills above — listed only so the stack behind this site is transparent.</p>
          <ul className={styles.buildList}>
            {portfolioBuildStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
