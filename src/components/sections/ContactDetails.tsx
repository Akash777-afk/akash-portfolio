import { profile } from '../../content/profile'
import { CopyButton } from '../ui/CopyButton'
import styles from './ContactDetails.module.css'

/** Name, location, phone and email — real tel:/mailto: links with correct copy-to-clipboard. No social profiles are invented. */
export function ContactDetails({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <div className={styles.card}>
      <Heading className={styles.title}>Contact details</Heading>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>Name</dt>
          <dd>{profile.name}</dd>
        </div>
        <div className={styles.row}>
          <dt>Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div className={styles.row}>
          <dt>Phone</dt>
          <dd>
            <a className={styles.link} href={profile.phoneHref}>
              {profile.phone}
            </a>
            <CopyButton text={profile.phone} what="phone number" />
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Email</dt>
          <dd>
            <a className={styles.link} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <CopyButton text={profile.email} what="email address" />
          </dd>
        </div>
      </dl>
    </div>
  )
}
