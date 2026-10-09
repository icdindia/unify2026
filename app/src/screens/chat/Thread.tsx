import { useMemo, type ReactNode } from 'react'
import { ChainOfThought } from '../../components/agent'
import {
  AssistantResponse, MessageGroup, SystemLine, groupThread, plainText, useAuthorOf,
  type ResolvedAnswer, type ResolvedBlock, type ThreadSegment, type UserMessageData,
} from '../../components/chat-messages'
import { InlineArtifactCard, useArtifactCard, type ArtifactGlyph } from '../../components/inline-artifact-card'
import type { ArtifactId } from '../../fixtures/artifacts'
import type { Resolved } from '../../fixtures/drift'
import { ME, type PersonId } from '../../fixtures/people'
import type { ThreadItem } from '../../fixtures/script'
import { cx } from '../../components/buttons/cx'

type Item = Resolved<ThreadItem>

export type ThreadProps = {
  items: Item[]
  column: 'full' | 'split'
  /** The beat is rendered still (at=): hold the shimmer and the dot rings. */
  still: boolean
  presentation: 'steps' | 'lines' | 'sources'
  glyph: 'round' | 'bare'
  /** As designed: hide a running thinking row (03). */
  hideThinking?: boolean
  /** As designed: per-frame message spacing / type (drawn.ts). */
  bubbleGap?: 48
  nameGap?: 48
  /** As designed: 80 between two participants' groups (15). */
  groupGap?: 80
  /** As designed: message ids that start a new group of the same sender (14 repeats Matt's name row). */
  groupBreaks?: readonly string[]
  /** As designed: the answer's text 8 under its header line instead of the component's 4 (16-18). */
  answerGap?: 8
  /** As designed: participants' mentions drawn as text without the pill (16-18). */
  mentionText?: boolean
  /** As designed: the inline card drawn hovered with the pointer elsewhere (17, 18). */
  cardHovered?: boolean
  smallBubbles?: boolean
  /** As designed: the inline card's mark / meta in this frame. */
  card?: { glyph?: ArtifactGlyph; meta?: string }
  /** hover=card:<id> pinned. */
  cardHover?: string | null
  /** Beats where one sender's bubbles are drawn 8 apart (chat-artifact 14). */
  compact?: boolean
  /** Avatars and the chain of thought hang 32px into the gutter (the 1440 frames); off on a phone-width window. */
  hang: boolean
  onOpenArtifact: (id: ArtifactId, opener: HTMLElement | null) => void
  onDownloadArtifact: (id: ArtifactId) => void
  onCopied: (ok: boolean) => void
  onEdit: (text: string) => void
  onShare: () => void
  onGap: (what: string) => void
}

/**
 * The chat thread: the script's items as the chat-messages and agent components draw them, direct siblings in one
 * column (each component carries its Figma container padding). Every item is wrapped in a block that carries
 * data-item=<item id> (scroll anchoring, tests) and data-node-id of the component inside it.
 */
