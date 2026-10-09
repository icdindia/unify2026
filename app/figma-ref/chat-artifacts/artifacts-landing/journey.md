# Artifacts landing (empty state -> list -> 1728px -> modal)

- Journey id: `artifacts-landing`
- Figma page: Chat + Artifacts (1707:115989), section "Artifacts" (3780:177162)
- Title card: `3780:177319` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-177319
- Title card text: "Artifacts"
- Row in Figma: y 308, left to right. Annotations above the row: "Empty State " (over step 01), "1728 px" (over step 04),
  "bg colour scheme" (over the reference frame c01, between steps 04 and 05).

## Shell state

| Step | Theme | Rail | Composer | Artifact panel | Overlay |
|---|---|---|---|---|---|
| 01-05 | Light page (#F9F8F6-ish), dark-green rail | `Main_nav / types=collapsed`, Artifacts item selected | no | no | 05: tooltip + filter dropdown + card menus |
| 06 | Grey scrim only (no page drawn) | - | - | - | Delete Artifact modal |
| 07 | Light | collapsed, Artifacts selected | yes (centred "Ask anything...") | no | none |
| 08 | Light | collapsed, Artifacts selected | yes (chat column) | yes - split: chat 441px + spreadsheet artifact | export (Apps) dropdown |

Page layout (01-05): content column 928px wide centred in the 1384px area (x 284-1212 in the frame); title "Artifacts" in Spectral Regular;
"New Artifact" brand button top right.

## Steps

### 01 - Empty state
- Node: `3780:177209` (frame "38") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-177209
- Image: `01-3780-177209.png`
- Shows: "Artifacts" title + "New Artifact" (brand, primary); centred empty state with a three-card illustration, "Create an Artifact",
  "Personalize templates for doc, presentations and data management." and a secondary "+ New Artifact" button.
- Changed from previous: first step.
- Action that leads here: click the Artifacts item in the rail when the user has no artifacts.
- Annotation: "Empty State ".

### 02 - Grid view with artifacts
- Node: `7907:305055` (frame "132", 1440 x 1380) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7907-305055
- Image: `02-7907-305055.png`
- Shows: tabs All (selected) / Yours / Shared with you; right side: search icon, "All Types" filter, "Newest" sort, grid/list toggle (grid on).
  12 cards in a 3-column grid (288 x 266): tinted thumbnail area per type, type label in mono caps (DOCUMENT, APPLICATION, SHEETS, PRESENTATION,
  PDF, MARKDOWN, CSV, FLOW CHART), title (up to 2 lines), author · "2h ago", status icons (pin, lock = private, people = shared, globe = public).
- Changed from previous: empty state replaced by filter bar + card grid; page grows to 1380 tall (scrolls).
- Action that leads here: return to Artifacts after artifacts exist (or create the first one).

### 03 - List view
- Node: `12868:502599` (frame "1729", 1440 x 827) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12868-502599
- Image: `03-12868-502599.png`
- Shows: same header and filter bar, list toggle on. Table with columns NAME (thumbnail + title in Spectral), TYPE (icon + label), STATUS (icon)
  and a sticky "..." action column; rows: Overview brief / Document / private, Next steps longer name / PDF / public, Detailed analysis / Application / shared,
  Annual Event Findings / Presentation / private.
- Changed from previous: grid -> table.
- Action that leads here: click the list icon in the grid/list toggle.

### 04 - 1728px wide grid, search expanded
- Node: `8412:194488` (frame "185", 1728 x 2026) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8412-194488
- Image: `04-8412-194488.png` (exported at 0.77x = 1338 x 1568; the capture tool caps the long side at 1568px)
- Shows: the grid at a 1728px viewport with the search field expanded ("Search" input) left of All Types; 17 cards including JSON, PLAYBOOK, a markdown
  card with an empty-image placeholder (`ai-generate-image`), FLOW CHART and CSV; last row of 2 cards centred.
- Changed from previous: viewport 1728 (content column stays 928 wide, centred); search icon -> search input; more artifact types shown.
- Action that leads here: click the search icon (state) / wider window (layout). Annotation: "1728 px".
- Note: per the agreed decision 1440 is the only baseline; use this frame for the search-expanded state and the extra card types, not for wide layout.

### 05 - Interaction states sheet (tooltip, type filter, card menus)
- Node: `11648:688356` (COMPONENT "186", 1440 x 1380) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-688356
- Image: `05-11648-688356.png`
- Shows four states at once:
  1. "New Artifact" in hover with a dark tooltip "Co-create with an Agent" + shortcut chips (⌘ ⇧ C).
  2. "All Types" filter dropdown open: All Types (checked), Documents, Spreadsheets, Presentations, Applications, PDFs, Emails, JSON, Flow Diagrams, Playbook.
  3. Third card ("Q3 2026 Revenue Forecast & Bud...", Ameer Khan) hovered (`artifacts / Property 1=hover 2`, shows a "..." button) with its menu open:
     Pin, Edit with Chat, Clone, Download, Share, Delete.
  4. A second menu variant for a pinned artifact, placed to the right: Unpin, Edit with Chat, Clone, Download, Share, Delete (Delete hovered).
- Changed from previous: back to 1440 grid; overlays added; third card content changed.
- Action that leads here: hover New Artifact / click All Types / hover a card and click "...".

### 06 - Delete Artifact confirmation
- Node: `12057:581131` ("Modal Full Screen", 1440 x 800) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12057-581131
- Image: `06-12057-581131.png`
- Shows: grey scrim with a 360 x 106 modal: "Delete Artifact" (Spectral), "This will delete the artifact forever. It cannot be undone.", Cancel + Delete (destructive red).
- Changed from previous: page replaced by scrim + modal.
- Action that leads here: click Delete in a card's "..." menu (step 05).

### 07 - New Artifact chat (pick a type)
- Node: `3780:177321` ("Dashboard") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-177321
- Image: `07-3780-177321.png`
- Shows: chat page titled "New Artifact" (breadcrumb) with cost "$1.23", Share, clipboard icon; user bubble "Create a new artifact"; assistant line
  "Let me help you with creating a routine for daily tasks." (copy says routine) and four `Artifact Starters` cards: Spreadsheet (hover, pointer), Presentation,
  Document, Application; composer "Ask anything..." at the bottom (+, model, mic, voice).
- Changed from previous: "New Artifact" opens a new chat seeded with "Create a new artifact" instead of a page.
- Action that leads here: click "New Artifact" on the Artifacts page.
- Note: the frame also holds content below the fold (COT, a Revenue vs Gross Margin chart, suggested prompts, feedback, a "Three apps" banner carousel) that is clipped.

### 08 - Spreadsheet artifact in chat split, export menu open
- Node: `3780:178324` (frame "40") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-178324
- Image: `08-3780-178324.png`
- Shows: chat column ("How does commit actually..." with chevron, $1.23, Share, clipboard) with an assistant answer, a "Pipeline Command" artifact chip
  (Interactive HTML • 123 KB • Version 1), messages from John Whitaker and Grace Coleman, a user message and the composer. Right: spreadsheet artifact
  "Untitled.xls" with the full editor header (Edit with Chat, view toggle, copy, 150%, 888, version arrows, refresh, v3, Excel split, Publish, comments,
  download, expand, close), empty grid, sheet tabs "Sheet1". The Excel split chevron menu (`Apps Dropdown`) is open: OPEN IN Google Sheets / Sharepoint;
  DOWNLOAD Excel (hover) / PDF / CSV; Copy to clipboard.
- Changed from previous: the chosen type generated a spreadsheet artifact that opens in a split next to the chat.
- Action that leads here: pick "Spreadsheet" in step 07 (artifact opens), then click the chevron of the Excel split button in the artifact header.

## Reference (loose frame next to the row)

| # | Node | Image | What it is |
|---|---|---|---|
| c01 | `13750:280568` ("Frame 2147266942", 520 x 1319) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-280568) | `c01-13750-280568.png` | "bg colour scheme": card tint per type (all bound to variables): doc #E9ECF1, sheets #E3EFE1, Presentation #FDE0C8, Markdown #F2F0EE, CSV #F2F0EE, PDF #F6E2E0, Connector (flow) #F7E4DE, Connector (email) #FBE5D0, Application #F6EDF6, JSON #E9ECF1, Playbook #FDF3F4. An older copy (8412:196388) sits underneath. |

