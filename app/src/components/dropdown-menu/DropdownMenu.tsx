import {
  useCallback, useEffect, useId, useLayoutEffect, useRef, useState,
  type ComponentPropsWithRef, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../buttons/cx'
import { placeMenu, viewOf, type MenuPosition } from './placement'
import searchIcon from '../../assets/chrome/dd-search.svg'
import chevronRight from '../../assets/chrome/dd-chevron-right.svg'
import { Check12 } from '../form/icons'
import { Avatar, type AvatarColour } from '../avatar/Avatar'
import './dropdown-menu.css'

/** Which control takes focus when a menu opens from the keyboard: the first (its search field, if any) or the last item. */
export type MenuFocus = 'first' | 'last'

/**
 * For a trigger's onClick: Enter and Space on a button fire a click with detail 0 (a pointer click has detail >= 1),
 * so a menu opened from the keyboard gets `autoFocus` and its first control takes focus, as in the menu-button pattern.
 */
export const keyboardFocus = (e: ReactMouseEvent): MenuFocus | undefined => (e.detail === 0 ? 'first' : undefined)

/** onKeyDown for a menu trigger (it carries aria-expanded): ArrowDown on a closed menu opens it the way Enter does. */
export function openMenuOnArrowDown(e: ReactKeyboardEvent<HTMLElement>) {
  if (e.key !== 'ArrowDown' || e.currentTarget.getAttribute('aria-expanded') === 'true') return
  e.preventDefault()
  e.currentTarget.click() // a scripted click has detail 0, so the trigger's onClick treats it as a keyboard open
}

export type DropdownMenuProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'style' | 'autoFocus'> & {
  /**
   * Where the menu wants to go, in the coordinates of its positioned container (its offsetParent, or `portalTo`).
   * Before paint the menu measures itself: if it would run past the visible bottom it opens upward from
   * `position.above` (or is clamped 8px above the bottom), like placeV() in the HTML prototype; if it would
   * run past the right edge it flips to `position.before`, stacks by its parent (`position.stack`), or is clamped.
   */
  position: MenuPosition
  /** Menu width in px. The file's menus: 170 (header, row), 197 ("Move to project"), 140 (project card). */
  width: number
  /** Dropdown Menu Type=Full (default) or Type=Small shadow. */
  shadow?: 'full' | 'small'
  /** A search field above the items (the "Move to project" menu). Uncontrolled unless `value` is given. */
  search?: { placeholder?: string; value?: string; onChange?: (value: string) => void; 'aria-label'?: string }
  /**
   * Called on Escape, Tab, a pointer press outside every open menu and outside `anchor`, and focus moving outside
   * them. Choosing an item does not close the menu by itself: close it from the item's onClick, as the prototype does.
   */
  onClose?: () => void
  /**
   * The trigger: presses on it are not "outside" (its own onClick toggles), ArrowDown / ArrowUp on it move into the
   * open menu, and focus returns to it when the menu closes while holding focus (Escape, an item chosen, …).
   */
  anchor?: HTMLElement | null
  /** Render into this (positioned) element instead of in place, e.g. to escape a clipping table. */
  portalTo?: HTMLElement | null
  /** Set false to place the menu exactly at `position`, with no flipping or clamping. */
  flip?: boolean
  /** Move focus into the menu as it opens (it was opened from the keyboard, see keyboardFocus). true = 'first'. */
  autoFocus?: MenuFocus | boolean
  /** Figma node id of this menu. */
  nodeId?: string
  children: ReactNode
}

// menuitem, and the menuitemradio rows a `selected` DropdownItem renders
const ITEMS = '[role^="menuitem"]:not(:disabled)'

/** Focus the menu's first control (its search field, else the first item) or its last item. */
function focusInside(menu: HTMLElement | null, which: MenuFocus) {
  if (!menu) return
  const items = Array.from(menu.querySelectorAll<HTMLElement>(ITEMS))
  const target = which === 'first' ? (menu.querySelector<HTMLElement>('.dd__field') ?? items[0]) : items[items.length - 1]
  target?.focus({ preventScroll: true })
}

/**
 * Dropdown Menu shell: positions itself and follows the menu-button keyboard pattern. Arrow keys, Home and End move
 * between items; Escape closes it and returns focus to the trigger; Tab closes it and moves on from the trigger (the
 * menu itself is portaled to the end of the page); focus or a press anywhere else closes it.
 */
export function DropdownMenu({
  position, width, shadow = 'full', search, onClose, anchor, portalTo, flip = true, autoFocus, nodeId, className, children, ref, onKeyDown: onKeyDownProp, ...rest
}: DropdownMenuProps) {
  // the menu measures itself; a caller's ref (e.g. to place a submenu beside it) is kept in step
  const el = useRef<HTMLDivElement | null>(null)
  const setEl = useCallback((node: HTMLDivElement | null) => {
    el.current = node
    if (typeof ref === 'function') return ref(node)
    if (ref) ref.current = node
  }, [ref])
  const [placed, setPlaced] = useState({ left: position.left, top: position.top })
  const { left, top, above, before, stack } = position

  // placed before paint, and again whenever the window resizes while the menu is open
  useLayoutEffect(() => {
    const place = () => {
      const menu = el.current
      const container = menu?.offsetParent
      if (!menu || !flip || !(container instanceof HTMLElement)) {
        setPlaced({ left, top })
        return
      }
      setPlaced(placeMenu({ left, top, above, before, stack }, menu.offsetWidth, menu.offsetHeight, viewOf(container)))
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [left, top, above, before, stack?.left, stack?.top, stack?.above, flip]) // `stack` by value: callers may pass a fresh object each render

  useEffect(() => {
    if (autoFocus) focusInside(el.current, autoFocus === 'last' ? 'last' : 'first')
  }, [autoFocus])

  // A menu that closes while it holds focus (an item chosen, a press outside, the window resized) hands focus back to
  // its trigger instead of dropping it to <body>. Layout cleanups run before React removes the DOM, so it is still inside.
  const anchorRef = useRef(anchor)
  useLayoutEffect(() => { anchorRef.current = anchor }, [anchor])
  useLayoutEffect(() => {
    const menu = el.current
    return () => {
      const trigger = anchorRef.current
      if (menu && trigger?.isConnected && menu.contains(document.activeElement)) trigger.focus()
    }
  }, [])

  useEffect(() => {
    if (!onClose) return
    const outside = (t: EventTarget | null) => t instanceof Element && !t.closest('.dd') && !anchor?.contains(t)
    const onPointerDown = (e: PointerEvent) => { if (outside(e.target)) onClose() }
    const onFocusIn = (e: FocusEvent) => { if (outside(e.target)) onClose() }
    // keys pressed inside a menu are handled by its own onKeyDown (below); these are for focus anywhere else
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && anchor && document.activeElement === anchor) {
        e.preventDefault()
        focusInside(el.current, e.key === 'ArrowDown' ? 'first' : 'last')
      }
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, anchor])

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDownProp?.(e)
    if (e.defaultPrevented) return
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation() // handled here, so the other open menus' document listeners do not also act on it
      anchor?.focus()
      onClose?.()
      return
    }
    if (e.key === 'Tab') {
      // no preventDefault: with focus moved back to the trigger, the browser's Tab continues from there
      anchor?.focus()
      onClose?.()
      return
    }
    const items = Array.from(el.current?.querySelectorAll<HTMLElement>(ITEMS) ?? [])
    if (!items.length) return
    const i = items.indexOf(document.activeElement as HTMLElement)
    const onItem = i > -1
    let next: number
    if (e.key === 'ArrowDown') next = onItem ? (i + 1) % items.length : 0
    else if (e.key === 'ArrowUp') next = onItem ? (i - 1 + items.length) % items.length : items.length - 1
    else if (e.key === 'Home' && onItem) next = 0
    else if (e.key === 'End' && onItem) next = items.length - 1
    else return
    e.preventDefault()
    items[next].focus()
  }

  const menu = (
    <div
      ref={setEl}
      role="menu"
      className={cx('dd', shadow === 'small' && 'dd--small', className)}
      style={{ left: placed.left, top: placed.top, width }}
      data-node-id={nodeId}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {search && (
        <div className="dd__search">
          <label className="dd__input">
            <img alt="" src={searchIcon} />
            <input
              className="dd__field"
              type="search"
              placeholder={search.placeholder ?? 'Search'}
              aria-label={search['aria-label'] ?? search.placeholder ?? 'Search'}
              value={search.value}
              onChange={e => search.onChange?.(e.target.value)}
            />
          </label>
        </div>
      )}
      <div className="dd__items">{children}</div>
    </div>
  )
  return portalTo ? createPortal(menu, portalTo) : menu
}

