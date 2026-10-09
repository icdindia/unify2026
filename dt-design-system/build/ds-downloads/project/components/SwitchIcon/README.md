# SwitchIcon

The SwitchIcon component has been upgraded to follow the latest ODS design and API standards. The previous API is now deprecated and will be removed in an upcoming release. To ensure compatibility and benefit from new features, please migrate your usage to the new API.

- **ODS name:** `ODSSwitchIcon`
- **Storybook:** Components/Switch/Switch Icon
- **Stories:** Example, Form, Parent Class Usage

## Example (story args)

```tsx
<div className="ODSSwitchIcon-Parent">
  <ODSSwitchIcon />
</div>
Copy
```

```tsx
<div className="ODSSwitchIcon-Parent">
  <ODSSwitchIcon />
</div>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | "small" \| "large" | "large" |  |
| `selected` | boolean | – |  |
| `defaultSelected` | boolean | false | Specifies the initial selected state of the Component. |
| `disabled` | boolean | false |  |
| `readonly` | boolean | false |  |
| `loading` | boolean | false |  |
| `disableFocusVisible` | boolean | false | When true it removes the focus styling of the component and leaves it up to the dev to implement focus |
| `inputProps` | ODSComponentPropsWithRef<"input"> | – | All allowed input field props |
| `checkmarkIcon` | ReactNode | <ODSCheckmark /> | Icon to be displayed when switch is selected. If nothing is set the default checkmark Icon will be set. |

> The SwitchIcon component has been upgraded to follow the latest ODS design and API standards. The previous API is now deprecated and will be removed in an upcoming release. To ensure compatibility and benefit from new features, please migrate your usage to the new API.

## What the consumer provides

The ODS React component `ODSSwitchIcon` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSwitchIcon } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSwitchIcon } from "@telekom-ods/react-ui-kit/ODSSwitchIcon";

<ODSSwitchIcon size="large" defaultSelected={false} disabled={false} readonly={false} loading={false} disableFocusVisible={false} />
```

Static HTML: download **SwitchIcon.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
