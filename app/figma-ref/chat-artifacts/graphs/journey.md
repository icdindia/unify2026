# Graphs in Chat

- Journey id: `graphs`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `1707:125117` "Graphs in Chat" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125117
- Baseline: 1440x900. The chat frames hold the whole conversation in an unclipped container (about 1400px tall); each frame shows the scroll position the designer wanted. Content below the fold is listed per step.
- Story: two analytical questions in one chat ("Business units led"). The first answer is a KPI row plus a two-ring sunburst/donut. The second is a KPI row plus a dual-axis bar + line chart.

## Steps

### 01 — `2556:378637` ("42") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2556-378637) — `01-2556-378637.png`
- Shows: new-session landing page (dotted logo, "Hello Roger", "How can I help you today?"), empty landing composer with the I-beam text cursor over the placeholder "Use /skill to give your agent a capability.", Company / Research chips, Connect apps banner.
- Changed from previous: start of the journey.
- Action: click into the landing composer.
- Nav: dark, collapsed. Composer: landing, empty, focused. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; EB-Assistant/AI; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No; Cursor / State=Text; Banner carousel / Property 1=Three apps.
- Motion wiring: "_Text animate Desktop" placeholder rotation (AFTER_TIMEOUT), "thinking state" loop.

### 02 — `1707:126556` ("Dashboard") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-126556) — `02-1707-126556.png`
- Shows: same landing with the rail EXPANDED (UnifyApps, New Session, Projects, Routines, Meetings, Artifacts; Agents; Pinned with "Artifacts" highlighted; Routines; Chats; user Anurag Kashyap). Composer filled: "Which business units led in revenue, profit margin, and team size in Q2 2024?", hand cursor on the dark Send button.
- Changed from previous: prompt typed; Send button appears; rail expanded; content area re-centred in the remaining width.
- Action: type the question and click Send.
- Nav: dark, expanded. Composer: landing, filled. Panels/modals: none.
- Components: Main_nav / types=Expanded; EB-Assistant/AI; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No; Cursor / State=Pointer Hand; Banner carousel / Property 1=Three apps.

### 03 — `1707:125119` ("Dashboard") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125119) — `03-1707-125119.png`
- Shows: chat view titled "Business units led" (with chevron); user bubble with the question; Assistant avatar + "Thinking..."; header cost "$1.23", Share, clipboard; composer docked at the bottom in Generating state (stop button). Rail collapsed.
- Changed from previous: prompt sent; landing replaced by the chat; rail collapsed; thinking row.
- Action: click Send.
- Nav: dark, collapsed. Composer: bottom, generating. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Agent COT / Type=Step 1; Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No. In the layer tree but not visible: All COT / Property 1=1, Feedback Array / Type=Full screen, Suggested prompts / Type=Lines.
- Motion wiring: "_thinking state" / "thinking state" AFTER_TIMEOUT loops.

### 04 — `1707:125400` ("Dashboard") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125400) — `04-1707-125400.png`
- Shows: Assistant answer. "Thoughts >" collapsed line; serif headline "Cloud leads on revenue; Training & Consulting top margin"; subtitle "Revenue ($M) vs Profit Margin (%) · bubble size = Team Size · Q2 2024 · 6 business units"; divider; three grey KPI tiles (Highest Revenue $12.4M Cloud; Highest Margin 51% Training; Largest Team 120 Hardware); a two-ring sunburst/donut chart (blue, orange, green, yellow segments) with "$100M / Total portfolio" in the centre. Composer back to default (voice icon).
- Below the fold (inside `portfolio-allocation-chart` `1707:125411`, 760x1352): legend by business unit with staff counts (Cloud 85, Hardware 120, Consulting 48, Support 95, Training 22, Partnerships 15); explanatory paragraph ("Bubble area is proportional to team headcount..."); breakdown list (Equities $59M, Fixed Income $25M, Alternatives $14M, Cash $2M); a summary line; feedback row; suggested prompts. The second Q&A (steps 05-06) also sits below, from y≈1891.
- Changed from previous: thinking replaced by the finished answer with KPI tiles and chart.
- Action: none (answer streams in).
- Nav: dark, collapsed. Composer: bottom, default. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Agent COT / Type=Complete 1; Feedback Array / Type=Full screen (x2); Suggested prompts / Type=Lines (x2); Lines States (in the response); Copilot desktop Input Box / Type=Bottom small, State=Default. Chart layers are detached frames: `KPI Tiles Row` / `kpi-card`, `Chart Container` (760x380), `Sunburst Frame` (360x360).

