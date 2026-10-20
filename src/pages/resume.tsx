import Head from 'next/head'
import { education, experience, profile, skillGroups } from '../content/profile'
import { projects } from '../content/projects'
import styles from './resume.module.css'

/**
 * Printable résumé (A4) built from the site data. `npm run resume` prints it to assets/generated/ — the downloadable
 * résumé the site serves is the author's own file, public/Akash-Ganapathy-Resume.pdf.
 * It only restates what is on the site — supplied contact details, roles, education and skills; no metrics are added.
 */
export default function Resume() {
  const display = (href: string) => href.replace(/^https?:\/\//, '').replace(/\/#\/$/, '')
  return (
    <div className={styles.paper}>
      <Head>
        <title>{`${profile.name} — Résumé`}</title>
        <meta name="robots" content="noindex" />
        <style>{`html,body{background:#fff!important;color:#14171c!important;overflow:visible!important}`}</style>
      </Head>

      <header className={styles.head}>
        <h1>{profile.name}</h1>
        <p className={styles.title}>{profile.title}</p>
        <p className={styles.contact}>
          <span>{profile.location}</span>
          <span>{profile.phone}</span>
          <span>{profile.email}</span>
        </p>
      </header>

      <section>
        <h2>Profile</h2>
        <p>{profile.intro}</p>
      </section>

      <section>
        <h2>Experience</h2>
        {experience.map((role) => (
          <article key={role.id} className={styles.role}>
            <div className={styles.roleHead}>
              <h3>
                {role.title} — {role.company}
              </h3>
              <span>{role.period}</span>
            </div>
            <p className={styles.meta}>
              {role.detail.label}: {role.detail.value}
            </p>
            <p>{role.summary}</p>
            <ul>
              {role.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        <ul className={styles.plain}>
          {education.map((e) => (
            <li key={e.degree}>
              <strong>{e.degree}</strong>
              {e.institution ? ` — ${e.institution}` : ''}, {e.year}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <dl className={styles.skills}>
          {skillGroups.map((g) => (
            <div key={g.id}>
              <dt>{g.label}</dt>
              <dd>{g.skills.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Selected projects</h2>
        <ul className={styles.plain}>
          {projects.map((p) => (
            <li key={p.slug}>
              <strong>{p.title}</strong> — {p.summary}
              <span className={styles.links}>
                {p.live && <span>{display(p.live.href)}</span>}
                {p.caseStudy && !p.caseStudy.provisional && <span>{display(p.caseStudy.href)}</span>}
                {p.caseStudy?.provisional && <span>UX case study on Behance</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
