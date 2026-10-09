# Pinning from the title (artefacts, projects, routines, chats)

- Journey id: `pinning`
- Title card: `11648:687579` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-687579
- Title card text: "artefact, projects, routines, pinning, chat from the title , pinning flow"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

Pin / unpin from the three list landing pages: Artifacts (card kebab), Projects (card kebab) and Routines (row kebab). All three frames are instances of page components (186, Dashboard, Routine Landing page). Pinned items show a pin glyph in the card/row meta and appear in the rail's Pinned group.

## Steps

### 01 - 206 (instance of 186, 1440 x 1380)

- Node: `11648:688362` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-688362
- Image: `01-11648-688362.png`
- Shows: Artifacts landing (1440 x 1380, scrolling page) with tabs All / Yours / Shared with you, All Types filter dropdown open, and a card kebab menu open in two variants side by side: Pin, Edit with Chat, Clone, Download, Share, Delete (unpinned card) and Unpin, ... , Delete hovered (pinned card).
- Changed from previous: Start of journey.
- Action that leads here: Open Artifacts from the rail, hover an artifact card and click its 3-dot button.
- Designer annotations nearby: "artefact landing pinned artefacts"
- Nav state: dark, collapsed icon rail (Artifacts selected)
- Open surfaces: All Types filter dropdown open + card kebab menu (two variants shown) open
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Component 2 {Type=Icon only}
  - Nav_menu/Main {Variant=Collapsed, State=Selected}
  - Nav_menu/Main {Variant=Collapsed, State=Default} x7
  - Nav_menu/Footer {Variant=Collapsed, State=Default}
  - Buttons/Button Brand {Size=md, Hierarchy=Primary, Icon=Default, State=Default}
  - filter frame {Type=Default}
  - artifacts {Property 1=full image} x11
  - artifacts {Property 1=hover 2}
  - Dropdown Menu {Type=Small} x2
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=Off, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x15
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Hover, Divider=False, Supporting Text=Off, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md}
  - Cursor {State=Pointer Hand}
- Component sets: `Main_nav`, `Component 2`, `Nav_menu/Main`, `Nav_menu/Footer`, `Buttons/Button Brand`, `filter frame`, `artifacts`, `Dropdown Menu`, `Dropdown list item`, `Cursor`

### 02 - Dashboard (Projects landing)

- Node: `11657:386528` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386528
- Image: `02-11657-386528.png`
- Shows: Projects landing with project folder cards (pin/lock/globe/people glyphs in meta), search field, All Types, Newest, grid/list toggle; kebab on 'Docebo UI Assets' open: Pin (hover), Edit Project, Share Project, Delete.
- Changed from previous: Different landing page (Projects) with expanded rail; Projects nav item selected; menu has only Pin / Edit / Share / Delete.
- Action that leads here: Click Projects in the rail, hover a project card and click its 3-dot button.
- Designer annotations nearby: "project landing pinned project"
- Nav state: dark, expanded; Projects selected; pinned project expanded with 2 chats; a Routines row shows hover + 3-dot
- Open surfaces: card kebab menu open
- Components (main component, variant):
  - Dashboard
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Buttons/Button Brand {Size=md, Hierarchy=Primary, Icon=Default, State=Default}
  - filter frame {Type=search click}
  - Project card 1 {Property 1=private} x11
  - Project card 1 {Property 1=hover}
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Hover, Divider=False, Supporting Text=Off, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x3
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Main_nav`, `Nav_menu/Footer`, `Buttons/Button Brand`, `filter frame`, `Project card 1`, `Dropdown Menu`, `Dropdown list item`, `Cursor`

### 03 - Routine Landing page

- Node: `11657:493696` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493696
- Image: `03-11657-493696.png`
- Shows: Routines landing table (Name, Trigger, Cost last 30 days, Status) with folder/pin glyphs next to names; kebab on the pinned 'Board pre-read assembly' row open: Unpin (hover), Edit, Pause, Run Now, Share, Delete.
- Changed from previous: Different landing page (Routines); Routines nav item selected; menu shows Unpin because this routine is already pinned.
- Action that leads here: Click Routines in the rail and click the 3-dot on a pinned routine row.
- Designer annotations nearby: "routine landing pinned routines"
- Nav state: dark, expanded; Routines selected
- Open surfaces: row kebab menu open
- Components (main component, variant):
  - Routine Landing page
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Hover, Divider=False, Supporting Text=Off, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x5
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md}
- Component sets: `Routine Landing page`, `Main_nav`, `Nav_menu/Footer`, `Dropdown Menu`, `Dropdown list item`

## Open questions
- The title card says pinning 'chat from the title', but no chat-title pin frame is in this journey; the project-title pin toggle is in nav-behaviour steps 07-08. Is a chat-header pin frame missing or elsewhere?
- Artifacts landing uses the collapsed rail while Projects/Routines use the expanded rail. Is the rail state just per-frame or intended per page?
- Step 01 shows two kebab menus side by side (Pin vs Unpin variants) - treat as two states of the same menu, not two menus open at once.
- Should pinning from a landing page immediately insert the item at the bottom of the rail's Pinned group (order rule)?
