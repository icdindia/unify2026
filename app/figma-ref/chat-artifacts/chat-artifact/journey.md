# Chat journey with Artifact

- Journey id: `chat-artifact`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `1707:136006` "Chat journey with Artifact" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136006
- Baseline: 1440 wide. Frames are 1440x900 unless stated.
- Story: Roger asks "How does commit actually look?" on the landing page, watches the agent think (chain of thought), gets an answer, shares the chat, three colleagues join, he @mentions Matt, Matt @mentions the Assistant, the Assistant produces the "Pipeline Command" interactive artifact, then the user opens the files panel, opens the artifact side panel, its version menu, renames it and expands it to full screen.

## Shell legend

- Rail: dark green `Main_nav`. "collapsed" = 56px icon rail; "expanded" = 280px rail with UnifyApps logo, New Session, Projects, Routines, Meetings, Artifacts, Agents, Pinned, Routines, Chats, user footer.
- Chat header (`ES Breadcrumb`): chat title + chevron on the left; on the right: collaborator avatar stack (once people join), cost pill "$1.23" with progress ring, Share, files (clipboard) icon, comment icon (steps 10-14 only).
- Composer (`Copilot desktop Input Box`): "Landing Page" type centred on the landing page; "Bottom small" docked at the bottom in the chat. State=Generating shows a stop button.

## Steps

### 01 — `1707:136008` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136008) — `01-1707-136008.png`
- Shows: New-session landing page: dotted logo, "Hello Roger / How can I help you today?", empty composer ("Use /skill to give your agent a capability.", + / Company / Research chips, model, mic, voice icons), "Connect apps" banner carousel with HubSpot/Slack/Salesforce tiles and 3 pager dots.
- Changed from previous: start of the journey.
- Action: open a new session (rail "+" / New Session).
- Nav: dark, collapsed. Composer: landing (centred), empty. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; EB-Assistant/AI; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No; Banner carousel / Property 1=Three apps.
- Prototype wiring in the file: "thinking state" AFTER_TIMEOUT change-to and "_Text animate Desktop" AFTER_TIMEOUT (animated placeholder text).

### 02 — `1707:139771` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-139771) — `02-1707-139771.png`
- Shows: same landing page with the prompt typed: "We are two-thirds through the quarter. How does commit actually look?"; the voice icon is replaced by a dark round Send (arrow up) button, hand cursor on it.
- Changed from previous: composer text filled (Text=One line); Send button appears.
- Action: type the prompt in the composer, then hover/click Send.
- Nav: dark, collapsed. Composer: landing, filled. Panels/modals: none.
- Components: Main_nav / types=collapsed; EB-Assistant/AI; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No; Cursor / State=Pointer Hand; Banner carousel / Property 1=Three apps.

### 03 — `9256:466688` (COMPONENT "3") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-466688) — `03-9256-466688.png`
- Shows: chat view. User bubble (right, grey) with the prompt. Header: "How does commit actually look?" + chevron, "$1.23" cost with spinner ring, lock "Share", clipboard icon. The chat-title menu is open: View files in Chat, Pin Chat, Rename, Add to Project (hovered, submenu open: Search, project list "View profile / Settings / Keyboard shortcuts x3 / Company profile", "+ Start a New Project"), Archive, Delete (red). Composer docked at bottom ("Ask anything...") in Generating state (stop button).
- Changed from previous: the prompt was sent; landing replaced by the chat layout with header; title menu + Add to Project submenu opened.
- Action: click Send; then click the chat title chevron and hover "Add to Project".
- Nav: dark, collapsed. Composer: bottom, generating. Dropdown menu: open (title menu + submenu). Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No; Frame 2147266815 (local component). In the layer tree but not visible in the render: Agent COT / Type=Step 1, All COT / Property 1=1, Feedback Array / Type=Full screen, Suggested prompts / Type=Lines, Banner carousel.
- Prototype wiring: "_thinking state" and "thinking state" AFTER_TIMEOUT change-to (agent dots animation).

