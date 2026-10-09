# Host app spec — UnifyApps / Enterprise Brain Base 2026

Two sources, the Figma file being authoritative where they disagree:

- **Figma — Enterprise Brain Base 2026** (`lqKjNjyifEXCeywg69Knr2`), read via the Figma MCP.
  Frames used: `967:349250` (Main_nav, all states — authoritative), `1731:251990` (Main_nav expanded),
  `7134:273616` (Main_nav collapsed), `3838:245967` (Arifact Header), `1809:501331` (dashboard),
  `5865:366539` (ES Breadcrumb / chat header), `5563:230560` (Copilot desktop Input Box),
  `875:165812` (Copilot_Question Card).
- `dist-one-psi-98.vercel.app`, read from its live stylesheet and DOM — the earlier build,
  used for behaviour the Figma doesn't show (collapse-on-hover, drag handle).

Tokens: see the token block in `../CLAUDE.md`, which is the live copy.

## Side nav (Main_nav) — measured and verified

280px expanded, 56px collapsed, root `padding:0 2px`.

- **Header** `px 8, pt 12`, block 40 tall so the nav body starts at **y 68**. Logo `pl 4 pr 8`,
  32px mark, gold wordmark. Right: two 36px buttons, radius 8, 18px icons at 40% white —
  `search-md` and `layout-left`. Search lives here, not in the list.
- **Navigation** column `gap 16`.
- **Primary items** `px 10, pb 4, gap 4` → rows **12–268, 256 wide, 32 tall, 36 pitch**.
  Item `px 8 py 6`, radius 8, **gap 12**, icon **16px**, label **Geist Medium 13/20**.
  Default `rgba(255,255,255,.6)`; the New-session row and the current row are `#FFF`.
- **Hover plate** `rgba(255,255,255,.17)`, **260x32**, centre-translated over the 256 row so it
  bleeds 2px each side; radius 8. Hover and current share the plate — the current row is told
  apart by its white label, not by a second fill.
- Items, in order: **New session · Projects · Routines · Meetings · Artifacts**, icons
  `plus · folder · clock · calendar · cube-02`. **Playbooks** is our addition, nested under
  Artifacts. The Vercel build's *Search* and *Do List* rows are not in the Figma.
- **Section head** h 32, `pl 8 py 6`, radius 8, **Geist Regular 13/20 at 40% white**, with
  `chevron-down-sm` in a 2px-padded 4px-radius button.
- **Agents and History rows are a 0-gap stack — 32px pitch.** Only Primary items carry the 4px
  gap. Getting this wrong made the lower two-thirds of the rail read looser than the top.
- **Agent row** avatar **20px, radius 6**, `gap 10`, three swatches: `#6A5A32`, `#4A5880`, `#8E3E2C`.
- **History row** `pl 8 pr 4 py 6`, h 32, Geist **Regular** 13/20 at 60%. Hover plate
  `rgba(255,255,255,.10)` — lighter than the nav's `.17`. Timestamps 12/16 at **30%**.
- **Dividers** 1px `rgba(255,255,255,.15)`, **250 wide at 15–265**, with **8px above and 8px below**.
- **Footer** `px 10 py 8`, gap 8, top rule `rgba(255,255,255,.15)`, 32px round avatar on
  `rgba(255,255,255,.3)`, letter Geist Medium 13/20 at 70%, name at 60%, `chevron-up-sm`.
- Collapsed: items **32x32 at x 12**, same 36 pitch, same y 68 start. Labels clamp to `width:0`,
  sections clamp to `max-height:0`, the wordmark animates to 0, and the collapse button appears
  only on hover of the rail head.

One deliberate departure: the frame truncates nav labels with an ellipsis. No truncation is a
standing constraint here, so long labels wrap.

## Artifact header (Arifact Header `3838:245967`) — measured and verified

40px bar + 1px bottom rule `#EDEBE8`, `padding:6px 8px`, one **28px** content row, `gap 12`.
Left: document icon 28, title, record chip. Right, grouped 4px apart: utility icon button,
16px hairline separator, version chevron (13px Regular, 12px chevron, 24 tall), text buttons,
then a trio of window icons 2px apart (download, expand, close).

- Text buttons **24 tall**, `px 8`, radius 6, 13px, 14px leading icon, 56px min-width,
  border `#EDEBE8`, text `#6A6662`.
- Icon buttons **28x28**, radius 6, 16px icons.

Two deliberate departures, both requested: the title is **Spectral 15/20** rather than 13px Geist
Medium in a pill, and **Publish Playbook is filled dark** rather than a neutral secondary.

## Chat header (ES Breadcrumb)
40px, `px 12 py 6`, gap 6. **No fill and no bottom rule** — the Figma's `#FBFAF9` is invisible
against the page and reads as a band once you add a border. Title button `button/sm` radius 6,
13px Geist Medium `#201F1E`, `p 4`, 14px chevron. Right: cost (14px ring + Spectral SemiBold
14/18), Share (14px `lock-03` + 13px label), `cube-02` icon button. All 28px. No overflow menu.

## Composer (Copilot desktop Input Box)
`radius-full`, 1px `#EDEBE8`, `0 4px 8px rgba(215,211,208,.25)`, `pt 8 pb 8 px 10`, 48px.
Action bar 32px: `plus` and a source pill on the left (radius-full), 15px/26 placeholder
`#B4ADA7`, right-hand actions radius `button/md` 8.

## Question card (Copilot_Question Card) — sits **above** the composer
Card radius 12, 1px `#EDEBE8`, `0 4px 8px -2px #EDEBE8, 0 2px 4px -2px #EDEBE8`.
- **Top bar** `#F7F5F3`, `px 16 py 12`: question **Geist Medium 15/24 `#4A4745`**; right group
  gap 6 — `chevron-left`, "N of M" Geist Regular 12/16, `chevron-right`, close. All 16px in
  4px-radius buttons.
- **Body** white, `p 8`, gap 2. Option row h 36, `p 8`, radius 8, gap 8: a 20x20 radius-4
  `#F7F5F3` badge then Geist Regular 13/20 `#4A4745`. 1px rule between rows.
- **Last row** `pl 8 pr 0 py 8`: `edit` glyph badge, placeholder 13/20 `#B4ADA7`, and a **Skip**
  button — white, 1px `#EDEBE8`, radius `button/xs` 6, `px 8 py 4`, min-w 52, Geist Medium
  12/16 `#6A6662`.
- Our one extension: the corpus evidence line sits under the question in the top bar at 12/16 in
  `--text-faint`. Without it the question loses the reason it is being asked.

## Frame geometry
Rail 56 (collapsed) · header 40 · content column **760** centred · composer block at y 825,
48 tall, 27 off the bottom. User bubble max **522**.

## Two grid traps
`.thread` and `.deck-view` declare rows only; without `grid-template-columns:minmax(0,1fr)` they
size to max-content and text spills out of the pane. The Figma sets exactly this on `.artifact-shell`.

## Icons
Real exported Untitled-UI glyphs, fetched from the Figma asset endpoint and inlined with
`stroke="currentColor"` so they inherit state colour. Asset URLs expire in ~7 days.
