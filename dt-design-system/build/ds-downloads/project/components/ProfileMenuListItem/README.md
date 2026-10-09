# ProfileMenuListItem

This is a component to be used as Profile Menu item inside Profile Menu

- **ODS name:** `ODSProfileMenuListItem`
- **Storybook:** Components/Global Header/Profile Menu/Profile Menu List Item
- **Stories:** Standard, Disabled

## Example (story args)

```tsx
<ODSGlobalHeaderProfileMenuListItem icon="credit-card-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
Copy
```

```tsx
<ODSGlobalHeaderProfileMenuListItem icon="credit-card-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | – |  |
| `disabled` | boolean | – |  |
| `icon` | object | – |  |

## What the consumer provides

The ODS React component `ODSProfileMenuListItem` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSProfileMenuListItem } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSProfileMenuListItem } from "@telekom-ods/react-ui-kit/ODSProfileMenuListItem";

<ODSProfileMenuListItem label="ProfileMenuListItem" />
```

Static HTML: download **ProfileMenuListItem.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
