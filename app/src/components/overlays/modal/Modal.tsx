import {
  createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState,
  type ComponentPropsWithRef, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../buttons/cx'
import { Button, type ButtonKind, type ButtonProps } from '../../buttons/Button'
import { IconButton } from '../../buttons/IconButton'
import { useOverlayFix } from '../fixes'
import {
  captureReturnPoint, firstFocusable, focusables, overlayLayer, popModal, pushModal, returnFocus as restoreFocus, topModalId,
} from '../layer'
import { overlayIcons } from '../icons'
import '../overlays.css'
import './modal.css'

// Modal (inventory row 12). Figma, file lqKjNjyifEXCeywg69Knr2:
//   Modal Unit     component 11933:738629 (440 wide, radius 16, clips), the shell every share / usage modal uses
//   Modal header   set 12294:613120  Type=Default | Subtext Single line × Size=xs | sm × back=no | yes
//   Modal actions  set 12024:449614  Type=Horizontal right aligned (checkbox) | Horizontal fill container × Size=xs | sm
//                                    × Destructive=False | True
//   Buttons        Button Brand 11750:511612, Button Neutral 11932:738003, Button Error 9918:392657
// Widths seen in the specs: 360 (Delete Artifact 12057:581132), 440 (Share, Publish units, Ask for more Usage),
// 960 x 720 (Settings > Memory 10112:408460). Scrims: black 25% (Share 1819:316166, Usage 6802:236145), #32383E 25%
// (Delete 12057:581131), #32383E 35% (Settings).
//
//   <Modal open={open} onClose={close} width={440} radius={12} nodeId="1969:507322">
//     <ModalHeader title="Who can view this?" onBack={showMain} />
//     <ModalBody gap={16}>…</ModalBody>
//     <ModalActions leading={<ModalButton kind="tertiary" icon={overlayIcons.slashCircle} label="Unpublish" />}>
//       <ModalButton kind="secondary" label="Cancel" onClick={close} />
//       <ModalButton kind="primary" label="Publish" onClick={publish} />
//     </ModalActions>
//   </Modal>

export type ModalSize = 'xs' | 'sm'
export type ModalRadius = 10 | 12 | 16
export type ModalScrim = 'black-25' | 'slate-25' | 'slate-35'

type ModalContextValue = {
  size: ModalSize
  titleId: string
  subtitleId: string
  /** What the header's X does (the open modal's onClose). */
  onClose?: () => void
  /** The header tells the dialog whether it renders a subtitle, so aria-describedby never dangles. */
  setHasSubtitle: (has: boolean) => void
  /** The header tells the dialog it renders the title, so aria-labelledby never dangles (a surface without a header). */
  setHasTitle: (has: boolean) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

/** The open modal's full-screen layer (position: fixed). Menus and popovers inside a modal portal here and measure
 * against it (DropdownMenu portalTo + relativeBox), so they can overhang the modal's edge as Figma draws them. */
const ModalLayerContext = createContext<HTMLElement | null>(null)

export function useModalLayer(): HTMLElement | null {
  return useContext(ModalLayerContext)
}

export type ModalSurfaceProps = Omit<ComponentPropsWithRef<'section'>, 'children'> & {
  children: ReactNode
  /** Width in px; it never exceeds the space available (viewport minus 16px each side). 360, 440 or 960 in the file. */
  width?: number
  /** Fixed height in px (Settings is 960 x 720); content scrolls inside ModalBody. */
  height?: number
  /** Figma Size of the header and actions: xs (28px buttons, 17/20 title) or sm (32px buttons, 20/26 title). */
  size?: ModalSize
  /** Corner radius as drawn: 16 (Modal Unit), 12 (Publish units), 10 (Delete Artifact). "With fixes" makes every modal 16. */
  radius?: ModalRadius
  /** Figma node of this modal (its Modal Unit instance or frame). */
  nodeId?: string
  /** What the header X does. <Modal> passes its onClose; a static surface (gallery) may leave it out. */
  onClose?: () => void
}

/**
 * The modal card on its own: header, body and actions in a 440 (default) white card. <Modal> wraps it with the scrim,
 * focus trap and Escape; the gallery and review sheets render it statically.
 */
export function ModalSurface({
  children, width = 440, height, size = 'xs', radius = 16, nodeId = '11933:738629', onClose, className, style, ...rest
}: ModalSurfaceProps) {
  const uid = useId()
  const [hasSubtitle, setHasSubtitle] = useState(false)
  const [hasTitle, setHasTitle] = useState(false)
  const allSixteen = useOverlayFix('modal-radius-16')
  const r = allSixteen ? 16 : radius
  const ctx: ModalContextValue = { size, titleId: `${uid}-title`, subtitleId: `${uid}-sub`, onClose, setHasSubtitle, setHasTitle }
  // the card never outgrows its container (the modal layer keeps 16px clear of the viewport on each side)
  const box: CSSProperties = { width: `min(${width}px, 100%)`, ...(height !== undefined ? { height } : {}), ...style }
  return (
    <ModalContext value={ctx}>
      <section
        className={cx('mdl', `mdl--${size}`, `mdl--r${r}`, `mdl--drawn-r${radius}`, className)}
        style={box}
        data-node-id={nodeId}
        aria-labelledby={rest['aria-label'] || !hasTitle ? undefined : ctx.titleId}
        aria-describedby={hasSubtitle ? ctx.subtitleId : undefined}
        {...rest}
      >
        {children}
      </section>
    </ModalContext>
  )
}

export type ModalProps = ModalSurfaceProps & {
  open: boolean
  /** Escape, the header X and (unless closeOnScrim is false) a click on the scrim. */
  onClose: () => void
  /** As drawn: black 25% (Share, Usage), slate 25% (#32383E, Delete), slate 35% (Settings). "With fixes": black 25%. */
  scrim?: ModalScrim
  closeOnScrim?: boolean
  /** Element to focus on open. Default: [data-autofocus], else the body's first control, else the actions'. */
  initialFocus?: RefObject<HTMLElement | null>
  /**
   * Element to focus on close. Default: whatever had focus when the modal opened (its trigger). If that is gone or
   * disabled by then, focus goes to the next control where it was, the modal underneath or the page h1 (layer.ts).
   */
  returnFocus?: HTMLElement | null
  /** Sub-view key (a modal with back arrows). When it changes, focus moves into the new view as on open. */
  viewKey?: string | number
}

/** Modal dialog: scrim, centred card, focus trapped inside, Escape closes, focus returns to the trigger. */
export function Modal({ open, ...props }: ModalProps) {
  if (!open) return null
  return <OpenModal {...props} />
}

function OpenModal({
  onClose, scrim = 'black-25', closeOnScrim = true, initialFocus, returnFocus, viewKey, children, ...surface
}: Omit<ModalProps, 'open'>) {
  const id = useId()
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const surfaceRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  useLayoutEffect(() => { onCloseRef.current = onClose }, [onClose])
  const oneScrim = useOverlayFix('modal-scrim-black-25')
  const tone = oneScrim ? 'black-25' : scrim

  // Open: join the modal stack (the page behind turns inert); close: leave it and hand focus back (layer.ts
  // returnFocus: to the opener, else the next control where it was, the modal underneath or the page h1; never <body>).
  // The return point is taken once, on the first mount: StrictMode's dev re-mount runs after the initial focus moved
  // into the modal, so a second capture would record a control inside the modal itself.
  const returnRef = useRef(returnFocus)
  const pointRef = useRef<ReturnType<typeof captureReturnPoint> | null>(null)
  useLayoutEffect(() => {
    pointRef.current ??= captureReturnPoint(returnRef.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null))
    const point = pointRef.current
    pushModal(id)
    return () => {
      popModal(id)
      restoreFocus(point)
    }
  }, [id])

  // Initial focus, and again whenever the sub-view changes.
  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    const target = initialFocus?.current
      ?? el.querySelector<HTMLElement>('[data-autofocus]')
      ?? firstFocusable(el.querySelector('.mdl-bd'))
      ?? firstFocusable(el.querySelector('.mdl-ft'))
      ?? el
    target.focus({ preventScroll: true })
  }, [viewKey, initialFocus])

  // Escape closes the top modal, unless something inside it handles Escape first: an open DropdownMenu (it closes on
  // its own document listener) or a Popover / Tooltip / toast (they preventDefault in the capture phase).
  // Focus that escapes the modal (a script focusing the page behind) is pulled back in; the toast region is allowed.
  useEffect(() => {
    if (!root) return
    let lastInside: HTMLElement | null = null
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || topModalId() !== id) return
      if (root.querySelector('.dd, [data-popover]')) return
      e.preventDefault()
      onCloseRef.current()
    }
    const onFocusIn = (e: FocusEvent) => {
      if (topModalId() !== id) return
      const t = e.target
      if (!(t instanceof HTMLElement)) return
      if (root.contains(t)) { lastInside = t; return }
      if (t.closest('[data-overlay-keep-focus]')) return
      const back = lastInside?.isConnected ? lastInside : (firstFocusable(surfaceRef.current) ?? surfaceRef.current)
      back?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [root, id])

  // Tab and Shift+Tab cycle through the modal (and any menu portaled into its layer).
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    // defaultPrevented: a popover inside already moved focus on (its Tab continues from its trigger)
    if (e.key !== 'Tab' || e.defaultPrevented || topModalId() !== id || !root) return
    const list = focusables(root)
    const active = document.activeElement
    if (!list.length) { e.preventDefault(); surfaceRef.current?.focus(); return }
    const first = list[0]
    const last = list[list.length - 1]
    if (e.shiftKey && (active === first || active === surfaceRef.current || !root.contains(active))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (active === last || !root.contains(active))) {
      e.preventDefault()
      first.focus()
    }
  }

  // A press that starts and ends on the scrim closes (a text selection dragged out of the card does not).
  const downOnScrim = useRef(false)

  return createPortal(
    <div ref={setRoot} className="mdl-root" data-modal-id={id} onKeyDown={onKeyDown}>
      <div
        className={cx('mdl-scrim', `mdl-scrim--${tone}`)}
        aria-hidden="true"
        onPointerDown={e => { downOnScrim.current = e.target === e.currentTarget }}
        onClick={e => {
          if (closeOnScrim && downOnScrim.current && e.target === e.currentTarget) onCloseRef.current()
          downOnScrim.current = false
        }}
      />
      <ModalLayerContext value={root}>
        <ModalSurface
          {...surface}
          ref={surfaceRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClose={() => onCloseRef.current()}
          className={cx('mdl--live', surface.className)}
        >
          {children}
        </ModalSurface>
      </ModalLayerContext>
    </div>,
    overlayLayer(),
  )
}

