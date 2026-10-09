import { useState, type MouseEvent, type Ref } from 'react'
import { IconButton, buttonIcons, cx, openMenuOnArrowDown } from '../../components'
import { relativeAge, type Chat } from '../../data/chats'
import { useProjectFixes } from '../../fixes/projects'
import './chat-table.css'

export type ChatTableProps = {
  chats: Chat[]
  /** Id of the chat whose ⋮ menu is open: its row keeps the hover look and its ⋮ stays highlighted. */
  menuFor?: string | null
  onRowMenu: (chat: Chat, e: MouseEvent<HTMLButtonElement>) => void
  /** Ref to each row's ⋮ button, keyed by chat id (the review harness opens a menu from it). */
  rowMenuRef?: (chatId: string) => Ref<HTMLButtonElement>
  /** Review harness only (?state=frame): draw this row, and its ⋮, in the hover state drawn in the frame. */
  pinnedHoverRow?: number
  className?: string
}

const MAX_FACES = 3

/**
 * Chats table: Chat, Team (avatar group), Cost, Time & Date; on hover or keyboard focus the row's ⋮ takes the age's
 * place. "With fixes" applies the prototype's UX pass (src/fixes/projects.ts): renamed, darker headers, real team
 * counts with names, the ⋮ beside the age, an underlined name and row-coloured avatar rings on hover, date tooltips.
 */
export function ChatTable({ chats, menuFor, onRowMenu, rowMenuRef, pinnedHoverRow, className }: ChatTableProps) {
  const [now] = useState(Date.now) // ages are relative to when the table first rendered
  const fx = useProjectFixes()
  const labels = fx('table-header-labels')
  const dated = fx('chats-newest-first')

  return (
    <div
      className={cx(
        'chat-table', className,
        fx('table-header-contrast') && 'chat-table--fx-contrast',
        fx('row-actions-keep-time') && 'chat-table--fx-keep-time',
        fx('row-hover-underline') && 'chat-table--fx-underline',
        fx('avatar-ring-row-colour') && 'chat-table--fx-ring',
      )}
      role="table"
      aria-label="Chats"
    >
      <div className="tr tr--head" role="row">
        <div className="th" role="columnheader">Chat</div>
        <div className="th th--r th--team" role="columnheader">Team</div>
        {labels ? (
          <div className="th th--r th--cost" role="columnheader" title="Total model cost of this chat so far">Cost / chat</div>
        ) : (
          <div className="th th--r th--cost" role="columnheader">Cost</div>
        )}
        <div className="th th--r" role="columnheader">{labels ? 'Last active' : 'Time & Date'}</div>
      </div>
      {chats.map((chat, i) => {
        const hovered = i === pinnedHoverRow
        const at = new Date(now - chat.minutesAgo * 60_000)
        return (
          <div key={chat.id} className={cx('tr tr--body', hovered && 'is-hover', menuFor === chat.id && 'is-active')}
               role="row" tabIndex={0} aria-label={`Open chat: ${chat.title}`}>
            <div className="td" role="cell"><span className="td__txt td__name">{chat.title}</span></div>
            <div className="td td--r td--team" role="cell"><AvatarGroup chat={chat} /></div>
            <div className="td td--r td--cost" role="cell"><span className="td__txt">{chat.cost}</span></div>
            <div className="td td--r td--time" role="cell">
              <time className="td__time" dateTime={at.toISOString()} title={dated ? formatAbsolute(at) : undefined}>{relativeAge(chat.minutesAgo)}</time>
              <IconButton
                ref={rowMenuRef?.(chat.id)}
                className={cx('rowbtn', hovered && 'is-hover')}
                icon={buttonIcons.moreVertical16}
                aria-label={`Actions for ${chat.title}`}
                aria-haspopup="menu"
                aria-expanded={menuFor === chat.id}
                onClick={e => onRowMenu(chat, e)}
                onKeyDown={openMenuOnArrowDown}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * The Team cell. As designed: the faces the frame draws, then its fixed "+5" (blank when the frame draws no team).
 * With "team-real-overflow": up to three faces, then the real "+N", or "—" when nobody has joined. With
 * "avatar-name-tooltips" each face (and the badge, for the rest) names its members.
 */
function AvatarGroup({ chat }: { chat: Chat }) {
  const fx = useProjectFixes()
  const named = fx('avatar-name-tooltips')
  const { team, drawn } = chat
  const real = fx('team-real-overflow')
  if (real && !team.length) return <span className="td__none" role="img" aria-label="No members yet" title={named ? 'No members yet' : undefined}>—</span>
  if (!real && !drawn) return null
  const faces = real ? MAX_FACES : drawn!.faces
  const shown = team.slice(0, faces)
  const rest = team.slice(faces)
  const more = real ? rest.length : drawn!.more
  return (
    <span className="avs" role="img" aria-label={team.map(m => m.name).join(', ')}>
      {shown.map((m, i) => (
        <span key={i} className={`av av--${m.colour}`} title={named ? m.name : undefined}>{m.initial}</span>
      ))}
      {more > 0 && <span className="av av--more" title={named && rest.length ? rest.map(m => m.name).join(', ') : undefined}>{`+${more}`}</span>}
    </span>
  )
}

const formatAbsolute = (d: Date) =>
  d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
