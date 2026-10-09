import {
  useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type KeyboardEvent, type ReactNode, type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { OptionMenu, nextOptionId, optionDomId, type OptionMenuOption } from '../option-menu/OptionMenu'
import type { AvatarColour } from '../avatar/Avatar'
import { caretBoxAt } from '../composer/caret'
import type { CaretBox, ComposerHandle, ComposerTrigger } from '../composer/types'
import { MENU_EDGE } from '../dropdown-menu/placement'
import { overlayLayer } from '../overlays/layer'
import { AssistantGlyph } from '../chat-messages/icons'
import { ASSISTANT, PEOPLE, avatarOn, type MentionTarget, type PersonId } from '../../fixtures/people'
import { pick, useFixPredicate } from '../../fixtures/drift'
import './mention-picker.css'

// Mention picker (BUILD-PLAN row 57): the "Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default" list
// (11832:31555) that opens over the composer when "@" is typed: the Assistant first, then the chat's participants,
// filtered by what follows the "@". chat-artifact 10 (1731:255712, full list) and 11 (1731:338960, "@m").
// Geometry from those frames: 176 wide, its left edge 4px left of the "@" and its bottom 4px above the "@"'s line
// (x 476 / bottom 832 for the "@" at 480, 836); rows 32 (Size=sm, Type=Avatar leading), 18px avatars.

/** Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default. */
export const MENTION_MENU = '11832:31555'
const MENU_WIDTH = 176
const GAP = 4
const LINE = 26 // Text md/Regular para line height of the composer text
const HALF_LEADING = 4 // (26 - the 15px Geist inline box 18) / 2

export type MentionCandidate = {
  id: MentionTarget
  /** The name the token gets ("Matt Rivera", "Assistant"). */
  name: string
  /** The name as the list draws it (a frame may misspell it: "John Whitake", "Mace Coleman"). */
  label: string
  initial: string
  colour?: AvatarColour
}

export type UseMentionPickerOptions = {
  /** The Composer's handleRef: the picker reads the caret from it and inserts the finished token through it. */
  composer: RefObject<ComposerHandle | null>
  /** The chat's participants, in order (the signed-in user is left out by the screen). */
  participants: readonly PersonId[]
  /** Offer "Assistant" first (Q39: it stays first). Default true. */
  assistant?: boolean
  /** Review only: State=Hover pinned on one row (`hover=mention:matt` → 'matt-rivera'). */
  hoverId?: MentionTarget | null
  /** After a mention was inserted. */
  onPick?: (target: MentionTarget) => void
}

export type MentionPicker = {
  /** Pass to <Composer mentions={…}>: the names it turns into tokens. */
  names: string[]
  /** Pass to <Composer onTrigger={…}>. */
  onTrigger: (trigger: ComposerTrigger | null) => void
  /** Pass to <Composer onTriggerKeyDown={…}>: ArrowUp / ArrowDown move, Enter or Tab inserts, Escape closes. */
  onTriggerKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => boolean
  /** Render it anywhere next to the composer: it portals into the overlay layer, fixed over the caret. */
  picker: ReactNode
  open: boolean
  /** The shown candidates (filtered), for tests. */
  candidates: MentionCandidate[]
}

/** Whether `name` matches `query`: a word starting with it first (rank 0), then anywhere in it (rank 1). */
function rank(name: string, query: string): number {
  if (!query) return 0
  const n = name.toLowerCase()
  if (n.split(/\s+/).some(w => w.startsWith(query))) return 0
  return n.includes(query) ? 1 : -1
}

/** Filters candidates by the text after "@": word-start matches first, then other matches, each in list order. */
export function filterMentions<T extends { label: string }>(all: readonly T[], query: string): T[] {
  const q = query.trim().toLowerCase()
  const scored = all.map((c, i) => ({ c, i, r: rank(c.label, q) })).filter(s => s.r >= 0)
  return scored.sort((a, b) => a.r - b.r || a.i - b.i).map(s => s.c)
}

/**
 * The mention picker, wired to a Composer:
 *
 *   const composer = useRef<ComposerHandle>(null)
 *   const mention = useMentionPicker({ composer, participants: view.participants })
 *   <Composer handleRef={composer} mentions={mention.names} onTrigger={mention.onTrigger}
 *             onTriggerKeyDown={mention.onTriggerKeyDown} … />
 *   {mention.picker}
 *
 * The textarea keeps focus: while the list is open it is a combobox (aria-controls, aria-activedescendant) and the
 * list follows the keys. A pointer press outside the list and the field closes it until the query changes.
 */
export function useMentionPicker({ composer, participants, assistant = true, hoverId, onPick }: UseMentionPickerOptions): MentionPicker {
  const applies = useFixPredicate()
  const [trigger, setTrigger] = useState<ComposerTrigger | null>(null)
  const [active, setActive] = useState<MentionTarget | null>(null)
  const [dismissed, setDismissed] = useState('')
  const query = trigger?.query ?? ''
  const sig = trigger ? `${trigger.start}:${trigger.query}` : ''

  // Frames draw the full list and the filtered list from different instances (the filtered one misspells Grace and
  // gives Matt his own fill): surface 'mention' before any letter, 'mention-filtered' after.
  const all = useMemo<MentionCandidate[]>(() => {
    const surface = query ? 'mention-filtered' : 'mention'
    const people = participants.map(id => {
      const a = avatarOn(id, surface)
      const label = pick(a.name, applies)
      return { id, name: PEOPLE[id].name, label, initial: label.charAt(0).toUpperCase(), colour: pick(a.colour, applies) }
    })
    return assistant ? [{ id: 'assistant' as const, name: ASSISTANT.name, label: ASSISTANT.name, initial: 'A' }, ...people] : people
  }, [participants, assistant, query, applies])

  const shown = useMemo(() => filterMentions(all, query), [all, query])
  const open = !!trigger && shown.length > 0 && dismissed !== sig
  const names = useMemo(
    () => [...(assistant ? [ASSISTANT.name] : []), ...participants.map(id => PEOPLE[id].name)],
    [assistant, participants],
  )

  // a new query starts with no row active (as chat-artifact 10 / 11 draw the list)
  useEffect(() => { setActive(null) }, [query, trigger?.start])

  const onTrigger = useCallback((t: ComposerTrigger | null) => setTrigger(t && t.kind === 'mention' ? t : null), [])

  const insert = useCallback((c: MentionCandidate) => {
    composer.current?.insertToken('mention', c.name)
    onPick?.(c.id)
  }, [composer, onPick])

  const onTriggerKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open) return false
    const ids = shown.map(c => ({ id: c.id, label: c.label }))
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(nextOptionId(ids, active, e.key === 'ArrowDown' ? 'next' : 'prev') as MentionTarget | null)
      return true
    }
    if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Tab') {
      e.preventDefault()
      insert(shown.find(c => c.id === active) ?? shown[0])
      return true
    }
    return false
  }, [open, shown, active, insert])

  const menuId = `mp${useId().replace(/:/g, '')}`
  const activeId = hoverId !== undefined && hoverId !== null ? hoverId : active
  const picker = open && trigger
    ? <MentionMenu
        menuId={menuId} trigger={trigger} composer={composer} candidates={shown} activeId={activeId}
        onActive={id => setActive(id)} onPick={insert} onDismiss={() => setDismissed(sig)}
      />
    : null

  // the field is the combobox while the list is open
  useEffect(() => {
    const field = composer.current?.textarea()
    if (!field || !open) return
    const set = (k: string, v: string | null) => (v === null ? field.removeAttribute(k) : field.setAttribute(k, v))
    set('role', 'combobox')
    set('aria-autocomplete', 'list')
    set('aria-expanded', 'true')
    set('aria-controls', menuId)
    set('aria-activedescendant', activeId ? optionDomId(menuId, activeId) : null)
    return () => ['role', 'aria-autocomplete', 'aria-expanded', 'aria-controls', 'aria-activedescendant'].forEach(k => field.removeAttribute(k))
  }, [composer, open, menuId, activeId])

  return { names, onTrigger, onTriggerKeyDown, picker, open, candidates: open ? shown : [] }
}

