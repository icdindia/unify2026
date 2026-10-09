import { PROJECT_CARDS } from '../data/projects'
import { d, type Drift, type Text } from './drift'

// Rail lists (nav-behaviour, pinned-chevron, drag-pinned, drag-unpin, pinning). Read from 11614:672894,
// 11614:677973, 11693:260033, 11715:627268, 11671:662888, 11671:670376 and the Routines landing 11657:493696.
// Status meaning per Q17: unread = white dot, progress = spinner ring, failed = red ring, waiting = grey ring.

export type RailStatus = 'unread' | 'progress' | 'failed' | 'waiting'

export type RailChat = { id: string; title: string; status?: RailStatus; time?: string }

export type PinId = 'artifacts' | 'project' | 'plan-launch' | 'review-feedback'

export type PinnedItem =
  | { id: 'artifacts'; kind: 'artifacts'; label: string }
  | { id: 'project'; kind: 'project'; label: Text; chats: RailChat[] }
  | { id: 'plan-launch' | 'review-feedback'; kind: 'chat' | 'routine'; label: string; status?: RailStatus; home: 'routines' | 'chats' }

/** Chats inside the pinned project. 11693:260033 draws "Excel Formula Help From Main Document" ten times; the
 *  chevron and View All frames (11661:514386, 11715:627268) name them "Chat N inside this Project", used here. */
export const PROJECT_CHATS: RailChat[] = [
  { id: 'excel-formula', title: 'Excel Formula Help From Main Document', status: 'unread' },
  { id: 'chat-2', title: 'Chat 2 inside this Project', status: 'progress' },
  { id: 'chat-3', title: 'Chat 3 inside this Project', status: 'failed' },
  ...Array.from({ length: 9 }, (_, i): RailChat => ({ id: `chat-${i + 4}`, title: `Chat ${i + 4} inside this Project` })),
]

/** Chats a pinned project shows before "View All" (nav-behaviour 05). */
export const PROJECT_CHAT_CAP = 10

/** Pinned group in drawn order (11614:672894). seed pins-over10 gives the project all 12 chats; the default shows 2. */
export function pinnedItems(over10: boolean): PinnedItem[] {
  return [
    { id: 'artifacts', kind: 'artifacts', label: 'Artifacts' },
    // "Projects" in nav 01-03, "Project Name" from nav 04 on
    { id: 'project', kind: 'project', label: d('Projects', 'Project Name', 'pinned-project-label'), chats: over10 ? PROJECT_CHATS : PROJECT_CHATS.slice(0, 2) },
    // drag-unpin 02: unpinning it returns it to Routines, its home group
    { id: 'plan-launch', kind: 'routine', label: 'Plan launch timeline', status: 'unread', home: 'routines' },
    { id: 'review-feedback', kind: 'chat', label: 'Review customer feedback', status: 'failed', home: 'chats' },
  ]
}

/** Routines group (11614:672894). Titles keep the file's trailing and double spaces. */
export const RAIL_ROUTINES: RailChat[] = [
  { id: 'granola-notes', title: 'Get all granola notes summarized and del ', status: 'waiting' },
  { id: 'excel-formula-routine', title: 'Excel Formula Help From Main Document', status: 'progress' },
  { id: 'standup-follow-up', title: 'Design Stand up follow-up  meeting', status: 'progress' },
]

/** Chats group (11614:672894; Q11: titled "Chats", also in the light rail). */
export const RAIL_CHATS: RailChat[] = [
  { id: 'sheet-formula', title: 'Sheet Formula Consultant', status: 'unread' },
  { id: 'workbook-support', title: 'Workbook Support Hub' },
  { id: 'morning-digest', title: 'Morning Digest', time: '2h' },
  { id: 'spreadsheet-advisor', title: 'Spreadsheet Formula Advisor' },
]

/** Routines landing table (pinning 03, 11657:493696). `inProject` is the folder glyph next to the name. */
export const ROUTINES_TABLE = [
  { id: 'morning-brief', name: 'Morning brief', trigger: 'Every weekday, 6:30 AM', cost: '$0.70', status: 'Active', pinned: true, inProject: true },
  { id: 'what-i-owe', name: 'What I owe people', trigger: 'Every weekday, 7:30 AM', cost: '$0.70', status: 'Paused', pinned: true, inProject: false },
  { id: 'escalation-watch', name: 'Escalation watch', trigger: 'New email from a customer', cost: '$0.70', status: 'Paused', pinned: false, inProject: false },
  { id: 'friday-pipeline', name: 'Friday pipeline movement', trigger: 'Every weekday, 6:30 AM', cost: '$0.70', status: 'Active', pinned: false, inProject: true },
  { id: 'deal-desk-check', name: 'Deal desk check', trigger: 'Deal moves to proposal', cost: '$0.70', status: 'Paused', pinned: false, inProject: false },
  { id: 'board-pre-read', name: 'Board pre-read assembly', trigger: 'Monday before a board meeting', cost: '$0.70', status: 'Active', pinned: true, inProject: false },
  { id: 'daily-risk-register', name: 'Daily risk register', trigger: 'Every weekday, 6:00 PM', cost: '$0.70', status: 'Paused', pinned: false, inProject: false },
] as const

/** Project list in "Add to Project" (chat title menu 9256:466688) and "Switch Project" (11614:677973). Figma fills it
 *  with menu placeholders; with fixes it lists real projects. The first row is the current project (checked in 04). */
export const PROJECT_PICKER: Drift<string[]> = d(
  ['Project Name', 'Settings', 'Keyboard shortcuts', 'Keyboard shortcuts', 'Keyboard shortcuts', 'Company profile'],
  ['Client Onboarding', ...PROJECT_CARDS.slice(0, 5).map(p => p.name)],
  'project-picker-names',
)
