# Settings: journey map (DRAFT)

Status: DRAFT 2026-10-09 — inferred from layout. Page `3612:185217` in file `lqKjNjyifEXCeywg69Knr2`. Machine-readable version: `journeys.json` in this folder.

## Layout

- One section, **Settings** (`3612:185218`, 104 direct children). It has 5 title cards: Connectors option 1 (the row splits into 3 sub-journeys), Skills, Get App & Extensions, Memory (6 sub-rows, each named by a text label) and Projects - Settings / Memory. Two parked 30% frames sit at the far right.
- Outside the section, at page level:
  - **Above it:** the parked 30% rows 'Settings / connectors Option 2' and 'Option 3'. They are recorded as ignored options.
  - **To the right (x 32 000 to 62 000):** about 50 loose items: early memory dialogs at 1243x871, older connector options, and modals that belong to other pages.
- Every 'Dashboard' frame is the `58` nav instance with a 'Modal Full Screen' Settings modal over it. The modal has a left nav and the tab content on the right.
- Standing decisions applied: Option 1 only, 1440 baseline, loose frames ignored, and frames at reduced opacity flagged as dimmed.

Figma link pattern: `https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=<A-B>`

## Section: Settings

### Settings / Connectors (option 1): All tab, hover, disconnect, Connected, connector detail, Not Connected

id `connectors`

Card: [3612:185220](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-185220)

1. [`10647:196002`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-196002) **Dashboard** · label: "All / Option 1 (recommended)-": Settings modal > Connectors, All tab: connector list with Connect / Disconnect
2. [`10647:198869`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-198869) **Dashboard** · label: "Hover state": row hover: Disconnect revealed
3. [`10647:200341`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-200341) **Dashboard**: unlabelled state after hover (same copy as hover; likely Disconnect pressed)
4. [`9918:406291`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9918-406291) **Modal Full Screen 1440x800**: confirm dialog 'Disconnect Microsoft OneDrive?' (Cancel / Disconnect)
5. [`10675:205750`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-205750) **Dashboard** · label: "Connected": Connected tab
6. [`14269:733446`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14269-733446) **Dashboard**: connector detail (Back, Microsoft Teams, Disconnect, Tool Permissions: Read only / Needs approval)
7. [`10675:205820`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-205820) **Dashboard** · label: "Not Connected": Not Connected tab

Beside / over the row: [`14075:841152`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14075-841152)

Note: 14075:841152 is a 'Button Tab base' instance placed just above step 1 (tab callout). Reference screenshot 14269:734712 (page level, above the section) matches the connector-detail step 14269:733446.

### Connectors: on a disruption in connection (option 1, Reconnect)

id `connectors-disruption`

Card: [3612:185220](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-185220)

1. [`10675:214174`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-214174) **Dashboard** · label: "on a disruption in connection. Option 1": connection expired: row shows Reconnect
2. [`10675:219889`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-219889) **Dashboard**: expired connector, further down the list (Reconnect); row + menu callouts above

Beside / over the row: [`11750:508846`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11750-508846), [`11750:515608`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11750-515608)

Note: Sub-journey of the connectors row (same card). Callouts above step 2: 11750:508846 'Apps' row (Slack, expired) and 11750:515608 'Dropdown Menu' (Forget / Reconnect).

### Input box dropdown showing an error in connectors

id `connectors-input-error`

Card: [3612:185220](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-185220)

1. [`10179:645699`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-645699) **Copilot Landing page** · label: "Input box dropdown- showing error in connectiors": landing composer '+' menu open (Add photos & files, Web search, Deep research, Company Knowledge, Create Image)
2. [`10179:637832`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-637832) **Copilot Landing page**: connectors submenu with error state + 'Manage Connectors' CTA (cursor)

Note: End of the connectors row; switches to the landing page composer '+' menu.

### Input box connectors submenu: CTA and scroll-bar variants (parked)

