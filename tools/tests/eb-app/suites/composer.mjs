// Composer and Tags field (components/composer, components/form): the repros of defects they once had, each on a fresh
// page so an open IME composition never leaks into the next case.
//   focus   pressing Stop by keyboard, or the answer ending while Stop has focus, hands focus to the action that takes
//           Stop's place (it used to drop to <body>); a click away from Stop is not undone when the answer ends.
//   IME     the Enter that confirms a composition never sends or queues (Safari: compositionend, then keydown 229),
//           keys during a composition never reach the "@" / "/" picker, and the Tags field makes no chip of them.
//   shrink  type="bottom" goes back to the pill once the text fits on one line again.
//   chevron the Tags field gallery's role button draws the 12px chevron-down of 11991:750624 (6 x 3.5 at 397) with
//           "Commenter" at 324, not the 20px chevron-down-sm scaled to 3 x 2.
// EB_APP_URL points the suite at another build (e.g. a private `vite build` served over http); default dist/eb-app.html.
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

const APP = process.env.EB_APP_URL || fileUrl(APP_FILE)
const PLAY = '#/gallery/composer?sheet=playground'
const ACTIVE = `(()=>{const a=document.activeElement;return !a||a===document.body?'BODY':(a.tagName+':'+(a.getAttribute('aria-label')||a.className))})()`
const STOP = `document.querySelector('.composer [aria-label="Stop generating"]')`
const FIELD = `document.querySelector('.composer textarea')`
/** Dispatch a keydown on `sel` (as an IME would send it) and return whether the page called preventDefault. */
const imeKey = (sel, key, { composing, end } = {}) => `(()=>{const t=${sel};
  ${end ? `t.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:${JSON.stringify(end)}}));` : ''}
  const e=new KeyboardEvent('keydown',{key:'${key}',code:'${key}',keyCode:229,which:229,bubbles:true,cancelable:true,isComposing:${!!composing}});
  t.dispatchEvent(e); return e.defaultPrevented})()`

