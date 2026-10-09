# Adding users to chat

- Journey id: `add-users`
- Title card: `7900:173519` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7900-173519
- Title card text: "Adding users to chat"
- Figma page: Chat + Artifacts (`1707:115989`), section `7830:372599 Collaborative Chat flow`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

Share Chat modal on a single-user chat ('How does commit actually look?'), the chat-level twin of share-artifact: owner-only state, members added, role dropdown, General access options and role, people search, invite view and multi-user invite. Every share frame is a Dashboard instance (chat page, expanded dark rail) with a 'Dashboard' overlay frame that holds the scrim and modal. Step 02 (9256:468119) is itself a COMPONENT named 'share'.

## Steps

### 01 - 119

- Node: `7830:279834` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7830-279834
- Image: `01-7830-279834.png`
- Shows: Chat page: title 'How does commit actually look?' with chevron, header cost $1.23, Share, clipboard; user question bubble and assistant answer with action row ($0.19, share, like, copy, read aloud, branch, 8 Sources); small bottom composer with Company and Research chips.
- Changed from previous: Start of journey.
- Action that leads here: Open the chat from History / Chats in the rail.
- Designer annotations nearby: none
- Nav state: dark, expanded; New Session selected; a Routines row hovered with 3-dot
- Open surfaces: none; bottom composer visible; no artifact panel
- Components (main component, variant):
  - Dashboard
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - ES Breadcrumb {Variant=Default}
  - Response_Desktop full {Property 1=Assistant}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Dashboard`, `Main_nav`, `Nav_menu/Footer`, `ES Breadcrumb`, `Response_Desktop full`, `Copilot desktop Input Box`

### 02 - share (COMPONENT)

- Node: `9256:468119` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-468119
- Image: `02-9256-468119.png`
- Shows: Share Chat modal with only the owner (Lana Steiner, Owner), General access Restricted and Copy Link.
- Changed from previous: Page dimmed with a scrim; Share Chat modal opens centred over the conversation.
- Action that leads here: Click 'Share' in the chat header.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal open (Share Chat)
- Components (main component, variant):
  - Dashboard
  - Main_nav {types=Expanded}
  - Response_Desktop full {Property 1=Assistant}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
- Component sets: `Dashboard`, `Main_nav`, `Response_Desktop full`, `Copilot desktop Input Box`, `Modal Unit`, `Modal header`, `Modal actions`

### 03 - share

- Node: `12025:773344` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-773344
- Image: `03-12025-773344.png`
- Shows: Share Chat modal now lists Candice Wu and Natali Craig as Commenter (with role dropdowns) under the owner.
- Changed from previous: Two members added to People with access; modal grows taller.
- Action that leads here: Invite two people (invite step not drawn here; see steps 09-11).
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Copilot_User Message_Desktop full {State=Default, Type=Default}
  - Response_Desktop full {Property 1=Assistant}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Modal actions`, `Copilot_User Message_Desktop full`, `Response_Desktop full`

### 04 - share

- Node: `12025:774906` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-774906
- Image: `04-12025-774906.png`
- Shows: Same modal with Candice Wu's 'Commenter' role button in its hover/pressed state (grey background).
- Changed from previous: Only the role button state changes; no menu is drawn.
- Action that leads here: Hover / press the role dropdown on Candice Wu.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Modal actions`

### 05 - share

- Node: `12025:776507` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-776507
- Image: `05-12025-776507.png`
- Shows: General access dropdown open: Restricted (checked), Everyone at UnifyApps, Anyone with the link.
- Changed from previous: General access menu opens below the selector and overflows the modal.
- Action that leads here: Click the 'Restricted' general access selector.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal + general access menu
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Default, Selected=True, Stacking=Double Line}
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Default, Selected=False, Stacking=Double Line} x2
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal Unit`, `Input Menu Dropdown`, `Input dropdown Menu Item`, `Cursor`

### 06 - share

