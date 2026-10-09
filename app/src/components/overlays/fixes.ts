import { useFixIn, type Fix } from '../../fixes/types'

// The overlay primitives' departures from Figma. src/fixes/fixes.ts gathers this list into the FIXES ledger, so the
// review bar counts and lists them; this file must not import fixes.ts (see fixes/types.ts).
export const OVERLAY_FIXES: Fix[] = [
  {
    id: 'modal-radius-16',
    title: 'Every modal uses the Modal Unit radius (16)',
    figmaNodeIds: ['12057:581132', '1969:507322', '11933:738629', '6802:236147', '10112:408460'],
    route: '/gallery/modal',
    before: 'The modals are drawn with three corner radii: 10 (Delete Artifact), 12 (the Publish Artifact units) and 16 (the Modal Unit component used by Share, Ask for more Usage and Settings).',
    after: 'Every modal has the Modal Unit component radius, 16.',
    why: 'One modal shape across the product; the three radii come from three generations of the same component.',
    status: 'proposed',
  },
  {
    id: 'modal-scrim-black-25',
    title: 'One scrim colour behind every modal',
    figmaNodeIds: ['12057:581131', '10112:408460', '1819:316166', '6802:236145'],
    route: '/gallery/modal',
    before: 'Scrims are drawn as black at 25% (Share, Ask for more Usage), #32383E at 25% (Delete Artifact) and #32383E at 35% (Settings).',
    after: 'Black at 25% behind every modal.',
    why: 'The page behind a modal dims the same way whichever modal opens.',
    status: 'proposed',
  },
  {
    id: 'toast-feedback',
    title: 'Toasts confirm actions and offer Undo',
    figmaNodeIds: [],
    route: '/gallery/toast',
    before: 'No toast is drawn: after Delete, Remove access, Invite, Clone or Publish the screen just changes (or no next frame exists).',
    after: 'A dark toast at the bottom centre confirms the action; reversible actions carry Undo (Q35, Q37, Q44, Q57, Q59, Q60 defaults).',
    why: 'Destructive and remote actions need feedback and a way back; the plan answers these gaps with toasts.',
    status: 'proposed',
  },
]

export type OverlayFixId = 'modal-radius-16' | 'modal-scrim-black-25' | 'toast-feedback'

/** useFix for the overlay fixes: true when "With fixes" is on and the fix is not rejected. */
export function useOverlayFix(id: OverlayFixId): boolean {
  return useFixIn(OVERLAY_FIXES, id, 'OVERLAY_FIXES in components/overlays/fixes.ts')
}
