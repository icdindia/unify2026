import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState,
  type ChangeEvent, type KeyboardEvent, type MouseEvent, type ReactNode,
} from 'react'
import { cx } from '../buttons/cx'
import { IconButton } from '../buttons/IconButton'
import { DropdownItem, DropdownMenu, DropdownSeparator, keyboardFocus, menuBelow, openMenuOnArrowDown, relativeBox, type MenuFocus } from '../dropdown-menu'
import { ToggleGroup } from '../form/ToggleGroup'
import { Eye14, Code14 } from '../form/icons'
import { isImeKey } from '../form/ime'
import { Tooltip, useTooltip } from '../overlays'
import type { HeaderIcon } from '../../fixtures/artifacts'
import { useArtifactFix } from './fixes'
import { TYPE_ICONS } from './typeIcons'
import { VersionMenu, type ArtifactVersionRow } from './VersionMenu'
import {
  AiStar14, ChevronDown12, ChevronDown14, ChevronLeft16, Close16, Comment16, Copy16, Download16, Maximize16, Minimize16, Play14, Refresh16,
} from './icons'
import './artifact-header.css'

/** The main component "Arifact Header" (sic) 3805:105688. Instances: 3838:245967 (step 20), 4376:395816 (21),
 *  6405:306289 (21a), 6424:336265 (21b), 3805:106484 (22). */
export const ARTIFACT_HEADER_NODE = '3805:105688'

export type ArtifactView = 'preview' | 'code'

/** Which tools sit left of "v3" as Figma draws them: preview / code + copy (step 20), or copy + refresh (21, 21a, 21b, 22). */
export type ArtifactHeaderIconSet = 'preview' | 'refresh'

/**
 * Where the header's menus render (a positioned element) and whether it is the page header. ArtifactPanel
 * (components/split-view) provides it; without it the header renders its menus inside itself.
 */
export const ArtifactPanelContext = createContext<{ container: HTMLElement | null; full: boolean; stacked?: boolean } | null>(null)

export type ArtifactHeaderProps = {
  /** The artifact's name ("Untitled.xls" as drawn, "Pipeline Command" with fixes: resolve the fixture's headerName). */
  name: string
  /** Type mark ("Artifact-Icons / Type=…"). */
  icon: HeaderIcon
  /** 'split': the bar of the panel card (927 at 1440). 'full': the page header when expanded (step 22): the name gets its
   *  chevron and expand becomes collapse. Default: from the enclosing ArtifactPanel / SplitView, else 'split'. */
  variant?: 'split' | 'full'
  /** An App / HTML artifact: with fixes on, the preview / code toggle shows only for these (Q7). */
  interactive?: boolean
  /** As designed, the tools left of "v3" (see ArtifactHeaderIconSet). Default: 'refresh' while the version menu is open,
   *  the name is hovered (pinned) or renamed, or the header is full; else 'preview'. Ignored with fixes on. */
  iconSet?: ArtifactHeaderIconSet

  view?: ArtifactView
  onViewChange?: (view: ArtifactView) => void

  /** Version list, newest first. The button reads "v<current>". */
  versions?: readonly ArtifactVersionRow[]
  /** The version on the canvas. Default: the newest. */
  version?: number
  onVersionChange?: (n: number) => void
  /** Version menu open (controlled; review state menu=version). Omit to let the header own it. */
  menuOpen?: boolean
  onMenuOpenChange?: (open: boolean) => void

  /** Rename field showing (controlled; review state edit=name). Omit to let the header own it. */
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  /** Text the rename field starts with instead of the name (chat-artifact 21b draws "Untitled name here.xls"). */
  draft?: string
  /** Enter or blur with a changed, non-empty name. Escape cancels. */
  onRename?: (name: string) => void
  /** Pin the name's hover state (review hover=artifact-name, 21a); real :hover works without it. */
  nameHover?: boolean
  /** Move focus into the rename field when it opens (default true; a gallery specimen pinned in edit turns it off). */
  focusOnEdit?: boolean

  onCopy?: () => void
  onRefresh?: () => void
  onPublish?: () => void
  /** Comment mode (the comments split's left half is a toggle). */
  commentsOn?: boolean
  onComment?: () => void
  /** The comments split's chevron (e.g. "Show resolved"). Always drawn; it gets the chevron as its anchor. */
  onCommentMenu?: (anchor: HTMLElement) => void
  onDownload?: (anchor: HTMLElement) => void
  /** Expand (split → full) or collapse (full → split). */
  onToggleFull?: () => void
  onClose?: () => void
  /** Hide expand / collapse (the artifact opened over the chat on a narrow screen has nowhere to collapse to). */
  noExpand?: boolean

  /** The artifact page (opened from the Artifacts landing, 7809:278865 / 13750:301988 / 5310:276790): the tool set without
   *  copy, the version button and expand; close only when onClose is given. */
  page?: boolean
  /** Back to where the artifact was opened from (from=artifacts): a chevron-left xs button before the mark (7809:278865, 12195:302725). */
  onBack?: () => void
  /** Pin the back button's hover (review hover=back, 13155:271308). */
  backHover?: boolean
  /** The chat button after the name (Buttons/Button Neutral sm tertiary with ai-star 14, I7809:279754;6303:301118):
   *  "Edit with Chat" when the artifact has a chat, "Start Chat" for a fresh clone (13750:301988, Q59). */
  cta?: { label: string; onClick?: () => void }
  /** The name opens a menu (Rename, Clone, Versions, Delete) instead of renaming in place. Gets the name button. */
  onNameMenu?: (anchor: HTMLElement, focus?: MenuFocus) => void
  nameMenuOpen?: boolean

  nodeId?: string
  className?: string
}

