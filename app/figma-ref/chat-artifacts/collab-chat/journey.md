# Collaborative chat flow

- Journey id: `collab-chat`
- Title card: `7830:279829` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7830-279829
- Title card text: "Collaborative chat flow"
- Figma page: Chat + Artifacts (`1707:115989`), section `7830:372599 Collaborative Chat flow`
- Baseline: 1440 wide, frames 1440 x 900 unless noted (screenshots exported at scale 1)

A chat shared with editor access: join notice, a collaborative bar above the composer (who is typing + 'Assistant Replies' toggle), @-mentions of participants and the Assistant, other editors' messages, many-editor overflow with a People with access popover, and a comments badge in the header. All frames use the collapsed dark rail and the 'Collaborative chat-large' component above a 'Bottom small' composer. Frame names in Figma: 1, 150-154, 156-159.

## Steps

### 01 - 1

- Node: `7830:279836` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=7830-279836
- Image: `01-7830-279836.png`
- Shows: Shared chat: header avatar stack (M J G), cost, Share (people icon), clipboard and comments icons; assistant answer; centred system line 'Matt Rivera, John Whitaker and Grace Coleman joined the chat'; collaborative bar 'John and Matt Rivera are typing ...' with Assistant Replies toggle ON; composer placeholder 'Queue follow-up...'.
- Changed from previous: Start of journey (chat after it has been shared; compare add-users step 01, which had no collaborators).
- Action that leads here: Share the chat with editors (add-users flow); collaborators join and start typing.
- Designer annotations nearby: "When a chat is shared with editor access. users are typing + assistant is on"
- Nav state: dark, collapsed icon rail; New session selected
- Open surfaces: no modal; collaborative bar + bottom composer; no artifact panel
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Component 2 {Type=Icon only}
  - Nav_menu/Main {Variant=Collapsed, State=Selected}
  - Nav_menu/Main {Variant=Collapsed, State=Default} x7
  - Nav_menu/Footer {Variant=Collapsed, State=Default}
  - ES Breadcrumb {Variant=Default}
  - Avatar group {Size=xs}
  - Buttons/Button Neutral {Size=sm, Hierarchy=Tertiary, Icon=Default, State=Default} x3
  - Buttons/Button Neutral {Size=sm, Hierarchy=Tertiary, Icon=Only, State=Default} x2
  - Copilot_User Message_Desktop full {State=Default, Type=Default}
  - Response_Desktop full {Property 1=Assistant}
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Component 2`, `Nav_menu/Main`, `Nav_menu/Footer`, `ES Breadcrumb`, `Avatar group`, `Buttons/Button Neutral`, `Copilot_User Message_Desktop full`, `Response_Desktop full`, `Collaborative chat-large`, `Copilot desktop Input Box`

### 02 - 150

- Node: `8202:477546` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8202-477546
- Image: `02-8202-477546.png`
- Shows: Same screen with the Assistant Replies toggle switched OFF.
- Changed from previous: Toggle off (light track). A grey strip appears below the composer to the bottom edge.
- Action that leads here: Click the 'Assistant Replies' toggle in the collaborative bar.
- Designer annotations nearby: "users are typing + assistant is off"
- Nav state: dark, collapsed
- Open surfaces: collaborative bar + composer
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - ES Breadcrumb {Variant=Default}
  - Avatar group {Size=xs}
  - Response_Desktop full {Property 1=Assistant}
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `ES Breadcrumb`, `Avatar group`, `Response_Desktop full`, `Collaborative chat-large`, `Copilot desktop Input Box`

### 03 - 151

- Node: `8202:478758` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8202-478758
- Image: `03-8202-478758.png`
- Shows: Composer contains '@'; mention list pops above it: Assistant, Matt Rivera, John Whitake, Grace Coleman (avatars); send button turns dark.
- Changed from previous: Typing '@' opens the participant mention menu; send becomes active.
- Action that leads here: Type '@' in the composer.
- Designer annotations nearby: "@ needs to be added before referring"
- Nav state: dark, collapsed
- Open surfaces: mention dropdown over the collaborative bar
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No}
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=sm, Type=Avatar leading, State=Default, Selected=False, Stacking=Single Line} x4
- Component sets: `Main_nav`, `Collaborative chat-large`, `Copilot desktop Input Box`, `Input Menu Dropdown`, `Input dropdown Menu Item`

### 04 - 152

- Node: `8215:480023` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8215-480023
- Image: `04-8215-480023.png`
- Shows: Composer contains '@m'; list filtered to Matt Rivera (hovered) and Grace Coleman.
- Changed from previous: Mention list filters as the user types.
- Action that leads here: Continue typing 'm' after '@'.
- Designer annotations nearby: "filtered @"
- Nav state: dark, collapsed
- Open surfaces: filtered mention dropdown
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No}
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=sm, Type=Avatar leading, State=Default, Selected=True, Stacking=Single Line}
  - Input dropdown Menu Item {Size=sm, Type=Avatar leading, State=Default, Selected=False, Stacking=Single Line}
  - Cursor {State=Pointer Hand}
- Component sets: `Main_nav`, `Collaborative chat-large`, `Copilot desktop Input Box`, `Input Menu Dropdown`, `Input dropdown Menu Item`, `Cursor`

### 05 - 153

- Node: `8215:481631` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8215-481631
- Image: `05-8215-481631.png`
- Shows: Composer text '@Matt Rivera you own most of those six — which' with the mention in blue; others still typing; Assistant Replies off.
- Changed from previous: Mention inserted as a blue token; menu closed; message being typed.
- Action that leads here: Click 'Matt Rivera' in the mention list and keep typing.
- Designer annotations nearby: "while others are typing, owner tags user"
- Nav state: dark, collapsed
- Open surfaces: collaborative bar + composer
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No}
- Component sets: `Main_nav`, `Collaborative chat-large`, `Copilot desktop Input Box`

### 06 - 154

- Node: `8222:482896` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-482896
- Image: `06-8222-482896.png`
- Shows: Sent message as a right-aligned user bubble '@Matt Rivera you own most of those six — which one is utmost priority' (mention in blue); bar now 'Matt Rivera are typing'.
- Changed from previous: Message posted; thread scrolls up; composer back to 'Queue follow-up...'; no assistant reply because replies are off.
- Action that leads here: Press Enter / click Send.
- Designer annotations nearby: "@ style in message box"
- Nav state: dark, collapsed
- Open surfaces: collaborative bar + composer
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Copilot_User Message_Desktop full {State=Default, Type=With Tag}
  - Response_Desktop full {Property 1=Assistant}
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Copilot_User Message_Desktop full`, `Response_Desktop full`, `Collaborative chat-large`, `Copilot desktop Input Box`

