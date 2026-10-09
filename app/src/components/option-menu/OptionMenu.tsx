import { useEffect, useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { Avatar, type AvatarColour } from '../avatar/Avatar'
import { PillSquared } from '../pill/Pill'
import { Check16 } from '../form/icons'
import { scrollbar } from '../form/scrollbar'
import './option-menu.css'

/** "Input Menu Dropdown" set 11832:31551 (Type=Single Select, Size=sm, Search=Default is 11832:31555). */
export const OPTION_MENU_SET = '11832:31551'
/** "Input dropdown Menu Item" set 11831:300292. */
export const OPTION_ITEM_SET = '11831:300292'

export type OptionMenuOption = {
  id: string
  label: string
  /** Muted text after the label in the same line, e.g. " (You)" in the access list. */
  suffix?: string
  /** Supporting text: inline after the label (single line, JetBrains Mono, e.g. "@olivia") or under it (double line). */
  supporting?: string
  /** Type=Avatar leading. */
  avatar?: { name: string; initial?: string; colour?: AvatarColour; type?: 'letter' | 'icon' }
  /** Any other leading glyph (the Assistant's dot mark, a tinted access icon), drawn in the avatar's slot. */
  leading?: ReactNode
  /** Trailing role badge (Pill squared xxs, Pill Clear, mono): "Owner", "Editor", "Viewer". */
  role?: string
  disabled?: boolean
}

/** A section label row ("PEOPLE WITH ACCESS"): Size=sm, Type=Default with Text xxs Medium all caps, text-quaternary. */
export type OptionMenuSection = { type: 'section'; id: string; label: string }

export type OptionMenuEntry = OptionMenuOption | OptionMenuSection

const isSection = (e: OptionMenuEntry): e is OptionMenuSection => (e as OptionMenuSection).type === 'section'

/** The DOM id of an option, for aria-activedescendant on a combobox input that drives the menu. */
export const optionDomId = (menuId: string, optionId: string) => `${menuId}-opt-${optionId.replace(/[^a-zA-Z0-9_-]/g, '_')}`

/** The next enabled option id from `activeId` (for a combobox input's ArrowUp / ArrowDown / Home / End). */
export function nextOptionId(entries: OptionMenuEntry[], activeId: string | null | undefined, move: 'next' | 'prev' | 'first' | 'last'): string | null {
  const ids = entries.filter((e): e is OptionMenuOption => !isSection(e) && !e.disabled).map(o => o.id)
  if (!ids.length) return null
  const i = activeId ? ids.indexOf(activeId) : -1
  if (move === 'first') return ids[0]
  if (move === 'last') return ids[ids.length - 1]
  if (move === 'next') return ids[i < 0 ? 0 : (i + 1) % ids.length]
  return ids[i < 0 ? ids.length - 1 : (i - 1 + ids.length) % ids.length]
}

export type OptionMenuProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'onSelect'> & {
  items: OptionMenuEntry[]
  /** sm: 32px rows, 18px avatars, Text xs. md: 40px (single) / 52px (double) rows, 20px avatars. */
  size?: 'sm' | 'md'
  /** Stacking: supporting text inline (Single Line) or on a second line (Double Line). */
  stacking?: 'single' | 'double'
  /** One section label above the items (or put OptionMenuSection entries in `items`). */
  label?: string
  /** Selected=True: workspace fill and a trailing check. */
  selectedId?: string | null
  /** The option under the keyboard / pointer (State=Hover). Controlled when given. */
  activeId?: string | null
  onActiveChange?: (id: string | null) => void
  onSelect?: (option: OptionMenuOption) => void
  /** Escape inside the menu. */
  onClose?: () => void
  /**
   * The list takes focus itself and handles the arrow keys (default). Set false when a text input keeps focus and
   * drives the list (mention picker, people search): give the input aria-controls={menu id} and
   * aria-activedescendant={optionDomId(id, activeId)} and move with nextOptionId.
   */
  focusable?: boolean
  /** A read-only list (the access popover): role=list, no hover, nothing to choose. */
  readOnly?: boolean
  /** Rows 4px apart and 8px top padding, as the access popover draws them; default rows touch (people search). */
  spaced?: boolean
  /** Scroll after this height, with the md Scroll bar. */
  maxHeight?: number
  nodeId?: string
}

/**
 * Option menu (Input Menu Dropdown + Input dropdown Menu Item): people and option lists — mention picker, access
 * popover, share people search, general access. A listbox with aria-activedescendant, so focus never leaves the list
 * (or the input that drives it).
 */
export function OptionMenu({
  items, size = 'sm', stacking = 'single', label, selectedId, activeId: activeProp, onActiveChange, onSelect, onClose,
  focusable = true, readOnly = false, spaced = false, maxHeight, nodeId = OPTION_MENU_SET, className, id, style,
  'aria-label': ariaLabel, onKeyDown, ...rest
}: OptionMenuProps) {
  const autoId = useId()
  const menuId = id ?? `om${autoId.replace(/:/g, '')}`
  const [ownActive, setOwnActive] = useState<string | null>(null)
  const activeId = activeProp !== undefined ? activeProp : ownActive
  const setActive = (next: string | null) => { if (activeProp === undefined) setOwnActive(next); onActiveChange?.(next) }
  const list = useRef<HTMLDivElement | null>(null)
  const entries: OptionMenuEntry[] = label ? [{ type: 'section', id: '__label', label }, ...items] : items

  // Keep the active option in view while the keyboard moves through a scrolling list. Only the list's own box
  // scrolls (scrollIntoView would also scroll the page and every scrolling ancestor), and only when the active option
  // moves: not for one given at mount (the gallery pins State=Hover) and not for one the pointer moved to.
  const shownActive = useRef(activeId)
  const fromPointer = useRef(false)
  useEffect(() => {
    const moved = activeId !== shownActive.current
    shownActive.current = activeId
    const pointer = fromPointer.current
    fromPointer.current = false
    const box = list.current
    if (!moved || pointer || !activeId || !box || box.scrollHeight <= box.clientHeight) return
    const row = box.querySelector<HTMLElement>(`#${CSS.escape(optionDomId(menuId, activeId))}`)
    if (!row) return
    const b = box.getBoundingClientRect()
    const r = row.getBoundingClientRect()
    if (r.top < b.top) box.scrollTop -= b.top - r.top
    else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom
  }, [activeId, menuId])

  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || readOnly) return
    const move = e.key === 'ArrowDown' ? 'next' : e.key === 'ArrowUp' ? 'prev' : e.key === 'Home' ? 'first' : e.key === 'End' ? 'last' : null
    if (move) {
      e.preventDefault()
      fromPointer.current = false
      setActive(nextOptionId(items, activeId, move))
    } else if ((e.key === 'Enter' || e.key === ' ') && activeId) {
      const option = items.find((o): o is OptionMenuOption => !isSection(o) && o.id === activeId)
      if (option && !option.disabled) { e.preventDefault(); onSelect?.(option) }
    } else if (e.key === 'Escape' && onClose) {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
  }

  const sectionLabel = entries.find(isSection)?.label
  return (
    <div
      className={cx('om', `om--${size}`, spaced && 'om--spaced', readOnly && 'om--readonly', className)}
      data-node-id={nodeId}
      style={style}
    >
      <div
        ref={list}
        id={menuId}
        role={readOnly ? 'list' : 'listbox'}
        aria-label={ariaLabel ?? sectionLabel}
        aria-activedescendant={!readOnly && focusable && activeId ? optionDomId(menuId, activeId) : undefined}
        tabIndex={!readOnly && focusable ? 0 : undefined}
        className={cx('om__list', maxHeight !== undefined && scrollbar('md'))}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
        onKeyDown={keyDown}
        onFocus={() => { if (!readOnly && focusable && !activeId) setActive(selectedId ?? nextOptionId(items, null, 'first')) }}
        onMouseLeave={() => { if (!readOnly && focusable) setActive(null) }}
        {...rest}
      >
        {entries.map(entry => isSection(entry) ? (
          <div key={entry.id} className="omi omi--section" role="presentation" data-node-id={OPTION_ITEM_SET}>
            <span className="omi__content"><span className="omi__section">{entry.label}</span></span>
          </div>
        ) : (
          <OptionRow
            key={entry.id} menuId={menuId} option={entry} size={size} stacking={stacking} readOnly={readOnly}
            selected={selectedId === entry.id} active={activeId === entry.id}
            onHover={() => { if (!readOnly && !entry.disabled) { fromPointer.current = true; setActive(entry.id) } }}
            onChoose={() => !entry.disabled && onSelect?.(entry)}
          />
        ))}
      </div>
    </div>
  )
}

