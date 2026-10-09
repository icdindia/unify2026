# Figma map overview: Enterprise Brain Base 2026 - 1

> **Decisions (2026-10-09, from the user):**
> - **D1: the full-opacity option wins.** A faded (30%) option is parked; if several options are at full opacity, take the leftmost. This replaces "Option 1 only" for these pages; the Chat + Artifacts decisions stay as made.
> - **D2-D24: every proposed default is accepted.**

File `lqKjNjyifEXCeywg69Knr2`. Written 2026-10-09 after the page-by-page mapping pass. Each page's own map is `figma-ref/<slug>/MAP.md`, with the machine-readable `journeys.json` beside it. Chat + Artifacts is the exception: its map is `src/figma/journeys.chat-artifacts.json` and its captures are in `figma-ref/chat-artifacts/`.

Status: Chat + Artifacts was CONFIRMED with you on 2026-10-08. Every other page is a DRAFT inferred from the layout. The 24 doubts at the end are the open questions. Each one has a proposed default, which applies until you answer it.

Node links use `https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=<A-B>`.

## 1. Pages

13 pages. 11 are mapped and 2 are not, because the Figma Desktop Bridge dropped. The mapped pages add up to **125 journeys and 555 screen frames**. The 10 pages mapped today hold 95 journeys and 367 frames.

| # | Page | Map | Journeys | Frames | Dimmed rows kept | Loose | Ignored options | Captured? | Doubts |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Chat + Artifacts** [1707:115989](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-115989) | `src/figma/journeys.chat-artifacts.json`, captures in [chat-artifacts/](chat-artifacts/) | 30 | 188 (+3 alternates, 2 states above, 17 components) | 0 | not listed (ignored by decision) | not listed (option 1 only) | **Yes**: PNG spec per frame, routed in `src/figma/frames.generated.ts` | none of its own (D2, D4, D6 touch it) |
| 2 | **Search + Agent + Login** [13766:124218](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124218) | [search-agent-login/](search-agent-login/MAP.md) | 5 | 18 | 1 (side-nav-parked, 20%) | 3 | 3 (login options 1-3) | No | D1, D6, D23 |
| 3 | **Notifications** [13752:451556](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13752-451556) | [notifications/](notifications/MAP.md) | 2 | 6 | 2 (both rows, 30%) | 0 | 1 (option 2 row, 5 frames, full opacity) | No. Older HTML: `prototypes/notification-flow`, `prototypes/notification-panels` (both out of date) | D1 |
| 4 | **Settings** [3612:185217](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-185217) | [settings/](settings/MAP.md) | 13 | 54 | 1 (connectors-input-cta-parked, 2 frames) and 2 parked option rows under ignored | 50 | 5 | No | D3, D5, D9-D12 |
| 5 | **Artifacts \| Draft a Mail** [6193:430256](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6193-430256) | [artifacts-draft-a-mail/](artifacts-draft-a-mail/MAP.md) | 12 | 37 | 1 (add-recipient-alert) and 1 parked option row under ignored | 4 entries (12 nodes) | 1 | No. Frame contents were never read (the bridge dropped) | D20-D22 |
| 6 | **Artifacts \| Flow Charts** [11780:375551](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11780-375551) | [artifacts-flow-charts/](artifacts-flow-charts/MAP.md) | 6 (1 is a parked card with no frames) | 19 | 1 (Swimlanes card, empty) | 23 (15 are the flow-chart component kit) | 2 | No | D2, D24 |
| 7 | **Comments on Artifact** [13946:324390](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324390) | [comments-on-artifact/](comments-on-artifact/MAP.md) | 1 | 6 | 0 | 2 | 0 | No | D2 |
| 8 | **Projects + Chat History** [563:116774](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=563-116774) | [projects-chat-history/](projects-chat-history/MAP.md) | 11 | 56 | 0 | 2 | 1 | Partly: 3 frames (11657:386523, 14045:584747, 15054:105151) are hand-routed as journey `projects` in `src/figma/frames.ts`, plus `prototypes/project-dashboard` | D3-D5, D7, D8 |
| 9 | **Routines** [0:1](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=0-1) | [routines/](routines/MAP.md) | 11 | 58 | 0 (1 parked alternate frame, '161') | 9 | 1 | No | D1, D4, D16-D19 |
| 10 | **Meetings** [8367:7825](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8367-7825) | [meetings/](meetings/MAP.md) | 19 | 83 | 0 | 12 | 4 | No. Older HTML prototype linked from the cards: `dist-one-psi-98.vercel.app` | D13-D15 |
| 11 | **All Empty states & Dropdowns** [6565:313262](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-313262) | [empty-states-dropdowns/](empty-states-dropdowns/MAP.md) | 15 | 30 | 0 | 2 | 2 | No | D1, D3-D5 |
| 12 | **All landing pages : Artifact Routine Projects** [12382:295660](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12382-295660) | not mapped (slug `landing-pages`) | – | – | – | – | – | No | – |
| 13 | **Chrome Extension ES** [13779:456774](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13779-456774) | not mapped (slug `chrome-extension`) | – | – | – | – | – | No | – |

