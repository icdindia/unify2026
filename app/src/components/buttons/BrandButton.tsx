import type { ComponentPropsWithRef } from 'react'
import { cx } from './cx'
import './brand-button.css'

export type BrandButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string
  /** sm: Primary = brand solid, Secondary = white. md exists in the file only as Primary, so `variant` is ignored there. */
  variant?: 'primary' | 'secondary'
  /** sm 28px (option 2 tabs and dropdowns) or md 32px ("New Project"). */
  size?: 'sm' | 'md'
  /** md only: leading 14px icon URL. */
  icon?: string
  /** sm only: trailing chevron-down-sm, for a button that opens a dropdown. */
  chevron?: boolean
  /** sm only, with `chevron`: right padding 4px ('xs', "All") or 6px ('sm', "Newest"), as drawn in the file. */
  chevronPadding?: 'xs' | 'sm'
  /** sm only: pins the label box to the file's whole-pixel "Text padding" width (Chrome sets text up to 0.6px narrower). */
  textWidth?: number
  /** Figma node of this instance (data-node-id), when known. */
  nodeId?: string
}

/** Buttons/Button Brand. */
export function BrandButton({
  label, variant = 'secondary', size = 'sm', icon, chevron, chevronPadding = 'xs', textWidth, nodeId, className, type = 'button', ...rest
}: BrandButtonProps) {
  if (size === 'md') {
    return (
      <button type={type} className={cx('bbtn', className)} data-node-id={nodeId} {...rest}>
        {icon && <img alt="" src={icon} className="bbtn__i" />}
        <span className="bbtn__t">{label}</span>
      </button>
    )
  }
  return (
    <button
      type={type}
      className={cx('pill', variant === 'primary' && 'pill--primary', chevron && 'pill--dd', chevron && chevronPadding === 'sm' && 'pill--dd6', className)}
      data-node-id={nodeId} {...rest}
    >
      <span className="pill__t" style={textWidth ? { width: textWidth } : undefined}>{label}</span>
      {chevron && <span className="pill__c" aria-hidden="true" />}
    </button>
  )
}
