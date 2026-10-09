# Desktop input box designs (large variant) (`input-large`)

- Title card: `2532:376700` "Desktop Input box designs / Large variant": https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2532-376700 (image `00-card-2532-376700.png`)
- Figma page / section: **Chat + Artifacts** (page `1707:115989`), section **Chat** (`1707:133527`), the row at y 3243 (x 300 to 38863).
- Designer annotation above step 01: **"Animated text in input box"** (text `5220:229416`). No other annotations in the row.
- Baseline: 1440 x 900 for every frame (the card is 1499 x 900). Captured at scale 1 through the figma-console bridge on 2026-10-08.
- Nav: dark rail, collapsed, in every frame. No side panels, no modals.
- What it specifies: the composer (`Copilot desktop Input Box`, set `7372:140062`) on the landing page (01-07) and docked under the commit chat (08-13): the rotating placeholder, the Company / Research chips and their hover, the skill token, growth from one line to Max line (12 lines), the switch from Bottom small to Bottom large, and the Limit exceed state. Frames 14-24 replay the chain-of-thought run with the composer in State=Generating (Stop).
- Route column: `kind` is N new screen, S same screen with a UI-state change, T time passing, A alias of a step captured elsewhere. The routes follow BUILD-PLAN 2.1; `compose=` presets (`skill`, `skill-2`, `skill-3`, `skill-max`, `skill-over`, `skill-typing`, `skill-long`, `generating`) and the beats `cot-done`, `cot-collapsed`, `answer-streaming` were added to the commit script by the wave-1 integration. Beat ids follow the commit script: `cot-N` is Agent COT Type=Step N (`cot-2` Consulting, `cot-3` = `cot-1` the first thought, and so on); the capture's `consulting`, `cot-2`, `cot-3`, `cot-4` (steps 15, 17-19) were renamed `cot-2`, `cot-4`, `cot-5`, `cot-6`.

## Measurements

