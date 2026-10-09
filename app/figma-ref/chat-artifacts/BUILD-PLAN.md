# Chat + Artifacts: build plan for the React prototype

Source: Figma file `lqKjNjyifEXCeywg69Knr2`, page **Chat + Artifacts** (`1707:115989`), confirmed map
`app/src/figma/journeys.chat-artifacts.json`, and the 29 captured specs in this folder (`<journey>/journey.md`, `journey.json`, PNGs).

Figma link for any node id `A:B`: `https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=A-B`.

Written 2026-10-08. The shell (nav, rail, breadcrumb, composer, dropdown menu, buttons) and the Projects screens are being built
by another workflow in `app/src/shell` and `app/src/components`. Nothing in this plan edits `app/src` until that work has landed;
where this plan needs a change to their code it is listed as a **contract ask** (section 4, wave 1).

Contents
- 0. What this plan covers, and what we need from you
- 1. Component inventory
- 2. Routes: one URL per captured step
- 3. Interactions: the clickable path through each journey, with gaps
- 4. Build order in waves
- 5. Open questions (deduplicated, each with a proposed default)
- Appendix A. Candidate fixes for the FIXES ledger
- Appendix B. Responsive and mobile rules we will author

---

## 0. What this plan covers, and what we need from you

**Coverage.**
- The map has 30 journeys. 29 are captured here: 203 images of frames, extra states and component units, plus title cards.
- **`input-large` was not captured.** It is "Desktop input box designs (large variant)", card `2532:376700`, with 24 frames.
  It is the only source for the composer's `Bottom large` / `Max line` states. It is a capture task in wave 1 (agent 1.5).
- The page uses **10 screen templates**. Every captured step is one of them plus URL state:
  1. Landing (New Session)
  2. Chat
  3. Chat + artifact split
  4. Artifacts landing
  5. Artifact full view inside the shell
  6. Artifact standalone (no shell)
  7. Projects landing (built by the shell workflow)
  8. Project page (built by the shell workflow)
  9. Routines landing (a stub)
  10. Component gallery

**How it maps back to Figma for the dev team.** There is no Code Connect: it needs an Org or Enterprise plan, and this account is on Professional. The handoff therefore works through four things:
1. Every captured step has one canonical prototype URL, listed in section 2. These go into `FRAMES` in `src/figma/frames.ts`, and the review bar links each screen to its Figma frame.
2. Every component root renders `data-node-id="<Figma component set or instance id>"`.
3. `/gallery/<component>` shows each component's variants in isolation, with the Figma set name and link. This is the dev team's lookup page.
4. Every departure from Figma is a named entry in `FIXES` (`src/fixes/fixes.ts`). Each entry carries before/after and the original node ids, and the "With fixes" toggle shows them. Approved fixes are copied to a "Prototype fixes" page in Figma.

**What would help most from you:**
1. Answer the **blocking questions Q1-Q9** in section 5. "Defaults OK" is a valid answer; list only the ones you want changed.
2. Decide the signed-in persona (Q1). It touches almost every screen.
3. Refresh `FIGMA_ACCESS_TOKEN` in the figma-console MCP config. The capture agents hit `403 Token expired` whenever the Desktop Bridge export queue stalled. A working token gives a REST fallback for image exports and the diff harness.
4. Say whether the dimmed rows (commenters at 30%, cost 07/08, memory 02, canvas comment modal) are live (Q4, Q5).

---

## 1. Component inventory

How to read the "Exists today" column:
- **React** means a component in `app/src` that can be used as-is or extended.
- **CSS atom** means a stylesheet in `/Users/lisarath/Unify2026/components/<name>/` that is already measured against Figma and can be ported into a React component.
- **HTML ref** means a vanilla-JS prototype in `prototypes/` whose behaviour can be copied.
- **None** means we build it from scratch.

The "W" column gives the wave that builds the component (section 4).

### 1A. Shell and page chrome (dependencies; most are owned by the shell workflow)

| # | Component (React name) | Figma component set(s) | Used in (journey: steps) | States / variants seen | Exists today | W |
|---|---|---|---|---|---|---|
| 1 | `Nav` / `Rail` (dark + light) | `Main_nav` (set `226:81201`; dark `226:81200`, light `9721:594967`), `Main_nav light mode`, `Nav_menu/Main`, `Nav_menu/Footer`, `Component 2` (logo) | every frame | types=Expanded / collapsed; Nav_menu/Main State=Default / Selected / Hover; Footer State=Default / Clicked; light + dark | React: `app/src/shell/nav` (Nav, Rail, LogoSpiral). The item lists are hard-coded. | shell |
| 2 | `AccountMenu` | `Tentant Switcher`, `Avatar`, `_nav icon` | nav-light 03, 04 | collapsed (with a Notifications row and red dot) / expanded (no Notifications row) | HTML ref: `prototypes/notification-flow`. React: `Nav` has an `onAccountMenu` callback only. | 5 |
| 3 | `PinnedGroup` + `PinnedRow` (rail behaviours) | `Nav_menu/Main / Variant=Expanded, State=Hover`, `Small Icon Button / Size=md`, `arrow-up-right`, `dots-horizontal`, `folder`, `Tooltip / Arrow=None`, `Cursor / State=Grabbed` | nav-behaviour 01-09; pinned-chevron 01-02; drag-unpin 01-02; drag-pinned 01-03; pinning 01-03 | row hover (open arrow, or chevron replacing the folder icon); expanded project with tree line; more than 10 chats plus "View All"; status: white dot (unread), spinner ring, red ring, grey ring; ⋯ menus; drag lift / over / drop; drag out with "Release to unpin" | React: static rows only (`shell/nav/rows.tsx` ChatRow shows a status dot and ⋯ on hover). | 5 |
| 4 | `ChatHeader` | `ES Breadcrumb / Variant=Default` and `Variant=with Icon` (`5865:366539`), `Avatar group / Size=xs`, `Buttons/Button Neutral / Size=sm, Tertiary`, `Pill solid / Size=xxs, Color=Gray` | nearly every chat frame; header-dropdowns c06, c07 | title + chevron (hover pill; truncates in split); avatar stack (3, or 10 + "+21"); cost pill with ring (within / approaching / over; hover); Share (lock icon, or people icon once shared); files (clipboard) with a "2" badge; comments (hover, "2" badge, unread dot); unexplained empty circle (new-memory 01) | CSS atom: `components/es-breadcrumb`. React: `components/breadcrumb` (the Projects variant, with an `actions` slot). | 2 |
| 5 | `Composer` | `Copilot desktop Input Box` (`5563:230560`): Type=Landing Page / Bottom small / Bottom large; State=Default / Generating; Tools & Sources=Yes / No; Text=Placeholder / One line / Two line / Max line; Attachment=No / Yes. Also `Copilot desktop_Input Box / Breakpoint=Desktop, Size=Two-lines` (publish 01) and `Line=One line large` (share 01). | every landing and chat frame | see row 6 for the extras | React: `components/composer` (landing look only; no send, stop or generating). CSS atom: `components/copilot-input` (bottom and expanded variants). | 1 |
| 6 | Composer extras: `SendButton`, `StopButton`, `QueueButton`, `SourceChips`, `SkillToken`, `MentionToken`, `AttachmentThumb`, `RotatingPlaceholder` | the same set, plus `Tooltip`, `Attachments / Type=Image Thumbnail | File`, `_Text animate Desktop` (`5546:212948`) | chat-artifact 02, 10-12; queue-1 01-05; cost 01-09 (skill token); enhance 02-05; collab 03-05 | Send dark round / disabled; Stop with tooltip "Stop generating"; Queue with "Add message to queue ↵" (disabled while uploading); placeholder rotates through 4 hints (4.5s hold, 0.2s break, 300ms); "Queue follow-up…" placeholder | None | 1 |
| 7 | `DropdownMenu` / `DropdownItem` | `Dropdown Menu / Type=Small | Full`, `Dropdown list item` (Start Type=Default; End Type=Shortcut / Icon; Selected=On / Off; Supporting Text=On / Off; Divider; Size=sm / md), `Dropdown list header search`, `Dropdown list header / Type=H2`, `Search_solid`, `Frame 2147266815` (menu wrapper) | title menu, Add to Project / Switch Project submenus, card / row / pin menus, version and name menus, role menus, queue item menu, Apps / Download dropdowns | supporting text, check mark (selected), H2 section header, coloured-logo leading icon, destructive red, opens upward near the bottom | React: `components/dropdown-menu` (icon + label, danger, submenu, search, placement). **Missing:** supporting text, selected check, shortcut, H2 header, logo / avatar leading. | 1 |
| 8 | Buttons | `Buttons/Button Neutral` (xs / sm / md; Tertiary / Secondary; Icon=Default / Only; Default / Hover / Disabled), `Buttons/Button Brand` (sm / md Primary / Secondary; xs icon only), `Small Icon Button`, `Buttons/Link` | everywhere | Disabled state; split button (label + chevron) for Excel export and comments | React: `components/buttons` (IconButton, TertiaryButton, SecondaryButton, BrandButton, FilterButton). CSS atom: `components/button`. **Missing:** Disabled, split button. | 1 |
| 9 | `Tooltip` | `Tooltip / Supporting text=False, Arrow=Bottom center | Top center | Top left | None` (+ hidden shortcut chips) | enhance 03; queue-1 01-14; artifacts-landing 05 (⌘ ⇧ C chips); editor-main 03; drag-unpin 01; nav-behaviour 07-08 | four arrow positions; optional shortcut chips | None | 1 |
| 10 | `Avatar`, `AvatarGroup` | `Avatar / Size=xxs | xs | sm | md, Type=Letter, Colour=Brand Solid | Brand Subtle | White`, `Avatar group / Size=xs` | headers, messages, share lists, comments, collaborative bar | +N overflow; letter colours per person | CSS atom: `components/avatar` (single avatar). React: avatar colours in `data/chats.ts` (Projects table). | 1 |
| 11 | `Pill`, `CodePill`, `Tag`, `Dot` | `Pill solid / Size=xxs, Type=Pill color, Color=Gray`, `Code Pill / Size=xs, Color=Gray`, `Tag / Type=Outline`, `Dot / Size=md, Colour=Brand`, the memory "New" tag | header badges, queue count, file-type chips, comments unread | count, file type, new, unread | CSS atom: `components/pill` | 1 |
| 12 | `Modal` (unit, header, actions, scrim) | `Modal Unit`, `Modal`, `Modal header / Type=Default | Subtext Single line, Size=xs, back=no | yes`, `Modal actions / Type=Horizontal right aligned (checkbox) | Horizontal fill container, Destructive=False | True, Divider`, scrim (25% black), `Modal Full Screen` | share, add-users, publish, cost 08, artifacts-landing 06, new-memory 03 | back arrow sub-views; checkbox in footer; destructive footer | None | 1 |
| 13 | Form fields | `Input dropdown_outline / Size=md | lg, Type=Default | Tags, State=Placeholder | Focused`, `Input field_outline / Size=lg, Type=Icon leading, State=Filled`, `Textarea input field / State=Placeholder | Filled`, `Checkbox / Size=sm | xs, Text=True`, `Search_solid`, toggle switch (memory, Assistant Replies) | share, publish, cost 08, memory 03, collaborative bar | chips (tags) that wrap to 2 rows; focus; filled | CSS atom: `components/audience-picker` (field, chip and menu, read from the same DS parts) | 1 |
| 14 | `OptionMenu` (people and option list) | `Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default`, `Input dropdown Menu Item / Size=sm | md, Type=Avatar leading | Default, Stacking=Single | Double Line, State=Default | Hover, Selected` | mention list (chat-artifact 10-11, collab 03-04); access popovers (chat-artifact 15, collab 09, header c04); share people search and general access; publish c08a; commenters members | section label; trailing role in mono; scroll; hover; selected | CSS atom: `components/audience-picker` (menu geometry) | 1 |
| 15 | `EmptyState` | `ES Empty State / Level=Level 1 | Level 2, Type=Create` | deleted-artifact 01; artifacts-landing 01; commenters 07 | illustration, serif heading, sub, button | None | 1 |
| 16 | Scrollbars | `Scroll bar / Orientation=Vertical, Size=sm | md` | panels and canvases | - | CSS only (styled native scrollbars). Not a component. | 1 |
| 17 | (never built) | `Cursor`, `Dashboard` / "3" / "1" screen wrappers, `Frame 2147266815`, publish c12 changelog card | - | Figma presentation scaffolding | - | - |

### 1B. Landing (New Session)

