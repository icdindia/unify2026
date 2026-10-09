import type { Text } from '../fixtures/drift'
import type { PersonId } from '../fixtures/people'
import type { Beat, BeatTrigger, ChatEvent, ChatScript, QuestionCard, ThreadItem } from '../fixtures/script'

// The pure part of the player: fold a script's events into the chat state at any beat. No timers, no React.
// `at=<beat>` renders stateAt(script, beatIndex(script, at)) directly, which is how a diff gets any beat instantly.

export type ChatState = {
  chat: string
  title: Text
  /** Id of the beat this state is at. */
  beat: string
  index: number
  items: ThreadItem[]
  /** People shown typing by the script (the collaborative bar / typing row). */
  typing: PersonId[]
  /** People who joined the chat (header avatar stack). */
  participants: PersonId[]
  /** The question card above the composer, if the Assistant asked one. */
  question: QuestionCard | null
  /** The Assistant turn still running: the composer shows Stop (State=Generating) while it is set. */
  running: string | null
}

export function initialState(script: ChatScript): ChatState {
  return { chat: script.chat, title: script.title, beat: '', index: -1, items: [], typing: [], participants: [], question: null, running: null }
}

const without = (items: ThreadItem[], id: string) => items.filter(i => i.id !== id)
const mapTurn = (items: ThreadItem[], id: string, f: (i: ThreadItem & { kind: 'assistant' }) => ThreadItem) =>
  items.map(i => (i.kind === 'assistant' && i.id === id ? f(i) : i))

export function applyEvent(s: ChatState, e: ChatEvent): ChatState {
  switch (e.do) {
    case 'post':
      return { ...s, items: [...s.items, e.item] }
    case 'think':
      return { ...s, items: [...s.items, { kind: 'assistant', id: e.turn, cot: e.cot, step: 1, answer: null }], running: e.turn }
    case 'cot':
      return { ...s, items: mapTurn(s.items, e.turn, i => ({ ...i, step: e.step })) }
    case 'answer':
      return {
        ...s,
        items: mapTurn(s.items, e.turn, i => ({ ...i, step: 'done', answer: e.answer, streaming: e.streaming ? true : undefined })),
        running: e.streaming || s.running !== e.turn ? s.running : null,
      }
    case 'ask':
      return { ...s, items: without(s.items, e.turn), question: e.question, running: s.running === e.turn ? null : s.running }
    case 'end':
      return { ...s, items: without(s.items, e.turn), running: s.running === e.turn ? null : s.running }
    case 'close-question':
      return { ...s, question: null }
    case 'typing':
      return { ...s, typing: e.people }
    case 'join':
      return {
        ...s,
        participants: [...s.participants, ...e.people.filter(p => !s.participants.includes(p))],
        items: [...s.items, { kind: 'system', id: `joined-${e.people.join('-')}`, text: e.line }],
      }
  }
}

/** Index of a beat by id or alias; -1 when the script has no such beat. */
export function beatIndex(script: ChatScript, id: string | null | undefined): number {
  if (!id) return -1
  return script.beats.findIndex(b => b.id === id || b.aliases?.includes(id))
}

const cache = new WeakMap<ChatScript, ChatState[]>()

/** The state after every beat, computed once per script. */
export function statesOf(script: ChatScript): ChatState[] {
  const hit = cache.get(script)
  if (hit) return hit
  const states: ChatState[] = []
  let s = initialState(script)
  script.beats.forEach((beat, index) => {
    s = beat.events.reduce(applyEvent, { ...s, beat: beat.id, index })
    states.push(s)
  })
  cache.set(script, states)
  return states
}

/** The chat as it stands once beat `index` has played (clamped to the script). */
export function stateAt(script: ChatScript, index: number): ChatState {
  const states = statesOf(script)
  return states[Math.max(0, Math.min(index, states.length - 1))]
}

/** What the beat after `index` waits for; null at the end of the script. */
export function triggerAfter(script: ChatScript, index: number): BeatTrigger | null {
  return script.beats[index + 1]?.trigger ?? null
}

/**
 * What would make a script misplay, as sentences (empty when it is sound):
 * - an `at=` id (or alias) that names two beats: the URL could only ever reach the first;
 * - a `start` trigger after the first beat: live play would stall there (no timer, no user gate);
 * - a timed beat after 0 ms: the beat before it is never on screen in live play (only `at=` shows it).
 */
export function scriptProblems(script: ChatScript): string[] {
  const problems: string[] = []
  const seen = new Map<string, string>()
  script.beats.forEach((beat, i) => {
    for (const id of [beat.id, ...(beat.aliases ?? [])]) {
      const first = seen.get(id)
      if (first !== undefined) problems.push(`at=${id} names beat "${first}" and beat "${beat.id}"`)
      else seen.set(id, beat.id)
    }
    const tr = beat.trigger
    if (tr.after === 'start' && i > 0) problems.push(`beat "${beat.id}" has a start trigger but is not the first beat`)
    if (tr.after === 'time' && !(tr.ms > 0) && i > 0) {
      problems.push(`beat "${script.beats[i - 1].id}" is held ${tr.ms} ms: "${beat.id}" replaces it before it can be seen`)
    }
  })
  return problems
}

/** Each beat with its offset in ms from the previous user gate (timed beats only accumulate). For timelines. */
export function timeline(script: ChatScript): { beat: Beat; offsetMs: number | null }[] {
  let t = 0
  return script.beats.map(beat => {
    const tr = beat.trigger
    if (tr.after === 'time') { t += tr.ms; return { beat, offsetMs: t } }
    t = 0
    return { beat, offsetMs: tr.after === 'start' ? 0 : null }
  })
}
