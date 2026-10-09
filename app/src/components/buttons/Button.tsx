import type { ComponentPropsWithRef } from 'react'
import { cx } from './cx'
import { useButtonFix } from './fixes'
import './button.css'

/**
 * primary = Buttons/Button Brand Primary (11750:511612), secondary = Buttons/Button Neutral Secondary (11932:738003),
 * tertiary = Buttons/Button Neutral Tertiary (11932:738003), destructive = Buttons/Button Error Primary (9918:392657).
 */
export type ButtonKind = 'primary' | 'secondary' | 'tertiary' | 'destructive'

/** sm 28px (Text xs/Medium) or md 32px (Text sm/Medium), the sizes modal footers and empty states use. */
export type ButtonSize = 'sm' | 'md'

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string
  kind?: ButtonKind
  size?: ButtonSize
  /** Leading 14px icon URL ("Copy Link", "Unpublish", "Recreate the Artifact"). */
  icon?: string
  /** Take the row's width (Copy Link), or share it in a fill-container row. */
  fill?: boolean
  /** Figma node of this instance. Defaults to the kind's component set. */
  nodeId?: string
}

export const BUTTON_SETS: Record<ButtonKind, string> = {
  primary: '11750:511612',
  secondary: '11932:738003',
  tertiary: '11932:738003',
  destructive: '9918:392657',
}

/**
 * A labelled button in every hierarchy the journeys draw, with the sets' Default / Hover / Disabled states. Disabled is
 * the native attribute. The page-chrome buttons that were ported from the Projects prototype (BrandButton, SecondaryButton,
 * TertiaryButton, IconButton) keep their measured sizes; this is the general one for everything else.
 */
export function Button({ label, kind = 'secondary', size = 'sm', icon, fill, nodeId, className, type = 'button', ...rest }: ButtonProps) {
  // FIXES button-focus-ring-3-to-1: with fixes on, keyboard focus draws the app's 2px ring around the set's pale halo
  const ring = useButtonFix('button-focus-ring-3-to-1')
  return (
    <button
      type={type}
      className={cx('btn', `btn--${size}`, `btn--${kind}`, fill && 'btn--fill', ring && 'btn--ring', className)}
      data-node-id={nodeId ?? BUTTON_SETS[kind]}
      {...rest}
    >
      {icon && <img alt="" src={icon} className="btn__i" />}
      <span className="btn__t">{label}</span>
    </button>
  )
}