/** Controlled when `value` is given, else internal state. */
function useControllable<T>(value: T | undefined, onChange: ((v: T) => void) | undefined, initial: T): [T, (v: T) => void] {
  const [inner, setInner] = useState(initial)
  const current = value === undefined ? inner : value
  const set = useCallback((v: T) => { setInner(v); onChange?.(v) }, [onChange])
  return [current, set]
}

/** The name minus its extension: what the rename field selects first. */
const stemEnd = (s: string) => { const i = s.lastIndexOf('.'); return i > 0 ? i : s.length }

const MAX_NAME = 120 // Q59 default

/**
 * Arifact Header (3805:105688): the artifact panel's top bar, in the split (steps 19-21b) and as the page header when the
 * artifact is expanded (22). Left: the type mark and the name, a button that renames in place (Enter or blur commits,
 * Escape cancels; a truncated name shows in full in a tooltip). Right: preview / code, copy, refresh, the "v3" version
 * menu, Publish, comments (split button), download, expand / collapse and close. Narrow headers fold copy, refresh,
 * preview / code and download into a "More" menu.
 */
export function ArtifactHeader(props: ArtifactHeaderProps) {
  const {
    name, icon, interactive = true, iconSet, view = 'preview', onViewChange, versions = [], version, onVersionChange,
    draft, onRename, nameHover, focusOnEdit = true, onCopy, onRefresh, onPublish, commentsOn, onComment, onCommentMenu, onDownload,
    onToggleFull, onClose, page = false, onBack, backHover, cta, onNameMenu, nameMenuOpen, nodeId, className,
  } = props
  const panel = useContext(ArtifactPanelContext)
  const noExpand = page || (props.noExpand ?? !!panel?.stacked)
  const full = (props.variant ?? (panel?.full ? 'full' : 'split')) === 'full'
  const oneSet = useArtifactFix('artifact-header-one-icon-set')
  const oneSize = useArtifactFix('artifact-name-one-size')

  const [menuOpen, setMenuOpen] = useControllable(props.menuOpen, props.onMenuOpenChange, false)
  const [editing, setEditing] = useControllable(props.editing, props.onEditingChange, false)
  const [menuFocus, setMenuFocus] = useState<MenuFocus | undefined>()
  const [more, setMore] = useState<{ focus?: MenuFocus } | null>(null)

  const root = useRef<HTMLDivElement>(null)
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null)
  const setRoot = useCallback((el: HTMLDivElement | null) => { root.current = el; setRootEl(el) }, [])
  const [verBtn, setVerBtn] = useState<HTMLButtonElement | null>(null)
  const [moreBtn, setMoreBtn] = useState<HTMLButtonElement | null>(null)
  const container = panel?.container ?? rootEl

  // ---- which tools show
  const drawn: ArtifactHeaderIconSet = iconSet ?? (full || menuOpen || editing || nameHover ? 'refresh' : 'preview')
  const showToggle = !page && (oneSet ? interactive : drawn === 'preview')
  const showRefresh = page || oneSet || drawn === 'refresh'
  // step 20 (the plain split) draws the grey .md mark where 21-22 draw the blue document (fix artifact-header-one-icon-set)
  const typeIcon: HeaderIcon = !oneSet && drawn === 'preview' && icon === 'Documents' ? 'Markdowns' : icon

  const latest = versions.length ? Math.max(...versions.map(v => v.n)) : 1
  const current = version ?? latest

  // ---- name: truncation tooltip, rename
  const nameBtn = useRef<HTMLButtonElement | null>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = useState(false)
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [name, editing, full, oneSize])
  const tip = useTooltip({ text: name, arrow: 'top-left', disabled: !truncated || editing, nodeId: '7418:306089' })
  const tipRef = tip.triggerProps.ref // a useState setter: stable
  const setNameBtn = useCallback((el: HTMLButtonElement | null) => { nameBtn.current = el; tipRef(el) }, [tipRef])

  const [text, setText] = useState(name)
  const input = useRef<HTMLInputElement>(null)
  const settled = useRef(false) // Enter / Escape already ended this edit, so the blur that follows does nothing
  const refocus = useRef(false) // hand focus back to the name button once it is back
  const wasEditing = useRef(false) // false at mount, so a header that mounts in edit (edit=name) still seeds the field
  useLayoutEffect(() => {
    if (editing && !wasEditing.current) {
      // entering edit: start from the draft (review state) or the name, stem selected so typing replaces it
      const start = draft ?? name
      setText(start)
      settled.current = false
    }
    wasEditing.current = editing
  }, [editing, draft, name])
  useEffect(() => {
    if (!editing || !focusOnEdit) return
    const el = input.current
    if (!el) return
    el.focus({ preventScroll: true })
    const end = stemEnd(el.value)
    if (draft !== undefined) el.setSelectionRange(end, end) // 21b: caret before ".xls"
    else el.setSelectionRange(0, end)
  }, [editing, draft, focusOnEdit])
  useEffect(() => {
    if (!editing && refocus.current) { refocus.current = false; nameBtn.current?.focus() }
  }, [editing])

  const finish = (save: boolean, returnFocus: boolean) => {
    if (settled.current) return
    settled.current = true
    const next = text.trim().slice(0, MAX_NAME)
    if (save && next && next !== name) onRename?.(next)
    refocus.current = returnFocus
    setEditing(false)
  }
  const onFieldKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isImeKey(e)) return
    if (e.key === 'Enter') { e.preventDefault(); finish(true, true) }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false, true) }
  }

  // ---- version menu
  const toggleMenu = (e: MouseEvent) => {
    setMenuFocus(keyboardFocus(e))
    setMenuOpen(!menuOpen)
  }
  const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen])

  const nameLabel = onNameMenu ? `${name}, options` : `${name}, rename`
  const cls = cx('ahdr', full ? 'ahdr--full' : 'ahdr--split', oneSize && 'ahdr--one-size', className)

  const tool = (label: string, onClick: (() => void) | undefined, glyph: ReactNode, extra?: { className?: string; nodeId?: string }) => (
    <Tooltip text={label} arrow="top-center">
      <IconButton size="sm" aria-label={label} className={extra?.className} nodeId={extra?.nodeId} onClick={onClick}>{glyph}</IconButton>
    </Tooltip>
  )

  return (
    <div ref={setRoot} className={cls} data-node-id={nodeId ?? ARTIFACT_HEADER_NODE}>
      <div className="ahdr__row">
        <div className={cx('ahdr__left', cta && 'ahdr__left--cta')}>
          {onBack && (
            <Tooltip text="Back" arrow="top-left">
              <IconButton size="xs" aria-label="Back" className={cx('ahdr__back', backHover && 'is-hover')} nodeId="12191:716323" onClick={onBack}>
                <ChevronLeft16 />
              </IconButton>
            </Tooltip>
          )}
          {editing ? (
            <div className="ahdr__edit">
              <span className="ahdr__icon"><img alt="" src={TYPE_ICONS[typeIcon]} /></span>
              <span className="ahdr__field" data-node-id="6303:300931">
                <span className="ahdr__mirror" aria-hidden="true">{text || ' '}</span>
                <input
                  ref={input} className="ahdr__input" type="text" size={1} value={text} maxLength={MAX_NAME} aria-label="Artifact name"
                  spellCheck={false} autoComplete="off"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                  onKeyDown={onFieldKey}
                  onBlur={() => finish(true, false)}
                />
              </span>
            </div>
          ) : (
            <>
              <button
                {...tip.triggerProps} ref={setNameBtn} type="button" className={cx('ahdr__name', nameHover && 'is-hover')}
                aria-label={nameLabel} data-node-id="6303:300931"
                aria-haspopup={onNameMenu ? 'menu' : undefined} aria-expanded={onNameMenu ? !!nameMenuOpen : undefined}
                onClick={e => (onNameMenu ? onNameMenu(e.currentTarget, keyboardFocus(e)) : setEditing(true))}
                onKeyDown={onNameMenu ? openMenuOnArrowDown : undefined}
              >
                <span className="ahdr__icon"><img alt="" src={TYPE_ICONS[typeIcon]} /></span>
                <span ref={textRef} className="ahdr__text">{name}</span>
                {full && <ChevronDown14 className="ahdr__chev" />}
              </button>
              {tip.tooltip}
            </>
          )}
          {cta && (
            <button type="button" className="ahdr__cta" data-node-id="6303:301118" onClick={cta.onClick}>
              <AiStar14 />
              <span className="ahdr__cta-t">{cta.label}</span>
            </button>
          )}
        </div>

        <div className="ahdr__actions">
          {showToggle && (
            <ToggleGroup
              className="ahdr__opt" aria-label="View" value={view} onChange={v => onViewChange?.(v)} nodeId="3805:106246"
              options={[
                { value: 'preview', label: 'Preview', icon: <Eye14 /> },
                { value: 'code', label: 'Code', icon: <Code14 /> },
              ]}
            />
          )}
          {!page && tool('Copy', onCopy, <Copy16 />, { className: 'ahdr__opt', nodeId: '6424:330782' })}
          {showRefresh && tool('Refresh', onRefresh, <Refresh16 />, { className: 'ahdr__opt', nodeId: '6944:509804' })}
          {!page && <button
            ref={setVerBtn} type="button" className="ahdr__ver" data-node-id="3792:244988"
            aria-haspopup="menu" aria-expanded={menuOpen} aria-label={`v${current}, version history`}
            onClick={toggleMenu} onKeyDown={openMenuOnArrowDown}
          >
            <span className="ahdr__ver-t">v{current}</span>
            <ChevronDown12 />
          </button>}
          <button type="button" className="ahdr__publish" data-node-id="3792:244997" aria-label="Publish" onClick={onPublish}>
            <Play14 />
            <span className="ahdr__publish-t">Publish</span>
          </button>
          <div className="ahdr__tail">
            <div className="ahdr__split" role="group" aria-label="Comments" data-node-id="13610:411696">
              <Tooltip text="Comments" arrow="top-center">
                <button type="button" className="ahdr__split-main" aria-label="Comments" aria-pressed={!!commentsOn} onClick={onComment}>
                  <Comment16 />
                </button>
              </Tooltip>
              <span className="ahdr__split-rule" aria-hidden="true" />
              <button
                type="button" className="ahdr__split-more ahdr__opt2" aria-label="Comment options" aria-haspopup="menu"
                onClick={e => onCommentMenu?.(e.currentTarget)}
              >
                <ChevronDown12 />
              </button>
            </div>
            <Tooltip text="Download" arrow="top-center">
              <IconButton size="sm" aria-label="Download" className="ahdr__opt" nodeId="13610:411342" onClick={e => onDownload?.(e.currentTarget)}>
                <Download16 />
              </IconButton>
            </Tooltip>
            {/* "More": the tools a narrow header folds away (CSS shows it under 640px of header width) */}
            <IconButton
              ref={setMoreBtn} size="sm" aria-label="More actions" className="ahdr__more" aria-haspopup="menu" aria-expanded={!!more}
              onClick={e => setMore(more ? null : { focus: keyboardFocus(e) })} onKeyDown={openMenuOnArrowDown}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden focusable={false}>
                <circle cx="3.5" cy="8" r="1.1" /><circle cx="8" cy="8" r="1.1" /><circle cx="12.5" cy="8" r="1.1" />
              </svg>
            </IconButton>
            {!noExpand && tool(full ? 'Collapse' : 'Expand', onToggleFull, full ? <Minimize16 /> : <Maximize16 />, { nodeId: '3792:244998' })}
            {(!page || onClose) && tool('Close artifact', onClose, <Close16 />, { nodeId: '3792:244999' })}
          </div>
        </div>
      </div>

      {menuOpen && verBtn && container && (
        <VersionMenu
          versions={versions} current={current} icon={icon} anchor={verBtn} container={container} autoFocus={menuFocus}
          onSelect={n => onVersionChange?.(n)} onClose={closeMenu}
        />
      )}
      {more && moreBtn && container && (
        <MoreMenu
          anchor={moreBtn} container={container} focus={more.focus} onClose={() => setMore(null)}
          view={showToggle ? view : undefined} onViewChange={onViewChange} refresh={showRefresh}
          copy={!page} onCopy={onCopy} onRefresh={onRefresh} onDownload={() => onDownload?.(moreBtn)} onPublish={onPublish}
          onCommentMenu={onCommentMenu ? () => onCommentMenu(moreBtn) : undefined}
        />
      )}
    </div>
  )
}

