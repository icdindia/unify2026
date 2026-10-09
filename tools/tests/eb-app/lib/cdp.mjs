// Minimal Chrome DevTools Protocol driver over Node's global WebSocket (Node 22+). No npm dependencies.
// One headless Chrome per run; each page gets its own browser context (no shared history, storage or cache), real
// (trusted) mouse and keyboard input, device-metrics emulation for any width (headless --window-size stops at ~500px),
// console / exception capture across the page and its iframes, and evaluation inside an iframe (same-process context
// or out-of-process session) for the srcdoc / sandbox wrappers.
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const sleep = ms => new Promise(r => setTimeout(r, ms))
export const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export async function launchChrome() {
  const port = 9500 + Math.floor(Math.random() * 400)
  const profile = mkdtempSync(join(process.env.EB_TEST_TMP || tmpdir(), 'eb-chrome-'))
  const proc = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1440,900',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--allow-file-access-from-files', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--font-render-hinting=none', ...(process.env.EB_CHROME_FLAGS || '').split(/\s+/).filter(Boolean), 'about:blank',
  ], { stdio: 'ignore' })
  let version
  for (let i = 0; i < 150 && !version; i++) {
    try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json() } catch { await sleep(100) }
  }
  if (!version) { proc.kill('SIGKILL'); throw new Error('Chrome did not start: ' + CHROME) }
  const ws = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  let id = 0
  const pending = new Map()
  const handlers = new Set()
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data)
    if (m.id && pending.has(m.id)) {
      const { res, rej, method } = pending.get(m.id)
      pending.delete(m.id)
      m.error ? rej(new Error(`${method}: ${m.error.message} ${m.error.data || ''}`)) : res(m.result)
    } else if (m.method) handlers.forEach(h => h(m))
  }
  const send = (method, params = {}, sessionId, timeout = 20000) => new Promise((res, rej) => {
    const mid = ++id
    pending.set(mid, { res, rej, method })
    setTimeout(() => { if (pending.has(mid)) { pending.delete(mid); rej(new Error('CDP timeout: ' + method)) } }, timeout)
    ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) }))
  })
  return {
    send,
    on: h => { handlers.add(h); return () => handlers.delete(h) },
    async close() {
      try { await send('Browser.close', {}, undefined, 3000) } catch { /* already gone */ }
      try { ws.close() } catch { /* closed */ }
      proc.kill('SIGKILL')
      try { rmSync(profile, { recursive: true, force: true }) } catch { /* in use */ }
    },
  }
}

const KEYS = {
  Tab: [9, 'Tab'], Enter: [13, 'Enter', '\r'], Escape: [27, 'Escape'], ' ': [32, 'Space', ' '], Backspace: [8, 'Backspace'],
  ArrowDown: [40, 'ArrowDown'], ArrowUp: [38, 'ArrowUp'], ArrowRight: [39, 'ArrowRight'], ArrowLeft: [37, 'ArrowLeft'],
  Home: [36, 'Home'], End: [35, 'End'],
}
export const SHIFT = 8

/**
 * A fresh page in its own browser context. `log` collects exceptions and console errors / warnings from the page and
 * every frame in it: { kind, text, url }.
 */
