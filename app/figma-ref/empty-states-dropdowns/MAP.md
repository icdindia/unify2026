# All Empty states & Dropdowns: journey map

- Page: [`6565:313262`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-313262)
- Status: DRAFT 2026-10-09 — inferred from layout
- Journeys: 15, frames mapped: 30
- Note: Two sections side by side: 'Empty/ default states' (left, page x 210) and 'Dropdowns' (right, page x 7695). Read left section first.
- Note: Small 84x90 badge frames reading 'L1' / 'L2' sit above the empty-state screens; recorded as labels. They appear to mean nav level (L1 = top-level landing, L2 = page nested inside a project).
- Note: Text 'Check main flow' above a dropdown frame means the frame is an instance of a Chat + Artifacts frame (see crossPage).
- Note: 'contents' is our reading of the open menu or popover layer names, not a designer label.
- Note: No frame on this page has reduced opacity.

How to read: steps run left to right in the Figma row. A label in quotes after the frame name is the designer's text above that frame.

## Section: Empty/ default states

Section node [`11933:741607`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-741607), 31 direct children.

### 1. Desktop default CTA (empty state in the browser frame)

- id: `es-desktop-default-cta`
- Title card: [`15221:1330031`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15221-1330031)

1. [`13807:181877`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13807-181877) "Browser" (1440x900) — shows: one 'ES Empty State' layer, no Main_nav

### 2. Artifacts empty state

- id: `es-artifacts`
- Title card: [`6565:419177`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-419177)

1. [`6565:419134`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-419134) "38" (1440x900) — label: "L1"
2. [`6565:420865`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-420865) "39" (1440x900) — label: "L1"

### 3. Projects empty state

- id: `es-projects`
- Title card: [`6565:491393`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-491393)

1. [`6565:492532`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-492532) "Dashboard" (1440x900) — label: "L1"

### 4. Project - Chat empty state

- id: `es-project-chat`
- Title card: [`6565:493670`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493670)

1. [`6565:493676`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493676) "Dashboard" (1440x900) — label: "L2" — shows: ES Breadcrumb + page body

### 5. Project - Shared Chats empty state

- id: `es-project-shared-chats`
- Title card: [`6565:493672`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493672)

1. [`6565:493733`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493733) "Dashboard" (1440x900) — label: "L2" — shows: ES Breadcrumb + page body

### 6. Project - Routines empty state

- id: `es-project-routines`
- Title card: [`6565:493674`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493674)

1. [`6565:493716`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493716) "Dashboard" (1440x900) — label: "L2" — shows: ES Breadcrumb + page body

### 7. Agents empty state

- id: `es-agents`
- Title card: [`6599:531689`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6599-531689)

1. [`6599:531692`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6599-531692) "Dashboard" (1440x900) — label: "L1"
2. [`6632:533338`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6632-533338) "Dashboard" (1440x900) — label: "L1"
3. [`6632:533395`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6632-533395) "Dashboard" (1440x900) — label: "L1"

### 8. Routines empty state

- id: `es-routines`
- Title card: [`6565:418200`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-418200)

1. [`6565:410734`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-410734) "1" (1440x900) — label: "L2" — shows: two Cursor layers (hover on the CTA)

## Section: Dropdowns

Section node [`9271:655350`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-655350), 36 direct children.

### 9. Drop-downs: Nav

- id: `dd-nav`
- Title card: [`9256:477311`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477311)

1. [`9256:477323`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477323) "Dashboard (instance)" (1440x900) — label: "Check main flow" — shows: menu: Run Now / Edit / Add to Project / Keyboard shortcuts (instance of 9256:477318 on the Search + Agent + Login page)

### 10. Chat History: Drop-downs

- id: `dd-chat-history`
- Title card: [`9271:534671`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-534671)

1. [`9271:534673`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-534673) "Dashboard" (1440x900)
2. [`9271:534832`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-534832) "Dashboard" (1440x900)

### 11. Drop-downs: Chat Journey

- id: `dd-chat-journey`
- Title card: [`9217:450855`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9217-450855)

