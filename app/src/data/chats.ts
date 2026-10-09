// Mock chats for the project dashboard table, in the Figma file's row order. Titles, costs and the ages as drawn ("3h ago",
// "1h ago") are the file's; the minutes behind the ages, the team members and their names are the prototype's
// placeholders (UX pass, 2026-10-08), so the "chats-newest-first" fix can sort by them and "team-real-overflow" can count.

/** Avatar Size=xs, Colour=Brand Solid fills read from the file. Each maps to an .av--<colour> class in chat-table.css. */
export type AvatarColour = 'brand' | 'terracotta' | 'blue' | 'plum' | 'error'

export type Member = { initial: string; name: string; colour: AvatarColour }

export type Chat = {
  id: string
  title: string
  /** Minutes since the last message. */
  minutesAgo: number
  /** Cost of the chat so far, as drawn. */
  cost: string
  team: Member[]
  /**
   * The avatar group as the frame draws it ("As designed"): the first `faces` members, then the file's fixed "+5"
   * badge (`more`). Rows the file draws with no team leave this out. See the "team-real-overflow" fix.
   */
  drawn?: { faces: number; more: number }
}

const m = (initial: string, name: string, colour: AvatarColour): Member => ({ initial, name, colour })

const CHATS: Chat[] = [
  { id: 'c1', title: 'Budget Allocation', minutesAgo: 180, cost: '$0.70', team: [m('O', 'Olivia Park', 'brand'), m('T', 'Tomás Reyes', 'terracotta'), m('R', 'Riya Shah', 'blue'), m('E', 'Emma Clarke', 'plum'), m('J', 'Jonah Lee', 'brand'), m('M', 'Maya Chen', 'blue')], drawn: { faces: 4, more: 5 } },
  { id: 'c2', title: 'Can we meet tomorrow?', minutesAgo: 60, cost: '$0.70', team: [m('T', 'Tara Nolan', 'error'), m('R', 'Riya Shah', 'blue'), m('E', 'Emma Clarke', 'plum'), m('S', 'Sam Ortiz', 'brand')], drawn: { faces: 3, more: 5 } },
  { id: 'c3', title: 'Sent the final draft', minutesAgo: 185, cost: '$0.70', team: [m('O', 'Olivia Park', 'brand'), m('K', 'Kiran Rao', 'plum')], drawn: { faces: 2, more: 5 } },
  { id: 'c4', title: 'Lunch was really fun', minutesAgo: 190, cost: '$0.70', team: [m('T', 'Tara Nolan', 'error'), m('E', 'Emma Clarke', 'plum')], drawn: { faces: 2, more: 5 } },
  { id: 'c5', title: 'I’ll call you later', minutesAgo: 195, cost: '$0.70', team: [] },
  { id: 'c6', title: 'Did you see this?', minutesAgo: 200, cost: '$0.70', team: [] },
  { id: 'c7', title: 'Almost there, five minutes', minutesAgo: 205, cost: '$0.70', team: [] },
  { id: 'c8', title: 'Thanks for checking in', minutesAgo: 210, cost: '$0.70', team: [] },
]

/** The chats in the file's row order ("As designed"). */
export function chatsAsDrawn(): Chat[] {
  return [...CHATS]
}

/** Chats sorted "Newest" first, the toolbar's default sort (the "chats-newest-first" fix). */
export function chatsNewestFirst(): Chat[] {
  return [...CHATS].sort((a, b) => a.minutesAgo - b.minutesAgo)
}

/** "45m ago", "3h ago". */
export const relativeAge = (minutes: number) => (minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`)
