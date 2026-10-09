// CHAT JOURNEY: "Chat journey with Artifact" (chat-artifact, 27 steps) on the built screens (app/src/screens/landing,
// app/src/screens/chat):
//   (a) every step URL (FRAMES, app/src/figma/frames.generated.ts) renders the built screen, tagged with the step's frame
//       (data-node-id), with no placeholder, no error boundary and no console error, and the review bar names the step;
//   (b) a scripted click-through with real input from the landing page to step 22 and back, asserting the URL after
//       every action (timed beats included: the commit script plays with the Figma timings, about 30 s);
//   (c) a 1440 x 900 pixel diff of every step against its reference PNG (07 at 1440 x 1051), reported as a mismatch % in
//       out/chat-journey-diff.json and INFO lines (it does not fail the suite yet);
//   (d) at 1024 and 390 no step URL scrolls sideways.
// EB_APP_FILE=/path/to/eb-app.html runs it against another build (a private one).
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { FREEZE, newPage, sleep } from '../lib/cdp.mjs'
import { APP_FILE, HERE, OVERFLOW_PROBE, ROOT, fileUrl, overflowProblems } from '../lib/harness.mjs'

const A = fileUrl(process.env.EB_APP_FILE || APP_FILE)
const REF = join(ROOT, 'app', 'figma-ref', 'chat-artifacts', 'chat-artifact')

/** The chat-artifact steps with their canonical URL, as the generated frame map has them. */
function journeySteps() {
  const gen = readFileSync(join(ROOT, 'app', 'src', 'figma', 'frames.generated.ts'), 'utf8')
  const re = /nodeId: "([^"]+)", page: "[^"]*", journey: "chat-artifact", step: \d+, stepId: "([^"]+)", kind: "([^"]+)".*?route: "([^"]+)", size: \[(\d+), (\d+)\], ref: "chat-artifact\/([^"]+)"/g
  return [...gen.matchAll(re)].map(m => ({ node: m[1], stepId: m[2], kind: m[3], route: m[4], w: +m[5], h: +m[6], ref: m[7] }))
}

/** Every frame of every journey by its URL ("input-large 16" shares chat-artifact 04's), for the review bar's step name. */
function namesByRoute() {
  const gen = readFileSync(join(ROOT, 'app', 'src', 'figma', 'frames.generated.ts'), 'utf8')
  const map = new Map()
  for (const m of gen.matchAll(/journey: "([^"]+)", step: \d+, stepId: "([^"]+)".*?route: "([^"]+)"/g)) {
    if (!map.has(m[3])) map.set(m[3], [])
    map.get(m[3]).push(`${m[1]} ${m[2]}`)
  }
  return map
}

/** The screen on view: which built screen, the frame nodes it carries, the review bar's step and Figma links. */
const PROBE = `(async()=>{
  const live = el => !el.closest('.review-bar--measure');
  const read = () => ({
    face: [...document.querySelectorAll('.shell__tools .review-step__face')].filter(live).map(e=>e.textContent.trim())[0] || null,
    figma: [...document.querySelectorAll('.shell__tools a[href*="figma.com"]')].filter(live).map(a=>a.getAttribute('href')),
  });
  let bar = read();
  const toggle = [...document.querySelectorAll('.shell__tools .review-bar__toggle')].find(live);
  if ((!bar.face || !bar.figma.length) && toggle && toggle.getAttribute('aria-expanded') !== 'true') {
    toggle.click(); await new Promise(r => setTimeout(r, 40)); bar = read(); toggle.click(); await new Promise(r => setTimeout(r, 20));
  }
  const screen = document.querySelector('.landing') ? 'landing' : document.querySelector('.chat') ? (document.querySelector('.split') ? 'split' : 'chat')
    : document.querySelector('.not-built') ? 'placeholder' : document.querySelector('.screen-error') ? 'error' : 'other';
  return { screen, nodes: [...document.querySelectorAll('[data-node-id]')].map(e => e.dataset.nodeId).filter((v, i, a) => a.indexOf(v) === i),
    h1: ((document.querySelector('main h1')||{}).textContent||'').trim(), hash: decodeURIComponent(location.hash.slice(1)), ...bar };
})()`

const hashNow = page => page.ev('decodeURIComponent(location.hash.slice(1))')
const canon = h => { const [p, q = ''] = h.split('?'); const s = new URLSearchParams(q); return p + '?' + [...s.entries()].map(([k, v]) => `${k}=${v}`).sort().join('&') }

