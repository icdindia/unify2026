import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cx } from '../buttons/cx'
import {
  DropdownItem, DropdownMenu, DropdownSeparator, menuIcons, relativeBox, useSubmenu, type MenuFocus, type MenuPosition,
} from '../dropdown-menu'
import { useChatChromeFix } from '../chat-header/fixes'
import viewFiles from './assets/view-files.svg'
import archiveCircle from './assets/archive-circle.svg'
import './chat-title-menu.css'

/** What a title-menu item asks for. The screen decides what each does (BUILD-PLAN 3, chat-artifact 03). */
export type ChatTitleAction =
  | { type: 'view-files' } // → the files panel (step 17)
  | { type: 'pin' } // Pin Chat / Unpin Chat → the rail's Pinned group
  | { type: 'rename' } // gap: inline rename of the title
  | { type: 'add-to-project'; project: string } // gap: toast
  | { type: 'new-project' } // gap: toast
  | { type: 'archive' } // gap: toast
  | { type: 'delete' } // gap: confirm modal (artifacts-landing 06)

/** Figma nodes of the menu as drawn in chat-artifact 03 (instance of the local component "Frame 2147266815"); the menus render them as data-node-id. */
export const CHAT_TITLE_MENU_NODES = {
  wrapper: '6405:329854',
  menu: 'I6405:329854;6052:427308',
  submenu: 'I6405:329854;4770:196323',
} as const

/** Menu widths as drawn: Dropdown Menu 190, the Add to Project submenu 240. */
export const CHAT_TITLE_MENU_WIDTH = 190
export const ADD_TO_PROJECT_WIDTH = 240

/**
 * Where the menu goes under the title button, in `layer` coordinates: right edges aligned and 6px down (button
 * 68-294 x 6-34, menu 104-294 x 40-253 in chat-artifact 03), opening upward if it would not fit below.
 */
export function titleMenuPosition(button: HTMLElement, layer: HTMLElement): MenuPosition {
  const b = relativeBox(button, layer)
  return { left: b.right - CHAT_TITLE_MENU_WIDTH, top: b.bottom + 6, above: b.top - 6 }
}

export type ChatTitleMenuProps = {
  /** The chat-title button (presses on it are not "outside"; focus returns to it). */
  anchor: HTMLElement | null
  /** Positioned container both menus render into and measure against. Default <body>. */
  layer?: HTMLElement | null
  /** Override the menu's position (default titleMenuPosition(anchor, layer)). */
  position?: MenuPosition
  /** Project names for Add to Project, resolved (fixtures PROJECT_PICKER drifts; see TITLE_MENU_PROJECTS). */
  projects: string[]
  /** The chat is pinned: the item reads "Unpin Chat". */
  pinned?: boolean
  /** Submenu state, for URL control (menu=title>add-to-project). Uncontrolled hover / keyboard still work. */
  submenuOpen?: boolean
  onSubmenuChange?: (open: boolean) => void
  /** Opened from the keyboard: focus moves into the menu (keyboardFocus(e) on the trigger's click). */
  autoFocus?: MenuFocus
  /** Escape, Tab, a press outside, focus moving out. */
  onClose: () => void
  /** An item was chosen. The menu does not close itself: close it here (or keep it open for a sub-flow). */
  onAction: (action: ChatTitleAction) => void
  /** Review only: draw one project row hovered, as chat-artifact 03 draws "Settings" (index 1). */
  hoverProject?: number
}

/**
 * Chat title menu (chat-artifact 03, inventory row 36): View files in Chat, Pin Chat, Rename, Add to Project ›, Archive,
 * Delete; Add to Project opens a 240-wide submenu with a search field, the user's projects and "+ Start a New Project".
 * Built on DropdownMenu / DropdownItem / useSubmenu: arrow keys, Home / End, ArrowRight into the submenu, ArrowLeft back,
 * Escape closes (focus back to the title), hover opens the submenu and leaving it closes it after 250ms.
 */