1. [`9256:465529`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-465529) "Copilot Landing page (instance)" (1440x900) — label: "Check main flow" — shows: instance of Chat + Artifacts 9256:465524 (input-large step 2)
2. [`9256:466693`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-466693) "3 (instance)" (1440x900) — label: "Check main flow" — shows: instance of Chat + Artifacts 9256:466688 (chat-artifact step 3)
3. [`9256:468124`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-468124) "share (instance)" (1440x900) — shows: instance of Chat + Artifacts 9256:468119 (add-users step 2, share)

### 12. Drop-downs: Artifact

- id: `dd-artifact`
- Title card: [`9229:460505`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9229-460505)

1. [`9256:462657`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-462657) "Artifact Dropdowns" (1440x1380) — shows: tall artifact page (1380 high) holding the artifact menus
2. [`9256:473477`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-473477) "share (instance)" (1440x900) — label: "Check main flow" — shows: instance of Chat + Artifacts 9256:468119 (share)

### 13. Drop-downs: Routine

- id: `dd-routine`
- Title card: [`9256:474642`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-474642)

1. [`9256:474650`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-474650) "Routine Landing page" (1440x900) — shows: create popover: Create with AI / Create manually
2. [`9256:475979`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-475979) "Routine Landing page" (1440x900) — shows: routine row menu: Edit / Pause / Run now / Share
3. [`9256:483232`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-483232) "106" (1440x900) — shows: routine page (Page frame), no menu layer at top level
4. [`9256:484533`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-484533) "Dashboard" (1440x900) — shows: run menu: Open the session / Run it again / Pause / Edit with AI

### 14. Drop-downs: Projects (option 1)

- id: `dd-projects`
- Title card: [`9269:523680`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-523680)

1. [`9269:524880`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-524880) "Dashboard" (1440x900) — label: "option 1" — shows: cursor only, no menu layer at top level
2. [`9269:527950`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-527950) "Dashboard" (1440x900) — shows: menu with user search (Olivia Rhye, Search) then Pin / Mark as unread
3. [`9269:528038`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-528038) "Dashboard" (1440x900) — shows: same layers as the previous step (user search menu), a second state
4. [`9271:530740`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-530740) "Dashboard" (1440x900) — shows: create popover: Create with AI / Create manually
5. [`9271:530761`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-530761) "Dashboard" (1440x900) — shows: chat row menu: Pin / Rename / Add to Project / Keyboard shortcuts
6. [`9271:530700`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-530700) "Dashboard" (1440x970) — shows: page with no menu layer, 970 high

### 15. Drop-downs: Settings (option 2a)

- id: `dd-settings`
- Title card: [`9271:625787`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625787)

1. [`9271:625183`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625183) "Modal Full Screen" (1440x900) — label: "option 2a" — shows: full-screen settings modal, connection menu: Re-authenticate / Remove Connection / Keyboard shortcuts

## Ignored options (Option 2 and later)

- [`9269:524909`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-524909) "Dashboard" (1440x900) — option 2; mapped choice is [`9269:524880`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-524880) in `dd-projects`. Shows the project menu open: Pin / Edit Project / Share Project / Keyboard shortcuts
- [`9271:625340`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625340) "Modal Full Screen" (1440x900) — option 2b; mapped choice is [`9271:625183`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625183) in `dd-settings`. No 'option 1' exists in this row; 2a is treated as the primary

## Loose frames (ignored by default)

- [`14977:393657`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14977-393657) "Screenshot 2026-10-08 at 11.06.29 AM 1" (598x455) — pasted reference screenshot (image rectangle) sitting above the Empty states section, outside any row
- [`6565:418198`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-418198) "-" (6x16) — stray text layer '-' inside the Routines row

## Cross-page links (duplicates or continuations of other pages)

