# ChipSet

The Chip Set component from the ODS web library.

- **ODS name:** `ODSChipSet`
- **Storybook:** Components/Chips/Chip Set
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | string | – |  |

## What the consumer provides

The ODS React component `ODSChipSet` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSChipSet } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSChipSet } from "@telekom-ods/react-ui-kit/ODSChipSet";

<ODSChipSet />
```

Static HTML: download **ChipSet.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
