# Sparkline

A Sparkline is a small, data-driven chart that visually represents trends, variations, or patterns in a compact format. It is typically displayed within a cell or alongside data to provide quick insights without taking up much space.

- **ODS name:** `ODSSparkline`
- **Storybook:** Components/Sparkline
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | "progressBar" \| "bars" | "progressBar" |  |
| `percentage` | number | 0 |  |
| `size` | "small" \| "large" | "large" |  |
| `noProgressMsg` | string | – |  |

## Guidelines (from the ODS docs page)

### General
A Sparkline is a small, data-driven chart that visually represents trends, variations, or patterns in a compact format. It is typically displayed within a cell or alongside data to provide quick insights without taking up much space.

When to use
Use a Sparkline to show trends, comparisons, or variations in data over time, such as in dashboards, financial reports, or performance metrics.
Ideal for visualizing data in a concise manner where space is limited but quick insights are needed.
When not to use
Do not use Sparklines for detailed, interactive charts where users need to zoom in or analyze data points in depth.
Avoid using them for data that requires precise values or labels, as Sparklines focus on trends rather than exact data points.
### Component Variants
The Sparkline component has two types (Bars, Progress Bar), available in preset percentage steps (0%, 25%, 50%, 75%, 100%) and two sizes (Small, Large).

Use size and type options to match layout requirements and visual importance.

Progress bar

Bars

### Accessibility
This OneDS component is compliant with WCAG 2.2 AA Standards.
Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

A disabled checkbox must not have a support message, and its label should not convey any crucial information needed to understand the context.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSSparkline` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSparkline } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSparkline } from "@telekom-ods/react-ui-kit/ODSSparkline";

<ODSSparkline type="progressBar" percentage={0} size="large" />
```

Static HTML: download **Sparkline.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
