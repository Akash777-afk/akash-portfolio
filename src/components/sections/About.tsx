import { aboutIntro, education, experience, profile } from '../../content/profile'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { ContactDetails } from './ContactDetails'
import styles from './About.module.css'

/** About: the introduction, the experience timeline, education and contact details. Sits over the last project like a sheet. */
export function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.inner}>
        <div data-wipe className={styles.wipe}>
          <SectionHeading eyebrow="02 — About" id="about-title" title={aboutIntro.heading} />
        </div>

        <div className={styles.intro}>
          <Reveal className={styles.copy}>
            {aboutIntro.paragraphs.map((p) => (
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
          <Reveal delay={0.1}>
            <ContactDetails />
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
                <article className={styles.card}>
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
                </article>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <span>Education</span>
          </h3>
          <ul className={styles.education}>
            {education.map((e, i) => (
              <Reveal as="li" key={e.degree} delay={i * 0.08} className={styles.edu}>
                <p className={styles.eduYear}>{e.year}</p>
                <h4 className={styles.eduDegree}>{e.degree}</h4>
                {e.institution && <p className={styles.eduPlace}>{e.institution}</p>}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
