# Share or invite collaborators to your Artifacts

- Journey id: `share-artifact`
- Title card: none in the file
- Title card text: "Share or Invite collaborators to your Artifacts (heading text node 1819:331035 above the row; no title-card frame)"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

Share Artifact modal opened over a collaborative chat ('How does commit actually look', header Share button). Covers member role dropdown, General access (Restricted / Everyone at UnifyApps / Anyone with the link) and its role, searching people to invite, the invite sub-view (chips, role, Notify people, message) and the multi-user state. Every frame = Dashboard instance (chat page) + 25% black scrim (Rectangle 5645) + Modal Unit. Frame names in Figma: 18, 192, 20-27 (26 = 12264:347642). Heading link: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-331035

## Steps

### 01 - 18

- Node: `1819:316164` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316164
- Image: `01-1819-316164.png`
- Shows: Share Artifact modal (440px) over the dimmed chat: 'Invite people and groups' field, People with access (Lana Steiner owner, Candice Wu and Natali Craig as Commenter with dropdowns), General access 'Restricted - Only the people above can access it', full-width Copy Link button.
- Changed from previous: Start of journey; chat page dimmed by a 25% scrim and modal centred.
- Action that leads here: Click 'Share' in the chat header (or the Share action on the artifact card).
- Designer annotations nearby: "Share modal"
- Nav state: dark, collapsed icon rail
- Open surfaces: modal open (Share Artifact); chat composer visible under scrim; header shows participant avatars M/J/G, cost $1.23, Share, clipboard icon
- Components (main component, variant):
  - Dashboard
  - Main_nav {types=collapsed}
  - Component 2 {Type=Icon only}
  - Nav_menu/Main {Variant=Collapsed, State=Default}
  - Nav_menu/Footer {Variant=Collapsed, State=Default}
  - ES Breadcrumb {Variant=Default}
  - Copilot desktop Input Box {State=Default, Tools & Sources=No, Line=One line large, Attachment=No, Pill=No}
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Input dropdown_outline {Size=lg, Type=Default, State=Placeholder}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
- Component sets: `Dashboard`, `Main_nav`, `Component 2`, `Nav_menu/Main`, `Nav_menu/Footer`, `ES Breadcrumb`, `Copilot desktop Input Box`, `Modal Unit`, `Modal header`, `Input dropdown_outline`, `Modal actions`

### 02 - 192

- Node: `9256:470679` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-470679
- Image: `02-9256-470679.png`
- Shows: Role dropdown open on Candice Wu: Commenter (Comment and view project, checked), Editor (Chat and edit project), divider, Remove Access (red).
- Changed from previous: Candice Wu's role button gets a pressed background and a role menu opens under it. Header participant avatars are no longer shown.
- Action that leads here: Click the 'Commenter' role dropdown on a member row.
- Designer annotations nearby: "User dropdown"
- Nav state: dark, collapsed
- Open surfaces: modal + role dropdown menu
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Input dropdown_outline {Size=lg, Type=Default, State=Placeholder}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=True, Supporting Text=Off, Size=md}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=Off, Size=sm}
  - check
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Input dropdown_outline`, `Dropdown list item`, `check`, `Modal actions`

### 03 - 20

- Node: `1819:316249` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316249
- Image: `03-1819-316249.png`
- Shows: General access dropdown open below 'Restricted': Restricted (checked), Everyone at UnifyApps (Anyone signed in to your workspace), Anyone with the link (Anyone on the internet with the link), each with a tinted icon.
- Changed from previous: Role menu closed; general-access menu opens and overflows the modal's bottom edge, covering Copy Link.
- Action that leads here: Click the 'Restricted' general access selector.
- Designer annotations nearby: "General access dropdown"
- Nav state: dark, collapsed
- Open surfaces: modal + general access menu (Input Menu Dropdown)
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Default, Selected=True, Stacking=Double Line}
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Default, Selected=False, Stacking=Double Line} x2
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Input Menu Dropdown`, `Input dropdown Menu Item`, `Modal actions`, `Cursor`

### 04 - 21

- Node: `1819:316290` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316290
- Image: `04-1819-316290.png`
- Shows: General access set to 'Everyone at UnifyApps - Anyone signed in to your workspace' with a building icon and a new role button 'Editor' on the right (hovered).
- Changed from previous: Access level changes from Restricted to Everyone at UnifyApps; a role selector (Editor) appears for the workspace-wide access.
- Action that leads here: Choose 'Everyone at UnifyApps' in the general access menu.
- Designer annotations nearby: "General access dropdown"
- Nav state: dark, collapsed
- Open surfaces: modal
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Arrow}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Modal actions`, `Cursor`

### 05 - 22

- Node: `1819:316329` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316329
- Image: `05-1819-316329.png`
- Shows: Role menu for 'Everyone at UnifyApps' open: Commenter (Comment and view project), Editor (Chat and edit project, checked, hovered).
- Changed from previous: Small role dropdown opens under the Editor button, overlapping Copy Link.
- Action that leads here: Click the 'Editor' role button next to Everyone at UnifyApps.
- Designer annotations nearby: "Everyone at UnifyApps - Dropdown"
- Nav state: dark, collapsed
- Open surfaces: modal + role dropdown
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Dropdown Menu`, `Dropdown list item`, `Modal actions`, `Cursor`

### 06 - 23

