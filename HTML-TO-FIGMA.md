# HTML-TO-FIGMA.md

> Rules for turning HTML in **this** repo back into real DS-instance composition in a
> **UnifyApps** Figma file. The reverse of `FIGMA-TO-HTML.md`.
> Read at session start together with `shared/MISSING-COMPONENTS.md`.
> Companion docs live in the `unify-ds` repo: `ds/figma-keys.md`, `ds/components.md`,
> `ds/ds-inventory.md`, `ds/design-rules.md`.

This is a living rulebook — append to the Changelog at the bottom rather than rewriting in
place. The history of mistakes is part of the document.

---

## 0. Direction and ownership — know which way you're pointing

| | `FIGMA-TO-HTML.md` | **this doc** |
|---|---|---|
| Direction | Figma → HTML | HTML → Figma |
| Reads | Figma product/DS files | `prototypes/`, `components/`, `shared/` |
| Writes | `components/`, `prototypes/`, `shared/` | a Figma **target** file |
| Source of truth | the Figma frame | `prototypes/[flow]/index.html` |

**Figma files**

- Product screens (read): `jcbxvaNrZCWeQsIiZRta6F` — *UnifyApps Platform (1)(2) 2026*
- DS component/variable source (read-only): `qT9zH1YYapGTwpJxwNEGzt`
- Target (write): **whatever the designer names.** Never assume. See §2.

**Never write to the DS source file.** Instances, yes; components, variables and styles are
designer-owned. This pipeline composes published components; it does not author them.

**`unify-ds` is read-only from here**, with one exception: `ds/figma-keys.md` is a capture
log, and §1 exists to fill it. Append to it; change nothing else in that repo.

---

## 1. Discovery sequence — mandatory before any write

Run in order. Stop as soon as every component the HTML declares has a verified published key.

### 1.0 Resolve `data-figma-node` → `componentKey` (do this first)

`FIGMA-TO-HTML.md` §10 emits `data-figma-key` only when a key is known, and falls back to
`data-figma-node`. **A missing `data-figma-key` is not a missing component.** Before treating
anything as absent, resolve the node id against the file it came from:

```js
const n  = await figma.getNodeByIdAsync(dataFigmaNode);
if (!n || n.type !== 'INSTANCE') return 'LOCAL_OR_FOSSIL';   // see §3
const mc = await n.getMainComponentAsync();
return {
  variantKey: mc.key,
  setKey: mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.key : null,
  published: mc.remote
};
```

One read-only `use_figma` resolves the whole screen in a single pass — cheaper and more
reliable than any search. **Backfill everything you recover to `unify-ds/ds/figma-keys.md`**
so the next run skips this step.

> The `Dashboard` screen was logged as "no key for any component". All nine were published;
> the keys had simply never been captured. See the Changelog, 2026-09-09.

### 1.1 Code Connect files
Glob `*.figma.ts|tsx|js`. Parse `fileKey` + `nodeId`; resolve keys with one read-only call.

### 1.2 `unify-ds/ds/figma-keys.md`
The capture log. Authoritative for anything already probed. Check it before probing again.

### 1.3 Existing instances in the target file
If the target already has prior work, walk a frame with
`findAllWithCriteria({ types: ["INSTANCE"] })` and read `mainComponent.key`. Existing
instances are authoritative for everything the file already uses — and they prove the
library is reachable from that file.

### 1.4 `search_design_system` (last resort)
Only when the above fail. Always scope to specific `libraryKey`s; never search all libraries.

> **Hard gate:** no mutation runs until every declared component has a resolved key or is
> logged as missing (§6).

---

## 2. Target file — ask, then inspect

**Never pick the target yourself.** Ask the designer for the file URL and whether to use a new
page or an existing one. Writing a screen into a shared product file is not reversible by you.

Then, before creating anything:

```js
figma.root.children.map(p => ({ id: p.id, name: p.name, n: p.children.length }));
await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
```

- Confirm the DS variable collections are reachable **from that file**. If they aren't, stop
  and tell the designer — a screen built without bindings is worse than no screen.
- Default to a **new page**, named for the flow. Existing pages hold work you can't see the
  value of.
- Position top-level frames away from `(0,0)` and away from existing content.

---

## 3. Fossil names — frame names are not DS references

