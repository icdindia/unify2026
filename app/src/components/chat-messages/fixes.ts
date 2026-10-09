import { useFixIn, type Fix } from '../../fixes/types'

// The chat messages' departures from Figma (user messages, system line, typing row, Assistant response, citation pill).
// src/fixes/fixes.ts gathers module lists into the FIXES ledger (FIX_SOURCES); this file must not import fixes.ts
// (see fixes/types.ts). Each fix renders only with "With fixes" on; "As designed" reproduces the frames.
export const CHAT_MESSAGE_FIXES: Fix[] = [
  {
    id: 'message-group-spacing',
    title: 'One rhythm for consecutive messages',
    figmaNodeIds: ['3273:190223', '1768:356654', '1809:363799', '11633:344632'],
    route: '/chat/commit?at=matt-replied&rail=c',
    before: 'Frames space one sender\'s bubbles differently: 8px apart in chat-artifact 14 (3273:190223), 48px in 16 (1809:363799); 15 (1768:356654) puts the first bubble 48px under the name row and 80px between John\'s and Grace\'s groups; 14 repeats Matt\'s name row before his third message although nobody wrote in between.',
    after: 'The "Consecutive msgs spacing" spec (11633:344632) everywhere: 32px between one sender\'s bubbles, 40px when the sender changes, the first bubble 24px under the name row top, and one name row for a run of one sender\'s messages.',
    why: 'The spec frame was drawn to settle exactly this (BUILD-PLAN Q31); the chat frames predate it.',
    status: 'proposed',
  },
  {
    id: 'mention-pill-option-1',
    title: 'Mentions in sent messages are the Option 1 pill',
    figmaNodeIds: ['11633:344632', '14839:266740', '1809:363799', '5975:413714', '14607:403125'],
    route: '/chat/commit?seed=own-consecutive&at=matt-replied&hover=msg:own&rail=c',
    before: 'The consecutive-messages frame draws "@Matt Rivera" and "@Roger" as bare steel-blue runs (Option 2, "without bg"); chat-artifact 16-18 draw Matt\'s "@Assitant" the same way.',
    after: 'Every mention in a sent message is the Option 1 pill: steel-blue-400 text on bg-primary, 4px side padding, radius 8 (chat-artifact 13-15).',
    why: 'Option 1 ("User/Assistant Tag in pill with bg", 3273:190223) was chosen; the spec frame still uses Option 2.',
    status: 'proposed',
  },
  {
    id: 'feedback-row-every-answer',
    title: 'Every finished answer has its feedback row',
    figmaNodeIds: ['1768:356654', '1809:363799'],
    route: '/chat/commit?at=artifact&rail=c',
    before: 'The Pipeline Command answer (chat-artifact 15, 16) ends at the artifact card: no cost, sources, copy or thumbs.',
    after: 'It ends with the Feedback Array like every other answer ($0.19, 8 Sources, share, like, copy, read aloud, branch, thumbs, more).',
    why: 'The answer cost and its sources should be reachable on every answer, the artifact answer included.',
    status: 'proposed',
  },
  {
    id: 'feedback-pressed-state',
    title: 'A chosen thumb stays marked',
    figmaNodeIds: ['10016:493615', '250:177368'],
    route: '/gallery/assistant-response',
    before: 'No pressed state is drawn for Like, Good response or Bad response: after a click the row looks unchanged.',
    after: 'The chosen button keeps the tertiary hover fill and a primary icon until it is clicked again (aria-pressed either way).',
    why: 'Feedback needs to show that it was recorded.',
    status: 'proposed',
  },
]

export type ChatMessageFixId = 'message-group-spacing' | 'mention-pill-option-1' | 'feedback-row-every-answer' | 'feedback-pressed-state'

/** True when the chat-message fix renders: "With fixes" is on and the fix is not rejected (as useFix). */
export function useChatMessageFix(id: ChatMessageFixId): boolean {
  return useFixIn(CHAT_MESSAGE_FIXES, id, 'CHAT_MESSAGE_FIXES in components/chat-messages/fixes.ts')
}
