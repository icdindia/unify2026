import { useId, useState, type ReactNode } from 'react'
import { COT_LABELS } from '../../fixtures/copy'
import type { CotSource, CotStep } from '../../fixtures/script'
import { thoughtsAt } from '../../fixtures/script'
import googleDrive from '../../assets/agent/src-google-drive.svg'
import salesforce from '../../assets/agent/src-salesforce.svg'
import sharepoint from '../../assets/agent/src-sharepoint.svg'
import vertexAi from '../../assets/agent/src-vertex-ai.svg'
import { cx } from '../buttons/cx'
import { AgentAvatar, type AgentAvatarTone } from './AgentAvatar'
import { useAgentFix } from './fixes'
import { BookOpen, CheckCircle, ChevronDownSm, ChevronRightSm, Clock, Script, SearchMd } from './icons'
import { ThinkingIndicator } from './ThinkingIndicator'
import './chain-of-thought.css'

/** Figma component set "Agent COT" 8863:218607. */
export const AGENT_COT_SET = '8863:218607'

/** The variant each state draws (its node is the component root's data-node-id). */
const VARIANT: Record<string, string> = {
  1: '8863:218608', 2: '8863:218615', 3: '8863:218687', 4: '8863:218798', 5: '8863:218912', 6: '8863:219035', 7: '8863:219168',
  lines: '8863:219311', 'complete-1': '8863:219422', 'complete-2': '8863:219514', done: '8863:219514', streaming: '8863:219498',
}
/** `_Thoughts` 5220:201709: Type=Closed / Open x State=Default / Hover. */
const THOUGHTS_NODE = { closed: '5220:201710', closedHover: '5220:201715', open: '5220:201720', openHover: '5220:201725' }

/** The glyph in front of a thought. Figma draws book-open, search-md, clock, Script, then check-circle on "Done". */
export type CotThoughtIcon = 'book' | 'search' | 'clock' | 'script' | 'check'
const ICON_ORDER: CotThoughtIcon[] = ['book', 'search', 'clock', 'script']
const ICONS: Record<CotThoughtIcon, () => ReactNode> = {
  book: () => <BookOpen />, search: () => <SearchMd />, clock: () => <Clock />, script: () => <Script />, check: () => <CheckCircle />,
}

/** Where a source row comes from (its 12px logo). Unset: read from the title (.gsheet = Drive, .xlsx / .docx = SharePoint, else Salesforce). */
export type CotSourceKind = 'salesforce' | 'google-drive' | 'sharepoint'
const SOURCE_LOGO: Record<CotSourceKind, string> = { salesforce, 'google-drive': googleDrive, sharepoint }
const sourceKind = (s: CotSource & { kind?: CotSourceKind }): CotSourceKind =>
  s.kind ?? (/\.gsheet$/i.test(s.title) ? 'google-drive' : /\.(xlsx?|docx?|pptx?)$/i.test(s.title) ? 'sharepoint' : 'salesforce')

/** One thought, as the resolved fixture gives it (CotThought with its Drifts resolved), plus optional overrides. */
export type ChainThought = {
  text: string
  sources?: { model: string; rows: readonly (CotSource & { kind?: CotSourceKind })[] }
  appearsAt?: number
  icon?: CotThoughtIcon
}
/** A resolved CotSpec (fixtures/script.ts): what the chain says. */
export type ChainOfThoughtSpec = { header: string; thoughts: readonly ChainThought[]; summary: string }

/**
 * How the thoughts are drawn while they stream (the `cot=` URL key, Q26):
 * `steps` (default): chat-artifact 04-05, the first thought with its sources card, the rest one line each;
 * `lines`: chat-artifact 06, every thought one line, no card (also what an opened, finished chain shows);
 * `sources`: chat-artifact 07, every thought with a sources card (a review variant, unused per Q26).
 */
export type CotPresentation = 'steps' | 'lines' | 'sources'

export type ChainOfThoughtProps = {
  cot: ChainOfThoughtSpec
  /** The Agent COT variant: 1, 2, 3…7, 'lines', 'complete-1', 'complete-2' or 'done' (the thread item's `step`). */
  step: CotStep
  /** The answer is on screen but the turn still runs (thread item `streaming`): the collapsed line gets the ticking dot ring. */
  streaming?: boolean
  presentation?: CotPresentation
  /** The thinking glyph (`glyph=` URL key, Q24): `round` (default) or `bare`. */
  glyph?: 'round' | 'bare'
  /** An `at=` render: hold the shimmer and the dot ring. */
  still?: boolean
  /** Controlled disclosure. Uncontrolled by default: open while the thoughts stream, closed once the chain collapses. */
  expanded?: boolean
  onExpandedChange?: (open: boolean) => void
  /** Pinned hover for reviews (`hover=` URL key): the header, or the index of a shown thought. Real :hover works without it. */
  hover?: 'header' | number | null
  /** Hang the avatar 32px into the left gutter (default, as every 1440 frame). false keeps it inside the column. */
  hang?: boolean
  className?: string
  id?: string
}

type Phase = 'live' | 'collapsed'

/**
 * The Assistant's chain of thought (Agent COT 8863:218607), driven by the chat script's COT step. Hangs 32px into the
 * left gutter so the text lines up with the message column (All COT x -32, 788 wide in a 760 column).
 */