export function ChatTitleMenu({
  anchor, layer: layerProp, position, projects, pinned, submenuOpen, onSubmenuChange, autoFocus, onClose, onAction, hoverProject,
}: ChatTitleMenuProps) {
  const layer = layerProp ?? (typeof document !== 'undefined' ? document.body : null)
  const archiveFixed = useChatChromeFix('title-menu-archive-row')
  const menuRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const [subPos, setSubPos] = useState<MenuPosition>({ left: 0, top: 0 })
  const [query, setQuery] = useState('')

  // Add to Project opens 2px right of the menu, 6px below its item's top (menu right 294, submenu 296; item 140,
  // submenu 146); to the menu's left when there is no room; stacked under / over it at phone width.
  const placeSub = () => {
    if (!layer || !menuRef.current || !addRef.current) return
    const m = relativeBox(menuRef.current, layer)
    const item = relativeBox(addRef.current, layer)
    setSubPos({ left: m.right + 2, top: item.top + 6, before: m.left - 2, stack: { left: m.left, top: m.bottom + 2, above: m.top - 2 } })
  }
  const sub = useSubmenu({ onOpen: placeSub })

  // Placed under the title; placed again once the web fonts have loaded (the title's width changes when Geist arrives,
  // which matters for a menu opened from the URL on load) and when the window resizes.
  const [mainPos, setMainPos] = useState<MenuPosition | null>(position ?? null)
  useLayoutEffect(() => {
    if (position) { setMainPos(position); return }
    if (!anchor || !layer) return
    const place = () => { if (anchor.isConnected) setMainPos(titleMenuPosition(anchor, layer)) }
    place()
    let live = true
    document.fonts?.ready.then(() => { if (live) place() })
    window.addEventListener('resize', place)
    return () => { live = false; window.removeEventListener('resize', place) }
  }, [anchor, layer, position?.left, position?.top]) // `position` by value: callers may pass a fresh object each render
  // the submenu follows the menu when it moves (a frame later: DropdownMenu places itself in its own layout effect)
  useEffect(() => {
    if (!sub.open) return
    const raf = requestAnimationFrame(placeSub)
    return () => cancelAnimationFrame(raf)
  }, [mainPos?.left, mainPos?.top]) // by value, as above

  // URL control: open the submenu once the menu has rendered and can be measured
  const wantSub = !!submenuOpen
  useLayoutEffect(() => {
    if (!mainPos) return
    if (wantSub && !sub.open) sub.show()
    else if (!wantSub && submenuOpen !== undefined && sub.open) sub.close()
  }, [wantSub, mainPos]) // runs when the wanted state or the placed menu changes, not on every hover

  // report hover / keyboard changes back (for the URL)
  const reported = useRef(sub.open)
  useEffect(() => {
    if (reported.current === sub.open) return
    reported.current = sub.open
    onSubmenuChange?.(sub.open)
    if (!sub.open) setQuery('')
  }, [sub.open, onSubmenuChange])

  if (!mainPos) return null
  const q = query.trim().toLowerCase()
  const shown = projects.map((name, i) => ({ name, i })).filter(p => !q || p.name.toLowerCase().includes(q))
  const choose = (a: ChatTitleAction) => () => onAction(a)

  return (
    <>
      <DropdownMenu
        ref={menuRef}
        nodeId={CHAT_TITLE_MENU_NODES.menu}
        width={CHAT_TITLE_MENU_WIDTH}
        position={mainPos}
        anchor={anchor}
        autoFocus={autoFocus}
        portalTo={layer}
        onClose={onClose}
        aria-label="Chat actions"
        className="ctm"
      >
        <DropdownItem icon={viewFiles} label="View files in Chat" {...sub.siblingProps} onClick={choose({ type: 'view-files' })} />
        <DropdownItem icon={menuIcons.pin} label={pinned ? 'Unpin Chat' : 'Pin Chat'} {...sub.siblingProps} onClick={choose({ type: 'pin' })} />
        <DropdownItem icon={menuIcons.pencil} label="Rename" {...sub.siblingProps} onClick={choose({ type: 'rename' })} />
        <DropdownItem ref={addRef} icon={menuIcons.folder} label="Add to Project" submenu className="ctm__add" {...sub.triggerProps} />
        {archiveFixed ? (
          <DropdownItem icon={menuIcons.archive} label="Archive" {...sub.siblingProps} onClick={choose({ type: 'archive' })} />
        ) : (
          // as drawn: a Size=md row (36 tall, Text sm) with the placeholder circle (fix title-menu-archive-row)
          <DropdownItem icon={archiveCircle} label="Archive" className="ctm__archive-md" {...sub.siblingProps} onClick={choose({ type: 'archive' })} />
        )}
        <DropdownSeparator size="md" />
        <DropdownItem icon={menuIcons.trash} label="Delete" danger {...sub.siblingProps} onClick={choose({ type: 'delete' })} />
      </DropdownMenu>
      {sub.open && (
        <DropdownMenu
          nodeId={CHAT_TITLE_MENU_NODES.submenu}
          width={ADD_TO_PROJECT_WIDTH}
          position={subPos}
          anchor={addRef.current}
          portalTo={layer}
          onClose={onClose}
          search={{ placeholder: 'Search', 'aria-label': 'Search projects', value: query, onChange: setQuery }}
          aria-label="Add to Project"
          className="ctm-sub"
          {...sub.menuProps}
        >
          {shown.map(p => (
            <DropdownItem
              key={`${p.name}-${p.i}`}
              icon={menuIcons.folderSolid}
              label={p.name}
              className={cx(hoverProject === p.i && 'is-hover')}
              onClick={choose({ type: 'add-to-project', project: p.name })}
            />
          ))}
          {shown.length > 0 && <DropdownSeparator />}
          <DropdownItem icon={menuIcons.plus} label="Start a New Project" onClick={choose({ type: 'new-project' })} />
        </DropdownMenu>
      )}
    </>
  )
}