How to read the columns:

- **Frames** counts the steps of all journeys on the page. Alternates, states above, components and overlays are not counted.
- **Dimmed rows kept** counts reduced-opacity rows that are still mapped as journeys and flagged `dimmed`. Parked rows recorded as ignored options are not counted.
- **Loose** counts the entries in `loose`.

Pages 12 and 13 need mapper E re-run once the Desktop Bridge plugin is reopened in Figma (Plugins > Development > Figma Desktop Bridge). Page 12 will almost certainly repeat `projects-landing`, `routines-landing` and Chat + Artifacts `artifacts-landing`.

## 2. Consistency check

Checks run on every `journeys.json` and `MAP.md`:

- Journey ids are unique per page.
- Every frame sits in exactly one journey, and no frame is also an alternate, component, ignored option or loose item.
- No node is mapped on two pages.
- Every node id that a page mentions and that is mapped on another page is noted in that page's `crossPage`.
- References resolve: `subOf`, `joinsAt`, `startsFrom`, `chosen`, `keptInstead`, `dimmedFrames` and doubt links.
- Each `MAP.md` lists every journey and frame of its JSON, in the same order, and no ids that the JSON lacks.

Everything passes after the fixes below.

**Fixed in place**

1. **Settings, `memory-disable-reset`**: its step 1 was 10136:595120, which is also step 1 of `memory-disable-pause`. The designer left that column empty in the branch row. It is now recorded as `"startsFrom": "10136:595120"`, the mirror of the Routines map's `joinsAt`. The journey has 2 frames, and the Settings total is now 54 unique frames, which matches the mapper's count. MAP.md was updated to match.
2. **Meetings, `meeting-details`**: `components` held strings with labels ("11600:530539 Date Picker"). They are now plain ids, and the labels have moved to `componentNotes`, as on Projects + Chat History.
3. **Draft a Mail**: two page-level rows had `section: "(page level, outside any section)"` instead of an id. They now use the page id `6193:430256`, and that id was added as a pseudo-section, the way Notifications already does it. MAP.md now says "overlay at page level" for the page-level Alert.
4. **All Empty states & Dropdowns**: its mapper ran before the home pages were mapped. `crossPage` (JSON and MAP.md) now also links to the home-page copies of each empty state and menu on Projects + Chat History, Routines, Settings and Search + Agent + Login.

**Reported, not fixed (bigger than a small edit)**

- **The two mappers applied the option rule in opposite directions.** The Notifications mapper let "option 1 only" win and mapped the faded option 1. The Search + Agent + Login mapper let "faded = parked" win and mapped option 4. One rule is needed: see **D1**.
- **The schema varies between files.** For example:
  - `crossPage` is plain strings on 6 pages, `{journey, note}` on Meetings, and `{frame, note}` on 3 pages.
  - `notes` is a string, a per-frame dict, or `notesGeneral`.
  - Extra fields include `stepNotes`, `contents`, `overlays`, `componentNotes`, `references`, `subOf`, `labelNode`, `joinsAt`, `startsFrom`, `dimmedFrames`, `cardText` and `prototypeUrl`.
  - `statesAbove` sometimes appends a label after the id, as Chat + Artifacts does.

  A generator such as `tools/gen-frames.py` needs a normaliser before it reads these files.
