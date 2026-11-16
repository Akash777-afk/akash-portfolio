import assetManifest from './assets.generated.json'

/**
 * The portfolio's three main projects (and, further down, `otherProjects`).
 *
 * Three destinations are kept distinct everywhere:
 *   1. the portfolio's own presentation of the project (the 3D device composition),
 *   2. the real live application (`live`),
 *   3. the external case study (`caseStudy`).
 * `primary` says which of 2 / 3 the title, the device and the first button open, so every click target is predictable.
 */

export interface ProjectLink {
  href: string
  /** Button text */
  label: string
  /** Set when the destination still has to be confirmed — see scripts/check-links.js and the README. */
  provisional?: string
}

export interface Project {
  slug: 'breakfit' | 'iot' | 'validate'
  index: string
  title: string
  shortTitle: string
  kicker: string
  summary: string
  status: string
  /** One honest line about what the visitor will find at the destination (e.g. a login wall). */
  note?: string
  problem: string
  role: string
  stack: string[]
  facts: { value: string; label: string }[]
  live?: ProjectLink
  caseStudy?: ProjectLink
  primary: 'live' | 'caseStudy'
}

export const projects: Project[] = [
  {
    slug: 'breakfit',
    index: '01',
    title: 'BreakFit — Smart Breakfast Solutions',
    shortTitle: 'BreakFit',
    kicker: 'Consumer app · mobile-first',
    summary: 'A breakfast app that makes the daily order a few taps: browse, customise, schedule, subscribe and pay — with a health tracker and dietician insight.',
    status: 'Live application',
    problem: 'Breakfast gets skipped when choosing and ordering takes too long. BreakFit shortens the path from hunger to a scheduled order.',
    role: 'UI/UX design and frontend development — from wireframes to the deployed app.',
    stack: ['React 18', 'TypeScript', 'Vite', 'CSS Modules'],
    facts: [
      { value: '39', label: 'dishes across salads, beverages and millets' },
      { value: '0', label: 'axe-core accessibility violations' },
    ],
    live: { href: 'https://breakfast-app-one.vercel.app/#/', label: 'Live app' },
    caseStudy: { href: 'https://www.behance.net/gallery/239959937/BreakFit-Smart-Breakfast-Solutions', label: 'Case study' },
    primary: 'live',
  },
  {
    slug: 'iot',
    index: '02',
    title: 'IoT Device Monitoring and Observability',
    shortTitle: 'IoT Observability',
    kicker: 'Operations dashboard · desktop',
    summary: 'One operations console for a 100,114-device IoT fleet: device health, SIM-applet rollout, security posture and network analytics.',
    status: 'Live demo',
    note: 'Sign-in required — the live demo opens at its login page.',
    problem: 'Operators need to see fleet health, applet rollout and security in one place — and act on it without switching tools.',
    role: 'UI/UX design and frontend development of the dashboard, including the reduced, validated dataset behind it.',
    stack: ['React 18', 'TypeScript', 'Vite', 'CSS Modules'],
    facts: [
      { value: '100,114', label: 'devices in view' },
      { value: '1M → 100K', label: 'rows, stratified and validated' },
    ],
    live: { href: 'https://iot-dashboard-snowy.vercel.app/#/login', label: 'Live demo' },
    caseStudy: { href: 'https://iot-case-study.vercel.app/', label: 'Case study' },
    primary: 'live',
  },
  {
    slug: 'validate',
    index: '03',
    title: 'Validate — Secure Background Verification',
    shortTitle: 'Validate',
    kicker: 'Mobile UX case study',
    summary: '“Verify once, share anywhere”: a mobile app concept that keeps employment, education and background verification in one place.',
    status: 'UX case study',
    note: 'A concept project, presented 28 January 2026 — there is no live application.',
    problem: 'People prove the same credentials again for every employer, university and vendor. Validate explores verifying once and sharing anywhere.',
    role: 'UX and UI design of the app, and the case-study presentation.',
    stack: ['Mobile UX', 'UI design', 'Case-study presentation'],
    facts: [
      { value: '3', label: 'verification states: verified, pending, in progress' },
      { value: '4', label: 'core tabs: Home, Credentials, Verify, Profile' },
    ],
    caseStudy: {
      href: 'https://www.behance.net/portfolio/editor?project_id=243124257',
      label: 'Case study',
      provisional: 'This is a Behance owner/editor URL (…/portfolio/editor?project_id=243124257). Replace it with the verified public project URL before launch.',
    },
    primary: 'caseStudy',
  },
]