**The pattern.** Designers instance a DS component, detach it, then modify it. The detached
frame keeps the original component's *name* but has lost its structural link. Over time these
accumulate as labels that look like citations but are not — fossils.

**Rule.** Frame names carry zero binding information. A frame called `Badge` is **not** a Badge
instance unless `node.type === "INSTANCE"` and its `mainComponent.key` (or
`mainComponent.parent.key` for variant sets) matches a published key from §1.

**Verification protocol.** Before claiming any frame is a DS reference:

1. Check `node.type` — anything other than `INSTANCE` fails immediately.
2. Read `mainComponent.key`. For a variant, also read `mainComponent.parent.key`.
3. Cross-check against the published key from discovery.
4. Only on a match — name AND key — treat it as a DS reference.

**A name can also point at the wrong component entirely.** Not just detached-vs-live: on the
Agent Dashboard, every layer named `Badge` resolved to a **`Pill squared`** variant. The name
was a different component's name. `shared/MISSING-COMPONENTS.md` had inherited the error.

**Consequence for screenshots and trees.** A shared screenshot showing `Stat`, `Row`,
`Badge` is **a clue, not a citation.** The same name may sit on:
- an actual published-component instance (live link)
- a detached-then-edited frame (fossil)
- an inline frame hand-named for clarity (informational)
- an instance of a *different* component that was renamed (mislabel)

Say `"frame called X"` until verified, never `"an X"`.

---

## 4. Component properties — the key is only half the identity

**The footgun.** `importComponentByKeyAsync(key).createInstance()` gives you the component on
its **DS defaults**, which are far noisier than any real screen. A fresh `Form Header` arrives
with a search icon, a help icon, two Secondary buttons and a Primary. A fresh
`Key Value Horizontal` arrives with two badges and a help affordance. The HTML declares none
of it and says nothing about it either.

**Rule.** Placing an instance is two operations, never one:

```js
const inst = (await figma.importComponentByKeyAsync(variantKey)).createInstance();
inst.setProperties({ /* every boolean the source screen sets */ });
```

**Where the property values come from**, in order:

1. `data-figma-props` on the HTML element, if the emitter provides it. *(Not emitted today —
   see `shared/MISSING-COMPONENTS.md` "Still open".)*
2. `componentProperties` read off the corresponding source instance, when the prototype was
   built from a Figma frame. This is the current path.
3. `ds/figma-keys.md`, which records the property names and the values real screens use.
4. Failing all three: place on defaults, screenshot, and **log every surplus affordance you
   had to hide** — don't quietly hide things and call it done.

Property names are opaque and instance-specific (`Actions#15346:14`, `Badge#59853:0`). Read
them from the **`COMPONENT_SET`**, never from a variant `COMPONENT` — the getter throws.

**Component properties are not the only overrides.** There are three kinds, and only the first
is reachable through `setProperties`:

| Kind | How the source carries it | How to replay |
|---|---|---|
| Component properties | `instance.componentProperties` | `setProperties({...})` |
| Node visibility | per-node `visible` on instance children (§5) | walk and set `visible` |
| **Layout overrides** | `padding*`, `minHeight`/`maxHeight`, `itemSpacing` on the instance root | read and assign directly |

The third bit last and hardest. The DS `Form Header` at `Level 2` ships `6/12/6/12` padding
**and `minHeight: 48`**; every source instance overrides padding to `0/0/0/0` and clears the
min-height, landing at 40. Zeroing the padding alone left them at 48, because `minHeight`
silently pinned them — `layoutSizingVertical` still reads `'HUG'` while the node refuses to
hug. Check `minHeight`/`maxHeight` on any instance whose height won't match its content:

```js
if (inst.minHeight !== null && inst.minHeight !== undefined) inst.minHeight = null;
inst.paddingTop = inst.paddingRight = inst.paddingBottom = inst.paddingLeft = 0;
```

`setProperties` re-creates child nodes, so **apply properties before you resolve any child
node id.** Ids captured beforehand go stale.

---

## 5. Visibility runs in both directions

**5a. Hidden nodes you must reveal.** Some variants ship text nodes `visible: false`. Writing
characters into a hidden node succeeds silently — no error, no visual change. Before mutating
any TEXT, read `node.visible`. If `false` and the HTML declares the content, set
`visible = true`, then write. If the HTML declares nothing, skip and log. **Never write into a
hidden node without addressing visibility.**

