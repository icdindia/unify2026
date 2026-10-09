# Nav bar light mode

- Journey id: `nav-light`
- Title card: `12919:607701` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12919-607701
- Title card text: "Nav bar light mode"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

Light-mode variant of the main nav rail (Main_nav light mode) on the Copilot landing page: collapsed rail, expanded rail, and the account menu opened from the footer avatar in both rail widths. Content area is identical in every frame (Hello Roger, landing input box, Connect apps banner carousel). Frame names in Figma: 208, 209, 210, 1730.

## Steps

### 01 - 208

- Node: `12829:289253` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-289253
- Image: `01-12829-289253.png`
- Shows: Landing page with the light nav rail collapsed to icons (logo, New session selected, Projects, Routines, Meetings, Artifacts, Agents) and avatar 'A' in the footer.
- Changed from previous: Start of journey.
- Action that leads here: Open the app / land on New Session with the rail collapsed.
- Designer annotations nearby: none
- Nav state: light, collapsed (56px icon rail), New Session item selected
- Open surfaces: none; landing composer visible, no artifact/side panel, no modal
- Components (main component, variant):
  - Main_nav light mode {types=collapsed}
  - Component 2 light mode {Type=Icon only}
  - Nav_menu/Main light mode {Variant=Collapsed, State=Selected}
  - Nav_menu/Main light mode {Variant=Collapsed, State=Default} x5
  - Nav_menu/Footer light mode {Variant=Collapsed, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - Company Logo
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
  - Feature Banner {Feature name=Enable memory, State=Default}
  - Feature Banner {Feature name=Custom Instructions, State=Default}
- Component sets: `Main_nav light mode`, `Component 2 light mode`, `Nav_menu/Main light mode`, `Nav_menu/Footer light mode`, `Avatar`, `Company Logo`, `Copilot desktop Input Box`, `Banner carousel`, `Feature Banner`

### 02 - 209

- Node: `12829:292060` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-292060
- Image: `02-12829-292060.png`
- Shows: Same landing page with the light rail expanded (280px): UnifyApps logo, search, collapse toggle, primary items, Agents, Pinned, Routines and History groups, footer with user name and chevron.
- Changed from previous: Rail expands from icons to full labels; content shifts right and recentres in the remaining width. A Routines row ('Excel Formula Help From Main Docu...') shows a hover background.
- Action that leads here: Click the expand control on the collapsed rail (logo / sidebar toggle) to expand it.
- Designer annotations nearby: none
- Nav state: light, expanded (280px); New Session selected; Agents and Pinned groups with right chevron, Routines and History with down chevron
- Open surfaces: none; landing composer visible
- Components (main component, variant):
  - Main_nav light mode {types=Expanded}
  - Nav_menu/Footer light mode {Variant=Default, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - chevron-up-sm
  - Company Logo
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
  - Feature Banner {Feature name=Enable memory, State=Default}
  - Feature Banner {Feature name=Custom Instructions, State=Default}
- Component sets: `Main_nav light mode`, `Nav_menu/Footer light mode`, `Avatar`, `chevron-up-sm`, `Company Logo`, `Copilot desktop Input Box`, `Banner carousel`, `Feature Banner`

### 03 - 210

- Node: `12829:296297` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-296297
- Image: `03-12829-296297.png`
- Shows: Collapsed light rail with the account popover open above the avatar: header 'Anurag Kashyap', Notifications (red unread dot), Settings, Log Out.
- Changed from previous: Rail back to collapsed; footer avatar is in its Clicked state and the account menu popover (Tentant Switcher) is open bottom-left.
- Action that leads here: Click the 'A' avatar in the collapsed rail footer.
- Designer annotations nearby: none
- Nav state: light, collapsed; footer State=Clicked
- Open surfaces: account menu popover open; no modal
- Components (main component, variant):
  - Main_nav light mode {types=collapsed}
  - Component 2 light mode {Type=Icon only}
  - Nav_menu/Main light mode {Variant=Collapsed, State=Selected}
  - Nav_menu/Main light mode {Variant=Collapsed, State=Default} x5
  - Nav_menu/Footer light mode {Variant=Collapsed, State=Clicked}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - Tentant Switcher
  - Avatar {State=Default}
  - Company Logo
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
  - Feature Banner {Feature name=Enable memory, State=Default}
  - Feature Banner {Feature name=Custom Instructions, State=Default}
- Component sets: `Main_nav light mode`, `Component 2 light mode`, `Nav_menu/Main light mode`, `Nav_menu/Footer light mode`, `Avatar`, `Tentant Switcher`, `Company Logo`, `Copilot desktop Input Box`, `Banner carousel`, `Feature Banner`

### 04 - 1730

- Node: `12919:607703` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12919-607703
- Image: `04-12919-607703.png`
- Shows: Expanded light rail with the account popover open over the bottom of the rail: header 'Anurag Kashyap', Settings, Log Out.
- Changed from previous: Rail expanded again; account popover now sits over the History group and has no Notifications row. Footer row reads 'Anurag Kashyap' with chevron-up.
- Action that leads here: Click the user row (Anurag Kashyap) in the expanded rail footer.
- Designer annotations nearby: none
- Nav state: light, expanded; footer row default state (menu open above it)
- Open surfaces: account menu popover open; no modal
- Components (main component, variant):
  - Main_nav light mode {types=Expanded}
  - Nav_menu/Footer light mode {Variant=Default, State=Default}
  - Avatar {Size=sm, Type=Letter, Colour=Brand Subtle, State=Default}
  - Avatar {State=Default}
  - _nav icon {Size=md} x2
  - chevron-up-sm
  - Company Logo
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
  - Feature Banner {Feature name=Enable memory, State=Default}
  - Feature Banner {Feature name=Custom Instructions, State=Default}
- Component sets: `Main_nav light mode`, `Nav_menu/Footer light mode`, `Avatar`, `_nav icon`, `chevron-up-sm`, `Company Logo`, `Copilot desktop Input Box`, `Banner carousel`, `Feature Banner`

## Open questions
- Collapsed account menu (step 03) has a Notifications row with an unread dot; the expanded one (step 04) does not. Is Notifications meant to appear in both?
- Which control expands the collapsed rail: the logo, a hover-to-peek, or a dedicated toggle? The collapsed frame shows no explicit toggle (expanded has the sidebar icon next to search).
- Is step order 01 -> 02 -> 03 -> 04 a single flow, or two pairs (collapsed/expanded rail, then account menu in each width)? Read here as two pairs.
- Light rail lists the History group; the dark rail in nav-behaviour calls the same group 'Chats'. Which label is current?
