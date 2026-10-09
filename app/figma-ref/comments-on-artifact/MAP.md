# Comments on Artifact — journey map (DRAFT)

Page `13946:324390` · [open in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324390)  
Status: DRAFT 2026-10-09 — inferred from layout

How to read: each journey is one horizontal row in the file (left to right = step order). "Designer label" is the text the designer placed just above (or, where noted, just below) the frame. Extra states stacked above/below a step are listed under that step. Node ids link to Figma.

## Notes

- One section, one row. The bubble column (x 7691) and the two popovers at the end (x 11204) are component states shown beside the row, not steps.
- Labels 'on click' and 'on all comments' sit in the gaps BEFORE 1740 and 1742 respectively: read as the action that leads into that frame.
- 'stepNotes' are this mapper's observations (from direct-child layer names), not designer labels.

## Section: comments on a artifact (`15160:1022869`)

[Section in Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=15160-1022869) · 26 direct children · 1 journeys

### 1. Comment on artifact (canvas bubbles -> thread menu -> all comments -> comment in chat) (`comment-on-artifact`)

Title card: [`13946:324825`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324825) - (1499x900) — text: "comment on artifact"  

1. [`13946:324391`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324391) 1732 (1440x900)
    - note: "1732": 56 rail + 'Page content' (1384), no split handle: the artifact before commenting. A 12px 'Pill solid' (13946:324824) sits just above its top-right corner
2. [`13946:324827`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324827) 1736 (1440x900)
    - note: "1736": 56 rail + split layout with a drag handle at x 500 (chat | artifact)
3. [`13946:324917`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324917) 1739 (1440x900)
    - note: "1739": as 1736 + a Canvas-Comments-Bouble (321x106) on the artifact at (1106,172)
4. [`13946:325448`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325448) 1740 (1440x900) — "on click"
    - note: "1740": bubble (321x90) + Tooltip (89x34). Label text 13946:325870 sits between 1739 and 1740 (x 5822-6064), i.e. the click that leads here
5. [`13946:325009`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325009) 1741 (1440x900) — "on all comments"
    - note: "1741": split, no overlay; a cursor (13946:325874) sits on it. Label text 13946:325872 is right-aligned to this frame's right edge, next to 1742
6. [`13946:325110`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325110) 1742 (1440x900) — "comment in chat"
    - note: "1742": split, no overlay; label over its left edge

Components / panels shown beside the row:

- [`13946:325541`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325541) Canvas-Comments-Bubble (321x106) — bubble: mention picker state (Team member / Plan / @olivia)
- [`13946:325546`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325546) Canvas-Comments-Bubble (321x214) — bubble: one comment (Anuj Mittal, now)
- [`13946:325594`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325594) Canvas-Comments-Bubble (321x240) — bubble: comment thread; captions to its right: 'comment artifact' (13946:325871) and 'comment artifact hover' (13958:332608)
- [`13946:325642`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325642) Canvas-Comments-Bouble (321x240) — bubble (layer 'Canvas-Comments-Bouble'): thread with the Dropdown Menu 13946:325857 open beside it
- [`13946:325690`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325690) Canvas-Comments-Bubble (321x240) — bubble: thread state
- [`13946:325738`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325738) Canvas-Comments-Bubble (321x340) — bubble: longest thread (321x340) with the Dropdown Menu 13946:325858 beside it
- [`13946:325857`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325857) Dropdown Menu (instance) (140x72) — thread menu (Edit / Label / ⌘K->P / Delete Thread)
- [`13946:325858`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325858) Dropdown Menu (140x32) — thread menu, collapsed single-row variant (140x32)
- [`13946:325278`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325278) comment panel / more comments (283x334) — popover listing more comments — label 'two or more artifact commented upon' (13958:332586)
- [`13946:325385`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325385) comment hover (283x228) — the same popover, hover state — label 'hover state' (13958:332585)

Cross-page: Continues / overlaps Chat + Artifacts 'canvas-comments' (card 1969:507282: hover, select + compose with @agent, composer states, modal) and 'commenters' (comments panel). Bubble layer names match BUILD-PLAN item 54 'CanvasComments' (Canvas-Comments-Bouble 1902:350642).

## Cross-page overlaps

- Chat + Artifacts 'canvas-comments' (1969:507282) covers creating a comment on the canvas (hover, select, compose with @agent). This page covers the next part: bubbles on the canvas, the thread menu, 'all comments', and sending a comment into the chat. The two read as consecutive halves of one flow (see doubt 1).
- Chat + Artifacts 'commenters' (8279:198075) is the comments-panel flow for commenter-only users; this page's 'comment in chat' (1742) touches the same chat column.

## Loose frames (ignored by default)

- [`13959:332731`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13959-332731) claude (3491x537) — 30%-opacity strip of 8 reference screenshots (Oct 2/5) above the section, outside it: comment UI references from another product
- [`13946:324824`](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324824) Pill solid (12x12) — small dot just above 1732's top-right corner; reads as a 'new/updated' marker on the frame

## Doubts

1. **This page (13946 ids, Oct 2026) and Chat + Artifacts 'canvas-comments' (1969 ids, older) both design comments on an artifact canvas. Are they two halves of one flow (hover/select/compose there -> bubbles, thread menu, all comments, comment-in-chat here), or is this page a newer version that replaces canvas-comments? (Whether the bubbles here are instances of the same 'Canvas-Comments-Bouble' component 1902:350642 was not checked: the bridge dropped.)**  
   Links: [13946-324825](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324825) · [13946-324917](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-324917) · [13946-325541](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=13946-325541) · [1969-507282](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507282) · [1969-507495](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507495)  
   Proposed default: Two halves of one flow: keep canvas-comments for hover/select/compose, use this page for bubbles, the thread menu, all comments and comment-in-chat; where bubble states differ, the ones on this page (newer) win.

