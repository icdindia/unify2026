import { BU_QUESTION, COMMIT_QUESTION } from './copy'
import { d } from './drift'
import { at } from './people'
import type { Inline } from './script'

// Composer presets for `compose=` (BUILD-PLAN 2.1). Text only: the composer (wave 1, agent 1.5) owns how it draws them.

export type ComposePreset = {
  text: Inline[]
  /** Blue skill token before the text ("/Tech design requirements", cost 01-09). */
  skill?: string
  /** Open mention picker with this query (chat-artifact 10 "@", 11 "@m"). */
  mentionQuery?: string
  attachment?: 'loading' | 'ready'
  enhance?: 'loading' | 'done'
  /** `Copilot desktop Input Box / Type=Bottom large` (cost, queue 04-05); the default is the frame's own type. */
  large?: boolean
  /** State=Generating with an empty field: Stop under a finished answer (input-large 08, Q: Stop until the answer completes). */
  state?: 'generating'
  /** State=Limit exceed: the text is this many characters over the limit; the error pill reads "-<n>" (input-large 07, 13). */
  limitOverBy?: number
}

const INSIGHTS = 'AI-generated insights based on the inputs provided. '

// The copy of the input-large row (2532:376700), read from its frames. The skill token is always "/Tech design requirements".
/** Text=Two line on the landing box (5220:203368). */
export const COMPOSE_TWO_LINE =
  'This space will display AI-generated insights based on inputs sufficient data is available, the system will analyze patterns and generate'
/** Bottom large, Text=Two line: three lines of text (5220:204331). */
export const COMPOSE_THREE_LINE =
  'This space will display AI-generated insights based on inputs provided.\n' +
  'This space will display AI-generated insights based on inputs provided by you. Sufficient data is available, the system will analyze patterns and generate.'
const LONG_BODY =
  'This space will display AI-generated insights based on inputs provided. sufficient data is available, the system will analyze patterns and generate.  ' +
  'This space will display AI-generated insights based on the inputs provided. Once sufficient data is available, the system will analyze patterns and generate'
/** Text=Max line: twelve lines and more (5220:203662, 5220:204358). */
export const COMPOSE_MAX_LINE = LONG_BODY.repeat(5)

export const COMPOSE_PRESETS = {
  'commit-q': { text: [COMMIT_QUESTION] }, // chat-artifact 02
  'bu-q': { text: [BU_QUESTION] }, // graphs 02
  insights: { text: [INSIGHTS] }, // enhance 02, 03
  'insights-enhancing': { text: [], enhance: 'loading' }, // enhance 04 (skeleton)
  'insights-enhanced': { // enhance 05 (10247:286242)
    text: ['This space will display AI-generated insights based on input sufficient data is available,  the system will analyze patterns and generate'],
    enhance: 'done',
  },
  skill: { text: [INSIGHTS], skill: 'Tech design requirements', large: true }, // cost 01-09, input-large 04
  // input-large: the skill token plus more and more text, on the landing box (05-07) and under the commit chat (09-13)
  'skill-typing': { text: ['AI-generated insights based on '], skill: 'Tech design requirements' }, // 09, still the pill
  'skill-long': { text: ['AI-generated insights based on the inputs provided by you.'], skill: 'Tech design requirements', large: true }, // 10
  'skill-2': { text: [COMPOSE_TWO_LINE], skill: 'Tech design requirements' }, // 05
  'skill-3': { text: [COMPOSE_THREE_LINE], skill: 'Tech design requirements', large: true }, // 11
  'skill-max': { text: [COMPOSE_MAX_LINE], skill: 'Tech design requirements', large: true }, // 06, 12
  'skill-over': { text: [COMPOSE_MAX_LINE], skill: 'Tech design requirements', large: true, limitOverBy: 2346 }, // 07, 13
  generating: { text: [], state: 'generating' }, // input-large 08: Stop under the finished answer
  at: { text: ['@'], mentionQuery: '' }, // chat-artifact 10, collab 03
  'at-m': { text: ['@m'], mentionQuery: 'm' }, // chat-artifact 11, collab 04
  'mention-matt': { text: [at('matt-rivera'), ' you own most of those six — which'] }, // chat-artifact 12, collab 05
  // queue 02 types "AI-generated insights based on" and 03 queues "Keep the design minimal"
  'queue-text': { text: [d('AI-generated insights based on ', 'Keep the design minimal', 'queue-typed-text')] },
  'attach-loading': { text: ['Use the attached image as a reference for data graphs.'], attachment: 'loading', large: true }, // queue 04
  'attach-ready': { text: ['Use the attached image as a reference for data graphs.'], attachment: 'ready', large: true }, // queue 05
} satisfies Record<string, ComposePreset>

export type ComposePresetId = keyof typeof COMPOSE_PRESETS
/** For the `compose=` URL key. Own keys only: "constructor" or "__proto__" is not a preset (`in` would walk Object.prototype). */
export const isComposePresetId = (id: string): id is ComposePresetId => Object.hasOwn(COMPOSE_PRESETS, id)

/** Rotating placeholder hints of `_Text animate Desktop` (5546:212948), in the order prop=01…04 shows them. One list:
 *  the composer's (checked live in Figma by the composer's capture, input-large 01). */
export { COMPOSER_HINTS as PLACEHOLDER_HINTS } from '../components/composer/RotatingPlaceholder'
