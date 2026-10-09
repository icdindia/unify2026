import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode, type Ref } from 'react'
import { cx } from '../buttons/cx'
import { AvatarGroup } from '../avatar/AvatarGroup'
import type { AvatarColour } from '../avatar/Avatar'
import { Pill } from '../pill/Pill'
import { keyboardFocus, openMenuOnArrowDown, type MenuFocus } from '../dropdown-menu'
import { ChatTitleMenu, type ChatTitleAction } from '../chat-title-menu/ChatTitleMenu'
import { AccessPopover, type AccessPerson } from './AccessPopover'
import { CostPill, type CostRingState } from './CostPill'
import { ChevronDown14, Clipboard16, Comment16, Lock14, Users14 } from './icons'
import { useChatChromeFix } from './fixes'
import './chat-header.css'

/** "ES Breadcrumb" component set (Variant=Default 1097:162685). */
export const ES_BREADCRUMB_SET = '1097:162688'

/**
 * The ES Breadcrumb instance each chat-artifact step draws (figma-console 2026-10-09), for data-node-id. Steps 13 and 16
 * stack two instances; the one on top is listed.
 */
export const CHAT_HEADER_INSTANCES: Record<string, string> = {
  '03': '1707:245447', '08': '5865:366539', '09': 'I1809:442920;5865:366539', '10': '1731:255804', '11': '7062:513327',
  '12': '7062:513389', '13': '7062:513451', '14': '7062:513513', '15': '6424:330354', '16': '7062:513699', '17': '7062:513765',
  '18': '14607:403131', '19': 'I13722:383352;6424:330601', '20': '6424:330601',
  c06: '6077:427818', c07: '6077:427883',
}

export type ChatHeaderPerson = { id?: string; name: string; initial?: string; colour?: AvatarColour }

/** A control the review harness can pin in its hover state (hover=title is header-dropdowns c07). */
export type ChatHeaderHover = 'title' | 'cost' | 'share' | 'files' | 'comments' | 'people'

export type ChatHeaderTitleMenu = {
  /** Controlled open state (menu=title…). Leave undefined to let the header own it. */
  open?: boolean
  /** Add to Project submenu (menu=title>add-to-project). */
  submenuOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmenuChange?: (open: boolean) => void
  /** Resolved project names (useResolved(TITLE_MENU_PROJECTS)). */
  projects: string[]
  pinned?: boolean
  /** An item was chosen; the header closes the menu afterwards. */
  onAction: (action: ChatTitleAction) => void
  /** Review only: the hovered project row (chat-artifact 03 hovers index 1, "Settings"). */
  hoverProject?: number
}

export type ChatHeaderAccess = {
  /** Rows of the people-with-access popover (owner first). */
  people: AccessPerson[]
  /** Pinned open (pop=access, or a click). Hovering the stack also shows it, without changing this. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** "Manage access" (fix access-popover-manage) — usually opens the share modal. */
  onManage?: () => void
}

export type ChatHeaderProps = {
  /** The chat title ("How does commit actually look?"). */
  title: string
  /**
   * default: the full-width strip over the chat (1384 at the collapsed rail). split: the chat column of the artifact
   * split (6424:330601): the title button fills the column and ellipsizes, and the avatar stack is not drawn (fix
   * header-split-avatars keeps it).
   */
  variant?: 'default' | 'split'
  /** Collaborators in the avatar stack, viewer excluded (M J G from step 10). Empty: no stack (03-09). */
  people?: ChatHeaderPerson[]
  /** Everyone the stack stands for, when `people` is only the first page (the counter reads total - shown). */
  peopleTotal?: number
  /** Faces before "+N" (Q40: 10 in the header; the split column shows 3). */
  maxPeople?: number
  /** Share's icon: lock until the chat is shared, people after (step 10 annotation). Default: people.length > 0. */
  shared?: boolean
  /** The cost pill; null hides it. */
  cost?: { label: string; state: CostRingState; ringAsDrawn?: CostRingState; fraction?: number } | null
  /** Count on the files (clipboard) icon ("2" in step 16). */
  filesBadge?: number
  /** The comments icon (Q32: only when the chat has commenters or comments). `count` draws the badge (collab 10). */
  comments?: { count?: number } | null
  titleMenu?: ChatHeaderTitleMenu
  access?: ChatHeaderAccess
  onShare?: (button: HTMLButtonElement) => void
  /** Files panel trigger (FilesPanel anchors to the button). */
  onFiles?: (button: HTMLButtonElement) => void
  filesOpen?: boolean
  onComments?: (button: HTMLButtonElement) => void
  commentsOpen?: boolean
  /** Cost popover: click pins it, hover previews it (CostPopover, inventory row 37). */
  onCost?: (button: HTMLButtonElement) => void
  onCostHover?: (button: HTMLButtonElement | null) => void
  costOpen?: boolean
  /** Refs to the controls, for overlays opened from the URL (anchor without a click). */
  controlRefs?: Partial<Record<'title' | 'people' | 'cost' | 'share' | 'files' | 'comments', Ref<HTMLButtonElement>>>
  /** Review only: pin a control's hover state. */
  hover?: ChatHeaderHover | null
  /** Positioned container the title menu and the access popover render into. Default <body> (the header does not scroll). */
  menuLayer?: HTMLElement | null
  /** Extra controls after the built-in ones (rare). */
  children?: ReactNode
  /** Figma node of this ES Breadcrumb instance (see CHAT_HEADER_INSTANCES). */
  nodeId?: string
  className?: string
}

