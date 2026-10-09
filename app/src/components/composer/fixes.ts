import { useFixIn, type Fix } from '../../fixes/types'

// The composer's departures from Figma. src/fixes/fixes.ts gathers this list into the FIXES ledger, so the review bar
// lists them; this file must not import fixes.ts (see fixes/types.ts).
export const COMPOSER_FIXES: Fix[] = [
  {
    id: 'composer-skill-slash-colour',
    title: 'One colour for the skill token',
    figmaNodeIds: ['5220:203074', '5220:203368', '5220:203662', '5220:203956', '10247:277018'],
    route: '/gallery/composer?sheet=tokens',
    before: 'On the landing composer the "/" of a skill token is utility-blue-dark-600 and the skill name steel-blue-400; the bottom composers draw both in steel-blue-400.',
    after: 'The whole token, "/" included, is steel-blue-400 in every composer, like the "@" of a mention.',
    why: 'Two blues in one token read as two things, and blue-dark-600 is not in the DS colour tokens.',
    status: 'proposed',
  },
]

/** True when the composer fix should render: "With fixes" is on and the fix was not rejected (as useFix). */
export function useComposerFix(id: string): boolean {
  return useFixIn(COMPOSER_FIXES, id, 'COMPOSER_FIXES in components/composer/fixes.ts')
}
