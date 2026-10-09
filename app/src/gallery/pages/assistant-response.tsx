import { useState } from 'react'
import {
  AssistantResponse, CitationPill, FeedbackRow, SuggestedPrompts, type FeedbackVote, type ResolvedAnswer,
} from '../../components/chat-messages'
import { useToast } from '../../components/overlays'
import { BU_ANSWER, COMMIT_ANSWER, COMMIT_ANSWER_CITED, CREATIVE_ANSWER, INTERACTIVE_ANSWER, ROUTINE_READY_LINE } from '../../fixtures/copy'
import { useResolved } from '../../fixtures/drift'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './chat-messages.css'

export const meta: GalleryMeta = {
  title: 'Assistant response',
  figmaNodeIds: ['10016:497072', '10016:493615', '250:177368', '5647:478883', '1713:250877', '5647:478947'],
  group: 'Chat',
  description:
    'Response_Desktop full / Assistant: the answer text (15/26, 16 between paragraphs, SemiBold "- " bullets), the serif ' +
    'headline + subtitle of chart answers, inline citation pills with their hover card, the feedback row ($0.19, share, ' +
    'like, copy, read aloud, branch, 8 Sources, thumbs, more) and Suggested actions. The 20px header row takes the ' +
    'collapsed chain of thought from the agent components (a stand-in here).',
}

const CotStandIn = ({ label = 'Searched internal knowledge · Reasoned over the results ›' }: { label?: string }) => (
  <span className="cmg-cot"><span className="cmg-cot__av" aria-hidden="true" />{label}</span>
)
const Tiles = () => <div className="cmg-card">KPI tiles (charts components)</div>
const Chart = () => <div className="cmg-card">Chart (charts components)</div>
const Card = () => <div className="cmg-card">Pipeline Command · Interactive HTML (InlineArtifactCard)</div>

export default function AssistantResponseGallery() {
  const toast = useToast()
  const commit = useResolved(COMMIT_ANSWER)
  const cited = useResolved(COMMIT_ANSWER_CITED)
  const creative = useResolved(CREATIVE_ANSWER)
  const interactive = useResolved(INTERACTIVE_ANSWER)
  const bu = useResolved(BU_ANSWER)
  const plain: ResolvedAnswer = { blocks: [{ kind: 'p', inl: [ROUTINE_READY_LINE] }], cost: '', sources: 0, plain: true }
  const [vote, setVote] = useState<FeedbackVote>('up')
  const feedback = {
    onCopy: (ok: boolean) => toast.show({ message: ok ? 'Answer copied' : 'Could not copy' }),
    onShare: () => toast.show({ message: 'Share answer (not drawn)' }),
  }
  return (
    <>
      <GallerySection title="Answers" description="Each answer ends with 40px of padding; a system line right after one starts at its feedback row. Blocks it does not draw (tiles, charts, the artifact card) come from renderBlock with the Figma spacing around them.">
        <Specimens min="lg">
          <Specimen wide label="Property 1=Assistant: the commit answer (chat-artifact 08)" nodeId="10016:497073" surface="primary">
            <div className="cmg-col cmg-col--hang"><AssistantResponse answer={commit} header={<CotStandIn />} feedback={feedback} /></div>
          </Specimen>
          <Specimen wide label="With citation pills and Suggested actions (input-large 24, new-memory 01)" surface="primary" overflow="visible">
            <div className="cmg-col cmg-col--hang cmg-stack">
              <AssistantResponse answer={creative} header={<CotStandIn label="Thoughts ›" />} feedback={feedback} onSuggested={p => toast.show({ message: p })} />
              <AssistantResponse answer={cited} header={<CotStandIn />} feedback={feedback} />
            </div>
          </Specimen>
          <Specimen wide label="With the artifact card, no feedback row as drawn (chat-artifact 15 / 16; fix feedback-row-every-answer adds it)" surface="primary">
            <div className="cmg-col cmg-col--hang">
              <AssistantResponse answer={interactive} header={<CotStandIn />} designedFeedback={false} renderBlock={b => (b.kind === 'artifact' ? <Card /> : null)} />
            </div>
          </Specimen>
          <Specimen wide label="Chart answer: serif headline, subtitle, rule (graphs 04)" surface="primary">
            <div className="cmg-col cmg-col--hang">
              <AssistantResponse answer={bu} header={<CotStandIn label="Thoughts ›" />} feedback={feedback}
                                 renderBlock={b => (b.kind === 'kpis' ? <Tiles /> : b.kind === 'chart' ? <Chart /> : null)} />
            </div>
          </Specimen>
          <Specimen wide label="A plain one-line answer (publish-artifact 01)" surface="primary">
            <div className="cmg-col cmg-col--hang"><AssistantResponse answer={plain} /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Feedback row" description="Feedback Array / Type=Full screen: 24 tall, round icon buttons on the left, radius 6 on the right. Like, Good and Bad response are toggles (aria-pressed); with fixes on the chosen one keeps its fill (feedback-pressed-state).">
        <Specimens min="lg">
          <Specimen wide label="Type=Full screen (chat-artifact 08)" nodeId="10016:493615" surface="primary">
            <div className="cmg-col"><FeedbackRow cost="$0.19" sources={8} {...feedback} /></div>
          </Specimen>
          <Specimen wide label="With download (input-large 24), Good response chosen" surface="primary">
            <div className="cmg-col"><FeedbackRow cost="$0.19" sources={8} actions={['share', 'download', 'copy', 'read-aloud', 'branch']} vote={vote} onVote={setVote} {...feedback} /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Inline citation pill" description="A 16px chip in the text: the source mark on a white dot, JetBrains Mono 10/12, a +N count. Hover or keyboard focus opens the citation card (State=Hover) with arrows through the sources; Escape closes it.">
        <Specimens min="md">
          <Specimen label="State=Default, Count=True" nodeId="5647:478884" surface="primary">
            <p className="cm-resp__body"><CitationPill citation={{ label: 'Reforecast', more: 2, source: 'drive' }} /></p>
          </Specimen>
          <Specimen label="State=Default, Count=False" nodeId="5647:478912" surface="primary">
            <p className="cm-resp__body"><CitationPill citation={{ label: 'Pipeline', source: 'salesforce' }} /></p>
          </Specimen>
          <Specimen label="In a sentence" surface="primary">
            <p className="cm-resp__body">That part is not in question. <CitationPill citation={{ label: 'Inline Citation', source: 'generic' }} /></p>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Suggested prompts" description="Suggested prompts / Type=Lines: the heading, then rows between border-tertiary lines; hover turns a row brand.">
        <Specimens min="lg">
          <Specimen wide label="Type=Lines, second row State=Hover" nodeId="5647:478952" surface="primary">
            <div className="cmg-col">
              <SuggestedPrompts prompts={creative.suggested ?? []} hoverIndex={1} onPick={p => toast.show({ message: p })} />
            </div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
