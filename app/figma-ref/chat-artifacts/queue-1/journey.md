# Chat in queue, option 1 (`queue-1`)

- Title card: `8142:470830` ("Chat in Queue"): https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8142-470830 (image `00-card-8142-470830.png`)
- Figma page / section: **Chat + Artifacts** (page `1707:115989`), section **Collaborative Chat flow** (`7830:372599`), row at y ≈ 4257–4282
- Designer annotation above step 01: **"Option 1"** (text `8289:225703`). An **"Option 2"** row exists below (`8289:225704`, y ≈ 5566). It is excluded per the "Option 1 only" decision.
- Baseline: 1440 x 900, full opacity (unlike the commenters row).
- Context for every step: a collaborative chat titled "How does commit actually look?" with participants M J G and a $1.23 cost meter. Matt Rivera has asked "@Assitant (sic) give me an interactive view of the quarter — the gap against quota, and the deals carrying it with what each one is waiting on." The assistant is **Thinking…** the whole time. The journey covers what other users can do with follow-ups while the assistant is busy: **queue** them.
- Nav (steps 01–15): dark rail, collapsed (`Main_nav / types=collapsed`), "+ New chat" selected. Single-column centred chat, no side panels and no modals. Step 16 switches to the artifact-open layout.
- Core component: **`Text Queue Card`**. It is a component set with variants `Collapsed=No|Yes` x `State=In queue|Paused`, and is 758 px wide in the full chat and 408 px in the narrow chat. Its sub-components are the item row `Text / State=Default|Hover`, the count badge `Pill solid / Size=xxs, Type=Pill color, Icon=False, Color=Gray`, and `Small Icon Button / Size=sm|md`.

## Steps