- **Artifacts | Draft a Mail**: no frame contents were read. Every step description comes from position, size and label only, and D20 and D21 could probably be settled by reading the frames' text.
- **Two steps on Settings differ only visually**, so their descriptions are guesses: `connectors` step 3 (10647:200341) and `skills` step 2 (14101:122322).
- **The older HTML prototypes are stale.** `prototypes/notification-flow` uses 14761:289991 and `prototypes/notification-panels` uses group 14761:43871, and both nodes are gone from the file. Section 1 now ends on 15460:171060.
- **`src/figma/frames.ts`** records the Projects frames' page as "(not recorded)". It is **Projects + Chat History** (563:116774). It also labels 14045:584747 / 15054:105151 as "inside page option 1 / option 2", which the new map reads differently (see **D7**).
- **Artifacts | Flow Charts `fc-swimlanes`** is a journey with no frames: a parked card. That matches Chat + Artifacts `header-dropdowns`, which has components only. A stepper has to tolerate an empty `frames` list.

## 3. Cross-page links

`[dup]` = the same thing drawn twice. `[cont]` = one flow continues into the other. `[inst]` = a frame is an instance of another page's frame. `[pattern]` = the same component or pattern.

1. **App shell nav rail.** Chat + Artifacts `nav-light` and `nav-behaviour` are canonical.
   - [dup] Search + Agent + Login `light-mode-nav` (2 screens) and `side-nav` (agent selector, sub-header hover, three-dots menus).
   - [dup] Routines `side-nav` (rail hover states).
   - [inst] Empty states `dd-nav` 9256:477323 is an instance of Search + Agent + Login `side-nav` step 6 (9256:477318).
   - Meetings frames carry the same Main_nav. See D6.
2. **Account menu, then Notifications or Settings.** [dup] Chat + Artifacts `nav-light` steps 03/04 (12829:296297, 12919:607703) and BUILD-PLAN item 2 AccountMenu are the same pattern as Notifications option 2 (14045:596900), which is currently under ignored options; see D1. Settings opens from the rail or the account menu, but no frame draws that entry. The Meetings desktop notifications and tray rows overlap Notifications.
3. **Pinning.**
   - [inst] Chat + Artifacts `pinning` step 02 (11657:386528) is an instance of Projects `projects-landing` step 2 (11657:386523).
   - [inst] `pinning` step 03 (11657:493696) is an instance of Routines `routines-landing` step 3 (11657:493405), which BUILD-PLAN item 61 RoutinesLanding should be built from.
   - Routines `routine-to-project` option 2 (pin/unpin) is parked.
4. **Composer and input '+' menu.** Chat + Artifacts `input-large` and `header-dropdowns` Input menu (6077:427693/427694) lead into:
   - [cont] Settings `connectors-input-error`: the connectors submenu with an error, and its parked CTA variants.
   - [inst] Empty states `dd-chat-journey` 9256:465529, an instance of `input-large` step 2.
   - [pattern] Draft a Mail "chat quote style" (10077:327578).
   - [pattern] Meetings `ask-meeting`.
5. **Chat + artifact split and artifact views.** Chat + Artifacts `chat-artifact`, `artifact-full-editor`, `artifact-view-viewer` and `artifact-view-editor-main` are the base templates.
   - [pattern] The mail variant: Draft a Mail `split-50-50`, `artifact-only`, `artifact-only-viewer` and every draft-mail row.
   - [pattern] The flow-chart variant: every Flow Charts journey (BUILD-PLAN template 3).
   - [cont] Meetings `meeting-briefs` ("Brief with artifacts") and `proactive-artefacts`.
   - [inst] Empty states `dd-chat-journey` 9256:466693, an instance of `chat-artifact` step 3.
6. **Header dropdowns (Apps, Download, Version history).** Chat + Artifacts `header-dropdowns` (card 1969:507284) recurs in:
   - [dup] Meetings `proactive-artefacts` steps 3-4.
   - [pattern] the Flow Charts download menu 11780:375850 and its Zip / Code / Doc variants.
   - [pattern] the 'Download Dropdown' overlays on Draft a Mail's schedule steps.
