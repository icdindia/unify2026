# DRIFT LOG

Every place the built HTML knowingly departs from a clean token/atom mapping.
Each row is a question for the DS owner, not a decision the agent made alone.

Generated during: **Agent Dashboard** build (Figma `16740:306222`, file
`jcbxvaNrZCWeQsIiZRta6F` — UnifyApps Platform (1)(2) 2026), 2026-09-09.

## 1. Stale token export

| Token | Live Figma | `ds/tokens` (25-Jun export) | Action |
|---|---|---|---|
| `Component/Nav Bar/navbar-bg` | `#efebe5` | `#f2f0ee` (aliased to `utility-gray-100`) | Corrected in `shared/tokens.live-overrides.css`. The exported **alias target** is wrong, not just the value. Re-stage `ds/tokens/semantic.json`. |

57 of the 58 non-primitive tokens on this screen matched the export exactly
(`python3 tools/check-drift.py`). The export is broadly trustworthy — but not
authoritative. `get_variable_defs` on a live node is.

## 2. Design binds a primitive (no semantic exists)

| Where | Bound variable | Gap |
|---|---|---|
| Nav rail item hover + active (`16740:306223`) | `Palette/Alpha Colors/Black/alpha-black-05` | No `nav-item-bg-hover` / `nav-item-bg-active` component token. The design reaches past the semantic layer into the palette. DS should promote it. |

Used as-is with an on-line `DRIFT` marker so `tools/verify.sh` reports it as a
warning every run instead of letting it go quiet.

## 3. Off-scale typography

| Where | Figma renders | Nearest DS style | Note |
|---|---|---|---|
| `Stat` number (`16740:306247` et al) | JetBrains Mono **Bold 14/20** | `Text sm/Bold-Code` = **13/20** | Held at 14px to match the design. DS needs a 14px code style, or the design should restate at 13. |
| `Stat` label | JetBrains Mono **Regular 11/12** uppercase | `Text xxs/Regular-Code` | The export records that style's family as **Geist**, contradicting its own `-Code` name. Treated as a stale export row and rendered mono. Re-probe text styles. |

## 4. Dark-mode contrast below WCAG AA

Measured in-browser on the built page. **Light mode: 0 failures.** Dark mode:

| Element | fg | bg | Ratio | Needs |
|---|---|---|---|---|
| `.stat__value--success` ("12.9s") | `#016b1d` | `#151414` | **2.73** | 3.0 |
| `.pill--squared.pill--error` ("Block") | `#b72318` | `#250705` | **2.94** | 4.5 |

Both are DS **dark palette** pairings, not composition errors — the screen was
specified in light mode only. The dark counterparts of `utility-success-600`
and `utility-error-600` are too dark against their own `-25` surfaces.
**Do not fix locally by inventing a colour** — this needs a DS dark-palette
decision.

## 5. Unverified measurements — RESOLVED 2026-09-09

The container frames `16740:306245`, `306302`, `306396`, `306430` were
unreachable on the first pass (Figma desktop tab had changed;
`get_design_context` returned *"No node could be found"*). They were
approximated from the screen capture and flagged here.

**Re-probed with the tab active. The approximation was wrong on seven counts.**
All are now at fetched values:

