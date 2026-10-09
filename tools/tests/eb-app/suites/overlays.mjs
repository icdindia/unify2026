// Overlays and menus (components/overlays, option-menu, dropdown-menu): the repros of defects they once had.
//   modal     focus never drops to <body> when a modal closes: the Delete Q3 Forecast confirm disables its own button
//             (focus goes to the next control), "Close both" on nested modals returns to the first one's button, and a
//             row deleted from its ⋯ menu hands focus to the next row; Escape from a menu-opened modal returns to the ⋯.
//   popover   Tab past a keyboard-opened popover continues from its trigger (it is portaled to the end of the page) and
//             Shift+Tab returns to the trigger; either closes it.
//   option    #/gallery/option-menu opens at the top (a pinned State=Hover row used to scrollIntoView the page 564px
//             down); the keyboard still scrolls the list's own box.
//   aria      no aria-labelledby / aria-describedby IDREF dangles on #/gallery ("Review harness" group) or #/gallery/modal
//             (static surfaces without a header).
//   figma     the role menu's Commenter row (11991:747744: 6 / 12 / 6 / 8, gap 6, check at x 196) and its prohibition
//             icon; the Apps / Download menu (3780:178345) at 332 x 342 with logos and Copy to clipboard; option menu
//             sm radius 6 / md 8 (11832:31551); the tooltip shortcut chip in Inter (3780:177208).
// EB_APP_URL points the suite at another build (e.g. a private `vite build` served over http); default dist/eb-app.html.
import { newPage, sleep, SHIFT } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

const APP = process.env.EB_APP_URL || fileUrl(APP_FILE)
const ACTIVE = `(()=>{const a=document.activeElement;return !a||a===document.body?'BODY':(a.tagName+':'+(a.getAttribute('aria-label')||(a.innerText||'').trim().slice(0,40)||a.className))})()`
/** The first button whose text (or aria-label) is `label`, inside `scope` (a selector) if given. */
const BTN = (label, scope = 'document') =>
  `[...(${scope === 'document' ? 'document' : `document.querySelector(${JSON.stringify(scope)})`}).querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(label)}||b.getAttribute('aria-label')===${JSON.stringify(label)})`
const DANGLING = `[...document.querySelectorAll('[aria-labelledby],[aria-describedby]')].flatMap(e=>['aria-labelledby','aria-describedby'].map(a=>e.getAttribute(a)).filter(Boolean).flatMap(v=>v.split(/\\s+/)).filter(id=>!document.getElementById(id)))`
const POPOVER = `!!document.querySelector('[data-popover]')`
const SPECIMEN = label => `[...document.querySelectorAll('.gallery-specimen')].find(f=>f.querySelector('.gallery-specimen__label')?.textContent.includes(${JSON.stringify(label)}))`

