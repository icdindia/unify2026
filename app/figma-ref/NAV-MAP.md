# Nav map: what each nav item opens

File `lqKjNjyifEXCeywg69Knr2`. DRAFT 2026-10-09, written from the page maps only (no Figma access). Machine-readable copy: [`nav-map.json`](nav-map.json).

Sources: the nav code in `app/src/shell/nav/` (model.ts, NavItems.tsx, rows.tsx, Rail.tsx, Nav.tsx) plus `AppShell.tsx`, `App.tsx`, `routes.tsx` and `review/NotBuilt.tsx`; every `figma-ref/<page>/journeys.json` and `MAP.md`; `src/figma/journeys.chat-artifacts.json`, `frames.ts`, `frames.generated.ts` and the Chat + Artifacts `journey.md` notes and BUILD-PLAN; `MAP-OVERVIEW.md` (doubts D1-D24); and the 9 Oct drift report (`_drift-2026-10-09/DRIFT-REPORT.md`).

How to read it:

- **Opens** is the recommended entry frame. **Route today** is what the prototype does now.
- **Candidates** lists every frame that draws the same destination on any page. Higher node ids were usually drawn later. "Dimmed" frames sit at reduced opacity, which the D1 default reads as parked.
- **Reachable** counts the journeys and frames you can reach from the entry. Counts come from the journeys files. A journey with `(n of m)` means only those steps are reached. Ignored options are counted when a recommendation uses them. `header-dropdowns` has components only, so it counts 0 frames.
- Only Chat + Artifacts is confirmed. Every other page map is a draft, and so is every recommendation below.
- Q-numbers are the BUILD-PLAN questions (Q9-Q21 cover the shell). D-numbers are the doubts in MAP-OVERVIEW.md.

## Pages not mapped yet

- **All landing pages : Artifact Routine Projects** [`12382:295660`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12382-295660) (slug `landing-pages`). It matters for: Projects, Routines, Artifacts, Pinned > Artifacts.
- **Chrome Extension ES** [`13779:456774`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13779-456774) (slug `chrome-extension`). It matters for: New Session, Search (header icon, dark rail icon), Footer avatar / name / chevron -> account menu (and the rail avatar).

MAP-OVERVIEW expects the landing-pages page to repeat projects-landing, routines-landing and artifacts-landing. Its page id (12382) is newer than the Projects and Routines landing components (11657), so it may hold newer drawings of all three. Map it before building Routines or Artifacts, or re-capturing Projects.

## What the nav code has today

Every control in `app/src/shell/nav/`, with what it does now. Only four rows navigate (`NAV_PAGES` in model.ts:18 has new, projects, routines and artifacts). AppShell (AppShell.tsx:85-94) passes neither `onNotifications` nor `onAccountMenu`, so the footer buttons do nothing.

| Control | Modes | Code | Today |
|---|---|---|---|
| Logo + wordmark (expanded header) | dark, light | `shell/nav/Nav.tsx:45-48` | Static. Not a control in the expanded nav. |
| Search icon (expanded header) | dark, light | `shell/nav/Nav.tsx:50-52` | Button with no onClick: does nothing. |
| Collapse navigation (expanded header) | dark, light | `shell/nav/Nav.tsx:53-55` | rail.set('collapsed') through AppShell onCollapse; in the narrow overlay it closes the overlay. |
| New Session | dark, light, rail | `NavItems.tsx:20, :73; Rail.tsx:22, :31` | Link #/new (NAV_PAGES.new, model.ts:18). |
| Projects | dark, light, rail | `NavItems.tsx:22, :74; Rail.tsx:24, :32` | Link #/projects (built). |
| Routines | dark, light, rail | `NavItems.tsx:23, :75; Rail.tsx:25, :33` | Link #/routines (Not built yet placeholder). |
| Meetings | dark, light, rail | `NavItems.tsx:24, :76; Rail.tsx:26, :34` | Button: not in NAV_PAGES, so it only highlights the row (App.tsx setPicked) and never navigates. |
| Artifacts | dark, light, rail | `NavItems.tsx:26, :78; Rail.tsx:27, :35` | Link #/artifacts (Not built yet placeholder). |
| Search (rail icon) | rail dark only | `Rail.tsx:23` | No `to`: a button with no handler. The light rail has no Search, as drawn. |
| Agents (rail icon) | rail dark, rail light | `Rail.tsx:28, :36` | No `to`: a button with no handler. NavKey has no 'agents'. |
| Section header + chevron: Agents, Pinned, Routines, Chats (dark) / History (light) | dark, light | `NavItems.tsx:31, 37, 52, 57 / 83, 89, 97, 102; rows.tsx:189-218` | Collapses / expands the group in place (local state, aria-expanded). |
| Agent rows: Financial Analysis Agent, Sheet Sage Agent, Formula Falcon Agent | dark, light | `NavItems.tsx:32-34, :84-86; rows.tsx:96-108` | RowAction with no href and no onActivate: a button that does nothing. |
| Pinned > Artifacts | dark, light | `NavItems.tsx:38, :90` | NavRow without `to`: a button that does nothing (the diff harness pins its drawn hover). |
| Pinned > Projects | dark, light | `NavItems.tsx:39, :91` | NavRow without `to`: does nothing. Dark draws its two chats as a static tree; light draws no tree. |
| Pinned > project chats: 'Excel Formula Help From Main Document' (progress), 'Chat 2 inside this Project' (waiting) | dark only | `NavItems.tsx:43-44; rows.tsx:136-159` | ChatRow: an open button and a ⋯ button, neither has a handler. |
| Pinned > 'Plan launch timeline' (progress), 'Review customer feedback' (failed) | dark, light | `NavItems.tsx:47-48, :92-93` | Dark: open + ⋯, no handlers. Light: open only, no handler. |
| Routines rows: 'Get all granola notes summarized and del ' (waiting), 'Excel Formula Help From Main Document' (progress), 'Design Stand up follow-up  meeting' (progress) | dark, light | `NavItems.tsx:53-55, :98-100` | Dark: open + ⋯ (⋯ replaces the dot on hover), no handlers. Light: open only. |
| Chats rows (dark): 'Sheet Formula Consultant' (unread), 'Workbook Support Hub', 'Morning Digest' (2h), 'Spreadsheet Formula Advisor' | dark | `NavItems.tsx:58-61` | Open + ⋯ on hover, no handlers. The unread dot shows only with the nav-unread-dot fix. |
| History rows (light): 'Sheet Formula Consultant', 'Workbook Support Hub', 'Excel Formula Help From Main Document' x2 (one with 2h) | light | `NavItems.tsx:103-106; rows.tsx:163-186` | Open, plus an always-visible ⋯ on the first three. No handlers. |
| Footer: avatar + name | dark, light | `Nav.tsx:66-67, :79-80` | Spans, not controls. |
| Footer: Notifications bell | dark only | `Nav.tsx:69-71` | Calls onNotifications, which AppShell never passes (AppShell.tsx:85-94, 102, 110): does nothing. |
| Footer: Account menu chevron | dark, light | `Nav.tsx:72-74, :81-83` | Calls onAccountMenu, which AppShell never passes: does nothing. |
| Rail logo (Expand navigation) | rail dark, rail light | `Rail.tsx:57-59; AppShell.tsx:100` | rail.set('expanded'); below 1200 px it opens the expanded nav as an overlay with a scrim (Esc, scrim or a destination close it). |
| Rail footer avatar | rail dark, rail light | `Rail.tsx:78` | Span, not a control. |

Route results today:

- `#/new`: built (LandingPage).
- `#/projects`: built (ProjectsPage); `#/projects/<slug>` opens the dashboard.
- `#/routines`: "Not built yet: Routines landing", with no frame.
- `#/artifacts`: "Not built yet", showing artifacts-landing 02 (7907:305055).
- Meetings, Search, Agents, every list row, every ⋯ and both footer buttons: nothing.

## Nav items

### 1. New Session

