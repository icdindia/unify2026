# Icons

The ODS icon set from `@telekom-ods/react-icons`: 375 icons in 12 categories, each in four variants. The Icons card shows them all with Selected and Small switches.

| File | Variant | Size | Use |
|---|---|---|---|
| `ods-icons-outline.svg` | outline (default) | 24px | Default icon in buttons, fields, lists and navigation. |
| `ods-icons-selected.svg` | selected (filled) | 24px | The active or selected state of the same icon (current nav item, toggled favourite). |
| `ods-icons-small.svg` | small | 16px | Dense UI: tags, small buttons, inline with `body-s-*` text. |
| `ods-icons-small-selected.svg` | small selected | 16px | Selected state at 16px. |
| `icons.json` | all four | – | `{categories: {Action: [names]…}, variants: {outline: {size, svg: {name: innerSVG}}…}}` for tooling. |

Each sprite holds one `<symbol id="ods-<name>">` per icon. Inline the sprite once per page, then reference an icon with `<svg width="24" height="24"><use href="#ods-search"/></svg>`.

- Ink: every icon draws in `currentColor`, so it takes the text colour of its container. Use `colours-basic-text` by default, a functional colour for status, and `colours-basic-text-on-accent` on magenta. Shown through `<img>`, the sprites render black, because `<img>` cannot pass colour in.
- In React, import by name: `ODS` + PascalCase of the file name, so `arrow_left` becomes `ODSArrowLeft` and `circle_add` becomes `ODSCircleAdd`.
- Give a meaningful icon a `title`, and a decorative one `decorative` or `aria-hidden="true"`.
- The per-icon SVG files (`icons/<variant>/<name>.svg`) live in the repository beside this system.
