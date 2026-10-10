// ROUTER + REVIEW HARNESS: a frame URL reproduces its frame however it is reached (stepper, Back, Forward), the URL
// writers keep the canonical 2.1 form and never push a duplicate entry, undecodable slugs redirect, a built screen that
// ignores some of a frame's keys is reported as approximate (not as built), the closest frame agrees with the visible
// shell, the review chrome never drops focus, the main review switches fit the strip at 1440, and the review button
// never covers the breadcrumb or makes the page scroll sideways at phone widths.
// EB_APP_FILE=/path/to/eb-app.html runs it against another build (a private one), as every other suite reads dist/.
import { newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, fileUrl } from '../lib/harness.mjs'

const APP = process.env.EB_APP_FILE || APP_FILE

const LIVE = `(el => !el.closest('.review-bar--measure'))`
const STATE = `(()=>{const s=document.querySelector('.shell'); const live=${LIVE};
  const face=[...document.querySelectorAll('.shell__tools .review-step__face')].filter(live).map(e=>e.textContent.trim())[0]||null;
  let hash=location.hash.slice(1); try { hash=decodeURIComponent(hash) } catch {}
  return { hash, nav: s?.dataset.navMode, rail: s?.dataset.rail, node: s?.dataset.nodeId, face,
    h1: ((document.querySelector('main h1')||{}).textContent||'').trim(), len: history.length }})()`
const arrow = dir => `.shell__tools .review-step__arrow[aria-label^="${dir === 1 ? 'Next' : 'Previous'} step"]`
/** Click a live (not measuring) button by its text, in the strip or the open popover. */
const pressText = text => `(()=>{const b=[...document.querySelectorAll('.shell__tools button')].filter(${LIVE}).find(b=>b.textContent.trim()===${JSON.stringify(text)}); if(!b) return false; b.click(); return true})()`

