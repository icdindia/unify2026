import { useRef, type ReactNode } from 'react'
import {
  AssistantResponse, MessageGroup, SystemLine, TypingIndicator, useAuthorOf, type MessageRun, type UserMessageData,
} from '../../components/chat-messages'
import { Composer, type ComposerHandle } from '../../components/composer'
import { useMentionPicker } from '../../components/mention-picker'
import { useToast } from '../../components/overlays'
import {
  COMMIT_ANSWER, COMMIT_QUESTION, GRACE_ATLAS, INTERACTIVE_ANSWER, JOHN_COVERAGE, JOINED_LINE, MATT_REPLY_1, MATT_REPLY_2,
  MATT_REPLY_3, MATT_TO_ASSISTANT, ROGER_FOLLOW_UP, ROGER_TO_MATT,
} from '../../fixtures/copy'
import { useResolved } from '../../fixtures/drift'
import type { PersonId } from '../../fixtures/people'
import { Link } from '../../router/Link'
import { useUiParam } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './chat-messages.css'

export const meta: GalleryMeta = {
  title: 'Chat messages',
  figmaNodeIds: ['14839:266735', '1707:246568', '255:74718', '1731:341631', '1768:345968', '1768:345844'],
  group: 'Chat',
  description:
    'Sent messages (own: right grey bubble with copy + edit on hover; participant: name row with a 20px avatar, then ' +
    'bubbles), grouped by sender with the consecutive-messages spacing (32 same sender, 40 sender change, 24 name to ' +
    'bubble), the "@Name" pill, the "joined the chat" line and the typing row. The Replica tabs redraw chat-artifact ' +
    'frames at 1440 for pixel diffs.',
  sheets: [
    { id: 'specimens', label: 'Specimens' },
    { id: 'replica-08', label: 'Replica 08' },
    { id: 'replica-10', label: 'Replica 10' },
    { id: 'replica-11', label: 'Replica 11' },
    { id: 'replica-13', label: 'Replica 13' },
    { id: 'replica-14', label: 'Replica 14' },
    { id: 'replica-16', label: 'Replica 16' },
    { id: 'replica-consecutive', label: 'Replica consecutive' },
  ],
}

const msg = (id: string, body: MessageRun[]): UserMessageData => ({ id, body })

const RUNS = { ROGER_TO_MATT, ROGER_FOLLOW_UP, MATT_REPLY_1, MATT_REPLY_2, MATT_REPLY_3, MATT_TO_ASSISTANT, JOHN_COVERAGE, GRACE_ATLAS }

/** The commit chat's message copy, Drifts resolved ("As designed" draws the frames' copy). */
function useRuns(): Record<keyof typeof RUNS, MessageRun[]> {
  return useResolved(RUNS) as Record<keyof typeof RUNS, MessageRun[]>
}

/** Stand-in for the agent components' collapsed chain-of-thought row (the replicas mask it in diffs). */
const CotStandIn = () => (
  <span className="cmg-cot"><span className="cmg-cot__av" aria-hidden="true" />Searched internal knowledge · Reasoned over the results ›</span>
)

