import type { KeyboardEvent } from 'react'
import { BrandButton } from './BrandButton'
import { cx } from './cx'
import './tabs.css'

export type TabItem = {
  id: string
  label: string
  /** underline only: 14px icon URL (see tabIcons). */
  icon?: string
  /** pill only: the file's whole-pixel text box width, see BrandButton. */
  textWidth?: number
}

export type TabsProps = {
  items: TabItem[]
  selected: string
  onSelect?: (id: string) => void
  /** underline: inside page option 1. pill: inside page option 2 (Button Brand sm). */
  variant?: 'underline' | 'pill'
  'aria-label'?: string
  nodeId?: string
  className?: string
  /** Review harness only (?state=frame): draw this tab in its hover state, as the Figma frame does. */
  pinnedHover?: string
}

const KEY_STEPS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity }

/**
 * onKeyDown for any role="tablist": ArrowRight / ArrowLeft move focus to the next / previous tab (wrapping), Home /
 * End to the first / last. The step starts from the focused tab, so it works whether or not selection follows.
 * Returns the index of the newly focused tab, or -1 when the key was not a tab key.
 */
export function moveTabFocus(e: KeyboardEvent<HTMLElement>): number {
  const step: number | undefined = KEY_STEPS[e.key]
  if (step === undefined) return -1
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'))
  const i = tabs.indexOf(document.activeElement as HTMLElement)
  if (!tabs.length || i < 0) return -1
  e.preventDefault()
  const next = step === -Infinity ? 0 : step === Infinity ? tabs.length - 1 : (i + step + tabs.length) % tabs.length
  tabs[next].focus()
  return next
}

/**
 * Page tabs. A WAI-ARIA tablist: only the current tab is in the Tab order, and the arrow keys (plus Home / End)
 * move between tabs and select them (with `onSelect`; without it they only move focus, Enter / Space do nothing yet).
 */
export function Tabs({ items, selected, onSelect, variant = 'underline', 'aria-label': label, nodeId, className, pinnedHover }: TabsProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = moveTabFocus(e)
    if (next > -1) onSelect?.(items[next].id)
  }

  return (
    <div className={cx(variant === 'pill' ? 'pills' : 'tabs', className)} role="tablist" aria-label={label}
         data-node-id={nodeId} onKeyDown={onKeyDown}>
      {items.map(t => {
        const current = t.id === selected
        const hover = t.id === pinnedHover && 'is-hover'
        const a11y = { role: 'tab', 'aria-selected': current, tabIndex: current ? 0 : -1, onClick: () => onSelect?.(t.id) } as const
        return variant === 'pill' ? (
          <BrandButton key={t.id} label={t.label} variant={current ? 'primary' : 'secondary'} textWidth={t.textWidth} className={hover || undefined} {...a11y} />
        ) : (
          <button key={t.id} type="button" className={cx('tab', current && 'is-current', hover)} {...a11y}>
            <span className="tab__in">
              <span className="tab__txt">
                {t.icon && <img alt="" src={t.icon} className="tab__i" />}
                <span className="tab__l">{t.label}</span>
              </span>
              {current && <span className="tab__bar" />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
