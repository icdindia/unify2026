import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import { User } from '../form/icons'
import './avatar.css'

/** Figma component set "Avatar" 8007:428847 (key 3749c371…). The older library set 250:177364 adds Brand Subtle. */
export const AVATAR_SET = '8007:428847'

/** Size axis of the set: xxs 20, xs 24, sm 32, md 40, lg 48. (xl 56 / 2xl 64 are not used by these journeys.) */
export type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg'

/** The set's own Colour axis (plus Brand Subtle from the older set, used by the nav footer and share rows). */
export type AvatarTone = 'brand-solid' | 'gray' | 'brand-secondary' | 'white' | 'brand-subtle'

/**
 * Per-person fills: instances of Colour=Brand Solid with the fill overridden to a DS utility token. The keys match
 * `AvatarColour` in src/fixtures/people.ts, so `person.colour` can be passed straight in.
 */
export type AvatarPersonFill =
  | 'brand-500' | 'brand-300' | 'plum-700' | 'plum-300' | 'error-600' | 'error-300' | 'warm-blue-700' | 'warm-blue-300'
  | 'steel-blue-200' | 'rose-300' | 'success-300' | 'success-400' | 'lime-300' | 'warning-300' | 'brand-secondary-500'
  | 'brand-tertiary-800' | 'brand-tertiary-500' | 'pigeon-blue-400' | 'royal-violet-300'

export type AvatarColour = AvatarTone | AvatarPersonFill

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Whose avatar. Used for the letter (unless `initial` is given) and the accessible name. */
  name: string
  /** The letter, when it is not the first letter of `name` (Figma draws e.g. "+21" or a lowercase initial). */
  initial?: string
  size?: AvatarSize
  colour?: AvatarColour
  /** Type axis: Letter (default), Icon (user-01z glyph) or Image (`src`). */
  type?: 'letter' | 'icon' | 'image'
  src?: string
  /** State axis: Hover draws a 1px border-tertiary ring 2px out, Selected the same ring in border-brand-solid. */
  ring?: 'hover' | 'selected'
  /**
   * Inside an AvatarGroup: the white separating stroke the group draws on every face (1px inside at xxs / xs, 1.5px
   * outside at sm / md).
   */
  stacked?: boolean
  /** Hide from assistive tech when the name is already next to it (a message author, an option row). */
  decorative?: boolean
  /** Figma node id of this instance, when it is a specific one. Defaults to the set. */
  nodeId?: string
}

const ICON_SIZE: Record<AvatarSize, number> = { xxs: 10, xs: 16, sm: 20, md: 24, lg: 28 }

/** Avatar: a letter, an icon or an image in a circle. */
export function Avatar({
  name, initial, size = 'xs', colour = 'brand-solid', type = 'letter', src, ring, stacked, decorative, nodeId = AVATAR_SET,
  className, title, ...rest
}: AvatarProps) {
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': name }
  return (
    <span
      className={cx('avatar', `avatar--${size}`, `avatar--${colour}`, ring && `avatar--ring-${ring}`, stacked && 'avatar--stacked', className)}
      data-node-id={nodeId}
      title={title}
      {...a11y}
      {...rest}
    >
      {type === 'image' && src ? <img className="avatar__img" src={src} alt="" /> :
        type === 'icon' ? <User size={ICON_SIZE[size]} className="avatar__icon" /> :
          <span className="avatar__t">{initial ?? name.trim().charAt(0).toUpperCase()}</span>}
    </span>
  )
}
