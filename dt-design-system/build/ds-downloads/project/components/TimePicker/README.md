# TimePicker

A time picker allows users to select a specific time.

- **ODS name:** `ODSTimePicker`
- **Storybook:** Components/Time Picker
- **Stories:** Example, Controlled, Controlled Open, Informative, Error, Min Max Time

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | "small" \| "large" | "large" | Size of component |
| `disableFuture` | boolean | false | Used to disable past time from selector |
| `disablePast` | boolean | false | Used to disable past time from selector |
| `maxTime` | Date | dayjs().endOf("D").startOf("minute").toDate() | Maximum time that can be selected |
| `minTime` | Date | dayjs().startOf("D").startOf("minute").toDate() | Minimum time that can be selected |
| `minutesStep` | 1 \| 5 | 1 | Minute selector intervals. Can either be 1 minute or 5 minutes |
| `defaultTime` | Date | – | Default selected time |
| `value` | Date \| null | – |  |
| `inputProps` | Omit<ODSTimePickerInputFieldProps, "value"> | – | Props to be applied to input element |
| `flyoutProps` | ODSTimePickerFlyoutProps | – | Props to be applied to flyout element |
| `flip` | boolean | true | Determines if Timepicker flyout should flip position when there is not enough space |
| `open` | boolean | – |  |
| `defaultOpen` | boolean | – | Default open state of the flyout when uncontrolled.* |
| `onChange` | ((value: Date \| null, formattedValue?: string, error?: ODSTimePickerErrorType) => void) \| undefined | – | Callback event for when value changes |
| `onError` | ((value: Date \| null, formattedValue?: string, error?: ODSTimePickerErrorType) => void) \| undefined | – | Callback event for when input value is not a valid date. Can be used to set mode to "error" and provide supportMessageProps.message |
| `onOpen` | (() => void) | – |  |
| `onClose` | (() => void) | – |  |

## Guidelines (from the ODS docs page)

### General

A time picker allows users to select a specific time.

When to use

Users need to schedule or record an event.
Users must select a specific time, like 14:00 or 18:30.
Precise date input is crucial.
When not to use

Don't use a time picker when users need to:

Enter time intervals, like from 13:30 til 18:00. Instead use a dropdown select for such cases.
### Anatomy

### Use Directives

How designers should use the component

Sizes

Large Time picker

The large Time picker should be used when you have enough screen space and when you're using other large input field based components.

Small Time picker

The small Time picker should be used when your screen space is limited and when you're using other small input field based components.

Status

Unfilled

In its unfilled state, the Time Picker shows no date selected. Use this when no default date is set, allowing users to start with a blank state.

Editing

In the editing state, the Time Picker shows that the user is actively entering a date. 

Filled

In the filled state, the Time Picker confirms that a valid date has been selected.

Expanded

When expand property is enabled, the Time Picker's calendar flyout menu becomes visible, allowing users to directly select dates from the calendar.

Behaviour

How the component will behave in a live environment

Time Flyout Layout

The Time Picker flyout menu always has 2 columns: hours and minutes
The values are always composed by 2 numbers.
The minutes row can be tailored to specific needs, wether it displays the full range (0-59) or in 5 minutes intervals.

Editing

When the mouse hovers over the time field of thetime picker component, the entire component enters a hover state. However, hovering over the clock icon will cause it to enter its own hover state independently.
When the user clicks on the time field via mouse the flyout opens, the field becomes editable and focused
If the user selects the clock icon button the calendar appears

Selecting time

When the user clicks on a hour and minute the time gets selected and the date picker turns filled, focused and the flyout closes.
The user can use the keyboard to move to another field & select it with either the Enter key or with the OK button

Keyboard Interaction

When the user focuses on the date picker component through keyboard, the field becomes editable and they can manually add the date to the field. The calendar doesn’t appear

### Component Variants

### Size

Status - Large

Status - Small

Standard

Support message - Informative

Support message - Error

### Colour Schemes

How it works (or is restricted) across colour schemes

White

  
Black

  
Magenta

  
Secondary

  
### Examples

Schedule your appointment form

### Accessibility

This OneDS component is compliant with WCAG 2.2 A and AA standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Labels should clearly describe the time that the user needs to input, such as starting time or ending time when making an appointment.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Mobile aspects

The input selector should be accessible from the dial selector via the keyboard icon. This interaction allows multiple input methods and makes the time picker accessible for assistive technology users.
Development considerations

Component should allow manual time entry through text input, rather than exclusively through the flyout via the Clock icon button.
Components should inform the user about the expected time format to enter. For example “14:00” or “02:00 PM"
Component should allow keyboard time entry through text input field and through flyout via Clock icon button.
Hours should be announced in this format: 18.15 -> “eighteen fifteen”.
Time Picker Validation Responsibility

The Time Picker component does not include built-in validation logic for time values, including in preview/example screens.
The component exposes callbacks such as onValueSubmit, onSubmit, and onCancel, which allow Product Teams to implement custom validation behavior according to product requirements. This behavior is consistent across iOS and Android.
Recommendation for Product Teams:
Product Teams are responsible for implementing validation logic to ensure that users can only submit valid date and time values. Validation should:
Prevent invalid values from being submitted
Provide clear and accessible error feedback to all users
Ensure error messages are announced correctly by screen readers
Keep the user informed about the expected input format
Validation feedback should therefore be implemented in an accessible and consistent way across platforms.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTimePicker` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSTimePicker } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTimePicker } from "@telekom-ods/react-ui-kit/ODSTimePicker";

<ODSTimePicker size="large" disableFuture={false} disablePast={false} maxTime={dayjs().endOf("D").startOf("minute").toDate()} minTime={dayjs().startOf("D").startOf("minute").toDate()} minutesStep={1} />
```

Static HTML: download **TimePicker.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
