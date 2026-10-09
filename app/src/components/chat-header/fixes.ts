import { useFixIn, type Fix } from '../../fixes/types'

// The chat chrome's departures from Figma: ChatHeader, ChatTitleMenu and ShareModal (components/chat-header,
// components/chat-title-menu, components/share-modal). src/fixes/fixes.ts gathers this list into the FIXES ledger
// (FIX_SOURCES id 'chat-chrome'); this file must not import fixes.ts (see fixes/types.ts).
// Copy drift that already has a ledger entry (share-title-chat, share-owner-persona, name-john-whitaker,
// avatar-colour-per-person, project-picker-names) is resolved by the fixtures, not here.
export const CHAT_CHROME_FIXES: Fix[] = [
  {
    id: 'title-menu-archive-row',
    title: 'Archive is a regular menu row with the archive icon',
    figmaNodeIds: ['9256:466688', '6405:329854'],
    route: '/chat/commit?at=sent&menu=title>add-to-project&rail=c',
    before:
      'In the chat title menu, Archive is a Size=md row (36 tall, Text sm 13/20) with a placeholder circle for its icon, ' +
      'between Size=sm rows (32 tall, Text xs 12/16).',
    after: 'Archive is a Size=sm row like the others, with the archive icon the Projects menus use.',
    why: 'One row size per menu; the circle is a placeholder left in the instance.',
    status: 'proposed',
  },
  {
    id: 'title-hover-keeps-size',
    title: 'Hovering the chat title does not shrink it',
    figmaNodeIds: ['6077:427883', '6077:427818'],
    route: '/chat/commit?at=artifact&hover=title&rail=c',
    before: 'The hovered title (header-dropdowns c07) is set in Text xs 12px, where the title at rest is Text sm 13px, so the label shrinks by 16px under the pointer.',
    after: 'The hovered title keeps Text sm 13px; only the fill, the border and the text colour change.',
    why: 'A hover that resizes its label makes the control jump under the pointer.',
    status: 'proposed',
  },
  {
    id: 'header-cost-ring-state',
    title: 'The header cost ring follows the budget',
    figmaNodeIds: ['9256:466688', '1809:501331', '1731:255712', '1768:356654', '1809:363799', '6802:235991'],
    route: '/chat/commit?at=answer&rail=c',
    before:
      'Every chat-artifact frame draws "$1.23" with the orange, two-thirds "approaching" ring, while the cost journey draws ' +
      'amounts under $2 with the dark "within budget" arc (cost 01, 04).',
    after: 'The ring takes the budget state of the amount (Q33: within below $2, approaching from $2, over from $5).',
    why: 'The ring is the budget signal; an orange ring at $1.23 says the chat is close to its limit when it is not.',
    status: 'proposed',
  },
  {
    id: 'header-files-pressed',
    title: 'The files button looks the same whenever its panel is open',
    figmaNodeIds: ['5975:413714', '13722:383349'],
    route: '/chat/commit/pipeline-command?at=artifact&panel=files&cw=650&rail=c',
    before:
      'With the files panel open the clipboard button is bg-tertiary with a pigeon-blue icon in the full chat (17), and ' +
      'bg-tertiary with the usual grey icon in the split chat column (19).',
    after: 'Both use the step 17 look: bg-tertiary and the pigeon-blue icon.',
    why: 'The same open panel should read the same way in both layouts.',
    status: 'proposed',
  },
  {
    id: 'header-split-avatars',
    title: 'The split chat column keeps the collaborators',
    figmaNodeIds: ['13722:383349', '1809:488480', '1795:359260'],
    route: '/chat/commit/pipeline-command?at=artifact&rail=c',
    before: 'In the split view the chat column header drops the M J G avatar stack, although the chat is still shared.',
    after: 'The avatar stack stays (up to 3 faces + N in the narrow column), before the cost pill.',
    why: 'Who is in the chat does not change when an artifact opens; the stack is also the way to the access list.',
    status: 'proposed',
  },
  {
    id: 'access-popover-manage',
    title: 'People with access links to the share modal',
    figmaNodeIds: ['1768:356654', '1809:365546', '6077:427693'],
    route: '/chat/commit?at=artifact&pop=access&rail=c',
    before: 'The people-with-access popover is a read-only list with no way to change access.',
    after: 'A "Manage access" row under the list opens the share modal (Q41 default).',
    why: 'The list shows roles; the place to change them should be one click away.',
    status: 'proposed',
  },
]

export type ChatChromeFixId =
  | 'title-menu-archive-row' | 'title-hover-keeps-size' | 'header-cost-ring-state' | 'header-files-pressed' | 'header-split-avatars' | 'access-popover-manage'

/** useFix for the chat chrome fixes: true when "With fixes" is on and the fix is not rejected. */
export function useChatChromeFix(id: ChatChromeFixId): boolean {
  return useFixIn(CHAT_CHROME_FIXES, id, 'CHAT_CHROME_FIXES in components/chat-header/fixes.ts')
}
