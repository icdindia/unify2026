import { parseRoute } from '../router/router'
import { NAV_PAGES, type NavKey, type NavPages } from '../shell/nav'
import { HOME, screenFor, type Screen } from './routes'

// What a visitor can reach while unbuilt screens are hidden (app/store.ts `unbuilt`, user decision 2026-10-09).
// Called at render time only: the route table imports the gallery, which imports pages that import the review bar.

const cache = new Map<string, boolean>()

/** True when a prototype URL opens a built screen or a gallery page (not the "Not built yet" placeholder or a redirect). */
export function isBuiltHref(href: string): boolean {
  let hit = cache.get(href)
  if (hit === undefined) {
    const kind = screenFor(parseRoute(href)).kind
    hit = kind === 'screen' || kind === 'gallery'
    cache.set(href, hit)
  }
  return hit
}

/** The nav destinations whose page is built (New Session and Projects today). */
export function builtNavPages(): NavPages {
  return Object.fromEntries((Object.entries(NAV_PAGES) as [NavKey, string][]).filter(([, path]) => isBuiltHref(path)))
}

/** With unbuilt screens hidden, a placeholder becomes a redirect: gallery sheets to the gallery, everything else home. */
export function hideUnbuilt(screen: Screen, path: string): Screen {
  if (screen.kind !== 'placeholder') return screen
  return { kind: 'redirect', redirect: path.startsWith('/gallery') ? '/gallery' : HOME }
}
