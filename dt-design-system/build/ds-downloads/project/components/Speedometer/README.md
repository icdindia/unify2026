# Speedometer

Show scale values when users need context for the range or when the position on the scale matters, not just the final value. This is useful for unfamiliar ranges or when users need help interpreting the result.

- **ODS name:** `ODSSpeedometer`
- **Storybook:** Components/Charts/Speedometer
- **Stories:** Example, Custom Step Function, Custom Scheme

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | number | – | Value to display on the speedometer |
| `end` * | number | – | Maximum value of the speedometer |
| `step` * | ODSSpeedometerStepProps | – | Step value for the ticks |
| `start` * | number | – | Minimum value of the speedometer |
| `scheme` | string | – | Colour scheme for the active arc. Use this to pass a secondary scheme to the line indicator element. |
| `width` | number | 350 | Width of the component. |
| `height` | number | 320 | Height of the component. |
| `svgProps` | ODSComponentPropsWithRef<"svg"> | – | Additional props for the line indicator element. |
| `showMetrics` | boolean | – | Whether to show metric labels on the speedometer. |
| `speedometerContentSlot` | ReactNode | – | Custom content to display in the center of the speedometer (e.g., speed value) |
| `showTopic` | boolean | true | Whether to show the current value label on the speedometer. |

## Guidelines (from the ODS docs page)

### Anatomy

### Use Directives

Show Metrics

True

Show scale values when users need context for the range or when the position on the scale matters, not just the final value. This is useful for unfamiliar ranges or when users need help interpreting the result.

False

Hide Metrics when the central number is enough to understand the result. This works well in dashboards with multiple Speedometers (e.g. download, upload, latency), where users compare values across metrics rather than against a scale. It reduces visual noise and keeps the layout easy to scan.

Show Topic

True

Show Content when the exact value is the primary information users need. The center should carry the key number or status so it can be read instantly without relying on the gauge.

False

Hide Content when the value is secondary or already shown elsewhere. This shifts focus to the overall shape or trend of the gauge and reduces duplication in dense layouts.

Scale and spacing

Steps are evenly spaced along the arc to keep the gauge balanced and easy to read. The values behind those steps are fully configurable, so the scale can match different ranges (e.g. 0–100 vs 0–1000) or uneven progressions (e.g. 0, 10, 50, 100).

Product Handoff

The specific values used in design templates are for presentation purposes; the final pacing must be defined during the technical handoff to match the live product data.

Dos and don’ts

Progress Indicator – on White

The exposed “Colour” property of the .ODS Speedometer Cycle Line Indicator nested instance is allowing the Progress Indicator to appear in Neutral and Secondary schemes.

All combinations are allowed on White schemes.

Progress Indicator – on Black

All combinations are allowed on Black schemes.

Progress Indicator – on Magenta

Only “Neutral” Progress Indicator property is allowed on Magenta scheme.

Progress Indicator – on Secondary schemes

Only the “Neutral” Progress Indicator property is allowed on a Secondary scheme.

Behaviour

Shape

Designed for modern and soft UI presentations, the pilled bar features fully rounded corners. It is ideal for interfaces where a friendly, approachable aesthetic is preferred or when the gauge needs to stand out as a key visual element. Use this variant to add "visual polish" in dashboards or marketing-focused data visualizations.

Disclaimer

Due to Figma limitations, the corner radii of the gauge may appear slightly uneven in design files. In development, the component renders with consistent geometry.

Data States

Progressive Loading

Progressive Loading – The gauge fills as data is received, reflecting the current state of the measurement in real time.

Fluctuation (calculating state) – While the value is still being calculated, the gauge subtly fluctuates. The endpoint moves slightly up and down to indicate ongoing activity.

Final state – Once the value is confirmed, the gauge settles into its final position and remains stable.

Handoff to development

Step Configuration (Metrics)

The number of steps around the gauge is configurable. Adjust the count to match the needs of the data.

Steps are always evenly spaced to maintain a balanced and readable layout. The values assigned to each step are independent of their position, allowing for non-linear scales (e.g. 0, 10, 50, 100).

Values shown in design are illustrative. Final step values and scaling should be defined during implementation based on real product data.

### Colour Schemes

### Behavior on Color Schemes

The use of this component is restricted – it can only be used with specific combinations of component settings and schemes.

White

 
Black

 
Magenta (Restricted)

Magenta (Restricted)

Secondary (Restricted)

This scheme is restricted. Only the Neutral Progress Indicator property can be used on Secondary schemes.

### Examples

Web

Mobile

Accessibility

## What the consumer provides

The ODS React component `ODSSpeedometer` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSpeedometer } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSpeedometer } from "@telekom-ods/react-ui-kit/ODSSpeedometer";

<ODSSpeedometer width={350} height={320} showTopic={true} />
```

Static HTML: download **Speedometer.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
