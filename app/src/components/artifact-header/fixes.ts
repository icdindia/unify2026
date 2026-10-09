import { useFixIn, type Fix } from '../../fixes/types'

// The artifact panel's departures from Figma: the header (artifact-header), the split (split-view) and the canvas
// (artifact-canvas) share this one list. src/fixes/fixes.ts should gather it into the FIXES ledger (FIX_SOURCES, id
// 'artifact-panel'), so the review bar lists them; this file must not import fixes.ts (see fixes/types.ts).
// Every entry renders only with "With fixes" on (useArtifactFix).

const ROUTE = '/chat/commit/pipeline-command?at=artifact&rail=c'

export const ARTIFACT_PANEL_FIXES: Fix[] = [
  {
    id: 'artifact-header-one-icon-set',
    title: 'The artifact header keeps one set of tools',
    figmaNodeIds: ['1809:488480', '1795:359260', '6405:306202', '6405:308388', '1809:484624'],
    route: ROUTE,
    before:
      'The split draws preview / code + copy and a grey Markdown type icon (1809:488480); the same panel with the version ' +
      'menu open, the name hovered or renamed, or expanded (1795:359260, 6405:306202, 6405:308388, 1809:484624) draws copy + ' +
      'refresh and a blue Document icon instead, so the tools change as you hover or open a menu.',
    after:
      'Every state shows one set (Q7 default): preview / code (App and HTML artifacts only), copy, refresh, v3, Publish, ' +
      'comments, download, expand / collapse and close, with the artifact\'s own type icon.',
    why: 'Controls that come and go with unrelated state read as a bug and move the buttons under the pointer.',
    status: 'proposed',
  },
  {
    id: 'artifact-name-one-size',
    title: 'The artifact name keeps its size on hover and rename',
    figmaNodeIds: ['6405:306202', '6405:308388', '1795:359260'],
    route: ROUTE + '&hover=artifact-name',
    before:
      'At rest the name is Text sm/Medium 13/20 in text-primary (1795:359260). Hovered it drops to 12/16 in text-secondary ' +
      '(6405:306202) and the rename field is 12/16 (6405:308388), so the name shrinks by 6px as the pointer reaches it.',
    after: 'The name is 13/20 text-primary in every state; hover only adds the bg-tertiary fill, the rename field keeps 13px.',
    why: 'Text that resizes under the pointer jitters and makes the click target move.',
    status: 'proposed',
  },
  {
    id: 'version-menu-under-button',
    title: 'The version menu opens under its button',
    figmaNodeIds: ['1795:359260', '7416:161222'],
    route: ROUTE + '&menu=version',
    before: 'Version History (7416:161222) spans x 968-1248 while its "v3" button spans 1149-1190: the menu overhangs the button by 58px on the right.',
    after: 'The menu\'s right edge lines up with the button\'s right edge, 4px below it, as every other trigger-opened menu.',
    why: 'A menu that is not anchored to its trigger reads as belonging to something else (the close button above it).',
    status: 'proposed',
  },
  {
    id: 'version-viewing-banner',
    title: 'An older version says so',
    figmaNodeIds: ['1795:359260', '9200:349032'],
    route: ROUTE + '&menu=version',
    before: 'Nothing is drawn for picking "Yesterday" or "3 days ago" in the version list.',
    after:
      'The canvas shows that version and a slim bar above it reads "Viewing v2 · Yesterday • 14:14" with "Back to latest" (Q52 ' +
      'default); the header button reads "v2".',
    why: 'Without a cue an older version looks like the current one, and there is no way back but the menu.',
    status: 'proposed',
  },
  {
    id: 'artifact-canvas-reflow',
    title: 'The artifact reflows instead of shrinking',
    figmaNodeIds: ['1809:488589', '1809:488590', '13722:383349', '1809:488480', '1809:484624'],
    route: ROUTE,
    before:
      'The Acme dashboard is a flat image (1809:488590) scaled to the panel: 100% full screen (1809:484624), 79% in the 440 ' +
      'split (1809:488480) and 59% with the chat at 650 (13722:383349), where its labels are 7px.',
    after: 'The dashboard is real HTML at 100%: its rows wrap to the panel width (KPI cards 5 → 3 → 2 per row, side-by-side cards stack), text stays at its size.',
    why: 'WCAG 1.4.4 / 1.4.10: 7px text is unreadable, and a shrunken page cannot be zoomed back; a reflowing one can.',
    status: 'proposed',
  },
]

export type ArtifactPanelFixId =
  | 'artifact-header-one-icon-set' | 'artifact-name-one-size' | 'version-menu-under-button' | 'version-viewing-banner'
  | 'artifact-canvas-reflow'

/** True when an artifact panel fix renders: "With fixes" is on and the fix is not rejected. */
export function useArtifactFix(id: ArtifactPanelFixId): boolean {
  return useFixIn(ARTIFACT_PANEL_FIXES, id, 'ARTIFACT_PANEL_FIXES in components/artifact-header/fixes.ts')
}
