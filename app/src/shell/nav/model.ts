// Shared types and constants for the main navigation (expanded Nav + collapsed Rail).
// Source: Enterprise Brain Base 2026 - 1 (lqKjNjyifEXCeywg69Knr2), nav modes frame 14992:112150,
// ported from prototypes/project-dashboard (the verified 1:1 HTML rebuild).

export type NavMode = 'dark' | 'light'

/** The selectable destinations: the five primary rows of the expanded nav and their rail icons. */
export type NavKey = 'new' | 'projects' | 'routines' | 'meetings' | 'artifacts'

/** Destination key -> route path, for the destinations that have a designed page. */
export type NavPages = Partial<Record<NavKey, string>>

/**
 * Destinations with a route. Projects is built; New Session, Routines and Artifacts open their planned screens (BUILD-PLAN
 * 2.1), which show the "Not built yet" frame record until their wave lands. Rows missing from this map (Meetings) select
 * but never navigate.
 */
export const NAV_PAGES: NavPages = { new: '/new', projects: '/projects', routines: '/routines', artifacts: '/artifacts' }

/** The destination a route belongs to (longest matching page path), e.g. '/projects/42' -> 'projects'. */
export function navKeyForPath(path: string, pages: NavPages = NAV_PAGES): NavKey | undefined {
  let best: NavKey | undefined
  let bestLen = -1
  for (const [key, page] of Object.entries(pages) as [NavKey, string][]) {
    const hit = path === page || path.startsWith(page.endsWith('/') ? page : page + '/')
    if (hit && page.length > bestLen) { best = key; bestLen = page.length }
  }
  return best
}

/** Selection and routing callbacks shared by Nav and Rail. Both components are presentational:
 *  the caller owns `selected` and decides what selecting / navigating does. */
export type NavSelectionProps = {
  /** The highlighted destination. The designed rest state is 'projects'. */
  selected?: NavKey | null
  /** The destination of the page on screen, announced as aria-current="page". Kept apart from `selected` because a
   *  row with no page yet (Routines, Meetings …) can be highlighted while the page stays put. Defaults to `selected`. */
  current?: NavKey | null
  /** Any destination row was pressed (with or without a designed page). */
  onSelect?: (key: NavKey) => void
  /** A destination with a designed page was pressed; receives its path from `pages`. */
  onNavigate?: (path: string) => void
  /** Which destinations have pages. Defaults to NAV_PAGES. */
  pages?: NavPages
  /** Unbuilt screens are hidden: a destination row without a page is inert (aria-disabled) instead of selectable. */
  hideUnbuilt?: boolean
}

/** Sidebar chat status, drawn as the animated dot at the end of a chat row. */
export type ChatStatus = 'progress' | 'waiting' | 'failed' | 'unread'

export const STATUS_LABEL: Record<ChatStatus, string> = {
  progress: 'In progress',
  waiting: 'Waiting for your input',
  failed: 'Failed',
  unread: 'Unread',
}

/** Figma node ids carried as data-node-id (the same ids the HTML prototype carries). */
export const NODE = {
  navDark: '226:81200',
  navLight: '9721:594967',
  railDark: '226:81199',
  railLight: '9721:595036',
  navDarkFooter: 'I14045:584747;292:88513',
} as const
