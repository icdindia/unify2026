# Switch

Switches allow users to quickly turn an item on or off. Like a physical light switch, they provide an immediate result. A switch is used to quickly switch between two possible states. They are commonly used for “on/off” switches.

- **ODS name:** `ODSSwitch`
- **Storybook:** Components/Switch/Switch
- **Stories:** Primary, Form

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | string | – |  |
| `label` | string | – | The label of the switch. |
| `size` | "small" \| "large" | "large" |  |
| `selected` | boolean | – | Controls the selected status of the switch (controlled mode). |
| `defaultSelected` | boolean | false | Specifies the initial selected state of the switch (uncontrolled mode). |
| `disabled` | boolean | false | Controls the disabled status of the switch. |
| `readonly` | boolean | false | Controls the readonly status of the switch. |
| `loading` | boolean | false | Controls the loading status of the switch. |
| `inputProps` | ODSComponentPropsWithRef<"input"> | – | All allowed input field props for the inner input element. |

> The Switch component has been upgraded to follow the latest ODS design and API standards. The previous API is now deprecated and will be removed in an upcoming release. To ensure compatibility and benefit from new features, please migrate your usage to the new API.

## Guidelines (from the ODS docs page)

### General

Switches allow users to quickly turn an item on or off. Like a physical light switch, they provide an immediate result. A switch is used to quickly switch between two possible states. They are commonly used for “on/off” switches.

When to use

Use switches for quickly toggling between two distinct states, like "on/off" or "yes/no."
When not to use

Avoid using switches for more complex options with multiple states or when visual space is limited
The user has to confirm by saving or submitting to apply the new state
Immediate results are not possible.

### Anatomy

### Use Directives

How designers should use the component

Type

Large or small

The two sizes are intended for different applications.

Selected state variations

Switch deselected

Then switch circle is left aligned and black to indicate it is deselected.

Switch selected

Then switch circle is right aligned and magenta to indicate it is selected. The icon inside is meant accessibility purposes - for users that might be color blind and not able to distinct the off and on action simply by colors.

Spinner selected

The loading spinner is used to portray long periods between each on or off swito enable the user to see that in real time the process of switching on or off.

Disabled

Disabled state indicates tht a user is not abe to edit the switch.

Dos and don’ts

Don't change the text size

Switch should always follow the text size in which it comes with. The bigger text should be only something that the user would then set on his own device when they increase the text size by 200% or 400%.

Text length restrictions

Your text should be 2 words at most. Always use sentence cases and never use punctuation.

Don't change the color

Don't change colour of the switch.

Don't change the layout

Don’t remove the switch background. The spinner should not float on its own, it should always remain inside the switch frame.

### Component Variants

Large

Small

### Colour Schemes

White

Black

Magenta

Secondary

### Examples

### Accessibility

This ODS component is compliant with WCAG 2.2 A and AA standards.  

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

The loading state must communicate that an action is in progress and that interaction is temporarily unavailable.
Avoid ambiguous visual states: users must always be able to tell whether the switch is on, off, disabled, or read-only.
The switch and its label should be clickable as a single target to support users with motor impairments.
Ensure sufficient spacing between the switch and surrounding elements to avoid accidental activation.
A disabled switch must not have a support message, and its label should not convey any crucial information needed to understand the context.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

If a loading state is present, prevent additional toggling while loading; optionally announce the state change using a polite live region (e.g. “Updating setting”); avoid continuous announcements.
Ensure hover, pressed, and focus states do not override or obscure the current on/off state.
If the switch is part of a group, ensure a logical reading and focus order and consider grouping with fieldset and legend where appropriate.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSSwitch` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
