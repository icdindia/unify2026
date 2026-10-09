// Shared plumbing for the suites: repo paths, a throwaway static server, result bookkeeping.
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sleep } from './cdp.mjs'

export const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const ROOT = resolve(HERE, '../../..') // tools/tests/eb-app -> repo root
export const APP_FILE = join(ROOT, 'dist', 'eb-app.html')
export const ORACLE_FILE = join(ROOT, 'prototypes', 'project-dashboard', 'index.html')
export const fileUrl = p => 'file://' + p

/** A free TCP port on 127.0.0.1. */
export function freePort() {
  return new Promise((res, rej) => {
    const s = createServer()
    s.once('error', rej)
    s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)) })
  })
}

/** python3 -m http.server over the repo root on a free port; returns { origin, stop }. */
export async function startServer() {
  const port = await freePort()
  const proc = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', ROOT], { stdio: 'ignore' })
  const origin = `http://127.0.0.1:${port}`
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(origin + '/dist/eb-app.html', { method: 'HEAD' }); if (r.ok) break } catch { /* not up yet */ }
    await sleep(100)
  }
  return { origin, port, stop: () => proc.kill('SIGKILL') }
}

/**
 * Results of one suite. check() records PASS / FAIL with an optional detail; note() records INFO lines (measurements,
 * baselines) that never fail the run.
 */
export function makeRecorder(suite) {
  const results = []
  return {
    suite,
    results,
    check(name, ok, detail) {
      results.push({ suite, name, ok: !!ok, detail: detail === undefined ? undefined : detail })
      const line = `${ok ? 'PASS' : 'FAIL'}  ${suite} · ${name}`
      console.log(ok || detail === undefined ? line : `${line}\n      ${typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 1500)}`)
      return !!ok
    },
    note(name, detail) {
      results.push({ suite, name, info: true, detail })
      if (process.env.VERBOSE) console.log(`INFO  ${suite} · ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`)
    },
  }
}

/** The app's own check for "the page did not grow sideways": the document and the shell's scroll area. */
export const OVERFLOW_PROBE = `(()=>{
  const de=document.documentElement, sc=document.querySelector('.shell__scroll'), bar=document.querySelector('.shell__bar'), tools=document.querySelector('.shell__tools');
  const vw=innerWidth;
  const out=[];
  // visible elements that stick out of the viewport and are not inside something that scrolls or clips sideways
  for (const el of document.querySelectorAll('.shell *')) {
    const r=el.getBoundingClientRect(); if (!r.width||!r.height) continue;
    if (r.right<=vw+1 && r.left>=-1) continue;
    let clipped=false;
    for (let p=el.parentElement; p && p!==document.body; p=p.parentElement) {
      const o=getComputedStyle(p).overflowX; if (o!=='visible') { const pr=p.getBoundingClientRect(); if (pr.right<=vw+1 && pr.left>=-1) { clipped=true; break } }
    }
    if (!clipped && getComputedStyle(el).visibility!=='hidden') out.push((el.className&&el.className.baseVal===undefined?String(el.className):el.tagName).slice(0,60)+' '+Math.round(r.left)+'..'+Math.round(r.right));
    if (out.length>8) break;
  }
  return { vw, doc: de.scrollWidth, scroll: sc ? [sc.scrollWidth, sc.clientWidth] : null, bar: bar ? [bar.scrollWidth, bar.clientWidth] : null,
    tools: tools ? Math.round(tools.getBoundingClientRect().right) : null, sticking: out };
})()`

/** Overflow verdict from OVERFLOW_PROBE's result. */
export function overflowProblems(o) {
  const p = []
  if (o.doc > o.vw + 1) p.push(`document is ${o.doc}px wide in a ${o.vw}px viewport`)
  if (o.scroll && o.scroll[0] > o.scroll[1] + 1) p.push(`page scrolls sideways (${o.scroll[0]} > ${o.scroll[1]})`)
  if (o.tools !== null && o.tools > o.vw + 1) p.push(`review bar ends at ${o.tools}px`)
  if (o.sticking.length) p.push('outside the viewport: ' + o.sticking.join('; '))
  return p
}
