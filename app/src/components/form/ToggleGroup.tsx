import { useRef, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import './toggle-group.css'

/** "Toggle group" set 94:113940 (Type=Default, Style=Icon only, Size=xs); segments "_Toggle group base" 94:113093. */
export const TOGGLE_GROUP_SET = '94:113940'

export type ToggleGroupOption<V extends string> = {
  value: V
  /** Accessible name of the icon-only segment (also its tooltip). */
  label: string
  icon: ReactNode
  disabled?: boolean
}

export type ToggleGroupProps<V extends string> = Omit<ComponentPropsWithRef<'div'>, 'children' | 'onChange'> & {
  options: ToggleGroupOption<V>[]
  value: V
  onChange: (value: V) => void
  /** Name of the whole choice, e.g. "View" or "Show". */
  'aria-label': string
  nodeId?: string
}

/**
 * Toggle group, icon only, xs: a single choice between 2+ segments (preview / code, list / grid). It is a radio group:
 * one Tab stop on the current segment, arrow keys move and select, Home / End jump to the ends.
 */
export function ToggleGroup<V extends string>({ options, value, onChange, nodeId = TOGGLE_GROUP_SET, className, ...rest }: ToggleGroupProps<V>) {
  const root = useRef<HTMLDivElement | null>(null)
  const enabled = options.filter(o => !o.disabled)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = enabled.findIndex(o => o.value === value)
    let next: number
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % enabled.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1
    else return
    e.preventDefault()
    const target = enabled[next]
    onChange(target.value)
    root.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(target.value)}"]`)?.focus()
  }

  return (
    <div ref={root} role="radiogroup" className={cx('tgl', 'tgl--xs', className)} data-node-id={nodeId} onKeyDown={onKeyDown} {...rest}>
      {options.map(o => {
        const current = o.value === value
        return (
          <button
            key={o.value} type="button" role="radio" aria-checked={current} aria-label={o.label} title={o.label}
            tabIndex={current ? 0 : -1} disabled={o.disabled} data-value={o.value}
            className={cx('tgl__seg', current && 'is-current')} onClick={() => onChange(o.value)}
          >
            {o.icon}
          </button>
        )
      })}
    </div>
  )
}
