# CheckboxIcon

The Checkbox Icon component from the ODS web library.

- **ODS name:** `ODSCheckboxIcon`
- **Storybook:** Components/Checkbox/Checkbox Icon
- **Stories:** Example, Parent Class Usage

## Example (story args)

```tsx
<div className="ODSCheckboxIcon-Parent">
  <ODSCheckboxIcon />
</div>
Copy
```

```tsx
<div className="ODSCheckboxIcon-Parent">
  <ODSCheckboxIcon />
</div>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultChecked` | boolean | – |  |
| `size` | "small" \| "large" | "large" | The size of the checkbox icon, can be small or large. |
| `checked` | boolean | – | Indicates whether the checkbox icon is checked. |
| `error` | boolean | false | Indicates whether there is an error state. |
| `indeterminate` | boolean | false | Indicates whether the checkbox icon is in an indeterminate state. |
| `disabled` | boolean | false | Controls the disabled status of the checkbox icon. |
| `readonly` | boolean | false | Controls the read-only status of the checkbox icon. |
| `checkmarkIcon` | ReactNode | <ODSCheckmark /> | Icon displayed when checkbox is checked. If it is not set the default icon will be used. Accepts an SVG React component |
| `minusIcon` | ReactNode | <ODSMinus /> | Icon displayed when indeterminate is set to true. If it is not set the default icon will be used. Accepts an SVG React component |
| `disableFocusVisible` | boolean | false |  |
| `inputProps` | ODSComponentPropsWithRef<"input"> | – | All allowed input field props. |
| `onCheckedChange` | ((checked: boolean) => void) | – | Function that is called when the selected state of the component changes. |

## What the consumer provides

The ODS React component `ODSCheckboxIcon` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSCheckboxIcon } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSCheckboxIcon } from "@telekom-ods/react-ui-kit/ODSCheckboxIcon";

<ODSCheckboxIcon size="large" error={false} indeterminate={false} disabled={false} readonly={false} checkmarkIcon={<ODSCheckmark />} />
```

Static HTML: download **CheckboxIcon.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
