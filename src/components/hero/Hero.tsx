import { forwardRef } from 'react'
import { profile } from '../../content/profile'
import { Button } from '../ui/Button'
import { KineticHeading } from '../ui/KineticHeading'
import { Ticker } from '../ui/Ticker'
import { HeroComposition } from './HeroComposition'
import { HeroSceneHost } from './HeroSceneHost'
import styles from './Hero.module.css'

/**
 * Opening scene. A translucent glass panel carries the kinetic name, role, pitch and CTAs (left on desktop, below the
 * devices on small screens); the three real devices sit beside it — as a WebGL scene when 3D is available
 * (`html[data-exp="3d"]`), otherwise as the CSS-3D composition. Both occupy the same box, so nothing shifts.
 */
export const Hero = forwardRef<HTMLElement, { sceneActive: boolean }>(function Hero({ sceneActive }, ref) {
  return (
    <section ref={ref} id="hero" className={styles.hero} aria-label="Introduction">
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.visual} data-hero-visual>
        <div className="only-3d">
          <HeroSceneHost active={sceneActive} />
        </div>
        <div className={`${styles.fallback} only-static`}>
          <HeroComposition />
        </div>
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
})