/** The overflow menu of a narrow header: the tools CSS hides (.ahdr__opt, and under 440px Publish and the comment chevron). */
function MoreMenu({ anchor, container, focus, onClose, view, onViewChange, refresh, copy, onCopy, onRefresh, onDownload, onPublish, onCommentMenu }: {
  anchor: HTMLElement; container: HTMLElement; focus?: MenuFocus; onClose: () => void
  view?: ArtifactView; onViewChange?: (v: ArtifactView) => void; refresh: boolean; copy: boolean
  onCopy?: () => void; onRefresh?: () => void; onDownload: () => void; onPublish?: () => void; onCommentMenu?: () => void
}) {
  const [narrow] = useState(() => (anchor.closest('.ahdr') as HTMLElement | null)?.offsetWidth ?? 9999)
  const run = (fn?: () => void) => () => { onClose(); fn?.() }
  const pos = menuBelow(relativeBox(anchor, container), 180)
  return (
    <DropdownMenu width={180} position={pos} anchor={anchor} portalTo={container} autoFocus={focus} onClose={onClose} aria-label="More actions" shadow="small">
      {view && (
        <>
          <DropdownItem label="Preview" selected={view === 'preview'} onClick={run(() => onViewChange?.('preview'))} />
          <DropdownItem label="Code" selected={view === 'code'} onClick={run(() => onViewChange?.('code'))} />
          <DropdownSeparator />
        </>
      )}
      {copy && <DropdownItem label="Copy" onClick={run(onCopy)} />}
      {refresh && <DropdownItem label="Refresh" onClick={run(onRefresh)} />}
      <DropdownItem label="Download" onClick={run(onDownload)} />
      {narrow < 440 && <DropdownItem label="Publish" onClick={run(onPublish)} />}
      {narrow < 440 && onCommentMenu && <DropdownItem label="Comment options" onClick={run(onCommentMenu)} />}
    </DropdownMenu>
  )
}
