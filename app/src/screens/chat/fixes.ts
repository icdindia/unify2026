import { useFixIn, type Fix } from '../../fixes/types'

// The chat screens' own departures from the chat-artifact frames (the components carry theirs). "As designed" draws each
// frame as it is (screens/chat/drawn.ts holds what a frame draws that the coherent chat would not); "With fixes" draws
// the one coherent chat these entries describe. Gathered into the FIXES ledger by src/fixes/fixes.ts (FIX_SOURCES).
export const CHAT_SCREEN_FIXES: Fix[] = [
  {
    id: 'chat-scroll-to-latest',
    title: 'The thread keeps the latest message in view',
    figmaNodeIds: ['1731:341539', '3273:190223', '1768:356654', '1809:363799', '5975:413714', '14607:403125'],
    route: '/chat/commit?at=matt-replied&rail=c',
    before: 'Each frame shows the thread at its own scroll position: 13 is scrolled 122px, 14 584px, 15-18 put the Pipeline Command answer at different heights, and 15 leaves 170px empty above the composer.',
    after: 'The thread scrolls to the newest message whenever one arrives (and when a beat is opened from a URL), and stays put while the reader scrolls back.',
    why: 'A chat follows its conversation; the frame offsets are where each screenshot happened to be taken.',
    status: 'proposed',
  },
  {
    id: 'thinking-row-under-menu',
    title: 'The Assistant keeps thinking while the title menu is open',
    figmaNodeIds: ['9256:466688'],
    route: '/chat/commit?at=sent&menu=title>add-to-project&rail=c',
    before: 'chat-artifact 03 hides the "Thinking..." row (Agent COT / Type=Step 1 is in the layer tree, invisible) while the composer still shows Stop.',
    after: 'The thinking row stays under the question while the menu is open, as it does in every other frame of the run (thinking 02).',
    why: 'Opening a menu should not make the running answer disappear.',
    status: 'proposed',
  },
  {
    id: 'files-badge-until-seen',
    title: 'The files count shows until the files are seen',
    figmaNodeIds: ['1809:363799', '1768:356654', '5975:413714'],
    route: '/chat/commit?at=artifact&rail=c',
    before: 'Only chat-artifact 16 draws the "2" on the files (clipboard) icon; 15 (the same moment) and 17 draw none.',
    after: 'The count appears with the answer that produced the files and goes once the files panel has been opened.',
    why: 'A new-files count that comes and goes between two frames of the same moment reads as a glitch.',
    status: 'proposed',
  },
  {
    id: 'comments-icon-only-with-comments',
    title: 'The comments icon shows only when the chat has comments',
    figmaNodeIds: ['1731:255712', '1731:338960', '1731:340363', '1731:341539', '3273:190223', '1768:356654'],
    route: '/chat/commit?at=joined&rail=c',
    before: 'chat-artifact 10-14 add a comments icon to the header the moment people join; it is gone again from 15 on.',
    after: 'BUILD-PLAN Q32: the icon shows only when the chat has comments (with a count), as in collab-chat 10. The commit chat has none, so it is not drawn.',
    why: 'An icon that appears and disappears without anything changing suggests something happened.',
    status: 'proposed',
  },
  {
    id: 'answer-head-gap',
    title: 'Every answer sits 4 under its thought line',
    figmaNodeIds: ['1809:363799', '5975:413714', '14607:403125', '1809:501331', '1768:356654'],
    route: '/chat/commit?at=artifact&panel=files&rail=c',
    before: 'chat-artifact 16-18 draw the Pipeline Command answer 8px under its "Searched internal knowledge" line (a detached "Agent Response" frame); 08, 13-15 draw the Response_Desktop full component, 4px under it.',
    after: 'The component\'s 4px under the line in every frame.',
    why: 'One answer, one component: the answer should not move 4px between two frames of the same moment.',
    status: 'proposed',
  },
  {
    id: 'card-hover-follows-pointer',
    title: 'The inline card is hovered only under the pointer',
    figmaNodeIds: ['5975:413714', '14607:403125'],
    route: '/chat/commit?at=artifact&panel=files&rail=c',
    before: 'chat-artifact 17 and 18 keep the Pipeline Command card in its hover look (grey fill, bordered Download, a hand cursor drawn on it) while the pointer is on the files button or the files panel.',
    after: 'The card shows its hover look only while the pointer is over it (16), as every other control does.',
    why: 'Two hovered places at once is a leftover of the frame copied from 16.',
    status: 'proposed',
  },
  {
    id: 'split-chat-width-max',
    title: 'The chat column of the split stays within 360-650',
    figmaNodeIds: ['13722:383349'],
    route: '/chat/commit/pipeline-command?at=artifact&panel=files&cw=650&rail=c',
    before: 'chat-artifact 19 draws the chat column 670 wide (the artifact card from x 734), and the dashboard image 4px lower in the panel than 20 does.',
    after: 'BUILD-PLAN Q8: the column is 440 by default and resizable from 360 to 650; 19 is drawn at the 650 maximum.',
    why: 'The accepted resize range ends at 650; 670 leaves the artifact less room than any other split frame.',
    status: 'proposed',
  },
  {
    id: 'rail-selection-follows-page',
    title: 'The rail keeps New Session selected while an artifact is open in the chat',
    figmaNodeIds: ['1795:359260', '6405:306202', '6405:308388', '1809:484624'],
    route: '/chat/commit/pipeline-command?at=artifact&menu=version&rail=c',
    before: 'chat-artifact 21-22 highlight the rail\'s Artifacts item (and drop New Session\'s), while 19 and 20 show the same artifact with New Session highlighted.',
    after: 'BUILD-PLAN Q21: the selection follows the page. The artifact is open inside the chat, so New Session stays selected.',
    why: 'Opening the version menu or going full screen does not take the user to the Artifacts page.',
    status: 'proposed',
  },
  {
    id: 'split-header-one-variant',
    title: 'The chat header of the split keeps one look',
    figmaNodeIds: ['1795:359260', '6405:306202', '6405:308388', '1809:488480'],
    route: '/chat/commit/pipeline-command?at=artifact&menu=version&rail=c',
    before: 'chat-artifact 21-21b draw the split column\'s header as ES Breadcrumb / Variant=with Icon: no chevron after the title, a lock on Share although three people have joined, the actions 0 apart. 19 and 20 draw Variant=Default (chevron, people icon, 2 apart).',
    after: 'Variant=Default in every split frame: the chevron shows the title opens the chat menu, and Share shows the people icon once the chat is shared.',
    why: 'Opening the version menu or hovering the artifact name changes nothing in the chat column; the header should not change either.',
    status: 'proposed',
  },
  {
    id: 'split-thread-as-chat',
    title: 'The chat column beside an artifact shows the same thread',
    figmaNodeIds: ['13722:383349', '1809:488480', '1795:359260', '6405:306202', '6405:308388'],
    route: '/chat/commit/pipeline-command?at=artifact&rail=c',
    before: 'The split frames (19-21b) end the chat column with the first question ("We are two-thirds through the quarter…") as a new own message after Grace; 21-21b set John\'s and Grace\'s bubbles in Text sm and sit the composer 10px above the bottom edge (16 in 19 and 20).',
    after: 'The column shows the chat as it is (Grace\'s message is the latest), in the column\'s own Text md bubbles, with the composer 16px above the bottom edge.',
    why: 'Opening the artifact does not post a message; the repeated question is a leftover layer.',
    status: 'proposed',
  },
]

export type ChatScreenFixId =
  | 'chat-scroll-to-latest' | 'thinking-row-under-menu' | 'files-badge-until-seen' | 'comments-icon-only-with-comments'
  | 'split-thread-as-chat' | 'answer-head-gap' | 'split-chat-width-max' | 'split-header-one-variant' | 'rail-selection-follows-page'
  | 'card-hover-follows-pointer'

export function useChatScreenFix(id: ChatScreenFixId): boolean {
  return useFixIn(CHAT_SCREEN_FIXES, id, 'CHAT_SCREEN_FIXES in screens/chat/fixes.ts')
}
