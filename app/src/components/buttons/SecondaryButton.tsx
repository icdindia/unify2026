import type { ComponentPropsWithRef } from 'react'
import { cx } from './cx'
import './secondary-button.css'

export type SecondaryButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string
  /** xs 24px (page header, option 1) or sm 28px (page header, option 2). */
  size?: 'xs' | 'sm'
  /** Figma node of this instance (data-node-id), when known. */
  nodeId?: string
}

/** Buttons/Button Neutral, Secondary: white fill, 1px inset ring. The page header's Share. */
export function SecondaryButton({ label, size = 'xs', nodeId, className, type = 'button', ...rest }: SecondaryButtonProps) {
  return (
    <button type={type} className={cx('sbtn', size === 'sm' && 'sbtn--sm', className)} data-node-id={nodeId} {...rest}>
      <span className="sbtn__t">{label}</span>
    </button>
  )
}
