import { useMemo, useSyncExternalStore } from 'react'
import { navMode, rail } from '../app/store'

// Routes live in the hash ("#/chat/new?state=typing") so the app works from disk with no server.
// Sandboxed previews (iframe srcdoc, Safari file://) throw SecurityError on history.pushState; there the
// router keeps the route in memory instead, so navigation still works and nothing throws.
let memory: string | null = null
const listeners = new Set<() => void>()

function current(): string {
  if (memory !== null) return memory
  return location.hash.replace(/^#/, '') || '/'
}

/** The route on screen right now ("/chat/commit?at=answer"), for event handlers that must not read a stale render. */
export function currentHref(): string {
  return current()
}

/** `fromHistory`: Back / Forward (or a hash change) brought this entry back, so restore the shell state it recorded. */
function emit(fromHistory = false) {
  applyShellParams(current(), fromHistory ? recordedShell() : null)
  recordShell()
  listeners.forEach(l => l())
}

// ---------------------------------------------------------------------------------------------------------------
// Shell state pinned in the hash (BUILD-PLAN 2.1): rail=c|e and nav=light|dark set the `rail` / `navMode` stores on
// every navigation, so a frame URL reproduces the frame wherever it is opened. Absent keys leave the stores alone (the
// user's choice, or ?mode= / ?rail= before the #). The other way round: while the hash pins a key, a change of the store
// (the rail toggle, the review bar's nav switch) rewrites that key in place, so the URL keeps describing the screen.
// Every history entry also records the shell state it was last shown with (history.state.shell), and Back / Forward
// restore what the hash does not pin: a frame drawn with the dark nav (no nav key) comes back dark after a detour
// through a nav=light frame, and an entry the reviewer switched to light comes back light.
const queryOf = (href: string) => new URLSearchParams(href.split('?')[1] ?? '')

type ShellState = { rail: 'collapsed' | 'expanded'; nav: 'dark' | 'light' }

/** 'c' / 'collapsed' and 'e' / 'expanded' as the store value, or null for anything else. */
function railValue(v: string | null): 'collapsed' | 'expanded' | null {
  if (v === 'c' || v === 'collapsed') return 'collapsed'
  if (v === 'e' || v === 'expanded') return 'expanded'
  return null
}

let applying = false // the hash is the source while it is being applied: the stores must not write back half of it

/** The hash's rail / nav win; a key the hash does not pin falls back to `recorded` (Back / Forward), else stays. */
function applyShellParams(href: string, recorded: ShellState | null = null) {
  const q = queryOf(href)
  applying = true
  try {
    const r = railValue(q.get('rail')) ?? recorded?.rail
    if (r) rail.set(r)
    const n = q.get('nav')
    if (n === 'light' || n === 'dark') navMode.set(n)
    else if (recorded) navMode.set(recorded.nav)
  } finally {
    applying = false
  }
}

/** The shell state the current history entry was last shown with, or null (a new entry, or no history API). */
function recordedShell(): ShellState | null {
  if (memory !== null) return null
  try {
    const s = (history.state as { shell?: Partial<ShellState> } | null)?.shell
    const r = railValue(s?.rail ?? null)
    return r && (s?.nav === 'dark' || s?.nav === 'light') ? { rail: r, nav: s.nav } : null
  } catch {
    return null
  }
}

/** Write the live shell state onto the current history entry (the URL is left as it is). */
function recordShell() {
  if (memory !== null) return
  try {
    const shell: ShellState = { rail: rail.get(), nav: navMode.get() }
    const state = history.state as { shell?: ShellState } | null
    if (state?.shell?.rail === shell.rail && state.shell.nav === shell.nav) return
    history.replaceState({ ...(state && typeof state === 'object' ? state : {}), shell }, '')
  } catch {
    /* sandboxed previews: no history API, nothing to record */
  }
}

/** Replace (or drop, when value is null) one key=value pair in the raw query, leaving every other byte as it was. */
function rewriteKey(href: string, key: string, value: string | null): string {
  const [path, query = ''] = href.split('?')
  const parts = query.split('&').filter(Boolean)
  const next = value === null
    ? parts.filter(p => p.split('=')[0] !== key)
    : parts.map(p => (p.split('=')[0] === key ? `${key}=${value}` : p))
  return path + (next.length ? '?' + next.join('&') : '')
}

function syncHashFromStores() {
  if (applying) return
  const href = current()
  const q = queryOf(href)
  let next = href
  const pinnedRail = q.get('rail')
  if (pinnedRail !== null && railValue(pinnedRail) !== rail.get()) {
    next = rewriteKey(next, 'rail', rail.get() === 'collapsed' ? 'c' : 'e')
  }
  const pinnedNav = q.get('nav')
  if (pinnedNav !== null && pinnedNav !== navMode.get()) {
    next = rewriteKey(next, 'nav', navMode.get() === 'light' ? 'light' : null) // dark is the default: no key
  }
  if (next !== href) navigate(next, { replace: true })
}

const onShellChange = () => {
  syncHashFromStores()
  recordShell()
}

applyShellParams(current())
recordShell()
rail.subscribe(onShellChange)
navMode.subscribe(onShellChange)

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

// Back / Forward fire popstate (and hashchange when the fragment differs); a hand-edited hash fires both on a new entry,
// which has no recorded state, so the stores stay as they are there.
window.addEventListener('popstate', () => { if (memory === null) emit(true) })
window.addEventListener('hashchange', () => { if (memory === null) emit(true) })

/**
 * Is `url` ('#/path?query') the hash on screen? The browser stores the fragment percent-encoded (' ' '"' '<' '>' '`'),
 * so '#/x?modal=publish>search' reads back as '#/x?modal=publish%3Esearch': compare both in the browser's own form.
 */
function isCurrentHash(url: string): boolean {
  try {
    return new URL(url, location.href).hash === location.hash
  } catch {
    return location.hash === url
  }
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (memory === null) {
    try {
      const url = '#' + to
      if (opts.replace) history.replaceState(history.state, '', url)
      else if (!isCurrentHash(url)) history.pushState(null, '', url)
    } catch {
      memory = to
    }
  } else {
    memory = to
  }
  emit()
}

export type Route = { path: string; query: URLSearchParams; href: string }

export function parseRoute(href: string): Route {
  const [path, query = ''] = href.split('?')
  return { path: path || '/', query: new URLSearchParams(query), href }
}

/** A path segment with its %-escapes decoded, or null when they are malformed ('100%', '%E0%A4%A'). */
function decodeSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment)
  } catch {
    return null
  }
}

/**
 * Match a path against a pattern like '/projects/:slug'. Returns the named segments, or null. A segment that cannot
 * be decoded does not match, so a hand-typed '#/projects/100%' falls through to the app's unknown-route redirect.
 */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const want = pattern.split('/')
  const got = path.split('/')
  if (want.length !== got.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < want.length; i++) {
    if (want[i].startsWith(':')) {
      const value = got[i] ? decodeSegment(got[i]) : null
      if (value === null) return null
      params[want[i].slice(1)] = value
    } else if (want[i] !== got[i]) {
      return null
    }
  }
  return params
}

export function useRoute(): Route {
  const href = useSyncExternalStore(subscribe, current)
  return useMemo(() => parseRoute(href), [href])
}
