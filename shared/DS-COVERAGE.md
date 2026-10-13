# Figma → code coverage

Source: Figma file `qT9zH1YYapGTwpJxwNEGzt` (Unify2026 Design System). Status as of 2026-10-12.
Legend: **built** = atom in `components/<name>/` with a Design System preview; **audited** = existing atom checked against Figma;
**partial** = main variants built, gaps listed; **—** = not started. No preview has been compared pixel-for-pixel with Figma yet.

## Foundations

| Figma page | Node | Status | Where |
|---|---|---|---|
| Colors | 1023:36350 | built, verified (all 513 variables match) | `shared/tokens.css`, `tokens.live-overrides.css` |
| Typography | 18:1951 | built, 72 of 106 styles verified | `shared/typography.css` |
| Spacing, radius & grids | 5245:372829 | spacing + radius tokens built; layout grids documented below | `shared/tokens.css` |
| Effect styles (WIP in Figma) | 1030:33573 | built, light theme only | `shared/effects.css` |
| Icons / Misc icons | 3463:407484 / 1025:31781 | partial: 94 icons exported | `shared/svg-icons/` |
| Logos, Tags, Design annotations | 1083:118533 / 3306:403749 / 1054:557 | Tags built (`tag`); Logos and annotations — | |

Layout grids: desktop = 12 columns, gutter 32, margin 112, container 1216; tablet = 6 columns, gutter 32, margin 32; mobile = 4 columns, gutter 16, margin 16.

## Shared components

| Figma page | Node | Status | Atom |
|---|---|---|---|
| Buttons | 1:1183 | existing atom, not re-audited | `button` |
| Button + Toggle groups | 16:399 | built | `button-group` (filter-bar keeps its compact `.toggle-group`) |
| Checkboxes | 1097:63638 | partial | `checkbox` |
| Dropdowns | 18:0 | partial | `dropdown` |
| Inputs | 85:1269 | partial | `input` |
| Alerts & notifications | 176:4256 | partial | `alert`, `snackbar` |
| Progress indicators | 1154:89940 | partial | `progress` |
| Sliders | 1086:1423 | partial | `slider` |
| Toggles | 1102:4631 | built | `toggle` |
| Tooltips | 1052:485 | partial | `tooltip` |
| Scrollbar | 30309:23743 | built | `scrollbar` |
| Selection Pill | 22081:8383 | partial | `selection-pill` |
| Avatars, Stat Card, List Item cards | 13931:29731 / 9012:17245 / 122:3484 | existing atoms, not re-audited | `avatar`, `stat`, `list-item` |
| Copilot, Preview Modal, Thumbnail | 70268:16200 / 71561:14622 / 44289:6384 | Copilot has product-specific atoms (`copilot-input`, `cot`); Preview Modal —; Thumbnail not a UI component | |

## Application components

| Figma page | Node | Status | Atom |
|---|---|---|---|
| Headers | 190:4871 | audited: Levels 2/3, Back, Tabs, sidepane and section-label headers missing | `page-header`, `form-header` |
| Section footers | 3275:371793 | partial | `section-footer` |
| Modals | 172:4293 | partial: full screen and popover header missing | `modal` |
| Side Panel | 9501:2358 | partial | `side-panel` |
| Messaging | 10021:10301 | partial: attachments and reactions missing | `message` |
| Navigation | 82:1862 | audited: expanded sidebar with submenu, 68px icon-only, header nav, bottom nav missing | `main-nav`, `nav-rail` |
| Pagination | 225:7288 | built | `pagination` |
| Progress steps + Timeline | 53:1288 | partial | `stepper` |
| Tabs | 43:0 | partial: Rounded Folder xs and Folder Destructive/Badge missing | `tabs`, `horizontal-tabs` |
| Tables | 214:0 | partial: cell styles not coded | `table` |
| Breadcrumbs | 43:3087 | partial: "With Button" and workspace types missing | `breadcrumb` (`es-breadcrumb` = chat header) |
| Code snippets | 1221:106300 | built | `code-snippet` |
| Date pickers | 1143:85678 | partial: month header, weekday row, time input, range flow missing | `date-picker` |
| Pill | 12:539 | existing atom, not re-audited | `pill` |
| Empty states | 1172:31 | partial: Stepper, Chat and Status variants missing | `empty-state` |
| Loading indicators | 1172:32 | partial: dot style missing | `spinner` |
| File upload | 1157:90306 | partial: lg size, file-type icons, error/complete missing | `file-upload` |
| Charts | 65348:31489 | skipped (work in progress in Figma) | — |