### 05 — `1707:125678` ("Dashboard") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125678) — `05-1707-125678.png`
- Shows: same chat scrolled to a new long user bubble: "Show monthly revenue against gross margin for FY2023 - revenue in dollars and margin in percent. Data - Revenue ($M): Jan 42 ... Dec 81; Gross margin (%): Jan 58 ... Dec 68." and "Thinking..." below it. Composer generating.
- Changed from previous: second question sent; the first answer is scrolled out above.
- Action: type the follow-up data prompt in the bottom composer and send.
- Nav: dark, collapsed. Composer: bottom, generating. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; All COT / Property 1=6; Feedback Array / Type=Full screen; Suggested prompts / Type=Lines; Agent COT / Type=Step 1; Copilot desktop Input Box / Type=Bottom small, State=Generating.

### 06 — `1707:125957` ("Dashboard") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125957) — `06-1707-125957.png`
- Shows: second answer. "Thoughts >"; serif headline "Revenue and gross margin both climbed steadily through FY2023"; subtitle "Monthly Revenue ($M, bars) vs Gross Margin (%, line) · FY2023 · dual scale"; four KPI tiles (Highest Revenue $12.4M Cloud; Highest Margin 51% with green "▲ → 68% Dec" delta chip, Training; Largest Team 120 Hardware; Highest Margin 51% "▲ → 68% Dec" Training); legend (blue Revenue ($M), orange Gross Margin (%)); dual-axis combo chart: light-blue outlined bars Jan-Dec rising toward $81M on the left axis ($10M-$90M), orange line with dots rising on the right axis (55%-75%). The chart runs under the composer.
- Below the fold: rest of the chart (x-axis), a 240px text block (`Container:margin` `1707:126223`), feedback row.
- Changed from previous: thinking replaced by the combo-chart answer.
- Action: none (answer streams in).
- Nav: dark, collapsed. Composer: bottom, default. Panels/modals: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; All COT / Property 1=6; Agent COT / Type=Complete 1; Feedback Array / Type=Full screen (x2); Suggested prompts / Type=Lines (x2); Copilot desktop Input Box / Type=Bottom small, State=Default. Chart layers are detached: `kpi-card` (178x98 in the 4-up row), `Revenue Legend`, `Margin Legend`, `Chart Container` (760x268).

## Open questions

1. Step 04's subtitle describes a bubble chart (revenue vs margin, bubble size = team size), but the visual is a portfolio sunburst ("$100M Total portfolio", Equities / Fixed Income / Alternatives / Cash). Which is intended for "business units led" — a bubble chart, or is the sunburst only a placeholder visual?
2. Step 06's KPI tiles repeat step 04's business-unit numbers (Cloud $12.4M, Training 51%, Hardware 120), and "Highest Margin" appears twice. They should probably be FY2023 revenue/margin KPIs (Jan $42M -> Dec $81M, FY $715M, margin 58% -> 68%, avg 63%); those strings exist in a hidden copy inside thinking/`10139:466731`. Use those?
3. Step 02 expands the rail and step 03 collapses it again with no trigger shown (same pattern as chat-artifact 08 -> 10). Is the expanded rail part of the flow?
4. Should the charts be interactive (hover tooltips per bar or segment, legend toggles), or static images in the prototype?
5. The chat is titled "Business units led" from the first question and keeps that title for the FY2023 follow-up. Confirm titles do not update per turn.