export async function newPage(browser, { width = 1440, height = 900 } = {}) {
  const { browserContextId } = await browser.send('Target.createBrowserContext', { disposeOnDetach: true })
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank', browserContextId })
  const { sessionId: S } = await browser.send('Target.attachToTarget', { targetId, flatten: true })
  const log = []
  const sessions = new Map() // child sessionId -> targetInfo (OOPIFs)
  const contexts = new Map() // `${sid}|${id}` -> { sid, id, frameId, isDefault }
  const mine = sid => sid === S || sessions.has(sid)
  const off = browser.on(m => {
    const sid = m.sessionId
    if (!mine(sid) && !(m.method === 'Target.attachedToTarget' && mine(sid))) return
    const p = m.params
    switch (m.method) {
      case 'Runtime.exceptionThrown': {
        const d = p.exceptionDetails
        log.push({ kind: 'exception', text: (d.exception && (d.exception.description || d.exception.value)) || d.text, url: d.url })
        break
      }
      case 'Runtime.consoleAPICalled':
        if (p.type === 'error' || p.type === 'warning' || p.type === 'assert') {
          log.push({ kind: 'console.' + p.type, text: p.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 500) })
        }
        break
      case 'Log.entryAdded':
        if (p.entry.level === 'error' || p.entry.level === 'warning') log.push({ kind: 'log.' + p.entry.level, text: p.entry.text.slice(0, 400), url: p.entry.url })
        break
      case 'Runtime.executionContextCreated': {
        const c = p.context
        contexts.set(`${sid}|${c.id}`, { sid, id: c.id, frameId: c.auxData?.frameId, isDefault: c.auxData?.isDefault })
        break
      }
      case 'Runtime.executionContextDestroyed':
        contexts.delete(`${sid}|${p.executionContextId}`)
        break
      case 'Runtime.executionContextsCleared':
        for (const k of [...contexts.keys()]) if (k.startsWith(sid + '|')) contexts.delete(k)
        break
      case 'Target.attachedToTarget': {
        const child = p.sessionId
        sessions.set(child, p.targetInfo)
        ;(async () => {
          await browser.send('Runtime.enable', {}, child).catch(() => {})
          await browser.send('Log.enable', {}, child).catch(() => {})
          await browser.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, child).catch(() => {})
          await browser.send('Runtime.runIfWaitingForDebugger', {}, child).catch(() => {})
        })()
        break
      }
      case 'Target.detachedFromTarget':
        sessions.delete(p.sessionId)
        break
    }
  })
  await browser.send('Page.enable', {}, S)
  await browser.send('Runtime.enable', {}, S)
  await browser.send('Log.enable', {}, S)
  await browser.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, S)
  await browser.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, S)
  await browser.send('Emulation.setFocusEmulationEnabled', { enabled: true }, S)

  let target = { sid: S, ctx: undefined } // where ev() runs: the page, or the app inside an iframe

  const page = {
    S, log, width, height,
    send: (method, params, sid = S) => browser.send(method, params, sid),
    async size(w, h) {
      page.width = w; page.height = h
      await browser.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }, S)
      await sleep(200)
    },
    /** Load a URL and wait for the load event, the web fonts and `settle` ms. */
    async goto(url, { settle = 400 } = {}) {
      target = { sid: S, ctx: undefined }
      contexts.clear()
      const loaded = new Promise(res => {
        const stop = browser.on(m => { if (m.sessionId === S && m.method === 'Page.loadEventFired') { stop(); res() } })
        setTimeout(() => { stop(); res() }, 15000)
      })
      await browser.send('Page.navigate', { url }, S)
      await loaded
      await page.evTop('document.fonts ? document.fonts.ready.then(() => true) : true').catch(() => {})
      await sleep(settle)
    },
    /** Run the following ev() calls inside the first iframe (the app in the srcdoc / sandbox wrappers). */
    async useFrame() {
      for (let i = 0; i < 50; i++) {
        for (const [sid, info] of sessions) if (info.type === 'iframe') { target = { sid, ctx: undefined }; return }
        const tree = (await browser.send('Page.getFrameTree', {}, S)).frameTree
        const child = tree.childFrames?.[0]?.frame
        const c = child && [...contexts.values()].find(x => x.sid === S && x.frameId === child.id && x.isDefault)
        if (c) { target = { sid: S, ctx: c.id }; return }
        await sleep(100)
      }
      throw new Error('no iframe context found')
    },
    async ev(expr) {
      const r = await browser.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, ...(target.ctx ? { contextId: target.ctx } : {}) }, target.sid)
      if (r.exceptionDetails) throw new Error('eval failed: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) + '\n  in: ' + expr.slice(0, 160))
      return r.result.value
    },
    async evTop(expr) {
      const r = await browser.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, S)
      if (r.exceptionDetails) throw new Error('eval failed: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text))
      return r.result.value
    },
    /** Poll `expr` until it is truthy or `ms` pass. Returns whether it became truthy (a DOM node counts). */
    async waitFor(expr, ms = 3000, every = 40) {
      const end = Date.now() + ms
      while (Date.now() < end) {
        if (await page.ev(`!!(${expr})`).catch(() => false)) return true
        await sleep(every)
      }
      return false
    },
    /** Change the app's hash route in place (no reload) and let React render. */
    async hash(route, settle = 120) {
      await page.ev(`location.hash = ${JSON.stringify('#' + route)}`)
      await sleep(settle)
    },
    async key(k, modifiers = 0) {
      const [code, codeName, text] = KEYS[k] || [0, k, k]
      const base = { key: k, code: codeName, windowsVirtualKeyCode: code, modifiers }
      await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', ...base, ...(text ? { text, unmodifiedText: text } : {}) }, S)
      await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', ...base }, S)
      await sleep(70)
    },
    async type(s) { await browser.send('Input.insertText', { text: s }, S); await sleep(70) },
    async move(x, y) { await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }, S); await sleep(60) },
    async click(x, y, wait = 150) {
      await browser.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }, S)
      await browser.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }, S)
      await browser.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }, S)
      await sleep(wait)
    },
    /** Centre of the idx-th element matching a selector, in viewport coordinates (wrappers put the iframe at 0,0). */
    async center(sel, idx = 0) {
      return page.ev(`(()=>{const el=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>!e.closest('[inert],[aria-hidden=true]'))[${idx}]; if(!el) return null;
        el.scrollIntoView({block:'nearest',inline:'nearest'}); const r=el.getBoundingClientRect(); return {x:Math.round(r.left+r.width/2), y:Math.round(r.top+r.height/2), w:r.width, h:r.height}})()`)
    },
    async clickSel(sel, idx = 0, wait) {
      const c = await page.center(sel, idx)
      if (!c || !c.w || !c.h) throw new Error('nothing to click: ' + sel + '[' + idx + ']')
      await page.click(c.x, c.y, wait)
      return c
    },
    /** The focused element: tag, role, accessible-ish name, whether it is visible and shows a focus ring, where it is. */
    async active() {
      return page.ev(`(()=>{const a=document.activeElement; if(!a||a===document.body) return {tag:'BODY'};
        const cs=getComputedStyle(a), r=a.getBoundingClientRect();
        const name=(a.getAttribute('aria-label')||(a.innerText||'').trim()||a.title||a.placeholder||a.value||'').slice(0,60);
        const drawn=c=>(c.outlineStyle!=='none'&&parseFloat(c.outlineWidth)>0)||(c.boxShadow&&c.boxShadow!=='none');
        // the ring is on the control, or on the box that wraps it (a card link's card, a search field's frame)
        let ring=drawn(cs);
        for(let p=a.parentElement,i=0;!ring&&p&&i<3;p=p.parentElement,i++) ring=p.matches(':focus-within')&&drawn(getComputedStyle(p));
        return {tag:a.tagName, role:a.getAttribute('role')||'', name, fv:a.matches(':focus-visible'), ring:!!ring,
          vis:r.width>0&&r.height>0&&cs.visibility!=='hidden', inMain:!!a.closest('.shell__scroll'), inNav:!!a.closest('.shell__nav,.shell__overlay'),
          inBar:!!a.closest('.shell__bar'), inTools:!!a.closest('.shell__tools'), inMenu:!!a.closest('.dd,[role=menu]'), inDialog:!!a.closest('[role=dialog]')}})()`)
    },
    /** PNG of the viewport (or a clip) to `path`. */
    async shot(path, clip) {
      const { data } = await browser.send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }, S)
      writeFileSync(path, Buffer.from(data, 'base64'))
    },
    /** Log entries after index `from` that are real problems (not the wrappers' favicon 404). */
    problems(from = 0) {
      return log.slice(from).filter(e => !/favicon\.ico/.test(e.text + (e.url || '')))
    },
    async close() {
      off()
      await browser.send('Target.closeTarget', { targetId }).catch(() => {})
      await browser.send('Target.disposeBrowserContext', { browserContextId }).catch(() => {})
    },
  }
  return page
}

/** Freeze CSS animations, transitions and the caret, for screenshots. */
export const FREEZE = `(()=>{const s=document.createElement('style');s.textContent='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';document.head.appendChild(s);return true})()`
