# Review feedback and what was done about it

Every instruction given during the 15 Sep 2026 session, in order, with the resolution.
Kept so none of it gets accidentally reverted.

## Session instructions

| # | Asked | Done |
|---|---|---|
| 1 | Build the agentic flow; ask few questions; end in a playbook artefact with issues and positions; Claude-style bottom question panel; flag which clauses each issue impacts; permissions with always-allow / allow-once | Whole prototype |
| 2 | "Ironclad is another company and this is for ChargePoint" | Replaced with SharePoint / OneDrive |
| 3 | Make the landing page look like the Routines reference | Card grid + composer |
| 4 | "How will the app get the metadata in each contract type?" | Two-provenance model — see `metadata-provenance.md` |
| 5 | Match the client's NDA playbook content and hierarchy | Five-tier ladder, provision inventory — see `provision-model.md` |
| 6 | Artefact in a canvas to the right of the chat; summarise what the agent did in the chat | Split view |
| 7 | "These 2 look very congested… make these neat, one size" | 3x2 meta grid, one value size, unified chip |
| 8 | Match the UnifyApps host app; Playbooks under Artifacts in the side nav; no button over 20px | `--ctl-h:20px`, rail rebuilt |
| 9 | Landing keeps chat box + templates; no visual with the playbooks | Landing restructured |
| 10 | "Your final artifact looks very daunting and busy" — hide things, progressive reveal, remove approval routing and provenance | Both removed; disclosures added |
| 11 | Permission widget: reduce height, Always allow to the right, reverse footer order, CTA 32px | Done |
| 12 | Map the artifact to the Figma; CTA 28px; reduce the SharePoint descriptor; **no text truncated anywhere** | All 7 ellipsis / line-clamp rules removed |
| 13 | Show issues as master–detail, not an accordion | Rebuilt |
| 14 | `#newPb` → 28px and primary colour | Done |
| 15 | `#browseAll` → 28px, less rounded (4px radius) | Done |
| 16 | Remove the landing status bar | Removed; unclassified review moved into the Permissions sheet |
| 17 | Template chips → 28px | Done |
| 18 | Remove the artefact cover block | Removed (~120px of duplication) |
| 19 | Provisions column +100px | 232 → 332 |
| 20 | Make all toggles smaller | 28x16 → 22x13, 9px knob |
| 21 | Nav spacing and icons don't match the Figma; chat header has no colour; question box must match `875:165812` | Full Figma re-read |

## Artifact comment threads

| Thread | Comment | Resolution |
|---|---|---|
| `ce599467` | "this is incorrectly spaced and hovers are wrong" (`#navPrimary`) | Hover unified to `.17` for hover **and** current, differentiated by label colour; plate made a pseudo-element; divider 8/4; sub-item gap 4px; sub-item back to 13px |
| `f15cf4f0` | "show hover state for these" (provision cards) | Hover was a 12-point border shift — invisible. Now takes a `#F4F2EF` fill; current row keeps its dark border while hovered |
| `195b1b04` | "why this? show the number of citations here" (approver on a tier) | Approver was a leftover from the approval-routing removal. Replaced with the citation count, derived by `tierCounts()` and reconciling with the record line |
| `9f986490` | "remove this and make the colour marker more prominent in the positions" (ladder legend) | Legend removed; each position card took a 4px full-height colour edge (later superseded by full tinted cards) |
| `776daba5` | "not as per the figma. odd hovers with more space on right" | Re-measured both Main_nav variants: plate back to 260x32 centred, dividers 250 wide at 15–265, header 40 tall so rows start at y 68, collapsed items 32x32 at x 12 |
| `f4dda9e4` | "this is all wrong… map the spacing and colour and hover states" (+ two node URLs) | Pulled full design context. Agents and History rows are a **0-gap 32px stack**, not 4px/36. Two hover values (`.17` nav, `.10` history). Divider and footer rule `.15` not `.10`. Timestamps `.3` not `.4`. Footer avatar `.3` not `.14`. Agent avatars given their three distinct swatches. History rows Regular, not Medium |
| `05d1f6b7` | "show hover data" (provision metadata row) | Tooltips on the risk dot, template ref, frequency badge and ladder citation counts. One shared tooltip element, flips and clamps, keyboard-accessible |
| `a5f83c6c` | "too crowded and overwhelming" (artefact property band) | Four uppercase label/value pairs + two rules → one quiet line plus a Details disclosure. Head 92px → 34px |
| `a08d6d2f` | "increase the width by 100 pixel of this column" | 332 → 432; stack breakpoint 620 → 720 |
| `a099ff0d` | "make this block max width 760 pixels" | Detail pane header and body capped at 760px content, left-aligned; the header rule still spans the pane |
| `4897752c` | "make this like the header specs from `3838:245967`" | 40px bar, `padding:6px 8px`, 28px row, 24px text buttons, 28px icon buttons, hairline separator, version chevron, download moved into the window-icon trio |

## Direct requests in chat

- "Make the colours of positions these, easy to identify and needing no legends" — five
  tinted position cards (green / blue / yellow / orange / red) with the tier name in the
  matching hue and the position text in a white inset box; same treatment in *By clause*
  and *Counterparty-introduced*; the same five hues on the Quick-reference swatches.
- "Make the artifact content header like this. Write the title in Spectral font" —
  Spectral title, record chip, download / Add from Library / Publish Playbook / expand /
  close; plus the detail-pane header with its **Enabled** toggle.

## Standing constraints that came out of this

1. No truncation anywhere.
2. One hover value per surface, and the current item is distinguished by something other
   than a second fill.
3. Colour carries meaning only.
4. Measure before claiming a spacing change is done.
5. Read `get_design_context`, not just `get_metadata` — geometry without fills and type
   produced two rounds of wrong work.
