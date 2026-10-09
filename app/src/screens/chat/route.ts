import { isArtifactId, type ArtifactId } from '../../fixtures/artifacts'
import { COMMIT_SCRIPT } from '../../fixtures/scripts/commit'
import { beatIndex, stateAt } from '../../playback/engine'
import type { ShareModalView } from '../../components/share-modal'
import { FRAMES } from '../../figma/frames'
import { matchPath, type Route } from '../../router/router'
import { splitPath, uiValue } from '../../router/uiParams'
import type { TextPreset } from '../landing/route'

// What the chat screens (/chat/commit and the split /chat/commit/:artifact) draw of their URL. A key counts as drawn only
// when its value is one the screen draws; the others are reported as ignored and the screen renders as if they were
// absent, so the shell is tagged with the frame that is really on screen and build coverage counts only fully drawn
// frames (routes.tsx). Other chats (business-units, cost, new-artifact, new-routine) are not built yet.

export const CHAT = 'commit'
export const SCRIPT = COMMIT_SCRIPT

/** The beat a chat URL without at= shows: the end of the chat-artifact journey (the Pipeline Command answer). */
export const DEFAULT_BEAT = 'artifact'

/** Composer presets the chat composer holds (chat-artifact 10-12). */
export const CHAT_PRESETS = ['at', 'at-m', 'mention-matt'] as const satisfies readonly TextPreset[]
export type ChatPreset = (typeof CHAT_PRESETS)[number]

export type HeaderHover = 'title' | 'cost' | 'share' | 'files' | 'comments' | 'people'
const HEADER_HOVERS: readonly HeaderHover[] = ['title', 'cost', 'share', 'files', 'comments', 'people']
const COMPOSER_HOVERS = ['send', 'stop', 'chip:research', 'chip:company'] as const

export type ChatRouteState = {
  /** The split: the artifact open beside the chat (/chat/commit/:artifact). */
  artifact: ArtifactId | null
  /** The beat id (or alias) the URL names, when the script has it; null: none given. */
  at: string | null
  cot: 'lines' | 'sources' | null
  glyph: 'bare' | null
  compose: ChatPreset | null
  panel: 'files' | 'files-grid' | null
  /** menu=title, title>add-to-project (chat-artifact 03), version (21). */
  menu: { title: boolean; submenu: boolean; version: boolean }
  pop: 'access' | null
  modal: ShareModalView | null
  hover: string | null
  edit: boolean
  full: boolean
  cw: number | null
  ignored: string[]
}

const SHELL = new Set(['rail', 'nav', 'vw', 'mode', 'fixes'])
const SHARE_VIEWS: Record<string, ShareModalView> = { share: 'main', 'share>search': 'search', 'share>access': 'access', 'share>invite': 'invite' }

/** Does the beat need a part this screen does not draw yet? (the question card of chat-questions) */
function beatDrawn(at: string): boolean {
  const i = beatIndex(SCRIPT, at)
  return i >= 0 && !stateAt(SCRIPT, i).question
}

/** The route of a chat screen this module draws: /chat/commit or /chat/commit/<artifact>. null for any other path. */
export function chatPathOf(path: string): { artifact: ArtifactId | null } | null {
  const m = matchPath('/chat/:chat', path)
  if (m) return m.chat === CHAT ? { artifact: null } : null
  const s = matchPath('/chat/:chat/:artifact', path)
  if (s && s.chat === CHAT && isArtifactId(s.artifact)) return { artifact: s.artifact }
  return null
}

