// FRAMES: every Figma frame's prototype URL resolves to a built screen, a gallery page or the "Not built yet"
// placeholder for that frame (never the redirect), with no console error; the review bar names the frame and links it
// to Figma (in the strip or its Review ▾ popover); the stepper walks the journeys in Figma order across built and
// not-built screens and Back returns; the build-coverage page's contract checks (fixtures, fix ledger) all say OK.
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

// This suite checks every frame URL, built or not, so it opens the app with ?unbuilt=show: by default (user decision
// 2026-10-09) unbuilt screens are hidden and their URLs redirect home. router.mjs checks that default.
const APP_URL = fileUrl(APP_FILE) + '?unbuilt=show'

const decode = s => { try { return decodeURIComponent(s) } catch { return s } }
const pathOf = route => decode(route).split('?')[0]

// The bar's step name and Figma links as a reviewer can reach them: in the strip, or (when the bar is folded so that the
// switches stay in the strip, as on the project dashboard at 1440) one click away in the Review ▾ popover.
const SCREEN = `(async()=>{
  const nb=document.querySelector('.not-built'); const gal=document.querySelector('[data-gallery-page]');
  const kind = nb ? 'placeholder' : gal ? 'gallery' : document.querySelector('.pl') ? 'projects' : document.querySelector('.pd') ? 'dashboard'
    : document.querySelector('.landing') ? 'landing' : document.querySelector('.chat') ? 'chat'
    : document.querySelector('.art') ? 'artifacts' : document.querySelector('.apage') ? 'artifact' : document.querySelector('.screen-error') ? 'error' : 'other';
  const live = el => !el.closest('.review-bar--measure');
  const read = () => ({
    face: [...document.querySelectorAll('.shell__tools .review-step__face')].filter(live).map(e=>e.textContent.trim())[0] || null,
    figma: [...document.querySelectorAll('.shell__tools a[href*="figma.com"]')].filter(live).map(a=>a.getAttribute('href')),
  });
  let bar = read();
  const toggle = [...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(live);
  if ((!bar.face || !bar.figma.length) && toggle && toggle.getAttribute('aria-expanded') !== 'true') {
    toggle.click(); await new Promise(r => setTimeout(r, 30));
    const pop = read(); bar = { face: bar.face || pop.face, figma: bar.figma.length ? bar.figma : pop.figma, popover: true };
    toggle.click(); await new Promise(r => setTimeout(r, 30));
  }
  const frames = nb ? [...nb.querySelectorAll('.not-built__frame[data-frame]')].map(e=>e.dataset.frame) : [];
  const h1 = (document.querySelector('main h1')||{}).textContent || '';
  return { kind, path: decodeURIComponent(location.hash.slice(1)).split('?')[0], ...bar, frames, h1: h1.trim().slice(0,80) };
})()`