### 04 — `1713:246600` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1713-246600) — `04-1713-246600.png`
- Shows: title menu closed. Agent row starts: dots avatar, "Searched internal knowledge · Reasoned over the results" with chevron, first thought "Reading the quarter — quota, commit and what is open" with "Vertex Sonnet • 2 results" and a sources card (Open opportunities — Q3 26 (14) / Opportunity; Quota and attainment by rep / Forecast; FY26 reforecast — Aug.gsheet / Finance · 25 Aug; Competitive log — Atlas.xlsx / Deal desk).
- Changed from previous: menu closed; chain-of-thought step 1 with sources appears.
- Action: none (agent streams automatically after send).
- Nav: dark, collapsed. Composer: bottom, generating. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Agent COT / Type=Step 3; Copilot desktop Input Box / Type=Bottom small, State=Generating, ...
- Prototype wiring: "_Thoughts" ON_CLICK change-to (expand/collapse thoughts).

### 05 — `1713:249395` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1713-249395) — `05-1713-249395.png`
- Shows: COT continues below the sources card: "Searching for account details", "Traced the gap to the deals that are not in commit.", "Executing", "Done" — each with its own icon on a vertical connector line. Arrow cursor.
- Changed from previous: four more thought steps appended (Agent COT Type=Step 7).
- Action: none (streaming); cursor shows hover.
- Designer annotation (above frame): "Hover on thought- changes text color only".
- Nav: dark, collapsed. Composer: bottom, generating. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full; Agent COT / Type=Step 7; Cursor / State=Arrow; Copilot desktop Input Box / Type=Bottom small, State=Generating.

### 06 — `4756:184104` ("62") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4756-184104) — `06-4756-184104.png`
- Shows: same COT but every thought as a single text line, no sources card.
- Changed from previous: sources card removed (Agent COT Type=All 1 line thoughts).
- Action: none / presentation variant of the thoughts list.
- Designer annotation: "All text COT".
- Nav: dark, collapsed. Composer: bottom, generating.
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message_Desktop full; Agent COT / Type=All  1 line thoughts; Copilot desktop Input Box / Type=Bottom small, State=Generating.

### 07 — `4756:186919` ("63", 1440x1051) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4756-186919) — `07-4756-186919.png`
- Shows: COT where every thought carries a sources card (4 thoughts x 4 sources) then "Done"; taller frame (1051) so the composer sits lower.
- Changed from previous: every thought line now has its sources card.
- Action: none / presentation variant.
- Designer annotation: "Text + source COT".
- Nav: dark, collapsed. Composer: bottom, generating.
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message_Desktop full; Copilot desktop Input Box / Type=Bottom small, State=Generating (the COT here is detached, not an Agent COT instance).

### 08 — `1809:501331` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) — `08-1809-501331.png`
- Shows: answer complete. COT collapsed to one line "Searched internal knowledge · Reasoned over the results >". Answer: "Commit is $8.4M against a $9.2M quota..." with three bold bullets and two paragraphs. Action row: "$0.19", share, like, copy, read aloud, branch, source favicons "8 Sources", thumbs up/down, more. Composer back to default with voice icon. Rail is EXPANDED (UnifyApps logo, New Session, Projects, Routines, Meetings, Artifacts; Agents: Financial Analysis / Sheet Sage / Formula Falcon; Pinned: Artifacts, Projects with 2 chats, Plan launch timeline, Review customer feedback; Routines; Chats; footer Anurag Kashyap with bell).
- Changed from previous: response streamed in; COT collapsed; composer no longer generating; rail expanded.
- Action: generation finishes; user expands the rail (rail toggle). See open questions.
- Nav: dark, expanded. Composer: bottom, default. Panels/modals: none.
- Components: Main_nav / types=Expanded; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Response_Desktop full / Property 1=Assistant; Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No.

#### 08a (alternate below) — `5691:481950` ("79") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5691-481950) — `08a-5691-481950.png`
- Shows: visually the same screen as 08 (pixel diff is sub-pixel text anti-aliasing only; same text styles Geist 15/26). Built as a `Dashboard` screen-wrapper instance instead of loose layers.
- Changed from 08: nothing visible.
- Components: Dashboard (screen wrapper) > Main_nav / types=Expanded, ES Breadcrumb, Copilot_User Message_Desktop full, Response_Desktop full / Property 1=Assistant, Copilot desktop Input Box / Type=Bottom small, State=Default.