export type DropdownItemProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string
  /** Icon URL. Plain items take the 14x20 exports (menuIcons); a submenu trigger takes a 14x14 icon (menuIcons.folder). */
  icon?: string
  /** Error-red label (Delete). */
  danger?: boolean
  /** Submenu trigger: trailing chevron-right, aria-haspopup. */
  submenu?: boolean
  /** The submenu is open: keeps the hover fill and sets aria-expanded. */
  open?: boolean
  // ---- Dropdown list item set 11750:513212 (contract ask 5). None of these is set by the Projects menus, which keep
  // the original markup below. Any of them switches to the richer row.
  /** Supporting Text=On: a second Text xs line in text-tertiary under the label; the row grows to 44 (6 / 6 / 6 / 8). */
  description?: string
  /**
   * Selected axis. Given at all, the row is a menuitemradio with aria-checked; true adds the Selected=On fill
   * (bg-workspace) and the 12px check before any shortcut ("Commenter ✓" in the role menu 9256:470679).
   */
  selected?: boolean
  /** End Type=Shortcut: Text xxxs (10/12) text-quaternary at the end, e.g. "⌘C". */
  shortcut?: string
  /**
   * Start slot when it is not a plain icon URL: a coloured app logo (Apps / Download menus), a 14px inline SVG. Sits in
   * the 14 × 20 Icon Wrap (2px under the content top beside a description).
   */
  leading?: ReactNode
  /**
   * Start Type=Avatar: a 22px letter avatar in a 22 × 22 Icon Wrap, centred on a single line and flush with the
   * content top beside a description. The row is named by its label, so the avatar is decorative.
   */
  avatar?: { name: string; initial?: string; colour?: AvatarColour }
}

