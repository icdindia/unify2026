import { createStore, useStore } from '../../app/store'

// Shared plumbing for the overlay primitives.
//
// Layer: one element at the end of <body> holds every modal, tooltip and toast, so they paint above the app and stay
// outside the background that a modal makes inert. Stacking inside it (all position: fixed): modals 1000 + depth,
// toasts 1100, tooltips 1200 (see overlays.css).
//
// Modal stack: the open modals, innermost last. Only the top one traps focus and answers Escape; everything else on
// the page (the app root, and any modal under the top one) is made inert, so it can be neither clicked, focused nor
// read by a screen reader. The toast region and the tooltip layer stay live, so an Undo stays reachable.

const LAYER_ID = 'eb-overlays'

/** The overlay layer (created on first use). */
export function overlayLayer(): HTMLElement {
  let el = document.getElementById(LAYER_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = LAYER_ID
    el.className = 'ov-layer'
    document.body.appendChild(el)
  }
  return el
}

const modalStack = createStore<readonly string[]>([])

/** Ids of the open modals, innermost last. */
export function useModalStack(): readonly string[] {
  return useStore(modalStack)
}

/** True while at least one modal is open (popovers and tooltips outside it are then inert or hidden). */
export function anyModalOpen(): boolean {
  return modalStack.get().length > 0
}

export function topModalId(): string | undefined {
  const s = modalStack.get()
  return s[s.length - 1]
}

// Elements this module made inert, so closing the last modal restores exactly those and nothing an app set itself.
const madeInert = new Set<HTMLElement>()

function applyInert() {
  const stack = modalStack.get()
  const top = stack[stack.length - 1]
  const layer = document.getElementById(LAYER_ID)
  const shouldBeInert = new Set<HTMLElement>()
  if (top) {
    for (const child of Array.from(document.body.children)) {
      if (child instanceof HTMLElement && child !== layer && !child.inert) shouldBeInert.add(child)
      else if (child instanceof HTMLElement && madeInert.has(child)) shouldBeInert.add(child)
    }
    // modal roots under the top one
    layer?.querySelectorAll<HTMLElement>(':scope > [data-modal-id]').forEach(root => {
      if (root.dataset.modalId !== top) shouldBeInert.add(root)
    })
  }
  for (const el of madeInert) {
    if (!shouldBeInert.has(el)) { el.inert = false; madeInert.delete(el) }
  }
  for (const el of shouldBeInert) {
    if (!el.inert) { el.inert = true; madeInert.add(el) }
  }
}

export function pushModal(id: string) {
  modalStack.set([...modalStack.get().filter(m => m !== id), id])
  applyInert()
}

export function popModal(id: string) {
  modalStack.set(modalStack.get().filter(m => m !== id))
  applyInert()
}

let seq = 0
/** A document-unique id for overlay ARIA wiring (useId would also do; this one works outside React too). */
export function overlayId(prefix: string): string {
  seq += 1
  return `${prefix}-${seq}`
}

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
  'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]', 'summary',
].join(',')

/** Keyboard-focusable descendants of `root`, in DOM order, skipping hidden and inert ones. */
export function focusables(root: Element | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => {
    if (el.closest('[inert]')) return false
    if (el.getAttribute('aria-hidden') === 'true') return false
    return el.getClientRects().length > 0 // display:none / detached elements have no boxes
  })
}

/** The element to focus first in `root`: [data-autofocus] if present, else its first focusable. */
export function firstFocusable(root: Element | null): HTMLElement | null {
  if (!root) return null
  const marked = root.querySelector<HTMLElement>('[data-autofocus]')
  if (marked && focusables(root).includes(marked)) return marked
  return focusables(root)[0] ?? null
}

