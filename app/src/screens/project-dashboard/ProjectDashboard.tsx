import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  BrandButton, ButtonGroup, Composer, PageHeader, Tabs, cx, keyboardFocus, menuBelow, relativeBox, tabIcons, useSubmenu,
  type MenuFocus, type MenuPosition, type TabItem,
} from '../../components'
import { useMenuLayer } from '../../shell/AppShell'
import { PROJECT_DESCRIPTION, type Project } from '../../data/projects'
import { chatsAsDrawn, chatsNewestFirst, type Chat } from '../../data/chats'
import { useProjectFixes } from '../../fixes/projects'
import { whenFontsReady, type PageOption, type ReviewState } from '../../review/reviewState'
import { ChatFilters } from './ChatFilters'
import { ChatTable } from './ChatTable'
import { HeaderMenu, MoveToProjectMenu, RowMenu } from './menus'
import './project-dashboard.css'

// Tab labels with the option 2 pills' whole-pixel "Text padding" widths from the file.
const TABS: TabItem[] = [
  { id: 'chats', label: 'Chats', icon: tabIcons.chats, textWidth: 37 },
  { id: 'routines', label: 'Routines', icon: tabIcons.routines, textWidth: 54 },
  { id: 'artifacts', label: 'Artifacts', icon: tabIcons.artifacts, textWidth: 53 },
  { id: 'files', label: 'Files', icon: tabIcons.files, textWidth: 31 },
  { id: 'settings', label: 'Settings', icon: tabIcons.settings, textWidth: 51 },
]

const ROW_MENU_WIDTH = 170
/** Row 3 is the one the frame draws hovered, and the one its menus hang from. */
const FRAME_ROW = 2

/** An open menu: its trigger, where it goes, and whether it opened from the keyboard (focus moves into it). */
type OpenMenu = { anchor: HTMLElement; position: MenuPosition; focus?: MenuFocus }

export type ProjectDashboardProps = {
  project: Project
  /** Inside page option 1 (14045:584747) or 2 (15054:105151). */
  option: PageOption
  review: ReviewState | null
}

/**
 * Project dashboard, "Dashboard" 14045:584747 (option 1) / 15054:105151 (option 2): title + pin / ⋮ / Share,
 * description, composer, the Chats / Routines / … toolbar with filter and sort, and the chats table.
 * Menus: header ⋮ (Edit Details / Archive / Delete), row ⋮ (Pin / Rename / Add to Project › / Log out).
 * Only the Chats tab is designed, so the tabs, filter and sort are drawn but not wired, as in the HTML prototype.
 * "With fixes" applies the prototype's UX pass, one fix each in src/fixes/projects.ts.
 */
