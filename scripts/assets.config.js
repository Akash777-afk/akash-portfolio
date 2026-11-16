/**
 * Source → output map for every image on the site.
 *
 * Nothing here is generated or redrawn: each entry is a real screenshot or the author's own artwork that is only
 * resized, cropped and re-encoded.
 *
 * Output:  public/work/<slug>/<key>-<width>.webp   (+ src/content/assets.generated.json with the pixel sizes)
 */
const DOWNLOADS = 'C:/Users/Admin/Downloads'
const RAW =
  process.env.PF_RAW ||
  'C:/Users/Admin/AppData/Local/Temp/claude/C--Users-Admin-Desktop-iot/74ffc6bd-a35f-4776-a67d-16ce50bce379/scratchpad/raw'

const SOURCE = require('path').join(__dirname, '..', 'assets', 'source').replace(/\\/g, '/') // screenshots supplied by the author, kept in the repo

const WIDE = [1920, 960] // desktop screens
const PHONE = [780, 390] // mobile screens

module.exports = {
  CHROME: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  RAW,
  images: [
    // BreakFit — captured from the live deployment (see capture-screens.js)
    { slug: 'breakfit', key: 'home', src: `${RAW}/live/bf-home.png`, widths: PHONE },
    { slug: 'breakfit', key: 'dish', src: `${RAW}/live/bf-dish.png`, widths: PHONE },
    { slug: 'breakfit', key: 'checkout', src: `${RAW}/live/bf-checkout.png`, widths: PHONE },
    { slug: 'breakfit', key: 'insights', src: `${RAW}/live/bf-insights.png`, widths: PHONE },
    { slug: 'breakfit', key: 'plans', src: `${RAW}/live/bf-plans.png`, widths: PHONE },

    // IoT Observability — authenticated screens from a local run of the same repo; login from the live site
    { slug: 'iot', key: 'dashboard', src: `${RAW}/iot/dashboard.png`, widths: WIDE },
    { slug: 'iot', key: 'analytics', src: `${RAW}/iot/analytics.png`, widths: WIDE },
    { slug: 'iot', key: 'login', src: `${RAW}/live/iot-login.png`, widths: WIDE },
    // floating panels: real regions of the dashboard screenshot (source is 2880 px wide; crop rects are in source px)
    { slug: 'iot', key: 'panel-status', src: `${RAW}/iot/dashboard.png`, crop: { x: 440, y: 650, w: 1160, h: 666 }, widths: [960, 640] },
    { slug: 'iot', key: 'panel-posture', src: `${RAW}/iot/dashboard.png`, crop: { x: 1628, y: 1344, w: 1160, h: 496 }, widths: [960, 640] },
    { slug: 'iot', key: 'panel-kpi', src: `${RAW}/iot/dashboard.png`, crop: { x: 400, y: 270, w: 1450, h: 210 }, widths: [960, 640] },

    // Validate — the author's presentation cover, and the app screen extracted from it (see warp.js notes in README)
    { slug: 'validate', key: 'cover', src: `${DOWNLOADS}/Validate.png`, widths: WIDE },
    { slug: 'validate', key: 'phone', src: `${RAW}/validate/phone-screen.png`, widths: [640, 320] },

    // Other projects — the author's own Behance case-study slides (3840×2160), kept in assets/source; crop rects in source px
    // SD-WAN Management: https://www.behance.net/gallery/243946651/SD-WAN-management
    { slug: 'sdwan', key: 'cover', src: `${SOURCE}/sdwan/cover.webp`, widths: [1440, 720] },
    { slug: 'sdwan', key: 'panel-vendors', src: `${SOURCE}/sdwan/vendors.webp`, crop: { x: 400, y: 720, w: 3110, h: 1110 }, widths: [960, 640] },
    { slug: 'sdwan', key: 'panel-improvements', src: `${SOURCE}/sdwan/improvements.webp`, crop: { x: 1900, y: 550, w: 1660, h: 1130 }, widths: [720, 480] },
    // IRCTC Website Redesign: https://www.behance.net/gallery/240435669/IRCTC-Website-Redesign-UX-Case-Study
    { slug: 'irctc', key: 'cover', src: `${SOURCE}/irctc/cover.webp`, widths: [1440, 720] },
    { slug: 'irctc', key: 'panel-old', src: `${SOURCE}/irctc/old-ui.webp`, crop: { x: 597, y: 1225, w: 1469, h: 677 }, widths: [720, 480] },
    { slug: 'irctc', key: 'panel-search', src: `${SOURCE}/irctc/search.webp`, crop: { x: 2216, y: 641, w: 1316, h: 751 }, widths: [960, 640] },
  ],
}
