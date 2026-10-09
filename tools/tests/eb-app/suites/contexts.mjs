// Viewing contexts: the single-file build must work opened from disk (file://), served (http://), inside a sandboxed
// srcdoc iframe (how inline preview panes render it: pushState throws, so the router keeps routes in memory), inside a
// sandboxed iframe src, and in a 390px-wide iframe (a phone-width embed). In each: the Projects landing renders, a card
// opens the dashboard, the header menu opens and Escape closes it with focus back on its button, the breadcrumb returns,
// the review bar steps from the Projects frames onto the next journey's screen (nav-light 01, the built landing) and
// back, the rail collapses and expands — with no console error.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, OVERFLOW_PROBE, fileUrl, overflowProblems } from '../lib/harness.mjs'

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const WRAP = body => `<!doctype html><meta charset="utf-8"><title>eb-app context</title>
<style>html,body{margin:0;height:100%;background:#fff}iframe{border:0;display:block}</style>${body}`

export default async function contexts({ browser, server, rec, out }) {
  const app = readFileSync(APP_FILE, 'utf8')
  writeFileSync(join(out, 'ctx-srcdoc.html'), WRAP(`<iframe sandbox="allow-scripts allow-popups" style="width:100%;height:100%" srcdoc="${esc(app)}"></iframe>`))
  writeFileSync(join(out, 'ctx-sandbox.html'), WRAP(`<iframe sandbox="allow-scripts allow-popups" style="width:100%;height:100%" src="/dist/eb-app.html#/projects"></iframe>`))
  writeFileSync(join(out, 'ctx-390.html'), WRAP(`<iframe style="width:390px;height:844px" src="/dist/eb-app.html#/projects"></iframe>`))
  const outUrl = name => `${server.origin}/tools/tests/eb-app/out/${name}`

  const CONTEXTS = [
    { id: 'file', url: fileUrl(APP_FILE) + '#/projects', frame: false },
    { id: 'http', url: `${server.origin}/dist/eb-app.html#/projects`, frame: false },
    { id: 'srcdoc', url: outUrl('ctx-srcdoc.html'), frame: true, memory: true },
    { id: 'sandbox', url: outUrl('ctx-sandbox.html'), frame: true }, // opaque origin, but fragment pushState still works
    { id: 'iframe-390', url: outUrl('ctx-390.html'), frame: true, narrow: true },
  ]

  for (const ctx of CONTEXTS) {
    const page = await newPage(browser)
    try {
      await page.goto(ctx.url, { settle: 600 })
      if (ctx.frame) await page.useFrame()
      await page.waitFor(`document.querySelector('.shell main h1')`, 5000)
      const h1 = () => page.ev(`(document.querySelector('main h1')||{}).textContent||''`)
      const steps = []
      const step = async (name, fn) => {
        try { const r = await fn(); steps.push([name, r === false ? 'failed' : 'ok']); return r !== false } catch (e) { steps.push([name, String(e.message).slice(0, 200)]); return false }
      }
      await step('landing renders', async () => (await h1()) === 'Projects' && await page.ev(`!!document.querySelector('.pl .pcard')`))
      await step('card opens the dashboard', async () => {
        await page.clickSel('.pcard__open', 0, 400)
        // as designed the frame is drawn once, for "Client Onboarding"; fix crumb-shows-project-name reads the project's name
        return await page.waitFor(`document.querySelector('.pd') && ['Banking Issues','Client Onboarding'].includes((document.querySelector('main h1')||{}).textContent)`, 3000)
      })
      await step(ctx.memory ? 'routes stay in memory (no history API here)' : 'the route is in the URL hash', async () => {
        const inHash = await page.ev(`location.hash.includes('banking-issues')`)
        return inHash === !ctx.memory
      })
      if (!ctx.narrow) {
        await step('header ⋮ opens its menu; Escape closes it and focus returns', async () => {
          await page.clickSel('.page__acts [aria-label="More"]', 0, 300)
          if (!(await page.waitFor(`document.querySelector('.dd[role=menu]')`, 2000))) return false
          await page.key('Escape'); await sleep(150)
          return await page.ev(`!document.querySelector('.dd[role=menu]') && document.activeElement && document.activeElement.getAttribute('aria-label')==='More'`)
        })
      }
      await step('breadcrumb returns to Projects', async () => {
        await page.clickSel('.crumbs .tbtn', 0, 400)
        return await page.waitFor(`document.querySelector('.pl') && (document.querySelector('main h1')||{}).textContent==='Projects'`, 3000)
      })
      if (!ctx.narrow) {
        await step('review bar: Next steps onto the next journey (nav-light 01, the built landing), Previous comes back', async () => {
          // Projects 01 -> 02 -> 03 -> nav-light 01 (/new?rail=c&nav=light: the built New Session landing in the light nav)
          for (let i = 0; i < 3; i++) await page.clickSel('.shell__tools .review-step__arrow[aria-label^="Next step"]', 0, 300)
          if (!(await page.waitFor(`document.querySelector('.landing') && document.querySelector('.shell[data-rail=collapsed][data-nav-mode=light]')`, 3000))) return false
          await page.clickSel('.shell__tools .review-step__arrow[aria-label^="Previous step"]', 0, 400)
          return await page.waitFor(`document.querySelector('.pd')`, 3000)
        })
        await step('rail expands and collapses', async () => {
          // the rail keeps whatever the last frame URL pinned (nav-light 01 is rail=c): toggle from either state
          const collapsed = await page.ev(`!!document.querySelector('.shell[data-rail=collapsed]')`)
          const [first, second] = collapsed ? ['Expand', 'Collapse'] : ['Collapse', 'Expand']
          await page.clickSel(`[aria-label="${first} navigation"]`, 0, 300)
          if (!(await page.ev(`!!document.querySelector('.shell[data-rail=${collapsed ? 'expanded' : 'collapsed'}]')`))) return false
          await page.clickSel(`[aria-label="${second} navigation"]`, 0, 300)
          return await page.ev(`!!document.querySelector('.shell[data-rail=${collapsed ? 'collapsed' : 'expanded'}]') && document.activeElement?.getAttribute('aria-label')==='${first} navigation'`)
        })
      } else {
        await step('phone width: the nav is the rail and nothing scrolls sideways', async () => {
          const o = overflowProblems(await page.ev(OVERFLOW_PROBE))
          return (await page.ev(`!!document.querySelector('.shell[data-rail=collapsed]')`)) && o.length === 0
        })
        await step('phone width: the rail opens the nav as an overlay; Escape closes it', async () => {
          await page.clickSel('[aria-label="Expand navigation"]', 0, 300)
          if (!(await page.ev(`!!document.querySelector('.shell__overlay .nav')`))) return false
          await page.key('Escape'); await sleep(200)
          return await page.ev(`!document.querySelector('.shell__overlay') && document.activeElement?.getAttribute('aria-label')==='Expand navigation'`)
        })
      }
      const failed = steps.filter(([, r]) => r !== 'ok')
      rec.check(`${ctx.id}: ${steps.map(s => s[0]).join(', ')}`, failed.length === 0, failed)
      const errs = page.problems()
      rec.check(`${ctx.id}: no console error or exception`, errs.length === 0, errs.slice(0, 6))
      if (failed.length) await page.shot(join(out, `ctx-${ctx.id}.png`))
    } finally {
      await page.close()
    }
  }
}