- **landing**: padding 10, rows 12 apart: field (2px top inset, 52 = two lines, grows to 314 = 12 lines) / action bar 32; radius 24; 116 tall empty; 640 wide on the landing page
- **bottomSmall**: 760x48, padding 8/10, radius-full: + (32) | chips (2 x 32, icon only) | field (padding 0/6, 26 tall) | 12 | actions (104)
- **bottomLarge**: padding 10 (8 on top above files), radius 24: field (26 per line, up to 312) / 12 / action bar 32 -> 90, 116, 142 … 376
- **attachments**: Attachments Desktop row 58 = 6 + 48 + 4, items 12 apart from a 4px inset; image thumb 48 (radius 8), file card 300x48; remove button 20, overhang 6
- **shadow**: the instances in these frames add a drop shadow 0 4 8 rgba(215,211,208,.30) (landing) / .25 (bottom); the Projects dashboard instance has none
- **dock**: chat frames wrap the composer in a 760x76 frame with 28px bottom padding and a fade from bg-workspace (55.1%) to transparent (67.3%)
- **placeholder**: _Text animate Desktop 5546:212948: prop=01 -> Break1 -> prop=02 -> Break2 -> prop=03 -> Break3 -> prop=04 -> Break4 -> prop=01; hold 4.5s, break 0.2s, smart animate 300ms ease-in-out. Hints: "Use /skill to give your agent a capability.", "Use @name to bring an agent or colleague here.", "Use + to connect the necessary apps.", "Describe the outcome — I will build the steps." (the master's prop=04 reads "Chat to search the enterprise database.")
- **tokens**: skill token = "/" + name, 15/26, steel-blue-400 (the landing frames draw the "/" in utility-blue-dark-600 #155eef); mention = "@" + name in steel-blue-400

## Steps

### 01 · `5220:222334` (Copilot Landing page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-222334
- Image: `01-5220-222334.png`
- Route (A): `#/new?seed=no-chips&rail=c`
- Composer: Landing Page, Tools & Sources=No, empty, rotating placeholder
- Shows: New-session landing: dots mark, "Hello Roger / How can I help you today?", empty 640px landing composer with no chips; the placeholder is the _Text animate Desktop instance cycling its hints ("Use /skill to give your agent a capability." on the frame). Model, Dictate and Voice on the right. Connect apps banner.
- Changed from previous: start of the row
- Action that leads here: open a new session; the placeholder rotates by itself (4.5s hold, 0.2s blank, 300ms smart animate)
- Designer annotation: "Animated text in input box"
- Note: Same screen as logo-options 01 (3612:167773, /new?seed=no-chips&rail=c).
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No`; `_Text animate Desktop / prop=01 (set 5546:212948)`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 02 · `9256:465524` (Copilot Landing page (component))
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-465524
- Image: `02-9256-465524.png`
- Route (S): `#/new?seed=no-chips&menu=add>skills&rail=c`
- Composer: Landing Page, Tools & Sources=No, empty; "+" pressed
- Shows: The "+" menu is open under the button (Copilot input dropdown / Type=L1+L2): Add photos & files; Web search, Deep research, Company Knowledge, Create Image (all checked); Skills with its submenu open to the right: Search skills, Meeting summary & Action items, Personalised Outreach Email, Account Web Intelligence, Keyboard shortcuts, Onboarding Plan, Email Drafting, Manage Skills. Pointer on Skills.
- Changed from previous: "+" clicked; the menu and the Skills submenu are open; the "+" keeps its hover fill
- Action that leads here: click "+", then hover Skills
- Note: The frame is a COMPONENT, not a frame. The menu is not part of the composer extensions (wave 2 landing page).
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No`; `Copilot input dropdown / Type=L1+L2 (12232:269688)`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 03 · `5220:202780` (Copilot Landing page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-202780
- Image: `03-5220-202780.png`
- Route (S): `#/new?hover=chip:research&rail=c`
- Composer: Landing Page, Tools & Sources=Yes, empty
- Shows: Landing composer with the Company and Research chips. The pointer is on Research: the chip tints steel-blue-25 and its telescope turns into a small round × (Tools Pill / State=Hover).
- Changed from previous: chips shown (Tools & Sources=Yes); Research hovered
- Action that leads here: hover the Research chip (a click on × removes the tool)
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No`; `Source Pill / State=Default, Sources=Yes, Size=md`; `Tools Pill / State=Hover, Size=md`; `Cursor / State=Pointer Hand`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 04 · `5220:203074` (Copilot Landing page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-203074
- Image: `04-5220-203074.png`
- Route (S): `#/new?compose=skill&rail=c`
- Composer: Landing Page, Tools & Sources=Yes, Text=One line
- Shows: The field holds a skill token "/Tech design requirements" (the "/" in blue-dark-600, the name in steel-blue-400) followed by "AI-generated insights based on the inputs provided." Voice is replaced by the dark round Send.
- Changed from previous: a skill was picked and text typed; Voice -> Send
- Action that leads here: type "/", pick a skill, type the prompt
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No`; `Response_Desktop full/in line Skills (7159:535660)`; `Buttons/Button Neutral / Size=md, Hierarchy=Primary, Icon=Only, State=Default (Send)`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 05 · `5220:203368` (Copilot Landing page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-203368
- Image: `05-5220-203368.png`
- Route (S): `#/new?compose=skill-2&rail=c`
- Composer: Landing Page, Tools & Sources=Yes, Text=Two line
- Shows: Two lines of text after the skill token; the box keeps its 116px height (the field is two lines tall from the start).
- Changed from previous: the text wraps to a second line
- Action that leads here: keep typing
- Note: The second line sits 22px under the first instead of 26 (two text nodes in Figma); the prototype keeps the 26px line height.
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Two line, Attachment=No`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 06 · `5220:203662` (Copilot Landing page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-203662
- Image: `06-5220-203662.png`
- Route (S): `#/new?compose=skill-max&rail=c`
- Composer: Landing Page, Tools & Sources=Yes, Text=Max line
- Shows: Twelve lines of text: the box has grown down to 378px (field 314 = 2 + 12 x 26) and now covers the top of the banner. Beyond 12 lines the field scrolls.
- Changed from previous: the box grows with the text up to its maximum
- Action that leads here: keep typing / paste a long prompt
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Max line, Attachment=No`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 07 · `5220:203956` (Copilot Landing page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-203956
- Image: `07-5220-203956.png`
- Route (S): `#/new?compose=skill-over&hover=limit&rail=c`
- Composer: Landing Page, Tools & Sources=Yes, Text=Max line, State=Limit exceed
- Shows: Over the character limit: a red "-2346" pill (Pill squared / sm, Error) left of Model, Send disabled (light grey), the last visible line ends in "…". Hovering the pill shows the tooltip "Your query is 2343 characters over the limit. Shorten it to continue" (Arrow=Bottom right).
- Changed from previous: the text passes the limit: limit pill, Send disabled
- Action that leads here: type past the limit; hover the pill
- Note: The pill says 2346 and the tooltip 2343: the prototype computes both from one count.
- Components: `Main_nav / types=collapsed`; `Copilot desktop Input Box / Type=Landing Page, State=Limit exceed, Tools & Sources=Yes, Text=Max line, Attachment=No`; `Limit pill / Property 1=Hover`; `Tooltip / Supporting text=False, Arrow=Bottom right`; `Cursor / State=Arrow`; `EB-Assistant (70px dots mark)`; `Banner carousel / Property 1=Three apps`

### 08 · `5220:220477` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-220477
- Image: `08-5220-220477.png`
- Route (S): `#/chat/commit?at=answer&compose=generating&rail=c`
- Composer: Bottom small, Tools & Sources=Yes, empty, State=Generating
- Shows: The commit chat with the finished answer (collapsed thoughts "Searched internal knowledge · Reasoned over the results ›", $0.19 feedback row) and the 760px Bottom small composer docked 27px above the bottom over a fade: "+", icon-only Company and Research chips, "Ask anything…", Model, Dictate and the dark Stop button.
- Changed from previous: a chat; the composer is the one-line pill and is still in its Generating state
- Action that leads here: send a prompt from the landing page
- Note: Stop with a finished answer looks like a drawing slip (open question 3).
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Complete 2`; `Copilot_Inline Citation Pill / State=Default, Count=True | False`; `Feedback Array / Type=Full screen`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 09 · `5220:204277` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-204277
- Image: `09-5220-204277.png`
- Route (S): `#/chat/commit?at=answer&compose=skill-typing&rail=c`
- Composer: Bottom small, Tools & Sources=Yes, Text=One line
- Shows: Typing in the pill: "/Tech design requirements AI-generated insights based on |" inline between the chips and the actions; Send replaces Voice.
- Changed from previous: text typed into the bottom composer
- Action that leads here: type a follow-up with a skill
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Complete 2`; `Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No`

### 10 · `5220:204304` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-204304
- Image: `10-5220-204304.png`
- Route (S): `#/chat/commit?at=answer&compose=skill-long&rail=c`
- Composer: Bottom large, Tools & Sources=Yes, Text=One line
- Shows: The text no longer fits the pill's inline field, so the composer becomes Bottom large (90px, radius 24): the message gets its own full-width row above "+", the chips and the actions. Its bottom edge stays put; it grows upward.
- Changed from previous: Bottom small -> Bottom large
- Action that leads here: keep typing past the pill's width
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Copilot desktop Input Box / Type=Bottom large, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No`

### 11 · `5220:204331` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-204331
- Image: `11-5220-204331.png`
- Route (S): `#/chat/commit?at=answer&compose=skill-3&rail=c`
- Composer: Bottom large, Tools & Sources=Yes, Text=Two line (three lines of text)
- Shows: Three lines of text; the box is 142px and grows upward over the thread.
- Changed from previous: more lines
- Action that leads here: keep typing
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Copilot desktop Input Box / Type=Bottom large, State=Default, Tools & Sources=Yes, Text=Two line, Attachment=No`

### 12 · `5220:204358` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-204358
- Image: `12-5220-204358.png`
- Route (S): `#/chat/commit?at=answer&compose=skill-max&rail=c`
- Composer: Bottom large, Tools & Sources=Yes, Text=Max line
- Shows: Twelve lines: the box is 376px (field 312 = 12 x 26) and covers the end of the answer; past 12 lines the field scrolls.
- Changed from previous: the box reaches its maximum height
- Action that leads here: keep typing
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Copilot desktop Input Box / Type=Bottom large, State=Default, Tools & Sources=Yes, Text=Max line, Attachment=No`

### 13 · `5220:204385` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-204385
- Image: `13-5220-204385.png`
- Route (S): `#/chat/commit?at=answer&compose=skill-over&rail=c`
- Composer: Bottom large, Tools & Sources=Yes, Text=Max line, State=Limit exceed
- Shows: Over the limit in the chat composer: "-2346" pill, Send disabled, last line truncated with "…". The pointer is on the Research chip.
- Changed from previous: past the character limit
- Action that leads here: type past the limit
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Copilot desktop Input Box / Type=Bottom large, State=Limit exceed, Tools & Sources=Yes, Text=Max line, Attachment=No`; `Cursor / State=Pointer Hand`

### 14 · `7534:275062` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-275062
- Image: `14-7534-275062.png`
- Route (A): `#/chat/commit?at=sent&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: Right after sending: the user bubble, the round dots avatar with "Thinking…", and the composer in Generating (Stop).
- Changed from previous: a new run of the row: the generating composer while the agent works (Agent COT / Type=Step 1)
- Action that leads here: send the prompt
- Note: Same as thinking 02 (10139:466731).
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 1`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 15 · `7534:276741` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-276741
- Image: `15-7534-276741.png`
- Route (T): `#/chat/commit?at=cot-2&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: "Consulting the knowledge repository…" replaces "Thinking…" (Agent COT / Type=Step 2).
- Changed from previous: COT Step 1 -> Step 2
- Action that leads here: none (time passes)
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 2`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 16 · `7534:278537` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-278537
- Image: `16-7534-278537.png`
- Route (A): `#/chat/commit?at=cot-1&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: COT header "Searched internal knowledge · Reasoned over the results ˅" and the first thought "Reading the quarter — quota, commit and what is open" (Vertex Sonnet • 2 results) with its four-row sources card.
- Changed from previous: COT Step 3: first thought with sources
- Action that leads here: none (time passes)
- Note: Same content as chat-artifact 04 (1713:246600).
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 3`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 17 · `7534:279976` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-279976
- Image: `17-7534-279976.png`
- Route (T): `#/chat/commit?at=cot-4&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: Adds "Traced the gap to the deals that are not in commit." under the sources card.
- Changed from previous: COT Step 4
- Action that leads here: none (time passes)
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 4`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 18 · `7534:281585` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-281585
- Image: `18-7534-281585.png`
- Route (T): `#/chat/commit?at=cot-5&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: "Searching for account details" appears above "Traced the gap…".
- Changed from previous: COT Step 5
- Action that leads here: none (time passes)
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 5`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 19 · `7534:283214` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-283214
- Image: `19-7534-283214.png`
- Route (T): `#/chat/commit?at=cot-6&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: Adds "Executing".
- Changed from previous: COT Step 6
- Action that leads here: none (time passes)
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 6`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 20 · `7534:284863` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-284863
- Image: `20-7534-284863.png`
- Route (A): `#/chat/commit?at=cot-7&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: Adds "Done": every thought on the connector line.
- Changed from previous: COT Step 7
- Action that leads here: none (time passes)
- Note: Same content as chat-artifact 05 (1713:249395).
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Step 7`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 21 · `7534:286145` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-286145
- Image: `21-7534-286145.png`
- Route (T): `#/chat/commit?at=cot-done&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: The thoughts collapse to "Thoughts ˅".
- Changed from previous: Agent COT / Type=Complete 1
- Action that leads here: none (time passes)
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Complete 1`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 22 · `7534:287594` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-287594
- Image: `22-7534-287594.png`
- Route (T): `#/chat/commit?at=cot-collapsed&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: Collapsed header "Searched internal knowledge · Reasoned over the results ˅".
- Changed from previous: Agent COT / Type=Complete 2
- Action that leads here: none (time passes)
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=Complete 2`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 23 · `7534:288907` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-288907
- Image: `23-7534-288907.png`
- Route (A): `#/chat/commit?at=cot-7&cot=lines&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: "Thoughts ˅" expanded with every thought on one line (no sources card).
- Changed from previous: Agent COT / Type=All 1 line thoughts
- Action that leads here: expand Thoughts
- Note: Same content as chat-artifact 06 (4756:184104).
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=All  1 line thoughts`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

### 24 · `7534:290275` (Chat full page)
- Figma: https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7534-290275
- Image: `24-7534-290275.png`
- Route (T): `#/chat/commit?at=answer-streaming&rail=c`
- Composer: Bottom small, empty, State=Generating
- Shows: The answer arrives under "Thoughts ›" (spinning dots avatar): a reward-ideas answer with an Inline Citation pill, the feedback row ($0.19, share, download, copy, read aloud, branch, 8 Sources) and "Suggested actions". The composer still shows Stop.
- Changed from previous: Agent COT / Type=With Answer
- Action that leads here: none (the answer streams)
- Note: The answer copy is the community-rewards placeholder, not the commit answer (Q2 drift).
- Components: `Main_nav / types=collapsed`; `ES Breadcrumb / Variant=Default`; `Copilot_User Message / State=Default, Type=Default`; `Agent COT / Type=With Answer`; `Agent COT / Type=Complete 1`; `Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No`

## Open questions

1. The landing frames color the skill "/" utility-blue-dark-600 and the chat frames steel-blue-400. Proposed: steel-blue-400 everywhere (fix composer-skill-slash-colour).
2. Frame 08 shows Stop under a finished answer, and 24 shows Stop while the answer is already written. Is the composer meant to stay in Generating until the suggested actions land? Proposed: Stop until the answer completes, then Voice/Send.
3. Limit pill: the pill reads -2346 and the tooltip 2343 characters. What is the limit (characters or tokens), and does the pill count down before the limit? Proposed: characters, pill only past the limit, both numbers from one count.
4. When the pill becomes Bottom large, should it shrink back to the pill once the text fits one line again? Proposed: yes (the prototype re-measures on every edit).
5. Landing Two line: the second line sits 22px under the first (two text nodes) while Max line uses 26. Proposed: 26 throughout.
6. The rotating placeholder: does it pause while the field has focus? Proposed: no, it keeps rotating while the field is empty.
