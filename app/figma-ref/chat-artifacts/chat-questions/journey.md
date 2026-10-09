# Chat questions

- Journey id: `chat-questions`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `6944:511588` "chat questions" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6944-511588
- Baseline: 1440x900.
- Context: the same chat as the end of `chat-artifact` (split view, "Untitled.xls" artifact open). The agent asks the user a clarifying multiple-choice question.

## Steps

### 01 — `5873:530156` ("80") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=5873-530156) — `01-5873-530156.png`
- Shows: split view. Left chat column: Assistant answer with the "Pipeline Command — Interactive HTML • 123 KB • Version 1" card (download icon), John Whitaker's message, then a question card docked above the composer: title "Where should it land when it is done?" with a close X; numbered options 1 "Email", 2 "All escalations, grouped by account", 3 "Email and Slack" (hovered: dark filled number badge, grey row, arrow on the right), 4 "In the app only"; last row is a free-text input with a pencil icon, "Describe the shape you want", and a "Skip" button. A small loading arc shows at the card's top-left corner. The composer is pushed down and partly cut off at the bottom. Right: artifact panel "Untitled.xls" with the Acme Inc. dashboard; header shows copy, refresh, v3, Publish, comment, download, expand, close.
- Changed from previous: single-frame journey. Compared with chat-artifact step 21 the version menu is closed, and the question card is inserted between the messages and the composer.
- Action: the agent asks a follow-up question. The user can click an option (or press its number), type a custom answer, Skip, or close.
- Nav: dark, collapsed (Artifacts icon selected). Composer: bottom of chat column, pushed down by the question card. Artifact panel: open (split). Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=with Icon; Copilot_Question Card / Property 1=hover; Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No; Arifact Header; Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=sm; Cursor / State=Arrow.
- Prototype wiring: "Copilot_Inline Citation Pill" ON_PRESS change-to (`1713:251343`); "WYSIWYG tooltip dark" ON_CLICK navigate (no destination set).

## Open questions

1. Only the hover state of the question card exists (`Copilot_Question Card / Property 1=hover`). What happens after an option is picked: does the card collapse into a user message ("Email and Slack") and the agent continue? Is there a selected or submitted state?
2. Does the question card replace the composer while open, or sit above it? Here the composer is pushed partly off-screen.
3. What does the loading arc at the card's top-left corner mean: a timeout or auto-skip countdown, or agent progress?
4. Can the free-text "Describe the shape you want" field be submitted with Enter, and does Skip dismiss the card and let the agent pick a default?
