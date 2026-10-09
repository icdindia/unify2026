import { useEffect, useId, useRef, type ComponentPropsWithRef, type ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { Check10, Check12, Minus } from './icons'
import './checkbox.css'

/** "Checkbox" set 321:86462 (box: "_Checkbox base" 80:43599). */
export const CHECKBOX_SET = '321:86462'

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
  /** sm: 16px box, 12px check (the share modal's "Notify people"). xs: 14px box, 10px check (menus, tables). */
  size?: 'sm' | 'xs'
  /** Text=True: the label beside the box. Without it, pass an aria-label. */
  label?: ReactNode
  /** Hint Text=True: a second line under the label. */
  hint?: ReactNode
  /** Indeterminate=True (a "some selected" parent): white box, brand ring and a minus. */
  indeterminate?: boolean
  /** The new checked value, like Switch's onChange and ToggleGroup's (the native onChange still fires too). */
  onCheckedChange?: (checked: boolean) => void
  nodeId?: string
}

/**
 * Checkbox: a real <input type="checkbox"> laid over the drawn box, so clicks, Space, forms and screen readers all
 * work natively; the box mirrors its :checked / :indeterminate / :disabled / :focus-visible state.
 * The label is Text sm Regular: both instances in these journeys ("Notify people" in the share invite 1819:316471,
 * "Goes to your workspace admin" in the usage request I6802:236153) override the set's Medium to Regular.
 */
export function Checkbox({
  size = 'sm', label, hint, indeterminate = false, onCheckedChange, onChange, nodeId = CHECKBOX_SET, className, id, ref, ...rest
}: CheckboxProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hintId = hint ? `${inputId}-hint` : undefined
  const el = useRef<HTMLInputElement | null>(null)
  useEffect(() => { if (el.current) el.current.indeterminate = indeterminate }, [indeterminate])
  const setRef = (node: HTMLInputElement | null) => {
    el.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }
  return (
    <label className={cx('cbx', `cbx--${size}`, !label && 'cbx--bare', className)} data-node-id={nodeId} htmlFor={inputId}>
      <span className="cbx__wrap">
        <input
          ref={setRef} id={inputId} type="checkbox" className="cbx__input"
          aria-describedby={hintId}
          onChange={onCheckedChange ? e => { onChange?.(e); onCheckedChange(e.currentTarget.checked) } : onChange}
          {...rest}
        />
        <span className="cbx__box" aria-hidden="true">
          {size === 'sm' ? <Check12 className="cbx__check" /> : <Check10 className="cbx__check" />}
          <Minus size={size === 'sm' ? 12 : 10} className="cbx__minus" />
        </span>
      </span>
      {(label || hint) && (
        <span className="cbx__text">
          {label && <span className="cbx__label">{label}</span>}
          {hint && <span className="cbx__hint" id={hintId}>{hint}</span>}
        </span>
      )}
    </label>
  )
}
