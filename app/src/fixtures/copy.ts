import { d } from './drift'
import { at } from './people'
import type { Answer, CotSpec, Inline, InlineRun, QuestionCard } from './script'

// Visible copy of the chat scripts, read from the Figma text layers (figma-console, 2026-10-08).
// Where frames disagree, the value is a Drift (frame copy vs the one coherent script, BUILD-PLAN Q2).

// ------------------------------------------------------------------------------------------------ chain of thought

/** Agent COT set 8863:218607, steps 3-7 (thought order as drawn in Step 7, 1713:249395). */
export const COT_COMMIT: CotSpec = {
  header: 'Searched internal knowledge · Reasoned over the results',
  thoughts: [
    {
      text: 'Reading the quarter — quota, commit and what is open',
      sources: {
        model: 'Vertex Sonnet • 2 results',
        rows: [
          { title: 'Open opportunities — Q3 26 (14)', meta: 'Opportunity' },
          { title: 'Quota and attainment by rep', meta: 'Forecast' },
          { title: 'FY26 reforecast — Aug.gsheet', meta: 'Finance · 25 Aug' },
          { title: 'Competitive log — Atlas.xlsx', meta: 'Deal desk' },
        ],
      },
    },
    // As drawn (input-large 17-18), "Traced the gap…" arrives at Step 4 and "Searching…" is inserted above it at Step 5;
    // with fix cot-thought-order each step appends the next thought in the Step 7 order.
    { text: 'Searching for account details', appearsAt: d(5, 4, 'cot-thought-order') },
    { text: 'Traced the gap to the deals that are not in commit.', appearsAt: d(4, 5, 'cot-thought-order') },
    { text: 'Executing' },
    { text: 'Done' },
  ],
  // the commit answer collapses to the header line (Agent COT / Type=Complete 2, 1809:501331)
  summary: 'Searched internal knowledge · Reasoned over the results',
}

/** Later turns: Figma draws only "Thinking..." and the collapsed line, no thoughts. */
export const COT_SHORT_COMMIT: CotSpec = { header: COT_COMMIT.header, thoughts: [], summary: COT_COMMIT.header }

/** Business units chat: "Thinking..." then "Thoughts ›" (Agent COT / Type=Complete 1, 1707:125400). */
export const COT_SHORT_THOUGHTS: CotSpec = { header: COT_COMMIT.header, thoughts: [], summary: 'Thoughts' }

/** Step 1 and Step 2 labels of the Agent COT set. */
export const COT_LABELS = { thinking: 'Thinking...', consulting: 'Consulting the knowledge repository...' } as const

// ------------------------------------------------------------------------------------------------ prompts

export const COMMIT_QUESTION = 'We are two-thirds through the quarter. How does commit actually look?'
export const BU_QUESTION = 'Which business units led in revenue, profit margin, and team size in Q2 2024?'
export const FY2023_PROMPT =
  'Show monthly revenue against gross margin for FY2023 - revenue in dollars and margin in percent. Data - Revenue ($M): Jan 42, Feb 45, Mar 48, Apr 51, May 55, Jun 58, Jul 61, Aug 64, Sep 66, Oct 70, Nov 74, Dec 81; Gross margin (%): Jan 58, Feb 59, Mar 59, Apr 61, May 62, Jun 62, Jul 63, Aug 64, Sep 64, Oct 66, Nov 67, Dec 68.'

// ------------------------------------------------------------------------------------------------ answers

const SUGGESTED = ['Do you want me write a mail?', 'Do you want me estimate audience?', 'Do you want me estimate audience?']

/** 1809:501331. The three bullets carry a SemiBold lead-in. */
export const COMMIT_ANSWER: Answer = {
  blocks: [
    { kind: 'p', inl: ['Commit is $8.4M against a $9.2M quota with a third of the quarter left — $0.8M short, and the shortfall is more specific than number suggests'] },
    {
      kind: 'ul',
      items: [
        [{ b: '$5.6M is already closed won.' }, ' That part is not in question.'],
        // 1809:501331 sets two spaces after the bold run of bullets 2 and 3 ('commit, ' + ' carried', 'at all,' + '  and')
        [{ b: '$2.8M is open and in commit,' }, d('  carried by four deals with security reviews or order forms in flight.', ' carried by four deals with security reviews or order forms in flight.', 'commit-answer-spacing')],
        [{ b: '$1.49M sits in six deals that are not forecast in commit at all,' }, d('  and four of those six have no next step logged.', ' and four of those six have no next step logged.', 'commit-answer-spacing')],
      ],
    },
    { kind: 'p', inl: ['That last line is the whole gap. It is not that the quarter is short of pipeline — coverage is 2.7x — it is that six deals stopped moving and nobody marked them. Two sit on accounts scoring below 60 health, one has been idle 34 days, and Atlas Data Cloud is present on three of them.'] },
    { kind: 'p', inl: ['My read: commit is optimistic rather than short. Before anyone forecasts against it, those six need a next step or a close-lost.'] },
  ],
  cost: '$0.19',
  sources: 8,
}