export type ModalHeaderProps = Omit<ComponentPropsWithRef<'header'>, 'title'> & {
  title: ReactNode
  /** Type=Subtext Single line: a 12/16 line under the title (also the dialog's description). */
  subtitle?: ReactNode
  /** back=yes: a chevron-left before the title for a sub-view. */
  onBack?: () => void
  backLabel?: string
  /** Hide the X (the Delete Artifact confirmation has none). */
  hideClose?: boolean
  closeLabel?: string
  /** Overrides the X's action (default: the modal's onClose). */
  onClose?: () => void
  /** 1px border-tertiary line under the header (Ask for more Usage). */
  divider?: boolean
  /** Spectral Medium as in the component; Delete Artifact overrides it to Regular. */
  titleWeight?: 'medium' | 'regular'
  size?: ModalSize
  nodeId?: string
}

/** Modal header (set 12294:613120): title (Spectral), optional subtitle, back arrow and close. */
export function ModalHeader({
  title, subtitle, onBack, backLabel = 'Back', hideClose, closeLabel = 'Close', onClose, divider, titleWeight = 'medium',
  size, nodeId = '12294:613120', className, ...rest
}: ModalHeaderProps) {
  const ctx = useContext(ModalContext)
  const s = size ?? ctx?.size ?? 'xs'
  const close = onClose ?? ctx?.onClose
  const hasSub = subtitle !== undefined && subtitle !== null && subtitle !== false
  const setHasSubtitle = ctx?.setHasSubtitle
  const setHasTitle = ctx?.setHasTitle
  useLayoutEffect(() => {
    setHasSubtitle?.(hasSub)
    return () => setHasSubtitle?.(false)
  }, [hasSub, setHasSubtitle])
  useLayoutEffect(() => {
    setHasTitle?.(true)
    return () => setHasTitle?.(false)
  }, [setHasTitle])
  return (
    <header
      className={cx('mdl-hd', `mdl-hd--${s}`, hasSub && 'mdl-hd--sub', onBack && 'mdl-hd--back', divider && 'mdl-hd--div', className)}
      data-node-id={nodeId}
      {...rest}
    >
      <div className="mdl-hd__row">
        <div className="mdl-hd__content">
          {onBack && <IconButton size="xs" icon={overlayIcons.chevronLeft24} aria-label={backLabel} onClick={onBack} className="mdl-hd__back" />}
          <div className="mdl-hd__text">
            <h2 id={ctx?.titleId} className={cx('mdl-hd__title', titleWeight === 'regular' && 'mdl-hd__title--regular')}>{title}</h2>
            {hasSub && <p id={ctx?.subtitleId} className="mdl-hd__sub">{subtitle}</p>}
          </div>
        </div>
        {!hideClose && (
          <IconButton size="md" icon={overlayIcons.closeLg} aria-label={closeLabel} onClick={close} className="mdl-hd__close" />
        )}
      </div>
    </header>
  )
}

