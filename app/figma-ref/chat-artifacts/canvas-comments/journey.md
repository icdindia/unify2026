# Canvas comments

- Journey id: `canvas-comments`
- Figma page: Chat + Artifacts (1707:115989), section "Artifacts — Interactive Flows & Components" (1969:507279)
- Title card: `1969:507282` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507282
- Title card text: "Canvas Comments"
- Row in Figma: y 2117. The component sheet "Canvas Comments - Components" (section 1969:507502) sits at the left of the row, then the four frames.

These are crops of the artifact canvas (1071 x 603), not full screens. The underlying artifact is a static screenshot image
("Screenshot 2026-08-29 at 7.35.48 PM") of a pipeline dashboard (Closed won / Commit / Best case, funnel, Pipeline movement waterfall).

## Shell state

| | |
|---|---|
| Theme | Light |
| Rail / composer | Not in frame (crops of the artifact canvas only) |
| Artifact panel | Implied - the comments live on the artifact canvas |
| Overlay | 01: hover outline + AI marker; 02: selection + comment popover; 04: modal |

## Steps

### 01 - Hover an element in comment mode
- Node: `1969:507489` ("Frame 2147266728", 1071 x 603) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507489
- Image: `01-1969-507489.png`
- Shows: the paragraph block "Commit lands $0.8M under quota ..." outlined with a dashed rectangle, a 4-point sparkle (`ai-star`) at the outline's top-right corner and
  the arrow cursor at its bottom-right.
- Changed from previous: first step.
- Action that leads here: turn on comment mode (comments button in the artifact header, most likely) and hover an element on the canvas.

### 02 - Element selected, comment popover with @agent
- Node: `1969:507495` ("Frame 2147266734") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507495
- Image: `02-1969-507495.png`
- Shows: the element now has a solid dark outline; a comment pin (avatar "O" in a teardrop bubble) at its right edge, with the sparkle above; a white comment card
  next to it: "@agent Make this beautiful and polish the design and make it feel more refined." (@agent in blue), hint "@agent or @colleague_name",
  a small comment icon, a dark round send button and a close (×) chip on the card's top-right corner.
- Changed from previous: hover dashed outline -> solid selection; pin + comment card added.
- Action that leads here: click the hovered element, type a comment mentioning @agent.

### 03 - Comment composer states
- Node: `1969:507503` ("Frame 2147266733", 423 x 771) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507503
- Image: `03-1969-507503.png`
- Shows four stacked states of the pin + composer: (a) empty single-line "use @agent or @colleague" with a disabled send; (b) filled, two lines, send enabled;
  (c) filled with the close (×) chip; (d) filled with text truncated ("refin...") and the × chip offset (hover).
- Changed from previous: isolated component states, no canvas.
- Action that leads here: n/a (state reference for the composer in 02).

### 04 - "What should change?" modal (dimmed in Figma)
- Node: `1969:507512` ("Modal Unit", 400 x 198) - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507512
- Image: `04-1969-507512.png`
- Shows: modal "What should change?" with a textarea placeholder "Type a personalized invite message...", secondary "Add Comment" and primary "Send to Assistant".
  The whole frame has opacity 0.3 in Figma, so the image looks faded.
- Changed from previous: modal alternative to the inline comment card.
- Action that leads here: unclear - likely an earlier alternative to 02 (comment on an element and route it to the assistant).

## Component sheet

| # | Node | Image | What it is |
|---|---|---|---|
| c01 | `1969:507502` (SECTION "Canvas Comments - Components", 451 x 758) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507502) | `c01-1969-507502.png` | `Canvas Comment` component set (1902:350384) with variants `State=Default, Size=Single Line`, `State=filled, Size=Single Line`, `State=Filled, Size=Double Line`, `State=Filled, Size=artifact comment`, `State=Filled, Size=artifactagent`, `State=Filled, Size=artifact empty comment` (the artifact variants show an "Artifact Name → Element" breadcrumb and a "Send to Agent" checkbox); `Comment Bubble` (1902:350418, avatar "J"); `Canvas-Comments-Bouble` (1902:350642, pin "O" + single-line input). |

## Components (instance main-component names)

| Component | Steps |
|---|---|
| `Cursor / State=Arrow`, `ai-star` | 01 |
| `Canvas-Comments-Bouble` | 02, 03 (x4) |
| `Buttons/Button Brand / Size=xs, Hierarchy=Secondary, Icon=Only, State=Default` (close chip) | 02, 03 |
| `Modal header / Type=Default, Size=xs, back=no`, `Textarea input field / Type=Default, Destructive=False, State=Placeholder`, `Modal actions / Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False` | 04 |
| In the sheet: `Canvas Comment` (set), `Comment Bubble`, `Buttons/Button Brand / Size=xs, Hierarchy=Secondary / Primary, Icon=Only, State=Disabled`, `Buttons/Button Neutral / Size=xs, Hierarchy=Primary, Icon=Only`, `arrow-right`, `Checkbox / Checked=True, ..., Size=xs, Type=Checkbox, Text=True`, `Avatar / Size=sm, Type=Letter, Colour=Brand Solid`, `Avatar / Size=xs, Type=Letter, Colour=White` | c01 |

## Open questions

1. How is comment mode entered - the comments split button in `Arifact Header`, or always-on hover in the canvas? What does its chevron menu contain?
2. Two routing models exist: "@agent" mention (02/03) vs the "Send to Agent" checkbox (artifact variants in c01) vs the dimmed "Send to Assistant" modal (04). Which one is final?
3. What happens after send to @agent - does the agent reply in the chat column, update the artifact, or reply in the thread?
4. Is there a comments list / side panel (resolved, replies), or only pins on the canvas? Not drawn.
5. The canvas here is a screenshot crop; the prototype needs real element hit-areas on a sample artifact. Which artifact should carry the demo?