/** The same answer as new-memory 01 draws it (9915:762550): two source pills and the "thannumber" slip. Seed `memory`. */
export const COMMIT_ANSWER_CITED: Answer = {
  ...COMMIT_ANSWER,
  blocks: [
    { kind: 'p', inl: [d('Commit is $8.4M against a $9.2M quota with a third of the quarter left — $0.8M short, and the shortfall is more specific thannumber suggests', 'Commit is $8.4M against a $9.2M quota with a third of the quarter left — $0.8M short, and the shortfall is more specific than number suggests', 'typo-than-number')] },
    {
      kind: 'ul',
      items: [
        [{ b: '$5.6M is already closed won.' }, ' That part is not in question. ', { cite: { label: 'Reforecast', more: 2, source: 'drive' } }],
        [{ b: '$2.8M is open and in commit,' }, ' carried by four deals with security reviews or order forms in flight.'],
        [{ b: '$1.49M sits in six deals that are not forecast in commit at all,' }, ' and four of those six have no next step logged.'],
      ],
    },
    { kind: 'p', inl: ['That last line is the whole gap. It is not that the quarter is short of pipeline — coverage is 2.7x — it is that six deals stopped moving and nobody marked them. ', { cite: { label: 'Pipeline', source: 'salesforce' } }, ' Two sit on accounts scoring below 60 health, one has been idle 34 days, and Atlas Data Cloud is present on three of them.'] },
    COMMIT_ANSWER.blocks[3],
  ],
}

/** The Assistant's answer to Matt's @Assistant, with the inline artifact card (1768:356654). */
export const INTERACTIVE_ANSWER: Answer = {
  blocks: [
    { kind: 'p', inl: ['Interactive. Forecast against quota, the stage funnel, where the quarter moved, the rep leaderboard and the deals the graph flagged — all off one opportunity spine, so nothing in it can disagree with anything else.'] },
    { kind: 'p', inl: ['Matt’s six are in the at-risk table with what each is waiting on and how long it has been idle. Pick a stage and the funnel and the deal list move together.'] },
    { kind: 'artifact', artifact: 'pipeline-command' },
  ],
  cost: '$0.19',
  sources: 8,
}

/** Agent COT / Type=With Answer (8863:219498): the placeholder answer cost 04 draws under the commit question. */
export const CREATIVE_ANSWER: Answer = {
  blocks: [
    { kind: 'p', inl: ['Here are some creative ways to reward active community members, designed to foster engagement and appreciation. ', { cite: { label: 'Inline Citation', source: 'generic' } }] },
    { kind: 'p', inl: [{ b: 'Points and Badges:' }, ' Implement a system where members earn points for activities like commenting or sharing content. Achieving certain milestones can unlock badges, creating a sense of accomplishment and competition.'] },
    { kind: 'p', inl: [{ b: 'Virtual Co-Working or Retreats:' }, ' Invite members to a focused day or weekend of working together, even virtually, with fun breaks or challenges.'] },
  ],
  cost: '$0.19',
  sources: 8,
  suggested: SUGGESTED,
}

