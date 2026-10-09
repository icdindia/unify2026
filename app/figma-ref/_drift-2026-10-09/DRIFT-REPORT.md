# What changed in Figma since 8 October

Figma file [`lqKjNjyifEXCeywg69Knr2`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/), page Chat + Artifacts plus the Projects frames. Checked on 9 October 2026 against the references the prototype in `app/` was built from. Neither the app nor the original references were changed.

## In short

- **233 mapped frames were re-captured.** None is missing and none failed to capture.
- **104 frames have a real design change.** 60 of them scored under the capture tool's 0.15% threshold, so they were labelled "same"; I found them by eye. 2 frames the tool flagged differ only by text anti-aliasing. 127 frames are unchanged.
- **Most of it is a handful of repeated changes**, not new screens:
  - A. New artifact type icons (56 frames).
  - B. Sidebar status dots (36 frames).
  - C. Files panel renamed to "Outputs" (3 frames).
  - D. Simpler project cards (2 frames).
  - The rest (E to K) are smaller. F adds three cards to the 15a gallery sheet and G changes the invite-chip avatars in the built share modal (probably a Figma slip). E, H, I, J and K touch only screens that are not built yet.
- **What it means for the prototype:** 21 changed frames are built screens and 1 is a gallery page; 41 more are built in part. The built parts that need work are the inline artifact card, the files panel, the artifact header, the sidebar dots and the project cards. The other 41 changed frames are not built yet, so the new design can be used when they are built.
- **16 frames exist in Figma that are not in the map.** 15 are frames you excluded on 8 October (the second input-box row, the option 2s, a loose frame). One is new and was not captured: **"1750" ([15599:400670](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15599-400670))**, next to the 16a card spec. Look at it first.
- Two approved prototype fixes now match Figma (`nav-unread-dot`, `landing-controls-tertiary`).

## Suggested order of work

1. Send the designer the questions below. The icon mapping (A), the sidebar dot legend (B) and the Outputs count (C) block the built work; the "O" chips (G), "$10/month" (H), the missing editor tools (I) and the usage-modal padding (J) look like slips.
2. Capture frame "1750" (15599:400670) and add it here.
3. Update the built parts once the answers are in: icons and the 50px card tile (A), the Outputs panel (C), the sidebar dots and footer (B), the project cards (D).
4. Then re-capture the references the regression suite compares against (`app/figma-ref/chat-artifacts`, `prototypes/project-dashboard/_ref`). This check left them untouched, so parity and chat-journey diffs will show these changes until then.

## How to read the tables