### 09 — `1809:446980` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-446980) — `09-1809-446980.png`
- Shows: "Share Artifact" modal centred over a dimmed screen: "Invite people and groups" input; PEOPLE WITH ACCESS: Lana Steiner (you), lanasteiner@unifyapps.com, Owner; GENERAL ACCESS: lock icon, "Restricted" dropdown, "Only the people above can access it"; "Copy Link" button; close X.
- Changed from previous: modal + scrim opened over step 08.
- Action: click "Share" in the chat header.
- Nav: dark, expanded (under scrim). Composer: bottom, default. Modal: open (Share).
- Components: Dashboard (screen wrapper) > Main_nav / types=Expanded, ES Breadcrumb, Copilot_User Message_Desktop full, Response_Desktop full, Copilot desktop Input Box / Type=Bottom small, State=Default; Modal Unit.
- Prototype wiring: "Input dropdown_outline" ON_CLICK change-to (the Restricted dropdown).

### 10 — `1731:255712` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-255712) — `10-1731-255712.png`
- Shows: rail collapsed again. Header now has avatar stack M / J / G, Share shows a people icon instead of the lock, extra comment icon at far right. System line under the answer: "Matt Rivera, John Whitaker and Grace Coleman joined the chat". Composer has "@" typed and a mention list above it: Assistant, Matt Rivera, John Whitake, Grace Coleman. Send button active.
- Changed from previous: modal closed; three people invited; header icons changed; mention picker open.
- Action: invite Matt, John and Grace in the Share modal and close it; type "@" in the composer.
- Designer annotations (above frame): "After adding people to the chat - share button icons changes"; "Tag user in text state". Four `ES Breadcrumb / Variant=Default` instances are stacked above this frame as header references.
- Nav: dark, collapsed. Composer: bottom, typing with mention dropdown. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full; Response_Desktop full / Property 1=Assistant; Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No; Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default.

### 11 — `1731:338960` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-338960) — `11-1731-338960.png`
- Shows: composer text "@m"; mention list filtered to Matt Rivera (hovered) and Mace Coleman; hand cursor.
- Changed from previous: list filtered by the typed letter.
- Action: type "m" after "@".
- Nav: dark, collapsed. Composer: bottom, typing + mention dropdown.
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message_Desktop full; Response_Desktop full; Cursor / State=Pointer Hand; Copilot desktop Input Box / Text=One line; Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default.

### 12 — `1731:340363` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-340363) — `12-1731-340363.png`
- Shows: composer reads "@Matt Rivera" (blue mention token) + "you own most of those six — which" with caret; dropdown closed.
- Changed from previous: mention inserted as a token; message being typed.
- Action: click "Matt Rivera" in the mention list, keep typing.
- Nav: dark, collapsed. Composer: bottom, typing.
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message_Desktop full; Response_Desktop full; Copilot desktop Input Box / Text=One line; Cursor / State=Pointer Hand.

### 13 — `1731:341539` — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-341539) — `13-1731-341539.png`
- Shows: conversation scrolled up; new user bubble (right) with a "@Matt Rivera" pill + "What are some creative ways to reward community members?"; above the composer a typing indicator: M avatar "Matt Rivera ···".
- Changed from previous: message sent; typing indicator for Matt appears; composer cleared (voice icon back).
- Action: press Send.
- Designer annotation: "Typing state".
- Nav: dark, collapsed. Composer: bottom, default.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default (x2); Copilot_User Message_Desktop full; Response_Desktop full; Copilot desktop Input Box / Text=Placeholder; Avatar / Size=xxs, Type=Letter, Colour=Brand Solid, State=Default; Three dots animation / State=1.

### 14 — `3273:190223` ("51") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3273-190223) — `14-3273-190223.png`
- Shows: Matt Rivera replies with two grouped grey bubbles (left, avatar + name), then a second group: "Easier to show you than describe it." and "@Assistant give me an interactive view of the quarter — the gap against quota, and the deals carrying it with what each one is waiting on." Below: Assistant dots avatar "Thinking...".
- Changed from previous: collaborator messages arrive; the Assistant is tagged and starts thinking.
- Action: none for the viewer (Matt replies and tags @Assistant).
- Designer annotations: "Option 1" / "User/Assistant Tag in pill with bg" (Option 2 "without bg" sits to the right and is ignored per decision).
- Nav: dark, collapsed. Composer: bottom, default.
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot_User Message / State=Default (x several, Type=Default); Avatar / Size=xxs, Type=Letter, Colour=Brand Solid; Agent COT / Type=Complete 2; Response_Desktop full / Property 1=Assistant; Copilot desktop Input Box / Text=Placeholder.

