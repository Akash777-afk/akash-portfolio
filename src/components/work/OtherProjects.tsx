import type { ReactElement } from 'react'
import { otherProjects, type OtherProject } from '../../content/projects'
import { Button, ExternalGlyph } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { IrctcComposition, SdwanComposition } from './Compositions'
import styles from './OtherProjects.module.css'

const COMPOSITIONS: Record<OtherProject['slug'], (p: { href: string; hint: string }) => ReactElement> = {
  sdwan: SdwanComposition,
  irctc: IrctcComposition,
}

/**
 * Other projects: UX case studies presented more compactly than the three main projects — two cards side by side,
 * each with a smaller 3D composition built from the case study's own slides. Everything opens the Behance case study.
 */
export function OtherProjects() {
  return (
    <section id="more-work" className={styles.section} aria-labelledby="more-work-title">
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            eyebrow="More work"
            id="more-work-title"
            title="Other projects."
            lead="UX redesigns, start to finish: from what was broken to what changed. Each opens its case study on Behance in a new tab."
          />
        </Reveal>

        <ul className={styles.grid}>
          {otherProjects.map((project) => {
            const Composition = COMPOSITIONS[project.slug]
            const titleId = `${project.slug}-title`
            return (
              <li key={project.slug} className={styles.item} data-fly>
                <article className={styles.card} aria-labelledby={titleId}>
                  <div className={styles.visual}>
                    <Composition href={project.caseStudy.href} hint="Open case study" />
                  </div>

                  <div className={styles.body}>
                    <p className={styles.kicker}>
                      {project.kicker}
                      <span className={styles.date}>{project.published}</span>
                    </p>

                    <h3 id={titleId} className={styles.title}>
                      <a href={project.caseStudy.href} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
                        {project.title}
                        <ExternalGlyph className={styles.titleIcon} />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </h3>

                    <p className={styles.summary}>{project.summary}</p>

                    <dl className={styles.brief}>
                      <div>
                        <dt>Before</dt>
                        <dd>{project.problem}</dd>
                      </div>
                      <div>
                        <dt>The redesign</dt>
                        <dd>{project.outcome}</dd>
                      </div>
                    </dl>

                    <div className={styles.footer}>
                      <ul className={styles.chips} aria-label="Tools">
                        <li>
                          <Chip tone="lime">UX case study</Chip>
                        </li>
                        {project.tools.map((t) => (
                          <li key={t}>
                            <Chip>{t}</Chip>
                          </li>
                        ))}
                      </ul>
                      <Button href={project.caseStudy.href} variant="ghost">
                        {project.caseStudy.label}
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
