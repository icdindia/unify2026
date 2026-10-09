import type { Drift, Text } from './drift'
import type { ArtifactId } from './artifacts'
import type { MentionTarget, PersonId } from './people'
import type { ChartId } from './charts'

// The shape of a chat script: an ordered list of beats, each a set of events applied to the thread.
// The player (src/playback) folds the events up to a beat into a ChatState, so `at=<beat>` renders any beat
// instantly and the same data plays with the Figma timings.

// ------------------------------------------------------------------------------------------------ rich text

/** "Copilot_Inline Citation Pill" / source pills ("Reforecast +2" with the Drive icon, "Pipeline" with Salesforce). */
export type Citation = { label: Text; more?: number; source: 'drive' | 'salesforce' | 'generic' }

/**
 * One run of a message. Runs render in order and carry their own whitespace: a text run after a mention starts
 * with a space. `b` is the SemiBold run of an answer bullet; `mention` renders the "@Name" pill / token.
 */
/** `label` is the pill text without the "@" ("Matt Rivera", "Assistant"); build mentions with `at()` from people.ts. */
export type Mention = { mention: MentionTarget; label: Text }
export type InlineRun = string | { b: Text } | Mention | { cite: Citation }
export type Inline = InlineRun | Drift<InlineRun>
/** Kept for readers: a plain Text is a valid Inline. */
export type { Text }

export type KpiTile = { label: Text; value: Text; caption: Text; delta?: Text }

export type Block =
  | { kind: 'p'; inl: Inline[] }
  | { kind: 'ul'; items: Inline[][] | Drift<Inline[][]> }
  /** Serif answer headline (graphs 04 / 06). */
  | { kind: 'headline'; text: Text }
  | { kind: 'subtitle'; text: Text }
  | { kind: 'kpis'; tiles: KpiTile[] | Drift<KpiTile[]> }
  | { kind: 'chart'; chart: ChartId | Drift<ChartId> }
  | { kind: 'artifact'; artifact: ArtifactId }

// ------------------------------------------------------------------------------------------------ chain of thought

/** A row of the sources card under a thought ("Open opportunities — Q3 26 (14)" / "Opportunity"). */
export type CotSource = { title: string; meta: string }
export type CotThought = {
  text: string
  sources?: { model: string; rows: CotSource[] }
  /**
   * The Agent COT step at which this thought appears. Default: its place in the list (the first thought at Step 3, the
   * next at Step 4, …), so each step appends one. A Drift when Figma draws a thought arriving at another step
   * (input-large 17-18 show "Traced the gap…" before "Searching for account details" is inserted above it).
   */
  appearsAt?: number | Drift<number>
}

/**
 * `Agent COT` (set 8863:218607). Step 1 "Thinking...", Step 2 "Consulting the knowledge repository...", then
 * Step 3..7 add one thought each under `header`; "All 1 line thoughts" drops the sources card; the finished answer
 * collapses the chain to `summary` ("Thoughts" = Type=Complete 1, the header text = Type=Complete 2).
 */
export type CotSpec = {
  header: string
  thoughts: CotThought[]
  summary: Text
}

/** The thoughts on screen at Agent COT step `step` (3…7 or 'lines'), in list order. Pass a resolved CotSpec. */
export function thoughtsAt<T extends { appearsAt?: number }>(thoughts: readonly T[], step: CotStep): T[] {
  if (step === 'lines') return [...thoughts]
  if (typeof step !== 'number') return []
  return thoughts.filter((t, i) => (t.appearsAt ?? i + 3) <= step)
}

/**
 * Agent COT variant on screen: 1-7 = Type=Step N, 'lines' = Type=All 1 line thoughts, 'complete-1' = Type=Complete 1
 * ("Thoughts ˅") and 'complete-2' = Type=Complete 2 (the header line) while the turn still runs (input-large 21, 22),
 * 'done' = Complete / With Answer.
 */
export type CotStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'lines' | 'complete-1' | 'complete-2' | 'done'

// ------------------------------------------------------------------------------------------------ thread

export type Answer = {
  blocks: Block[]
  /** Per-message cost pill in the feedback row ("$0.19"). */
  cost: string
  /** "8 Sources". */
  sources: number
  /** "Suggested actions" rows (Suggested prompts / Type=Lines). */
  suggested?: Text[]
  /** A one-line agent message: no COT line, no feedback row (artifacts-landing 07, publish-artifact 01). */
  plain?: boolean
}

export type StarterKind = 'spreadsheet' | 'presentation' | 'document' | 'application'

export type QuestionCard = {
  id: string
  question: Text
  options: Text[]
  /** Placeholder of the free-text row ("Describe the shape you want"). */
  freeText: Text
}

export type ThreadItem =
  | { kind: 'user'; id: string; from: PersonId; body: Inline[] | Drift<Inline[]> }
  | { kind: 'system'; id: string; text: Text }
  /** An Assistant turn. `step` follows the Agent COT chain; `answer` is set once step is 'done'. `streaming`: the answer
   *  is on screen but the turn still runs (input-large 24: spinning dots avatar, the composer shows Stop). */
  | { kind: 'assistant'; id: string; cot: CotSpec; step: CotStep; answer: Answer | Drift<Answer> | null; streaming?: boolean }
  /** "Artifact Starters" cards under an assistant line (artifacts-landing 07). */
  | { kind: 'starters'; id: string; intro: Text; options: StarterKind[] }

export type ChatEvent =
  | { do: 'post'; item: ThreadItem }
  /** An Assistant turn starts at COT Step 1 ("Thinking..."). */
  | { do: 'think'; turn: string; cot: CotSpec }
  | { do: 'cot'; turn: string; step: CotStep }
  /** The turn finishes: the chain collapses to its summary and the answer renders. With `streaming` the answer renders
   *  but the turn keeps running (State=Generating) until a later 'answer' event without it. */
  | { do: 'answer'; turn: string; answer: Answer | Drift<Answer>; streaming?: boolean }
  /** The turn finishes by asking: its thinking row goes and the question card opens above the composer. */
  | { do: 'ask'; turn: string; question: QuestionCard }
  /** The turn finishes with nothing to show (its thinking row goes); the next event posts what it produced. */
  | { do: 'end'; turn: string }
  /** The question card is answered or dismissed. */
  | { do: 'close-question' }
  | { do: 'typing'; people: PersonId[] }
  /** People join: they become participants and the centred system line is posted. */
  | { do: 'join'; people: PersonId[]; line: Text }

/** Where a beat's timing comes from: the Figma prototype wiring, or the prototype filling a gap. */
export type TimingSource = 'figma' | 'prototype'

/** What a beat waits for before it plays. */
export type UserAction =
  | 'send' // the user sends from the composer
  | 'invite' // the share modal's Invite
  | 'pick-starter' // an Artifact Starters card
  | 'continue' // a scripted participant turn that a reviewer releases ("next beat")

export type BeatTrigger =
  | { after: 'start' }
  | { after: 'time'; ms: number; source: TimingSource; note?: string }
  | { after: 'user'; action: UserAction; hint: string }

export type Beat = {
  /** URL id (`at=`). COT beats are named by the Agent COT variant they show: cot-2 … cot-7, cot-lines. */
  id: string
  /** Other `at=` values that land on this beat (BUILD-PLAN 2.1 names). */
  aliases?: string[]
  label: string
  /** Frames that draw this beat. */
  figma: string[]
  trigger: BeatTrigger
  events: ChatEvent[]
}

export type ChatScript = {
  chat: string
  title: Text
  beats: Beat[]
}
