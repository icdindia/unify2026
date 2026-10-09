import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '../buttons/cx'
import { Popover } from '../overlays/popover/Popover'
import driveMark from '../../assets/chat/cite-google-drive.svg'
import salesforceMark from '../../assets/chat/cite-salesforce.svg'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'
import type { ResolvedCitation } from './types'
import './citation.css'

/** "Copilot_Inline Citation Pill" set 5647:478883 (State=Default | Hover × Count=True | False | longest). */
export const CITATION_PILL_SET = '5647:478883'
const VARIANT = {
  default: { count: '5647:478884', plain: '5647:478912' },
  hover: { count: '5647:478891', plain: '5647:478917' },
} as const
/** The card the Hover variants open under the pill ("Copilot_Inline Citation" 1713:250877). */
export const CITATION_CARD = '1713:250877'

const SOURCE_NAME: Record<ResolvedCitation['source'], string> = { drive: 'Google Drive', salesforce: 'Salesforce', generic: 'Google Drive' }
const SOURCE_MARK: Record<ResolvedCitation['source'], string> = { drive: driveMark, salesforce: salesforceMark, generic: driveMark }

/** One source behind a pill, as the hover card lists it ("1 of 4"). */
export type CitationDetail = { title: string; meta?: string; preview?: string }

export type CitationPillProps = {
  citation: ResolvedCitation
  /** The sources the card pages through. Default: the pill's label, then "Source 2" … for each of `more`. */
  details?: CitationDetail[]
  /** Review only: State=Hover pinned (the card open). */
  hover?: boolean
  className?: string
}

const OPEN_DELAY = 150
const CLOSE_GRACE = 120

/**
 * Inline citation pill: a 16px chip in the answer text (source mark on a white dot, JetBrains Mono 10/12 label, "+N"
 * count). Hover or keyboard focus opens the citation card (State=Hover) under it; the card's arrows page through the
 * sources ("1 of 4"). Escape or leaving both closes it.
 */
export function CitationPill({ citation, details, hover, className }: CitationPillProps) {
  const { label, more, source } = citation
  const count = more && more > 0 ? more : 0
  const list: CitationDetail[] = details ?? [
    { title: label, meta: SOURCE_NAME[source] },
    ...Array.from({ length: count }, (_, i) => ({ title: `Source ${i + 2}`, meta: SOURCE_NAME[source] })),
  ]
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  const cardId = useId()
  const shown = hover ?? open
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const show = (wait: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(true), wait) }
  const hide = (wait: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(false), wait) }
  const item = list[Math.min(index, list.length - 1)]

  return (
    <>
      <button
        ref={setAnchor}
        type="button"
        className={cx('cm-cite', count > 0 ? 'cm-cite--count' : 'cm-cite--plain', shown && 'is-hover', className)}
        data-node-id={VARIANT[shown ? 'hover' : 'default'][count > 0 ? 'count' : 'plain']}
        aria-label={`Source: ${label}${count ? ` and ${count} more` : ''}`}
        aria-expanded={shown}
        aria-controls={shown ? cardId : undefined}
        onPointerEnter={e => { if (e.pointerType !== 'touch') show(OPEN_DELAY) }}
        onPointerLeave={() => hide(CLOSE_GRACE)}
        onFocus={e => { if (e.currentTarget.matches(':focus-visible')) show(0) }}
        onClick={() => { window.clearTimeout(timer.current); setOpen(o => !o) }}
      >
        <span className="cm-cite__dot" aria-hidden="true"><img alt="" src={SOURCE_MARK[source]} /></span>
        <span className="cm-cite__t">{label}</span>
        {count > 0 && <span className="cm-cite__n" aria-hidden="true">+{count}</span>}
      </button>
      <Popover
        open={shown}
        anchor={anchor}
        onClose={() => { window.clearTimeout(timer.current); setOpen(false) }}
        placement="bottom-start"
        surface="plain"
        closeOnFocusOut
        id={cardId}
        role="dialog"
        aria-label={`Sources for ${label}`}
        nodeId={CITATION_CARD}
        className="cm-cite-card"
        onPointerEnter={() => window.clearTimeout(timer.current)}
        onPointerLeave={() => { if (hover === undefined) hide(CLOSE_GRACE) }}
      >
        <div className="cm-cite-card__bar">
          <span className="cm-cite-card__nav">
            <button type="button" className="cm-cite-card__btn" aria-label="Previous source" disabled={index === 0}
                    onClick={() => setIndex(i => Math.max(0, i - 1))}>
              <ChevronLeftIcon size={16} />
            </button>
            <button type="button" className="cm-cite-card__btn" aria-label="Next source" disabled={index >= list.length - 1}
                    onClick={() => setIndex(i => Math.min(list.length - 1, i + 1))}>
              <ChevronRightIcon size={16} />
            </button>
          </span>
          <span className="cm-cite-card__of" aria-live="polite">{index + 1} of {list.length}</span>
        </div>
        <div className="cm-cite-card__body">
          <div className="cm-cite-card__wrap">
            <span className="cm-cite-card__mark" aria-hidden="true"><img alt="" src={SOURCE_MARK[source]} /></span>
            <span className="cm-cite-card__head">
              <span className="cm-cite-card__title">{item.title}</span>
              {item.meta && <span className="cm-cite-card__meta">{item.meta}</span>}
            </span>
          </div>
          {item.preview && <p className="cm-cite-card__preview">{item.preview}</p>}
        </div>
      </Popover>
    </>
  )
}
