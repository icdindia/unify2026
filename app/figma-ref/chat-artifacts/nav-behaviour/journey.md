# Nav bar behaviour (pins, project hover, >10 chats, landing pins)

- Journey id: `nav-behaviour`
- Title card: `11614:672892` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672892
- Title card text: "Nav bar behaviour"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

Dark expanded nav rail (Main_nav) behaviours on the landing page: unread dots on pinned items, hovering and opening a pinned project, the project's 3-dot menu, a project chat's context menu with Switch Project submenu, more than 10 chats with View all, pin/unpin from the project landing page, and the pinned artifact hover menu. Each frame has a heading text above it in Figma (quoted under annotations).

## Steps

### 01 - Copilot Landing page

- Node: `11614:672894` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894
- Image: `01-11614-672894.png`
- Shows: Landing page with the dark expanded rail; Pinned group lists Artifacts, Projects, 'Plan launch timeline' (white dot) and 'Review customer feedback' (red ring); Routines items show white dot / loading ring; Chats group at bottom.
- Changed from previous: Start of journey.
- Action that leads here: Open the app on New Session with the rail expanded.
- Designer annotations nearby: "Pinned Items + chat with white dots (user hasnt seen the agent reply)"
- Nav state: dark, expanded (280px); New Session selected; all groups expanded (down chevrons); footer shows bell with red dot
- Open surfaces: none; landing composer visible (no Tools & Sources chips)
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - Buttons/Button Neutral {Size=xs, Hierarchy=Tertiary, Icon=Only, State=Default} x2
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
  - Feature Banner {Feature name=Enable memory, State=Default}
  - Feature Banner {Feature name=Custom Instructions, State=Default}
- Component sets: `Main_nav`, `Nav_menu/Footer`, `Avatar`, `Buttons/Button Neutral`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`, `Feature Banner`

### 02 - Copilot Landing page

- Node: `11614:676434` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-676434
- Image: `02-11614-676434.png`
- Shows: Pointer hovering the pinned 'Projects' row: row shows an open (arrow-up-right) icon and a 3-dot more button on the right.
- Changed from previous: Hover affordances appear on the pinned Projects row; New Session loses its selected background.
- Action that leads here: Hover the pinned 'Projects' item in the rail.
- Designer annotations nearby: "Project Hover + click"
- Nav state: dark, expanded; no primary item selected
- Open surfaces: none
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Small Icon Button {Size=md, State=Default}
  - arrow-up-right
  - Cursor {State=Arrow}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
- Component sets: `Main_nav`, `Nav_menu/Footer`, `Small Icon Button`, `arrow-up-right`, `Cursor`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`

### 03 - Copilot Landing page

