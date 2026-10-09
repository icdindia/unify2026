# Deleted artifact

- Journey id: `deleted-artifact`
- Figma page: Chat + Artifacts (`1707:115989`), section "Chat" (`1707:133527`)
- Title card: `6944:511590` "deleted artifact" — https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6944-511590
- Baseline: 1440x900.
- Context: the same chat as the end of `chat-artifact`. The user opens the "Pipeline Command" artifact from the chat, but the artifact has been deleted.

## Steps

### 01 — `6944:511592` ("103") — [Figma](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6944-511592) — `01-6944-511592.png`
- Shows: split view. The left chat column is unchanged (Assistant answer + "Pipeline Command — Interactive HTML • 123 KB • Version 1" card, John and Grace messages, the original user question, composer). The right artifact panel keeps its header ("Untitled.xls", copy, refresh, v3, Publish, comment + chevron, download, expand, close) but the body is a grey empty state: stacked file illustrations, serif heading "Oops! Artifact is deleted", subtext "This artifact no longer exisits", and an outlined "Recreate the Artifact" button with a rotate icon. The cursor is near the close X.
- Changed from previous: single-frame journey. Compared with chat-artifact step 20 the artifact body is replaced by the deleted empty state.
- Action: click the inline artifact card ("Pipeline Command") for an artifact that has been deleted.
- Nav: dark, collapsed (Artifacts icon selected). Composer: bottom of chat column. Artifact panel: open (split), empty state. Side panel: none. Modal: none.
- Components: Main_nav / types=collapsed; ES Breadcrumb / Variant=with Icon; Copilot desktop Input Box / Type=Bottom small, State=Default, Tools & Sources=Yes, Text=Placeholder, Attachment=No; Arifact Header; ES Empty State / Level=Level 1, Type=Create; Scroll bar / Orientation=Vertical, Bg=False, Position=Top, Size=sm; Cursor / State=Arrow.

## Open questions

1. Typo in the design: "This artifact no longer exisits". The prototype will use "exists" unless told otherwise.
2. Should the header actions (Publish, version v3, download, comment) stay enabled when the artifact is deleted? In the frame they look active.
3. What does "Recreate the Artifact" do: re-run the generating prompt in the chat (new Assistant turn), or restore a version?
4. Should the inline card in the chat also show a deleted state? Here it still reads "Interactive HTML • 123 KB • Version 1".
