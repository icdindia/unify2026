import {
  Children, cloneElement, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState,
  type ComponentPropsWithRef, type CSSProperties, type FocusEvent, type PointerEvent, type ReactElement, type ReactNode, type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../buttons/cx'
import { MENU_EDGE, placeH, placeV, type View } from '../../dropdown-menu/placement'
import { overlayLayer } from '../layer'
import '../overlays.css'
import './tooltip.css'

// Tooltip (inventory row 9): set "Tooltip" 9860:712340 (the newest of the three generations in the file; also
// 1230:305714 and 89:87235). Supporting text=False, Arrow = Bottom center (Enhance with AI 10247:284177, Co-create with
// an Agent 3780:177208), Top left (full artifact name 7418:306089), Top center, None, plus the set's Top right,
// Bottom left / right, Left and Right. Hidden in every instance but wired here: the leading icon (Icon#56403:0) and the
// shortcut chip (Shortcuts#56417:0, "⌘ ⇧ C").
//
//   <Tooltip text="Enhance with AI" arrow="bottom-center"><IconButton aria-label="Enhance with AI" … /></Tooltip>
//
// Opens on hover after `delay` (instantly when another tooltip closed under 300ms ago) and at once on keyboard focus;
// closes on leave (after a short grace, so the pointer can move onto it), blur, a press on the trigger and Escape.

export type TooltipArrow =
  | 'none' | 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right' | 'left' | 'right'

/** Where the bubble sits relative to its trigger when it has no arrow (Arrow=None). */
export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export type TooltipBubbleProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  text: ReactNode
  /** Figma Arrow: the side of the bubble the arrow is on (bottom-center = the bubble sits above its trigger). */
  arrow?: TooltipArrow
  /** Leading 12px icon URL (icon-tertiary), as "Co-create with an Agent". */
  icon?: string
  /** Shortcut chip(s) after the text, e.g. "⌘ ⇧ C". */
  shortcut?: string | string[]
  /** Live placement: the arrow's centre in px from the bubble's left (top / bottom arrows) or top (side arrows). */
  arrowOffset?: number
  nodeId?: string
}

/** The tooltip bubble itself: dark box, text, optional icon and shortcut chip, and the arrow. Static in the gallery. */
export function TooltipBubble({ text, arrow = 'bottom-center', icon, shortcut, arrowOffset, nodeId = '9860:712340', className, ...rest }: TooltipBubbleProps) {
  const keys = shortcut === undefined ? [] : Array.isArray(shortcut) ? shortcut : [shortcut]
  const side = arrow === 'left' || arrow === 'right'
  const arrowStyle: CSSProperties | undefined = arrowOffset === undefined
    ? undefined
    : side ? { alignSelf: 'flex-start', marginTop: arrowOffset - 8 } : { alignSelf: 'flex-start', marginLeft: arrowOffset - 8 }
  return (
    <div className={cx('tt', `tt--${arrow}`, className)} data-node-id={nodeId} {...rest}>
      <div className="tt__box">
        {icon && <img alt="" src={icon} className="tt__icon" />}
        <span className="tt__t">{text}</span>
        {keys.map(k => <kbd key={k} className="tt__kbd">{k}</kbd>)}
      </div>
      {arrow !== 'none' && <span className="tt__arrow" aria-hidden="true" style={arrowStyle} />}
    </div>
  )
}

const GAP = 4 // trigger to arrow tip: Enhance with AI 10247:284177 ends at y 464, its button starts at 468
const ARROW_INSET = 20 // Top left / Bottom left: arrow centre 20px from the bubble's edge (7418:306089)
let lastHiddenAt = 0 // a tooltip that closed moments ago lets the next one open without the delay

type Placed = { left: number; top: number; arrow: TooltipArrow; offset?: number }

function sideOf(arrow: TooltipArrow, fallback: TooltipSide): TooltipSide {
  if (arrow.startsWith('bottom')) return 'top'
  if (arrow.startsWith('top')) return 'bottom'
  if (arrow === 'left') return 'right'
  if (arrow === 'right') return 'left'
  return fallback
}

const flipV = (a: TooltipArrow): TooltipArrow =>
  (a.startsWith('bottom') ? a.replace('bottom', 'top') : a.startsWith('top') ? a.replace('top', 'bottom') : a) as TooltipArrow