7. **Comments.** Chat + Artifacts `canvas-comments` (hover, select, compose) and `commenters` (panel) connect to:
   - [cont] Comments on Artifact `comment-on-artifact` (bubbles, thread menu, all comments, comment in chat). See D2.
   - [pattern] Flow Charts `fc-staging-comments`.
   - Meetings `proactive-artefacts`: its note card 8890:594271 links to `canvas-comments` and `publish-artifact`.
8. **Share, invite and access.** Chat + Artifacts `share-artifact`, `add-users` and `publish-artifact` ("who has access") connect to:
   - [pattern] Projects `project-share` (Share Project modal, 10 steps).
   - [dup] the Settings loose Share Project modal 10101:548721 and 'Who can view this?' 10136:603182.
   - [pattern] Meetings `multiplayer-invite` and `multiplayer-presence`.
   - [inst] Empty states 9256:468124 and 9256:473477, instances of `add-users` step 2.

   Build note: one share modal whose subject is a project, artifact, chat or meeting.
9. **Memory.**
   - [cont] Chat + Artifacts `new-memory` (a memory created in chat) leads into Settings `memory-*` (list, edit, delete, disable).
   - [cont] Projects `project-settings` step 2 'Add Project Memory' (14045:589425) leads into Settings `project-memory` (10190:662974 'View Memory', which opens the Memory modal scoped to the project). This reads as add on the Projects page, then view on the Settings page. It is not raised as a doubt.
10. **Edit with AI popover.** [pattern] Projects `instructions-ai-edit` (5534:215248), Draft a Mail `edit-with-ai` and `draft-mail-ai-edit`, and Settings `memory-individual` and `memory-edit-ai-list` ("Edit using AI input box"). One AI-edit popover component should serve all of them.
11. **Empty states.** [dup] The Empty states page (`es-*`) redraws the home-page empty states. See D4.
    - Projects: 3415:323703 (landing), 901:212182 and 14975:59510 (Chats tab), 1489:269074 (Routines tab).
    - Routines: 875:162202.
    - Chat + Artifacts: `artifacts-landing` step 1 (3780:177209).
12. **Menus.** [dup] The Empty states page's `dd-*` frames redraw menus whose home flows are Projects `project-menu-*` and `chat-history`, Routines `routines-landing` and `scheduled-sessions`, and Settings `connectors-disruption`. Several of them list different items. See D3 and D5.
13. **Projects and Routines.**
    - [dup] Projects `project-routines` and `project-tabs-new` overlap Routines.
    - [cont] Routines `create-ai-first-time` step 7 (1412:240483, "choosing if the routine belongs to a project") and `routine-to-project` link back to Projects.
    - [pattern] Chat + Artifacts `publish-artifact` runs in a chat named 'new-routine': the chat-side entry to creating a routine.
    - Notifications option 1 lands on what looks like a routine dashboard (notification type 5 is 'Routine completion').
14. **Chat history.** [pattern] The Projects `chat-history` row menu (Pin / Rename / Add to Project / Delete) and Rename Session modal (4853:246286) match Chat + Artifacts `chat-artifact` 'edit name' (6405:308388). [cont] `nav-behaviour` (more than 10 chats) leads to 'view all chats', probably this History page.
15. **Loose frames whose home is another page** (all are on Settings; see D12):
    - Add Text Content (10136:602967) is Projects `project-settings` step 8 (14045:590970).
    - The Templates modal (9890:402740, 'Customer: Discovery') is probably Meetings `templates` (meeting-note templates), or else Routines `templates`.
    - The time picker (10101:548486, 'Tonight 9:00pm / Tomorrow 6:00am') is probably Draft a Mail scheduling, or else Routines.
    - 'Choose your agents' (9893:422543) has no mapped home. Agents appear only as Empty states `es-agents` and Search + Agent + Login `side-nav` step 3.

## 4. Doubts

The numbers are global (D1-D24). Cross-page doubts come first, then the pages in order of impact. Within each group, the most consequential doubt is first. Each doubt names the page doubt it came from, and doubts that were near-duplicates have been merged.

### Cross-page

**D1. Option rule: a faded option 1 against a full-opacity later option.** *(merges Notifications D1, Search + Agent + Login D1 (first half), Empty states D2, and the '14' vs '161' half of Routines D2)*

The standing rule is "option 1 only". Several rows instead fade option 1 and keep a later option at full opacity:

