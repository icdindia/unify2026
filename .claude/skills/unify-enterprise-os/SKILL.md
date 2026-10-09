---
name: unify-enterprise-os
description: >
  Build and verify Unify Enterprise OS screens in both directions — Figma → HTML and
  HTML → Figma. Use this whenever a figma.com URL for a Unify / Enterprise Search /
  Enterprise Brain screen appears, when the user says "make an HTML of this frame",
  "recreate this frame", "without altering anything", "don't eyeball", "push this to
  Figma", or when a rebuilt screen comes back with the wrong nav rail, spacing,
  colours, headers, background, icons or avatars. Also use it before touching
  anything under Unify2026/ (components/, prototypes/, figma-frames/, shared/).
  It routes to the repo rulebooks, bundles the asset + measurement scripts, and
  carries the per-node traps that have each already cost a full rebuild.
---

# Unify Enterprise OS — screen pipeline

The two rulebooks in the repo root are the law. This skill is the entry point: it
tells you which one to read, bundles the scripts that otherwise get rewritten by
hand every run, and carries the corrections that were learned *after* those
rulebooks were written.

| You are going | Read | Then |
|---|---|---|
| Figma → HTML | `FIGMA-TO-HTML.md` + `shared/DRIFT-LOG.md` | the workflow below |
| HTML → Figma | `HTML-TO-FIGMA.md` | load the `figma-use` skill before any `use_figma` call |

Read `references/failure-modes.md` **before writing CSS** — every item in it is a
defect that shipped, was reported by the user, and had to be re-done. Several of
them contradict a reasonable first instinct, which is exactly why they recur.

## Two rules everything else serves

**1. Every number and colour comes from the file.** Not from a screenshot, not
from a reasonable default, not from "that looks like 16". When the user says
"don't eyeball", they are describing the failure mode that keeps happening, not
being fussy. If a value genuinely cannot be read, say so and mark it — §2.1.2 of
the rulebook (pitfall 7b: *7 of 7 surface properties guessed this way were wrong*).

**2. Nothing is done until it is measured.** A screenshot that "looks right" has
hidden 2px drift, a clipped avatar and a grey icon that should be orange — all
three happened in one build. The geometry checker below turns that from a
judgement call into a pass/fail.

## Figma → HTML, step by step

**1 — Resolve the node and pull the tree.**
`get_metadata` on the frame, saved to a file. Large frames make
`get_design_context` return a sparse tree instead of code (rulebook pitfall 8) —
that is not an error, it is the signal to walk the tree and fetch subtrees.

**Positions in that XML are parent-relative.** Nested `y=128` under a parent at
`y=28` is absolute `156`, not `128`. Misreading this once nearly "corrected" an
already-correct element. The checker in `scripts/` resolves this for you.

**2 — Pull design context per subtree**, not per screen. Retry on timeout; the
desktop Dev Mode server and the remote plugin server both drop out, and they are
interchangeable — if one is unavailable, use the other rather than stopping.

**3 — Pull `get_variable_defs` and declare every token as a CSS variable**, then
reference it. Literals record a measurement; variables record a decision (§3.3).
Variable values are **per frame and per mode** — the same token name resolved to
`#ffffff` in one frame and `#fbfaf9` in the one beside it. Never carry a token
table between frames, and never trust a token table over the rendered fill.

**4 — Download and commit every asset.** `scripts/fetch_assets.py`. Figma's URLs
expire in ~7 days (pitfall 9). Never hand-draw an icon (pitfall 1).

**5 — Build with exact geometry**, resolving each stroke with the test in
`references/failure-modes.md#1`. Do not apply `overflow:hidden` reflexively — see
`#3` there.

**6 — Verify mechanically, then visually.** `references/verification.md`. This is
the step that gets skipped under time pressure and is the only reason the defects
above were ever found.

**7 — Inline the assets before handing it over.** `scripts/inline_assets.py`.
A page that references `assets/…` renders as a grid of broken-image boxes the
moment anyone opens the file directly instead of serving it — which is how the
user will open it. This is delivery, not polish.

## Bundled scripts

| Script | Use |
|---|---|
| `scripts/fetch_assets.py` | download an asset manifest, verify none are empty or HTML error pages |
| `scripts/inline_assets.py` | rewrite `src="assets/…"` to base64 data URIs; makes the file standalone |
| `scripts/measure_frame.js` | paste into the browser; dumps every `data-node-id` box relative to the frame |
| `scripts/check_geometry.py` | diff that dump against the Figma metadata XML — the pass/fail gate |

Tag every element with `data-node-id` as you build. It costs nothing and it is
what makes `check_geometry.py` able to check anything at all.

## Chrome that is identical on every screen

The nav rail, breadcrumb and composer repeat on every Enterprise OS screen and
are the most frequently rebuilt-wrong parts. Exact values in
`references/chrome.md` — read it rather than re-deriving them, but still confirm
against the frame you are on, because the active nav item and the breadcrumb
contents change per screen.

## When the user reports something is wrong

Check it against the file before agreeing or defending. In this pipeline the
report has been right and wrong in roughly equal measure, and both were useful:

- *"background is wrong"* → correct; an isolated render had hidden the fill.
- *"icons are missing"* → the named icons were present and faithful; the real
  defect was a different icon, two rows away, silently exported in the wrong
  colour. Taking the report literally would have missed it; dismissing it would
  have missed it too.

Reproduce, measure, then report what you actually found — including when that is
"this matches the file, and here is the proof, but I found something else."