export function chatRouteState(route: Route, artifact: ArtifactId | null): ChatRouteState {
  const q = route.query
  const get = (k: string) => uiValue(q, k)
  const split = artifact !== null
  const ignored = new Set<string>()
  const keep = <T>(key: string, ok: boolean, value: T): T | null => {
    if (get(key) === null) return null
    if (!ok) { ignored.add(key); return null }
    return value
  }

  // an at= whose beat needs a part not built yet (the question card) is still shown, but reported as not drawn
  const atRaw = get('at')
  const at = keep('at', atRaw !== null && beatIndex(SCRIPT, atRaw) >= 0, atRaw)
  if (at && !beatDrawn(at)) ignored.add('at')
  const cotRaw = get('cot')
  const cot = keep('cot', cotRaw === 'lines' || cotRaw === 'sources', cotRaw as 'lines' | 'sources')
  const glyph = keep('glyph', get('glyph') === 'bare', 'bare' as const)
  const composeRaw = get('compose')
  const compose = keep('compose', !!composeRaw && (CHAT_PRESETS as readonly string[]).includes(composeRaw), composeRaw as ChatPreset)
  const panelRaw = get('panel')
  const panel = keep('panel', panelRaw === 'files' || panelRaw === 'files-grid', panelRaw as 'files' | 'files-grid')

  const menuRaw = get('menu')
  const menuPath = splitPath(menuRaw)
  const titleMenu = menuRaw === 'title' || menuRaw === 'title>add-to-project'
  const menuOk = titleMenu || (split && menuRaw === 'version')
  keep('menu', menuOk, true)
  const menu = { title: menuOk && titleMenu, submenu: menuOk && menuPath[1] === 'add-to-project', version: menuOk && menuRaw === 'version' }

  // the access popover hangs from the header's avatar stack, which the split column does not draw (as designed)
  const pop = keep('pop', get('pop') === 'access' && !split, 'access' as const)
  const modalRaw = get('modal')
  const modal = keep('modal', !!modalRaw && Object.hasOwn(SHARE_VIEWS, modalRaw), modalRaw ? SHARE_VIEWS[modalRaw] : null)
  const edit = keep('edit', split && get('edit') === 'name', true) ?? false
  const full = keep('full', split && get('full') === '1', true) ?? false
  const cwRaw = get('cw')
  const cw = keep('cw', split && !!cwRaw && /^\d{3}$/.test(cwRaw), Number(cwRaw))

  const hoverRaw = get('hover')
  const hoverOk = !!hoverRaw && (
    (HEADER_HOVERS as readonly string[]).includes(hoverRaw)
    || (COMPOSER_HOVERS as readonly string[]).includes(hoverRaw)
    || (hoverRaw === 'mention:matt' && (compose === 'at' || compose === 'at-m'))
    || hoverRaw === 'card:pipeline-command'
    || (split && hoverRaw === 'artifact-name')
  )
  const hover = keep('hover', hoverOk, hoverRaw)

  for (const key of new Set(q.keys())) {
    if (SHELL.has(key)) continue
    if (!['at', 'cot', 'glyph', 'compose', 'panel', 'menu', 'pop', 'modal', 'edit', 'full', 'cw', 'hover'].includes(key)) ignored.add(key)
  }
  return {
    artifact, at, cot, glyph, compose, panel, menu, pop, modal, hover, edit, full, cw,
    ignored: [...q.keys()].filter((k, i, all) => ignored.has(k) && all.indexOf(k) === i),
  }
}

// ------------------------------------------------------------------------------------------------ beat <-> URL

/** at= values the Figma frames of this chat use (a beat's alias wins over its id when a frame names it: cot-1). */
const FRAME_ATS = new Set(
  FRAMES.filter(f => f.route.startsWith(`/chat/${CHAT}`)).map(f => new URLSearchParams(f.route.split('?')[1] ?? '').get('at')).filter((a): a is string => !!a),
)

/** The at= value that names a beat in URLs: its id, or the alias a frame uses for it. */
export function urlAtOf(beatId: string): string {
  const beat = SCRIPT.beats.find(b => b.id === beatId)
  if (!beat || FRAME_ATS.has(beat.id)) return beatId
  return beat.aliases?.find(a => FRAME_ATS.has(a)) ?? beatId
}

/** The beat id an at= value names (an alias resolves to its beat). */
export function beatIdOf(at: string | null): string | null {
  if (!at) return null
  const i = beatIndex(SCRIPT, at)
  return i >= 0 ? SCRIPT.beats[i].id : null
}