- Node: `12025:779849` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-779849
- Image: `06-12025-779849.png`
- Shows: General access = Everyone at UnifyApps (Anyone signed in to your workspace) with an 'Editor' role button (hovered).
- Changed from previous: Access changes from Restricted to Everyone at UnifyApps and a role selector appears.
- Action that leads here: Choose 'Everyone at UnifyApps'.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Arrow}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Modal actions`, `Cursor`

### 07 - share

- Node: `12025:778160` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-778160
- Image: `07-12025-778160.png`
- Shows: Role menu for workspace access open: Commenter (Comment and view project), Editor (Chat and edit project, checked).
- Changed from previous: Role dropdown opens under the Editor button.
- Action that leads here: Click the 'Editor' role button.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal + role dropdown
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Dropdown Menu {Type=Small}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=On, Size=sm}
  - Dropdown list item {Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=On, Size=sm}
- Component sets: `Dashboard`, `Modal Unit`, `Dropdown Menu`, `Dropdown list item`

### 08 - share

- Node: `12025:781497` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-781497
- Image: `08-12025-781497.png`
- Shows: General access = Anyone with the link (green lock) + Editor; text cursor over 'Invite people and groups'.
- Changed from previous: Access switched to Anyone with the link; pointer moves to the invite field.
- Action that leads here: Pick 'Anyone with the link', then click into the invite field.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Modal header {Type=Default, Size=xs, back=no}
  - Modal actions {Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False}
  - Cursor {State=Text}
- Component sets: `Dashboard`, `Modal Unit`, `Modal header`, `Modal actions`, `Cursor`

### 09 - share

- Node: `12025:783146` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-783146
- Image: `09-12025-783146.png`
- Shows: People search list under the invite field (Aman Baldha, Saurav, Lana Steiner, Demi Wilkinson hovered, Candice Wu, Natali Craig, Drew Cano) with scrollbar.
- Changed from previous: Person picker opens and covers the modal body.
- Action that leads here: Focus / type in 'Invite people and groups'.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
- Open surfaces: modal + people dropdown
- Components (main component, variant):
  - Dashboard
  - Modal Unit
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Default, Selected=False, Stacking=Double Line} x6
  - Input dropdown Menu Item {Size=md, Type=Avatar leading, State=Hover, Selected=False, Stacking=Double Line}
  - Scroll bar {Orientation=Vertical, Bg=False, Position=Top, Size=md}
  - Cursor {State=Pointer Hand}
- Component sets: `Dashboard`, `Modal Unit`, `Input Menu Dropdown`, `Input dropdown Menu Item`, `Scroll bar`, `Cursor`

### 10 - share

- Node: `12025:784845` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-784845
- Image: `10-12025-784845.png`
- Shows: Invite view (back arrow + 'Share Chat'): chips olivia@untitled.com and Phoenix, role selector with menu open (Commenter hovered, Editor checked), Notify people unchecked, message placeholder, Copy Link / Cancel / Invite.
- Changed from previous: Selecting a person switches to the invite view; role menu is open. (The share-artifact journey has an extra 'invite view, menu closed' frame between these two.)
- Action that leads here: Select a person from the list, then click the role selector.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
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

### 11 - share

- Node: `12025:786818` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-786818
- Image: `11-12025-786818.png`
- Shows: Five chips on two rows (Olivia@untitled.com, Phoenix, Natali, Candice, Andi), Notify people checked, message filled, pointer on Invite.
- Changed from previous: More people added, checkbox ticked, message typed; Invite hovered.
- Action that leads here: Add more people, tick Notify people, write a message and click Invite.
- Designer annotations nearby: none
- Nav state: dark, expanded (under scrim)
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
- Order looks non-linear: step 03 already shows two invited members before the invite flow (steps 09-11). Is 03 the result of 11, i.e. should 09-11 come before 03?
- Step 04 shows only the pressed role button with no menu; reuse the share-artifact role menu (Commenter / Editor / Remove Access)?
- No designer annotations sit above these frames (the texts near this row belong to collab-chat).
- Chat share uses the same 'Comment and view project' / 'Chat and edit project' role copy as artifacts. What do Commenter and Editor mean for a chat?
- After Invite, does the chat become a collaborative chat (collab-chat step 01: 'X, Y and Z joined the chat', collaborative composer bar)?
- 'Anyone with the link' subtitle reads 'Only the people above can access it' (same copy issue as share-artifact).