export function ProjectDashboard({ project, option, review }: ProjectDashboardProps) {
  const layer = useMenuLayer()
  const fx = useProjectFixes()
  const newestFirst = fx('chats-newest-first')
  const chats = useMemo(() => (newestFirst ? chatsNewestFirst() : chatsAsDrawn()), [newestFirst])
  const o2 = option === 2
  // the frame is drawn once, for "Client Onboarding": a project opened from a card keeps that title as designed
  const title = fx('crumb-shows-project-name') ? project.name : project.titleAsDesigned ?? project.name

  const [header, setHeader] = useState<OpenMenu | null>(null)
  const [row, setRow] = useState<(OpenMenu & { chatId: string }) | null>(null)
  const [moveQuery, setMoveQuery] = useState('')
  const [subPosition, setSubPosition] = useState<MenuPosition>({ left: 0, top: 0 })
  const headerButton = useRef<HTMLButtonElement>(null)
  const rowButtons = useRef(new Map<string, HTMLButtonElement>())
  const rowMenu = useRef<HTMLDivElement>(null)
  const subMenu = useRef<HTMLDivElement>(null)
  const moveItem = useRef<HTMLButtonElement>(null)

  // "Move to project" opens 3px right of the row menu, 2.2px above its item, or to its left when there is no room.
  // When neither side has room (a phone-width page) it stacks 3px under the row menu, or over it, never on top of it.
  const sub = useSubmenu({
    onOpen: () => {
      if (!layer || !rowMenu.current || !moveItem.current) return
      const m = relativeBox(rowMenu.current, layer)
      const item = relativeBox(moveItem.current, layer)
      setSubPosition({ left: m.right + 3, top: item.top - 2.2, before: m.left - 3, stack: { left: m.left, top: m.bottom + 3, above: m.top - 3 } })
    },
  })

  const closeAll = () => {
    setHeader(null)
    setRow(null)
    setMoveQuery('')
    sub.close()
  }

  const openHeader = (button: HTMLElement, focus?: MenuFocus) => {
    if (!layer) return
    // both files put the menu at x1160 y121: under the 24px button at 1161,90 (option 1) or the 28px one at 1154,88 (option 2)
    const b = relativeBox(button, layer)
    const gap = o2 ? 5 : 7
    setHeader({ anchor: button, focus, position: { left: b.left + (o2 ? 6 : -1), top: b.bottom + gap, above: b.top - gap } })
  }
  const openRow = (chat: Chat, button: HTMLElement, focus?: MenuFocus) => {
    if (!layer) return
    // right edge on the button's right edge, 4px below it; opens upward near the bottom of the view
    setRow({ chatId: chat.id, anchor: button, focus, position: menuBelow(relativeBox(button, layer), ROW_MENU_WIDTH) })
  }

  // ?state=menus: all three menus open at once (the row menu on row 3, its submenu, the header menu with its
  // first item hovered), as drawn in the file. They are measured once the web fonts have loaded, as a real click
  // would be (the header buttons move ~0.4px when Geist arrives). Step 1 draws row 3 active first, so its ⋮ is laid
  // out before it is measured (as designed the ⋮ is display: none until the row is hovered, focused or active).
  // The submenu is placed against the row menu, so it opens only once the row menu has rendered (step 2) and then
  // placed itself, which lands one commit later (step 3).
  const pinMenus = review === 'menus'
  const [pinStep, setPinStep] = useState(0)
  useEffect(() => {
    if (!pinMenus || !layer) return
    return whenFontsReady(() => setPinStep(1))
  }, [pinMenus, layer]) // runs once the menu layer exists
  useLayoutEffect(() => {
    if (pinStep === 1) {
      const rowButton = rowButtons.current.get(chats[FRAME_ROW].id)
      if (rowButton) openRow(chats[FRAME_ROW], rowButton)
      if (headerButton.current) openHeader(headerButton.current)
      setPinStep(2)
    } else if (pinStep === 2 && rowMenu.current) setPinStep(3)
    else if (pinStep === 3) {
      setPinStep(0)
      sub.show()
    }
  }, [pinStep, row])

  // the column re-centres when the window resizes, so an open menu would be left behind: close it, as native menus do
  const anyOpen = !!header || !!row
  useEffect(() => {
    if (!anyOpen) return
    window.addEventListener('resize', closeAll)
    return () => window.removeEventListener('resize', closeAll)
  }, [anyOpen]) // closeAll only calls state setters

  const pinFrame = review === 'frame'

  return (
    <div
      className={cx(
        'pd', o2 && 'pd--o2', fx('table-gap-plus-12') && 'pd--fx-gap12', fx('tabs-natural-width') && 'pd--fx-tabs',
        fx('o2-routines-label-rest') && 'pd--fx-pill-rest',
      )}
      data-node-id="I14045:584747;901:211753"
    >
      <PageHeader
        size={o2 ? 'sm' : 'xs'}
        title={title}
        description={o2 ? PROJECT_DESCRIPTION.short : PROJECT_DESCRIPTION.long}
        moreRef={headerButton}
        moreExpanded={!!header}
        onMore={e => {
          const wasOpen = !!header
          closeAll()
          if (!wasOpen) openHeader(e.currentTarget, keyboardFocus(e))
        }}
      />

      <Composer className="pd__composer" />

      {o2 ? (
        <div className="pd__toolbar pd__toolbar--o2" data-node-id="15054:106857">
          <Tabs variant="pill" items={TABS} selected="chats" aria-label="Project sections" />
          <ButtonGroup>
            <BrandButton chevron textWidth={19} label="All" aria-label="Filter chats: All" />
            <BrandButton chevron chevronPadding="sm" textWidth={47} label="Newest" aria-label="Sort chats: Newest first" />
          </ButtonGroup>
        </div>
      ) : (
        <div className="pd__toolbar">
          <Tabs items={TABS} selected="chats" aria-label="Project sections" pinnedHover={pinFrame ? 'routines' : undefined} />
          <ChatFilters pinnedHover={pinFrame} />
        </div>
      )}

      <ChatTable
        className="pd__table"
        chats={chats}
        menuFor={row?.chatId ?? (pinStep === 1 ? chats[FRAME_ROW].id : undefined)}
        pinnedHoverRow={pinFrame ? FRAME_ROW : undefined}
        rowMenuRef={id => el => {
          if (el) rowButtons.current.set(id, el)
          else rowButtons.current.delete(id)
        }}
        onRowMenu={(chat, e) => {
          const wasOpen = row?.chatId === chat.id
          closeAll()
          if (!wasOpen) openRow(chat, e.currentTarget, keyboardFocus(e))
        }}
      />

      {header && (
        <HeaderMenu position={header.position} anchor={header.anchor} autoFocus={header.focus} layer={layer} onClose={closeAll} onChoose={closeAll}
                    pinnedHover={pinMenus} />
      )}
      {row && (
        <RowMenu
          position={row.position}
          anchor={row.anchor}
          autoFocus={row.focus}
          layer={layer}
          menuRef={rowMenu}
          moveRef={moveItem}
          onClose={closeAll}
          onChoose={closeAll}
          siblingProps={sub.siblingProps}
          moveProps={sub.triggerProps}
        />
      )}
      {row && sub.open && (
        <MoveToProjectMenu
          position={subPosition}
          anchor={row.anchor} // Esc or Tab from the submenu returns focus to the row's ⋮ (the row menu closes too)
          autoFocus={sub.menuProps.autoFocus}
          layer={layer}
          menuRef={subMenu}
          query={moveQuery}
          onQuery={setMoveQuery}
          onClose={closeAll}
          onChoose={closeAll}
          onKeyDown={sub.menuProps.onKeyDown}
          onMouseEnter={sub.menuProps.onMouseEnter}
          onMouseLeave={() => {
            // keep it open while its search field has focus
            if (!subMenu.current?.contains(document.activeElement)) sub.menuProps.onMouseLeave()
          }}
        />
      )}
    </div>
  )
}
