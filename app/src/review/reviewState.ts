import type { Route } from '../router/router'

// Review-only states, as in prototypes/project-dashboard (?state=…), so the app and the HTML oracle can be diffed
// state for state. They live in the hash query: #/projects/client-onboarding?state=frame
//   frame   — dashboard with the hover states drawn in the Figma frame pinned on
//   landing — Projects landing with card 2 hovered and its ⋯ menu open (first item hovered)
//   menus   — dashboard with the row ⋮ menu, its "Move to project" submenu and the header ⋮ menu all open
// Nav mode and rail come from the page URL instead (?mode=light&rail=collapsed before the #), see app/store.ts.
export type ReviewState = 'frame' | 'landing' | 'menus'

const STATES: readonly ReviewState[] = ['frame', 'landing', 'menus']

export function reviewStateOf(route: Route): ReviewState | null {
  const s = route.query.get('state') as ReviewState | null
  return s && STATES.includes(s) ? s : null
}

/** Inside page option: 1 (14045:584747) unless the hash query says ?opt=2 (15054:105151). */
export type PageOption = 1 | 2

export function pageOptionOf(route: Route): PageOption {
  return route.query.get('opt') === '2' ? 2 : 1
}

/**
 * Run `fn` once the web fonts have loaded, so a pinned review state measures the layout a real click would see
 * (before Geist arrives, fallback text widths shift the header buttons by ~0.4px). Returns a cancel for effect cleanup.
 */
export function whenFontsReady(fn: () => void): () => void {
  let live = true
  void document.documentElement.offsetHeight // lay the page out first, so its font loads have started and `ready` waits for them
  ;(document.fonts?.ready ?? Promise.resolve()).then(() => { if (live) fn() })
  return () => { live = false }
}
