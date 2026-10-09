# Comments for commenters only (`commenters`)

- Title card: `8279:198075` ("comment for commenter's only flow"): https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-198075 (image `00-card-8279-198075.png`)
- Figma page / section: **Chat + Artifacts** (page `1707:115989`), section **Collaborative Chat flow** (`7830:372599`), row at y ≈ 2830
- Baseline: 1440 x 900 frames, 1440 wide is the only baseline.
- Section card `8085:469369` ("artifact view only") splits the row in two parts: steps 01–07 happen inside the app; steps 09–10 are the standalone artifact page.

> **Heads-up: every node in this row is at 30% layer opacity** in Figma. That covers the frames, the title card, the loose comment panels and the floating overlays. The designer has dimmed the whole row, which usually means parked or superseded work (see the open questions).
> The `NN-*.png` files are what Figma exports, so they look washed out.
> `opaque/NN-*.png` holds the same pixels with the frame alpha divided by 0.3 and composited on white. That gives the true colours (dark green rail and so on). **Build against `opaque/`.**
> `opaque/04-8279-209548.with-dropdown.png` = step 04 with the floating members dropdown (`c01`) composited in at its real position.

## Steps

### 01 · `8279:195355` (frame "176")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-195355
- Image: `01-8279-195355.png` (true colour: `opaque/01-8279-195355.png`)
- Annotation above frame: **"comment box"**
- Shows: a collaborative chat titled "How does commit actually look?" and a **Comments side panel** (400 px, right). The panel header reads "Comments · 3 Members ⌄" with a close X. Three level-1 threads sit at the bottom: Anuj Mittal (You) 1d ago with "● 1 reply" and a green unread dot, Anirudha Roy 3d ago, and Saumya Pandey 4d ago. The comment composer is expanded with the WYSIWYG toolbar (B I S U, quote, link, image, bullets, numbered). It holds "@annie please make this a little more vibrant. A little more brand colour will add the zing its lacking now." and has a filled send button.
- Changed from previous: entry step.
- Likely action: click the speech-bubble (comments) icon at the far right of the chat header.
- Nav: dark rail, collapsed (`Main_nav / types=collapsed`), "+ New chat" item selected.
- Open: Comments side panel. Closed: artifact panel, modal.
- Chat area: chat composer (`Copilot desktop Input Box / Type=Bottom small…`) with the collaborative bar "J M R John and Matt Rivera are typing…" and "Assistant replies" toggle on. Placeholder "Queue follow-up…". The chat header shows an avatar stack M J G, $1.23, Share, a clipboard icon and a comment icon.
- Components: `Main_nav / types=collapsed`, `ES Breadcrumb / Variant=Default` (`Avatar group / Size=xs`, `Buttons/Button Neutral`), `Copilot_User Message / State=Default` (+ `Type=With Tag`, `Type=Default`), `Copilot_User Message_Desktop full / State=Default, Type=Default`, `Response_Desktop full / Property 1=Assistant`, `COT - Steps / Step=Finish, State=Collapsed, Running=No`, `Thoughts / State=Hover`, `Copilot_Inline Citation Pill`, `Suggested prompts / Type=Lines`, `Feedback Array / Type=Full screen`, `Inline Artifact Cards / State=Application-HTML` ("Pipeline Command · Interactive HTML · Download"), `Banner carousel / Property 1=Three apps`, `Collaborative chat-large / State=User Typing, Users=Max Users`, `Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No`, **`comment panel`** → `_Comment_Message Unit / Type=level 1, State=Default` ×3, `Comment field / State=2 or more Typing, WYSIWYG=Yes`

### 02 · `8279:198079` (frame "177")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-198079
- Image: `02-8279-198079.png`
- Annotation: **"comment box bottom input 1 state"**
- Shows: the same chat (scrolled so the full assistant answer and the "Pipeline Command" card show) with the Comments panel open. The comment field is collapsed to a **single line**: "+ @annie please make |" and a send button, with no formatting toolbar. The threads sit lower in the panel.
- Changed from previous: comment field goes from the expanded WYSIWYG box to a one-line typing state (`Comment field / State=1 line typing, WYSIWYG=No`).
- Likely action: click into the comment box and start typing a short comment.
- Nav: dark, collapsed. Open: Comments panel.
- Components: same as 01, except the comment field is `Comment field / State=1 line typing, WYSIWYG=No`.

