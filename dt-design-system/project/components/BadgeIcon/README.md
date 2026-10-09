# BadgeIcon

A badge is used to go with either an avatar or icon and represents a notification or status.

- **ODS name:** `ODSBadgeIcon`
- **Storybook:** Components/Badge/Badge Icon
- **Stories:** Example, Custom Icon

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | "error" \| "success" | – |  |
| `mode` | "error" \| "success" | "success" | contains the value of the BadgeIcon mode. |
| `size` | "small" \| "large" \| "standard" | "large" | contains the value of the BadgeIcon size. |
| `checkmarkIcon` | ReactNode | <ODSCheckmark /> |  |
| `errorIcon` | ReactNode | <ODSError /> |  |
| `innerAriaLabel` | string | – | contains the text that represents an ARIA label for the inner content of the ODSBadgeIcon component. |
| `as` | "object" \| "div" \| "a" \| "abbr" \| "address" \| "area" \| "article" \| "aside" | – |  |

## Guidelines (from the ODS docs page)

### General

A badge is used to go with either an avatar or icon and represents a notification or status.

### Anatomy

### Use Directives

Icon Badge

The icon badge is used to represent mainly a success on an error state within a specific context. It is also available in a generic icon format which can then be swapped by the designer in order to communicate something.

Success Badge

There is also an icon variation to indicate a status, such as success.

Error Badge

There is also an icon variation to indicate a status, such as success.

Available sizes

Badges comes in three sizes: Large, Standard and Small

Size choice

Be mindful while choosing the appropriate size.

Badge Colour

Don't change the colour of the badge.

Circular Shape

The avatar should never change its circular shape.

Colour restrictions

On Magenta colour scheme, the success/error variant of the icon avatar with badge should not be used.

On Secondary colour scheme, the success/error variant of the icon avatar with badge should not be used.

### Component Variants

### Colour Schemes

White

Black

Magenta

Badge Icon should NOT be used in magenta scheme.

Secondary

Badge Icon should NOT be used in secondary scheme.

### Examples

Badges in other contexts

You may use the badge to build your own product specific components.

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

No further design and development considerations required.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSBadgeIcon` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