export function Thread(p: ThreadProps) {
  const authorOf = useAuthorOf()
  const breaksKey = (p.groupBreaks ?? []).join(',')
  const segments = useMemo(() => {
    const all = groupThread(p.items, ME)
    if (!breaksKey) return all
    // a frame that repeats the sender's name row inside a run of one sender's messages: split the group there
    const breaks = new Set(breaksKey.split(','))
    const out: ThreadSegment<Item>[] = []
    for (const seg of all) {
      if (seg.kind !== 'group') { out.push(seg); continue }
      let last: Extract<ThreadSegment<Item>, { kind: 'group' }> | null = null
      for (const m of seg.messages) {
        if (last && !breaks.has(m.id)) last.messages.push(m)
        else { last = { ...seg, key: last ? m.id : seg.key, messages: [m] }; out.push(last) }
      }
    }
    return out
  }, [p.items, breaksKey])
  const first = p.items.find(i => i.kind === 'user')?.id
  const out: ReactNode[] = []
  let prev: string | null = null
  for (const seg of segments) {
    if (seg.kind === 'group') {
      const kind = seg.own ? 'own' : 'them'
      out.push(
        <div key={seg.key} className={cx('cth-item', `cth-item--${kind}`, prev === 'resp' && 'cth-item--after-resp')} data-item={seg.key}>
          {seg.own ? (
            <MessageGroup
              own messages={seg.messages} column={p.column} hang={p.hang} inset={seg.key === first && p.column === 'full' ? 'double' : 'single'}
              onCopy={(_, ok) => p.onCopied(ok)} onEdit={(m: UserMessageData) => p.onEdit(plainText(m.body))}
            />
          ) : (
            <MessageGroup
              author={authorOf(seg.from as PersonId)} messages={seg.messages} column={p.column} hang={p.hang}
              designedSpacing={p.compact ? 'compact' : 'spec'} designedMention={p.mentionText ? 'text' : 'pill'}
            />
          )}
        </div>,
      )
      prev = kind
      continue
    }
    const item = seg.item
    if (item.kind === 'system') {
      out.push(
        <div key={seg.key} className={cx('cth-item', 'cth-item--system', prev === 'resp' && 'cth-item--after-resp')} data-item={seg.key}>
          <SystemLine text={item.text} />
        </div>,
      )
      prev = 'system'
    } else if (item.kind === 'assistant') {
      const done = item.step === 'done' && item.answer
      if (!done && p.hideThinking) continue
      out.push(
        <div key={seg.key} className={cx('cth-item', done ? 'cth-item--resp' : 'cth-item--cot')} data-item={seg.key}>
          {done ? (
            <Answer {...p} item={item} answer={item.answer as ResolvedAnswer} />
          ) : (
            <div className="cth-cot">
              <ChainOfThought
                cot={item.cot} step={item.step} streaming={!!item.streaming} presentation={p.presentation} glyph={p.glyph}
                still={p.still} hang={p.hang}
              />
            </div>
          )}
        </div>,
      )
      prev = done ? 'resp' : 'cot'
    }
  }
  return (
    <div
      className={cx(
        'cth', `cth--${p.column}`, p.bubbleGap && 'cth--gap48', p.nameGap && 'cth--name48', p.groupGap && 'cth--groups80',
        p.answerGap && 'cth--answer8', p.smallBubbles && 'cth--small',
      )}
    >
      {out}
    </div>
  )
}

function Answer(p: ThreadProps & { item: Extract<Item, { kind: 'assistant' }>; answer: ResolvedAnswer }) {
  const { item, answer } = p
  const header = answer.plain ? undefined : (
    <ChainOfThought cot={item.cot} step="done" streaming={!!item.streaming} still={p.still} hang={false} />
  )
  return (
    <AssistantResponse
      answer={answer} header={header} column={p.column} hang={p.hang}
      designedFeedback={item.id !== 'turn-interactive'}
      renderBlock={(b: ResolvedBlock) => (b.kind === 'artifact' ? <ThreadCard {...p} id={b.artifact as ArtifactId} /> : null)}
      feedback={{
        onCopy: ok => p.onCopied(ok),
        onShare: p.onShare,
        onDownload: () => p.onGap('Download'),
        onReadAloud: () => p.onGap('Read aloud'),
        onBranch: () => p.onGap('Branch from here'),
        onSources: () => p.onGap('Sources'),
        onMore: () => p.onGap('More'),
      }}
    />
  )
}

/** The answer's inline artifact card: opens the artifact in the split, Download is a gap (toast). */
function ThreadCard(p: ThreadProps & { id: ArtifactId }) {
  const card = useArtifactCard(p.id, p.card)
  return (
    <InlineArtifactCard
      {...card}
      variant={p.column === 'split' ? 'split' : 'chat'}
      state={p.cardHovered || p.cardHover === `card:${p.id}` ? 'hover' : 'default'}
      onOpen={() => p.onOpenArtifact(p.id, document.activeElement instanceof HTMLElement ? document.activeElement : null)}
      onDownload={() => p.onDownloadArtifact(p.id)}
    />
  )
}
