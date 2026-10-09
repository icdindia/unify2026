// The frame <-> URL map: the handoff contract with the dev team.
// Every designed state in Figma is reachable at one prototype URL, and every rendered element carries
// data-node-id. Code Connect would do this natively, but it needs a Figma Organization/Enterprise plan.
//
// The Chat + Artifacts frames are GENERATED (frames.generated.ts) from app/figma-ref/chat-artifacts: the URL column of
// BUILD-PLAN.md section 2.2 plus each journey's journey.json. Change those, then run  python3 tools/gen-frames.py
// The Projects frames below were mapped by hand when the Projects screens were built.
import { navMode, rail } from '../app/store'
import { matchPath } from '../router/router'
import { GENERATED_FRAMES, GENERATED_JOURNEYS, GENERATED_UNROUTED } from './frames.generated'
import type { FrameMatch, FrameRef, JourneyRef, UnroutedFrame } from './types'

export type { FrameKind, FrameMatch, FrameRef, JourneyRef, UnroutedFrame } from './types'

export const FIGMA_FILE = 'lqKjNjyifEXCeywg69Knr2'

export const figmaUrl = (nodeId: string) =>
  `https://www.figma.com/design/${FIGMA_FILE}/?node-id=${nodeId.replace(/:/g, '-')}`

// The Projects frames were read by node id for prototypes/project-dashboard; their Figma page name was not recorded.
const PROJECTS_PAGE = '(not recorded)'

// All three are drawn at 1440 with the dark nav expanded (280px), so their URLs pin rail=e like every other shell frame
// (BUILD-PLAN 2.1): the stepper and Back then reproduce the expanded nav, and the collapsed rail is a closest match.
// `opt` is not a 2.1 key, so it sorts after them (router/uiParams.ts buildUrl).
const PROJECT_FRAMES: FrameRef[] = [
  { nodeId: '11657:386523', page: PROJECTS_PAGE, journey: 'projects', step: 1, label: 'Projects landing: card grid', route: '/projects?rail=e', kind: 'N' },
  {
    nodeId: '14045:584747', page: PROJECTS_PAGE, journey: 'projects', step: 2, label: 'Project dashboard, inside page option 1',
    route: '/projects/client-onboarding?rail=e', pattern: '/projects/:slug?rail=e', kind: 'N',
  },
  {
    nodeId: '15054:105151', page: PROJECTS_PAGE, journey: 'projects', step: 3, label: 'Project dashboard, inside page option 2',
    route: '/projects/client-onboarding?rail=e&opt=2', pattern: '/projects/:slug?rail=e&opt=2', kind: 'S',
  },
]

/** Journeys in Figma order: the Projects screens first, then the Chat + Artifacts page row by row. */
export const JOURNEYS: JourneyRef[] = [
  { id: 'projects', title: 'Projects (shell)', card: null, captured: true },
  ...GENERATED_JOURNEYS,
]

/** Every frame with a prototype URL (about 200; aliases included, so one URL can be several frames). */
export const FRAMES: FrameRef[] = [...PROJECT_FRAMES, ...GENERATED_FRAMES]

/** Captured frames with no URL (section cards, a designer changelog, steps not assigned a URL yet). */
export const UNROUTED: UnroutedFrame[] = GENERATED_UNROUTED

export const journeyById = (id: string): JourneyRef | undefined => JOURNEYS.find(j => j.id === id)

/** "chat-artifact 08a": how a step is named in specs, the plan and the review bar. */
export const stepName = (f: Pick<FrameRef, 'journey' | 'step' | 'stepId'>) =>
  `${f.journey} ${f.stepId ?? String(f.step).padStart(2, '0')}`

// ---------------------------------------------------------------------------------------------- the stepper list

/** One stop of the review stepper: a routed frame, or an unrouted one shown (disabled) for completeness. */
export type StepEntry = {
  key: string // `${journey}/${step}`
  journey: string
  step: number
  stepId: string
  label: string
  frame?: FrameRef
  unrouted?: UnroutedFrame
}

/** Every step of every journey in Figma order (journey order, then step order within the journey). */
export const STEPS: StepEntry[] = (() => {
  const rank = new Map(JOURNEYS.map((j, i) => [j.id, i]))
  const entries: StepEntry[] = [
    ...FRAMES.map(f => ({ key: `${f.journey}/${f.step}`, journey: f.journey, step: f.step, stepId: f.stepId ?? String(f.step).padStart(2, '0'), label: f.label, frame: f })),
    ...UNROUTED.map(u => ({ key: `${u.journey}/${u.step}`, journey: u.journey, step: u.step, stepId: u.stepId ?? String(u.step).padStart(2, '0'), label: u.label, unrouted: u })),
  ]
  return entries.sort((a, b) => (rank.get(a.journey) ?? 1e9) - (rank.get(b.journey) ?? 1e9) || a.step - b.step)
})()

// ----------------------------------------------------------------------------------------------- route matching

/** Shell state a URL inherits when it does not pin it in the hash. Defaults to the live stores. */
export type MatchContext = { rail?: 'collapsed' | 'expanded'; nav?: 'dark' | 'light' }

