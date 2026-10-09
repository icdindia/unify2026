# FIGMA-TO-HTML.md

> Rules for turning a **UnifyApps** Figma component or screen into HTML in this repo.
> Read at session start together with `shared/DRIFT-LOG.md`.
> Companion docs live in the `unify-ds` repo: `PLAYBOOK.md`, `ds/design-rules.md`, `ds/components.md`, `ds/ds-inventory.md`.

This is a living rulebook — append to the Changelog at the bottom rather than rewriting in place.

---

## 0. The two repos — know which one you're in

This is the single most common orientation mistake, so it comes first.

| Repo | Direction | Holds | Agent may write? |
|---|---|---|---|
| `~/unify-ds` | code → **Figma** | `ds/tokens/*.json`, `ds/components.md`, `ds/ds-inventory.md`, `ds/figma-keys.md`, `ds/design-rules.md`, `previews/` | **No.** Read-only from this pipeline. |
| `~/Unify2026` | Figma → **HTML** | `shared/`, `components/`, `prototypes/`, `tools/` | Yes. This is the output tree. |

`unify-ds` is a **Figma-authoring** workflow — its "components" are Figma component
keys, not CSS. It has no HTML component library. Do not go looking for
`components/*.css` there and conclude the DS is empty; look in
`ds/ds-inventory.md` and `ds/components.md`, which are the real catalogue.

> **`unify-ds/previews/` is not a reference implementation.** Those files
> (`previews/agent-config/styles.css` and friends) are hardcoded hex from top to
> bottom — no custom properties, no theme support. They are exactly the
> anti-pattern this document exists to prevent. Do not copy their approach, and
> do not treat them as prior art for how UnifyApps HTML should look.

**Figma source files**

- Product screens: `jcbxvaNrZCWeQsIiZRta6F` — *UnifyApps Platform (1)(2) 2026*
- DS component/variable source: `qT9zH1YYapGTwpJxwNEGzt` (per `unify-ds/ds/config.md`)

---

## 1. What this pipeline produces

- **New atom or molecule** → `components/[name]/[name].css` (+ optional `[name].js`, + `preview.html`), plus a row in `components/index.html`, plus tagging on every emitted instance.
- **Page or flow** → `prototypes/[flow-name]/index.html` that **links** existing atoms. Never inlines a copy of one.
- **Fix to an existing component** → targeted changes inside `components/[name]/`.

