# Cloned artifact

- Journey id: `cloned-artifact`
- Figma page: Chat + Artifacts (1707:115989), section "Artifacts" (3780:177162)
- Title card: `13750:303578` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-303578
- Title card text: "cloned artifact"
- Row in Figma: same row as Artifacts landing (y 308), to the right of it.

## Shell state

| Step | Theme | Rail | Composer | Artifact panel | Overlay |
|---|---|---|---|---|---|
| 01 | Light | `Main_nav / types=collapsed`, Artifacts selected | no | no (Artifacts landing grid) | card "..." menu |
| 02 | Light | none (artifact full screen) | no | full frame | artifact-name menu |
| 03 | Light | none | no | full frame | inline rename input |

## Steps

### 01 - Clone from the card menu, cloned card appears
- Node: `13750:280936` (frame "1744", 1440 x 1648) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-280936
- Image: `01-13750-280936.png` (exported at 0.95x = 1371 x 1568; the capture tool caps the long side at 1568px)
- Shows: the Artifacts grid. The third card ("Q3 2026 Revenue Forecast & Bud...", Ameer Khan) is hovered with its "..." menu open
  (Pin, Edit with Chat, Clone - checked, Download, Share, Delete). A new 10th card at the bottom: "Q3 2026 Revenue Forecast & Budget
  Reconciliation — Meridian (Cloned)", Atul Jain · now, also showing its "..." button.
- Changed from previous: first step. Vs the Artifacts landing grid the grid now has 10 cards; the clone lands at the end of the grid with the
  current user as author and "now" as time.
- Action that leads here: hover an artifact card, click its "..." button, choose Clone.
- Designer annotations (section-level, drawn over the frame, not inside it so not in the image): `Cursor` 13750:280862 at the Clone item,
  `Cursor` 13750:301889 on the cloned card, and an arrow `Vector 23` (14075:841561) linking menu -> cloned card.

### 02 - Cloned artifact opened, name menu open
- Node: `13750:301988` (frame "1745") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-301988
- Image: `02-13750-301988.png`
- Shows: the cloned artifact full screen. Header: back chevron, document icon, "Q3 2026 Revenue Forecast & Budget Reconciliation — Meridian (Cloned)"
  with chevron, "Start Chat"; right: Excel split button, "Publish", comments split button, download, close. Name menu open: Rename, Clone, Delete.
  Canvas: Acme Inc. dashboard sample image.
- Changed from previous: navigated from the grid into the artifact; the header CTA is "Start Chat" (not "Edit with Chat") because the clone has no chat yet;
  the name menu has no "Versions" entry (a fresh clone has one version).
- Action that leads here: click the cloned card, then click the chevron next to the artifact name.

### 03 - Inline rename
- Node: `13750:302325` (frame "1746") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-302325
- Image: `03-13750-302325.png`
- Shows: the name pill replaced by a text input (about 420px wide) containing "Revenue For|" with a caret; menu closed; rest of the header unchanged.
- Changed from previous: menu closed, name becomes an editable input.
- Action that leads here: click "Rename" in the name menu and start typing.

## Components (instance main-component names)

| Component | Steps |
|---|---|
| `Main_nav / types=collapsed` | 01 |
| `Buttons/Button Brand / Size=md, Hierarchy=Primary, Icon=Default, State=Default` ("New Artifact") | 01 |
| `filter frame / Type=Default` (All / Yours / Shared with you tabs, search, All Types, Newest, grid/list toggle) | 01 |
| `artifacts / Property 1=full image` (card, x8) and `artifacts / Property 1=hover 2` (hovered card, x2) | 01 |
| `Dropdown Menu / Type=Small` (Pin, Edit with Chat, Clone, Download, Share, Delete) | 01 |
| `Arifact Header` (main 3805:105688) | 02 |
| `Dropdown list item` (Start Type=Default, End Type=Shortcut, Selected=On/Off, Divider=True/False, Size=sm/md) | 02 |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Only / Icon=Default`, `Buttons/Button Neutral / Size=sm, Hierarchy=Secondary` (Publish), `coloured logos / Type=excel`, `Textarea input field` (comments split), `chevron-down-sm` | 02, 03 |
| `Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=sm` | 02, 03 |

## Open questions

1. Is the clone appended at the end of the grid (as drawn) or inserted first, given the sort is "Newest"?
2. Does Clone open the clone immediately (step 02) or stay on the grid with a toast? The arrow in Figma only links menu -> new card.
3. "Start Chat" vs "Edit with Chat": confirm the CTA rule (no chat history -> Start Chat).
4. The cloned card shows only a "shared/people" status icon; what are the clone's default visibility and pin state?
5. Rename: commit on Enter / blur, cancel on Esc? Max length and truncation rule (see artifact-view-editor-main: "min 200 px max full name").
