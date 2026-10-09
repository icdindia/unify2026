import type { ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { CitationPill } from './CitationPill'
import { isBold, isCite, isMention, type MessageRun } from './types'
import './rich-text.css'

/** How a mention is drawn in sent text: Option 1 pill with a white fill (chosen), or Option 2's bare blue run. */
export type MentionStyle = 'pill' | 'text'

/**
 * "@Name" in a sent message (chat-artifact 13-16, With Tag): steel-blue-400 15/26 on bg-primary, 0/4 padding, radius 8
 * ("Sources" frame 7489:275033), 6px before the text that follows. `text` draws Option 2 (consecutive 01): no fill.
 */
export function MentionPill({ label, variant = 'pill' }: { label: string; variant?: MentionStyle }) {
  return <span className={cx('cm-mention', `cm-mention--${variant}`)} data-node-id={variant === 'pill' ? '7489:275033' : undefined}>@{label}</span>
}

export type RichRunsProps = {
  runs: readonly MessageRun[]
  mentionStyle?: MentionStyle
  /** Text put in front of the first run, inside it, so it takes the run's weight (the answers' "- " bullets). */
  prefix?: string
}

/**
 * One paragraph's runs: plain text, SemiBold runs, mention pills and citation pills. The text run after a mention
 * loses its leading space (the pill's 6px margin is the gap, as the frames' 6px auto-layout gap draws it).
 */
export function RichRuns({ runs, mentionStyle = 'pill', prefix }: RichRunsProps) {
  const out: ReactNode[] = []
  runs.forEach((r, i) => {
    const first = i === 0 && prefix ? prefix : ''
    if (typeof r === 'string') {
      const text = i > 0 && isMention(runs[i - 1]) ? r.replace(/^\s+/, '') : r
      out.push(first + text)
    } else if (isBold(r)) {
      out.push(<strong key={i} className="cm-b">{first}{r.b}</strong>)
    } else if (isMention(r)) {
      if (first) out.push(first)
      out.push(<MentionPill key={i} label={r.label} variant={mentionStyle} />)
    } else if (isCite(r)) {
      if (first) out.push(first)
      out.push(<CitationPill key={i} citation={r.cite} />)
    }
  })
  return <>{out}</>
}
