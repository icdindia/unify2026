import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import './switch.css'

/** "Toggle" set 1188:177241 (track: "_Toggle base" 1188:177120). */
export const TOGGLE_SET = '1188:177241'

export type SwitchSize = 'xxxs' | 'xxs' | 'xs' | 'sm'

export type SwitchProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'onChange' | 'role'> & {
  checked: boolean
  onChange?: (checked: boolean) => void
  /** xxxs 20×12 (the collaborative bar's Assistant Replies) · xxs 24×14 · xs 28×16 · sm 36×20. */
  size?: SwitchSize
  /** Text=True: the visible label. Without it, pass an aria-label. */
  label?: ReactNode
  /** Hint Text=True. */
  hint?: ReactNode
  /** Label Position: the label before (Left, as every use in the file) or after the track. */
  labelPosition?: 'left' | 'right'
  nodeId?: string
}

/**
 * Toggle (switch): a <button role="switch" aria-checked>. Space / Enter / click flip it; the label is a <label> for
 * the button, so clicking the words flips it too.
 */
export function Switch({
  checked, onChange, size = 'xs', label, hint, labelPosition = 'left', nodeId = TOGGLE_SET, className, id, onClick, disabled, ...rest
}: SwitchProps) {
  const autoId = useId()
  const buttonId = id ?? autoId
  const hintId = hint ? `${buttonId}-hint` : undefined
  const track = (
    <button
      type="button" role="switch" id={buttonId} aria-checked={checked} aria-describedby={hintId} disabled={disabled}
      className={cx('switch', `switch--${size}`, !label && className)}
      data-node-id={label ? undefined : nodeId}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) onChange?.(!checked) }}
      {...rest}
    >
      <span className="switch__knob" />
    </button>
  )
  if (!label && !hint) return track
  return (
    <span className={cx('switch-field', `switch-field--${size}`, `switch-field--${labelPosition}`, disabled && 'is-disabled', className)} data-node-id={nodeId}>
      <span className="switch-field__text">
        {label && <label className="switch-field__label" htmlFor={buttonId}>{label}</label>}
        {hint && <span className="switch-field__hint" id={hintId}>{hint}</span>}
      </span>
      <span className="switch-field__wrap">{track}</span>
    </span>
  )
}
