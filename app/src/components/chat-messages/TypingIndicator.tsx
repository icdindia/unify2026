import { Avatar } from '../avatar/Avatar'
import { cx } from '../buttons/cx'
import type { MessageAuthor } from './types'
import './messages.css'

/** The typing row of chat-artifact 13 ("Agent Thoughts" 1768:345968, detached). */
export const TYPING_ROW_FRAME = '1768:345968'
/** "Three dots animation" set 1768:345844 (State=1 1768:345845 → 2 → 3, 0.3s Smart animate each). */
export const THREE_DOTS_SET = '1768:345844'
/** The Avatar instance the row uses: Avatar / Size=xxs, Type=Letter, Colour=Brand Solid (14037:937139). */
const TYPING_AVATAR = '14037:937139'

export type TypingIndicatorProps = {
  /** Who is typing (avatarOn(id, 'message') gives Matt's plum-700 fill, as 13 draws it). */
  person: MessageAuthor
  /** 'split': the chat column beside an open artifact (no hang). Default 'full'. */
  column?: 'full' | 'split'
  /** The avatar hangs 32px left of the column (x 336 against 368), as drawn. Default: on in the full column only. */
  hang?: boolean
  /** Freeze the dots on State=1 (screenshots; prefers-reduced-motion does the same). */
  still?: boolean
  className?: string
}

/**
 * "Matt Rivera ···": a 20px row with the person's xxs avatar, their name (Text xs) and the three-dot animation. The
 * chat draws it 8px above the composer (y 797 over the composer at 825), outside the thread. A polite live region
 * announces "Matt Rivera is typing".
 */
export function TypingIndicator({ person, column = 'full', hang = column === 'full', still, className }: TypingIndicatorProps) {
  return (
    <div className={cx('cm-typing', !hang && 'cm-typing--inset', className)} role="status" data-node-id={TYPING_ROW_FRAME}>
      <Avatar name={person.name} initial={person.initial} colour={person.colour} size="xxs" decorative nodeId={TYPING_AVATAR} className="cm-typing__av" />
      <span className="cm-typing__label">
        <span className="cm-typing__name">{person.name}</span>
        <span className="cm-sr"> is typing</span>
        <span className={cx('cm-dots', still && 'is-still')} aria-hidden="true" data-node-id={THREE_DOTS_SET}>
          <span className="cm-dots__d" /><span className="cm-dots__d" /><span className="cm-dots__d" />
        </span>
      </span>
    </div>
  )
}
