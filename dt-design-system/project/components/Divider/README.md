# Divider

A dividing line is a subtle line that efficiently divides elements into different groups and helps users to easily recognise related content. Dividers have a subtle visual effect – visible but never dominant.

- **ODS name:** `ODSDivider`
- **Storybook:** Components/Divider
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | "horizontal" \| "vertical" | "vertical" | Represents whether the orientation is horizontal or vertical. |
| `type` | "horizontal" \| "vertical" | – |  |
| `inset` | boolean | false | Represents whether divider will have inset. |
| `spacing` | boolean | false | Represents whether divider will have spacing. |

## Guidelines (from the ODS docs page)

### General

A dividing line is a subtle line that efficiently divides elements into different groups and helps users to easily recognise related content. Dividers have a subtle visual effect – visible but never dominant.

When to use:

Use a divider when whitespace is insufficient to create a content group or when there's limited space available.

When not to use:

Avoid using a divider when sufficient whitespace can effectively separate content or when it is not necessary to visually segment the interface, as it may add unnecessary visual clutter.

### Anatomy

;

### Use Directives

Component Types

Horizontal and vertical

Dividers comes in two main types.

Insets

Inset toggle

You can toggle between inset true or false.

### Dos and don'ts

Use dividers sparingly

Content may not need a divider line. To avoid clutter and fragmentation, try to use whitespace instead of dividers.

Use full-width and inset dividers differently.

Use a full-width divider to separate interactive and non-interactive areas or to divide larger sections of unrelated content. Use inset dividers to separate related content within a section.

### Component Variants

Horizontal

Vertical

;

### Colour Schemes

White

Black

Magenta

Secondary

### Examples

Example when used in the accordion

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Dividers are decorative elements, which have no contrast minimums.

No further design and development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSDivider` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