// Never part of a frame's identity: prototype switches (?fixes, ?mode, the Projects review ?state) and the drawing
// width (vw, recorded on the frame as `viewport`).
const DROP_ALWAYS = new Set(['state', 'mode', 'fixes', 'vw'])
// Dropped for the "closest frame" pass: pinned hovers and the shell state.
const NEAR_DROP = ['hover', 'rail', 'nav'] as const

type Norm = { path: string; query: Map<string, string> }

/** path + query with list values sorted (seed, menu), rail as c / e, nav only when light, and opt=1 dropped. */
function normalise(href: string): Norm {
  const [path, raw = ''] = href.split('?')
  const query = new Map<string, string>()
  for (const [key, value] of new URLSearchParams(raw)) {
    if (DROP_ALWAYS.has(key)) continue
    let v = value
    if (key === 'seed') v = v.split(',').map(s => s.trim()).filter(Boolean).sort().join(',')
    else if (key === 'menu') v = v.split(/[+ ]/).filter(Boolean).sort().join('+')
    else if (key === 'rail') v = v === 'collapsed' || v === 'c' ? 'c' : v === 'expanded' || v === 'e' ? 'e' : v
    else if (key === 'nav') { if (v !== 'light') continue }
    else if (key === 'opt' && v === '1') continue
    query.set(key, v)
  }
  return { path: path || '/', query }
}

/** The router's own matcher: a ':param' segment must be non-empty and decodable ('/projects/100%' matches no frame). */
const pathMatches = (pattern: string, path: string): boolean => matchPath(pattern, path) !== null

/** Same state? A frame with no rail key (drawn before rail was pinned in URLs) accepts either rail. */
function sameQuery(frame: Map<string, string>, url: Map<string, string>, near: boolean): boolean {
  const a = new Map(frame)
  const b = new Map(url)
  if (!a.has('rail')) b.delete('rail')
  if (near) NEAR_DROP.forEach(k => { a.delete(k); b.delete(k) })
  if (a.size !== b.size) return false
  for (const [k, v] of a) if (b.get(k) !== v) return false
  return true
}

/**
 * How well a closest frame agrees with what is on screen, over the keys the closest pass ignores. The nav colour counts
 * most (it repaints the whole nav), then the rail (280 or 56 px), then a pinned hover; a frame with no rail key agrees
 * with either rail. Equal scores keep Figma order.
 */
const NEAR_WEIGHT: Record<(typeof NEAR_DROP)[number], number> = { nav: 4, rail: 2, hover: 1 }
function agreement(frame: Map<string, string>, url: Map<string, string>): number {
  let score = 0
  for (const key of NEAR_DROP) {
    const agrees = key === 'rail' && !frame.has('rail') ? true : frame.get(key) === url.get(key)
    if (agrees) score += NEAR_WEIGHT[key]
  }
  return score
}

let normCache: { frame: FrameRef; route: Norm; pattern?: Norm }[] | null = null
const frameNorms = () =>
  (normCache ??= FRAMES.map(frame => ({ frame, route: normalise(frame.route), pattern: frame.pattern ? normalise(frame.pattern) : undefined })))

/**
 * Every frame a prototype URL reproduces, in Figma order. Path and query are compared with the query sorted (and the
 * seed / menu lists sorted), so key order never matters. The hash's rail / nav win; when absent, the live stores (or
 * `ctx`) fill them in. Exact matches come back when there are any; otherwise the closest frames (same state but a
 * different pinned hover, rail, nav or viewport) with exact=false, the ones that agree most with the visible nav, rail
 * and hover first (see agreement); otherwise [].
 */
export function framesForRoute(href: string, ctx: MatchContext = {}): FrameMatch[] {
  const url = normalise(href)
  const railNow = ctx.rail ?? rail.get()
  const navNow = ctx.nav ?? navMode.get()
  if (!url.query.has('rail')) url.query.set('rail', railNow === 'collapsed' ? 'c' : 'e')
  if (!new URLSearchParams(href.split('?')[1] ?? '').has('nav') && navNow === 'light') url.query.set('nav', 'light')

  const exact: FrameRef[] = []
  const near: { frame: FrameRef; score: number }[] = []
  for (const { frame, route, pattern } of frameNorms()) {
    const candidates = [route, pattern].filter((n): n is Norm => !!n)
    const onPath = candidates.filter(n => (n === route ? n.path === url.path : pathMatches(n.path, url.path)))
    if (onPath.some(n => sameQuery(n.query, url.query, false))) exact.push(frame)
    else {
      const close = onPath.filter(n => sameQuery(n.query, url.query, true))
      if (close.length) near.push({ frame, score: Math.max(...close.map(n => agreement(n.query, url.query))) })
    }
  }
  if (exact.length) return exact.map(frame => ({ frame, exact: true }))
  return near.sort((a, b) => b.score - a.score).map(({ frame }) => ({ frame, exact: false })) // Array.sort is stable
}

/** The first frame a prototype URL reproduces (exact, else closest). */
export function frameForRoute(href: string, ctx?: MatchContext): FrameRef | undefined {
  return framesForRoute(href, ctx)[0]?.frame
}

export const frameByNode = (nodeId: string): FrameRef | undefined => FRAMES.find(f => f.nodeId === nodeId)
