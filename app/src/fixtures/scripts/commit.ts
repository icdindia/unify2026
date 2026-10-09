import { PROTOTYPE_TIMING } from '../../playback/timing'
import {
  COMMIT_ANSWER, COMMIT_QUESTION, COT_COMMIT, COT_SHORT_COMMIT, CREATIVE_ANSWER, GRACE_ATLAS, INTERACTIVE_ANSWER, JOHN_COVERAGE,
  JOINED_LINE, LANDING_QUESTION, MATT_REPLY_1, MATT_REPLY_2, MATT_REPLY_3, MATT_TO_ASSISTANT, ROGER_TO_MATT,
} from '../copy'
import { d } from '../drift'
import type { Answer, ChatScript } from '../script'
import { AFTER_COT_FIRST, AFTER_COT_STEP, START, cotBeats, says } from './chain'

// "How does commit actually look?" — chat-artifact, thinking, collab-chat, queue-1, commenters, consecutive,
// share-artifact, add-users, new-memory, chat-questions and deleted-artifact all play inside this one chat.
//
// Beat ids are the BUILD-PLAN 2.1 `at=` values. COT beats are named by the Agent COT variant they show
// (cot-2 … cot-7 = Type=Step N); the plan's `at=cot-1` (chat-artifact 04, which draws Type=Step 3) is an alias of cot-3.
// input-large 14-24 (7534:275062 … 7534:290275) replay the same run with the composer in State=Generating and add the
// end of the chain: cot-done (Complete 1), cot-collapsed (Complete 2) and answer-streaming (With Answer, still running).
// Figma wires Complete 1 → With Answer at 0s and never shows Complete 2, so the two collapsed beats each hold one COT step
// (PROTOTYPE_TIMING.collapsedHoldMs) and every frame of the run is on screen in live play.

const T1 = 'turn-commit' // the commit answer
const T2 = 'turn-interactive' // the answer to Matt's @Assistant, with the Pipeline Command artifact
const T3 = 'turn-followup' // Grace's question, answered with a question card

