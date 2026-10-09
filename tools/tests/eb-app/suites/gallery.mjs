// Gallery smoke test: /gallery lists every page file under a group heading; every page renders its title, its Figma
// links and a body at 1440 and at 390, with no console error and no sideways scroll. Keyboard focus on Button and the
// avatar add button, fixes off and on, and the option menu's shadow colour (focusRingChecks).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, OVERFLOW_PROBE, fileUrl, overflowProblems } from '../lib/harness.mjs'

/** Pages with no Figma node of their own, and why. Every other page must link at least one node. */
const NO_FIGMA = {
  'review-bar': 'prototype chrome (the review bar is not in the design)',
  fixes: 'the ledger of departures; each fix links its own frames',
  toast: 'toasts are not drawn in Figma (fix toast-feedback)',
}

/** The keyboard-focused element's outline and its contrast on white (alpha composited over white). */
const FOCUS_PROBE = `(()=>{
  const lum = c => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return 1; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number)
    const a = p.length > 3 ? p[3] : 1; const f = v => { v = (v * a + 255 * (1 - a)) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]) }
  const b = document.activeElement, cs = getComputedStyle(b)
  return { cls: b.className, fv: b.matches(':focus-visible'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' +' + cs.outlineOffset + ' ' + cs.outlineColor,
    ratio: cs.outlineStyle === 'none' ? 0 : +(1.05 / (lum(cs.outlineColor) + 0.05)).toFixed(2), shadow: cs.boxShadow }
})()`

/**
 * FIXES button-focus-ring-3-to-1: Tab onto each Button kind and the avatar add button. As designed they draw the sets'
 * pale halos (1.19 to 1.44:1) and a transparent outline; with fixes on, the halo plus a 2px outline of at least 3:1 on
 * white. Also the option menu's shadow colour, utility-gray-300 as the file resolves it (#e6e4e0, not tokens.css #dbd6d1).
 * `base` is the app URL without a hash, so the suite can point it at another build.
 */
export async function focusRingChecks({ browser, rec, base }) {
  const HALO = { primary: 'rgb(237, 235, 232) 0px 0px 0px 4px', secondary: 'rgb(230, 228, 224) 0px 0px 0px 4px',
    tertiary: 'rgb(230, 228, 224) 0px 0px 0px 4px', destructive: 'rgb(241, 211, 209) 0px 0px 0px 4px', add: 'rgb(219, 214, 209) 0px 0px 0px 2px' }
  const TARGETS = [...['primary', 'secondary', 'tertiary', 'destructive'].flatMap(k => ['sm', 'md'].map(s => ({ k, at: `.btn.btn--${k}.btn--${s}:not(:disabled):not(.is-hover):not(.is-focus)`, route: 'buttons' }))),
    { k: 'add', at: '.avatar-group--sm .avatar-group__add:not(:disabled):not(.is-hover):not(.is-focus)', route: 'avatar-group' }]
  for (const fixes of ['off', 'on']) {
    const page = await newPage(browser)
    const bad = []
    try {
      await page.goto(base + (fixes === 'on' ? '?fixes=on' : '') + '#/gallery/option-menu', { settle: 400 })
      await page.waitFor(`document.querySelector('.om')`, 3000)
      const om = await page.ev(`[...new Set([...document.querySelectorAll('.om')].map(o=>getComputedStyle(o).boxShadow))]`)
      if (fixes === 'off') rec.check('option menu: the shadow is utility-gray-300 as the file resolves it (#e6e4e0)',
        om.length > 0 && om.every(s => (s.match(/rgb\(230, 228, 224\) 0px (4px 12px -2px|12px 12px -80px)/g) || []).length === 2), om)
      for (const t of TARGETS) {
        await page.hash('/gallery/' + t.route, 150)
        await page.waitFor(`document.querySelector(${JSON.stringify(t.at)})`, 3000)
        // a throwaway stop just before the target, so a real Tab lands on it (keyboard focus, :focus-visible)
        await page.ev(`(()=>{const b=document.querySelector(${JSON.stringify(t.at)}); const s=document.createElement('button'); s.id='__stop'; s.textContent='stop'; b.before(s); s.focus()})()`)
        await page.key('Tab')
        const f = await page.ev(FOCUS_PROBE)
        await page.ev(`document.getElementById('__stop').remove()`)
        const halo = f.shadow.includes(HALO[t.k])
        const ok = f.fv && halo && (fixes === 'off' ? / rgba\(0, 0, 0, 0\)$/.test(f.outline) : f.outline.startsWith('solid 2px +2px') && f.ratio >= 3)
        if (!ok) bad.push({ target: t.at, ...f, halo })
      }
    } finally {
      await page.close()
    }
    rec.check(fixes === 'off'
      ? 'focus, as designed: Button kinds and the avatar add button draw the sets\' halos, outline transparent'
      : 'focus, fixes on (button-focus-ring-3-to-1): the halo plus a 2px outline at least 3:1 on white', bad.length === 0, bad)
  }
}

