# FilterChip

Chips allow users to enter information, make selections or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

- **ODS name:** `ODSFilterChip`
- **Storybook:** Components/Chips/Filter Chip
- **Stories:** Example, Set

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | boolean | – |  |
| `label` * | string | – | The label of the Chip. |
| `defaultValue` | string \| (string & readonly string[]) | – | The initial value for the selected item, when uncontrolled. |
| `items` | ODSFilterChipDropdownItemProps[] | [] | The list of options for filtering. An object, containing a string itemLabel property, and any HTMLDiv props to be passed down to the item div |
| `value` | string | – |  |
| `expanded` | boolean | – | Controls the expanded state of the Filter Chip. |
| `collapseDownIcon` | ReactNode | <ODSCollapseDown /> | Icon displayed when filter chip is not expanded. If it is not set the default icon will be used. Accepts an SVG React component |
| `collapseUpIcon` | ReactNode | <ODSCollapseUp /> | Icon displayed when filter chip is expanded. If it is not set the default icon will be used. Accepts an SVG React component |
| `onValueChange` | ((value: string) => void) | – | Fires when the selected value changes. |
| `defaultExpanded` | boolean | – | The initial value for the dropdown state. |
| `onExpandedChange` | ((expanded: boolean) => void) | – | Fires when the dropdown state changes. |
| `transparentBg` | boolean | true | Determines if the chip has a transparent background. |

## Guidelines (from the ODS docs page)

### General

Chips allow users to enter information, make selections or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

Chips consist of relevant keywords in a container. They often appear dynamically (triggered by a user action) and as a group.

When to use:

Give users filtering possibilities
Display the filters users set
Suggest options to users (search criteria, possible answers).
When not to use:

You want to mark a category (use tags instead)
You can use a button instead

### Anatomy

 
Behaviours

Chip group overflow

When horizontal space is limited in a chip group, the individual chips wrap to form another line. The spacing between chips is 16px.

Allow bulk actions

In some instances, it's possible to add an action next to a group of chips to provide a way to easily take an action on the entire group at once. Make sure the action is only visible when there is more than one chip.

### Colour Schemes

White

Black

Magenta

Secondary

### Component Variants

### Examples

Filter chips on desktop

Filter, dismissible and toggle chips

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Provide clear and short chip label.
Chips should only be used in groups.
If there is no other context in the surrounding, chip groups should have a meaningful label.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSFilterChip` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
