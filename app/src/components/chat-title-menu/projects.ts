import { d, type Drift } from '../../fixtures/drift'
import { PROJECT_PICKER } from '../../fixtures/pins'

/**
 * The Add to Project list of the chat title menu as chat-artifact 03 draws it (I6405:329854;4770:196327-196332):
 * menu placeholders, which differ from the Switch Project list of nav-behaviour 04 (fixtures PROJECT_PICKER). With
 * fix project-picker-names both list the same real projects. Resolve with useResolved(TITLE_MENU_PROJECTS).
 */
export const TITLE_MENU_PROJECTS: Drift<string[]> = d(
  ['View profile', 'Settings', 'Keyboard shortcuts', 'Keyboard shortcuts', 'Keyboard shortcuts', 'Company profile'],
  PROJECT_PICKER.fixed,
  'project-picker-names',
)
