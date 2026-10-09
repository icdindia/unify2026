import { useSyncExternalStore } from 'react'
import { fixesMode, navMode, rail } from '../app/store'
import { currentHref } from '../router/router'
import { withUi } from '../router/uiParams'

// Viewport presets of the review bar. 1440 is the only design baseline; the others check that layouts stay fluid down to
// 390. A preset opens the current screen in a popup window of that width (one window per width, reused), so CSS media
// queries and the shell's breakpoints see a real viewport, which scaling an iframe would not give.
//
// Where pop-ups are blocked (a sandboxed preview pane, a browser setting), the bar says so and shows the URL to open:
// resize any window to the width instead (Chrome DevTools device toolbar: Cmd+Shift+M, then type the width).
export const VIEWPORT_PRESETS = [1440, 1280, 1024, 787, 390] as const

/** Popup height for a width: the 900 of the Figma frames, a phone's 844 at 390. */
const heightFor = (width: number) => (width <= 480 ? 844 : 900)

/**
 * The URL that reproduces the screen on view in a fresh window: the current route with the live rail and nav pinned in
 * the hash, and ?fixes=on before the # when fixes are shown (the page reads it at start-up, see app/store.ts).
 */
export function shareableUrl(href = currentHref()): string | null {
  if (!/^(https?|file):$/.test(location.protocol)) return null // about:srcdoc, blob:, data: cannot be reopened
  const pinned = withUi(href, { rail: rail.get() === 'collapsed' ? 'c' : 'e', nav: navMode.get() === 'light' ? 'light' : null })
  const page = new URL(location.href)
  page.hash = ''
  if (fixesMode.get() === 'on') page.searchParams.set('fixes', 'on')
  else page.searchParams.delete('fixes')
  page.searchParams.delete('mode') // nav mode travels in the hash now
  page.searchParams.delete('rail')
  return page.toString().replace(/#$/, '') + '#' + pinned
}

export type OpenResult = { status: 'opened' } | { status: 'blocked' | 'unsupported'; url: string | null }

/** Open the current screen at `width` px in a popup window. */
export function openAtWidth(width: number): OpenResult {
  const url = shareableUrl()
  if (!url) return { status: 'unsupported', url: null }
  const win = window.open(url, `eb-viewport-${width}`, `popup=yes,width=${width},height=${heightFor(width)}`)
  if (!win) return { status: 'blocked', url }
  try { win.focus() } catch { /* focus is a courtesy */ }
  return { status: 'opened' }
}

const subscribeResize = (cb: () => void) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

/** window.innerWidth, live. */
export function useWindowWidth(): number {
  return useSyncExternalStore(subscribeResize, () => window.innerWidth)
}
