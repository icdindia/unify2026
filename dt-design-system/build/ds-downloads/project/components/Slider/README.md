# Slider

The slider component allows users to select a value or range from a predefined set of values by moving a handle along a track.

- **ODS name:** `ODSSlider`
- **Storybook:** Components/Slider
- **Stories:** Example Story, Error Handling, Form

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `labelMin` | string | – | Min Label for the slider |
| `labelMax` | string | – | Max Label for the slider |
| `error` | boolean | – | Indicates if there is an error |
| `errorMessage` | string | – | Error message to display |
| `minTrackLabel` | number | 0 | Minimum track label value |
| `maxTrackLabel` | number | 130 | Maximum track label value |
| `maxInputFieldPrefix` | string | – | Props for the max input field |
| `minInputFieldPrefix` | string | – | Props for the min input field |
| `onValueChange` | ((firstValue: number, secondValue?: number) => void) | – | Callback function when the slider value changes |
| `variant` | "single" \| "sideBySide" \| "stacked" | – | Variant of the slider |
| `defaultMinValue` | number | – | Default initial value for the left thumb |
| `defaultMaxValue` | number | – | Default initial value for the right thumb |
| `leftThumbAriaLabel` | string | – | Aria label for the left thumb |
| `rightThumbAriaLabel` | string | – | Aria label for the right thumb |

## Guidelines (from the ODS docs page)

### General
The slider component allows users to select a value or range from a predefined set of values by moving a handle along a track.

When to use:
When users need to select a value from a continuous or discrete range (e.g., volume control, brightness settings, price range selection).
When precise input is not necessary, and an approximate value suffices.
When visual feedback of the selected value is beneficial.
When not to use:
When selecting from a small set of discrete options (use a radio button group, dropdown or counter instead).
When accessibility or space constraints make sliders impractical.
When users need to input an exact numeric value (use a text input or number input instead).
### Anatomy

### Use Directives
How designers should use the component

Component level
Number of thumbs

Select the number of thumbs to display.

Range

This represents the currently selected value or range on the slider. It can be a single value (for a single-value slider) or two values (for a range slider) indicating the start and end of the selected range.

Min and Max value

Choose the Min and Max value of the slider.

Sub-component level-Slider Input Field Group
Single / Side by Side / Stacked

Specifies the layout style of the input fields within the component:

Single: Displays a single input field, typically for a single-value slider.
Side by Side: Displays two input fields next to each other,ideal for a range slider where users set minimum and maximum values.
Stacked: Displays two input fields stacked vertically,useful for space-constrained designs. This variant is the preferred for mobile viewports.

Label Min

Represents the label or identifier for the minimum value input field. It helps users understand that this field corresponds to the lower boundary of the slider's range.

Label Max

This subproperty is avaiable only for Side by Side or Stack variants. Represents the label or identifier for the maximum value input field.

Sub-component level-Slider Input Field
Slider Input Field States

Input Value

Show Prefix

Additional guidance
Label text should be balanced

Make sure the labels have comparable length, level of detail, and similar context. The label should clearly describe the content represented by a particular tab. Since shorter labels are more scannable, use no more than 1-2 words.

See the do’s and don’t section for further guidance on labels.

Best practices

When the user switches between sections, only the tab and its content area should change—nothing else
Arrange the tabs according to the needs of our users
Always use a label for a tab element unless there is good reason not to
Use short, descriptive labels that all describe their content at the same level of detail
Dos and don’ts
Avoid mixing unrelated items or topics.

The names and categories of the tabs should be similiar and make sense from a grouping point of view.

Labels

Your Label text should be short and mindful. Avoid line breaks.

Error Message

For this component we don’t have error messages.

Behaviours
How designers should use the component

Set to fill
This component will always be set to "fill" in all the frames that contain it, ensuring consistent behavior across designs.

Regardless of the frame or context in which it is placed, its width parameter will remain fixed to "fill" without requiring additional adjustments.

This guarantees that the component adapts seamlessly to its container, maintaining the intended layout and responsiveness.

Desktop and mobile styles
Since this component is set to "fill," it will automatically adjust and scale to fit various device formats.

This ensures that regardless of the screen size or resolution, the component will always occupy the appropriate space within its container, providing a consistent and responsive layout across different devices, whether on mobile, tablet, or desktop. This feature enhances the user experience by maintaining a seamless design that adapts perfectly to any screen.

Type or drag
The slider can be controlled by typing in the field or by dragging the handle.

Automatic Adjustment to Valid Range for Input Values
If a value is entered that exceeds the maximum or falls below the minimum allowed, the system will automatically adjust to the correct mode to ensure compliance with the defined limits.

This ensures that the input stays within the acceptable range without requiring manual corrections, providing a seamless and user-friendly experience.

### Colour Schemes
This component is restricted to neutral color schemes.

White

Black

Magenta

Secondary
  
### Examples
Desktop

Tablet

Mobile

### Accessibility
###This ODS component is compliant with WCAG 2.2 AA Standards.

Design considerations

Always pair the slider with a visible label that clearly describes what the value controls.
The current value must be clearly perceivable at all times.
Provide clear min and max values visually so users understand the range.
Ensure sufficient spacing around the slider to avoid accidental interaction, especially on touch devices.
Focus indicators on the slider thumb must be clearly visible and not confused with hover or pressed states.
Development considerations

Provide values for aria-valuemin, aria-valuemax and aria-valuenow to indicate the position of the ruler on the slider.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSSlider` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSlider } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSlider } from "@telekom-ods/react-ui-kit/ODSSlider";

<ODSSlider minTrackLabel={0} maxTrackLabel={130} />
```

Static HTML: download **Slider.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
