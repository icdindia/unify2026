# Playbook Studio — on the Enterprise OS library

The ChargePoint Playbook Studio clickthrough (`../../playbook-studio-project/`)
re-rendered with the Unify2026 atoms. Same flow, same copy, same knowledge base
(`data.js` is a verbatim lift); every colour, spacing, radius and type decision
now binds `shared/tokens.css` and `shared/typography.css`.

## Run

**To open from disk, use the standalone build** `dist/playbook-studio.html`
(everything inlined; only Google Fonts is external). Regenerate it after any edit:

```bash
python3 tools/build-standalone.py prototypes/playbook-studio/index.html dist/playbook-studio.html
```

This linked `index.html` is the source of record and needs to be *served*:
dev server `playbook-studio` (port 4177) in the browser pane. Opened as a
`file://` URL the linked stylesheets and scripts do not load, so you get the
bare shell.

`window.PlaybookStudio` exposes `S`, `render`, `pickType('msa')`,
`answerPerm(id, 'always'|'once'|'denied')` and `chooseOption(i, label)` for
driving the flow from a script.

## What maps to what

| Clickthrough | Here |
|---|---|
| 280 / 56 rail with its own token block | `main-nav` atom, `.main-nav--expanded` variant from Figma `1731:251990` / `7134:273616` |
| chat header | `es-breadcrumb` (`5865:366539`) |
| composer, landing composer | `copilot-input` (`5563:230560`), wide mode in the 760×76 fade frame |
| question panel | `question-card` (`875:165812`) |
| artifact canvas top bar | `artifact-header` (`3838:245967`) + `button` |
| artifact card in the thread | `inline-artifact-card` (`5717:486438`) |
| all buttons | `button`: brand-primary / neutral-secondary / neutral-tertiary × xs 24 / sm 28 / md 32 |
| six-view tabs, template chips | `horizontal-tabs` (pill style) + `pill` counts |
| list search, All/Has fallbacks/Baseline | `filter-bar` search-input + toggle-group |
| steps, findings, summary cards | `section-card` + `detail-divider` |
| five tier tints | success · steel-blue · brand-tertiary · warning · error utilities (25 bg / 50–100 ring / 600–700 text) |

Local compositions (permission card, template card, master–detail, ladder,
tables, sheets, tooltip, toggle) are listed in `shared/MISSING-COMPONENTS.md`;
every knowing departure is in `shared/DRIFT-LOG.md` §19–23.

## Verify

```bash
./tools/verify.sh
```

Then measure in the browser pane with `getBoundingClientRect` — the numbers
that should hold at 1440×900 with the rail collapsed: rail 56, items 32×32 at
x 12 from y 68 on a 36 pitch, breadcrumb 40, composer 48, question-card rows
36 / Skip 24, artifact panel 944 with an 8px inset, header controls 24 / 28,
tabs 28, provision list 432.