- **Controls:** primary row (dark + light); rail icon (dark + light).
- **Code:** NavRow to='new' (NavItems.tsx:20, :73), Rail item (Rail.tsx:22, :31); NAV_PAGES.new = '/new'. The chat screens also highlight it (app/screenNav.ts).
- **Route today:** `/new`, built. LandingPage (routes.tsx:83-93): draws chat-artifact 01-02 (compose, hover, seed=no-chips). Other /new keys (menu=account, drag=, open=, modal=) are ignored and reported as a closest match.
- **Opens:** Chat + Artifacts · `chat-artifact` step 01 · [`1707:136008`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136008) · 1440x900. Rail collapsed. With the rail expanded the same landing is nav-behaviour 01 (11614:672894).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `chat-artifact` · 01 | [`1707:136008`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136008) | (name not recorded) | 1440x900 | 100% | Confirmed page, routed /new?rail=c, already built. Dark collapsed rail, composer with the Company / Research chips. |
| Chat + Artifacts | `nav-behaviour` · 01 | [`11614:672894`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894) | Copilot Landing page | 1440x900 | 100% | The same landing with the dark nav expanded (/new?seed=no-chips&rail=e). Newer id (11614). Drift 9 Oct: only the status dots changed. |
| Chat + Artifacts | `logo-options` · 01 | [`3612:167773`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-167773) | COMPONENT "1" | 1440x900 | 100% | Circular-dots logo, no chips (/new?seed=no-chips&rail=c). Option 1 of the logo row. |
| Chat + Artifacts | `input-large` · 01 | [`5220:222334`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5220-222334) | Copilot Landing page | 1440x900 | 100% | Alias of the same URL; the source of the rotating placeholder. |
| Chat + Artifacts | `nav-light` · 01 | [`12829:289253`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-289253) | 208 | 1440x900 | 100% | The landing in light mode (nav=light); 02 (12829:292060, "209") is the same with the rail expanded. |
| Notifications | `notification-collapsed-1` (ignored option) · option 2 / 1 | [`14045:596902`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-596902) | Copilot Landing page | 1440x900 | 100% (ignored option, see D1) | Newest landing drawing (14045). Dark collapsed rail with an unread badge on the avatar: it starts the account-menu flow, it is not a different landing. |
| Notifications | `notification-collapsed-1` · 01 | [`13760:757632`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-757632) | Copilot Landing page | 1440x900 | 30% (dimmed) | Parked option 1 of Notifications. |
| Settings | `connectors-input-error` · 01 | [`10179:645699`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10179-645699) | Copilot Landing page | (size not recorded) | 100% | The landing with the composer + menu open (a composer state, not an entry). |
| All Empty states & Dropdowns | `es-desktop-default-cta` · 01 | [`13807:181877`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13807-181877) | Browser | 1440x900 | 100% | Empty state inside a browser frame with no Main_nav. Probably the extension / desktop default, not the web landing. |

Reachable from the entry: 40 journeys, 204 frames, on 6 pages.

- Chat + Artifacts (19 journeys, 137 frames): `chat-artifact` (22), `input-large` (24), `logo-options` (1), `enhance-prompt` (5), `thinking` (2), `graphs` (6), `cost` (9), `chat-questions` (1), `new-memory` (3), `queue-1` (16), `consecutive` (1), `add-users` (11), `collab-chat` (10), `share-artifact` (10), `deleted-artifact` (1), `publish-artifact` (1), `canvas-comments` (4), `header-dropdowns` (0, components only), `commenters` (10).
- Settings (1 journey, 2 frames): `connectors-input-error` (2).
- All Empty states & Dropdowns (1 journey, 3 frames): `dd-chat-journey` (3).
- Artifacts | Draft a Mail (12 journeys, 37 frames): `draft-mail` (8), `draft-mail-ai-edit` (10), `draft-mail-attachments` (4), `split-50-50` (1), `artifact-only` (1), `artifact-only-viewer` (2), `edit-with-ai` (3), `one-provider` (1), `one-provider-not-connected` (2), `no-provider` (1), `attachment-failed-preview` (3), `add-recipient-alert` (1, dimmed).
- Artifacts | Flow Charts (6 journeys, 19 frames): `fc-artifact-ui` (6), `fc-staging-comments` (9), `fc-color-options` (1), `fc-nodes-icons` (1), `fc-viewing-sources` (2), `fc-swimlanes` (0, dimmed).
- Comments on Artifact (1 journey, 6 frames): `comment-on-artifact` (6).

**Unmapped page, Chrome Extension ES:** May hold an extension-side composer / New Session (Settings > Get App & Extensions lists a Chrome Extension). It would be a second surface, not a change to the web nav entry.

**Recommendation:** Keep /new as built. Entry chat-artifact 01 (1707:136008) with the rail collapsed, nav-behaviour 01 (11614:672894) with it expanded. No change needed.

**Confidence:** high. No confirmation needed.

### 2. Search (header icon, dark rail icon)

- **Controls:** expanded header icon (dark + light); rail icon (dark only).
- **Code:** Nav header button (Nav.tsx:50-52) has no onClick. The dark rail item (Rail.tsx:23) has no `to`, so it renders as a button with no handler. The light rail draws no Search; the light expanded header does.
- **Route today:** none. Nothing happens on click.
- **Opens:** Search + Agent + Login · `search` step 01 · [`13766:124224`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124224) · 1440x900. Full-screen search modal over the page (drawn with the collapsed nav).
- **Proposed route:** ?modal=search on the current route (new key: BUILD-PLAN 2.1 has no search value).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Search + Agent + Login | `search` · 01 | [`13766:124224`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124224) | Dashboard | 1440x900 | 100% | The only drawing of the global search: collapsed nav + full-screen search modal. Label 'Agent 5 · Project 5' (probably the counts listed in the modal). Page ids are recent (13766). |
| Search + Agent + Login | `search` · 02-04 | [`13766:124306`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124306) | Dashboard | 1440x900 | 100% | Later states of the same modal (13766:124306, 13766:124265, 13766:124550). Contents were mapped from layer names only. |
| Projects + Chat History | `chat-history` · 08 | [`6877:502572`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6877-502572) | Dashboard | 1440 wide | 100% | Search typed 'Hello' on the History page: an in-page search, not the nav search. |
| Chat + Artifacts | `artifacts-landing` · 04 | [`8412:194488`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8412-194488) | 185 | 1728x2026 | 100% | Search field expanded on the Artifacts toolbar: an in-page search. |

Reachable from the entry: 1 journey, 4 frames, on 1 page.

- Search + Agent + Login (1 journey, 4 frames): `search` (4).

**Unmapped page, Chrome Extension ES:** Not mapped. It may hold another search surface (the extension), so check it before building search states 02-04.

**Recommendation:** Both the header icon and the dark-rail icon open the full-screen search modal (search 01, 13766:124224) over the current page; steps 02-04 are its states. Add a route key such as ?modal=search.

**Confidence:** medium. **Needs your confirmation:** Is the full-screen modal on 'Search + Agent + Login' (13766:124224 to 13766:124550) the global search for both the header icon and the rail icon? Should the light rail get a Search icon too (the light expanded header has one)? Related doubts: D6.

### 3. Projects

- **Controls:** primary row (dark + light); rail icon (dark + light).
- **Code:** NavRow to='projects' (NavItems.tsx:22, :74), Rail item (Rail.tsx:24, :32); NAV_PAGES.projects = '/projects'. The designed rest state selects it.
- **Route today:** `/projects`, built. ProjectsPage (routes.tsx:66-68), tagged 11657:386523 (frames.ts). A card opens /projects/:slug (ProjectDashboard: 14045:584747, and 15054:105151 with opt=2).
- **Opens:** Projects + Chat History · `projects-landing` step 02 · [`11657:386523`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386523) · 1440x900 (via its instance 11657:386528). Labelled "option 1". COMPONENT.
- **Map discrepancy:** The Projects + Chat History map describes 11657:386523 as a list of 'project rows'; the capture of its instance (chat-artifacts/pinning/02-11657-386528.png) shows a 3-column card grid with a grid / list toggle. The ignored option 2 (4767:136175) is also a card grid. The prototype follows the capture.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Projects + Chat History | `projects-landing` · 02 | [`11657:386523`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386523) | Dashboard (COMPONENT) | 1440x900 (via instance 11657:386528) | 100% | On its home page, labelled option 1, the newest landing drawing (11657), main component of Chat + Artifacts pinning 02. Already built and hand-routed in frames.ts. Drift 9 Oct (theme D): cards lost '12 items', one status icon instead of four, All Types / Newest unfilled. |
| Projects + Chat History | `projects-landing` · 01 | [`3415:323703`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3415-323703) | Dashboard (COMPONENT) | 1440 wide (height not recorded) | 100% | Empty state: 'Create a Project' card with New Project. |
| Projects + Chat History | `project-new` · 01 | [`3415:323706`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3415-323706) | Dashboard (INSTANCE of 3415:323703) | 1440 wide | 100% | The same empty state, as the first step of New project. |
| Projects + Chat History | `projects-landing` (ignored option) · option 2 | [`4767:136175`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4767-136175) | Dashboard | 1440 wide | 100% (ignored option) | Older (4767) card grid ('Marketing Research · 12 items'). Parked by the option 1 rule. |
| Chat + Artifacts | `pinning` · 02 | [`11657:386528`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386528) | Dashboard | 1440x900 | 100% | Instance of 11657:386523 with a card menu open (Pin hovered). Routed /projects?menu=card:docebo-ui-assets&hover=menu:pin&rail=e. |
| All Empty states & Dropdowns | `es-projects` · 01 | [`6565:492532`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-492532) | Dashboard | 1440x900 | 100% | Redraw of the empty state (L1). D4 default: if its empty-state block differs, this later drawing wins. |

Reachable from the entry: 18 journeys, 64 frames, on 4 pages.