- **Built**: the prototype draws this frame. **Built in part**: the screen is built, but some of the frame's state (a menu, a hover, a seed) is not drawn yet. **Gallery page**: a component sheet. **Not built**: the prototype shows its "Not built yet" placeholder.
- The **open** links go to the running prototype (`npm --prefix app run dev`, then [http://localhost:4190/](http://localhost:4190/)). The review bar there links each screen back to its Figma frame.
- **Review** says whether I confirmed the capture agent's description or corrected it.

## Changes that repeat across frames

### A. New artifact type icons

The flat single-colour file-type glyphs were replaced, file-wide, by a layered colour icon set (two stacked sheets plus a small badge). It is the same style as the PDF icon of the 16a spec (14876:285160) and the library set "Artifact Icon" (15193:1281888) that `artifact-header/typeIcons.ts` already notes. On inline artifact cards the icon also sits in a larger tile (about 50px instead of 40px), which pushes the title ~10px right. It shows up on inline cards, the files panel, the artifact header, the Artifacts landing grid and list, the Download menu and the type-colour sheet.

Open points:

- The Pipeline Command card (Interactive HTML) is blue in 15, 19-21b and the collaborative frames, but orange in 16-18, and the orange one is the Presentation artwork.
- The type-colour sheet (artifacts-landing c01) gives Presentation and the first Connector the blue Document art, and Application and Playbook the orange Presentation art, so icons no longer match their colour bars.
- The Artifacts list view (artifacts-landing 03) shows the blue Document icon for Application and Presentation.
- In 15a, Connector App, Guidelines Doc and JSON keep the old tile size and text position.
- Untitled.xls has the green Sheets icon in 19-20 but a blue Document icon in 21-22.
- The commenter views (commenters 07, 09, 10) still show the old purple Application glyph, only smaller and paler, while the viewer frames (artifact-view-viewer 01, 01a) use the new blue icon.

Built parts affected (12 built frames, 12 built in part):

- `src/components/inline-artifact-card/glyphs.ts`
- `src/assets/artifact-types/glyph-*.svg`
- `src/components/inline-artifact-card/inline-artifact-card.css`
- `src/components/artifact-header/typeIcons.ts`
- `src/assets/artifact/type-*.svg`
- `src/components/files-panel/FilesPanel.tsx`
- `src/components/files-panel/data.ts`
- `src/components/files-panel/files-panel.css`
- `src/fixtures/artifacts.ts (FILES_PANEL_ARTIFACTS)`
- `src/screens/chat/drawn.ts (card glyph per step: 15, 19-21b)`
- `src/gallery/pages/inline-artifact-cards.tsx (SHEET_15A)`

**Suggested action:** Adopt, after the designer confirms the type-to-icon mapping. Export the Artifact Icon variants once (10 types plus Mail and Image), point GLYPHS and TYPE_ICONS at them, and move every inline card to the 50px tile (the `generation="v2"` card already has it). Keep fix `artifact-glyph-per-type` (one icon per type): Figma still draws the same card with two different icons.

### B. Sidebar status dots and footer

In the dark expanded sidebar, the hollow "in progress" rings are now solid white dots, the red "failed" ring on Review customer feedback is a solid blue dot, the white dot on Get all granola notes is orange, and Sheet Formula Consultant now has a white unread dot. The footer bell and chevron moved ~4px right. The light sidebar did not change. Each dot is only a few pixels, so the capture tool scored these frames "same". I found the change in 36 frames by checking the dot column of every capture.

Open points:

- The colours no longer follow one rule: Plan launch timeline is white in chat-artifact 08 but blue in nav-behaviour 01. We need the new legend (what white, blue and orange mean).

Built parts affected (10 built frames, 25 built in part):

- `src/shell/nav/rows.tsx (StatusDot, STATIC_DOT)`
- `src/shell/nav/icons.ts (dot assets)`
- `src/fixtures/pins.ts (row statuses)`
- `src/shell/nav/Nav.tsx (footer bell and chevron)`

**Suggested action:** Ask for the legend, then update STATIC_DOT and the statuses in fixtures/pins.ts. The white unread dot now matches approved prototype fix `nav-unread-dot`, so it can be drawn as designed. Fix `nav-status-dots-animated` keeps its motion but needs the new colours. Adopt the 4px footer shift.

### C. Files panel becomes "Outputs"

The files panel header "Artifacts 3 / Download All" is now "Outputs 3" with a close X; Download All is gone. In the list view (17) the fifth row became "Star Galaxy / Image • IMG • V1" and two photo-thumbnail rows "Pipeline Command / Interactive Text • Version 1" were added, so the card grows past its old fixed 720px height. Rows use the new icons (theme A).

Open points:

- The count still reads 3 over 7 rows (the prototype already flags 3-over-5 as fix candidate `files-panel-artifacts`).
- "Interactive Text" with a photo thumbnail is a new row type with no type icon. What is it?
- Is Download All removed on purpose?

Built parts affected (3 built frames, 0 built in part):

- `src/components/files-panel/FilesPanel.tsx`
- `src/components/files-panel/data.ts`
- `src/components/files-panel/files-panel.css`
- `src/fixtures/artifacts.ts (FILES_PANEL_ARTIFACTS)`
- `src/components/inline-artifact-card/glyphs.ts`
- `src/assets/artifact-types/glyph-*.svg`
- `src/components/inline-artifact-card/inline-artifact-card.css`

**Suggested action:** Adopt the rename and the close X (the panel already closes on Escape, so the X can call the same handler). Wait for answers before adding the photo rows or dropping Download All.

### D. Projects landing cards and toolbar

Project cards lost the "12 items" line (cards are ~16-18px shorter) and the four status icons (pin, lock, globe, people) became a single pin or lock icon, or none. On the hovered card the grey ⋯ button is gone although its menu is still open. "All Types" and "Newest" lost their grey fill, so the search field moved ~16px right.

Open points:

- Which single icon shows when: pin if pinned, lock if private, nothing otherwise?
- Is the hidden ⋯ on the card whose menu is open intended? The menu then has no visible trigger.

Built parts affected (1 built frame, 1 built in part):

- `src/screens/projects/ProjectCard.tsx`
- `src/screens/projects/ProjectsPage.tsx`
- `src/screens/projects/project-card.css`
- `src/data/projects.ts`

**Suggested action:** Adopt. The unfilled All Types and Newest buttons now match approved prototype fix `landing-controls-tertiary`, which can become the designed look. The parity references in `prototypes/project-dashboard/_ref` are now out of date and need a fresh capture before the next parity run.

### E. Artifacts landing cards

On the Artifacts landing grid, every card meta uses the new icons and the meta block is ~4px tighter, so cards are ~4px shorter and later rows sit progressively higher.

Built parts affected: none (only screens that are not built yet).

**Suggested action:** Nothing to change: the Artifacts landing is not built. Build it from the new frames.

### F. Every-type card sheet (15a) grew

The 15a sheet grew from 1104 to 1339px. It has three new cards (Pipeline Mail / Mail, Guidelines Doc / Playbook, Image / Image• IMG), and Table CSV now comes before Interactive HTML.

Open points:

- "Image• IMG" is missing a space (and "Image •IMG" in 17).

Built parts affected (1 built frame, 0 built in part):

- `src/gallery/pages/inline-artifact-cards.tsx (SHEET_15A)`
- `src/components/inline-artifact-card/glyphs.ts`
- `src/assets/artifact-types/glyph-*.svg`
- `src/components/inline-artifact-card/inline-artifact-card.css`

**Suggested action:** Add the three cards and their icons to the 15a gallery sheet once theme A is settled. The fixtures already know playbook and email types (drawn with the Markdown and Document icons today); image is new.

### G. Invite chips all show "O"

In the share and invite flows, every invitee chip avatar is now a larger dark navy "O" (Olivia, Phoenix, Natali, Candice and Andi alike), where each chip used to show its own grey initial. The Publish modal's Management chip also shows "O" now.

Open points:

- This looks like a lost text override on the chip avatar, not a design decision.

Built parts affected (0 built frames, 5 built in part):

- `src/components/share-modal/ShareModal.tsx`
- `src/components/form/TagsField.tsx`
- `src/components/pill/Tag.tsx`

**Suggested action:** Do not adopt. Ask the designer. The prototype keeps per-person initials.

### H. Publish modal shows "$10/month"

A grey "$10/month" suffix now follows the artifact URL and the visibility options ("Everyone at UnifyApps", "Restricted"). The URL row icon is a muted plum, and option text sits ~4-6px higher (no longer centred).

Open points:

- Is the price real copy, or placeholder text from the option component?

Built parts affected: none (only screens that are not built yet).

**Suggested action:** Nothing to change: the Publish flow is not built. Ask before building it.

### I. Full-page editor header loses its tools (PDF, MD, PPT)

In the full-page editor for PDF, Markdown and Presentation (artifact-full-editor 04-06), the whole right-hand header group (copy, refresh, v3, Publish, comments, download, collapse, close) and the chevron after the file name are gone. The scores (~0.12%) hid this under the threshold.

Open points:

- Intended (these types are read-only here?) or a broken instance?

Built parts affected: none (only screens that are not built yet).

**Suggested action:** Nothing to change: these screens are not built. The Artifact header component is built and keeps its tools until the designer confirms.

### J. "Ask for more Usage" modal header

The title and subtitle moved up ~12px, so the title now touches the modal's top edge. The close X barely moved.

Open points:

- Looks like lost header padding.

Built parts affected: none (only screens that are not built yet).

**Suggested action:** Not built. Ask the designer, and keep the original padding until they answer.

### K. Settings modal gains a "Settings ›" item

Settings › Memory: a new "Settings ›" item (gear icon, chevron) sits at the bottom of the left nav. The content column moved down ~8px, so the last row hides behind the composer.

Open points:

- What does "Settings ›" open?

Built parts affected: none (only screens that are not built yet).

**Suggested action:** Not built (the modal is not drawn yet). Build it from the new frame.

## Questions for the designer

1. Artifact icons: which icon belongs to each type? Interactive HTML / Application is blue in some frames and orange (the Presentation art) in others; the type-colour sheet and the list view reuse the Document and Presentation art for other types (theme A).
2. Inline cards: should every card use the larger 50px tile? Connector App, Guidelines Doc and JSON in 15a still use the old one.
3. Commenter views (commenters 07, 09, 10) still show the old purple glyph, smaller. Should they use the new icon like the viewer frames?
4. Outputs panel: what does the count mean (3 over 7 rows)? What are the photo "Interactive Text" rows? Is Download All gone for good?
5. Sidebar dots: what do white, blue and orange mean now? The same row has different colours in different frames.
6. Project cards: what rule picks the single status icon? Should the ⋯ button hide while its menu is open?
7. Invite chips: is every chip showing "O" intended? It looks like a lost override.
8. Publish modal: is "$10/month" real copy?
9. Full-page editor for PDF, MD and PPT: are the header tools removed on purpose?
10. "Ask for more Usage" modal: is the missing header padding intended?
11. Settings modal: what does the new "Settings ›" item open?
12. Frame "1750" (15599:400670): what is it? It was not captured this time.

## Prototype fixes this touches

| Fix | Status | Figma now | Note |
|---|---|---|---|
| `nav-unread-dot` | approved | Figma now agrees | Figma now draws the white unread dot on "Sheet Formula Consultant". It can be drawn as designed. |
| `landing-controls-tertiary` | approved | Figma now agrees (fill) | "All Types" and "Newest" have no fill at rest in Figma now. The spacing was not re-measured. |
| `nav-status-dots-animated` | approved | needs new colours | The motion stays; the static colours it starts from changed (theme B). |
| `artifact-glyph-per-type` | proposed | still needed | Figma still draws the Pipeline Command card with different icons in different frames (blue vs orange). Its "after" should name the new blue Application icon. |
| `files-panel-artifacts` | proposed (fixture candidate) | still needed, gap is wider | "Outputs 3" now sits over 7 rows (it was 3 over 5). |

The Projects frame now titles the sidebar group above "Sheet Formula Consultant" "Chats", as the prototype already does (Q11).

## Journey by journey

### projects: Projects (shell)

3 frames: 3 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 landing | [11657:386523](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386523) | Project cards: the "12 items" line is gone (cards ~16px shorter), the pin/lock/globe/people cluster is now one pin or lock (or none), and the hovered card has no grey ⋯ button although its menu is open. "All Types" and "Newest" lost their grey fill, so the search field moved ~16px right. Sidebar: the dots changed as in chat-artifact 08, the group above "Sheet Formula Consultant" is now titled "Chats" (the prototype already says Chats), and the footer bell and chevron moved ~4px right. | **Projects landing, Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/projects?rail=e) | Themes D and B. |
| 02 dashboard | [14045:584747](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-584747) | The dashboard itself only differs by sub-pixel text. Sidebar: the dots changed as in chat-artifact 08 ("Sheet Formula Consultant" gains a white unread dot), and the footer bell and chevron moved ~4px right. The grey corners in the old reference come from how it was captured. | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/projects/client-onboarding?rail=e) | Theme B. |
| 03 dashboard, option 2 | [15054:105151](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15054-105151) | As option 1: only the sidebar dots and the footer bell/chevron (~4px right) changed; the rest is sub-pixel text. | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/projects/client-onboarding?rail=e&opt=2) | Theme B. |

