# BarChart

Use this variant when there's more space available vertically and the prompt is intended to look more like an action, with an icon placed at the top for added emphasis.

- **ODS name:** `ODSBarChart`
- **Storybook:** Components/Charts/Bar Chart
- **Stories:** Example, Horizontal Bar Chart, Time Scale, Horizontal Time Scale, Bar Chart With Object Data

## Example (story args)

```tsx
{
  args: {
    "aria-label": "Bar chart showing quarterly revenue data for 2025",
    data: {
      labels: [["Q1", "2025"], ["Q2", "2025"], ["Q3", "2025"], ["Q4", "2025"]],
      datasets: [{
        label: "Revenue 1",
        data: [3, 10, 17, 40],
        scheme: "macaw"
      }, {
        label: "Revenue 2",
        data: [20, [15, 25], [20, 30]],
        scheme: "iguana"
      }, {
        label: "Revenue 3",
        data: [[10, 20], [15, 25], [20, 30], 5],
        scheme: "orchid"
      }]
    }
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | string | – |  |
| `data` * | CustomChartData<"bar", T> | – | Data for the ODSBarChart. Similar to the data property provided by the Chartjs library. |
| `barShape` | "squared" "pilled" | "squared" | The shape of the bars can be either pilled or squared. |
| `options` | _DeepPartialObject<CoreChartOptions<"bar"> & ElementChartOptions<"bar"> & PluginChartOptions<"bar"> & DatasetChartOptions<"bar"> & ScaleChartOptions<...> & BarControllerChartOptions> | – | Options for the ODSBarChart. Similar to the options provided by the Chartjs library. |
| `screenReaderConfig` | ScreenReaderConfig | – | Screen reader accessibility configuration |

## Guidelines (from the ODS docs page)

### Use Directives

Shape

Squared

Use this variant when there's more space available vertically and the prompt is intended to look more like an action, with an icon placed at the top for added emphasis.

Pilled

Designed for modern, softer UI presentations, the pilled bar features fully rounded corners. It works well in interfaces where a friendly, approachable aesthetic is preferred or when the bar needs to stand out as a key visual element. Often used in dashboards, marketing charts, or highlight visuals to add visual polish.

Labels

Tooltip - Web

Tooltips provide additional information about a data point and support both usability and accessibility.

When to tooltips appear:

Hover state: Displayed when the user hovers over a bar.
Pressed state: Displayed when the user presses on a bar.
Selected state: Displayed when a bar is selected.
Hover/Pressed on a selected bar: Tooltip remains visible and updates accordingly.

Tooltip - Mobile

Tooltips provide additional information about a data point and support both usability and accessibility. In mobile there is no hover and pressed state, so the tooltip appears only on selected state.

When to tooltips appear:

Selected state: Displayed when a bar is selected.

Placement

Grid

The data viz bar sits on a responsive grid that adjusts to different screen sizes and layouts. The grid is generally fully responsive, ensuring the bars adapt proportionally to the available space. This keeps the overall layout balanced and the bars visually consistent across breakpoints.

### Dos and don'ts

On mobile use the no-line variant only when there isn’t enough space to render the line.

When space allows, always show the line.

### Size

The data viz bar is responsive, automatically adjusting its width to fit the chart’s scale and content density. It adapts between a minimum width of 12px and a maximum of 48px. Narrow widths work well in heavy charts or compact layouts, while wider bars suit simpler charts or highlight fewer data points with greater emphasis.

Bar size is calculated automatically in code. It adapts to the number of bars and available space, with a minimum of 12px and a maximum of 48px, ensuring readability and clear comparisons.

Data

No Data

When there is no data, bars do not appear. The graph remains empty or shows a placeholder to indicate the absence of data.

Partial Past

When displaying partial past data, bars show only for the available historical data. Missing past data results in gaps, helping users understand the limits of the dataset.

Partial Future

In charts showing partial future data, only bars with available data appear. This keeps the focus on current and known values while signaling upcoming periods without bars.

Tooltip - Web

Vertical

Tooltips remain visible until the user actively dismisses them (e.g., tapping outside, pressing Esc) or makes a new selection.
They must not disappear too quickly or close automatically with timers.
On Web when hover/press/select the rest of the bars become recessive

Horizontal

Tooltips remain visible until the user actively dismisses them (e.g., tapping outside, pressing Esc) or makes a new selection.

They must not disappear too quickly or close automatically with timers.

On Web when hover/press/select the rest of the bars become recessive

Only for Horizontal bars: The tooltip renders above the chart background and never exceeds the chart’s grid area. If a bar spans the full horizontal width, the tooltip appears in front of it with the pin anchored inside at the bar’s end.

Tooltip - Mobile

Vertical

On mobile, tooltips triggered by tap or drag should stay stable, easy to read, and persist until the user changes their selection.
The no-line variant is a fallback for space-constrained layouts. If available space meets the minimum line clearance, use the line version.

Horizontal

On mobile, tooltips triggered by tap or drag should stay stable, easy to read, and persist until the user changes their selection.
Only for Horizontal bars: The tooltip renders above the chart background and never exceeds the chart’s grid area. If a bar spans the full horizontal width, the tooltip appears in front of it with the pin anchored inside at the bar’s end.
The no-line variant is a fallback for space-constrained layouts. If available space meets the minimum line clearance, use the line version.

Scroll Behavior - Web & Mobile

Vertical

The bars have a flexible width that automatically adjusts based on the available space, ranging from a minimum of 12px to a maximum of 48px. If space is limited, users can scroll to view all bars.

Horizontal

The bars have a flexible width that automatically adjusts based on the available space, ranging from a minimum of 12px to a maximum of 48px. If space is limited, users can scroll to view all bars.

Zoom Behavior - Web & Mobile

Vertical

The bars have a flexible width that automatically adjusts based on the available space, ranging from a minimum of 12px to a maximum of 48px. When the user zooms in, the bars increase in width accordingly, and horizontal scrolling becomes available to reveal the remaining content.

Horizontal

The bars have a flexible width that automatically adjusts based on the available space, ranging from a minimum of 12px to a maximum of 48px. When the user zooms in, the bars increase in width accordingly, and vertical scrolling becomes available to reveal the remaining content.

Interactions - Web

Vertical

On web interaction, hovering over a bar highlights it and displays its tooltip. Pressing a bar keeps the tooltip visible after the interaction. A bar remains selected until the user selects another bar, and only one bar can be selected at a time. Whenever a bar is hovered, pressed, or selected, all other bars appear recessive.

Horizontal

On web interaction, hovering over a bar highlights it and displays its tooltip. Pressing a bar keeps the tooltip visible after the interaction. A bar remains selected until the user selects another bar, and only one bar can be selected at a time. Whenever a bar is hovered, pressed, or selected, all other bars appear recessive.

Interactions - Mobile

Vertical

On mobile (touch), users can tap and drag across bars to preview values, with a tooltip following their finger. When they lift their finger, the current bar is selected and its tooltip remains visible. Tapping the same bar again will deselect it, while tapping outside does not clear the selection.

Horizontal

On mobile (touch), tapping and dragging across bars lets users preview values while a tooltip follows their finger. When they lift their finger, the current bar is selected and its tooltip remains visible. Tapping the same bar again deselects it, while tapping outside does not clear the selection.

Behaviors in Color Schemes - Mobile

White

Black

Magenta

Secondary

Behaviors in Color Schemes - Web

White

Black

Magenta

Secondary

Web

Vertical

Horizontal

Mobile

Vertical

Horizontal

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Always provide the screen reader a clear title for the charts (e.g. Quarterly sales 2025)
Provide also a brief description if the dataset is complex (e.g. Sales grew in Q2, with a little decline in Q3)
Always provide a clear table as an alternative to navigate the chart, and be consistent with the placement (e.g. under the chart, hidden in a tab, with a download icon for .csv format)
All the bars should always have a label that clearly describes them
Tooltips should remain visible until the user actively dismisses them or selects something else — not disappear too quickly. They should also be accessible via screen reader (aria-describedby / role="tooltip") and dismissible with standard gestures (tap outside, Esc)
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Ensure that the container always have the correct ARIA roles (role="graphics-document",role="img", role="group")
Every bar should have an accessible name (aria-label or aria-labelledby)
Table header should be <th> with associations (scope=”col”/”row”)
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSBarChart` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSBarChart } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBarChart } from "@telekom-ods/react-ui-kit/ODSBarChart";

<ODSBarChart barShape="squared" />
```

Static HTML: download **BarChart.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
