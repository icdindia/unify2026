# Publish artifacts flow (modals)

- Journey id: `publish-artifact`
- Figma page: Chat + Artifacts (1707:115989), section "Artifacts — Interactive Flows & Components" (1969:507279)
- Title card: `1969:507280` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507280
- Title card text: "Publish Artifacts flow Models"
- Layout in Figma: one full frame (step 01) followed by loose 440px modal units in two rows.
  Row 1 (y 742, left to right) = first-time publish; row 2 (y 1319) = second-time publish. Annotations above the rows:
  "first time" (over row 1), "second time" (over 11933:737092), "restricted card click" (over 11933:737342),
  "view who all have access" (over 11933:737464).

## Shell state (step 01, modals open over it)

| | |
|---|---|
| Theme | Light content, dark-green collapsed rail |
| Rail | `Main_nav / types=collapsed`; the New (+) item is highlighted (new chat) |
| Composer | Yes - chat column composer "Ask anything..." (`Copilot desktop_Input Box / Breakpoint=Desktop, Size=Two-lines, State=Default, Position=Center`) |
| Artifact panel | Yes - split view: chat column 441px, artifact panel 943px (`Form Header` 40px + canvas), drag handle at x 493 |
| Modal | The modal units below open centred over this screen (no scrim frame is drawn) |

## Steps

### 01 - Chat + artifact split, hovering Publish
- Node: `1990:517731` (frame "35") - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1990-517731
- Image: `01-1990-517731.png`
- Shows: chat column titled "New routine" (chevron) with the assistant line "How can I help you improve or alter this app?" and an empty composer;
  artifact panel "Pipeline Command" (App icon) with refresh, add-comment, download, "v3" version dropdown, "Publish" (hover state, cursor on it),
  expand, close; canvas = Acme Inc. dashboard.
- Changed from previous: first step (artifact generated in a chat).
- Action that leads here: open / generate an App artifact in chat, then hover the "Publish" button in the artifact header.

## Modal units (components, in Figma order)

| # | Node | Image | What it shows | Most likely trigger |
|---|---|---|---|---|
| c01 | `1969:507322` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507322) | `c01-1969-507322.png` (440 x 258) | "Publish Artifact" modal, first time: ARTIFACT URL "pipeline-command" + copy icon; VISIBLE TO "Everyone at UnifyApps - Anyone signed in to your workspace" row with chevron (cursor on it); "Publish" primary button. | Click Publish in the artifact header (step 01). |
| c02 | `1969:507360` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507360) | `c02-1969-507360.png` | "Who can view this?" (back arrow): Everyone at UnifyApps (radio selected), Restricted "Only the people and groups you choose" (chevron); "Done". | Click the VISIBLE TO row in c01. |
| c03 | `11933:737342` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-737342) | `c03-11933-737342.png` | Same as c02 but the Restricted row shows an avatar group (O, T, +5) - people were already added. Annotation: "restricted card click". | Second time: click VISIBLE TO in c11. |
| c04 | `11905:590138` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-590138) | `c04-11905-590138.png` | Same as c02 with the Restricted row hovered (cursor). | Hover Restricted. |
| c05 | `11905:590328` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-590328) | `c05-11905-590328.png` | Restricted detail: "Add people and groups" input; WHO HAS ACCESS: Lana Steiner (you), lanasteiner@unifyapps.com, Owner; "Done". | Click Restricted in c04. |
| c06 | `11933:737464` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-737464) | `c06-11933-737464.png` (440 x 374) | Who has access list: Lana (Owner), Candice Wu, Natali Craig, Management (Group • 6 people), each non-owner with a trash icon. Annotation: "view who all have access". | Second time: click the Restricted row (with avatars) in c03. |
| c07 | `11905:590614` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-590614) | `c07-11905-590614.png` | Add-people input focused with tag "Management (6) ×"; list: Lana (Owner), Candice Wu "Editor ˅", Natali Craig "Editor ˅". | Pick a group / people in the add-people search. |
| c08 | `11905:590883` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-590883) | `c08-11905-590883.png` | Visually the same as c07 (4px shorter). Has the search dropdown placed over it: | Type in the add-people input. |
| c08a | `11919:591369` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11919-591369) | `c08a-11919-591369.png` (416 x 372) | `Input Menu Dropdown` results: Leadership (Group • 12 people), Management (Group • 6 people, checked), Lana Steiner, Demi Wilkinson, Candice Wu, Natali Craig, Drew Cano. Sits on top of c08 in Figma. | Typing in the add-people input. |
| c09 | `11933:736147` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-736147) | `c09-11933-736147.png` | "Publish Artifact" with VISIBLE TO = Restricted "To you and people, groups you choose" + avatars (C, Z, +5); Publish hovered (cursor). | Done in c07/c08 returns here. |
| c10 | `11933:736622` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-736622) | `c10-11933-736622.png` | Same as c07 but rows show trash icons instead of the Editor role dropdown. | Unclear - alternate of c07 (remove instead of role). |
| c11 | `11933:737092` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11933-737092) | `c11-11933-737092.png` | "Publish Artifact", second time: Restricted + avatars; footer has "Unpublish" (left, ghost with icon), "Cancel", "Publish" (hovered). Annotation: "second time". | Click Publish in the header of an already published artifact. |
| c12 | `11905:589839` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=11905-589839) | `c12-11905-589839.png` (480 x 1118) | "Changelog — Modal Unit": a design-change log card (ADDED / REMOVED entries by LISA, "77 changes, generated without AI summary"). Designer documentation of edits to the Modal Unit, not product UI. | n/a |

