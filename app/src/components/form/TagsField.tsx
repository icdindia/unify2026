import { useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { Tag } from '../pill/Tag'
import { isImeKey } from './ime'
import './tags-field.css'

/** "Input dropdown_outline" set 11832:31637, Type=Tags. The share invite draws a detached copy of it (1819:316471). */
export const TAGS_FIELD_SET = '11832:31637'

export type TagsFieldItem = {
  id: string
  label: string
  /** Icon=Avatar on the chip: a person's letter. Free-typed addresses get their first letter too, as drawn. */
  avatar?: { name: string; initial?: string }
}

export type TagsFieldProps = Omit<ComponentPropsWithRef<'input'>, 'value' | 'onChange' | 'size'> & {
  value: TagsFieldItem[]
  onChange: (next: TagsFieldItem[]) => void
  /** The typed text (controlled), e.g. to filter a people menu under the field. Uncontrolled when omitted. */
  query?: string
  onQueryChange?: (query: string) => void
  /**
   * Turn typed text into a chip (Enter or a comma). Default: every non-empty entry becomes a chip with its own letter
   * (Q37 default: free-typed emails become chips). Return null to refuse the text.
   */
  toItem?: (text: string) => TagsFieldItem | null
  /** Content after the chips, inside the frame: the invite role button ("Commenter ⌄"). */
  trailing?: ReactNode
  label?: ReactNode
  /** Accessible name when there is no visible label. */
  'aria-label'?: string
  fieldClassName?: string
  nodeId?: string
}

const defaultToItem = (text: string): TagsFieldItem => ({ id: `typed:${text}`, label: text, avatar: { name: text } })

/**
 * Tags field: chips that wrap onto more rows, then an inline text input. Enter or "," adds the typed text as a chip,
 * Backspace in the empty input removes the last chip, each chip's x removes it. The frame takes the focus ring of the
 * DS inputs while anything inside is focused.
 */
export function TagsField({
  value, onChange, query, onQueryChange, toItem = defaultToItem, trailing, label, fieldClassName, nodeId = TAGS_FIELD_SET,
  className, id, placeholder, onKeyDown, disabled, ...rest
}: TagsFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [ownQuery, setOwnQuery] = useState('')
  const text = query ?? ownQuery
  const setText = (next: string) => { if (query === undefined) setOwnQuery(next); onQueryChange?.(next) }
  const input = useRef<HTMLInputElement | null>(null)

  const commit = () => {
    const t = text.trim().replace(/,$/, '').trim()
    if (!t) return
    const item = toItem(t)
    if (!item) return
    if (!value.some(v => v.id === item.id)) onChange([...value, item])
    setText('')
  }

  const remove = (item: TagsFieldItem) => {
    onChange(value.filter(v => v.id !== item.id))
    input.current?.focus()
  }

  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    // keys of an IME composition (and the Enter that confirms it) belong to the IME: no chip, no chip removal
    if (e.defaultPrevented || isImeKey(e)) return
    if ((e.key === 'Enter' || e.key === ',') && text.trim()) {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !text && value.length) {
      e.preventDefault()
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className={cx('field', 'tagsfield', fieldClassName)} data-node-id={nodeId}>
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <div
        className={cx('tagsfield__frame', disabled && 'is-disabled', className)}
        onMouseDown={e => {
          // a press on the frame or between chips puts the caret in the entry, like a text field
          if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('tagsfield__tags')) {
            e.preventDefault()
            input.current?.focus()
          }
        }}
      >
        <ul className="tagsfield__tags" aria-label={value.length ? 'Added' : undefined}>
          {value.map(item => (
            <li key={item.id} className="tagsfield__tag">
              <Tag label={item.label} avatar={item.avatar ?? false} onRemove={disabled ? undefined : () => remove(item)} />
            </li>
          ))}
          <li className="tagsfield__entry">
            <input
              ref={input} id={inputId} className="tagsfield__input" value={text} disabled={disabled}
              placeholder={value.length ? undefined : placeholder} autoComplete="off"
              onChange={e => setText(e.target.value)}
              onKeyDown={keyDown}
              {...rest}
            />
          </li>
        </ul>
        {trailing && <div className="tagsfield__trailing">{trailing}</div>}
      </div>
    </div>
  )
}
