// ARTIFACTS: the Artifacts clickthrough (app/src/screens/artifacts). The landing lays the cards out as the file does at
// 1440, the card ⋯ menu clones (the clone joins the grid) and deletes (after the Delete Artifact modal), the type filter
// filters, list view and the empty seed draw, a card opens the artifact page with Back and the chat button, and the
// page's name menu offers Rename / Clone / Delete. Runs as a visitor gets the app (unbuilt screens hidden).
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

const BOX = sel => `(()=>{const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return null; const b=e.getBoundingClientRect(); return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)]})()`
const TITLES = `[...document.querySelectorAll('.acard__title')].map(e=>e.textContent)`
const MENU = `[...document.querySelectorAll('[role=menu] [role^=menuitem]')].map(e=>e.textContent.trim())`
const press = (scope, text) => `(()=>{const b=[...document.querySelectorAll(${JSON.stringify(scope)})].find(e=>e.textContent.trim()===${JSON.stringify(text)}); if(!b) return false; b.click(); return true})()`
const hash = `decodeURIComponent(location.hash.slice(1))`

export default async function artifacts({ browser, rec }) {
  let n = 0
  const url = route => fileUrl(APP_FILE) + '?r=' + (++n) + '#' + route
  const page = await newPage(browser)
  try {
    await page.size(1440, 900)

    // 1. landing at 1440: twelve 288 x 260 cards, three to a row in the 928 column (x 284, y 196; rows 32 apart)
    await page.goto(url('/artifacts?rail=c'), { settle: 600 })
    const grid = await page.ev(`({ n: document.querySelectorAll('.acard').length, a: ${BOX('.acard')}, d: ${BOX('.acard:nth-child(4)')},
      img: ${BOX('.acard__img')}, title: ${BOX('.acard__title')}, toggle: ${BOX('.art .vtoggle')} })`)
    rec.check('landing at 1440: 12 cards, 288 x 260 at (284, 196), rows 32 apart, image 262 x 140 at +13, title at +13 +191, toggle at 1160',
      grid.n === 12 && String(grid.a) === '284,196,288,260' && grid.d?.[1] === 488 && String(grid.img) === '297,209,262,140'
      && grid.title?.[0] === 297 && grid.title?.[1] === 387 && grid.toggle?.[0] === 1160, grid)

    // 2. the card ⋯ menu, then Clone: the clone is the 13th card (last as drawn, cloned-artifact 01)
    await page.ev(`document.querySelector('button[aria-label^="Q3 2026 Revenue Forecast"][aria-label$=": actions"]').click()`)
    await sleep(200)
    const items = await page.ev(MENU)
    rec.check('card ⋯ menu: Pin, Edit with Chat, Clone, Download, Share, Delete', items.join('|') === 'Pin|Edit with Chat|Clone|Download|Share|Delete', items)
    await page.ev(press('[role=menu] [role^=menuitem]', 'Clone'))
    await sleep(250)
    const cloned = await page.ev(TITLES)
    rec.check('Clone adds "… (Cloned)" as the last card', cloned.length === 13 && /\(Cloned\)$/.test(cloned.at(-1)), cloned.slice(-2))

    // 3. Delete: the modal opens on the URL (modal=delete:<id>), Delete removes the card
    await page.ev(`document.querySelector('button[aria-label$="(Cloned): actions"]').click()`)
    await sleep(200)
    await page.ev(press('[role=menu] [role^=menuitem]', 'Delete'))
    await sleep(350)
    const modal = await page.ev(`({ hash: ${hash}, title: document.querySelector('[role=dialog] .mdl-hd')?.textContent || null })`)
    rec.check('Delete opens the Delete Artifact modal (modal=delete:<id>)', modal.hash.includes('modal=delete:q3-forecast-clone') && /Delete Artifact/.test(modal.title || ''), modal)
    await page.ev(press('[role=dialog] button', 'Delete'))
    await sleep(350)
    const afterDelete = await page.ev(`({ n: document.querySelectorAll('.acard').length, dialog: !!document.querySelector('[role=dialog]'), hash: ${hash} })`)
    rec.check('confirming Delete removes the card and closes the modal', afterDelete.n === 12 && !afterDelete.dialog && !afterDelete.hash.includes('modal='), afterDelete)

    // 4. type filter and list view
    await page.ev(`document.querySelector('.art__types').click()`)
    await sleep(200)
    const types = await page.ev(MENU)
    await page.ev(press('[role=menu] [role^=menuitem]', 'Applications'))
    await sleep(200)
    const apps = await page.ev(`[...document.querySelectorAll('.acard__type span')].map(e=>e.textContent)`)
    rec.check('type filter lists All Types … Playbook; Applications leaves only APPLICATION cards',
      types[0] === 'All Types' && types.at(-1) === 'Playbook' && types.length === 10 && apps.length === 4 && apps.every(t => t === 'APPLICATION'), { types, apps })
    await page.goto(url('/artifacts?view=list&rail=c'), { settle: 500 })
    const list = await page.ev(`[...document.querySelectorAll('.alist__row .alist__title')].map(e=>e.textContent)`)
    rec.check('list view (03) draws its four rows as designed', list.join('|') === 'Overview brief|Next steps longer name|Detailed analysis|Annual Event Findings', list)
    await page.goto(url('/artifacts?seed=empty&rail=c'), { settle: 500 })
    const empty = await page.ev(`({ title: document.querySelector('.art__empty .es__title')?.textContent, box: ${BOX('.art__empty')} })`)
    rec.check('seed=empty draws "Create an Artifact", 472 wide at (512, 196)', empty.title === 'Create an Artifact' && String(empty.box?.slice(0, 3)) === '512,196,472', empty)

    // 5. a card opens the artifact page (/view/<id>?from=artifacts): Back, the chat button, the name menu; Back returns
    await page.goto(url('/artifacts?rail=c'), { settle: 600 })
    await page.ev(`document.querySelector('a[aria-label="Open Overview brief"]').click()`)
    await sleep(500)
    const view = await page.ev(`({ hash: ${hash}, back: !!document.querySelector('.ahdr__back'), cta: document.querySelector('.ahdr__cta')?.textContent || null,
      ver: !!document.querySelector('.ahdr__ver'), name: document.querySelector('.ahdr__text')?.textContent })`)
    rec.check('a card opens /view/<id>?from=artifacts with Back, "Edit with Chat" and no version button',
      view.hash.startsWith('/view/overview-brief') && view.hash.includes('from=artifacts') && view.back && view.cta === 'Edit with Chat' && !view.ver && view.name === 'Overview brief', view)
    await page.ev(`document.querySelector('.ahdr__name').click()`)
    await sleep(250)
    const nameMenu = await page.ev(MENU)
    rec.check('the name menu offers Rename, Clone, Delete', nameMenu.join('|') === 'Rename|Clone|Delete', nameMenu)
    await page.key('Escape')
    await page.ev(`document.querySelector('.ahdr__back').click()`)
    await sleep(500)
    const back = await page.ev(`({ path: ${hash}.split('?')[0], cards: document.querySelectorAll('.acard').length })`)
    rec.check('Back returns to the landing', back.path === '/artifacts' && back.cards === 12, back)

    // 6. the drawn clone has no chat yet: "Start Chat" (cloned-artifact 02)
    await page.goto(url('/view/q3-forecast-clone?from=artifacts'), { settle: 600 })
    const clone = await page.ev(`({ cta: document.querySelector('.ahdr__cta')?.textContent || null, close: !!document.querySelector('.ahdr [aria-label="Close artifact"]') })`)
    rec.check('the clone\'s page reads "Start Chat" and has close (13750:301988)', clone.cta === 'Start Chat' && clone.close, clone)
  } finally {
    await page.close()
  }
}
