import type { ReactNode } from 'react'
import { cx } from '../buttons/cx'
import { FeedbackRow, type FeedbackRowProps } from './FeedbackRow'
import { useChatMessageFix } from './fixes'
import { RichRuns } from './RichText'
import { SuggestedPrompts } from './SuggestedPrompts'
import { answerText, type ResolvedAnswer, type ResolvedBlock } from './types'
import './response.css'

/** "Response_Desktop full" set 10016:497072, Property 1=Assistant 10016:497073. */
export const RESPONSE_SET = '10016:497072'
export const RESPONSE_ASSISTANT = '10016:497073'

type Gap = 0 | 2 | 8 | 16 | 24

/** Space above a block, from the block before it (1809:501331 paragraph spacing 16; graphs 04 Frame 1 gap 24 and the
 *  headline / subtitle gap 2; chat-artifact 16 text-to-card gap 8). */
function gapBefore(prev: ResolvedBlock | undefined, b: ResolvedBlock): Gap {
  if (!prev) return 0
  if (b.kind === 'subtitle' && prev.kind === 'headline') return 2
  if (b.kind === 'artifact') return 8
  const text = (k: ResolvedBlock['kind']) => k === 'p' || k === 'ul'
  if (text(prev.kind) && text(b.kind)) return 16
  return 24
}

export type AssistantResponseProps = {
  /** The answer, Drifts resolved (useResolved / chatViewAt). */
  answer: ResolvedAnswer
  /**
   * The 20px row above the text: the collapsed chain of thought ("Searched internal knowledge · Reasoned over the
   * results ›" with the Assistant's avatar), from the agent components. It sits in a row that starts 32px left of the
   * column (Figma "Frame 2147266864" at x -32), so pass the row with its 20px avatar first and do not offset it yourself.
   * 4px under it the text starts.
   */
  header?: ReactNode
  /** 'split': the chat column beside an open artifact (no hang). Default 'full'. */
  column?: 'full' | 'split'
  /** The header row hangs 32px left of the column, as the full-width frames draw it. Default: on in the full column only. */
  hang?: boolean
  /**
   * Blocks this component does not draw: 'kpis', 'chart' (the charts components) and 'artifact' (InlineArtifactCard).
   * Return the node; the response gives it the Figma spacing (24 around tiles and charts, 8 above an artifact card).
   */
  renderBlock?: (block: ResolvedBlock, index: number) => ReactNode
  /**
   * Whether the frame draws a feedback row under this answer. chat-artifact 15 / 16 draw none under the Pipeline Command
   * answer: pass false there; with fixes on (feedback-row-every-answer) it shows anyway. Default true.
   */
  designedFeedback?: boolean
  /** Handlers and state for the feedback row (cost, sources and the copy text come from the answer). */
  feedback?: Omit<FeedbackRowProps, 'cost' | 'sources' | 'copyText'>
  /** A suggested prompt was picked (Suggested prompts / Type=Lines under the answer). */
  onSuggested?: (prompt: string, index: number) => void
  /** Review only: a suggested row in State=Hover. */
  suggestedHover?: number
  className?: string
}

/**
 * The Assistant's answer (Response_Desktop full / Assistant): the header row (collapsed thoughts), then the text in
 * Text md/Regular para 15/26 with 16 between paragraphs, "- " bullets whose lead-in is SemiBold, the serif headline
 * (Display xs/Semibold, Spectral 24/32) + subtitle + rule of the chart answers, inline citation pills, any blocks the
 * screen renders (tiles, charts, the artifact card), the feedback row 8 below and "Suggested actions" 24 below that.
 * A `plain` answer is one line with no feedback row.
 *
 * Thread spacing: it ends with 40px of padding (the "Agent Response" frame of chat-artifact 16), so the next sender's
 * name row lands 40 below; a SystemLine right after it pulls that back to start at the feedback row (chat-artifact 13).
 */
export function AssistantResponse({
  answer, header, column = 'full', hang = column === 'full', renderBlock, designedFeedback = true, feedback, onSuggested, suggestedHover, className,
}: AssistantResponseProps) {
  const everyAnswer = useChatMessageFix('feedback-row-every-answer')
  const showFeedback = !answer.plain && (designedFeedback || everyAnswer)
  const blocks = answer.blocks
  const lead = blocks[0]?.kind === 'headline'

  const body: ReactNode[] = []
  blocks.forEach((b, i) => {
    const gap = gapBefore(blocks[i - 1], b)
    const g = `cm-gap-${gap}`
    switch (b.kind) {
      case 'p':
        body.push(<p key={i} className={cx('cm-text', g)}><RichRuns runs={b.inl} /></p>)
        break
      case 'ul':
        body.push(
          <ul key={i} className={cx('cm-list', g)}>
            {b.items.map((item, j) => <li key={j} className="cm-text"><RichRuns runs={item} prefix="- " /></li>)}
          </ul>,
        )
        break
      case 'headline':
        body.push(<h3 key={i} className={cx('cm-headline', g)}>{b.text}</h3>)
        break
      case 'subtitle':
        body.push(<p key={i} className={cx('cm-subtitle', g)}>{b.text}</p>)
        if (blocks[i + 1]?.kind !== 'subtitle') body.push(<hr key={`${i}-rule`} className="cm-rule" />)
        break
      default: {
        const node = renderBlock?.(b, i)
        if (node) body.push(<div key={i} className={cx('cm-slot', `cm-slot--${b.kind}`, g)}>{node}</div>)
      }
    }
  })

  return (
    <div className={cx('cm-resp', !hang && 'cm-resp--inset', className)} data-node-id={RESPONSE_ASSISTANT}>
      {header && <div className="cm-resp__head">{header}</div>}
      <div className={cx('cm-resp__main', lead && 'cm-resp__main--lead')}>
        <div className="cm-resp__body">{body}</div>
        {showFeedback && (
          <FeedbackRow cost={answer.cost} sources={answer.sources} copyText={answerText(answer)} {...feedback} />
        )}
      </div>
      {answer.suggested && answer.suggested.length > 0 && (
        <SuggestedPrompts prompts={answer.suggested} onPick={onSuggested} hoverIndex={suggestedHover} />
      )}
    </div>
  )
}