/** graphs 04 (1707:125400). As drawn the body describes a $100M portfolio; fix bu-bubble-chart describes the units. */
export const BU_ANSWER: Answer = {
  blocks: [
    { kind: 'headline', text: 'Cloud leads on revenue; Training & Consulting top margin' },
    { kind: 'subtitle', text: 'Revenue ($M) vs Profit Margin (%) · bubble size = Team Size · Q2 2024 · 6 business units' },
    {
      kind: 'kpis',
      tiles: [
        { label: 'Highest Revenue', value: '$12.4M', caption: 'Cloud' },
        { label: 'Highest Margin', value: '51%', caption: 'Training' },
        { label: 'Largest Team', value: '120', caption: 'Hardware' },
      ],
    },
    { kind: 'chart', chart: d('portfolio-sunburst', 'bu-bubble', 'bu-bubble-chart') },
    { kind: 'p', inl: ['Bubble area is proportional to team headcount. X-axis = Revenue ($M), Y-axis = Profit Margin (%). Larger bubble = bigger team. Source: Q2 2024 Business Unit Performance data.'] },
    {
      kind: 'p',
      inl: [d(
        'Equities anchor the $100M portfolio at roughly 59% of total assets, with US Large Cap alone accounting for $28M — well ahead of any other single holding. The sunburst above breaks the portfolio into its four asset classes (inner ring) and the eleven underlying holdings (outer ring):',
        'Cloud is the largest unit by revenue at $12.4M with a team of 85. Training earns the best margin at 51% on the smallest revenue, and Consulting follows at 47%. Hardware carries the largest team, 120 people, at the thinnest margin:',
        'bu-bubble-chart',
      )],
    },
    {
      kind: 'ul',
      items: d<Inline[][]>(
        [
          ['Equities — $59M total: US Large Cap $28M, Intl Developed $14M, US Small Cap $9M, Emerging Markets $8M'],
          ['Fixed Income — $25M total: Treasuries $12M, Corporate $8M, Municipals $5M'],
          ['Alternatives — $14M total: Real Estate $7M, Private Equity $5M, Commodities $2M'],
          ['Cash — $2M total: Money Market $2M'],
        ],
        [
          ['Cloud — $12.4M revenue, 34% margin, 85 staff'],
          ['Hardware — $9.8M revenue, 18% margin, 120 staff'],
          ['Support — $7.3M revenue, 29% margin, 95 staff'],
          ['Consulting — $6.1M revenue, 47% margin, 48 staff'],
          ['Partnerships — $3.2M revenue, 41% margin, 15 staff'],
          ['Training — $2.6M revenue, 51% margin, 22 staff'],
        ],
        'bu-bubble-chart',
      ),
    },
    {
      kind: 'p',
      inl: [d(
        'All eleven holdings sum to exactly $100M, confirming the portfolio is fully allocated with no residual cash drag beyond the $2M money market position. Equities and Fixed Income together make up 84% of the book, while Alternatives and Cash provide the remaining diversification and liquidity buffer.',
        'Margin falls as headcount rises: the two smallest teams run above 40% and the two largest below 30%. Revenue per head is highest in Partnerships and lowest in Support.',
        'bu-bubble-chart',
      )],
    },
  ],
  cost: '$0.19',
  sources: 8,
  suggested: SUGGESTED,
}

/** graphs 06 (1707:125957). As drawn the KPI row repeats the first answer's tiles (fix kpi-duplicate, Q29). */
export const FY2023_ANSWER: Answer = {
  blocks: [
    { kind: 'headline', text: 'Revenue and gross margin both climbed steadily through FY2023' },
    { kind: 'subtitle', text: 'Monthly Revenue ($M, bars) vs Gross Margin (%, line) · FY2023 · dual scale' },
    {
      kind: 'kpis',
      tiles: d(
        [
          { label: 'Highest Revenue', value: '$12.4M', caption: 'Cloud' },
          { label: 'Highest Margin', value: '51%', caption: 'Training', delta: '▲ → 68% Dec' },
          { label: 'Largest Team', value: '120', caption: 'Hardware' },
          { label: 'Highest Margin', value: '51%', caption: 'Training', delta: '▲ → 68% Dec' },
        ],
        // the FY2023 tiles exist as hidden layers in 10139:466731
        [
          { label: 'Jan Revenue', value: '$42M', caption: '', delta: '▲ → $81M Dec' },
          { label: 'FY Revenue', value: '$715M', caption: 'full-year sum' },
          { label: 'Jan Margin', value: '58%', caption: '', delta: '▲ → 68% Dec' },
          { label: 'Avg Margin', value: '63%', caption: 'FY2023 average' },
        ],
        'kpi-duplicate',
      ),
    },
    { kind: 'chart', chart: 'fy2023-combo' },
    { kind: 'p', inl: ['Revenue bars read on the left axis ($M). Gross margin line reads on the right axis (%). Axes are independently scaled — the visual crossover does not imply equivalence. FY2023 full-year revenue sum = $715M.'] },
    { kind: 'p', inl: [{ b: 'Key design choices & insights:' }] },
    {
      kind: 'ul',
      items: [
        ['Bars (left axis) = Revenue in $M — colour-coded in the primary series hue'],
        ['Line (right axis) = Gross Margin in % — independently scaled, colour-coded in the secondary hue; tick colours match their respective series so values can never be mis-assigned'],
        ['Revenue grew +93% from $42M → $81M, with the steepest acceleration in Q4 (Oct–Dec)'],
        ['Gross margin expanded +10 pp from 58% → 68%, a consistent upward trend with no reversals'],
        ['Both metrics move in lockstep — rising revenue is accompanied by improving margins, suggesting strong operating leverage throughout FY2023'],
        ['Full-year revenue = $715M with an average gross margin of ~63%'],
      ],
    },
  ],
  cost: '$0.19',
  sources: 8,
  suggested: SUGGESTED,
}

