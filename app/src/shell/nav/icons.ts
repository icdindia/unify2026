// Nav icons, exported from the Figma file (copied from prototypes/project-dashboard/assets).
// Vite inlines each one as a data URI in the build. Light-mode files carry the light frame's colours,
// so dark and light are separate sets rather than one recoloured set.
import xLogoWord from '../../assets/nav/x-logo-word.svg'
import navSearch from '../../assets/nav/nav-search.svg'
import navLayoutLeft from '../../assets/nav/nav-layout-left.svg'
import navPlus from '../../assets/nav/nav-plus.svg'
import navFolderSolid from '../../assets/nav/nav-folder-solid.svg'
import navFolder from '../../assets/nav/nav-folder.svg'
import navClock from '../../assets/nav/nav-clock.svg'
import navCalendar from '../../assets/nav/nav-calendar.svg'
import navCube from '../../assets/nav/nav-cube.svg'
import navCubeThin from '../../assets/nav/nav-cube-thin.svg'
import navChevronSub from '../../assets/nav/nav-chevron-sub.svg'
import navChevRightDark from '../../assets/nav/nav-chev-right-dark.svg'
import navTreeLine from '../../assets/nav/nav-tree-line.svg'
import navDotsH from '../../assets/nav/nav-dots-h.svg'
import navBellBtn from '../../assets/nav/nav-bell-btn.svg'
import navChevronUpBtn from '../../assets/nav/nav-chevron-up-btn.svg'
import agentFinancial from '../../assets/nav/agent-financial.svg'
import agentSheet from '../../assets/nav/agent-sheet.svg'
import agentFalcon from '../../assets/nav/agent-falcon.svg'

import ltLogoWord from '../../assets/nav/lt-logo-word.svg'
import ltSearch from '../../assets/nav/lt-search.svg'
import ltLayoutLeft from '../../assets/nav/lt-layout-left.svg'
import ltPlus from '../../assets/nav/lt-plus.svg'
import ltFolder from '../../assets/nav/lt-folder.svg'
import ltClock from '../../assets/nav/lt-clock.svg'
import ltCalendar from '../../assets/nav/lt-calendar.svg'
import ltCube from '../../assets/nav/lt-cube.svg'
import ltChevDown from '../../assets/nav/lt-chev-down.svg'
import ltChevRight from '../../assets/nav/lt-chev-right.svg'
import ltDotsH from '../../assets/nav/lt-dots-h.svg'
import ltDotRing from '../../assets/nav/lt-dot-ring.svg'
import ltDotFilled from '../../assets/nav/lt-dot-filled.svg'
import dotProgress from '../../assets/nav/dot-progress.svg'
import dotWaiting from '../../assets/nav/dot-waiting.svg'
import dotFailed from '../../assets/nav/dot-failed.svg'
import ltChevronUp from '../../assets/nav/lt-chevron-up.svg'
import ltAiAgent from '../../assets/nav/lt-ai-agent.svg'
import ltAgentFinancial from '../../assets/nav/lt-agent-financial.svg'
import ltAgentSheet from '../../assets/nav/lt-agent-sheet.svg'
import ltAgentFalcon from '../../assets/nav/lt-agent-falcon.svg'

import railPlus from '../../assets/nav/rail-plus.svg'
import railSearch from '../../assets/nav/rail-search.svg'
import railFolder from '../../assets/nav/rail-folder.svg'
import railClock from '../../assets/nav/rail-clock.svg'
import railCalendar from '../../assets/nav/rail-calendar.svg'
import railCube from '../../assets/nav/rail-cube.svg'
import railAiAgent from '../../assets/nav/rail-ai-agent.svg'

/** Expanded nav, dark (226:81200). */
export const DARK = {
  wordmark: xLogoWord,
  search: navSearch,
  collapse: navLayoutLeft,
  newSession: navPlus,
  projects: navFolderSolid,
  routines: navClock,
  meetings: navCalendar,
  artifacts: navCube,
  pinnedArtifacts: navCubeThin,
  pinnedProjects: navFolder,
  sectionOpen: navChevronSub,
  sectionClosed: navChevRightDark,
  treeLine: navTreeLine,
  more: navDotsH,
  bell: navBellBtn,
  accountMenu: navChevronUpBtn,
  agentFinancial,
  agentSheet,
  agentFalcon,
  /** the file's static status dots (16px slot): gradient ring, 4px white dot, #b72318 ring */
  dotProgress,
  dotWaiting,
  dotFailed,
} as const

/** Expanded nav, light (9721:594967). */
export const LIGHT = {
  wordmark: ltLogoWord,
  search: ltSearch,
  collapse: ltLayoutLeft,
  newSession: ltPlus,
  projects: ltFolder,
  routines: ltClock,
  meetings: ltCalendar,
  artifacts: ltCube,
  sectionOpen: ltChevDown,
  sectionClosed: ltChevRight,
  more: ltDotsH,
  dotRing: ltDotRing,
  /** the file's static "waiting" dot; every other light status is dotRing */
  dotFilled: ltDotFilled,
  accountMenu: ltChevronUp,
  agentFinancial: ltAgentFinancial,
  agentSheet: ltAgentSheet,
  agentFalcon: ltAgentFalcon,
} as const

/** Collapsed rails: dark (226:81199) has its own icon exports; light (9721:595036) reuses the light nav's. */
export const RAIL_DARK = {
  newSession: railPlus,
  search: railSearch,
  projects: railFolder,
  routines: railClock,
  meetings: railCalendar,
  artifacts: railCube,
  agents: railAiAgent,
} as const

export const RAIL_LIGHT = {
  newSession: ltPlus,
  projects: ltFolder,
  routines: ltClock,
  meetings: ltCalendar,
  artifacts: ltCube,
  agents: ltAiAgent,
} as const
