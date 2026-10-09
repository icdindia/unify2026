# Dim

The show/hide functionality needs to be manually handled by the consumer product. We recommend using the onClick callback function to hide/remove the ODSDim from the DOM.

- **ODS name:** `ODSDim`
- **Storybook:** Components/Dim
- **Stories:** Example, With Children, Without Children

## What the consumer provides

The ODS React component `ODSDim` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSDim } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDim } from "@telekom-ods/react-ui-kit/ODSDim";

<ODSDim />
```

Static HTML: download **Dim.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
