import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { Hero } from '../components/hero/Hero'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { Skills } from '../components/sections/Skills'
import { Work } from '../components/work/Work'
import { profile } from '../content/profile'
import { provisionalLinks } from '../content/projects'
import { useChoreography } from '../lib/choreography'
import { useExperience } from '../lib/experience'
import { sceneStore } from '../lib/sceneStore'

export default function Home() {
  const { mode } = useExperience()
  const heroRef = useRef<HTMLElement>(null)
  const [sceneActive, setSceneActive] = useState(true)

  useChoreography()

  // Render the WebGL hero only while the hero is on screen.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || mode !== '3d') return
    const observer = new IntersectionObserver(([entry]) => setSceneActive(entry.isIntersecting), { rootMargin: '8% 0px 8% 0px' })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [mode])

  // Subtle pointer parallax for the WebGL hero — mouse only.
  useEffect(() => {
    if (mode !== '3d' || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      sceneStore.pointerX = (event.clientX / window.innerWidth) * 2 - 1
      sceneStore.pointerY = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      sceneStore.pointerX = 0
      sceneStore.pointerY = 0
    }
  }, [mode])

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
      <Hero ref={heroRef} sceneActive={sceneActive} />
      <Work />
      <About />
      <Skills />
      <Contact />
    </>
  )
}
