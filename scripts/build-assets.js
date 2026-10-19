/**
 * Resizes, crops and re-encodes the real screenshots listed in assets.config.js to WebP using headless Chrome
 * (canvas, stepwise downscaling for crisp text), and writes src/content/assets.generated.json.
 *
 *   node scripts/build-assets.js           # everything
 *   node scripts/build-assets.js breakfit  # one project
 */
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')
const config = require('./assets.config')

const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public', 'work')
const MANIFEST = path.join(ROOT, 'src', 'content', 'assets.generated.json')
const only = process.argv.slice(2)

const toUrl = (p) => 'file:///' + p.split('\\').join('/')

;(async () => {
  const browser = await puppeteer.launch({ executablePath: config.CHROME, headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] })
  const page = await browser.newPage()
  page.on('pageerror', (e) => console.error('page error', e.message))
  const htmlPath = path.join(ROOT, 'scripts', '.stage.html')
  fs.writeFileSync(htmlPath, '<!doctype html><html><body style="margin:0"></body></html>')
  await page.goto(toUrl(htmlPath))

  await page.evaluate(() => {
    window.loadImage = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('failed to load ' + url))
        img.src = url
      })
    /** Draws `crop` (or the whole image) to a canvas no wider than `width`, halving until a final high-quality step. */
    window.scaleTo = (img, width, crop) => {
      const sx = crop ? crop.x : 0
      const sy = crop ? crop.y : 0
      let w = crop ? crop.w : img.naturalWidth
      let h = crop ? crop.h : img.naturalHeight
      let source = img
      let first = true
      const target = Math.min(width, w)
      const targetH = Math.round(h * (target / w))
      while (w / 2 > target) {
        const c = document.createElement('canvas')
        c.width = Math.round(w / 2)
        c.height = Math.round(h / 2)
        const x = c.getContext('2d')
        x.imageSmoothingQuality = 'high'
        if (first) x.drawImage(source, sx, sy, w, h, 0, 0, c.width, c.height)
        else x.drawImage(source, 0, 0, c.width, c.height)
        source = c
        w = c.width
        h = c.height
        first = false
      }
      const out = document.createElement('canvas')
      out.width = target
      out.height = targetH
      const ctx = out.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      if (first) ctx.drawImage(source, sx, sy, w, h, 0, 0, target, targetH)
      else ctx.drawImage(source, 0, 0, w, h, 0, 0, target, targetH)
      return out
    }
  })

  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {}

  for (const item of config.images) {
    if (only.length && !only.includes(item.slug)) continue
    if (!fs.existsSync(item.src)) {
      console.warn('MISSING source, skipped:', item.src)
      continue
    }
    const dir = path.join(PUBLIC, item.slug)
    fs.mkdirSync(dir, { recursive: true })
    const sizes = []
    let srcInfo = null
    for (const width of item.widths) {
      const result = await page.evaluate(
        async (url, w, crop) => {
          const img = await window.loadImage(url)
          const c = window.scaleTo(img, w, crop)
          return { data: c.toDataURL('image/webp', 0.84).split(',')[1], w: c.width, h: c.height, srcW: img.naturalWidth, srcH: img.naturalHeight }
        },
        toUrl(item.src),
        width,
        item.crop || null,
      )
      if (sizes.some((s) => s.w === result.w)) continue
      fs.writeFileSync(path.join(dir, `${item.key}-${result.w}.webp`), Buffer.from(result.data, 'base64'))
      sizes.push({ w: result.w, h: result.h, kb: Math.round((result.data.length * 3) / 4 / 1024) })
      srcInfo = result
    }
    manifest[item.slug] = manifest[item.slug] || {}
    manifest[item.slug][item.key] = { w: sizes[0].w, h: sizes[0].h, widths: sizes.map((s) => s.w) }
    console.log(`${item.slug}/${item.key}`.padEnd(32), sizes.map((s) => `${s.w}x${s.h} ${s.kb}KB`).join('  '), `(src ${srcInfo.srcW}x${srcInfo.srcH}${item.crop ? ', cropped' : ''})`)
  }

  // drop manifest entries for projects that are no longer on the site
  const keep = new Set(config.images.map((i) => i.slug))
  for (const slug of Object.keys(manifest)) if (!keep.has(slug)) delete manifest[slug]

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
  fs.unlinkSync(htmlPath)
  await browser.close()
  console.log('manifest written:', path.relative(ROOT, MANIFEST))
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