### 03 · `8279:200361` (frame "178")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-200361
- Image: `03-8279-200361.png`
- Annotation: **"comment box bottom input 2 state"**
- Shows: same chat scroll as 02. The comment field has grown to 2+ lines and the WYSIWYG toolbar appears above the text. The panel content matches step 01.
- Changed from previous: the input grows from 1 line to 2+ lines and the formatting toolbar appears (`Comment field / State=2 or more Typing, WYSIWYG=Yes`). The threads move back up.
- Likely action: keep typing past one line; the box auto-grows and shows the toolbar.
- Nav: dark, collapsed. Open: Comments panel.
- Components: same as 01.

### 04 · `8279:209548` (frame "179")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-209548
- Image: `04-8279-209548.png`. With overlay: `opaque/04-8279-209548.with-dropdown.png`
- Annotation: **"comment box members dropdown"**
- Shows:
  - The members chip now reads **"5 Members ⌄"** in a hover/pressed state, and the top-right X is replaced by a ring/circle icon.
  - Thread 1 is expanded ("1 reply ⌃") and shows a level-2 reply (Anuj Mittal (You)), then a level-3 row "You 1d ago" with an inline **"Reply to this thread"** input.
  - The bottom comment field has its toolbar switched off, and the cursor is on the **Aa** button.
  - A **members dropdown** floats on the canvas over the frame. It is a section-level sibling, not inside the frame, so the plain export does not show it (see `c01`). Header "COMMENTERS"; rows: Chaaya Warrior(You) · Owner, Anirudha Roy, Saumya Pandey, Gaurav Singh, Nitasha Gandhi. It sits at frame-relative (1151, 30), right under the chip, with a Cursor at (1202, 27).
- Changed from previous: members dropdown open, thread 1 replies expanded, WYSIWYG toolbar toggled off via Aa.
- Likely action: click the "N Members" chip in the Comments panel header. The thread expansion comes from clicking "1 reply" and the toolbar change from clicking "Aa", so this frame bundles three interactions.
- Nav: dark, collapsed. Open: Comments panel + members dropdown (popover).
- Components: same chat stack as 01. `comment panel` → `Buttons/Button Neutral / Size=xs, Hierarchy=Tertiary, Icon=Default, State=Hover` (members chip), `_Comment_Message Unit / Type=level 1`, `Type=Spacer top`, `Type=level 2`, `Type=Spacer between`, `Type=level 3+reply`, `_comment field / Property 1=switch off WYSIWYG`. Overlay: `Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default` (Footer off, Selection Pills off, Scroll Bar off), `Cursor / State=Arrow`.

### 05 · `8279:215077` (frame "180")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-215077
- Image: `05-8279-215077.png`
- Annotation: **"when artifact is open"**
- Shows: split view.
  - Left: a narrow chat column (≈444 px) whose header reads "How does commit actuall…", with $1.23, Share (lock icon), clipboard, and the comment icon in **hover** with the cursor on it. The thread shows the "Pipeline Command · Interactive HTML · 123 KB · Version 1" card, John Whitaker's message, and "Thinking…". The composer has the "Type @ to mention a participant" bar with a toggle and the placeholder "Ask Queue follow-up….".
  - A vertical drag handle sits at x ≈ 500.
  - Right: the **artifact panel** "Untitled.xls". Header: copy, refresh, v3 ⌄, Publish, comment + ⌄, download, expand, close. Body: the Acme Inc. customer-health dashboard (ARR/NRR/NPS/Adoption/Renewal KPIs, Customer Journey stepper, Health/Journey/Strategy/Intelligence/Actions tabs, Adoption chart, Feature sequencing).
  - A 12 px grey dot (`Pill solid / Size=xxs, Type=Pill color, Icon=False, Color=Gray`) floats on the canvas over the comment icon at frame-relative (471, 7). It is probably an "unread comments" badge and is not in the export.
- Changed from previous: new context. The comments panel is closed, the artifact is open beside the chat, and the rail now highlights the 6th item (artifacts/apps).
- Likely action: open the artifact (click the inline "Pipeline Command" card), then hover the comment icon in the chat header.
- Nav: dark, collapsed, 6th item (apps/artifacts) selected. Open: artifact panel. Closed: comments panel.
- Components: `Main_nav / types=collapsed`, `ES Breadcrumb / Variant=with Icon` (one `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Only, State=Hover`), `COT / Type=Main, State=Default, Running=No`, `Thoughts / State=Closed`, `Agent COT / Type=Step 1` (`Agent_Avatar / Size=xs, Type=Advance`, `_thinking state`), `Suggested prompts / Type=Lines`, `Inline Artifact Cards / State=Application-HTML`, `Attachments / Type=Image Thumbnail…`, `Attachments / Type=File, Size=md, Placement=With Reply Box`, `Tag / … Type=Outline`, `Collaborative chat-large / State=Default, User=No`, `Copilot desktop Input Box / Type=Bottom small…`, **`Arifact Header`** (sic) → `Artifact-Icons / Type=Documents`, `coloured logos / Type=excel`, `Buttons/Button Neutral`, `Textarea input field`. Also `Scroll bar / Orientation=Vertical…` and `Cursor / State=Arrow`.

