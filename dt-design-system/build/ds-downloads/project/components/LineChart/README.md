# LineChart

Use a single line variant to demonstrate changes in value for a single variable of interest.

- **ODS name:** `ODSLineChart`
- **Storybook:** Components/Charts/Line Chart
- **Stories:** Example Story, Single Line, Grid, Data, Time Scale

## Example (story args)

```tsx
{
  args: {
    "aria-label": "Line chart showing three datasets over eight months",
    showPoints: true,
    pointType: "outline",
    showTooltip: true,
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
      datasets: [{
        label: "Dataset 1",
        data: [0, 10, null, null, 20, 10, 10, 10],
        borderWidth: 3,
        tension: 0,
        fill: false,
        spanGaps: true,
        scheme: "frog"
      }, {
        label: "Dataset 2",
        data: [30, null, null, 30, 30, 20, null, 30],
        scheme: "jacuzzi",
        borderWidth: 3,
        tension: 0,
        fill: false,
        spanGaps: true
      }, {
        label: "Dataset 3",
        data: [50, null, null, 10, 50, 40, 40, 50],
        scheme: "aperitif",
        borderWidth: 3,
        tension: 0,
        fill: false,
        spanGaps: true
      }]
    },
    options: {
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    }
  },
  render: args => {
    return <div style={{
      height: 300
    }}>
        <ODSLineChart {...args} />
      </div>;
  }
}
```

```tsx
{
  args: {
    "aria-label": "Line chart with grid showing three datasets over eight months",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
      datasets: [{
        label: "Dataset 1",
        data: [0, 10, 20, 20, 20, 10, 0, 10],
        scheme: "kingfisher",
        borderWidth: 3,
        tension: 0,
        fill: false,
        spanGaps: true
      }, {
        label: "Dataset 2",
        data: [30, 20, null, 30, 30, 20, null, 30],
        scheme: "jacuzzi",
        borderWidth: 3,
        tension: 0,
        fill: false,
        spanGaps: true
      }, {
        label: "Dataset 3",
        data: [50, 40, null, 10, 50, 40, null, 50],
        scheme: "iguana",
        borderWidth: 3,
        tension: 0,
        fill: false,
        spanGaps: true
      }]
    }
  },
  render: args => {
    return <div style={{
      height: 300
    }}>
        <ODSLineChart {...args} />
      </div>;
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | string | – |  |
| `data` * | CustomChartData<"line", T> | – | Data for the ODSLineChart. Similar to the data property provided by the Chartjs library. |
| `options` | _DeepPartialObject<CoreChartOptions<"line"> & ElementChartOptions<"line"> & PluginChartOptions<"line"> & DatasetChartOptions<"line"> & ScaleChartOptions<...> & LineControllerChartOptions> | { } | Options for the ODSLineChart. Similar to the options property provided by the Chartjs library. |
| `showPoints` | boolean | true | Show/Hide the points. |
| `showTooltip` | boolean | true | Show/Hide the ODS tooltip. Independent of the native Chart.js tooltip, which is controlled through options.plugins.tooltip. |
| `pointType` | "outline" "solid" | "solid" | Defines the style of the points. |
| `screenReaderConfig` | ScreenReaderConfig | – | Screen reader accessibility configuration |

## Guidelines (from the ODS docs page)

### Anatomy

### Use Directives

Variant

Single Line

Use a single line variant to demonstrate changes in value for a single variable of interest.

Multiple Lines

Plot multiple lines on a single line chart to compare trends across different data series.

Dashed lines

Use dashed lines to indicate predicted, projected, or estimated data points on the chart. This allows users to distinguish forecasts or projections from actual measured values.

Dos and don’ts

Show all data points when possible

Keep data points visible at all times. For missing values, use dashed or dotted lines with point markers to clearly indicate gaps.

Focus on one main message per chart.

Keep the chart readable by limiting it to five lines maximum.

Use the same color scheme across all line

If one line uses the secondary scheme, all lines should use it to keep the text visually consistent.

Behaviour

Web

Hover Single

On hover, each data point expands from 12×12 to 20×20 pixels, changes color, and displays a tooltip containing the point’s corresponding x and y values on the line graph. The rest of the data points change to the neutral state to highlight the interaction.

Hover Multiple

If multiple lines intersect the same x-coordinate, the tooltip also includes the y-values for each of those lines at that x-position, allowing for direct comparison across the lines.

Pressed

When a user clicks and presses continuously on a data point, its size expands from 12×12 to 16×16 pixels, its colour changes, and a tooltip is shown containing the associated x and y values.

Focused

On keyboard focus, a black ring outlines the data point.

Selected

A data point can be selected independently of all other states. When a user taps a data point, it enters the selected state: the point enlarges to 16×16 px, and a tooltip appears showing its corresponding x and y values. When the cursor leaves the chart, all points return to their default state, but the selection remains active.When a user hovers over any data point, that point enters the hover state and all other points switch to the neutral state.

Selected Hovered

When hovering over a selected point the point size changes to 20×20 px (consistent with hover behavior) while the tooltip remains visible and updates as needed.

Selected Pressed

When the user presses and holds down on a data point that is selected, the pressed state is triggered: the point expands from 12×12 to 16×16 pixels, its colour changes to indicate active interaction, and the tooltip remains visible with the relevant data.

Selected Focused

A selected point can be focused through keyboard or accessibility interaction, in which case a visible focus indicator appears while maintaining the selected state visuals and tooltip.

Mobile

Selected

Since there is no hover or focus state, tapping a data point triggers the selected state. The point expands to 16×16 pixels, and a tooltip appears showing the x and y values.

Zoom Behaviour - Web and Mobile

The line chart dynamically adjusts the spacing between data points based on the current zoom level. As the user zooms in, the distance between points increases smoothly, allowing more detailed inspection of the data. When zooming causes the content to extend beyond the visible area, horizontal scrolling is enabled to reveal additional portions of the line.

Scroll Behaviour - Web and Mobile

The line chart automatically adjusts the spacing between data points based on the available space. When the chart contains more data points than can fit within the visible area, the spacing compresses to accommodate the content. If the available space becomes too limited, horizontal scrolling is enabled, allowing users to navigate through the full dataset.

### Component Variants

Default

Hover

Pressed (web only)

Focused (web only)

Selected Default

Selected Hovered (web only)

Selected Pressed (web only)

Selected Focused (web only)

Color Schemes

White

Black

Magenta

This scheme is restricted. Line chart component can only be used on neutral, white and black colour schemes.

Secondary

This scheme is restricted. Line chart component can only be used on neutral, white and black colour schemes.

### Examples

Web

Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Always provide the screen reader a clear title for the charts (e.g. Quarterly sales 2025)
Provide also a brief description if the dataset is complex (e.g. Sales grew in Q2, with a little decline in Q3).
Always provide a clear table as an alternative to navigate the chart, and be consistent with the placement (e.g. under the chart, hidden in a tab, with a download icon for .csv format).
Each data point should be programmatically reachable or exposed via screen reader.
Tab should focus the Line chart which then can be navigated with Arrow keys Up and Down to select the line, Left/Right key to move among the dots/pair of dots.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Ensure that the container always have the correct ARIA roles (role="graphics-document", role="img", o role="group")
Every line should have an accessible name (aria-label or aria-labelledby)Table header should be <th> with associations (scope=”col”/”row”)
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSLineChart` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSLineChart } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSLineChart } from "@telekom-ods/react-ui-kit/ODSLineChart";

<ODSLineChart options={{ }} showPoints={true} showTooltip={true} pointType="solid" />
```

Static HTML: download **LineChart.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