- [`9256:465529`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-465529) "Copilot Landing page (instance)" (1440x900) → Chat + Artifacts `input-large` step 2 (instance of 9256:465524)
- [`9256:466693`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-466693) "3 (instance)" (1440x900) → Chat + Artifacts `chat-artifact` step 3 (instance of 9256:466688)
- [`9256:468124`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-468124) "share (instance)" (1440x900) → Chat + Artifacts `add-users` step 2 'share' (instance of 9256:468119)
- [`9256:473477`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-473477) "share (instance)" (1440x900) → Chat + Artifacts `add-users` step 2 'share' (instance of 9256:468119); also relevant to `share-artifact`
- [`9256:477323`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477323) "Dashboard (instance)" (1440x900) → Nav dropdown; instance of 9256:477318 which lives on the Search + Agent + Login page. Related to Chat + Artifacts `nav-light` / `nav-behaviour`
- [`6565:419134`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-419134) "38" (1440x900) → Artifacts empty state; Chat + Artifacts `artifacts-landing` starts with an empty state (3780:177209). Check for duplication
- [`6565:492532`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-492532) "Dashboard" (1440x900) → Projects empty state; feeds the Projects landing template (BUILD-PLAN template 7)
- [`6565:493676`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-493676) "Dashboard" (1440x900) → Project page tabs (Chat / Shared Chats / Routines) empty states; feed the Project page template (BUILD-PLAN template 8)
- [`6565:410734`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-410734) "1" (1440x900) → Routines empty state; feeds the Routines landing stub (BUILD-PLAN template 9)

Added in the overview pass (2026-10-09), now that the home pages are mapped:

- `6565:492532` Projects empty state is also drawn on Projects + Chat History: `projects-landing` step 1 (3415:323703, COMPONENT) and `project-new` step 1 (instance 3415:323706).
- `6565:493676` / `6565:493733` / `6565:493716` project-tab empty states are also drawn on Projects + Chat History: Chats tab empty in `project-chat` step 1 (901:212182) and `project-new` step 3 (14975:59510); Routines tab empty in `project-routines` step 1 (1489:269074).
- `6565:410734` Routines empty state is also drawn on Routines: `routines-landing` step 1 (875:162202, "First time user will see this Routine landing page").
- `6599:531692` Agents empty state: no Agents page is mapped. The agents page appears only as Search + Agent + Login `side-nav` step 3 (13766:125236, "agents page selected") and as the loose "Choose your agents" onboarding modal on Settings (9893:422543).
- `9271:534673` Chat History menus: home flow is Projects + Chat History `chat-history` (row menu 4853:244291: Pin / Rename / Add to Project / Delete; sort dropdown 3117:187519).
- `9256:474650` Routine menus: home flows are on Routines (create popover in `create-ai-*` / `create-manually`, row kebab menu in `routines-landing` step 3 11657:493405, run menu in `scheduled-sessions`).
- `9269:524880` Project menus: home flow is Projects + Chat History `project-menu-admin` (901:212387: Edit Project Details / Delete) and `project-menu-non-admin` (901:212281: Leave Project / Log out). The chat row menu here (9271:530761) ends in "Keyboard shortcuts" where `chat-history` 4853:244291 ends in "Delete". See `../MAP-OVERVIEW.md`.
- `9271:625183` Settings connection menu (Re-authenticate / Remove Connection / Keyboard shortcuts): the Settings page's own connector menu is 11750:515608 (Forget / Reconnect) in `connectors-disruption`. See `../MAP-OVERVIEW.md`.

## Doubts

1. **Projects dropdowns row: the 'option 1' frame shows only a cursor with no menu open, while the project menu (Pin / Edit Project / Share Project / Keyboard shortcuts) appears only in 'option 2'. Do the five frames after the two options continue option 1, or are they unrelated project-page menus laid side by side?**
   - Proposed default: Keep option 1 as step 1 (hover trigger). Treat the next five frames as separate menu states on the project page (share picker, create-routine popover, chat row menu), mapped left to right. Option 2's open menu stays ignored.
   - Figma: [9269-523680](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-523680), [9269-524880](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-524880), [9269-524909](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-524909), [9269-527950](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9269-527950)
2. **Settings dropdowns row has only 'option 2a' and 'option 2b' (no option 1). Which one is the design to build?**
   - Proposed default: Build option 2a (the leftmost) and record 2b as ignored, in line with the 'first option only' rule.
   - Figma: [9271-625787](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625787), [9271-625183](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625183), [9271-625340](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-625340)
