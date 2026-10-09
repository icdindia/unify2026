import { useState, type ReactNode } from 'react'
import { ChainOfThought, type ChainOfThoughtSpec, type CotPresentation } from '../../components/agent'
import { SecondaryButton } from '../../components/buttons'
import { COT_COMMIT, COT_SHORT_COMMIT, COMMIT_SCRIPT, useResolved, type CotStep } from '../../fixtures'
import { useBeatPlayer } from '../../playback'
import { useUiParam } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './agent-gallery.css'

export const meta: GalleryMeta = {
  title: 'Chain of thought',
  figmaNodeIds: ['8863:218607', '5220:201709', '435:161264'],
  group: 'Agent',
  description:
    'Agent COT: "Thinking...", "Consulting…", Step 3-7 (the first thought with its sources card, then one line each on a ' +
    'connector), all thoughts on one line, the "Text + source" variant, Complete 1 / 2 and the finished line. The ' +
    'header toggles the thoughts; hovering it or a thought changes the text colour only. Specimens sit in the 760px ' +
    'message column with the 32px gutter the avatar hangs into.',
  sheets: [
    { id: 'states', label: 'While it thinks' },
    { id: 'collapsed', label: 'Collapsed and finished' },
    { id: 'playback', label: 'Live playback' },
  ],
}

/** One chain in the 760 message column. `diff` names the reference crop the agent's diff script compares it with. */
function Column({ diff, narrow, children }: { diff?: string; narrow?: boolean; children: ReactNode }) {
  return (
    <div className="agent-g-frame">
      <div className={narrow ? 'agent-g-col agent-g-col--narrow' : 'agent-g-col'} data-diff={diff}>{children}</div>
    </div>
  )
}

const STREAMING: { step: CotStep; label: string; node: string; diff?: string; presentation?: CotPresentation; hover?: 'header' | number }[] = [
  { step: 1, label: 'Type=Step 1 — "Thinking..." (chat-artifact 14)', node: '8863:218608', diff: 'step-1' },
  { step: 2, label: 'Type=Step 2 — "Consulting the knowledge repository..."', node: '8863:218615', diff: 'step-2' },
  { step: 3, label: 'Type=Step 3 — first thought with its sources card (chat-artifact 04)', node: '8863:218687', diff: 'step-3' },
  { step: 4, label: 'Type=Step 4 — as drawn: "Traced the gap…" arrives before "Searching…"', node: '8863:218798', diff: 'step-4' },
  { step: 5, label: 'Type=Step 5', node: '8863:218912', diff: 'step-5' },
  { step: 6, label: 'Type=Step 6', node: '8863:219035', diff: 'step-6' },
  { step: 7, label: 'Type=Step 7 — every thought on the connector (chat-artifact 05)', node: '8863:219168', diff: 'step-7' },
  { step: 'lines', label: 'Type=All 1 line thoughts (chat-artifact 06, cot=lines)', node: '8863:219311', diff: 'lines' },
  { step: 7, label: '"Text + source COT" (chat-artifact 07, cot=sources; a review variant per Q26)', node: '4756:186919', diff: 'sources', presentation: 'sources' },
  { step: 7, label: 'Hover on the header — _Thoughts Type=Open, State=Hover', node: '5220:201725', diff: 'hover-header', hover: 'header' },
  { step: 7, label: 'Hover on a thought — text colour only', node: '435:161264', diff: 'hover-thought', hover: 2 },
]

const COLLAPSED: { step: CotStep; label: string; node: string; diff?: string; streaming?: boolean; short?: boolean; hover?: 'header' }[] = [
  { step: 'complete-1', label: 'Type=Complete 1 — "Thoughts" while the turn still runs (input-large 21)', node: '8863:219422', diff: 'complete-1' },
  { step: 'complete-2', label: 'Type=Complete 2 — the header line while the turn still runs (input-large 22)', node: '8863:219514', diff: 'complete-2' },
  { step: 'done', label: 'Finished — the summary line, #364a3b avatar (chat-artifact 08)', node: '8863:219514', diff: 'done' },
  { step: 'done', label: 'Finished, hover — _Thoughts Type=Closed, State=Hover', node: '5220:201715', diff: 'done-hover', hover: 'header' },
  { step: 'done', label: 'Answer still streaming — the dot ring ticks (input-large 24)', node: '8863:219498', diff: 'streaming', streaming: true },
  { step: 1, label: 'A later turn: "Thinking..." under Matt\'s message (chat-artifact 14)', node: '8863:218608', short: true },
  { step: 'done', label: 'A later turn, finished: no thoughts behind the line (chat-artifact 15-16)', node: '8863:219514', short: true },
]

