import { aboutIntro, education, experience, profile } from '../../content/profile'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Numeral } from '../ui/Numeral'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { Slab } from '../ui/Slab'
import styles from './About.module.css'

/** About: the introduction, the experience timeline and education. Sits over the last project like a sheet. (Contact details live in the Contact section.) */
export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <Numeral>02</Numeral>
      <div className={styles.inner}>
        <div data-wipe className={styles.wipe}>
          <SectionHeading eyebrow="02 — About" id="about-title" title={aboutIntro.heading} />
        </div>

        <div className={styles.intro} data-fly>
          <Reveal>
            <p className={styles.statement}>{aboutIntro.paragraphs[0]}</p>
          </Reveal>
          <Reveal delay={0.1} className={styles.how}>
            {aboutIntro.paragraphs.slice(1).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className={styles.actions}>
              <Button href={profile.resumePdf} download variant="primary">
                Download résumé (PDF)
              </Button>
              <Button href="/#contact" variant="ghost">
                Contact me
              </Button>
            </div>
          </Reveal>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <span>Experience</span>
          </h3>
          <ol className={styles.timeline} data-timeline>
            <span className={styles.rail} aria-hidden="true">
              <span className={styles.spine} data-spine />
            </span>
            {experience.map((role) => (
              <li key={role.id} className={styles.entry} data-entry>
                <span className={styles.node} aria-hidden="true" data-current={role.current ? 'true' : undefined} />
                <Slab as="article" className={styles.card} ry={-5} rx={1.5} tilt={3}>
                  <p className={styles.period}>
                    {role.period}
                    {role.current && <Chip tone="lime">Current</Chip>}
                  </p>
                  <h4 className={styles.role}>{role.title}</h4>
                  <p className={styles.company}>{role.company}</p>
                  <p className={styles.detail}>
                    <span>{role.detail.label}:</span> {role.detail.value}
                  </p>
                  <p className={styles.lead}>{role.summary}</p>
                  <ul className={styles.list}>
                    {role.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </Slab>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <span>Education</span>
          </h3>
          <ul className={styles.education} data-fly>
            {education.map((e, i) => (
              <Reveal as="li" key={e.degree} delay={i * 0.08} className={styles.eduItem}>
                <Slab className={styles.edu} ry={i % 2 === 0 ? 5 : -5} rx={1.5} tilt={3} radius="0 var(--r-3) var(--r-3) 0">
                  <p className={styles.eduYear}>{e.year}</p>
                  <h4 className={styles.eduDegree}>{e.degree}</h4>
                  {e.institution && <p className={styles.eduPlace}>{e.institution}</p>}
                </Slab>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
