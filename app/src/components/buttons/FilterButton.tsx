import type { ComponentPropsWithRef } from 'react'
import { cx } from './cx'
import './filter-button.css'

export type FilterButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  label: string
  /** Leading icon URL: 14px for sm, 16px for xs (see toolbarIcons). */
  icon: string
  /** sm: inside page toolbar, styled like the tabs (Text sm). xs: Projects page chips (Text xs/Medium). */
  size?: 'sm' | 'xs'
  /** Figma node of this instance (data-node-id), when known. */
  nodeId?: string
}

/** Tertiary filter / sort trigger with a leading icon ("All Chats", "Newest"). */
export function FilterButton({ label, icon, size = 'sm', nodeId, className, type = 'button', ...rest }: FilterButtonProps) {
  return (
    <button type={type} className={cx('ftab', size === 'sm' && 'ftab--sm', className)} data-node-id={nodeId} {...rest}>
      <img alt="" src={icon} className="ftab__i" />
      <span className="ftab__t">{label}</span>
    </button>
  )
}
