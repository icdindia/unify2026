import { fixesMode, useStore } from '../app/store'
import { BUTTON_FIXES } from '../components/buttons/fixes'
import { COMPOSER_FIXES } from '../components/composer/fixes'
import { OVERLAY_FIXES } from '../components/overlays/fixes'
import { SCRIPT_FIXES } from '../fixtures/fixCandidates'
import { PROJECT_FIXES } from './projects'
import { CHAT_MESSAGE_FIXES } from '../components/chat-messages/fixes'
import { AGENT_FIXES } from '../components/agent/fixes'
import { ARTIFACT_CARD_FIXES } from '../components/inline-artifact-card/fixes'
import { ARTIFACT_PANEL_FIXES } from '../components/artifact-header/fixes'
import { CHAT_CHROME_FIXES } from '../components/chat-header/fixes'
import { CHAT_SCREEN_FIXES } from '../screens/chat/fixes'
import { fixRenders, type Fix } from './types'

export type { Fix, FixStatus } from './types'
export { fixRenders } from './types'

// Every departure from the Figma design is a named fix. The review bar flips the whole app between "As designed" and
// "With fixes"; approved fixes are copied into Figma on the "Prototype fixes" page. /gallery/fixes lists the ledger.
//
// FIXES is the one ledger. Fixes that belong to one module are written next to it and gathered here, so the module
// owns its list and the review bar still sees every fix:
//   PROJECT_FIXES   fixes/projects.ts: the Projects landing, the project dashboard and its menus, the sidebar status dots
//   OVERLAY_FIXES   components/overlays/fixes.ts (modal radius and scrim, toasts)
//   COMPOSER_FIXES  components/composer/fixes.ts
//   BUTTON_FIXES    components/buttons/fixes.ts (Button and the avatar add button: focus ring)
//   SCRIPT_FIXES    fixtures/fixCandidates.ts: copy drift between frames (BUILD-PLAN Q2) and persona (Q1)
//   CHAT_MESSAGE_FIXES, AGENT_FIXES, ARTIFACT_CARD_FIXES, ARTIFACT_PANEL_FIXES, CHAT_CHROME_FIXES: the chat components
//   CHAT_SCREEN_FIXES  screens/chat/fixes.ts: the chat screens (scroll, header state per frame, the split column)
// A module's own hook (useOverlayFix, useComposerFix, fixtures' fixApplies) and useFix answer the same way.

/** Where each fix is written, for the ledger page. */
export const FIX_SOURCES: { id: string; label: string; file: string; fixes: readonly Fix[] }[] = [
  { id: 'projects', label: 'Projects screens and sidebar', file: 'src/fixes/projects.ts', fixes: PROJECT_FIXES },
  { id: 'overlays', label: 'Overlays', file: 'src/components/overlays/fixes.ts', fixes: OVERLAY_FIXES },
  { id: 'composer', label: 'Composer', file: 'src/components/composer/fixes.ts', fixes: COMPOSER_FIXES },
  { id: 'buttons', label: 'Buttons', file: 'src/components/buttons/fixes.ts', fixes: BUTTON_FIXES },
  { id: 'script', label: 'Fixtures: one script, one persona', file: 'src/fixtures/fixCandidates.ts', fixes: SCRIPT_FIXES },
  { id: 'chat-messages', label: 'Chat messages', file: 'src/components/chat-messages/fixes.ts', fixes: CHAT_MESSAGE_FIXES },
  { id: 'agent', label: 'Agent: mark, thinking row, chain of thought', file: 'src/components/agent/fixes.ts', fixes: AGENT_FIXES },
  { id: 'artifact-cards', label: 'Inline artifact card, files panel, access popover', file: 'src/components/inline-artifact-card/fixes.ts', fixes: ARTIFACT_CARD_FIXES },
  { id: 'artifact-panel', label: 'Artifact panel', file: 'src/components/artifact-header/fixes.ts', fixes: ARTIFACT_PANEL_FIXES },
  { id: 'chat-chrome', label: 'Chat header, title menu, share modal', file: 'src/components/chat-header/fixes.ts', fixes: CHAT_CHROME_FIXES },
  { id: 'chat-screen', label: 'Chat screens (thread, header state, split column)', file: 'src/screens/chat/fixes.ts', fixes: CHAT_SCREEN_FIXES },
]

export const FIXES: Fix[] = FIX_SOURCES.flatMap(s => s.fixes)

const BY_ID = new Map<string, Fix>()
/** Ids written twice (two modules proposing the same id). The build-coverage page and the regression suite report them. */
export const DUPLICATE_FIX_IDS: string[] = []
for (const f of FIXES) {
  if (BY_ID.has(f.id)) DUPLICATE_FIX_IDS.push(f.id)
  else BY_ID.set(f.id, f)
}

export const fixById = (id: string): Fix | undefined => BY_ID.get(id)

/** True when the fix should render: fixes are switched on and the fix was not rejected. */
export function useFix(id: string): boolean {
  const mode = useStore(fixesMode)
  const fix = BY_ID.get(id)
  if (!fix) throw new Error(`Unknown fix "${id}": add it to FIXES (see src/fixes/fixes.ts for where each list lives)`)
  return fixRenders(fix, mode)
}