export default async function composer({ browser, rec }) {
  // each case on its own page (own browser context), closed afterwards
  const run = async (name, fn) => {
    const page = await newPage(browser)
    try { await fn(page) } catch (e) { rec.check(`${name}: ran to the end`, false, String(e && e.message || e)) } finally { await page.close() }
  }
  const send = async (page, text) => {
    await page.ev(`${FIELD}.focus()`)
    await page.type(text)
    await page.key('Enter')
    return page.waitFor(STOP, 2000)
  }

  // Stop by keyboard: focus goes to Voice mode (the field is empty), not <body>
  const stopByKey = run('composer focus', async page => {
    await page.goto(APP + PLAY)
    await page.waitFor(FIELD)
    await send(page, 'hello')
    await page.ev(`${STOP}.focus()`)
    await page.key('Enter')
    await sleep(200)
    const after = await page.ev(ACTIVE)
    rec.check('composer: Enter on Stop hands focus to the action that replaces it', after === 'BUTTON:Voice mode', after)
    // the 6s answer ends while Stop has focus
    await send(page, 'again')
    await page.ev(`${STOP}.focus()`)
    const ended = await page.waitFor(`!${STOP}`, 9000)
    await sleep(150)
    const end = await page.ev(ACTIVE)
    rec.check('composer: the answer ending while Stop has focus hands focus to its replacement', ended && end === 'BUTTON:Voice mode', { ended, end })
  })
  // ...and a click away from Stop is not undone when the answer ends (runs alongside, on its own page)
  const awayFromStop = run('composer focus away', async page => {
    await page.goto(APP + PLAY)
    await page.waitFor(FIELD)
    await send(page, 'hello')
    await page.ev(`${STOP}.focus()`)
    await page.ev(`document.activeElement.blur()`)
    const ended = await page.waitFor(`!${STOP}`, 9000)
    await sleep(150)
    const end = await page.ev(ACTIVE)
    rec.check('composer: focus moved away from Stop stays away when the answer ends', ended && end === 'BODY', { ended, end })
  })
  await Promise.all([stopByKey, awayFromStop])

  await run('composer IME Enter', async page => {
    await page.goto(APP + PLAY)
    await page.waitFor(FIELD)
    await page.ev(`${FIELD}.focus()`)
    await page.send('Input.imeSetComposition', { text: 'にほん', selectionStart: 3, selectionEnd: 3 })
    await page.send('Input.insertText', { text: 'にほん' })
    await sleep(80)
    const prevented = await page.ev(imeKey(FIELD, 'Enter', { end: 'にほん' }))
    await sleep(150)
    const idle = { prevented, value: await page.ev(`${FIELD}.value`), log: await page.ev(`document.querySelector('.cg-out').textContent`) }
    rec.check('composer: the Enter that confirms an IME conversion (Safari order) does not send', !prevented && idle.value === 'にほん' && !/sent:/.test(idle.log), idle)
    await page.key('Enter') // a real Enter sends it and starts the answer
    await page.waitFor(STOP, 2000)
    await page.ev(`${FIELD}.focus()`)
    await page.send('Input.imeSetComposition', { text: 'かな', selectionStart: 2, selectionEnd: 2 })
    await page.send('Input.insertText', { text: 'かな' })
    await sleep(80)
    const prevented2 = await page.ev(imeKey(FIELD, 'Enter', { end: 'かな' }))
    await sleep(150)
    const busy = { prevented: prevented2, value: await page.ev(`${FIELD}.value`), log: await page.ev(`document.querySelector('.cg-out').textContent`) }
    rec.check('composer: ...nor queue while the answer runs', !prevented2 && busy.value === 'かな' && !/queued:/.test(busy.log), busy)
  })

  await run('composer IME trigger', async page => {
    const TA = `document.querySelector('.cg-trigger textarea')`
    await page.goto(APP + '#/gallery/composer?sheet=tokens')
    await page.waitFor(TA)
    await page.ev(`(()=>{const t=${TA}; t.focus(); t.setSelectionRange(t.value.length,t.value.length)})()`)
    const start = await page.ev(`${TA}.value`)
    await page.type('@')
    await page.send('Input.imeSetComposition', { text: 'mat', selectionStart: 3, selectionEnd: 3 })
    await sleep(150)
    const picker = await page.ev(`document.querySelectorAll('.cg-picker [role=option]').length`)
    const prevented = []
    for (const k of ['ArrowDown', 'Enter']) { prevented.push(await page.ev(imeKey(TA, k, { composing: true }))); await sleep(100) }
    const value = await page.ev(`${TA}.value`)
    await page.send('Input.imeCommitComposition', {}).catch(() => {})
    rec.check('composer: keys during an IME composition never reach the @ / / picker', picker > 0 && !prevented.some(Boolean) && value === start + '@mat',
      { picker, prevented, value })
  })

  await run('tags IME', async page => {
    const IN = `document.querySelectorAll('.tagsfield__input')[2]`
    await page.goto(APP + '#/gallery/tags-field')
    await page.waitFor(IN)
    await page.ev(`${IN}.focus()`)
    await page.send('Input.imeSetComposition', { text: 'やまだ', selectionStart: 3, selectionEnd: 3 })
    await sleep(100)
    const prevented = await page.ev(imeKey(IN, 'Enter', { composing: true }))
    await sleep(120)
    const chips = await page.ev(`document.querySelectorAll('.tagsfield')[2].querySelectorAll('.tagsfield__tag').length`)
    const value = await page.ev(`${IN}.value`)
    await page.send('Input.imeCommitComposition', {}).catch(() => {})
    rec.check('tags field: Enter during an IME composition makes no chip', !prevented && chips === 0 && value === 'やまだ', { prevented, chips, value })
  })

  await run('composer shrink', async page => {
    await page.goto(APP + PLAY)
    await page.waitFor(FIELD)
    const type = () => page.ev(`document.querySelector('.composer').className.match(/composer--bottom-\\w+/)?.[0]`)
    await page.ev(`${FIELD}.focus()`)
    await page.type('This is a rather long line of text that will certainly not fit inside the pill composer at all, more words')
    await sleep(150)
    const long = await type()
    await page.ev(`${FIELD}.select()`)
    await page.type('short text')
    await sleep(150)
    const short = await type()
    rec.check('composer: type="bottom" goes back to the pill once the text fits again', long === 'composer--bottom-large' && short === 'composer--bottom-small', { long, short })
  })

  await run('tags chevron', async page => {
    await page.goto(APP + '#/gallery/tags-field')
    await page.waitFor(`document.querySelector('.tagsfield button[aria-haspopup=menu]')`)
    const m = await page.ev(`(()=>{const b=document.querySelector('.tagsfield button[aria-haspopup=menu]'); const f=b.closest('.tagsfield__frame').getBoundingClientRect();
      const g=b.querySelector('svg path').getBoundingClientRect(); const r=document.createRange(); r.selectNodeContents(b.firstChild); const t=r.getBoundingClientRect();
      return {glyph:[+(g.left-f.left).toFixed(1),+g.width.toFixed(1),+g.height.toFixed(1)], text:+(t.left-f.left).toFixed(1), frame:f.width}})()`)
    const near = (a, b) => Math.abs(a - b) <= 0.5
    rec.check('tags field gallery: the role chevron is 6 x 3.5 at 397 and "Commenter" starts at 324 (11991:750624)',
      m.frame === 416 && near(m.glyph[0], 397) && near(m.glyph[1], 6) && near(m.glyph[2], 3.5) && near(m.text, 324), m)
  })
}