/** Dropdown list item: icon + label, optionally danger or a submenu trigger; or the richer row (see `description`). */
export function DropdownItem({
  label, icon, danger, submenu, open = false, description, selected, shortcut, leading, avatar, className, type = 'button', ...rest
}: DropdownItemProps) {
  if (description !== undefined || selected !== undefined || shortcut !== undefined || leading !== undefined || avatar !== undefined) {
    return (
      <button
        type={type}
        role={selected !== undefined ? 'menuitemradio' : 'menuitem'}
        aria-checked={selected}
        className={cx('ddi', 'ddi--rich', description && 'ddi--desc', selected && 'is-selected', danger && 'ddi--danger', className)}
        data-node-id="11750:513212"
        {...rest}
      >
        <span className="ddi__in">
          <span className="ddi__st ddi__st--rich">
            {avatar ? (
              <span className="ddi__lead ddi__lead--av">
                <Avatar name={avatar.name} initial={avatar.initial} colour={avatar.colour} size="xs" decorative className="ddi__av" />
              </span>
            ) : (leading || icon) && <span className="ddi__lead">{leading ?? <img alt="" src={icon} className="ddi__i" />}</span>}
            <span className="ddi__tw">
              <span className="ddi__t">{label}</span>
              {description && <span className="ddi__d">{description}</span>}
            </span>
          </span>
          {selected && <Check12 className="ddi__check" />}
          {shortcut && <kbd className="ddi__k">{shortcut}</kbd>}
        </span>
      </button>
    )
  }
  return (
    <button
      type={type}
      role="menuitem"
      className={cx('ddi', danger && 'ddi--danger', submenu && 'ddi--sub', open && 'is-open', className)}
      aria-haspopup={submenu ? 'menu' : undefined}
      aria-expanded={submenu ? open : undefined}
      {...rest}
    >
      {submenu ? (
        <span className="ddi__in ddi__in--sub">
          <span className="ddi__st">
            {icon && <span className="ddi__i14"><img alt="" src={icon} /></span>}
            <span className="ddi__t">{label}</span>
          </span>
          <img alt="" src={chevronRight} className="ddi__chev" />
        </span>
      ) : (
        <span className="ddi__in">
          {icon && <img alt="" src={icon} className="ddi__i" />}
          <span className="ddi__t">{label}</span>
        </span>
      )}
    </button>
  )
}

/** Divider row: sm 5px (row, card and submenu menus) or md 9px (header menu). */
export function DropdownSeparator({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <div role="separator" className={cx('ddsep', size === 'md' && 'ddsep--md')}><span /></div>
}

/**
 * Header row: "Dropdown list header / Type=H2" (set 11780:383826): 28 tall, 12 / 14 / 4 / 14, Text xxxs Medium
 * all caps in text-quaternary ("OPEN IN", "DOWNLOAD" in the Apps / Download menus 3780:178345). Decorative on its
 * own; wrap the rows it heads in DropdownGroup so the menu announces the group by name.
 */
export function DropdownHeader({ children, id }: { children: ReactNode; id?: string }) {
  return <div className="ddh" id={id} role="presentation" data-node-id="11780:383826">{children}</div>
}

/** A labelled group of rows under a DropdownHeader (role="group", named by the header). */
export function DropdownGroup({ label, children }: { label: string; children: ReactNode }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="ddg">
      <DropdownHeader id={id}>{label}</DropdownHeader>
      {children}
    </div>
  )
}