**Not** this pipeline: writing to Figma (that's `HTML-TO-FIGMA.md`, the reverse direction, + the `figma-use` skill), and editing `unify-ds/ds/tokens/*.json` (designer-owned).

---

## 2. Discovery sequence — mandatory before writing any CSS

Order matters. Each step is cheap and kills a class of rework.

### 2.1 Fetch the Figma spec

```
mcp__Figma__get_design_context(nodeId)   # reference React+Tailwind — TRANSLATE, never install Tailwind
mcp__Figma__get_screenshot(nodeId)       # visual ground truth
mcp__Figma__get_variable_defs(nodeId)    # THE authoritative token reading
```

Four hard-won mechanics:

1. **Big frames don't fit.** A full screen returns *"The design was too large to
   fit into context"* plus a sparse node tree, or simply times out. That tree is
   a gift — it's your fetch plan. Walk it and call `get_design_context` on
   **leaf-ish sublayers** (a single `Stat`, a single `Alert`, one `Row`). Small
   nodes return exact padding, radius, and bound variables; a big node returns
   nothing usable.

2. **Node ids die when the Figma tab changes.** Mid-session, fetches start
   failing with *"No node could be found for the provided nodeId … make sure the
   Figma desktop app is open and the document containing the node is the active
   tab."* Node ids only resolve while that file is the **active tab**. So:
   **fetch every node you will need up front**, in the first few calls, before
   you write any code.

   **When a node is unreachable, mark it and re-probe later — do not carefully
   approximate it from the screenshot.** Four container frames were lost this way
   on the Agent Dashboard build. The screenshot approximation was made with care
   and was **wrong on seven counts**: it invented a `1px` border on cards that
   have none, used `8px` radius where the design uses `12px`, read one card where
   the design has two, made the working area white when it is a `bg-workspace`
   tint, made an inverted dark pill light, gave a stat the wrong semantic colour,
   and misread the banner copy. A screenshot cannot show you a `0px` border on a
   light ground, cannot separate `8px` from `12px` radius, and cannot tell one
   card from two. Ask the user to bring the tab forward and re-probe — it takes
   one call and is the difference between exact and plausible.
   Full record: `shared/DRIFT-LOG.md §5`.

3. **`get_metadata` is the fallback when `get_design_context` is unavailable.**
   It returns only geometry — node ids, names, `x/y/width/height` — but geometry
   is enough to derive padding, gaps and internal offsets by subtraction, and it
   keeps working when `get_design_context` times out or the MCP server blips.
   The whole `Form Header` level mapping above was recovered from `get_metadata`
   alone: `Header x=12 y=6 w=1328 h=38` inside a `52`-tall instance *is* the
   padding. Reach for it rather than stalling.

4. **`get_variable_defs` on the root is the highest-value single call.** One call
   on the screen frame returns every variable the whole screen binds, with
   resolved values. That's your token map, and your check against the local
   export (§3.2).

For a multi-state component, run all three calls **per state node**. Hover/active
states routinely bind different variables than default.

### 2.2 Library audit — what already exists

```bash
ls components/                                   # HTML atoms already extracted here
ls shared/svg-icons/ | grep -i <icon-name>       # targeted — NOT a bare ls
grep -n "<ComponentName>" ~/unify-ds/ds/ds-inventory.md ~/unify-ds/ds/components.md
grep -n "<ComponentName>" ~/unify-ds/ds/figma-keys.md
```

> **Search, don't dump.** An earlier version of this doc told you to `ls` the
> whole icon directory every session. Don't. Icon names come from the Figma
> metadata (`get_design_context` names them and prints a description block), so
> grep for the specific name. Likewise `grep -l "componentKey" <one file>` is a
> no-op — `-l` on a single named file just echoes the filename. Use `grep -n`
> with the component name.

For each visual element, in this order:

1. Already an HTML atom in `components/`? → use its classes.
2. In the DS per `ds-inventory.md` / `ds/components.md`? → build the atom to match that component, and name it after the DS component.
3. Explicitly listed as *"Genuinely absent"* in `ds/components.md`? → compose locally, and **log it in `shared/MISSING-COMPONENTS.md`**.
4. Neither present nor listed absent? → stop and ask. Don't invent a DS component.

> `ds/components.md` carries a **"CORRECTED 2026-06-26 after full DS sweep"**
> block noting that an earlier "absent" list was mostly wrong. Trust
> `ds-inventory.md` over any older prose that claims something doesn't exist.

### 2.3 Check the variant axis, not just the component name

`ds/components.md` lists a variant axis for most DS components — `Form Header |
Level 0-3`, `Horizontal tabs | Style · Start Icon · Size`, `Tag | Icon · Action ·
Size · Type · State`. **Two instances of the same component can be different
components in practice.**

On the Agent Dashboard, `Form Header` appears at two levels:

| | default level | level 1 |
|---|---|---|
| instances | `306244` `306304` `306349` `306395` `306398` `306429` `306460` | `306238` (setup banner) |
| internals | `I…;59839:*` | `I…;59836:*` |
| height | 40 | 52 |
| own padding | none | 6 / 12 / 8 |
| title | 15/24 `Text md/Medium` | 13/20 `Text sm/Medium` |

Mapping the banner to the default level made it 65px instead of 52 and set the
title a step too large. **Tell:** if two instances of one component have
different heights or different `I…;NNNNN:*` internal prefixes, they are
different variants — model the axis as a class modifier (§4).

### 2.4 Confirm naming and keys

Use the DS component name, kebab-cased, as `[name]`. Capture the `componentKey`
from `ds/figma-keys.md` if present. If absent, omit `data-figma-key`, emit
`data-figma-node` instead, and add a row to `shared/MISSING-COMPONENTS.md`.

---

## 3. Tokens — generated, never hand-written

### 3.1 The token layer is a build artifact

`shared/tokens.css` is **generated** from `~/unify-ds/ds/tokens/*.json` by
`tools/gen-tokens.py`. Never hand-edit it. Same for `shared/typography.css`
(`tools/gen-typography.py`, 106 DS text styles → utility classes).

**Naming rule — the whole point.** A CSS custom property name is the Figma
variable path, lowercased, `/` and spaces → `-`, parentheses stripped:

| Figma variable | CSS custom property |
|---|---|
| `Colors/Text/text-primary (900)` | `--colors-text-text-primary-900` |
| `Colors/Utility/Warning/utility-warning-25` | `--colors-utility-warning-utility-warning-25` |
| `Component/Nav Bar/navbar-bg` | `--component-nav-bar-navbar-bg` |
| `Component/Buttons/Neutral/Secondary/button-neutral-secondary-fg` | `--component-buttons-neutral-secondary-button-neutral-secondary-fg` |
| `spacing-lg`, `radius-md`, `Button/sm` | `--spacing-lg`, `--radius-md`, `--button-sm` |

Because the transform is mechanical, **the keys of `get_variable_defs` map 1:1
onto CSS property names**. Never invent a name that isn't derivable from the
Figma path — that breaks the mapping and the drift checker with it.

**Two generator rules that are easy to get wrong:**

- **Semantic → semantic aliases must emit `var()`, not a frozen hex.** Many
  semantic tokens alias other semantic tokens in the same mode
  (`bg-workspace → utility-brand-secondary-25`). Resolving those to a literal at
  generation time silently breaks dark mode, because the dark override of the
  *target* stops flowing through. Emit `var(--target)`; only palette aliases
  resolve to hex. On the UnifyApps export this affects **124 of 513** tokens —
  a quarter of the layer.
- **Tiers, enforced.** `--palette-*` are primitives and components must not
  reference them. `--colors-*` and `--component-*` are semantic and are what
  components use. `tools/verify.sh` fails the build on primitive reach.

### 3.2 The JSON export is stale — the live file wins

**Do not assume `ds/tokens/*.json` is current.** On the Agent Dashboard build,
57 of 58 non-primitive tokens matched the live file exactly — and one did not:

```
Component/Nav Bar/navbar-bg
  live Figma   #efebe5
  25-Jun JSON  #f2f0ee   (aliased to utility-gray-100 — wrong alias, not just a stale value)
```

Procedure:

1. `get_variable_defs` on the screen root is the authoritative reading.
2. Diff it against the generated CSS: `python3 tools/check-drift.py`.
3. Where they disagree, the **live value wins for rendering** — but do **not**
   edit `tokens.css` (it regenerates) and do **not** hardcode the hex in a
   component. Add a corrected declaration to **`shared/tokens.live-overrides.css`**,
   with the node id that proved it and a note on what needs re-staging.
4. Log it in `shared/DRIFT-LOG.md`. That file is a bug report for the DS owner
   and should trend toward empty.

`tokens.live-overrides.css` is linked **immediately after** `tokens.css` and
before any component CSS.

> **Parser trap, learned the hard way.** When you diff generated CSS, a naive
> `dict(re.findall(...))` over the whole file keeps the **last** declaration of
> each property — which is the dark block. That reported 37 phantom drifts, all
> of them "light token has a dark value". Slice the file at the dark-mode marker
> and parse only the light scope. The same last-wins trap will bite any script
> that reads `tokens.css` without scoping.

### 3.3 Geometry and type are tokens too — not just colour

Reading `Header x=12 y=6 w=1328 h=38` off Figma and writing `padding: 6px 12px 8px`
is only half the job. **Every number that came from the design must go back
through the scale**, or the CSS records a measurement instead of a decision, and
the next scale change silently misses it.

| What you read | What you write |
|---|---|
| `y=6` inset | `var(--spacing-sm)` |
| `x=12` inset | `var(--spacing-lg)` |
| the 8px remainder | `var(--spacing-md)` |
| title 13/20 | `var(--text-sm-medium-font-size)` / `-line-height` |
| optical 28px indent | `calc(var(--spacing-2xl) + var(--spacing-md))` — derived, not stated |

**Type binds to type tokens.** `tools/gen-typography.py` emits, for each of the
106 DS text styles, both a utility class *and* a set of custom properties
(`--text-sm-medium-font-size`, `-line-height`, `-font-weight`, `-font-family`,
`-letter-spacing`). Utility classes are for consumer markup; an atom that owns
its typography binds the properties. Either way the atom names the DS style it
uses, so a scale change flows through.

> **The coincidence trap — this one is load-bearing.**
> The spacing scale and the type scale share values: **12, 16, 20, 24, 32** are
> in both. A naive audit will happily tell you that `font-size: 12px` "matches
> `--spacing-lg`". It does not *match* it — it merely equals it. The two scales
> are authored independently and move independently, so wiring a font size to a
> spacing token means the next spacing change reflows your type (and vice versa).
> **Never cross the scales.** `tools/scan-css.py` suggests only from the matching
> family: `--spacing-*` for padding/margin/gap, `--radius-*` for border-radius,
> type tokens for font-size/line-height.

**What stays a literal, legitimately:**

- **Component geometry** — a 14px icon, a 56px nav rail, a 36px nav item, a 68px
  tab min-width, a 20px avatar. These are the component's own dimensions, not
  spacing steps. The DS ships no size scale, and `--spacing-2xl` for a 20px
  avatar would be the coincidence trap again.
- **Hairlines** — `1px` borders and dividers. No border-width token exists.
- **Off-scale values from the design.** The nav rail binds `pt-[15px]` and
  `px-[10px]`; the Docs frame insets `60px`; the notification badge is anchored
  at `top: 180px`. The scale jumps 12→16, 8→12 and 48→64, so no token fits.
  These get a `DRIFT` marker **on the declaration line** and a row in the log —
  they are DS gaps, and making them visible every build is the point.

`./tools/verify.sh` fails the build on a raw px in a spacing, radius, or type
property that has a token, and on an off-scale one with no `DRIFT` marker.

### 3.4 When a token genuinely doesn't exist

1. Use the closest semantic and add a `DRIFT` comment **on the declaration line** (not just in the file header — the checker reads lines).
2. Inline a literal only when no semantic exists and the value is genuinely state-specific. Same on-line `DRIFT` marker.
3. Stop and ask the DS owner if the gap is structural.

**Never launder a primitive into a semantic.** If the *design itself* binds a
primitive — the nav rail binds `Palette/Alpha Colors/Black/alpha-black-05` for
hover and active because no `nav-item-bg-active` exists — that is a **DS gap, not
your decision to paper over**. Use the primitive, mark it `DRIFT` on the line so
`verify.sh` reports it every run, and log it. A gap that shows up as a warning on
every build eventually gets fixed; one you quietly resolved never does.

---

## 4. Library-first — render with atoms, never replicas

The highest-impact rule here. Identify every visual element; for each one pick
the atom whose shape matches and render it with that atom's classes. Marker
classes on the same element are for positioning and state hooks only. A minor
per-Figma tweak gets a **single-property** override — never a re-implementation.

**UnifyApps lookup — what to reach for:**

| Figma shows… | Use… |
|---|---|
| Count chip beside a title (`10`) | `.pill.pill--solid.pill--gray` |
| Status chip with a coloured dot | `.pill.pill--squared.pill--{warning/brand/error/success}` + `.pill__dot` |
| Status chip with a leading icon | `.badge.badge--status.badge--{warning/error/brand}` + `.badge__icon` |
| Bare token chip (`email.send`) | `.badge` (default gray) |
| Inline single-line notice | `.alert.alert--warning` / `.alert--neutral` |
| Metric: number over ALL-CAPS mono label | `.stat` (+ `.stat--divided`, `.stat__value--{success/error/warning}`) |
| Section title + count + subtitle + right-hand action | `.form-header` |
| Label + sub-label ↔ badge cluster row | `.key-value-row` (DS `Key Value Horizontal`) |
| Right-rail label ↔ value row | `.detail-row` (local) |
| Icon + label over wrapped chips | `.detail-row.detail-row--stacked` |
| Initial circle | `.avatar.avatar--sm` / `.avatar--md` |
| Pill-style page tabs | `.horizontal-tabs` + `.horizontal-tabs__tab[aria-selected]` |
| Screen title bar with breadcrumb | `.page-header` |
| 20px square icon button | `.small-icon-btn` |
| Icon-only product rail | `.nav-rail` |
| Bordered content surface | `.section-card` (local — DS has no card container) |

Per `ds/design-rules.md §12`: **page tabs are PILL style, never underline**, and
**brand is olive, never purple**.

**Pre-flight — all must be yes before any CSS:**

- [ ] Screenshot for every state I'll render.
- [ ] `get_variable_defs` for every state.
- [ ] Every node I need already fetched (tab may change — §2.1.2).
- [ ] Checked `components/`, then `ds-inventory.md` / `ds/components.md`.
- [ ] Every icon located by name in the Figma metadata.
- [ ] Token map built; drift-checked against live.
- [ ] For each gap: closest semantic + on-line `DRIFT`, or flagged to the DS owner.

---

## 5. Icons — export them, never draw them

Icons come back from `get_design_context` as `<img src="http://localhost:3845/assets/<hash>.svg">`.

- **Never hand-write an `<svg>`/`<path>`.** You do not have the vector data; anything you draw is the wrong glyph. This was the #1 recurring defect.
- **The asset URLs expire (~7 days).** Download and commit the bytes into `shared/svg-icons/<figma-layer-name>.svg`. Never ship the localhost URL.
- The local asset server only answers while the Figma desktop app is running with that file active. **Download early**, alongside the node fetches.

**Normalise on the way in** (`tools/` does this):

- Strip `preserveAspectRatio="none"`, `overflow="visible"`, `style="display:block"` and the hard `width`/`height` on the root `<svg>`. Keep `viewBox`. Otherwise the icon distorts, or explodes to intrinsic size the moment CSS fails to load.
- `stroke="#XXXXXX"` / `fill="#XXXXXX"` → `currentColor`. Leave `fill="none"` alone — it's structural.
- **Exempt third-party brand marks.** The Salesforce mark keeps `#00A1E0`; recolouring a vendor logo to `currentColor` is wrong. Keep an explicit exemption list.
- Inline the SVG into the markup so it inherits `color`. Size it from the atom's CSS, never from the file.

---

## 5b. Two rendering traps that shift the whole page

**Figma strokes are drawn INSIDE the frame. CSS borders are not.**
A Figma node that is 28px tall *including* its 1px stroke becomes 30px in CSS
the moment you write `border: 1px`. That 2px then propagates down the entire
page. Where the Figma height already accounts for the stroke, paint it with
`box-shadow: inset 0 0 0 1px …` (or `inset 0 -1px 0 …` for a bottom rule) so it
has no layout cost. On this screen that applied to the selected tab, the
breadcrumb rule, and the setup-banner rule — 4px of accumulated drift.

**Reset the browser defaults on semantic elements.**
Using a real `<h1>` for the screen title is correct, but its default
`0.67em` margin added **34px** and pushed everything below it down. The page
header measured 119px against Figma's 84. The fix is a reset
(`h1…h6, p, figure { margin: 0 }`), never avoiding the semantic element.
A `* { box-sizing: border-box }` reset alone does not cover this.

## 6. Accessibility — not optional, and cheap if done at build time

This section did not exist in the previous rulebook. Every gap below was found
by actually measuring the built page.

- **Prefer a real ARIA attribute as the styling hook.** Tabs style off
  `[aria-selected="true"]`, the nav rail off `[aria-current="page"]`. One
  attribute is both the accessibility contract and the CSS hook, so they cannot
  drift apart. Only reach for `data-state` when no ARIA attribute expresses the
  state (§7).
- **Interactive things are `<button>`/`<a>`,** not styled `<div>`s. Every atom
  that may render as a `<button>` resets `appearance: none; border: 0` in its
  base, or the browser's default button chrome bleeds through the pill shape.
- **Visible focus on every interactive element.** `:focus-visible` with a real
  outline and offset — not `outline: none`.
- **Icon-only controls carry `aria-label`** (and `title` for the tooltip the
  design implies — `design-rules §8` says rail labels live in tooltips).
- **Measure contrast in both themes; don't eyeball it.** Run the computed-style
  contrast audit against the rendered page. On the Agent Dashboard: **light mode
  0 failures, dark mode 2** — `utility-success-600` on the dark surface (2.73,
  needs 3.0) and `utility-error-600` on `utility-error-25` dark (2.94, needs
  4.5). Both are **DS dark-palette pairings**, since the screen was specified in
  light mode only. **Do not fix locally by inventing a colour** — log it and
  escalate.

---

## 7. State — one mechanism per dimension

- **Mutually-exclusive states** (default / edit / applying / collapsed) → a single `data-state` on the root, with `setState()` as the only way to change it. Setting the attribute directly skips side-effects and leaves timers running.
- **Orthogonal axes** (colour, size, shape) → class modifiers (`--warning`, `--sm`, `--rounded`).
- **Never mix the two for the same dimension.**
- Add `[data-force="hover|focus|selected|current|disabled"]` hooks alongside the real `:hover` / `:focus-visible` / `[aria-*]` selectors so previews can render a full state matrix statically.

---

## 8. JS — only when there's behaviour

- IIFE-scoped, exposed on `window.build<Name>` / `window.<Name>`.
- Return a controller (`{ el, setState, getState, destroy }`), not a bare element.
- **Bind listeners through an `AbortController` signal and make `destroy()` a single `abort()`.** Paired `addEventListener`/`removeEventListener` bookkeeping drifts; one signal cannot. `verify.sh` fails any component JS that binds listeners without `destroy`/`AbortController`.
- JSDoc block at the top documenting every opt, callback signature, and returned method.
- Callbacks receive structured payloads, not raw ids.
- No CDN deps, no build step.

---

## 9. File shape

```
shared/
  tokens.css                 GENERATED  — 513 semantic tokens × light/dark
  tokens.live-overrides.css  hand-held  — live-Figma corrections to the stale export
  typography.css             GENERATED  — 106 DS text styles as utility classes
  svg-icons/                 committed exports, currentColor-normalised
  DRIFT-LOG.md               every knowing departure, with the node that proved it
  MISSING-COMPONENTS.md      locally-composed components + missing componentKeys

components/
  [name]/[name].css          runtime styles (header docstring: purpose + Figma node ids)
  [name]/[name].js           only when there's behaviour
  [name]/preview.html        variant matrix + theme toggle
  index.html                 library index
  preview-shell.css          preview chrome only — never linked by a prototype
  preview-theme.js           light/dark toggle + persistence

prototypes/[flow]/index.html composes atoms via <link>; layout-only local CSS
tools/                       generators + verify.sh
```

**CSS link order — identical in previews and prototypes:**

```
tokens.css → tokens.live-overrides.css → typography.css → [atom CSS…] → local layout CSS
```

A prototype's local CSS is **layout only**. If it restyles an atom, that belongs
in the atom.

---

## 10. Tagging — on every emitted instance

```html
<element class="[name] …"
  data-component="[name]"
  data-figma-name="[exact Figma layer/component name]"
  data-figma-file="main"
  data-figma-key="[publishedComponentKey]"   <!-- omit if unknown -->
  data-figma-node="[nodeId]">                <!-- fallback address when key is unknown -->
```

~~`ds/figma-keys.md` currently has no key for any component on the Agent
Dashboard.~~ **Resolved 2026-09-09** — all nine component sets plus 17 variant
keys are captured in `ds/figma-keys.md` §"Agent Dashboard — HTML→Figma probe".
The Agent Dashboard HTML still emits `data-figma-node` only; regenerate it
against the backfilled table to start emitting `data-figma-key`.

Two defects in this tagging block, found by running the reverse direction
(`HTML-TO-FIGMA.md` §10) and not yet fixed in the emitter:

- **`data-figma-node` is the parent's id on ~10 nested elements** — pills carry
  their Form Header's id, squared pills their Key Value row's id, avatars their
  Row's id. Emit the element's own node id.
- **No `data-figma-props`.** A componentKey identifies the component but not its
  configuration; a freshly imported instance arrives on DS defaults with chrome
  no real screen uses. The reverse pipeline currently recovers this by reading
  `componentProperties` off the source instance, which only works for screens
  that came from Figma in the first place. Emit the boolean/variant property map
  alongside the key.

---

## 11. Verification — mechanical, then visual

Every rule above that can be checked by a script **is** checked by one. The
manual checklist was the weak point of the old rulebook: the changelog recorded
the same failures recurring, because a checklist that isn't executed isn't a
control.

```bash
./tools/verify.sh            # hex, token tiers, undefined vars, light/dark parity,
                             # icon currentColor, tagging, no inlined atom CSS, JS teardown
./tools/verify.sh --drift    # + diff generated tokens against the live Figma reading
```

> **Scan CSS with a comment-aware parser, not `grep`.** The first version of the
> checker flagged a hex sitting inside a `DRIFT` explanation comment. `grep`
> cannot tell a documentation comment from a declaration. `tools/scan-css.py`
> strips `/* … */` (preserving line numbers) and only then looks for raw hex and
> primitive reach.

**Cache-bust before you measure.** A plain reload served stale CSS twice during
this build and made two correct fixes look like failures. Before reading
`getComputedStyle`, re-point every stylesheet:

```js
document.querySelectorAll('link[rel=stylesheet]').forEach(l => {
  const u = new URL(l.href); u.searchParams.set('v', Date.now()); l.href = u.toString();
});
```

Then, by hand, on the rendered page:

- [ ] Toggle light ↔ dark; every state still reads.
- [ ] Measure contrast in both themes (§6). Log DS-level failures, don't patch them locally.
- [ ] Compare against the Figma screenshot side by side.
- [ ] Assert layout numbers against the Figma frame tree in the browser — widths, font sizes, radii. Reading them back out of `getComputedStyle` catches what the eye won't. On the Agent Dashboard this confirmed 1440/56/760/440/1352 and Spectral 24/32 at `-0.48px` exactly.

---

## 12. Pitfalls — real ones, each cost a round trip

1. **Hand-rolling an SVG** instead of downloading the export. Always the wrong glyph. (§5)
2. **Inlining a replica** of an atom that already exists. Breaks in dark mode, drifts forever. (§4)
3. **`<button class="pill">` without `appearance: none; border: 0`.** Default button chrome rings the pill. (§6)
4. **Assuming the token JSON is current.** It's an export with a date on it. Diff it. (§3.2)
5. **Freezing semantic→semantic aliases to hex** in the generator. Silently kills dark mode for a quarter of the layer. (§3.1)
6. **Parsing `tokens.css` without scoping to light.** Last-wins hands you dark values and invents dozens of phantom drifts. (§3.2)
7. **Fetching Figma nodes lazily.** The tab changes and the ids stop resolving. Fetch everything up front. (§2.1.2)
7b. **Approximating an unreachable node from the screenshot.** Feels reliable, isn't — 7 of 7 surface properties guessed this way were wrong. Mark it, re-probe. (§2.1.2)
8. **Calling `get_design_context` on a whole screen.** Times out or returns a sparse tree. Walk the tree, fetch leaves. (§2.1.1)
9. **Shipping the `localhost:3845` asset URL.** Expires in about a week. (§5)
10. **Recolouring a vendor brand mark to `currentColor`.** Salesforce blue is not a theme colour. (§5)
11. **Laundering a design-bound primitive into a semantic** so the linter goes quiet. It's a DS gap; make it visible. (§3.3)
12. **Putting the `DRIFT` marker in the file header instead of on the line.** The checker reads lines. (§3.3)
13. **Treating `unify-ds/previews/` as prior art.** It's hardcoded hex with no theming — the anti-pattern. (§0)
14. **Reusing an atom across variant levels.** Same component name, different geometry and type. Check the axis. (§2.3)
15. **`border: 1px` where Figma draws the stroke inside.** Silently adds 2px per element and shifts the page. (§5b)
16. **Forgetting to reset `<h1>` margin.** Cost 34px of vertical drift here. (§5b)
17. **Measuring a stale stylesheet.** The browser served cached CSS and a correct fix read as a failure twice. Cache-bust every `<link>` before you measure, or you will "verify" the previous build. (§11)
18. **Writing Figma measurements as literals.** `padding: 6px 12px 8px` records a measurement; `var(--spacing-sm) var(--spacing-lg) var(--spacing-md)` records a decision. (§3.3)
19. **Crossing the spacing and type scales.** 12/16/20/24/32 exist in both. Equal is not the same as related. (§3.3)
20. **Unasserted string patches.** A `str.replace()` that doesn't match is a silent no-op — the build succeeds and the change simply isn't there. `assert old in s` before every replace.
14. **Eyeballing dark mode.** Two AA failures were invisible to the eye and obvious to a contrast script. (§6)

---

## Changelog

### 2026-09-09 — retargeted to UnifyApps; rebuilt around the Agent Dashboard

Rewritten from the inherited (Sirion DS) version after building the **Agent
Dashboard** screen — Figma `16740:306222`, file `jcbxvaNrZCWeQsIiZRta6F` — as
`prototypes/agent-dashboard/`. What changed and why:

**Retargeting.** The old doc assumed a repo with `shared/tokens.css` and a
populated `components/` tree already in place. UnifyApps has neither: the DS
lives in `~/unify-ds` as **JSON token exports plus Figma component keys**, and
its `previews/` are hardcoded hex. §0 and §3 exist to stop the next session
re-deriving that from scratch.

**Fixes to inherited rules.**
- The old "audit" commands didn't work: `grep -l <pattern> <single file>` is a no-op, and `ls` over ~1,800 icons burned context for nothing. Replaced with targeted search (§2.2).
- "No hardcoded px" contradicted the doc's own 1px-border example. Narrowed to colour/radius/spacing/type (§3.3).
- The old doc both forbade writing to `shared/` and required appending to files in it. Resolved: `DRIFT-LOG.md` and `MISSING-COMPONENTS.md` are append-only agent outputs and live in **this** repo's `shared/`; `unify-ds` stays read-only (§0).
- Teardown verified by grepping for paired `removeEventListener` was unreliable; replaced with `AbortController` + a real check (§8).

**New sections.**
- **§6 Accessibility** — absent from the old rulebook entirely, in a document governing every interactive component. Prefer ARIA attributes as styling hooks; measure contrast rather than eyeball it.
- **§11 Verification** — `tools/verify.sh` turns the old manual checklist into build output. The old changelog recorded the same failures recurring precisely because a checklist nobody runs is not a control.

**Learned during this build.**
- `get_design_context` on a full screen returns a sparse tree or times out — that tree is the fetch plan; call leaves. Node ids stop resolving when the Figma desktop tab changes, so fetch everything up front. Four container frames were lost to this and are approximated from the screenshot (`DRIFT-LOG.md §5`).
- `get_variable_defs` on the root is the single highest-value call: it produced the whole token map and caught the one stale token in the export (`navbar-bg`, 57/58 otherwise exact).
- Semantic→semantic aliases must emit `var()`; freezing them to hex breaks dark mode for 124 of 513 tokens.
- Parsing generated CSS without scoping to the light block reports every token as drifted — a self-inflicted 37-item false alarm.
- CSS scanning needs comment stripping; `grep` flags hex inside `DRIFT` comments.
- The design itself binds a palette primitive (`alpha-black-05`) for nav hover/active because no semantic exists. Flagged, not laundered.
- Dark mode surfaced 2 WCAG AA failures from DS palette pairings — the screen was specified in light mode only. Escalated rather than patched.
- Stat numbers render at JetBrains Mono 14px; the DS code scale stops at 13. Held at the design value with a `DRIFT` marker.

Result: 12 atoms, 26 committed icons, 513 semantic tokens × 2 themes, 106 type
utilities, 75 tagged instances, `verify.sh` green with 2 intentional DRIFT
warnings.

### 2026-09-09 (later the same day) — re-probe and repair

The four container frames flagged as unverified were re-probed with the Figma
tab active, and the build corrected to fetched values. Every approximation the
earlier pass made from the screenshot turned out to be wrong — see
`DRIFT-LOG.md §5` for the seven-row table.

Corrections applied to the library, not just the page:

- `section-card` — **no border**, `radius-4xl` (12px). Cards separate by internal
  divider and by floating on the tinted working area (`design-rules §2`), not by
  an outline. Padding varies per card, so it is now a set of modifiers
  (`--inset-x`, `--pad-top`, `--pad-y`) rather than one base rule.
- `stat` — height `40px`; `stats-row` is `12px` vertical padding with the `16px`
  inset owned by the card; `stats-row--divided` for the rule between stacked rows.
- `alert` — `min-height: 32px` only. An earlier `max-height: 36px` (read from the
  two single-line alerts) would have clipped the 46px wrapping alert in the agent
  details card. **A height read off two instances is not a clamp.**
- `pill` — added `--gray-solid`, the one inverted chip on the screen
  (`utility-gray-600` bg / `utility-gray-50` text).
- `key-value-row` — `min-height: 24px`.
- Layout — main column section gap `32`, right rail `24` (they differ); working
  area is `bg-workspace`, banner shares that surface with a rule beneath it.

Verified after: `verify.sh` green; every corrected value re-read from
`getComputedStyle` and matched against the live file; contrast unchanged at
light 0 / dark 2 (the same two DS dark-palette pairs — no regression).

The durable lesson is in §2.1.2 and pitfall 7b: **an unreachable node is a
to-do, not a puzzle to solve from pixels.**

### 2026-09-09 (later still) — corrections raised by the reverse direction

The HTML→Figma pipeline was run against the Agent Dashboard for the first time
(`HTML-TO-FIGMA.md`, retargeted the same day). Rebuilding the screen from this
repo's HTML found four defects in what this pipeline emitted — none of them
visible from inside this direction, because they only matter on the way back.

- **`Badge` never existed.** Every element this repo tags
  `data-figma-name="Badge"` is a `Pill squared` variant. The name was read off a
  layer and trusted. `components/badge/` is therefore a duplicate of
  `components/pill/`, and `shared/MISSING-COMPONENTS.md` had inherited the
  error. Corrected there; the atom merge is still open.
- **`data-figma-node` carries the parent's id on ~10 nested elements** (§10).
  Fine as an informational tag, wrong as an address.
- **No `data-figma-props`** (§10). The key says *which* component; nothing says
  *how it is configured*. A DS instance placed on defaults arrives with search
  icons, help icons and three action buttons that no real screen shows.
- **Content the design renders and this HTML drops** — the page header's
  toggle / version / deploy row, the featured icons on Level 2 form headers, and
  a pill recorded `Color=Brand` in Figma but emitted `pill--gray`. Each is a
  small §2.1 fidelity miss; together they are the argument for diffing the built
  HTML against the frame tree rather than against the screenshot.

The durable lesson: **the reverse direction is the only mechanical check this
pipeline has.** A screen that round-trips is a screen that was tagged correctly.

### 2026-09-09 (third pass) — Form Header level + header-to-working-area spacing

Two defects reported by the designer, both fixed and both now measured against
the Figma frame tree rather than eyeballed.

**1. `Form Header` level was mis-mapped.** The setup banner (`16740:306238`) was
rendered with the section-header level. It is a different variant of the same
DS component: own padding `6/12/8`, title `13/20` instead of `15/24`, 52px tall
instead of 40. Added `.form-header--level-1` and documented the whole axis in
the atom's header docstring (§2.3). Recovered entirely from `get_metadata` while
`get_design_context` was unavailable.

**2. Breadcrumb → working-area spacing was 39px long.** Three separate causes,
none of them the gap values (those were already right at 20 and 12):

- `<h1>` default margin added **34px** — no heading reset in the prototype CSS.
- Real CSS borders on the breadcrumb rule, the selected tab, and the banner rule
  added **1px each** where Figma draws those strokes *inside* the frame.
- The supporting-row icon borrowed `.form-header__featured` with inline
  overrides, inheriting that atom's `20px` svg rule into a `16px` box (+2px).
  Replaced with its own class — a small instance of the library-first rule
  cutting the other way: **don't borrow an atom for a job it doesn't do.**

Now exact on all eight measurements: page header 84, tabs top 104 / height 28,
working area top 144, banner 52, level-1 header 52, gaps 20 and 12.

**Process notes worth keeping** (§5b, §11, pitfalls 15–18): Figma inside-strokes
must be painted with `box-shadow`, not `border`; semantic elements need explicit
resets; the browser served stale CSS twice and made correct fixes read as
failures until every `<link>` was cache-busted; and an unasserted
`str.replace()` silently did nothing while the build reported success.

### 2026-09-09 (fourth pass) — geometry and type mapped to tokens

Raised by the designer: measurements taken off the Figma frame tree
(`Header x=12 y=6 w=1328 h=38`) were being written as literal px instead of
mapped back to the scale. Correct, and it was true well beyond that one rule —
colour had been tokenised from the start, geometry and type had not.

- **Type tokens added.** `gen-typography.py` now emits per-style custom
  properties alongside the utility classes — 467 of them across the 106 DS text
  styles. Every atom's inline `font-size` / `line-height` / `font-weight` /
  `font-family` / `letter-spacing` was rebound to them by
  `tools/bind-type-tokens.py` (16 rules matched automatically, 5 by hand).
- **Spacing literals mapped**: `2px → --spacing-xxs`, `24px → --spacing-3xl`,
  and the optical 28px indent became `calc(var(--spacing-2xl) + var(--spacing-md))`
  — derived from the button and its gap rather than stated.
- **Genuine DS gaps DRIFT-marked on the line**: `pt-[15px]` and `px-[10px]` in
  the nav rail, the `60px` Docs inset, the `180px` badge anchor, `1px` hairlines,
  and the stat value's 14px mono (no DS code style above 13).
- **`verify.sh` now enforces it** — raw px in a spacing, radius or type property
  fails the build unless the line carries a `DRIFT` marker.

**The subtle part, written up in §3.3:** the spacing and type scales share the
values 12, 16, 20, 24 and 32. An audit that matches on number alone will tell
you `font-size: 12px` "matches `--spacing-lg`". It doesn't — it coincides.
Cross-wiring them means a future spacing change reflows type. The scanner now
suggests only from the matching family, and component geometry (icon sizes, rail
widths, avatar diameters) is explicitly excluded from the rule, because the DS
has no size scale and forcing spacing tokens onto dimensions is the same error.

Verified by re-measuring after the rebind: all ten geometry checks and all six
type readings identical to before. Pure refactor, zero visual change.

### 2026-09-09 (third pass) — Artifacts screen, a second product file

Built `prototypes/artifacts/` from Enterprise Search Base 2026
(`lqKjNjyifEXCeywg69Knr2`, frame `110` `7489:272501`) — a different product file
on the same DS. Every structural measurement matches the frame exactly
(1440x900 shell, 56 rail, 928 column, 104 head, 28 filter row, 288x226 cards,
225x119 previews) and `verify.sh` passes. Three new atoms: `main-nav`,
`artifact-card`, `filter-bar`.

Two export traps cost the most time; both are now in
`prototypes/artifacts/ASSETS.md` and belong in §5.

- **Exporting an icon instance can return the placeholder, not the glyph.**
  All seven `Artifact-Icons` came back as the *same* 399-byte grey circle — the
  `placeholder` slot inside the Small Icon Button. The real marks are
  INSTANCE_SWAPped in, so `download_assets` must target the **component node id**
  (`7289:49624` …), not the instance. Identical file sizes across icons that
  should differ is the tell.
- **`get_design_context` drops the `imageTransform` on `scaleMode: "CROP"` fills.**
  It emitted `object-bottom size-full`, losing the crop entirely, on two of nine
  previews. Read the fill and convert: for `[[sx,0,tx],[0,sy,ty]]`,
  `width=100/sx%`, `height=100/sy%`, `left=-(tx/sx)*100%`, `top=-(ty/sy)*100%`.
  Verified against the cards where the MCP *does* emit percentages — matches to
  three decimals.
- **A component-node export is cropped to the artwork, not the frame.** The
  `Artifact-Icons` SVGs came back as tight glyph boxes (82.884x91.4286 etc.) with
  three different aspect ratios. Rendering them at the 24x24 slot size made them
  ~1.5x oversized and squashed. The instance is a 24x24 slot; the glyph inside is
  15.541x17.143 (or 19.714x14.338 / 19.714x16.777) at a specific offset. Read the
  child group's size+offset and pin the `<img>` to it. Icons exported from placed
  *instances* don't have this problem — they come out at exactly their placed
  size. This is the cost of the component-node workaround above; the two traps
  travel together.
- **A node can carry more than one image fill, and the exported one may be blank.**
  Cards 1 and 5 returned 2.4KB / 4.2KB placeholder PNGs from the design-context
  URL; the real uploads came from `download_assets` on the card. Check file size
  and actually look at the image before shipping it.
- **`get_variable_defs` hides library collisions.** The card title and the card
  author both bind `Colors/Text/text-secondary (700)` — from two *different*
  published collections, resolving #424242 and #4a4745. The tool reports one
  value for the name. Read `boundVariables` ids when a colour looks off. See
  `shared/DRIFT-LOG.md` §7.
- **CSS borders vs Figma inside strokes, again.** A `border` grew the toggle
  group to 30 where the frame says 28 and pushed the whole filter row out.
  `box-shadow: inset 0 0 0 1px` reproduces an inside stroke without changing
  layout — the same fix the agent-dashboard banner needed.
- **`tools/verify.sh` icon exemption extended** to `artifact-*.svg`: multicolour
  type marks can't be currentColor without destroying the glyph, same reasoning
  as the salesforce brand mark (pitfall 10).

### 2026-09-09 (fourth pass) — Artifacts frame 108, the `doc` cover variant

Built `prototypes/artifacts-doc/` from frame `108` `7433:165911` — the same
Artifacts screen as frame `110`, same `artifacts` component set, on the
`Property 1=doc` variant family (generated gradient covers instead of
screenshots). Every measurement matches: 1440x900 shell, 928x866 column,
288x222 cards, 262x152 covers, 235 dot overlay, 198x12 mono label. `verify.sh`
passes.

- **Figma paints fills bottom-to-top; CSS paints the first layer on top.** A
  three-fill cover has to be written scrim → gradient → base, i.e. the reverse
  of `node.fills`. Getting this backwards silently produces a flat colour.
- **`gradientTransform` converts to CSS analytically** — no need to call
  `get_design_context` per gradient:
  `angle = atan2(a/W, -b/H)`; with `G = hypot(a/W, b/H)`, `tc = a/2+b/2+tx`,
  `L = |W·sin| + |H·cos|`, a Figma stop at `t` sits at `((t-tc)/G + L/2)/L`.
  Validated against the two groups the MCP does render (matches to four
  decimals), then used for the third, which it never rendered. Same
  read-the-matrix lesson as the CROP image fills.
- **The same conceptual icon can be two different components across frames.**
  `Type=App` (108) vs `Type=Applications` (110), and two different
  `Type=Presentation` components — different artwork AND different glyph
  geometry. Icon geometry classes are now named for the component variant, not
  the file type, so the two prototypes can't cross-render each other's glyphs.
- **The placeholder-slot export trap reproduced exactly** on this frame: the
  design-context icon URL returned the same 399-byte grey circle. The rule from
  the third pass held without re-diagnosis.
- **A component's boolean properties can encode what looked like ad-hoc content.**
  `Private#3111:3` and `Shared#3111:0` drive the lock and avatar cluster. In the
  first pass these were inferred from which nodes happened to be visible; they
  are real component properties and are now emitted as `data-figma-props`.

### 2026-09-09 (fifth pass) — Artifacts frame 111, tinted covers

Built `prototypes/artifacts-tinted/` from frame `111` `7591:300936`, the third
treatment of the Artifacts screen. Measurements match exactly; `verify.sh`
passes. No new assets were downloaded — all nine thumbnails matched preview
images already exported for frame 110, identified by `imageHash`.

- **A node can carry several image fills, and the LAST one is what renders.**
  Five thumbnails had a stale image stacked underneath the real one.
  `fills.find(f => f.type === 'IMAGE')` picks the wrong layer and silently
  renders six cards identically. Take the last image fill, and read *its*
  `scaleMode` and `imageTransform`. This is the general form of the frame-110
  "blank preview" bug — same cause, different symptom.
- **Match hashes before downloading anything.** Comparing `imageHash` against
  assets already in the repo turned nine downloads into zero and guaranteed the
  two prototypes share pixel-identical previews.
- **Not everything that sits on a component belongs to it.** The 120x70
  thumbnails are sibling rectangles parented to the ROW, overlapping the card —
  `get_design_context` on the card doesn't mention them at all, so a
  card-scoped read looks complete while missing a visible element. When a
  screenshot shows something the card context doesn't, walk the parent.
- **Variant name is not a reliable key for appearance.** One card is variant
  `app` but overrides both its icon (CSV) and its tint (brand-50). Drive
  per-instance properties from the instance, not from the variant.

### 2026-09-16 — Enterprise Brain frames 87 + 15; four corrections from the rebuild

Captured as a skill at `.claude/skills/unify-enterprise-os/` (workflow, scripts,
and `references/failure-modes.md` with the evidence). Four items here amend or
extend rules above rather than merely illustrating them.

**§5b is too absolute — stroke alignment is per node, not per file.** "Figma
strokes are drawn INSIDE the frame" is true often enough to be dangerous.
Applied blanket it makes every bordered card 2px too small; in one frame both
behaviours appeared four nodes apart. Use the child-offset test instead:
`child.x == padding` → stroke is free, paint it with `inset` box-shadow;
`child.x == padding + strokeWidth` → it is a real `border`. Verified against
`Canvas 1809:488550` (free), `1809:488589` (real, child at 17 = 16+1), the
composer (reported 760×48 = 8+32+8, free) and the artifact card (288×275 around
286×273 content, real).

**Never read a background from a `contentsOnly: true` render.** That flag is for
excluding siblings parented to the page; it also strips the frame's own fill and
returns alpha 0. A whole screen shipped on white instead of `#fbfaf9` on the
strength of it, and the wrong reading was defended as "the frame carries no
fill". Render normally and sample pixels. (`contentsOnly` was still the right
call for proving a floating dropdown did *not* belong to the frame.)