id `connectors-input-cta-parked` · **dimmed (30%)**

Card: none

1. [`10179:643777`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-643777) **Copilot Landing page** · label: "CTA? Add connectors?": connectors submenu, 'Add More +5' CTA variant (30% opacity)
2. [`10179:639707`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-639707) **Copilot Landing page** · label: "Scroll bar": connectors submenu with scroll bar (30% opacity)

Note: 30% opacity, far right of the section at the Skills row's height. Same subject as connectors-input-error.

### Updated - Settings / Skills

id `skills`

Card: [14101:122320](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14101-122320)

1. [`14088:847085`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-847085) **9**: Settings > Skills list (12 skills, Add Skill, Skill / Last Updated / Author)
2. [`14101:122322`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14101-122322) **10**: Skills list, second state (copy identical; visual-only change, likely hover)
3. [`14112:231868`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14112-231868) **11**: Skills list with the AI Agent Tooltip (skill detail card) overlaid, cursor

Beside / over the row: [`14112:233252`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14112-233252), [`14112:233282`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14112-233282)

Note: Frames are named 9, 10, 11. 14112:233252 'AI Agent Tooltip' (skill detail: Meetings, When to use, Benefit) + 14112:233282 Cursor are overlaid on step 3. Reference rectangle 'image 1' 14092:853809 sits above the row.

### Updated - Settings / Get App & Extensions (option 1)

id `get-app-extensions`

Card: [6661:524252](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6661-524252)

1. [`7899:234202`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7899-234202) **1** · label: "option 1": Settings > Get App & Extensions (Chrome Extension, Desktop App, Add-In)

Beside / over the row: [`8288:313091`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8288-313091)

Note: Frame named '1'. 8288:313091 'Modal Unit' 960x810 beside it is the full-height modal content (Chrome Extension, Desktop App, Add-In).

### Memory: enable, empty state, import from other AI tools (incl. import into an existing set)

id `memory-enable-import`

Card: [9934:227128](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-227128)

1. [`10136:549616`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-549616) **Dashboard** · label: "Enable Memory": Memory tab, memory off: 'Generate memory from chats' toggle (cursor)
2. [`10136:576334`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-576334) **Dashboard** · label: "Empty state": Memory empty state: 'No files yet', Import memory from other AI providers, Start Import
3. [`10136:580746`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-580746) **Dashboard** · label: "Importing memory from other tools": cursor on Start Import
4. [`10136:581902`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-581902) **Dashboard** · label: "Import Modal": 'Import memory to Unify AI' modal (copy prompt, paste response)
5. [`10136:583550`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-583550) **Dashboard** · label: "Input box max height": import modal with long pasted response (input max height)
6. [`10136:584819`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-584819) **Dashboard**: 'Processing your import'
7. [`10136:589218`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-589218) **Dashboard**: memory list populated (How the week runs, Role and book, ...)
8. [`12188:130566`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12188-130566) **Dashboard**: import modal opened again over an existing memory set
9. [`12188:120965`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12188-120965) **Dashboard** · label: "Loading State - Import memory to existing memories set": processing import into the existing set
10. [`12188:131793`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12188-131793) **Dashboard**: list after import (new item 'Tricon renewal')

