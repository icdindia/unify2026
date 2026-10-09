# Asset provenance — Artifacts (tinted covers)

Source: Figma `lqKjNjyifEXCeywg69Knr2` (Enterprise Search Base 2026),
frame `111` `7591:300936`. Built 2026-09-09.

Third treatment of the Artifacts screen. Same `artifacts` component set
(`a4b0187a…`) and the same doc-family variants as frame `108`.

| Frame | Cover |
|---|---|
| 110 | screenshot fills the preview box |
| 108 | dark generated gradient + dot pattern + mono filename |
| 111 | flat DS tint + difference-blended dot veil, with a thumbnail laid over it |

## Nothing new was downloaded

All nine thumbnails resolve, by `imageHash`, to preview images already exported
for frame 110 — so `img/preview-1..9.png` are the same assets, and the dot
pattern is the same `de34293ed2` used by frame 108.

| Thumb | hash | = |
|---|---|---|
| `7591:301037` | `6dacee8901` | preview-1 |
| `7591:301038` | `d0c76d59be` | preview-2 |
| `7591:301039` | `ef9a112610` | preview-3 |
| `7591:301133` | `b2682c0154` | preview-4 |
| `7591:301132` | `faa1716161` | preview-5 |
| `7591:301131` | `160f8c09ee` | preview-6 |
| `7591:301140` | `7c865e190b` | preview-7 |
| `7591:301139` | `6a08649b6f` | preview-8 |
| `7591:301138` | `19cba2ab96` | preview-9 |

> **Trap — stacked image fills.** Five of the nine thumbnails carry **two**
> image fills. The first is a stale `6dacee8901` (the DOCUMENT TITLE preview)
> left underneath; the second is the one that shows. Reading `fills.find(IMAGE)`
> returns the wrong one and makes six cards look identical. **Figma paints fills
> bottom-to-top, so the LAST image fill is the visible one** — and its own
> `scaleMode` and `imageTransform` are the ones that apply. The same shape
> caused the "blank preview" problem on frame 110.

## The thumbnail is not part of the card

In the frame each 120x70 thumbnail is a sibling RECTANGLE of the card,
positioned by the row and overlapping the cover — not a child of the card
component. Reproduced with the same ownership: `.card-row__thumb` lives in the
prototype's layout CSS and is positioned against `.card-row`.

Positions relative to the row: `21.151, 69.492` for the first card of row 1,
`21 / 341 / 661, 69` elsewhere (the sub-pixel offsets are the frame's own).

Crops use the same `imageTransform` conversion documented in
`../artifacts-doc/ASSETS.md`, against a 120x70 box. Two of the nine are
`scaleMode: FILL` and become `object-fit: cover`.

## Cover tints — all token-bound

Unlike the frame-108 gradient palette, every tint here resolves to a DS token:
`pigeon-blue-100` `gray-300` `lime-50` `steel-blue-50` `harbor-teal-50`
`brand-50` `warning-50`.

Card 8 is variant `app` but tinted `brand-50` and carries a CSV icon — two
instance-level overrides against its variant, so tint and icon are driven per
card rather than per variant.
