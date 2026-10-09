# Failure modes — each one shipped, was reported, and had to be re-done

Ordered by how much rework they caused. Every code example is real.

---

## 1. Stroke alignment is per-node, not a global rule

`FIGMA-TO-HTML.md` §5b says "Figma strokes are drawn INSIDE the frame". That is
true often enough to be dangerous: applied blanket, it makes every bordered card
2px too small. In one frame both behaviours appeared four nodes apart.

**The test — compare the first child's offset to the padding.** `get_metadata`
gives you both.

| Child offset | Meaning | CSS |
|---|---|---|
| `child.x == padding` | stroke NOT in layout | `box-shadow: inset 0 0 0 1px …` |
| `child.x == padding + strokeWidth` | stroke IS in layout | `border: 1px solid …` |

Equivalently on size: if `reported == padding*2 + content` the stroke is free; if
`reported == padding*2 + content + 2` it is a real border.

Worked examples from one file:

```
Canvas 1809:488550   927×884, first child at x=0, width 927   -> inset ring
Dash frame 1809:488589  927 wide, image 19 at x=17 (16+1)     -> real border
Composer 7372:140068    reported 760×48; 8+32+8 = 48          -> inset ring
Filter row controls     reported 28; 6+16+6 = 28              -> inset ring
Artifact card           288×275 with 286×273 content          -> real border
```

Getting this wrong is silent: the page still renders, every row below drifts, and
the screenshot still looks plausible. `check_geometry.py` catches it immediately.

---

## 2. `contentsOnly: true` strips the frame's background fill

Cost: the whole chat screen shipped on white instead of `#fbfaf9`, and was
defended as "the frame carries no fill" because the isolated render came back
with alpha 0.

`get_screenshot` with `contentsOnly: true` is for excluding floating siblings
parented to the page — it is **not** a neutral render. Never read a background
from it.

To read a background: render the frame (or an inner frame) *normally*, download
the PNG, and sample pixels. Frame fills often sit on a child, so sample the node
that actually paints:

```python
from PIL import Image
im = Image.open('frame.png').convert('RGBA')
print(im.getpixel((150, 400)))   # body area, away from content
```

`contentsOnly: true` remains the right call for one job: proving whether an
element you can see in the canvas render actually belongs to the frame. A
dropdown that vanished under it turned out to be parented to the page, and was
correctly left out of the build.

---

## 3. Do not apply `overflow: hidden` reflexively to scroll containers

Cost: all four chat avatars invisible, reported by the user as "agent icon and
other user icon missing".

Figma's "clip content" is one flag for both axes, so it is natural to assume a
clipped column clips horizontally too. In this design system the COT rows are
**788px wide inside a 760px column, deliberately overhanging 32px to the left**,
and Figma does not clip them. The vertical clipping came from the *frame* plus an
opaque breadcrumb painting over the top 40px — not from the container.

Before writing `overflow: hidden`, check whether any child is wider than its
parent or has a negative offset:

```
All COT   x=-32  width=788   parent 760   <- overhangs; must not be clipped
```

When you need vertical clipping only, get it from the frame's own `overflow` plus
whatever opaque sibling paints over the top. CSS cannot do `overflow-x: visible`
with `overflow-y: hidden` anyway — if one axis is not `visible`, the other is
forced to `auto`. Reproducing Figma's compositing order is the correct fix, not
fighting the box.

---

## 4. Icon exports silently lose instance overrides

Happened twice, two different ways:

- Type icons exported as the **component's placeholder arrow** instead of the
  swapped glyph (5 of 9 cards).
- A cost-loader ring exported with the component's default `stroke="#6A6662"`
  instead of the instance's `#d37c25`.

Neither fails loudly. Both look like plausible design.

**Detection — an unused token is a red flag.** `border-warning-solid: #d37c25`
sat in `get_variable_defs` and was referenced nowhere in the build. That is the
tell. After building, list tokens you never used and account for each one.

**Confirmation — scan the reference render for the colour:**

```python
for y in range(0, 40):
    for x in range(1000, 1440):
        r, g, b = im.getpixel((x, y))
        if abs(r-0xd3) < 12 and abs(g-0x7c) < 12 and abs(b-0x25) < 12:
            print('found at', x, y)
```

**Fix — re-fetch the icon by its full instance path**, not the parent:
`get_design_context` on `I7907:306509;7907:308030;36241:8146` returned the real
glyph plus the nested inset (`inset[14.29% 17.73% 14.29% 17.52%]`) that the
parent export had flattened away. Reproduce that inset wrapper too, or the icon
lands at the wrong size.

---

## 5. `whitespace-nowrap` on text that has a `max-width`

Figma emits `whitespace-nowrap` for any auto-width text node. Where the same node
also carries `max-w-[608px]`, the max-width is the real constraint and the design
shows the text wrapping. Keep `nowrap` and the bubble runs off the screen.

Rule: `nowrap` + `max-w-[…]` together → drop the `nowrap`. `nowrap` alone on a
short label → keep it.

`w-[min-content]` + `min-w-full` resolves to `100%`; either spelling is fine.

---

## 6. Ship self-contained HTML

Relative `assets/…` paths resolve when served and break when the file is opened
directly or rendered as a preview snapshot — which is how the user will open it.
Every image turns into a broken-image box; 22 stacked logo SVGs became a stack of
nested squares, which reads as "you built the wrong logo".

Download and commit the bytes (URLs expire), then inline with
`scripts/inline_assets.py` before handing over. Keep `assets/` as the source of
record. Google Fonts is the one acceptable external reference.

---

## 7. `get_metadata` positions are parent-relative

Nested `y=128` under a parent at `y=28` is absolute `156`. This looks like a
mismatch against a correct build and invites a "fix" that breaks it.
`check_geometry.py` resolves the tree for you — use it rather than adding
offsets by hand.

---

## 8. Variable values differ per frame and per mode

`bg-workspace` resolved to `#ffffff` in one frame's table and `#fbfaf9` in the
next, and the actual painted fill matched neither table entry in the first case.
Pull `get_variable_defs` per frame, and where a fill matters, confirm it against
a normal render (§2) rather than trusting the table.
