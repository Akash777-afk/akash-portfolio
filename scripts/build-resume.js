/**
 * Prints the site's /resume page to public/Akash-Ganapathy-Resume.pdf (A4, with backgrounds).
 * The page restates only the supplied contact details, roles, education and skills.
 *
 *   npm run start            # (or `npm run dev`) in one terminal
 *   npm run resume           # in another   — set PF_BASE if the site is not on http://localhost:3100
 */
const path = require('path')
const puppeteer = require('puppeteer-core')
const config = require('./assets.config')

const BASE = process.env.PF_BASE || 'http://localhost:3100'
const OUT = path.join(__dirname, '..', 'public', 'Akash-Ganapathy-Resume.pdf')

;(async () => {
  const browser = await puppeteer.launch({ executablePath: config.CHROME, headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(BASE + '/resume', { waitUntil: 'networkidle0', timeout: 60000 })
  await page.emulateMediaType('print')
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true })
  console.log('written', path.relative(process.cwd(), OUT))
  await browser.close()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
