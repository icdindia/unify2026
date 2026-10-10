import { useEffect, useRef, useState } from 'react'
import { cx } from '../../components'
import searchIcon from '../../assets/chrome/dd-search.svg'

export type ProjectSearchProps = {
  value: string
  onChange: (value: string) => void
  /**
   * Fold to an icon (fix landing-search-icon): a 28px tertiary icon button at rest, the file's 180px field once
   * pressed; Esc, or leaving it empty, clears it and folds it back. Without it the field is always open, as drawn.
   */
  collapsible?: boolean
  /** Start open (a review URL with search=open, artifacts-landing 04). */
  defaultOpen?: boolean
  /** What it searches, for its accessible name ("Search projects"). */
  label?: string
}

/** The Projects landing search: the file's 180px field (magnifier + "Search"), or the icon it folds to with the fix. */
export function ProjectSearch({ value, onChange, collapsible = true, defaultOpen = false, label = 'Search projects' }: ProjectSearchProps) {
  const [open, setOpen] = useState(defaultOpen)
  const opened = useRef(defaultOpen) // a field that starts open (review URL) does not take focus on load
  const button = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !opened.current) input.current?.focus()
    opened.current = false
  }, [open])

  const close = () => {
    onChange('')
    setOpen(false)
  }

  if (!collapsible) {
    // As drawn: always open. Esc clears it.
    return (
      <label className="psearch is-open">
        <img alt="" src={searchIcon} className="psearch__i" />
        <input
          className="psearch__in"
          type="search"
          placeholder="Search"
          aria-label={label}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape' && value) { e.preventDefault(); onChange('') } }}
        />
      </label>
    )
  }

  return (
    <div className={cx('psearch', open && 'is-open')}>
      <button ref={button} type="button" className="psearch__btn" aria-label={label} aria-expanded={open} onClick={() => setOpen(true)}>
        <img alt="" src={searchIcon} />
      </button>
      <input
        ref={input}
        className="psearch__in"
        type="search"
        placeholder="Search"
        aria-label={label}
        tabIndex={open ? 0 : -1}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key !== 'Escape') return
          close()
          button.current?.focus()
        }}
        onBlur={() => {
          if (!value.trim()) close()
        }}
      />
    </div>
  )
}
