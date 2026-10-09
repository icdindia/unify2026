import { fixesMode, useStore } from '../app/store'

// The FIXES ledger's shape, plus the one rule that decides whether a fix renders. It lives apart from fixes.ts (which
// gathers every module's list into FIXES) so that a module's own list and hook (components/overlays/fixes.ts,
// components/composer/fixes.ts, fixtures/fixCandidates.ts) never imports fixes.ts at runtime: fixes.ts imports them,
// and the reverse import would be a cycle whose evaluation order decides whether FIXES is defined yet.

export type FixStatus = 'proposed' | 'approved' | 'rejected' | 'in-figma'

export type Fix = {
  id: string
  title: string
  figmaNodeIds: string[]   // original frames the fix applies to
  route: string            // where to see it in the prototype
  before: string
  after: string
  why: string
  status: FixStatus
  figmaCopyNodeId?: string // corrected copy on the "Prototype fixes" page, once made
}

/** Whether a fix renders in a fixes mode: "With fixes" is on and the fix was not rejected. */
export function fixRenders(fix: Fix, mode: 'on' | 'off'): boolean {
  return mode === 'on' && fix.status !== 'rejected'
}

/**
 * React: whether fix `id` of `list` renders under the review bar's "As designed / With fixes" switch. Throws for an id
 * the list does not have, so a typo fails loudly the first time the component renders.
 */
export function useFixIn(list: readonly Fix[], id: string, where: string): boolean {
  const mode = useStore(fixesMode)
  const fix = list.find(f => f.id === id)
  if (!fix) throw new Error(`Unknown fix "${id}": add it to ${where}`)
  return fixRenders(fix, mode)
}
