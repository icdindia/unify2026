import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import type { OptionMenuOption } from '../option-menu/OptionMenu'
import { ME, avatarOn, type PersonId } from '../../fixtures/people'
import { CHAT_ACCESS, type Role } from '../../fixtures/share'
import { pick, useFixPredicate } from '../../fixtures/drift'

// The popover itself is components/chat-header/AccessPopover (the one ChatHeader opens in chat-artifact 15); this file
// keeps the helpers around it: the OptionMenu rows of an access list and the hover-to-open hook.

/** The access popover of chat-artifact 15: the "Input Menu Dropdown" (Size=sm) instance 1809:365546, 225 x 212 at
 *  1015.5, 36 (the same card is drawn alone as 6077:427693 in header-dropdowns c04). */
export const ACCESS_POPOVER_NODE = '1809:365546'

export type AccessEntry = { person: PersonId; role: Role }

/** OptionMenu rows of a people-with-access list: avatar, name ("(You)" after the signed-in user), mono role. As designed
 *  the names and fills follow the access surface of the frames (John Whitake, header fills), resolved by the switch. */
export function useAccessOptions(entries: AccessEntry[] = CHAT_ACCESS): OptionMenuOption[] {
  const applies = useFixPredicate()
  return useMemo(() => entries.map(({ person, role }) => {
    const a = avatarOn(person, 'access')
    const name = pick(a.name, applies)
    return {
      id: person, label: name, suffix: person === ME ? ' (You)' : undefined, role,
      avatar: { name, initial: a.initial, colour: pick(a.colour, applies) },
    }
  }), [entries, applies])
}

/**
 * Open on hover (after `openDelay`), keep open while the pointer is over the trigger or the card, close after
 * `closeDelay` once it leaves both. Click toggles and pins it open; Enter / Space on the trigger opens it with focus inside.
 */
export function useHoverPopover({ openDelay = 150, closeDelay = 200 }: { openDelay?: number; closeDelay?: number } = {}) {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const clear = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = undefined }
  useEffect(() => clear, [])
  const enter = useCallback(() => {
    clear()
    timer.current = window.setTimeout(() => setOpen(true), openDelay)
  }, [openDelay])
  const leave = useCallback(() => {
    clear()
    if (!pinned) timer.current = window.setTimeout(() => setOpen(false), closeDelay)
  }, [closeDelay, pinned])
  const close = useCallback(() => { clear(); setOpen(false); setPinned(false); setKeyboard(false) }, [])
  return {
    open,
    /** Focus moves into the card (it was opened from the keyboard). */
    keyboard,
    close,
    triggerProps: {
      'aria-expanded': open,
      'aria-haspopup': 'dialog' as const,
      onPointerEnter: (e: PointerEvent<HTMLElement>) => { if (e.pointerType === 'mouse') enter() },
      onPointerLeave: (e: PointerEvent<HTMLElement>) => { if (e.pointerType === 'mouse') leave() },
      onClick: (e: { detail: number }) => {
        clear()
        const fromKeys = e.detail === 0
        setKeyboard(fromKeys)
        if (open && pinned) close()
        else { setOpen(true); setPinned(true) }
      },
    },
    popoverProps: {
      onPointerEnter: () => clear(),
      onPointerLeave: (e: PointerEvent<HTMLDivElement>) => { if (e.pointerType === 'mouse') leave() },
    },
  }
}
