import type { ChatScript } from '../script'
import { BUSINESS_UNITS_SCRIPT } from './businessUnits'
import { COMMIT_SCRIPT } from './commit'
import { COST_SCRIPT } from './cost'
import { NEW_ARTIFACT_SCRIPT, NEW_ROUTINE_SCRIPT } from './newArtifact'

export { BUSINESS_UNITS_SCRIPT, COMMIT_SCRIPT, COST_SCRIPT, NEW_ARTIFACT_SCRIPT, NEW_ROUTINE_SCRIPT }

/** The chats of BUILD-PLAN 2.1 (#/chat/<id>), each played by one script. */
export type ChatId = 'commit' | 'business-units' | 'cost' | 'new-artifact' | 'new-routine'

export const SCRIPTS: Record<ChatId, ChatScript> = {
  commit: COMMIT_SCRIPT,
  'business-units': BUSINESS_UNITS_SCRIPT,
  cost: COST_SCRIPT,
  'new-artifact': NEW_ARTIFACT_SCRIPT,
  'new-routine': NEW_ROUTINE_SCRIPT,
}

export const CHAT_IDS = Object.keys(SCRIPTS) as ChatId[]
/** Own keys only: a URL id such as "constructor" or "__proto__" is not a chat (`in` would walk Object.prototype). */
export const isChatId = (id: string): id is ChatId => Object.hasOwn(SCRIPTS, id)
