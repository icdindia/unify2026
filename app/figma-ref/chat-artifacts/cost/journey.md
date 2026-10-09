# Cost of Chat

- Journey id: `cost`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `6802:235989` "Cost of Chat" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-235989
- Baseline: 1440x900.
- What it specifies: the cost pill in the chat header (ring + dollar amount), its three budget states, the "This chat" cost popover, and what happens when the monthly workspace usage runs out (request more usage, then a pending-approval banner).
- Cost-ring states (zoomed from the header): within budget = thin dark arc, partly filled (01, 04); approaching limit = orange ring, almost full (02, 05); over limit = full red ring (03, 06, 07, 09).
- The composer in these frames is `Type=Bottom large`, Tools & Sources=No (no Company / Research chips). It holds a blue skill token "/Tech design requirements" followed by "AI-generated insights based on the inputs provided.", and the Send button is active.

## Steps

### 01 — `6802:235991` ("93") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-235991) — `01-6802-235991.png`
- Shows: chat "Business units led" (with chevron). User bubble "We are two-thirds through the quarter. How does commit actually look?"; COT header plus first thought with its 4-row sources card. Header cost pill "$0.56" with a thin dark partial ring. Composer filled with the skill token prompt.
- Changed from previous: start of the journey.
- Action: open the chat (agent mid-run). The cost pill shows running spend.
- Nav: dark, collapsed. Composer: bottom large, filled. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Step 3; Copilot desktop Input Box / Type=Bottom large, State=Default, Tools & Sources=No, Text=One line, Attachment=No.

### 02 — `6802:236005` ("94") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236005) — `02-6802-236005.png`
- Shows: identical screen, cost pill "$1.23" with an orange ring (approaching the limit).
- Changed from previous: amount $0.56 -> $1.23; ring turns orange and nearly full.
- Action: none (spend grows as the agent works).
- Nav / composer / panels: as 01.
- Components: as 01.

### 03 — `6802:236019` ("95") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236019) — `03-6802-236019.png`
- Shows: identical screen, cost pill "$1.23" with a full red ring (over the per-session limit).
- Changed from previous: ring turns red and full.
- Action: none (spend crosses the limit).
- Nav / composer / panels: as 01.
- Components: as 01 plus a second ES Breadcrumb / Variant=Default (hidden "Routines" title).

### 04 — `6802:236034` ("96") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236034) — `04-6802-236034.png`
- Shows: the answer has arrived ("Thoughts >"; "Here are some creative ways to reward active community members..." with an "Inline Citation" pill; Points and Badges; Virtual Co-Working or Retreats; action row with the "$0.19" per-message cost pill highlighted; "8 Sources"; "Suggested actions" list: "Do you want me write a mail?", "Do you want me estimate audience?" x2). The header cost pill is hovered (grey bg, hand cursor) and the "THIS CHAT $1.23" popover is open: QUERIES / COSTS table with one row ("hi" $0.01703); a 3-segment budget bar $0 / $2 / $5 with a ▼ marker in the first segment; "Within budget — well below the $5 per-session limit set." Ring is the dark partial arc.
- Changed from previous: answer rendered; cost popover opened; ring back to within-budget.
- Action: hover (or click) the cost pill in the header.
- Nav: dark, collapsed. Composer: bottom large, filled. Popover: cost (within budget).
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Step 3; Agent COT / Type=With Answer; cost stat (local component: the popover); Cursor / State=Pointer Hand; Copilot desktop Input Box / Type=Bottom large, Tools & Sources=No, Text=One line.
- Prototype wiring: Agent COT AFTER_TIMEOUT -> `10080:469246` (Type=With Answer); "Copilot_Inline Citation Pill" ON_PRESS -> hover variant `5647:478917`.

### 05 — `6802:236050` ("97") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236050) — `05-6802-236050.png`
- Shows: the commit answer ("Commit is $8.4M against a $9.2M quota..."); header pill "$3.65" with an orange ring, hovered; popover "THIS CHAT $3.65" lists 10 queries with costs (We are two-thirds... $0.01703, Which of my open deals lost momentum... $0.00892, Draft a Loom transcript summary... $0.00706, Explain the Atlas Data Cloud presence... $0.00622, Draft a follow-up to Meridian's security review... $0.00612, Draft talking points for Friday's pipeline call. $0.00524, Compare Atlas vs. Vertex... $0.00458, What's my open pipeline coverage for Q4? $0.00456, Summarize last week's forecast call. $0.00354, Which reps are behind on quota... $0.00278). The bar's middle segment ($2-$5) is orange with the marker in it; "Approaching limit - getting close to $5 limit set." (orange label).
- Changed from previous: more queries; amount $3.65; popover grows into a list; approaching-limit state.
- Action: hover the cost pill again after more queries.
- Nav: dark, collapsed. Composer: bottom large, filled. Popover: cost (approaching).
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Step 3; Response_Desktop full / Property 1=Assistant; cost stat; Cursor / State=Pointer Hand; Copilot desktop Input Box / Type=Bottom large.

