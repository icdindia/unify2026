import type { ComponentPropsWithRef } from 'react'
import { cx } from '../buttons/cx'
import './dot.css'

/** "Dot" sets: 3:1104 (md, the comments unread dot) and 5220:198528 (sm, inside Pill squared Icon=Dot). */
export const DOT_SETS = { md: '3:1104', sm: '5220:198528' } as const

export type DotColour = 'brand' | 'success' | 'error' | 'warning' | 'gray'

export type DotProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** md: 10px frame, 8px dot. sm: 8px frame, 6px dot. */
  size?: 'sm' | 'md'
  colour?: DotColour
  /** When the dot carries meaning on its own ("Unread"), its accessible name. Otherwise it is decorative. */
  label?: string
  nodeId?: string
}

/** Dot / Outline=False: a filled circle in its frame (utility-<colour>-500). */
export function Dot({ size = 'md', colour = 'brand', label, nodeId, className, ...rest }: DotProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }
  return <span className={cx('dot', `dot--${size}`, `dot--${colour}`, className)} data-node-id={nodeId ?? DOT_SETS[size]} {...a11y} {...rest} />
}