- **Notifications**: option 1 (the panel opens from the rail; 30%) against option 2 (the account menu has a Notifications row; full opacity, newer, already built as `prototypes/notification-flow`, and the same AccountMenu the Chat + Artifacts shell uses).
- **Login**: options 1-3 at 30% against option 4 at full opacity.
- **Settings dropdowns** (on All Empty states & Dropdowns): only 'option 2a' and '2b' exist, and there is no option 1.
- **Routines `create-manually`**: '14' (full opacity, 280 rail) against '161' (30%, newer, 56 rail).

The mappers resolved these in opposite directions. Which rule wins?

Links: [13760:757630](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-757630) · [14045:596900](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-596900) · [13766:134986](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-134986) · [9271:625787](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625787) · [12860:490015](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-490015)

Proposed default: Faded means parked, so build the full-opacity option. If several options are at full opacity, take the leftmost. That gives Notifications option 2 (a one-entry swap in notifications/journeys.json, not yet done), Login option 4 (as mapped), Settings dropdown 2a (as mapped) and Routines '14' (as mapped). A faded row with no competing option, such as D22, is a separate case.

**D2. Comments on an artifact are designed twice. Are they two halves of one flow, or does the new page replace the old?** *(Comments on Artifact D1)*

Chat + Artifacts `canvas-comments` (1969 ids, older) covers hover, select and compose with @agent. Comments on Artifact (13946 ids, Oct 2026) covers the bubbles on the canvas, the thread menu, 'all comments' and comment-in-chat. Flow Charts `fc-staging-comments` touches the same topic. Nobody has checked whether the bubbles are instances of `Canvas-Comments-Bouble` 1902:350642.

Links: [13946:324825](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324825) · [13946:325541](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325541) · [1969:507282](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507282) · [1969:507495](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507495)

Proposed default: Two halves of one flow. Keep `canvas-comments` for hover, select and compose, and use Comments on Artifact for everything after. Where bubble states differ, the newer page wins, and Flow Charts reuses the same bubbles.

**D3. The Dropdowns page's menus disagree with the menus on their home pages. Which wins?** *(merges Empty states D1 with the cross-check against Projects and Settings)*

- **Project header menu**: Dropdowns 'option 2' 9269:524909 has Pin / Edit Project / Share Project / Keyboard shortcuts. On Projects, the admin menu 901:212387 has Edit Project Details / Delete and the non-admin menu 901:212281 has Leave Project / Log out. `prototypes/project-dashboard` already uses card menu 4767:135942: Pin / Edit Project / Share Project / Delete.
- **Chat row menu**: Dropdowns 9271:530761 ends in Keyboard shortcuts, where Projects `chat-history` 4853:244291 ends in Delete.
- **Settings connector menu**: Dropdowns 9271:625183 has Re-authenticate / Remove Connection. Settings `connectors-disruption` 11750:515608 has Forget / Reconnect.
- On the Dropdowns page, 'option 1' of the Projects row (9269:524880) shows only a cursor. The five frames after it may be separate menus.

Links: [9269:523680](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-523680) · [9269:524909](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-524909) · [901:212387](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212387) · [9271:530761](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-530761) · [9271:625183](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625183)

Proposed default: The home page wins for every menu. The Dropdowns page is a catalogue: each frame is a separate menu state, read left to right, and 'option 1' is the hover trigger. The project header menu becomes Pin / Edit Project / Share Project, then Delete for admins or Leave Project for others, which matches 4767:135942. The connector menu becomes Forget / Reconnect.

**D4. Empty states are drawn twice: on the Empty states page and in the home-page journeys. Which drawing wins?** *(new, from the cross-page check)*

The pairs are:

- Artifacts: 6565:419134 and Chat + Artifacts 3780:177209.
- Projects: 6565:492532 and 3415:323703.
- Project Chats tab: 6565:493676 and 901:212182 / 14975:59510.
- Project Routines tab: 6565:493716 and 1489:269074.
- Routines: 6565:410734 and 875:162202.

The pairs have not been compared visually, so some may be identical.

Links: [6565:492532](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-492532) · [3415:323703](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3415-323703) · [6565:410734](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-410734) · [875:162202](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-162202) · [6565:419134](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-419134)

