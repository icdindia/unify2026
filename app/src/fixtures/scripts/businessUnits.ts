import { BU_ANSWER, BU_QUESTION, COT_SHORT_THOUGHTS, FY2023_ANSWER, FY2023_PROMPT } from '../copy'
import type { ChatScript } from '../script'
import { AFTER_COT_FIRST, AFTER_COT_STEP, START, says } from './chain'

// "Business units led" — graphs 03-06. Figma draws "Thinking..." (03, 05) and the finished answers (04, 06);
// the turns run the Agent COT timing with no thoughts (Step 1 → 4s → Step 2 → 2.5s → answer).

const B1 = 'turn-bu'
const B2 = 'turn-fy2023'

export const BUSINESS_UNITS_SCRIPT: ChatScript = {
  chat: 'business-units',
  title: 'Business units led',
  beats: [
    {
      id: 'sent',
      label: 'Roger asks which business units led; the Assistant is thinking',
      figma: ['1707:125119'],
      trigger: START,
      events: [says('m-bu-q', 'roger-bennett', [BU_QUESTION]), { do: 'think', turn: B1, cot: COT_SHORT_THOUGHTS }],
    },
    { id: 'answer-1-cot-2', label: 'Consulting the knowledge repository…', figma: [], trigger: AFTER_COT_FIRST, events: [{ do: 'cot', turn: B1, step: 2 }] },
    {
      id: 'answer-1',
      label: 'KPI tiles and the business-unit chart',
      figma: ['1707:125400'],
      trigger: AFTER_COT_STEP,
      events: [{ do: 'answer', turn: B1, answer: BU_ANSWER }],
    },
    {
      id: 'sent-2',
      label: 'Roger pastes FY2023 revenue and margin; the Assistant is thinking',
      figma: ['1707:125678'],
      trigger: { after: 'user', action: 'send', hint: 'Send the FY2023 data prompt' },
      events: [says('m-fy2023', 'roger-bennett', [FY2023_PROMPT]), { do: 'think', turn: B2, cot: COT_SHORT_THOUGHTS }],
    },
    { id: 'answer-2-cot-2', label: 'Consulting the knowledge repository…', figma: [], trigger: AFTER_COT_FIRST, events: [{ do: 'cot', turn: B2, step: 2 }] },
    {
      id: 'answer-2',
      label: 'Revenue bars and the gross-margin line, FY2023',
      figma: ['1707:125957'],
      trigger: AFTER_COT_STEP,
      events: [{ do: 'answer', turn: B2, answer: FY2023_ANSWER }],
    },
  ],
}