### 07 - 156

- Node: `8222:485711` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-485711
- Image: `07-8222-485711.png`
- Shows: Other editor's messages: Matt Rivera (avatar + name, left-aligned bubbles) 'Easier to show you than describe it.' and '@Assitant give me an interactive view of the quarter...'; assistant shows 'Thinking...'; toggle ON; send button is a stop button.
- Changed from previous: Thread advances with another editor's turn addressed to the Assistant; assistant starts working (Agent COT).
- Action that leads here: Another editor (Matt) posts and @mentions the Assistant with Assistant Replies on.
- Designer annotations nearby: "other editor messages with agent reply"
- Nav state: dark, collapsed
- Open surfaces: collaborative bar + composer (stop state)
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Copilot_User Message {State=Default}
  - Copilot_User Message_Desktop full {State=Default, Type=With Tag}
  - Agent COT {Type=Complete 2}
  - Response_Desktop full {Property 1=Assistant} x2
  - Collaborative chat-large {State=User Typing, Users=Default}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Copilot_User Message`, `Copilot_User Message_Desktop full`, `Agent COT`, `Response_Desktop full`, `Collaborative chat-large`, `Copilot desktop Input Box`

### 08 - 157

- Node: `8222:488552` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-488552
- Image: `08-8222-488552.png`
- Shows: Assistant reply with an inline artifact card 'Pipeline Command - Interactive HTML - Download'; John Whitaker message above; collaborative bar idle: 'Type @ to mention a participant' + Assistant replies toggle ON.
- Changed from previous: Nobody typing, so the bar switches to the hint state; assistant answer and artifact card appear.
- Action that leads here: Wait for the assistant to finish; other editors stop typing.
- Designer annotations nearby: "when no one is typing"
- Nav state: dark, collapsed
- Open surfaces: collaborative bar (idle) + composer
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Copilot_User Message {State=Default}
  - Copilot_User Message {State=Default, Type=With Tag}
  - Feedback Array {Type=Full screen}
  - Response_Desktop full {Property 1=Assistant} x3
  - Inline Artifact Cards {State=Application-HTML}
  - Collaborative chat-large {State=Default, Users=No}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Copilot_User Message`, `Feedback Array`, `Response_Desktop full`, `Inline Artifact Cards`, `Collaborative chat-large`, `Copilot desktop Input Box`

