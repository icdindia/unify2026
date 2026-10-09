import { COT_SHORT_COMMIT, NEW_ARTIFACT_PROMPT, ROUTINE_READY_LINE, STARTERS_INTRO } from '../copy'
import type { ChatScript } from '../script'
import { AFTER_COT_FIRST, AFTER_COT_STEP, START, agentSays, says } from './chain'

// "New Artifact" (artifacts-landing 07) and "New routine" (publish-artifact 01).

const N1 = 'turn-starters'

export const NEW_ARTIFACT_SCRIPT: ChatScript = {
  chat: 'new-artifact',
  title: 'New Artifact',
  beats: [
    {
      id: 'sent',
      label: '"New Artifact" opens a chat seeded with "Create a new artifact"; the Assistant is thinking',
      figma: [],
      trigger: START,
      events: [says('m-new-artifact', 'roger-bennett', [NEW_ARTIFACT_PROMPT]), { do: 'think', turn: N1, cot: COT_SHORT_COMMIT }],
    },
    { id: 'starters-cot-2', label: 'Consulting the knowledge repository…', figma: [], trigger: AFTER_COT_FIRST, events: [{ do: 'cot', turn: N1, step: 2 }] },
    {
      id: 'starters',
      label: 'Four Artifact Starters: Spreadsheet, Presentation, Document, Application',
      figma: ['3780:177321'],
      trigger: AFTER_COT_STEP,
      events: [
        { do: 'end', turn: N1 },
        { do: 'post', item: { kind: 'starters', id: 'starters', intro: STARTERS_INTRO, options: ['spreadsheet', 'presentation', 'document', 'application'] } },
      ],
    },
    {
      // Q58 default: picking a starter opens the new artifact in this same chat (artifacts-landing 08 draws another chat)
      id: 'artifact',
      label: 'Picking Spreadsheet makes a blank sheet and opens it beside the chat',
      figma: ['3780:178324'],
      trigger: { after: 'user', action: 'pick-starter', hint: 'Pick an Artifact Starter' },
      events: [agentSays('turn-blank-xls', COT_SHORT_COMMIT, { blocks: [{ kind: 'artifact', artifact: 'blank-xls' }], cost: '$0.19', sources: 0, plain: true })],
    },
  ],
}

export const NEW_ROUTINE_SCRIPT: ChatScript = {
  chat: 'new-routine',
  title: 'New routine',
  beats: [
    {
      id: 'ready',
      label: 'The Pipeline Command app is open; the Assistant offers to change it',
      figma: ['1990:517731'],
      trigger: START,
      events: [agentSays('turn-routine-ready', COT_SHORT_COMMIT, { blocks: [{ kind: 'p', inl: [ROUTINE_READY_LINE] }], cost: '$0.19', sources: 0, plain: true })],
    },
  ],
}
