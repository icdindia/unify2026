# Top header dropdowns (Apps, Download, Version history, Input menu)

- Journey id: `header-dropdowns`
- Figma page: Chat + Artifacts (1707:115989), section "Artifacts — Interactive Flows & Components" (1969:507279)
- Title card: `1969:507284` - https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507284
- Title card text: "Top Header Dropdowns"
- Layout in Figma (y 3164-3366): two chat-header strips (`ES Breadcrumb`, 1384 x 40) on top, then five loose dropdowns left to right.
  There are no full-screen steps in this journey; each dropdown belongs to a header control shown in other journeys.

## Shell context

| | |
|---|---|
| Chat header | `ES Breadcrumb / Variant=Default` (1384 x 40, sits right of the 56px rail): chat title, avatar group, cost "$1.23" with a progress ring, Share (lock), clipboard icon |
| Artifact header | `Arifact Header` (see artifact-view-editor-main): Excel split button, version "v3" dropdown, download |
| Theme | Light; dropdowns are white cards with soft shadow |

## Components (loose frames, in Figma order)

| # | Node | Image | What it shows | Trigger (most likely) |
|---|---|---|---|---|
| c01 | `1969:507290` "Apps Dropdown" (FRAME, 332 x 342) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507290) | `c01-1969-507290.png` | OPEN IN: Google Sheets "Exports a copy to your Google Drive", Sharepoint "Exports a copy of the spreadsheet to SharePoint"; DOWNLOAD: Excel, PDF, CSV (one-line descriptions each); divider; Copy to clipboard "Copies the table so you can paste it straight in". In this copy the leading icons are placeholder radio circles (Excel logo misplaced). The real component with brand logos is `Apps Dropdown` COMPONENT 12703:449317 inside artifacts-landing step 08 (3780:178324). | Click the chevron of the Excel split button in the artifact header (spreadsheet artifact). |
| c02 | `1969:507305` "Download Dropdown" (FRAME, 332 x 120) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=1969-507305) | `c02-1969-507305.png` | DOWNLOAD: HTML "Downloads a self-contained file" (App logo), Sharepoint "Exports a copy of the spreadsheet to SharePoint" (placeholder icon; copy still says spreadsheet). | Export / download split on an App (HTML) artifact. |
| c03 | `9200:349032` "Version History" (FRAME, 280 x 142) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=9200-349032) | `c03-9200-349032.png` | Versions list with radio-style leading icons: "all header icons for reference.xls - Today • Latest" (highlighted), "Artifact name 1 - Yesterday • 14:14", "Artifact name 2 - 3 days ago • 08:12". | Click "v3" version dropdown in the artifact header, or hover "Versions" in the artifact-name menu (artifact-view-editor-main 01 shows this as a submenu). |
| c04 | `6077:427693` `Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default` (225 x 212) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427693) | `c04-6077-427693.png` | PEOPLE WITH ACCESS: Roger Bennett (You) Owner, Matt Rivera Editor, John Whitake Editor, Grace Coleman Editor, Natali Craig Viewer (letter avatars, role in mono on the right). | Click the avatar group in the chat header. |
| c05 | `6077:427694` `Dropdown Menu / Type=Small` (260 x 72) - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427694) | `c05-6077-427694.png` | Two artifact rows: "Client Renewal - Position Brief" (doc icon), "Churn Risk — Accounts at Renewal" (sheet icon). | Most likely the clipboard icon at the right of the chat header (artifacts in this chat). |
| c06 | `6077:427818` `ES Breadcrumb / Variant=Default` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427818) | `c06-6077-427818.png` (1384 x 40) | Chat header default: "How does commit actually look?", avatars M J G Z +5, $1.23, Share, clipboard. | Context for c04 / c05. |
| c07 | `6077:427883` `ES Breadcrumb / Variant=Default` - [link](https://www.figma.com/design/lqKjNjyifEXCeywg69Knr2/?node-id=6077-427883) | `c07-6077-427883.png` (1384 x 40) | Same header with the chat title in hover state (grey pill). A 12px `Pill solid` (6077:427951) is placed on this strip near Share / clipboard (x ~1328), probably a notification dot. | Hover the chat title. |

## Components (instance main-component names)

| Component | Where |
|---|---|
| `Dropdown list header / Type=H2` | c01, c02 |
| `Dropdown list item / Start Type=Default, End Type=Shortcut, Selected=Off, State=Default, Divider=False, Supporting Text=On, Size=sm` | c01, c02, c03 |
| `Dropdown list item / ..., Selected=On, ..., Supporting Text=On, Size=sm` (current version) | c03 |
| `Dropdown list item / ..., Divider=True, Supporting Text=Off, Size=md` (dividers) | c01 |
| `coloured logos / Type=excel`, `coloured logos / Type=App` | c01, c02 |
| `Input Menu Dropdown / Type=Single Select, Size=sm, Search=Default` with `Input dropdown Menu Item / Size=sm, Type=Avatar leading, State=Default, Selected=False, Stacking=Single Line` (x5) and `Type=Default` (section label) | c04 |
| `Dropdown Menu / Type=Small` with `Dropdown list item / ..., Supporting Text=Off, Size=sm` (x2) | c05 |
| `ES Breadcrumb / Variant=Default` with `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Default, State=Default/Hover`, `Avatar group / Size=xs`, `Buttons/Button Neutral / Size=sm, Hierarchy=Tertiary, Icon=Only` | c06, c07 |
| `Pill solid` | near c07 |

## Open questions

1. c01 / c02 here are frame copies with placeholder icons; should dev use the `Apps Dropdown` component 12703:449317 (with logos) as the source of truth?
2. c02 Sharepoint row says "spreadsheet" for an HTML/App artifact - copy to fix?
3. c05: which control opens it (clipboard icon vs chat-title chevron)? Does choosing an item open that artifact in the split panel?
4. c04: is the people list read-only, or does it allow role changes / "Add people" (see add-users and share-artifact journeys)?
5. c03: does choosing an older version replace the canvas in place with a "viewing old version" banner / restore action? Not drawn.
6. The `Pill solid` dot on c07: what does it signal?
