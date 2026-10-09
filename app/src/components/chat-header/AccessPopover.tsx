import type { PointerEventHandler } from 'react'
import type { AvatarColour } from '../avatar/Avatar'
import { OptionMenu, type OptionMenuOption } from '../option-menu/OptionMenu'
import { Popover, type PopoverCloseReason } from '../overlays/popover/Popover'
import { useChatChromeFix } from './fixes'
import './chat-header.css'

/** One row of the people-with-access list (resolve names / fills with fixtures' avatarOn(id, 'access') + useResolved). */
export type AccessPerson = {
  id: string
  name: string
  initial?: string
  colour?: AvatarColour
  /** "Owner" | "Editor" | "Commenter" | "Viewer" */
  role: string
  /** The signed-in user: " (You)" after the name. */
  you?: boolean
}

export type AccessPopoverProps = {
  open: boolean
  /** The header's avatar-stack button. */
  anchor: HTMLElement | null
  people: AccessPerson[]
  onClose?: (reason: PopoverCloseReason) => void
  /** "Manage access" (fix access-popover-manage): opens the share modal. Without it the row is not drawn. */
  onManage?: () => void
  /** Positioned container (default <body>). */
  portalTo?: HTMLElement | null
  /** Hover-open support: the header keeps the popover open while the pointer is over it. */
  onPointerEnter?: PointerEventHandler<HTMLDivElement>
  onPointerLeave?: PointerEventHandler<HTMLDivElement>
  /** Move focus into the list (opened from the keyboard). */
  autoFocus?: boolean
  /** Figma node, rendered as data-node-id on the card: the access popover of chat-artifact 15 (Input Menu Dropdown 1809:365546). */
  nodeId?: string
}

/**
 * People with access (chat-artifact 15, header-dropdowns c04): "Input Menu Dropdown / Type=Single Select, Size=sm"
 * 225 x 212 (1809:365546), hung 4px under the avatar stack with its right edge 7px in from the stack's (x 1016-1241
 * under the stack at 1184-1248). Read-only rows: 18px letter avatar, name, " (You)", role in mono (OptionMenu readOnly
 * + spaced, measured by wave 1 against this very node). With fixes on, a "Manage access" row opens the share modal (Q41).
 */
export function AccessPopover({
  open, anchor, people, onClose, onManage, portalTo, onPointerEnter, onPointerLeave, autoFocus, nodeId = '1809:365546',
}: AccessPopoverProps) {
  const manage = useChatChromeFix('access-popover-manage') && !!onManage
  const items: OptionMenuOption[] = people.map(p => ({
    id: p.id,
    label: p.name,
    suffix: p.you ? ' (You)' : undefined,
    avatar: { name: p.name, initial: p.initial, colour: p.colour },
    role: p.role,
  }))
  return (
    <Popover
      open={open}
      anchor={anchor}
      onClose={onClose}
      placement="bottom-end"
      gap={4}
      width={225}
      surface="plain"
      portalTo={portalTo}
      autoFocus={autoFocus ? 'container' : undefined}
      aria-label="People with access"
      className="chh-access"
      nodeId={nodeId}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {manage ? (
        <div className="chh-access__card">
          <OptionMenu items={items} label="People with access" readOnly spaced size="sm" nodeId={nodeId} />
          <button type="button" className="chh-access__manage" onClick={onManage}>Manage access</button>
        </div>
      ) : (
        <OptionMenu items={items} label="People with access" readOnly spaced size="sm" nodeId={nodeId} />
      )}
    </Popover>
  )
}
