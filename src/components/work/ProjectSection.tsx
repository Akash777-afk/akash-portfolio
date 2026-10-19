import type { ReactElement } from 'react'
import { primaryLink, type Project } from '../../content/projects'
import { Button, ExternalGlyph } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { GlassPanel } from '../ui/GlassPanel'
import { Reveal } from '../ui/Reveal'
import { BreakfitComposition, IotComposition, ValidateComposition } from './Compositions'
import styles from './ProjectSection.module.css'

const COMPOSITIONS: Record<Project['slug'], (p: { href: string; hint: string }) => ReactElement> = {
  breakfit: BreakfitComposition,
  iot: IotComposition,
  validate: ValidateComposition,
}

export function ProjectSection({ project, flip }: { project: Project; flip: boolean }) {
  const primary = primaryLink(project)
  const Composition = COMPOSITIONS[project.slug]
  const titleId = `${project.slug}-title`
  const hint = project.primary === 'live' ? `Open ${project.live!.label.toLowerCase()}` : 'Open case study'

  return (
    <section id={project.slug} className={styles.section} data-project data-flip={flip} aria-labelledby={titleId}>
      <span className={styles.numeral} aria-hidden="true" data-depth="-0.6">
        {project.index}
      </span>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.text}>
          <Reveal>
            <GlassPanel className={styles.panel}>
              <p className={styles.kicker}>
                <span>{project.index}</span> {project.kicker}
              </p>

              <h3 id={titleId} className={styles.title}>
                {/* The title goes where the primary button goes: the real thing, in a new tab. */}
                <a href={primary.href} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
                  {project.title}
                  <ExternalGlyph className={styles.titleIcon} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </h3>

              <p className={styles.summary}>{project.summary}</p>

              <dl className={styles.brief}>
                <div>
                  <dt>The problem</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>My contribution</dt>
                  <dd>{project.role}</dd>
                </div>
              </dl>

              <ul className={styles.chips} aria-label="Technologies">
                <li>
                  <Chip tone="lime">{project.status}</Chip>
                </li>
                {project.stack.map((s) => (
                  <li key={s}>
                    <Chip>{s}</Chip>
                  </li>
                ))}
              </ul>

              <ul className={styles.facts} aria-label="Key facts">
                {project.facts.map((f) => (
                  <li key={f.label}>
                    <strong>{f.value}</strong>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>

              {project.note && <p className={styles.note}>{project.note}</p>}

              <div className={styles.actions}>
                {project.live && (
                  <Button href={project.live.href} variant={project.primary === 'live' ? 'primary' : 'ghost'} size="lg">
                    {project.live.label}
                  </Button>
                )}
                {project.caseStudy && (
                  <Button href={project.caseStudy.href} variant={project.primary === 'caseStudy' ? 'primary' : 'ghost'} size="lg">
                    {project.caseStudy.label}
                  </Button>
                )}
              </div>
            </GlassPanel>
          </Reveal>
        </div>

        <div className={styles.visual}>
          <Composition href={primary.href} hint={hint} />
        </div>
      </div>
    </section>
  )
}
