import { COMMIT_QUESTION } from './copy'
import { d, type Text } from './drift'

// Cost of Chat (cost 01-09; "cost stat" popover). Limits per Q33: within budget below $2, approaching from $2,
// over from $5 per session (the bar's $0 / $2 / $5 marks); the monthly workspace limit is $250.

export const COST_LIMITS = { approaching: 2, over: 5, monthly: 250 } as const

export type BudgetState = 'within' | 'approaching' | 'over'

export const budgetState = (amount: number): BudgetState =>
  amount >= COST_LIMITS.over ? 'over' : amount >= COST_LIMITS.approaching ? 'approaching' : 'within'

/** The coloured line under the popover's bar (6802:236034, 6802:236050, 6802:236066). */
export const BUDGET_LABEL: Record<BudgetState, string> = {
  within: 'Within budget — well below the $5 per-session limit set.',
  approaching: 'Approaching limit - getting close to $5 limit set.',
  over: 'Over limit - past the $5 limit set. Start a new session.',
}

/** Bar marks of the popover. */
export const BUDGET_MARKS = ['$0', '$2', '$5'] as const

export type CostQuery = { id: string; query: Text; cost: string }

/** "THIS CHAT" QUERIES / COSTS rows, as drawn in cost 05 (6802:236050). Row 1 is "hi" in cost 04 (fix cost-query-hi). */
export const COST_QUERIES: CostQuery[] = [
  { id: 'q1', query: COMMIT_QUESTION, cost: '$0.01703' },
  { id: 'q2', query: 'Which of my open deals lost momentum this week?', cost: '$0.00892' },
  { id: 'q3', query: 'Draft a Loom transcript summary — Meridian security review.', cost: '$0.00706' },
  { id: 'q4', query: 'Explain the Atlas Data Cloud presence on three customer calls.', cost: '$0.00622' },
  { id: 'q5', query: "Draft a follow-up to Meridian's security review.", cost: '$0.00612' },
  { id: 'q6', query: "Draft talking points for Friday's pipeline call.", cost: '$0.00524' },
  { id: 'q7', query: 'Compare Atlas vs. Vertex Data Cloud objections.', cost: '$0.00458' },
  { id: 'q8', query: "What's my open pipeline coverage for Q4?", cost: '$0.00456' },
  { id: 'q9', query: "Summarize last week's forecast call.", cost: '$0.00354' },
  { id: 'q10', query: 'Which reps are behind on quota by more than 10%?', cost: '$0.00278' },
]

/** One header pill + popover state. `amount` drives the ring (fraction of the $5 session limit, capped at 1). */
export type ChatCost = { amount: number; label: Text; state: BudgetState; queries: CostQuery[] }

const ONE_QUERY: CostQuery[] = [{ id: 'q1', query: d('hi', COMMIT_QUESTION, 'cost-query-hi'), cost: '$0.01703' }]

/**
 * The cost pill and popover for a chat at a beat, given the cost seeds. Amounts are the frames':
 * cost 01 $0.56, 02/03 $1.23 (orange / red: with fixes they take 05/06's $3.65 / $19.45, which agree with the
 * Q33 thresholds), 04 $1.23, 05 $3.65, 06 $19.45, 07-09 $19.12. Every other chat shows "$1.23" within budget.
 */
export function chatCost(chat: string, beat: string, seeds: { budget: BudgetState | null; queries10: boolean; monthlyOut: boolean }): ChatCost {
  if (chat !== 'cost') return { amount: 1.23, label: '$1.23', state: 'within', queries: ONE_QUERY }
  if (seeds.monthlyOut) return { amount: 19.12, label: '$19.12', state: 'over', queries: COST_QUERIES.slice(0, 2) }
  const answered = beat === 'answer'
  const queries = seeds.queries10 ? COST_QUERIES : ONE_QUERY
  switch (seeds.budget ?? 'within') {
    case 'approaching':
      return answered
        ? { amount: 3.65, label: '$3.65', state: 'approaching', queries }
        : { amount: 3.65, label: d('$1.23', '$3.65', 'cost-ring-amounts'), state: 'approaching', queries }
    case 'over':
      return answered
        ? { amount: 19.45, label: '$19.45', state: 'over', queries }
        : { amount: 19.45, label: d('$1.23', '$19.45', 'cost-ring-amounts'), state: 'over', queries }
    default:
      return answered
        ? { amount: 1.23, label: '$1.23', state: 'within', queries }
        : { amount: 0.56, label: '$0.56', state: 'within', queries }
  }
}

/** Popover footer when the workspace is out of usage (cost 07, 6802:236106). */
export const MONTHLY_OUT = {
  title: 'Out of usage this month',
  amount: d('$259 of @259', '$250 of $250', 'cost-monthly-amount'),
  resume: 'Resume on 1 October',
  cta: 'Request more',
}

/** "Ask for more Usage" modal (cost 08, 6802:236145). */
export const USAGE_REQUEST = {
  title: 'Ask for more Usage',
  subtitle: 'You have used $250 of $250 this month.',
  amountLabel: 'How much more',
  amount: '100',
  reasonLabel: 'Why',
  reasonPlaceholder: 'Give reason',
  note: d('Goes to your workapce admin', 'Goes to your workspace admin', 'typo-workspace'),
  cancel: 'Cancel',
  send: 'Send',
}

/** Pending card above the composer (cost 09, 6802:236125). */
export const USAGE_PENDING = {
  title: 'Request pending approval',
  body: '$100 of additional usage requested. your limit resets on October 1.',
  status: 'Requested',
}