Proposed default: The home-page frame stays as the journey step. If the empty-state block differs, the later drawing wins by node-id creation order. That makes the Empty states page (6565:*, the systematic L1/L2 pass) beat 3415/901/1489/875/3780, while Projects 14975:59510 beats the page's Project Chat state.

**D5. Menus end in 'Keyboard shortcuts' or 'Log out'. Are these leftover Dropdown Menu defaults to drop?** *(merges the Projects 'Log out' note with the same pattern on the Dropdowns page)*

'Keyboard shortcuts' is the last item in 4 of the 6 menus on the Dropdowns page: nav 9256:477323, chat row 9271:530761, project 9269:524909 and connection 9271:625183. 'Log out' is the last item in Projects 901:212281 and 1504:421567 (the Add Context Files menu).

Links: [9256:477323](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477323) · [9271:530761](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-530761) · [901:212281](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212281) · [1504:421567](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1504-421567)

Proposed default: Yes, drop both everywhere. `prototypes/project-dashboard` has already dropped 'Log out' from the row menu.

**D6. Nav states are drawn on three pages. Is Chat + Artifacts still the source of truth?** *(merges Search + Agent + Login D2 with the Routines side-nav duplicate)*

Search + Agent + Login draws `light-mode-nav` (2 screens) and `side-nav` (7 states). Routines draws `side-nav` (3 hover states). Chat + Artifacts has `nav-light` (4 screens) and `nav-behaviour` (9).

Links: [13766:126458](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126458) · [13766:126154](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126154) · [1440:369045](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-369045) · [12919:607701](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12919-607701)

Proposed default: Chat + Artifacts stays canonical, as already confirmed. From Search + Agent + Login `side-nav`, take only the states Chat + Artifacts lacks: 'agents page selected' (13766:125236), the item three-dots menu (9256:477318: Run Now / Edit / Add to Project) and the sub-header hover. Every other duplicate is a reference only.

### Projects + Chat History

**D7. 'Context' or 'Files', and which project page is current?** *(Projects D1, extended with `src/figma/frames.ts`)*

The project tab is named 'Context' in the older frames (901:212182, 11715:643488, 1489:269074, 901:212550, 12085:590629) and 'Files' in the newer ones (14975:59510, 15054:105151, 14045:584747, 12097:592297, 12183:712603). The Chats tab is drawn twice: in 'Project - Chat' and at the end of 'Project - New project'. The prototype already treats 14045:584747 as "inside page option 1" and 15054:105151 (newest: pill tabs, small header buttons) as "option 2".

Links: [901:212182](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=901-212182) · [14975:59510](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14975-59510) · [14045:584747](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-584747) · [15054:105151](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15054-105151) · [12183:712603](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12183-712603)

Proposed default: Use 'Files' everywhere, and keep 'Context Files' only as the heading inside Settings. Both rows route to one Chats-tab screen: empty is 14975:59510 and the list is 14045:584747, which is already built and is the default. 15054:105151 stays the prototype's `?opt=2` alternative.

**D8. Does 'Add Project Instructions' open the plain modal or the AI-edit version?** *(Projects D2)*

Project - Settings step 3 opens a plain modal (14045:589544, Cancel / Save). The 'Instructions AI Edit' section draws the same modal with an AI 'Edit' control and a generate / edit / accept-undo flow.

Links: [14045:589504](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-589504) · [5534:200639](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-200639) · [5534:215248](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5534-215248)

Proposed default: The AI version (5534:200639), with `instructions-ai-edit` continuing from it. The plain modal is the fallback when AI is not available.

### Settings

**D9. Settings modal nav: which tab list, which tab opens first, and what do General and Models show?** *(merges Settings D1 and D2)*

The left nav differs from row to row:

- Connectors: General / Data and memory / Connectors / Skills.
- Skills and Get App: the same list plus Get App & Extensions.
- Memory: General / Memory / Models / Skills / Get App & Extensions.
- The loose 'Dialog - Settings': General / Memory / Connectors / Skills / Get App & Extension.

No frame designs General or Models.

Links: [10647:196002](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-196002) · [14088:847085](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-847085) · [10136:549616](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-549616) · [9893:418298](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-418298)

