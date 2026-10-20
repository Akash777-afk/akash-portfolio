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
npm run resume       # print the site-data /resume page to assets/generated/ (server on :3100) — does not touch the served résumé
npm run check:links  # list every external link, flag provisional ones (--strict exits 1 if any are provisional)
```

## Stack — and why each dependency is here

| Dependency | Purpose | Notes |
|---|---|---|
| **Next.js 12.3** (pages router) | Routing, static generation of `/`, `/resume`, `404`. | Pinned to 12.3 because this machine runs Node 14. |
| **React 18 + TypeScript (strict)** | UI and types. | `noUnusedLocals/Parameters` on. |
| **GSAP + ScrollTrigger** | Scroll choreography of the device compositions (entrance, parallax layers, exit), the hero → work hand-over and the timeline spine. | Scrub only; **nothing is pinned**, scroll is native. Disabled under `prefers-reduced-motion`. |
| **framer-motion 10 (Motion for React)** | Reveal-on-view, the skills tab transitions, menu transitions. | |
| **CSS Modules + custom properties** | All styling and the design tokens (`src/styles/tokens.css`). | No Tailwind. |
| puppeteer-core *(dev only)* | `assets`, `capture`, `resume` scripts. | Uses local Chrome. |

## What is where

- `src/content/profile.ts` — every personal fact (contact details, experience, education, skills). `src/content/projects.ts` — the three projects, their links and facts.
- `src/components/hero` — the hero. **A translucent glass panel** (graphite, `backdrop-filter: blur(22px) saturate(1.4)`, 1 px low-contrast border, inner highlight, restrained shadow) carries the name, role, pitch and CTAs and is the left column on ≥ 1000 px (above the visual on smaller screens). The right column is `GlassVisual`: **one large frosted-glass interface** (see below). Without `backdrop-filter` support both fall back to near-opaque plates (`@supports`).
- `src/components/devices` — CSS-3D `PhoneDevice`, `BrowserDevice` (stacked thickness layers, glare, reflections) and `FloatingPanel`. `src/components/work` — each project's composition (`Scene`, `Slot`) and section.
- `src/components/sections` — About (timeline, education, contact), Skills (four tabs), Contact.
- `src/components/ui/Slab` — the 3D building block used by every card outside the project sections: a perspective wrapper, a preserve-3d slab, 4–6 stacked thickness layers behind the face (3 on phones), a resting angle so its edges show, a contact shadow, and pointer tilt (mouse only). `DepthFloor` (a perspective lime grid receding to a horizon at the top of Work, Skills, Contact and the footer) and `Numeral` (huge extruded 02/03/04) complete the set.
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

**The "Download résumé" buttons (About, Contact, footer) serve `public/Akash-Ganapathy-Resume.pdf`, which is the résumé file the author supplied (`Resume.pdf`), byte for byte.** To change the résumé, replace that file and restart `next start` (files added to `public/` after start are not served by the production server). `/resume` is a separate print layout built from the site data; `npm run resume` prints it to `assets/generated/` and never overwrites the supplied file. Note the supplied PDF itself still contains the earlier email address (`akashganapathy367@gmail.com`); the site's contact email is `akashg07199@gmail.com`.

## How the 3D works across the page

- **Hero (`GlassVisual`):** one frosted-glass interface built from plain DOM + inline SVG + CSS 3D — no canvas, no library. Layers, back to front: a lime perspective grid and a green light pool on the floor · a blurred lime backlight · three stacked plates for glass thickness (the last carries a lime edge light) · the glass panel (backdrop blur + saturation, gradient rim, diagonal reflection) holding the headline figure, a smooth-curve area chart with a highlighted data point, and a KPI row · two small floating glass cards (network-quality donut, circle-wise bars) standing in front at different depths. The object sits at about −15° / 7° under a 1700 px perspective; the mouse (fine pointers only) turns it a few degrees. Everything is sized from one unit (`--u` = 1 % of the object's width, derived from the stage with container-query units), so it scales as one piece; in containers narrower than 520 px it simplifies to the panel, the headline figure, the chart and the donut. The figures (100,114 devices, 8,103 out of reach, 22,025 applet rollouts, 702 blacklisted) are the ones the IoT Observability project shows; the curves and the quality split are drawn for effect and are not live data.
- **Projects:** CSS-3D device compositions (stacked layers, perspective, scroll-scrubbed swing-in and parallax).
- **About / Skills / Contact / footer:** every card is a `Slab` — timeline entries, education, contact details, the contact form (with recessed fields), the skills console (thick frame) and each skill tile. Tabs and buttons are keycaps with a visible side wall that drops when pressed. Headings carry a stepped extrusion, the section numerals and the footer mark are extruded solids, and each region (`[data-fly]`) swings up out of depth as it scrolls in (GSAP, scrubbed, never pinned).
- All text, links and form fields remain real DOM; the thickness layers are pointer-transparent, so everything stays clickable. Under `prefers-reduced-motion` the slabs keep their resting pose and thickness but nothing tilts, flies or transitions.

## Accessibility and motion

Contrast tokens are ≥ 4.6:1; the hero copy measured 7.6:1–17.6:1 against the worst-case backdrop (see the test list below). The hero's motion is a fade-in, the chart line drawing itself, a slow float and a breathing glow; under `prefers-reduced-motion` all of it is off (the chart is fully drawn, the object keeps its pose), pointer tilt is off, scroll choreography is off and no CSS animation runs. No custom cursor, no scroll hijacking. Tab order starts at the skip link; the skills tabs are a roving-tabindex tablist.

## Verified (production build, headless Chrome)

- 29 checks for the 3D system (`pf-3d`): slab construction on desktop and mobile, resting angles, hit-testing of links, copy buttons and form fields through the 3D stack, pointer tilt and return, keycap press, extruded numerals / headings / footer mark, floors, scroll fly-in, reduced motion.
- 75 acceptance checks (including a real click-to-download of the résumé compared byte for byte with the supplied file): exactly three projects, every link target and `rel`, external navigation to the real apps, 3D by default (default / reduced-motion / mobile), ScrollTrigger behaviour, About/education/contact content, Skills groups, keyboard paths, contact form, résumé download, route 404s.
- 88 checks for the hero visual (`pf-glass`): one glass object and nothing else (no canvas, images or device mockups); real perspective and `preserve-3d` down the chain; frosted-glass construction (blur + saturate, translucent stops, rim and reflection); thickness plates and floating cards at positive depth; the near-opaque fallback without `backdrop-filter`; at 1920, 1440, 1280, 1366×640, 1024, 1000, 900, 820, 768, 430, 390, 360 and 320 px: no overflow, the object clear of the copy panel and of the nav, nothing covering a link or button, chart visible, simplified on small containers; contrast of every string in the glass against what is actually behind it; motion (default vs reduced), pointer tilt, scroll exit; and that no three.js code is downloaded.
- 40 checks for the copy panel (`pf-hero`): its styling, containment of every line, name unclipped, CTAs in the first screen, contrast, fallback.
- axe-core: 0 violations on home (3D top, 3D fully scrolled, reduced motion, mobile), `/resume` and `404`. No horizontal overflow 320–1920 px, touch targets ≥ 44 px at 390 px.

## Known limitations

- **IoT screenshots.** The IoT project section shows the fleet-overview capture and its three panel crops (`iot/dashboard`, `iot/panel-*`). The analytics screen you supplied is kept at `assets/source/iot-analytics.png` (1918×825) but is no longer used: the hero is now the illustrated glass interface. To use it somewhere, add it to `scripts/assets.config.js` and run `npm run assets`.
- **Validate has no desktop or mobile app screens** beyond the author's cover; the phone screen is extracted from the cover with a perspective warp (real pixels, not redrawn).
- **Behance blocks automated requests (HTTP 403)**, so those links can only be confirmed by opening them in a browser.
- Fonts (Unbounded, Manrope, JetBrains Mono) load from Google Fonts; offline, system fallbacks are used.
- There is no LinkedIn link because none was supplied. The contact form has no backend: it composes a `mailto:` to the address in `profile.ts`.