export default async function chatJourney({ browser, rec, out }) {
  const steps = journeySteps()
  const names = namesByRoute()
  rec.check('the frame map has the 27 chat-artifact steps', steps.length === 27, steps.map(s => s.stepId))
  const routed = steps.filter(s => !s.route.startsWith('/gallery'))

  // ------------------------------------------------------------------------------------------- (a) every step URL
  {
    const page = await newPage(browser)
    try {
      await page.goto(A + '#/projects', { settle: 400 })
      const bad = { screen: [], node: [], bar: [], errors: [] }
      for (const s of steps) {
        const mark = page.log.length
        await page.hash(s.route, 350)
        const p = await page.ev(PROBE)
        const where = `${s.stepId} #${s.route}`
        if (s.route.startsWith('/gallery')) {
          if (!p.nodes.includes(s.node)) bad.node.push(`${where}: gallery page does not carry ${s.node}`)
        } else {
          if (!['landing', 'chat', 'split'].includes(p.screen) || !p.h1) bad.screen.push(`${where}: ${p.screen} "${p.h1}"`)
          // an alias step (08a) shares its URL with the step it repeats: either frame's node is on screen
          const sameUrl = steps.filter(o => o.route === s.route).map(o => o.node)
          if (!sameUrl.some(n => p.nodes.includes(n))) bad.node.push(`${where}: no element carries ${sameUrl.join(' / ')}`)
          const named = !!p.face && (names.get(s.route) ?? []).includes(p.face)
          const linked = p.figma.some(h => h.includes('node-id=' + s.node.replace(/:/g, '-')))
          if (!named || !linked) bad.bar.push(`${where}: face "${p.face}", linked ${linked}`)
        }
        const errs = page.problems(mark)
        if (errs.length) bad.errors.push(`${where}: ${errs.map(e => e.text).join(' | ').slice(0, 300)}`)
      }
      rec.check(`(a) all ${routed.length} step URLs render the built landing / chat / split screen with an <h1>`, bad.screen.length === 0, bad.screen)
      rec.check('(a) each step URL carries the step\'s frame in data-node-id', bad.node.length === 0, bad.node)
      rec.check('(a) the review bar names each step exactly (no ≈) and links its frame in Figma', bad.bar.length === 0, bad.bar)
      rec.check('(a) no console error or exception on any step URL', bad.errors.length === 0, bad.errors)
    } finally { await page.close() }
  }

  // ------------------------------------------------------------------------------------- (b) the click-through
  {
    const page = await newPage(browser)
    const seen = []
    const expect = async (label, want, ms = 2500) => {
      const end = Date.now() + ms
      let now = await hashNow(page)
      while (canon(now) !== canon(want) && Date.now() < end) { await sleep(60); now = await hashNow(page) }
      seen.push({ label, want, now, ok: canon(now) === canon(want) })
      return canon(now) === canon(want)
    }
    const center = async sel => page.center(sel)
    const press = async (sel, wait = 250) => { await page.clickSel(sel, 0, wait) }
    const pressText = async (sel, text, wait = 250) => {
      const c = await page.ev(`(()=>{const el=[...document.querySelectorAll(${JSON.stringify(sel)})].find(e=>e.textContent.includes(${JSON.stringify(text)}) && e.getClientRects().length);
        if(!el) return null; el.scrollIntoView({block:'nearest'}); const r=el.getBoundingClientRect(); return {x:Math.round(r.left+r.width/2), y:Math.round(r.top+r.height/2)}})()`)
      if (!c) throw new Error(`nothing to click: ${sel} "${text}"`)
      await page.click(c.x, c.y, wait)
    }
    try {
      const mark = page.log.length
      await page.goto(A + '#/new?rail=c', { settle: 600 })
      await expect('01 landing', '/new?rail=c')
      await press('.landing textarea', 150)
      await page.type('We are two-thirds through the quarter. How does commit actually look?')
      await expect('02 the question typed (compose=commit-q; the frame also pins hover=send)', '/new?compose=commit-q&rail=c')
      await press('[aria-label="Send message"]', 300)
      await expect('Send: the chat opens at at=sent and plays', '/chat/commit?at=sent&rail=c')
      // 03: the title menu and its Add to Project submenu, while the Assistant is still thinking (4 s on this beat)
      await press('.chh-title', 200)
      const add = await page.ev(`(()=>{const el=[...document.querySelectorAll('[role=menuitem]')].find(e=>e.textContent.includes('Add to Project')); if(!el) return null; const r=el.getBoundingClientRect(); return {x:Math.round(r.left+r.width/2), y:Math.round(r.top+r.height/2)}})()`)
      if (add) { await page.move(add.x - 20, add.y); await page.move(add.x, add.y); await sleep(350) }
      await expect('03 title menu > Add to Project', '/chat/commit?at=sent&menu=title>add-to-project&rail=c', 1500)
      await page.key('Escape'); await page.key('Escape')
      await expect('04 the chain of thought, first thought with sources (timed)', '/chat/commit?at=cot-1&rail=c', 9000)
      await expect('05 all thoughts (timed)', '/chat/commit?at=cot-7&rail=c', 12000)
      await expect('the answer (timed)', '/chat/commit?at=answer&rail=c', 16000)
      await press('[aria-label="Expand navigation"]', 300)
      await expect('08 the rail expanded', '/chat/commit?at=answer&rail=e')
      await press('.chh-share', 400)
      await expect('09 Share opens the share modal', '/chat/commit?at=answer&modal=share&rail=e')
      await press('input[aria-label="Invite people and groups"]', 200)
      await page.type('Matt')
      await sleep(300)
      await pressText('[role=option]', 'Matt Rivera', 400)
      await pressText('[role=dialog] button', 'Invite', 500)
      await expect('Invite: the modal closes, Matt, John and Grace join', '/chat/commit?at=joined&rail=e')
      await press('[aria-label="Collapse navigation"]', 300)
      await press('.chat-col textarea', 150)
      await page.type('@')
      await expect('10 "@" opens the mention list', '/chat/commit?at=joined&compose=at&rail=c')
      const listed = await page.ev(`[...document.querySelectorAll('.mp [role=option]')].map(e=>e.textContent.trim())`)
      await page.type('m')
      await expect('11 "@m" filters it (the frame also pins hover=mention:matt)', '/chat/commit?at=joined&compose=at-m&rail=c')
      await pressText('.mp [role=option]', 'Matt Rivera', 300)
      await page.type('you own most of those six — which')
      await expect('12 the @Matt Rivera token and the message', '/chat/commit?at=joined&compose=mention-matt&rail=c')
      await page.key('Enter')
      await expect('13 Send: Matt is typing', '/chat/commit?at=mention-sent&rail=c')
      await expect('14 Matt replies and tags @Assistant (timed)', '/chat/commit?at=matt-replied&rail=c', 5000)
      await expect('the Pipeline Command answer (timed)', '/chat/commit?at=artifact&rail=c', 9000)
      await press('.chh-people', 400)
      await expect('15 the people-with-access popover', '/chat/commit?at=artifact&pop=access&rail=c')
      await page.key('Escape'); await sleep(200)
      const card = await center('.iac--chat')
      await page.move(card.x, card.y); await sleep(250)
      const hovered = await page.ev(`getComputedStyle(document.querySelector('.iac--chat')).backgroundColor`)
      await expect('16 the card hovered (a real hover: the URL keeps no hover=)', '/chat/commit?at=artifact&rail=c')
      await press('.chh-icon[aria-label^="Files"]', 400)
      await expect('17 the files panel (list)', '/chat/commit?at=artifact&panel=files&rail=c')
      await press('.fp [aria-label="Grid view"]', 300)
      await expect('18 the files panel (grid)', '/chat/commit?at=artifact&panel=files-grid&rail=c')
      await press('.fp .iac__open', 700)
      await expect('19 the artifact opens in the split with the files dropdown', '/chat/commit/pipeline-command?at=artifact&panel=files&cw=650&rail=c')
      await page.key('Escape'); await sleep(250)
      await expect('20 the split without the dropdown', '/chat/commit/pipeline-command?at=artifact&rail=c')
      await press('[aria-label$="version history"]', 300)
      await expect('21 the version menu', '/chat/commit/pipeline-command?at=artifact&menu=version&rail=c')
      await page.key('Escape'); await sleep(200)
      await expect('version menu closed', '/chat/commit/pipeline-command?at=artifact&rail=c')
      const name = await center('[aria-label$=", rename"]')
      await page.move(name.x, name.y); await sleep(150)
      await press('[aria-label$=", rename"]', 300)
      await expect('21b the inline rename', '/chat/commit/pipeline-command?at=artifact&edit=name&rail=c')
      await page.key('Escape'); await sleep(200)
      const nameFocus = await page.active()
      await expect('rename cancelled', '/chat/commit/pipeline-command?at=artifact&rail=c')
      await press('[aria-label="Expand"]', 300)
      await expect('22 full screen', '/chat/commit/pipeline-command?at=artifact&full=1&rail=c')
      await press('[aria-label="Collapse"]', 300)
      await expect('collapse returns to the split', '/chat/commit/pipeline-command?at=artifact&rail=c')
      await press('[aria-label="Close artifact"]', 400)
      await expect('close returns to the chat', '/chat/commit?at=artifact&rail=c')
      const back = await page.active()

      for (const s of seen) rec.check(`(b) ${s.label}: #${s.want}`, s.ok, s.ok ? undefined : { now: s.now })
      rec.check('(b) the mention list offers Assistant and the three people who joined', ['Assistant', 'Matt Rivera', 'John Whitake', 'Grace Coleman'].every(n => listed.some(l => l.includes(n.split(' ')[0]))), listed)
      rec.check('(b) hovering the inline card draws its hover fill', hovered && hovered !== 'rgb(255, 255, 255)', hovered)
      rec.check('(b) Escape on the rename field returns focus to the name', /rename/.test(nameFocus.name), nameFocus)
      rec.check('(b) closing the artifact returns focus to the card that opened it', back.tag === 'BUTTON' && /Open /.test(back.name), back)
      const errs = page.problems(mark)
      rec.check('(b) no console error or exception during the click-through', errs.length === 0, errs.map(e => e.text).slice(0, 6))
      await page.shot(join(out, 'chat-journey-end.png'))
    } catch (e) {
      for (const s of seen) rec.check(`(b) ${s.label}: #${s.want}`, s.ok, s.ok ? undefined : { now: s.now })
      rec.check('(b) the click-through ran to the end', false, String(e && e.stack || e).split('\n').slice(0, 4).join('\n'))
      await page.shot(join(out, 'chat-journey-fail.png')).catch(() => {})
    } finally { await page.close() }
  }

  // ----------------------------------------------------------------------------------------- (c) pixel diffs
  {
    const cases = []
    for (const s of routed) {
      const page = await newPage(browser, { width: s.w, height: s.h })
      try {
        await page.goto(A + '#' + s.route, { settle: 1000 })
        await page.ev(FREEZE)
        await sleep(500)
        const png = join(out, `cj-app-${s.stepId}.png`)
        await page.shot(png, { x: 0, y: 0, width: s.w, height: s.h })
        const tools = await page.ev(`(()=>{const r=document.querySelector('.shell__tools')?.getBoundingClientRect(); return r ? [r.left-2, r.top-2, r.right+2, r.bottom+2] : null})()`)
        cases.push({ name: s.stepId, ref: join(REF, s.ref), app: png, masks: tools ? [tools] : [], diff: join(out, `cj-diff-${s.stepId}.png`) })
      } finally { await page.close() }
    }
    writeFileSync(join(out, 'chat-journey-cases.json'), JSON.stringify(cases, null, 1))
    const py = spawnSync('python3', [join(HERE, 'chat_journey_diff.py'), join(out, 'chat-journey-cases.json')], { encoding: 'utf8' })
    const results = py.status === 0 ? py.stdout.trim().split('\n').map(l => JSON.parse(l)) : []
    const report = results.map(r => ({ step: r.name, node: steps.find(s => s.stepId === r.name)?.node, ...r }))
    writeFileSync(join(out, 'chat-journey-diff.json'), JSON.stringify({ threshold: 40, background: '#fbfaf9', steps: report }, null, 1))
    rec.check('(c) every step was captured and diffed against its reference PNG (out/chat-journey-diff.json)',
      py.status === 0 && results.length === routed.length && results.every(r => !r.error), py.status === 0 ? results.filter(r => r.error) : py.stderr.slice(0, 500))
    for (const r of report) rec.note(`(c) ${r.step} ${r.node}: ${r.mismatch}% of the frame differs`, { px: r.px, bbox: r.bbox })
    const mean = results.length ? results.reduce((a, r) => a + (r.mismatch || 0), 0) / results.length : null
    rec.note('(c) mean mismatch across the steps', mean === null ? null : `${mean.toFixed(2)}%`)
  }

  // ------------------------------------------------------------------------------- (d) no sideways scroll
  {
    const page = await newPage(browser)
    try {
      await page.goto(A + '#/projects', { settle: 300 })
      const bad = []
      for (const [w, h] of [[1024, 768], [390, 844]]) {
        await page.size(w, h)
        for (const s of routed) {
          await page.hash(s.route, 250)
          const o = overflowProblems(await page.ev(OVERFLOW_PROBE))
          if (o.length) { bad.push(`${w} ${s.stepId}: ${o.join('; ')}`); await page.shot(join(out, `cj-overflow-${w}-${s.stepId}.png`)) }
        }
      }
      rec.check('(d) at 1024 and 390 no step URL scrolls sideways', bad.length === 0, bad.slice(0, 12))
    } finally { await page.close() }
  }
}
