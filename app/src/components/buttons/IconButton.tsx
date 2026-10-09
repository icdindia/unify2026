import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from './cx'
import './icon-button.css'

export type IconButtonSize = 'xs' | 'sm' | 'md'

export type IconButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /** Icon-only, so the accessible name is required. */
  'aria-label': string
  /** xs 24px (page header, option 1), sm 28px (page header, option 2), md 32px (composer, table row). */
  size?: IconButtonSize
  /** Icon URL (an imported SVG). xs takes the 24px export that includes its padding; sm and md take 16px icons. */
  icon?: string
  /** Fully rounded, like the composer's "+". */
  round?: boolean
  /** Custom icon markup instead of `icon` (e.g. the composer's inset OpenAI mark). */
  children?: ReactNode
  /** Figma node of this instance (data-node-id), when known. */
  nodeId?: string
}

/** Buttons/Button Neutral, Tertiary, icon only. Pass `aria-expanded` when it opens a menu: the hover fill stays while open. */
export function IconButton({ size = 'md', icon, round, nodeId, className, children, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx('ibtn', `ibtn--${size}`, round && 'ibtn--round', className)} data-node-id={nodeId} {...rest}>
      {icon ? <img alt="" src={icon} /> : children}
    </button>
  )
}
