import Link from 'next/link'
import { profile } from '../../content/profile'
import { primaryLink, projects } from '../../content/projects'
import { ExternalGlyph } from '../ui/Button'
import { DepthFloor } from '../ui/DepthFloor'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <DepthFloor height="22rem" strength={0.7} />
      <div className={styles.inner} data-fly>
        <div className={styles.lead}>
          <p className={styles.markWrap} data-mark>
            <span className={styles.mark}>AG</span>
          </p>
          <p className={styles.statement}>Designed and built by {profile.name}.</p>
          <p className={styles.where}>{profile.location}</p>
          <a className={styles.mail} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className={styles.mail} href={profile.phoneHref}>
            {profile.phone}
          </a>
        </div>

        <nav className={styles.col} aria-label="Projects">
          <h2 className={styles.heading}>Work</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <a className={styles.link} href={primaryLink(p).href} target="_blank" rel="noopener noreferrer">
                  <span className={styles.idx}>{p.index}</span>
                  {p.shortTitle}
                  <ExternalGlyph className={styles.ext} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Site">
          <h2 className={styles.heading}>Site</h2>
          <ul>
            <li>
              <Link href="/#about">
                <a className={styles.link}>About</a>
              </Link>
            </li>
            <li>
              <Link href="/#skills">
                <a className={styles.link}>Skills</a>
              </Link>
            </li>
            <li>
              <Link href="/#contact">
                <a className={styles.link}>Contact</a>
              </Link>
            </li>
            <li>
              <a className={styles.link} href={profile.resumePdf} download>
                Résumé (PDF)
              </a>
            </li>
            <li>
              <a className={styles.link} href="#top">
                Back to top
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className={styles.fine}>
        Built with Next.js, React, TypeScript, GSAP and Motion · Project screens are real captures of the applications.
      </p>
    </footer>
  )
}