| # | Component | Figma | Used in | States / variants | Exists today | W |
|---|---|---|---|---|---|---|
| 18 | `LandingPage` (greeting + mark + composer) | screen component "1" `3612:167773`, `EB-Assistant/AI` (70x70 dotted mark), `Company Logo` (swirl, Option 2, not used) | chat-artifact 01-02; logo-options 01; graphs 01-02; enhance 01-05; every nav-* landing frame | "Hello *Roger*" (serif, italic name); centres in the space left by the rail | React: `LogoSpiral` exists for the rail logo only. Check whether it is the same artwork as the 70x70 mark. | 2 |
| 19 | `BannerCarousel`, `FeatureBanner` | `Banner carousel / Property 1=Three apps`, `Feature Banner / Feature name=Enable memory | Custom Instructions` | every landing frame | 3 app tiles (HubSpot, Slack, Salesforce) + pager dots | None | 2 |
| 20 | `EnhancePrompt` | `Buttons/Button Neutral / Size=md, Tertiary, Icon=Only, State=Disabled | Default | Hover` + `Tooltip` + skeleton shimmer | enhance 01-05 | disabled under 3 words; hover tooltip "Enhance with AI"; loading (skeleton, Stop, Send disabled); enhanced (disabled) | None | 2 |

### 1C. Chat thread

| # | Component | Figma | Used in | States / variants | Exists today | W |
|---|---|---|---|---|---|---|
| 21 | `ChatScreen` layout (thread column, header, composer dock with fade, scroll anchoring) | `Dashboard` / "3" (`9256:466688`) wrappers | every chat frame | 760 column centred; narrow column in split | HTML ref: `prototypes/playbook-studio` (`.stage`, `.turn`) | 2 |
| 22 | `UserMessage` | `Copilot_User Message_Desktop full / State=Default | Hover, Type=Default | With Tag | Consecutive msgs`, `Copilot_User Message / State=Default, Type=Default | With Tag` | chat-artifact 03-16; consecutive; collab 06-08; queue; commenters | own message (right, grey) vs participant (left, 20px avatar + name, grouped); "@Name" pill; hover actions copy + edit; spacing 32 (same sender) / 40 (sender change) / 24 (name to bubble), body padding 8/16, radius 12 | HTML ref: playbook-studio `.bubble` | 2 |
| 23 | `SystemLine` | local text ("Matt Rivera, John Whitaker and Grace Coleman joined the chat") | chat-artifact 10; collab 01 | - | None | 2 |
| 24 | `AssistantResponse` | `Response_Desktop full / Property 1=Assistant`, `Agent Avatar`, `Lines States`, `Copilot_Inline Citation Pill` (press: hover variant `5647:478917`), source pills (Drive "Reforecast +2", Salesforce "Pipeline") | chat-artifact 08-16; graphs 04, 06; cost 04-06; new-memory 01; collab; queue | serif headline + subtitle; bold bullets; citation pill hover | None | 2 |
| 25 | `FeedbackRow` | `Feedback Array / Type=Full screen` | every finished answer | "$0.19" per-message cost pill (highlighted in cost 04); share, like, copy, read aloud, branch; source favicons + "8 Sources"; thumbs up/down; more | None | 2 |
| 26 | `SuggestedActions` | `Suggested prompts / Type=Lines` | cost 04; graphs 04, 06 | "Suggested actions" list with ↳ rows | None | 2 |
| 27 | `ThinkingIndicator` | `Agent COT / Type=Step 1` row, `_thinking state` (`7534:291688`, 0.2s loop), `thinking state` (`484:117565`) and `_thinking state` (`3518:217901`) (0.8s loop), `Agent_Avatar / Size=xs, Type=Advance` | thinking 01-02; graphs 03, 05; chat-artifact 14; collab 07; queue-1; commenters 05 | bare dot grid vs round avatar (Q25) | None | 2 |
| 28 | `ChainOfThought` | `Agent COT` set `8863:218607` (Step 1…7, "All 1 line thoughts", Complete 1, Complete 2, With Answer), `All COT / Property 1=1 | 6`, `Thoughts / State=Hover | Closed`, `COT - Steps / Step=Finish, State=Collapsed`, `COT / Type=Main`, `Links` (sources card rows) | chat-artifact 04-08; cost 01-06; graphs; thinking | auto chain: Step 1 (4s), then each step after 2.5s, ending at With Answer; thought hover changes text colour only; collapsed "Searched internal knowledge · Reasoned over the results ›" | CSS atom: `components/cot` | 2 |
| 29 | `TypingIndicator` (single person) | `Avatar / Size=xxs` + `Three dots animation / State=1` | chat-artifact 13 | - | None | 2 |
| 30 | `InlineArtifactCard` | `Inline Artifact Cards / State=DOC | XLS | PPT | PDF | Markdown | Application-HTML | Table CSV | Flow Diagram | JSON` (sheet 15a `3211:70049`; new PDF icon 16a `14876:285160`) | chat-artifact 15-20; collab 08-10; chat-questions; deleted; queue 16; commenters | default; card hover (grey bg + bordered Download); button hover; split variant with a download icon; meta "Interactive HTML • 123 KB • Version 1" | CSS atom: `components/inline-artifact-card` (one type, 408 and 520 widths) | 2 |
| 31 | `QuestionCard` | `Copilot_Question Card / Property 1=hover` | chat-questions 01 | numbered options, hover row, free-text row + Skip, close, loading arc | CSS atom: `components/question-card`. HTML ref: playbook-studio. | 2 |
| 32 | Charts: `KpiTiles`, `SunburstChart`, `ComboChart`, `ChartLegend` | detached: `KPI Tiles Row` / `kpi-card` (178x98; 3-up and 4-up, ▲ delta chip), `Sunburst Frame` (360x360), `Chart Container` (760x380 / 760x268), `Revenue Legend`, `Margin Legend` | graphs 04, 06 | static vs interactive (Q30) | None (`components/stat` is a different tile). Load the `dataviz` skill. | 2 |
| 33 | `MemoryUpdateBar` | `Alert / Size=md | sm, Color=Grey, Double Stack=Off` + "View Memory ↗" + close | new-memory 01-02 | md (sm is the dimmed alternative) | CSS atom: `components/alert` (neutral and warning only) | 2 |
| 34 | `SettingsMemoryModal` (Memory pane only) | `Memory` (`10112:406770`, page Settings), `Modal`, `Secondary navigation / States=All Closed`, `Modal header / Type=Default` | new-memory 03 | toggle on; "Start Import"; Profile / Topics / Areas lists with a "New" tag; bottom input | None | 2 |
| 35 | `StatusCard` (above composer) | `Inline Cards / State=Default` (spinner, "Request pending approval", "Requested") | cost 09 | pending | None | 2 |

### 1D. Chat header menus, popovers and panels

| # | Component | Figma | Used in | States / variants | Exists today | W |
|---|---|---|---|---|---|---|
| 36 | `ChatTitleMenu` | `Dropdown Menu` + `Frame 2147266815`: View files in Chat, Pin Chat, Rename, Add to Project › (search, project list, "+ Start a New Project"), Archive, Delete | chat-artifact 03 | submenu open | React: DropdownMenu (submenu + search). Data only. | 2 |
| 37 | `CostPopover` | local component "cost stat" | cost 04-07 | "THIS CHAT $x"; QUERIES / COSTS table (1 or 10 rows; row hover); 3-segment bar $0 / $2 / $5 with ▼ marker; within / approaching / over labels; monthly-out footer (red bar, "Resume on 1 October", "Request more"); pinned open on click | None | 2 |
| 38 | `RequestUsageModal` | `Modal header / Subtext Single line`, `Input field_outline / lg, Icon leading, Filled`, `Textarea input field`, `Modal actions / (checkbox), Divider=Yes` | cost 08 | - | None | 2 |
| 39 | `AccessPopover` (people with access) | `Input Menu Dropdown` (section label + avatar rows + role) | chat-artifact 15; collab 09; header-dropdowns c04 | read-only list; scroll | None | 4 |
| 40 | `FilesPanel` | detached layers ("aritfacts and uploads access - option 1"): `Inline Cards / State=Default` rows, `Toggle group / Style=Icon only, Size=xs`, `Code Pill`, `Scroll bar` | chat-artifact 17-19 | floating card (chat) vs dropdown at a fixed 720 height (split); "Artifacts 3" + Download All; "Files 8" list / grid; hover shows download | None | 2 |
| 41 | `ChatArtifactsMenu` | `Dropdown Menu / Type=Small` with artifact rows | header-dropdowns c05 | - | React: DropdownMenu | 3 |

### 1E. Artifacts

| # | Component | Figma | Used in | States / variants | Exists today | W |
|---|---|---|---|---|---|---|
| 42 | `SplitView` (chat column + handle + artifact panel) | `Sheets` (`3272:368879`), `Frame 2147266136`, drag handle | chat-artifact 19-22; chat-questions; deleted; artifacts-landing 08; publish 01; commenters 05-06; queue 16 | chat column about 440 (Q8); handle drag; expand to full; close | HTML ref: playbook-studio `.split`, `.split__handle` | 3 |
| 43 | `ArtifactHeader` | `Arifact Header` (sic; main `3805:105688`), `Artifact-Icons / Type=App | Spreadsheets | Documents | PDFs | Markdowns | Presentation | connector | JSON`, `Toggle group` (preview / code), `coloured logos / Type=excel | App`, `ai-star`, `Form Header` (publish 01) | chat-artifact 19-22; editor-main 01-03; viewer 01-08; full-editor 01-06; cloned 02-03; publish 01; commenters 05-10; deleted; chat-questions | name button (hover, chevron, truncate + tooltip, inline rename); Edit with Chat / Start Chat; preview / code; copy; zoom 150%; page stepper; version arrows; refresh; v3 button; Excel split; Publish (hover); comments split; download; expand / collapse; close; back; Home. Role variants: editor, viewer, commenter. Narrow 787 compaction. | CSS atom: `components/artifact-header` (split variant `3838:245967`) | 3 |
| 44 | `ArtifactNameMenu` + `VersionHistory` | `Dropdown list item` (Supporting Text=On, Selected), Version History frame `9200:349032` | editor-main 01; cloned 02; chat-artifact 21; header-dropdowns c03 | Rename, Clone, Versions ›, Delete (a clone has no Versions entry); versions show "Today • Latest" | React: DropdownMenu (needs supporting text + check) | 3 |
| 45 | `ExportMenu` (Apps / Download) | `Apps Dropdown` (component `12703:449317`; frame copy `1969:507290`), `Download Dropdown` (`1969:507305`), `Dropdown list header / Type=H2` | artifacts-landing 08; header-dropdowns c01, c02 | OPEN IN (Google Sheets, Sharepoint), DOWNLOAD (Excel, PDF, CSV / HTML), Copy to clipboard | React: DropdownMenu (needs H2 + logo leading) | 3 |
| 46 | `ArtifactCanvas` (sample content per type) | Acme dashboard (image fill in Figma), `Sheets` grid, page-on-grey, full-bleed markdown, slide, connector | viewer, full-editor, editor-main, every split frame | App, Spreadsheet, Document, PDF, Markdown, Presentation, Flow, JSON | HTML ref: `prototypes/artifacts`, `artifacts-doc`, `artifacts-tinted` | 3 |
| 47 | `DeletedArtifact` | `ES Empty State / Level 1, Type=Create` + "Recreate the Artifact" | deleted-artifact 01 | - | None (uses row 15) | 3 |
| 48 | `ArtifactsLanding` page | page head (Spectral title + `Buttons/Button Brand / md` with hover tooltip and ⌘ ⇧ C chips), `filter frame / Type=Default | search click` (tabs All / Yours / Shared with you, search, All Types, Newest, grid / list toggle) | artifacts-landing 01-05; cloned 01; pinning 01 | empty; grid; list; search expanded; type filter menu | React: Tabs, FilterButton, BrandButton. CSS atom: `components/filter-bar`. | 3 |
| 49 | `ArtifactCard` | `artifacts / Property 1=full image | hover 2` (288x266), per-type tint (sheet c01 `13750:280568`) | artifacts-landing 02, 04, 05; cloned 01; pinning 01 | hover ⋯; status icons pin / lock / people / globe; card menu Pin or Unpin, Edit with Chat, Clone, Download, Share, Delete | CSS atom: `components/artifact-card` (the older 288x226 card) | 3 |
| 50 | `ArtifactsTable` | `Col Header Cell`, `Table cell / Style=Avatar with text | Icon with text and badge | Action three dot icon` | artifacts-landing 03 | row hover ⋯ | React: the Projects chat table (shell workflow, in progress) | 3 |
| 51 | `ArtifactStarters` | `Artifact Starters / Property 1=Spreadsheet | Presentation | Document | Application` | artifacts-landing 07 | hover | None | 3 |
| 52 | `ConfirmDeleteModal` | `Modal header / Subtext Single line` + `Modal actions / Horizontal fill container, Destructive=True` | artifacts-landing 06 | - | None (uses row 12) | 3 |
| 53 | `PublishModal` | `Modal header (back no / yes)`, `Section label / Level 1(Alt)`, `List Item / Size=xs, Type=Icon simple`, `List Item Cardified / Size=md`, `Avatar group / xs`, `Avatar / md`, `Input dropdown_outline / Default | Tags`, `Input Menu Dropdown`, `Modal actions` (+ Unpublish) | publish-artifact c01-c11 | first time; second time; visibility; restricted; add people; who has access; remove | CSS atom: `components/list-item` (a different list-item variant) | 3 |
| 54 | `CanvasComments` | `Canvas Comment` (set `1902:350384`, 6 variants), `Comment Bubble` (`1902:350418`), `Canvas-Comments-Bouble` (`1902:350642`), `Buttons/Button Brand / xs, Secondary, Icon=Only` (close chip), `ai-star` | canvas-comments 01-03, c01 | hover (dashed outline + sparkle); selected (solid outline + pin + composer card); composer: empty / filled / 2 lines / truncated; @agent highlight | None | 4 |

