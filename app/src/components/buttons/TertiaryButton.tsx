import type { ComponentPropsWithRef } from 'react'
import { cx } from './cx'
import './tertiary-button.css'

export type TertiaryButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string
  /** Primary text colour instead of the tertiary grey (the current crumb). */
  strong?: boolean
  /** Trailing 14px icon URL, e.g. a chevron-down for a crumb that opens a menu. */
  trailingIcon?: string
  /** Figma node of this instance (data-node-id), when known. */
  nodeId?: string
}

/** Buttons/Button Neutral, Tertiary, sm (28px) with a label. Used for the breadcrumb crumbs. */
export function TertiaryButton({ label, strong, trailingIcon, nodeId, className, type = 'button', ...rest }: TertiaryButtonProps) {
  return (
    <button type={type} className={cx('tbtn', strong && 'tbtn--strong', className)} data-node-id={nodeId} {...rest}>
      <span className="tbtn__t">{label}</span>
      {trailingIcon && <img alt="" src={trailingIcon} className="tbtn__i14" />}
    </button>
  )
}
