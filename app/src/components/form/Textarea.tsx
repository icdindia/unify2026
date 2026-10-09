import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import './field.css'

/** "Textarea input field" set 172:61281. */
export const TEXTAREA_SET = '172:61281'

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  /** Label=True: Text sm Regular, text-tertiary, 6px above ("Send Personalised Note", "Why"). */
  label?: ReactNode
  hint?: ReactNode
  /** Destructive=True: border-error; a string replaces the hint. */
  error?: boolean | string
  /**
   * Visible lines (20px each, plus 8 / 8 padding). The set draws 2 (56px); the share invite note is 4 (96px,
   * 1819:316471), the usage request 3.6 (88px, 6802:236152): pass `rows` or size the field from the caller.
   */
  rows?: number
  fieldClassName?: string
  nodeId?: string
}

/** Textarea input field: a real <textarea> in the DS frame; Focused is the brand-secondary ring (178:43951). */
export function Textarea({ label, hint, error, rows = 2, fieldClassName, nodeId = TEXTAREA_SET, className, id, ...rest }: TextareaProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const message = typeof error === 'string' ? error : hint
  const hintId = message ? `${inputId}-hint` : undefined
  return (
    <div className={cx('field', 'field--textarea', fieldClassName)} data-node-id={nodeId}>
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <textarea
        id={inputId} rows={rows} className={cx('field__textarea', !!error && 'is-error', className)}
        aria-invalid={error ? true : undefined} aria-describedby={hintId} {...rest}
      />
      {message && <p className={cx('field__hint', !!error && 'is-error')} id={hintId}>{message}</p>}
    </div>
  )
}
