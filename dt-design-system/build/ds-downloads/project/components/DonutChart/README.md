# DonutChart

Use for part-to-whole composition when you want the option to include center text (Title / Description) and keep the chart readable.

- **ODS name:** `ODSDonutChart`
- **Storybook:** Components/Charts/Donut Chart
- **Stories:** Example, Donut Chart With Selection, Pie Chart With Selection, Half Donut Chart

## Example (story args)

```tsx
{
  args: {
    "aria-label": "Donut chart showing distribution of categories",
    data: {
      ...dummyData
    },
    type: "donut"
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | string | – |  |
| `data` * | CustomChartData<"doughnut", T> | – | Data for the ODSDonutChart. Similar to the data property provided by the Chartjs library. |
| `options` | _DeepPartialObject<CoreChartOptions<"doughnut"> & ElementChartOptions<"doughnut"> & PluginChartOptions<"doughnut"> & DatasetChartOptions<"doughnut"> & ScaleChartOptions<...> & DoughnutControllerChartO | – | Options for the ODSDonutChart. Similar to the options property provided by the Chartjs library. |
| `screenReaderConfig` | ScreenReaderConfig | – | Screen reader accessibility configuration |
| `centerContent` | ReactNode | – | React node rendered in the center of the donut hole. Positioned over the chart using absolute layout, centred on the inner circle. |
| `content` | ReactNode[] | [] | List of elements to be displayed on the chart. Maximum number of elements is equal to the number of slices. Each element is positioned on the middle of each slice. |
| `type` | "pie" "donut" "halfDonut" | "donut" | The type of the chart to be rendered. |
| `onSliceClick` | ((sliceIndex: number \| null) => void) | – | Callback function triggered when a slice is clicked. Provides the index of the clicked slice, or null if no slice is clicked. |
| `onSliceHover` | ((sliceIndex: number \| null) => void) | – | Callback function triggered when a slice is hovered. Provides the index of the hovered slice, or null if no slice is hovered. |
| `onSliceFocus` | ((sliceIndex: number \| null) => void) | – | Callback function triggered when a slice is focused. Provides the focused point, or null if no slice is focused. |

## Guidelines (from the ODS docs page)

### Use Directives

Type

Donut

Use for part-to-whole composition when you want the option to include center text (Title / Description) and keep the chart readable.

Half donut

Use when you need a compact composition chart and want to reserve space below (e.g., for supporting content or the data list).

Pie

Use only when a pie representation is explicitly required (no inner cutout / no center text).

### Size

Thick

Use when the chart is a primary element and needs quick readability.

Thin

Use in cards and compact layouts. Keep the number of slices low and center text short.

Content

Center text (Title / Description)

Center text is provided via a Text Slot, allowing teams to insert their own content in the center of the chart.

Use the Text Slot to add short context (e.g., timeframe, total label, short summary).
Prefer text-only content (Title + short Description) to maintain clarity and consistent alignment.
Avoid long sentences or multi-line descriptions that compete with the chart.

Slice content (icons / markers)

Slice content is provided via Content Slots, allowing teams to insert custom content per slice.

Use slice slots only when the content adds meaning (e.g., category icons, small images, or a percentage label).
Keep slot content minimal so it doesn’t clutter the chart or reduce slice readability.
If slice slots are used, ensure the same meaning is also available as text in the data list below (don’t rely on icon/image/color alone).

Data List

This component does not rely on tooltips. Always provide a data list below the chart with:

Category name
Value and/or percentage
Optional color swatch or icon

### Dos and don'ts

Always include a data list

Ensure the data list is always present alongside the chart, especially when slices become small or difficult to distinguish. Avoid relying on the chart alone when values are hard to read or compare.

Behaviour

Interactions - Web

Slice interactions

Standard

All slices use their default colors.
Hovered

The hovered slice is emphasized.
All other slices become recessive.
Pressed

The pressed slice stays emphasized during interaction.
Other slices remain recessive.
Selected

The selected slice remains emphasized until another slice is selected.
Only one slice can be selected at a time.
Focus

A focused slice shows a visible external outline outside the ring.
The outline does not affect the slice shape or value.
Slices can be navigated and selected via keyboard.
Data list sync (recommended)

Syncing the chart with the data list is recommended for usability and accessibility.
Hovering, pressing, or selecting a slice can highlight the matching row.
Selecting a row can also select the matching slice.

Interactions - Mobile

Slice interactions

Standard

All slices use their default colors.
Hovered

The hovered slice is emphasized by expanding equally outward and inward.
All other slices become recessive.
Pressed

Press provides feedback and keeps the slice emphasized while pressed.
Other slices remain recessive during the interaction.
Selected

Selecting a slice keeps it emphasized by expanding equally outward and inward.
Other slices remain recessive until another slice is selected.
Only one slice can be selected at a time
Data list sync (recommended)

Syncing the chart with the data list is recommended for usability and accessibility.
Hovering, pressing, or selecting a slice can highlight the matching row.
Selecting a row can also select the matching slice.

Center text behavior

The center text updates to reflect the active slice on hover, press, focus and selection.

On selection, the content remains persistent.
If another slice is hovered after a selection, the center text temporarily previews that slice.
When hover ends, the center text returns to the previously selected slice.
If no slice is selected, the center text returns to its default content.
Content The center text is a slot, so teams can apply their own text styles or formatting. However, the recommended content is the category / label and percentage.

Web

Mobile

### Colour Schemes

Behaviors in Color Schemes - Mobile

White

Black

Magenta

Secondary

### Examples

Web

Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA standards.  

Design considerations

Always provide a data list (or table) under the chart. This is required because non-active slices become recessive and are not intended to be the sole method of reading values.
Don’t rely on color alone: ensure categories are identifiable via text (and optionally icons in the list).
Provide a clear chart title for screen readers (e.g., “Usage distribution — last 30 days”).
Contrast considerations

Ensure text in the center label and in the data list meets minimum contrast requirements.
For UI components/graphics, maintain sufficient contrast where applicable (common expectation: 3:1 for UI/graphics boundaries).
Interaction + keyboard

Slices must be reachable via keyboard ( web) and expose an accessible name (category + value/percentage).
The data list must be keyboard navigable and synchronized with the chart selection.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Use appropriate container roles (e.g., role="img" / role="group") and provide accessible names (aria-label / aria-labelledby) for slices and list items.
Provide an accessible alternative representation (the data list/table is the recommended default).
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSDonutChart` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSDonutChart } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDonutChart } from "@telekom-ods/react-ui-kit/ODSDonutChart";

<ODSDonutChart content={[]} type="donut" />
```

Static HTML: download **DonutChart.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