// ------------------------------------------------------------------------------------------------ the commit chat's people

/** chat-artifact 10 / collab-chat 01 (1731:255712). */
export const JOINED_LINE = 'Matt Rivera, John Whitaker and Grace Coleman joined the chat'

/** Roger's @Matt message. As drawn in chat-artifact 13-14 it is unrelated placeholder copy; collab-chat 06 (8222:482896)
 *  sends what chat-artifact 12 types, which is what Matt's reply answers. */
export const ROGER_TO_MATT: Inline[] = [
  at('matt-rivera'),
  d(' What are some creative ways to reward community members?', ' you own most of those six — which one is utmost priority', 'mention-sent-copy'),
]

/** Seed own-consecutive (consecutive 01, 11633:344632): a second own message right after the first. As drawn it
 *  mentions "@Roger", the viewer himself; with fixes it is a follow-up to Matt. */
export const ROGER_FOLLOW_UP: Inline[] = [
  d<InlineRun>(at('roger-bennett'), at('matt-rivera'), 'consecutive-own-copy'),
  d(' What are some creative ways to reward community members?', ' and if Northwind is the one to fight for, who owns the Sev-2?', 'consecutive-own-copy'),
]

/** Matt's two groups (3273:190223). */
export const MATT_REPLY_1: Inline[] = ['Two of those six I would write off today. Vertex has been chasing a new exec sponsor for three weeks and Atlas is already inside — I think that one is gone and nobody has marked it. Summit has been pushed twice and their champion left in July.']
export const MATT_REPLY_2: Inline[] = ['The other four are real. Northwind’s analytics add-on is the one I would fight for — $120k, and the only thing holding it is Maya going quiet while a Sev-2 has been open nine days. Clear the ticket and that deal moves this month.']
export const MATT_REPLY_3: Inline[] = ['Easier to show you than describe it.']
export const MATT_TO_ASSISTANT: Inline[] = [
  at('assistant'),
  ' give me an interactive view of the quarter — the gap against quota, and the deals carrying it with what each one is waiting on.',
]

/** John and Grace after the artifact (1768:356654 / 1809:363799). */
export const JOHN_COVERAGE: Inline[] = ['Coverage by rep is the number I would act on. Marcus at 1.9x with five slipping is a staffing problem, not a forecasting one.']
export const GRACE_ATLAS: Inline[] = [d(
  'Coverage by rep is the number I would act on. Marcus at 1.9x with five slipping is a staffing problem, not a forecasting one.',
  'Can it flag where Atlas is present? Three of the six is a pattern, and it should be on the board slide rather than in a table.',
  'grace-message-copy',
)]

/** chat-questions 01 (5873:530156). */
export const LANDING_QUESTION: QuestionCard = {
  id: 'where-to-land',
  question: 'Where should it land when it is done?',
  options: ['Email', 'All escalations, grouped by account', 'Email and Slack', 'In the app only'],
  freeText: 'Describe the shape you want',
}

// ------------------------------------------------------------------------------------------------ other chats

/** artifacts-landing 07 (3780:177321). */
export const NEW_ARTIFACT_PROMPT = 'Create a new artifact'
export const STARTERS_INTRO = d('Let me help you with creating a routine for daily tasks.', 'Let me help you with creating an artifact.', 'starter-copy')

/** publish-artifact 01 (1990:517731). */
export const ROUTINE_READY_LINE = 'How can I help you improve or alter this app?'
