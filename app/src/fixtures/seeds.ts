import { ARTIFACTS_ALL_TYPES, ARTIFACTS_CLONED, ARTIFACTS_GRID, type ArtifactId } from './artifacts'
import { CROWD, typingLine } from './chats'
import { ARTIFACT_COMMENTS, CHAT_COMMENTS, type CommentSet, type CommentSetId } from './comments'
import { chatCost, type BudgetState, type ChatCost } from './cost'
import { d, type Drift, type Text } from './drift'
import type { PersonId } from './people'
import { pinnedItems, type PinnedItem } from './pins'
import { QUEUE_ITEMS, type QueueItem } from './queue'
import {
  GENERAL_ACCESS, INVITES, INVITE_MESSAGE, SHARED_2, SHARE_TITLE, shareOwner,
  type GeneralAccess, type InviteChip, type ShareMember,
} from './share'

// Seed registry: the `seed=` flags of BUILD-PLAN 2.1 (comma list). A seed picks a data scenario; it never opens UI.
// parseSeeds() reads the flag list, scenarioOf() turns it into one typed Scenario, and the *For() helpers below
// hand each screen its data for that scenario.

export type SeedDef = {
  id: string
  /** Seeds in the same group replace each other (the last one in the list wins). */
  group?: string
  label: string
  /** Frames drawn with this seed. */
  frames: string[]
}

export const SEED_DEFS: SeedDef[] = [
  { id: 'no-chips', label: 'Landing composer without the Company / Research chips', frames: ['3612:167773', '11614:672894'] },
  { id: 'budget-within', group: 'budget', label: 'Cost ring within budget (below $2)', frames: ['6802:235991', '6802:236034'] },
  { id: 'budget-approaching', group: 'budget', label: 'Cost ring approaching the $5 limit', frames: ['6802:236005', '6802:236050'] },
  { id: 'budget-over', group: 'budget', label: 'Cost ring over the $5 limit', frames: ['6802:236019', '6802:236066'] },
  { id: 'queries-10', label: 'Ten queries in the cost popover', frames: ['6802:236050', '6802:236066'] },
  { id: 'monthly-out', label: 'Workspace out of monthly usage', frames: ['6802:236106', '6802:236145', '6802:236125'] },
  { id: 'usage-requested', label: 'More usage requested, pending approval', frames: ['6802:236125'] },
  { id: 'memory', group: 'memory', label: 'Memory update bar (md) and the cited answer', frames: ['9915:762550'] },
  { id: 'memory-sm', group: 'memory', label: 'Memory update bar, small (dimmed alternative, Q5)', frames: ['10112:411197'] },
  { id: 'own-consecutive', label: 'Two own messages in a row', frames: ['11633:344632'] },
  { id: 'typing-2', group: 'typing', label: 'John and Matt Rivera are typing', frames: ['7830:279836', '8222:494135'] },
  { id: 'typing-matt', group: 'typing', label: 'Matt Rivera is typing', frames: ['8222:482896', '8222:485711'] },
  { id: 'crowd', label: 'Many editors: 10 + 21 in the header, Matt and 12 others typing', frames: ['8222:490604'] },
  { id: 'replies-off', label: 'Assistant Replies switched off', frames: ['8202:477546'] },
  { id: 'comments-2', group: 'comments', label: 'Two comments (header badge)', frames: ['8222:494135'] },
  { id: 'comments-3', group: 'comments', label: 'Three comment threads', frames: ['8279:195355', '8085:469620'] },
  { id: 'comments-5', group: 'comments', label: 'Three threads, five members', frames: ['8279:209548'] },
  { id: 'comments-4-replied', group: 'comments', label: 'Thread 1 with two replies', frames: ['10767:620485'] },
  { id: 'comments-4-short', group: 'comments', label: 'Thread 1 with two short replies', frames: ['10767:620486'] },
  { id: 'comments-none', group: 'comments', label: 'No comments yet', frames: ['8279:220537'] },
  { id: 'comments-unread', label: 'Unread comments dot on the header icon', frames: ['8279:215077', '8451:366278'] },
  { id: 'thread-read', label: 'Thread 1 reply already read', frames: ['10767:620481'] },
  { id: 'queue-1', group: 'queue', label: 'One queued message', frames: ['8237:503500'] },
  { id: 'queue-2', group: 'queue', label: 'Two queued messages', frames: ['8237:505695'] },
  { id: 'queue-4', group: 'queue', label: 'Four queued messages', frames: ['8255:524125', '8451:366278'] },
  { id: 'queue-paused', label: 'Queue paused', frames: ['8255:514316'] },
  { id: 'queue-collapsed', label: 'Queue collapsed', frames: ['8255:519307'] },
  { id: 'shared-2', label: 'Shared with Candice Wu and Natali Craig', frames: ['1819:316164', '12025:773344'] },
  { id: 'access-workspace', group: 'access', label: 'General access: Everyone at UnifyApps', frames: ['1819:316290', '12025:779849'] },
  { id: 'access-link', group: 'access', label: 'General access: Anyone with the link', frames: ['1819:316373', '12025:781497'] },
  { id: 'invite-2', group: 'invite', label: 'Two invite chips', frames: ['1819:316471'] },
  { id: 'invite-5', group: 'invite', label: 'Five invite chips', frames: ['1819:316531'] },
  { id: 'notify', label: 'Notify people, with a message', frames: ['1819:316531'] },
  { id: 'artifact-deleted', label: 'The opened artifact was deleted', frames: ['6944:511592'] },
  { id: 'empty', group: 'artifacts', label: 'No artifacts yet', frames: ['3780:177209'] },
  { id: 'all-types', group: 'artifacts', label: 'Every artifact type', frames: ['8412:194488'] },
  { id: 'cloned', group: 'artifacts', label: 'The Q3 forecast was cloned', frames: ['13750:280936'] },
  { id: 'publish-picked', label: 'Publish: people picked for restricted access', frames: ['11905:590883', '11905:590614'] },
  { id: 'publish-restricted', label: 'Publish: restricted to the picked people', frames: ['11933:736147'] },
  { id: 'published', label: 'Already published (second time)', frames: ['11933:737092'] },
  { id: 'pins-over10', label: 'Pinned project with more than 10 chats', frames: ['11693:260033'] },
  { id: 'project-pinned', label: 'The open project is pinned', frames: ['11780:448662'] },
]

