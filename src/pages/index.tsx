import Head from 'next/head'
import { useEffect } from 'react'
import { Hero } from '../components/hero/Hero'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Skills } from '../components/sections/Skills'
import { Work } from '../components/work/Work'
import { profile } from '../content/profile'
import { provisionalLinks } from '../content/projects'
import { useChoreography } from '../lib/choreography'

export default function Home() {
  useChoreography()

  // Dev-only reminder: launch-blocking links that still need replacing.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    provisionalLinks.forEach((l) => console.warn(`[portfolio] Provisional link — ${l.project}: ${l.href}\n  ${l.reason}`))
  }, [])

  return (
    <>
      <Head>
        <title>{profile.siteTitle}</title>
      </Head>
      <Hero />
      <Work />
      <About />
      <Skills />
      <Contact />
    </>
  )
}
