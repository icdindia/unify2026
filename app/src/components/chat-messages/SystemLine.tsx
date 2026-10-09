import { cx } from '../buttons/cx'
import './messages.css'

/** The centred line in chat-artifact 10 / 13 (Container 1731:341631: p 20/0, Text md/Regular para, text-quaternary). */
export const SYSTEM_LINE_FRAME = '1731:341631'

export type SystemLineProps = {
  /** "Matt Rivera, John Whitaker and Grace Coleman joined the chat" (fixtures JOINED_LINE). */
  text: string
  className?: string
}

/**
 * A system event in the thread, centred in the column: who joined the chat. 66px tall with its 20px padding; right
 * after an AssistantResponse it starts at the feedback row (the response's 40px bottom padding is pulled back), as the
 * frames draw it. It is a polite live region, so a screen reader hears people join.
 */
export function SystemLine({ text, className }: SystemLineProps) {
  return <p className={cx('cm-system', className)} role="status" data-node-id={SYSTEM_LINE_FRAME}>{text}</p>
}
