# Segments

The Segments component from the ODS web library.

- **ODS name:** `ODSSegments`
- **Storybook:** Components/Segmented Button/Segments
- **Stories:** Example, With Icon

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | – | Contains the text of the Segment. This property will be set as aria-label if it is not provided. |
| `size` | "small" \| "large" | "large" | Choose the size of the segment. |
| `type` | "primary" \| "secondary" | "primary" | Set the type of the segment to change the color theme |
| `selected` | boolean | false | Set to true when the segment is selected |
| `variant` | "fill" \| "hug" | "hug" | The desired pre-defined styles can be applied by choosing a variant. |
| `icon` | ReactNode | – | Name of the icon to be shown. Must be a valid svg or ODS Icon. |
| `disabled` | A boolean that represents the element's disabled attribute, indicating that the control is not available for interaction. \| disabled | false | - |

## What the consumer provides

The ODS React component `ODSSegments` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSegments } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSegments } from "@telekom-ods/react-ui-kit/ODSSegments";

<ODSSegments label="Segments" size="large" type="primary" selected={false} variant="hug" disabled={false} />
```

Static HTML: download **Segments.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
