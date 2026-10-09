# Asset provenance — Artifacts screen

Source: Figma `lqKjNjyifEXCeywg69Knr2` (Enterprise Search Base 2026),
frame `110` `7489:272501`. Exported 2026-09-09.

Nothing here was hand-drawn. See FIGMA-TO-HTML.md §5.

## Type marks — `shared/svg-icons/artifact-*.svg`

Exported from the `Artifact-Icons` COMPONENT nodes, not from the instances.
Multicolour brand marks; exempt from the currentColor rule in `tools/verify.sh`.

| File | Component | Used by |
|---|---|---|
| artifact-documents.svg | `Type=Documents` 7289:49624 | card 1 |
| artifact-markdowns.svg | `Type=Markdowns` 7289:49628 | card 2 |
| artifact-spreadsheets.svg | `Type=Spreadsheets` 7289:49625 | card 3 |
| artifact-applications.svg | `Type=Applications` 7289:49629 | cards 4, 5, 8 |
| artifact-csv.svg | `Type=CSV` 7440:81178 | card 6 |
| artifact-presentation.svg | `Type=Presentation` 7289:49626 | card 7 |
| artifact-pdfs.svg | `Type=PDFs` 7289:49627 | card 9 |

> **Trap 1:** exporting the *instance* returns the `placeholder` slot glyph — an
> identical 399-byte grey circle for all seven. The real marks are
> INSTANCE_SWAPped in, so you must export the component node id.
>
> **Trap 2 — sizing.** The export is cropped to the glyph's **tight bounding
> box**, not to the component frame. Rendering it at the slot size (24x24)
> makes it ~1.5x too big AND squashes the aspect. The `Artifact-Icons` instance
> is a 24x24 slot; the glyph inside is smaller and off-square. Read the child
> group's size and offset from the frame and pin the `<img>` to those:
>
> | Types | glyph | offset in the 24x24 slot |
> |---|---|---|
> | documents · markdowns · spreadsheets · csv · pdfs | 15.541 x 17.143 | 4.205, 3.429 |
> | applications | 19.714 x 14.338 | 2.143, 4.714 |
> | presentation | 19.714 x 16.777 | 2.143, 3.982 |
>
> The exported viewBox aspects confirm the mapping (0.9065 / 1.3750 / 1.1751).
> Every other icon on this screen exported at exactly its placed size
> (14 / 16 / 10, square viewBox) — only component-node exports have this
> problem, because an instance export carries the frame and a component export
> carries the artwork.

## Monochrome icons — normalised to currentColor, inlined in the HTML

`plus` `search-md` `filter-lines` `switch-vertical-02` `lock-01`
`nav-plus` `nav-search-md` `folder` `nav-clock` `calendar` `cube-02-solid`
`nav-ai-agent`. Logo reuses the existing `unify-logo.svg` (same 32x32 glyph).

## Previews — `img/preview-N.png`

One per card, from the `image 17` node's image fill.

> **Trap:** cards 1 and 5 carry TWO image fills and `get_design_context`
> returned the blank one (2.4KB / 4.2KB placeholders). The real uploads came
> from `download_assets` on the card node. Always check a preview actually has
> content before shipping it.

### Crop geometry

`scaleMode: "CROP"` fills carry an `imageTransform` matrix that
`get_design_context` **drops**, emitting `object-bottom size-full` instead. The
matrix converts to CSS as:

```
width  = 100/sx %      left = -(tx/sx)*100 %
height = 100/sy %      top  = -(ty/sy)*100 %
```
for `imageTransform = [[sx,0,tx],[0,sy,ty]]`. Verified: this reproduces the
percentages the MCP emits for the cards where it does emit them (7 and 8) to
three decimal places.

| Card | mode | crop |
|---|---|---|
| 1 | CROP | left -48.005% top -43.913% w 198.364% h 208.988% |
| 2 | CROP | MCP percentages (asset-relative) |
| 3, 4, 6 | FILL | `object-fit: cover` / MCP percentages |
| 5 | CROP | left -39.380% top -94.699% w 174.638% h 329.767% |
| 7, 8, 9 | CROP | MCP percentages |

Cards 1 and 5 use matrix-derived values because their images are the raw
originals; the rest pair the MCP's asset with the MCP's percentages.