/** The first focusable after `from` in document order inside `scope`, skipping anything inside `skip`. */
export function focusableAfter(from: Element, scope: Element, skip?: Element | null): HTMLElement | null {
  return focusables(scope).find(el =>
    !(skip && skip.contains(el)) && !from.contains(el) && (from.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
  ) ?? null
}

// ---- Focus return. A modal hands focus back to the control that opened it. When that control is gone (the confirm
// deleted its row), disabled ("Q3 Forecast (deleted)") or inside a modal that closed in the same commit ("close
// both"), focus goes to the nearest sensible place instead of dropping to <body>, where the next Tab would restart at
// the top of the page: the next control after where the opener was, else the one before it, else the modal still
// open underneath, else the page's h1.

/** What a modal records as it opens, so it can hand focus back when it closes. */
export type ReturnPoint = {
  /** The control that had focus when the modal opened (or the modal's returnFocus). */
  opener: HTMLElement | null
  /** Where the opener lived: its modal's root, or <body>. */
  scope: Element
  /** The focusables just before the opener at open time, nearest last: they mark its place if it is removed. */
  before: HTMLElement[]
  /** Its modal's depth in the stack (0 = outermost). Several closing in one commit try the innermost opener first. */
  depth: number
}

/** Call as a modal opens (before it joins the stack, while the page is still focusable). */
export function captureReturnPoint(opener: HTMLElement | null): ReturnPoint {
  const usable = opener && opener !== document.body && opener.isConnected ? opener : null
  const scope = usable?.closest('[data-modal-id]') ?? document.body
  const before = usable
    ? focusables(scope).filter(el => el !== usable && !usable.contains(el) && !el.contains(usable)
        && (el.compareDocumentPosition(usable) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0).slice(-12)
    : []
  return { opener: usable, scope, before, depth: modalStack.get().length }
}

let pendingReturns: ReturnPoint[] = []

/**
 * Call as a modal closes. The focus move waits for the end of the commit (a microtask), so the DOM is settled: the
 * opener may be removed or disabled by the same update, and every modal closing in it has left the stack.
 */
export function returnFocus(point: ReturnPoint) {
  pendingReturns.push(point)
  if (pendingReturns.length === 1) queueMicrotask(flushReturns)
}

/** Focus is lost when it sits on <body>, on a removed element or inside an inert subtree. */
function focusLost(): boolean {
  const a = document.activeElement
  return !a || a === document.body || !a.isConnected || !!a.closest('[inert]')
}

function tryFocus(el: HTMLElement | null | undefined, preventScroll = false): boolean {
  if (!el || !el.isConnected) return false
  el.focus({ preventScroll })
  return document.activeElement === el
}

function restore(points: ReturnPoint[]): boolean {
  // 1. an opener that can still take focus, innermost modal first
  for (const p of points) if (tryFocus(p.opener, true)) return true
  // 2. the next control after where the opener was, else the nearest one before it
  for (const p of points) {
    if (!p.scope.isConnected) continue
    const mark = p.opener?.isConnected ? p.opener : [...p.before].reverse().find(el => el.isConnected)
    if (!mark) continue
    const after = focusables(p.scope).filter(el =>
      !mark.contains(el) && (mark.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0)
    for (const el of after.slice(0, 4)) if (tryFocus(el)) return true
    for (const el of [...p.before].reverse()) if (tryFocus(el)) return true
  }
  // 3. the modal still open underneath
  const top = topModalId()
  const dialog = top ? document.querySelector<HTMLElement>(`[data-modal-id="${CSS.escape(top)}"] [role="dialog"]`) : null
  if (dialog && (tryFocus(firstFocusable(dialog), true) || tryFocus(dialog, true))) return true
  // 4. the page's heading (made programmatically focusable), else its main landmark
  const layer = document.getElementById(LAYER_ID)
  const heading = Array.from(document.querySelectorAll<HTMLElement>('main h1, h1')).find(h => !layer?.contains(h) && !h.closest('[inert]'))
  const target = heading ?? document.querySelector<HTMLElement>('main, [role="main"]')
  if (target) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    return tryFocus(target, true)
  }
  return false
}

function flushReturns() {
  const points = pendingReturns.sort((a, b) => b.depth - a.depth)
  pendingReturns = []
  // something already took focus on purpose (the app, or a toast the user moved to): leave it there
  if (!focusLost()) return
  if (!restore(points)) return
  // the opener may still be removed by an update after this commit (a list re-rendered in an effect): check once more
  requestAnimationFrame(() => { if (focusLost()) restore(points) })
}