Suggested first-time order: 01 -> c01 -> c02 -> c04 -> c05 -> c08 + c08a -> c07 -> (Done) -> c09 -> Publish.
Second time: 01 -> c11 -> c03 -> c06.

## Components (instance main-component names)

| Component | Where |
|---|---|
| `Main_nav / types=collapsed` | 01 |
| `ES Breadcrumb / Variant=with Icon` (chat header "New routine") | 01 |
| `COT / Type=Main, State=Default, Running=No` | 01 |
| `Copilot desktop_Input Box / Breakpoint=Desktop, Size=Two-lines, State=Default, Position=Center` | 01 |
| `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Only` (refresh, comment, download, expand, close), `Buttons/Button Neutral / Size=xs, Hierarchy=Secondary` (v3 dropdown; Publish in `State=Hover`) | 01 |
| `Cursor / State=Arrow` / `Cursor / State=Pointer Hand` | 01, c01, c04, c09, c11 |
| `Modal header / Type=Default, Size=xs, back=no` (Publish Artifact) and `back=yes` (Who can view this?) | all modals |
| `Section label / Level=Level 1(Alt)` (ARTIFACT URL, VISIBLE TO, WHO HAS ACCESS) | c01, c05-c11 |
| `List Item / Size=xs, Type=Icon simple, Selected=False, State=Default` | c01-c04, c09, c11 |
| `List Item Cardified / Size=md, Type=Icon simple, Selected=False, State=Default` | c06, c07, c08, c10 |
| `Avatar group / Size=xs` | c03, c09, c11 |
| `Avatar / Size=md, Type=Letter, Colour=Brand Solid, State=Default` | c05-c08, c10 |
| `Input dropdown_outline / Size=md, Type=Default, State=Placeholder` and `Type=Tags, State=Focused` | c05-c08, c10 |
| `Input Menu Dropdown` | c08a |
| `Modal actions / Type=Horizontal right aligned (checkbox), Size=xs, Destructive=False` | all modals |

## Open questions

1. No scrim / page-behind frame exists for the modals. Assume the modal is centred over step 01 with the standard scrim (as in the Delete Artifact modal, artifacts-landing 06)?
2. c07 vs c10: role dropdown ("Editor") vs trash icon per person. Which is final, or is c10 the read-only "who has access" after publish?
3. c08 is identical to c07; is it only the base for the search dropdown (c08a)?
4. What does "Done" in "Who can view this?" do when nothing changed - back to c01, or close?
5. After Publish: is there a success toast / published state on the header button (e.g. "Published" / "Update")? Not drawn.
6. Artifact URL "pipeline-command": is it editable, and does copy show a toast?
7. Step 01 header (Form Header) differs from `Arifact Header` used elsewhere (refresh, add-comment, download, v3, Publish, expand, close). Which header is canonical for the chat split view?
