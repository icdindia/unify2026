import { useLayoutEffect, type RefObject } from 'react'

// Collapsing the nav removes the button that was just pressed (and expanding removes the rail's logo
// button). To keep keyboard users in the nav, the pressed button asks for focus to land on its
// counterpart: Nav's "Collapse navigation" <-> Rail's "Expand navigation". The request is picked up
// by whichever component commits next with the requested role, however the caller swaps them
// (conditional render, or both mounted and toggled with CSS).
//
// The layout can also swap them on its own (the window crossing a breakpoint, an overlay closing after a
// destination was chosen). Nav and Rail therefore watch their own unmount: if one leaves while it holds focus,
// focus goes to whichever toggle commits in the same update, instead of dropping to <body>.

type Toggle = 'nav-collapse' | 'rail-expand'

let request: { target: Toggle | 'either'; at: number; from?: Element } | null = null

const isFresh = () => !!request && performance.now() - request.at < 1000

/** Call from the toggle's click handler, before the caller's onCollapse / onExpand. */
export function requestFocus(target: Toggle) {
  request = { target, at: performance.now() }
}

/** Focus `ref` when a request for `target` is pending. Stale requests (no swap within 1s) are dropped. */
export function useFocusRequest(target: Toggle, ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!request || (request.target !== target && request.target !== 'either')) return
    const fresh = isFresh()
    request = null
    if (fresh) ref.current?.focus()
  })
}

/**
 * Hand focus on when `root` unmounts while focus is inside it. React runs this cleanup before it removes the
 * DOM, so the check still sees the focused element; the replacement's useFocusRequest runs later in the same
 * commit and takes the request. An explicit requestFocus() made by the press that caused the swap wins.
 */
export function useFocusHandoffOnUnmount(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current
    if (el && request?.from === el) request = null // StrictMode re-ran the effect: that "unmount" was simulated
    return () => {
      if (!el || !el.contains(document.activeElement) || isFresh()) return
      request = { target: 'either', at: performance.now(), from: el }
    }
  }, [root])
}
