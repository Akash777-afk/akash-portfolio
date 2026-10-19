import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * How the HERO is rendered. The project showcases are always CSS-3D (visible by default for everyone);
 * only the hero's WebGL scene is optional.
 *   3d     → react-three-fiber hero scene (lazy-loaded)
 *   static → the same three devices as a CSS-3D composition
 *
 * The decision is made synchronously in <head> (see pages/_document.tsx) so the first paint already has the right
 * layout and nothing shifts. This context mirrors it and lets a runtime failure fall back to static.
 */
export type HeroMode = '3d' | 'static'

interface ExperienceValue {
  /** null until the client has read the pre-paint decision. */
  mode: HeroMode | null
  /** Why 3D isn't used: '' | 'reduced-motion' | 'no-webgl' | 'low-power' | 'error' */
  reason: string
  fallBackToStatic: () => void
}

const ExperienceContext = createContext<ExperienceValue>({ mode: null, reason: '', fallBackToStatic: () => undefined })

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<HeroMode | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    const root = document.documentElement
    setMode(root.dataset.exp === '3d' ? '3d' : 'static')
    setReason(root.dataset.expWhy || '')

    // Honour a live change of the OS reduced-motion setting.
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      if (query.matches) {
        root.dataset.exp = 'static'
        root.dataset.expWhy = 'reduced-motion'
        setMode('static')
        setReason('reduced-motion')
      }
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const fallBackToStatic = useCallback(() => {
    document.documentElement.dataset.exp = 'static'
    document.documentElement.dataset.expWhy = 'error'
    setMode('static')
    setReason('error')
  }, [])

  const value = useMemo(() => ({ mode, reason, fallBackToStatic }), [mode, reason, fallBackToStatic])
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export const useExperience = () => useContext(ExperienceContext)
