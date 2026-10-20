import { profile } from '../../content/profile'
import { Button } from '../ui/Button'
import { KineticHeading } from '../ui/KineticHeading'
import { Ticker } from '../ui/Ticker'
import { GlassVisual } from './GlassVisual'
import styles from './Hero.module.css'

/**
 * Opening scene. A translucent glass panel carries the kinetic name, role, pitch and CTAs (left on desktop, below the
 * visual on small screens); one large frosted-glass interface — a floating, perspective-tilted object over the lime grid —
 * is the visual on the right. It is plain DOM/SVG/CSS, so nothing loads late and nothing shifts.
 */
export function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.visual} data-hero-visual>
        <GlassVisual />
      </div>

      <div className={styles.content} data-hero-content>
        <p className={styles.eyebrow}>
          <span className={styles.pulse} aria-hidden="true" />
          Portfolio — 2026
        </p>

        <KineticHeading className={styles.name} lines={[profile.firstName.toUpperCase(), profile.lastName.toUpperCase()]} lineStyles={['solid', 'lime']} label={profile.name} />

        <div className={styles.lower}>
          <p className={styles.role}>
            <span className={styles.roleLine}>
              UI/UX Designer <span className={styles.times} aria-hidden="true">×</span>
            </span>
            <span className="sr-only"> and </span>
            <span className={styles.roleLine}>Frontend Developer</span>
          </p>
          <p className={styles.intro}>{profile.intro}</p>
          <div className={styles.cta}>
            <Button href="/#work" size="lg" arrow>
              Explore the work
            </Button>
            <Button href="/#contact" variant="ghost" size="lg">
              Get in touch
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.ticker}>
        <Ticker items={profile.ticker} />
      </div>
    </section>
  )
}
