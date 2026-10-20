import { projects } from '../../content/projects'
import { SectionHeading } from '../ui/SectionHeading'
import { DepthFloor } from '../ui/DepthFloor'
import { Reveal } from '../ui/Reveal'
import { ProjectSection } from './ProjectSection'
import styles from './Work.module.css'

/**
 * Selected work: exactly three projects. Each is shown as a 3D device composition; the title, the composition and
 * the first button all open the project's primary destination (live app / live demo, or the case study for Validate).
 */
export function Work() {
  return (
    <div id="work" className={styles.work}>
      {/* a perspective floor the hero's devices appear to fly over (scroll-linked, decorative) */}
      <DepthFloor height="36rem" strength={0.75} />

      <header className={styles.header}>
        <Reveal>
          <SectionHeading
            eyebrow="01 — Selected work"
            id="work-title"
            title="Three projects, built end to end."
            lead="Each project is shown in 3D. The title, the device and the first button open the real thing in a new tab — the live app, or the case study when there is no app."
          />
        </Reveal>
      </header>

      {projects.map((project, i) => (
        <ProjectSection key={project.slug} project={project} flip={i % 2 === 1} />
      ))}
    </div>
  )
}