export type ModalBodyProps = ComponentPropsWithRef<'div'> & {
  /** Space between the body's blocks: 16 (Publish), 24 (Share, Usage) or 0. */
  gap?: 0 | 16 | 24
  size?: ModalSize
}

/** The content between header and actions. Scrolls when the modal reaches the viewport height. */
export function ModalBody({ gap = 16, size, className, ...rest }: ModalBodyProps) {
  const ctx = useContext(ModalContext)
  const s = size ?? ctx?.size ?? 'xs'
  return <div className={cx('mdl-bd', `mdl-bd--${s}`, `mdl-bd--gap${gap}`, className)} {...rest} />
}

export type ModalActionsProps = ComponentPropsWithRef<'footer'> & {
  /** Type=Horizontal right aligned (default) or Horizontal fill container (buttons share the width). */
  align?: 'end' | 'fill'
  /** The left slot of the right-aligned type: a checkbox, a note or a tertiary button (Unpublish). */
  leading?: ReactNode
  /** Divider=Yes: a border-tertiary line above the actions. */
  divider?: boolean
  size?: ModalSize
  nodeId?: string
}

/** Modal actions (set 12024:449614). Children are ModalButtons, primary last. */
export function ModalActions({ align = 'end', leading, divider, size, nodeId = '12024:449614', className, children, ...rest }: ModalActionsProps) {
  const ctx = useContext(ModalContext)
  const s = size ?? ctx?.size ?? 'xs'
  return (
    <footer className={cx('mdl-ft', `mdl-ft--${s}`, `mdl-ft--${align}`, divider && 'mdl-ft--div', className)} data-node-id={nodeId} {...rest}>
      <div className="mdl-ft__content">
        {leading && <div className="mdl-ft__lead">{leading}</div>}
        <div className="mdl-ft__acts">{children}</div>
      </div>
    </footer>
  )
}

export type ModalButtonKind = ButtonKind

export type ModalButtonProps = ButtonProps

/**
 * A modal footer button: the shared Button (components/buttons) at the modal's size, sm 28 in an xs modal and md 32
 * in an sm modal, unless `size` says otherwise.
 */
export function ModalButton({ size, ...rest }: ModalButtonProps) {
  const ctx = useContext(ModalContext)
  return <Button size={size ?? (ctx?.size === 'sm' ? 'md' : 'sm')} {...rest} />
}