- Node: `11715:658763` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-658763
- Image: `03-11715-658763.png`
- Shows: Pinned 'Projects' is expanded showing two nested chats with an indent guide, and its 3-dot menu is open: Unpin, Move Down, Edit Project, Share Project, Delete (red).
- Changed from previous: Project row expanded (click) to reveal its chats; 3-dot button active and the small dropdown menu opens to the right of the rail. Unread dots no longer shown on pinned chats.
- Action that leads here: Click the pinned project to expand it, then click its 3-dot button.
- Designer annotations nearby: "Project Hover + 3 dots hover for dropdowns"
- Nav state: dark, expanded; pinned project expanded
- Open surfaces: dropdown menu (Dropdown Menu Type=Small) open over the content
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x5
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md} x2
  - Small Icon Button {Size=md, State=Default}
  - arrow-up-right
  - Cursor {State=Arrow}
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Dropdown Menu`, `Dropdown list item`, `Small Icon Button`, `arrow-up-right`, `Cursor`, `Copilot desktop Input Box`

### 04 - Copilot Landing page

- Node: `11614:677973` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-677973
- Image: `04-11614-677973.png`
- Shows: Context menu for a chat inside the pinned project (Pin Chat, Rename, Switch Project >, Remove from Project, Delete) with the Switch Project submenu open: search field, project list with 'Project Name' checked, 'Settings' hovered, and 'Start a New Project'.
- Changed from previous: Project now labelled 'Project Name'; the chat-level menu replaces the project menu and a cascading project picker opens; unread dots return on pinned chats.
- Action that leads here: Hover a chat inside the pinned project, open its 3-dot menu, then hover 'Switch Project'.
- Designer annotations nearby: "Pinned Project Chat hover"
- Nav state: dark, expanded; pinned project expanded
- Open surfaces: chat context menu + Switch Project submenu (Dropdown Menu Type=Full) open
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Frame 2147266815 (menu wrapper component)
  - Dropdown Menu {Type=Full}
  - Dropdown list header search {Size=sm}
  - Search_solid {Size=sm, Type=Search, State=Placeholder}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x8
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=Off, Size=sm} x2
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Hover, Divider=False, Supporting Text=Off, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md} x2
  - Cursor {State=Arrow}
- Component sets: `Main_nav`, `Dropdown Menu`, `Dropdown list header search`, `Search_solid`, `Dropdown list item`, `Cursor`

### 05 - Copilot Landing page

- Node: `11693:260033` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11693-260033
- Image: `05-11693-260033.png`
- Shows: Pinned 'Project Name' expanded with 10 chats listed (one unread dot, one loading ring, one red ring) and a 'View All' link below; this fills the rail down to the footer.
- Changed from previous: Menus closed; the pinned project now holds more than 10 chats so the list caps at 10 and shows 'View All'. Routines/Chats groups pushed below the fold.
- Action that leads here: Pinned project has more than 10 chats (state, no click) - expand the pinned project.
- Designer annotations nearby: "Pinned Project more than 10 chats"
- Nav state: dark, expanded; Main_nav is a detached FRAME here (not an instance)
- Open surfaces: none
- Components (main component, variant):
  - Main_nav (detached frame)
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
- Component sets: `Nav_menu/Footer`, `Avatar`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`

### 06 - Copilot Landing page

- Node: `11715:627268` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-627268
- Image: `06-11715-627268.png`
- Shows: Same 10-chat list (Chat 1..10 inside this Project) with the pointer hovering 'View All', which gets a hover background.
- Changed from previous: 'View All' row in hover state; chat names changed to 'Chat N inside this Project'.
- Action that leads here: Hover (then click) 'View All' under the pinned project.
- Designer annotations nearby: "More than 10 chats View all"
- Nav state: dark, expanded; detached Main_nav frame
- Open surfaces: none
- Components (main component, variant):
  - Main_nav (detached frame)
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Cursor {State=Arrow}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
- Component sets: `Nav_menu/Footer`, `Cursor`, `EB-Assistant/AI`, `Copilot desktop Input Box`

### 07 - Group 1171274973

- Node: `13701:756891` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13701-756891
- Image: `07-13701-756891.png`
- Shows: Project landing page ('Project Name Longname comes till her...') with breadcrumb Projects / New Project Name, pin + kebab + Share in the title row, project composer, tabs (Chats, Routines, Artifacts, Context, Settings) and the chats table; a row kebab menu is open (Pin, Rename, Add to Project >, Log out) with the project picker submenu.
- Changed from previous: Navigated from the landing page to the project page; title pin icon is unfilled (project not pinned). Separate Tooltip 'Pin Project' sits on the title pin icon in Figma (sibling layer, not in the export).
- Action that leads here: Click 'View All' (or the pinned project's open arrow) to open the project page; hover the title pin icon; open a chat row's kebab and hover 'Add to Project'.
- Designer annotations nearby: "project landing page with pin / unpin"; "Tooltip text: Pin Project"
- Nav state: dark, expanded; pinned project expanded with 10 chats
- Open surfaces: row kebab menu + Add to Project submenu open; tooltip 'Pin Project' on hover of the pin icon
- Components (main component, variant):
  - Dashboard
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default} x2
  - ES Breadcrumb {Variant=with Icon}
  - Dropdown Menu {Type=Small}
  - Dropdown Menu {Type=Full}
  - Dropdown list header search {Size=sm}
  - Search_solid {Size=sm, Type=Search, State=Placeholder}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x8
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md} x2
  - Dropdown list item {Start Type=Default, End Type=Icon, Selected=Off, State=Hover, Divider=False, Supporting Text=Off, Size=sm}
  - Cursor {State=Pointer Hand}
  - Tooltip {Supporting text=False, Arrow=Top center} (sibling layer 13701:763878)