## Components (instance main-component names)

| Component | Steps |
|---|---|
| `Main_nav / types=collapsed` (set 226:81201) | 01-05, 07, 08 |
| `Buttons/Button Brand / Size=md, Hierarchy=Primary, Icon=Default, State=Default` (New Artifact; `State=Hover` in 05) | 01-05 |
| `ES Empty State / Level=Level 1, Type=Create` (remote library) | 01 |
| `filter frame / Type=Default` / `filter frame / Type=search click` (04) | 02-05 |
| `artifacts / Property 1=full image` (card) / `artifacts / Property 1=hover 2` (hovered card) | 02, 04, 05 |
| `Col Header Cell / Text=True, Checkbox=False, Size=sm, State=Default, Data Icon=Off`, `Col Header Cell / Text=False, ...` | 03 |
| `Table cell / Style=Avatar with text, Lead=No, State=Default, Size=md`, `Table cell / Style=Icon with text and badge, ...`, `Table cell / Style=Action three dot icon, Lead=No, State=Default / State=Hover, Size=md` | 03 |
| `ai-generate-image` (empty thumbnail) | 04 |
| `Tooltip / Supporting text=False, Arrow=Bottom center` | 05 |
| `Dropdown Menu / Type=Small` (card menus) + `Dropdown list item / Start Type=Default, End Type=Shortcut, Selected=On/Off, ..., Size=sm` (type filter) | 05 |
| `Cursor / State=Arrow`, `Cursor / State=Pointer Hand` | 05, 07, 08 |
| `Modal header / Type=Subtext Single line, Size=xs, back=no`, `Modal actions / Type=Horizontal fill container, Size=xs, Destructive=True` | 06 |
| `ES Breadcrumb / Variant=Default`, `Artifact Starters / Property 1=Spreadsheet / Presentation / Document / Application`, `Copilot desktop Input Box / State=Default, Tools & Sources=No, Line=One line large, Attachment=No`, `COT / Type=Main, State=Default, Running=No`, `All COT / Property 1=1`, `Suggested prompts / Type=Lines`, `Feedback Array / Type=Full screen`, `Banner carousel / Property 1=Three apps` | 07 |
| `Sheets` (main 3272:368879; contains `ES Breadcrumb / Variant=Default`, `Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No`, `Arifact Header`, `Scroll bar`) | 08 |
| `Apps Dropdown` (COMPONENT 12703:449317, lives inside this frame) with `Dropdown list header / Type=H2` and `Dropdown list item` (Excel row `State=Hover`) | 08 |

## Open questions

1. Step 06 has no page under the scrim. Should the delete modal sit over the grid (step 05) with the same scrim colour?
2. After Delete: toast, undo, or the "Deleted artifact" frame (deleted-artifact journey)? Not linked here.
3. Step 07 copy "Let me help you with creating a routine for daily tasks." looks reused from routines; confirm the artifact copy.
4. Step 07 -> 08: the conversation in 08 is a different chat ("How does commit actually look?"), so 08 is not literally the result of 07. Should picking a
   starter open the artifact split with an empty sheet in the same "New Artifact" chat?
5. Tabs Yours / Shared with you and the type filter: should they filter the static data in the prototype? (Filter list includes Emails and Playbook types that have no card in 02.)
6. Card status icons (pin, lock, people, globe): confirm meaning (pinned, private, shared with people, published to org).
7. Grid columns at other widths: 04 keeps a 928px column at 1728. Should the grid add columns on wide screens, or stay 3 columns?