**5b. Visible nodes you must hide.** The larger job, in practice. The DS renders affordances
the HTML doesn't declare — surplus tabs, duplicate badges, help icons, Dismiss buttons, close
icons, chrome from a richer variant. On the Agent Dashboard this was **13 hides against 0
reveals.**

**Rule.** HTML is the structural source of truth. A DS node with no corresponding HTML content
is hidden, not left standing. Log every hide in the run summary — a hide is a divergence
report, and often it means the *HTML* is wrong (see §10).

**Collect, then mutate.** Hiding a node during a `findAll` traversal invalidates ids later in
the same array (`The node with id … does not exist`). Two phases, always:

```js
const targets = [];
for (const n of root.findAll(x => true)) if (shouldHide(n)) targets.push(n.id);
for (const id of targets) { const n = await figma.getNodeByIdAsync(id); if (n) n.visible = false; }
```

---

## 6. Tokens — bind variables, never paint hex

The whole point of `shared/tokens.css` is that its names are the Figma variable paths. That
mapping runs **both ways**, and this direction is where hardcoded hex leaks *into* Figma.

`--colors-text-text-primary-900` ⟷ `Colors/Text/text-primary (900)` — lowercase, `/` and
spaces to `-`, parentheses stripped. Verified in both directions.

```js
const v = await figma.variables.importVariableByKeyAsync(key);
node.fills = [figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)];   // returns a NEW paint
node.setBoundVariable('itemSpacing', spacingVar);
node.setBoundVariable('paddingLeft', spacingVar);
for (const c of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])
  node.setBoundVariable(c, radiusVar);
```

- Resolve collections **by name**, not by ordinal — the DS ships `6. Fonts` where
  `figma-keys.md` once recorded `5. Fonts`.
- Bind fills, strokes, gaps, paddings and radii. A raw hex or a bare number in a written frame
  is the same defect `FIGMA-TO-HTML.md` §3 forbids in CSS.
