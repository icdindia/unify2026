# MISSING COMPONENTS

Components composed locally because the DS has no published equivalent.
Cross-checked against `unify-ds/ds/ds-inventory.md` + `ds/components.md`.

Raised by: **Agent Dashboard** (Figma `16740:306222`), 2026-09-09.

| Local component | Figma layer | Why local | Confirmed absent by |
|---|---|---|---|
| `components/stat/` | `Stat` `16740:306247` | Metric tile (mono number over caps label). `ds/components.md` §"Genuinely absent" lists stat tile/stat card. `design-rules §12` says compose locally with DS tokens. | ds-inventory.md sweep 2026-06-26 |
| `components/section-card/` | `Frame 2147266148` etc. | Plain bordered surface. `ds/components.md` lists "Card / Section / Panel container (plain styled frame)" as genuinely absent. | ds-inventory.md sweep 2026-06-26 |
| `components/detail-row/` | `Row` `16740:306401` | Right-rail metadata row (label ↔ value/badge) and its stacked variant. `ds/components.md` lists "Governance section row" as absent. Note: `Key Value Horizontal` **does** exist and is used for the governance controls list — this is the *other* row shape. | ds-inventory.md sweep 2026-06-26 |

## Components used that ARE in the DS (no action needed)

`Page Header` · `Breadcrumb Bar` · `Horizontal tabs` (Button Tab base) ·
`Form Header` · `Key Value Horizontal` · `Alert` · `Pill solid` ·
`Pill squared` · `Avatar` · `Small Icon Button` · `New_Platform Navigation`
(`Base_Platform Nav Menu Unit`) · `Featured icon`.

### CORRECTION 2026-09-09 — `Badge` is not a DS component

`Badge` was listed here on the strength of the Figma **layer name**. It is not a
component. Every element this screen tags `data-figma-name="Badge"` is an
INSTANCE whose `mainComponent.parent` is the **`Pill squared`** component set
(`abf550f75d70dc37b88be9c63cff92bb604ce097`):

| Used for | Actual variant | Key |
|---|---|---|
| Connection-type status | `Pill squared` `sm / Icon leading / Warning` | `9185c59c924b60b427b18b3611b00d9ee5b3b99a` |
| Access & scope chips | `Pill squared` `xs / False / Gray` | `1bbef437a62e1f08c77aa7cd8184d765e99aab31` |

Caught by running the HTML→Figma direction, which verifies
`node.type === "INSTANCE"` plus `mainComponent.key` instead of trusting names —
the fossil-names rule in `HTML-TO-FIGMA.md`. A layer named `Badge` is a clue,
not a citation.

**Consequence — DONE 2026-09-09.** `components/badge/` was a second
implementation of `components/pill/`. It has been folded into the pill atom and
deleted; all 11 call sites in `prototypes/agent-dashboard/index.html` now emit
`pill pill--squared pill--*` with `data-figma-name="Pill squared"` and
`data-component="pill"`. What the fold added to `components/pill/pill.css`:

- `.pill--squared.pill--xs` — the `xs` size (20px min, `spacing-xxs`/`spacing-sm`,
  `radius-xs`) used by the ten Access & scope chips.
- `.pill__icon` — the 12px leading-icon slot for `sm / Icon leading`, sharing the
  tightened left padding that `.pill__dot` already had.
- `.pill--squared.pill--gray` — the Pill squared set reads Gray as
  `utility-gray-100` / `text-secondary-700`, one tint lighter than Pill solid's
  `utility-gray-200` / `gray-900`. Two sets, two values, so it is scoped by
  shape rather than overwriting the colour axis. **Unverified against live
  Figma** — both values were captured by hand, in separate passes; re-probe the
  two variant keys above and collapse them if they agree.

`--warning` / `--brand` / `--error` were byte-identical in both atoms and needed
nothing. Builder (`tools/build-agent-dashboard.py`) repointed at the same time,
so the page regenerates clean; `verify.sh` green.

## `componentKey`s — RESOLVED 2026-09-09

~~`ds/figma-keys.md` has no captured key for any component on this screen.~~

Superseded. Every component on this screen **is** published and every key has
been recovered and backfilled to `unify-ds/ds/figma-keys.md`
(§"Agent Dashboard — HTML→Figma probe"). Nothing on this screen is missing a key.

