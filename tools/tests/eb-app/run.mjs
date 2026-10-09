#!/usr/bin/env node
// Regression suite for the Enterprise Brain React prototype (app/ -> dist/eb-app.html). See README.md.
//
//   node tools/tests/eb-app/run.mjs [--build] [suite ...]
//
// Suites: static, frames, router, gallery, playback, contexts, keyboard, overlays, composer, responsive, parity, chat-journey (default: all, in that order).
// Exit code 0 when every check passes. Results: tools/tests/eb-app/out/results.json (+ screenshots and diffs).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launchChrome } from './lib/cdp.mjs'
import { APP_FILE, HERE, ROOT, makeRecorder, startServer } from './lib/harness.mjs'

const ORDER = ['static', 'frames', 'router', 'gallery', 'playback', 'contexts', 'keyboard', 'overlays', 'composer', 'responsive', 'parity', 'chat-journey']
const args = process.argv.slice(2)
const build = args.includes('--build')
const picked = args.filter(a => !a.startsWith('--'))
const unknown = picked.filter(s => !ORDER.includes(s))
if (unknown.length) { console.error(`unknown suite(s): ${unknown.join(', ')}; pick from ${ORDER.join(', ')}`); process.exit(2) }
const suites = picked.length ? ORDER.filter(s => picked.includes(s)) : ORDER

const OUT = join(HERE, 'out')
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
process.env.EB_TEST_TMP = OUT

if (build) {
  console.log('building: npm run build (app/)')
  execFileSync('npm', ['run', 'build'], { cwd: join(ROOT, 'app'), stdio: 'inherit' })
}
if (!existsSync(APP_FILE)) { console.error(`${APP_FILE} is missing: run with --build (or npm run build in app/)`); process.exit(2) }
console.log(`testing ${APP_FILE} (built ${statSync(APP_FILE).mtime.toISOString()})`)

const needsBrowser = suites.some(s => s !== 'static')
const server = needsBrowser ? await startServer() : null
const browser = needsBrowser ? await launchChrome() : null
const all = []
const started = Date.now()
try {
  for (const name of suites) {
    const rec = makeRecorder(name)
    const t0 = Date.now()
    console.log(`\n── ${name} ${'─'.repeat(Math.max(0, 60 - name.length))}`)
    try {
      const mod = await import(`./suites/${name}.mjs`)
      await mod.default({ browser, server, rec, out: OUT, root: ROOT })
    } catch (e) {
      rec.check('suite ran to the end', false, String(e && e.stack || e).split('\n').slice(0, 6).join('\n'))
    }
    const mine = rec.results.filter(r => !r.info)
    console.log(`   ${mine.filter(r => r.ok).length}/${mine.length} passed in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
    all.push(...rec.results)
  }
} finally {
  await browser?.close()
  server?.stop()
}

const checks = all.filter(r => !r.info)
const failed = checks.filter(r => !r.ok)
writeFileSync(join(OUT, 'results.json'), JSON.stringify({ app: APP_FILE, suites, seconds: (Date.now() - started) / 1000, passed: checks.length - failed.length, failed: failed.length, results: all }, null, 1))
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed in ${((Date.now() - started) / 1000).toFixed(0)}s` + (failed.length ? `; ${failed.length} FAILED:` : '.'))
for (const f of failed) console.log(`  FAIL ${f.suite} · ${f.name}`)
console.log(`results: ${join(OUT, 'results.json')}`)
process.exit(failed.length ? 1 : 0)
