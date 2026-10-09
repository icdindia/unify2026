import { COMMIT_ANSWER_CITED, ROGER_FOLLOW_UP } from '../fixtures/copy'
import type { ChatCost } from '../fixtures/cost'
import type { PersonId } from '../fixtures/people'
import type { ThreadItem } from '../fixtures/script'
import { resolveDrift, type Resolved } from '../fixtures/drift'
import type { ChatScript } from '../fixtures/script'
import { costFor, headerAvatarsFor, scenarioOf, typingFor, type Scenario, type SeedSet, type TypingSpec } from '../fixtures/seeds'
import { beatIndex, stateAt, type ChatState } from './engine'

// A beat's state plus the scenario seeds that change what the chat shows (seed= in the URL).

export type ChatView = Omit<ChatState, 'typing'> & {
  typing: TypingSpec
  /** Header avatar stack (participants, or the crowd's 10 + "+21"). */
  header: { people: PersonId[]; more: number }
  /** Assistant Replies toggle (seed replies-off). */
  assistantReplies: boolean
  /** Composer State=Generating: an Assistant turn is running. */
  generating: boolean
  cost: ChatCost
}

/** The own follow-up seed own-consecutive inserts after Roger's @Matt message (consecutive 01). */
const OWN_FOLLOW_UP: ThreadItem = { kind: 'user', id: 'm-roger-follow-up', from: 'roger-bennett', body: ROGER_FOLLOW_UP }

export function viewOf(state: ChatState, sc: Scenario): ChatView {
  let items = state.items
  if (sc.ownConsecutive) {
    const i = items.findIndex(it => it.id === 'm-roger-matt')
    if (i >= 0) items = [...items.slice(0, i + 1), OWN_FOLLOW_UP, ...items.slice(i + 1)]
  }
  if (sc.memoryBar) {
    // new-memory 01 draws the commit answer with source pills (and its typo)
    items = items.map(it => (it.kind === 'assistant' && it.id === 'turn-commit' && it.step === 'done' ? { ...it, answer: COMMIT_ANSWER_CITED } : it))
  }
  return {
    ...state,
    items,
    typing: typingFor(sc, state.typing),
    header: headerAvatarsFor(sc, state.participants),
    assistantReplies: sc.assistantReplies,
    generating: state.running !== null,
    cost: costFor(sc, state.chat, state.beat),
  }
}

/** Non-React: the resolved view of a chat at a beat (unknown `at` = the first beat). For diff harnesses and tests. */
export function chatViewAt(
  script: ChatScript,
  at: string | null,
  seeds: string | SeedSet | null,
  applies: (fix: string) => boolean,
): Resolved<ChatView> {
  return resolveDrift(viewOf(stateAt(script, Math.max(0, beatIndex(script, at))), scenarioOf(seeds)), applies)
}
