import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../../content/profile'
import { Button } from '../ui/Button'
import styles from './Nav.module.css'

const LINKS = [
  { href: '/#work', label: 'Work', id: 'work' },
  { href: '/#about', label: 'About', id: 'about' },
  { href: '/#skills', label: 'Skills', id: 'skills' },
  { href: '/#contact', label: 'Contact', id: 'contact' },
]

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!enabled) {
      setActive('')
      return
    }
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])
  return active
}

export function Nav() {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const section = useActiveSection(isHome)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const burger = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the mobile menu on navigation, Esc, or when the viewport grows to desktop
  useEffect(() => {
    const close = () => setOpen(false)
    router.events.on('routeChangeStart', close)
    router.events.on('hashChangeStart', close)
    return () => {
      router.events.off('routeChangeStart', close)
      router.events.off('hashChangeStart', close)
    }
  }, [router.events])

  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        burger.current?.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 860) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      root.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className={styles.nav} data-scrolled={scrolled || open}>
      <div className={styles.inner}>
        <Link href="/">
          <a className={styles.brand} aria-label={`${profile.name} — home`}>
            <span className={styles.mark} aria-hidden="true">
              AG
            </span>
            <span className={styles.name}>{profile.name}</span>
          </a>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.id} href={link.href}>
              <a className={styles.link} aria-current={section === link.id ? 'true' : undefined}>
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button href="/#contact" variant="primary" className={styles.cta}>
            Hire me
          </Button>
          <button
            ref={burger}
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.bars} aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className={styles.menu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className={styles.menuList}>
                {LINKS.map((link, i) => (
                  <li key={link.id}>
                    <Link href={link.href}>
                      <a ref={i === 0 ? firstLink : undefined} className={styles.menuLink} aria-current={section === link.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                        <span className={styles.menuIndex}>0{i + 1}</span>
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.menuFoot}>
              <a className={styles.menuMail} href={profile.phoneHref}>
                {profile.phone}
              </a>
              <a className={styles.menuMail} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
