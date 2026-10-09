import { d } from '../drift'
import { COMMIT_ANSWER, COMMIT_QUESTION, COT_COMMIT, CREATIVE_ANSWER } from '../copy'
import type { Answer, ChatScript } from '../script'
import { AFTER_COT_STEP, START, cotBeats, says } from './chain'

// The cost journey's chat (cost 01-09). It asks the commit question again; the budget states are seeds
// (budget-within / -approaching / -over, queries-10, monthly-out, usage-requested), see fixtures/cost.ts.

const C1 = 'turn-cost'

export const COST_SCRIPT: ChatScript = {
  chat: 'cost',
  // cost 01-07 title the chat "Business units led" under the commit question; cost 09 titles it after the question
  title: d('Business units led', 'How does commit actually look?', 'cost-chat-title'),
  beats: [
    {
      id: 'sent',
      label: 'Roger sends the question; the Assistant is thinking',
      figma: [],
      trigger: START,
      events: [says('m-cost-q', 'roger-bennett', [COMMIT_QUESTION]), { do: 'think', turn: C1, cot: COT_COMMIT }],
    },
    ...cotBeats(C1, COT_COMMIT, {
      figma: { 3: ['6802:235991', '6802:236005', '6802:236019', '6802:236106', '6802:236145', '6802:236125'] },
    }),
    {
      id: 'answer',
      label: 'The answer, with the cost popover',
      figma: ['6802:236034', '6802:236050', '6802:236066'],
      trigger: AFTER_COT_STEP,
      // cost 04 draws the "creative ways to reward community members" placeholder; 05 and 06 draw the commit answer
      events: [{ do: 'answer', turn: C1, answer: d<Answer>(CREATIVE_ANSWER, COMMIT_ANSWER, 'cost-answer-copy') }],
    },
  ],
}
