import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useEffect } from 'react'

/**
 * Scroll choreography (GSAP + ScrollTrigger). Everything is scrubbed to the scroll position — nothing is pinned and
 * scrolling is never intercepted, so the page always scrolls at the visitor's pace and every link stays reachable.
 *
 * Only runs when the visitor has not asked for reduced motion (gsap.matchMedia); otherwise the CSS resting poses
 * remain — the devices are still 3D, just static. Amplitudes are smaller on narrow screens.
 *
 *   hero exit        → hero copy drifts up and fades; the background (lines, monogram) fades out
 *   floors           → a perspective grid slides in under the first project, and at the top of Skills, Contact and the footer
 *   each project     → the device rig swings in with depth (rotate / rise / push back to front), layers drift at
 *                      different speeds (parallax), then the rig turns away slightly as the section leaves
 *   about            → the About sheet rises over the last project (which recedes); heading wipes in; the
 *                      timeline's spine draws as you scroll and each entry slides in
 *   every section    → [data-fly] blocks swing up out of depth (rotate / rise / push forward) as they arrive, the huge
 *                      section numerals drift on their own parallax, and the footer mark turns to face you
 */
export function useChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 900px)' }, (ctx) => {
      const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean }
      if (!motion) return

      const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel))

      /* ---- hero exit ---------------------------------------------------------------------------------------- */
      const hero = document.getElementById('hero')
      if (hero) {
        gsap.to('[data-hero-content]', { yPercent: wide ? -8 : -4, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: true } })
        gsap.to('[data-hero-visual]', { opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: '55% top', end: 'bottom top', scrub: true } })
      }

      /* ---- dimensional floor between hero and work ------------------------------------------------------------ */
      q('[data-floor]').forEach((floor) => {
        const section = floor.parentElement
        if (!section) return
        gsap.fromTo(floor, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 55%', scrub: true } })
        gsap.to(floor.firstElementChild, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top -40%', scrub: true } })
      })

      /* ---- each project -------------------------------------------------------------------------------------- */
      q('[data-project]').forEach((section, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        const rig = q('[data-rig]', section)[0]
        const stage = q('[data-stage]', section)[0]
        if (!rig || !stage) return

        // entrance: the composition swings in from depth
        gsap.fromTo(
          rig,
          { rotationY: dir * (wide ? 30 : 12), rotationX: wide ? 14 : 6, yPercent: wide ? 16 : 8, z: wide ? -260 : -100 },
          { rotationY: 0, rotationX: 0, yPercent: 0, z: 0, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 88%', end: 'top 38%', scrub: 0.8 } },
        )
        gsap.fromTo(stage, { opacity: 0.1 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 55%', scrub: true } })

        // exit: turn away slightly and sink back as the next section approaches
        gsap.to(rig, {
          rotationY: dir * -(wide ? 9 : 4),
          yPercent: wide ? -8 : -4,
          z: -70,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: section, start: 'center 28%', end: 'bottom top', scrub: 0.8 },
        })

        // parallax: layers drift at different speeds (wide screens only — keeps phones light)
        if (wide) {
          q('[data-depth]', section).forEach((el) => {
            const depth = Number(el.getAttribute('data-depth')) || 0
            if (!depth) return
            const isNumeral = depth < -0.5
            gsap.fromTo(el, { yPercent: depth * (isNumeral ? -34 : 16) }, { yPercent: depth * (isNumeral ? 34 : -16), ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } })
          })
        }
      })

      /* ---- transition into About ------------------------------------------------------------------------------ */
      const about = document.getElementById('about')
      const last = q('[data-project]').slice(-1)[0]
      if (about && last) {
        gsap.to(q('[data-rig]', last)[0], { scale: wide ? 0.9 : 0.96, opacity: 1, ease: 'none', immediateRender: false, scrollTrigger: { trigger: about, start: 'top bottom', end: 'top 25%', scrub: true } })
        gsap.to(q('[data-stage]', last)[0], { opacity: 0.25, ease: 'none', immediateRender: false, scrollTrigger: { trigger: about, start: 'top 85%', end: 'top 30%', scrub: true } })
      }
      const wipe = q('[data-wipe]')[0]
      if (wipe) {
        gsap.fromTo(wipe, { clipPath: 'inset(0 100% 0 0)', x: -20 }, { clipPath: 'inset(0 0% 0 0)', x: 0, ease: 'power2.out', scrollTrigger: { trigger: wipe, start: 'top 92%', end: 'top 55%', scrub: 0.6 } })
      }

      /* ---- experience timeline ---------------------------------------------------------------------------------- */
      const spine = q('[data-spine]')[0]
      if (spine) {
        const timeline = q('[data-timeline]')[0]
        const nodes = q('[data-entry]').map((entry) => ({ entry, node: entry.querySelector<HTMLElement>('[data-node]') }))
        // each node lights up when the tip of the spine reaches it, and goes dark again when you scroll back past it
        const light = (progress: number) => {
          const reach = progress * timeline.offsetHeight
          nodes.forEach(({ entry, node }) => {
            if (node) node.toggleAttribute('data-lit', entry.offsetTop + node.offsetTop + node.offsetHeight / 2 <= reach)
          })
        }
        gsap.fromTo(spine, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: '50% 0', scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 60%', scrub: true, onUpdate: (self) => light(self.progress), onRefresh: (self) => light(self.progress) } })
      }
      q('[data-entry]').forEach((entry) => {
        gsap.fromTo(entry, { opacity: 0, x: wide ? -36 : -16, rotationY: wide ? -8 : 0 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: entry, start: 'top 85%', toggleActions: 'play none none none' } })
      })

      /* ---- depth for every other section ------------------------------------------------------------------------ */
      q('[data-fly]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: wide ? 80 : 36, z: wide ? -200 : -80, rotationX: wide ? 16 : 7, transformPerspective: 1200, transformOrigin: '50% 100%' },
          { opacity: 1, y: 0, z: 0, rotationX: 0, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 58%', scrub: 0.7 } },
        )
      })
      if (wide) {
        q('[data-numeral]').forEach((el) => {
          const section = el.parentElement
          if (section) gsap.fromTo(el, { yPercent: -16 }, { yPercent: 16, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
      }
      const mark = q('[data-mark]')[0]
      if (mark) {
        gsap.fromTo(mark, { rotationY: wide ? -55 : -30, opacity: 0.2, transformPerspective: 700, transformOrigin: '0 50%' }, { rotationY: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: mark, start: 'top 98%', end: 'top 70%', scrub: 0.6 } })
      }

      // images and fonts change section heights after hydration; keep the triggers honest
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => undefined)
      return () => window.removeEventListener('load', refresh)
    })

    return () => mm.revert()
  }, [])
}
