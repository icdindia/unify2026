import { useFixIn, type Fix } from '../../fixes/types'

// Departures from Figma of the artifact surfaces of the chat (inline artifact card, files panel). The access popover's
// "Manage access" row is fix access-popover-manage in components/chat-header/fixes.ts (one popover, one fix).
// src/fixes/fixes.ts gathers this list into the FIXES ledger (integrator: add it to FIX_SOURCES); this file must not
// import fixes.ts (see fixes/types.ts).
export const ARTIFACT_CARD_FIXES: Fix[] = [
  {
    id: 'artifact-glyph-per-type',
    title: 'One mark per artifact type',
    figmaNodeIds: ['1768:356654', '1809:363799', '5975:413714', '13722:383349', '1809:488480'],
    route: '/chat/commit?at=artifact&rail=c',
    before: 'The same Pipeline Command card (Interactive HTML) is drawn with three marks: the purple tile (15), the wide purple window (16, 17, 18) and the blue document (19, 20).',
    after: 'The card always shows its type’s mark: the purple window for Interactive HTML.',
    why: 'The mark says what kind of artifact it is; changing it between frames reads as a different artifact.',
    status: 'proposed',
  },
  {
    id: 'inline-card-meta',
    title: 'The card’s meta line always gives size and version',
    figmaNodeIds: ['1768:356654', '1809:363799'],
    route: '/chat/commit?at=artifact&rail=c',
    before: 'Step 15 reads "Interactive HTML"; one step later (16) the same card reads "Interactive HTML • 123 KB • Version 1".',
    after: '"Interactive HTML • 123 KB • Version 1" from the moment the card appears.',
    why: 'Nothing happens to the artifact between the two frames; the meta line should not change under the cursor.',
    status: 'proposed',
  },
  {
    id: 'inline-card-hover-steady',
    title: 'Download stays put when the card is hovered',
    figmaNodeIds: ['1809:363799', '3211:70049'],
    route: '/chat/commit?at=artifact&hover=card:pipeline-command&rail=c',
    before: 'Hovering the card (16) draws its bordered Download 16px from the right edge; at rest (15) and on the 15a sheet it sits 12px from it, so the button jumps 4px left under the pointer.',
    after: 'Download keeps the card’s 12px right padding in every state; only its border appears.',
    why: 'A control that shifts as the pointer reaches it is harder to hit and reads as jitter.',
    status: 'proposed',
  },
  {
    id: 'files-list-all-files',
    title: 'The files list shows every file it counts',
    figmaNodeIds: ['5975:413714', '13722:383349'],
    route: '/chat/commit?at=artifact&panel=files&rail=c',
    before: 'The list view is headed "Files 8" but lists three files (Screenshot, Filename.PDF, Filename.CSV); the grid view (14607:403125) shows all eight.',
    after: 'The list shows all eight files, in the panel’s scroll.',
    why: 'A count that does not match the rows under it reads as missing files; list and grid are two views of one set.',
    status: 'proposed',
  },
]

export type ArtifactCardFixId =
  | 'artifact-glyph-per-type' | 'inline-card-meta' | 'inline-card-hover-steady' | 'files-list-all-files'

/** True when the fix should render: "With fixes" is on and the fix was not rejected (as useFix). */
export function useArtifactCardFix(id: ArtifactCardFixId): boolean {
  return useFixIn(ARTIFACT_CARD_FIXES, id, 'ARTIFACT_CARD_FIXES in components/inline-artifact-card/fixes.ts')
}
