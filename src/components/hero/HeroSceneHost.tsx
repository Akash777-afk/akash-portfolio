import dynamic from 'next/dynamic'
import { Component, useEffect, useMemo, useState, type ReactNode } from 'react'
import { img } from '../../content/projects'
import { useExperience } from '../../lib/experience'
import styles from './HeroSceneHost.module.css'

// three + react-three-fiber are a separate chunk, fetched only when the hero scene is used.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => null })

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Mounts the hero scene lazily (after idle), fades it in once rendered, and falls back to the CSS hero on any failure. */
export function HeroSceneHost({ active }: { active: boolean }) {
  const { mode, fallBackToStatic } = useExperience()
  const [armed, setArmed] = useState(false)
  const [ready, setReady] = useState(false)
  const [flags, setFlags] = useState({ lite: false, compact: false })

  useEffect(() => {
    if (mode !== '3d') {
      setArmed(false)
      setReady(false)
      return
    }
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.innerWidth < 760
    setFlags({ lite: coarse || narrow, compact: narrow })
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const handle = idle ? idle(() => setArmed(true), { timeout: 500 }) : window.setTimeout(() => setArmed(true), 200)
    return () => {
      if (!idle) window.clearTimeout(handle)
    }
  }, [mode])

  const textures = useMemo(() => {
    const phoneA = img('breakfit', 'home')
    const browser = img('iot', 'hero')
    const phoneB = img('validate', 'phone')
    const pick = (i: ReturnType<typeof img>) => (flags.lite ? i.small : i.src)
    return {
      phoneA: pick(phoneA),
      phoneAspectA: phoneA.w / phoneA.h,
      browser: pick(browser),
      browserAspect: browser.w / browser.h,
      phoneB: pick(phoneB),
      phoneAspectB: phoneB.w / phoneB.h,
    }
  }, [flags.lite])

  if (mode !== '3d' || !armed) return null

  return (
    <div className={styles.host} data-hero-scene data-ready={ready} aria-hidden="true">
      <SceneBoundary onError={fallBackToStatic}>
        <HeroScene textures={textures} paused={!active} lite={flags.lite} compact={flags.compact} onReady={() => setReady(true)} onLost={fallBackToStatic} />
      </SceneBoundary>
    </div>
  )
}