/** Where a w x h bubble goes for this trigger: preferred side, flipped when it does not fit, clamped to the viewport. */
function place(t: DOMRect, w: number, h: number, arrow: TooltipArrow, fallback: TooltipSide): Placed {
  const view: View = { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }
  const side = sideOf(arrow, fallback)
  if (side === 'top' || side === 'bottom') {
    const above = t.top - GAP - h
    const below = t.bottom + GAP
    let top: number
    let a = arrow
    if (side === 'bottom') {
      top = placeV(below, h, view, t.top - GAP) // below, else above, else clamped (placement.ts)
      if (top < below) a = flipV(arrow)
    } else if (above >= view.top + MENU_EDGE) {
      top = above
    } else {
      top = placeV(below, h, view, t.top - GAP)
      if (top >= below) a = flipV(arrow)
    }
    const cx = t.left + t.width / 2
    const want = arrow.endsWith('left') ? cx - ARROW_INSET : arrow.endsWith('right') ? cx - (w - ARROW_INSET) : cx - w / 2
    const left = placeH(want, w, view) // clamped inside the viewport
    const offset = a === 'none' ? undefined : Math.min(Math.max(cx - left, 12), w - 12)
    return { left, top, arrow: a, offset }
  }
  // left / right of the trigger
  const right = t.right + GAP
  const leftOf = t.left - GAP - w
  let left: number
  let a = arrow
  if (side === 'right') {
    left = right + w <= view.right - MENU_EDGE || leftOf < MENU_EDGE ? right : leftOf
  } else {
    left = leftOf >= MENU_EDGE || right + w > view.right - MENU_EDGE ? leftOf : right
  }
  if (arrow === 'left' && left < t.left) a = 'right'
  if (arrow === 'right' && left > t.left) a = 'left'
  const cy = t.top + t.height / 2
  const top = Math.min(Math.max(cy - h / 2, MENU_EDGE), view.bottom - MENU_EDGE - h)
  const offset = a === 'none' ? undefined : Math.min(Math.max(cy - top, 10), h - 10)
  return { left, top, arrow: a, offset }
}

export type TooltipOptions = {
  text: ReactNode
  arrow?: TooltipArrow
  /** For Arrow=None: which side of the trigger. Default top. */
  side?: TooltipSide
  icon?: string
  shortcut?: string | string[]
  /** Hover delay in ms. Default 400. Keyboard focus shows it at once. */
  delay?: number
  /** Controlled: pin it open (review states such as hover=enhance) or closed. */
  open?: boolean
  /** Suppress it (e.g. while the trigger's menu is open). */
  disabled?: boolean
  nodeId?: string
}

/**
 * Tooltip behaviour for any trigger: spread `triggerProps` on it and render `tooltip` anywhere (it portals to the
 * overlay layer). <Tooltip> is the same thing as a wrapper.
 */
export function useTooltip({ text, arrow = 'bottom-center', side = 'top', icon, shortcut, delay = 400, open, disabled, nodeId }: TooltipOptions) {
  const id = useId()
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [internal, setInternal] = useState(false)
  const shown = !disabled && (open ?? internal) && !!trigger
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const suppressed = useRef(false) // pressed: stay closed until the pointer leaves

  const clear = () => { window.clearTimeout(openTimer.current); window.clearTimeout(closeTimer.current) }
  const show = useCallback((wait: number) => {
    clear()
    if (wait <= 0) setInternal(true)
    else openTimer.current = window.setTimeout(() => setInternal(true), wait)
  }, [])
  const hide = useCallback((wait = 0) => {
    clear()
    const done = () => { setInternal(was => { if (was) lastHiddenAt = Date.now(); return false }) }
    if (wait <= 0) done()
    else closeTimer.current = window.setTimeout(done, wait)
  }, [])
  useEffect(() => clear, [])

  // Escape closes an open tooltip first (WCAG 1.4.13); it is handled in the capture phase and marked handled,
  // so a modal underneath stays open.
  useEffect(() => {
    if (!shown || open !== undefined) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      suppressed.current = true
      hide()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [shown, open, hide])

  const label = trigger?.getAttribute('aria-label')
  const describes = shown && !(typeof text === 'string' && label === text) // an icon button named by the same words needs no description

  const triggerProps = {
    ref: setTrigger,
    'aria-describedby': describes ? id : undefined,
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'touch' || suppressed.current) return
      show(Date.now() - lastHiddenAt < 300 ? 0 : delay)
    },
    onPointerLeave: () => { suppressed.current = false; hide(100) },
    onPointerDown: () => { suppressed.current = true; hide() },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      let keyboard = true
      try { keyboard = e.currentTarget.matches(':focus-visible') } catch { /* older engines: treat as keyboard */ }
      if (keyboard && !suppressed.current) show(0)
    },
    onBlur: () => { suppressed.current = false; hide() },
  }

  const tooltip = shown ? (
    <LiveTooltip
      id={id} trigger={trigger!} text={text} arrow={arrow} side={side} icon={icon} shortcut={shortcut} nodeId={nodeId}
      onPointerEnter={() => window.clearTimeout(closeTimer.current)}
      onPointerLeave={() => hide(100)}
    />
  ) : null

  return { triggerProps, tooltip, open: shown }
}

