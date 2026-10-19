/**
 * Lists every external link the site uses and flags the ones that still need attention.
 *
 *   node scripts/check-links.js            # report only
 *   node scripts/check-links.js --strict   # exit 1 if any link is provisional (use as a pre-launch gate)
 *
 * Reachability: the two Vercel apps are fetched. Behance blocks automated requests (HTTP 403), so those links can
 * only be confirmed by opening them in a browser.
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'content', 'projects.ts'), 'utf8')
const links = []
const re = /(live|caseStudy):\s*\{([\s\S]*?)\n\s{4}\}/g
let m
while ((m = re.exec(src))) {
  const href = /href:\s*'([^']+)'/.exec(m[2])
  const prov = /provisional:\s*'([^']+)'/.exec(m[2])
  if (href) links.push({ kind: m[1], href: href[1], provisional: prov ? prov[1] : null })
}

const head = (url) =>
  new Promise((resolve) => {
    const req = https.request(url.replace(/#.*$/, ''), { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      res.resume()
      resolve(res.statusCode)
    })
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', () => resolve(0))
    req.end()
  })

;(async () => {
  let provisional = 0
  for (const l of links) {
    const status = await head(l.href)
    const blocked = /behance\.net/.test(l.href) && status === 403
    const verdict = l.provisional ? 'PROVISIONAL' : blocked ? 'unverifiable (bot-blocked) — open it in a browser' : status >= 200 && status < 400 ? 'ok' : `check (HTTP ${status})`
    if (l.provisional) provisional++
    console.log(`${l.kind.padEnd(10)} ${String(status || '---').padEnd(4)} ${verdict}\n           ${l.href}${l.provisional ? `\n           ↳ ${l.provisional}` : ''}`)
  }
  if (provisional) console.log(`\n${provisional} provisional link(s) must be replaced before launch.`)
  if (provisional && process.argv.includes('--strict')) process.exit(1)
})()
