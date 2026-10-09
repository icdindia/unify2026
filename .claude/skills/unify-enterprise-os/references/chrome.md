# Shared chrome — nav rail, breadcrumb, composer

These repeat on every Enterprise OS screen and are the most frequently rebuilt
wrong. Values below were read from the file and verified pixel-for-pixel against
Figma's 1:1 export. Still confirm against the frame you are on: the active nav
item, the breadcrumb contents and the avatar set change per screen.

---

## Main_nav — 56px rail, full frame height

```css
.main-nav__inner{
  width:56px; overflow:hidden;
  display:flex; flex-direction:column; align-items:center;
  background-image:
    linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%),
    linear-gradient(90deg, rgb(17,45,6) 0%, rgb(17,45,6) 100%);
}
```

Two stacked gradients, not a flat colour. They composite to **`#0c2004`** — if a
sampled pixel reads `#0c2004`, the rail is right.

- `Navigation`: fixed `height:900px`, `padding:12px 0`, `gap:16px`, column,
  `align-items:flex-start`. Fixed at 900 even when the frame is taller.
- Logo block: `width:32px`, `padding-top:6px`, `padding-bottom:2px`.
- **Logo = 22 stacked concentric SVGs** at sub-pixel offsets, smallest first,
  32×32 last. They are separate exports; positions are in the design context and
  must be copied exactly. Broken images here render as nested squares and read as
  a wrong logo — a good early smoke test that assets resolved.
- Item list: `gap:4px`, `padding:0 10px 12px`, `align-items:center`.
- Item: `32×32`, `padding:8px`, `border-radius:8px`, `overflow:hidden`, icon `16×16`.
- Active item: `background: rgba(255,255,255,0.17)`. Exactly one is active, and
  **which one changes per screen** — read it, do not copy from the last build.
- Footer: `position:absolute; bottom:0; left:0; width:56px; height:52px;`
  `border-top:1px solid rgba(255,255,255,0.15)`, `padding:0 10px`.
  Avatar `32×32`, `border-radius:9999px`, `background: rgba(255,255,255,0.2)`,
  letter `13px/20px` weight 500, `rgba(255,255,255,0.7)`.

**Known source inconsistency:** `cube-02` and `ai-agent` export with no
`stroke-width` (so `1`), while `plus`, `search-md`, `folder`, `clock` and
`calendar` carry `1.25`. Those two therefore look hairline and get reported as
"missing". They match Figma exactly — do not silently "fix" them; raise it and
let the user decide.

---

## ES Breadcrumb — full width, 40px tall

```
background: #fbfaf9 (utility-brand-secondary-25)
padding: 6px 12px          -> 6 + 28 + 6 = 40
```

Every control inside settles to 28px tall, which is what makes the bar 40:

- title button `padding:4px`, text `13px/20px` weight 500
- `$…` button `padding:6px 8px 4px`, label **Spectral SemiBold 14px/18px**
  (the one serif in the bar), icon 14
- Share `padding:6px 8px`, `13px/16px` weight 500, icon 14
- icon buttons `padding:6px`, icon 16
- avatar group: 24px circles, `border:1px solid #fff`, `margin-right:-4px`
  except the last

The cost-loader ring is **`#d37c25` (`border-warning-solid`)**, not the grey the
export hands you — see failure-modes §4.

In the split layout the breadcrumb sits inside the 440px left panel, not across
the top; same component, `text-overflow:ellipsis` on the title.

---

## Composer — 760px wide (or panel width), 48px tall

```
padding: 8px 10px 8px       -> 8 + 32 + 8 = 48, stroke NOT counted
border: use inset ring, not `border`   (failure-modes §1)
border-radius: 9999px
```

Row is 32px tall: leading `+` and pill buttons `padding:8px` with 16px icons,
placeholder `15px/26px` in `text-placeholder`, trailing three `padding:8px`
buttons with 16px icons, `gap:4px`.

In the wide chat layout the composer sits in a 760×76 frame at the bottom with a
**bottom-anchored fade**, not a flat fill:

```css
background-image: linear-gradient(to top, #fbfaf9 55.054%, rgba(251,250,249,0) 67.3%);
padding-bottom: 28px;   /* 76 - 28 = 48 */
```

---

## Message column

`760px` wide, `justify-content:flex-end` so the conversation is bottom-anchored
and older content overflows upward.

Do **not** clip it — the COT rows are 788px wide and hang 32px past the left
edge; the avatars live in that overhang. Vertical clipping comes from the frame
plus the opaque breadcrumb painting over the top 40px. See failure-modes §3.
