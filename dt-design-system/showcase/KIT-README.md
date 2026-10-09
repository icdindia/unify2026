# DT Design System kit

Deutsche Telekom's web design system on ODS (OneExperience Design System): tokens, the DT palette, icons and every ODS component as a standalone HTML reference.

## What's inside

| Folder | Contents |
|---|---|
| `tokens/dt-tokens.css` | All colour tokens (`--colours-…`) with light values on `:root` and dark values under `prefers-color-scheme: dark` or `data-theme="dark"`, the DT palette (`--palette-<hue>-<step>`), spacing, radius, sizing, strokes, type shorthands and z-index. |
| `tokens/tokens.json` | The same tokens as data: each colour has a light and a dark value and a usage note. |
| `icons/ods-icons-*.svg` | The 375 ODS icons as SVG sprites (outline 24, selected 24, small 16, small selected 16). Use `<svg><use href="ods-icons-outline.svg#ods-search"/></svg>`; icons draw in `currentColor`. |
| `components/ods-components.css` | The ODS component stylesheet. |
| `components/<Name>.html` | One page per component with its ODS markup and examples. Open in a browser; it loads the tokens and the stylesheet above. |
| `components/react-snippets.md` | An import and a starting JSX element for each component, from its documented props. |
| `figma/dt-figma-components.md` | The DT components in Figma (EB for DT 2026 · 🎨 DT Pilot) with node ids and their ODS mapping. |

## Using it

- In product code, use the ODS packages from the Telekom registry: `@telekom-ods/react-ui-kit`, `@telekom-ods/design-tokens`, `@telekom-ods/react-icons`. This kit is a reference; the packages are the source of truth.
- Static HTML: load `tokens/dt-tokens.css`, then `components/ods-components.css`, and set `font-family: "TeleNeo Var", TeleNeoWeb, sans-serif` on `<body>`.
- Theme: the page follows the OS; set `data-theme="light"` or `"dark"` on `<html>` to force one. ODS itself uses `data-mode` on `<body>`.
- Schemes: wrap a region in `data-scheme="magenta"`, `"black"` or a palette hue to recolour everything inside.

## Rules for product screens

- Reading text in chat stays 16px (Body M); button and filter labels are 14px (Body S Bold); text buttons stay 40px tall.
- Compact icon actions use the 24px XSmall icon button with a 16px icon.
- Put `colours-basic-text` on palette fills; never set text in a palette colour; status uses the functional tokens.

## Font

TeleNeo is licensed by Deutsche Telekom and is not included. Install it from the ODS package (TeleNeoWeb / TeleNeo variable); without it the pages fall back to the system sans-serif.
