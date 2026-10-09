# TextBody

The Text Body component from the ODS web library.

- **ODS name:** `ODSTextBody`
- **Storybook:** Components/Accordion/Text Body
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | string | – | The text content to display in the body. |

## What the consumer provides

The ODS React component `ODSTextBody` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSTextBody } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTextBody } from "@telekom-ods/react-ui-kit/ODSTextBody";

<ODSTextBody text="TextBody" />
```

Static HTML: download **TextBody.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
