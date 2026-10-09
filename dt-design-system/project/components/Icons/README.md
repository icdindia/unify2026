# Icons

The full ODS icon set (`@telekom-ods/react-icons`, 375 icons) with its four variants: outline 24px, selected 24px, small 16px and small selected.

- **Use:** outline by default; the selected (filled) variant for the active item in navigation, toggled favourites and chosen options; small variants inside tags, compact buttons and `body-s` text.
- **Colour:** icons draw in `currentColor`, so set the container's text colour: `colours-basic-text` by default, a functional colour for status, and `colours-basic-text-on-accent` on magenta.
- **React:** `import { ODSSearch } from "@telekom-ods/react-icons"`. The component name is `ODS` + the PascalCase icon name (`arrow_left` becomes `ODSArrowLeft`). Click an icon in the preview to copy its name.
- **Accessibility:** next to a visible label, pass `decorative` or `aria-hidden="true"`. As the only content of a control, pass `title` or label the control.
- **Static HTML:** inline `assets/Icons/ods-icons-<variant>.svg` once, then `<svg width="24" height="24"><use href="#ods-search"/></svg>`.

What the consumer provides: the icon name, the variant (via the `selected` and `small` props in React) and an accessible label when the icon carries meaning.
