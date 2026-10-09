import { fixesMode, useStore } from '../app/store'
import { fixRenders, type Fix } from './types'

// The Projects screens' departures from Figma: the landing (Projects list 11657:386523), the project dashboard
// (inside page option 1 14045:584747, option 2 15054:105151), its menus, and the sidebar status dots every screen
// shows. Each one but o2-routines-label-rest was made at the user's request in the prototype's UX pass of 2026-10-08
// (prototypes/project-dashboard, the HTML oracle, carries them all), so those are 'approved'; o2-routines-label-rest is
// the oracle's own correction of a stray override, so it is 'proposed'. "As designed" renders the frames as drawn; "With fixes"
// renders what the oracle shows. src/fixes/fixes.ts gathers this list into the FIXES ledger; this file must not import
// fixes.ts (see fixes/types.ts).

const DASHBOARD = ['14045:584747', '15054:105151']
const OPTION_1 = ['14045:584747']
const LANDING = ['11657:386523']
const NAV = ['226:81200', '9721:594967', '226:81199', '9721:595036', '14992:112150']
const DASH = '/projects/client-onboarding'

export const PROJECT_FIXES: Fix[] = [
  {
    id: 'crumb-shows-project-name',
    title: 'Title and breadcrumb name the open project',
    figmaNodeIds: [...DASHBOARD, '13701:756891', '11780:448662'],
    route: '/projects/banking-issues',
    before:
      'The dashboard is drawn once: it is titled "Client Onboarding" whichever project card you open, and its breadcrumb ' +
      'reads the placeholder "New Project Name".',
    after: 'The title and the breadcrumb both read the name of the project you opened ("Banking Issues", …).',
    why: 'The title and the crumb say where you are; a fixed or a different name reads as a different project.',
    status: 'approved',
  },
  {
    id: 'chats-newest-first',
    title: 'Chats are listed newest first, with the full date on hover',
    figmaNodeIds: DASHBOARD,
    route: DASH,
    before:
      'Under a "Newest" sort the rows keep the file\'s order: "Budget Allocation" (3h ago) above "Can we meet tomorrow?" ' +
      '(1h ago). The age is plain text.',
    after: 'Rows are sorted by last activity, newest first ("Can we meet tomorrow?" leads), and hovering an age shows the date and time.',
    why: 'The sort control says Newest, so the list has to agree with it; a relative age needs the real date behind it.',
    status: 'approved',
  },
  {
    id: 'team-real-overflow',
    title: 'Team avatars count the real members; an empty team reads "—"',
    figmaNodeIds: DASHBOARD,
    route: DASH,
    before:
      'Every avatar group ends in "+5" whatever its size (the first row draws four faces and +5), and the four rows without ' +
      'members leave the Team cell blank.',
    after: 'Up to three faces, then "+N" with the number of members not shown (no badge when everyone fits); "—" when nobody has joined.',
    why: 'A fixed "+5" misreports who is in the chat, and a blank cell reads as data that failed to load.',
    status: 'approved',
  },
  {
    id: 'avatar-name-tooltips',
    title: 'Team avatars name their members on hover',
    figmaNodeIds: DASHBOARD,
    route: DASH,
    before: 'Each avatar shows an initial only.',
    after: 'Hovering a face shows the member\'s name, and the "+N" badge lists the others. The names are placeholders.',
    why: 'An initial alone does not tell Tara from Tomás.',
    status: 'approved',
  },
  {
    id: 'avatar-ring-row-colour',
    title: 'Avatar rings take the row colour on hover',
    figmaNodeIds: DASHBOARD,
    route: `${DASH}?state=frame`,
    before: 'The faces keep their 1px white ring on the hovered row (#f7f5f3), a white halo around each face.',
    after: 'On a hovered, focused or menu-open row the ring takes the row colour, so the faces sit on the row without a halo.',
    why: 'The ring separates overlapping faces; on a tinted row the white reads as a stray outline.',
    status: 'approved',
  },
  {
    id: 'row-hover-underline',
    title: 'A hovered row underlines the chat name',
    figmaNodeIds: DASHBOARD,
    route: `${DASH}?state=frame`,
    before: 'Row hover only tints the row (#f7f5f3); nothing says the row opens the chat.',
    after: 'The chat name also turns text-primary and is underlined, and the pointer becomes a hand.',
    why: 'The row is the link to the chat; the underline and the pointer say so.',
    status: 'approved',
  },
  {
    id: 'row-actions-keep-time',
    title: 'The row ⋮ appears beside the age instead of replacing it',
    figmaNodeIds: DASHBOARD,
    route: `${DASH}?state=frame`,
    before:
      'Hovering a row swaps its age ("3h ago") for the ⋮ button, so the age disappears while you point at the row (the ' +
      'prototype also shows the ⋮ on keyboard focus, as designed, so the menu stays reachable).',
    after: 'The age stays and the ⋮ appears beside it on hover, on keyboard focus in the row and while its menu is open.',
    why: 'Pointing at a row should not hide what you are reading; the cell has room for both.',
    status: 'approved',
  },
  {
    id: 'row-menu-move-to-project',
    title: 'Row menu: "Move to project", and no "Log out"',
    figmaNodeIds: ['14045:569050', '14045:569049', ...DASHBOARD],
    route: `${DASH}?state=menus`,
    before: 'The chat row ⋮ menu reads Pin, Rename, Add to Project ›, a divider, then Log out.',
    after: 'Pin, Rename, Move to project ›. Log out is gone, and the submenu is named for what it does.',
    why: 'Log out is an account action and does not belong on a chat row; a chat that is already in a project is moved, not added.',
    status: 'approved',
  },
  {
    id: 'table-header-contrast',
    title: 'Table headers in text-tertiary, for AA contrast',
    figmaNodeIds: DASHBOARD,
    route: DASH,
    before: 'Column headers are #9f9993 (text-quaternary) on the #fbfaf9 page, about 2.6:1.',
    after: 'Column headers use text-tertiary (#6a6662), about 5.4:1.',
    why: 'WCAG 1.4.3 asks 4.5:1 for text this small (11px).',
    status: 'approved',
  },
  {
    id: 'table-header-labels',
    title: 'Column headers say "Cost / chat" and "Last active"',
    figmaNodeIds: DASHBOARD,
    route: DASH,
    before: 'The columns are headed COST and TIME & DATE, but the cells hold the cost of each chat and a relative age with no date.',
    after: 'COST / CHAT (its tooltip: total model cost of this chat so far) and LAST ACTIVE.',
    why: 'A header should name what its cells hold.',
    status: 'approved',
  },
  {
    id: 'table-gap-plus-12',
    title: '12px more space between the tabs and the table',
    figmaNodeIds: OPTION_1,
    route: DASH,
    before: 'The table header starts 16px below the tab strip (option 1; option 2 draws 48 and is unchanged).',
    after: 'It starts 28px below (16 + 12).',
    why: 'Asked for by the user: the toolbar and the table header ran together.',
    status: 'approved',
  },
  {
    id: 'tabs-natural-width',
    title: 'Section tabs take their natural width, and hover does not widen them',
    figmaNodeIds: OPTION_1,
    route: `${DASH}?state=frame`,
    before:
      'Each tab has a 76px minimum width, so the short ones (Chats, Files) get extra side space, and hover widens the icon ' +
      'gap from 6 to 8px, which nudges the label.',
    after: 'Tabs are as wide as their content, 8px apart, and hover only fills the background.',
    why: 'Even spacing between the labels; a label that moves on hover reads as jitter.',
    status: 'approved',
  },
  {
    id: 'filter-sort-icons',
    title: 'Filter and sort say what they do with an icon',
    figmaNodeIds: OPTION_1,
    route: DASH,
    before: '"All Chats ˅" and "Newest ˅" are two identical label-and-chevron dropdowns; nothing tells the filter from the sort.',
    after:
      'A filter icon before "All Chats" and a sort icon before "Newest", without the chevron, as the Projects landing ' +
      'draws them. ("Show: All" / "Sort: Newest" labels were tried first; the user chose the icons.)',
    why: 'The icons tell filter from sort at a glance, and match the landing page.',
    status: 'approved',
  },
  {
    id: 'filter-sort-tab-specs',
    title: 'Filter and sort take the specs of the tabs beside them',
    figmaNodeIds: OPTION_1,
    route: DASH,
    before: 'They are Button Neutral Tertiary md: 32px tall, 6px padding, Text sm/Medium, 2px apart, next to 28px tabs set in Text sm/Regular.',
    after: '_Tab base Size=sm specs: 28px tall, 4/8px padding, 6px icon gap, Text sm/Regular in tertiary-fg, 14px icons, 8px apart, bg-tertiary on hover.',
    why: 'One toolbar row, one control style.',
    status: 'approved',
  },
  {
    id: 'filter-sort-aligned',
    title: 'Filter and sort line up with the tab labels',
    figmaNodeIds: OPTION_1,
    route: DASH,
    before: 'The dropdowns are centred on the whole 32px tab strip, underline included, so they sit 2px below the centre of the tab labels.',
    after: 'They are centred on the tab labels\' 28px box.',
    why: 'Controls in one row share a centre line.',
    status: 'approved',
  },
  {
    id: 'o2-routines-label-rest',
    title: 'Option 2: the Routines pill label at its rest colour',
    figmaNodeIds: ['15054:105151', '15054:106857'],
    route: `${DASH}?opt=2`,
    before: 'The frame sets the Routines pill label in #4a4745, the hover colour of a secondary button, though it is neither hovered nor selected; Artifacts, Files and Settings use the rest colour #6a6662.',
    after: 'Routines uses the rest colour like the other unselected pills (the HTML oracle left the stray override out).',
    why: 'A stray instance override: a darker label reads as a second selected or hovered tab.',
    status: 'proposed',
  },
  {
    id: 'landing-search-icon',
    title: 'Projects search folds to an icon',
    figmaNodeIds: LANDING,
    route: '/projects',
    before: 'A 180px search field (magnifier and "Search" placeholder) sits before the type and sort chips.',
    after: 'A 28px tertiary icon button. Pressing it opens the 180px field with focus in it; Esc, or leaving it empty, folds it back.',
    why: 'Twelve projects do not need a permanent search field, and the row reads lighter.',
    status: 'approved',
  },
  {
    id: 'landing-controls-tertiary',
    title: 'Projects type and sort are tertiary buttons, set flush',
    figmaNodeIds: LANDING,
    route: '/projects',
    before: '"All Types" and "Newest" are chips filled with bg-tertiary at rest, 8px from the search field and from each other.',
    after: 'No fill at rest (bg-tertiary on hover), flush with the search button and each other, 8px before the grid / list toggle (unchanged).',
    why: 'Filled chips read as selected, next to the All / Yours / Shared tabs.',
    status: 'approved',
  },
  {
    id: 'nav-status-dots-animated',
    title: 'Sidebar status dots move',
    figmaNodeIds: NAV,
    route: DASH,
    before:
      'Static dots. Dark nav: a faint gradient ring (in progress), a 4px white dot (waiting for your input), a #b72318 ring ' +
      '(failed). Light nav: a grey ring for every state except waiting, a filled dot.',
    after:
      'In progress turns as a loader ring, waiting pulses 6 → 4px, failed is a 6px red ring, brighter on the dark nav ' +
      '(error-400); the light nav shows the same states in #2f2e2d. With reduced motion they stay still.',
    why: 'A chat that is still working should look alive, and a failed one should stand out on the dark nav.',
    status: 'approved',
  },
  {
    id: 'nav-unread-dot',
    title: 'An unread chat shows a white dot',
    figmaNodeIds: ['226:81200', ...DASHBOARD],
    route: DASH,
    before: '"Sheet Formula Consultant" (Chats) has no status dot: the file draws no unread state in the dark nav.',
    after: 'A static 6px white dot marks a chat with an unread reply, so every status the nav knows is shown once.',
    why: 'BUILD-PLAN Q17 (accepted default): a white dot means an unread reply.',
    status: 'approved',
  },
]

