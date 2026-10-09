import { ignoredKeysOf, screenFor, type ScreenKind } from '../app/routes'
import { FRAMES, JOURNEYS, type FrameRef } from '../figma/frames'
import { DUPLICATE_FIX_IDS, FIXES, fixById } from '../fixes/fixes'
import * as fixtures from '../fixtures'
import { isComposePresetId } from '../fixtures/compose'
import { isDrift } from '../fixtures/drift'
import { beatIndex, scriptProblems } from '../playback/engine'
import { matchPath, parseRoute } from '../router/router'
import { UI_KEYS } from '../router/uiParams'

// Cross-module contracts, checked live (the build-coverage gallery page shows them; tools/tests/eb-app reads that page):
//   every FRAMES URL resolves to a screen, a gallery page or the "Not built yet" placeholder (never the Projects
//   redirect), and names only chats, beats, artifacts, compose presets, seeds and URL keys the fixtures and the router
//   know; every fix id the fixtures name is in the FIXES ledger, once.
// Nothing here runs at module load: the route table imports the gallery, which imports the page that imports this.

/**
 * How a URL resolves for the coverage count: a built screen that leaves some of the URL's state undrawn (the frame's menu,
 * pinned hover or seed) is 'partial', not 'screen', so a frame is counted built only when its screen draws all of it.
 */
export type AuditKind = ScreenKind | 'partial'

export type RouteAudit = {
  href: string
  kind: AuditKind
  /** 'partial' only: the URL keys the built screen does not draw yet. */
  ignored: string[]
  problems: string[]
}

/** Query keys the Projects screens read (review states and the inside-page option), outside the 2.1 table. */
const PROJECT_KEYS = new Set(['state', 'opt'])
const KNOWN_KEYS = new Set<string>([...UI_KEYS, ...PROJECT_KEYS])

/** How one prototype URL resolves, and what in it the fixtures or the router do not know. */
export function auditRoute(href: string): RouteAudit {
  const route = parseRoute(href)
  const screen = screenFor(route)
  const ignored = ignoredKeysOf(screen)
  const kind: AuditKind = screen.kind === 'screen' && ignored.length ? 'partial' : screen.kind
  const problems: string[] = []
  if (kind === 'redirect') problems.push('redirects (no screen and no placeholder)')

  for (const key of new Set(route.query.keys())) if (!KNOWN_KEYS.has(key)) problems.push(`unknown URL key "${key}"`)

  const chat = matchPath('/chat/:chat', route.path) ?? matchPath('/chat/:chat/:artifact', route.path)
  const artifact = matchPath('/chat/:chat/:artifact', route.path) ?? matchPath('/artifacts/:artifact', route.path) ?? matchPath('/view/:artifact', route.path)
  if (chat) {
    if (!fixtures.isChatId(chat.chat)) problems.push(`unknown chat "${chat.chat}"`)
    else {
      const at = route.query.get('at')
      if (at && beatIndex(fixtures.SCRIPTS[chat.chat], at) < 0) problems.push(`chat "${chat.chat}" has no beat at=${at}`)
    }
  }
  if (artifact && !fixtures.isArtifactId(artifact.artifact)) problems.push(`unknown artifact "${artifact.artifact}"`)

  const compose = route.query.get('compose')
  if (compose && !isComposePresetId(compose)) problems.push(`unknown compose preset "${compose}"`)
  const seeds = fixtures.parseSeeds(route.query.get('seed'))
  for (const s of seeds.unknown) problems.push(`unknown seed "${s}"`)
  return { href, kind, ignored, problems }
}

export type FrameAudit = RouteAudit & { frame: FrameRef }

/** Every routed frame, audited. */
export const auditFrames = (): FrameAudit[] => FRAMES.map(frame => ({ frame, ...auditRoute(frame.route) }))

/** Every fix id the fixture data names in a Drift (walks the data and the per-surface helpers). */
export function fixIdsInFixtures(): string[] {
  const ids = new Set<string>()
  const seen = new Set<unknown>()
  const walk = (v: unknown) => {
    if (!v || typeof v !== 'object' || seen.has(v)) return
    seen.add(v)
    if (isDrift(v)) { ids.add(v.fix); walk(v.designed); walk(v.fixed); return }
    for (const x of Array.isArray(v) ? v : Object.values(v)) walk(x)
  }
  walk(fixtures)
  for (const p of Object.keys(fixtures.PEOPLE)) {
    for (const s of ['header', 'mention', 'mention-filtered', 'access', 'typing', 'share'] as const) walk(fixtures.avatarOn(p as fixtures.PersonId, s))
  }
  for (const s of ['share', 'publish', 'comments', 'comments-standalone', 'commenters-menu', 'nav', 'clone'] as const) walk(fixtures.selfOn(s))
  walk(fixtures.typingLine(['matt-rivera'])); walk(fixtures.typingLine(['matt-rivera'], 12))
  walk(fixtures.roleOptions('chat')); walk(fixtures.roleOptions('artifact'))
  walk(fixtures.shareFor(fixtures.scenarioOf('access-link'), 'chat'))
  for (const b of ['within', 'approaching', 'over'] as const) walk(fixtures.chatCost('cost', 'cot-3', { budget: b, queries10: false, monthlyOut: false }))
  walk(fixtures.queueFor(fixtures.scenarioOf('queue-2,queue-collapsed')))
  walk(fixtures.commentersMenu())
  return [...ids].sort()
}

export type FixAudit = { ledger: number; used: string[]; unknown: string[]; duplicates: string[] }

/** The FIXES ledger against the fixture data: ids named but not registered, ids registered twice. */
export function auditFixes(): FixAudit {
  const used = fixIdsInFixtures()
  return { ledger: FIXES.length, used, unknown: used.filter(id => !fixById(id)), duplicates: [...DUPLICATE_FIX_IDS] }
}

/** scriptProblems() for every chat script (unique at= ids, no stall, no beat held 0 ms), as "<chat>: <problem>". */
export const auditScripts = (): string[] =>
  fixtures.CHAT_IDS.flatMap(id => scriptProblems(fixtures.SCRIPTS[id]).map(p => `${id}: ${p}`))

export type JourneyCoverage = {
  id: string; title: string; frames: number; screen: number; partial: number; placeholder: number; gallery: number; problems: number
}

/** Per journey: how many of its frames are built screens, built screens without some of the frame's state, gallery pages or placeholders. */
export function journeyCoverage(audits: FrameAudit[]): JourneyCoverage[] {
  return JOURNEYS.map(j => {
    const mine = audits.filter(a => a.frame.journey === j.id)
    return {
      id: j.id, title: j.title, frames: mine.length,
      screen: mine.filter(a => a.kind === 'screen').length,
      partial: mine.filter(a => a.kind === 'partial').length,
      placeholder: mine.filter(a => a.kind === 'placeholder').length,
      gallery: mine.filter(a => a.kind === 'gallery').length,
      problems: mine.reduce((n, a) => n + a.problems.length, 0),
    }
  })
}
