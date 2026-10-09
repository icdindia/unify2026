import { FIGMA_TIMING } from '../../playback/timing'
import type { Answer, Beat, BeatTrigger, ChatEvent, CotSpec, CotStep, Inline, ThreadItem } from '../script'
import type { Drift, Text } from '../drift'
import type { PersonId } from '../people'

// Builders shared by the chat scripts. Message ids are explicit so they stay stable across edits (UI keys, seeds).

export const says = (id: string, from: PersonId, body: Inline[] | Drift<Inline[]>): ChatEvent => ({
  do: 'post',
  item: { kind: 'user', id, from, body } satisfies ThreadItem,
})

export const line = (id: string, text: Text): ChatEvent => ({
  do: 'post',
  item: { kind: 'system', id, text },
})

/** An Assistant message that is already finished (no thinking), e.g. the line that opens a routine chat. */
export const agentSays = (turn: string, cot: CotSpec, answer: Answer | Drift<Answer>): ChatEvent => ({
  do: 'post',
  item: { kind: 'assistant', id: turn, cot, step: 'done', answer },
})

export const START: BeatTrigger = { after: 'start' }
export const AFTER_COT_FIRST: BeatTrigger = { after: 'time', ms: FIGMA_TIMING.cotFirstStepMs, source: 'figma', note: 'Agent COT Step 1 → Step 2' }
export const AFTER_COT_STEP: BeatTrigger = { after: 'time', ms: FIGMA_TIMING.cotStepMs, source: 'figma', note: 'Agent COT step' }

type ChainOptions = {
  /** Beat id for each step; defaults to `cot-<step>` / `cot-lines`. */
  id?: (step: CotStep) => string
  label?: (step: CotStep) => string
  figma?: Partial<Record<string, string[]>>
  aliases?: Partial<Record<string, string[]>>
}

/**
 * The beats of an Agent COT chain after the turn started (Step 1 is the beat that posts the `think` event):
 * Step 2 after 4s, then one step per thought (Step 3 shows the first), then "All 1 line thoughts", each 2.5s apart.
 * A chain with no thoughts stops at Step 2. The caller adds the finishing beat (answer / ask / end) with AFTER_COT_STEP.
 */
export function cotBeats(turn: string, cot: CotSpec, opts: ChainOptions = {}): Beat[] {
  const steps: CotStep[] = [2]
  cot.thoughts.forEach((_, i) => steps.push((3 + i) as CotStep))
  if (cot.thoughts.length) steps.push('lines')
  const id = opts.id ?? ((s: CotStep) => `cot-${s}`)
  const label = opts.label ?? ((s: CotStep) =>
    s === 2 ? 'Consulting the knowledge repository…'
      : s === 'lines' ? 'All thoughts as one line each (Agent COT / Type=All 1 line thoughts)'
        : s === 'done' ? 'Done'
          : s === 'complete-1' ? 'Thoughts collapse to "Thoughts" (Agent COT / Type=Complete 1)'
            : s === 'complete-2' ? 'The collapsed header line (Agent COT / Type=Complete 2)'
          : `Thought ${s - 2}: ${cot.thoughts[s - 3].text}`)
  return steps.map((step, i) => {
    const key = String(step)
    return {
      id: id(step),
      aliases: opts.aliases?.[key],
      label: label(step),
      figma: opts.figma?.[key] ?? [],
      trigger: i === 0 ? AFTER_COT_FIRST : AFTER_COT_STEP,
      events: [{ do: 'cot', turn, step }],
    }
  })
}