Note: Card 'Updated - Settings / Memory' (also carries the link https://es-app-base.vercel.app/app#home). Steps 8-10 (12188:*) are a later addition: importing into an existing memory set.

### Individual memory: hover, open, edit with AI, rename, add details (row has no title)

id `memory-individual`

Card: [9934:227128](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-227128)

1. [`10112:406770`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-406770) **Memory (COMPONENT)**: memory list, populated (component master the instances below derive from)
2. [`9934:230833`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-230833) **Dashboard** · label: "Individual Memory Hover State": hover on an individual memory
3. [`10101:531120`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-531120) **Dashboard** · label: "Edit using AI input box": memory detail 'Role and book' (Summary / Details) with the edit-with-AI input
4. [`10204:707457`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-707457) **Dashboard**: instruction typed in the in-memory AI input
5. [`10101:535957`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-535957) **Dashboard**: 'Looking through this memory' (processing)
6. [`10101:541535`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-541535) **Dashboard**: 'Updated Memory' toast with Undo
7. [`10093:26893`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10093-26893) **Dashboard** · label: "Memory name and summary editing": editing the memory name ('Role and book |')
8. [`10204:698841`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-698841) **Dashboard** · label: "Add more details": editing details
9. [`10204:701397`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-701397) **Dashboard**: editing details, next state

Note: Second row under the Memory card; step 1 is the COMPONENT master 'Memory'.

### Edit using AI input box (from the Memory list), incl. 'No changes were made'

id `memory-edit-ai-list`

Card: [9934:227128](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-227128)

1. [`10190:645881`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-645881) **Memory (INSTANCE)** · label: "Edit using AI input box": instruction typed in the list-level AI input
2. [`10190:650158`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-650158) **Memory (INSTANCE)**: 'Looking through this memory'
3. [`10190:658333`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-658333) **Memory (INSTANCE)**: 'Updated Memory in Profile > Role and book', item shows 'Updated just now'
4. [`11674:411769`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-411769) **Memory (INSTANCE)** · label: "No changes were made - State": 'Hi |' typed (no-op instruction)
5. [`11674:413355`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-413355) **Memory (INSTANCE)**: processing
6. [`11674:415443`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-415443) **Memory (INSTANCE)**: 'No changes were made.'
7. [`11690:440078`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11690-440078) **Frame 2147266967**: 'No changes were made.' expanded with the reason (cursor)

Beside / over the row: [`10190:647477`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-647477), [`11674:413348`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-413348), [`11674:417057`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-417057)

Note: Components are Cursor instances overlaid on steps 1, 4 and 6. Steps 4-7 are the no-op branch.

### Delete Memory

id `memory-delete`

Card: [9934:227128](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-227128)

1. [`10228:716958`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10228-716958) **Dashboard** · label: "Delete Memory": memory list, cursor on an item (row menu)
2. [`10228:779760`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10228-779760) **Dashboard**: delete confirmation dialog over the list
3. [`10228:783563`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10228-783563) **Dashboard**: list after delete + snackbar

### Disable Memory, then Turn off - Pause Memory

id `memory-disable-pause`

Card: [9934:227128](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-227128)

1. [`10136:595120`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-595120) **Dashboard** · label: "Disable Memory": cursor on the 'Generate memory from chats' toggle (turning off)
2. [`10136:598809`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-598809) **Dashboard** · label: "Turn off - Pause Memory": 'Turn off memory' dialog (Pause memory / Reset memory)
3. [`10136:603483`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-603483) **Dashboard**: snackbar 'Memory is paused. Nothing was deleted.'

### Disable Memory, then Turn off - Reset Memory

id `memory-disable-reset`

Card: [9934:227128](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-227128)

Starts from: [`10136:595120`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-595120) (step 1 of `memory-disable-pause`, cursor on the 'Generate memory from chats' toggle)

1. [`10136:633023`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-633023) **Dashboard** · label: "Turn off - Reset Memory": 'Turn off memory' dialog, Reset chosen
2. [`10136:631913`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-631913) **Dashboard**: after reset + snackbar

Note: Branch row: its first column is empty, so it starts from step 1 of memory-disable-pause (10136:595120, row above). Recorded as `startsFrom` (the mirror of the Routines map's `joinsAt`) so that frame stays in exactly one journey.

### Projects - Settings / Memory

id `project-memory`

Card: [10204:714503](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-714503)

1. [`10190:662974`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-662974) **Dashboard 1440x970**: Project page 'Tricon' with project settings and 'View Memory'
2. [`10204:683547`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-683547) **Memory**: Memory modal scoped to the project (Tricon: Gulf expansion ...)
3. [`10204:711988`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-711988) **Dashboard**: project memory detail 'How renewal is framed'

## Ignored options (Option 1 kept)

- **Connectors 'on a disruption in connection. Option 2' (inside the option 1 row)**. Frames: [`10675:217276`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-217276), [`10675:218595`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-218595).
- **Get App & Extensions option 2**. Frames: [`8288:316145`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8288-316145), [`8288:320194`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8288-320194), [`8694:39267`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8694-39267). 8288:316145 is frame '8'; 8288:320194 and 8694:39267 are 960x1073 Modal Units.
- **Settings / connectors Option 2 (whole row, 30% opacity, parked ABOVE the section at page level)**. Card [10675:214170](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-214170). Frames: [`10675:204406`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-204406), [`10647:201632`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-201632), [`10647:202929`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-202929), [`10793:673831`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-673831), [`10793:675248`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-675248), [`10793:675280`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-675280), [`10793:675117`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-675117), [`10793:675151`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-675151), [`10793:675180`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-675180), [`10793:675216`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-675216), [`10793:674177`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-674177), [`10793:673865`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-673865), [`10793:674488`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-674488), [`10793:674800`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10793-674800).
- **Settings / connectors Option 3 (30% opacity, page level above the section)**. Card [10675:214172](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-214172). Frames: [`10558:425637`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10558-425637), [`10675:212860`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10675-212860).
- **Orphan labels 'Option 2- As per prototype' (10647:204239) and 'Hover state' (10675:210847) under the option 1 connectors row, with no frames below them**. Frames: (no frames). Presumably the frames moved into the parked Option 2 row above.

## Loose frames (ignored by default)

| id | name | size | guess |
|---|---|---|---|
| [`14092:853809`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14092-853809) | image 1 (RECTANGLE) | 1745x977 | pasted reference screenshot for Skills |
| [`14269:734712`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14269-734712) | Screenshot 2026-10-06 at 9.53.48 AM 1 (RECTANGLE) | 1051x860 | reference screenshot for the connector detail step 14269:733446 |
| [`9893:418298`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-418298) | Dialog - Settings | 960x723 | Settings dialog with nav General / Memory / Connectors / Skills / Get App & Extension, Memory tab (Profile / Topics / Areas) |
| [`10136:552529`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-552529) | Dialog - Settings | 960x723 | same dialog, 'Memory is paused. Nothing was deleted.' |
| [`9934:223475`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-223475) | Container | 740x723 | memory detail panel (Summary / Details, How the week runs) |
| [`9934:223561`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-223561) | Modal (INSTANCE) | 960x720 | empty modal shell |
| [`9875:81021`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-81021) | UnifyApps | 1243x871 | earlier shell (persona Kiran), no dialog: base of the early memory exploration |
| [`9875:399115`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-399115) | UnifyApps | 1243x871 | early Settings dialog, Memory |
| [`9875:399875`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-399875) | UnifyApps | 1243x871 | early 'Turn off memory' dialog (Pause / Reset) |
| [`9875:400325`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-400325) | UnifyApps | 1243x871 | early 'Memory paused' snackbar with Undo |
| [`9875:400829`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-400829) | UnifyApps | 1243x871 | early memory exploration state |
| [`9875:401390`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-401390) | UnifyApps | 1243x871 | early memory exploration state |
| [`9875:401958`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-401958) | UnifyApps | 1243x871 | early memory exploration state |
| [`9875:402527`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-402527) | UnifyApps | 1243x871 | early memory exploration state |
| [`9875:403641`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-403641) | UnifyApps | 1243x871 | early memory exploration state |
| [`9875:404218`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-404218) | UnifyApps | 1243x871 | early 'Import memory to Unify AI' modal |
| [`9875:404679`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9875-404679) | UnifyApps | 1243x871 | early Settings dialog, Memory |
| [`10136:600391`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-600391) | Dialog | 480x327 | 'Turn off memory' dialog component (Pause memory / Reset memory) |
| [`10101:548623`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-548623) | Modal Unit | 600x470 | 'Import memory to Unify AI' modal component |
| [`10136:602967`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-602967) | Modal Unit | 600x360 | 'Add Text Content' modal (adds text to a project) - Projects |
| [`10101:548663`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-548663) | Modal Unit | 600x360 | 'Add Text Content' modal, second copy - Projects |
| [`10136:603182`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-603182) | Modal Unit | 440x237 | 'Who can view this?' access picker (workspace / everyone / restricted) |
| [`10101:548721`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-548721) | Modal Unit | 440x456 | 'Share Project' modal (copy link, invite, people with access) |
| [`10101:548486`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-548486) | Frame 2147266828 | 560x334 | time picker (Tonight 9:00pm / Tomorrow 6:00am ...) - routines/reminders |
| [`10101:549390`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-549390) | Screenshot 2026-09-17 at 1.10.55 PM 1 (RECTANGLE) | 447x412 | reference screenshot |
| [`8279:340448`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-340448) | Frame 2147266900 | 334x495 | Office Add-In side panel (Excel / PowerPoint / Word / Outlook) - reference for Get App & Extensions |
| [`9893:422543`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-422543) | Content | 600x836 | 'Choose your agents. 6 agents enabled, Continue' - onboarding/agents, another page |
| [`9890:402740`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9890-402740) | Modal Unit | 880x620 | Templates modal (Customer: Discovery, Apply Template) - another page |
| [`9890:402769`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9890-402769) | Modal Unit | 880x620 | Templates modal, new untitled template |
| [`9890:402778`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9890-402778) | Modal Unit | 880x620 | Templates modal, 'Customer: Existing' |
| [`10647:197504`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-197504) | Dashboard | 1440x900 | older connectors list |
| [`9722:237757`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9722-237757) | Dashboard | 1440x900 | older connectors list |
| [`10179:662452`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-662452) | Dashboard | 1440x900 | older connectors list |
| [`10179:658309`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-658309) | Dashboard (20% opacity) | 1440x900 | older 'Hover state option 1-' / 'Vertical three dots' |
| [`10179:654093`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-654093) | Dashboard (20% opacity) | 1440x900 | older hover option 1 |
| [`10558:426931`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10558-426931) | Dashboard | 1440x900 | older 'Hover state option 3 (recommended)-' / 'Tertiary button' |
| [`10566:428240`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10566-428240) | Dashboard | 1440x900 | older 'on user disconnecting' |
| [`10566:430790`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10566-430790) | Dashboard | 1440x900 | older 'on a disruption in connection -1' |
| [`10566:432125`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10566-432125) | Dashboard | 1440x900 | older disruption -1, second state |
| [`10566:510080`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10566-510080) | Dashboard | 1440x900 | older 'on a disruption in connection -2' |
| [`10632:82592`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10632-82592) | Apps (INSTANCE) | 690x56 | connector row callout |
| [`10339:422881`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10339-422881) | Modal Unit | 960x720 | connectors modal, 'hover of option 1' |
| [`10339:423531`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10339-423531) | Modal Unit | 960x720 | connectors modal, 'option 2- dot to show connected' |
| [`10369:424126`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10369-424126) | Modal Unit | 960x720 | connectors modal, 'option 3- just disconnected CTA in tertiary' |
| [`3612:185364`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-185364) | Modal Unit | 960x720 | original connectors modal 'option 1' |
| [`3612:185519`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-185519) | Modal Unit | 960x720 | original connectors modal 'option 2' (+ Tooltip 3622:188509) |
| [`3622:188176`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3622-188176) | Modal Unit | 960x720 | original connectors modal 'option 2a' (+ Dropdown Menu 3622:188331) |
| [`3620:187796`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3620-187796) | Modal Unit | 960x720 | original connectors modal 'option 2b' (+ Dropdown Menu 3620:187950) |
| [`3612:187003`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-187003) | Modal Unit | 960x720 | original connectors modal 'option 2c' |
| [`6817:609830`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6817-609830) | Dashboard | 1440x900 | early connectors list (Connect buttons) |

## Cross-page

- connectors-input-error (10179:645699, 10179:637832) and the parked 10179:643777 / 10179:639707: the landing-page composer '+' menu with its connectors submenu. This continues the Chat + Artifacts composer: header-dropdowns 'Input menu' (6077:427693, 6077:427694) and input-large.
- project-memory 10190:662974: the Project page 'Tricon' with a project settings panel and 'View Memory'. It is the same Project page the shell workflow builds (Chat + Artifacts nav / projects). View Memory opens the Memory modal scoped to the project.
- Memory journeys: memories created in chat (Chat + Artifacts 'new-memory', card 9860:711733) are the items listed and edited here.
- The Settings modal is opened from the 'Settings' item at the bottom of the left rail or from the account menu (Chat + Artifacts nav-light; notification-flow account menu). No frame on this page shows that entry.
- Loose frames for other journeys: Share Project 10101:548721 and 'Who can view this?' 10136:603182 (Chat + Artifacts share-artifact / publish 'who has access'); Add Text Content 10136:602967 (projects); Templates modal 9890:402740 (templates); time picker 10101:548486 (routines); 'Choose your agents' 9893:422543 (agents/onboarding).

## Doubts (each with a proposed default)

**D1.** The Settings modal's left nav differs between rows. Connectors row: General / Data and memory / Connectors / Skills. Skills and Get App rows: the same plus Get App & Extensions. Memory rows: General / Memory / Models / Skills / Get App & Extensions. The two loose 'Dialog - Settings' frames: General / Memory / Connectors / Skills / Get App & Extension. Which list does the prototype use everywhere?

Links: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-196002 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-847085 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-549616 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-418298

Proposed default: One nav on every Settings screen: General, Memory, Connectors, Skills, Get App & Extensions (the loose consolidated dialog). Memory opens the Memory journeys. Models is dropped because no frame designs it.

**D2.** No frame designs the General tab, or Models, which only appears in the Memory rows. What should Settings show when General is clicked, and which tab opens first?

Links: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-549616 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-418298

Proposed default: Settings opens on the tab the journey starts from. General shows a 'not designed yet' stub with the modal chrome, and Models is not shown.

**D3.** Two rows are both labelled 'Edit using AI input box'. One row (10101/10204 ids) edits from inside one memory's detail view and ends with 'Updated Memory / Undo'. The other (10190/11674 ids, newer) edits from the Memory list input and adds the 'No changes were made' branch. Are these two entry points, or is the newer row a replacement?

Links: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-531120 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10204-707457 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-645881 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-411769

Proposed default: Two entry points, both kept: memory-individual (in-detail edit) and memory-edit-ai-list (list-level edit, including the no-op branch).

**D4.** The second Memory row has no title label. It starts with the 'Memory' COMPONENT master 10112:406770 and runs hover, open detail, edit with AI, rename, add details. Is the component master a real step, and is this one journey?

Links: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-406770 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-230833 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10093-26893

Proposed default: One journey, 'Individual memory', with the component master as step 1 (the populated list).

**D5.** Several loose frames on this page seem to belong to other pages' journeys: Share Project (10101:548721), 'Who can view this?' (10136:603182), Add Text Content (10136:602967, 10101:548663), a Templates modal (9890:402740/402769/402778), 'Choose your agents' (9893:422543) and a time picker (10101:548486). Should they be mapped here?

Links: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-548721 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-603182 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9890-402740 · https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-422543

Proposed default: Ignore them here (they are listed under loose). Take them from their home pages; fall back to these frames only if a home page lacks them.
