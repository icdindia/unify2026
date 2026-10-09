// Timings of the chat motion, read from the prototype wiring in Figma (thinking journey, 8863:220940 / 10139:466731).
// The frames are static; the motion lives in AFTER_TIMEOUT "change to" reactions on component variants.

export const FIGMA_TIMING = {
  /** `thinking state` (484:117565) and `_thinking state` (3518:217901): State=1 <-> State=2 every 0.8s. Q24 default. */
  thinkingLoopMs: 800,
  /** `_thinking state` (7534:291688): the 0.2s shimmer on the bare dot grid. Not used (Q24 default picks 0.8s). */
  thinkingFastLoopMs: 200,
  /** `Agent COT` (8863:218607): Step 1 → Step 2 after 4s. */
  cotFirstStepMs: 4000,
  /** Every later Agent COT step: Step 2 → … → Step 7 → All 1 line thoughts → Complete 1, 2.5s apart. */
  cotStepMs: 2500,
  /**
   * Complete 1 → With Answer: 0s (AFTER_TIMEOUT 0.001s, the shortest Figma allows). Not used by the scripts: the commit
   * chat plays input-large 21 → 22 → 24, Complete 1 → Complete 2 → With Answer, and Figma wires neither hop (Complete 2
   * has no reactions). A 0 ms hop would leave the beat before it on screen for no time at all, so each of those two
   * holds one COT step (PROTOTYPE_TIMING.collapsedHoldMs).
   */
  completeToAnswerMs: 0,
} as const

/** Gaps Figma does not time. Each is the prototype's choice and is named in the beat that uses it. */
export const PROTOTYPE_TIMING = {
  /** A participant's typing indicator before their messages land (chat-artifact 13 → 14 has no wiring). */
  participantTypingMs: 3000,
  /** The answer streams in before the turn ends and Stop turns back into Send (input-large 24 → chat-artifact 08). */
  answerStreamMs: 1500,
  /**
   * How long each collapsed chain stays up before the next one: Complete 1 (input-large 21) → Complete 2 (22) → With
   * Answer (24). Figma wires neither hop, so each holds one COT step, the pace of the chain before it.
   */
  collapsedHoldMs: FIGMA_TIMING.cotStepMs,
} as const
