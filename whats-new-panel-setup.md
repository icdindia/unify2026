# What's new panel — Figma setup

Recreation of the Lovable "Inbox / What's new" panel screenshot as a Unify DS frame.

## Location
- File: Unify2026 Design System (`qT9zH1YYapGTwpJxwNEGzt`)
- Page: `↳ Alerts & notifications ✅`
- New frame: `72831:5277` — "Platform=Web, States=ES Whatsnew (Lovable)"
- Placed 80px right of the reference component `72828:53797` (same y)
- Reference component structure: Form Header (Toggle group) + Body (Notification_Panel Unit ×6) + Scroll bar

## Frame structure
```
Platform=Web, States=ES Whatsnew (Lovable)   440w, vertical auto-layout, hug height (~736)
├─ Form Header                                 padding 12/8, bottom 1px border-tertiary
│  └─ Toggle group (instance, cloned)          Inbox | What's new — What's new Current=True, h36
└─ Body                                        vertical, gap 0
   ├─ Whats new item (hero)                    vertical
   │  ├─ Text: title row (dot + title), description
   │  ├─ Hero image                            400×266, gradient, "Chat for free ↑" pill
   │  └─ Time ("13 days ago")
   ├─ Whats new item                           horizontal: text column + 92×92 thumbnail
   │     "Parallel connector is here" · 14 days ago
   └─ Whats new item                           "Perplexity web search, n…" · 16 days ago
```
Each item: padding 20 horizontal / 16 vertical, item spacing 12, bottom 1px border-tertiary.

## Content
| Item | Title | Description | Time |
|---|---|---|---|
| 1 (hero) | Chat with Lovable for free | Ask questions, explore ideas, and inspect your apps before using any credits. | 13 days ago |
| 2 | Parallel connector is here | Add web search, page extraction, and cited deep research to your Lovable app with the Parallel… | 14 days ago |
| 3 | Perplexity web search, n… | Add real-time web search with cited sources to your app. Lovable manages the key, searches use… | 16 days ago |

## DS usage
**Component:** Toggle group (key `ce259992c3335d56a563f275868af32a4b694c9c`), segments `Type=Neutral, Size=md, Current=True/False`. Red dot cloned from the Notification_Panel Unit's `Dot`.

**Text styles (Geist)**
- Title: `Text md/Medium`
- Description and time: `Text sm/Regular`
- Thumbnail labels: `Text xs/Medium`
- Hero pill label: `Text md/Medium`

**Variables bound**
- Text: `Colors/Text/text-primary (900)` (title), `text-tertiary (600)` (description), `text-quaternary (500)` (time)
- Fills: `Colors/Background/bg-primary` (panel), `Colors/Utility/Error/utility-error-500` (dots)
- Strokes: `Colors/Border/border-tertiary` (panel outline, header and item dividers)
- Radius: `radius-xl` (panel), `radius-lg` (hero and thumbnails), `radius-full` (pill)
- Shadow: copied from the reference component's effects

## Not DS-bound / placeholders
- Hero and thumbnail artwork are gradient frames, not the real images or logos.
- The hero blue, the pill colour and the thumbnail gradients are literal values with no DS variable.
- Item padding and spacing are literal numbers (20/16/12), not spacing variables.
- The Notification_Panel Unit has no title, image or thumbnail slot, so the items are custom auto-layout frames, not instances of it.
- The scroll bar from the reference was not included.

## Gotchas hit
- Instance children can't be reordered (`insertChild` fails inside an instance). To change the active toggle segment, set `Current` on each segment with `setProperties`.
- A cloned Toggle group needs its vertical sizing set to FIXED with height 36.