### 15 — `1768:356654` ("13") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1768-356654) — `15-1768-356654.png`
- Shows: the Assistant answer ("Interactive. Forecast against quota, the stage funnel...") with an inline artifact card "Pipeline Command — Interactive HTML — Download"; John Whitaker and Grace Coleman messages. Hovering the avatar stack opens a "PEOPLE WITH ACCESS" popover: Roger Bennett (You) Owner, Matt Rivera Editor, John Whitake Editor, Grace Coleman Editor, Natali Craig Viewer. Header comment icon no longer shown.
- Changed from previous: Assistant answer with artifact card; two more collaborator messages; access popover open.
- Action: hover (or click) the avatar stack in the header.
- Nav: dark, collapsed. Composer: bottom, default. Popover: people with access.
- Components: Main_nav / types=collapsed; ES Breadcrumb (x2); Copilot_User Message / State=Default, Type=With Tag; Copilot_User Message / Type=Default; Copilot_User Message_Desktop full; Agent Avatar; Thoughts / State=Hover; Feedback Array / Type=Full screen; Response_Desktop full / Property 1=Assistant; Inline Artifact Cards / State=Application-HTML; Avatar / Size=xxs ...; Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default; Copilot desktop Input Box / Text=Placeholder; Cursor / State=Pointer Hand.
- Prototype wiring: "Copilot_Inline Citation Pill" ON_PRESS change-to.

#### 15a (alternate below, 1440x1104) — `3211:70049` ("50") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3211-70049) — `15a-3211-70049.png`
- Shows: reference sheet of every inline artifact card type under one answer: Document DOCX, Sheets XLSX, Presentation PPTX, Document PDF ("card hover"), Document PDF ("button hover" — Download gets a bordered button), Document MD, Interactive HTML, Table CSV, Connector App Flow Diagram, JSON. Header title "Routines", rail Artifacts item selected (reference only).
- Designer annotation (above): "artifact icons".
- Components: Nav_menu/Main / Variant=Collapsed, State=Default/Selected; Nav_menu/Footer / Variant=Collapsed; Component 2 / Type=Icon only; Copilot_User Message_Desktop full / Type=With Tag; Response_Desktop full / Property 1=Assistant; Inline Artifact Cards / State=DOC, XLS, PPT, PDF (x2), Markdown, Application-HTML (x2), Flow Diagram, JSON; Cursor / State=Arrow; ES Breadcrumb; Copilot desktop Input Box / Type=Bottom small.

### 16 — `1809:363799` ("14") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-363799) — `16-1809-363799.png`
- Shows: popover closed, view scrolled; the artifact card in hover state ("Pipeline Command — Interactive HTML • 123 KB • Version 1", grey card bg, bordered Download button, hand cursor). The header clipboard icon carries a "2" badge. Grace's message now reads "Can it flag where Atlas is present? ...".
- Changed from previous: hover on the artifact card; files icon badge; scroll position.
- Action: hover over the inline artifact card.
- Nav: dark, collapsed. Composer: bottom, default.
- Components: Main_nav / types=collapsed; ES Breadcrumb (x2); Copilot_User Message (With Tag / Default); Agent Avatar; Thoughts / State=Hover; Feedback Array; Agent COT / Type=Complete 2; Inline Artifact Cards / State=Application-HTML; Avatar; Cursor / State=Pointer Hand; Pill solid / Size=xxs, Type=Pill color, Icon=False, Color=Gray (the "2" badge); Copilot desktop Input Box / Text=Placeholder.

#### 16a (alternate below, 1440x1104) — `14876:285160` ("1749") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14876-285160) — `16a-14876-285160.png`
- Shows: newer inline card spec with the new PDF icon: default card (Download button always visible) and hovered card. Leftover labels "card hover" / "button hover" float on the right. Header "Routines", rail Artifacts selected (reference only).
- Components: Nav_menu/Main / Variant=Collapsed; Nav_menu/Footer; Component 2 / Type=Icon only; Copilot_User Message_Desktop full / Type=With Tag; Response_Desktop full; ES Breadcrumb; Copilot desktop Input Box.

