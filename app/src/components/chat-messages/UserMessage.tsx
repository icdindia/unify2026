import { Avatar } from '../avatar/Avatar'
import { cx } from '../buttons/cx'
import { useChatMessageFix } from './fixes'
import { CopyIcon, EditIcon } from './icons'
import { RichRuns, type MentionStyle } from './RichText'
import { copyToClipboard, isMention, plainText, type MessageAuthor, type UserMessageData } from './types'
import './messages.css'

/** "Copilot_User Message_Desktop full" set 14839:266735: the viewer's own message (right, grey bubble, hover actions). */
export const OWN_MESSAGE_SET = '14839:266735'
const OWN_VARIANT = {
  default: { Default: '14839:266736', 'With Tag': '14839:266738' },
  hover: { Default: '14839:266737', 'With Tag': '14839:266739' },
  consecutive: '14839:266740', // State=Hover, Type=Consecutive msgs (the set has no Default consecutive variant)
} as const
/** "Copilot_User Message" set 1707:246568 (State=Default 1707:246569): a participant's bubble. */
export const PARTICIPANT_MESSAGE_SET = '1707:246568'
/** "CopilotBase_Feeback Actions" / Type=Desktop User (255:74718): copy + edit under an own message. */
export const USER_ACTIONS = '255:74718'
/** A participant group as chat-artifact 14 draws it (Matt Rivera's first group): name row + bubbles. */
export const PARTICIPANT_GROUP_FRAME = '3273:190321'

/** Space between one sender's bubbles: the consecutive spec (32) or chat-artifact 14 as drawn (8). */
export type MessageSpacing = 'spec' | 'compact'

export type MessageGroupProps = {
  /** The viewer's own messages: right-aligned, no name row, copy + edit on hover. */
  own?: boolean
  /** A participant's name row (20px avatar + name). Required unless `own`. */
  author?: MessageAuthor
  /** One sender's consecutive messages, oldest first. */
  messages: UserMessageData[]
  /**
   * The spacing the frame draws, for "As designed": 'spec' (11633:344632, 32 between bubbles) or 'compact'
   * (chat-artifact 14, 8 between bubbles). With fixes on it is always 'spec' (fix message-group-spacing). Default 'spec'.
   */
  designedSpacing?: MessageSpacing
  /** The mention look the frame draws: 'pill' (Option 1) or 'text' (Option 2, consecutive 01). With fixes always 'pill'. */
  designedMention?: MentionStyle
  /**
   * Own messages: the group's vertical inset. 'single' 24 above / 40 below (a message sent from the docked composer,
   * 5569:231701). 'double' 48 / 80: the chat's first prompt as chat-artifact 03-16 draw it (the Desktop full instance,
   * itself 24 / 40, inside a 24 / 40 container), which puts the bubble at y 97 and the answer at 80 below it.
   */
  inset?: 'single' | 'double'
  /** Own messages: copy + edit under each bubble on hover and keyboard focus (State=Hover). Default true. */
  actions?: boolean
  /** Review only: State=Hover pinned on every bubble (`hover=msg:own`). */
  hover?: boolean
  /** After Copy (ok = the clipboard accepted it): the screen shows its toast. */
  onCopy?: (message: UserMessageData, ok: boolean) => void
  /** Edit: the screen loads the text into the composer (BUILD-PLAN consecutive gap). */
  onEdit?: (message: UserMessageData) => void
  /**
   * 'full': the 760 chat column (default). 'split': the chat column beside an open artifact (chat-artifact 19-22): the
   * avatar sits inside the column (no hang) and an own bubble is at most 320 wide (5826:529806 maxW 320).
   */
  column?: 'full' | 'split'
  /**
   * The participant avatar hangs 32px left of the text column, as the full-width frames draw it (avatar at x 336,
   * column at 368). Default: on in the full column, off in the split one.
   */
  hang?: boolean
  className?: string
}

/**
 * A run of consecutive messages from one sender. Own: right-aligned grey bubbles, max 640, with copy + edit 4px under
 * each one on hover. Participant: a name row (Avatar xxs + Text xs name, 24 from its top to the first bubble), then
 * left-aligned bubbles. Bubbles: Text md/Regular para 15/26, padding 8/16, radius 12, bg-tertiary. Render thread items
 * as direct siblings in one column with no gap: each group carries the paddings its Figma container has (own 24 / 40,
 * participant 0 / 40), so senders end up 40 apart.
 */
export function MessageGroup({
  own = false, author, messages, designedSpacing = 'spec', designedMention = 'pill', inset = 'single', actions = true, hover,
  onCopy, onEdit, column = 'full', hang = column === 'full', className,
}: MessageGroupProps) {
  const fixSpacing = useChatMessageFix('message-group-spacing')
  const fixMention = useChatMessageFix('mention-pill-option-1')
  const spacing: MessageSpacing = fixSpacing ? 'spec' : designedSpacing
  const mention: MentionStyle = fixMention ? 'pill' : designedMention
  const name = own ? 'You' : author?.name ?? 'Participant'

  const ownVariant = (m: UserMessageData) =>
    messages.length > 1 ? OWN_VARIANT.consecutive : OWN_VARIANT[hover ? 'hover' : 'default'][m.body.some(isMention) ? 'With Tag' : 'Default']

  return (
    <div
      className={cx(
        'cm-msgs', own ? 'cm-msgs--own' : 'cm-msgs--them', `cm-msgs--${spacing}`, own && `cm-msgs--${inset}`,
        column === 'split' && 'cm-msgs--split', !hang && 'cm-msgs--inset', className,
      )}
      data-node-id={own ? (messages.length > 1 ? OWN_VARIANT.consecutive : OWN_MESSAGE_SET) : PARTICIPANT_GROUP_FRAME}
    >
      {!own && author && (
        <div className="cm-msgs__who">
          <Avatar name={author.name} initial={author.initial} colour={author.colour} size="xxs" decorative className="cm-msgs__av" />
          <span className="cm-msgs__name">{author.name}</span>
        </div>
      )}
      <div className="cm-msgs__list">
        {messages.map(m => (
          <div
            key={m.id}
            className={cx('cm-msg', hover && 'is-hover')}
            role="article"
            aria-label={own ? 'Your message' : `Message from ${name}`}
            data-node-id={own ? ownVariant(m) : PARTICIPANT_MESSAGE_SET}
          >
            <div className="cm-msg__body">
              <RichRuns runs={m.body} mentionStyle={mention} />
            </div>
            {own && actions && (
              <div className="cm-msg__acts" data-node-id={USER_ACTIONS}>
                <button
                  type="button" className="cm-act" aria-label="Copy message"
                  onClick={async () => onCopy?.(m, await copyToClipboard(plainText(m.body)))}
                >
                  <CopyIcon />
                </button>
                <button type="button" className="cm-act" aria-label="Edit message" onClick={() => onEdit?.(m)}>
                  <EditIcon />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export type UserMessageProps = Omit<MessageGroupProps, 'messages'> & { message: UserMessageData }

/** One message on its own (a group of one). */
export function UserMessage({ message, ...rest }: UserMessageProps) {
  return <MessageGroup messages={[message]} {...rest} />
}
