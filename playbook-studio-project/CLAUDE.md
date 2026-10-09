# ChargePoint Playbook Studio — working rules for this repo

An agentic prototype for ChargePoint's CLM team: pick a contract type, connect the
executed-agreement corpus, answer three questions, get a negotiation playbook with a
five-tier position ladder per provision.

The whole prototype is **one self-contained file**: `playbook-studio.html`.
Everything else here is context.

---

## 1. Non-negotiables (the user is a product designer and checks these)

- **Honour the prompt exactly.** If an instruction says 28px, it is 28px, measured.
- **Spacing must be consistent.** No ad-hoc values. Every gap/padding traces to the
  Figma or to an existing token.
- **Minimal colour.** Hue is used to carry meaning (risk, position tier), never decoration.
- **Very few type sizes.** Before introducing a new font-size, check whether an existing
  one works. Introducing a near-duplicate (12.5 next to 13, 19 next to 20) is a defect.
- **No truncation anywhere.** No `text-overflow:ellipsis`, no `-webkit-line-clamp`.
  Long text wraps. This overrides the Figma, which does truncate nav labels.
- **Clean, modern, no nonsensical decoration.**

## 2. Verify before claiming

Never say a spacing or sizing change is done without measuring it. The pattern used
throughout this project:

```bash
node scripts/navdiv.js     # rail geometry: item boxes, dividers, pitch
node scripts/hdr.js        # artifact header: heights, fonts, weights
node scripts/wide.js       # master/detail widths at two viewport sizes
node scripts/tip.js        # tooltips + full happy-path walkthrough
```

Each script wraps `playbook-studio.html` in a minimal page, drives the flow with
Playwright, prints computed geometry, and writes a PNG to look at. **Read the PNG** —
numbers alone have missed real defects (an unsized SVG rendering at 300x150, text
spilling out of a pane).

Chromium is at `/opt/pw-browsers/chromium` in the cloud sandbox; locally just
`npx playwright install chromium` once.

Also check `pageerror` output in every run. A `ReferenceError` in a render function
silently blanks a whole pane.

## 3. The file's shape

`playbook-studio.html`, ~2,960 lines, in this order:

1. `<title>`, Google Fonts (Geist 400/500/600, Spectral 400/500 + italic)
2. `<style>` — all CSS. Token block first (`:root`), then shell, rail, buttons, thread,
   composer, artifact canvas, provision list/detail, sheets, container queries.
3. Shell markup — `.app[data-rail]` > `nav.rail` + `.main[data-artifact][data-expanded]`
   > `.view` + `.split` + `.artifact-panel`
4. `<script>` — `TYPES` data (9 contract types, ~76 provisions), the corpus layer
   (`META`, `NOFB`, `FB2`, `CPI`, `DEFER`, `TEMPLATES`, `NEWPROV` + a hydrate loop),
   `PERMS`, icon path data (`IP`/`FI`/`ICON`/`NAV_ICON`), state `S`, the tooltip
   runtime, render functions, flow functions, init.

**It is published as a Claude Artifact**, which wraps the content in a page skeleton —
that is why the file has no `<!doctype>`, `<html>`, `<head>` or `<body>` tags. If you
ever want to open it directly in a browser, wrap it (the scripts here do exactly that).

Artifact URL: <https://claude.ai/code/artifact/eb5509f7-5572-4deb-8c9f-0f49ba804edb>
(currently at version 26)

## 4. Two grid traps that have already bitten

- `.thread` and `.deck-view` declare only `grid-template-rows`. Without
  `grid-template-columns:minmax(0,1fr)` they size to `max-content` and text spills out
  of the pane. Both now set it. Any new grid needs the same.
- Editing this file with a Python script? Put `open(p,'w').write(s)` at the end and make
  sure no `assert` or `raise` can fire between the replacements and the write. Two whole
  batches of edits were silently discarded that way.

## 5. Design system in force

```
--bg #FFFFFF        --bg-sunk #F4F2EF   --surface #FFFFFF   --tint #F4F2EF
--line #EDEBE8      --line-soft #F0EDE7 --line-strong #D8D3CC
--text #201F1E      --text-sec #4A4745  --text-soft #6A6662 --text-faint #9A968E
--gold #847347      --gold-tint #A19164 --cream/--sand #E3D8C2
--rail-bg #0C2004   (= rgba(0,0,0,.3) composited over rgb(17,45,6) — not hand-picked)
--rail-fg #FFF  --rail-fg-2 rgba(255,255,255,.6)  --rail-fg-3 rgba(255,255,255,.4)
--rail-hover rgba(255,255,255,.09)   small icon buttons only
--rail-active rgba(255,255,255,.17)  primary nav rows, hover AND current
--rail-hist rgba(255,255,255,.10)    chat-history rows
--rail-meta rgba(255,255,255,.3)     history timestamps
--rail-line rgba(255,255,255,.15)    dividers and the footer rule
--agent-av #6A5A32 / --agent-av-2 #4A5880 / --agent-av-3 #8E3E2C

position tiers (t0..t4 — green, blue, yellow, orange, red)
--t0 #266846  --t0-bg #F3FAF6  --t0-ln #D6EADE   CP Template
--t1 #35639E  --t1-bg #F4F8FD  --t1-ln #D8E5F5   Also acceptable
--t2 #8A6A0F  --t2-bg #FDFAEB  --t2-ln #ECE2BB   Fallback 1
--t3 #AF4E17  --t3-bg #FEF5EE  --t3-ln #F4D9C3   Fallback 2
--t4 #A83A26  --t4-bg #FDF4F2  --t4-ln #EFD6D0   Red line

risk: --crit #B04A31  --elev #C08A24  --ok #3E72C8

--btn-h 28px   text CTAs in the app chrome
--ctl-h 20px   dense in-document controls
--r-sm 6 / --r-md 8 / --r-full 9999
spacing xxs 2 · xs 4 · sm 6 · md 8 · lg 12 · xl 16

--font Geist   --serif Spectral   --mono ui-monospace   body 14px
--fast 120ms --base 220ms --slow 340ms   --ease cubic-bezier(.2,0,0,1)
```