### input-large: Desktop input box designs (large variant)

25 frames: 0 changed, 1 render noise only, 24 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 07 (render noise) | [5220:203956](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-203956) | No visible design change: the first composer line and the limit tooltip render up to 1px off horizontally. | **None**<br>Screen built in part (not drawn yet: compose, hover) · [open](http://localhost:4190/#/new?compose=skill-over&hover=limit&rail=c) | None. |

### nav-behaviour: Nav bar behaviour (pins, project hover, >10 chats, landing pins)

9 frames: 9 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [11614:672894](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/new?seed=no-chips&rail=e) | Theme B. |
| 02 | [11614:676434](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-676434) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: hover) · [open](http://localhost:4190/#/new?seed=no-chips&hover=pin:project&rail=e) | Theme B. |
| 03 | [11715:658763](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-658763) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: open, menu) · [open](http://localhost:4190/#/new?seed=no-chips&open=pin:project&menu=pin:project&rail=e) | Theme B. |
| 04 | [11614:677973](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-677973) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: open, menu) · [open](http://localhost:4190/#/new?seed=no-chips&open=pin:project&menu=pin-chat:excel-formula>switch-project&rail=e) | Theme B. |
| 05 | [11693:260033](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11693-260033) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, open) · [open](http://localhost:4190/#/new?seed=no-chips,pins-over10&open=pin:project&rail=e) | Theme B. |
| 06 | [11715:627268](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-627268) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, open, hover) · [open](http://localhost:4190/#/new?seed=no-chips,pins-over10&open=pin:project&hover=pin:view-all&rail=e) | Theme B. |
| 07 | [13701:756891](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13701-756891) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, open, menu, hover) · [open](http://localhost:4190/#/projects/project-name?seed=pins-over10&open=pin:project&menu=row:c1>add-to-project&hover=title-pin&rail=e) | Theme B. |
| 08 | [11780:448662](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11780-448662) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, open, menu, hover) · [open](http://localhost:4190/#/projects/project-name?seed=pins-over10,project-pinned&open=pin:project&menu=row:c1>add-to-project&hover=title-pin&rail=e) | Theme B. |
| 09 | [11635:685715](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11635-685715) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: menu) · [open](http://localhost:4190/#/new?seed=no-chips&menu=pin:artifacts&rail=e) | Theme B. |

### pinning: Pinning from the title (artefacts, projects, routines, chats)

3 frames: 3 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [11648:688362](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-688362) | Artifacts grid: the type badge in each card meta (DOCUMENT, APPLICATION, SHEETS…) uses the new layered icons. The meta block is ~4px tighter, so cards are ~4px shorter and later rows sit progressively higher. The All Types menu, the Pin/Unpin card menus and the copy are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts?menu=type-filter+card:q3-forecast+card:pinned-variant&rail=c) | Themes A and E. |
| 02 | [11657:386528](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386528) | Projects grid: the "12 items" line is gone from every card, and the pin/lock/globe/people cluster is now a single pin or lock (or none), so cards are ~18px shorter. The hovered Docebo card no longer shows its grey ⋯ button although its menu is open. Sidebar dots changed as in chat-artifact 08. *Review: confirmed; added the missing ⋯ button.* | **Projects landing, Sidebar nav**<br>Screen built in part (not drawn yet: menu, hover) · [open](http://localhost:4190/#/projects?menu=card:docebo-ui-assets&hover=menu:pin&rail=e) | Themes D and B. |
| 03 | [11657:493696](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493696) | Routines landing: the sidebar dots changed as in chat-artifact 08; the Trigger column text moved ~1px. | **Sidebar nav**<br>Screen not built · [open](http://localhost:4190/#/routines?menu=row:board-pre-read&rail=e) | Theme B (the Routines page itself is not built). |

### pinned-chevron: Chevron over the folder icon on a hovered pinned project

2 frames: 2 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [11661:497681](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-497681) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: hover) · [open](http://localhost:4190/#/new?seed=no-chips&hover=pin:project>folder&rail=e) | Theme B. |
| 02 | [11661:514386](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-514386) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: open, hover) · [open](http://localhost:4190/#/new?seed=no-chips&open=pin:project&hover=pin:project>folder&rail=e) | Theme B. |

### drag-unpin: Drag chats to unpin

2 frames: 2 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [11671:666296](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-666296) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: drag) · [open](http://localhost:4190/#/new?seed=no-chips&drag=plan-launch:out&rail=e) | Theme B. |
| 02 | [11671:670376](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-670376) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/new?seed=no-chips,unpinned:plan-launch&hover=routine:plan-launch&rail=e) | Theme B. |

### drag-pinned: Drag pinned items (items below get 5% alpha bg)

3 frames: 3 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [11661:517917](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-517917) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: drag) · [open](http://localhost:4190/#/new?seed=no-chips&drag=project:lift&rail=e) | Theme B. |
| 02 | [11671:661281](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-661281) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: drag) · [open](http://localhost:4190/#/new?seed=no-chips&drag=project:over-1&rail=e) | Theme B. |
| 03 | [11671:662888](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-662888) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/new?seed=no-chips,order:artifacts.plan-launch.project.review-feedback&hover=pin:project&rail=e) | Theme B. |