### 17 — `5975:413714` ("86") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5975-413714) — `17-5975-413714.png`
- Shows: the files panel (floating card on the right, below the header): "Artifacts 3" + "Download All"; rows Pipeline Command (DOCX V3 / PDF V1 / DOCX V3), Text Command, Star Command with download icons; "Files 8" with list/grid toggle (list active): Screenshot (IMG, hovered, download icon), Filename.PDF, Filename.CSV. Chat column shifts left to make room. Cursor on the clipboard icon.
- Changed from previous: files panel opened; chat content shifted left.
- Action: click the files (clipboard) icon in the chat header.
- Designer annotations: "aritfact numbers" (left of the frame); "aritfacts and uploads access - option 1".
- Nav: dark, collapsed. Composer: bottom, default (shifted left). Side panel: files panel open (floating).
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot desktop Input Box / Type=Bottom small, State=Default; Cursor / State=Arrow. (The chat body and the files panel are detached layers, not instances.)

### 18 — `14607:403125` ("1747") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14607-403125) — `18-14607-403125.png`
- Shows: same files panel; Artifacts rows now "Interactive HTML • 123 KB • Version 1"; Files switched to the grid view: 2-column thumbnail cards with type chips DOC, PPT, IMG, PDF, JSON (hovered, download icon), SVG, CSV, XLSX; panel scrolls.
- Changed from previous: Files list -> grid view.
- Action: click the grid toggle in the Files header.
- Nav: dark, collapsed. Composer: bottom, default. Side panel: files panel open (grid).
- Components: Main_nav / types=collapsed; ES Breadcrumb; Copilot desktop Input Box / Type=Bottom small; Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=md; Cursor / State=Arrow (x2).

### 19 — `13722:383349` ("1743") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13722-383349) — `19-13722-383349.png`
- Shows: split view. Left: chat column (~650px) with its own header (title, $1.23, Share, clipboard). Right: artifact panel "Untitled.xls" (rounded card) showing the Acme Inc. account dashboard (ARR/NRR/NPS/Adoption/Renewal KPI cards, Customer Journey stepper, Health/Journey/Strategy/Intelligence/Actions tabs, Overall usage chart, Feature sequencing, Seat utilisation). The files panel is open as a dropdown from the chat header, over the chat column (list view).
- Changed from previous: artifact panel opened on the right; files panel re-anchored to the chat column header with a fixed height.
- Action: click the inline artifact card to open the artifact; then click the files icon.
- Designer annotation: "when a artifact is open - fixed height 720".
- Nav: dark, collapsed. Composer: bottom of chat column. Artifact panel: open (split). Side panel: files dropdown open.
- Components: Main_nav / types=collapsed; Arifact Header; Frame 2147266136 (local component); Scroll bar / Orientation=Vertical, Size=sm; Code Pill / Size=xs, Color=Gray, Icon=False (x2); Buttons/Button Neutral / Size=xs, Hierarchy=Tertiary, Icon=Default, State=Default; Inline Cards / State=Default (x5); Toggle group / Type=Default, Style=Icon only, Size=xs, Variant=Default; Cursor / State=Arrow (x2).

### 20 — `1809:488480` ("15") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-488480) — `20-1809-488480.png`
- Shows: split view without the files dropdown: chat column narrower (~430px) with a resize handle, artifact panel wider. Artifact header: file icon + "Untitled.xls", preview/code toggle, copy, "v3" version selector, Publish, comment + chevron, download, expand, close. Inline card in chat shows a download icon instead of the Download button.
- Changed from previous: files dropdown closed; split divider moved (chat narrower).
- Action: close the files dropdown (click outside) and/or drag the split handle.
- Designer references nearby: `Arifact Header` instance labelled "all possible icons in header" above the frame; `Copilot desktop Input Box / Type=Bottom large, Text=Max line` below the frame.
- Nav: dark, collapsed. Composer: bottom of chat column. Artifact panel: open (split).
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot desktop Input Box / Type=Bottom small, State=Default; Arifact Header; Scroll bar / Orientation=Vertical, Size=sm.