The keys were never absent — only uncaptured. They were recovered without a
`search_design_system` call, by resolving the `data-figma-node` ids the HTML
already carries:

```js
const n  = await figma.getNodeByIdAsync(dataFigmaNode);   // must be INSTANCE
const mc = await n.getMainComponentAsync();
mc.key;                                                    // variant key
mc.parent.type === 'COMPONENT_SET' && mc.parent.key;       // set key
```

`data-figma-key` is still omitted from the emitted HTML. Two ways to close that:
re-run `tools/build-agent-dashboard.py` against the backfilled key table, or
keep `data-figma-node` as the address and let the write step resolve it. The
write step now does the latter, so this is no longer a blocker — but emitting
the key is cheaper than re-probing on every run.

## Still open after the first HTML→Figma run

- **HTML carries no component-property state.** A fresh `Form Header` instance
  arrives with search, help icon, two Secondary buttons and a Primary; the HTML
  says nothing about any of them. This screen was only recoverable because it
  has a Figma ancestor to read `componentProperties` from. A prototype authored
  HTML-first has no such source. Emit `data-figma-props` alongside
  `data-figma-key`.
- **`data-figma-node` is wrong on ~10 nested elements** — they carry the
  enclosing instance's id instead of their own (pills tagged with their Form
  Header's id at `16740:306244` / `306304` / `306349` / `306395`; squared pills
  with their Key Value row's id at `306340` / `306343` / `306346`; avatars with
  their Row's id at `306463` / `306471` / `306479`). Harmless outbound, wrong
  inbound. Fix in the emitter.
- **`Alert` ships both `Color=Gray` and `Color=Grey`** as distinct variants. DS
  duplicate; flag to the DS owner.

---

# Playbook Studio — Enterprise Brain Base 2026 (`lqKjNjyifEXCeywg69Knr2`) — 2026-09-16

Rebuild of the ChargePoint Playbook Studio clickthrough (`playbook-studio-project/`)
as `prototypes/playbook-studio/` on the Enterprise OS library.

## New atoms extracted (DS components that had no HTML atom yet)

| Atom | DS component | Figma node(s) | Notes |
|---|---|---|---|
| `button` | Buttons/Button Brand · Buttons/Button Neutral | 7489:272509 (brand md) · I3838:245967;3792:244997 (neutral secondary xs) · I6424:330601 Share (tertiary sm) · I875:165817 (Small Icon Button) | size × hierarchy modifiers; secondary stroke is inside (inset ring) |
| `es-breadcrumb` | ES Breadcrumb | 5865:366539 · 7062:513829 · 6424:330601 | composes `button`; owns title, cost, avatar cluster |
| `copilot-input` | Copilot desktop Input Box | 5563:230560 · 7372:140068 · 5975:416349 (+ frame 5975:416348 fade) | inset ring; `.copilot-input__action--send` is this prototype's one filled action |
| `artifact-header` | Arifact Header | 3838:245967 | composes `button`; owns title slot, version, hairline, toggle group |
| `question-card` | Copilot_Question Card | 875:165812 | `__evidence` line is a product extension (content) |
| `inline-artifact-card` | Inline artifact card | 5717:486438 · 5975:416193 | tilted document stack |
| `main-nav--expanded` | Main_nav (expanded) | 1731:251990 · 7134:273616 · 967:349250 | variant of the existing `main-nav` atom; `data-state` drives collapse |

## Locally composed (no DS component — logged per FIGMA-TO-HTML §2.2 step 3)

All in `prototypes/playbook-studio/playbook-studio.css`, built from DS tokens only:

