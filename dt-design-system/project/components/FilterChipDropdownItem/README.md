# FilterChipDropdownItem

This is a Subcomponent that is used internally on the ODSFilterChip. Should not be used standalone.

- **ODS name:** `ODSFilterChipDropdownItem`
- **Storybook:** Components/Chips/Filter Chip Dropdown Item
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | boolean | false | Whether the item is disabled and non-interactive. |
| `checkmarkIcon` | ReactNode | <ODSCheckmark /> | Icon displayed when item is selected. If it is not set the default icon will be used. Accepts an SVG React component |
| `selected` | boolean | false | Whether the item is currently selected. |
| `value` * | string | – | The value associated with the dropdown item. This can be a string or any other data type relevant to the app logic. |
| `labelText` * | string | – | The display text shown for the dropdown item. |
| `iconBefore` | ReactNode | – | Optional icon to display before the label text. |
| `showIconBefore` | boolean | – |  |

## What the consumer provides

The ODS React component `ODSFilterChipDropdownItem` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
