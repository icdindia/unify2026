import type { ComponentPropsWithRef } from 'react'
import { cx } from './cx'
import './button-group.css'

/** A row of buttons 8px apart (prototype: .filters in option 1, the All / Newest .pills in option 2). */
export function ButtonGroup({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('btn-group', className)} {...rest} />
}