/** Parametric seeds: `unpinned:<pin id>` (drag-unpin 02) and `order:<ids joined by .>` (drag-pinned 03). */
export type SeedSet = { flags: Set<string>; unpinned: string[]; order: string[] | null; unknown: string[] }

const BY_ID = new Map(SEED_DEFS.map(s => [s.id, s]))

export function parseSeeds(raw: string | null | undefined): SeedSet {
  const set: SeedSet = { flags: new Set(), unpinned: [], order: null, unknown: [] }
  for (const part of (raw ?? '').split(',').map(s => s.trim()).filter(Boolean)) {
    if (part.startsWith('unpinned:')) { set.unpinned.push(part.slice(9)); continue }
    if (part.startsWith('order:')) { set.order = part.slice(6).split('.').filter(Boolean); continue }
    const def = BY_ID.get(part)
    if (!def) { set.unknown.push(part); continue }
    if (def.group) for (const f of [...set.flags]) if (BY_ID.get(f)?.group === def.group) set.flags.delete(f)
    set.flags.add(part)
  }
  return set
}

export type Scenario = {
  chips: boolean
  budget: BudgetState | null
  queries10: boolean
  monthlyOut: boolean
  usageRequested: boolean
  memoryBar: 'md' | 'sm' | null
  ownConsecutive: boolean
  typing: 'two' | 'matt' | 'crowd' | null
  crowd: boolean
  assistantReplies: boolean
  comments: CommentSetId | null
  commentsUnread: boolean
  threadRead: boolean
  queue: { size: 0 | 1 | 2 | 4; paused: boolean; collapsed: boolean }
  share: { shared2: boolean; access: GeneralAccess; invite: 0 | 2 | 5; notify: boolean }
  artifactDeleted: boolean
  artifacts: 'grid' | 'empty' | 'all-types' | 'cloned'
  publish: { picked: boolean; restricted: boolean; published: boolean }
  pins: { over10: boolean; projectPinned: boolean; unpinned: string[]; order: string[] | null }
}

export function scenarioOf(seeds: SeedSet | string | null | undefined): Scenario {
  const s = typeof seeds === 'string' || seeds == null ? parseSeeds(seeds) : seeds
  const has = (f: string) => s.flags.has(f)
  const inGroup = (g: string) => [...s.flags].find(f => BY_ID.get(f)?.group === g) ?? null
  const budget = inGroup('budget')
  const comments = inGroup('comments')
  const queue = inGroup('queue')
  const access = inGroup('access')
  const invite = inGroup('invite')
  const artifacts = inGroup('artifacts')
  const memory = inGroup('memory')
  return {
    chips: !has('no-chips'),
    budget: budget ? (budget.slice(7) as BudgetState) : null,
    queries10: has('queries-10'),
    monthlyOut: has('monthly-out'),
    usageRequested: has('usage-requested'),
    memoryBar: memory === 'memory' ? 'md' : memory === 'memory-sm' ? 'sm' : null,
    ownConsecutive: has('own-consecutive'),
    typing: has('crowd') ? 'crowd' : has('typing-2') ? 'two' : has('typing-matt') ? 'matt' : null,
    crowd: has('crowd'),
    assistantReplies: !has('replies-off'),
    comments: comments as CommentSetId | null,
    commentsUnread: has('comments-unread'),
    threadRead: has('thread-read'),
    queue: {
      size: queue ? (Number(queue.slice(6)) as 1 | 2 | 4) : 0,
      paused: has('queue-paused'),
      collapsed: has('queue-collapsed'),
    },
    share: {
      shared2: has('shared-2'),
      access: access === 'access-workspace' ? 'workspace' : access === 'access-link' ? 'link' : 'restricted',
      invite: invite ? (Number(invite.slice(7)) as 2 | 5) : 0,
      notify: has('notify'),
    },
    artifactDeleted: has('artifact-deleted'),
    artifacts: (artifacts ?? 'grid') as Scenario['artifacts'],
    publish: { picked: has('publish-picked'), restricted: has('publish-restricted'), published: has('published') },
    pins: { over10: has('pins-over10'), projectPinned: has('project-pinned'), unpinned: s.unpinned, order: s.order },
  }
}