### chat-artifact: Chat journey with Artifact

27 frames: 14 changed, 13 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 08 | [1809:501331](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) | Sidebar only. The in-progress rings are now solid white dots, the red ring on "Review customer feedback" is a blue dot, the white dot on "Get all granola notes…" is orange, and "Sheet Formula Consultant" has a new white unread dot. The answer is unchanged. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=answer&rail=e) | Theme B. |
| 08a | [5691:481950](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5691-481950) | The same sidebar dot change as step 08. Everything else is text anti-aliasing. It is still almost identical to 08 (531 pixels differ, all in the sidebar). *Review: corrected: the capture said render noise only and "pixel-identical to 08", but the sidebar dots changed.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=answer&rail=e) | Theme B. |
| 09 | [1809:446980](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-446980) | The Share Artifact modal is unchanged. Behind the scrim, the sidebar dots changed as in step 08; the rest is anti-aliasing. *Review: corrected: the capture said render noise only.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=answer&modal=share&rail=e) | Theme B. |
| 15 | [1768:356654](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1768-356654) | The "Pipeline Command / Interactive HTML" card swapped its purple window icon for the new blue layered icon in a larger tile, so the title and subtitle move ~10px right and Download ~10px left. The people-with-access popover and the messages are unchanged. | **Inline artifact card, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=artifact&pop=access&rail=c) | Theme A: new icon and the 50px tile. |
| 15a | [3211:70049](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3211-70049) | The frame grew from 1104 to 1339px. Every card has the new layered icon, and 10 of 13 have the larger tile (text ~10px right). Connector App, Guidelines Doc and JSON keep the old tile and text position. Table CSV now comes before Interactive HTML. There are three new cards: "Pipeline Mail / Mail", "Guidelines Doc / Playbook" and "Image / Image• IMG" (missing space). The card-hover and button-hover notes are unchanged. *Review: confirmed; added the three cards that kept the old tile, and the copy typo.* | **Gallery sheet 15a, Inline artifact card**<br>Screen gallery page · [open](http://localhost:4190/#/gallery/inline-artifact-cards) | Themes A and F. |
| 16 | [1809:363799](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-363799) | On the hovered "Pipeline Command" card (Interactive HTML • 123 KB • Version 1), the purple window icon became the orange layered icon in a larger tile; text ~10px right. The orange icon is the Presentation artwork, while the same card is blue in 15 and 19-21b. *Review: confirmed; flagged the colour mismatch.* | **Inline artifact card, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=artifact&hover=card:pipeline-command&rail=c) | Theme A; ask which colour this card should be. |
| 17 | [5975:413714](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5975-413714) | The files panel was reworked. "Artifacts 3 / Download All" is now "Outputs 3" with a close X. Rows use the new layered icons. Row 5 "Star Command / Document • DOCX • V3" is now "Star Galaxy / Image •IMG • V1". Two new photo-thumbnail rows "Pipeline Command / Interactive Text • Version 1" push Files down, and the card now ends at y≈832 (it was a fixed 720px). The count still says 3. The inline chat card has the orange layered icon. *Review: confirmed; added the count and height.* | **Files panel, Inline artifact card, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=artifact&panel=files&rail=c) | Themes C and A. |
| 18 | [14607:403125](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14607-403125) | Grid view: the header is "Outputs 3" with a close X, and the three output rows (flat orange, red and blue before) all use the blue layered Application icon. The inline chat card has the orange layered icon (text ~10px right). The Files grid thumbnails are unchanged. | **Files panel, Inline artifact card**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=artifact&panel=files-grid&rail=c) | Themes C and A. |
| 19 | [13722:383349](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13722-383349) | Split view. The Outputs dropdown header changed from "Artifacts 3 / Download All" to "Outputs 3" with a close X, and its five rows use the new icons. The inline card in the chat column is blue layered. The "Untitled.xls" header icon went from a dark grey document to the green layered Sheets icon, so the title moves ~6px left. The Files list/grid toggle moved ~4px left. | **Files panel, Artifact header, Inline artifact card, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=artifact&panel=files&cw=650&rail=c) | Themes C and A. |
| 20 | [1809:488480](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-488480) | Icons only. The inline card's flat blue document became the blue layered Application icon (text shifts right). The "Untitled.xls" header icon went from a dark grey document to the green layered Sheets icon. The artifact body and chat are unchanged. | **Inline artifact card, Artifact header, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=artifact&rail=c) | Theme A. |
| 21 | [1795:359260](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1795-359260) | Version-history menu frame. The inline card's purple icon became the blue layered Application icon. The "Untitled.xls" header icon went from a flat blue document to the blue layered Document icon (it is green Sheets in 19-20, so the same file has two icons). The menu and body are unchanged. *Review: confirmed; added the 19-20 vs 21 mismatch.* | **Inline artifact card, Artifact header, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=artifact&menu=version&rail=c) | Theme A. |
| 21a | [6405:306202](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6405-306202) | The same icon swap as step 21, in the title-hover state. | **Inline artifact card, Artifact header, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=artifact&hover=artifact-name&rail=c) | Theme A. |
| 21b | [6405:308388](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6405-308388) | The same icon swap as step 21, in the inline-rename state ("Untitled name here\|.xls"). The rename field and body are unchanged. | **Inline artifact card, Artifact header, Chat screen step overrides**<br>Screen built · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=artifact&edit=name&rail=c) | Theme A. |
| 22 | [1809:484624](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-484624) | Full screen: the "Untitled.xls" header icon went from a flat blue document to the blue layered Document icon, and the title moved ~6px left. Below the threshold, but a real change. | **Artifact header**<br>Screen built · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=artifact&full=1&rail=c) | Theme A. |

### share-artifact: Share or invite collaborators to your Artifacts

10 frames: 3 changed, 7 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 08 | [1819:316471](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316471) | Invite chips (olivia@untitled.com, Phoenix): the small grey initials O and P are now a larger dark navy "O" on both chips. Below the threshold, but a real change. | **Share modal chips**<br>Screen built in part (not drawn yet: seed, modal) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link,invite-2&at=joined&modal=share-artifact>invite&rail=c) | Theme G: do not adopt yet. |
| 09 | [12264:347642](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12264-347642) | Invite chips (olivia@untitled.com, Phoenix): the small grey initials O and P are now a larger dark navy "O" on both chips. Below the threshold, but a real change. | **Share modal chips**<br>Screen built in part (not drawn yet: seed, modal) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link,invite-2&at=joined&modal=share-artifact>invite>role&rail=c) | Theme G: do not adopt yet. |
| 10 | [1819:316531](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316531) | All five invite chips now show a dark navy "O" instead of their own grey initials (O, P, N, C, A). Below the threshold, but a real change. | **Share modal chips**<br>Screen built in part (not drawn yet: seed, modal, hover) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link,invite-5,notify&at=joined&modal=share-artifact>invite&hover=invite-btn&rail=c) | Theme G: do not adopt yet. |

