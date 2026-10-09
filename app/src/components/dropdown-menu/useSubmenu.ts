import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { MenuFocus } from './DropdownMenu'

/**
 * Cascading-submenu behaviour from prototypes/project-dashboard/app.js ("Move to project"):
 * hovering or clicking the trigger opens the submenu at once; leaving the trigger or the submenu closes it after
 * 250ms unless the pointer arrives in the other one; hovering a sibling item closes it after 120ms.
 * From the keyboard, Enter / Space / ArrowRight on the trigger open it with focus on its first control, and
 * ArrowLeft inside it (outside its search field) closes it and puts focus back on the trigger.
 *
 *   const sub = useSubmenu({ onOpen: () => setSubPos(...) })   // measure in onOpen, as openSub() did
 *   <DropdownItem submenu {...sub.triggerProps} ... />
 *   <DropdownItem {...sub.siblingProps} ... />
 *   {sub.open && <DropdownMenu {...sub.menuProps} ... />}
 */
export function useSubmenu({ onOpen, closeDelay = 250, siblingDelay = 120 }: { onOpen?: () => void; closeDelay?: number; siblingDelay?: number } = {}) {
  const [open, setOpen] = useState(false)
  const [focusOnOpen, setFocusOnOpen] = useState(false)
  const trigger = useRef<HTMLElement | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const cancel = useCallback(() => window.clearTimeout(timer.current), [])
  const closeIn = (ms: number) => { cancel(); timer.current = window.setTimeout(() => setOpen(false), ms) }
  const show = (withFocus = false) => { cancel(); onOpen?.(); setFocusOnOpen(withFocus); setOpen(true) }
  const close = () => { cancel(); setOpen(false) }
  useEffect(() => cancel, [cancel])

  return {
    open,
    show,
    close,
    /** Spread on the submenu's DropdownItem (includes `open`, which keeps its hover fill). */
    triggerProps: {
      open,
      onMouseEnter: (e: MouseEvent<HTMLElement>) => { trigger.current = e.currentTarget; show() },
      onMouseLeave: () => closeIn(closeDelay),
      // a keyboard click (Enter / Space, detail 0) also moves focus into the submenu
      onClick: (e: MouseEvent<HTMLElement>) => { trigger.current = e.currentTarget; show(e.detail === 0) },
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (e.key !== 'ArrowRight') return
        e.preventDefault()
        trigger.current = e.currentTarget
        show(true)
      },
    },
    /** Spread on the submenu's DropdownMenu. */
    menuProps: {
      autoFocus: (focusOnOpen ? 'first' : undefined) as MenuFocus | undefined,
      onMouseEnter: cancel,
      onMouseLeave: () => closeIn(closeDelay),
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (e.key !== 'ArrowLeft' || (e.target instanceof Element && e.target.closest('input, textarea'))) return
        e.preventDefault()
        trigger.current?.focus() // before closing, so the submenu does not hand focus to its anchor as it unmounts
        close()
      },
    },
    /** Spread on the parent menu's other items. */
    siblingProps: { onMouseEnter: () => closeIn(siblingDelay) },
  }
}
