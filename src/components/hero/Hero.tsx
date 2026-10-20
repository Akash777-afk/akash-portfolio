import { profile } from '../../content/profile'
import { Button } from '../ui/Button'
import { KineticHeading } from '../ui/KineticHeading'
import { Ticker } from '../ui/Ticker'
import { HeroBackdrop } from './HeroBackdrop'
import styles from './Hero.module.css'

/**
 * Opening scene — typography first. The name is set as large as the column allows, the role and the pitch sit beneath it,
 * and the only graphics are quiet ones behind the copy (HeroBackdrop: grid, lime light, flowing contours, an outlined AG).
 */
export function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <HeroBackdrop />

      <div className={styles.content} data-hero-content>
        <p className={styles.eyebrow}>
          <span className={styles.pulse} aria-hidden="true" />
          Portfolio — 2026
        </p>

        <KineticHeading className={styles.name} lines={[profile.firstName.toUpperCase(), profile.lastName.toUpperCase()]} lineStyles={['solid', 'lime']} label={profile.name} />

        <p className={styles.role}>
          <span className={styles.roleLine}>
            UI/UX Designer <span className={styles.times} aria-hidden="true">×</span>
          </span>
          <span className="sr-only"> and </span>{' '}
          <span className={styles.roleLine}>Frontend Developer</span>
        </p>

        <p className={styles.intro}>{profile.heroIntro}</p>

        <div className={styles.cta}>
          <Button className={styles.ctaButton} href="/#work" size="lg" arrow>
            Explore the work
          </Button>
          <Button className={styles.ctaButton} href="/#contact" variant="ghost" size="lg">
            Get in touch
          </Button>
        </div>
      </div>

      <div className={styles.ticker}>
        <Ticker items={profile.ticker} />
      </div>
    </section>
  )
}
