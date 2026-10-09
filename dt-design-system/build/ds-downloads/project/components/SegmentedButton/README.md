# SegmentedButton

A segmented button allows users to make a single choice from a group of related options displayed in a horizontal row. Each option is a segment, and selecting one often reveals different content or applies a specific filter.

- **ODS name:** `ODSSegmentedButton`
- **Storybook:** Components/Segmented Button/Segmented Button
- **Stories:** Example, Text Only, Icon Only

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | "fill" \| "hug" | "hug" | Choose a variant depending on how the component needs to take space |
| `size` | "small" \| "large" | "large" | Choose between a small and large size |
| `type` | "primary" \| "secondary" | "primary" | Set the type of the segmented button to change the color theme |
| `onChange` | ((id: number) => void) | – | A callback to return the selected index |

## Guidelines (from the ODS docs page)

### General

A segmented button allows users to make a single choice from a group of related options displayed in a horizontal row. Each option is a segment, and selecting one often reveals different content or applies a specific filter.

When to use

Segmented buttons are a great for offering users clear, grouped options without overwhelming them with too many choices. Use when:

Mutually exclusive choices: use segmented buttons when you want users to pick one option from a limited set
Category switching: work well for quickly switching between categories without needing to navigate to different screens
Filter or sorting options: Segmented buttons are effective for quick filters
Compact UI: In compact or space-limited interfaces, segmented buttons are often more efficient than drop downs or large menus.
### Anatomy

### Use Directives

How designers should use the component

Types

Primary

The selected segment uses the brand colour.

Secondary

The selected segment uses accent-secondary colour token when there’s already too much brand colour in the page.

Icon and text

Label Text

Labels should be short and succinct. If a label is too long to fit within its segment, consider using an icon alone.

Label and icon

Labels should be short and succinct. If a label is too long to fit within its segment, consider using an icon alone.

Icon Only

Icons may be used as labels by themselves. The Icon must clearly communicate the option it represents.

Component Level

Number of segments

Select the number of segments to display.

### Size

Select the size of the segments

Variant of segments

Choose the variant of segments, hug or fill.

Single-select

Use a single-select segmented button to select one option from a set, switch between views, or sort elements from up to five options.

Best practices

Use a segmented control to provide closely related choices that affect an object, state, or view.
Avoid crowding the control with too many segments.
In general, keep segment size consistent.
Prefer using either text or icon — not a mix of both in a single segmented control.
Dos and don’ts

Avoid using a segmented control to offer actions

A segmented control can help people switch between views in a toolbar. Avoid using a segmented control to offer actions

Avoid crowding the control with too many segments.

Too many segments can be hard to parse and time-consuming to navigate. Aim for no more than about five to seven segments in a wide interface and no more than about five segments on mobile.

Keep segment size consistent.

Use content with a similar size in each segment. Because all segments typically have equal width, it doesn’t look good if content fills some segments but not others.

Prefer using either text or icon

Although individual segments can contain text labels or icons, mixing the two in a single control can lead to a disconnected and confusing interface.

Behaviours

How designers should use the component

Behavior

Toggling an inactive segment selects it from the set and deselects the previously chosen option. The tile behind the active segment slides along the track to sit behind the newest selection. If the segmented control changes the presentation or content below in a view, the content fades in and out as the newly selected segment moves to its new spot.

Selections are mutually exclusive. Once a selection has been made, it can only be deselected by making a new selection. A segmented control does not require a "Save" button to apply the selection. When a choice is selected, the selection immediately affects an object, state, or view.

Interaction states

### Component Variants

How designers should use the component

Segment states

Segments Large

Segments Small

### Colour Schemes

The segmented button component works across all colors schemes

White

Black

Magenta

Secondary

  
### Examples

Web Desktop

Web Mobile

 
### Accessibility

TBD

## What the consumer provides

The ODS React component `ODSSegmentedButton` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSegmentedButton } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSegmentedButton } from "@telekom-ods/react-ui-kit/ODSSegmentedButton";

<ODSSegmentedButton variant="hug" size="large" type="primary" />
```

Static HTML: download **SegmentedButton.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
