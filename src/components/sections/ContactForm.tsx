import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { profile } from '../../content/profile'
import { copyText } from '../../lib/clipboard'
import { Button } from '../ui/Button'
import styles from './ContactForm.module.css'

interface Values {
  name: string
  email: string
  message: string
}
type Errors = Partial<Record<keyof Values, string>>

const MAX_MESSAGE = 1200
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validate(values: Values): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please tell me your name.'
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address so I can reply.'
  if (values.message.trim().length < 20) errors.message = 'A few more words, please — at least 20 characters.'
  return errors
}

function buildMailto(values: Values): string {
  const subject = `Portfolio enquiry from ${values.name.trim()}`
  const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * No backend: a valid form composes a ready-to-send email and hands it to the visitor's mail app.
 * The success state also offers "copy message" for people without a mail client configured.
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [sent, setSent] = useState(false)
  const [note, setNote] = useState('')
  const refs = { name: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), message: useRef<HTMLTextAreaElement>(null) }

  const update = (key: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [key]: event.target.value }
    setValues(next)
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validate(next)[key] }))
  }

  const blur = (key: keyof Values) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: validate(values)[key] }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, email: true, message: true })
    const firstInvalid = (['name', 'email', 'message'] as const).find((k) => found[k])
    if (firstInvalid) {
      refs[firstInvalid].current?.focus()
      return
    }
    setSent(true)
    window.location.href = buildMailto(values)
  }

  const fullMessage = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`

  if (sent) {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>Your email is ready to send.</p>
        <p className={styles.doneBody}>
          Your mail app should have opened with the message filled in. If nothing opened, copy it and send it to <strong>{profile.email}</strong>.
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={async () => setNote((await copyText(fullMessage)) ? 'Message copied.' : 'Copy failed — select the text manually.')}
          >
            Copy message
          </Button>
          <Button
            variant="ghost"
            onClick={async () => setNote((await copyText(profile.email)) ? 'Email address copied.' : 'Copy failed — select the address manually.')}
          >
            Copy email
          </Button>
          <Button variant="link" onClick={() => setSent(false)}>
            Edit message
          </Button>
          <Button href={buildMailto(values)} variant="ghost">
            Open email app again
          </Button>
        </div>
        <p className={styles.note} aria-live="polite">
          {note}
        </p>
      </div>
    )
  }

  const field = (key: keyof Values) => ({
    id: `contact-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
    onBlur: blur(key),
    onChange: update(key),
    value: values[key],
  })

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.field}>
        <label htmlFor="contact-name">Name</label>
        <input ref={refs.name} type="text" autoComplete="name" {...field('name')} />
        {errors.name && (
          <p id="contact-name-error" className={styles.error} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Your email</label>
        <input ref={refs.email} type="email" autoComplete="email" inputMode="email" {...field('email')} />
        {errors.email && (
          <p id="contact-email-error" className={styles.error} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea ref={refs.message} rows={6} maxLength={MAX_MESSAGE} {...field('message')} />
        <p className={styles.count} aria-hidden="true">
          {values.message.length} / {MAX_MESSAGE}
        </p>
        {errors.message && (
          <p id="contact-message-error" className={styles.error} role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="submit" size="lg" arrow>
          Compose email
        </Button>
        <p className={styles.help}>Opens your email app with the message ready to send.</p>
      </div>
    </form>
  )
}
