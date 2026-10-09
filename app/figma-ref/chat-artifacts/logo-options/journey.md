# Thinking/logo animation (option 1: circular dots)

- Journey id: `logo-options`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: none. The frame is labelled by the canvas text "Option1. Circular dots" (`3541:59986`) placed directly above it. "Option2. Company Logo" (`3541:59987`) is to the right and is ignored per the "Option 1 only" decision.
- Baseline: 1440x900.

## Steps

### 01 — `3612:167773` (COMPONENT "1") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=3612-167773) — `01-3612-167773.png`
- Shows: new-session landing page with the circular-dots brand mark (70x70 `EB-Assistant/AI`, a ring of dark dots fading to light) above "Hello *Roger*" (serif, italic name) and "How can I help you today?". Landing composer with placeholder "Use /skill to give your agent a capability." and only the "+" on the left (no Company / Research chips: Tools & Sources=No), model / mic / voice icons on the right. "Connect apps" banner carousel at the bottom with three pager dots.
- Changed from previous: single-frame journey.
- Action: open a new session (rail "+").
- Nav: dark, collapsed. Composer: landing, empty. Artifact panel: closed. Side panel: none. Modal: none.
- Designer annotation: "Option1. Circular dots" (above the frame).
- Components: Main_nav / types=collapsed; EB-Assistant/AI (the dotted logo, 70x70); Copilot desktop Input Box / Type=Landing Page, State=Default, Tools & Sources=No, Text=Placeholder, Attachment=No; Banner carousel / Property 1=Three apps.
- Motion wiring found in the file:
  - "thinking state" (set `484:117565`): State=1 <-> State=2 every 0.8s (AFTER_TIMEOUT).
  - "_Text animate Desktop" (set `5546:212948`): the composer placeholder rotates through four hints, each held 4.5s, with a 0.2s "Break" frame between, SMART_ANIMATE 300ms: "Describe the outcome — I will build the steps." -> "Use + to connect the necessary apps." -> "Use @name to bring an agent or colleague here." -> "Use /skill to give your agent a capability." (prop=04 swaps in "Chat to search the enterprise database.").

## Open questions

1. The journey is called "Thinking/logo animation", but the only frame is a static landing page. Is the dotted logo meant to animate on the landing page (for example rotate or pulse while idle), or only when it becomes the thinking glyph in chat? The file has no reaction on the logo itself.
2. This landing composer has no Company / Research chips (Tools & Sources=No), unlike the other landing frames. Is that deliberate for this option or just an older instance?