export default async function frames({ browser, rec, out }) {
  const page = await newPage(browser)
  try {
    await page.goto(APP_URL + '#/gallery/frame-map', { settle: 600 })
    const rows = await page.ev(`[...document.querySelectorAll('.fm-row')].map(r=>({
      journey: (r.closest('.gallery-section').querySelector('h2').textContent||'').split(':')[0].trim(),
      stepId: r.querySelector('.fm-step').textContent.trim(), node: r.dataset.frame,
      route: (r.querySelector('.fm-url a')||{getAttribute:()=>null}).getAttribute('href')?.slice(1) ?? null }))`)
    const routed = rows.filter(r => r.route)
    rec.check('the frame map lists the routed frames (at least the 225 of the plan + Projects)', routed.length >= 225, routed.length)
    rec.note('frame map rows', { rows: rows.length, routed: routed.length, unrouted: rows.length - routed.length })

    // 1. every frame URL, in Figma order, by hash change in one page
    const byRoute = new Map()
    for (const r of routed) { if (!byRoute.has(r.route)) byRoute.set(r.route, []); byRoute.get(r.route).push(r) }
    const failures = { redirect: [], wrongFrame: [], noH1: [], errors: [], bar: [] }
    let lastLight = false
    const kinds = {}
    for (const [route, frames] of byRoute) {
      const light = /[?&]nav=light\b/.test(route)
      if (lastLight && !light) await page.hash(route + (route.includes('?') ? '&' : '?') + 'nav=dark', 60) // the nav store keeps light otherwise
      lastLight = light
      const mark = page.log.length
      await page.hash(route, 140)
      const s = await page.ev(SCREEN)
      kinds[s.kind] = (kinds[s.kind] || 0) + 1
      const where = `${frames[0].journey} ${frames[0].stepId} #${route}`
      if (s.path !== pathOf(route)) failures.redirect.push(`${where} -> #${s.path}`)
      if (s.kind === 'placeholder' && !frames.some(f => s.frames.includes(f.node))) failures.wrongFrame.push(`${where}: placeholder shows ${s.frames.join(',')}`)
      if (s.kind === 'other' || s.kind === 'error' || !s.h1) failures.noH1.push(`${where}: ${s.kind} "${s.h1}"`)
      const named = frames.some(f => s.face && s.face.replace(/^≈ /, '') === `${f.journey} ${f.stepId}`)
      const linked = frames.some(f => s.figma.some(h => h.includes('node-id=' + f.node.replace(/:/g, '-'))))
      if (!named || !linked) failures.bar.push(`${where}: face "${s.face}", ${s.figma.length} Figma links`)
      const errs = page.problems(mark)
      if (errs.length) failures.errors.push(`${where}: ${errs.map(e => e.text).join(' | ').slice(0, 300)}`)
    }
    rec.note('screens by kind', kinds)
    rec.check(`all ${byRoute.size} frame URLs stay on their path (no redirect)`, failures.redirect.length === 0, failures.redirect.slice(0, 12))
    rec.check('every not-built frame URL shows the placeholder for that frame', failures.wrongFrame.length === 0, failures.wrongFrame.slice(0, 12))
    rec.check('every frame URL renders a screen with an <h1> (no error boundary)', failures.noH1.length === 0, failures.noH1.slice(0, 12))
    rec.check('the review bar names the step and links the frame in Figma on every frame URL', failures.bar.length === 0, failures.bar.slice(0, 12))
    rec.check('no console error or exception on any frame URL', failures.errors.length === 0, failures.errors.slice(0, 12))

    // 2. the stepper: next / prev across built and not-built screens, Back, and the picker
    const order = routed
    await page.goto(APP_URL + '#/projects', { settle: 500 })
    // the step name in the strip, or in the Review ▾ popover where the bar is folded (the built landing and chat screens
    // float the review tools, so the name is one click away there)
    const face = async () => (await page.ev(SCREEN)).face
    const arrow = dir => `.shell__tools .review-step__arrow[aria-label^="${dir === 1 ? 'Next' : 'Previous'} step"]`
    const walked = []
    for (let i = 0; i < 8; i++) {
      await page.clickSel(arrow(1), 0, 250)
      walked.push({ face: await face(), path: await page.ev('decodeURIComponent(location.hash.slice(1))') })
    }
    const expected = order.slice(1, 9).map(r => `${r.journey} ${r.stepId}`)
    rec.check('Next walks the first 8 steps in Figma order (Projects screens into the nav-light frames on the built landing)',
      JSON.stringify(walked.map(w => w.face?.replace(/^≈ /, ''))) === JSON.stringify(expected), { walked, expected })
    rec.check('each Next lands on that step\'s URL', walked.every((w, i) => pathOf(w.path) === pathOf(order[i + 1].route)), walked.map(w => w.path))
    // Stepping to an alias (same URL) adds no history entry, so Back returns to the last step with another URL.
    const lastPath = walked[walked.length - 1].path
    const before = [...walked].reverse().find(w => w.path !== lastPath)
    await page.ev('history.back()'); await sleep(300)
    rec.check('browser Back returns to the previous step with another URL', (await face()) === before.face, { now: await face(), expected: before.face })
    for (let i = 0; i < 6; i++) await page.clickSel(arrow(-1), 0, 200)
    rec.check('Previous walks back to the first Projects screen', (await face())?.replace(/^≈ /, '') === `${order[0].journey} ${order[0].stepId}`, await face())
    const target = routed.find(r => r.journey === 'chat-artifact' && r.stepId === '10')
    if (target) {
      const picked = await page.ev(`(()=>{const s=[...document.querySelectorAll('.shell__tools .review-step__select')].find(e=>!e.closest('.review-bar--measure'));
        const o=[...s.options].find(o=>o.textContent.startsWith('10 ·') && o.parentElement.label.includes('chat-artifact'));
        if(!o) return null; s.value=o.value; s.dispatchEvent(new Event('change',{bubbles:true})); return o.value})()`)
      await sleep(300)
      const s = await page.ev(SCREEN)
      // chat-artifact 10 is a built screen (screens/chat): the picker opens the chat at that step, and the bar names it
      rec.check('picking chat-artifact 10 in the stepper opens the built chat at that step', !!picked && s.kind === 'chat' && s.path === pathOf(target.route)
        && s.face === 'chat-artifact 10' && s.figma.some(h => h.includes('node-id=' + target.node.replace(/:/g, '-'))), { picked, s })
    }

    // 3. the nav reaches the planned screens (placeholders until built), and the highlight follows the page
    await page.goto(APP_URL + '#/projects?rail=e', { settle: 400 })
    const navWalk = []
    for (const [label, path] of [['New Session', '/new'], ['Routines', '/routines'], ['Artifacts', '/artifacts'], ['Projects', '/projects']]) {
      await page.clickSel(`.shell__nav a[href="#${path}"]`, 0, 250)
      const s = await page.ev(`({ path: decodeURIComponent(location.hash.slice(1)).split('?')[0], placeholder: !!document.querySelector('.not-built'),
        current: [...document.querySelectorAll('.shell__nav [aria-current=page]')].map(e=>(e.getAttribute('aria-label')||e.textContent).trim()) })`)
      navWalk.push({ label, ...s })
    }
    rec.check('the nav opens New Session, Artifacts and Projects (built) and Routines (placeholder), each marked current',
      navWalk.every(w => w.path === { 'New Session': '/new', Routines: '/routines', Artifacts: '/artifacts', Projects: '/projects' }[w.label]
        && w.placeholder === (w.label === 'Routines') && w.current.some(c => c.startsWith(w.label))), navWalk)

    // 4. the contracts on the build-coverage page
    await page.hash('/gallery/build-coverage', 500)
    const cov = await page.ev(`JSON.parse(document.querySelector('.cov').dataset.coverage)`)
    for (const c of cov.checks) rec.check(`coverage: ${c.id}`, c.ok, c.detail)
    rec.check('coverage counts the same frames as the frame map', cov.summary.frames === routed.length, { coverage: cov.summary.frames, map: routed.length })
    const s = cov.summary
    rec.check('coverage kinds add up to the frame total (built + in part + gallery + placeholder + redirect)',
      typeof s.partial === 'number' && s.screen + s.partial + s.gallery + s.placeholder + s.redirect === s.frames, s)
    rec.note('coverage summary', cov.summary)
    await page.shot(`${out}/frames-coverage.png`)
  } finally {
    await page.close()
  }
}