### chat-questions: Chat questions

1 frame: 1 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [5873:530156](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5873-530156) | Icons only: the inline card and the "Untitled.xls" header use the blue layered icons. The question card ("Where should it land when it is done?", four options, Skip) is unchanged, checked at 1.5x. | **Inline artifact card, Artifact header**<br>Screen built in part (not drawn yet: at, hover) · [open](http://localhost:4190/#/chat/commit/pipeline-command?at=question&hover=question:3&rail=c) | Theme A. The question card still needs building. |

### deleted-artifact: Deleted artifact

1 frame: 1 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [6944:511592](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6944-511592) | Icons only: the inline card and the "Untitled.xls" header use the blue layered icons. The "Oops! Artifact is deleted" empty state is unchanged. | **Inline artifact card, Artifact header**<br>Screen built in part (not drawn yet: seed) · [open](http://localhost:4190/#/chat/commit/pipeline-command?seed=artifact-deleted&at=artifact&rail=c) | Theme A. |

### artifact-view-editor-main: Artifact view from main artifact page (editor)

3 frames: 3 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [5310:276790](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5310-276790) | The header type icon went from the flat blue Documents glyph to the blue layered Document icon. The name pill narrows ~6px, so the name and "Edit with Chat" shift left, and the eye/code toggle moves ~3px left. The name menu, the Versions submenu and the body are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/reference-xls?role=editor&menu=name>versions) | Theme A. |
| 02 | [7418:305665](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7418-305665) | The same header icon swap at 787px wide. The truncated name and "Edit with Chat" shift ~6px left. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/reference-xls?role=editor&vw=787) | Theme A. |
| 03 | [7418:305917](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7418-305917) | The same header icon swap. The full-name tooltip and the body are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/reference-xls?role=editor&hover=artifact-name&vw=787) | Theme A. |

### graphs: Graphs in Chat

6 frames: 1 changed, 5 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 02 | [1707:126556](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-126556) | Landing page with the expanded sidebar: the dots changed as in chat-artifact 08. Composer and prompt are unchanged. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/new?compose=bu-q&hover=send&rail=e) | Theme B. |

### artifact-view-viewer: Artifact view only for viewer and commenters

9 frames: 9 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [3838:248160](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3838-248160) | Header icon: the purple Application glyph became the blue layered Application icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/acme-app?role=viewer) | Theme A. |
| 01a | [13155:271422](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13155-271422) | Header strip: the purple Application glyph became the blue layered Application icon, and "Untitled Applciations" shifts ~2px left. The Home button is unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/acme-app?role=viewer&hover=home) | Theme A. |
| 02 | [7767:266191](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7767-266191) | Header icon swapped to the green Sheets layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/untitled-xls?role=viewer) | Theme A. |
| 03 | [7781:267087](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-267087) | Header icon swapped to the blue Document layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/untitled-doc?role=commenter) | Theme A. |
| 04 | [7781:267978](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-267978) | Header icon swapped to the red PDF layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/untitled-pdf?role=viewer) | Theme A. |
| 05 | [7781:268873](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-268873) | Header icon swapped to the grey Markdown "#" layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/untitled-md?role=viewer) | Theme A. |
| 06 | [7781:269768](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-269768) | Header icon swapped to the Presentation layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/untitled-ppt?role=viewer) | Theme A. |
| 07 | [8771:210166](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8771-210166) | Header icon swapped to the Presentation layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/untitled-flow?role=viewer) | Theme A. |
| 08 | [10157:575625](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10157-575625) | Header icon swapped to the JSON layered icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/document-json?role=viewer) | Theme A. |

### cost: Cost of Chat

9 frames: 1 changed, 8 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 08 | [6802:236145](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236145) | "Ask for more Usage" modal: the title and "You have used $250 of $250 this month." moved up ~12px, so the title touches the top edge; the close X moved up only ~1px. Fields, footer copy and buttons are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/cost?seed=monthly-out&at=cot-3&compose=skill&modal=usage&rail=c) | Theme J: ask the designer; looks accidental. |

### artifact-full-editor: Full view of artifacts (editor)

8 frames: 8 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [7809:278865](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865) | Header icon: the purple Application glyph became the blue layered Application icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/acme-app?from=artifacts&rail=c) | Theme A. |
| 01a | [13155:271308](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13155-271308) | Header strip: the purple Application glyph became the blue layered Application icon. The name, chevron and "Edit with Chat" shift ~2px left; the right-side tools are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/acme-app?from=artifacts&hover=back&rail=c) | Theme A. |
| 02 | [7809:273518](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273518) | Header icon swapped to the green layered Sheets icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/untitled-xls?rail=c) | Theme A. |
| 02a | [12195:302725](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12195-302725) | The flat green Sheets icon became the green layered Sheets icon and moved ~10px left, closer to the back chevron; "Untitled.xls" and its chevron shift ~10px left. The right-side tools are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/untitled-xls?from=artifacts&rail=c) | Theme A. |
| 03 | [7809:273526](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273526) | Header icon swapped to the blue layered Document icon. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/untitled-doc?rail=c) | Theme A. |
| 04 | [7809:273538](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273538) | Scored below the threshold, but a big change: the whole right-hand header group is gone (copy, refresh, v3, Publish, comments, download, collapse, close), and so is the chevron after "Untitled.pdf". The type icon is the new layered one. *Review: confirmed; added the missing title chevron.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/untitled-pdf?rail=c) | Theme I: ask before building. |
| 05 | [7809:273550](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273550) | Scored below the threshold, but a big change: the whole right-hand header group is gone (copy, refresh, v3, Publish, comments, download, collapse, close), and so is the chevron after "Untitled.md". The type icon is the new layered one. *Review: confirmed; added the missing title chevron.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/untitled-md?rail=c) | Theme I: ask before building. |
| 06 | [7809:273559](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-273559) | Scored below the threshold, but a big change: the whole right-hand header group is gone (copy, refresh, v3, Publish, comments, download, collapse, close), and so is the chevron after "Untitled.ppt". The type icon is the new layered one. *Review: confirmed; added the missing title chevron.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/untitled-ppt?rail=c) | Theme I: ask before building. |

### new-memory: New Memory via Chat