type RowProps = {
  menuId: string; option: OptionMenuOption; size: 'sm' | 'md'; stacking: 'single' | 'double'; readOnly: boolean
  selected: boolean; active: boolean; onHover: () => void; onChoose: () => void
}

function OptionRow({ menuId, option, size, stacking, readOnly, selected, active, onHover, onChoose }: RowProps) {
  const { label, suffix, supporting, avatar, leading, role, disabled } = option
  const hasLead = !!(avatar || leading)
  return (
    <div
      id={optionDomId(menuId, option.id)}
      role={readOnly ? 'listitem' : 'option'}
      aria-selected={readOnly ? undefined : selected}
      aria-disabled={disabled || undefined}
      className={cx(
        'omi', `omi--${size}`, `omi--${stacking}`, hasLead && 'omi--lead',
        active && 'is-active', selected && 'is-selected', disabled && 'is-disabled',
      )}
      data-node-id={OPTION_ITEM_SET}
      onMouseMove={active ? undefined : onHover}
      onMouseDown={e => { if (!readOnly) e.preventDefault() }} // keep focus on the list or its input
      onClick={readOnly ? undefined : onChoose}
    >
      <span className="omi__content">
        {avatar ? (
          <Avatar
            name={avatar.name} initial={avatar.initial} colour={avatar.colour} type={avatar.type} size="xxs" decorative
            className="omi__av"
          />
        ) : leading ? <span className="omi__lead" aria-hidden="true">{leading}</span> : null}
        <span className="omi__text">
          <span className="omi__label">{label}{suffix && <span className="omi__suffix">{suffix}</span>}</span>
          {supporting && <span className="omi__sup">{supporting}</span>}
        </span>
        {role && <PillSquared size="xxs" type="clear" mono className="omi__role">{role}</PillSquared>}
        {selected && !readOnly && <Check16 className="omi__check" />}
      </span>
    </div>
  )
}
