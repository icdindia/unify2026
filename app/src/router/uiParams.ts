import { useCallback, useMemo } from 'react'
import { currentHref, navigate, parseRoute, useRoute } from './router'

// UI state in the URL (BUILD-PLAN 2.1). Every designed state is reachable at one URL: '#/<path>?<key>=<value>&…'.
// Read a key with useUiParam / useUi, change it with setUi (or the setter), build links with buildUrl. Writers always
// emit the canonical form: keys in the order of UI_KEYS (the 2.1 table), unknown keys after them sorted, and values
// left readable (':' '>' ',' '+' are not escaped), e.g. '/chat/commit?seed=shared-2&at=joined&modal=share>role:candice&rail=c'.

/** Every 2.1 key with what it means, in canonical order (the 2.1 table, top to bottom). tools/gen-frames.py uses the same order. */
export const UI_KEY_DOCS = {
  seed: 'data scenario flags (comma list): no-chips, budget-over, queue-2, shared-2, unpinned:<id> …',
  at: 'conversation beat on chat routes: sent, cot-1, cot-7, answer, joined, artifact …',
  role: 'the viewer\'s access to an artifact: editor (default) | commenter | viewer',
  from: 'where an artifact view was opened from (shows Back): artifacts | chat',
  view: 'artifacts landing: grid (default) | list',
  search: 'artifacts landing: open',
  cot: 'chain-of-thought presentation under review: lines | sources',
  glyph: 'thinking glyph under review: bare',
  compose: 'composer preset: commit-q, insights-enhancing, mention-matt, attach-ready …',
  panel: 'side panel: files | files-grid | comments',
  open: 'expanded disclosure: pin:project, thread:1',
  comment: 'canvas comment mode: hover:<block> | compose:<block>',
  cbox: 'comment field preset: one-line | long | plain | agent',
  rbox: 'reply field preset: one-line | long',
  menu: 'the one open menu; \'>\' walks into a submenu, \'+\' joins menus (composite review frames only)',
  pop: 'open popover: cost | cost.pinned | access | typing-people',
  modal: 'open modal; \'>\' is a sub-view: share>invite>role, publish>restricted>search, delete:<id> …',
  edit: 'inline edit: name',
  drag: 'frozen drag gesture (review only): <id>:lift | <id>:over-1 | <id>:out',
  hover: 'pinned hover state (review only; real :hover works without it)',
  full: 'artifact expanded over the chat: 1',
  cw: 'chat column width in the split (review only): 650',
  rail: 'shell: c (collapsed) | e (expanded). Sets the rail store on navigation (router.ts)',
  nav: 'shell: light (dark is the default). Sets the navMode store on navigation (router.ts)',
  vw: 'the viewport width the frame is drawn at: 787, 1728 (the review bar offers to open it at that width)',
  sheet: 'gallery routes only: which reference sheet or state',
} as const

export type UiKey = keyof typeof UI_KEY_DOCS

/** Canonical key order. */
export const UI_KEYS = Object.keys(UI_KEY_DOCS) as UiKey[]

/** A value to write: a string, a number, true ('1'), a list (joined per key, see joinOf), or null / false / '' to remove. */
export type UiValue = string | number | boolean | readonly string[] | null | undefined
export type UiInput = Partial<Record<UiKey, UiValue>> & Record<string, UiValue>

const RANK = new Map<string, number>(UI_KEYS.map((k, i) => [k, i]))

/** How a list value is joined: seeds with ',', composite menus with '+', path-like values (modal, menu items) with '>'. */
function joinOf(key: string): string {
  if (key === 'seed') return ','
  if (key === 'menu') return '+'
  return '>'
}

/** Escape only what would break the query; keep the 2.1 punctuation readable. '+' stays literal in `menu` (its joiner). */
function encodeValue(key: string, value: string): string {
  let out = encodeURIComponent(value).replace(/%3A/gi, ':').replace(/%2C/gi, ',').replace(/%3E/gi, '>').replace(/%2F/gi, '/').replace(/%40/gi, '@')
  if (key === 'menu') out = out.replace(/%2B/gi, '+').replace(/%20/g, '+')
  return out
}

function toText(key: string, value: UiValue): string | null {
  if (value === null || value === undefined || value === false || value === '') return null
  if (value === true) return '1'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value
  const list = value.filter(Boolean)
  return list.length ? list.join(joinOf(key)) : null
}

/** One key as the app reads it. URLSearchParams decodes a literal '+' as a space; in `menu` that space is the '+' joiner. */
export function uiValue(query: URLSearchParams, key: UiKey | string): string | null {
  const v = query.get(key)
  if (v === null) return null
  return key === 'menu' ? v.replace(/ /g, '+') : v
}