3 frames: 1 changed, 2 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 03 | [10112:408460](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-408460) | Settings › Memory modal: a new "Settings ›" item with a gear icon and chevron at the bottom of the left nav. The right column moved down ~8px, so "Proofpoint evaluation" is almost hidden behind the "Tell Unify's AI…" composer. The close X dropped ~4px. | **None**<br>Screen built in part (not drawn yet: modal) · [open](http://localhost:4190/#/new?seed=no-chips&modal=settings>memory&rail=c) | Theme K. |

### artifacts-landing: Artifacts landing (empty state → list → 1728px → modal)

9 frames: 6 changed, 3 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 02 | [7907:305055](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7907-305055) | Grid cards: every type icon in the card meta uses the new layered set. The meta block is tighter, so cards are ~4px shorter and each later row shifts up a little more. Copy, thumbnails and toolbar are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts?rail=c) | Themes A and E. |
| 03 | [12868:502599](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12868-502599) | List view: the Type column uses the new layered icons, but Application and Presentation both show the blue Document icon (they were the purple app and orange presentation icons), which looks like a placeholder. Names and status are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts?view=list&rail=c) | Theme A; ask for the right icons. |
| 04 | [8412:194488](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8412-194488) | The same change as 02 across all 17 cards at 1728px: new icons and shorter card meta, so rows shift up. Search, filters and the bottom row are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts?seed=all-types&search=open&rail=c&vw=1728) | Themes A and E. |
| 05 | [11648:688356](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-688356) | The same icon swap and row shift as 02. The open All Types menu, the Pin/Unpin card menus and the "Co-create with an Agent" tooltip are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts?menu=type-filter+card:q3-forecast+card:pinned-variant&hover=new-artifact&rail=c) | Themes A and E. |
| 08 | [3780:178324](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-178324) | The artifact header icon is the blue layered Document icon and the name shifts left. In the Download menu, PDF and CSV use new layered icons (Excel unchanged). The chat card's flat blue document became the blue layered Application icon. The chat copy is unchanged. | **Inline artifact card, Artifact header**<br>Screen built in part (not drawn yet: menu, hover) · [open](http://localhost:4190/#/chat/commit/blank-xls?at=artifact&menu=apps&hover=apps:excel&rail=c) | Theme A. |
| c01 | [13750:280568](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-280568) | All 11 type tiles use the layered icons, but several no longer match their colour bar: Presentation and the first Connector use the blue Document art, Application and Playbook the orange Presentation art, and the second Connector is a yellow Mail icon. Markdown is a grey "#" and CSV is teal. Labels and bars are unchanged. *Review: confirmed; added that icons and bars no longer match.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/gallery/artifact-card-tints) | Theme A; ask for the mapping. |

### cloned-artifact: Cloned artifact

3 frames: 3 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [13750:280936](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-280936) | The same grid change as artifacts-landing 02: new icons and shorter card meta, so rows 2-4 shift up (including the "(Cloned)" card). The open card menu with Clone checked is unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts?seed=cloned&menu=card:q3-forecast&rail=c) | Themes A and E. |
| 02 | [13750:301988](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-301988) | The header icon is the blue layered Document icon and the name pill narrows ~2px. The Rename/Clone/Delete menu and the body are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/q3-forecast-clone?from=artifacts&menu=name) | Theme A. |
| 03 | [13750:302325](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-302325) | Header icon swapped to the blue layered Document icon; the rename field and "Start Chat" shift ~2px. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/q3-forecast-clone?from=artifacts&edit=name) | Theme A. |

### publish-artifact: Publish artifacts flow (modals: first time, second time, restricted card, who has access, changelog)

14 frames: 7 changed, 7 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| c01 | [1969:507322](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507322) | A grey "$10/month" suffix follows "pipeline-command" (the URL) and "Everyone at UnifyApps". The URL row icon is a muted plum instead of bright purple, and both rows' text sits ~4-6px higher (no longer centred). *Review: confirmed; added that the rows are no longer centred.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?at=ready&modal=publish&rail=c) | Theme H: ask. |
| c02 | [1969:507360](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507360) | "$10/month" after "Everyone at UnifyApps" and "Restricted"; option text ~4px higher. Radio and Done are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?at=ready&modal=publish>visibility&rail=c) | Theme H. |
| c03 | [11933:737342](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-737342) | "$10/month" after "Everyone at UnifyApps" and "Restricted"; option text ~4px higher. Avatar stack and Done are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?seed=published,publish-restricted&at=ready&modal=publish>visibility&rail=c) | Theme H. |
| c04 | [11905:590138](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-590138) | Hover state: "$10/month" after both options and the text ~4px higher. Cursor and Done are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?at=ready&modal=publish>visibility&hover=restricted&rail=c) | Theme H. |
| c09 | [11933:736147](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-736147) | "$10/month" after "pipeline-command" and "Restricted"; muted plum URL icon; rows ~4px higher. Avatar stack and Publish hover are unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?seed=publish-restricted&at=ready&modal=publish&hover=publish-btn&rail=c) | Theme H. |
| c10 | [11933:736622](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-736622) | The Management chip avatar now shows "O" instead of an empty circle, and the trash icons moved ~3px right. Below the threshold, but a real change. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?seed=publish-picked&at=ready&modal=publish>restricted&hover=remove&rail=c) | Theme G. |
| c11 | [11933:737092](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-737092) | As c09: "$10/month" on the URL and on "Restricted", muted plum URL icon, rows ~4px higher. The Unpublish / Cancel / Publish footer is unchanged. | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/chat/new-routine/pipeline-command?seed=published,publish-restricted&at=ready&modal=publish&hover=publish-btn&rail=c) | Theme H. |

### add-users: Adding users to chat

11 frames: 11 changed, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [7830:279834](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7830-279834) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=answer&rail=e) | Theme B. |
| 02 | [9256:468119](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-468119) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=answer&modal=share&rail=e) | Theme B. |
| 03 | [12025:773344](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-773344) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed) · [open](http://localhost:4190/#/chat/commit?seed=shared-2&at=answer&modal=share&rail=e) | Theme B. |
| 04 | [12025:774906](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-774906) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit?seed=shared-2&at=answer&modal=share&hover=role:candice&rail=e) | Theme B. |
| 05 | [12025:776507](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-776507) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed) · [open](http://localhost:4190/#/chat/commit?seed=shared-2&at=answer&modal=share>access&rail=e) | Theme B. |
| 06 | [12025:779849](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-779849) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-workspace&at=answer&modal=share&hover=access-role&rail=e) | Theme B. |
| 07 | [12025:778160](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-778160) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, modal) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-workspace&at=answer&modal=share>access-role&rail=e) | Theme B. |
| 08 | [12025:781497](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-781497) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link&at=answer&modal=share&hover=invite&rail=e) | Theme B. |
| 09 | [12025:783146](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-783146) | Sidebar status dots only (theme B). Nothing else changed. *Review: added: the capture scored it "same"; each dot is a few pixels.* | **Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link&at=answer&modal=share>search&hover=person:demi&rail=e) | Theme B. |
| 10 | [12025:784845](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-784845) | Invite chips (olivia@untitled.com, Phoenix): the small grey initials O and P are now a larger dark navy "O" on both chips. Below the threshold, but a real change. The sidebar dots behind the modal changed as in chat-artifact 08. *Review: confirmed; added the sidebar dots.* | **Share modal chips, Sidebar nav**<br>Screen built in part (not drawn yet: seed, modal) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link,invite-2&at=answer&modal=share>invite>role&rail=e) | Themes G and B. |
| 11 | [12025:786818](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-786818) | All five invite chips now show a dark navy "O" instead of their own grey initials (O, P, N, C, A). Below the threshold, but a real change. The sidebar dots behind the modal changed as in chat-artifact 08. *Review: confirmed; added the sidebar dots.* | **Share modal chips, Sidebar nav**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit?seed=shared-2,access-link,invite-5,notify&at=answer&modal=share>invite&hover=invite-btn&rail=e) | Themes G and B. |