- One exception, stated out loud: a value the HTML sets in raw px with no token behind it
  (e.g. the docs-grid's 60px inset). Set it literally and note it — don't launder it into the
  nearest token.

---

## 7. Layout — CSS is the spec, auto-layout is the mechanism

Everything with structurally related children is `figma.createAutoLayout()`. Absolute `x`/`y`
is only for where a top-level frame sits on the canvas.

| CSS | Figma |
|---|---|
| `flex-direction: row \| column` | `layoutMode` `HORIZONTAL` \| `VERTICAL` |
| `gap` | `itemSpacing` (+ `counterAxisSpacing` when wrapping) |
| `flex-wrap: wrap` | `layoutWrap = 'WRAP'` |
| `padding` | `paddingTop/Right/Bottom/Left` |
| `justify-content: space-between` | `primaryAxisAlignItems = 'SPACE_BETWEEN'` |
| `align-items: center` | `counterAxisAlignItems = 'CENTER'` |
| `flex: 1 0 0` | child `layoutSizingHorizontal = 'FILL'` |
| `width: 760px` | `resize()` then `layoutSizingHorizontal = 'FIXED'` |
| `height: fit-content` | `layoutSizingVertical = 'HUG'` |
| 1px `border-*` | `strokes` + per-side `strokeTopWeight` etc., `strokeAlign = 'INSIDE'` |
| `.divider` element | a `RECTANGLE` height 1, `layoutSizingHorizontal = 'FILL'` |

Order matters: **`appendChild` first, then set `HUG`/`FILL`.** An unparented node can't satisfy
the rule. `resize()` resets sizing modes, so resize before setting them. And don't cross the
enums — children take `FIXED|HUG|FILL`, frames take `FIXED|AUTO`.

Take the numbers from the prototype's layout CSS, which already records them against the Figma
frame tree (`canvas 1440 · rail 56 · main 1384 · working area 1352 · docs 1232 = 760 + 32 + 440`).
If your built widths don't land on those, the hierarchy is wrong — fix the hierarchy, not the
numbers.

---

## 8. Slot rule — respect existing structure, fill from HTML

Slots accept varied content, but their interior layer hierarchy must be respected.

1. **Non-empty slot.** Each existing slot child is a **structural template**. Adding items
   means replicating that hierarchy: same AL direction, same depth, same named sub-frames,
   same DS INSTANCE references. Use the HTML only to fill *content*.
2. **Empty slot.** Build from HTML primitives matching the HTML's hierarchy.
3. **Layer names are not authority.** §3 applies inside slots too. Replicate the shape; ignore
   what the name implies.
4. **Don't substitute a different shape** because the HTML's names look more familiar.
5. **Designer override required to deviate.** Any structural change to a slot's interior needs
   explicit approval. Without it, replicate.

**When the existing slot child has the wrong shape** — surface it as a DS gap: log to
`shared/MISSING-COMPONENTS.md`, write what you can, flag for review. Do not rebuild the slot
from HTML primitives; that erases authored structure.

**Cloning has a 1-per-script ceiling.** `slot.appendChild(freshlyClonedNode)` works exactly
once per `use_figma` call; the next attempt fails with `"Node with id … not found"` or
`"Failed to clone node"`. Cloning to the **page** loops freely. Recipe: bootstrap one real-id
child (script A) → clone it N−1 times onto the page (script B) → move the page-clones into the
slot (script C) → text overrides in one transaction (script D). Pre-existing real nodes move
cleanly; only freshly-cloned-this-script nodes are constrained.

---

## 9. Text — the canonical recipe

Load font → `await` → mutate → return ids. Every time, for every family.

```js
const fonts = new Map();
for (const n of targets)
  for (const s of n.getStyledTextSegments(['fontName']))
    fonts.set(s.fontName.family + '|' + s.fontName.style, s.fontName);
await Promise.all([...fonts.values()].map(f => figma.loadFontAsync(f)));
for (const [n, txt] of writes) { if (!n.visible) n.visible = true; n.characters = txt; }
```

- Read the node's **current** fonts; never hardcode a default. Inter happens to be preloaded,
  which is why other families surface the bug.
- Verify style strings — Geist uses `SemiBold`, Inter uses `Semi Bold`.
- Batch all text for a section into one transaction.
- `textCase = 'UPPER'` for `text-transform: uppercase`; keep the source casing in `characters`.

---

## 10. Divergences — the reverse run is a checker for the forward one

Where HTML and the source Figma disagree, **HTML wins for the write** (it is the source of
truth) — but the disagreement is a finding, not noise. Most of them turn out to be bugs in the
*forward* direction.

Log every one. From the first run: a text action rendered as a link in HTML but a Primary
button in Figma; a toggle row the HTML dropped entirely; a pill recorded `Color=Brand` in
Figma and `pill--gray` in HTML; featured icons on section headers the HTML omits; ~10
`data-figma-node` values pointing at the parent element instead of their own.

Report them in the run summary and append the durable ones to
`shared/MISSING-COMPONENTS.md` or `shared/DRIFT-LOG.md`. Do not silently pick a winner.

---

## 11. Missing components — don't halt, log

When a component genuinely doesn't resolve after **all** of §1 (including §1.0):

1. Substitute a placeholder FRAME named `MISSING: [code-component-name]` in the position the
   real instance would have occupied. 1px dashed border, label text — visually obvious.
2. Append to `shared/MISSING-COMPONENTS.md`:
   ```
   - [code-component-name] | used in: [prototype path] | resolved via: [what you tried] | date: YYYY-MM-DD
   ```
3. Continue. Do not halt.
4. Surface a summary of every placeholder at the end of the write.

A component that is *locally composed by design* (`stat`, `detail-row`, `section-card`) is not
missing — build it from primitives per §6 and §7. Check `MISSING-COMPONENTS.md` first.

---

## 12. Validation — after every section

1. **Tree diff** against the HTML: same INSTANCE→published-key links where the HTML declares a
   component, same node types in the same order, `visible` state matching HTML rendering in
   both directions (§5).
2. **Per-section screenshot** — `await node.screenshot()`, the modified subtree only. Look for
   cropped text, overlapping elements, and DS placeholder copy that wasn't overridden
   (`Page Name`, `Team members`, `Preview`, `Label`, `Button CTA` are the usual survivors).
3. **Token diff — compare bindings, not pixels.** When the flow has a source frame, diff
   *which variable* each surface binds, not what it looks like. A wrong fill is invisible in a
   screenshot whenever something opaque sits on top of it.

   ```js
   async function surfaces(root) {
     const out = {};
     for (const n of [root, ...root.findAll(x => 'fills' in x)]) {
       const p = n.fills && n.fills.length ? n.fills[0] : null;
       const id = p && p.boundVariables && p.boundVariables.color
         ? p.boundVariables.color.id : null;
       out[n.name] = id ? id.split(':')[1].split('/')[0]   // the componentKey-style key
                        : (p ? 'UNBOUND_' + JSON.stringify(p.color) : 'NO_FILL');
     }
     return out;
   }
   ```

   Run it on both frames and compare keys. Three outcomes, three different responses:
   - **`UNBOUND_…`** anywhere you wrote — a binding failed. Fix it; never leave raw paint.
   - **key mismatch** — HTML and the design disagree. HTML still wins for the write (§10),
     but you must log it. This is the check that makes §10 real rather than aspirational.
   - **`NO_FILL` vs a key** — one of them paints a surface the other leaves transparent. Match
     the source: which *node* owns a colour is part of the structure, not a rendering detail.

4. **Instance census** at the end:
   ```js
   const insts = root.findAllWithCriteria({ types: ['INSTANCE'] });
   let linked = 0;
   for (const i of insts) { const mc = await i.getMainComponentAsync(); if (mc && mc.remote) linked++; }
   return { total: insts.length, linked };   // these must be equal
   ```
5. **Frame size** against the source frame, when there is one. A large delta means a padding or
   sizing-mode error, not a rounding difference.
6. **Fix targeted.** On a divergence, write a correction — do not rebuild the section. Failed
   `use_figma` calls are atomic; corrected scripts retry safely.

> This is still agent-judgment where `FIGMA-TO-HTML.md` §11 has `tools/verify.sh`. A checker
> that isn't executed isn't a control — a `tools/verify-figma.py` doing steps 1, 3 and 4 from a
> returned tree dump is the obvious next thing to build.
>
> **Step 3 exists because step 2 failed.** The first run bound the root frame to `bg-primary`
> because `.app-shell` declares it, where the source frame binds `bg-workspace`. #ffffff vs
> #fbfaf9 is a ~2% luminance step on a warm neutral — below what a side-by-side screenshot
> comparison resolves, even though a 16px band of it frames the working area on three sides.
> A one-line key comparison catches it immediately. See `shared/DRIFT-LOG.md` §6.
>
> The same check then caught an error in the *correction*: `306237` has no fill, so reading it
> alone suggested the working area was transparent. The fill is on its child `306239`. Verify
> the **owner** of a colour across the ancestry, not one node in isolation.

---

## 13. Working shape of a run

At most ~10 logical operations per `use_figma` call. Split, validate, continue.

```
1  discovery         read-only: keys (§1), target file + variable collections (§2)
2  skeleton          page, root frame, shell columns, content well — variables bound
3  chrome            nav rail, page header, tabs, banner  (instances only)
4  properties        setProperties on everything placed    (§4 — before any child id is read)
5  section N         build + instances + local primitives   → screenshot
6  text pass         one transaction per section            (§9)
7  visibility pass   collect-then-mutate hides              (§5b)
8  census            instance count, linked count, size     (§12)
```

Return created/mutated node ids from every call. `figma.currentPage` resets to the first page
on every invocation — call `setCurrentPageAsync` once at the top of each script, never in a
loop.

---

## 14. Pitfalls — each one cost a round trip

1. **Treating a missing `data-figma-key` as a missing component.** Resolve the node id first. (§1.0)
2. **Trusting a layer name.** `Badge` was a `Pill squared`. (§3)
3. **Placing an instance and calling it done.** DS defaults carry chrome no screen uses. (§4)
4. **Reading child node ids before `setProperties`.** They go stale.
5. **Reading `componentPropertyDefinitions` off a variant.** Narrow to the `COMPONENT_SET`.
6. **Only handling hidden-nodes-to-reveal.** The common case is visible-nodes-to-hide. (§5b)
7. **Mutating during a `findAll` traversal.** Collect ids, then mutate. (§5b)
8. **Painting hex instead of binding a variable.** (§6)
9. **Hardcoding a variable-collection ordinal.** Look up by name. (§6)
10. **Setting `HUG`/`FILL` before `appendChild`.** Value-rejected. (§7)
11. **`resize()` after setting sizing modes.** It resets them.
12. **Hardcoding a font style string.** `SemiBold` vs `Semi Bold`. (§9)
13. **Cloning into a slot twice in one script.** 1-per-script ceiling. (§8)
14. **Silently resolving an HTML/Figma disagreement.** It's a finding. (§10)
15. **Picking the target file yourself.** Ask. (§2)
16. **Assuming `setProperties` replays the whole override.** Padding, `minHeight`/`maxHeight`
    and `itemSpacing` on the instance root are separate. (§4)
17. **Trusting `layoutSizingVertical === 'HUG'`.** A `minHeight` overrides it silently. (§4)
18. **Leaving an imported icon at its component size.** DS icons import at 24; the design
    resizes them (14 in `.detail-row__heading-icon`). Resize after `createInstance()`.
19. **Measuring the HTML from the source code instead of the browser.** Serve it and read
    `getBoundingClientRect()`. That is the only number the write can be checked against. (§12)

---

## Changelog

Append new learnings here. Don't rewrite earlier entries.

### 2026-09-09 — retargeted to UnifyApps; first end-to-end run

The doc was inherited from a Sirion DS 2.0 workflow and described a repo that doesn't exist
here (`CONTEXT.md`, `shared/DS-COMPONENTS.md`, `scripts/export.js`, `/dist`,
`shared/utilities.css`, "Sirion DS 2.0 — Main/Custom"). Retargeted against `~/Unify2026` +
`~/unify-ds`, and rewritten around what the first real run actually hit.

Run: `prototypes/agent-dashboard/index.html` → *AI Governance Launch Pad*
(`vwDNec1RX31TVDOOMViSWR`), new page. Result 1440×1358 against a 1440×1283 source;
**142 instances, 142 linked to published DS components**, zero placeholders, all colour /
radius / spacing bound to DS variables.

- **The key blocker wasn't one.** `MISSING-COMPONENTS.md` recorded "no captured key for any
  component on this screen" and the old §Missing-Components rule would have turned the whole
  screen into dashed placeholders. All nine sets were published; one read-only probe over the
  `data-figma-node` ids recovered every key plus 17 variant keys. Became §1.0, and the keys
  are backfilled to `unify-ds/ds/figma-keys.md`.
- **`Badge` is a fossil — of the mislabel kind.** Not detached-and-modified, but a layer
  carrying a *different component's* name. Every `data-figma-name="Badge"` element is a
  `Pill squared` variant. The old rule anticipated detachment only; §3 now covers mislabels.
  `components/badge/` is consequently a duplicate of `components/pill/`.
- **HTML carries no component-property state — the largest remaining gap.** Nine booleans per
  Form Header had to be read off the source instances and replayed. A prototype authored
  HTML-first has no source to read. New §4; `data-figma-props` requested from the emitter.
- **Visibility is bidirectional, and the old rule had the rare half.** 13 hides, 0 reveals.
  §5 rewritten with 5b as the main case.
- **Collect-then-mutate.** Hiding nodes during a `findAll` invalidated later ids in the same
  array — same family as the clone ceiling. Added to §5b and the pitfalls.
- **Variable binding and auto-layout translation had no rules at all.** The doc listed
  `tokens.css` as a source for "variable bindings" and then said nothing about how. New §6 and
  §7. The CSS-var ⟷ Figma-variable-path mapping verified in this direction for all ten colour
  tokens used.
- **The reverse run is a checker for the forward one.** Five divergences surfaced, four of them
  Figma→HTML fidelity bugs (dropped toggle row, action styled as a link, pill colour, section
  header icons) plus ~10 `data-figma-node` values pointing at the parent element. New §10.
- **`Alert` ships `Color=Gray` *and* `Color=Grey`** as distinct published variants. DS
  duplicate, flagged.
- **Target-file selection and validation-by-census** were unspecified. New §2 and §12.3.
- **Validation is still manual.** `FIGMA-TO-HTML.md` retired its manual checklist for
  `tools/verify.sh` on exactly this reasoning. A `tools/verify-figma.py` is the next thing to
  build.

### 2026-09-09 (later) — re-synced against the rebuilt prototype

The prototype was reworked (badge folded into pill, type bound to text-style tokens, banner
padding moved into the Form Header). Re-running the write against it exposed a class of
override the doc had no rule for, and a validation method it should have used from the start.

- **Measure the rendered HTML, not the CSS.** Served the prototype over
  `python3 -m http.server` and read `getBoundingClientRect()` for every structural node. That
  turned "the frame is 60px too tall" into six exact per-section numbers in one call. Reading
  px out of the stylesheet cannot do this — the tokens indirect through
  `var(--text-*-line-height)` and the totals depend on flow. Now §12 and pitfall 19.
- **Layout overrides are a third override class.** `Level 2` Form Headers ship `6/12/6/12`
  padding *and* `minHeight: 48`; the source clears both to land at 40. Zeroing padding alone
  left them at 48 — `minHeight` pins a node whose `layoutSizingVertical` still reports `'HUG'`.
  Seven headers × 12px was 84 of the 60px total error (partly masked by other deltas). New
  table in §4, pitfalls 16–17.
- **Imported icons arrive at component size.** `tool-02` / `plug-in` / `database-01` import at
  24×24; the design uses 14. Pitfall 18.
- **A hidden node can change geometry.** Hiding the KV row's `Help icon` (correct — the HTML
  declares none) collapsed the DS `Label` from 20 to 16 and the row from 36 to 32. The HTML
  reaches 36 through `text-sm-regular`'s 20px line-height instead. Fixed by matching the type
  token, not by re-showing the icon. §5b hides can move layout; re-measure after a hide pass.
