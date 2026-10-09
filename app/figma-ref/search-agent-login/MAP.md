# Search + Agent + Login: journey map

- Page: [`13766:124218`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124218)
- Status: DRAFT 2026-10-09 — inferred from layout
- Journeys: 5, frames mapped: 18
- Note: Two sections stacked: 'Login page' on top (page y -2953) and 'Search + Model Switch + agent selector sidenav' below (page y -388).
- Note: Login row: options 1-3 are at 30% opacity and option 4 is at full opacity. We read that as the designer having picked option 4, so option 4 is mapped and 1-3 are ignored (see doubt 1).
- Note: The 'side nav' row contains a wrapper frame 'Light mode' (4485 wide) that holds its own title card ('Light mode nav bar') and two screens: mapped as a mid-row sub-journey.
- Note: Main_nav instances: the Search row uses types=collapsed; every side-nav frame uses types=Expanded. The two Light-mode screens use a separate 'Main_nav light mode' layer.
- Note: 'contents' is our reading of layer names, not a designer label.

How to read: steps run left to right in the Figma row. A label in quotes after the frame name is the designer's text above that frame.

## Section: Login page

Section node [`13766:128594`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-128594), 11 direct children.

### 1. UnifyApps Login (option 4)

- id: `login`
- Title card: [`13766:134986`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-134986)

1. [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) "Login (option 4)" (1440x900) — label: "option 4" — shows: split screen: Chat (720) + Body (720) with a screenshot and the login form
2. [`13766:134988`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-134988) "Frame" (1440x900) — shows: spreadsheet-style app window (Top bar 'Acme_Futura Masters…', Tool bar ribbon, Cell selector, Function select) with the 260x292 login form inside
3. [`13766:136039`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-136039) "Frame" (1440x900) — shows: same spreadsheet window, second state of the login form

## Section: Search + Model Switch + agent selector sidenav

Section node [`13766:124219`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124219), 26 direct children.

### 2. Search

- id: `search`
- Title card: [`13766:124630`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124630)
- Note: The 'Agent 5 · Project 5' tag is a small 179x28 frame above step 1, probably the number of agents and projects listed in the modal.

1. [`13766:124224`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124224) "Dashboard" (1440x900) — label: "Agent 5 · Project 5" — shows: collapsed nav + full-screen search modal
2. [`13766:124306`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124306) "Dashboard" (1440x900) — shows: full-screen search modal
3. [`13766:124265`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124265) "Dashboard" (1440x900) — shows: full-screen search modal
4. [`13766:124550`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124550) "Dashboard" (1440x900) — shows: full-screen search modal

### 3. Side nav (agent selector)

- id: `side-nav`
- Title card: [`13766:126154`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126154)
- Note: The colour note above step 1 is a small annotation frame (13766:124220) with a pasted swatch screenshot (13766:124223).

1. [`13766:124934`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124934) "Dashboard" (1440x900) — label: "bg color: Brand 500 + 30% of #000000" — shows: menu open + cursor
2. [`13766:124635`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124635) "Dashboard" (1440x900) — label: "Sub header hover" — shows: four cursors (hover states on the sub header)
3. [`13766:125236`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125236) "Dashboard" (1440x900) — label: "agents page selected" — shows: Agents page selected in the nav
4. [`13766:125856`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125856) "Dashboard" (1440x900) — shows: menu open + two cursors
5. [`13766:125232`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125232) "Dashboard" (1440x900) — shows: cursor
6. [`9256:477318`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477318) "Dashboard (component)" (1440x900) — label: "three dots hover" — shows: COMPONENT: menu Run Now / Edit / Add to Project / Keyboard shortcuts (reused as an instance on 'All Empty states & Dropdowns')
7. [`13766:125239`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125239) "Dashboard" (1440x900) — shows: menu open + cursor

### 4. Light mode nav bar

- id: `light-mode-nav`
- Title card: [`13766:126458`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126458)
- Note: Mid-row sub-journey wrapped in frame 'Light mode' (13766:126457) inside the side nav row.

1. [`13766:126460`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126460) "Dashboard" (1440x900)
2. [`13766:127525`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-127525) "Dashboard" (1440x900)

### 5. Side nav: two parked states (20% opacity) (DIMMED: reduced opacity, probably parked)

- id: `side-nav-parked`
- Title card: none
- Note: At the far right end of the side nav row, after the Light mode block, both at 20% opacity. They use the dark Expanded Main_nav, so they belong with 'side-nav', not with light mode.

1. [`13766:126158`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126158) "Dashboard" (1440x900) — shows: menu open + three cursors
2. [`13766:125554`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-125554) "Dashboard" (1440x900) — shows: cursor + Tooltip

## Ignored options (Option 2 and later)

- [`13766:128595`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-128595) "Login (option 1)" (1440x900) — option 1 (frame at 30% opacity); mapped choice is [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) in `login`. Has an extra 'Hero Banner' layer.
- [`13766:130193`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-130193) "Login (option 2)" (1440x900) — option 2 (30% opacity); mapped choice is [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) in `login`
- [`13766:131792`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-131792) "Login (option 3)" (1440x900) — option 3 (30% opacity); mapped choice is [`13766:133389`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389) in `login`

## Loose frames (ignored by default)

- [`15315:751390`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15315-751390) "Container" (1672x1810) — page-level frame outside both sections ('Filter Actions' bar + a large frame); probably a captured filter/table reference
- [`13766:126156`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126156) "image 33" (280x951) — pasted side-nav screenshot 'ss1' at 20% opacity, left of the side nav row
- [`13766:126157`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126157) "image 34" (274x951) — pasted side-nav screenshot 'ss2' at 20% opacity, left of the side nav row

## Cross-page links (duplicates or continuations of other pages)

- [`13766:126460`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126460) "Dashboard" (1440x900) → Light mode nav bar duplicates Chat + Artifacts `nav-light` (card 12919:607701, 4 frames)
- [`9256:477318`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9256-477318) "Dashboard (component)" (1440x900) → Main component of the 'Drop-downs: Nav' frame 9256:477323 on 'All Empty states & Dropdowns'
- [`13766:124934`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124934) "Dashboard" (1440x900) → Side nav states overlap Chat + Artifacts `nav-behaviour` (pins, project hover, three-dots menus)
- [`13766:124224`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-124224) "Dashboard" (1440x900) → Search modal opened from the nav; the nav search entry is part of the Chat + Artifacts shell

## Doubts

1. **Login: options 1-3 are faded to 30% and option 4 is at full opacity, which reads as 'option 4 chosen'. Your rule is 'option 1 only'. Which login design do we build? Also: the two frames after option 4 show the login form inside a spreadsheet-style app window. Are they login steps (login from an add-in) or a different context?**
   - Proposed default: Build option 4, because options 1-3 are faded (parked). Keep the two spreadsheet-window frames as steps 2-3 of the same login journey.
   - Figma: [13766-134986](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-134986), [13766-128595](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-128595), [13766-133389](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-133389), [13766-134988](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-134988)
2. **Light mode nav bar appears here (2 screens, inside the side nav row) and also as Chat + Artifacts `nav-light` (4 screens). Which is the source of truth?**
   - Proposed default: Chat + Artifacts `nav-light` stays canonical (already confirmed). Use these two screens only as extra references.
   - Figma: [13766-126458](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13766-126458), [12919-607701](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=12919-607701)
