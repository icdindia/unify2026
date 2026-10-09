// Responsive sweep: the built screens, a not-built placeholder and the gallery from 1440 down to 390 (CDP device
// metrics, so widths under headless Chrome's ~500px window minimum are real), in dark and light nav. Nothing scrolls
// sideways, the nav turns into the rail under 1200, the page title and the review bar stay on screen, and open menus
// stay inside the viewport.
import { newPage } from '../lib/cdp.mjs'
import { APP_FILE, OVERFLOW_PROBE, fileUrl, overflowProblems } from '../lib/harness.mjs'

const WIDTHS = [1440, 1280, 1200, 1199, 1024, 900, 787, 768, 600, 500, 390]
const ROUTES = [
  '/projects',
  '/projects/client-onboarding',
  '/projects/client-onboarding?opt=2',
  '/projects/client-onboarding?state=menus',
  '/projects?state=landing',
  '/new?rail=c',
  '/chat/commit?at=answer&rail=c',
  '/gallery',
  '/gallery/build-coverage',
]

const LAYOUT = `(()=>{
  const vw=innerWidth, vh=innerHeight, r=el=>el&&el.getBoundingClientRect();
  const h1=r(document.querySelector('main h1')), tools=r(document.querySelector('.shell__tools'));
  const menus=[...document.querySelectorAll('.dd[role=menu]')].map(m=>{const b=r(m);return [Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]});
  return { rail: document.querySelector('.shell')?.dataset.rail, h1: h1 ? [Math.round(h1.left), Math.round(h1.right)] : null,
    tools: tools ? [Math.round(tools.left), Math.round(tools.right)] : null, menus, vw, vh };
})()`

export default async function responsive({ browser, rec, out }) {
  for (const mode of ['dark', 'light']) {
    const page = await newPage(browser)
    try {
      await page.goto(fileUrl(APP_FILE) + (mode === 'light' ? '?mode=light' : '') + '#/projects', { settle: 400 })
      const bad = { overflow: [], rail: [], h1: [], tools: [], menus: [] }
      let n = 0
      for (const w of WIDTHS) {
        await page.size(w, w <= 600 ? 844 : 900)
        for (const route of (mode === 'light' ? ROUTES.slice(0, 3) : ROUTES)) {
          // a frame URL can pin rail=c; leave the rail expanded before each route so the width alone decides
          await page.hash('/projects?rail=e', 40)
          await page.hash(route, 160)
          n++
          const where = `${w} ${mode} #${route}`
          const o = overflowProblems(await page.ev(OVERFLOW_PROBE))
          if (o.length) { bad.overflow.push(`${where}: ${o.join('; ')}`); await page.shot(`${out}/resp-${mode}-${w}-${route.replace(/[^a-z0-9]+/gi, '_')}.png`) }
          const l = await page.ev(LAYOUT)
          if (w < 1200 && l.rail !== 'collapsed') bad.rail.push(`${where}: rail ${l.rail}`)
          if (w >= 1200 && !route.includes('rail=c') && l.rail !== 'expanded') bad.rail.push(`${where}: rail ${l.rail}`)
          if (!l.h1 || l.h1[0] < 0 || l.h1[0] > w - 40) bad.h1.push(`${where}: h1 at ${JSON.stringify(l.h1)}`)
          if (!l.tools || l.tools[0] < 0 || l.tools[1] > w + 1) bad.tools.push(`${where}: review bar at ${JSON.stringify(l.tools)}`)
          for (const m of l.menus) if (m[0] < 0 || m[1] < 0 || m[2] > w + 1 || m[3] > l.vh + 1) bad.menus.push(`${where}: menu ${JSON.stringify(m)}`)
          if (route.includes('state=menus') && l.menus.length < 3) bad.menus.push(`${where}: ${l.menus.length} of the 3 review menus open`)
        }
        if (mode === 'dark') { await page.hash('/projects', 150); await page.shot(`${out}/resp-projects-${w}.png`) }
      }
      rec.check(`${mode} nav: ${n} route × width combinations from 1440 to 390 never scroll sideways`, bad.overflow.length === 0, bad.overflow.slice(0, 10))
      rec.check(`${mode} nav: the nav is the rail under 1200 and expanded from 1200`, bad.rail.length === 0, bad.rail.slice(0, 10))
      rec.check(`${mode} nav: the page title starts on screen at every width`, bad.h1.length === 0, bad.h1.slice(0, 10))
      rec.check(`${mode} nav: the review bar stays inside the viewport`, bad.tools.length === 0, bad.tools.slice(0, 10))
      rec.check(`${mode} nav: open menus stay inside the viewport`, bad.menus.length === 0, bad.menus.slice(0, 10))
      const errs = page.problems()
      rec.check(`${mode} nav: no console error or exception during the sweep`, errs.length === 0, errs.slice(0, 6))
    } finally {
      await page.close()
    }
  }
}
