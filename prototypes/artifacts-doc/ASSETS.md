# Asset provenance — Artifacts (doc covers)

Source: Figma `lqKjNjyifEXCeywg69Knr2` (Enterprise Search Base 2026),
frame `108` `7433:165911`. Exported 2026-09-09.

Same screen as `prototypes/artifacts/` (frame `110`), same `artifacts` component
set (`a4b0187a8f0bcba9fea71ebbb1a7029982e1c7f5`), different variant family:

| Frame | `Property 1` | Preview |
|---|---|---|
| 110 | `light` | screenshot image per card |
| 108 | `doc` `markdown` `excel` `app` `pres` `CSV` `pdf` | generated gradient cover |

## Shared with the sibling flow

Nav, filter bar, header, lock, avatars, and five of the type marks
(`documents` `markdowns` `spreadsheets` `csv` `pdfs`) are identical components
and reuse the same files.

## New here

| File | Component | Note |
|---|---|---|
| `shared/svg-icons/artifact-app.svg` | `Type=App` **7549:297369** | NOT the same as frame 110's `Type=Applications` 7289:49629 |
| `shared/svg-icons/artifact-presentation-alt.svg` | `Type=Presentation` **7549:297366** | NOT the same as frame 110's `Type=Presentation` 7289:49626 |
| `img/dot-pattern.png` | `image 27`, hash `de34293ed29b` | identical across all nine cards; one file |

> Two components named for the same conceptual type, with different artwork AND
> different glyph geometry, are in use across the two frames. The card atom's
> geometry classes are therefore named for the **component variant**, not the
> file type: `--documents` `--applications` `--presentation` `--app`
> `--presentation-alt`.

> The dot pattern is a 4096x4096 PNG (1.1MB) rendered at 234.588px and 15%
> opacity. Kept at source resolution — downsampling would be a spec change —
> but it is one shared request, not nine.

## Cover geometry and palette

Cover 262x152, padding 2.105, radius 12.628; inner padding `64 / 0 / 0 / 16`,
radius 11.927, `overflow: hidden`; dots 234.588 square at `117.08, -18.74`,
opacity .15; label JetBrains Mono 11/12 at 70%, 198x12, ellipsised.

Each cover is three stacked fills. **Figma paints bottom-to-top, CSS paints the
first layer on top**, so each rule reads scrim → gradient → base.

Gradient angle and stop offsets are derived from the fill's `imageTransform`:

```
angle = atan2(a/W, -b/H)                    for [[a,b,tx],[c,d,ty]]
G     = hypot(a/W, b/H)      tc = a/2 + b/2 + tx
L     = |W·sin(angle)| + |H·cos(angle)|
stop(t) = ((t - tc)/G + L/2) / L
```

Verified against the two groups the MCP emits CSS for — reproduces
`111.69623deg 3.2638% 92.704%` and `110.19055deg 4.5667% 92.188%` to four
decimals — then applied to the third group (`app`, `117.410deg 3.0877%
101.1096%`), which the MCP never rendered.

**Every cover colour is unbound raw hex in the design.** See `DRIFT-LOG.md` §14.