### 06 · `8279:217929` (frame "182")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-217929
- Image: `06-8279-217929.png`
- Annotation: **"comment option 1"**
- Shows: three columns. Chat (unchanged; cursor still on the chat header comment icon), artifact panel (squeezed, so its content renders smaller), and a **320 px Comments panel** on the right. The panel header reads "Comments | 3 Members ⌄" with an X. It lists Anirudha Roy 3d ago and Saumya Pandey 4d ago, each with a reply-arrow icon. The composer is expanded with the WYSIWYG toolbar and the "@annie please make this a little more vibrant…" text.
- Changed from previous: the Comments panel opens as a third column and the artifact panel narrows (page content 1384 → 1064 px).
- Likely action: click the comment icon in the chat header.
- Nav: dark, collapsed, apps item selected. Open: artifact panel + Comments panel.
- Components: same as 05, plus `comment panel` → `_Comment_Message Unit / Property 1=level 1 | level 2 | level 3+reply`, `_comment field / Property 1=box height increase2`, `Buttons/Button Neutral` (members chip, close).

### 07 · `8279:220537` (frame "184")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-220537
- Image: `07-8279-220537.png`
- Annotation: **"when commentor receives an artifact"**
- Shows: in-app view for a **commenter**. There is no chat column; the artifact fills the page content (1064 px). The header reads "Untitled Applciations" (sic) with an app icon on the left and a comment button + ⌄ on the right, where the cursor sits. The right side holds a 320 px Comments panel ("Comments | 3 Members ⌄", X) in the **empty state**: a chat-bubbles illustration, "No comments yet", "Yours and other commentators messages will appear here.", and an "Add comments" input.
- Changed from previous: the chat column is gone, the artifact title and type change (xls → Application), and the comments list is empty.
- Likely action: the commenter opens an artifact shared with them (from a share or notification link), which opens it with the Comments panel. Another possibility is clicking the comment button in the artifact header.
- Nav: dark, collapsed, apps item selected. Open: artifact (full width) + Comments panel (empty).
- Components: `Main_nav / types=collapsed`, `Arifact Header` → `Artifact-Icons / Type=App`, `Toggle group / Type=Default, Style=Icon only, Size=xs`, `coloured logos / Type=excel`, `Buttons/Button Neutral`, `Textarea input field`. The comment panel here is a detached FRAME (not an instance) containing `ES Empty State / Level=Level 2, Type=Create`, `_comment field / Property 1=empty state`, and hidden `_Comment_Message Unit / Property 1=level 1/2/3+reply`.

### 08 · `8085:469369` (frame "14"), section card
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469369
- Image: `08-8085-469369.png`
- Shows: a title card reading **"artifact view only"** (no UI). It marks the start of the standalone artifact sub-flow.
- Changed from previous: n/a (divider).
- Action: none. Treat it as a chapter break in the prototype, not a screen.

### 09 · `8085:469355` (frame "15")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469355
- Image: `09-8085-469355.png`
- Shows: a **standalone, view-only artifact page** with no nav rail and no chat. Full-bleed 1440 artifact. Header: "Untitled Applciations ⌄ · ✦ Edit with Chat" on the left; refresh, Publish, comment + ⌄, download on the right. The body is the Acme Inc. dashboard at full width.
- Changed from previous: leaves the app shell entirely; the artifact is the whole page.
- Likely action: the commenter opens the artifact's shared link directly (outside the chat).
- Nav: none. Open: none (artifact only).
- Components: `Arifact Header` → `Artifact-Icons / Type=App`, `Toggle group / Type=Default, Style=Icon only, Size=xs`, `coloured logos / Type=excel`, `Buttons/Button Neutral / Size=sm, Hierarchy=Secondary…` (Publish), `Textarea input field`. Also `Scroll bar / Orientation=Vertical…`.

### 10 · `8085:469620` (frame "16")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469620
- Image: `10-8085-469620.png`
- Shows: the standalone artifact (1040 px) with a 400 px **Comments panel** ("Trigger Panel", header "Comments | 3 Members ⌄", X). Threads:
  - Chaaya Warrior(You) 1d ago, with reply and delete icons
  - Lana Steiner 2h ago: "Hello, please resolve this pending status. Also check the template in other languages, especially Telugu as they also tend to spill." with "● 3 replies"
  - Anurag Mehta, Now

  The composer is empty ("Add comments").
