import { useRef, type Ref } from 'react'
import { cx } from '../buttons/cx'
import { BuildingIcon, BuildingOffIcon, ChipCloseIcon, TelescopeIcon } from './icons'
import './source-chips.css'

export type ChipSize = 'md' | 'icon'

type CompanyChipProps = {
  /** Company knowledge is searched (Sources=Yes) or not ("No Sources", Sources=No). */
  on: boolean
  onToggle?: (next: boolean) => void
  /** md: icon + label (Landing Page). icon: the 32px icon-only pill (Bottom small / Bottom large). */
  size?: ChipSize
  hover?: boolean
  ref?: Ref<HTMLButtonElement>
}

/**
 * Source Pill (set 7372:140000), State=Default | Hover, Sources=Yes | No, Size=md: building-05 + "Company" in
 * steel-blue-400 on bg-primary; hover steel-blue-25. Off reads "No Sources" behind the struck-through building in
 * icon-tertiary. A toggle button.
 */
export function CompanyChip({ on, onToggle, size = 'md', hover, ref }: CompanyChipProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx('cchip', `cchip--${size}`, !on && 'cchip--off', hover && 'is-hover')}
      aria-pressed={on}
      aria-label={size === 'icon' ? 'Company sources' : undefined}
      title={size === 'icon' ? (on ? 'Company' : 'No Sources') : undefined}
      data-node-id="7372:140000"
      onClick={() => onToggle?.(!on)}
    >
      <span className="cchip__icon">{on ? <BuildingIcon /> : <BuildingOffIcon />}</span>
      {size === 'md' && <span className="cchip__label">{on ? 'Company' : 'No Sources'}</span>}
    </button>
  )
}

type ResearchChipProps = {
  /** Removes the Research tool (the chip's × on hover). */
  onRemove?: () => void
  size?: ChipSize
  hover?: boolean
}

/**
 * Tools Pill (set 7372:140049), State=Default | Hover, Size=md: telescope + "Research". On hover (and on keyboard focus)
 * the telescope becomes a 16px round × (steel-blue-50) and the pill tints steel-blue-25; a click removes the tool.
 */
export function ResearchChip({ onRemove, size = 'md', hover }: ResearchChipProps) {
  return (
    <button
      type="button"
      className={cx('cchip', 'cchip--tool', `cchip--${size}`, hover && 'is-hover')}
      aria-label="Remove Research"
      title={size === 'icon' ? 'Research' : undefined}
      data-node-id="7372:140049"
      onClick={() => onRemove?.()}
    >
      <span className="cchip__icon">
        <TelescopeIcon className="cchip__glyph" />
        <span className="cchip__x"><ChipCloseIcon /></span>
      </span>
      {size === 'md' && <span className="cchip__label">Research</span>}
    </button>
  )
}

export type SourcesValue = { company: boolean; research: boolean }

type SourceChipsProps = {
  value: SourcesValue
  onChange?: (next: SourcesValue) => void
  size?: ChipSize
  /** Review only: `chip:company` / `chip:research`. */
  hover?: 'company' | 'research'
}

/**
 * The "Pills" frame of the action bar: Company, then Research while the tool is on. Removing Research unmounts the
 * focused chip, so focus moves to Company.
 */
export function SourceChips({ value, onChange, size = 'md', hover }: SourceChipsProps) {
  const company = useRef<HTMLButtonElement>(null)
  const removeResearch = () => {
    const hadFocus = document.activeElement instanceof HTMLElement && document.activeElement.closest('.cchip--tool') !== null
    onChange?.({ ...value, research: false })
    if (hadFocus) company.current?.focus()
  }
  return (
    <div className="cchips" role="group" aria-label="Sources and tools">
      <CompanyChip ref={company} size={size} on={value.company} hover={hover === 'company'} onToggle={next => onChange?.({ ...value, company: next })} />
      {value.research && <ResearchChip size={size} hover={hover === 'research'} onRemove={removeResearch} />}
    </div>
  )
}