/**
 * Other projects: UX case studies shown more compactly below the three main projects. Each one has a case study
 * only (no live app), so the title, the composition and the button all open the case study.
 */
export interface OtherProject {
  slug: 'sdwan' | 'irctc'
  title: string
  kicker: string
  summary: string
  /** What was wrong before */
  problem: string
  /** What the redesign changed */
  outcome: string
  tools: string[]
  published: string
  caseStudy: ProjectLink
}

export const otherProjects: OtherProject[] = [
  {
    slug: 'sdwan',
    title: 'SD-WAN Management — Redesigned',
    kicker: 'Enterprise dashboard · UX redesign',
    summary:
      'A redesign of a software-defined wide-area-network console: one dashboard to control every branch network, with link optimisation, security and application-aware routing.',
    problem: 'The previous design had a weak visual hierarchy, an inconsistent design system and call-to-action buttons that were easy to miss.',
    outcome: 'A clear visual hierarchy, one consistent design system, CTAs where they are needed and a better-organised content structure.',
    tools: ['Figma', 'Adobe XD'],
    published: 'February 2026',
    caseStudy: { href: 'https://www.behance.net/gallery/243946651/SD-WAN-management', label: 'Case study' },
  },
  {
    slug: 'irctc',
    title: 'IRCTC Website Redesign',
    kicker: 'Public-service website · UX case study',
    summary: 'How thoughtful UX decisions can reduce stress and errors in one of India’s most critical public-service platforms: train ticket booking.',
    problem: 'The current site is cluttered and hard to navigate, with poor readability and a high cognitive load — especially for first-time and elderly users.',
    outcome: 'A streamlined search, clear calls to action and a step-by-step booking flow that cuts booking time and errors for every age group.',
    tools: ['Figma', 'FigJam'],
    published: 'December 2025',
    caseStudy: { href: 'https://www.behance.net/gallery/240435669/IRCTC-Website-Redesign-UX-Case-Study', label: 'Case study' },
  },
]

export const primaryLink = (p: Project): ProjectLink => (p.primary === 'live' ? p.live! : p.caseStudy!)

export const provisionalLinks = [
  ...projects.flatMap((p) => ([p.live, p.caseStudy].filter(Boolean) as ProjectLink[]).map((l) => ({ project: p.title, link: l }))),
  ...otherProjects.map((p) => ({ project: p.title, link: p.caseStudy })),
]
  .filter(({ link }) => link.provisional)
  .map(({ project, link }) => ({ project, href: link.href, reason: link.provisional as string }))

/* ---------------------------------------------------------------------------------------------- images */

type Manifest = Record<string, Record<string, { w: number; h: number; widths: number[] }>>
const manifest = assetManifest as Manifest

export interface ResolvedImage {
  src: string
  small: string
  srcSet: string
  w: number
  h: number
}

/** Resolve an asset to URLs and intrinsic size. Throws loudly if the asset pipeline hasn't produced it. */
export function img(slug: string, key: string): ResolvedImage {
  const entry = manifest[slug]?.[key]
  if (!entry) throw new Error(`Missing asset ${slug}/${key} — run "npm run assets".`)
  const widths = [...entry.widths].sort((a, b) => a - b)
  const url = (w: number) => `/work/${slug}/${key}-${w}.webp`
  return { src: url(widths[widths.length - 1]), small: url(widths[0]), srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '), w: entry.w, h: entry.h }
}