function LiveTooltip({
  id, trigger, arrow, side, onPointerEnter, onPointerLeave, ...bubble
}: { id: string; trigger: HTMLElement; arrow: TooltipArrow; side: TooltipSide; onPointerEnter: () => void; onPointerLeave: () => void }
  & Pick<TooltipBubbleProps, 'text' | 'icon' | 'shortcut' | 'nodeId'>) {
  const el = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState<Placed | null>(null)
  useLayoutEffect(() => {
    const update = () => {
      const node = el.current
      if (!node || !trigger.isConnected) return
      setPlaced(place(trigger.getBoundingClientRect(), node.offsetWidth, node.offsetHeight, arrow, side))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [trigger, arrow, side])
  return createPortal(
    <TooltipBubble
      ref={el}
      id={id}
      role="tooltip"
      className={cx('tt-live', placed && 'is-placed')}
      style={placed ? { left: placed.left, top: placed.top } : { left: 0, top: 0 }}
      arrow={placed?.arrow ?? arrow}
      arrowOffset={placed?.offset}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      {...bubble}
    />,
    overlayLayer(),
  )
}

export type TooltipProps = TooltipOptions & {
  /** The trigger: one element that takes a ref and pointer / focus handlers (a button, a link). */
  children: ReactElement
}

type TriggerProps = {
  ref?: Ref<HTMLElement>
  onPointerEnter?: (e: PointerEvent<HTMLElement>) => void
  onPointerLeave?: (e: PointerEvent<HTMLElement>) => void
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void
  onFocus?: (e: FocusEvent<HTMLElement>) => void
  onBlur?: (e: FocusEvent<HTMLElement>) => void
  'aria-describedby'?: string
}

/**
 * Wraps one trigger element. A disabled <button> gets no pointer events, so wrap a disabled trigger in a <span>
 * (or use aria-disabled) when it needs its tooltip.
 */
export function Tooltip({ children, ...options }: TooltipProps) {
  const { triggerProps, tooltip } = useTooltip(options)
  const child = Children.only(children)
  const own = isValidElement<TriggerProps>(child) ? child.props : null
  // one stable callback ref for the trigger, forwarding to the child's own ref (React 19 passes it as a prop)
  const ownRef = useRef<Ref<HTMLElement> | undefined>(undefined)
  ownRef.current = own?.ref
  const setTrigger = triggerProps.ref
  const setRef = useCallback((node: HTMLElement | null) => {
    setTrigger(node)
    const r = ownRef.current
    if (typeof r === 'function') r(node)
    else if (r) (r as { current: HTMLElement | null }).current = node
  }, [setTrigger])
  if (!own || !isValidElement<TriggerProps>(child)) return children
  const chain = <E,>(a?: (e: E) => void, b?: (e: E) => void) => (e: E) => { a?.(e); b?.(e) }
  const describedBy = [own['aria-describedby'], triggerProps['aria-describedby']].filter(Boolean).join(' ') || undefined
  return (
    <>
      {cloneElement(child, {
        ref: setRef,
        'aria-describedby': describedBy,
        onPointerEnter: chain(own.onPointerEnter, triggerProps.onPointerEnter),
        onPointerLeave: chain(own.onPointerLeave, triggerProps.onPointerLeave),
        onPointerDown: chain(own.onPointerDown, triggerProps.onPointerDown),
        onFocus: chain(own.onFocus, triggerProps.onFocus),
        onBlur: chain(own.onBlur, triggerProps.onBlur),
      })}
      {tooltip}
    </>
  )
}
