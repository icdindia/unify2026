// Script player (#/gallery/script-player): URL ids that are Object.prototype keys fall back to the commit chat, the
// page's own script checks (playback/engine.ts scriptProblems) say OK for every chat, and live play shows every timed
// beat of the commit run, so no beat is held for 0 ms (the Complete 2 frame, input-large 22, used to be skipped).
// EB_APP_URL points the suite at another build (e.g. a private `vite build` served over http); default dist/eb-app.html.
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

const APP = process.env.EB_APP_URL || fileUrl(APP_FILE)
const PROTO_KEYS = ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf']

export default async function playback({ browser, rec }) {
  const page = await newPage(browser)
  const open = async route => {
    await page.goto('about:blank', { settle: 0 })
    await page.goto(`${APP}#${route}`, { settle: 0 })
    return page.waitFor(`document.querySelector('[data-gallery-page="script-player"] .sp-beats, .error-boundary, [role=alert]')`, 4000)
  }
  try {
    // 1. sheet=<Object.prototype key> renders the commit chat, not the error boundary
    const bad = []
    for (const key of PROTO_KEYS) {
      const mark = page.log.length
      await open(`/gallery/script-player?sheet=${encodeURIComponent(key)}`)
      await sleep(150)
      const s = await page.ev(`(()=>({ boundary: /could not be shown/i.test(document.body.innerText),
        title: [...document.querySelectorAll('[data-gallery-page="script-player"] h2')].map(h=>h.textContent).find(t=>/^Chat /.test(t))||null }))()`)
      const errs = page.problems(mark)
      if (s.boundary || !/How does commit actually look/.test(s.title || '') || errs.length)
        bad.push(`${key}: ${JSON.stringify({ ...s, errors: errs.map(e => e.text.slice(0, 120)) })}`)
    }
    rec.check(`sheet=${PROTO_KEYS.join('|')} falls back to the commit chat`, bad.length === 0, bad)

    // 2. the page's script checks: unique at= ids, no stall, no beat held 0 ms
    await open('/gallery/script-player?at=sent')
    const checks = await page.ev(`[...document.querySelectorAll('[data-script-check]')].map(li=>({ id: li.dataset.scriptCheck, ok: li.dataset.ok==='true', text: li.textContent }))`)
    const failing = checks.filter(c => !c.ok)
    rec.check(`script checks say OK for every chat (${checks.length})`, checks.length >= 5 && failing.length === 0, failing.length ? failing.map(c => c.text) : `only ${checks.length} rows`)

    // 3. live play at 10x shows every timed beat of the commit run, in order, up to the first user gate
    await open('/gallery/script-player?speed=10')
    const beats = await page.ev(`[...document.querySelectorAll('.sp-beats > li')].map(li=>({ id: li.querySelector('.sp-beat__id').textContent.split(' = ')[0],
      user: /^waits for /.test(li.querySelector('.sp-muted').textContent) }))`)
    const gate = beats.findIndex((b, i) => i > 0 && b.user)
    const expected = beats.slice(0, gate < 0 ? beats.length : gate).map(b => b.id)
    const seen = []
    const t0 = Date.now()
    while (Date.now() - t0 < 8000) {
      const id = await page.ev(`(document.querySelector('.sp-beat--on .sp-beat__id')||{textContent:''}).textContent.split(' = ')[0]`)
      if (id && seen[seen.length - 1] !== id) seen.push(id)
      if (id === expected[expected.length - 1]) break
      await sleep(20)
    }
    const missed = expected.filter(id => !seen.includes(id))
    rec.check('live play (10x) shows every timed beat of the commit run', missed.length === 0 && expected.includes('cot-collapsed'),
      { missed, seen, expected })
    rec.note('commit run at 10x', `${seen.length} beats in ${Date.now() - t0} ms`)
  } finally {
    await page.close()
  }
}
