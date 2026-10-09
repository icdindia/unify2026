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
}

/** The Projects landing search: the file's 180px field (magnifier + "Search"), or the icon it folds to with the fix. */
export function ProjectSearch({ value, onChange, collapsible = true }: ProjectSearchProps) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) input.current?.focus()
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
          aria-label="Search projects"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape' && value) { e.preventDefault(); onChange('') } }}
        />
      </label>
    )
  }

  return (
    <div className={cx('psearch', open && 'is-open')}>
      <button ref={button} type="button" className="psearch__btn" aria-label="Search projects" aria-expanded={open} onClick={() => setOpen(true)}>
        <img alt="" src={searchIcon} />
      </button>
      <input
        ref={input}
        className="psearch__in"
        type="search"
        placeholder="Search"
        aria-label="Search projects"
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
