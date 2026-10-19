import { useRouter } from 'next/router'
import { useEffect, useRef, type ReactNode } from 'react'
import { Footer } from './Footer'
import { Nav } from './Nav'
import styles from './Layout.module.css'

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const bare = router.pathname === '/resume' // the printable résumé has no site chrome

  // After a client-side route change, move focus to the new page's content (not on first load).
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (router.asPath.includes('#')) return
    main.current?.focus({ preventScroll: true })
  }, [router.asPath])

  if (bare) return <main id="main">{children}</main>

  return (
    <div id="top" className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