type MenuProps = {
  menuId: string
  trigger: ComposerTrigger
  composer: RefObject<ComposerHandle | null>
  candidates: MentionCandidate[]
  activeId: MentionTarget | null
  onActive: (id: MentionTarget | null) => void
  onPick: (c: MentionCandidate) => void
  onDismiss: () => void
}

/** The list itself, fixed over the "@" (above it; below it when there is no room above). */
function MentionMenu({ menuId, trigger, composer, candidates, activeId, onActive, onPick, onDismiss }: MenuProps) {
  const el = useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = useState<CaretBox>(trigger.anchor)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  // the trigger reports the "@" box when the text changes; a resize or scroll moves it without a new report
  useEffect(() => setAnchor(trigger.anchor), [trigger])
  useEffect(() => {
    const update = () => {
      const field = composer.current?.textarea()
      if (field?.isConnected) setAnchor(caretBoxAt(field, trigger.start))
    }
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true) }
  }, [composer, trigger.start])

  useLayoutEffect(() => {
    const h = el.current?.offsetHeight ?? 0
    const vw = window.innerWidth
    const vh = window.innerHeight
    const left = Math.min(Math.max(MENU_EDGE, anchor.left - GAP), vw - MENU_EDGE - MENU_WIDTH)
    // caretBoxAt reports the glyph's inline box (top 840 for the "@" on the 836-862 line of the 825 composer), so the
    // text line starts HALF_LEADING above it: chat-artifact 10 has the list's bottom at 832, 4 above that line
    const lineTop = anchor.top - HALF_LEADING
    const above = lineTop - GAP - h
    const below = lineTop + LINE + GAP
    const top = above >= MENU_EDGE || below + h > vh - MENU_EDGE ? Math.max(MENU_EDGE, above) : below
    // the "@" scrolled out of view: hide the list rather than pin it to an edge
    const off = anchor.bottom < 0 || anchor.top > vh
    setPos(p => (off ? null : p && p.left === left && p.top === top ? p : { left, top }))
  }, [anchor, candidates.length])

  // a press outside the list and the field closes it (until the query changes)
  useEffect(() => {
    const down = (e: PointerEvent) => {
      const t = e.target as Node | null
      if (!t || el.current?.contains(t) || composer.current?.textarea()?.contains(t)) return
      onDismiss()
    }
    document.addEventListener('pointerdown', down, true)
    return () => document.removeEventListener('pointerdown', down, true)
  }, [composer, onDismiss])

  const items: OptionMenuOption[] = candidates.map(c => c.id === 'assistant'
    ? { id: c.id, label: c.label, leading: <span className="mp__ai"><AssistantGlyph size={12} /></span> }
    : { id: c.id, label: c.label, avatar: { name: c.label, initial: c.initial, colour: c.colour } })

  return createPortal(
    <div ref={el} className="mp" style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? undefined : 'hidden' }}>
      <OptionMenu
        id={menuId}
        items={items}
        size="sm"
        focusable={false}
        activeId={activeId}
        onActiveChange={id => onActive(id as MentionTarget | null)}
        onSelect={o => { const c = candidates.find(x => x.id === o.id); if (c) onPick(c) }}
        aria-label="Mention a participant"
        nodeId={MENTION_MENU}
      />
    </div>,
    overlayLayer(),
  )
}
