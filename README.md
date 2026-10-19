# Akash Ganapathy — Portfolio

A futuristic single-page portfolio for a UI/UX designer and frontend developer: three projects (BreakFit, IoT Device Monitoring and Observability, Validate) shown as real screenshots on 3D devices, with an About section (experience timeline, education, contact), a Skills section and a downloadable résumé.

```bash
npm install
npm run dev          # http://localhost:3100  (development)
npm run build        # type-check + production build
npm run start        # http://localhost:3100  (serves the production build)
npm run typecheck    # tsc --noEmit
npm run assets       # re-generate /public/work (WebP + src/content/assets.generated.json) from the source screenshots
npm run capture      # re-capture screenshots from the live apps (needs local Chrome)
npm run resume       # print /resume to public/Akash-Ganapathy-Resume.pdf (the server must be running on :3100)
npm run check:links  # list every external link, flag provisional ones (--strict exits 1 if any are provisional)
```

3D is the default experience. `/?view=static` forces the CSS-only hero (nothing is persisted).

## Stack — and why each dependency is here

| Dependency | Purpose | Notes |
|---|---|---|
| **Next.js 12.3** (pages router) | Routing, static generation of `/`, `/resume`, `404`. | Pinned to 12.3 because this machine runs Node 14. |
| **React 18 + TypeScript (strict)** | UI and types. | `noUnusedLocals/Parameters` on. |
| **three + @react-three/fiber** | The hero scene only (three real devices on a lit floor). | Lazy-loaded (`next/dynamic`, ssr: false); never downloaded when the CSS hero is used. `drei` was left out on purpose. |
| **GSAP + ScrollTrigger** | Scroll choreography of the device compositions (entrance, parallax layers, exit), the hero → work hand-over and the timeline spine. | Scrub only; **nothing is pinned**, scroll is native. Disabled under `prefers-reduced-motion`. |
| **framer-motion 10 (Motion for React)** | Reveal-on-view, the skills tab transitions, menu transitions. | |
| **CSS Modules + custom properties** | All styling and the design tokens (`src/styles/tokens.css`). | No Tailwind. |
| puppeteer-core *(dev only)* | `assets`, `capture`, `resume` scripts. | Uses local Chrome. |

## What is where

- `src/content/profile.ts` — every personal fact (contact details, experience, education, skills). `src/content/projects.ts` — the three projects, their links and facts.
- `src/components/hero` — the hero. **A translucent glass panel** (graphite, `backdrop-filter: blur(22px) saturate(1.4)`, 1 px low-contrast border, inner highlight, restrained shadow) carries the name, role, pitch and CTAs. On ≥ 1000 px the panel is the left column and the device scene the right one, so text and devices never share a box; below that the scene sits above the panel. The name is sized to the panel (`cqw`), not the viewport. Without `backdrop-filter` support the panel falls back to a near-opaque plate (`@supports`), so the copy never depends on blur.
- `src/components/devices` — CSS-3D `PhoneDevice`, `BrowserDevice` (stacked thickness layers, glare, reflections) and `FloatingPanel`. `src/components/work` — each project's composition (`Scene`, `Slot`) and section.
- `src/components/sections` — About (timeline, education, contact), Skills (four tabs), Contact.
- `scripts/assets.config.js` — which source image becomes which asset. Real screenshots only; nothing is generated.

## Links

| Project | Primary (title, device, first button) | Secondary |
|---|---|---|
| BreakFit | Live app — https://breakfast-app-one.vercel.app/#/ | Case study — Behance gallery 239959937 |
| IoT Device Monitoring and Observability | Live demo — https://iot-dashboard-snowy.vercel.app/#/login (opens at the **login page**; no credentials are shown or bypassed) | — |
| Validate | Case study — Behance (**provisional**, see below) | — |

All external links open in a new tab with `rel="noopener noreferrer"`.

**Validate — public URL still needed.** The supplied link is a Behance *owner/editor* URL (`…/portfolio/editor?project_id=243124257`), not a public project URL, so visitors who are not signed in as the owner cannot rely on it. It is kept as supplied, flagged in `projects.ts` (`provisional`) and reported by `npm run check:links`. Replace it with the verified public Behance project URL before launch. No separate live Validate application URL exists and none was invented.

## Résumé

`/resume` is a print layout built from the same data as the site; `npm run resume` prints it to `public/Akash-Ganapathy-Resume.pdf` (A4, one page). Restart `next start` after regenerating — files added to `public/` after start are not served by the production server. The old `Main_Resume.pdf` in Downloads was **not** used: it has a different phone number and different Fosters dates.

## Accessibility and motion

Contrast tokens are ≥ 4.6:1; the hero copy measured 7.6:1–17.6:1 against the worst-case backdrop (see the test list below). Under `prefers-reduced-motion` the CSS-3D hero replaces WebGL, scroll choreography is off and no CSS animation runs. No custom cursor, no scroll hijacking. Tab order starts at the skip link; the skills tabs are a roving-tabindex tablist.

## Verified (production build, headless Chrome)

- 72 acceptance checks: exactly three projects, every link target and `rel`, external navigation to the real apps, 3D by default (default / reduced-motion / mobile), ScrollTrigger behaviour, About/education/contact content, Skills groups, keyboard paths, contact form, résumé download, route 404s.
- 40 hero checks: panel styling (blur + saturation, translucent but dark enough, thin border, radius, shadow), all copy inside the panel and the name unclipped at 1920, 1440, 1280, 1366×640, 1024, 1000, 768, 390, 360 and 320 px, no panel/scene overlap, CTAs inside the first screen on desktop, worst-case contrast of every text element against the real backdrop, and the no-`backdrop-filter` fallback.
- axe-core: 0 violations on home (3D top, 3D fully scrolled, reduced motion, mobile), `/resume` and `404`. No horizontal overflow 320–1920 px, touch targets ≥ 44 px at 390 px.

## Known limitations

- **IoT dashboard image.** The site currently uses the IoT dashboard captured earlier from the live app (`public/work/iot/*`). A newly supplied IoT screenshot could not be located in the workspace (see the hand-over notes); it has **not** been swapped in. Once the file path is known, add it to `scripts/assets.config.js` as the `iot/dashboard` source and run `npm run assets` — the hero textures, the browser frame and the three floating panel crops are all derived from that one source.
- **Validate has no desktop or mobile app screens** beyond the author's cover; the phone screen is extracted from the cover with a perspective warp (real pixels, not redrawn).
- **Behance blocks automated requests (HTTP 403)**, so those links can only be confirmed by opening them in a browser.
- **3D performance on real GPUs is untested.** Headless Chrome uses software WebGL; a pixel-ratio governor and the CSS fallback exist for slow devices, but try it on real hardware.
- Fonts (Unbounded, Manrope, JetBrains Mono) load from Google Fonts; offline, system fallbacks are used.
- There is no LinkedIn link because none was supplied. The contact form has no backend: it composes a `mailto:` to the address in `profile.ts`.