### 1F. Collaboration

| # | Component | Figma | Used in | States / variants | Exists today | W |
|---|---|---|---|---|---|---|
| 55 | `ShareModal` (chat and artifact) | `Modal Unit`, `Input dropdown_outline / lg`, member rows with role button, general access (`Input Menu Dropdown` + `Input dropdown Menu Item / Avatar leading, Double Line`), role menu (`Dropdown list item / Supporting Text=On` + Remove Access), people search (+ `Scroll bar`), invite view (`Input dropdown_outline / Tags` + role, `Checkbox`, `Textarea`, Copy Link / Cancel / Invite) | share-artifact 01-10; add-users 02-11; chat-artifact 09 | owner only; with members; role menu; Restricted / Everyone at UnifyApps / Anyone with the link (+ role); search; invite (chips, notify, message); multi-user | None. CSS atom ref: `components/audience-picker` (a different UX, same DS parts). | 4 |
| 56 | `CollaborativeBar` | `Collaborative chat-large / State=User Typing | Default, Users=Default | No | Max Users`, `Avatar group`, switch | collab 01-10; consecutive; queue-1; commenters | "X and Y are typing…"; "X and 12 others are typing"; idle hint "Type @ to mention a participant"; Assistant Replies on / off; avatar-stack popover | None | 4 |
| 57 | `MentionPicker` | `Input Menu Dropdown` (Assistant + participants, avatar leading, single line) + blue token in the composer + pill in the bubble | chat-artifact 10-13; collab 03-06 | full list; filtered by typing; hover; inserted token | None | 4 |
| 58 | `QueueCard` | `Text Queue Card` (Collapsed=No / Yes × State=In queue / Paused; 758 wide, or 408 in split), `Text / State=Default | Hover` (row: drag handle, 1-2 lines, thumbnail, ↑ send now, ⋯), `Pill solid` (count), `Small Icon Button / sm | md`, `Tooltip`, `Dropdown Menu / Small` (Edit, Copy, Remove; opens upward near the bottom) | queue-1 01-16 | in queue; paused (clear, resume); collapsed; 1, 2 and 4 items; with attachment | None | 4 |
| 59 | `CommentsPanel` | `comment panel` (400 in chat, 320 as a third column, 400 standalone "Trigger Panel"); `_Comment_Message Unit / Type=level 1 | level 2 | level 3+reply | Spacer top | Spacer between`; `Comment_Message Unit / Level=Level 1, Size=md` (newer); `Comment field / State=1 line typing, WYSIWYG=No | 2 or more Typing, WYSIWYG=Yes`; `_comment field / Property 1=switch off WYSIWYG | box height increase2 | empty state`; `comment box / Property 1=comment empty`; `ES Empty State / Level 2`; members chip + COMMENTERS dropdown | commenters 01-07, 09-10; loose c01-c09 | thread collapsed / expanded; "● 1 reply" unread; reply input; WYSIWYG toolbar on / off (Aa); empty state | None | 4 |

### 1G. Other pages (only the parts these journeys need)

| # | Component | Figma | Used in | States / variants | Exists today | W |
|---|---|---|---|---|---|---|
| 60 | Project page title pin + tooltip; project card kebab | `Dashboard`, `Project card 1 / Property 1=private | hover`, `Tooltip / Arrow=Top center` ("Pin Project" / "Unpin Project") | nav-behaviour 07-08; pinning 02 | pin unfilled / filled | React: Projects screens (shell workflow). `PageHeader` has `onPin` / `pinned`. | 5 |
| 61 | `RoutinesLanding` (stub) | `Routine Landing page` table (Name, Trigger, Cost last 30 days, Status) + row kebab (Unpin, Edit, Pause, Run Now, Share, Delete) | pinning 03 | pinned row | None | 5 |

**Total: 61 inventory rows.** Row 17 is never built, and rows 1, 5, 7 and 8 already exist in the shell work and only need extending.

---

## 2. Routes: one URL per captured step

### 2.1 Scheme

Routes live in the hash, as `src/router/router.ts` already does: `#/<path>?<state>`.

**Paths** (each one is a screen template):

| Path | Screen |
|---|---|
| `/new` | Landing / New Session |
| `/chat/:chat` | Chat |
| `/chat/:chat/:artifact` | Chat + artifact split (`full=1` expands the artifact over the chat) |
| `/artifacts` | Artifacts landing |
| `/artifacts/:artifact` | Artifact full view inside the shell (rail present) |
| `/view/:artifact` | Artifact standalone: no rail. Used for shared links, the editor full screen and the viewer gallery. |
| `/projects`, `/projects/:slug` | Projects (shell workflow) |
| `/routines` | Routines landing stub |
| `/gallery`, `/gallery/:sheet` | Component gallery and reference sheets |

**Fixtures.**
- Chats: `commit` ("How does commit actually look?"), `business-units`, `cost`, `new-artifact`, `new-routine`.
- Artifacts: `pipeline-command` (App / Interactive HTML), `blank-xls`, `acme-app`, `untitled-xls`, `untitled-doc`, `untitled-pdf`, `untitled-md`, `untitled-ppt`, `untitled-flow`, `document-json`, `reference-xls` (the long "all header icons for reference…" name), `q3-forecast`, `q3-forecast-clone`.
- People and pinned-item ids are defined in the fixtures (wave 1, agent 1.2).

**Query keys.** Canonical order is the order of this table. Ask the router owner to make `frameForRoute` compare the path plus *sorted* params and return *all* matches (contract ask in wave 1).

| Key | Meaning | Values |
|---|---|---|
| `seed` | data scenario flags from the fixtures (comma list) | `no-chips`, `budget-within`, `budget-approaching`, `budget-over`, `queries-10`, `monthly-out`, `usage-requested`, `memory`, `memory-sm`, `own-consecutive`, `typing-2`, `typing-matt`, `crowd`, `replies-off`, `comments-2/3/5`, `comments-unread`, `comments-none`, `queue-1/2/4`, `queue-paused`, `queue-collapsed`, `shared-2`, `access-workspace`, `access-link`, `invite-2`, `invite-5`, `notify`, `artifact-deleted`, `empty`, `all-types`, `cloned`, `publish-picked`, `publish-restricted`, `published`, `pins-over10`, `project-pinned`, `unpinned:<id>`, `order:<ids>` |
| `at` | conversation beat (chat routes) | commit: `sent`, `cot-1`, `cot-7`, `answer`, `joined`, `mention-sent`, `matt-replied`, `artifact`, `followup`, `question`. business-units: `sent`, `answer-1`, `sent-2`, `answer-2`. cost: `cot-3`, `answer`. new-artifact: `starters`. new-routine: `ready` |
| `role` | the viewer's access to an artifact | `editor` (default), `commenter`, `viewer` |
| `from` | where an artifact view was opened from (shows the back button) | `artifacts`, `chat` |
| `view`, `search` | artifacts landing | `view=grid` (default) or `list`; `search=open` |
| `cot`, `glyph` | presentation variants under review (Q25, Q26) | `cot=lines` or `sources`; `glyph=bare` |
| `compose` | chat composer preset | `commit-q`, `bu-q`, `insights`, `insights-enhancing`, `insights-enhanced`, `skill`, `at`, `at-m`, `mention-matt`, `queue-text`, `attach-loading`, `attach-ready` |
| `panel` | side panel | `files`, `files-grid`, `comments` |
| `open` | expanded disclosure | `pin:project`, `thread:1` |
| `comment` | canvas comment mode | `hover:<block>`, `compose:<block>` |
| `cbox`, `rbox` | comment field / reply field / canvas comment card preset | `one-line`, `long`, `plain`, `agent` |
| `menu` | the one open menu. `>` is a submenu path. `+` joins menus and is used only for composite review frames. | `title>add-to-project`, `version`, `name`, `name>versions`, `apps`, `download`, `chat-artifacts`, `account`, `pin:<id>`, `pin-chat:<id>>switch-project`, `card:<id>`, `row:<id>>add-to-project`, `queue:<n>`, `members`, `type-filter` |
| `pop` | open popover | `cost`, `cost.pinned`, `access`, `typing-people` |
| `modal` | open modal. `>` is a sub-view. | `share`, `share>role:<person>`, `share>access`, `share>access-role`, `share>search`, `share>invite`, `share>invite>role`; the same under `share-artifact`; `publish`, `publish>visibility`, `publish>restricted`, `publish>restricted>search`; `usage`; `delete:<id>`; `settings>memory` |
| `edit` | inline edit | `name` |
| `drag` | frozen drag gesture (review only) | `<id>:lift`, `<id>:over-1`, `<id>:out` |
| `hover` | pinned hover state (review only; real `:hover` works without it) | e.g. `send`, `stop`, `cost`, `title`, `card:<id>`, `artifact-name`, `enhance`, `queue:2>send-now` |
| `full`, `cw` | artifact expanded over the chat; chat column width in split (review only) | `full=1`; `cw=650` |
| `rail`, `nav` | pin the shell state. Applied to the `rail` / `navMode` stores on navigation (contract ask). | `rail=c` or `e`; `nav=light` |
| `vw` | review viewport width (the review bar renders the app at that width) | `787`, `1728` |
| `sheet` | gallery routes only: which reference sheet or state | e.g. `v2`, `modal`, `composer-states`, `default` |

**Kind** column in the tables below:
- **N**: a new screen (the path changes).
- **S**: the same screen with a UI-state change (query only).
- **T**: the same screen with time passing (scripted beat or data seed).
- **R**: responsive (viewport width).
- **G**: gallery / reference sheet.
- **A**: alias of another step's URL (same screen as drawn).

### 2.2 Step -> URL, by journey (Figma map order)

**nav-light** (light nav on the landing page)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 12829:289253 | N | `#/new?rail=c&nav=light` |
| 02 | 12829:292060 | S | `#/new?rail=e&nav=light` |
| 03 | 12829:296297 | S | `#/new?menu=account&rail=c&nav=light` |
| 04 | 12919:607703 | S | `#/new?menu=account&rail=e&nav=light` |

**logo-options**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 3612:167773 | N | `#/new?seed=no-chips&rail=c` |

**input-large** (captured in wave 1: 24 frames. Their URLs live in `input-large/journey.json`, which `tools/gen-frames.py` reads when this table is empty; the beat ids follow the commit script, `cot-N` = Agent COT Type=Step N.)

**nav-behaviour** (dark expanded rail on the landing page; steps 07-08 on a project page)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 11614:672894 | N | `#/new?seed=no-chips&rail=e` |
| 02 | 11614:676434 | S | `#/new?seed=no-chips&hover=pin:project&rail=e` |
| 03 | 11715:658763 | S | `#/new?seed=no-chips&open=pin:project&menu=pin:project&rail=e` |
| 04 | 11614:677973 | S | `#/new?seed=no-chips&open=pin:project&menu=pin-chat:excel-formula>switch-project&rail=e` |
| 05 | 11693:260033 | T | `#/new?seed=no-chips,pins-over10&open=pin:project&rail=e` |
| 06 | 11715:627268 | S | `#/new?seed=no-chips,pins-over10&open=pin:project&hover=pin:view-all&rail=e` |
| 07 | 13701:756891 | N | `#/projects/project-name?seed=pins-over10&open=pin:project&menu=row:c1>add-to-project&hover=title-pin&rail=e` |
| 08 | 11780:448662 | S | `#/projects/project-name?seed=pins-over10,project-pinned&open=pin:project&menu=row:c1>add-to-project&hover=title-pin&rail=e` |
| 09 | 11635:685715 | N | `#/new?seed=no-chips&menu=pin:artifacts&rail=e` |

**pinning**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 11648:688362 | N | `#/artifacts?menu=type-filter+card:q3-forecast+card:pinned-variant&rail=c` (composite frame: two menus and both card-menu variants at once) |
| 02 | 11657:386528 | N | `#/projects?menu=card:docebo-ui-assets&hover=menu:pin&rail=e` |
| 03 | 11657:493696 | N | `#/routines?menu=row:board-pre-read&rail=e` |

**pinned-chevron**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 11661:497681 | S | `#/new?seed=no-chips&hover=pin:project>folder&rail=e` |
| 02 | 11661:514386 | S | `#/new?seed=no-chips&open=pin:project&hover=pin:project>folder&rail=e` |

**drag-unpin**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 11671:666296 | S | `#/new?seed=no-chips&drag=plan-launch:out&rail=e` |
| 02 | 11671:670376 | T | `#/new?seed=no-chips,unpinned:plan-launch&hover=routine:plan-launch&rail=e` |

