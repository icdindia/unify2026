import { d, type Text } from './drift'
import { PEOPLE, type PersonId } from './people'
import { SCRIPTS, type ChatId } from './scripts'

// Chat-level fixtures that are not beats: header avatars, typing lines, the crowd.

export type ChatMeta = {
  id: ChatId
  title: Text
  owner: PersonId
  /** Files badge on the header clipboard icon ("2" in 1809:363799). */
  filesBadge?: number
}

export const CHATS: Record<ChatId, ChatMeta> = {
  commit: { id: 'commit', title: SCRIPTS.commit.title, owner: 'roger-bennett', filesBadge: 2 },
  'business-units': { id: 'business-units', title: SCRIPTS['business-units'].title, owner: 'roger-bennett' },
  cost: { id: 'cost', title: SCRIPTS.cost.title, owner: 'roger-bennett' },
  'new-artifact': { id: 'new-artifact', title: SCRIPTS['new-artifact'].title, owner: 'roger-bennett' },
  'new-routine': { id: 'new-routine', title: SCRIPTS['new-routine'].title, owner: 'roger-bennett' },
}

/** seed crowd (collab-chat 09, 8222:490604): ten header avatars + "+21", the bar's typing stack + "+5",
 *  and "Matt Rivera and 12 others are typing". Figma draws letters only (see people.ts placeholderName). */
export const CROWD = {
  header: ['matt-rivera', 'john-whitaker', 'grace-coleman', 'emma-clarke', 'quinn-adler', 'lana-steiner', 'demi-wilkinson', 'wes-morgan', 'candice-wu', 'zoe-hart'] as PersonId[],
  headerMore: 21,
  typing: ['john-whitaker', 'matt-rivera', 'riya-shah', 'emma-clarke', 'quinn-adler', 'lana-steiner', 'zoe-hart'] as PersonId[],
  typingMore: 5,
  typingLead: 'matt-rivera' as PersonId,
  typingOthers: 12,
}

/** The bar's typing stack in the split (queue-1 16, 8451:366278): O T R Z +5 with "John and Matt Rivera are typing". */
export const SPLIT_TYPING_STACK: PersonId[] = ['olivia-park', 'tomas-reyes', 'riya-shah', 'zoe-hart']

/**
 * The collaborative bar's line. One person: "Matt Rivera are typing" as drawn (fix typing-grammar); two:
 * "John and Matt Rivera are typing" (first name, then full name, as drawn); a crowd: "Matt Rivera and 12 others  are typing".
 */
export function typingLine(people: PersonId[], others = 0): Text {
  if (others > 0) {
    const lead = PEOPLE[people[0]].name
    return d(`${lead} and ${others} others  are typing`, `${lead} and ${others} others are typing`, 'typing-grammar')
  }
  if (people.length === 0) return ''
  if (people.length === 1) {
    const name = PEOPLE[people[0]].name
    return d(`${name} are typing`, `${name} is typing`, 'typing-grammar')
  }
  const [a, b] = people
  return `${PEOPLE[a].first} and ${PEOPLE[b].name} are typing`
}