// ---------------------------------------------------------------------------------------------- data per scenario

export type TypingSpec = { people: PersonId[]; more: number; line: Text }

/** Who the collaborative bar shows typing. Null scenario typing = nobody ("Type @ to mention a participant"). */
export function typingFor(sc: Scenario, beatTyping: PersonId[] = []): TypingSpec {
  if (sc.typing === 'crowd') return { people: CROWD.typing, more: CROWD.typingMore, line: typingLine([CROWD.typingLead], CROWD.typingOthers) }
  if (sc.typing === 'two') return { people: ['john-whitaker', 'matt-rivera'], more: 0, line: typingLine(['john-whitaker', 'matt-rivera']) }
  if (sc.typing === 'matt') return { people: ['matt-rivera'], more: 0, line: typingLine(['matt-rivera']) }
  return { people: beatTyping, more: 0, line: typingLine(beatTyping) }
}

/** Header avatar stack: the chat's participants, or the crowd (10 + "+21"). */
export function headerAvatarsFor(sc: Scenario, participants: PersonId[]): { people: PersonId[]; more: number } {
  return sc.crowd ? { people: CROWD.header, more: CROWD.headerMore } : { people: participants, more: 0 }
}

/** Comments for a target under the scenario: the commit chat's sets, or the standalone artifact page's. */
export function commentsFor(sc: Scenario, target: 'chat' | 'artifact'): CommentSet | null {
  if (!sc.comments) return null
  if (sc.comments === 'comments-none') return CHAT_COMMENTS['comments-none']
  const set = target === 'artifact' ? ARTIFACT_COMMENTS : CHAT_COMMENTS[sc.comments]
  if (!sc.threadRead) return set
  return { ...set, threads: set.threads.map(t => ({ ...t, unread: false })) }
}

export type QueueSpec = { items: QueueItem[]; paused: boolean; collapsed: boolean; count: number | Drift<number> }

/** The queue card. The collapsed bar draws "Queue 1" over two items (fix queue-count). */
export function queueFor(sc: Scenario): QueueSpec | null {
  if (!sc.queue.size) return null
  const items = QUEUE_ITEMS[sc.queue.size]
  const count = sc.queue.collapsed && items.length !== 1 ? d(1, items.length, 'queue-count') : items.length
  return { items, paused: sc.queue.paused, collapsed: sc.queue.collapsed, count }
}

export type ShareSpec = {
  title: Text
  members: ShareMember[]
  access: { id: GeneralAccess; label: string; description: Text }
  invites: InviteChip[]
  notify: boolean
  message: string
}

export function shareFor(sc: Scenario, target: 'chat' | 'artifact'): ShareSpec {
  const a = GENERAL_ACCESS[sc.share.access]
  return {
    title: SHARE_TITLE[target],
    members: [shareOwner(), ...(sc.share.shared2 ? SHARED_2 : [])],
    access: { id: sc.share.access, label: a.label, description: a.selectedDescription },
    invites: sc.share.invite ? INVITES[sc.share.invite] : [],
    notify: sc.share.notify,
    message: sc.share.notify ? INVITE_MESSAGE : '',
  }
}

/** Cards of the artifacts landing (before tab / type / sort filters). */
export function artifactsFor(sc: Scenario): ArtifactId[] | Drift<ArtifactId[]> {
  switch (sc.artifacts) {
    case 'empty': return []
    case 'all-types': return ARTIFACTS_ALL_TYPES
    case 'cloned': return ARTIFACTS_CLONED
    default: return ARTIFACTS_GRID
  }
}

/** The rail's Pinned group: unpinned items removed (they return to their home group), then `order:` applied. */
export function pinnedFor(sc: Scenario): PinnedItem[] {
  let items = pinnedItems(sc.pins.over10).filter(p => !sc.pins.unpinned.includes(p.id))
  const order = sc.pins.order
  if (order) {
    const rank = (id: string) => { const i = order.indexOf(id); return i < 0 ? order.length : i }
    items = [...items].sort((a, b) => rank(a.id) - rank(b.id))
  }
  return items
}

/** Cost pill and popover for a chat at a beat. */
export function costFor(sc: Scenario, chat: string, beat: string): ChatCost {
  return chatCost(chat, beat, { budget: sc.budget, queries10: sc.queries10, monthlyOut: sc.monthlyOut })
}
