# Agent animation of thinking

- Journey id: `thinking`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `8528:615291` "Agent animation of thinking" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8528-615291
- Baseline: 1440x900.
- What it specifies: the "Thinking..." row that appears right after a prompt is sent, before any chain-of-thought text streams. The motion lives in component variants wired with AFTER_TIMEOUT "change to" reactions (listed below), not in the frames themselves.

## Steps

### 01 — `8863:220940` ("191") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=8863-220940) — `01-8863-220940.png`
- Shows: chat view right after sending "We are two-thirds through the quarter. How does commit actually look?". Under the user bubble, about 90px lower: a 3x3 dot-grid glyph (no circle background) and grey "Thinking...". Header: title "How does commit actually look?" (no chevron), "$1.23" cost with ring, lock Share, clipboard. Composer docked at the bottom in Generating state (stop button).
- Changed from previous: start of the journey (the prompt was just sent from the landing page).
- Action: send a prompt from the landing composer.
- Nav: dark, collapsed. Composer: bottom, generating. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Agent COT / Type=Step 1; Copilot desktop Input Box / Type=Bottom small, State=Generating, Tools & Sources=Yes, Text=Placeholder, Attachment=No; (Banner carousel is in the layer tree but not visible).
- Motion wiring found in the file:
  - `Agent COT` (set `8863:218607`) runs by itself: Type=Step 1 -> (4s) Step 2 -> (2.5s) Step 3 -> (2.5s) Step 4 -> (2.5s) Step 5 -> (2.5s) Step 6 -> (2.5s) Step 7 -> (2.5s) "All  1 line thoughts" -> (2.5s) Complete 1 -> (0s) With Answer. Complete 2 is a separate end state.
  - `_thinking state` (set `7534:291688`, 248x20): State=1 <-> State=2 with a 0s / 0.2s loop (fast dot shimmer on the glyph).

### 02 — `10139:466731` (INSTANCE "204" of component "3") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=10139-466731) — `02-10139-466731.png`
- Shows: same chat, but "Thinking..." now has the round dark-green avatar with white dots, and it sits closer to the user bubble (row at y≈167 instead of y≈229). The header title has its chevron.
- Changed from previous: the thinking glyph gains its circular avatar background; the row moves up; the title chevron appears.
- Action: none (time passes while the agent is thinking).
- Nav: dark, collapsed. Composer: bottom, generating. Panels/modals: none.
- Components: instance of "3" (the chat screen component also used as chat-artifact step 03) > Main_nav / types=collapsed (Component 2 / Type=Icon only, Nav_menu/Main / Variant=Collapsed, State=Selected + 7x Default, Nav_menu/Footer / Variant=Collapsed); ES Breadcrumb / Variant=Default; Copilot_User Message_Desktop full / State=Default, Type=Default; Agent COT / Type=Step 1; Copilot desktop Input Box / Type=Bottom small, State=Generating; Frame 2147266815. In the layer tree but hidden or clipped: All COT / Property 1=1, Feedback Array / Type=Full screen, Suggested prompts / Type=Lines, and a FY2023 revenue vs gross margin chart.
- Motion wiring: `_thinking state` (`3518:217901`) State=2 <-> State=1 every 0.8s; `thinking state` (set `484:117565`) State=1 <-> State=2 every 0.8s.

## Open questions

1. The two frames show two different thinking glyphs: a bare 3x3 dot grid in 01, and a round avatar with dots in 02. They also sit at different distances from the user bubble (about 90px vs 28px). Is 01 the first beat of the animation and 02 the resting state, or are these two options? The card says "Agent animation of thinking" and gives no option labels.
2. Which loop timing is canonical: the 0.2s `_thinking state` (7534) or the 0.8s `thinking state` / `_thinking state` (484 / 3518)?
3. Frame 02 is an instance of the chat-screen component "3". Its hidden layers include a FY2023 revenue chart from the Graphs journey, so this component is shared scaffolding. Confirm it should not show anything beyond "Thinking...".