### 06 — `6802:236066` ("98") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236066) — `06-6802-236066.png`
- Shows: header pill "$19.45" with a full red ring; popover "THIS CHAT $19.45" (7 visible rows, first row hovered grey); the bar's last segment beyond $5 is red with the marker at the end; "Over limit - past the $5 limit set. Start a new session." (red label). The cursor has moved away (right edge) and the popover stays open.
- Changed from previous: over-limit state; popover stays open without hover (focused / clicked).
- Action: click the cost pill so the popover stays open; hover a query row.
- Designer annotation (above the popover): "focus state to be the hover state here".
- Nav: dark, collapsed. Composer: bottom large, filled. Popover: cost (over limit), pinned open.
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Step 3; Response_Desktop full / Property 1=Assistant; cost stat; Cursor / State=Pointer Hand; Copilot desktop Input Box / Type=Bottom large.

### 07 — `6802:236106` ("100", frame opacity 30% on canvas) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236106) — `07-6802-236106.png`
- Shows (washed out because the frame is at 30% opacity): header pill "$19.12" red; popover "THIS CHAT $19.12" with 2 queries; a red footer "Out of usage this month — $259 of @259" with a full red bar, "Resume on 1 October" and a "Request more" link. Answer area shows only the COT and sources. Composer filled.
- Changed from previous: the monthly workspace quota is exhausted; the popover footer switches from the per-session bar to the monthly usage block with "Request more".
- Action: hover / click the cost pill when monthly usage is exhausted.
- Nav: dark, collapsed. Composer: bottom large (send should be blocked). Popover: cost (out of monthly usage).
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Step 3; cost stat; Cursor / State=Pointer Hand; Copilot desktop Input Box / Type=Bottom large.

### 08 — `6802:236145` ("Modal Full Screen", frame opacity 40%, 25% black fill) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236145) — `08-6802-236145.png`
- Shows: overlay frame with only a scrim and a centred modal: serif title "Ask for more Usage", subtitle "You have used $250 of $250 this month.", field "How much more" ($ icon, value 100), textarea "Why" (placeholder "Give reason"), footer note "Goes to your workapce admin", buttons Cancel / Send (primary, dark green), close X.
- Changed from previous: modal overlay opens on top of the chat.
- Action: click "Request more" in the cost popover.
- Nav: hidden under the scrim (the frame is an overlay meant to sit over step 07). Modal: open.
- Components: Modal header / Type=Subtext Single line; Input field_outline / Size=lg, Type=Icon leading, Destructive=False, State=Filled; Textarea input field / Type=Default, Destructive=False, State=Placeholder; Modal actions / Type=Horizontal right aligned (checkbox), Size=sm, Destructive=False, Inset=No, Divider=Yes.
- Prototype wiring: Input field_outline ON_CLICK -> `1407:188085` (placeholder state), textarea ON_CLICK change-to.

### 09 — `6802:236125` ("101") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236125) — `09-6802-236125.png`
- Shows: back in the chat (title now "How does commit actually look?" with chevron), header pill "$19.12" red. Above the composer an inline status card: spinner, "Request pending approval", "$100 of additional usage requested. your limit resets on October 1.", "Requested" on the right. Composer still filled.
- Changed from previous: modal closed; pending-approval card inserted above the composer.
- Action: enter amount + reason and click "Send" in the modal.
- Nav: dark, collapsed. Composer: bottom large, with the status card above it. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Step 3; Inline Cards / State=Default (the pending card); Copilot desktop Input Box / Type=Bottom large, State=Default, Tools & Sources=No, Text=One line, Attachment=No.

## Open questions

1. Frames 07 and 08 are dimmed on the canvas (30% and 40% frame opacity). Are they parked or rejected designs, or is the dimming only so the overlay (08) reads as a layer over 07? The prototype will render them at full opacity.
2. The amounts disagree: 07 says "$259 of @259" (typo "@"), 08 says "$250 of $250", and 09 requests "$100". Which monthly limit is canonical? Also "workapce" is a typo.
3. Steps 01-03 show the ring going $0.56 dark -> $1.23 orange -> $1.23 red with no other change. What are the thresholds per session (for example orange at 80% of $5 and red at $5)? The popover bars use $0 / $2 / $5 marks.
4. Step 04's popover lists one query called "hi" ($0.01703) while the chat shows the commit question. Placeholder copy?
5. When over the monthly limit (07-09), is the composer disabled or Send blocked? The frames keep the Send button active.
6. Does the cost popover open on hover, on click, or both? 04/05 show hover; 06 says the focus state should match hover.
7. Step 09 changes the chat title back to "How does commit actually look?", while 01-07 say "Business units led". Which title is correct for this chat?