**Do not reach for `overflow: hidden` on a scroll container.** Figma's clip flag
covers both axes, so it invites the assumption. These COT rows are 788px wide in
a 760px column, deliberately overhanging 32px left, and the avatars live in that
overhang — clipping hid all four. Vertical clipping came from the frame plus an
opaque breadcrumb, not the container.

**Pitfall 1 has a quieter sibling: exports lose instance overrides.** Not just
hand-rolled SVGs — `get_design_context` on a parent returned the *component
default* (a placeholder arrow for 5 of 9 type icons; grey `#6A6662` instead of
`#d37c25` for the cost ring). Nothing fails; it just looks like plausible
design. Tell: a token in `get_variable_defs` you never used — here
`border-warning-solid` sat unreferenced. Fix: re-fetch by the full instance path
(`I<a>;<b>;<c>`) and reproduce the nested inset the parent export flattened.

Also: `whitespace-nowrap` alongside `max-w-[Npx]` is Figma's auto-width artefact,
not a constraint — drop the nowrap. `get_metadata` positions are parent-relative
(nested `y=128` under a parent at `y=28` is absolute 156).
`scripts/check_geometry.py` resolves the tree and gates on it; its width
tolerance is 1.75px because measured font wobble reaches 1.53 and the stroke
defect is exactly 2.00 — an earlier 2.5 silently passed an injected defect.