- Node: `1819:316373` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316373
- Image: `06-1819-316373.png`
- Shows: General access now 'Anyone with the link' (green lock icon) with Editor role; text cursor hovering the 'Invite people and groups' field.
- Changed from previous: Access switched to Anyone with the link; role menu closed; pointer moves to the invite field.
- Action that leads here: Pick 'Anyone with the link' in the general access menu, then hover/click into the invite field.
- Designer annotations nearby: none
- Nav state: dark, collapsed
- Open surfaces: modal
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Text}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Modal actions`, `Cursor`

### 07 - 24

- Node: `1819:316429` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316429
- Image: `07-1819-316429.png`
- Shows: People picker dropdown under the invite field listing workspace users with avatar, name and email (Aman Baldha, Saurav, Lana Steiner, Demi Wilkinson hovered, Candice Wu, Natali Craig, Drew Cano) and a scrollbar.
- Changed from previous: Focusing the invite field opens a scrolling person list that covers the rest of the modal body.
- Action that leads here: Click into 'Invite people and groups' (optionally start typing a name).
- Designer annotations nearby: "Search for a person to invite"
- Nav state: dark, collapsed
- Open surfaces: modal + people search dropdown
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Default, Selected=False, Stacking=Double Line} x6
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Hover, Selected=False, Stacking=Double Line}
  - Scroll bar {Orientation=Vertical, Bg=False, Position=Top, Size=md}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Input Menu Dropdown`, `Input dropdown Menu Item`, `Scroll bar`, `Modal actions`, `Cursor`

### 08 - 25

- Node: `1819:316471` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316471
- Image: `08-1819-316471.png`
- Shows: Invite sub-view: back chevron + 'Share Artifact', chip field with 'olivia@untitled.com' and 'Phoenix' plus a Commenter role selector, 'Notify people' checkbox (off), personalised message textarea (placeholder), footer Copy Link / Cancel / Invite.
- Changed from previous: Modal switches from the access list to the invite form (header gains a back arrow, modal shrinks to content height).
- Action that leads here: Select a person from the picker (adds a chip and opens the invite form).
- Designer annotations nearby: "After user selection — Invite box with message"
- Nav state: dark, collapsed
- Open surfaces: modal (invite view)
- Components (main component, variant):
  - Dashboard
  - Modal header {Type=Default, Size=xs, back=yes}
  - Checkbox {Checked=False, Indeterminate=False, Size=sm, Type=Checkbox, Text=True, State=Default, Hint Text=False}
  - Textarea input field {Type=Default, Destructive=False, State=Placeholder}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
- Component sets: `Dashboard`, `Modal header`, `Checkbox`, `Textarea input field`, `Modal actions`

### 09 - 26

- Node: `12264:347642` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12264-347642
- Image: `09-12264-347642.png`
- Shows: Invite view with the role dropdown open next to the chips: Commenter (hovered) and Editor (checked).
- Changed from previous: Role selector pressed and its menu opens over the message box.
- Action that leads here: Click the 'Commenter' role selector in the chip field.
- Designer annotations nearby: none
- Nav state: dark, collapsed
- Open surfaces: modal (invite view) + role dropdown
- Components (main component, variant):
  - Dashboard
  - Modal header {Type=Default, Size=xs, back=yes}
  - Checkbox {Checked=False, Indeterminate=False, Size=sm, Type=Checkbox, Text=True, State=Default, Hint Text=False}
  - Textarea input field {Type=Default, Destructive=False, State=Placeholder}
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal header`, `Checkbox`, `Textarea input field`, `Dropdown Menu`, `Dropdown list item`, `Modal actions`, `Cursor`

### 10 - 27

- Node: `1819:316531` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316531
- Image: `10-1819-316531.png`
- Shows: Multiple users: five chips wrap onto two lines (Olivia@untitled.com, Phoenix, Natali, Candice, Andi), Notify people checked, message filled ('Hey team! I've shared the new dashboard prototype...'), pointer on Invite.
- Changed from previous: More chips added (field grows to two rows), checkbox ticked, message typed; Invite hovered.
- Action that leads here: Add more people, tick Notify people, type a message, then click Invite.
- Designer annotations nearby: "Multiple users state"
- Nav state: dark, collapsed
- Open surfaces: modal (invite view)
- Components (main component, variant):
  - Dashboard
  - Modal header {Type=Default, Size=xs, back=yes}
  - Buttons/Button Neutral {Size=md, Hierarchy=Tertiary, Icon=Only, State=Default}
  - Checkbox {Checked=False, Indeterminate=False, Size=sm, Type=Checkbox, Text=True, State=Default, Hint Text=False}
  - Textarea input field {Type=Default, Destructive=False, State=Filled}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Buttons/Button Neutral {Size=sm, Hierarchy=Tertiary, Icon=Default, State=Default}
  - Buttons/Button Neutral {Size=sm, Hierarchy=Secondary, Icon=Default, State=Default}
  - Buttons/Button Brand {Size=sm, Hierarchy=Primary, Icon=Default, State=Default}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal header`, `Buttons/Button Neutral`, `Checkbox`, `Textarea input field`, `Modal actions`, `Buttons/Button Brand`, `Cursor`

## Open questions
- What happens after Invite (toast? return to the access list with the new people added?). No post-invite frame exists.
- Step 06 'Anyone with the link' keeps the subtitle 'Only the people above can access it'; the menu in step 03 says 'Anyone on the internet with the link'. Which copy is right?
- Role descriptions say 'Comment and view project' / 'Chat and edit project' inside the Share Artifact modal. Should they say artifact?
- Step 09: selector reads Commenter but the check mark is on Editor. Which is the default invite role?
- Step 10's Notify people checkbox uses the Checked=False variant in Figma but renders ticked (override); confirm default is unticked.
- Chips in step 08 (olivia@untitled.com, Phoenix) do not match the person hovered in step 07 (Demi Wilkinson); free-text emails are accepted as chips?
- Header participant avatars (M J G) show in step 01 but are absent from steps 02-10.
- Is Remove Access (step 02) confirmed with a dialog or applied immediately?