Fonts: Geist for UI, **Spectral for artifact and provision titles**, mono for numbers,
clause refs and counts. Mono numerals inside prose are 11.5px (see `.record b`,
`.tier-ap b`) — reuse that value rather than inventing another.

## 6. Figma — Enterprise Brain Base 2026

File key `lqKjNjyifEXCeywg69Knr2`. Frames mapped so far:

| Node | What |
|---|---|
| `1731:251990` | Main_nav, expanded (280px) |
| `7134:273616` | Main_nav, collapsed (56px) |
| `967:349250`  | Main_nav with all states — the authoritative one; has the Hover bg layers |
| `3838:245967` | Arifact Header — the artifact canvas top bar |
| `5865:366539` | ES Breadcrumb / chat header |
| `5563:230560` | Copilot desktop Input Box / composer |
| `875:165812`  | Copilot_Question Card |
| `1809:501331` | Dashboard |

**Always load the `figma-design-to-code` skill before `get_design_context`.** And prefer
`get_design_context` over `get_metadata` — metadata gives boxes but not fills, type or
the hover layers, and reading geometry alone produced two rounds of wrong work here.

Figma asset URLs expire in ~7 days. Icons in this file are real exported Untitled-UI
glyphs, inlined with `stroke="currentColor"` so they inherit state colour. The cloud
sandbox has no egress to figma.com — they were fetched through the browser pane with
`fetch()` from a figma.com origin. Locally, `curl` works.

### Rail geometry, measured and verified

Expanded: rail 280, root `padding:0 2px`, rows **12–268 (256 wide, 32 tall, 36 pitch)**,
first row top **68**, hover plate **260x32** centred (bleeds 2px each side), radius 8,
dividers **15–265 (250 wide)** with **8px above and 8px below**, header block 40 tall at
y 12. Agents and History rows are a **0-gap stack — 32px pitch**; only Primary items
carry the 4px gap. Subheaders 32 tall, `pl 8`, Geist **Regular** 13/20 at 40% white.
History rows Geist **Regular** 13/20 at 60%. Timestamps 12/16 at 30%.

Collapsed: rail 56, items **32x32 at x 12**, same 36 pitch, same y 68 start, so nothing
shifts vertically when collapsing.

### Artifact header, measured and verified

40px bar + 1px rule, `padding:6px 8px`, one 28px content row, action groups 4px apart,
window-icon trio 2px apart. Text buttons 24 tall, `px 8`, radius 6, 13px, 14px icons,
56px min-width, border `--line`, text `--text-soft`. Icon buttons 28x28, radius 6,
16px icons.

Two deliberate departures from that frame, both requested by the user:
- the title is **Spectral 15/20**, not 13px Geist Medium in a pill;
- **Publish Playbook is a filled dark button**, not a neutral secondary.

## 7. Product decisions worth not re-litigating

- **SharePoint / OneDrive only.** Ironclad and other CLM vendors are out — this is
  ChargePoint's own Microsoft 365 tenancy.
- **Permissions are inline cards at the point of need**, never a settings screen. Three
  actions every time: Always allow / Allow once / Don't allow, plus a "what I will read"
  disclosure and an explicit "never" line. The Deal Desk approval matrix is requested
  *mid-question*, as an answer option — that is the showpiece moment.
- **Three questions, one at a time.** The agent decides everything precedent can decide
  and asks only where the evidence conflicts. A skipped question lands in *Deferred
  decisions* rather than being silently decided.
- **Five-tier ladder**: CP Template / Also acceptable / Fallback 1 / Fallback 2 / Red line.
- **Master–detail, not an accordion**, for the provision list.
- Approval routing and per-provision provenance were **removed** from the artifact for
  being visually overwhelming. The approver name on each tier went with them — its slot
  now carries the **citation count** ("6 of 14 agreements").
- The **position-ladder legend was removed**; tier colour on the cards carries it.
- The artifact head is **one quiet summary line plus a Details disclosure** — owner,
  generated date and source are archival, not operational.

## 8. Things that are live, not decorative

`data-tip` on any element gives it a tooltip (single shared element, flips above/below,
clamps to the window, shows on focus, hides on scroll). Tier toggles include/exclude a
position from the published playbook. The pane-header **Enabled** toggle drops a whole
provision and dims its list card. Interview answers pre-select tiers and are labelled
"set by you". Citation counts are derived from `tierCounts()` and reconcile exactly with
the record line at the foot of the detail pane.

## 9. Docs

`docs/` holds the four design documents from the Claude project — read them before
changing behaviour:

- `playbook-agent-design.md` — the flow, question-design rules, knowledge base
- `provision-model.md` — the five-tier ladder, per-provision metadata, the six views
- `metadata-provenance.md` — where card metadata comes from, the two-provenance model
- `unifyapps-host-spec.md` — the host app spec mapped from the Figma
- `feedback-log.md` — every piece of review feedback and what was done about it

## 10. Publishing

The prototype is a published Claude Artifact. In Claude Code, `playbook-studio.html` is
just a file — edit and verify it here. To push a new version, open it in a Claude
(Cowork) session that has the Artifact tool and republish against the URL above.