- Changed from previous: the Comments panel opens on the right and the artifact narrows to 1040.
- Likely action: click the comment button in the artifact header.
- Nav: none. Open: Comments panel.
- Components: `Arifact Header` (as 09), **`Comment_Message Unit / Level=Level 1, State=Default, Size=md`** ×3 (`Small Icon Button`, `Attachments / …`, `Dot / Size=md, Outline=False, Colour=Brand`, `Buttons/Link / Size=sm, Hierarchy=Primary`), **`comment box / Property 1=comment empty`**, `Buttons/Button Neutral` (members chip, close).

## Loose items next to the journey (not in the confirmed map, captured for reference)

These sit on the canvas in the same row, between step 04 (x 6532) and step 05 (x 12050). They are all 400 x 991 `comment panel` instances at 30% opacity. Read left to right, they form a **reply sub-flow** inside the Comments panel.

| file | node | what it shows |
|---|---|---|
| `c01-8279-213062.png` | `8279:213062` | Members dropdown overlay for step 04 (`Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default`), "COMMENTERS" list |
| `c02-13618-434935.png` | `13618:434935` | Panel default; "● 1 reply" with green unread dot (detached FRAME copy of the panel) |
| `c03-10767-620481.png` | `10767:620481` | "1 reply" with no dot (read) |
| `c04-10793-372495.png` | `10793:372495` | "1 reply ›" hover (underlined plus chevron); a Cursor `10793:372660` floats over it |
| `c05-10767-620480.png` | `10767:620480` | Thread expanded: "1 reply ⌃", reply from Anuj Mittal, "You 1d ago" with empty "Reply to this thread" input |
| `c06-10767-620483.png` | `10767:620483` | Reply input typing, one line: "@annie please make |", send active |
| `c07-10767-620484.png` | `10767:620484` | Reply input grows to multi-line with WYSIWYG toolbar ("Please make this a little more vibrant…") |
| `c08-10767-620485.png` | `10767:620485` | After reply: header "4 Members", "2 replies ⌃" (Anirudha Roy, Ayush Chandra); hovered reply row with a reply-arrow icon |
| `c09-10767-620486.png` | `10767:620486` | Short replies collapsed into the thread: "remove this", "change image here" |

## Open questions
1. **Is this row live?** Every frame, card and overlay is at 30% opacity, which usually means "parked / superseded". Confirm the flow should be built.
2. Steps 01 and 03 have **identical Comments panels**; only the chat scroll differs. Which is the canonical entry screen? Is 176 meant as a hero/overview?
3. **Step 04 bundles three interactions**: members dropdown open, thread replies expanded, and WYSIWYG switched off via Aa. The dropdown lives *outside* the frame. Should the prototype treat these as three separate states?
4. The member count is inconsistent: 3 Members (01–03, 06, 07, 10), 5 Members (04), 4 Members (c08–c09). The dropdown is titled "COMMENTERS" and lists 5 people.
5. In step 04 the panel close X is replaced by a ring/circle icon. Is this a "resolve" control, a loading state, or a mistake?
6. Identity: the "(You)" user is **Anuj Mittal** in 01–04 and c02–c07 but **Chaaya Warrior(You) · Owner** in the dropdown and in step 10. Which persona is the commenter?
7. Steps 04 → 05: no frame shows how the user gets from comments-in-chat to the artifact being open. Is it the inline "Pipeline Command" card? The artifact header then says "Untitled.xls".
8. Step 05 has a floating grey dot over the chat-header comment icon (outside the frame). Confirm it is an unread-comments badge.
9. Step 06 is "comment option 1" and the frame numbers skip 181 and 183. Are there other comment-panel placement options? (Per the earlier decision, Option 1 only.)
10. Step 07 shows the nav rail but no chat column. Is that the commenter's restricted in-app view (no access to the chat itself)? Steps 09–10 have no rail at all (public/shared link page?).
11. There are **three generations of comment components**:
    - `comment panel` → `_Comment_Message Unit / Type=…` + `Comment field / State=…`
    - `_Comment_Message Unit / Property 1=…` + `_comment field / Property 1=…`
    - `Comment_Message Unit / Level=…, Size=md` + `comment box / Property 1=…` (step 10)

    Which set is the DS source of truth for dev?
12. Copy issues: "Untitled Applciations" (typo), "Arifact Header" (component name typo), "commentators" in the empty state copy.
