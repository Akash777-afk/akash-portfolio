/**
 * Tiny mutable store shared between the DOM (GSAP ScrollTrigger / pointer) and the WebGL hero scene (per frame).
 * It is deliberately not React state: the scene reads it every frame without re-rendering anything.
 */
export const sceneStore = {
  /** Hero exit progress: 0 = hero fully in view, 1 = hero scrolled out. */
  heroT: 0,
  /** Normalised pointer in [-1, 1], only updated for fine pointers. */
  pointerX: 0,
  pointerY: 0,
}

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))

/** smootherstep easing on [0, 1] */
export const smoother = (x: number) => {
  const c = clamp(x)
  return c * c * c * (c * (c * 6 - 15) + 10)
}
