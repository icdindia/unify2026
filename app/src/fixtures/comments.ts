import { d, type Drift, type Text } from './drift'
import { selfOn, type PersonId, type Surface } from './people'

// Comments (commenters journey, built per Q4 default; the row is drawn at 30% opacity). Copy read from
// 8279:195355, 8279:209548, members menu 8279:213062, reply flow 10767:620480-620486 and 8085:469620.
// Every comment in the file repeats one placeholder; fix comments-distinct-copy gives each its own text.

export type Comment = {
  id: string
  author: PersonId | Drift<PersonId>
  ago: string
  text: Text
}

export type CommentThread = {
  id: string
  root: Comment
  replies: Comment[]
  /** "● 1 reply" with the unread dot (c02) vs read (c03). */
  unread: boolean
  /** Count shown when the replies themselves are not drawn ("3 replies" in 8085:469620). */
  replyCount?: number
}

export type CommentSet = {
  /** "3 Members" chip. */
  members: number
  threads: CommentThread[]
  /** Text in the comment field, as drawn ("@annie please make this…"). */
  draft: Text
}

/** "COMMENTERS" members menu (8279:213062). The first row is the signed-in owner. */
export function commentersMenu(): { person: PersonId | Drift<PersonId>; role?: 'Owner' }[] {
  return [
    { person: selfOn('commenters-menu'), role: 'Owner' },
    { person: 'anirudha-roy' },
    { person: 'saumya-pandey' },
    { person: 'gaurav-singh' },
    { person: 'nitasha-gandhi' },
  ]
}

const PLACEHOLDER = 'Hello,  I am unable to view members of the project I am a part of. I need to check if viewing rights have been granted a member from another team, but I can’t locate the settings for this.'
const say = (fixed: string): Text => d(PLACEHOLDER, fixed, 'comments-distinct-copy')

export const COMMENT_DRAFT = '@annie please make this a little more vibrant. A little more brand colour will add the zing its lacking now.'
/** The reply being typed in c07 (10767:620484). */
export const REPLY_DRAFT = 'Please make this a little more vibrant. A little more brand colour will add the zing its lacking now.'

function chatThreads(surface: Surface, replies: Comment[], unread: boolean): CommentThread[] {
  const me = selfOn(surface)
  return [
    {
      id: 'thread-1',
      root: { id: 'c1', author: me, ago: '1d ago', text: say('Can the at-risk table show days idle next to each deal? That is the number the board will ask about.') },
      replies,
      unread,
    },
    { id: 'thread-2', root: { id: 'c2', author: 'anirudha-roy', ago: '3d ago', text: say('The funnel colours read as status. Could the stages use one hue in steps instead?') }, replies: [], unread: false },
    { id: 'thread-3', root: { id: 'c3', author: 'saumya-pandey', ago: '4d ago', text: say('Northwind shows twice in the deal list, once under Proposal and once under Negotiation.') }, replies: [], unread: false },
  ]
}

const ONE_REPLY: Comment[] = [
  { id: 'r1', author: selfOn('comments'), ago: '1d ago', text: say('Added days idle as a column in v3. It sorts too.') },
]

/** comments-* seeds of the commit chat. */
export const CHAT_COMMENTS = {
  // collab-chat 10: the header badge reads 2; the panel is not opened in that frame
  'comments-2': { members: 3, threads: chatThreads('comments', ONE_REPLY, true).slice(0, 2), draft: COMMENT_DRAFT },
  // commenters 01-03, c02 (thread 1 has an unread reply)
  'comments-3': { members: 3, threads: chatThreads('comments', ONE_REPLY, true), draft: COMMENT_DRAFT },
  // commenters 04: the chip reads "5 Members" (the members menu lists five)
  'comments-5': { members: 5, threads: chatThreads('comments', ONE_REPLY, true), draft: COMMENT_DRAFT },
  // c08: two replies, "4 Members"
  'comments-4-replied': {
    members: 4,
    threads: chatThreads('comments', [
      { id: 'r1', author: 'anirudha-roy', ago: '1d ago', text: say('Agreed, and it should sort by it by default.') },
      { id: 'r2', author: 'ayush-chandra', ago: '1d ago', text: say('Days idle is already on the deal record, so this is a column, not a new query.') },
    ], false),
    draft: COMMENT_DRAFT,
  },
  // c09: short replies
  'comments-4-short': {
    members: 4,
    threads: chatThreads('comments', [
      { id: 'r1', author: 'anirudha-roy', ago: '1d ago', text: 'remove this' },
      { id: 'r2', author: 'ayush-chandra', ago: '1d ago', text: 'change image here' },
    ], false),
    draft: COMMENT_DRAFT,
  },
  // commenters 07: empty state
  'comments-none': { members: 3, threads: [], draft: '' },
} satisfies Record<string, CommentSet>

export type CommentSetId = keyof typeof CHAT_COMMENTS

/** The standalone artifact page's comments (commenters 10, 8085:469620, seed comments-3 on /view/acme-app). */
export const ARTIFACT_COMMENTS: CommentSet = {
  members: 3,
  threads: [
    { id: 'a-thread-1', root: { id: 'a1', author: selfOn('comments-standalone'), ago: '1d ago', text: say('The renewal tile should say which quarter it is for.') }, replies: [], unread: false },
    {
      id: 'a-thread-2',
      root: { id: 'a2', author: 'lana-steiner', ago: '2h ago', text: 'Hello, please resolve this pending status. Also check the template in other languages, especially Telugu as they also tend to spill.' },
      replies: [],
      unread: true,
      replyCount: 3,
    },
    { id: 'a-thread-3', root: { id: 'a3', author: 'anurag-mehta', ago: 'Now', text: say('NPS reads 42 here and 47 in the board deck. Which one is current?') }, replies: [], unread: false },
  ],
  draft: '',
}

/** Empty state copy (commenters 07, 8279:220537). */
export const COMMENTS_EMPTY = {
  title: 'No comments yet',
  body: d('Yours and other commentators messages will appear here.', 'Yours and other commenters’ messages will appear here.', 'commenters-word'),
  placeholder: 'Add comments',
}
