# Logos

The Telekom T mark, supplied as four files. Every file applies in both the closed (collapsed) and open (expanded) state of a navigation or header, and in both light and dark themes. Pick the file by the ground it sits on, never by the theme alone.

| File | Ink | Use on |
|---|---|---|
| `t-mark-magenta.svg` | `#E20074` (`dt-magenta`) | White and light grounds: `colours-basic-background` in light theme, white cards. |
| `t-mark-white.svg` | `#FFFFFF` (`dt-white`) | Magenta grounds (`data-scheme="magenta"`, `colours-basic-accent`) and black or dark grounds (dark theme, `data-scheme="black"`). |
| `t-mark-black.svg` | `#000000` (`dt-black`) | Monochrome output: print, fax, single-colour engraving, black-and-white documents on white. |
| `t-app-icon.svg` | Magenta square `#E20074` with a white T | App icon, favicon, avatar-sized brand tile, and the collapsed navigation rail where the mark needs its own ground. |

Rules:

- All files are 128 × 128 with the mark optically centred. Keep that frame as the clear space; do not crop to the glyph.
- Never recolour the mark. The only inks are magenta, white and black.
- Never place the magenta mark on magenta, grey mid-tones or photos without a solid ground; switch to the white mark on magenta or dark, or use the app icon.
- SVGs render through `<img>`, so they cannot inherit `currentColor`: choose the file whose ink fits the ground.
- Theme switching: in light theme use `t-mark-magenta.svg`; in dark theme use `t-mark-white.svg`. The app icon is the same in both themes.