And on delivery: inline assets as data URIs before handing over. A page
referencing `assets/…` is a grid of broken-image boxes the moment it is opened
directly rather than served, which is how these get opened.

### 2026-09-16 — Playbook Studio: a clickthrough rebuilt on the library

Built `prototypes/playbook-studio/` — the ChargePoint Playbook Studio
clickthrough (`playbook-studio-project/playbook-studio.html`, a self-contained
Claude artifact with its own hand-written token block) re-rendered on the
Enterprise OS atoms, with every colour, spacing, radius and type decision bound
to `shared/tokens.css` / `typography.css`. Chrome from Enterprise Brain Base 2026:
Main_nav expanded `1731:251990` (fetched with `get_design_context` on the frame
and on each leaf component), ES Breadcrumb, Copilot desktop Input Box, Arifact
Header (`get_metadata` settled the two stroke-alignment questions), and
Copilot_Question Card `875:165812`.

Six atoms extracted (`button`, `es-breadcrumb`, `copilot-input`,
`artifact-header`, `question-card`, `inline-artifact-card`) and one variant
(`main-nav--expanded`). Local compositions and non-export icons are listed in
`shared/MISSING-COMPONENTS.md`; drift in `shared/DRIFT-LOG.md` §19–23.

Three things worth keeping:

- **`tools/scan-css.py` reads one declaration per line.** Compact `a { x; y; z }`
  rules make every px on the line look like it belongs to the first spacing or
  radius property found, which produced ~70 phantom failures. Write atoms one
  declaration per line; the verifier assumes it.
- **`verify.sh` rejects local custom properties.** `var(--anything)` must be
  defined in `shared/`. A per-tier `--tier-fg` and a JS-set `--chat-w` were
  replaced with explicit per-modifier rules and a directly-set grid template.
- **A hidden label still has a line-height.** Collapsing the rail by clamping
  labels to `width: 0` left every item 36 tall (8 + 20 + 8); `display: none`
  restores the 32 the collapsed frame states.
