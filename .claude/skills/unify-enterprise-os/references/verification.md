# Verification — mechanical, then visual

Three passes. The first is the gate; the other two catch what geometry cannot.

## Pass 1 — geometry (pass/fail)

Tag elements with `data-node-id` as you build, then:

```bash
# 1. save the get_metadata output to frame.xml
# 2. in the browser, paste scripts/measure_frame.js; save its JSON to measured.json
# 3. diff
python3 scripts/check_geometry.py frame.xml measured.json --root 5975:415910
```

It resolves the parent-relative tree to absolute coordinates and reports every
node whose x/y/width/height differs beyond tolerance.

**The tolerances are deliberately narrow, and it matters.** Measured on a real
build: font advance widths wobble up to **1.53px** between Figma and Google
Fonts, while the most common defect in this pipeline — a CSS `border` where
Figma draws the stroke inside — is exactly **2.00px**. The width threshold sits
at 1.75 between them. An earlier draft used 2.5 "to be safe" and silently passed
an injected stroke defect, which is the failure this whole gate exists to
prevent. Heights and positions stay at 1.0: they are line-height and layout
driven, and should land exactly.

Width deltas between 1.0 and 1.75 are printed as *near tolerance* rather than
hidden, so a genuinely structural 1.6px problem is still visible.

A position shift that is fully explained by a width difference is not counted —
a hug-width, end-aligned node moves its own edge when its text measures
differently. That is font metrics, not drift.

This is what proves the build. On a correct rebuild every block lands exactly,
including blocks scrolled out of view:

```
5975:416086  y   37  h 182   OK
5975:416178  y  219  h 256   OK
5975:416195  y  475  h 132   OK
```

Clipped-out content matching too is a strong signal, because those heights are
content-driven — if padding, gaps or text wrapping were wrong anywhere, they
would not land.

## Pass 2 — pixel difference against the reference render

Geometry cannot see a grey icon that should be orange. Composite your page over
Figma's 1:1 export in `difference` blend and amplify:

```html
<style>
  .stack{position:relative;width:1440px;height:900px;isolation:isolate;filter:brightness(3)}
  .stack img,.stack iframe{position:absolute;inset:0;width:1440px;height:900px;border:0}
  .stack iframe{mix-blend-mode:difference}
</style>
<div class="stack"><img src="_ref.png"><iframe src="index.html" scrolling="no"></iframe></div>
```

A correct build is essentially black. Residual ghosting on text is font
antialiasing and is expected. Anything solid and shaped is a real defect.

Get `_ref.png` from `get_screenshot` at `maxDimension` equal to the frame width
so it is 1:1 — **without** `contentsOnly` (see failure-modes §2).

## Pass 3 — magnified side-by-side for icons and colour

The difference view flags *that* something is wrong; this shows *what*. Clip a
region of both at 4–5x and stack them:

```html
<style>
 .clip{width:1600px;height:190px;overflow:hidden;position:relative;outline:1px solid #555}
 .clip > *{position:absolute;transform-origin:0 0;transform:scale(4) translate(-1040px,0)}
 iframe{width:1440px;height:900px;border:0}
 img.ref{width:1440px;height:900px;image-rendering:pixelated}
</style>
<div class="clip"><img class="ref" src="_ref.png"></div>
<div class="clip"><iframe src="index.html" scrolling="no"></iframe></div>
```

This is how the grey-instead-of-orange ring was found, and how "the nav icons are
missing" was shown to be two icons that are simply hairline-thin in the source.

## Always also check

```js
const i = [...document.images];
({imgs: i.length,
  broken: i.filter(x => !x.complete || x.naturalWidth === 0).length,
  allData: i.every(x => x.src.startsWith('data:'))})
```

`broken: 0` and `allData: true` before handing over. Run it with the file opened
**directly** (`file://`), not only through the dev server — serving it hides the
exact defect this catches.

Then the repo's own checker, which covers token tiers, raw hex, light/dark parity
and tagging:

```bash
./tools/verify.sh
./tools/verify.sh --drift
```

Cache-bust stylesheets before reading `getComputedStyle` (rulebook §11) or you
will verify the previous build.

## Reporting

State what was measured, not that it looks right. A table of Figma-vs-rendered
numbers is worth more than any number of screenshots, and it is the only form of
"done" that survives the next person opening the file.