export function ChainOfThought({
  cot, step, streaming = false, presentation = 'steps', glyph = 'round', still = false,
  expanded, onExpandedChange, hover = null, hang = true, className, id,
}: ChainOfThoughtProps) {
  const listId = useId()
  const fixChevron = useAgentFix('cot-collapsed-chevron')
  const fixNoThoughts = useAgentFix('cot-no-thoughts-no-chevron')
  const fixSourcesCopy = useAgentFix('cot-sources-variant-copy')
  const live = typeof step === 'number' || step === 'lines'
  const phase: Phase = live ? 'live' : 'collapsed'
  const [toggled, setToggled] = useState<{ phase: Phase; open: boolean } | null>(null)

  if (step === 1 || step === 2) {
    return (
      <div className={cx('cot', !hang && 'cot--inset', className)} id={id} data-node-id={VARIANT[step]}>
        {/* the set's Step 1 / 2 put `_thinking state` 7534:291688 beside the avatar */}
        <ThinkingIndicator label={step === 1 ? COT_LABELS.thinking : COT_LABELS.consulting} glyph={glyph} still={still} nodeId="7534:291688" />
      </div>
    )
  }

  const hasThoughts = cot.thoughts.length > 0
  const open = hasThoughts && (expanded ?? (toggled && toggled.phase === phase ? toggled.open : live))
  const setOpen = (next: boolean) => {
    if (expanded === undefined) setToggled({ phase, open: next })
    onExpandedChange?.(next)
  }

  // what the open chain lists, in list order, with the index each thought has in the whole chain
  const indexed = cot.thoughts.map((t, i) => ({ t, i }))
  const shown = live && step !== 'lines'
    ? thoughtsAt(indexed.map(x => ({ ...x, appearsAt: x.t.appearsAt })), step)
    : indexed
  const cards = live && step !== 'lines' ? presentation : 'lines'
  const firstSources = cot.thoughts.find(t => t.sources)?.sources

  const title = step === 'complete-1' ? 'Thoughts' : step === 'done' ? cot.summary : cot.header
  // chevron: as designed, the running collapsed lines (Complete 1 / 2) point down; the finished line points right
  const pointsDown = open || (!fixChevron && (step === 'complete-1' || step === 'complete-2'))
  const showChevron = hasThoughts || !fixNoThoughts
  const avatar: AgentAvatarTone = step === 'done'
    ? (streaming ? 'spinner' : 'done')
    : glyph === 'bare' ? 'bare'
      : presentation === 'sources' && live ? 'done' // chat-artifact 07 (a detached copy) draws the #364a3b avatar
        : 'thinking'
  const variant = step === 'done' && streaming ? VARIANT.streaming : VARIANT[String(step)]
  const headHover = hover === 'header'

  const label = (
    <>
      <span className="cot__title">{title}</span>
      {showChevron && (
        <span className="cot__chev">{pointsDown ? <ChevronDownSm /> : <ChevronRightSm />}</span>
      )}
    </>
  )

  return (
    <div className={cx('cot', !hang && 'cot--inset', className)} id={id} data-node-id={variant}>
      <div className="cot__head">
        <AgentAvatar tone={avatar} still={still} />
        {hasThoughts ? (
          <button
            type="button"
            className={cx('cot__toggle', headHover && 'is-hover')}
            aria-expanded={open}
            aria-controls={listId}
            data-node-id={pointsDown ? (headHover ? THOUGHTS_NODE.openHover : THOUGHTS_NODE.open) : (headHover ? THOUGHTS_NODE.closedHover : THOUGHTS_NODE.closed)}
            onClick={() => setOpen(!open)}
          >
            {label}
          </button>
        ) : (
          <span className={cx('cot__toggle', 'cot__toggle--static', headHover && 'is-hover')} data-node-id={THOUGHTS_NODE.closed}>{label}</span>
        )}
      </div>
      {hasThoughts && (
        <ol className="cot__list" id={listId} hidden={!open} aria-label={cot.header}>
          {open && shown.map(({ t, i }, k) => {
            const last = k === shown.length - 1
            const icon = t.icon ?? (i === cot.thoughts.length - 1 && cot.thoughts.length > 1 ? 'check' : ICON_ORDER[i % ICON_ORDER.length])
            // sources card: on the first thought (steps), on every thought but "Done" (sources), never (lines)
            const isFinish = icon === 'check'
            const withCard = cards === 'steps' ? !!t.sources && i === 0 : cards === 'sources' && !isFinish && !!(t.sources ?? firstSources)
            // 07 draws its four cards as copies of the first thought, text included (a detached placeholder)
            const copyFirst = cards === 'sources' && !fixSourcesCopy && withCard
            const text = copyFirst ? cot.thoughts[0].text : t.text
            const sources = withCard ? (copyFirst ? firstSources : (t.sources ?? firstSources)) : undefined
            return (
              <li key={i} className={cx('cot-thought', sources && 'cot-thought--sources', hover === k && 'is-hover')}
                  data-node-id={isFinish ? '435:161425' : undefined}>
                <div className="cot-thought__row">
                  <span className="cot-thought__icon">{ICONS[icon]()}</span>
                  <span className="cot-thought__body">
                    <span className="cot-thought__text">{text}</span>
                    {sources && (
                      <span className="cot-thought__model">
                        <img className="cot-thought__model-logo" src={vertexAi} alt="" />
                        {sources.model}
                      </span>
                    )}
                  </span>
                </div>
                {sources && (
                  <div className="cot-sources">
                    <ul className="cot-sources__card" aria-label={`Sources: ${sources.model}`}>
                      {sources.rows.map(r => (
                        <li key={r.title} className="cot-source">
                          <img className="cot-source__logo" src={SOURCE_LOGO[sourceKind(r)]} alt="" />
                          <span className="cot-source__title">{r.title}</span>
                          <span className="cot-source__meta">{r.meta}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!last && <span className="cot-thought__line" aria-hidden="true" />}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
