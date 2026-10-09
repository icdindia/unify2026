# Artifact view only for viewer and commenters

- Journey id: `artifact-view-viewer`
- Figma page: Chat + Artifacts (1707:115989), section "Chat" (1707:133527)
- Title card: `5310:277643` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5310-277643
- Title card text: "artifact view only for viewer and commentors"
- Row in Figma: y ~ 12 425, directly below "Artifact view from main artifact page (editor)".

This row is not a click-through sequence. It is a gallery of the read-only artifact view, one frame per artifact type
(App, Spreadsheet, Document, PDF, Markdown, Presentation, Connector/flow, JSON). Each frame is "open an artifact of type X as a viewer".

## Shell state (all steps)

| | |
|---|---|
| Theme | Light |
| Left nav rail | Not present (artifact full screen) |
| Composer | Not present |
| Artifact panel | Whole frame: `Arifact Header` (40px) + canvas (1440 x 860) |
| Side panel / modal | None |
| Header | Viewer variant: type icon + artifact name only. No "Edit with Chat", no Publish, no version / zoom / view controls. Step 01 adds a Home button on the left; step 03 (doc) adds comments split button + download on the right. |

## Steps

### 01 - App artifact, viewer
- Node: `3838:248160` (frame "1") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3838-248160
- Image: `01-3838-248160.png` (1440 x 900)
- Shows: viewer header with Home icon button, purple App icon and "Untitled Applciations" (typo is in Figma); canvas shows the Acme Inc. customer dashboard app (same sample image as the editor row) with a drag handle under the journey stepper.
- Changed from previous: first step. Compared with the editor view (artifact-view-editor-main/01) the header loses every editing / publishing control.
- Action that leads here: open an App artifact you only have view (or comment) access to, e.g. from the Artifacts landing list or a shared link.
- Extra state: `01a-13155-271422.png` - node `13155:271422` ("Frame 2147266941", 1440 x 40, sits 23px above the frame) -
  https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13155-271422 - the same header with the Home button in
  `State=Hover`. Action: hover the Home icon.
- Annotations: none.

### 02 - Spreadsheet artifact, viewer
- Node: `7767:266191` (frame "2") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7767-266191
- Image: `02-7767-266191.png` (1440 x 900)
- Shows: green spreadsheet icon + "Untitled.xls" with a chevron; canvas is a spreadsheet grid (fx bar, columns A-H, rows 1-35) with the
  "AI Auto Parts App - Daily Operations & Task Summary" sheet.
- Changed from previous: artifact type App -> Spreadsheet; Home button gone; name has a dropdown chevron; canvas is a grid instead of an app.
- Action that leads here: open a spreadsheet artifact as a viewer.
- Annotations: none.

### 03 - Document artifact, viewer / commenter
- Node: `7781:267087` (frame "3") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-267087
- Image: `03-7781-267087.png` (1440 x 900)
- Shows: blue document icon + "Untitled.doc"; right side has the comments split button (speech bubble + chevron) and download; canvas is a
  grey (#F4F3F1-ish) backdrop with a centred white A4-style page (720px wide).
- Changed from previous: type Spreadsheet -> Document; comments + download buttons appear on the right; page-on-grey canvas.
- Action that leads here: open a document artifact (commenter access - the only frame with the comments control).
- Annotations: none.

### 04 - PDF artifact, viewer
- Node: `7781:267978` (frame "4") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-267978
- Image: `04-7781-267978.png`
- Shows: red PDF icon + "Untitled.pdf"; same centred page on grey canvas; no right-side actions.
- Changed from previous: type Document -> PDF; comments + download removed.
- Action that leads here: open a PDF artifact as a viewer.

### 05 - Markdown artifact, viewer
- Node: `7781:268873` (frame "5") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-268873
- Image: `05-7781-268873.png`
- Shows: grey markdown icon + "Untitled.md"; canvas is plain white full width (no page, no grey backdrop).
- Changed from previous: type PDF -> Markdown; page layout replaced by a full-bleed white canvas.
- Action that leads here: open a Markdown artifact as a viewer.

### 06 - Presentation artifact, viewer
- Node: `7781:269768` (frame "6") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-269768
- Image: `06-7781-269768.png`
- Shows: orange presentation icon + "Untitled.ppt"; canvas is grey with a single wide white slide area (16px inset).
- Changed from previous: type Markdown -> Presentation; slide-shaped canvas.
- Action that leads here: open a presentation artifact as a viewer.

### 07 - Connector / workflow artifact, viewer
- Node: `8771:210166` (frame "190") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8771-210166
- Image: `07-8771-210166.png`
- Shows: brick-red connector icon (`Artifact-Icons / Type=connector`) + "Untitled.ppt" (name not updated in Figma); same wide white canvas as step 06.
- Changed from previous: only the type icon changes (Presentation -> connector).
- Action that leads here: open a connector / workflow artifact as a viewer.

### 08 - JSON artifact, viewer
- Node: `10157:575625` (frame "205") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10157-575625
- Image: `08-10157-575625.png`
- Shows: slate JSON icon + "Document.json"; centred white page on grey canvas (same layout as doc / pdf).
- Changed from previous: type connector -> JSON; canvas back to the centred page layout.
- Action that leads here: open a JSON artifact as a viewer.

## Components (instance main-component names)

| Component | Steps |
|---|---|
| `Arifact Header` (main 3805:105688, "Artefact Comps") | all |
| `Artifact-Icons` set: `Type=App` (01), `Type=Spreadsheets` (02), `Type=Documents` (03), `Type=PDFs` (04), `Type=Markdowns` (05), `Type=Presentation` (06), `Type=connector` (07), `Type=JSON` (08) | all |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Default, State=Default` (name button) | all |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Only, State=Default` (Home; `State=Hover` in 01a) | 01, 01a |
| comments split button (`Textarea input field` + `chevron-down-sm`) + download `Buttons/Button Neutral / Icon=Only` | 03 |
| `Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=sm` | 01, 03, 04 |
| Hidden inside the header (not visible): `Toggle group / Type=Default, Style=Icon only, Size=xs`, `Label`, `Encryption / Eye=True`, `Help icon` | - |

## Open questions

1. Viewer vs commenter: only the Document frame (03) shows the comments split button + download. Is that the commenter variant, and should every type show comments + download for commenters?
2. Why does only the App frame (01) have a Home button? Is Home shown for every type when the artifact is opened from a shared link (no app shell around it)?
3. Step 07 is labelled "Untitled.ppt" but uses the connector icon. Confirm the intended name/extension for a connector / workflow artifact.
4. Should the spreadsheet name chevron (step 02) open a menu for viewers? Which items (Clone / Versions / Download)?
5. The canvases for doc / pdf / md / ppt / json are empty. Is real sample content expected in the prototype, or is the blank page the spec?
