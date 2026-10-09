import { createStore, navMode } from '../app/store'
import { STEPS, type FrameMatch, type StepEntry } from '../figma/frames'
import { navigate } from '../router/router'

// The review stepper walks every journey's steps in Figma order (figma/frames.ts STEPS). Several steps can share one
// URL (aliases, c08 + c08a), and a reviewer can click away from any frame, so the step on screen is remembered here:
// stepping from chat-artifact 08 to 08a (the same URL) still moves the cursor, and prev / next after a detour continue
// from the last step visited.
export const lastStep = createStore<string | null>(null)

const byKey = new Map(STEPS.map(s => [s.key, s]))
const keyOf = (m: FrameMatch) => `${m.frame.journey}/${m.frame.step}`

/** The step to show for the route's matches: the remembered one when it is among them, else one in the same journey, else the first. */
export function cursorFor(matches: FrameMatch[], remembered: string | null): StepEntry | undefined {
  if (remembered && matches.some(m => keyOf(m) === remembered)) return byKey.get(remembered)
  const journey = remembered?.split('/')[0]
  const pick = matches.find(m => m.frame.journey === journey) ?? matches[0]
  if (pick) return byKey.get(keyOf(pick))
  return remembered ? byKey.get(remembered) : undefined
}

/** The next (dir 1) or previous (dir -1) step that has a URL (and passes `reachable`), across journey boundaries. */
export function neighbour(entry: StepEntry | undefined, dir: 1 | -1, reachable: (s: StepEntry) => boolean = () => true): StepEntry | undefined {
  const from = entry ? STEPS.indexOf(entry) : dir === 1 ? -1 : STEPS.length
  for (let i = from + dir; i >= 0 && i < STEPS.length; i += dir) if (STEPS[i].frame && reachable(STEPS[i])) return STEPS[i]
  return undefined
}

export const stepByKey = (key: string) => byKey.get(key)

/**
 * Show a step: its URL (a new history entry, so Back returns to the previous step), with the nav mode it is drawn in.
 * The hash pins rail and nav=light (router.ts applies them); a frame with no nav key is drawn dark.
 */
export function goToStep(entry: StepEntry) {
  if (!entry.frame) return
  lastStep.set(entry.key)
  // navigate first: changing the store while the old URL pins nav= would rewrite the entry Back returns to
  navigate(entry.frame.route)
  const nav = new URLSearchParams(entry.frame.route.split('?')[1] ?? '').get('nav')
  navMode.set(nav === 'light' ? 'light' : 'dark')
}