### collab-chat: Collaborative chat flow

10 frames: 3 changed, 7 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 08 | [8222:488552](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-488552) | The "Pipeline Command" card: purple Application glyph replaced by the blue layered Application icon; title and subtitle ~10px right. Below the threshold, but a real change. | **Inline artifact card**<br>Screen built · [open](http://localhost:4190/#/chat/commit?at=artifact&rail=c) | Theme A. |
| 09 | [8222:490604](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-490604) | The "Pipeline Command" card: flat purple HTML glyph replaced by the blue layered Application icon; title and subtitle ~10px right. The People-with-access popover and the rest are anti-aliasing only. | **Inline artifact card**<br>Screen built in part (not drawn yet: seed, pop) · [open](http://localhost:4190/#/chat/commit?seed=crowd&at=artifact&pop=typing-people&rail=c) | Theme A. |
| 10 | [8222:494135](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-494135) | The "Pipeline Command" card: flat purple HTML glyph replaced by the blue layered Application icon; title and subtitle ~10px right. The typing indicator and messages are anti-aliasing only. | **Inline artifact card**<br>Screen built in part (not drawn yet: seed) · [open](http://localhost:4190/#/chat/commit?seed=typing-2,comments-2&at=artifact&hover=comments&rail=c) | Theme A. |

### commenters: Comments for commenters only

20 frames: 9 changed, 11 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 | [8279:195355](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-195355) | The "Pipeline Command" card: purple Application glyph replaced by the blue layered Application icon; title and subtitle ~10px right. Below the threshold, but a real change. | **Inline artifact card**<br>Screen built in part (not drawn yet: seed, panel, cbox) · [open](http://localhost:4190/#/chat/commit?seed=crowd,comments-3&at=artifact&panel=comments&cbox=long&rail=c) | Theme A. |
| 02 | [8279:198079](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-198079) | The "Pipeline Command" card: purple Application glyph replaced by the blue layered Application icon; title and subtitle ~10px right. Below the threshold, but a real change. | **Inline artifact card**<br>Screen built in part (not drawn yet: seed, panel, cbox) · [open](http://localhost:4190/#/chat/commit?seed=crowd,comments-3&at=artifact&panel=comments&cbox=one-line&rail=c) | Theme A. |
| 03 | [8279:200361](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-200361) | The "Pipeline Command" card: purple Application glyph replaced by the blue layered Application icon; title and subtitle ~10px right. Below the threshold, but a real change. | **Inline artifact card**<br>Screen built in part (not drawn yet: seed, panel, cbox) · [open](http://localhost:4190/#/chat/commit?seed=crowd,comments-3&at=artifact&panel=comments&cbox=long&rail=c) | Theme A. |
| 04 | [8279:209548](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-209548) | The "Pipeline Command" card: purple Application glyph replaced by the blue layered Application icon; title and subtitle ~10px right. Below the threshold, but a real change. | **Inline artifact card**<br>Screen built in part (not drawn yet: seed, panel, open, cbox, menu) · [open](http://localhost:4190/#/chat/commit?seed=crowd,comments-5&at=artifact&panel=comments&open=thread:1&cbox=plain&menu=members&rail=c) | Theme A. |
| 05 | [8279:215077](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-215077) | New icons on the "Pipeline Command" card (narrow chat) and in the "Untitled.xls" header (blue document became the blue layered Document icon; title ~4px left). Below the threshold, but a real change. | **Inline artifact card, Artifact header**<br>Screen built in part (not drawn yet: seed) · [open](http://localhost:4190/#/chat/commit/pipeline-command?seed=comments-unread&at=followup&hover=comments&rail=c) | Theme A. |
| 06 | [8279:217929](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-217929) | New icons on the "Pipeline Command" card (narrow chat) and in the "Untitled.xls" header (blue document became the blue layered Document icon; title ~4px left). Below the threshold, but a real change. | **Inline artifact card, Artifact header**<br>Screen built in part (not drawn yet: seed, panel, cbox) · [open](http://localhost:4190/#/chat/commit/pipeline-command?seed=comments-3&at=followup&panel=comments&cbox=long&rail=c) | Theme A. |
| 07 | [8279:220537](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-220537) | The header icon before "Untitled Applciations" is now a smaller, paler version of the old purple Application glyph (not the new layered icon the viewer frames use); the title moved ~6px left. Below the threshold, but a real change. *Review: confirmed; added that it is not the new icon set.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/artifacts/acme-app?seed=comments-none&role=commenter&panel=comments&rail=c) | Theme A; ask which icon the commenter view uses. |
| 09 | [8085:469355](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469355) | The header icon before "Untitled Applciations" is now a smaller, paler version of the old purple Application glyph (not the new layered icon the viewer frames use); the title moved ~6px left. Below the threshold, but a real change. *Review: confirmed; added that it is not the new icon set.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/acme-app?role=commenter) | Theme A; ask which icon the commenter view uses. |
| 10 | [8085:469620](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469620) | The header icon before "Untitled Applciations" is now a smaller, paler version of the old purple Application glyph (not the new layered icon the viewer frames use); the title moved ~6px left. Below the threshold, but a real change. *Review: confirmed; added that it is not the new icon set.* | **Nothing built yet**<br>Screen not built · [open](http://localhost:4190/#/view/acme-app?seed=comments-3&role=commenter&panel=comments) | Theme A; ask which icon the commenter view uses. |

### queue-1: Chat in queue (option 1)

17 frames: 1 changed, 16 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 16 | [8451:366278](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8451-366278) | Only the icons changed. The "Pipeline Command" card has the blue layered Application icon (text ~10px right), and the "Untitled.xls" header has the blue layered Document icon (title ~4px left). The queue card, composer and dashboard are unchanged (checked at 1.4x). | **Inline artifact card, Artifact header**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit/pipeline-command?seed=queue-4,typing-2,comments-unread&at=followup&hover=queue:2&rail=c) | Theme A. |

### consecutive: Consecutive messages spacing

1 frame: 0 changed, 1 render noise only, 0 unchanged.

| Step | Figma | What changed | Built parts affected | Suggested action |
|---|---|---|---|---|
| 01 (render noise) | [11633:344632](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11633-344632) | No visible design change. The two right-aligned user bubbles sit ~1px further right, so their text anti-aliases differently. | **None**<br>Screen built in part (not drawn yet: seed, hover) · [open](http://localhost:4190/#/chat/commit?seed=own-consecutive&at=matt-replied&hover=msg:own&rail=c) | None. |

Journeys with no change: nav-light (4), logo-options (1), thinking (2), enhance-prompt (5), canvas-comments (5), header-dropdowns (7).

## Frames in Figma that are not in the map

| Frame | Figma | Where | What it shows | Captured | On the 8 Oct map | Suggested action |
|---|---|---|---|---|---|---|
| 1750 | [15599:400670](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15599-400670) | Chat section 1707:133527, beside chat-artifact 16a ("1749") and frames 1747 / 1743 | Not seen yet. It has the newest node id on the page and sits next to the 16a card spec, so it may be the next inline-card or Outputs spec. | not captured | Not in the 8 Oct map | Capture it first (the Figma desktop file was not the active tab during this check) and review it with the designer. |
| Copilot Landing page | [11336:561451](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11336-561451) | input box second row (y 4331) | Landing "+" menu with a new Connectors item (warning badge 1) and a Connectors submenu: search, Google Calendar, Monday.com, Google Drive, Outlook (warning), Jira and Github toggles, "Add More +5". The composer chips read "6 Sources" and "Research". | captured | Excluded on 8 Oct (second input-box row) | Decide whether Connectors is in scope; it is the only real feature idea in the excluded row. |
| Copilot Landing page | [5220:225210](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-225210) | input box second row | Landing "+" menu with a short Skills submenu: "Meeting summary & Action items" and "Manage Skills". | captured | Excluded on 8 Oct (second input-box row) | None. |
| Copilot Landing page | [5220:226693](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-226693) | input box second row | "+" menu with the Skills submenu empty: "No skill added yet" and a dark "+ New Skill" button. | captured | Excluded on 8 Oct (second input-box row) | None, unless you want the empty Skills state. |
| Copilot Landing page | [5220:229430](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-229430) | input box second row | Landing composer with four attachments (two image thumbnails, a file card, a red PDF card cut off at the right edge) above the empty placeholder; send disabled. | captured | Excluded on 8 Oct (second input-box row) | None. |
| Copilot Landing page | [5220:232033](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-232033) | input box second row | The same four attachments plus two lines of "/Tech design requirements …" text; send enabled. | captured | Excluded on 8 Oct (second input-box row) | None. |
| Copilot Landing page | [5220:236168](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-236168) | input box second row | Four attachments and ~12 lines of text; the composer covers the Connect-apps banner. | captured | Excluded on 8 Oct (second input-box row) | None. |
| Chat full page | [5220:237840](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-237840) | input box second row | Commit chat with a Bottom-large composer holding four attachments and an empty "Ask anything…" field. | captured | Excluded on 8 Oct (second input-box row) | None. |
| Chat full page | [5220:239414](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-239414) | input box second row | Same, with one line "/Tech design requirements AI-generated insights based on the inputs provided." | captured | Excluded on 8 Oct (second input-box row) | None. |
| Chat full page | [5220:240923](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-240923) | input box second row | Same, with max-line text; the composer grows over the answer. | captured | Excluded on 8 Oct (second input-box row) | None. |
| 1 | [8289:214408](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8289-214408) | Collaborative Chat flow 7830:372599, queue option 2 | Queue option 2: "Replying to Matt · Reading Pipeline Command…"; Grace Coleman's message greyed with "Queued · the Assistant answers after Grace's reply"; bar "Assistant is replying to Mall Rivera · 1 Queued". | captured | Excluded on 8 Oct (option 1 only) | None. |
| 2 | [8289:223937](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8289-223937) | Collaborative Chat flow, queue option 2 | Queue option 2 with the reasoning expanded (four source rows) above Grace's queued message. | captured | Excluded on 8 Oct (option 1 only) | None. |
| 187 | [8451:363855](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8451-363855) | Collaborative Chat flow, queue option 2 with the artifact open | Narrow chat beside the "Untitled.xls" panel. John Whitaker's second message is greyed with the "Queued …" label, which overlaps the message text. Bar: "Assistant is replying to Mall Riv… · 1 Queued". Already uses the new layered icons. | captured | Excluded on 8 Oct (option 1 only) | None. |
| 188 | [8451:363945](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8451-363945) | Collaborative Chat flow, queue option 2 with the artifact open | The same state with the Comments panel open (3 Members, two comments, "@annie please make \|"); the queued message is not visible in the chat column, only "1 Queued" in the bar. | captured | Excluded on 8 Oct (option 1 only) | None. |
| 12 | [1768:346105](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1768-346105) | chat-artifact row, between frames 11 and 51 | A variant of chat-artifact 14: Matt Rivera's messages, the @Assistant request and "Thinking…", with a plain "Ask anything…" composer (no collaborative bar). | captured | Not in the 8 Oct map (loose frame) | None. |
| 2 | [3518:224083](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3518-224083) | logo-animation row beside 3612:167773 | Read from node data: "Hello Roger" landing with the landing composer and the Connect-apps banner, the second logo option. | not captured | Excluded on 8 Oct (option 1 only) | None. |

Captures: `/Users/lisarath/Unify2026/app/figma-ref/_drift-2026-10-09/new/`.

## Notes on this check

- Every frame was exported with figma_capture_screenshot (plugin exportAsync, scale 1): figma_take_screenshot fell back to the REST API and failed with "Token expired". The Desktop Bridge export queue stalled several times; every mapped frame was captured on a retry.
- The capture tool calls a frame "changed" when more than 0.15% of its pixels differ. Icon swaps and status dots are smaller than that, so I checked every changed, resized and new frame by eye, plus the higher-scoring "same" frames and the sidebar dot column of every capture. Corrections are marked in the tables.
- artifacts-landing 04 and cloned-artifact 01 are compared at the 1568px export cap, as their references were.
- The Projects references in prototypes/project-dashboard/_ref have grey corners from how they were captured (about 64px).
- Other capture agents switched the Figma page during the run. Exports go by node id, so captures were not affected.
- Build states ("Built", "Built in part", "Not built") come from the prototype's own coverage audit (src/review/audit.ts), read live from the dev server at localhost:4190 on 9 Oct.

Files: `drift.json` (machine-readable, every frame with its review, build state and code references), `g1.json`-`g4.json` (raw capture results), `<journey>/*.compare.png` (reference, new, diff side by side).
