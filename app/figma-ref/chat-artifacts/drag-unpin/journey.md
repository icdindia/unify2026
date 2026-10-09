# Drag chats to unpin

- Journey id: `drag-unpin`
- Title card: `11661:516352` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-516352
- Title card text: "drag chats to unpin"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

A pinned item can be dragged out of the rail's Pinned group; while it is outside, a 'Release to unpin' tooltip follows the cursor, and on release the item returns to its home group (here Routines).

## Steps

### 01 - Copilot Landing page

- Node: `11671:666296` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-666296
- Image: `01-11671-666296.png`
- Shows: 'Plan launch timeline' being dragged (grabbed cursor, lifted row with hover bg and 3-dot) over the Routines group with a dark tooltip 'Release to unpin'.
- Changed from previous: Start of journey; the dragged row floats over Routines and the Pinned slot it left is filled by a highlighted row.
- Action that leads here: Press and drag the pinned chat 'Plan launch timeline' down out of the Pinned group.
- Designer annotations nearby: "Tooltip text: Release to unpin"
- Nav state: dark, expanded
- Open surfaces: drag ghost + tooltip; no menus
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Main {Variant=Expanded, State=Hover} (dragged row 'Nav 8')
  - Small Icon Button {Size=md, State=Default}
  - dots-horizontal
  - Cursor {State=Grabbed}
  - Tooltip {Supporting text=False, Arrow=None}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
- Component sets: `Main_nav`, `Nav_menu/Main`, `Small Icon Button`, `dots-horizontal`, `Cursor`, `Tooltip`, `Nav_menu/Footer`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`

### 02 - Copilot Landing page

- Node: `11671:670376` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-670376
- Image: `02-11671-670376.png`
- Shows: After release: Pinned now holds Artifacts, Project Name, Review customer feedback; 'Plan launch timeline' sits second in Routines with hover background and 3-dot.
- Changed from previous: Pinned group shrinks by one row; the item is inserted into Routines; tooltip and grab cursor gone (pointer hand).
- Action that leads here: Release the mouse outside the Pinned group.
- Designer annotations nearby: none
- Nav state: dark, expanded
- Open surfaces: none
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Cursor {State=Pointer Hand}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
  - Banner carousel {Property 1=Three apps}
- Component sets: `Main_nav`, `Nav_menu/Footer`, `Cursor`, `EB-Assistant/AI`, `Copilot desktop Input Box`, `Banner carousel`

## Open questions
- Step 01 shows 'Review customer feedback' twice in Pinned (one highlighted at the vacated slot). Is the highlighted slot meant to be an empty drop placeholder?
- Unpinned item lands in Routines, i.e. its home group, not where it was dropped. Confirm the rule (return to home group, sorted by recency?).
- Where exactly does 'Release to unpin' start: as soon as the cursor leaves the Pinned group bounds?
