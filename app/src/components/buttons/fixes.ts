import { useFixIn, type Fix } from '../../fixes/types'

// The buttons' departures from Figma (Button, and the avatar group's add button, which shares its focus treatment).
// src/fixes/fixes.ts gathers this list into the FIXES ledger, so the review bar lists them; this file must not import
// fixes.ts (see fixes/types.ts).
export const BUTTON_FIXES: Fix[] = [
  {
    id: 'button-focus-ring-3-to-1',
    title: 'Keyboard focus on a button draws a ring you can see',
    figmaNodeIds: [
      '11750:511718', '11750:511719', // Button Brand, State=Focused md / sm
      '11932:738160', '11932:738161', // Button Neutral Secondary, Focused md / sm
      '11932:738094', '11932:738066', // Button Neutral Tertiary, Focused md / sm
      '9918:392786', '9918:392746', // Button Error, Focused md / sm
      '8007:430927', '8007:430928', '8007:430929', // _Avatar add button, State=Focus xs / sm / md
    ],
    route: '/gallery/buttons',
    before:
      'The Focused variants draw only a pale halo against the white surface: 4px utility-gray-200 (#edebe8, 1.19:1) on Brand, ' +
      '4px utility-gray-300 (#e6e4e0, 1.27:1) on Neutral, 4px utility-error-100 (#f1d3d1, 1.40:1) on Error, and on the avatar ' +
      'add button 2px utility-gray-300 (#dbd6d1, 1.44:1), or 4px #98a2b3 at 14% at md.',
    after:
      'The halo stays, and a 2px brand-500 ring (#112d06, 15:1 on white) is drawn 2px out from the edge, so the halo shows ' +
      'as a 2px gap between the button and the ring. It is the ring every other control in the prototype draws.',
    why: 'WCAG 1.4.11 asks 3:1 for a focus indicator. At 1.2 to 1.4:1 a keyboard user cannot see which button has focus.',
    status: 'proposed',
  },
]

export type ButtonFixId = 'button-focus-ring-3-to-1'

/** useFix for the button fixes: true when "With fixes" is on and the fix is not rejected. */
export function useButtonFix(id: ButtonFixId): boolean {
  return useFixIn(BUTTON_FIXES, id, 'BUTTON_FIXES in components/buttons/fixes.ts')
}
