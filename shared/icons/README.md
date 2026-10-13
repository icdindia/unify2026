# Icons

2,708 icons exported from the Figma Icons page (node 3463:407484), file `qT9zH1YYapGTwpJxwNEGzt`, 2026-10-13.

| Folder | Count | Notes |
|---|---|---|
| `lined/` | 1,683 | 24px outline icons in 20 categories. Single ink: strokes use `currentColor`. |
| `solid/` | 519 | Filled counterparts. `currentColor`. |
| `lowcode/` | 304 | Low-code component glyphs, 40px, multicolour (kept as designed). |
| `white/` | 202 | On-dark variants, white fill kept. |

`index.json` lists name, family, category, viewBox size. Find an icon: `python3 tools/icon.py --search arrow`;
inline it: `python3 tools/icon.py arrow-right --size 16`. Colour single-ink icons with CSS `color`
(`var(--colors-icon-*)`). Two lined icons are genuinely multicolour (`bell-notification`, `jar-file-type-icon`).

Not exported: `calendar-schedule-solid` (59633:4927) does not render through the Figma API; Client Logos
(frame 61775:243410) and Emoji's (59694:7990) are not included yet. The older 97 files in `shared/svg-icons/`
stay because components reference them by name.
Regenerate: `tools/figma-icons-index.py` -> `tools/figma-icons-export.py` -> `tools/process-icons.py`
(Figma API token read from the figma-console MCP config at run time).

## Misc, emoji, cursor, logos (found2 batch)
Exported by `tools/figma-misc-export.py` (Figma REST, SVG). Each folder has an `index.json` (name, group, Figma node id, size, multicolour, raster).
- `shared/icons/misc/` social, country flags (`flag-xx`), payment (md), integration, file-type icons
- `shared/icons/emoji/` Tone + Reactions (embedded raster inside SVG)
- `shared/icons/cursor/` 10 cursor states
- `shared/logos/` client logos, Unify logo/favicons, company logos, fictional, featured
`python3 tools/icon.py <name> --family misc|emoji|cursor|logos` prints the inline SVG. Brand colours are kept exactly; only single-ink non-brand social icons use currentColor.