function Specimens1() {
  const author = useAuthorOf()
  const toast = useToast()
  const r = useRuns()
  const rogerToMatt = r.ROGER_TO_MATT
  const followUp = r.ROGER_FOLLOW_UP
  const toAssistant = r.MATT_TO_ASSISTANT
  const copied = (ok: boolean) => toast.show({ message: ok ? 'Message copied' : 'Could not copy' })
  return (
    <>
      <GallerySection title="Own message" description="Copilot_User Message_Desktop full: right-aligned, bubble max 640, Text md/Regular para 15/26 on bg-tertiary, padding 8/16, radius 12. Copy + edit show 4px under the bubble on hover or keyboard focus (State=Hover); they sit in the gap, so nothing moves.">
        <Specimens min="lg">
          <Specimen wide label="State=Default, Type=Default" nodeId="14839:266736" surface="primary">
            <div className="cmg-col"><MessageGroup own messages={[msg('a', [COMMIT_QUESTION])]} onCopy={(_, ok) => copied(ok)} /></div>
          </Specimen>
          <Specimen wide label="State=Hover, Type=With Tag (Option 1 pill)" nodeId="14839:266739" surface="primary">
            <div className="cmg-col"><MessageGroup own hover messages={[msg('b', rogerToMatt)]} onCopy={(_, ok) => copied(ok)} /></div>
          </Specimen>
          <Specimen wide label="State=Hover, Type=Consecutive msgs (consecutive 01, 32 apart)" nodeId="14839:266740" surface="primary">
            <div className="cmg-col"><MessageGroup own hover messages={[msg('c1', rogerToMatt), msg('c2', followUp)]} onCopy={(_, ok) => copied(ok)} /></div>
          </Specimen>
          <Specimen wide label="Mention as drawn in consecutive 01 (Option 2, designedMention='text'; the pill with fixes on)" surface="primary">
            <div className="cmg-col"><MessageGroup own designedMention="text" messages={[msg('d', followUp)]} /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Participant messages" description="A name row (Avatar xxs hanging 32px left of the column, the name in Text xs) then left-aligned bubbles, 24 from the row's top to the first bubble. Same sender: 32 apart (spec), or 8 as chat-artifact 14 draws them (designedSpacing='compact', the spec with fixes on).">
        <Specimens min="lg">
          <Specimen wide label="Copilot_User Message, spacing spec" nodeId="1707:246569" surface="primary">
            <div className="cmg-col cmg-col--hang"><MessageGroup author={author('matt-rivera')} messages={[msg('m1', r.MATT_REPLY_1), msg('m2', r.MATT_REPLY_2)]} /></div>
          </Specimen>
          <Specimen wide label="As chat-artifact 14 draws it (compact, @Assistant pill)" nodeId="3273:190321" surface="primary">
            <div className="cmg-col cmg-col--hang"><MessageGroup author={author('matt-rivera')} designedSpacing="compact" messages={[msg('m3', r.MATT_REPLY_3), msg('m4', toAssistant)]} /></div>
          </Specimen>
          <Specimen wide label="hang={false}: the avatar inside the column (narrow layouts)" surface="primary">
            <div className="cmg-col"><MessageGroup author={author('john-whitaker')} hang={false} messages={[msg('j1', r.JOHN_COVERAGE)]} /></div>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="System line and typing row" description="The joined line (Text md/Regular para, text-quaternary, centred, 20 above and below) and the typing row of chat-artifact 13 (Avatar xxs, the name in Text xs, Three dots animation: three 0.3s steps).">
        <Specimens min="lg">
          <Specimen wide label="System line" nodeId="1731:341631" surface="primary">
            <div className="cmg-col"><SystemLine text={JOINED_LINE} /></div>
          </Specimen>
          <Specimen label="Typing row (animated)" nodeId="1768:345968" surface="primary">
            <div className="cmg-col cmg-col--hang"><TypingIndicator person={author('matt-rivera')} /></div>
          </Specimen>
          <Specimen label="Three dots animation / State=1 (still)" nodeId="1768:345845" surface="primary">
            <div className="cmg-col cmg-col--hang"><TypingIndicator person={author('matt-rivera')} still /></div>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}

/** A 1440 x 900 white canvas over the page, with the thread column placed where the frame has it. */
function Canvas({ x = 368, top, children, extra }: { x?: number; top: number; children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="cmg-canvas" data-replica="">
      <div className="cmg-canvas__col" style={{ left: x, top }}>{children}</div>
      {extra}
      <Link to="/gallery/chat-messages" className="cmg-canvas__back">Back</Link>
    </div>
  )
}

/** Composer + mention picker at the frame's place (368, 825). */
function MentionReplica({ text, hover }: { text: string; hover?: PersonId }) {
  const handle = useRef<ComposerHandle>(null)
  const mention = useMentionPicker({ composer: handle, participants: ['matt-rivera', 'john-whitaker', 'grace-coleman'], hoverId: hover })
  return (
    <div className="cmg-canvas__composer">
      <Composer
        type="bottom" tools handleRef={handle} defaultValue={text} mentions={mention.names}
        onTrigger={mention.onTrigger} onTriggerKeyDown={mention.onTriggerKeyDown}
      />
      {mention.picker}
    </div>
  )
}

function Replica({ sheet }: { sheet: string }) {
  const author = useAuthorOf()
  const commit = useResolved(COMMIT_ANSWER)
  const interactive = useResolved(INTERACTIVE_ANSWER)
  const r = useRuns()
  const rogerToMatt = r.ROGER_TO_MATT
  const followUp = r.ROGER_FOLLOW_UP
  const toAssistant = r.MATT_TO_ASSISTANT
  const grace = r.GRACE_ATLAS
  const header = <CotStandIn />
  const card = () => <div className="cmg-card">Pipeline Command · Interactive HTML</div>
  switch (sheet) {
    case 'replica-08':
      return (
        <Canvas x={480} top={49}>
          <MessageGroup own inset="double" messages={[msg('q', [COMMIT_QUESTION])]} />
          <AssistantResponse answer={commit} header={header} />
        </Canvas>
      )
    case 'replica-10':
    case 'replica-11':
      return (
        <Canvas top={49} extra={<MentionReplica text={sheet === 'replica-10' ? '@' : '@m'} hover={sheet === 'replica-11' ? 'matt-rivera' : undefined} />}>
          <MessageGroup own inset="double" messages={[msg('q', [COMMIT_QUESTION])]} />
          <AssistantResponse answer={commit} header={header} />
          <SystemLine text={JOINED_LINE} />
        </Canvas>
      )
    case 'replica-13':
      return (
        <Canvas top={97} extra={<div className="cmg-canvas__typing"><TypingIndicator person={author('matt-rivera')} still /></div>}>
          <AssistantResponse answer={commit} header={header} />
          <SystemLine text={JOINED_LINE} />
          <MessageGroup own messages={[msg('rm', rogerToMatt)]} />
        </Canvas>
      )
    case 'replica-14':
      return (
        <Canvas top={57}>
          <SystemLine text={JOINED_LINE} />
          <MessageGroup own messages={[msg('rm', rogerToMatt)]} />
          <MessageGroup author={author('matt-rivera')} designedSpacing="compact" messages={[msg('m1', r.MATT_REPLY_1), msg('m2', r.MATT_REPLY_2)]} />
          <MessageGroup author={author('matt-rivera')} designedSpacing="compact" messages={[msg('m3', r.MATT_REPLY_3), msg('m4', toAssistant)]} />
        </Canvas>
      )
    case 'replica-16':
      return (
        <Canvas top={219}>
          <AssistantResponse answer={interactive} header={header} designedFeedback={false} renderBlock={b => (b.kind === 'artifact' ? card() : null)} />
          <MessageGroup author={author('john-whitaker')} messages={[msg('j', r.JOHN_COVERAGE)]} />
          <MessageGroup author={author('grace-coleman')} messages={[msg('g', grace)]} />
        </Canvas>
      )
    case 'replica-consecutive':
      return (
        <Canvas top={-25}>
          <SystemLine text={JOINED_LINE} />
          <MessageGroup own hover designedMention="text" messages={[msg('o1', rogerToMatt), msg('o2', followUp)]} />
          <MessageGroup author={author('matt-rivera')} messages={[msg('m1', r.MATT_REPLY_1), msg('m2', r.MATT_REPLY_2)]} />
          <MessageGroup author={author('matt-rivera')} messages={[msg('m3', r.MATT_REPLY_3), msg('m4', toAssistant)]} />
        </Canvas>
      )
    default:
      return null
  }
}

export default function ChatMessagesGallery() {
  const [sheet] = useUiParam('sheet')
  if (sheet && sheet.startsWith('replica-')) return <Replica sheet={sheet} />
  return <Specimens1 />
}