export default async function router({ browser, rec }) {
  // a fresh query every time: Page.navigate to the same file with only a new hash is a same-document navigation, which
  // fires no load event (goto would wait out its 15 s timeout) and would keep the previous route's in-memory state
  let n = 0
  // ?unbuilt=show: these checks walk frame URLs that are not built yet (placeholders), which are hidden by default
  const url = (hash, search = '') => fileUrl(APP) + '?unbuilt=show&' + (search ? search.replace(/^\?/, '') + '&' : '') + 'r=' + (++n) + '#' + hash
  // the app as a visitor gets it: unbuilt screens hidden (user decision 2026-10-09)
  const plainUrl = hash => fileUrl(APP) + '?r=' + (++n) + '#' + hash
  const page = await newPage(browser)
  const st = () => page.ev(STATE)
  // A screen that fills the main area (the landing, the chat) floats the review tools: the step's name is in the
  // review popover, so open it once to read the face, then close it again.
  const stFace = async () => {
    const s = await st()
    if (s.face) return s
    const face = await page.ev(`(async()=>{const live=${LIVE}; const t=[...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(live);
      if(!t || t.getAttribute('aria-expanded')==='true') return null; t.click(); await new Promise(r=>setTimeout(r,60));
      const f=[...document.querySelectorAll('.shell__tools .review-step__face')].filter(live).map(e=>e.textContent.trim())[0]||null; t.click(); return f})()`)
    return { ...s, face }
  }
  try {
    // 1. Back / Forward / Previous restore the shell state each frame is drawn with
    await page.goto(url('/projects/client-onboarding?opt=2'), { settle: 400 })
    await page.clickSel(arrow(1), 0, 250)
    const onLight = await st()
    await page.ev('history.back()'); await sleep(300)
    const back = await st()
    rec.check('Back from nav-light 01 to projects 03 restores the dark expanded nav, an exact match',
      onLight.nav === 'light' && back.nav === 'dark' && back.rail === 'expanded' && back.face === 'projects 03', { onLight, back })

    await page.goto(url('/new?menu=account&rail=e&nav=light'), { settle: 400 })
    await page.clickSel(arrow(1), 0, 250)
    await page.ev('history.back()'); await sleep(250)
    const back2 = await stFace()
    await page.ev('history.forward()'); await sleep(300)
    const fwd = await stFace()
    // /new is the built landing (screens/landing): it does not draw menu=account yet, so nav-light 04 is a closest match
    rec.check('Back to nav-light 04 then Forward to logo-options 01: each shows its own nav and rail (04 approximate: no account menu)',
      back2.nav === 'light' && back2.rail === 'expanded' && back2.face === '≈ nav-light 04'
        && fwd.nav === 'dark' && fwd.rail === 'collapsed' && fwd.face === 'logo-options 01', { back2, fwd })

    await page.goto(url('/new?rail=c&nav=light'), { settle: 400 })
    await page.clickSel(arrow(-1), 0, 300)
    const prev = await st()
    rec.check('Previous from nav-light 01 opens projects 03 with the expanded dark nav it is drawn with',
      prev.nav === 'dark' && prev.rail === 'expanded' && prev.face === 'projects 03', prev)

    // 2. a built screen that ignores some of the frame's keys is approximate, tags what it renders, is not counted built
    await page.goto(url('/projects?menu=card:docebo-ui-assets&hover=menu:pin&rail=e'), { settle: 400 })
    const pin = await st()
    rec.check('pinning 02 on the plain Projects landing reads "≈ pinning 02" and tags the shell with projects 01',
      pin.face === '≈ pinning 02' && pin.node === '11657:386523', pin)
    await page.hash('/gallery/build-coverage', 500)
    const built = await page.ev(`Object.fromEntries([...document.querySelectorAll('.cov-table tr[data-journey]')].map(r=>[r.dataset.journey, +r.children[2].textContent]))`)
    // nav-behaviour 01 (/new?seed=no-chips&rail=e) is the built landing; 07 / 08 (Projects with pin menus) are not built
    rec.check('build coverage does not count pinning 02 or nav-behaviour 07 / 08 as built screens',
      built.pinning === 0 && built['nav-behaviour'] <= 1 && built.projects === 3, built)

    // 3. stepping between two steps on one URL with '>' in it adds no history entry
    await page.goto(url('/chat/new-routine/pipeline-command?seed=publish-picked&at=ready&modal=publish>restricted>search&rail=c'), { settle: 400 })
    const c08 = await st()
    await page.clickSel(arrow(1), 0, 250)
    const c08a = await st()
    rec.check('publish-artifact c08 -> c08a (same URL, with ">") adds no history entry',
      c08.face === 'publish-artifact c08' && c08a.face === 'publish-artifact c08a' && c08a.len === c08.len, { c08, c08a })

    // 4. the Option 1 / 2 switch writes the canonical form
    const nb = '/projects/project-name?seed=pins-over10&open=pin:project&menu=row:c1>add-to-project&hover=title-pin&rail=e'
    await page.goto(url(nb), { settle: 400 })
    const opened = await page.ev(`(()=>{const t=[...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(${LIVE}); if(t && !document.querySelector('.review-bar--pop')) t.click(); return true})()`)
    await sleep(150)
    await page.ev(pressText('Option 2')); await sleep(200)
    const o2 = await page.ev('location.hash')
    await page.ev(pressText('Option 1')); await sleep(200)
    const o1 = await page.ev('location.hash')
    rec.check('Option 2 / Option 1 keep the URL canonical (readable ":" and keys in 2.1 order)',
      opened && decodeURIComponent(o2) === '#' + nb + '&opt=2' && !/%3A|%2C/i.test(o2) && decodeURIComponent(o1) === '#' + nb && !/%3A/i.test(o1), { o2, o1 })

    // 5. undecodable project slugs redirect like unknown ones
    const slugs = []
    for (const bad of ['/projects/100%', '/projects/%E0%A4%A']) {
      await page.goto(url(bad), { settle: 300 })
      slugs.push({ bad, ...(await st()), placeholder: await page.ev(`!!document.querySelector('.not-built')`) })
    }
    rec.check('an undecodable project slug redirects to /projects (no "Not built yet")',
      slugs.every(s => s.hash.split('?')[0] === '/projects' && !s.placeholder), slugs)

    // 6. focus is never dropped by the review chrome
    await page.goto(url('/projects/client-onboarding'), { settle: 400 })
    await page.ev(`window.open=()=>null; Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('blocked'))},configurable:true}); true`)
    await page.ev(`(()=>{const t=[...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(${LIVE}); if(t && !document.querySelector('.review-bar--pop')) t.click(); return true})()`)
    await sleep(150)
    await page.clickSel('.shell__tools a.review-bar__figma', 0, 250)
    const shown = await page.active()
    await page.key('Escape'); await sleep(150)
    const afterEsc = await page.ev(`(()=>{const a=document.activeElement; return a ? a.tagName + ' ' + (a.className||'') : 'none'})()`)
    rec.check('Figma link fallback: Escape on the copy field puts focus back on the link',
      shown.tag === 'INPUT' && /^A .*review-bar__figma/.test(afterEsc), { shown, afterEsc })

    await page.goto(url('/new?rail=c&nav=light'), { settle: 400 })
    const hasTry = await page.ev(`(()=>{const b=document.querySelector('.ref-missing__try'); if(!b) return false; b.focus(); return document.activeElement===b})()`)
    if (hasTry) {
      await page.key('Enter'); await sleep(600)
      const after = await page.active()
      rec.check('"Show it" under a reference PNG hands focus to the image (or its message), not to <body>', after.tag !== 'BODY', after)
    } else rec.note('"Show it" not rendered (dev build shows the PNG straight away)', null)

    // the viewport note (pop-ups blocked) hands focus back to its preset when dismissed with ×
    await page.goto(url('/projects'), { settle: 400 })
    await page.ev(`window.open=()=>null; true`)
    const note = await page.ev(`(async()=>{const live=${LIVE}; const tick=()=>new Promise(r=>setTimeout(r,60));
      const t=[...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(live); if(t && !document.querySelector('.review-bar--pop')) { t.click(); await tick() }
      const b=[...document.querySelectorAll('.shell__tools .review-vp__w')].find(live); if(!b) return 'no preset'; b.focus(); b.click(); await tick();
      const x=document.querySelector('.shell__tools .review-vp__close'); if(!x) return 'no note'; x.focus(); x.click(); await tick();
      const a=document.activeElement; return a ? a.tagName + ' ' + (a.className||'') + ' ' + (a.dataset.width||'') : 'none'})()`)
    rec.check('closing the viewport note puts focus back on its width preset', /^BUTTON review-vp__w.* \d+$/.test(note), note)

    // 7. at the 1440 baseline the main switches sit in the strip
    const strip = []
    for (const [search, label] of [['', 'dark expanded'], ['?mode=light', 'light expanded'], ['?rail=collapsed', 'dark collapsed'], ['?mode=light&rail=collapsed', 'light collapsed']]) {
      await page.goto(url('/projects/client-onboarding', search), { settle: 400 })
      const inStrip = await page.ev(`[...document.querySelectorAll('.shell__tools button')].filter(b=>${LIVE}(b) && !b.closest('.review-bar--pop')).map(b=>b.textContent.trim())`)
      strip.push({ label, ok: ['As designed', 'Option 1', 'Option 2', 'Dark', 'Light'].every(t => inStrip.includes(t)) && inStrip.some(t => t.startsWith('With fixes')), inStrip })
    }
    rec.check('at 1440 the dashboard strip shows As designed / With fixes, Option 1 / 2 and Nav Dark / Light (all four nav states)',
      strip.every(s => s.ok), strip.filter(s => !s.ok))

    // 8. the closest frame agrees with the visible shell
    const near = []
    for (const [search, want] of [['', ['chat-artifact', '1707:136008']], ['?mode=light', ['nav-light', '12829:292060']]]) {
      await page.goto(url('/new', search), { settle: 400 })
      const s = await stFace()
      near.push({ search, want, ...s, ok: s.node === want[1] && s.h1 === 'Hello Roger' && (s.face ?? '').includes(want[0]) })
    }
    rec.check('#/new picks the closest frame that agrees with the visible nav (dark: chat-artifact 01, light: nav-light 02)', near.every(n => n.ok), near)
    await page.goto(url('/new'), { settle: 400 })
    await page.ev(`(()=>{const t=[...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(${LIVE}); if(t && !document.querySelector('.review-bar--pop')) t.click(); return true})()`)
    await sleep(100)
    await page.ev(pressText('Light')); await sleep(250)
    const flipped = await stFace()
    rec.check('switching the nav to Light on #/new re-tags the shell (the built landing) with nav-light 02',
      flipped.nav === 'light' && flipped.node === '12829:292060' && flipped.h1 === 'Hello Roger' && (flipped.face ?? '').includes('nav-light 02'), flipped)

    // 9. the review button never covers the breadcrumb, and nothing scrolls sideways, with a long crumb
    const crumb = []
    for (const w of [390, 430, 500]) {
      await page.size(w, 844)
      await page.goto(url('/projects/project-name', '?fixes=on'), { settle: 400 })
      crumb.push(await page.ev(`(()=>{const live=${LIVE};
        const t=[...document.querySelectorAll('.shell__tools .review-bar__toggle, .shell__tools .review-step')].filter(live).map(e=>e.getBoundingClientRect());
        const c=document.querySelector('.crumbs__current').getBoundingClientRect();
        const left=Math.min(...t.map(r=>r.left)), right=Math.max(...t.map(r=>r.right));
        const hit=document.elementFromPoint(c.right-8, c.top+c.height/2);
        return { w: innerWidth, doc: document.scrollingElement.scrollWidth, crumbRight: Math.round(c.right), toolsLeft: Math.round(left), toolsRight: Math.round(right),
          hitCrumb: !!(hit && hit.closest('.crumbs__current')) }})()`))
    }
    await page.size(1440, 900)
    rec.check('long crumb with fixes on at 390 / 430 / 500: no sideways scroll, the review button clears the crumb',
      crumb.every(c => c.doc <= c.w && c.toolsRight <= c.w && c.toolsLeft >= c.crumbRight && c.hitCrumb), crumb)

    // 9. Default (unbuilt screens hidden): an unbuilt URL lands home, unbuilt nav rows are inert, the picker lists fewer steps
    await page.goto(plainUrl('/routines'), { settle: 400 })
    const hiddenRoute = await page.ev(`({ hash: decodeURIComponent(location.hash.slice(1)), placeholder: !!document.querySelector('.not-built') })`)
    rec.check('hidden by default: #/routines (not built) lands on #/projects, no placeholder',
      hiddenRoute.hash.split('?')[0] === '/projects' && !hiddenRoute.placeholder, hiddenRoute)
    const rows = await page.ev(`(async()=>{
      const row = t => [...document.querySelectorAll('.shell__nav .nrow, .shell__nav .lrow, .shell__nav .ritem')].find(e => (e.textContent.trim() || e.getAttribute('aria-label')) === t);
      const out = {}; for (const t of ['Routines', 'Meetings', 'Artifacts', 'Projects', 'New Session']) { const e = row(t); out[t] = e ? (e.getAttribute('aria-disabled') || 'enabled') : 'missing' }
      const r = row('Routines'); if (r) r.click(); await new Promise(res => setTimeout(res, 150));
      out.afterClick = decodeURIComponent(location.hash.slice(1)).split('?')[0]; return out })()`)
    rec.check('hidden by default: Routines and Meetings rows are aria-disabled and inert; New Session, Artifacts and Projects work',
      rows.Routines === 'true' && rows.Meetings === 'true' && rows.Artifacts === 'enabled' && rows.Projects === 'enabled' && rows['New Session'] === 'enabled' && rows.afterClick === '/projects', rows)
    const count = `[...document.querySelectorAll('.review-bar--measure .review-step__select option')].filter(o => !o.disabled && o.value).length`
    const hiddenSteps = await page.ev(count)
    await page.goto(url('/projects'), { settle: 400 })
    const shownSteps = await page.ev(count)
    rec.check('hidden by default: the step picker offers only built steps (fewer than with ?unbuilt=show, but some)',
      hiddenSteps > 0 && hiddenSteps < shownSteps, { hiddenSteps, shownSteps })
  } finally {
    await page.close()
  }
}
