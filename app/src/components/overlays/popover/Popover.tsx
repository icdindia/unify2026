import {
  useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../buttons/cx'
import { MENU_EDGE, placeH, placeMenu, placeV, relativeBox, viewOf, type MenuPosition } from '../../dropdown-menu/placement'
import { useModalLayer } from '../modal/Modal'
import { firstFocusable, focusableAfter, focusables } from '../layer'
import '../overlays.css'
import './popover.css'

// Anchored Popover: a floating card tied to a trigger (cost popover, people-with-access, files panel, typing people).
// Placement reuses dropdown-menu/placement.ts, the same rules as every menu in the app: the card opens on its
// preferred side, flips to the other side when it does not fit, and is clamped 8px inside what is visible of its
// container. It is positioned in its container's coordinates (like DropdownMenu), so it scrolls with the page.
//
// Surfaces as drawn in the file:
//   menu  Dropdown Menu / Type=Small (e.g. 6077:427694): radius-md, bg-primary, 1px border-secondary inside, small shadow
//   full  Dropdown Menu / Type=Full shadow
//   plain no chrome: the content brings its own card (Input Menu Dropdown 6077:427693, "cost stat")

export type PopoverPlacement =
  | 'bottom-start' | 'bottom-end' | 'bottom-center' | 'top-start' | 'top-end' | 'top-center' | 'right-start' | 'left-start'

export type PopoverCloseReason = 'escape' | 'outside' | 'focus-out'

export type PopoverProps = Omit<ComponentPropsWithRef<'div'>, 'style' | 'autoFocus'> & {
  open: boolean
  /** The trigger it hangs from (give it aria-expanded / aria-controls). */
  anchor: HTMLElement | null
  /** Escape (focus goes back to the anchor), a press outside it and its anchor, or focus moving elsewhere. */
  onClose?: (reason: PopoverCloseReason) => void
  placement?: PopoverPlacement
  /** Space between anchor and card. Default 4, as the menus. */
  gap?: number
  /** Card width in px, or 'anchor' to match the trigger. Default: its content's width. */
  width?: number | 'anchor'
  surface?: 'menu' | 'full' | 'plain'
  /** Positioned container to render into. Default: the open modal's layer inside a modal, else <body>. */
  portalTo?: HTMLElement | null
  /** Move focus into the card on open: true / 'first' = its first control, 'container' = the card itself. */
  autoFocus?: boolean | 'first' | 'container'
  /** Close when focus moves outside card and anchor (default true; a hover popover may turn it off). */
  closeOnFocusOut?: boolean
  nodeId?: string
  children: ReactNode
}

/** Where the card goes for each placement, in container coordinates (MenuPosition of placement.ts). */
function positionFor(placement: PopoverPlacement, a: ReturnType<typeof relativeBox>, w: number, gap: number): MenuPosition {
  switch (placement) {
    case 'bottom-start': return { left: a.left, top: a.bottom + gap, above: a.top - gap, before: a.right }
    case 'bottom-end': return { left: a.right - w, top: a.bottom + gap, above: a.top - gap }
    case 'bottom-center': return { left: a.left + a.width / 2 - w / 2, top: a.bottom + gap, above: a.top - gap }
    case 'right-start': return { left: a.right + gap, top: a.top, above: a.bottom, before: a.left - gap }
    case 'left-start': return { left: a.left - gap - w, top: a.top, above: a.bottom } // see place()
    // top-*: worked out in place() (placement.ts only knows "below, else above")
    case 'top-start': return { left: a.left, top: a.top - gap, above: a.top - gap, before: a.right }
    case 'top-end': return { left: a.right - w, top: a.top - gap, above: a.top - gap }
    case 'top-center': return { left: a.left + a.width / 2 - w / 2, top: a.top - gap, above: a.top - gap }
  }
}

function place(placement: PopoverPlacement, anchor: HTMLElement, card: HTMLElement, container: HTMLElement, gap: number) {
  const a = relativeBox(anchor, container)
  const w = card.offsetWidth
  const h = card.offsetHeight
  const view = viewOf(container)
  const pos = positionFor(placement, a, w, gap)
  if (placement === 'left-start') {
    // left of the anchor when it fits, else on its right (placement.ts flips rightward overflow only)
    const left = a.left - gap - w >= view.left + MENU_EDGE ? a.left - gap - w : placeH(a.right + gap, w, view)
    return { left, top: placeV(a.top, h, view, a.bottom) }
  }
  if (placement.startsWith('top')) {
    // above when it fits, else below (placeV flips / clamps from there)
    const top = a.top - gap - h >= view.top + MENU_EDGE ? a.top - gap - h : placeV(a.bottom + gap, h, view, a.top - gap)
    const { left } = placeMenu({ ...pos, top }, w, h, view)
    return { left, top }
  }
  return placeMenu(pos, w, h, view)
}

/**
 * A floating card anchored to a trigger. Not modal: the page stays usable; Escape and an outside press close it.
 * Tab order: the card is portaled to the end of its container, so it behaves as if it sat right after its trigger:
 * Tab past its last control moves on to the control after the trigger, Shift+Tab before its first returns to the
 * trigger, and leaving it closes it (unless closeOnFocusOut is off).
 */
export function Popover({ open, ...props }: PopoverProps) {
  if (!open || !props.anchor) return null
  return <OpenPopover {...props} />
}

function OpenPopover({
  anchor, onClose, placement = 'bottom-start', gap = 4, width, surface = 'menu', portalTo, autoFocus, closeOnFocusOut = true,
  nodeId, className, children, ref, role = 'dialog', onKeyDown, ...rest
}: Omit<PopoverProps, 'open'>) {
  const modalLayer = useModalLayer()
  const container = portalTo ?? modalLayer ?? document.body
  const el = useRef<HTMLDivElement | null>(null)
  const setEl = useCallback((node: HTMLDivElement | null) => {
    el.current = node
    if (typeof ref === 'function') return ref(node)
    if (ref) ref.current = node
  }, [ref])
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const onCloseRef = useRef(onClose)
  useLayoutEffect(() => { onCloseRef.current = onClose }, [onClose])

  // place before paint; again on resize, on any scroll (the anchor may live in another scroll box) and when the card
  // changes size
  useLayoutEffect(() => {
    const card = el.current
    if (!card || !anchor) return
    const update = () => { if (anchor.isConnected) setPos(place(placement, anchor, card, container, gap)) }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const ro = new ResizeObserver(update)
    ro.observe(card)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      ro.disconnect()
    }
  }, [anchor, container, placement, gap])

  // focus moves in once the card is placed (it is visibility: hidden, so unfocusable, until then)
  const placed = pos !== null
  const focusedIn = useRef(false)
  useEffect(() => {
    if (!autoFocus || !placed || focusedIn.current || !el.current) return
    focusedIn.current = true
    const target = autoFocus === 'container' ? el.current : (firstFocusable(el.current) ?? el.current)
    target.focus({ preventScroll: true })
  }, [autoFocus, placed])

  // A popover that closes while it holds focus hands it back to its anchor (layout cleanup runs before removal).
  useLayoutEffect(() => {
    const card = el.current
    return () => {
      if (card && anchor?.isConnected && card.contains(document.activeElement)) anchor.focus({ preventScroll: true })
    }
  }, [anchor])

  useEffect(() => {
    const outside = (t: EventTarget | null) =>
      t instanceof Node && !el.current?.contains(t) && !anchor?.contains(t) && !(t instanceof Element && t.closest('.dd'))
    const onPointerDown = (e: PointerEvent) => { if (outside(e.target)) onCloseRef.current?.('outside') }
    const onFocusIn = (e: FocusEvent) => { if (closeOnFocusOut && outside(e.target)) onCloseRef.current?.('focus-out') }
    // capture + preventDefault: a modal underneath sees the Escape as handled and stays open
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      // a dropdown menu holding focus outside this card is on top: its own Escape closes it and returns focus to its
      // trigger; consuming the key here would leave the menu to close without that and drop focus to <body>
      const active = document.activeElement
      if (active instanceof Element && active.closest('.dd') && !el.current?.contains(active)) return
      e.preventDefault()
      if (el.current?.contains(document.activeElement)) anchor?.focus({ preventScroll: true })
      onCloseRef.current?.('escape')
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [anchor, closeOnFocusOut])

  // Tab / Shift+Tab at the card's edges continue from the trigger instead of from the end of the page.
  const keyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    const card = el.current
    if (e.key !== 'Tab' || e.defaultPrevented || !card || !anchor?.isConnected) return
    const inside = focusables(card)
    const active = document.activeElement
    if (e.shiftKey) {
      if (inside.length && active !== card && active !== inside[0]) return
      e.preventDefault()
      anchor.focus({ preventScroll: true })
      if (closeOnFocusOut) onCloseRef.current?.('focus-out')
      return
    }
    if (inside.length && active !== inside[inside.length - 1]) return
    const next = focusableAfter(anchor, anchor.closest('[data-modal-id]') ?? document.body, card)
    if (!next) return // nothing after the trigger: the browser (or the modal's Tab trap) takes it from here
    e.preventDefault()
    next.focus() // a focus outside card and anchor closes it (closeOnFocusOut)
  }

  const w = width === 'anchor' ? anchor?.offsetWidth : width
  return createPortal(
    <div
      ref={setEl}
      role={role}
      data-popover=""
      data-node-id={nodeId}
      tabIndex={autoFocus === 'container' ? -1 : undefined}
      className={cx('pop', `pop--${surface}`, pos && 'is-placed', className)}
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, width: w }}
      onKeyDown={keyDown}
      {...rest}
    >
      {children}
    </div>,
    container,
  )
}