export default async function overlays({ browser, rec }) {
  const run = async (name, fn) => {
    const page = await newPage(browser)
    try { await fn(page) } catch (e) { rec.check(`${name}: ran to the end`, false, String(e && e.message || e)) } finally { await page.close() }
  }
  const press = async (page, expr, wait = 250) => {
    await page.ev(`${expr}.focus(); true`)
    await page.key('Enter')
    await sleep(wait)
  }

  const modal = run('modal', async page => {
    await page.goto(APP + '#/gallery/modal')
    await page.waitFor(BTN('Delete Q3 Forecast…'))
    const dangling = await page.ev(DANGLING)
    rec.check('aria: every labelledby / describedby on #/gallery/modal resolves', dangling.length === 0, dangling)

    await press(page, BTN('Delete Q3 Forecast…'))
    await press(page, BTN('Delete', '[role=dialog]'), 400)
    const afterDelete = await page.ev(ACTIVE)
    rec.check('modal: the confirm that disables its own trigger hands focus to the next control, not <body>',
      afterDelete.startsWith('BUTTON:Settings'), afterDelete)

    await press(page, BTN('Nested modals…'))
    await press(page, BTN('Who can view this? ›', '[role=dialog]'))
    const nested = await page.ev(`document.querySelectorAll('[role=dialog]').length`)
    await press(page, BTN('Close both'), 400) // only the inner modal has it
    const both = await page.ev(ACTIVE)
    rec.check('modal: "Close both" on nested modals returns focus to the first modal\'s trigger',
      nested === 2 && both === 'BUTTON:Nested modals…', { nested, both })

    // ⋯ (keyboard) -> Delete… -> Escape: back on the ⋯ that opened the menu
    await press(page, BTN('Actions for Q3 Forecast'))
    await page.key('Enter') // the menu opened from the keyboard with focus on Delete…
    await sleep(300)
    const opened = await page.ev(`!!document.querySelector('[role=dialog]')`)
    await page.key('Escape')
    await sleep(300)
    const esc = await page.ev(ACTIVE)
    rec.check('modal: Escape from a modal opened from a menu returns focus to the menu\'s trigger',
      opened && esc === 'BUTTON:Actions for Q3 Forecast', { opened, esc })
    // ...and Delete removes the row: focus goes to the next row's ⋯
    await press(page, BTN('Actions for Q3 Forecast'))
    await page.key('Enter')
    await sleep(300)
    await press(page, BTN('Delete', '[role=dialog]'), 400)
    const gone = await page.ev(`!${BTN('Actions for Q3 Forecast')}`)
    const next = await page.ev(ACTIVE)
    rec.check('modal: a confirm that removes its row hands focus to the next row, not <body>',
      gone && next === 'BUTTON:Actions for Pipeline Command', { gone, next })
    rec.check('modal: no console errors', page.problems().length === 0, page.problems())
  })

  const popover = run('popover', async page => {
    await page.goto(APP + '#/gallery/popover')
    const trig = BTN('bottom-start')
    await page.waitFor(trig)
    await press(page, trig)
    const open = [await page.ev(ACTIVE), await page.ev(POPOVER)]
    await page.key('Tab')
    await sleep(120)
    const tab = [await page.ev(ACTIVE), await page.ev(POPOVER)]
    rec.check('popover: Tab past its last control moves on from the trigger and closes it',
      open[0] === 'BUTTON:Manage access' && open[1] && tab[0] === 'BUTTON:bottom-end' && !tab[1], { open, tab })
    await press(page, trig)
    await page.key('Tab', SHIFT)
    await sleep(120)
    const back = [await page.ev(ACTIVE), await page.ev(POPOVER)]
    rec.check('popover: Shift+Tab before its first control returns to the trigger and closes it',
      back[0] === 'BUTTON:bottom-start' && !back[1], back)
  })

  const option = run('option menu', async page => {
    const top = async () => ({
      scrollTop: await page.ev(`document.querySelector('.shell__scroll')?.scrollTop ?? scrollY`),
      h1: await page.ev(`Math.round(document.querySelector('h1').getBoundingClientRect().top)`),
    })
    await page.goto(APP + '#/gallery/option-menu', { settle: 700 })
    await page.waitFor(`document.querySelector('.om')`)
    const direct = await top()
    await page.goto(APP + '#/projects', { settle: 400 })
    await page.hash('/gallery/option-menu', 700)
    const viaHash = await top()
    rec.check('option menu: #/gallery/option-menu opens at the top (directly and by hash)',
      direct.scrollTop === 0 && direct.h1 >= 0 && viaHash.scrollTop === 0 && viaHash.h1 >= 0, { direct, viaHash })
    // the keyboard scrolls the people list's own box, never the page
    const shell = `(document.querySelector('.shell__scroll')?.scrollTop ?? scrollY)`
    await page.ev(`document.querySelector('[aria-label="Invite people and groups"]').focus({preventScroll:true}); true`)
    const before = await page.ev(shell)
    await page.key('ArrowUp') // to the last person, below the 372px box
    await sleep(200)
    const box = await page.ev(`document.getElementById('gallery-people-search').scrollTop`)
    const after = await page.ev(shell)
    rec.check('option menu: ArrowUp to the last option scrolls the list box only', box > 0 && after === before, { box, before, after })
    const radii = await page.ev(`[...document.querySelectorAll('.om')].map(o=>(o.classList.contains('om--sm')?'sm ':'md ')+getComputedStyle(o).borderTopLeftRadius)`)
    rec.check('figma: option menu radius is 6 at Size=sm and 8 at Size=md (11832:31551)',
      radii.length > 0 && radii.every(r => r === 'sm 6px' || r === 'md 8px'), radii)
  })

  const figma = run('menus', async page => {
    await page.goto(APP + '#/gallery/dropdown-items')
    await page.waitFor(SPECIMEN('Role menu'))
    const role = await page.ev(`(()=>{const m=${SPECIMEN('Role menu')}.querySelector('[role=menu]'); const ml=m.getBoundingClientRect().left;
      const row=m.querySelector('.ddi.is-selected'); const ck=row.querySelector('.ddi__check').getBoundingClientRect(); const cs=getComputedStyle(row.querySelector('.ddi__in'));
      const rows=[...m.querySelectorAll('.ddi')]; const last=rows[rows.length-1];
      return {label:row.querySelector('.ddi__t').textContent, checkX:Math.round(ck.left-ml), pad:cs.padding, gap:cs.gap, last:last.textContent.trim(), icon:(last.querySelector('img')?.src||'').includes('M3.29587')}})()`)
    rec.check('figma: role menu Commenter row is 6 / 12 / 6 / 8, gap 6, check at x 196 (11991:747744)',
      role.label === 'Commenter' && role.checkX === 196 && role.pad === '6px 12px 6px 8px' && role.gap === '6px', role)
    rec.check('figma: role menu Remove Access draws the prohibition icon', role.last === 'Remove Access' && role.icon, role)
    const apps = await page.ev(`(()=>{const m=${SPECIMEN('Apps / Download')}.querySelector('[role=menu]'); const r=m.getBoundingClientRect();
      return {size:[r.width,r.height], rows:[...m.querySelectorAll('.ddi .ddi__t')].map(t=>t.textContent), leads:[...m.querySelectorAll('.ddi__lead')].map(l=>l.firstElementChild?.tagName)}})()`)
    rec.check('figma: Apps / Download menu is 332 x 342 with logo images and Copy to clipboard (3780:178345)',
      apps.size[0] === 332 && apps.size[1] === 342 && apps.rows.length === 6 && apps.rows[5] === 'Copy to clipboard' && apps.leads.every(t => t === 'IMG'), apps)

    await page.goto(APP + '#/gallery/tooltip')
    await page.waitFor(`document.querySelector('.tt__kbd')`)
    const kbd = await page.ev(`getComputedStyle(document.querySelector('.tt__kbd')).fontFamily`)
    rec.check('figma: tooltip shortcut chip is set in Inter (3780:177208)', /^"?Inter"?,/.test(kbd), kbd)
    // the family name alone passed while Inter was never loaded (it only rendered on Macs with Inter installed): the page must ship it
    const ships = await page.ev(`[...document.querySelectorAll('link[rel=stylesheet]')].some(l => /family=Inter/.test(l.href))`)
    rec.check('fonts: the page loads Inter from its font stylesheet, not from a local install', ships === true, ships)

    await page.goto(APP + '#/gallery')
    await page.waitFor(`document.querySelector('.gallery-section')`)
    const dangling = await page.ev(DANGLING)
    rec.check('aria: every labelledby / describedby on #/gallery resolves', dangling.length === 0, dangling)
  })

  await Promise.all([modal, popover, option, figma])
}