| Composition | Nearest DS precedent used | Why local |
|---|---|---|
| Template card (`.template-card`) | `artifact-card` surface + Form Header "Featured icon" + the detached Spectral 17/20 card title | the DS has no library/template tile |
| Permission card (`.perm`, `.srcopt`) | `inline-artifact-card` surface; question-card option rows; `button` sm trio | agentic permission prompt is a new pattern |
| Learning steps / findings / run summary | `section-card` + `detail-divider`; numbers in Text xl/Regular | no stepper or receipt component |
| Provision master–detail (`.md`, `.plist`, `.pcard`, `.pdet`) | filter-bar search + toggle group; pills; bordered card surface | no list/detail pattern in the DS |
| Five-tier position ladder (`.tier`, `.pos`) | utility tints success / steel-blue / brand-tertiary / warning / error at 25 (bg) · 50–100 (ring) · 600–700 (text) | colour-coded rung cards are product-specific |
| Toggle (`.tgl`) | — | **DS Toggle not yet extracted**; 22×13 carried from the clickthrough, flagged DRIFT |
| Tables (`.ctable`), deferred cards, quick-reference boxes, sheets, tooltip | stat label style for mono headers; `section-card` surface; shadow-md | no table / drawer / tooltip atoms in `components/` |

## Icons that are NOT Figma exports (kept from the clickthrough, flagged)

The nine contract-type glyphs (`GLYPH` in `data.js`), the permission icons
(`archive`, `compare`, `people`, `sharepoint`, `onedrive`) and the `tick` mark
have no counterpart in the Enterprise Brain file. Everything else in
`prototypes/playbook-studio/icons.js` is an exported asset committed under
`shared/svg-icons/`.

## Localization screen (`15119:614275`) — local compositions

`prototypes/localization/` reuses one atom, `horizontal-tabs`, which matches the
frame's `Button Tab base` exactly apart from the selected tab's foreground: this
screen keeps `button-neutral-secondary-fg`, where the Dashboard switches to
`text-primary (900)`. Overridden with a single property in the prototype CSS.

Everything else is composed locally because the DS has no HTML atom for it yet:

| Composition | Figma node | Why local |
|---|---|---|
| `.loc-rail` (New_Platform Navigation) | `15097:444092` | a different rail from `components/nav-rail` and `components/main-nav` — light `navbar-bg` surface, 36px units, 18px icons, six-item footer |
| `.loc-page-header` (Page Header) | `15097:444095` | `components/page-header` was built for the Dashboard's variant; this one carries the workspace chip, AI FDE button, toggle/version/deploy row and three actions |
| `.loc-sidenav` (Secondary navigation) | `15112:501749` | no sidepane / nav-tree atom exists |
| `.loc-form-header` (Form Header) | `15112:501447` | a further Form Header level again — 48 tall, 32px featured icon, Spectral 17/20 title, two sm buttons. Not `form-header`'s default or `--level-1` (FIGMA-TO-HTML §2.3) |
| `.loc-card` / `.loc-col` (table shell) | `15097:445910` | no table or column-header atom in `components/` |
| `.loc-empty` (Empty State) | `15097:445918` | no empty-state atom |
| `.loc-select`, `.loc-search__input`, `.loc-count`, `.loc-pill-*`, `.loc-toggle` | various | small controls not yet extracted; the DS Toggle is still unextracted (see the Playbook Studio entry above) |

No `componentKey` is recorded for any of these in `ds/figma-keys.md`, so the
build emits `data-figma-node`-style `data-node-id` addresses only.

## 2026-10-12 — templates/screen-starter.html (list screen composed from atoms)

Needs met by glue or left unstyled because no atom covers them:

| Need | Where it showed up | Interim |
|---|---|---|
| Page-header actions slot (primary + secondary buttons beside the title) | `page-header` has stack only | `.screen-actions` sibling in `screen-starter.css` |
| Modal body text style (paragraph in `.modal__body`) | `modal` has no text element; paragraph inherits browser defaults (16px) | left as plain `<p>` |
| Check glyph asset for `checkbox__check` | not in `shared/svg-icons/`; inlined 8x6 path | inline in template |
| Table cell compositions (name + supporting with avatar, tag list, owner) | `table` ships the shell only | `.cell*` glue in `screen-starter.css` |
| Static (non-fixed) modal presentation | `.modal-backdrop` is `position:fixed` | `.modal-frame` glue wrapper |
| Search input atom with 14px icon at filter-bar size | `input` (sm) used instead of `.search-input` (div, not an input) | `.input--sm` + `input__icon` |
| `.table` background in dark mode | used `bg-white` (stays #fff in dark) | fixed in `components/table/table.css` -> `bg-primary` |