- Projects + Chat History (10 journeys, 48 frames): `projects-landing` (2), `project-new` (4), `project-chat` (3), `project-share` (10), `project-routines` (2), `project-settings` (9), `project-menu-admin` (2), `project-menu-non-admin` (2), `project-tabs-new` (3), `instructions-ai-edit` (11).
- Chat + Artifacts (2 journeys, 3 frames): `pinning` (1 of 3 frames), `nav-behaviour` (2 of 9 frames, project page with the title pin).
- Settings (1 journey, 3 frames): `project-memory` (3).
- All Empty states & Dropdowns (5 journeys, 10 frames): `es-projects` (1), `es-project-chat` (1), `es-project-shared-chats` (1), `es-project-routines` (1), `dd-projects` (6).

**Unmapped page, All landing pages : Artifact Routine Projects:** Not mapped. MAP-OVERVIEW expects it to repeat projects-landing; its page id (12382) is newer than 11657, so it may hold a newer drawing of this landing.

**Recommendation:** Keep /projects on 11657:386523 as built, updated with the 9 Oct card changes (theme D). Empty state 3415:323703, using the 6565:492532 block if it differs (D4). Map the landing-pages page before the next re-capture.

**Confidence:** high. No confirmation needed. Related doubts: D4, D7.

### 4. Routines

- **Controls:** primary row (dark + light); rail icon (dark + light).
- **Code:** NavRow to='routines' (NavItems.tsx:23, :75), Rail item (Rail.tsx:25, :33); NAV_PAGES.routines = '/routines'.
- **Route today:** `/routines`, placeholder. Renders 'Not built yet: Routines landing' (review/NotBuilt.tsx template) with no frame: the only /routines frame is pinning 03 (menu=row:board-pre-read), and the closest-match pass never drops menu=.
- **Opens:** Routines · `routines-landing` step 03 · [`11657:493405`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493405) · 1440x900. With its row menu closed (no frame draws that rest state with a current id).
- **Proposed route:** /routines (rest), /routines?seed=empty (first-time), /routines?menu=row:<id> (pinning 03). Add a /routines?rail=e frame entry for 11657:493405 so the bare nav URL resolves to a frame.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Routines | `routines-landing` · 01 | [`875:162202`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=875-162202) | Routine Landing page (COMPONENT) | 1440x900 | 100% | 'First time user will see this Routine landing page'. 56 px rail. |
| Routines | `routines-landing` · 02 | [`334:112714`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112714) | Routine Landing page | 1440x900 | 100% | 'Second time user will see this': the only populated frame with no row menu, but the oldest id (334). Carries a 340x220 popover and a 20% note 'errors in routine? - indication?'. |
| Routines | `routines-landing` · 03 | [`11657:493405`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493405) | Routine Landing page (COMPONENT) | 1440x900 | 100% | Newest drawing (11657), 280 px rail, row kebab menu open. Main component of Chat + Artifacts pinning 03; BUILD-PLAN item 61 builds RoutinesLanding from it. |
| Chat + Artifacts | `pinning` · 03 | [`11657:493696`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493696) | Routine Landing page | 1440x900 | 100% | Instance of 11657:493405 with the pinned row menu open (Unpin, Edit, Pause, Run Now, Share, Delete). The only routed Routines frame. Drift 9 Oct: dots only. |
| All Empty states & Dropdowns | `es-routines` · 01 | [`6565:410734`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-410734) | 1 | 1440x900 | 100% | Redraw of the empty state with the CTA hovered (badge L2). D4 default: this block wins over 875:162202 if they differ. |
| All Empty states & Dropdowns | `dd-routine` · 01-02 | [`9256:474650`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-474650) | Routine Landing page | 1440x900 | 100% | Menus on the landing: create popover (Create with AI / Create manually) and, in 9256:475979, the row menu (Edit / Pause / Run now / Share). |

Reachable from the entry: 13 journeys, 61 frames, on 3 pages.

