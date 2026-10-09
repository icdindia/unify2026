# Full view of artifacts (editor)

- Journey id: `artifact-full-editor`
- Figma page: Chat + Artifacts (1707:115989), section "Chat" (1707:133527)
- Title card: `8279:221783` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-221783
- Title card text: "Full view of artifacts- for editor"
- Row in Figma: y ~ 13 529, directly below "Artifact view only for viewer and commenters".

Like the viewer row, this is a per-type gallery (App, Spreadsheet, Document, PDF, Markdown, Presentation) of the artifact in full view
for an editor, inside the app shell. Steps are not a click sequence; each is "open artifact of type X in full view".

## Shell state (all steps)

| | |
|---|---|
| Theme | Light content, dark-green collapsed rail |
| Left nav rail | `Main_nav / types=collapsed` (56px, set 226:81201, variants `types=Expanded` / `types=collapsed`). Items top to bottom: logo, New (+), Search, Projects (folder), History (clock), Routines (calendar), Artifacts (selected, highlighted), Add people; avatar "A" at the bottom. |
| Composer | Not present |
| Artifact panel | Full content width (1384 x 900): `Arifact Header` (40px) + canvas |
| Side panel / modal | None |

## Steps

### 01 - App artifact, full view (editor) - header variant "from chat"
- Node: `7809:278865` (frame "118") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865
- Image: `01-7809-278865.png`
- Shows: collapsed dark rail + App artifact full width. Header: back chevron, App icon, "Untitled Applciations" with chevron, "Edit with Chat";
  right side: refresh, "Publish" (secondary), comments split button, download. Canvas: Acme Inc. customer dashboard app.
- Changed from previous: first step. Compared with the full-screen editor (artifact-view-editor-main/01) the app rail is present, the header has
  a back chevron, and copy / zoom / view toggle / version controls are not shown.
- Action that leads here: click an App artifact on the Artifacts landing page (or expand an App artifact from the chat split view).
- Extra state `01a-13155-271308.png` - node `13155:271308` ("Frame 2147266940", 1384 x 40, sits ~63px above the frame) -
  https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13155-271308 - same header with the back button in `State=Hover`.
  Action: hover the back chevron.
- Nearby loose layer: `12191:716323` - `Buttons/Button Neutral / Size=xs, Hierarchy=Tertiary, Icon=Only, State=Default` (chevron-left-sm, 24 x 24)
  floating just above the 01a strip; looks like a spare back button.
- Annotations: none.

### 02 - Spreadsheet artifact, full view (editor)
- Node: `7809:273518` (frame "113") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273518
- Image: `02-7809-273518.png`
- Shows: green xls icon + "Untitled.xls" with chevron; right side: copy (clone), refresh, version dropdown "v3", "Publish", comments split button,
  download, collapse (exit full view), close. Canvas: spreadsheet grid with the "AI Auto Parts App" sheet.
- Changed from previous: type App -> Spreadsheet; no back chevron and no "Edit with Chat"; copy, version dropdown, collapse and close added.
- Action that leads here: open a spreadsheet artifact in full view (e.g. click expand in the chat artifact panel, or open it from the Artifacts list).
- Extra state `02a-12195-302725.png` - node `12195:302725` ("Frame 2147266825", 1384 x 40) -
  https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12195-302725 - the same xls header with a back chevron added on the left
  (name shifts to x 64). Most likely the header when the full view is opened from another page (back returns there).
- Annotations: none.

### 03 - Document artifact, full view (editor)
- Node: `7809:273526` (frame "114") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273526
- Image: `03-7809-273526.png`
- Shows: "Untitled.doc" with the same right-side toolbar as step 02; canvas grey with a centred white page.
- Changed from previous: type Spreadsheet -> Document; canvas grid -> page.
- Action that leads here: open a document artifact in full view.

### 04 - PDF artifact, full view (editor)
- Node: `7809:273538` (frame "115") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273538
- Image: `04-7809-273538.png`
- Shows: "Untitled.pdf", same toolbar, centred page.
- Changed from previous: type icon / name only.
- Action that leads here: open a PDF artifact in full view.

### 05 - Markdown artifact, full view (editor)
- Node: `7809:273550` (frame "116") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273550
- Image: `05-7809-273550.png`
- Shows: "Untitled.md", same toolbar, full-bleed white canvas.
- Changed from previous: type -> Markdown; no page / grey backdrop.
- Action that leads here: open a Markdown artifact in full view.

### 06 - Presentation artifact, full view (editor)
- Node: `7809:273559` (frame "117") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273559
- Image: `06-7809-273559.png`
- Shows: "Untitled.ppt", same toolbar, grey canvas with one wide white slide.
- Changed from previous: type -> Presentation; slide canvas.
- Action that leads here: open a presentation artifact in full view.

## Components (instance main-component names)

| Component | Steps |
|---|---|
| `Main_nav / types=collapsed` (set `Main_nav` 226:81201) | all |
| `Arifact Header` (main 3805:105688, "Artefact Comps") | all |
| `Artifact-Icons / Type=App` (01), `Type=Spreadsheets` (02), `Type=Documents` (03), `Type=PDFs` (04), `Type=Markdowns` (05), `Type=Presentation` (06) | all |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Only` (back, copy, refresh, download, collapse, close; `State=Hover` in 01a) | all |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Default` (name button, "Edit with Chat") | all |
| `Buttons/Button Neutral / Size=xs, Hierarchy=Tertiary, Icon=Default` (version "v3" dropdown) | 02-06 |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Secondary, Icon=Default` (Publish) | all |
| comments split button (`Textarea input field` + `chevron-down-sm`) | all |
| `Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=sm` | 01, 03 |

## Open questions

1. Step 01 (App) has back + "Edit with Chat" but no copy / version / collapse / close; steps 02-06 have the opposite. Is the App header a different
   entry point (opened from the Artifacts list) or just an older frame? Which header should the prototype use for an App in full view?
2. Strip 02a adds a back chevron to the xls header. When exactly is the back chevron shown - only when the full view was reached from another page?
3. The collapse icon (steps 02-06) presumably returns to the chat split view (chat-artifact journey). Confirm the target.
4. "v3" version dropdown here vs the "Versions" submenu in artifact-view-editor-main/01 - same menu? (see header-dropdowns: Version history).
5. JSON and connector types exist in the viewer row but not in this editor row. Do they share the doc / ppt editor layouts?