- Component sets: `Dashboard`, `Main_nav`, `Nav_menu/Footer`, `ES Breadcrumb`, `Dropdown Menu`, `Dropdown list header search`, `Search_solid`, `Dropdown list item`, `Cursor`, `Tooltip`

### 08 - Group 1171274972

- Node: `11780:448662` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11780-448662
- Image: `08-11780-448662.png`
- Shows: Same project landing page with the title pin icon in its active/filled state (project pinned); the same row menu and submenu remain open.
- Changed from previous: Pin icon toggled to pinned (filled with background); tooltip changes to 'Unpin Project'. Rail padding is 20px instead of 16px.
- Action that leads here: Click the pin icon next to the project title.
- Designer annotations nearby: "Tooltip text: Unpin Project"
- Nav state: dark, expanded
- Open surfaces: row kebab menu + Add to Project submenu open; tooltip 'Unpin Project'
- Components (main component, variant):
  - Dashboard
  - Main_nav {types=Expanded}
  - ES Breadcrumb {Variant=with Icon}
  - Dropdown Menu {Type=Small}
  - Dropdown Menu {Type=Full}
  - Dropdown list item {Start Type=Default, End Type=Icon, Selected=Off, State=Hover, Divider=False, Supporting Text=Off, Size=sm}
  - Cursor {State=Pointer Hand}
  - Tooltip {Supporting text=False, Arrow=Top center} (sibling layer 11780:451253)
- Component sets: `Dashboard`, `Main_nav`, `ES Breadcrumb`, `Dropdown Menu`, `Dropdown list item`, `Cursor`, `Tooltip`

### 09 - Copilot Landing page

- Node: `11635:685715` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11635-685715
- Image: `09-11635-685715.png`
- Shows: Back on the landing page; pinned 'Artifacts' row hovered with its 3-dot menu open: Unpin, Move Up, Move Down, Download, Delete (red).
- Changed from previous: Different pinned item (Artifacts) shows the hover affordances and its own menu, which adds Move Up and Download compared with the project menu.
- Action that leads here: Hover the pinned 'Artifacts' item and click its 3-dot button.
- Designer annotations nearby: "artefact hover + dropdown"
- Nav state: dark, expanded; Artifacts row active
- Open surfaces: dropdown menu (Type=Small) open
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm} x5
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md}
  - Small Icon Button {Size=md, State=Default}
  - arrow-up-right
  - Cursor {State=Arrow}
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Dropdown Menu`, `Dropdown list item`, `Small Icon Button`, `arrow-up-right`, `Cursor`, `Copilot desktop Input Box`

## Open questions
- Steps are independent behaviour states rather than one continuous click path; the prototype should treat them as interactions on one rail (hover, menu, submenu, overflow).
- Step 03 project menu shows Unpin + Move Down only; step 09 artifacts menu shows Move Up + Move Down. Confirm rule: Move Up hidden for the first pinned item, Move Down hidden for the last?
- Step 04: the chat context menu is drawn near the Agents group, well above the hovered chat row. Should it anchor to the chat row's 3-dot button?
- Step 07/08 row menu contains 'Log out', which looks like a placeholder item. What is the real 4th action (Delete?).
- Does 'View All' open the project page (step 07) or expand the list in place?
- Unread indicators: white dot = unseen agent reply, red ring and grey ring meanings are not annotated (error? running?).
- Pin/Unpin tooltips are separate layers beside the frames, so they are not in the exported PNGs.
