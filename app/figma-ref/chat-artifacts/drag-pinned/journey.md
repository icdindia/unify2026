# Drag pinned items (items below get 5% alpha bg)

- Journey id: `drag-pinned`
- Title card: `11671:679050` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-679050
- Title card text: "drag pinned items / the states below the dragged one will have bg with 5% alpha"
- Figma page: Chat + Artifacts (`1707:115989`), section `1707:133527 Chat`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

Re-ordering inside the rail's Pinned group by drag and drop. The dragged row lifts (hover bg, grabbed cursor); per the card note, rows below the dragged one get a 5% alpha background while dragging.

## Steps

### 01 - Copilot Landing page

- Node: `11661:517917` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-517917
- Image: `01-11661-517917.png`
- Shows: 'Project Name' row picked up (grabbed cursor, hover bg, folder icon, 3-dot) and offset slightly downward so it overlaps its own slot and 'Plan launch timeline' beneath it.
- Changed from previous: Start of journey; dragged row floats over the list, original slot still faintly visible underneath.
- Action that leads here: Press and hold on the pinned 'Project Name' row and start dragging down.
- Designer annotations nearby: "Card note: the states below the dragged one will have bg with 5% alpha"
- Nav state: dark, expanded
- Open surfaces: drag ghost only
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Main {Variant=Expanded, State=Hover} (dragged row 'Nav 8')
  - folder
  - Small Icon Button {Size=md, State=Default}
  - dots-horizontal
  - Cursor {State=Grabbed}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Nav_menu/Main`, `folder`, `Small Icon Button`, `dots-horizontal`, `Cursor`, `Nav_menu/Footer`, `EB-Assistant/AI`, `Copilot desktop Input Box`

### 02 - Copilot Landing page

- Node: `11671:661281` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-661281
- Image: `02-11671-661281.png`
- Shows: Dragged 'Project Name' now hovering between 'Plan launch timeline' (moved up, shows a small ring status icon) and 'Review customer feedback'.
- Changed from previous: 'Plan launch timeline' slides up into the vacated slot; the drag ghost sits one row lower.
- Action that leads here: Keep dragging down past the next pinned item.
- Designer annotations nearby: none
- Nav state: dark, expanded
- Open surfaces: drag ghost only
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Main {Variant=Expanded, State=Hover} (dragged row 'Nav 8')
  - folder
  - Small Icon Button {Size=md, State=Default}
  - dots-horizontal
  - Cursor {State=Grabbed}
  - Nav_menu/Footer {Variant=Default, State=Default}
- Component sets: `Main_nav`, `Nav_menu/Main`, `folder`, `Small Icon Button`, `dots-horizontal`, `Cursor`, `Nav_menu/Footer`

### 03 - Copilot Landing page

- Node: `11671:662888` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-662888
- Image: `03-11671-662888.png`
- Shows: Dropped: Pinned order is Artifacts, Plan launch timeline, Project Name (hover bg + 3-dot), Review customer feedback.
- Changed from previous: Ghost settles into the new slot; cursor back to pointer hand.
- Action that leads here: Release the mouse to drop.
- Designer annotations nearby: none
- Nav state: dark, expanded
- Open surfaces: none
- Components (main component, variant):
  - Main_nav {types=Expanded}
  - Nav_menu/Footer {Variant=Default, State=Default}
  - Cursor {State=Pointer Hand}
  - EB-Assistant/AI
  - Copilot desktop Input Box {Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Nav_menu/Footer`, `Cursor`, `EB-Assistant/AI`, `Copilot desktop Input Box`

## Open questions
- The 5% alpha background on rows below the dragged one is described on the title card but is not visible in these frames. Which rows get it and with what colour (white 5% on the dark rail?).
- In step 03 the dropped 'Project Name' row has no folder icon and is not indented like other pinned items. Is that a drawing slip?
- 'Plan launch timeline' gains a small ring icon at its left in steps 02-03 but not in step 01. Intended?