## Known value drift (all marked DRIFT in the css)

- Focus-ring second layers and some shadows are literals; the matching `--ring-*` / `--shadow-*` tokens now exist in `shared/effects.css` and can replace them.
- Scrim colour of the modal, alert/snackbar warning and success surfaces, and a few offsets were assumed where Figma could not be read.
- `text-quaternary-500` is `#716d69` in light mode (accessibility decision; Figma was changed to match).
- Disabled labels in some Figma tab frames paint `#716d69` while bound to `text-disabled` (`#8f8a85`).

## Pass 2 (2026-10-13)

| Area | Result |
|---|---|
| Icons page 3463:407484 | built: 2,708 icons in `shared/icons/{lined,solid,lowcode,white}`; `tools/icon.py` |
| Logos 1083:118533, Client Logos component set 8058:40531 | built: 492 files in `shared/logos` (4 oversized client logos exist in the repo but not in the artifact chunks); 40 embed raster images |
| Misc icons 1025:31781 | built: `shared/icons/misc` (social, 434 flags, payment methods, file types, integrations); Featured icon, Agent avatar, Artifact icons etc. are treated as UI and not exported |
| Emoji's, Cursor | emoji 27 (raster-embedding, repo only), cursor 10 |
| Design annotations 1054:557 | documented in `shared/DESIGN-ANNOTATIONS.md` (Numeric key components + header/footer bands) |
| Effect styles | cross-checked: all 33 styles match `shared/effects.css` (mockup shadows excluded) |
| Headers 190:4871 | built: form-header Levels 1-3/3 Alt, Back, Tabs, sidepane and Automation sidepane header; `section-label` (Levels 0-4). Style=Toggle not built (use `button-group`) |
| Navigation 82:1862 | built: `sidebar` (280/56/68, submenu), `header-nav`, `bottom-nav`; Back glyph and icon-only item box assumed |
| Preview Modal 71561:14622 | built: `preview-modal` |
| Copilot 70268:16200 | mapped (pass 3, 13 Oct): copilot-input / -attachment / -pill / -suggestions / -feedback audited and extended; new copilot-sources-menu, -connector, -message, -citation, -shimmer, -header, comment-field, comment-panel, live-chat; cot and question-card extended (additive). Not built: Attachment Desktop image grids 73015:31094, L1+L2 flyout, Side-pane COT & Sources composites 73116:28682, mobile user row, map/link/graph chat previews. Previews not checked in a browser except live-chat and comment-panel |
| Modals 172:4293 | full screen + double pane built; popover header skipped |
| Inputs, Dropdowns, Date pickers, Tables, Checkboxes, Sliders, Selection pill, Progress, Stepper, Empty states, Tag, File upload | gaps closed (see each README "Gaps2"); Tabs Rounded Folder xs / Folder Destructive / Folder Badge, Tooltip code+link rows, small progress circles + trendline, spinner dots, empty-state Status, file-upload icons and error/complete, arrow stepper + Activity, tag flag + icon-leading, code-snippet syntax colours composed without sampling the exact node (DRIFT) |

Still not started: Charts 65348:31489 (WIP in Figma), Thumbnail 44289:6384 (cover images, not UI), Change Log 65402:28116.
