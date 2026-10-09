import { cx } from '../buttons/cx'
import { CornerDownRightIcon } from './icons'
import './response.css'

/** "Suggested prompts" set 5647:478947, Type=Lines 5647:478952; rows are "Lines States" 5647:478934 (Default 5647:478935, Hover 5647:478941). */
export const SUGGESTED_PROMPTS = '5647:478952'
const ROW = { default: '5647:478935', hover: '5647:478941' }

export type SuggestedPromptsProps = {
  /** The row texts ("Do you want me write a mail?"). */
  prompts: string[]
  /** "Suggested actions" heading. */
  title?: string
  /** A row was chosen: the screen sends it (or puts it in the composer). */
  onPick?: (prompt: string, index: number) => void
  /** Review only: a row in State=Hover. */
  hoverIndex?: number
  className?: string
}

/**
 * "Suggested actions": a Text md/Medium heading, then rows split by border-tertiary lines, each a corner-down-right
 * arrow and the prompt (Text md/Regular 15/24). Hover turns the text and arrow brand (text-brand-tertiary-600).
 */
export function SuggestedPrompts({ prompts, title = 'Suggested actions', onPick, hoverIndex, className }: SuggestedPromptsProps) {
  if (!prompts.length) return null
  return (
    <section className={cx('cm-sugg', className)} aria-label={title} data-node-id={SUGGESTED_PROMPTS}>
      <h3 className="cm-sugg__title">{title}</h3>
      <ul className="cm-sugg__list">
        {prompts.map((p, i) => (
          <li key={`${i}-${p}`} className="cm-sugg__item" data-node-id={hoverIndex === i ? ROW.hover : ROW.default}>
            <button type="button" className={cx('cm-sugg__row', hoverIndex === i && 'is-hover')} onClick={() => onPick?.(p, i)}>
              <span className="cm-sugg__icon" aria-hidden="true"><CornerDownRightIcon /></span>
              <span className="cm-sugg__t">{p}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