export default async function gallery({ browser, rec, root, out }) {
  const dir = join(root, 'app', 'src', 'gallery', 'pages')
  const files = readdirSync(dir).filter(f => f.endsWith('.tsx'))
  const metas = Object.fromEntries(files.map(f => {
    const src = readFileSync(join(dir, f), 'utf8')
    const title = /title: '([^']+)'/.exec(src)?.[1]
    const nodes = /figmaNodeIds: \[([^\]]*)\]/.exec(src)?.[1].split(',').map(s => s.trim().replace(/'/g, '')).filter(Boolean) ?? []
    return [f.replace(/\.tsx$/, ''), { title, nodes }]
  }))

  const page = await newPage(browser)
  try {
    await page.goto(fileUrl(APP_FILE) + '#/gallery', { settle: 500 })
    const index = await page.ev(`[...document.querySelectorAll('main a[href^="#/gallery/"]')].map(a=>({slug:a.getAttribute('href').slice('#/gallery/'.length).split('?')[0],
      group:(a.closest('section')?.querySelector('h2')?.textContent||'').trim()}))`)
    const listed = new Map(index.map(e => [e.slug, e.group]))
    const missing = Object.keys(metas).filter(s => !listed.has(s))
    const ungrouped = Object.keys(metas).filter(s => listed.has(s) && (!listed.get(s) || /ungrouped/i.test(listed.get(s))))
    rec.check(`the index lists all ${files.length} page files`, missing.length === 0, missing)
    rec.check('every page is listed under a group heading', ungrouped.length === 0, ungrouped)
    rec.note('groups', [...new Set(index.map(e => e.group))])

    // the review-bar page's rooms each show the fold their specimen names (rb-room--<fold>)
    await page.hash('/gallery/review-bar', 400)
    const rooms = await page.ev(`[...document.querySelectorAll('.rb-room')].map(room => {
      const live = [...room.querySelector('.review-wrap').children].find(c => !c.classList.contains('review-bar--measure'))
      const shows = !live.classList.contains('review-fold') ? 'full' : live.querySelector('.review-bar--main') ? 'main'
        : live.querySelector('.review-bar--core') ? 'core' : live.querySelector('.review-step__arrow') ? 'steps' : 'button'
      return { room: (room.className.match(/rb-room--(\\w+)/) || [])[1], shows } })`)
    rec.check('review-bar page: each room shows the fold it names (full, main, core, steps, button)',
      rooms.map(r => r.room).join() === 'full,main,core,steps,button' && rooms.every(r => r.room === r.shows), rooms)

    await focusRingChecks({ browser, rec, base: fileUrl(APP_FILE) })

    for (const [width, height] of [[1440, 900], [390, 844]]) {
      await page.size(width, height)
      const bad = { render: [], figma: [], errors: [], overflow: [] }
      for (const [slug, meta] of Object.entries(metas)) {
        const mark = page.log.length
        await page.hash('/gallery/' + slug, 60)
        await page.waitFor(`document.querySelector('[data-gallery-page="${slug}"] .gallery-page__body')`, 3000)
        await sleep(150)
        const s = await page.ev(`(()=>{const p=document.querySelector('[data-gallery-page="${slug}"]'); if(!p) return null;
          const body=p.querySelector('.gallery-page__body');
          return { title:(p.querySelector('h1')||{}).textContent, body: body ? body.querySelectorAll('*').length : 0,
            figma: [...p.querySelectorAll('.gallery-page__head a[href*="figma.com"]')].map(a=>a.getAttribute('href')) }})()`)
        if (!s || s.title !== meta.title || s.body < 3) bad.render.push(`${slug}: ${JSON.stringify(s && { title: s.title, body: s.body })}`)
        if (s && !NO_FIGMA[slug] && (meta.nodes.length === 0 || !meta.nodes.every(n => s.figma.some(h => h.includes('node-id=' + n.replace(/:/g, '-'))))))
          bad.figma.push(`${slug}: ${meta.nodes.length} node ids, ${s.figma.length} links`)
        const errs = page.problems(mark)
        if (errs.length) bad.errors.push(`${slug}: ${errs.map(e => e.text).join(' | ').slice(0, 300)}`)
        if (width < 1440) {
          const o = overflowProblems(await page.ev(OVERFLOW_PROBE))
          if (o.length) { bad.overflow.push(`${slug}: ${o.join('; ')}`); await page.shot(`${out}/gallery-${slug}-${width}.png`) }
        }
      }
      rec.check(`${width}: every page renders its title and specimens`, bad.render.length === 0, bad.render)
      if (width === 1440) rec.check('every page links its Figma nodes (except prototype chrome: ' + Object.keys(NO_FIGMA).join(', ') + ')', bad.figma.length === 0, bad.figma)
      rec.check(`${width}: no console error or exception on any page`, bad.errors.length === 0, bad.errors)
      if (width < 1440) rec.check(`${width}: no page scrolls sideways`, bad.overflow.length === 0, bad.overflow)
    }
  } finally {
    await page.close()
  }
}
