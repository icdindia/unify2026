import { COMPOSE_PRESETS, type ComposePresetId } from '../../fixtures/compose'
import { resolveDrift } from '../../fixtures/drift'
import type { Inline } from '../../fixtures/script'
import type { ComposerHover } from '../../components/composer'
import type { Route } from '../../router/router'
import { splitSeeds, uiValue } from '../../router/uiParams'

// What the landing screen (/new) draws of its URL, and the compose= presets it can load. Anything else on a /new frame
// URL (menu=account, drag=, the input-large skill and enhance presets) is not drawn yet: those keys are reported as
// ignored, so the review bar calls the frame a closest match and build coverage does not count it.

/** Compose presets that are plain text (and "@" mentions), the ones a composer can simply hold as its value. */
export const TEXT_PRESETS = ['commit-q', 'bu-q', 'insights', 'at', 'at-m', 'mention-matt'] as const satisfies readonly ComposePresetId[]
export type TextPreset = (typeof TEXT_PRESETS)[number]

/** The landing composer's presets (chat-artifact 02, graphs 02, enhance-prompt 02 / 03). */
export const LANDING_PRESETS = ['commit-q', 'bu-q', 'insights'] as const satisfies readonly TextPreset[]
export type LandingPreset = (typeof LANDING_PRESETS)[number]

const runText = (runs: Inline[]) =>
  (resolveDrift(runs, () => false) as (string | { b: string } | { mention: string; label: string } | { cite: { label: string } })[])
    .map(r => (typeof r === 'string' ? r : 'b' in r ? r.b : 'mention' in r ? `@${r.label}` : ''))
    .join('')

/** The composer text of a preset ("@Matt Rivera you own most of those six — which"). */
export const presetText = (id: TextPreset): string => runText(COMPOSE_PRESETS[id].text)

/** The preset whose text this is, among `among`; null for any other text (typing moves the URL to it, or drops compose=). */
export function presetOfText<T extends TextPreset>(text: string, among: readonly T[]): T | null {
  return among.find(id => presetText(id) === text) ?? null
}

/** Pinned composer hovers the landing draws. */
const LANDING_HOVERS: Record<string, ComposerHover> = { send: 'send', 'chip:research': 'chip:research', 'chip:company': 'chip:company' }

export type LandingState = { compose: LandingPreset | null; hover: ComposerHover | null; noChips: boolean; ignored: string[] }

/**
 * The landing's reading of a route: the preset, the pinned hover and seed=no-chips, plus the keys it does not draw.
 * A key counts as drawn only when its value is one the screen draws (compose=skill on /new is ignored, not half drawn).
 */
export function landingState(route: Route): LandingState {
  const q = route.query
  const ignored: string[] = []
  const compose = uiValue(q, 'compose')
  const hover = uiValue(q, 'hover')
  const seeds = splitSeeds(uiValue(q, 'seed'))
  const okCompose = compose !== null && (LANDING_PRESETS as readonly string[]).includes(compose) ? (compose as LandingPreset) : null
  const okHover = hover !== null && Object.hasOwn(LANDING_HOVERS, hover) ? LANDING_HOVERS[hover] : null
  for (const key of new Set(q.keys())) {
    if (['rail', 'nav', 'vw', 'mode', 'fixes'].includes(key)) continue
    if (key === 'compose' && okCompose) continue
    if (key === 'hover' && okHover) continue
    if (key === 'seed' && seeds.length > 0 && seeds.every(s => s === 'no-chips')) continue
    ignored.push(key)
  }
  return { compose: okCompose, hover: okHover, noChips: seeds.includes('no-chips') && !ignored.includes('seed'), ignored }
}