### 21 — `1795:359260` ("16") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1795-359260) — `21-1795-359260.png`
- Shows: the "v3" version menu open under the artifact header: "all header icons for reference.xls — Today • Latest" (selected), "Artifact name 1 — Yesterday • 14:14", "Artifact name 2 — 3 days ago • 08:12". Header variant: copy + refresh icons (no preview/code toggle). Rail Artifacts icon highlighted. Collaborator bubbles use smaller text.
- Changed from previous: version dropdown opened; header icon set changed; rail item selected.
- Action: click the "v3" version selector in the artifact header.
- Nav: dark, collapsed (Artifacts selected). Artifact panel: open (split). Dropdown: version menu open.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=with Icon; Copilot desktop Input Box / Type=Bottom small; Arifact Header; Scroll bar / Size=sm; Dropdown list item / Start Type=Default, End Type=Shortcut, Selected=On, State=Default, Divider=False, Supporting Text=On, Size=sm; Dropdown list item / ... Selected=Off (x2); Cursor / State=Arrow.

#### 21a (state above) — `6405:306202` ("91", hover state) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6405-306202) — `21a-6405-306202.png`
- Shows: version menu closed; hovering the artifact name "Untitled.xls" gives it a grey hover background (cursor on it).
- Action: hover the artifact name in the artifact header.
- Designer annotation: "hover state".
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=with Icon; Copilot desktop Input Box; Arifact Header; Scroll bar; Cursor / State=Arrow (x2).

#### 21b (state above) — `6405:308388` ("92", edit name) — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6405-308388) — `21b-6405-308388.png`
- Shows: the artifact name is an inline text field "Untitled name here|.xls" (bordered input, caret before the extension).
- Action: click the artifact name to rename it.
- Designer annotation: "edit name".
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=with Icon; Copilot desktop Input Box; Arifact Header; Scroll bar; Cursor / State=Arrow.

### 22 — `1809:484624` ("17") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-484624) — `22-1809-484624.png`
- Shows: artifact full screen: chat column gone, the artifact header becomes the page header ("Untitled.xls" + chevron, copy, refresh, v3, Publish, comment + chevron, download, collapse, close); dashboard content centred at full width.
- Changed from previous: chat hidden; artifact expanded to full width; expand icon becomes collapse.
- Action: click the expand icon in the artifact header.
- Designer annotations below the frame: "all header icons for reference"; "min 200 px max full name • 40 pixel between button and name".
- Nav: dark, collapsed (Artifacts selected). Artifact panel: full screen. Composer: hidden.
- Components: Main_nav / types=collapsed; Arifact Header.

## Open questions

1. Step 03 is a COMPONENT inserted later (`9256:466688`). It shows the chat-title menu with "Add to Project" while the agent is still generating. Is the title menu part of the main story, or a side state that should hang off step 04 as an overlay?
2. Steps 06 ("All text COT") and 07 ("Text + source COT") look like two presentation variants of the same moment, not consecutive states. Which one ships, or do both exist (for example, collapsed vs expanded thoughts)?
3. Step 08 has the rail expanded and step 10 has it collapsed again, with no trigger shown. Was the expanded rail deliberate, or just to show the rail with the chat?
4. The Share modal in step 09 is titled "Share Artifact" and names the owner "Lana Steiner", but it is shared from a chat whose owner is Roger / Anurag elsewhere. Should it read "Share chat"? Which user name is canonical?
5. Step 12 types "@Matt Rivera you own most of those six — which", but step 13 sends "What are some creative ways to reward community members?" This is placeholder copy drift. Which text should the prototype use?
6. Steps 15 and 16 differ in Grace's message text and in the header comment icon (shown in 10-14, gone from 15). Is the comment icon conditional?
7. Steps 19 and 20: in Figma order the files dropdown over the split view (19) comes before the plain split view (20). Logically, opening the artifact (20) comes before opening files on top of it (19). Should the order be swapped? The chat column width also differs (about 650 vs 430). Which is the default split ratio?
8. Steps 21-22 show a different artifact-header icon set (copy + refresh, no preview/code toggle) from step 20. Is this an owner vs viewer difference, or a newer header version?
9. 15a and 16a are reference sheets (header "Routines", rail Artifacts selected), not real states. Use them only as the source for the inline-card variants.
