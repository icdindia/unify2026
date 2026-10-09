import { useFixIn, type Fix } from '../../fixes/types'

// The agent components' departures from Figma (the Assistant mark, the thinking row and the chain of thought).
// src/fixes/fixes.ts gathers this list into the FIXES ledger, so the review bar lists them; this file must not import
// fixes.ts (see fixes/types.ts).
export const AGENT_FIXES: Fix[] = [
  {
    id: 'cot-collapsed-chevron',
    title: 'The chain-of-thought chevron says whether the thoughts are open',
    figmaNodeIds: ['7534:286145', '7534:287594', '1713:246600', '1809:501331'],
    route: '/gallery/chain-of-thought?sheet=collapsed',
    before: 'While the turn still runs, the collapsed chain ("Thoughts" and the header line, input-large 21-22) draws chevron-down, the same chevron as the open chain above it; the finished chain (chat-artifact 08) draws chevron-right.',
    after: 'Chevron-right whenever the thoughts are hidden, chevron-down whenever they are shown, in every state.',
    why: 'A down chevron on a closed disclosure reads as "already open": the reader clicks it expecting it to close.',
    status: 'proposed',
  },
  {
    id: 'cot-no-thoughts-no-chevron',
    title: 'A chain with no thoughts has no chevron',
    figmaNodeIds: ['3273:190223', '1768:356654', '1809:363799'],
    route: '/gallery/chain-of-thought?sheet=collapsed',
    before: 'The Assistant\'s later turns (Matt\'s @Assistant, Grace\'s question) go "Thinking..." straight to the collapsed header line, which still draws a chevron although there are no thoughts behind it.',
    after: 'The header line is plain text, without the chevron, when the turn recorded no thoughts.',
    why: 'A chevron promises something to open; clicking it and getting nothing reads as broken.',
    status: 'proposed',
  },
  {
    id: 'cot-sources-variant-copy',
    title: 'Each thought keeps its own text in the "Text + source" chain',
    figmaNodeIds: ['4756:186919'],
    route: '/chat/commit?at=cot-7&cot=sources&rail=c',
    before: 'The "Text + source COT" variant (chat-artifact 07, a detached copy) repeats the first thought, "Reading the quarter — quota, commit and what is open" with its four sources, on all four rows.',
    after: 'Each row keeps its own thought ("Searching for account details", "Traced the gap…", "Executing"), with its own sources, or the first thought\'s sources while the script gives it none.',
    why: 'Four identical rows read as the agent looping on one step. Q26 keeps this variant for review only.',
    status: 'proposed',
  },
]

/** True when the agent fix should render: "With fixes" is on and the fix was not rejected (as useFix). */
export function useAgentFix(id: string): boolean {
  return useFixIn(AGENT_FIXES, id, 'AGENT_FIXES in components/agent/fixes.ts')
}