/**
 * A callback ref that keeps the node in state (overlays opened from the URL need their anchor on the render after
 * mount) and forwards it to a caller's ref, object or callback.
 */
function useNodeRef(outer: Ref<HTMLButtonElement> | undefined) {
  const [node, setNode] = useState<HTMLButtonElement | null>(null)
  const outerRef = useRef(outer)
  outerRef.current = outer
  const set = useCallback((el: HTMLButtonElement | null) => {
    setNode(el)
    const o = outerRef.current
    if (typeof o === 'function') o(el)
    else if (o) o.current = el
  }, [])
  return [node, set] as const
}

/**
 * ES Breadcrumb of a chat (inventory row 4; chat-artifact 03, 08-20; header-dropdowns c06 / c07): the chat title with
 * its menu on the left; collaborator stack, cost pill, Share, files and comments on the right. 40 tall (6 / 12),
 * 40px between the title and the right group, which is the stack, 6, then the actions 2 apart.
 */
export function ChatHeader({
  title, variant = 'default', people = [], peopleTotal, maxPeople, shared, cost, filesBadge, comments, titleMenu, access,
  onShare, onFiles, filesOpen, onComments, commentsOpen, onCost, onCostHover, costOpen, controlRefs, hover, menuLayer,
  children, nodeId = ES_BREADCRUMB_SET, className,
}: ChatHeaderProps) {
  const split = variant === 'split'
  const keepSplitAvatars = useChatChromeFix('header-split-avatars')
  const pressedFix = useChatChromeFix('header-files-pressed')
  const steadyTitle = useChatChromeFix('title-hover-keeps-size')
  const layer = menuLayer ?? (typeof document !== 'undefined' ? document.body : null)

  const [titleEl, setTitleEl] = useNodeRef(controlRefs?.title)
  const [peopleEl, setPeopleEl] = useNodeRef(controlRefs?.people)
  const [, setCostEl] = useNodeRef(controlRefs?.cost)
  const [, setShareEl] = useNodeRef(controlRefs?.share)
  const [, setFilesEl] = useNodeRef(controlRefs?.files)
  const [, setCommentsEl] = useNodeRef(controlRefs?.comments)

  // ---- title menu: controlled when titleMenu.open is given, else owned here
  const [ownMenu, setOwnMenu] = useState(false)
  const [menuFocus, setMenuFocus] = useState<MenuFocus | undefined>()
  const menuOpen = titleMenu ? (titleMenu.open ?? ownMenu) : false
  const setMenu = (open: boolean) => {
    if (titleMenu?.open === undefined) setOwnMenu(open)
    titleMenu?.onOpenChange?.(open)
  }
  const onTitle = (e: MouseEvent<HTMLButtonElement>) => {
    if (!titleMenu) return
    setMenuFocus(menuOpen ? undefined : keyboardFocus(e))
    setMenu(!menuOpen)
  }

  // ---- access popover: pinned (controlled or by click) or previewed while hovering the stack or the card
  const [ownPinned, setOwnPinned] = useState(false)
  const pinned = access ? (access.open ?? ownPinned) : false
  const setPinned = (open: boolean) => {
    if (access?.open === undefined) setOwnPinned(open)
    access?.onOpenChange?.(open)
  }
  const [hovering, setHovering] = useState(false)
  const [accessFocus, setAccessFocus] = useState(false)
  const leaveTimer = useRef<number | undefined>(undefined)
  const enter = () => { window.clearTimeout(leaveTimer.current); setHovering(true) }
  const leave = () => { window.clearTimeout(leaveTimer.current); leaveTimer.current = window.setTimeout(() => setHovering(false), 200) }
  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])
  const accessShown = !!access && (pinned || hovering)
  // Popover places itself when it opens (and on resize / scroll); one opened from the URL on load is placed again once
  // the web fonts have loaded and the header has its final widths
  const [fontsReady, setFontsReady] = useState(false)
  useEffect(() => {
    let live = true
    if (!document.fonts) { setFontsReady(true); return }
    document.fonts.ready.then(() => { if (live) setFontsReady(true) })
    return () => { live = false }
  }, [])

  const showStack = people.length > 0 && (!split || keepSplitAvatars)
  const isShared = shared ?? people.length > 0
  const pin = (h: ChatHeaderHover) => (hover === h ? 'is-hover' : undefined)
  const filesPressedLook = filesOpen ? (split && !pressedFix ? 'is-open' : 'is-open is-selected') : undefined

  return (
    <header className={cx('chh', `chh--${variant}`, className)} data-node-id={nodeId}>
      <div className="chh__content">
        <button
          ref={setTitleEl}
          type="button"
          className={cx('chh-title', menuOpen && 'is-open', steadyTitle && 'chh-title--steady', pin('title'))}
          aria-haspopup={titleMenu ? 'menu' : undefined}
          aria-expanded={titleMenu ? menuOpen : undefined}
          aria-label={titleMenu ? `${title}, chat actions` : undefined}
          onClick={onTitle}
          onKeyDown={titleMenu ? openMenuOnArrowDown : undefined}
          data-node-id="I1731:255804;1097:162629"
        >
          <span className="chh-title__t">{title}</span>
          {titleMenu && <ChevronDown14 className="chh-title__chev" />}
        </button>
      </div>

      <div className="chh__right">
        {showStack && (
          <button
            ref={setPeopleEl}
            type="button"
            className={cx('chh-people', pin('people'))}
            aria-label={`People with access: ${people.map(p => p.name).join(', ')}`}
            aria-haspopup={access ? 'dialog' : undefined}
            aria-expanded={access ? accessShown : undefined}
            onClick={e => {
              if (!access) return
              setAccessFocus(e.detail === 0)
              setPinned(!pinned)
              if (pinned) setHovering(false)
            }}
            onPointerEnter={access ? enter : undefined}
            onPointerLeave={access ? leave : undefined}
            data-node-id="I1731:255804;3525:255493"
          >
            <AvatarGroup
              people={people} size="xs" max={maxPeople ?? (split ? 3 : 10)} total={peopleTotal} titles={false}
              aria-hidden="true" nodeId="8020:431296"
            />
          </button>
        )}
        <div className="chh__actions">
          {cost && (
            <CostPill
              ref={setCostEl}
              label={cost.label} state={cost.state} ringAsDrawn={cost.ringAsDrawn} fraction={cost.fraction} open={costOpen}
              className={pin('cost')}
              onClick={e => onCost?.(e.currentTarget)}
              onPointerEnter={onCostHover ? e => onCostHover(e.currentTarget) : undefined}
              onPointerLeave={onCostHover ? () => onCostHover(null) : undefined}
            />
          )}
          <button
            ref={setShareEl}
            type="button"
            className={cx('chh-share', pin('share'))}
            aria-haspopup="dialog"
            onClick={e => onShare?.(e.currentTarget)}
            data-node-id="I1731:255804;5865:363674"
          >
            {isShared ? <Users14 className="chh-share__i" /> : <Lock14 className="chh-share__i" />}
            <span className="chh-share__t">Share</span>
          </button>
          <button
            ref={setFilesEl}
            type="button"
            className={cx('chh-icon', filesPressedLook, pin('files'))}
            aria-label={filesBadge ? `Files in this chat, ${filesBadge} new` : 'Files in this chat'}
            aria-expanded={filesOpen ?? false}
            onClick={e => onFiles?.(e.currentTarget)}
            data-node-id="I1731:255804;12909:604991"
          >
            <Clipboard16 />
            {!!filesBadge && <Pill className="chh-badge" aria-hidden="true">{filesBadge}</Pill>}
          </button>
          {comments && (
            <button
              ref={setCommentsEl}
              type="button"
              className={cx('chh-icon', commentsOpen && 'is-open', pin('comments'))}
              aria-label={comments.count ? `Comments, ${comments.count}` : 'Comments'}
              aria-expanded={commentsOpen ?? false}
              onClick={e => onComments?.(e.currentTarget)}
              data-node-id="I1731:255804;5865:363677"
            >
              <Comment16 />
              {!!comments.count && <Pill className="chh-badge" aria-hidden="true">{comments.count}</Pill>}
            </button>
          )}
          {children}
        </div>
      </div>

      {titleMenu && menuOpen && titleEl && (
        <ChatTitleMenu
          anchor={titleEl}
          layer={layer}
          projects={titleMenu.projects}
          pinned={titleMenu.pinned}
          submenuOpen={titleMenu.submenuOpen}
          onSubmenuChange={titleMenu.onSubmenuChange}
          autoFocus={menuFocus}
          hoverProject={titleMenu.hoverProject}
          onClose={() => setMenu(false)}
          onAction={a => { setMenu(false); titleMenu.onAction(a) }}
        />
      )}
      {access && (
        <AccessPopover
          key={fontsReady ? 'fonts' : 'fallback'}
          open={accessShown}
          anchor={peopleEl}
          people={access.people}
          portalTo={layer}
          autoFocus={accessFocus}
          onManage={access.onManage ? () => { setPinned(false); setHovering(false); access.onManage?.() } : undefined}
          onClose={() => { setHovering(false); if (pinned) setPinned(false) }}
          onPointerEnter={enter}
          onPointerLeave={leave}
        />
      )}
    </header>
  )
}
