# Notifications — journey map (DRAFT)

Page `13752:451556` · [open in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13752-451556)  
Status: DRAFT 2026-10-09 — inferred from layout

How to read: each journey is one horizontal row in the file (left to right = step order). "Designer label" is the text the designer placed just above (or, where noted, just below) the frame. Extra states stacked above/below a step are listed under that step. Node ids link to Figma.

## Notes

- Two rows sit directly on the page (no section), both at 30% layer opacity; the third row is inside 'Section 1' at full opacity, with its title card just outside the section's left edge.
- Panel content spec (text 15460:173639, under 14553:287625) lists six notification types: 1 Project shared, 2 Chat shared, 3 Artifact shared (for review), 4 Mention in multiplayer (@), 5 Routine completion (run completed), 6 Artifact creation (created and shared with you). Applies to the Notifications panel whichever option is built.
- The earlier HTML prototype prototypes/notification-flow (built 2026-10-07 from Section 1) used 14761:289991 as a 'What's New tab' step; that node no longer exists. Section 1 now ends with 15460:171060 (expanded rail + Notification Panel). The panel-pair group 14761:43871 used by prototypes/notification-panels is also gone.
- 'stepNotes' are this mapper's observations (from direct-child layer names), not designer labels.

## Section: (page level, outside any section) (`13752:451556`)

[Section in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13752-451556) · 9 direct children · 2 journeys

### 1. Notification, collapsed rail (option 1: the panel opens straight from the rail, no account menu) (`notification-collapsed-1`) · **DIMMED**

Title card: [`13760:757630`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-757630) - (1499x900) — text: "Notification collapsed option 1"  
Card note: card and every frame in this row are at 30% layer opacity  

1. [`13760:757632`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-757632) Copilot Landing page (1440x900)
    - note: 56px rail + landing
2. [`13760:760395`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-760395) Copilot Landing page (1440x900)
    - note: cursor at the bottom of the rail (34,828) + Tooltip (82x28): hovering the rail entry that opens notifications (tooltip text not read)
3. [`13760:761707`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-761707) Copilot Landing page (1440x900)
    - note: Notification Panel (440x610) open beside the rail, cursor still on the rail entry
4. [`13760:837613`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-837613) Dashboard (1440x900)
    - note: Dashboard page (Frame 2147266134), no overlay: presumably where a clicked notification lands
5. [`14045:597791`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-597791) Dashboard (1440x900)
    - note: Dashboard page, second state (same structure)

### 2. Notification, expanded rail (`notification-expanded`) · **DIMMED**

Title card: [`14045:596898`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-596898) - (1499x900) — text: "Notification expanded"  
Card note: card and frame at 30% opacity; row sits between the option 1 and option 2 rows  

1. [`13760:839717`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-839717) Copilot Landing page (1440x900)
    - note: 280px rail, cursor at the rail's bottom (233,878), Notification Panel (440x610) at x 289

## Section: Section 1 (`14761:291839`)

[Section in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14761-291839) · 7 direct children · 0 journeys

Holds only the option 2 row (5 frames, the 'on hover' label and the notification-types spec text). Its title card 14045:596900 sits just outside the section's left edge. Recorded under Ignored options per the standing rule; see doubt 1.

## Ignored options (Option 2 and later)

### Notification collapsed option 2 (account menu with a Notifications row; Section 1, full opacity) (alternative to `notification-collapsed-1`)

Title card: [`14045:596900`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-596900) - (1499x900)  
Note: Recorded per the standing 'Option 1 only' rule; see doubt 1 — this is the live, newer row.  

1. [`14045:596902`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-596902) Copilot Landing page (1440x900)
    - note: 56 rail landing (unread badge on the avatar per the earlier prototype)
2. [`14045:602095`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-602095) Copilot Landing page (1440x900) — "on hover"
    - note: Tentant Switcher (account menu, 268x156) open from the avatar
3. [`14553:287625`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14553-287625) Copilot Landing page (1440x900)
    - note: Notification Panel (440x640) open, two cursors; the notification-types spec text sits under this frame
4. [`14045:606876`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-606876) Copilot Landing page (1440x900)
    - note: 280 rail, Tentant Switcher (268x144) open from the expanded rail
5. [`15460:171060`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15460-171060) Copilot Landing page (1440x900)
    - note: 280 rail, Tentant Switcher + Notification Panel (440x640) open

## Cross-page overlaps

- Option 2 (Section 1) is the account-menu pattern the Chat + Artifacts shell already uses: BUILD-PLAN item 2 'AccountMenu' (Tentant Switcher; collapsed with a Notifications row and red dot) from 'nav-light' steps 03/04 (12829:296297, 12919:607703), with prototypes/notification-flow as its HTML reference.
- Option 1's Dashboard frames (13760:837613, 14045:597791) look like a routine dashboard (Routines page 'view-edit' / 'scheduled-sessions'); notification type 5 is 'Routine completion'.

## Doubts

1. **Here the standing 'Option 1 only' rule and the 'dimmed = parked' rule collide: option 1 (panel opens straight from the rail, page level) is at 30% opacity, while option 2 (account menu with a Notifications row, Section 1) is full opacity, newer (14553/15460 ids), already prototyped in prototypes/notification-flow, and matches the AccountMenu the Chat + Artifacts shell uses. Should this page follow option 2 instead?**  
   Links: [13760-757630](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-757630) · [13760-761707](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13760-761707) · [14045-596900](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14045-596900) · [14761-291839](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14761-291839) · [14553-287625](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=14553-287625)  
   Proposed default: Mapped per the standing rule: option 1 (flagged dimmed) is the journey and option 2 is listed in full under ignoredOptions. If you say 'option 2 here', swapping is a one-line change (move the ignoredOptions entry into journeys).

