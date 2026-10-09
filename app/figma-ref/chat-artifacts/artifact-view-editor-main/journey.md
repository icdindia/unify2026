# Artifact view from main artifact page (editor)

- Journey id: `artifact-view-editor-main`
- Figma page: Chat + Artifacts (1707:115989), section "Chat" (1707:133527)
- Title card: `3838:249357` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3838-249357
- Title card text: "artifact view from main artifact page - for editor"
- Row in Figma: y ~ 11 322 (directly below the "Chat journey with Artifact" row), cards left to right.

## Shell state (all steps)

| | |
|---|---|
| Theme | Light |
| Left nav rail | Not present. The artifact is opened full screen (no app rail, no chat column). |
| Composer | Not present |
| Artifact panel | The whole frame is the artifact: `Arifact Header` (40px) + canvas |
| Side panel | None |
| Modal / menus | Step 01: artifact-name dropdown + Versions submenu open. Step 03: tooltip. |
| Widths | Step 01 = 1440 x 900. Steps 02-03 = 787 x 900 (narrow header behaviour). |

The dashboard inside the canvas ("Acme Enterprise", ARR / NRR / NPS / Adoption / Renewal prob. KPI cards, Customer journey stepper,
Health / Journey / Strategy / Intelligence / Actions tabs, Overall usage chart) is a single image fill, not live layers.
It is sample artifact content, not part of the product chrome.

## Steps

### 01 - Full artifact view, name menu + Versions submenu open
- Node: `5310:276790` (frame "77") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5310-276790
- Image: `01-5310-276790.png` (1440 x 900)
- Shows: the artifact opened full screen from the Artifacts page with the complete editor header (file icon + name chevron, "Edit with Chat",
  preview/code toggle, copy, zoom "150%", page stepper "888", version back/forward, refresh, Excel export split button, "Publish",
  comments split button, download, close). The name chevron menu is open (Rename, Clone, Versions >, Delete) and the Versions submenu lists
  "All header icons for reference.xls - Today - Latest", "Artifact name 1 - Yesterday - 14:14", "Artifact name 2 - 3 days ago - 08:12".
- Changed from previous: first step of the row (entry from the Artifacts landing list).
- Action that leads here: click an artifact card on the Artifacts landing page (opens the artifact full screen), then click the chevron next to the
  artifact name in the header and hover "Versions".
- Annotations next to the frame: "all header icons for reference" (above the frame) and "min 200 px max full name • 40 pixel between button and name"
  (directly above the header).
- Notable layers: `Group 1171274971` (222,40, 477 x 186) = `Menu items` + `Version History` frames; `Drag Handle` rectangle at 493,414 (8 x 44).

### 02 - Narrow (787px) artifact view, name truncated
- Node: `7418:305665` (frame "106") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7418-305665
- Image: `02-7418-305665.png` (787 x 900)
- Shows: the same artifact at 787px wide. The header keeps only file icon + truncated name ("all header i..." + chevron), "Edit with Chat",
  Excel split button, "Publish", comments split button, download, close. Canvas reflows to the narrow dashboard layout.
- Changed from previous: width 1440 -> 787; menus closed; view toggle, copy, zoom, page stepper, version arrows and refresh are dropped from the
  header; the name truncates with an ellipsis.
- Action that leads here: no click - the window / artifact pane is resized to ~787px (responsive state of step 01).
- Annotation next to the frame: "truncate after 40 px gap min".

### 03 - Narrow view, tooltip with full artifact name
- Node: `7418:305917` (frame "107") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7418-305917
- Image: `03-7418-305917.png` (787 x 900)
- Shows: the narrow view with the name pill hovered and a dark tooltip (arrow top-left) showing the full name
  "all header icons for reference all header icons for reference chmbXcbmXMBZC mxsbz cmbX .xls".
- Changed from previous: name pill in hover state; `Tooltip / Supporting text=False, Arrow=Top left` added under it.
- Action that leads here: hover the truncated artifact name in the header.
- Annotation next to the frame: "tooltip".

## Components (instance main-component names)

| Component | Where | Steps |
|---|---|---|
| `Arifact Header` (main 3805:105688, lives in the "Artefact Comps" frame; no component properties) | top 40px bar | 01, 02, 03 |
| inside it: `Artifact-Icons / Type=Documents`, `Buttons/Button Neutral` (Size=sm/xs, Hierarchy=Tertiary, Icon=Default/Only, State=Default/Hover), `ai-star`, `Toggle group / Type=Default, Style=Icon only, Size=xs` with `_Toggle group base` (eye, code-01), `copy-01`, `chevron-left-sm` / `chevron-right-sm` / `chevron-down-sm`, `refresh-ccw-02`, `download-01`, `coloured logos / Type=excel`, `Small Icon Button`, `Help icon`, `Label`, `Encryption / Eye=True` (hidden input bits) | header | 01-03 |
| `Dropdown list item` (Start Type=Default, End Type=Shortcut/Icon, Selected=On/Off, Divider=True/False, Supporting Text=On/Off, Size=sm/md) | name menu + Versions submenu | 01 |
| `Tooltip / Supporting text=False, Arrow=Top left` | name tooltip | 03 |
| `Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=sm` | canvas scroll | 01-03 |

Component sets seen: `Dropdown list item`, `Buttons/Button Neutral`, `Toggle group`, `_Toggle group base`, `Artifact-Icons`, `coloured logos`, `Tooltip`, `Scroll bar`, `Small Icon Button`, `Help icon`.

## Open questions

1. Is 787px a viewport breakpoint, or the width of the artifact when it sits in a split pane next to the chat? The task baseline is 1440 only;
   should the 787 header be implemented as the "< N px" responsive rule?
2. At narrow width the view toggle, copy, zoom, page stepper, version arrows and refresh simply disappear. Should they move into an overflow menu?
3. Step 01 has a `Drag Handle` (8 x 44) floating on the canvas at x 493. Is that a resizable split handle in full-page view, or a leftover from the chat split layout?
4. What does picking a version in the Versions submenu do - swap the canvas in place, or open the Version history panel (see header-dropdowns journey)?
5. Rename / Clone / Delete: Rename is shown inline elsewhere (chat-artifact "edit name" state); Clone leads to the cloned-artifact journey; Delete to the deleted-artifact frame. Confirm these links.
