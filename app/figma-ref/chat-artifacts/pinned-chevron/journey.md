# Chevron over the folder icon on a hovered pinned project

- Journey id: `pinned-chevron`
- Title card: `11661:496234` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-496234
- Title card text: "add a chevron over the folder icon as well on the pinned project hovered state on the folder reveals a chevron"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

On a pinned project row in the rail, hovering the folder icon swaps it for a chevron (right = collapsed, down = expanded); clicking it toggles the project's chat list.

## Steps

### 01 - Copilot Landing page

- Node: `11661:497681` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-497681
- Image: `01-11661-497681.png`
- Shows: Pinned 'Project Name' row hovered: folder icon replaced by a right-pointing chevron in a small square, 3-dot button on the right, row hover background; project collapsed.
- Changed from previous: Start of journey (rail otherwise as in nav-behaviour).
- Action that leads here: Hover the folder icon of the pinned project in the rail.
- Designer annotations nearby: none
- Nav state: dark, expanded; no primary item selected
- Open surfaces: none; landing composer visible
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - Buttons/Button Neutral {Size=xs, Hierarchy=Tertiary, Icon=Only, State=Default} x2
  - Cursor {State=Pointer Hand}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
  - Feature Banner {Feature name=Enable memory, State=Default}
  - Feature Banner {Feature name=Custom Instructions, State=Default}
- Component sets: `Main_nav`, `Nav_menu/Footer`, `Avatar`, `Buttons/Button Neutral`, `Cursor`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`, `Feature Banner`

### 02 - Copilot Landing page

- Node: `11661:514386` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-514386
- Image: `02-11661-514386.png`
- Shows: Same pinned project after clicking the chevron: chevron points down and two nested chats ('Excel Formula Help From Main Do...', 'Chat 2 inside this Project') appear under an indent guide.
- Changed from previous: Chevron rotates right -> down and the project's chats expand below it, pushing the rest of Pinned/Routines down; New Session regains its selected background.
- Action that leads here: Click the chevron on the pinned project.
- Designer annotations nearby: none
- Nav state: dark, expanded; New Session selected; pinned project expanded
- Open surfaces: none
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - Buttons/Button Neutral {Size=xs, Hierarchy=Tertiary, Icon=Only, State=Default} x2
  - Cursor {State=Pointer Hand}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
- Component sets: `Main_nav`, `Nav_menu/Footer`, `Avatar`, `Buttons/Button Neutral`, `Cursor`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`

## Open questions
- Does clicking the project name (not the chevron) navigate to the project page while the chevron only toggles? Nav-behaviour step 02 shows an open (arrow-up-right) icon on hover instead; which hover pattern wins?
- Hover state here has no open-arrow icon, only the 3-dot. Confirm the arrow-up-right icon is dropped.