| # | Approximated from screenshot | Actual (live Figma) | Node |
|---|---|---|---|
| 1 | card has `1px border-secondary` | **no border at all** — separation comes from internal dividers | `306245`, `306396`, `306430` |
| 2 | `radius-md` (8px) | **`radius-4xl` (12px)** | all four |
| 3 | Governance is one card | **two sibling cards**, gap 8 (`306306` alert+stats, `306333` alert+rows) | `306302` |
| 4 | working area is white | **`bg-workspace` (#fbfaf9)** — white cards float on a tint, per `design-rules §2` | `306237` |
| 5 | "SLA 8.0s" is a light gray pill | **inverted**: `utility-gray-600` bg / `utility-gray-50` text | `306300` |
| 6 | Advisory stat is success-toned | **error-toned** (`text-error-primary-600`) | `306329` |
| 7 | banner reads "…your agent's information here." | **"…your agent's performance here."** | `306238` |

Also corrected from the same probe: stat height `40px`; stats-row padding is
`12px` vertical with the `16px` inset on the card, not on the row; row divider
is `border-tertiary`; card divider line is `#EDEBE8` = `border-secondary`;
alert `min-height 32` (an earlier `max-height: 36` would have clipped the
46px wrapping alert in `306399`); rail section gap is `24`, main column `32`.

**The lesson, recorded because it was expensive:** reading a surface off a
screenshot felt reliable and was wrong about the majority of what it touched —
including things that look unambiguous, like whether a card has a border. A
screenshot cannot show you a `0px` border on a light background, cannot
distinguish `8px` from `12px` radius, and cannot tell one card from two. When a
node cannot be fetched, **mark it and re-probe** — do not spend the effort
making a careful guess. See `FIGMA-TO-HTML.md §2.1`.

## 6. `.app-shell` paints `bg-primary`; the frame binds `bg-workspace` — 2026-09-09

Found by the token diff in `HTML-TO-FIGMA.md` §12.3, running the reverse
direction. Not visible in either a screenshot or a browser render.

**What the source actually does** — three nested frames, each owning one thing:

| Node | Fill | Stroke | Radius |
|---|---|---|---|
| `Dashboard` `16740:306222` | **`bg-workspace`** #fbfaf9 | raw 1px | 8 |
| `Frame 2147266146` `16740:306237` | none | `border-secondary` 1px | 12 |
| `Working area` `16740:306239` | **`bg-workspace`** #fbfaf9 | none | 0 |

**What the built CSS does:**

```css
.app-shell    { background: var(--colors-background-bg-primary); }    /* #ffffff  ← DRIFT */
.working-area { background: var(--colors-background-bg-workspace);    /* #fbfaf9  ✓ */
                border: 1px solid var(--colors-border-border-secondary);
                border-radius: var(--radius-4xl); overflow: hidden; }
```

`.working-area` is **correct** — a faithful flattening of `306237` (border +
radius + clip) and `306239` (fill) into one element. No action needed there.

The single drift is the shell: the design tints the whole canvas
`bg-workspace` and the HTML paints it `bg-primary`.

**Where it shows.** The shell is not fully covered. `.app-content` insets the
working area by `spacing-xl`, so a 16px band of shell frames it on three sides,
and the page-header block above it sits directly on the shell. Those areas
render `#ffffff` where the design says `#fbfaf9`.

**Why nobody caught it.** #ffffff vs #fbfaf9 is a ~2% luminance step on a warm
neutral. It is below the threshold of a side-by-side screenshot comparison, and
`tools/verify.sh` has no notion of *which* semantic token a surface should
carry — only that it carries one. Entry §5's re-probe read `306237` (no fill)
and concluded the working area was where the tint lived; it read the right node
for the border and the wrong node for the fill, and the mistake was invisible
because `306239` immediately below it supplies the same colour.

**Fix (not applied — touches layout CSS and wants a browser check in both
themes):**

```css
.app-shell { background: var(--colors-background-bg-workspace); }
body       { background: var(--colors-background-bg-workspace); }
```

**The lesson, sharpening §5's.** §5 concluded "when a node cannot be fetched,
re-probe it." This one *was* fetched — and still wrong, because a single node
was read in isolation and its siblings assumed. A colour is owned by a specific
node; verify the owner, not just the value. Read `fills` and `boundVariables`
across the whole ancestry, in both directions.

---

# Artifacts screen — Enterprise Search Base 2026

Frame `110` `7489:272501`, file `lqKjNjyifEXCeywg69Knr2`. Built 2026-09-09.
A different product file from the Agent Dashboard, but the same
❖ Unify2026 Design System — 57 of the 58 tokens this screen needs resolved
against `shared/tokens.css` unchanged.

## 7. Two published colour libraries with colliding variable names

The single worst finding on this screen, and invisible without reading ids.

The `artifacts` card binds `Colors/Text/text-secondary (700)` **twice, to two
different variables**:

| Node | Collection | Variable id | Resolves |
|---|---|---|---|
| card title `…;7489:176064` | `1. Colors` `19c8d7fd…` | `ad5f2765…` | **#424242** |
| card author `…;7489:272517` | `1. Colors` `58acf142…` | `78e0064f…` | **#4a4745** |

`58acf142…` is the ❖ Unify2026 DS collection this repo mirrors. `19c8d7fd…` is
a *second* published library with the same collection name and the same variable
names, bound inside the same component. `get_variable_defs` reports one value
for the name (#424242) and silently hides the collision.

Rendered literally in `components/artifact-card/artifact-card.css` — the title
as `#424242` with a DRIFT marker, the author via the token. **Action for the DS
owner:** this is not a token drift, it is two libraries fighting. Find which one
the card component should bind and unbind the other.

## 8. `Text lg/Medium` export is wrong in family AND line-height

| | family | size | line-height |
|---|---|---|---|
| live Figma text style | **Spectral** Medium | 17 | **20** |
| `ds/tokens` export → `--text-lg-medium-*` | Geist | 17 | 28 |

The card title uses this style. Stated literally in the atom until
`ds/tokens/typography.json` is re-staged. Same class of failure as §1: the
export is broadly right and specifically wrong, and only a live read finds it.

## 9. One preview tint is an unbound literal

Card 8 `7489:272660` fills its preview canvas with a raw `#f4effa` where the
other violet cards bind `utility-royal-violet-25` — the same colour. Rendered
via the token (identical output); logged so the designer can bind it.

## 10. The two Filter Tabs bind different border tokens

`All` binds `border-secondary`, `Recently Updated` binds `border-tertiary`
(`7489:272510`). Reproduced as-is; looks unintentional.

## 11. Alpha-whites and the nav scrim have no semantic tokens

`Main_nav` needs white at .17 (active item), .20 (avatar), .15 (footer rule) and
.70 (avatar letter), plus a flat 30% black scrim over `utility-brand-500`. The
DS exposes alpha whites only as `--palette-alpha-colors-white-*` PRIMITIVES, and
.17/.15 have no entry at all. Stated literally with DRIFT markers rather than
laundered into a semantic (pitfall 11). The scrim has no token of any tier.

## 12. Re-sync after the designer's header/type revision — 2026-09-09 (later)

Re-read the frame after the design changed. Three deltas, and one earlier entry
partly resolves.

| What | Was | Now |
|---|---|---|
| `artifacts` card top padding | 16 (`spacing-xl`) | **12** (`spacing-lg`) |
| card title text style | `Text lg/Medium` | **`Text lg/Semibold`** — Spectral SemiBold 17/20 |
| card title colour | `text-secondary (700)` #424242, **wrong library** | **`text-primary (900)` #201f1e, correct library** |
| card height / content column | 226 / 878 | **222 / 866** |

Unchanged and re-verified: page title (`Display md/Regular`, Spectral Regular
36/44 at −2%), head 104 = 44 + 32 + 28, the Small Icon Button still absolute at
`236,-8`, and the type-mark glyph geometry (15.541x17.143 at 4.205,3.429 etc.).

**§7 is half fixed.** All nine card titles now bind
`Colors/Text/text-primary (900)` from the ❖ Unify2026 DS collection
(`e4b660b9…`) — the second colour library is gone from the title. The `+N`
overflow label still binds `Colors/Text/text-quaternary (500)` from the other
library (`2c0fbccb…`, #8f8a85, where the DS token is #9f9993). One binding left
to clean up.

**§8 moves rather than resolves.** The export bug follows the style: where
`Text lg/Medium` exported as Geist 17/28 against a live Spectral 17/20, the new
`Text lg/Semibold` exports as **Geist 600 17/28** against a live **Spectral
SemiBold 17/20**. Same wrong family, same wrong line-height. This is not a
per-style typo — the whole `Text lg/*` group in `ds/tokens/typography.json`
looks like it was staged from the wrong family. Worth re-staging the group, not
just the one row.

## 13. Card title is now a DETACHED type style — 2026-09-09 (later still)

`textStyleId` is **null** on all nine card titles. The design no longer binds
`Text lg/Semibold`; it states the treatment locally:

```
Spectral SemiBold · 17px · 20px line-height · -2% tracking
```

Rendered as `font-family: var(--font-family-display); 17px; 600; 20px;
letter-spacing: -0.02em` (-0.34px at 17px), verified on all nine.

This reclassifies §8. It is no longer "the export of `Text lg/Semibold` is
wrong" — that style simply isn't bound any more, so nothing in `ds/tokens`
governs this text. It is now a **DS gap**: the card title is a display-face
treatment with negative tracking that has no style to bind to. The nearest named
style (`Text lg/Semibold`) is Geist 600 17/28 at 0% — wrong family, wrong
line-height, wrong tracking.

**Action for the DS owner:** add a display-face card-title style (Spectral
SemiBold 17/20, -2%) so nine detached overrides can be re-bound. Until then the
values live in `components/artifact-card/artifact-card.css` with line-level
DRIFT markers, and any change to them has to be made in code as well as Figma.

> Note the tracking is load-bearing, not cosmetic: at -2% "Enterprise policy &
> compliance hub" re-flows from breaking after "&" to breaking after
> "compliance". Titles are clamped to 2 lines at 232px, so tracking changes
> which titles truncate.

---

# Artifacts (doc covers) — frame `108` `7433:165911`

## 14. The generated cover palette is entirely untokenised

Seven cover treatments, three fills each (base + gradient + scrim). **Not one of
the 21 colours is bound to a DS variable** — all raw hex:

| Variant | base | gradient end | scrim |
|---|---|---|---|
| doc | `#3870a8` | `#001932` | black 50% |
| markdown · CSV | `#4c4c4c` | `#000000` | black 30% |
| excel | `#27be7f` | `#12583b` | black 50% |
| app | `#5531a8` | `#0a0010` | black 50% |
| pres | `#e66305` | `#622900` | black 30% |
| pdf | `#aa0202` | `#470014` | black 50% |

Only `#3870a8` coincides with an existing token (`utility-steel-blue-400`); the
rest have no equivalent. Rendered literally with line-level DRIFT markers rather
than binding the one that happens to match, which would imply the palette is
tokenised when it isn't.

**Action for the DS owner:** if generated covers are a real feature, this needs
a `Colors/Cover/*` group. Seven hard-coded treatments in a published component
will drift the moment anyone themes the product.

## 15. Two components per conceptual type, across two frames

`Type=App` (`7549:297369`, frame 108) and `Type=Applications` (`7289:49629`,
frame 110) are different components with different artwork and different glyph
geometry. Same for `Type=Presentation`: `7549:297366` in 108,
`7289:49626` in 110.

Consequence for the code: the card atom's icon-geometry classes are named for
the **component variant**, not the file type — `--documents`, `--applications`,
`--presentation`, `--app`, `--presentation-alt`. A name like `--presentation`
alone would have silently rendered the wrong glyph at the wrong size in one of
the two prototypes.

Worth asking the designer whether the duplication is intentional or whether one
set is stale.

---

# Artifacts (tinted covers) — frame `111` `7591:300936`

## 16. Stacked image fills: the last one is the one you see

Five of the nine thumbnails on this frame carry **two** image fills. The lower
one is a stale `6dacee8901` (the DOCUMENT TITLE preview) sitting under the real
image. Taking the first IMAGE fill renders six cards with the same picture.

Figma paints fills bottom-to-top, so **the last image fill is the visible one**,
and its own `scaleMode` / `imageTransform` are the ones to convert. This is the
same defect that produced the "blank preview" on frame 110 §Assets — there the
design-context export happened to pick the wrong layer of a two-fill node.

Worth flagging to the designer: five nodes are carrying an invisible duplicate
image each. It bloats the file and it is exactly the kind of thing that leaks
into an export.

## 17. Variant no longer determines icon or tint

Card 8 is `Property 1=app` but renders a **CSV** icon on a **brand-50** tint,
where the other three `app` cards render an App icon on `steel-blue-50`. Both
are instance-level overrides against the variant.

Consequence for the code: tint and icon are driven per card, not derived from
the variant name. Anything that assumes `variant -> appearance` on this
component set is wrong.

## 18. Cover tints ARE tokenised here — unlike frame 108

All seven tints on this frame bind DS variables (`pigeon-blue-100`, `gray-300`,
`lime-50`, `steel-blue-50`, `harbor-teal-50`, `brand-50`, `warning-50`). The
frame-108 gradient palette (§14) binds nothing. Two cover treatments of the same
component, one fully tokenised and one not — worth resolving in one direction.

---

# Playbook Studio — Enterprise Brain Base 2026 — 2026-09-16

## 19. `button-neutral-tertiary-bg_hover` resolves to `bg-tertiary` live

| Token | Live Figma | `ds/tokens` export | Action |
|---|---|---|---|
| `Component/Buttons/Neutral/Tertiary/button-neutral-tertiary-bg_hover` | `#f2f0ee` (= `bg-tertiary`), read on ES Breadcrumb 6424:330601 in frame 15 | `#edebe8` (aliased to `bg-tertiary-hover`) | Corrected in `shared/tokens.live-overrides.css`; re-stage `ds/tokens/component.json` |

## 20. Off-scale values stated by the Enterprise Brain frames

| Where | Value | Nearest token | Kept as |
|---|---|---|---|
| Main_nav item columns (`1731:251990`) | `px-[10px]`, agent Icon Text `gap-[10px]` | 8 / 12 | literal, DRIFT on line |
| Nav item text 13/16 on sm buttons (Share, version, Publish) | 13px on a 16px line | Text sm/Medium is 13/20 | literal, DRIFT on line |
| Cost label | Spectral SemiBold 14/18 | no 14px display style | literal, DRIFT on line |
| Composer frame (`5975:416348`) | 28px bottom pad; gradient stop `rgba(251,250,249,0)` | 24 / 32 | literal, DRIFT on line |
| Artifact canvas (`1809:488550`) | `0 4px 4px rgba(0,0,0,.05)` | no shadow token | literal, DRIFT on line |
| Question card body (`875:165822`) | `drop-shadow(0 12 8 rgba(16,24,40,.08)) drop-shadow(0 4 3 rgba(16,24,40,.03))` | Shadows/shadow-lg exists as a style, not a CSS token | literal, DRIFT on line |
| Landing column (`7489:272503`) | 60px top inset | 48 / 64 | literal, DRIFT on line |
| User block (`5975:415915`) | 30px bottom padding | 24 / 32 | literal, DRIFT on line |
| Question card → composer | 13px gap in the frame (812 → 825) | `spacing-lg` 12 | token, 1px off, DRIFT on line |

## 21. Alpha-whites in the expanded rail

Same gap as §11: `.17` (hover/current plate), `.10` (history hover), `.15`
(dividers, footer rule), `.30 / .40 / .60 / .70` (timestamp, subheader, label,
avatar letter) exist only as `--palette-alpha-colors-white-*` primitives or not
at all. Stated literally with DRIFT markers in `components/main-nav/main-nav.css`.
The header icon-button hover (`.09`) is carried from the previous build's
reading of `967:349250` and was not re-probed.

## 22. Product constraints that override the frame

- **No truncation.** Nav labels, the breadcrumb title and the artifact-header
  title wrap where the frames use `text-overflow: ellipsis`. The artifact header
  therefore has `min-height: 40px` and wraps its action row before the title is
  forced onto a third line.
- **Nested "Playbooks" item** under Artifacts in the rail (28px indent, 1px
  guide) is the product's addition; it is not in `1731:251990`.

## 23. Two clickthrough departures reverted to the DS

The clickthrough had carried two designer-requested departures from the Arifact
Header frame: a Spectral 15/20 title and a filled dark "Publish Playbook". Under
"without deviation" both are now the frame's values — Text sm/Medium title
button and a Button Neutral secondary xs. Flip back in
`components/artifact-header/artifact-header.css` if the departure is wanted.

## 24. Localization screen (`15119:614275`, UnifyApps Platform `jcbxvaNrZCWeQsIiZRta6F`)

Built as `prototypes/localization/`. `check_geometry.py` is green on all 53
tagged nodes; the four items below are knowing departures, each marked `DRIFT`
on its declaration line in `prototypes/localization/localization.css`.

| Node | Design value | Nearest DS token | Resolution |
|---|---|---|---|
| `_Nav Header` label `I15112:501770;68436:57915` ("NAMESPACES") | `#9f9993` | none — the node binds no colour variable at all | literal, DRIFT on line |
| Filter Bar title `I15112:502106;10718:49098` ("Common") | `text-primary (900)` resolving **#1c1c1c** | main-library `text-primary (900)` is `#201f1e` | literal, DRIFT on line. Second published collection with the same variable name — failure-modes §8. Confirmed against the 1:1 render (darkest pixel #1c1c1c). |
| Filter Bar title, type | Geist SemiBold 14/20, family via `font_family_children` | not one of the 106 DS text styles | literal, DRIFT on line |
| Form Header title `I15112:501447;59836:92245` ("Namespaces") | DS style **Text lg/Medium** = Spectral 500 17/20 | `shared/typography.css` still carries the 25-Jun export of that style: **Geist**, line-height **28** | live value stated inline, DRIFT on line. `gen-typography.py` needs a re-stage of that style. |

Also here, not drift but worth recording:

- **Nav rail and sub-nav active plates bind `alpha-black-05`**, a palette
  primitive, because no `nav-item-bg-active` semantic exists. Same DS gap as
  §11 / §21; flagged, not laundered.
- **`border-brand-solid` (`#0c2011`) appears in `get_variable_defs` and renders
  nowhere** — 0 matching pixels in the 1:1 export. Unlike failure-modes §4 this
  is not a lost instance override: it is the brand button's border against a
  same-value fill.
- **Off-scale values stated by the design**: rail `padding-top: 15px` and
  `padding-inline: 10px`, nav-unit `padding-left: 9px`, sub-menu
  `padding-left: 29px`, notification badge anchored at `top: 180px`.

### Stroke alignment on this frame — both kinds, four nodes apart

failure-modes §1 in practice. Every stroke here is free of layout **except** the
rule above NAMESPACES (`15127:648797`), whose first child sits at `y=9` where
the padding is `8` — so that one is a real `border` and the rest are inset
rings. Modelling it as a ring made `Frame 2147266403` 104 instead of 105 and
`Section 1` 416 instead of 417, and `check_geometry.py` caught it.

Two strokes also have to be **overlays**, not inset rings: Figma composites the
Working area's stroke and the Secondary navigation's right edge *above* their
children. Sampled at x=72/y=144 the 1px `#edebe8` paints over the secondary
nav's own fill, and at x=311 over the opaque Sidepane header.

### Frame corner radius, recovered from the render

The frame is clipped with `radius-md` (8). No metadata field reports it; the
arc was solved off the 1:1 export and matches r=8 at every row of the corner
(5.22 / 3.34 / 2.19 / 1.39 / 0.81 / 0.40 / 0.14 px insets).