Proposed default: One nav on every Settings screen: General, Memory, Connectors, Skills, Get App & Extensions. Settings opens on the tab the journey starts from. General shows a 'not designed yet' stub inside the modal chrome, and Models is dropped.

**D10. Two rows are labelled 'Edit using AI input box'. Are they two entry points, or does the newer row replace the older one?** *(Settings D3)*

One row edits from inside a memory's detail view and ends on 'Updated Memory / Undo' (10101/10204 ids). The other row, which is newer, edits from the Memory list input and adds the 'No changes were made' branch (10190/11674 ids).

Links: [10101:531120](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-531120) · [10190:645881](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10190-645881) · [11674:411769](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11674-411769)

Proposed default: Two entry points, both kept: `memory-individual` and `memory-edit-ai-list`.

**D11. Is the 'Memory' component master a real step of 'Individual memory'?** *(Settings D4)*

The untitled second Memory row starts with COMPONENT 10112:406770, then runs hover, open detail, edit with AI, rename and add details.

Links: [10112:406770](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-406770) · [9934:230833](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9934-230833) · [10093:26893](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10093-26893)

Proposed default: Yes. It is one journey, and the master is step 1 (the populated list).

**D12. Should the loose Settings frames that belong to other pages be mapped here?** *(Settings D5)*

The frames are Share Project (10101:548721), 'Who can view this?' (10136:603182), Add Text Content (10136:602967, 10101:548663), the Templates modal (9890:402740/402769/402778), 'Choose your agents' (9893:422543) and a time picker (10101:548486).

Links: [10101:548721](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-548721) · [10136:603182](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-603182) · [9890:402740](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9890-402740) · [9893:422543](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-422543)

Proposed default: No. Take each from its home page (see section 3, item 15). Use these frames only where no home page has them, which today means 'Choose your agents' and the time picker.

### Meetings

**D13. Build the macOS desktop rows, and which tray menu does a click open?** *(merges Meetings D2 and D3)*

14 frames are 1504x945 macOS desktops rather than 1440 web frames: Desktop the Mac app (10), Notification dropdown for teams (3) and System Tray (1). The tray frame embeds a rich panel. Beside it are light and dark copies of that panel and of a compact native menu (Open Unify Brain / Stop recording / Meeting Dictation / Calendar Reminders / Quit).

Links: [8368:3067](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8368-3067) · [12971:574153](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12971-574153) · [14757:503057](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14757-503057) · [14757:502674](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14757-502674)

Proposed default: Build a separate `/desktop` route: a 1504x945 desktop canvas around the 1320x779 app window, which is window chrome, so the 1440 rule does not apply. A tray left-click opens the rich panel, and a right-click opens the compact menu. Light mode only; the dark copies are references.

**D14. Meeting details: one journey or two?** *(Meetings D1)*

The row has no mid-row card. The labels switch from the edit flow (Details, Editing, Adding others, Save, the send-update modal) to 'User Details' and two 'Inline team popup' frames, and the frame names restart (171, 2, 3, 170).

Links: [8368:3037](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8368-3037) · [13185:644268](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13185-644268) · [8890:634585](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8890-634585) · [8890:599243](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8890-599243)

Proposed default: Two journeys on one card: `meeting-details` (5 steps) and `meeting-details-people` (4). The 'bigger screen' 1440/1920 pair stays as references.

**D15. Cues, Native recording and Templates: step order by layout or by frame number?** *(Meetings D4)*

These rows have no labels, and the export numbers disagree with left-to-right order: Cues 174, 175, 176, 178, 177; Recording 187, 185, 186, 188, 189, 194, 190, 192, 196; Templates 173, 179, 183, 180, 181, 182.

Links: [8368:3043](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8368-3043) · [8368:3046](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8368-3046) · [8368:3055](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8368-3055)

Proposed default: Left-to-right layout order, as everywhere else. The numbers look like capture order from the HTML prototype.

### Routines

**D16. Is the untitled group under 'Create Routine manually' the rest of that journey?** *(Routines D2, without the '14' vs '161' half, which is now D1)*

Group 12860:497672 holds 11 side-panel variants marked 'updated', then '145', an 'Instructions' full-screen modal, and the 'Summary' modal screens '35' and '36'.

