import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { AlertCircle16 } from './icons'
import './field.css'

/** "Input field_outline" set 1407:188084. */
export const INPUT_FIELD_SET = '1407:188084'

export type InputFieldSize = 'lg' | 'md' | 'sm' | 'xs'

export type InputFieldProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  /** lg 36 · md 32 (Text sm, radius 8, gap 8) · sm 28 · xs 24 (Text xs, radius 6, gap 4). */
  size?: InputFieldSize
  /** Label=True: Text sm Regular, text-tertiary, 6px above the field. Without it, pass an aria-label. */
  label?: ReactNode
  /** Hint text=True under the field. */
  hint?: ReactNode
  /** Type=Icon leading: a 16px icon before the text (icon-secondary). */
  icon?: ReactNode
  /** Content after the text (a unit, a clear button). */
  trailing?: ReactNode
  /** Destructive=True: border-error and the alert-circle icon; a string replaces the hint with the error message. */
  error?: boolean | string
  /** Width of the whole field (label included). Default: fill the container. */
  fieldClassName?: string
  nodeId?: string
}

/**
 * Input field (outline): a real <input> in the DS frame. States are native: :placeholder-shown, :focus-within (the
 * Focused ring), :disabled, [readonly]; Destructive comes from `error`.
 */
export function InputField({
  size = 'lg', label, hint, icon, trailing, error, fieldClassName, nodeId = INPUT_FIELD_SET, className, id, disabled, readOnly, ...rest
}: InputFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const message = typeof error === 'string' ? error : hint
  const hintId = message ? `${inputId}-hint` : undefined
  return (
    <div className={cx('field', `field--${size}`, fieldClassName)} data-node-id={nodeId}>
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <div className={cx('field__control', !!error && 'is-error', disabled && 'is-disabled', readOnly && 'is-readonly', className)}>
        {/* the set's "Content" frame: the leading icon and the text, 6 apart (4 at sm / xs), inside the 8-gap Input row */}
        <span className="field__content">
          {icon && <span className="field__icon" aria-hidden="true">{icon}</span>}
          <input
            id={inputId} className="field__input" disabled={disabled} readOnly={readOnly}
            aria-invalid={error ? true : undefined} aria-describedby={hintId} {...rest}
          />
        </span>
        {trailing}
        {error && <AlertCircle16 className="field__alert" />}
      </div>
      {message && <p className={cx('field__hint', !!error && 'is-error')} id={hintId}>{message}</p>}
    </div>
  )
}