export type ProjectFixId =
  | 'crumb-shows-project-name' | 'chats-newest-first' | 'team-real-overflow' | 'avatar-name-tooltips' | 'avatar-ring-row-colour'
  | 'row-hover-underline' | 'row-actions-keep-time' | 'row-menu-move-to-project' | 'table-header-contrast' | 'table-header-labels'
  | 'table-gap-plus-12' | 'tabs-natural-width' | 'filter-sort-icons' | 'filter-sort-tab-specs' | 'filter-sort-aligned'
  | 'o2-routines-label-rest' | 'landing-search-icon' | 'landing-controls-tertiary' | 'nav-status-dots-animated' | 'nav-unread-dot'

const BY_ID = new Map(PROJECT_FIXES.map(f => [f.id, f]))

/**
 * React: a lookup that says whether a Projects fix renders under the review bar's "As designed / With fixes" switch
 * (true when fixes are on and the fix is not rejected). One store subscription however many fixes a component asks
 * about. Throws for an id that is not in PROJECT_FIXES, so a typo fails the first time the component renders.
 */
export function useProjectFixes(): (id: ProjectFixId) => boolean {
  const mode = useStore(fixesMode)
  return id => {
    const fix = BY_ID.get(id)
    if (!fix) throw new Error(`Unknown fix "${id}": add it to PROJECT_FIXES in src/fixes/projects.ts`)
    return fixRenders(fix, mode)
  }
}

/** useProjectFixes for one fix. */
export function useProjectFix(id: ProjectFixId): boolean {
  return useProjectFixes()(id)
}