- **Result: 1440×1274 in Figma against 1440×1274 rendered.** 142 instances, 142 linked, zero
  unbound fills. Four sections match to the pixel; `Value & performance` is −1 (a CSS
  `border-bottom` adds height where a Figma `INSIDE` stroke does not) and `Incidents` +4 /
  `Agent details` +2, where the HTML's local `.alert` atom renders 32/44 against the DS
  component's 36/46. Those three are HTML-vs-DS divergences, logged not chased — the Figma
  matches the source frame on all of them.

### Pre-retarget history (Sirion DS 2.0)

Kept because the reasoning still holds even though the repo names don't.

#### 2026-05-28 — initial rules

- **Fossil names rule established.** Hours of debugging traced to treating frame names as DS
  citations. Names survive `instance → detach → modify`; verification requires
  `node.type === INSTANCE` plus matching `mainComponent.key`.
- **Slot interior is the structural template, not the HTML.** First attempt at filling a
  10-step Plan Card cloned the master's inline preview items 6 times — propagating both their
  structure and fossil names. Correct rule: replicate the existing slot child's hierarchy,
  fill content from HTML, don't restructure.
- **Variant-controlled subtext visibility surfaced.** Writing to the Plan Card's Deterministic
  variant succeeded silently because subtext nodes are `visible: false` by default. Added the
  read-before-write rule.
- **The export bundle and the Figma write are independent consumers**, not a pipeline.
- **DS-COMPONENTS.md authority deferred** to a parallel session. *(That file never existed in
  this repo; its role is filled by `unify-ds/ds/figma-keys.md`.)*

#### 2026-05-29 — slot expansion recipe

- **Slot cloning has a 1-per-script ceiling that almost looks like a generic clone bug.**
  Repeated `clone()` of a virtual slot-child within a single `use_figma` script fails on
  iteration 2. The constraint is specifically `slot.appendChild(freshlyClonedNode)`. Cloning to
  the **page** instead loops freely. Recipe preserved in §8.
- **Why the original 6-step build "just worked".** It happened to do 1 clone per `use_figma`
  call across two scripts — the boundary condition that masked the constraint.
- **Hypothesis revision log.** First guess: "inspection forces lazy materialization of slot
  children." Wrong — repro with no inspection still fails. Second: "captured template
  invalidates after first clone." Wrong — re-fetching `slot.children[i]` after a clone also
  fails. The final model is consistent with all observed data points.
- **Plan Card step-count gap reclassified** from blocker to nice-to-have.