export default function ChainOfThoughtGallery() {
  const [sheet] = useUiParam('sheet')
  const commit: ChainOfThoughtSpec = useResolved(COT_COMMIT)
  const short: ChainOfThoughtSpec = useResolved(COT_SHORT_COMMIT)

  if (sheet === 'collapsed') {
    return (
      <GallerySection
        title="Collapsed and finished"
        description='Click a line to open the thoughts (one line each, Q26); click again to close. Fixes on: cot-collapsed-chevron (a closed chain always points right) and cot-no-thoughts-no-chevron.'
      >
        <Specimens min="lg">
          {COLLAPSED.map((s, i) => (
            <Specimen key={i} label={s.label} nodeId={s.node} surface="primary" wide>
              <Column diff={s.diff}>
                <ChainOfThought cot={s.short ? short : commit} step={s.step} streaming={s.streaming} hover={s.hover} still={!!s.diff} />
              </Column>
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>
    )
  }

  if (sheet === 'playback') return <Playback />

  return (
    <>
      <GallerySection
        title="While it thinks"
        description='Agent COT Step 1 → (4s) Step 2 → (2.5s each) Step 3…7 → All 1 line thoughts. The header collapses and re-opens the list. Thought icons follow the thought: book-open, search, clock, Script, then check-circle on "Done".'
      >
        <Specimens min="lg">
          {STREAMING.map((s, i) => (
            <Specimen key={i} label={s.label} nodeId={s.node} surface="primary" wide>
              <Column diff={s.diff}>
                <ChainOfThought cot={commit} step={s.step} presentation={s.presentation} hover={s.hover} still />
              </Column>
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>
      <GallerySection title="Narrow column" description="Long thoughts and source titles truncate with an ellipsis; the model line and the source meta keep their width.">
        <Specimen label="Type=Step 7 in a 400px column" nodeId="8863:219168" surface="primary" wide>
          <Column narrow><ChainOfThought cot={commit} step={7} still /></Column>
        </Specimen>
        <Specimen label="hang={false}: the avatar inside the column (also every chain under 600px)" nodeId="8863:219168" surface="primary" wide>
          <Column narrow><ChainOfThought cot={commit} step={3} hang={false} still /></Column>
        </Specimen>
      </GallerySection>
      <GallerySection title="Bare glyph" description="glyph=bare (thinking 01): the Agent COT set's own animated dot grid instead of the round avatar.">
        <Specimen label="Type=Step 3, glyph=bare" nodeId="8863:218613" surface="primary" wide>
          <Column><ChainOfThought cot={commit} step={3} glyph="bare" /></Column>
        </Specimen>
      </GallerySection>
    </>
  )
}

/** The commit chat's first turn played by useBeatPlayer with the Figma timings (or a beat at a time). */
function Playback() {
  const [speed, setSpeed] = useState(1)
  const player = useBeatPlayer(COMMIT_SCRIPT, { autoplay: false, until: 'answer', speed })
  const turn = player.view.items.find(i => i.kind === 'assistant' && i.id === 'turn-commit')
  return (
    <GallerySection
      title="Live playback"
      description="The commit chat's first turn from src/fixtures/scripts/commit.ts, played by useBeatPlayer: Step 1 → 4s → Step 2 → 2.5s per step → All 1 line thoughts → Complete 1 → Complete 2 → the answer streams (dot ring) → done."
    >
      <div className="agent-g-controls">
        <SecondaryButton label={player.playing ? 'Pause' : 'Play'} onClick={player.playing ? player.pause : player.play} />
        <SecondaryButton label="Next beat" onClick={() => player.advance()} disabled={!player.next} />
        <SecondaryButton label="Restart" onClick={player.reset} />
        <SecondaryButton label={speed === 1 ? 'Speed 1×' : `Speed ${speed}×`} onClick={() => setSpeed(s => (s === 1 ? 4 : 1))} />
        <span className="agent-g-beat" aria-live="polite">Beat: {player.beat.id} — {player.beat.label}</span>
      </div>
      <Specimen label={`at=${player.beat.id}`} nodeId="8863:218607" surface="primary" wide>
        <Column>
          {turn && turn.kind === 'assistant'
            ? <ChainOfThought cot={turn.cot} step={turn.step} streaming={!!turn.streaming} still={player.instant} />
            : <span className="agent-g-note">The turn has not started.</span>}
        </Column>
      </Specimen>
    </GallerySection>
  )
}