Links: [12860:497672](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12860-497672) · [895:188495](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=895-188495) · [11979:551199](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-551199) · [11979:561118](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11979-561118) · [905:269417](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-269417)

Proposed default: Yes. The journey runs 14 → 145 → Instructions → Summary 35 → Summary 36, and the side panels are panel states (components).

**D17. Does the second-time AI journey join the first-time row?** *(Routines D1)*

905:297062 → 905:297092 has no title card, and its arrow (967:351899) ends on empty canvas.

Links: [905:297092](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=905-297092) · [967:351899](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=967-351899) · [875:165388](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-165388)

Proposed default: Yes. It joins `create-ai-first-time` at 875:165388 and follows it to the end (`joinsAt`).

**D18. Which frame is 'Error in run'?** *(Routines D3)*

The label sits right-aligned over 1596:364052 ('Run View: Only one Run') and ends just before 1596:367279.

Links: [1620:378625](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1620-378625) · [1596:364052](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-364052) · [1596:367279](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1596-367279)

Proposed default: 1596:367279.

**D19. Do 'On click' and 'View Instructions' caption the upper 'View & edit' row?** *(Routines D4)*

The captions sit between the two rows and line up with 1174:212998 and 1174:209018.

Links: [2633:424284](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2633-424284) · [2633:421802](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=2633-421802) · [1174:212998](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1174-212998) · [6190:428618](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6190-428618)

Proposed default: Yes. 'On click' under 1174:212998 opens 1174:209018, and 'View Instructions' leads to 3413:112115.

### Artifacts | Draft a Mail

**D20. Draft a Mail rows 2 and 3 have no title card: separate journeys? And where does row 2's tail belong?** *(merges Draft a Mail D1 and D2)*

Row 2 runs from 'select to edit' to 'schedule option 1', and row 3 is 'Adding attachment'. Row 2 then continues with 10631:1654754 (a snackbar), 10734:435033 and two 1440x800 modal-only frames (10734:438249, 12264:514091).

Links: [10077:326078](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10077-326078) · [10101:67313](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10101-67313) · [10734:438249](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10734-438249) · [12264:514091](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12264-514091)

Proposed default: Separate journeys under the same card, `draft-mail-ai-edit` and `draft-mail-attachments`, each starting from the composed draft (10077:286845). The tail stays as steps 7-10 of `draft-mail-ai-edit` in left-to-right order. It moves to attachments if a content read shows it is the attachment preview.

**D21. Failed-attachment preview: are the two modals competing answers or two steps?** *(Draft a Mail D3)*

The card is a designer question about the preview when some attachments fail to upload. The two modals are 12264:514198 and 11765:540541.

Links: [11710:629959](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11710-629959) · [12264:514198](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12264-514198) · [11765:540541](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11765-540541)

Proposed default: Two steps, left to right: 11765:534931 → 12264:514198 → 11765:540541. The preview shows an error line for each failed file.

**D22. Is the faded 'add at least one recipient' alert live?** *(Draft a Mail D4)*

The alert is 10631:1659015 with Alert 10631:1660311. It sits at page level at 30% opacity, next to the parked 'schedule option 2'.

Links: [10631:1656046](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10631-1656046) · [10631:1660311](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10631-1660311)

Proposed default: Yes, as the error state when Send is pressed with no recipients. No other option competes with it, so the D1 rule does not apply.

### Search + Agent + Login

**D23. Are the two spreadsheet-window frames after login option 4 login steps?** *(Search + Agent + Login D1, second half)*

13766:134988 and 13766:136039 show the login form inside a spreadsheet app window (ribbon, cell selector).

Links: [13766:133389](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) · [13766:134988](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-134988) · [13766:136039](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-136039)

Proposed default: Yes. They are steps 2-3 of `login`: signing in from the Office add-in.

### Artifacts | Flow Charts

**D24. 'Viewing sources' has frames 20 and 22. Is frame 21 missing?** *(Flow Charts D1)*

No frame 21 exists on the page. Two 1920-wide 'Homepage' captures with citation cards sit below the sections.

Links: [14504:57464](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14504-57464) · [14504:57466](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14504-57466) · [14504:58983](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14504-58983) · [14420:543926](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14420-543926)

Proposed default: Map a two-step journey (20 → 22), and treat the 1920 captures as references only.
