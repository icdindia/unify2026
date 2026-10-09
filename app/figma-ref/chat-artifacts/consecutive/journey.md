# Consecutive messages spacing

- Journey id: `consecutive`
- Figma page: Chat + Artifacts (`1707:115989`), section "Collaborative Chat flow" (`7830:372599`)
- Title card: `11649:348308` "Consecutive msgs spacing" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11649-348308
- Baseline: 1440x900.
- What it specifies: how messages stack in a collaborative chat when the same person sends several in a row, compared with when the sender changes. No designer annotations sit near the frame; the spacing below is measured from the frame's layers.

## Measured spacing (frame coordinates)

- Consecutive user messages (right-aligned, the viewer's own): bubble 1 at y 65 (h 42, ends 107); its hover actions row (copy, edit; 52x24) at y 111; bubble 2 at y 139. So there are 32px between consecutive bubbles, and the hover actions sit inside that gap (4px below the bubble).
- Consecutive messages from another person (left-aligned): sender row (20px avatar + name) at y 221; first bubble at y 245 (24px below the avatar top); bubble 2 at y 371 after bubble 1 ends at 339, so 32px between consecutive bubbles. The name and avatar are not repeated.
- Sender change: Matt's first group ends at y 465; the next sender row starts at y 505, so 40px between groups. Same 40px from the last bubble (ends 671) to the Assistant "Thinking..." row (y 711).
- Component internals: `Copilot_User Message_Desktop full / Type=Consecutive msgs` = vertical auto-layout, item spacing 32, padding bottom 40; each "Message Body" has padding 8/16/8/16 and radius 12; the hover actions "CopilotBase_Feeback Actions" have 4px spacing.

## Steps

### 01 — `11633:344632` ("1") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11633-344632) — `01-11633-344632.png`
- Shows: collaborative chat "How does commit actually look?" (chevron). Header: avatar stack M / J / G, "$1.23" cost ring, Share (people icon), clipboard, comment icon. Two consecutive right-aligned user bubbles ("@Matt Rivera What are some creative ways to reward community members?" and "@Roger What are some creative ways..."), each with copy + edit icons under it (hover state). Matt Rivera group with two bubbles ("Two of those six I would write off today..." / "The other four are real..."). A second Matt Rivera group ("Easier to show you than describe it." / "@Assitant give me an interactive view of the quarter..."). Assistant avatar "Thinking...". Above the composer, a collaboration strip: "Type @ to mention a participant" on the left, "Assistant Replies" toggle (ON) on the right. Composer placeholder "Queue follow-up..." with a disabled Send.
- Changed from previous: single-frame journey. Compared with chat-artifact step 14, it adds hover actions on own messages, the collaboration strip, and the "Queue follow-up..." placeholder.
- Action: none (spacing spec). In context, Matt has tagged @Assistant and the Assistant is thinking, so new input is queued.
- Nav: dark, collapsed. Composer: bottom, default, with the collaboration strip and queue placeholder. Artifact panel: closed. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=Default; Copilot_User Message / State=Default; Agent COT / Type=Complete 2; Response_Desktop full / Property 1=Assistant (x2); Copilot_User Message_Desktop full / State=Hover, Type=Consecutive msgs (x2); Copilot_User Message_Desktop full / State=Default, Type=Default; Collaborative chat-large / State=Default, Users=No; Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No.

## Open questions

1. The second own bubble mentions "@Roger" although the viewer seems to be Roger. Placeholder copy, or is the viewer someone else? Typo "@Assitant" again.
2. Do the copy and edit actions under own messages show only on hover (the frame uses State=Hover on both bubbles), or always for the latest message?
3. Is there a maximum time gap after which consecutive messages from the same sender start a new group (name and avatar repeated)?
4. "Assistant Replies" toggle: when OFF, does the Assistant ignore messages without an @Assistant mention? The "Queue follow-up..." placeholder suggests input is queued while the Assistant is thinking; is that the queue journey (`queue-1`)?