/** path + params in canonical order. Accepts a plain object or URLSearchParams; empty values are dropped. */
export function buildUrl(path: string, params?: UiInput | URLSearchParams): string {
  const entries: [string, string][] = []
  if (params instanceof URLSearchParams) {
    for (const key of new Set(params.keys())) {
      const v = uiValue(params, key)
      if (v !== null && v !== '') entries.push([key, v])
    }
  } else if (params) {
    for (const [key, value] of Object.entries(params)) {
      const v = toText(key, value)
      if (v !== null) entries.push([key, v])
    }
  }
  entries.sort(([a], [b]) => {
    const ra = RANK.get(a) ?? UI_KEYS.length, rb = RANK.get(b) ?? UI_KEYS.length
    return ra - rb || (ra === UI_KEYS.length ? a.localeCompare(b) : 0)
  })
  const query = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeValue(k, v)}`).join('&')
  return (path || '/') + (query ? '?' + query : '')
}

/** The same route in canonical form ('/new?rail=c&compose=insights' → '/new?compose=insights&rail=c'). */
export function canonicalHref(href: string): string {
  const r = parseRoute(href)
  return buildUrl(r.path, r.query)
}

/** `href` with some keys changed (null / false / '' removes a key), in canonical form. */
export function withUi(href: string, changes: UiInput): string {
  const r = parseRoute(href)
  const q = new URLSearchParams()
  for (const key of new Set(r.query.keys())) q.set(key, uiValue(r.query, key) ?? '')
  for (const [key, value] of Object.entries(changes)) {
    const v = toText(key, value)
    if (v === null) q.delete(key)
    else q.set(key, v)
  }
  return buildUrl(r.path, q)
}

export type SetUiOptions = {
  /** Add a history entry (Back undoes the change). Default: replace the current entry, so menus and hovers never pile up. */
  push?: boolean
}

/** Change UI keys on the route on screen now (not a stale render's). */
export function setUi(changes: UiInput, opts: SetUiOptions = {}) {
  navigate(withUi(currentHref(), changes), { replace: !opts.push })
}

/** [value, set] for one key. `set(null)` removes it. */
export function useUiParam(key: UiKey): readonly [string | null, (value: UiValue, opts?: SetUiOptions) => void] {
  const route = useRoute()
  const value = uiValue(route.query, key)
  const set = useCallback((v: UiValue, opts?: SetUiOptions) => setUi({ [key]: v }, opts), [key])
  return [value, set] as const
}

// ------------------------------------------------------------------------------------------- list-valued keys

/** 'no-chips,queue-2' → ['no-chips', 'queue-2']. */
export const splitSeeds = (value: string | null): string[] => (value ? value.split(',').map(s => s.trim()).filter(Boolean) : [])

/** 'share>invite>role' → ['share', 'invite', 'role'] (modal sub-views, submenu paths). */
export const splitPath = (value: string | null): string[] => (value ? value.split('>').map(s => s.trim()).filter(Boolean) : [])

/** 'type-filter+card:q3-forecast' → [['type-filter'], ['card:q3-forecast']]; 'title>add-to-project' → [['title', 'add-to-project']]. */
export const splitMenus = (value: string | null): string[][] =>
  value ? value.split(/[+ ]/).filter(Boolean).map(splitPath) : []

/** 'unpinned:plan-launch' → ['unpinned', 'plan-launch']; 'hover:commit-para' → ['hover', 'commit-para']. */
export function splitTarget(value: string): [string, string | null] {
  const i = value.indexOf(':')
  return i < 0 ? [value, null] : [value.slice(0, i), value.slice(i + 1)]
}

/** The seed list with one flag switched on or off. */
export function toggleSeed(value: string | null, flag: string, on: boolean): string[] {
  const seeds = splitSeeds(value).filter(s => s !== flag)
  return on ? [...seeds, flag] : seeds
}

export type UiState = {
  /** Every 2.1 key present on the route (menu with its '+' restored). */
  values: Partial<Record<UiKey, string>>
  get: (key: UiKey) => string | null
  seeds: readonly string[]
  hasSeed: (flag: string) => boolean
  /** The value after 'name:' for a seed like 'unpinned:plan-launch' or 'order:a.b.c', or null. */
  seedArg: (name: string) => string | null
  /** Open menus, each as its submenu path. */
  menus: string[][]
  /** The open modal and its sub-views: ['share', 'invite', 'role'], or []. */
  modal: string[]
  set: (changes: UiInput, opts?: SetUiOptions) => void
}

/** All UI keys of the route on screen, parsed. Re-renders on every route change. */
export function useUi(): UiState {
  const route = useRoute()
  return useMemo(() => {
    const values: Partial<Record<UiKey, string>> = {}
    for (const key of UI_KEYS) {
      const v = uiValue(route.query, key)
      if (v !== null) values[key] = v
    }
    const seeds = splitSeeds(values.seed ?? null)
    return {
      values,
      get: key => values[key] ?? null,
      seeds,
      hasSeed: flag => seeds.includes(flag),
      seedArg: name => {
        const hit = seeds.find(s => s.startsWith(name + ':'))
        return hit ? hit.slice(name.length + 1) : null
      },
      menus: splitMenus(values.menu ?? null),
      modal: splitPath(values.modal ?? null),
      set: setUi,
    }
  }, [route])
}