### 09 - 158

- Node: `8222:490604` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-490604
- Image: `09-8222-490604.png`
- Shows: Many editors: header avatar stack of 10 + '+21'; bar shows an avatar stack '+5' and 'Matt Rivera and 12 others are typing'; hovering the stack opens a 'People with access' popover (Roger Bennett (You) Owner, Matt Rivera / John Whitake / Grace Coleman Editor, Natali Craig Viewer, scrollable).
- Changed from previous: Participant count grows; typing text collapses to 'X and N others'; popover opens from the bar's avatar stack.
- Action that leads here: Hover the avatar stack in the collaborative bar.
- Designer annotations nearby: "when many editors are typing together"
- Nav state: dark, collapsed
- Open surfaces: People with access popover over the thread
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Avatar group {Size=xs}
  - Inline Artifact Cards {State=Application-HTML}
  - Agent COT {Type=Step 1}
  - Collaborative chat-large {State=User Typing, Users=Max Users}
  - Input Menu Dropdown {Type=Single Select, Size=sm, Search=Default}
  - Input dropdown Menu Item {Size=sm, Type=Default, State=Default, Selected=False, Stacking=Single Line}
  - Input dropdown Menu Item {Size=sm, Type=Avatar leading, State=Default, Selected=False, Stacking=Single Line} x5
  - Scroll bar {Orientation=Vertical, Bg=False, Position=Top, Size=md}
  - Cursor {State=Pointer Hand}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Avatar group`, `Inline Artifact Cards`, `Agent COT`, `Collaborative chat-large`, `Input Menu Dropdown`, `Input dropdown Menu Item`, `Scroll bar`, `Cursor`, `Copilot desktop Input Box`

### 10 - 159

- Node: `8222:494135` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8222-494135
- Image: `10-8222-494135.png`
- Shows: Header comments icon shows a small '2' badge and is hovered; thread shows more editor/assistant turns; bar 'John and Matt Rivera are typing'.
- Changed from previous: Commenters have left comments, so the comments button gets a count badge; header avatars back to three.
- Action that leads here: Commenters post comments; user hovers the comments icon in the header (click likely opens the comments panel).
- Designer annotations nearby: "commentators messages have come"
- Nav state: dark, collapsed
- Open surfaces: no panel yet; comments badge visible
- Components (main component, variant):
  - Main_nav {types=collapsed}
  - Avatar group {Size=xs}
  - Buttons/Button Neutral {Size=sm, Hierarchy=Tertiary, Icon=Only, State=Default}
  - Buttons/Button Neutral {Size=sm, Hierarchy=Tertiary, Icon=Only, State=Hover}
  - Pill solid {Size=xxs, Type=Pill color, Icon=False, Color=Gray}
  - Inline Artifact Cards {State=Application-HTML}
  - Collaborative chat-large {State=User Typing, Users=Max Users}
  - Cursor {State=Arrow}
  - Copilot desktop Input Box {Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No}
- Component sets: `Main_nav`, `Avatar group`, `Buttons/Button Neutral`, `Pill solid`, `Inline Artifact Cards`, `Collaborative chat-large`, `Cursor`, `Copilot desktop Input Box`

## Open questions
- Who can flip 'Assistant Replies' (owner only or every editor) and is it per chat or per user? Label casing differs: 'Assistant Replies' (01-07) vs 'Assistant replies' (08-10).
- Composer placeholder is 'Queue follow-up...' whenever others are typing. Does sending queue the message (see the Chat in queue journey) or post immediately?
- Step 09 uses Collaborative chat-large Users=Max Users but step 10 shows three avatars with the same variant; which avatar count is intended?
- What opens from the comments icon in step 10? Presumably the comments panel from the 'Comments for commenters only' journey.
- Copy slips to confirm: '@Assitant' (07-08), 'Matt Rivera are typing' (06-07), 'John Whitake' (03, 09), and owner persona 'Roger Bennett (You)' in step 09 vs Lana Steiner in the share modals.
- Step 02 shows a grey strip under the composer down to the frame edge; likely a drawing slip.
- Does the mention list always put 'Assistant' first, and is it hidden when Assistant Replies is off?
