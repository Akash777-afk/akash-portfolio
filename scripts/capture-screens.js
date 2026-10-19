/**
 * Captures the real application screens used as exhibits.
 *
 *   BreakFit — from the LIVE deployment (https://breakfast-app-one.vercel.app) at 390×844 @2x.
 *              The app's own demo state (a few cart items, a slot) is pre-filled in this browser's localStorage so the
 *              checkout screen has content; nothing on the server is touched.
 *   IoT      — the LOGIN page from the live deployment. The authenticated dashboard screens come from a LOCAL run of
 *              the same repository (`npm run dev` in the iot project, PORT=5290) with its demo session flag set in the
 *              local browser. The live site's authentication is never bypassed.
 *
 *   node scripts/capture-screens.js breakfit
 *   node scripts/capture-screens.js iot-login
 *   IOT_LOCAL=http://127.0.0.1:5290 node scripts/capture-screens.js iot-local
 */
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')
const config = require('./assets.config')

const OUT = config.RAW
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const want = process.argv.slice(2)
const run = (name) => !want.length || want.includes(name)

const REGULAR = { portion: 'regular', spice: 'medium', note: '' }
const BF_STATE = {
  cart: [
    { dishId: 'idli', qty: 2, addOnIds: ['sambar'], options: REGULAR },
    { dishId: 'ragi-dosa', qty: 1, addOnIds: [], options: REGULAR },
    { dishId: 'masala-chai', qty: 1, addOnIds: [], options: REGULAR },
  ],
  favorites: ['pongal', 'idli'],
  slot: { dayOffset: 1, time: '8.30 am' },
}

;(async () => {
  const browser = await puppeteer.launch({ executablePath: config.CHROME, headless: true, args: ['--no-sandbox'] })

  if (run('breakfit')) {
    const dir = path.join(OUT, 'live')
    fs.mkdirSync(dir, { recursive: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await page.evaluateOnNewDocument((state) => {
      try {
        sessionStorage.setItem('breakfit:splash-seen', '1')
        if (!sessionStorage.getItem('__seeded')) {
          sessionStorage.setItem('__seeded', '1')
          localStorage.setItem('breakfit:v1', JSON.stringify(state))
        }
      } catch (e) {}
    }, BF_STATE)
    const shots = [
      ['bf-home', '/#/', 1500],
      ['bf-dish', '/#/dish/ragi-dosa', 1800],
      ['bf-checkout', '/#/checkout', 1500],
      ['bf-insights', '/#/health/insights', 2400],
      ['bf-plans', '/#/plans', 1800],
    ]
    for (const [name, route, wait] of shots) {
      await page.goto('https://breakfast-app-one.vercel.app' + route, { waitUntil: 'networkidle2', timeout: 60000 })
      await sleep(wait)
      await page.screenshot({ path: path.join(dir, name + '.png'), clip: { x: 0, y: 0, width: 390, height: 844 } })
      console.log('captured', name)
    }
    await page.close()
  }

  if (run('iot-login')) {
    const dir = path.join(OUT, 'live')
    fs.mkdirSync(dir, { recursive: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
    await page.goto('https://iot-dashboard-snowy.vercel.app/#/login', { waitUntil: 'networkidle2', timeout: 60000 })
    await sleep(2500)
    await page.screenshot({ path: path.join(dir, 'iot-login.png') })
    console.log('captured iot-login (live)')
    await page.close()
  }

  if (run('iot-local')) {
    const base = process.env.IOT_LOCAL || 'http://127.0.0.1:5290'
    const dir = path.join(OUT, 'iot')
    fs.mkdirSync(dir, { recursive: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
    await page.evaluateOnNewDocument(() => sessionStorage.setItem('simAppletAuthenticated', 'true'))
    await page.goto(base + '/', { waitUntil: 'networkidle2', timeout: 90000 })
    await sleep(4000)
    for (const label of ['Dashboard', 'Devices', 'SIM Applet', 'Analytics']) {
      await page.evaluate((l) => [...document.querySelectorAll('a, button')].find((a) => a.textContent.trim() === l)?.click(), label)
      await sleep(6000)
      await page.screenshot({ path: path.join(dir, label.toLowerCase().replace(' ', '-') + '.png') })
      console.log('captured', label, '(local)')
    }
    await page.close()
  }

  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
