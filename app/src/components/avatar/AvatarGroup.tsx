import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import { useButtonFix } from '../buttons/fixes'
import { Plus16 } from '../form/icons'
import { Avatar, type AvatarColour } from './Avatar'
import './avatar-group.css'

/** Figma component set "Avatar group" 8020:431296 (Size=xxs | xs | sm | md; More users; Add more button). */
export const AVATAR_GROUP_SET = '8020:431296'
/** "_Avatar add button" set 8007:430922 (Size=xs | sm | md | lg × State=Default | Hover | Focus | Disabled). */
export const ADD_BUTTON_SET = '8007:430922'

export type AvatarGroupSize = 'xxs' | 'xs' | 'sm' | 'md'

export type AvatarGroupPerson = { name: string; initial?: string; colour?: AvatarColour }

export type AvatarGroupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  people: AvatarGroupPerson[]
  size?: AvatarGroupSize
  /**
   * Faces shown before the "+N" counter. The file shows 10 + "+21" in the crowded header (collab 09) and 3 in the
   * bars; Q40 default: header up to 10, collaborative bar 3. With no `max`, everyone is shown.
   */
  max?: number
  /** Total people when `people` is only the first page (the counter then reads total - shown). */
  total?: number
  /** "_Avatar add button" after the faces. */
  onAdd?: () => void
  addLabel?: string
  /** More props for the add button: `disabled` (State=Disabled), a `title`, or a class. */
  addProps?: Omit<ComponentPropsWithRef<'button'>, 'children' | 'onClick' | 'type'>
  /** Per-face name tooltips (native title). Default on. */
  titles?: boolean
  nodeId?: string
}

/** "Matt Rivera, John Whitaker and 2 others" */
function describe(names: string[], hidden: number): string {
  if (hidden > 0) return `${names.join(', ')} and ${hidden} ${hidden === 1 ? 'other' : 'others'}`
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/**
 * Avatar group: overlapping faces (overlap 4 at xxs / xs, 8 at sm, 12 at md), each with the white separating stroke,
 * then a "+N" face (Colour=Gray at xs and up, Colour=White at xxs, as the file draws them) and an optional add button.
 * The group is one image to assistive tech, named with everyone it stands for.
 */
export function AvatarGroup({
  people, size = 'xs', max, total, onAdd, addLabel = 'Add people', addProps, titles = true, nodeId = AVATAR_GROUP_SET, className, ...rest
}: AvatarGroupProps) {
  const shown = max !== undefined && people.length > max ? people.slice(0, max) : people
  const count = total ?? people.length
  const hidden = Math.max(0, count - shown.length)
  const hiddenNames = people.slice(shown.length).map(p => p.name)
  // FIXES button-focus-ring-3-to-1 covers the add button too (its Focus halo is 1.4:1 or fainter)
  const ring = useButtonFix('button-focus-ring-3-to-1')
  return (
    <div className={cx('avatar-group', `avatar-group--${size}`, className)} data-node-id={nodeId} {...rest}>
      <span className="avatar-group__faces" role="img" aria-label={describe(shown.map(p => p.name), hidden)}>
        {shown.map((p, i) => (
          <Avatar
            key={`${p.name}-${i}`} name={p.name} initial={p.initial} colour={p.colour} size={size} stacked decorative
            title={titles ? p.name : undefined}
          />
        ))}
        {hidden > 0 && (
          <Avatar
            name={`${hidden} more`} initial={`+${hidden}`} colour={size === 'xxs' ? 'white' : 'gray'} size={size} stacked decorative
            className="avatar-group__more" title={titles && hiddenNames.length ? hiddenNames.join(', ') : undefined}
          />
        )}
      </span>
      {onAdd && (
        <button
          aria-label={addLabel} data-node-id={ADD_BUTTON_SET} {...addProps}
          type="button" className={cx('avatar-group__add', ring && 'avatar-group__add--ring', addProps?.className)} onClick={onAdd}
        >
          <Plus16 />
        </button>
      )}
    </div>
  )
}
