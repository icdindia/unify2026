import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import { X8 } from '../form/icons'
import './tag.css'

/** "Tag" sets: 166:43302 (sm, Icon=Avatar, the invite chips) and 89:89890 (xs Outline with X close). */
export const TAG_SETS = { sm: '166:43302', xs: '89:89890' } as const

export type TagProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  label: string
  /** sm 24 (radius 6, 4px padding) · xs 20 (radius 4, 2 / 4 / 2 / 6). */
  size?: 'sm' | 'xs'
  /** Solid: utility-pigeon-blue-50 chip (a person or address picked in the invite field). Outline: white with a ring. */
  type?: 'solid' | 'outline'
  /** Icon=Avatar: a 16px letter avatar before the label (White on Solid, Gray on Outline, as the file draws them). */
  avatar?: { name: string; initial?: string } | false
  /** Action=X close: the remove button. */
  onRemove?: () => void
  /** Accessible name of the remove button. Default "Remove <label>". */
  removeLabel?: string
  nodeId?: string
}

/** Tag: a chip with an optional avatar and an X close button. */
export function Tag({
  label, size = 'sm', type = size === 'xs' ? 'outline' : 'solid', avatar, onRemove, removeLabel, nodeId, className, ...rest
}: TagProps) {
  return (
    <span className={cx('tag', `tag--${size}`, `tag--${type}`, className)} data-node-id={nodeId ?? TAG_SETS[size]} {...rest}>
      <span className="tag__content">
        {avatar && (
          <span className="tag__av" aria-hidden="true">{avatar.initial ?? avatar.name.trim().charAt(0).toUpperCase()}</span>
        )}
        <span className="tag__t">{label}</span>
      </span>
      {onRemove && (
        <button type="button" className="tag__x" aria-label={removeLabel ?? `Remove ${label}`} onClick={onRemove}>
          <X8 />
        </button>
      )}
    </span>
  )
}
