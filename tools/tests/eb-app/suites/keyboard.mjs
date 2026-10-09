// Keyboard and focus, with real key events: Tab order and focus rings on the Projects screens, the three menus
// (open with Enter, move with arrows, Escape closes and returns focus), nav collapse / expand focus handoff, the narrow
// nav overlay (inert page behind, Escape), focus after route changes, and a modal's focus trap.
import { SHIFT, newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

const short = a => a.tag === 'BODY' ? 'BODY' : `${a.tag}${a.role ? `[${a.role}]` : ''} "${a.name}"${a.inNav ? ' (nav)' : a.inMenu ? ' (menu)' : a.inBar ? ' (bar)' : a.inTools ? ' (review)' : a.inMain ? ' (main)' : ''}`

export default async function keyboard({ browser, rec }) {
  const page = await newPage(browser)
  const fresh = async (route, size = [1440, 900]) => {
    await page.size(...size)
    await page.goto(fileUrl(APP_FILE) + '?r=' + Math.random() + '#' + route, { settle: 300 })
  }
  const tabs = async n => { const seq = []; for (let i = 0; i < n; i++) { await page.key('Tab'); seq.push(await page.active()) } return seq }
  const tabTo = async (pred, n = 120) => { for (let i = 0; i < n; i++) { await page.key('Tab'); const a = await page.active(); if (pred(a)) return a } return null }
  const menus = () => page.ev(`[...document.querySelectorAll('.dd[role=menu]')].map(d=>d.getAttribute('aria-label'))`)
  // every Tab stop is named, visible and draws a focus ring (the review bar is prototype chrome: named and visible only)
  const badStops = seq => seq.filter(a => a.tag !== 'BODY' && (!a.name || !a.vis || (!a.ring && !a.inTools))).map(short)
  const run = async (name, fn) => { try { await fn() } catch (e) { rec.check(name + ' ran', false, String(e.stack).split('\n').slice(0, 3).join(' | ')) } }

  try {
    await run('landing', async () => {
      await fresh('/projects')
      const seq = await tabs(52)
      rec.check('landing: every Tab stop has a name, is visible and shows a focus ring', badStops(seq).length === 0, badStops(seq))
      rec.check('landing: the nav comes before the page in Tab order', seq.findIndex(a => a.inNav) > -1 && seq.findIndex(a => a.inNav) < seq.findIndex(a => a.inMain))
      rec.check('landing: the project tabs (one Tab stop) and the card ⋯ buttons are reachable',
        seq.filter(a => a.role === 'tab').length === 1 && seq.some(a => /^Actions for /.test(a.name)), seq.filter(a => a.inMain).map(short).slice(0, 12))
      await page.ev(`document.querySelector('.btabs [role=tab][aria-selected=true]').focus()`)
      await page.key('ArrowRight')
      const next = await page.active()
      rec.check('landing: ArrowRight moves along the project tabs', next.role === 'tab' && next.name === 'Yours', short(next))
      rec.check('landing: the nav chat rows\' ⋯ buttons are reachable', seq.some(a => /^More actions for/.test(a.name)))
    })

    await run('dashboard', async () => {
      await fresh('/projects/banking-issues')
      const seq = await tabs(70)
      rec.check('dashboard: every Tab stop has a name, is visible and shows a focus ring', badStops(seq).length === 0, badStops(seq))
      rec.check('dashboard: breadcrumb, table rows and row ⋮ are reachable',
        seq.some(a => a.name === 'Projects' && a.inBar) && seq.some(a => /^Open chat:/.test(a.name)) && seq.some(a => /^Actions for /.test(a.name)))
      rec.check('dashboard: the review bar comes last in Tab order', seq.filter(a => a.tag !== 'BODY').every((a, i, all) => !a.inTools || all.slice(i).every(b => b.inTools || b.inNav)))
    })

    await run('header menu', async () => {
      await fresh('/projects/banking-issues')
      const more = await tabTo(a => a.name === 'More' && a.inMain)
      await page.key('Enter')
      const inMenu = await page.active()
      rec.check('header ⋮: Tab reaches it, Enter opens the menu and moves focus into it', !!more && (await menus()).length === 1 && inMenu.inMenu, short(inMenu))
      await page.key('ArrowDown')
      const next = await page.active()
      await page.key('Escape')
      const back = await page.active()
      rec.check('header menu: ArrowDown moves inside; Escape closes and focus returns to ⋮', next.inMenu && (await menus()).length === 0 && back.name === 'More', [short(next), short(back)])
    })

    await run('row menu', async () => {
      await fresh('/projects/banking-issues')
      const row = await tabTo(a => /^Actions for /.test(a.name) && a.inMain)
      await page.key('Enter')
      let a = await page.active()
      // As designed the item reads "Add to Project"; fix row-menu-move-to-project renames it "Move to project". Same submenu.
      const MOVE = /^(Add to Project|Move to project)$/
      for (let i = 0; i < 6 && !MOVE.test(a.name); i++) { await page.key('ArrowDown'); a = await page.active() }
      await page.key('Enter')
      const two = (await menus()).length
      await page.key('Escape')
      const back = await page.active()
      rec.check('row ⋮: Enter opens; arrows reach "Add to Project" ("Move to project" with fixes); Enter opens its submenu; Escape closes both and focus returns',
        !!row && MOVE.test(a.name) && two === 2 && (await menus()).length === 0 && /^Actions for /.test(back.name), { reached: short(a), menusOpen: two, back: short(back) })
    })

    await run('card menu', async () => {
      await fresh('/projects')
      const card = await tabTo(a => /^Actions for /.test(a.name))
      await page.key('Enter')
      const open = (await menus()).length
      await page.key('Escape')
      const back = await page.active()
      rec.check('card ⋯: Enter opens its menu; Escape closes it and focus returns', !!card && open === 1 && (await menus()).length === 0 && /^Actions for /.test(back.name), short(back))
    })

    await run('collapse', async () => {
      await fresh('/projects')
      const c = await tabTo(a => a.name === 'Collapse navigation')
      await page.key('Enter'); const a1 = await page.active()
      await page.key('Enter'); const a2 = await page.active()
      await page.key(' '); const a3 = await page.active()
      await page.key(' '); const a4 = await page.active()
      rec.check('Collapse / Expand navigation with Enter and Space: focus lands on the counterpart, with a ring',
        !!c && a1.name === 'Expand navigation' && a1.ring && a2.name === 'Collapse navigation' && a3.name === 'Expand navigation' && a4.name === 'Collapse navigation',
        [a1, a2, a3, a4].map(short))
    })

    await run('overlay', async () => {
      await fresh('/projects', [1000, 800])
      const e = await tabTo(a => a.name === 'Expand navigation')
      await page.key('Enter')
      const a1 = await page.active()
      const seq = await tabs(40)
      await page.key('Escape')
      const a2 = await page.active()
      rec.check('narrow (1000): Expand opens the nav overlay with focus on its Collapse; Tab never reaches the inert page; Escape closes and focus returns',
        !!e && a1.name === 'Collapse navigation' && a1.inNav && seq.every(a => !a.inMain) && a2.name === 'Expand navigation' && !(await page.ev(`!!document.querySelector('.shell__overlay')`)),
        { first: short(a1), leaked: seq.filter(a => a.inMain).map(short), after: short(a2) })
    })

    await run('route focus', async () => {
      await fresh('/projects')
      await tabTo(a => /^Open project /.test(a.name))
      await page.key('Enter'); await sleep(200)
      const onDash = await page.ev(`!!document.querySelector('.pd')`)
      const a1 = await page.active()
      const title = await page.ev('document.title')
      await page.ev(`document.querySelector('.crumbs .tbtn').focus()`)
      await page.key('Enter'); await sleep(200)
      const a2 = await page.active()
      rec.check('Enter on a project card opens the dashboard; focus moves to the page, not BODY; the title names the page',
        onDash && a1.tag !== 'BODY' && /^Banking Issues · /.test(title), { focus: short(a1), title })
      rec.check('Enter on the breadcrumb returns to Projects with focus kept on the page', (await page.ev(`!!document.querySelector('.pl')`)) && a2.tag !== 'BODY', short(a2))
    })

    await run('modal', async () => {
      await fresh('/gallery/modal')
      await page.ev(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Delete Q3 Forecast…').focus()`)
      await page.key('Enter'); await sleep(200)
      const inside = await page.active()
      const seq = await tabs(8)
      const back = []
      for (let i = 0; i < 4; i++) { await page.key('Tab', SHIFT); back.push(await page.active()) }
      await page.key('Escape'); await sleep(150)
      const after = await page.active()
      rec.check('modal: opens with focus inside; Tab and Shift+Tab stay inside; Escape closes and focus returns to the trigger',
        inside.inDialog && seq.every(a => a.inDialog) && back.every(a => a.inDialog) && !(await page.ev(`!!document.querySelector('[role=dialog]')`)) && after.name === 'Delete Q3 Forecast…',
        { inside: short(inside), escaped: [...seq, ...back].filter(a => !a.inDialog).map(short), after: short(after) })
    })
  } finally {
    await page.close()
  }
}