**drag-pinned**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 11661:517917 | S | `#/new?seed=no-chips&drag=project:lift&rail=e` |
| 02 | 11671:661281 | S | `#/new?seed=no-chips&drag=project:over-1&rail=e` |
| 03 | 11671:662888 | T | `#/new?seed=no-chips,order:artifacts.plan-launch.project.review-feedback&hover=pin:project&rail=e` |

**thinking**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 8863:220940 | T | `#/chat/commit?at=sent&glyph=bare&rail=c` |
| 02 | 10139:466731 | T | `#/chat/commit?at=sent&rail=c` |

**chat-artifact**

| Step | Node | Kind | URL | Note |
|---|---|---|---|---|
| 01 | 1707:136008 | N | `#/new?rail=c` | |
| 02 | 1707:139771 | S | `#/new?compose=commit-q&hover=send&rail=c` | same screen as 01 |
| 03 | 9256:466688 | N | `#/chat/commit?at=sent&menu=title>add-to-project&rail=c` | a side state; see Q27 |
| 04 | 1713:246600 | T | `#/chat/commit?at=cot-1&rail=c` | |
| 05 | 1713:249395 | T | `#/chat/commit?at=cot-7&rail=c` | |
| 06 | 4756:184104 | S | `#/chat/commit?at=cot-7&cot=lines&rail=c` | variant (Q26) |
| 07 | 4756:186919 | S | `#/chat/commit?at=cot-7&cot=sources&rail=c` | variant; 1440x1051 frame |
| 08 | 1809:501331 | T | `#/chat/commit?at=answer&rail=e` | |
| 08a | 5691:481950 | A | = 08 | pixel-identical |
| 09 | 1809:446980 | S | `#/chat/commit?at=answer&modal=share&rail=e` | add-users 02 is the same URL |
| 10 | 1731:255712 | T | `#/chat/commit?at=joined&compose=at&rail=c` | |
| 11 | 1731:338960 | S | `#/chat/commit?at=joined&compose=at-m&hover=mention:matt&rail=c` | |
| 12 | 1731:340363 | S | `#/chat/commit?at=joined&compose=mention-matt&rail=c` | |
| 13 | 1731:341539 | T | `#/chat/commit?at=mention-sent&rail=c` | |
| 14 | 3273:190223 | T | `#/chat/commit?at=matt-replied&rail=c` | |
| 15 | 1768:356654 | T | `#/chat/commit?at=artifact&pop=access&rail=c` | |
| 15a | 3211:70049 | G | `#/gallery/inline-artifact-cards` | reference sheet |
| 16 | 1809:363799 | S | `#/chat/commit?at=artifact&hover=card:pipeline-command&rail=c` | |
| 16a | 14876:285160 | G | `#/gallery/inline-artifact-cards?sheet=v2` | reference sheet |
| 17 | 5975:413714 | S | `#/chat/commit?at=artifact&panel=files&rail=c` | |
| 18 | 14607:403125 | S | `#/chat/commit?at=artifact&panel=files-grid&rail=c` | |
| 19 | 13722:383349 | N | `#/chat/commit/pipeline-command?at=artifact&panel=files&cw=650&rail=c` | Q8 |
| 20 | 1809:488480 | N | `#/chat/commit/pipeline-command?at=artifact&rail=c` | |
| 21 | 1795:359260 | S | `#/chat/commit/pipeline-command?at=artifact&menu=version&rail=c` | header-dropdowns c03 is the same URL |
| 21a | 6405:306202 | S | `#/chat/commit/pipeline-command?at=artifact&hover=artifact-name&rail=c` | |
| 21b | 6405:308388 | S | `#/chat/commit/pipeline-command?at=artifact&edit=name&rail=c` | |
| 22 | 1809:484624 | S | `#/chat/commit/pipeline-command?at=artifact&full=1&rail=c` | |

**share-artifact** (modal over the collaborative `commit` chat)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 1819:316164 | N | `#/chat/commit?seed=shared-2&at=joined&modal=share-artifact&rail=c` |
| 02 | 9256:470679 | S | `#/chat/commit?seed=shared-2&at=joined&modal=share-artifact>role:candice&rail=c` |
| 03 | 1819:316249 | S | `#/chat/commit?seed=shared-2&at=joined&modal=share-artifact>access&rail=c` |
| 04 | 1819:316290 | S | `#/chat/commit?seed=shared-2,access-workspace&at=joined&modal=share-artifact&hover=access-role&rail=c` |
| 05 | 1819:316329 | S | `#/chat/commit?seed=shared-2,access-workspace&at=joined&modal=share-artifact>access-role&rail=c` |
| 06 | 1819:316373 | S | `#/chat/commit?seed=shared-2,access-link&at=joined&modal=share-artifact&hover=invite&rail=c` |
| 07 | 1819:316429 | S | `#/chat/commit?seed=shared-2,access-link&at=joined&modal=share-artifact>search&hover=person:demi&rail=c` |
| 08 | 1819:316471 | S | `#/chat/commit?seed=shared-2,access-link,invite-2&at=joined&modal=share-artifact>invite&rail=c` |
| 09 | 12264:347642 | S | `#/chat/commit?seed=shared-2,access-link,invite-2&at=joined&modal=share-artifact>invite>role&rail=c` |
| 10 | 1819:316531 | S | `#/chat/commit?seed=shared-2,access-link,invite-5,notify&at=joined&modal=share-artifact>invite&hover=invite-btn&rail=c` |

**chat-questions**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 5873:530156 | N | `#/chat/commit/pipeline-command?at=question&hover=question:3&rail=c` |

**deleted-artifact**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 6944:511592 | N | `#/chat/commit/pipeline-command?seed=artifact-deleted&at=artifact&rail=c` |

**artifact-view-editor-main** (standalone, no rail)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 5310:276790 | N | `#/view/reference-xls?role=editor&menu=name>versions` |
| 02 | 7418:305665 | R | `#/view/reference-xls?role=editor&vw=787` |
| 03 | 7418:305917 | R | `#/view/reference-xls?role=editor&hover=artifact-name&vw=787` |

**graphs**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 2556:378637 | S | `#/new?hover=composer&rail=c` (same screen as chat-artifact 01) |
| 02 | 1707:126556 | S | `#/new?compose=bu-q&hover=send&rail=e` |
| 03 | 1707:125119 | N | `#/chat/business-units?at=sent&rail=c` |
| 04 | 1707:125400 | T | `#/chat/business-units?at=answer-1&rail=c` |
| 05 | 1707:125678 | T | `#/chat/business-units?at=sent-2&rail=c` |
| 06 | 1707:125957 | T | `#/chat/business-units?at=answer-2&rail=c` |

**artifact-view-viewer** (standalone; one artifact type per frame)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 3838:248160 | N | `#/view/acme-app?role=viewer` |
| 01a | 13155:271422 | S | `#/view/acme-app?role=viewer&hover=home` |
| 02 | 7767:266191 | N | `#/view/untitled-xls?role=viewer` |
| 03 | 7781:267087 | N | `#/view/untitled-doc?role=commenter` |
| 04 | 7781:267978 | N | `#/view/untitled-pdf?role=viewer` |
| 05 | 7781:268873 | N | `#/view/untitled-md?role=viewer` |
| 06 | 7781:269768 | N | `#/view/untitled-ppt?role=viewer` |
| 07 | 8771:210166 | N | `#/view/untitled-flow?role=viewer` |
| 08 | 10157:575625 | N | `#/view/document-json?role=viewer` |

**cost** (chat `cost`; the composer holds the skill-token prompt throughout)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 6802:235991 | N | `#/chat/cost?seed=budget-within&at=cot-3&compose=skill&rail=c` |
| 02 | 6802:236005 | T | `#/chat/cost?seed=budget-approaching&at=cot-3&compose=skill&rail=c` |
| 03 | 6802:236019 | T | `#/chat/cost?seed=budget-over&at=cot-3&compose=skill&rail=c` |
| 04 | 6802:236034 | T | `#/chat/cost?seed=budget-within&at=answer&compose=skill&pop=cost&hover=cost&rail=c` |
| 05 | 6802:236050 | T | `#/chat/cost?seed=budget-approaching,queries-10&at=answer&compose=skill&pop=cost&hover=cost&rail=c` |
| 06 | 6802:236066 | S | `#/chat/cost?seed=budget-over,queries-10&at=answer&compose=skill&pop=cost.pinned&hover=cost-row:1&rail=c` |
| 07 | 6802:236106 | T | `#/chat/cost?seed=monthly-out&at=cot-3&compose=skill&pop=cost&rail=c` |
| 08 | 6802:236145 | S | `#/chat/cost?seed=monthly-out&at=cot-3&compose=skill&modal=usage&rail=c` |
| 09 | 6802:236125 | T | `#/chat/cost?seed=monthly-out,usage-requested&at=cot-3&compose=skill&rail=c` |

**artifact-full-editor** (inside the shell, rail collapsed)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 7809:278865 | N | `#/artifacts/acme-app?from=artifacts&rail=c` |
| 01a | 13155:271308 | S | `#/artifacts/acme-app?from=artifacts&hover=back&rail=c` |
| 02 | 7809:273518 | N | `#/artifacts/untitled-xls?rail=c` |
| 02a | 12195:302725 | S | `#/artifacts/untitled-xls?from=artifacts&rail=c` |
| 03 | 7809:273526 | N | `#/artifacts/untitled-doc?rail=c` |
| 04 | 7809:273538 | N | `#/artifacts/untitled-pdf?rail=c` |
| 05 | 7809:273550 | N | `#/artifacts/untitled-md?rail=c` |
| 06 | 7809:273559 | N | `#/artifacts/untitled-ppt?rail=c` |

**enhance-prompt** (landing; the enhance button is part of the composer from now on, see Q28)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 10230:663810 | A | `#/new?rail=c` (= chat-artifact 01) |
| 02 | 10247:277018 | S | `#/new?compose=insights&rail=c` |
| 03 | 10247:282174 | S | `#/new?compose=insights&hover=enhance&rail=c` |
| 04 | 10247:280053 | T | `#/new?compose=insights-enhancing&rail=c` |
| 05 | 10247:286242 | T | `#/new?compose=insights-enhanced&rail=c` |

**new-memory**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 9915:762550 | T | `#/chat/commit?seed=memory&at=answer&rail=c` |
| 02 | 10112:411197 | S | `#/chat/commit?seed=memory-sm&at=answer&rail=c` (dimmed alternative, Q5) |
| 03 | 10112:408460 | N | `#/new?seed=no-chips&modal=settings>memory&rail=c` (as drawn: over the landing page; Q32 proposes the current chat) |

**artifacts-landing**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 3780:177209 | N | `#/artifacts?seed=empty&rail=c` |
| 02 | 7907:305055 | T | `#/artifacts?rail=c` |
| 03 | 12868:502599 | S | `#/artifacts?view=list&rail=c` |
| 04 | 8412:194488 | R | `#/artifacts?seed=all-types&search=open&rail=c&vw=1728` |
| 05 | 11648:688356 | S | `#/artifacts?menu=type-filter+card:q3-forecast+card:pinned-variant&hover=new-artifact&rail=c` (composite frame; pinning 01 is the same composite) |
| 06 | 12057:581131 | S | `#/artifacts?modal=delete:q3-forecast&rail=c` |
| 07 | 3780:177321 | N | `#/chat/new-artifact?at=starters&hover=starter:spreadsheet&rail=c` |
| 08 | 3780:178324 | N | `#/chat/commit/blank-xls?at=artifact&menu=apps&hover=apps:excel&rail=c` (as drawn; Q71 proposes the new-artifact chat) |
| c01 | 13750:280568 | G | `#/gallery/artifact-card-tints` |

**cloned-artifact**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 13750:280936 | T | `#/artifacts?seed=cloned&menu=card:q3-forecast&rail=c` (1440x1648 scrolled page) |
| 02 | 13750:301988 | N | `#/view/q3-forecast-clone?from=artifacts&menu=name` |
| 03 | 13750:302325 | S | `#/view/q3-forecast-clone?from=artifacts&edit=name` |

