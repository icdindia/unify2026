# New Memory via Chat

- Journey id: `new-memory`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `9860:711733` "New Memory via Chat" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9860-711733
- Baseline: 1440x900.
- What it specifies: after an answer, the agent saves new memories and shows a "Memory update" bar above the composer. "View Memory" opens Settings > Memory. The full Settings memory flow lives on the Settings page: `10112:406770` "Memory" (COMPONENT, page "Settings" `3612:185217`, section "Settings"), linked from the canvas note "🔗 Click here for full flow".

## Steps

### 01 — `9915:762550` ("New Memory") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9915-762550) — `01-9915-762550.png`
- Shows: chat "How does commit actually look?" (no chevron) with the completed commit answer. The answer has inline source pills "Reforecast +2" (Google Drive icon) and "Pipeline" (Salesforce icon), plus the action row ($0.19, 8 Sources, feedback). Above the composer: a grey rounded bar with a bell icon, "Memory update: Tricon, Areas and 2 more", "View Memory ↗" and a close X. The header has an extra empty-circle icon at the far right after the clipboard. Composer empty with a light-grey (disabled) Send.
- Changed from previous: start of the journey (the answer has just finished and memory was written).
- Action: send a question; the agent answers and saves memories.
- Nav: dark, collapsed. Composer: bottom, default. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Complete 2; Feedback Array / Type=Full screen; Alert / Size=md, Color=Grey, Double Stack=Off (the memory bar); Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No.

### 02 — `10112:411197` ("New Memory ", frame opacity 20% on canvas) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-411197) — `02-10112-411197.png`
- Shows (washed out because the frame is at 20% opacity): the same screen with a smaller, tighter memory bar (Alert Size=sm: smaller bell, smaller text, shorter height).
- Changed from previous: memory bar size md -> sm.
- Action: none (size variant of step 01).
- Nav: dark, collapsed. Composer: bottom, default.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message / State=Default, Type=Default; Agent COT / Type=Complete 2; Feedback Array / Type=Full screen; Alert / Size=sm, Color=Grey, Double Stack=Off; Copilot desktop Input Box / Type=Bottom small, State=Default.

### 03 — `10112:408460` (INSTANCE of "Memory" `10112:406770`) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-408460) — `03-10112-408460.png`
- Shows: Settings modal (about 960x720, rounded) over a dimmed landing page. Left column: "SETTINGS" with General, Memory (selected), Models, Skills, Get App & Extensions. Right: "Memory" title; "Generate memory from chats" with description and a toggle ON (dark green); "Import memory from other AI providers" with description and a "Start Import" button; PROFILE list (How the week runs [New] — "The fixed points in a normal week..." — Updated 13 Sept; Role and book — "Eleven renewal accounts..." — Updated 12 Sept); TOPICS (Cycling — "Weekend riding..." — Updated 8 Sept); Areas (Tricon renewal [New] — "An $840k renewal due 30 November..." — Updated 14 hours ago; Proofpoint evaluation, faded under the fold); bottom input "Tell Unify's AI what to change or remove" with a round send button. Close X at top right.
- Changed from previous: chat replaced by the Settings > Memory modal; newly added items carry a green "New" tag.
- Action: click "View Memory ↗" in the memory bar.
- Designer annotation (above the frame): "🔗 Click here for full flow" (hyperlink to node `10112:406770` on page "Settings").
- Nav: dark, collapsed (under scrim). Composer: landing (under scrim). Modal: Settings > Memory open.
- Components: Memory (screen component) > 1 (landing screen component `3612:167773`) > Main_nav / types=collapsed (Component 2 / Type=Icon only, Nav_menu/Main / Variant=Collapsed, State=Selected + 7x Default, Nav_menu/Footer / Variant=Collapsed); EB-Assistant/AI; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No; Banner carousel / Property 1=Three apps; Modal; Secondary navigation / States=All Closed; Modal header / Type=Default.

## Open questions

1. Step 02 is dimmed to 20% on the canvas. Is the small memory bar a rejected alternative (keep md from step 01), or a second state, for example after the bar auto-collapses?
2. "View Memory" opens Settings over the landing page, not over the chat the user was in. Should the modal open over the current chat? Does closing it return to the chat?
3. Does the memory bar auto-dismiss after a time or on the next message, or only via X?
4. What is the empty-circle icon added at the far right of the chat header in step 01? It appears only in this journey.
5. Copy typo in the answer: "thannumber" (should be "than number").
6. Should the prototype follow the "full flow" link into the Settings page journey, or stop at step 03?
