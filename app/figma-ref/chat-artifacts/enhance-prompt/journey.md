# Enhance prompt with AI (option 1)

- Journey id: `enhance-prompt`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `9860:711731` "Enhance Prompt with AI option 1" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9860-711731
- Baseline: 1440x900. All five frames are the new-session landing page; only the composer changes.
- What it specifies: a sparkle "Enhance with AI" icon button in the composer's right toolbar, between the model icon and the mic, set off by a thin vertical divider. It is disabled until the prompt has 3 words. Clicking it rewrites the prompt in place (skeleton shimmer while loading).

## Steps

### 01 — `10230:663810` ("1") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10230-663810) — `01-10230-663810.png`
- Shows: landing page with the swirl "Company Logo" mark, "Hello Roger / How can I help you today?", empty composer ("Use /skill to give your agent a capability.", + / Company / Research). Right toolbar: model icon, divider, sparkle Enhance icon (disabled, light grey), mic, voice. Connect apps banner.
- Changed from previous: start of the journey.
- Action: open a new session.
- Designer annotation: "Option 1" (above the frame).
- Nav: dark, collapsed. Composer: landing, empty. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; Company Logo; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No; Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only, State=Disabled (Enhance); Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only, State=Default; Banner carousel / Property 1=Three apps.

### 02 — `10247:277018` ("2") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10247-277018) — `02-10247-277018.png`
- Shows: composer filled with "AI-generated insights based on the inputs provided."; the Enhance icon is enabled (dark), and the voice icon is replaced by the dark round Send button.
- Changed from previous: text typed; Enhance enabled; Send appears.
- Action: type a prompt of 3 or more words.
- Designer annotation (top-left of the frame): "AI Enhance icon is enableds only after typing 3 words".
- Nav: dark, collapsed. Composer: landing, filled.
- Components: Main_nav / types=collapsed; Company Logo; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=One line, Attachment=No; Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only, State=Default (x2); Banner carousel.

### 03 — `10247:282174` ("3") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10247-282174) — `03-10247-282174.png`
- Shows: pointer on the Enhance icon: grey circular hover background and a dark tooltip "Enhance with AI" above it (arrow bottom-centre).
- Changed from previous: hover state + tooltip.
- Action: hover the Enhance (sparkle) icon.
- Nav: dark, collapsed. Composer: landing, filled. Tooltip: open.
- Components: Main_nav / types=collapsed; Company Logo; Copilot desktop Input Box / Text=One line; Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only, State=Hover; Buttons/Button Neutral / State=Default; Tooltip / Supporting text=False, Arrow=Bottom center; Cursor / State=Arrow; Banner carousel.

### 04 — `10247:280053` ("4") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10247-280053) — `04-10247-280053.png`
- Shows: the prompt text is replaced by two grey skeleton bars with a shimmer gradient (one full width, one about 2/3). The Enhance icon becomes a stop (square in circle) button, and Send is disabled (light grey).
- Changed from previous: enhancing in progress: text -> skeleton, Enhance -> Stop, Send disabled.
- Action: click "Enhance with AI".
- Nav: dark, collapsed. Composer: landing, loading.
- Components: Main_nav / types=collapsed; Company Logo; Copilot desktop Input Box / Type=Landing Page, Text=One line; Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only, State=Default (x2: stop + mic); Banner carousel.

### 05 — `10247:286242` ("5") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10247-286242) — `05-10247-286242.png`
- Shows: the rewritten prompt fills two lines: "This space will display AI-generated insights based on input sufficient data is available, the system will analyze patterns and generate". The Enhance icon is disabled again, and Send is active.
- Changed from previous: skeleton replaced by the enhanced text (Text=Two line); Enhance disabled (already enhanced); Send re-enabled.
- Action: none (enhancement completes).
- Nav: dark, collapsed. Composer: landing, filled (two lines).
- Components: Main_nav / types=collapsed; Company Logo; Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=Yes, Text=Two line, Attachment=No; Buttons/Button Neutral / Size=md, Hierarchy=Tertiary, Icon=Only, State=Disabled; Buttons/Button Neutral / State=Default; Banner carousel.

## Open questions

1. These frames use the swirl "Company Logo", which is Option 2 of the logo exploration. The confirmed decision is Option 1 (circular dots). The prototype will use the dots logo here. Confirm.
2. After enhancing, the Enhance icon is disabled (05). Does it re-enable when the user edits the text? Is there an undo, or a "revert to original" affordance?
3. Can the stop button in 04 cancel the enhancement and restore the original text?
4. Does Enhance also exist in the bottom (in-chat) composer, or only on the landing composer?
5. The 3-word threshold is from the annotation ("enableds" typo). Are words counted by whitespace?
