/**
 * Personal details and site copy — everything the site says about Akash lives here.
 * Contact details, experience, education and skills are exactly as supplied; nothing is added to them.
 */
export const profile = {
  name: 'Akash Ganapathy',
  firstName: 'Akash',
  lastName: 'Ganapathy',
  title: 'UI/UX Designer & Frontend Developer',
  location: 'Chennai, India',
  phone: '+91 9944601512',
  /** E.164 form for the tel: link */
  phoneHref: 'tel:+919944601512',
  email: 'akashganapathy367@gmail.com',
  siteTitle: 'Akash Ganapathy — UI/UX Designer & Frontend Developer',
  description:
    'UI/UX designer and frontend developer in Chennai, India. Enterprise interface design, Figma prototyping and Angular / React implementation — plus BreakFit, an IoT monitoring dashboard and the Validate case study.',
  intro:
    'I design interfaces for complex products and build them in Angular and React — analytical thinking, user-centred design and frontend execution in one workflow.',
  ticker: ['UI/UX design', 'Frontend development', 'Design systems', 'Figma', 'Angular', 'React', 'TypeScript', 'Responsive web design'],
  resumePdf: '/Akash-Ganapathy-Resume.pdf',
}

export const aboutIntro = {
  heading: 'Analytical by training, human-centred by practice.',
  paragraphs: [
    'I came to interface design through Psychology — a B.Sc. and an M.Sc. — which taught me to reason from evidence and to understand how people notice, decide and make mistakes.',
    'That is how I work now: start from requirements and usability evidence, shape flows and wireframes in Figma, then carry the design into Angular and React so that what ships is what was designed.',
  ],
}

export interface Role {
  id: string
  period: string
  title: string
  company: string
  detail: { label: string; value: string }
  summary: string
  responsibilities: string[]
  current?: boolean
}

export const experience: Role[] = [
  {
    id: 'testyantra',
    period: 'February 2026 – Present',
    title: 'UI/UX Designer',
    company: 'TestYantra Software Solutions Pvt. Ltd.',
    detail: { label: 'Client', value: 'Tierone OSS Solutions' },
    summary: 'Responsibilities include:',
    responsibilities: ['Enterprise interface design', 'Requirements analysis', 'Figma prototyping', 'Angular frontend implementation', 'Reusable components', 'Responsive interfaces'],
    current: true,
  },
  {
    id: 'fosters',
    period: 'February 2023 – January 2026',
    title: 'UI Designer',
    company: 'Fosters Technologies Private Limited',
    detail: { label: 'Location', value: 'Bangalore, India' },
    summary: 'Responsibilities include:',
    responsibilities: ['UI design', 'Wireframing', 'High-fidelity prototyping', 'Visual consistency', 'Interface layouts', 'Reusable UI patterns'],
  },
]

export const education = [
  { degree: 'M.Sc. Psychology', institution: 'Annamalai University', year: '2022' },
  { degree: 'B.Sc. Psychology', institution: null, year: 'Completed 2020' },
]

export interface SkillGroup {
  id: string
  label: string
  short: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'design',
    label: 'Design & UX',
    short: 'Design',
    skills: ['Figma', 'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'Information Architecture', 'User Flow Development', 'Usability Evaluation'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    short: 'Frontend',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Angular', 'React'],
  },
  {
    id: 'engineering',
    label: 'UI Engineering',
    short: 'UI Engineering',
    skills: ['Responsive Interface Implementation', 'Reusable Component Development', 'Design Systems & Visual Consistency', 'Design-to-Development Workflows'],
  },
  {
    id: 'tools',
    label: 'Tools',
    short: 'Tools',
    skills: ['Visual Studio Code', 'GitHub', 'Vercel', 'GitLab'],
  },
]

/** Used to build THIS website only — deliberately kept separate from the résumé skills above. */
export const portfolioBuildStack = ['Next.js', 'React', 'TypeScript', 'three.js + react-three-fiber', 'GSAP + ScrollTrigger', 'Motion for React', 'CSS Modules']