export const COMMIT_SCRIPT: ChatScript = {
  chat: 'commit',
  title: 'How does commit actually look?',
  beats: [
    {
      id: 'sent',
      label: 'Roger sends the question; the Assistant is thinking',
      figma: ['9256:466688', '8863:220940', '10139:466731', '7534:275062'],
      trigger: START,
      events: [says('m-commit-q', 'roger-bennett', [COMMIT_QUESTION]), { do: 'think', turn: T1, cot: COT_COMMIT }],
    },
    ...cotBeats(T1, COT_COMMIT, {
      figma: {
        2: ['7534:276741'], 3: ['1713:246600', '7534:278537'], 4: ['7534:279976'], 5: ['7534:281585'], 6: ['7534:283214'],
        7: ['1713:249395', '7534:284863'], lines: ['4756:184104', '7534:288907'],
      },
      aliases: { 3: ['cot-1'] },
    }),
    {
      id: 'cot-done',
      label: 'The thoughts collapse to "Thoughts" (Agent COT / Type=Complete 1); still generating',
      figma: ['7534:286145'],
      trigger: AFTER_COT_STEP, // Figma: … → All 1 line thoughts → Complete 1, 2.5s apart
      events: [{ do: 'cot', turn: T1, step: 'complete-1' }],
    },
    {
      id: 'cot-collapsed',
      label: 'The collapsed header line (Agent COT / Type=Complete 2); still generating',
      figma: ['7534:287594'],
      trigger: { after: 'time', ms: PROTOTYPE_TIMING.collapsedHoldMs, source: 'prototype', note: 'Complete 1 → Complete 2 is not wired; one COT step' },
      events: [{ do: 'cot', turn: T1, step: 'complete-2' }],
    },
    {
      id: 'answer-streaming',
      label: 'The answer arrives while the Assistant is still generating (Stop stays)',
      figma: ['7534:290275'],
      // Figma's 0s is Complete 1 → With Answer, a hop this chat does not play: it shows Complete 2 in between (input-large 22)
      trigger: { after: 'time', ms: PROTOTYPE_TIMING.collapsedHoldMs, source: 'prototype', note: 'Complete 2 → With Answer is not wired; one COT step' },
      events: [{ do: 'answer', turn: T1, answer: d<Answer>(CREATIVE_ANSWER, COMMIT_ANSWER, 'commit-streaming-answer-copy'), streaming: true }],
    },
    {
      id: 'answer',
      label: 'The answer: commit is $8.4M against a $9.2M quota',
      figma: ['1809:501331', '5691:481950', '7830:279834', '9915:762550'],
      trigger: { after: 'time', ms: PROTOTYPE_TIMING.answerStreamMs, source: 'prototype', note: 'the answer finishes streaming (input-large 24 → chat-artifact 08 is not wired)' },
      events: [{ do: 'answer', turn: T1, answer: COMMIT_ANSWER }],
    },
    {
      id: 'joined',
      label: 'Roger shares the chat; Matt, John and Grace join',
      figma: ['1731:255712', '7830:279836'],
      trigger: { after: 'user', action: 'invite', hint: 'Share → invite people → Invite' },
      events: [{ do: 'join', people: ['matt-rivera', 'john-whitaker', 'grace-coleman'], line: JOINED_LINE }],
    },
    {
      id: 'mention-sent',
      label: 'Roger @mentions Matt; Matt is typing',
      figma: ['1731:341539', '8222:482896'],
      trigger: { after: 'user', action: 'send', hint: 'Send the @Matt Rivera message' },
      events: [says('m-roger-matt', 'roger-bennett', ROGER_TO_MATT), { do: 'typing', people: ['matt-rivera'] }],
    },
    {
      id: 'matt-replied',
      label: 'Matt replies and asks @Assistant for an interactive view; the Assistant is thinking',
      figma: ['3273:190223', '8222:485711', '8222:498555', '11633:344632'],
      trigger: { after: 'time', ms: PROTOTYPE_TIMING.participantTypingMs, source: 'prototype', note: 'Matt types (no Figma timing)' },
      events: [
        { do: 'typing', people: [] },
        says('m-matt-1', 'matt-rivera', MATT_REPLY_1),
        says('m-matt-2', 'matt-rivera', MATT_REPLY_2),
        says('m-matt-3', 'matt-rivera', MATT_REPLY_3),
        says('m-matt-4', 'matt-rivera', MATT_TO_ASSISTANT),
        { do: 'think', turn: T2, cot: COT_SHORT_COMMIT },
      ],
    },
    {
      id: 'artifact-cot-2',
      label: 'Consulting the knowledge repository…',
      figma: [],
      trigger: AFTER_COT_FIRST,
      events: [{ do: 'cot', turn: T2, step: 2 }],
    },
    {
      id: 'artifact',
      label: 'The Assistant answers with the Pipeline Command artifact; John and Grace reply',
      figma: ['1768:356654', '1809:363799', '8222:488552', '5975:413714', '14607:403125', '1809:488480', '1795:359260'],
      trigger: AFTER_COT_STEP,
      events: [
        { do: 'answer', turn: T2, answer: INTERACTIVE_ANSWER },
        says('m-john-coverage', 'john-whitaker', JOHN_COVERAGE),
        says('m-grace-atlas', 'grace-coleman', GRACE_ATLAS),
      ],
    },
    {
      id: 'followup',
      label: 'The Assistant picks up Grace’s question and is thinking',
      figma: ['8279:215077', '8451:366278'],
      trigger: { after: 'user', action: 'continue', hint: 'Next beat (scripted: the Assistant answers Grace)' },
      events: [{ do: 'think', turn: T3, cot: COT_SHORT_COMMIT }],
    },
    {
      id: 'question-cot-2',
      label: 'Consulting the knowledge repository…',
      figma: [],
      trigger: AFTER_COT_FIRST,
      events: [{ do: 'cot', turn: T3, step: 2 }],
    },
    {
      id: 'question',
      label: 'The Assistant asks where the flagged view should land',
      figma: ['5873:530156'],
      trigger: AFTER_COT_STEP,
      events: [{ do: 'ask', turn: T3, question: LANDING_QUESTION }],
    },
  ],
}