### 01 · `8222:498555` (frame "1")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-498555
- Image: `01-8222-498555.png`
- Shows: the assistant is generating ("Thinking…" under Matt's @Assistant request). The composer is empty ("Queue follow-up…"). The send button has become a **Stop** button (filled circle), which is hovered with the tooltip **"Stop generating"**.
- Changed from previous: entry step.
- Likely action: entry. After a participant sends an @Assistant prompt, the user hovers the Stop button.
- Composer: `Collaborative chat-large / State=Default, Users=No` bar ("Type @ to mention a participant", "Assistant replies" toggle on) above `Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No`.
- Components: `Main_nav / types=collapsed`, `ES Breadcrumb / Variant=Default`, `Copilot_User Message / State=Default`, `Copilot_User Message_Desktop full / State=Default, Type=With Tag | Type=Default`, `Agent COT / Type=Complete 2`, `Response_Desktop full / Property 1=Assistant`, `COT - Steps / Step=Finish, State=Collapsed, Running=No`, `Links / State=No Hover`, `Banner carousel / Property 1=Three apps`, `Collaborative chat-large / State=Default, Users=No`, `Copilot desktop Input Box / …Text=Placeholder…`, `Tooltip / Supporting text=False, Arrow=Bottom center`, `Cursor / State=Arrow`

### 02 · `8237:502068` (frame "2")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8237-502068
- Image: `02-8237-502068.png`
- Shows: the user types a follow-up while the assistant is still thinking: "AI-generated insights based on |". A new **Add to queue** button (list icon) appears left of Stop. It is hovered with the tooltip **"Add message to queue ↵"**.
- Changed from previous: composer has text (`Text=One line`), the queue button appears, and the chat scrolls slightly.
- Likely action: type into the composer while generation is running, then hover the queue button.
- Components: as 01, with `Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No`.

### 03 · `8237:503500` (frame "3")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8237-503500
- Image: `03-8237-503500.png`
- Shows: a **Queue card** sits above the composer. Header "Queue [1]" with pause (⏸) and collapse (⌃⌄) icons. One row with a drag handle: "Keep the design minimal". The composer is cleared and shows the text cursor (I-beam) in the input.
- Changed from previous: the message moves from the composer into the queue, which is new (`Text Queue Card / Collapsed=No, State=In queue`).
- Likely action: click **Add message to queue** (or press ↵).
- Components: as 01, plus `Text Queue Card / Collapsed=No, State=In queue` and `Cursor / State=Text`.

### 04 · `8255:522209` (frame "4")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-522209
- Image: `04-8255-522209.png`
- Shows: the composer is in its tall form with an **attachment uploading** (thumbnail with spinner and an × remove). The text reads "Use the attached image as a reference for data graphs.". The queue button is greyed out (disabled while uploading). The queue card (1 item) moves up and **overlaps the "Thinking…" row**.
- Changed from previous: the composer grows to `Type=Bottom large, …Text=One line, Attachment=Yes`, the attachment is loading, and the queue card is pushed up.
- Likely action: click **+**, attach an image, and type a second follow-up.
- Components: as 03, with `Copilot desktop Input Box / Type=Bottom large, State=Default, Tools & Sources=Yes, Text=One line, Attachment=Yes`.

### 05 · `8237:500570` (frame "5")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8237-500570
- Image: `05-8237-500570.png`
- Shows: the same as 04, but the upload is finished (image thumbnail visible) and the **Add to queue** button is enabled (dark).
- Changed from previous: the attachment state goes from loading to loaded, and the queue button goes from disabled to enabled.
- Likely action: wait for the upload to finish (system).
- Components: as 04.

### 06 · `8237:505695` (frame "6")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8237-505695
- Image: `06-8237-505695.png`
- Shows: the queue now reads **"Queue [2]"** with "Keep the design minimal" and "Use the attached image as a reference for data graphs." (attachment thumbnail at the right of the row). The composer is back to its small empty state. "Thinking…" is visible again above the card.
- Changed from previous: the second message is added to the queue and the composer resets.
- Likely action: click **Add message to queue**.
- Components: as 03 (composer `Text=Placeholder, Attachment=No`).

### 07 · `8255:508680` (frame "7")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-508680
- Image: `07-8255-508680.png`
- Shows: queue row 2 is **hovered**. The row is highlighted and shows the thumbnail, a **↑ send-now** button and a **⋯ more** button. The ↑ is hovered with the tooltip **"Send now"**.
- Changed from previous: the row's hover actions appear (`Text / State=Hover`).
- Likely action: hover queue item 2, then hover the ↑ button.
- Components: as 06, plus `Tooltip / Supporting text=False, Arrow=Bottom center` and `Cursor / State=Arrow`.

### 08 · `8255:510294` (frame "8")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-510294
- Image: `08-8255-510294.png`
- Shows: row 1 ("Keep the design minimal") is hovered and its **⋯ menu is open**, opening downward: **Edit**, **Copy**, a divider, **Remove**. The cursor is a pointer hand.
- Changed from previous: hover moves to row 1 and the overflow menu opens.
- Likely action: click **⋯** on queue item 1.
- Components: as 06, plus `Dropdown Menu / Type=Small` and `Cursor / State=Pointer Hand`.

### 09 · `8255:520722` (frame "9")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-520722
- Image: `09-8255-520722.png`
- Shows: the ⋯ menu for **row 2** (the one with the attachment) opens **upward** with only **Copy** and **Remove**. There is no Edit.
- Changed from previous: the menu moves to row 2, the menu direction flips, and Edit disappears.
- Likely action: click **⋯** on queue item 2.
- Components: as 08.

### 10 · `8255:512773` (frame "10")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-512773
- Image: `10-8255-512773.png`
- Shows: the menu is closed and the **pause** icon in the queue header is hovered, with the tooltip **"Pause processing queued messages"**.
- Changed from previous: the menu closes and the tooltip appears on pause.
- Likely action: hover the pause button in the Queue header.
- Components: as 07.

### 11 · `8255:514316` (frame "11")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-514316
- Image: `11-8255-514316.png`
- Shows: the queue is **paused** (`State=Paused`). The header icons become **×** (clear), **▶** (resume) and collapse. ▶ is hovered with the tooltip **"Resume processing queued messages"**.
- Changed from previous: the card goes from In queue to Paused. Header actions change from (pause, collapse) to (clear, resume, collapse).
- Likely action: click **pause**. The same spot becomes resume, still under the cursor.
- Components: as 07, with `Text Queue Card / Collapsed=No, State=Paused`.

### 12 · `8255:515827` (frame "12")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-515827
- Image: `12-8255-515827.png`
- Shows: paused queue with the **×** hovered and the tooltip **"Clear queue"**.
- Changed from previous: hover moves from ▶ to ×.
- Likely action: hover the clear button.
- Components: as 11.

### 13 · `8255:517909` (frame "13")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-517909
- Image: `13-8255-517909.png`
- Shows: paused queue with the **collapse** chevron hovered and the tooltip **"Collapse queue"**.
- Changed from previous: hover moves to the collapse icon.
- Likely action: hover the collapse button.
- Components: as 11.

### 14 · `8255:519307` (frame "14")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-519307
- Image: `14-8255-519307.png`
- Shows: the queue is **collapsed** to a single bar reading "Queue [1]" (sic, 2 items are queued) with × ▶ and an expand chevron. The chevron is hovered with the tooltip **"Expand queue"**.
- Changed from previous: the card collapses (`Collapsed=Yes, State=Paused`) and the rows are hidden.
- Likely action: click **collapse**.
- Components: as 11, with `Text Queue Card / Collapsed=Yes, State=Paused`.

### 15 · `8255:524125` (frame "16")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-524125
- Image: `15-8255-524125.png`
- Shows: the queue is expanded again with **4 items** (two "Keep the design minimal" and two "Use the attached image…" rows, each with a different thumbnail). It is still **paused** (× ▶ collapse). The taller card grows upward and **overlaps the last user bubble and the Thinking… row**.
- Changed from previous: expanded, two more messages queued, and the card height grows.
- Likely action: click **expand**, then queue two more follow-ups.
- Components: as 11 (`Text Queue Card / Collapsed=No, State=Paused`).

### 16 · `8451:366278` (frame "189")
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8451-366278
- Image: `16-8451-366278.png`
- Shows: the queue in the **artifact-open layout**.
  - Left: a narrow chat column (≈444 px). Header "How does commit actuall…", $1.23, Share (lock), clipboard, comment icon. The thread shows the answer and the "Pipeline Command · Interactive HTML · 123 KB · Version 1" card, then John Whitaker's message and "Thinking…".
  - Queue card (408 px): "Queue [4]" in the **In queue** state (pause and collapse). Rows wrap to two lines. Row 2 is hovered (thumbnail, ↑, ⋯).
  - Collaborative bar: avatars O T R Z +5 and "John and Matt Rivera are typing…" with a toggle. Composer placeholder "Queue follow-up…..".
  - Right: the **artifact panel** "Untitled.xls" (v3, Publish, comment, download, expand, close) with the Acme Inc. dashboard. A drag handle sits at x ≈ 500.
  - A 12 px grey dot (`Pill solid`, node `8451:366460`) floats on the canvas over the chat-header comment icon at frame (471, 7). It is not in the export.
- Changed from previous: the layout switches to chat + artifact split, the rail highlights the apps/artifacts item, and the queue switches back to the In queue state and narrow width.
- Likely action: open the artifact (click the inline "Pipeline Command" card) while messages are queued. This is mainly the **narrow/responsive version** of the queue card.
- Nav: dark, collapsed, apps/artifacts item selected. Open: artifact panel.
- Components: `Main_nav / types=collapsed`, `ES Breadcrumb / Variant=with Icon`, `COT / Type=Main, State=Default, Running=No`, `Thoughts / State=Closed`, `Agent COT / Type=Step 1`, `Suggested prompts / Type=Lines`, `Inline Artifact Cards / State=Application-HTML`, `Attachments / Type=Image Thumbnail, Size=md…`, `Attachments / Type=File, Size=md, Placement=With Reply Box`, `Tag / … Type=Outline`, `Collaborative chat-large / State=User Typing, User=Max Users`, `Copilot desktop Input Box / Type=Bottom small, …Text=Placeholder…`, `Text Queue Card / Collapsed=No, State=In queue`, `Arifact Header` (sic), `Scroll bar / Orientation=Vertical…`, `Cursor / State=Arrow`

## Open questions
1. **Copy mismatch:** step 02 types "AI-generated insights based on…" but step 03 queues "Keep the design minimal". Which text should the prototype use?
2. **Queue card position:** in 04–05 and 15 the card overlaps the thread ("Thinking…" row and the last user bubble). Is the card a floating overlay anchored to the composer with a max height (and inner scroll), or should it push the thread up?
3. **Edit is missing** from the ⋯ menu on the item with an attachment (09). Is that an intentional rule (attachments cannot be edited) or an omission? There is also no frame for the Edit state itself (inline edit vs. back into the composer).
4. The collapsed bar (14) shows **"Queue 1"** while 2 items are queued. Is that a badge bug?
5. **Frame "15" is missing.** "14" is followed by "16", which jumps from 2 to 4 queued items without showing how. Is a frame missing, or is it intentional?
6. What happens when generation finishes or the queue is **resumed**? No frame shows a queued message being dispatched (one by one? all at once?) or what **Send now** does to the running generation (interrupt vs. jump the queue).
7. **Drag handles** imply reordering, but no drag/drop state is designed.
8. Step 16 (frame "189") sits at the far right in the artifact-open layout and in the In queue state again. Is it the end of this sequence or a separate responsive reference? The grey dot over the comment icon floats outside the frame.
9. The paused variant renders about 3 px narrower and further left than the In queue variant (card x 366 vs 369). Is this variant drift?
10. Tooltip components carry hidden shortcut layers ("⌘C", "↵"). Only "Add message to queue" shows the ↵ hint. Which tooltips should show shortcuts?
11. Is the queue only available while the assistant is generating (Stop button showing)? What does the composer look like when idle, and does "Queue follow-up…" become "Ask…"?
12. Copy typos: "@Assitant", "Queue follow-up….." (5 dots, step 16), "Arifact Header" (component name).
