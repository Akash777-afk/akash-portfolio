import { profile } from '../../content/profile'
import { Button } from '../ui/Button'
import { DepthFloor } from '../ui/DepthFloor'
import { Numeral } from '../ui/Numeral'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { Slab } from '../ui/Slab'
import { ContactDetails } from './ContactDetails'
import { ContactForm } from './ContactForm'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <DepthFloor height="26rem" strength={0.5} />
      <Numeral>04</Numeral>
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            eyebrow="04 — Contact"
            id="contact-title"
            title="Let’s build something precise."
            lead="Hiring for a role that sits between design and engineering? Call, email, or send a note — the form opens in your email app, ready to send."
          />
        </Reveal>

        <div className={styles.grid} data-fly>
          <Reveal className={styles.formWrap}>
            <Slab className={styles.formCard} ry={4} rx={1} tilt={2}>
              <ContactForm />
            </Slab>
          </Reveal>

          <Reveal delay={0.1} className={styles.direct}>
            <ContactDetails />
            <div className={styles.cta}>
              <Button href={profile.phoneHref} variant="primary">
                Call {profile.phone}
              </Button>
              <Button href={`mailto:${profile.email}`} variant="ghost">
                Email me
              </Button>
              <Button href={profile.resumePdf} download variant="link">
                Download résumé (PDF)
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