**publish-artifact** (the modals sit over step 01; order follows the spec's suggested flow)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 1990:517731 | N | `#/chat/new-routine/pipeline-command?at=ready&hover=publish&rail=c` |
| c01 | 1969:507322 | S | `#/chat/new-routine/pipeline-command?at=ready&modal=publish&rail=c` |
| c02 | 1969:507360 | S | `#/chat/new-routine/pipeline-command?at=ready&modal=publish>visibility&rail=c` |
| c04 | 11905:590138 | S | `#/chat/new-routine/pipeline-command?at=ready&modal=publish>visibility&hover=restricted&rail=c` |
| c05 | 11905:590328 | S | `#/chat/new-routine/pipeline-command?at=ready&modal=publish>restricted&rail=c` |
| c08 + c08a | 11905:590883 + 11919:591369 | S | `#/chat/new-routine/pipeline-command?seed=publish-picked&at=ready&modal=publish>restricted>search&rail=c` |
| c07 | 11905:590614 | S | `#/chat/new-routine/pipeline-command?seed=publish-picked&at=ready&modal=publish>restricted&rail=c` |
| c10 | 11933:736622 | S | `#/chat/new-routine/pipeline-command?seed=publish-picked&at=ready&modal=publish>restricted&hover=remove&rail=c` (alternative to c07; Q73) |
| c09 | 11933:736147 | S | `#/chat/new-routine/pipeline-command?seed=publish-restricted&at=ready&modal=publish&hover=publish-btn&rail=c` |
| c11 | 11933:737092 | T | `#/chat/new-routine/pipeline-command?seed=published,publish-restricted&at=ready&modal=publish&hover=publish-btn&rail=c` |
| c03 | 11933:737342 | S | `#/chat/new-routine/pipeline-command?seed=published,publish-restricted&at=ready&modal=publish>visibility&rail=c` |
| c06 | 11933:737464 | S | `#/chat/new-routine/pipeline-command?seed=published,publish-restricted&at=ready&modal=publish>restricted&rail=c` |
| c12 | 11905:589839 | - | not built (designer changelog card, not product UI) |

**canvas-comments** (on the Pipeline Command artifact in the split; Q61)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 1969:507489 | S | `#/chat/commit/pipeline-command?at=artifact&comment=hover:commit-para&rail=c` |
| 02 | 1969:507495 | S | `#/chat/commit/pipeline-command?at=artifact&comment=compose:commit-para&cbox=agent&rail=c` |
| 03 | 1969:507503 | G | `#/gallery/canvas-comment?sheet=composer-states` |
| 04 | 1969:507512 | G | `#/gallery/canvas-comment?sheet=modal` (dimmed alternative; Q59) |
| c01 | 1969:507502 | G | `#/gallery/canvas-comment` |

**header-dropdowns** (component units; each is shown in context)

| Unit | Node | Kind | URL |
|---|---|---|---|
| c01 | 1969:507290 | A | = artifacts-landing 08 (`menu=apps`) |
| c02 | 1969:507305 | S | `#/chat/commit/pipeline-command?at=artifact&menu=download&rail=c` |
| c03 | 9200:349032 | A | = chat-artifact 21 |
| c04 | 6077:427693 | A | = chat-artifact 15 |
| c05 | 6077:427694 | S | `#/chat/commit?at=artifact&menu=chat-artifacts&rail=c` (trigger unknown; Q74) |
| c06 | 6077:427818 | G | `#/gallery/chat-header?sheet=default` |
| c07 | 6077:427883 | S | `#/chat/commit?at=artifact&hover=title&rail=c` |

**add-users** (Share Chat over the solo `commit` chat, rail expanded)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 7830:279834 | A | `#/chat/commit?at=answer&rail=e` (= chat-artifact 08) |
| 02 | 9256:468119 | A | `#/chat/commit?at=answer&modal=share&rail=e` (= chat-artifact 09) |
| 03 | 12025:773344 | T | `#/chat/commit?seed=shared-2&at=answer&modal=share&rail=e` |
| 04 | 12025:774906 | S | `#/chat/commit?seed=shared-2&at=answer&modal=share&hover=role:candice&rail=e` |
| 05 | 12025:776507 | S | `#/chat/commit?seed=shared-2&at=answer&modal=share>access&rail=e` |
| 06 | 12025:779849 | S | `#/chat/commit?seed=shared-2,access-workspace&at=answer&modal=share&hover=access-role&rail=e` |
| 07 | 12025:778160 | S | `#/chat/commit?seed=shared-2,access-workspace&at=answer&modal=share>access-role&rail=e` |
| 08 | 12025:781497 | S | `#/chat/commit?seed=shared-2,access-link&at=answer&modal=share&hover=invite&rail=e` |
| 09 | 12025:783146 | S | `#/chat/commit?seed=shared-2,access-link&at=answer&modal=share>search&hover=person:demi&rail=e` |
| 10 | 12025:784845 | S | `#/chat/commit?seed=shared-2,access-link,invite-2&at=answer&modal=share>invite>role&rail=e` |
| 11 | 12025:786818 | S | `#/chat/commit?seed=shared-2,access-link,invite-5,notify&at=answer&modal=share>invite&hover=invite-btn&rail=e` |

**collab-chat**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 7830:279836 | T | `#/chat/commit?seed=typing-2&at=joined&rail=c` |
| 02 | 8202:477546 | S | `#/chat/commit?seed=typing-2,replies-off&at=joined&rail=c` |
| 03 | 8202:478758 | S | `#/chat/commit?seed=typing-2,replies-off&at=joined&compose=at&rail=c` |
| 04 | 8215:480023 | S | `#/chat/commit?seed=typing-2,replies-off&at=joined&compose=at-m&hover=mention:matt&rail=c` |
| 05 | 8215:481631 | S | `#/chat/commit?seed=typing-2,replies-off&at=joined&compose=mention-matt&rail=c` |
| 06 | 8222:482896 | T | `#/chat/commit?seed=typing-matt,replies-off&at=mention-sent&rail=c` |
| 07 | 8222:485711 | T | `#/chat/commit?seed=typing-matt&at=matt-replied&rail=c` |
| 08 | 8222:488552 | T | `#/chat/commit?at=artifact&rail=c` |
| 09 | 8222:490604 | S | `#/chat/commit?seed=crowd&at=artifact&pop=typing-people&rail=c` |
| 10 | 8222:494135 | T | `#/chat/commit?seed=typing-2,comments-2&at=artifact&hover=comments&rail=c` |

**commenters** (build only if Q4 says yes; build against `commenters/opaque/`)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 8279:195355 | S | `#/chat/commit?seed=crowd,comments-3&at=artifact&panel=comments&cbox=long&rail=c` |
| 02 | 8279:198079 | S | `#/chat/commit?seed=crowd,comments-3&at=artifact&panel=comments&cbox=one-line&rail=c` |
| 03 | 8279:200361 | A | = 01 (identical panel, different chat scroll; Q52) |
| 04 | 8279:209548 | S | `#/chat/commit?seed=crowd,comments-5&at=artifact&panel=comments&open=thread:1&cbox=plain&menu=members&rail=c` |
| 05 | 8279:215077 | N | `#/chat/commit/pipeline-command?seed=comments-unread&at=followup&hover=comments&rail=c` |
| 06 | 8279:217929 | S | `#/chat/commit/pipeline-command?seed=comments-3&at=followup&panel=comments&cbox=long&rail=c` |
| 07 | 8279:220537 | N | `#/artifacts/acme-app?seed=comments-none&role=commenter&panel=comments&rail=c` |
| 08 | 8085:469369 | - | section card, no screen |
| 09 | 8085:469355 | N | `#/view/acme-app?role=commenter` |
| 10 | 8085:469620 | S | `#/view/acme-app?seed=comments-3&role=commenter&panel=comments` |
| c01 | 8279:213062 | A | part of 04 (`menu=members`) |
| c02 | 13618:434935 | S | `#/chat/commit?seed=crowd,comments-3&at=artifact&panel=comments&rail=c` |
| c03 | 10767:620481 | T | `#/chat/commit?seed=crowd,comments-3,thread-read&at=artifact&panel=comments&rail=c` |
| c04 | 10793:372495 | S | `#/chat/commit?seed=crowd,comments-3,thread-read&at=artifact&panel=comments&hover=thread:1>replies&rail=c` |
| c05 | 10767:620480 | S | `#/chat/commit?seed=crowd,comments-3,thread-read&at=artifact&panel=comments&open=thread:1&rail=c` |
| c06 | 10767:620483 | S | `#/chat/commit?seed=crowd,comments-3,thread-read&at=artifact&panel=comments&open=thread:1&rbox=one-line&rail=c` |
| c07 | 10767:620484 | S | `#/chat/commit?seed=crowd,comments-3,thread-read&at=artifact&panel=comments&open=thread:1&rbox=long&rail=c` |
| c08 | 10767:620485 | T | `#/chat/commit?seed=crowd,comments-4-replied&at=artifact&panel=comments&open=thread:1&hover=reply:2&rail=c` |
| c09 | 10767:620486 | T | `#/chat/commit?seed=crowd,comments-4-short&at=artifact&panel=comments&open=thread:1&rail=c` |

**queue-1** (the `commit` chat while the Assistant thinks after Matt's @Assistant)

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 8222:498555 | T | `#/chat/commit?at=matt-replied&hover=stop&rail=c` |
| 02 | 8237:502068 | S | `#/chat/commit?at=matt-replied&compose=queue-text&hover=queue-add&rail=c` |
| 03 | 8237:503500 | S | `#/chat/commit?seed=queue-1&at=matt-replied&rail=c` |
| 04 | 8255:522209 | S | `#/chat/commit?seed=queue-1&at=matt-replied&compose=attach-loading&rail=c` |
| 05 | 8237:500570 | T | `#/chat/commit?seed=queue-1&at=matt-replied&compose=attach-ready&rail=c` |
| 06 | 8237:505695 | S | `#/chat/commit?seed=queue-2&at=matt-replied&rail=c` |
| 07 | 8255:508680 | S | `#/chat/commit?seed=queue-2&at=matt-replied&hover=queue:2>send-now&rail=c` |
| 08 | 8255:510294 | S | `#/chat/commit?seed=queue-2&at=matt-replied&menu=queue:1&rail=c` |
| 09 | 8255:520722 | S | `#/chat/commit?seed=queue-2&at=matt-replied&menu=queue:2&rail=c` |
| 10 | 8255:512773 | S | `#/chat/commit?seed=queue-2&at=matt-replied&hover=queue>pause&rail=c` |
| 11 | 8255:514316 | S | `#/chat/commit?seed=queue-2,queue-paused&at=matt-replied&hover=queue>resume&rail=c` |
| 12 | 8255:515827 | S | `#/chat/commit?seed=queue-2,queue-paused&at=matt-replied&hover=queue>clear&rail=c` |
| 13 | 8255:517909 | S | `#/chat/commit?seed=queue-2,queue-paused&at=matt-replied&hover=queue>collapse&rail=c` |
| 14 | 8255:519307 | S | `#/chat/commit?seed=queue-2,queue-paused,queue-collapsed&at=matt-replied&hover=queue>expand&rail=c` |
| 15 | 8255:524125 | S | `#/chat/commit?seed=queue-4,queue-paused&at=matt-replied&rail=c` |
| 16 | 8451:366278 | N | `#/chat/commit/pipeline-command?seed=queue-4,typing-2,comments-unread&at=followup&hover=queue:2&rail=c` |

**consecutive**

| Step | Node | Kind | URL |
|---|---|---|---|
| 01 | 11633:344632 | S | `#/chat/commit?seed=own-consecutive&at=matt-replied&hover=msg:own&rail=c` |

### 2.3 What is the same screen

- **Landing `/new`** carries 29 steps across nav-light, logo-options, nav-behaviour 01-06 and 09, pinned-chevron, drag-unpin, drag-pinned, chat-artifact 01-02, graphs 01-02, enhance-prompt and new-memory 03. Every one of them is a query change (rail, menus, composer preset, drag) on one screen.
- **`/chat/commit`** carries 80 steps: thinking, chat-artifact 03-18, share-artifact, add-users, collab-chat, consecutive, queue-1 01-15, commenters 01-04 and c02-c09, new-memory 01-02, and header-dropdowns c05 and c07. It is one screen whose content moves through 10 beats (`at`). Everything else is overlays and seeds.
- **`/chat/commit/pipeline-command`** (split) carries 14 steps: chat-artifact 19-22, chat-questions, deleted-artifact, canvas-comments 01-02, commenters 05-06, queue-1 16 and header-dropdowns c02.
- In total the tables hold 202 step rows (2 are not built), 194 URLs and **191 distinct canonical URLs**. By kind: 42 N, 101 S, 38 T, 3 R, 7 G and 9 A.
- **`/chat/business-units`** (graphs 03-06), **`/chat/cost`** (all 9 cost steps) and **`/chat/new-routine/pipeline-command`** (all 13 publish states) are each a single screen with time or state changes.
- Steps that move to a different screen template are 01→03 in chat-artifact, 18→19, nav-behaviour 06→07, artifacts-landing 06→07→08, and cloned 01→02. The artifact-type galleries (viewer, full editor) are separate entries, not click paths.

---

## 3. Interactions: the clickable path through each journey

Notation: `step -> control -> next step`. "Gap" means Figma shows no next state. For a gap we build the smallest sensible behaviour (a close, a return or a toast) and log it as a proposed fix, so the designers can see and approve it.

**Global (on every screen):**
- Rail rows navigate.
- The rail logo expands the rail; the layout-left icon collapses it.
- The account avatar opens the account menu.
- The chat-title chevron opens the title menu.
- Header Share opens the share modal; files opens the files panel; comments opens the comments panel; the cost pill opens the cost popover on hover and pins it on click.
- Esc closes the top-most overlay.
- The review bar moves between steps of the current journey (prev / next) and links the Figma frame.

**chat-artifact**
- 01 → type in the composer → 02 (Send appears). The placeholder rotates while the composer is empty.
- 02 → Send or Enter → `/chat/commit` at `sent` (thinking) → auto-plays 04 (after 4s) → 05 (each step 2.5s apart) → 08 (answer). On the stepper, 06 and 07 are variant toggles (Q26).
- 03 is reachable at any beat: title chevron → menu; hover "Add to Project" → submenu with search.
  - Menu items: View files in Chat → 17. Pin Chat → item added to rail Pinned.
  - **Gap:** Rename (we reuse the artifact inline rename from 21b), Add to Project result, Archive, and Delete (we reuse the Delete Artifact confirm from artifacts-landing 06).
- 04, 05 → COT header chevron collapses / expands the thoughts. Hovering a thought changes its text colour only.
- 08 → Share → 09.
- 09 → Restricted → access menu (share flow). Invite field → people search. X → 08.
  - **Gap:** no post-invite frame. We return to the access list with a toast, then the chat shows the "joined" line, which is step 10.
- 10 → type "@" → mention list. Type "m" → 11. Click Matt → 12 (token inserted). Enter → 13.
- 13 → scripted: Matt replies and tags @Assistant (14) → Assistant answers with an artifact card; John and Grace post (15).
- 15 → hover the avatar stack → access popover. **Gap:** whether the popover offers "Manage access" (Q75).
- 16 → hover the card → hover state; click the card → 20. Download → **gap** (we show a toast).
- 17 → files icon → panel. Grid toggle → 18.
  - File row hover shows the download icon. Artifact row click → 20 (**gap**: not drawn).
  - Click outside the panel closes it.
- 20 → in the split view:
  - Drag the handle to resize. Files → 19 (dropdown at a fixed 720 height). v3 → 21. Name hover → 21a. Name click → 21b.
  - Expand → 22. Close → back to the chat. Publish → publish c01. Comment split → commenters 06. Download → Download Dropdown (header-dropdowns c02).
  - **Gap:** Copy, Refresh, and the rename commit / cancel (we use Enter / Esc).
- 22 → collapse → 20; close → the chat.

**thinking** — no clicks. 01 and 02 are timed beats (Q25).

**logo-options** — static landing with the rotating placeholder. **Gap:** logo idle motion (Q24).

**chat-questions**
- Reached when the agent asks a question in the split (beat `question`).
- Option row hover / click; keys 1-4; free-text field with Enter; Skip; X.
- **Gap:** everything after an answer (Q29).

**deleted-artifact** — clicking the card of a deleted artifact → empty state. X → the chat. **Gap:** "Recreate the Artifact" (Q69).

**graphs**
- 01 → click the composer → type → 02 → Send → 03 → auto → 04.
- Follow-up in the bottom composer → 05 → auto → 06.
- **Gap:** chart hover and legend toggles (Q30). Rail expand / collapse (Q9).

**cost**
- 01 → 02 → 03: spend ticks up while the agent works. On the review stepper it is a seed change.
- Hover the cost pill → 04 or 05. Click → 06 (pinned; row hover).
- When monthly usage is out → 07 → "Request more" → 08 → Send → 09. Cancel or X → 07.
- **Gaps:** approval / denial of the request, dismissing the pending card, and the composer behaviour when out (Q37).

**enhance-prompt**
- Type 3 or more words → 02. Hover the sparkle → 03. Click → 04 (about 1.2s) → 05.
- **Gaps:** Stop in 04 (we restore the original text), and re-enabling after an edit (Q28).

**new-memory**
- After the answer → 01 (memory bar). "View Memory ↗" → 03. X on the bar → dismiss. Modal X → back.
- **Gaps:** the memory toggle, Start Import, the bottom input, and the full Settings flow (Q32).

**consecutive** — hover an own message → copy + edit. Copy → toast. **Gap:** edit (we load the text into the composer).

**nav-light**
- Collapsed: logo → 02 (expand). Layout-left → 01. Avatar → 03 or 04.
- Notifications → the Notifications panel (port from `prototypes/notification-flow`). Settings → the Settings modal (Memory pane from new-memory).
- **Gap:** Log Out.

**nav-behaviour**
- 01 → hover pinned project → 02. Click → expand (03). ⋯ → menu (03).
  - Menu: Unpin removes the row. Move Down reorders.
  - **Gaps:** Edit Project, Share Project (we reuse the share modal), and Delete (we reuse the confirm modal).
- Hover a chat inside the project → ⋯ → chat menu → hover Switch Project → 04 (search and pick).
- With more than 10 chats → 05 → hover View All → 06 → click → 07 (project page; Q17).
- 07 → title pin → 08 (tooltip text flips). Row kebab → menu → Add to Project submenu.
- 09 → pinned Artifacts ⋯ → Unpin / Move Up / Move Down / Download / Delete.

**pinning**
- 01: Artifacts card ⋯ → Pin or Unpin; the rail Pinned group updates.
- 02: Projects card ⋯ → Pin.
- 03: Routines row ⋯ → Unpin.
- **Gap:** the order of new pins (Q19).

**pinned-chevron** — hover the folder icon → 01 (chevron). Click → 02 (expanded). Click again → collapse.

**drag-unpin / drag-pinned**
- Pointer drag: lift (drag-pinned 01) → over (02) → drop (03).
- Drag out of Pinned → "Release to unpin" (drag-unpin 01) → release → 02.
- Keyboard alternative: the Move Up / Move Down / Unpin menu items.

**share-artifact / add-users** (the same modal; artifact and chat flavours)
- Role button → role menu (share 02); pick Commenter / Editor / Remove Access.
- Restricted → access menu (03) → Everyone at UnifyApps (04) → its role button (05) → Anyone with the link (06).
- Invite field → people search (07) → pick → invite view (08) → role selector (09) → more chips, Notify, message (10) → Invite.
- Back arrow → access list. Cancel → close. Copy Link → toast.
- **Gap:** after Invite (Q39).
- In add-users the order is 01 → 02 → 09 → 10 → 11 → Invite → 03 (members listed) → hover role (04) → 05-08 (Q44).

**collab-chat**
- Assistant Replies toggle: 01 ↔ 02.
- "@" → 03 → "m" → 04 → pick → 05 → Enter → 06.
- Scripted: Matt posts → 07 → Assistant answers → 08.
- Crowd scenario → 09 (hover the bar's avatar stack → popover).
- 10 → comments icon → commenters 01.

**queue-1**
- 01: hover Stop → tooltip. Stop → stops generation (**gap**: no frame).
- Type → 02 (queue button). Click it or press Enter → 03.
- "+" → attach → 04 (uploading) → 05 (ready) → queue → 06.
- Row hover → 07. Send now → **gap** (Q49). Row ⋯ → 08 / 09: Edit (**gap**, Q50), Copy (toast), Remove.
- Pause → 11. Resume → back to in-queue. Clear (12) → empties the queue (**gap**: confirm?). Collapse (13) → 14. Expand → 15.
- Open the artifact → 16 (narrow queue).
- **Gaps:** dispatch when generation ends, and drag reorder (Q49, Q50).

**commenters**
- Comments icon → 01. Type one line → 02 → wraps → 03 (toolbar). Aa toggles the toolbar.
- Members chip → dropdown (04). "1 reply" → c05 → reply (c06 → c07) → send → c08 / c09.
- Inline card → 05 (split). Comments icon → 06 (three columns).
- Commenter opens a shared artifact → 07 (empty).
- Shared link → 09 → comment button → 10.
- **Gaps:** resolve, delete comment, and send feedback.

**artifact-view-editor-main**
- Name chevron → menu → hover Versions → 01.
  - Rename → inline (cloned 03 pattern). Clone → cloned 01. Delete → confirm → deleted state.
- Window narrower than about 900 → 02. Hover the truncated name → 03.
- Edit with Chat → **gap** (which chat? We open the source chat in split). Excel chevron → Apps Dropdown. Publish → publish c01.

**artifact-view-viewer**
- Home → **gap** (we go to the landing page).
- Comments split (doc, commenter) → comments panel.
- Download → toast.
- Name chevron on xls → **gap** (Q65).

**artifact-full-editor**
- Back → the previous page. Edit with Chat → the chat split. v3 → version history.
- Collapse → the chat split (Q67). Close → artifacts landing.

**artifacts-landing**
- New Artifact: hover → tooltip; click → 07. Pick a starter → 08. Excel chevron → Apps Dropdown.
- Filters and views: tabs filter data (Q70). Search icon → 04. All Types → type menu (05). Newest → sort menu (**gap**: no menu drawn). Grid / list → 02 ↔ 03.
- Card click → full view (Q6). Card ⋯ → menu (05):
  - Pin / Unpin; Edit with Chat → split; Clone → cloned 01; Share → share-artifact; Delete → 06 → card removed + Undo toast (**gap**).
  - **Gap:** Download.
- The empty state's button → 07.

**cloned-artifact**
- Clone → 01 (card appears). Click it → 02. Name chevron → Rename → 03 (Enter / Esc).
- **Gap:** Start Chat (we open a new chat with the artifact in split).

**publish-artifact**
- First time: 01 → Publish → c01 → VISIBLE TO → c02 → hover Restricted (c04) → c05 → type → c08 + c08a → pick → c07 → Done → c09 → Publish → **gap** (Q73).
- Second time: Publish → c11 → c03 → c06 (who has access). Unpublish → **gap**.
- Copy URL → toast.

**canvas-comments**
- Comment mode (entry **gap**, Q58) → hover an element → 01 → click → 02 → type (03 states) → send → **gap** (Q60).

**header-dropdowns** — each unit opens from its header control (see section 2). **Gap:** the trigger for c05 (Q74).

---

## 4. Build order in waves

Each wave is 5 agents of work (one agent is about one focused session). A wave finishes when, for every step it unlocks:
- the URL in section 2 is registered in `FRAMES`;
- the screen is diffed against its PNG at the frame's size;
- component roots carry `data-node-id`;
- every deliberate departure is a `FIXES` entry.

`npm run build` and `tools/verify.sh` must pass.

**Prerequisite.** The shell workflow has merged Nav / Rail, Breadcrumb, Composer, DropdownMenu, buttons and the Projects screens.

**Contract asks to that workflow.** These are small changes to code it owns. We send them as requests, not edits:
1. `frameForRoute` compares path + sorted query and returns all matches.
2. Hash params `rail` / `nav` set the `rail` / `navMode` stores on navigation.
3. `Composer` accepts slots / props for the left chips, trailing actions, the token renderer and the state (`default | generating | loading`).
4. `Nav` takes its pinned / routines / chats lists from props or a store instead of hard-coded JSX.
5. `DropdownItem` gains `description`, `selected`, `shortcut`, a `leading` node and a header row.

### Wave 1: Runtime and shared primitives (5 agents)

| Agent | Builds | Inventory rows |
|---|---|---|
| 1.1 | **Runtime and review harness.** `useUiParam` (read and write the query keys in 2.1); a canonical URL builder; `FRAMES` generated from every `journey.json` (about 200 entries, aliases included); review bar: journey / step stepper in Figma order, a Figma link for every matching frame, viewport presets (1440, 1280, 1024, 787, 390); `/gallery` index route. | - |
| 1.2 | **Fixtures and scripted playback.** People directory (one persona per Q1); chat scripts as beat lists (`commit`, `business-units`, `cost`, `new-artifact`, `new-routine`); a beat player using the Figma timings (thinking 0.8s loop, COT 4s then 2.5s per step); `at=` renders a beat instantly with no animation; seed registry; artifact catalog (types, names, versions, files); comments, queue items, cost queries, pinned items. | - |
| 1.3 | **Overlays.** Modal (unit, header with back, actions variants, 25% scrim, focus trap, Esc); Tooltip (4 arrows, shortcut chips); anchored Popover (reusing `placement.ts`); Toast (for the gaps). | 9, 12 |
| 1.4 | **Form and people primitives.** Avatar, AvatarGroup, Pill / CodePill / Tag / Dot, Checkbox, Switch, ToggleGroup, Input field, Textarea, Tags field (chips), OptionMenu (avatar-leading single / double line, section label, trailing role, scroll), EmptyState L1 / L2, scrollbar CSS; the `DropdownItem` additions (via the contract ask, or a wrapper until it lands). | 7, 10, 11, 13, 14, 15, 16 |
| 1.5 | **Composer extensions.** Landing / Bottom small / Bottom large; chips on / off; Send / Stop / Queue with states and tooltips; skill token; mention trigger + token (emits the caret position for the picker); attachment thumbnails (loading / ready / remove); rotating placeholder; enhance slot. **Also captures the missing `input-large` row** (24 frames) through the figma-console bridge and writes its spec in this folder. | 5, 6, 8 |

Unlocks: nothing end-to-end yet. Gallery pages for each primitive.

### Wave 2: Chat core (5 agents)

| Agent | Builds | Inventory rows |
|---|---|---|
| 2.1 | Landing page (greeting, dots mark, banner carousel, feature banners); send → chat transition; ChatScreen layout; ChatHeader with every control and badge; title menu with the Add to Project submenu. | 4, 18, 19, 21, 36 |
| 2.2 | UserMessage (own / participant, grouping and spacing from `consecutive`, hover actions, mention pill); SystemLine; TypingIndicator; AssistantResponse (rich text, citation pill, source pills); FeedbackRow; SuggestedActions. | 22-26, 29 |
| 2.3 | ThinkingIndicator; ChainOfThought (Step 1-7 with sources card, 1-line, collapsed, hover); QuestionCard component (wired in wave 3). | 27, 28, 31 |
| 2.4 | InlineArtifactCard (10 types, all states) + `/gallery/inline-artifact-cards`; charts (KPI tiles, sunburst or bubble per Q30, combo bar + line). Load the `dataviz` skill first. | 30, 32 |
| 2.5 | Cost pill rings + CostPopover (every state) + RequestUsageModal + StatusCard; FilesPanel (floating; list / grid); MemoryUpdateBar + SettingsMemoryModal; EnhancePrompt flow. | 20, 33-35, 37, 38, 40 |

Unlocks: logo-options, thinking, chat-artifact 01-18, graphs, cost, enhance-prompt, new-memory, consecutive (without the collaborative bar).

### Wave 3: Artifacts (5 agents)

| Agent | Builds | Inventory rows |
|---|---|---|
| 3.1 | SplitView: open from the inline card or files panel; resizable divider (min chat 360, max 650); expand / collapse / close; narrow chat rules; files dropdown at a fixed 720; QuestionCard above the composer. | 42 |
| 3.2 | ArtifactHeader in every variant (split, in-shell full, standalone editor, viewer, commenter, clone with "Start Chat"; 787 compaction + truncation tooltip); name menu + inline rename; VersionHistory; Apps / Download dropdowns; Excel split; ChatArtifactsMenu. | 41, 43-45 |
| 3.3 | ArtifactCanvas sample content per type (Q68); DeletedArtifact + Recreate; the `/view/:artifact` standalone route with Home and back. | 46, 47 |
| 3.4 | ArtifactsLanding (header + tooltip, filter frame, search expand, type filter, sort, grid / list), ArtifactCard, ArtifactsTable, empty state, ConfirmDeleteModal + Undo toast, clone flow, New Artifact chat + ArtifactStarters → split. | 48-52 |
| 3.5 | PublishModal (first and second time, visibility, restricted, add people, who has access, unpublish) + the published header state. | 53 |

Unlocks: chat-artifact 19-22, chat-questions, deleted-artifact, artifact-view-editor-main, artifact-view-viewer, artifact-full-editor, artifacts-landing, cloned-artifact, publish-artifact, header-dropdowns.

### Wave 4: Collaboration (5 agents)

| Agent | Builds | Inventory rows |
|---|---|---|
| 4.1 | ShareModal (chat + artifact): access list, role menus, general access + role, people search, invite view, multi-user, post-invite → "joined" line. | 55 |
| 4.2 | CollaborativeBar (typing states, avatar stack + popover, Assistant Replies behaviour); MentionPicker; scripted participant turns; AccessPopover; comments badge. | 39, 56, 57 |
| 4.3 | QueueCard (758 / 408; add, attachments, row hover, send now, item menu, pause / resume / clear / collapse) + the composer's queue mode. | 58 |
| 4.4 | CommentsPanel in its 3 placements; threads, replies, members dropdown, comment field states, empty state (only if Q4 says build). | 59 |
| 4.5 | CanvasComments (comment mode, hover / select outlines, pins, composer card states, @agent routing per Q59). | 54 |

Unlocks: share-artifact, add-users, collab-chat, chat-artifact 09-16 (collaborative version), queue-1, commenters, canvas-comments.

### Wave 5: Navigation, pinning, responsive, QA (5 agents)

This wave depends only on wave 1 and the shell. If there is spare capacity it can run in parallel with waves 2-4.

| Agent | Builds | Inventory rows |
|---|---|---|
| 5.1 | Pinned model in a store; rail rendered from it; hover affordances (per Q13); expandable project (cap 10 + View All); statuses; project / artifact / chat menus incl. Switch Project. | 3 |
| 5.2 | Drag and drop: reorder within Pinned (lift, 5% alpha rows below), drag out to unpin with the tooltip, return to the home group; keyboard alternative. | 3 |
| 5.3 | Pin entry points: artifacts card menu; projects card + project title pin + tooltip; Routines stub + row menu; AccountMenu in both widths + the Notifications panel ported from `prototypes/notification-flow`. | 2, 60, 61 |
| 5.4 | Responsive pass for all 10 screen templates (Appendix B) and mobile proposals at 390 in `/gallery/mobile`. | - |
| 5.5 | QA: headless diff of every `FRAMES` URL against its PNG; triage each mismatch into a fix or a bug; keyboard and a11y pass; the single-file `dist/eb-app.html` build. | - |

Unlocks: nav-light, nav-behaviour, pinning, pinned-chevron, drag-unpin, drag-pinned, plus the cross-journey QA sign-off.

---

## 5. Open questions

> **Decisions (2026-10-08):** the user answered "defaults OK" to the blocking questions Q1-Q9. Every other question in section 5 also takes its proposed default unless the user later says otherwise.

Each question has a proposed default. Answer with "defaults OK" plus the numbers you want changed. **[W1]** to **[W5]** marks the wave a question blocks. Links go to the frame in Figma.

### Blocking

- **Q1 [W1] Who is the signed-in user?**
  - The landing page says "Hello Roger". The nav footer says Anurag Kashyap. The share modal owner is Lana Steiner. The access list says "Roger Bennett (You)". The comments panel says "Anuj Mittal (You)" or "Chaaya Warrior(You)".
  - *Default:* Roger Bennett everywhere, including the nav footer. The other names become colleagues.
  - Frames: [landing](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136008) · [share](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-446980) · [access list](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1768-356654) · [comments](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-209548)
- **Q2 [W1] Can each chat follow one coherent script?**
  - The frames drift in copy. Examples: the typed message vs the sent message (chat-artifact 12 vs 13); Grace's text (15 vs 16); the queued text (queue 02 vs 03); the cost query "hi"; the cost 09 title; the split panel named "Untitled.xls" for the "Pipeline Command" card; artifacts-landing 08 showing a different chat.
  - *Default:* yes. Each change is logged as a fix with before / after.
  - Frames: [12](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-340363) · [13](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-341539) · [20](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-488480)
- **Q3 [W2] Does the newer collaborative design replace the older one?**
  - chat-artifact 10-16 has no collaborative bar and uses an older typing indicator. collab-chat has the bar and the "Queue follow-up…" placeholder.
  - *Default:* the collab-chat design wins everywhere.
  - Frames: [chat-artifact 13](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1731-341539) · [collab 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7830-279836)
- **Q4 [W4] Is the "Comments for commenters only" row live?** Every node in it is at 30% opacity.
  - *Default:* build it, because it is the only comments-panel spec. The review bar marks it "parked?".
  - [Row card](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-198075)
- **Q5 [W2] What do we do with the other dimmed frames?**
  - *Default:*
    - Cost 07 (30%) and 08 (40%): build them; they complete the flow.
    - Small memory bar (20%): rejected; we use md.
    - "What should change?" canvas modal (30%): rejected; we use the @agent card.
  - Frames: [cost 07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236106) · [cost 08](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236145) · [memory 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-411197) · [canvas 04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507512)
- **Q6 [W3] When an artifact is opened from the Artifacts list, does it keep the rail?**
  - Option A: [with rail](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865). Option B: [full screen, no rail](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5310-276790).
  - *Default:* keep the rail for people inside the app. No rail only for shared links.
- **Q7 [W3] Which artifact-header icon set applies in each context?**
  - The sets in the file are:
    - [split 20](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-488480): preview / code, copy, v3, Publish, comment, download, expand, close.
    - [split 21](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1795-359260): copy, refresh, v3, …
    - [publish 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1990-517731) (Form Header): refresh, add comment, download, v3, Publish, expand, close.
    - [full screen](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5310-276790): every icon.
  - *Default:* the full-screen frame is the superset. The split shows copy, refresh, v3, Publish, comment, download, expand and close. Preview / code appears only for App / HTML artifacts.
- **Q8 [W3] What is the default chat-column width in the split?**
  - It is about 440 in most frames and 650 in [chat-artifact 19](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13722-383349).
  - *Default:* 440, resizable from 360 to 650. Step 20 (the artifact opens) also comes before step 19 (files on top).
- **Q9 [W2] Who controls the rail?**
  - It expands in [chat-artifact 08](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) and [graphs 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-126556), then collapses with no trigger. The Artifacts page is collapsed while Projects is expanded.
  - *Default:* the rail is the user's choice. Opening an artifact split auto-collapses it.

### Shell and navigation

- **Q10 [W5]** What expands the collapsed rail? *Default:* clicking the logo. [nav-light 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-289253)
- **Q11 [W5]** The group is labelled "History" in the light rail and "Chats" in the dark rail. *Default:* "Chats". [light 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-292060)
- **Q12 [W5]** The account menu has a Notifications row when the rail is collapsed but not when it is expanded. *Default:* show it in both. [03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-296297) · [04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12919-607703)
- **Q13 [W5]** Pinned project hover: the open arrow ([nav 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-676434)) or the chevron replacing the folder icon ([chevron 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-497681))? *Default:* the chevron toggles the list, clicking the name opens the project, and the arrow is dropped.
- **Q14 [W5]** Pinned item menus. *Default:*
  - Move Up is hidden on the first item and Move Down on the last.
  - The chat menu anchors to its own row (it is drawn far above in [nav 04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-677973)).
- **Q15 [W5]** The project-table row menu has "Log out". *Default:* replace it with Delete and rename "Add to Project" to "Move to project". This is the same fix the Projects dashboard prototype already made. [nav 07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13701-756891)
- **Q16 [W5]** Does "View All" open the project page or expand the list in place? *Default:* open the project page. [nav 06](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-627268)
- **Q17 [W5]** What do the rail status icons mean? *Default:*
  - White dot: unread reply.
  - Spinner ring: running.
  - Red ring: failed.
  - Grey ring: waiting for your input.
  - [nav 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894)
- **Q18 [W5]** Pinning and drag rules. *Default:*
  - A new pin goes to the bottom of Pinned.
  - "Release to unpin" shows once the pointer leaves the Pinned bounds.
  - The unpinned item returns to the top of its home group.
  - The duplicated highlighted row is the empty drop slot.
  - [drag-unpin 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-666296)
- **Q19 [W5]** Drag reorder. *Default:*
  - Rows below the dragged one get white at 5% alpha.
  - The dropped row keeps its folder icon.
  - The new ring on "Plan launch timeline" is a drawing slip.
  - [drag-pinned 03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-662888)
- **Q20 [W2]** Is "pin a chat from the title" the Pin Chat item in the title menu? Is there no separate header pin icon? *Default:* yes to both. [chat-artifact 03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-466688)
- **Q21 [W2]** Should the rail's Artifacts item highlight while an artifact is open inside a chat? It does in 21, chat-questions and commenters 05. *Default:* no; the selection follows the page. [21](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1795-359260)

### Landing, composer and agent

- **Q22 [W1]** Should the landing composer show the Company / Research chips? Some frames do, but [nav 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894) and [logo 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-167773) do not. *Default:* show them.
- **Q23 [W2]** Does the dotted logo animate while the landing page is idle? *Default:* no; it animates only as the thinking glyph. [logo 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-167773)
- **Q24 [W2]** Which thinking glyph: the bare dot grid ([01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8863-220940)) or the round avatar ([02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10139-466731))? Which loop: 0.2s or 0.8s? *Default:* the round avatar, 0.8s loop, 28px below the bubble.
- **Q25 [W2]** Is the chat-title menu available while the agent is generating? Is step 03 a side state rather than a main-flow step? *Default:* yes to both. [03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-466688)
- **Q26 [W2]** Chain-of-thought presentation: while streaming, as [05](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1713-249395) (steps, with sources on the first thought); when "Thoughts" is expanded, as [06](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4756-184104) (one line each)? Is [07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4756-186919) (every thought with sources) unused? *Default:* yes to all three.
- **Q27 [W2]** Enhance prompt behaviour. *Default:*
  - It appears in the bottom composer too.
  - It re-enables once the user edits the text.
  - Stop restores the original text.
  - "3 words" is counted by whitespace.
  - It is part of every composer from now on, so older frames will show a difference.
  - [enhance 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10247-277018)
- **Q28 [W3]** Question card behaviour. *Default:*
  - Picking an option posts it as a user message, and the agent continues.
  - The card sits above the composer and pushes the thread up; it never pushes the composer off-screen.
  - Enter submits the free text.
  - Skip lets the agent pick a default.
  - **What is the arc at the top-left?** (a countdown or progress?)
  - [chat-questions 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5873-530156)
- **Q29 [W2]** "Business units led": the subtitle describes a bubble chart (revenue vs margin, team size), but the visual is a $100M portfolio sunburst. Which is intended? The follow-up KPI tiles repeat the first answer's numbers. *Default:*
  - Build the bubble chart.
  - Use FY2023 KPIs ($42M→$81M, FY $715M, margin 58%→68%, average 63%) for the follow-up.
  - Charts get hover tooltips and legend toggles.
  - The chat title never changes per turn.
  - Frames: [04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125400) · [06](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-125957)
- **Q30 [W2]** Memory bar and Settings. *Default:*
  - "View Memory" opens Settings over the current chat, and closing returns to the chat.
  - The bar closes with its X or on the next send.
  - We build the Memory pane only, not the full Settings flow.
  - The empty-circle icon in the header is dropped. **What is it?**
  - [memory 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9915-762550) · [03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-408460)
- **Q31 [W2]** Consecutive messages. *Default:* copy / edit under your own messages show on hover only, and the same sender starts a new group (name and avatar repeated) after a 5-minute gap. [consecutive 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11633-344632)
- **Q32 [W2]** When does the header comment icon show? *Default:* only when the chat has commenters or comments, with a badge for unread. It shows in 10-14, is gone from 15, and has a badge in collab 10. [collab 10](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-494135)

### Cost

- **Q33 [W2]** Session budget and limits. *Default:*
  - Within budget below $2, orange from $2, red from $5 per session (the bar's marks).
  - The monthly limit is $250 (the frames say "$259 of @259" and "$250 of $250").
  - The popover opens on hover, and a click pins it open.
  - [cost 04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236034) · [07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236106)
- **Q34 [W2]** What happens when monthly usage is out? *Default:*
  - Typing is allowed; Send is disabled, with a tooltip pointing to "Request more".
  - The "pending approval" card stays until the admin answers.
  - **Is there an approved or denied state?**
  - [cost 09](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6802-236125)

### Sharing and collaboration

- **Q35 [W4]** What happens after Invite? *Default:* the modal returns to the access list with the new people and shows a toast. The chat becomes collaborative, with the "joined" line. [share 10](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316531)
- **Q36 [W4]** Role meaning and copy. *Default:*
  - Commenter means view + comment; Editor means chat + edit.
  - The descriptions say "artifact" or "chat" instead of "project".
  - The default invite role is Commenter (in step 09 the selector says Commenter but the check mark is on Editor).
  - [share 09](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12264-347642)
- **Q37 [W4]** Access editing. *Default:*
  - Remove Access applies immediately with an Undo toast.
  - Free-typed emails become chips.
  - "Anyone with the link" reads "Anyone on the internet with the link can view".
  - [share 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-470679) · [06](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1819-316373)
- **Q38 [W4]** In add-users, do the invite steps 09-11 come before step 03, which already lists the members? *Default:* yes. [03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12025-773344)
- **Q39 [W4]** Assistant Replies toggle. *Default:*
  - Any editor can flip it, and it applies to the whole chat.
  - When off, the Assistant answers only an explicit @Assistant.
  - "Assistant" stays first in the mention list.
  - [collab 02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8202-477546)
- **Q40 [W4]** Crowded chats. *Default:* the header shows up to 10 avatars + N, the bar shows 3 + N, and the typing line reads "Matt and 12 others are typing". [collab 09](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-490604)
- **Q41 [W4]** Is the people-with-access popover read-only? *Default:* yes, with a "Manage access" link that opens the share modal. [header c04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427693)

### Queue

- **Q42 [W4]** When is the queue available? *Default:*
  - Only while the Assistant is generating; the placeholder reads "Queue follow-up…" then and "Ask anything…" otherwise.
  - The card floats above the composer, at most 3 rows tall with inner scroll, and never covers the thread.
  - [queue 15](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-524125)
- **Q43 [W4]** How are queued messages dispatched? *Default:*
  - When the reply ends, queued items send one at a time, in order.
  - Pause holds them.
  - **Send now:** does it jump to the front (sent after the current reply) or interrupt the running reply? *Default:* jump to the front.
  - [queue 07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-508680)
- **Q44 [W4]** How do Edit and reordering work? *Default:*
  - Edit loads the item, including any attachment, back into the composer.
  - Items with attachments can be edited too.
  - The drag handles reorder items.
  - Clear asks no confirmation but shows Undo.
  - [queue 09](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8255-520722)

### Comments

- **Q45 [W4]** How do the comments steps resolve? *Default:*
  - Step 01 is the canonical entry (03 is the same panel).
  - Step 04 is three separate states.
  - The ring icon that replaces the X in 04 is a slip.
  - The grey dot over the comment icon is the unread badge.
  - [04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-209548) · [05](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8279-215077)
- **Q46 [W4]** What does a commenter see?
  - In [step 09](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469355) the header shows "Edit with Chat" and "Publish" to someone who can only comment.
  - *Default:* the commenter header is the name, comments and download only. A commenter inside the app sees the artifact without the chat (step 07).
- **Q47 [W4]** Which comment components are the source of truth? Should the loose reply-flow panels c02-c09 be included? *Default:* the newest set (`Comment_Message Unit / Size=md` + `comment box`, from step 10), and yes, include the reply flow. [10](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8085-469620) · [c05](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10767-620480)

### Canvas comments

- **Q48 [W4]** How does the user enter comment mode? *Default:* the comment button in the artifact header toggles it. Its chevron offers "Show resolved". [canvas 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507489)
- **Q49 [W4]** How is a comment routed to the agent: an @agent mention ([02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507495)), the "Send to Agent" checkbox ([sheet](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507502)), or the modal ([04](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507512))? *Default:* the @agent mention only.
- **Q50 [W4]** What happens after @agent? *Default:*
  - The agent replies in the chat and saves a new artifact version.
  - The pin stays, with a "resolved by Assistant" reply.
  - The demo runs on the Pipeline Command artifact.

### Artifacts

- **Q51 [W3]** Is 787px the narrow-pane rule (artifact width under about 900)? Do the dropped controls go into a ⋯ overflow menu? *Default:* yes to both, and the floating Drag Handle in step 01 is a leftover. [02](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7418-305665)
- **Q52 [W3]** What does picking an older version do? *Default:* the canvas swaps in place, with a "Viewing v1 · Restore" banner. "Versions" in the name menu and the "v3" button open the same list. [header c03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9200-349032)
- **Q53 [W3]** Viewer header. *Default:*
  - Commenters get comments + download on every type; plain viewers get download only.
  - Home shows only on a shared link (no app shell around it).
  - Viewers get no name menu.
  - [viewer 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3838-248160) · [03](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7781-267087)
- **Q54 [W3]** Full-view header rules. *Default:*
  - The App header gets the same right-side set as other types, plus "Edit with Chat".
  - Back shows only when the view was opened from another page.
  - Collapse returns to the chat split.
  - JSON and connector artifacts reuse the doc and slide layouts.
  - [full 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865) · [02a](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12195-302725)
- **Q55 [W3]** Sample content. *Default:* the Acme dashboard and the spreadsheet are rebuilt as real HTML (needed for hover and canvas comments; Figma has flat images). The blank doc / pdf / md / ppt / json pages get short sample content. [split 20](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-488480)
- **Q56 [W3]** Deleted artifact. *Default:*
  - Every header action is disabled except close.
  - "Recreate the Artifact" re-runs the prompt as a new Assistant turn.
  - The inline card in the chat shows "Deleted".
  - [deleted 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6944-511592)
- **Q57 [W3]** Artifacts landing behaviour. *Default:*
  - The delete modal sits over the grid; after deleting, a toast offers Undo.
  - The tabs, type filter and Newest sort filter the data.
  - Status icons: pin = pinned, lock = private, people = shared, globe = published.
  - On wide screens the grid adds columns (288px cards); there is no fixed 928 column.
  - [landing 05](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-688356)
- **Q58 [W3]** New Artifact flow. *Default:*
  - Picking a starter opens the new artifact in the same "New Artifact" chat (frame 08 shows a different chat).
  - The copy "creating a routine" becomes "creating an artifact".
  - [07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-177321) · [08](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-178324)
- **Q59 [W3]** Cloning. *Default:*
  - The clone appears first (sort is Newest), the grid stays, and a toast offers "Open".
  - The CTA is "Start Chat" when the artifact has no chat yet.
  - A clone starts private and unpinned.
  - Rename commits on Enter or blur and cancels on Esc; the maximum length is 120.
  - [cloned 01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-280936)
- **Q60 [W3]** Publishing. *Default:*
  - The modals sit over a scrim.
  - The role dropdown is used while adding people (c07); the trash icon only in "who has access" (c06).
  - Done with no change returns to the Publish card.
  - After Publish: a toast, and the header button reads "Published". A second Publish is called "Update".
  - **Is the URL editable?** *Default:* no.
  - [c07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-590614) · [c10](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-736622) · [c11](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-737092)
- **Q61 [W3]** Header dropdowns. *Default:*
  - The source of truth is the `Apps Dropdown` component `12703:449317`, not the frame copies.
  - The Sharepoint copy says "artifact", not "spreadsheet".
  - The small artifact list (c05) is replaced by the files panel. **Or is there another trigger for it?**
  - The grey dot near Share is the files badge.
  - [c01](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507290) · [c05](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427694) · [c07](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427883)

---

## Appendix A. Candidate fixes for the FIXES ledger

Each fix starts as `proposed` and shows only with "With fixes" on.

| Fix | Frames | As designed | Proposed |
|---|---|---|---|
| typo-exists | 6944:511592 | "This artifact no longer exisits" | "exists" |
| typo-workspace | 6802:236145 | "Goes to your workapce admin" | "workspace" |
| cost-monthly-amount | 6802:236106, 6802:236145 | "$259 of @259" / "$250 of $250" | one limit (Q33) |
| typo-than-number | 9915:762550 | "thannumber" | "than number" |
| typo-assistant | 3273:190223, 8222:485711, 8222:488552, 11633:344632, queue-1 | "@Assitant" | "@Assistant" |
| name-john-whitaker | 1731:255712, 8202:478758, 6077:427693 | "John Whitake" | "John Whitaker" |
| name-grace-coleman | 1731:338960 | "Mace Coleman" | "Grace Coleman" |
| typing-grammar | 8222:482896, 8222:485711 | "Matt Rivera are typing" | "Matt Rivera is typing" |
| typo-application | 3838:248160, 7809:278865, commenters 07 / 09 | "Untitled Applciations" | "Untitled Application" |
| connector-name | 8771:210166 | "Untitled.ppt" on a connector | "Untitled flow" |
| commenters-word | 8279:220537 | "commentators" | "commenters" |
| assistant-replies-case | collab 08-10 | "Assistant replies" | "Assistant Replies" |
| queue-count | 8255:519307 | "Queue 1" with 2 items | "Queue 2" |
| queue-placeholder | 8451:366278 | "Queue follow-up….." | "Queue follow-up…" |
| share-title-chat | 1809:446980 | "Share Artifact" on a chat | "Share chat" |
| role-copy | share, add-users | "Comment and view project" / "Chat and edit project" | "artifact" / "chat" (Q36) |
| link-access-copy | 1819:316373, 12025:781497 | "Only the people above can access it" | "Anyone on the internet with the link can view" |
| invite-role-check | 12264:347642 | selector Commenter, check on Editor | check follows the selector |
| share-header-avatars | share 02-10 | header avatars disappear | keep the avatars |
| sharepoint-copy | 1969:507305 | "copy of the spreadsheet" on HTML | "copy of the artifact" |
| starter-copy | 3780:177321 | "creating a routine" | "creating an artifact" |
| kpi-duplicate | 1707:125957 | "Highest Margin" twice, the first answer's numbers | FY2023 KPIs (Q29) |
| row-menu-logout | 13701:756891, 11780:448662 | "Log out" in a chat row menu | "Delete"; "Move to project" (Q15) |
| panel-name-matches-card | 1809:488480 and every split frame | "Untitled.xls" opened from "Pipeline Command" | the panel shows the card's artifact (Q2) |
| share-owner-persona | share, publish, comments | Lana Steiner / Anuj Mittal as "you" | one persona (Q1) |

---

## Appendix B. Responsive and mobile rules we will author

Figma is desktop-only at 1440. The 400-wide frames are side panels, not mobile. These rules are ours. Every one is visible at `vw=` presets in the review bar, and each is logged as a fix so the designers can respond.

| Width | Rule |
|---|---|
| ≥ 1440 | As designed. The chat column stays 760 and centred; extra width goes to margins. The artifacts grid adds 288px columns. |
| 1280-1439 | Same layout. The split chat column stays at 440 and the artifact panel shrinks. |
| 1024-1279 | The rail auto-collapses to 56 when a split or panel opens. Comments as a third column becomes an overlay sheet over the artifact. Artifact header controls fold into ⋯ under about 900px of artifact width (the designed 787 rule). |
| 768-1023 | The split becomes "artifact over chat": the artifact opens as a full-height sheet with a back-to-chat control, and the files and comments panels become right-hand sheets. Modals stay centred, max 440. The queue card uses the 408 layout. |
| < 768 (mobile proposals, `/gallery/mobile`) | The rail becomes a drawer behind a top bar (logo, title, ⋯). The composer docks at the bottom with chips in a horizontal scroll. Menus and popovers become bottom sheets. Modals become full-screen sheets. Artifacts open full screen; header actions collapse into one ⋯ sheet. The collaborative bar shows avatars + "N typing". The artifacts grid is 1 column at under 480 and 2 columns otherwise. |