- Routines (10 journeys, 55 frames): `routines-landing` (3), `create-ai-first-time` (15), `create-ai-second-time` (2), `create-manually` (5), `routine-to-project` (3), `templates` (5), `view-edit` (9), `read-more` (3), `scheduled-sessions` (7), `help-text` (3).
- Chat + Artifacts (1 journey, 1 frame): `pinning` (1 of 3 frames).
- All Empty states & Dropdowns (2 journeys, 5 frames): `es-routines` (1), `dd-routine` (4).
- Chat-side entry: Chat + Artifacts publish-artifact runs in a chat called 'new-routine' (#/chat/new-routine/...).

**Unmapped page, All landing pages : Artifact Routine Projects:** Not mapped. Expected to repeat routines-landing and may hold a newer drawing (page id 12382 is newer than 11657).

**Recommendation:** /routines at rest = 11657:493405 with the row menu closed (populated, 280 px rail). seed=empty = first-time 875:162202, with the 6565:410734 block if it differs (D4). menu=row:<id> = pinning 03.

**Confidence:** medium. **Needs your confirmation:** Build the Routines landing from 11657:493405 with its row menu closed (the populated rest state is only drawn in the old 334:112714)? And should a first visit show the first-time page 875:162202 instead? Related doubts: D4.

### 5. Meetings

- **Controls:** primary row (dark + light); rail icon (dark + light).
- **Code:** NavRow to='meetings' (NavItems.tsx:24, :76), Rail item (Rail.tsx:26, :34). Not in NAV_PAGES: pressing it highlights the row (App.tsx setPicked) and never navigates; the next route change drops the highlight.
- **Route today:** none. Selects the row only.
- **Opens:** Meetings · `meetings-home` step 01 · [`8490:262262`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8490-262262) · 1440x900. 'Meeting Listing Page'.
- **Proposed route:** /meetings (new template); seed=first-time -> onboarding 01, seed=no-calendar -> 12618:544826, seed=empty -> meetings-home 05.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Meetings | `meetings-home` · 01 | [`8490:262262`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8490-262262) | 01 | 1440x900 | 100% | 'Meeting Listing Page'. The title card links the older HTML prototype (dist-one-psi-98.vercel.app/#meetings). |
| Meetings | `meetings-home` · 05 | [`8663:56472`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8663-56472) | 05 | 1440x900 | 100% | 'Empty State'. |
| Meetings | `meetings-home` · 06-08 | [`13185:846896`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13185-846896) | 202 | 1440x900 | 100% | 'Highlighted State', then hover states (13185:848346 '203', 13185:850454 '204'). Much newer ids (13185 against 8490), so the listing may have been redrawn: compare with 01. |
| Meetings | `onboarding` · 01 | [`9325:402586`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9325-402586) | 01 | 1440x900 | 100% | 'Onboarding Landing' for a first-time user. A state above (9325:400673 'Option 01') drops the Meetings page header. |
| Meetings | `meetings-home-no-calendar` · 01 | [`12618:544826`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12618-544826) | 197 | 1440x900 | 100% | Meetings added, no calendar connected ('#01 Card with graphics'). Newer (12618). |

Reachable from the entry: 16 journeys, 69 frames, on 1 page.

- Meetings (16 journeys, 69 frames): `onboarding` (7), `meetings-home` (8), `meetings-home-no-calendar` (1), `meeting-briefs` (9), `people-insights` (3), `proactive-artefacts` (4), `meeting-details` (5), `meeting-details-people` (4), `ask-meeting` (2), `cues` (5), `native-recording` (9), `meeting-summaries` (2), `templates` (6), `multiplayer-invite` (1), `multiplayer-presence` (1), `connection-error` (2).
- Not reached from the web nav: the three macOS rows desktop-mac, teams-notifications and system-tray (14 frames at 1504x945; D13 proposes a separate /desktop route).

**Recommendation:** Add a /meetings route and NAV_PAGES entry. Default to the listing 8490:262262 (with the 13185 states if the listing was redrawn), onboarding 9325:402586 for a first-time user, 12618:544826 and 8663:56472 as seeds.

**Confidence:** medium. **Needs your confirmation:** Which Meetings page does the nav open by default: the listing (8490:262262), onboarding for a first-time user (9325:402586), or the no-calendar state (12618:544826)? Are the newer listing states (13185:846896 to 13185:850454) the current look of the listing? Related doubts: D13, D14, D15.

### 6. Artifacts

- **Controls:** primary row (dark + light); rail icon (dark + light).
- **Code:** NavRow to='artifacts' (NavItems.tsx:26, :78), Rail item (Rail.tsx:27, :35); NAV_PAGES.artifacts = '/artifacts'.
- **Route today:** `/artifacts`, placeholder. Renders 'Not built yet' with artifacts-landing 02 (7907:305055): an exact match with the rail collapsed, the closest match with it expanded.
- **Opens:** Chat + Artifacts · `artifacts-landing` step 02 · [`7907:305055`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7907-305055) · 1440x1380. Grid at rest; routed /artifacts?rail=c.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `artifacts-landing` · 01 | [`3780:177209`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3780-177209) | 38 | 1440x900 | 100% | Empty state (seed=empty). |
| Chat + Artifacts | `artifacts-landing` · 02 | [`7907:305055`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7907-305055) | 132 | 1440x1380 | 100% | Grid at rest on the confirmed page; already the frame the nav URL lands on. Drift 9 Oct: new type icons, cards ~4 px shorter (themes A, E). |
| Chat + Artifacts | `artifacts-landing` · 03 | [`12868:502599`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12868-502599) | 1729 | 1440x827 | 100% | List view (view=list). Newest rest-state drawing (12868). |
| Chat + Artifacts | `artifacts-landing` · 04 | [`8412:194488`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8412-194488) | 185 | 1728x2026 | 100% | 1728 px, search expanded. 1440 is the only baseline, so use it for the search state only. |
| Chat + Artifacts | `artifacts-landing` · 05 | [`11648:688356`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11648-688356) | COMPONENT "186" | 1440x1380 | 100% | States sheet (tooltip, type filter, both card menus). Pinning 01 (11648:688362) is its instance. |
| Chat + Artifacts | `cloned-artifact` · 01 | [`13750:280936`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13750-280936) | 1744 | 1440x1648 | 100% | Newest grid drawing (13750), but with the Clone menu open and the cloned card added (seed=cloned). |
| All Empty states & Dropdowns | `es-artifacts` · 01-02 | [`6565:419134`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6565-419134) | 38 | 1440x900 | 100% | Redraws of the empty state (badge L1). Same frame name '38' as 3780:177209; 6565:420865 ('39') is the second. D4 applies. |
| Projects + Chat History | `project-tabs-new` · 01-02 | [`12085:590629`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12085-590629) | Dashboard | 1440 wide | 100% | The project page's Artifacts tab (with 12097:592297). Not the nav destination. |

Reachable from the entry: 21 journeys, 76 frames, on 5 pages.

- Chat + Artifacts (10 journeys, 44 frames): `artifacts-landing` (8), `cloned-artifact` (3), `pinning` (1 of 3 frames), `artifact-full-editor` (6), `artifact-view-editor-main` (3), `artifact-view-viewer` (8), `commenters` (10), `publish-artifact` (1), `canvas-comments` (4), `header-dropdowns` (0, components only).
- Comments on Artifact (1 journey, 6 frames): `comment-on-artifact` (6).
- Artifacts | Flow Charts (6 journeys, 19 frames): `fc-artifact-ui` (6), `fc-staging-comments` (9), `fc-color-options` (1), `fc-nodes-icons` (1), `fc-viewing-sources` (2), `fc-swimlanes` (0, dimmed).
- Artifacts | Draft a Mail (2 journeys, 3 frames): `artifact-only` (1), `artifact-only-viewer` (2).
- All Empty states & Dropdowns (2 journeys, 4 frames): `es-artifacts` (2), `dd-artifact` (2).

**Unmapped page, All landing pages : Artifact Routine Projects:** Not mapped. Expected to repeat artifacts-landing; check it for a newer grid before building.

**Recommendation:** Keep /artifacts on 7907:305055 (grid at rest), with 3780:177209 for seed=empty and 12868:502599 for view=list. Build it with the 9 Oct icon and card changes. Every Artifacts frame draws the rail collapsed; the rail stays the user's choice (Q9).

**Confidence:** high. No confirmation needed. Related doubts: D4.

### 7. Agents (rail icon) / Agents page

- **Controls:** rail icon (dark + light); the 'Agents' group title in the expanded nav only collapses its rows.
- **Code:** Rail item 'Agents' (Rail.tsx:28, :36) has no `to`: a button with no handler that never selects. NavKey has no 'agents'.
- **Route today:** none. Nothing happens on click.
- **Opens:** Search + Agent + Login · `side-nav` step 03 · [`13766:125236`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125236) · 1440x900. 'agents page selected' in the nav. The page content was not read.
- **Proposed route:** /agents with NavKey 'agents' (new template).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Search + Agent + Login | `side-nav` · 03 | [`13766:125236`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125236) | Dashboard | 1440x900 | 100% | The only frame with an Agents destination selected ('agents page selected'). |
| All Empty states & Dropdowns | `es-agents` · 01-03 | [`6599:531692`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6599-531692) | Dashboard | 1440x900 | 100% | Agents page empty state (L1), three frames: 6599:531692, 6632:533338, 6632:533395. |
| Settings | `(loose)` · - | [`9893:422543`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-422543) | Content | 600x836 | 100% | 'Choose your agents · 6 agents enabled · Continue': an onboarding modal with no home page. |

Reachable from the entry: 2 journeys, 4 frames, on 2 pages.

- Search + Agent + Login (1 journey, 1 frame): `side-nav` (1 of 7 frames).
- All Empty states & Dropdowns (1 journey, 3 frames): `es-agents` (3).

**Recommendation:** Add an 'agents' destination (/agents): selected state as 13766:125236, empty state 6599:531692. Hold the page content until the designer says what it lists.

**Confidence:** low. **Needs your confirmation:** Is there an Agents page beyond the empty state (6599:531692) and the 'agents page selected' frame (13766:125236)? What does it list? Related doubts: D6.

### 8. Agents group rows (Financial Analysis Agent, Sheet Sage Agent, Formula Falcon Agent)

- **Controls:** 3 rows under Agents (dark + light).
- **Code:** AgentRow (NavItems.tsx:32-34, :84-86; rows.tsx:96-108) is a RowAction with no href and no onActivate: a button that does nothing.
- **Route today:** none. Nothing happens on click.
- **Opens:** Search + Agent + Login · `side-nav` step 01 · [`13766:124934`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124934) · 1440x900. Agent-selector state ('bg color: Brand 500 + 30% of #000000'). No frame shows where a click lands.
- **Proposed route:** /new?agent=<id> (a New Session scoped to the agent; new key).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Search + Agent + Login | `side-nav` · 01 | [`13766:124934`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124934) | Dashboard | 1440x900 | 100% | Section 'Search + Model Switch + agent selector sidenav'. Label 'bg color: Brand 500 + 30% of #000000' (probably the selected agent row). Menu open + cursor. |
| Search + Agent + Login | `side-nav` · 04, 05, 07 | [`13766:125856`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125856) | Dashboard | 1440x900 | 100% | More menus and cursors in the same row (13766:125856, 13766:125232, 13766:125239). Contents were not read. |
| Search + Agent + Login | `side-nav-parked` · 01-02 | [`13766:126158`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126158) | Dashboard | 1440x900 | 20% (dimmed) | Parked states (13766:126158, 13766:125554). |

Reachable from the entry: 2 journeys, 9 frames, on 1 page.

- Search + Agent + Login (2 journeys, 9 frames): `side-nav` (7), `side-nav-parked` (2, dimmed).

**Recommendation:** Treat a click as choosing that agent for a new session: open /new with the agent selected and the row drawn in the 13766:124934 colour. Read side-nav 01, 04, 05 and 07 before building.

**Confidence:** low. **Needs your confirmation:** What does clicking an agent in the nav do: start a new session with that agent, or open the agent's own page? The row is titled 'agent selector' but no frame shows the result. Related doubts: D6.

### 9. Pinned > Artifacts

- **Controls:** pinned row (dark + light).
- **Code:** NavRow without `to` (NavItems.tsx:38, :90): a button with no handler. The dark row pins its drawn hover in the diff harness.
- **Route today:** none. Nothing happens on click.
- **What the row is:** A single pinned artifact whose placeholder title is 'Artifacts': its ⋯ menu (nav-behaviour 09) is Unpin / Move Up / Move Down / Download / Delete, which only makes sense for one artifact.
- **Opens:** Chat + Artifacts · `artifact-full-editor` step 01-06 · [`7809:278865`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865) · 1440x900. In-shell full view by type (01 App 7809:278865, 02 Spreadsheet 7809:273518, ...), without the back button (not from=artifacts).
- **Proposed route:** /artifacts/<id> (template 5); ⋯ = menu=pin:artifacts (already the URL of nav-behaviour 09).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `nav-behaviour` · 09 | [`11635:685715`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11635-685715) | Copilot Landing page | 1440x900 | 100% | The row itself: hover with the open arrow and its ⋯ menu (Unpin, Move Up, Move Down, Download, Delete). |
| Chat + Artifacts | `artifact-full-editor` · 01 | [`7809:278865`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865) | 118 | 1440x900 | 100% | App artifact full view inside the shell (/artifacts/acme-app?from=artifacts). 02-06 are the other types. |
| Chat + Artifacts | `artifact-view-editor-main` · 01 | [`5310:276790`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5310-276790) | 77 | 1440x900 | 100% | Standalone full-screen editor (/view/reference-xls), 'from main artifact page'. |
| Chat + Artifacts | `artifact-view-viewer` · 01 | [`3838:248160`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3838-248160) | 1 | 1440x900 | 100% | Standalone viewer (role=viewer). |

Reachable from the entry: 4 journeys, 13 frames, on 1 page.

- Chat + Artifacts (4 journeys, 13 frames): `nav-behaviour` (1 of 9 frames), `drag-pinned` (3), `artifact-full-editor` (6), `artifact-view-editor-main` (3).

**Unmapped page, All landing pages : Artifact Routine Projects:** May redraw the pinned state of an artifact on the Artifacts landing.

**Recommendation:** Open the artifact in the shell (/artifacts/<id>, artifact-full-editor by type, no back button). The hover open-arrow goes to the same place. ⋯ opens the nav-behaviour 09 menu (Move Up hidden on the first pin, Move Down on the last: Q14).

**Confidence:** low. **Needs your confirmation:** Is 'Artifacts' under Pinned one pinned artifact (its menu has Download and Delete)? Does it open inside the shell (/artifacts/<id>) or standalone (/view/<id>)?

### 10. Pinned > Projects

- **Controls:** pinned row (dark + light).
- **Code:** NavRow without `to` (NavItems.tsx:39, :91): a button with no handler. Dark draws its two chats as a static tree; light draws no tree.
- **Route today:** none. Nothing happens on click. /projects/project-name already resolves (NAV_BEHAVIOUR_PROJECT in data/projects.ts) and renders the dashboard.
- **What the row is:** A single pinned project (nav-behaviour 04 and the drag frames call it 'Project Name'); its menu is Unpin / Move Down / Edit Project / Share Project / Delete.
- **Opens:** Projects + Chat History · `project-chat` step 03 · [`14045:584747`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-584747) · 1440 wide. Project page layout (D7 default), title pin filled as in nav-behaviour 08 (11780:448662).
- **Proposed route:** /projects/project-name (seed=project-pinned); chevron = open=pin:project; ⋯ = menu=pin:project.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `nav-behaviour` · 02 | [`11614:676434`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-676434) | Copilot Landing page | 1440x900 | 100% | Hover: open arrow + ⋯. |
| Chat + Artifacts | `pinned-chevron` · 01-02 | [`11661:497681`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-497681) | (name not recorded) | 1440x900 | 100% | Hover: a chevron replaces the folder; clicking it expands the chats (11661:514386). Q13 default prefers this to the arrow. |
| Chat + Artifacts | `nav-behaviour` · 03 | [`11715:658763`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-658763) | Copilot Landing page | 1440x900 | 100% | Expanded with its ⋯ menu: Unpin, Move Down, Edit Project, Share Project, Delete. |
| Chat + Artifacts | `nav-behaviour` · 07 | [`13701:756891`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13701-756891) | Group 1171274973 | 1440x900 | 100% | The project page reached from the pinned project (View All / open arrow). Older tab name 'Context', title pin unfilled, routed /projects/project-name?... |
| Chat + Artifacts | `nav-behaviour` · 08 | [`11780:448662`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11780-448662) | Group 1171274972 | 1440x900 | 100% | Same page with the project pinned (filled pin, tooltip 'Unpin Project'). |
| Projects + Chat History | `project-chat` · 03 | [`14045:584747`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-584747) | Dashboard (INSTANCE of 11715:643488) | 1440 wide | 100% | The built project page (tab 'Files'); D7 default. |
| Projects + Chat History | `project-new` · 04 | [`15054:105151`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15054-105151) | Dashboard | 1440 wide | 100% | Newest project page (pill tabs, small header buttons): the prototype opt=2. |

Reachable from the entry: 12 journeys, 57 frames, on 3 pages.

- Chat + Artifacts (3 journeys, 12 frames): `nav-behaviour` (7 of 9 frames), `pinned-chevron` (2), `drag-pinned` (3).
- Projects + Chat History (8 journeys, 42 frames): `project-chat` (3), `project-share` (10), `project-routines` (2), `project-settings` (9), `instructions-ai-edit` (11), `project-menu-admin` (2), `project-menu-non-admin` (2), `project-tabs-new` (3).
- Settings (1 journey, 3 frames): `project-memory` (3).

**Recommendation:** Name opens /projects/project-name (layout 14045:584747, pin filled as 11780:448662). The chevron over the folder toggles its chats (Q13 default, pinned-chevron). ⋯ opens the nav-behaviour 03 menu.

**Confidence:** medium. **Needs your confirmation:** Confirm Q13 (the chevron toggles the chats, the name opens the project, the open arrow is dropped). Is the project page 14045:584747 (tab 'Files', D7) rather than nav-behaviour 07's 'Context' version (13701:756891)? Related doubts: D7.

### 11. Pinned > project chats (+ View All)

- **Controls:** 'Excel Formula Help From Main Document', 'Chat 2 inside this Project' (dark only); View All (drawn, not built).
- **Code:** ChatRow x2 inside the static tree (NavItems.tsx:43-44): open + ⋯ buttons with no handlers. No View All row in code.
- **Route today:** none. Nothing happens on click.
- **Opens:** Chat + Artifacts · `chat-artifact` step 08 · [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) · 1440x900. Chat template at rest with the rail expanded (/chat/commit?at=answer&rail=e). No frame draws a chat opened from inside a project.
- **Proposed route:** /chat/<id>; ⋯ = menu=pin-chat:<id> (submenu >switch-project); View All = /projects/project-name.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `nav-behaviour` · 04 | [`11614:677973`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-677973) | Copilot Landing page | 1440x900 | 100% | The chat ⋯ menu: Pin Chat, Rename, Switch Project ›, Remove from Project, Delete, with the Switch Project picker. |
| Chat + Artifacts | `nav-behaviour` · 05 | [`11693:260033`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11693-260033) | Copilot Landing page | 1440x900 | 100% | More than 10 chats: the list stops at 10 and adds View All. |
| Chat + Artifacts | `nav-behaviour` · 06 | [`11715:627268`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11715-627268) | Copilot Landing page | 1440x900 | 100% | View All hovered. |
| Chat + Artifacts | `nav-behaviour` · 07 | [`13701:756891`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13701-756891) | Group 1171274973 | 1440x900 | 100% | Where View All lands (Q16 default: the project page). |
| Chat + Artifacts | `chat-artifact` · 08 | [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) | (name not recorded) | 1440x900 | 100% | The only drawing of a chat at rest in the shell with the rail expanded. |

Reachable from the entry: 2 journeys, 26 frames, on 1 page.

- Chat + Artifacts (2 journeys, 26 frames): `nav-behaviour` (4 of 9 frames), `chat-artifact` (22).

**Recommendation:** A project chat opens the chat page (/chat/<id>, chat template). Its ⋯ opens the nav-behaviour 04 menu, anchored to its own row (Q14). Past 10 chats show View All, which opens the project page (Q16).

**Confidence:** medium. **Needs your confirmation:** Does a chat inside a pinned project open the normal chat page (with the project in its breadcrumb)? No frame draws it.

### 12. Pinned > 'Plan launch timeline', 'Review customer feedback'

- **Controls:** 2 pinned rows (dark: open + ⋯; light: open only).
- **Code:** ChatRow (NavItems.tsx:47-48) / LightChatRow (:92-93): no handlers.
- **Route today:** none. Nothing happens on click.
- **What the row is:** Pinned rows mix item types: when 'Plan launch timeline' is unpinned it returns to the Routines group (drag-unpin 02, 11671:670376), so it is a routine. 'Review customer feedback' has no drawn home.
- **Opens:** Chat + Artifacts · `chat-artifact` step 08 · [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) · 1440x900. For a pinned chat. A pinned routine opens the routine page (see Routines rows).
- **Proposed route:** /chat/<id> for a chat, the routine page for a routine; drag= keys already exist (drag-unpin, drag-pinned).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `drag-unpin` · 01 | [`11671:666296`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-666296) | (name not recorded) | 1440x900 | 100% | 'Plan launch timeline' dragged out of Pinned with 'Release to unpin'. |
| Chat + Artifacts | `drag-unpin` · 02 | [`11671:670376`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11671-670376) | (name not recorded) | 1440x900 | 100% | After release: it sits second in the Routines group. |
| Chat + Artifacts | `drag-pinned` · 01-03 | [`11661:517917`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11661-517917) | (name not recorded) | 1440x900 | 100% | Reorder inside Pinned (11661:517917, 11671:661281, 11671:662888). |
| Chat + Artifacts | `chat-artifact` · 08 | [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) | (name not recorded) | 1440x900 | 100% | Chat page at rest, rail expanded. |

Reachable from the entry: 3 journeys, 6 frames, on 1 page.

- Chat + Artifacts (3 journeys, 6 frames): `drag-unpin` (2), `drag-pinned` (3), `nav-behaviour` (1 of 9 frames).

**Recommendation:** Open the item's own page (chat -> /chat/<id>, routine -> the routine page). No ⋯ menu is drawn for these rows: reuse the menu of the item's home group with Unpin in place of Pin. Drag to reorder and to unpin as drawn.

**Confidence:** low. **Needs your confirmation:** Is 'Review customer feedback' a chat (and 'Plan launch timeline' a routine, as drag-unpin 02 shows)? Which ⋯ menu do pinned rows use? None is drawn.

### 13. Routines list rows (+ ⋯ menu)

- **Controls:** 'Get all granola notes summarized and del ', 'Excel Formula Help From Main Document', 'Design Stand up follow-up  meeting'.
- **Code:** Dark ChatRow x3 (NavItems.tsx:53-55): open + ⋯ (⋯ replaces the dot on hover), no handlers. Light LightChatRow x3 (:98-100): open only, no ⋯.
- **Route today:** none. Nothing happens on click.
- **Opens:** Routines · `scheduled-sessions` step 01 · [`1588:225613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1588-225613) · 1440x900. 'Landing screen : No runs in a session': the routine's runs.
- **⋯ opens:** Search + Agent + Login · `side-nav` step 06 · [`9256:477318`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477318) · 1440x900. 'three dots hover': Run Now / Edit / Add to Project / Keyboard shortcuts (D6 takes it, D5 drops Keyboard shortcuts).
- **Proposed route:** /routines/<id> (new template); ⋯ = menu=routine:<id> (new value).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Routines | `scheduled-sessions` · 01 | [`1588:225613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1588-225613) | 1 | 1440x900 | 100% | The routine's sessions. The row's status dot is a run state, and 'Error in run' lives in this journey. Alternate below: 8486:545082 ('140', long header). |
| Routines | `scheduled-sessions` · 07 | [`1608:374610`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1608-374610) | 137 | 1440x900 | 100% | Run view with more than one run (switch runs from the right panel). |
| Routines | `view-edit` · 01-02 | [`334:112794`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=334-112794) | Dashboard | 1440x900 | 100% | The routine dashboard (334:112794, oldest) and its component 1196:217178. |
| Routines | `templates` · 05 | [`929:341275`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=929-341275) | 4dashboard7 | 1440x900 | 100% | A newly created routine's dashboard. |
| Notifications | `notification-collapsed-1` · 04-05 | [`13760:837613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-837613) | Dashboard | 1440x900 | 30% (dimmed) | Where a 'Routine completion' notification lands; looks like a routine dashboard (with 14045:597791). |
| Search + Agent + Login | `side-nav` · 06 | [`9256:477318`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477318) | Dashboard (COMPONENT) | 1440x900 | 100% | ⋯ menu: Run Now / Edit / Add to Project / Keyboard shortcuts. Routine actions, newest drawing; D6 default takes it. |
| All Empty states & Dropdowns | `dd-nav` · 01 | [`9256:477323`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477323) | Dashboard (instance) | 1440x900 | 100% | Instance of 9256:477318 ('Check main flow'). |
| Routines | `side-nav` · 01-03 | [`1440:365634`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1440-365634) | Main_nav | 280x900 | 100% | Nav only: hover of items (1440:365634), hover of micro items (1440:363167), item menu (1440:364269 + Dropdown Menu 11406:633924, 180x141, contents not read). |

Reachable from the entry: 7 journeys, 25 frames, on 4 pages.

- Routines (4 journeys, 22 frames): `scheduled-sessions` (7), `view-edit` (9), `read-more` (3), `side-nav` (3).
- Search + Agent + Login (1 journey, 1 frame): `side-nav` (1 of 7 frames).
- All Empty states & Dropdowns (1 journey, 1 frame): `dd-nav` (1).
- Chat + Artifacts (1 journey, 1 frame): `drag-unpin` (1 of 2 frames).

**Recommendation:** Open the routine's sessions view (scheduled-sessions 01, 1588:225613) at a new /routines/<id>. ⋯ opens 9256:477318 without Keyboard shortcuts.

**Confidence:** low. **Needs your confirmation:** Does a routine in the nav open its runs (scheduled-sessions, 1588:225613) or its dashboard (view-edit, 334:112794 / 1196:217178)? Is 9256:477318 (Run Now / Edit / Add to Project) its ⋯ menu, rather than the Routines-page nav menu 11406:633924? Related doubts: D5, D6, D18, D19.

### 14. Chats (dark) / History (light) rows (+ ⋯ menu)

- **Controls:** 4 rows per mode.
- **Code:** Dark ChatRow x4 under Chats (NavItems.tsx:58-61): open + ⋯ on hover. Light LightChatRow x4 under History (:103-106): ⋯ always visible on the first three. No handlers. Only the commit chat (/chat/commit) is built.
- **Route today:** none. Nothing happens on click.
- **Opens:** Chat + Artifacts · `chat-artifact` step 08 · [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) · 1440x900. Chat template at rest (/chat/commit?at=answer&rail=e).
- **⋯ opens:** Projects + Chat History · `chat-history` step 02 · [`4853:244291`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4853-244291) · 1440 wide. Row menu Pin / Rename / Add to Project / Delete; Rename -> Rename Session modal 4853:246286.
- **Proposed route:** /chat/<id> (template exists; other slugs show the Not built placeholder); History page /history (new).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `chat-artifact` · 08 | [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) | (name not recorded) | 1440x900 | 100% | The only chat drawn at rest in the shell with the rail expanded; built. |
| Projects + Chat History | `chat-history` · 02 | [`4853:244291`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=4853-244291) | Dashboard | 1440 wide | 100% | Chat row menu on its home page: Pin / Rename / Add to Project / Delete. D3 default: the home page wins. |
| All Empty states & Dropdowns | `dd-projects` · 05 | [`9271:530761`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9271-530761) | Dashboard | 1440x900 | 100% | Chat row menu: Pin / Rename / Add to Project / Keyboard shortcuts (D3, D5). |
| Chat + Artifacts | `chat-artifact` · 03 | [`9256:466688`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-466688) | COMPONENT "3" | 1440x900 | 100% | Chat title menu: View files in Chat, Pin Chat, Rename, Add to Project ›, Archive, Delete. |
| Chat + Artifacts | `nav-behaviour` · 04 | [`11614:677973`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-677973) | Copilot Landing page | 1440x900 | 100% | The nav menu of a chat inside a project. |
| Search + Agent + Login | `side-nav` · 01, 04, 07 | [`13766:124934`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124934) | Dashboard | 1440x900 | 100% | Nav menus open (13766:124934, 13766:125856, 13766:125239); contents not read, one may be the chat row menu. |
| Projects + Chat History | `chat-history` · 01 | [`3098:185026`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3098-185026) | Dashboard | 1440 wide | 100% | History page ('Find all your chat history here'). No nav entry reaches it today. |

Reachable from the entry: 4 journeys, 33 frames, on 3 pages.

- Chat + Artifacts (1 journey, 22 frames): `chat-artifact` (22).
- Projects + Chat History (1 journey, 8 frames): `chat-history` (8).
- All Empty states & Dropdowns (2 journeys, 3 frames): `dd-chat-history` (2), `dd-projects` (1 of 6 frames).

**Recommendation:** A row opens /chat/<id>. ⋯ opens the History-page row menu (4853:244291: Pin / Rename / Add to Project / Delete; Rename uses 4853:246286), which matches the chat title menu. Label the group 'Chats' (Q11; the 9 Oct Projects frames also say Chats). Add a way to the History page (3098:185026).

**Confidence:** medium. **Needs your confirmation:** Which ⋯ menu does a nav chat row open: 4853:244291, 9271:530761 or one of the unread side-nav menus? Should the Chats / History group link to the History page (3098:185026), which nothing in the nav reaches today? Related doubts: D3, D5.

### 15. Section headers and chevrons (Agents, Pinned, Routines, Chats / History)

- **Controls:** 4 group titles with a chevron (dark + light).
- **Code:** NavSection (rows.tsx:189-218): the chevron collapses / expands the group in place (aria-expanded). Not routed.
- **Route today:** no route (in-place toggle), built. Works: local state only.
- **Opens:** Chat + Artifacts · `nav-light` step 02 · [`12829:292060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-292060) · 1440x900. Light nav with groups open and closed.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `nav-light` · 02 | [`12829:292060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-292060) | 209 | 1440x900 | 100% | Light: Agents and Pinned drawn with a right chevron, Routines and History with a down chevron. |
| Chat + Artifacts | `nav-behaviour` · 01 | [`11614:672894`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894) | Copilot Landing page | 1440x900 | 100% | Dark: every group open (down chevrons). |
| Search + Agent + Login | `side-nav` · 02 | [`13766:124635`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124635) | Dashboard | 1440x900 | 100% | 'Sub header hover' (four cursors): the header hover state. |

Reachable from the entry: 2 journeys, 2 frames, on 2 pages.

- Chat + Artifacts (1 journey, 1 frame): `nav-light` (1 of 4 frames).
- Search + Agent + Login (1 journey, 1 frame): `side-nav` (1 of 7 frames).

**Recommendation:** Keep as built. Add the sub-header hover from 13766:124635.

**Confidence:** high. No confirmation needed.

### 16. Footer avatar / name / chevron -> account menu (and the rail avatar)

- **Controls:** dark footer chevron; light footer chevron; avatar + name (spans today); rail avatar (span today).
- **Code:** Dark footer chevron (Nav.tsx:72-74) and light footer chevron (:81-83) call onAccountMenu, which AppShell never passes. Avatars and names are spans (Nav.tsx:66-67, :79-80; Rail.tsx:78). Nothing opens.
- **Route today:** none. Frames exist at /new?menu=account&rail=c|e&nav=light, but the /new screen ignores menu=.
- **Opens:** Chat + Artifacts · `nav-light` step 03 · [`12829:296297`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-296297) · 1440x900. Collapsed light; 04 (12919:607703) is the expanded light menu. Dark: Notifications option 2, 14045:602095 / 14045:606876.
- **Proposed route:** ?menu=account on the current route (key already in BUILD-PLAN 2.1).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `nav-light` · 03 | [`12829:296297`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-296297) | 210 | 1440x900 | 100% | Collapsed light rail, avatar Clicked: Anurag Kashyap / Notifications (red dot) / Settings / Log Out. Confirmed page. |
| Chat + Artifacts | `nav-light` · 04 | [`12919:607703`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12919-607703) | 1730 | 1440x900 | 100% | Expanded light: Anurag Kashyap / Settings / Log Out. No Notifications row (Q12). |
| Notifications | `notification-collapsed-1` (ignored option) · option 2 / 2 | [`14045:602095`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-602095) | Copilot Landing page | 1440x900 | 100% (ignored option, see D1) | Dark collapsed rail; 'on hover' opens the Tentant Switcher (268x156). BUILD-PLAN item 2; HTML reference prototypes/notification-flow. |
| Notifications | `notification-collapsed-1` (ignored option) · option 2 / 4 | [`14045:606876`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-606876) | Copilot Landing page | 1440x900 | 100% (ignored option) | Dark expanded (280): Tentant Switcher (268x144). The footer is avatar + name + chevron, with no bell. |
| Notifications | `notification-collapsed-1` (ignored option) · option 2 / 5 | [`15460:171060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15460-171060) | Copilot Landing page | 1440x900 | 100% (ignored option) | Newest frame on the page (15460): expanded, menu + Notification Panel. |

Reachable from the entry: 2 journeys, 7 frames, on 2 pages.

- Chat + Artifacts (1 journey, 2 frames): `nav-light` (2 of 4 frames).
- Notifications (1 journey, 5 frames): `notification-collapsed-1` (ignored option) (5, option 2).

**Unmapped page, Chrome Extension ES:** Settings > Get App & Extensions (7899:234202) points at the extension; nothing else in the account menu depends on it.

**Recommendation:** The avatar (footer and rail), the name row and the chevron all open the account menu (?menu=account). Light: nav-light 03 / 04. Dark: option 2 (14045:602095 collapsed, 14045:606876 expanded), per the D1 default. Show the Notifications row in both widths (Q12 default).

**Confidence:** medium. **Needs your confirmation:** Confirm D1 for this flow (build option 2: the account menu with a Notifications row) and Q12 (the Notifications row in the expanded menu too). Related doubts: D1.

### 17. Account menu > Settings

- **Controls:** menu item.
- **Code:** Not built (no account menu yet).
- **Route today:** none. /new?seed=no-chips&modal=settings>memory exists as a URL (new-memory 03) but the /new screen ignores modal=.
- **Opens:** Chat + Artifacts · `new-memory` step 03 · [`10112:408460`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-408460) · 1440x900. Settings > Memory over the current page; instance of the Memory list 10112:406770.
- **Proposed route:** ?modal=settings>memory (exists); add settings>connectors, settings>skills, settings>apps.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `new-memory` · 03 | [`10112:408460`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-408460) | INSTANCE of Memory | 1440x900 | 100% | The only Settings frame on the confirmed page. Drift 9 Oct: a new 'Settings ›' item at the bottom of the modal nav (theme K). |
| Settings | `memory-individual` · 01 | [`10112:406770`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-406770) | Memory (COMPONENT) | (size not recorded) | 100% | The populated Memory list that 10112:408460 instances. |
| Settings | `memory-enable-import` · 01 | [`10136:549616`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10136-549616) | Dashboard | (size not recorded) | 100% | Memory tab with memory off ('Generate memory from chats'). |
| Settings | `connectors` · 01 | [`10647:196002`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10647-196002) | Dashboard | (size not recorded) | 100% | Connectors, All tab: 'Option 1 (recommended)'. First title card on the page. |
| Settings | `skills` · 01 | [`14088:847085`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14088-847085) | 9 | (size not recorded) | 100% | Skills list. Newest tab drawing (14088). |
| Settings | `get-app-extensions` · 01 | [`7899:234202`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7899-234202) | 1 | (size not recorded) | 100% | Get App & Extensions (Chrome Extension, Desktop App, Add-In). |
| Settings | `(loose)` · - | [`9893:418298`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9893-418298) | Dialog - Settings | 960x723 | 100% | Older dialog whose nav is General / Memory / Connectors / Skills / Get App & Extension. |

Reachable from the entry: 11 journeys, 48 frames, on 2 pages.

- Settings (10 journeys, 47 frames): `connectors` (7), `connectors-disruption` (2), `skills` (3), `get-app-extensions` (1), `memory-enable-import` (10), `memory-individual` (9), `memory-edit-ai-list` (7), `memory-delete` (3), `memory-disable-pause` (3), `memory-disable-reset` (2).
- Chat + Artifacts (1 journey, 1 frame): `new-memory` (1 of 3 frames).

**Recommendation:** Open the Settings modal over the current page. D9 puts General first, but General is not designed, so open on Memory (10112:408460) until the designer says otherwise.

**Confidence:** low. **Needs your confirmation:** Which tab does Settings open on from the account menu? D9 puts General first, but no frame designs General. Related doubts: D9, D10, D11.

### 18. Account menu > Log Out

- **Controls:** menu item.
- **Code:** Not built (no account menu yet).
- **Route today:** none. BUILD-PLAN section 3 lists Log Out as a gap.
- **Opens:** Search + Agent + Login · `login` step 01 · [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) · 1440x900. Login option 4 (split screen: chat + login form).
- **Proposed route:** /login (new, no shell).

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Search + Agent + Login | `login` · 01 | [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) | Login (option 4) | 1440x900 | 100% | The only full-opacity login; D1 default. |
| Search + Agent + Login | `login` (ignored option) · options 1-3 | [`13766:128595`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-128595) | Login (option 1) | 1440x900 | 30% (ignored) | Options 1-3 (13766:128595, 13766:130193, 13766:131792) are faded. |

Reachable from the entry: 1 journey, 3 frames, on 1 page.

- Search + Agent + Login (1 journey, 3 frames): `login` (3).

**Recommendation:** Log Out lands on the login page, option 4 (13766:133389), outside the shell.

**Confidence:** low. **Needs your confirmation:** Does Log Out land on the login page (option 4, 13766:133389)? Related doubts: D1, D23.

### 19. Footer notifications bell (and Account menu > Notifications)

- **Controls:** dark footer bell; account menu row (collapsed menu).
- **Code:** Dark footer bell (Nav.tsx:69-71) calls onNotifications, which AppShell never passes. The light footer and the rail draw no bell. The account-menu row is not built.
- **Route today:** none. Nothing happens on click.
- **Opens:** Notifications · `notification-collapsed-1` (ignored option) step option 2 / 3 · [`14553:287625`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14553-287625) · 1440x900. Notification Panel 440x640 (from the account menu); expanded: 15460:171060.
- **Proposed route:** ?pop=notifications (pop is the BUILD-PLAN popover key; the value is new).
- **Evidence:** The bell is still drawn in the dark footer of nav-behaviour 01 (11614:672894, 'footer shows bell with red dot') and of the Projects frames 14045:584747 / 15054:105151 (drift 9 Oct: moved ~4 px right). Option 2's expanded footer (14045:606876) has no bell.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Notifications | `notification-collapsed-1` (ignored option) · option 2 / 3 | [`14553:287625`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14553-287625) | Copilot Landing page | 1440x900 | 100% (ignored option, see D1) | Notification Panel (440x640) opened from the account menu. The notification-types spec sits under it. |
| Notifications | `notification-collapsed-1` (ignored option) · option 2 / 5 | [`15460:171060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15460-171060) | Copilot Landing page | 1440x900 | 100% (ignored option) | Newest frame on the page: expanded rail, menu + panel. |
| Notifications | `notification-expanded` · 01 | [`13760:839717`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-839717) | Copilot Landing page | 1440x900 | 30% (dimmed) | The only frame where the footer bell opens the panel: cursor on the bell position (233, 878), panel 440x610 at x 289. |
| Notifications | `notification-collapsed-1` · 02-03 | [`13760:760395`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-760395) | Copilot Landing page | 1440x900 | 30% (dimmed) | Option 1: the panel opens straight from a rail entry (13760:760395 tooltip, 13760:761707 panel). |
| Notifications | `notification-collapsed-1` · 04-05 | [`13760:837613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-837613) | Dashboard | 1440x900 | 30% (dimmed) | Where a clicked notification lands (with 14045:597791); looks like a routine dashboard. |

Reachable from the entry: 3 journeys, 11 frames, on 1 page.

- Notifications (3 journeys, 11 frames): `notification-collapsed-1` (5, dimmed), `notification-expanded` (1, dimmed), `notification-collapsed-1` (ignored option) (5, option 2).
- Not reached from the web nav: Meetings teams-notifications (macOS desktop notifications, 3 frames).

**Recommendation:** One Notification Panel (option 2 content, 440x640, with the What's New tab of prototypes/notification-flow), opened from the account menu's Notifications row. Keep the dark footer bell as a shortcut to the same panel, placed as in 13760:839717, until the designer decides.

**Confidence:** low. **Needs your confirmation:** Keep the footer bell (still drawn in the Projects and nav-behaviour frames) as a direct way into the panel, or drop it as option 2's expanded footer (14045:606876) does, so Notifications open only from the account menu? (D1) Related doubts: D1.

### 20. Collapse / expand control

- **Controls:** expanded header 'Collapse navigation'; rail logo 'Expand navigation'; narrow overlay (< 1200 px).
- **Code:** Nav.tsx:53-55 -> rail.set('collapsed'); Rail.tsx:57-59 -> rail.set('expanded'), or below 1200 px an overlay over a scrim (AppShell.tsx:56-113). Focus moves between the two buttons. The hash keeps rail=c|e when the URL pins it (router.ts).
- **Route today:** no path change (rail=c / rail=e on the current route), built. Works as designed.
- **Opens:** Chat + Artifacts · `nav-light` step 01-02 · [`12829:289253`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-289253) · 1440x900. Light collapsed 12829:289253 / expanded 12829:292060. Dark: chat-artifact 01 (rail=c) / nav-behaviour 01 (rail=e). Nav modes component 14992:112150.

Candidates:

| Page | Journey · step | Frame | Frame name | Size | Opacity | Why it might be current |
|---|---|---|---|---|---|---|
| Chat + Artifacts | `nav-light` · 01 | [`12829:289253`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-289253) | 208 | 1440x900 | 100% | Light, collapsed. |
| Chat + Artifacts | `nav-light` · 02 | [`12829:292060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-292060) | 209 | 1440x900 | 100% | Light, expanded. |
| Chat + Artifacts | `chat-artifact` · 01 | [`1707:136008`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136008) | (name not recorded) | 1440x900 | 100% | Dark, collapsed. |
| Chat + Artifacts | `nav-behaviour` · 01 | [`11614:672894`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11614-672894) | Copilot Landing page | 1440x900 | 100% | Dark, expanded. |
| Search + Agent + Login | `light-mode-nav` · 01-02 | [`13766:126460`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126460) | Dashboard | 1440x900 | 100% | Duplicate light screens (13766:126460, 13766:127525). D6: reference only. |

Reachable from the entry: 2 journeys, 4 frames, on 2 pages.

- Chat + Artifacts (1 journey, 2 frames): `nav-light` (2 of 4 frames).
- Search + Agent + Login (1 journey, 2 frames): `light-mode-nav` (2).

**Recommendation:** Keep as built: the logo expands (Q10 default), layout-left collapses, and the rail is the user's choice (Q9).

**Confidence:** high. No confirmation needed. Related doubts: D6.

## Summary

| Nav item | Recommended entry frame | Confidence | Question for the user |
|---|---|---|---|
| New Session | [`1707:136008`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1707-136008) Chat + Artifacts `chat-artifact` 01 | high | - |
| Search (header icon, dark rail icon) | [`13766:124224`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124224) Search + Agent + Login `search` 01 | medium | Is the full-screen modal on 'Search + Agent + Login' (13766:124224 to 13766:124550) the global search for both the header icon and the rail icon? Should the light rail get a Search icon too (the light expanded header has one)? |
| Projects | [`11657:386523`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-386523) Projects + Chat History `projects-landing` 02 | high | - |
| Routines | [`11657:493405`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11657-493405) Routines `routines-landing` 03 | medium | Build the Routines landing from 11657:493405 with its row menu closed (the populated rest state is only drawn in the old 334:112714)? And should a first visit show the first-time page 875:162202 instead? |
| Meetings | [`8490:262262`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8490-262262) Meetings `meetings-home` 01 | medium | Which Meetings page does the nav open by default: the listing (8490:262262), onboarding for a first-time user (9325:402586), or the no-calendar state (12618:544826)? Are the newer listing states (13185:846896 to 13185:850454) the current look of the listing? |
| Artifacts | [`7907:305055`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7907-305055) Chat + Artifacts `artifacts-landing` 02 | high | - |
| Agents (rail icon) / Agents page | [`13766:125236`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125236) Search + Agent + Login `side-nav` 03 | low | Is there an Agents page beyond the empty state (6599:531692) and the 'agents page selected' frame (13766:125236)? What does it list? |
| Agents group rows (Financial Analysis Agent, Sheet Sage Agent, Formula Falcon Agent) | [`13766:124934`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124934) Search + Agent + Login `side-nav` 01 | low | What does clicking an agent in the nav do: start a new session with that agent, or open the agent's own page? The row is titled 'agent selector' but no frame shows the result. |
| Pinned > Artifacts | [`7809:278865`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7809-278865) Chat + Artifacts `artifact-full-editor` 01-06 | low | Is 'Artifacts' under Pinned one pinned artifact (its menu has Download and Delete)? Does it open inside the shell (/artifacts/<id>) or standalone (/view/<id>)? |
| Pinned > Projects | [`14045:584747`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-584747) Projects + Chat History `project-chat` 03 | medium | Confirm Q13 (the chevron toggles the chats, the name opens the project, the open arrow is dropped). Is the project page 14045:584747 (tab 'Files', D7) rather than nav-behaviour 07's 'Context' version (13701:756891)? |
| Pinned > project chats (+ View All) | [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) Chat + Artifacts `chat-artifact` 08 | medium | Does a chat inside a pinned project open the normal chat page (with the project in its breadcrumb)? No frame draws it. |
| Pinned > 'Plan launch timeline', 'Review customer feedback' | [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) Chat + Artifacts `chat-artifact` 08 | low | Is 'Review customer feedback' a chat (and 'Plan launch timeline' a routine, as drag-unpin 02 shows)? Which ⋯ menu do pinned rows use? None is drawn. |
| Routines list rows (+ ⋯ menu) | [`1588:225613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1588-225613) Routines `scheduled-sessions` 01 | low | Does a routine in the nav open its runs (scheduled-sessions, 1588:225613) or its dashboard (view-edit, 334:112794 / 1196:217178)? Is 9256:477318 (Run Now / Edit / Add to Project) its ⋯ menu, rather than the Routines-page nav menu 11406:633924? |
| Chats (dark) / History (light) rows (+ ⋯ menu) | [`1809:501331`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1809-501331) Chat + Artifacts `chat-artifact` 08 | medium | Which ⋯ menu does a nav chat row open: 4853:244291, 9271:530761 or one of the unread side-nav menus? Should the Chats / History group link to the History page (3098:185026), which nothing in the nav reaches today? |
| Section headers and chevrons (Agents, Pinned, Routines, Chats / History) | [`12829:292060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-292060) Chat + Artifacts `nav-light` 02 | high | - |
| Footer avatar / name / chevron -> account menu (and the rail avatar) | [`12829:296297`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-296297) Chat + Artifacts `nav-light` 03 | medium | Confirm D1 for this flow (build option 2: the account menu with a Notifications row) and Q12 (the Notifications row in the expanded menu too). |
| Account menu > Settings | [`10112:408460`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10112-408460) Chat + Artifacts `new-memory` 03 | low | Which tab does Settings open on from the account menu? D9 puts General first, but no frame designs General. |
| Account menu > Log Out | [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) Search + Agent + Login `login` 01 | low | Does Log Out land on the login page (option 4, 13766:133389)? |
| Footer notifications bell (and Account menu > Notifications) | [`14553:287625`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14553-287625) Notifications `notification-collapsed-1` (ignored option) option 2 / 3 | low | Keep the footer bell (still drawn in the Projects and nav-behaviour frames) as a direct way into the panel, or drop it as option 2's expanded footer (14045:606876) does, so Notifications open only from the account menu? (D1) |
| Collapse / expand control | [`12829:289253`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12829-289253) Chat + Artifacts `nav-light` 01-02 | high | - |
