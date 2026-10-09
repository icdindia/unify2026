# Button

The button enables users to interact with interfaces efficiently by providing clear actions. It exists in a hierarchy of four types and comes with variations in icon placement and sizes.

- **ODS name:** `ODSButton`
- **Storybook:** Components/Button
- **Stories:** Example, Button As A Link, Loading Button Demo

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | boolean | – |  |
| `onClick` | object | – |  |
| `label` | string | – |  |
| `size` | "small" \| "large" | "large" | Size of the button, big or small |
| `href` | string | – |  |
| `target` | "_self" \| "_blank" \| "_parent" \| "_top" | – |  |
| `buttonIcon` | ReactNode | – | Accepts an SVG React component. The button to be displayed |
| `as` | "a" \| "button" | – |  |
| `buttonType` | "link" \| "standard" \| "iconOnly" | "standard" |  |
| `variant` | "primary" \| "secondary" \| "outline" \| "subtle" \| "ghost" | "primary" | The desired styles can be applied through this. |
| `leftIcon` | boolean | false | Toggle the left icon, if true the icon provided will be displayed to the left of the label. |
| `rightIcon` | boolean | false | Toggle the right icon, if true the icon provided will be displayed to the right of the label. |
| `ariaLabel` | string | – | Label to be perceived by screen reader users. Always give a meaningful ariaLabel in case of icon only buttons. |
| `loading` | boolean | – | To show a loading spinner and indicate a loading state while some background operation is going on. This disables any button events but does not show the UI as disabled for some edge cases. If you want to show the button as disabled please set 'disabled' as true. With the primary button (when the button background is same as the loading spinner indicator) it is recommended to change the 'variant', |
| `isLoading` | boolean | – |  |
| `loadingSpinnerProps` | ODSLoadingSpinnerProps | – | Props to pass to the loading spinner. |
| `loadingMessage` | string | "Loading" | Accessibility message when the button is loading |
| `textWrap` | boolean | – | If set to true the button's is expanding to the remaining area, to accommodate for the text wrapping |

## Guidelines (from the ODS docs page)

### General

The button enables users to interact with interfaces efficiently by providing clear actions. It exists in a hierarchy of four types and comes with variations in icon placement and sizes.

When to use

Use a button to perform an action or navigate to an important page (e.g., a landing page). Each viewport should contain no more than one primary button to communicate the next best action and provide orientation. For less important actions, use buttons of lower emphasis.

When not to use

Avoid using buttons as navigation elements. Instead, opt for text links to lead the user to a new page.

Icon buttons

In certain cases, you can also use an icon without text, for example when space is limited and an icon unmistakably communicates the button's action. If you use an icon only button, always provide a text label for screen readers.

### Anatomy

### Use Directives

How designers should use the component

Types

Primary Button

The primary button is a core element for brand recognition. We recommend using it only for the main call to action on a page or viewport to strengthen the visual hierarchy of the content and functionality

Button label
Secondary Button

The secondary button is intended for actions that are less critical than the main call to action. Reserve it for actions that are important but not the primary focus on a page, yet still require emphasis

Button label
Outline Button

Use the outline button as an alternative to the secondary button, to strenghthen the visual hierarchy.

Button label
Ghost Button

The ghost button can be used in combination with a call to action or secondary button. Never use it without any context since users might confuse it with static text.

Button label
Button Groups

If buttons are directly related to each other, align them as a group. Use only one primary button for each button group.

In processes and modal dialogs, buttons are aligned to the right to indicate progress. The button farthest to the right is the primary button; the secondary button is placed on the left.

In forms, we align buttons to the left side of the form content. The primary button is placed on the left and the secondary button on the right.

Variants

Text, Text and Icon, Icon only

Button label

Button label

Button label

Combining button variants

Standard buttons and icon buttons can be used together.

Download as pdf

Icon placement

Icons make it easier to grasp information when positioned in the right place. Following the direction of reading, place the icon to the left of the text label. However, there is one exception: a Next button with an arrow. In this case, we place the icon on the right side to help people process the information intuitively.

Download

Print

Next step

Back
Sizes

Large size button

Large buttons should be used for primary actions or calls to actions that are critical for the user journey, such as "Buy Now" or "Sign Up," as they draw immediate attention and encourage interaction. They can also be used on larger viewports when the designer has more space to play with.

Go to shopping cart
Small size button

Small buttons are suitable for conserving valuable screen space, especially on web mobile or interfaces with limited real estate.

Go to shopping cart
### Dos and don'ts

Be mindful of Label choice

Your Label text should be a simple call to action. It should contain a maximum of three words. To provide a clear context, use a verb plus noun. To increase the motivation to subscribe or register, and similar cases, add the word “now”.

Minimum width

The button has a built-in minimum width to insure visual prominence, even with very short labels.

Button icons

Don’t use two icons in the same button. Icons make it easier to grasp information when positioned in the right place. Following the direction of reading, place the icon to the left of the text label. However, there is one exception: a Next button with an arrow. In this case, we place the icon on the right side to help people process the information intuitively.

Icon-only ghost buttons

In certain cases, when the context is clear enough, you can also use an Icon-only Ghost Button, for example when space is limited and an icon unmistakably communicates the button's action.

Use the hierarchy

When using multiple actions, use the button hierarchy to nudge the desired user action.

Don’t mix button sizes

All buttons in a button group must be of the same size, either large or small.

Stacked buttons

When multiple buttons are stacked, the widest button determines the width of all buttons in the group.

Colour restrictions

On Magenta colour scheme, the Secondary buttons are not to be used.

On Secondary colour scheme, the Outline buttons are not to be used.

Behaviours

How the component will behave in a live environment

Button scaling

Buttons scales to fit content. The button is built with a minimum width of 160px for large buttons and 88px for small buttons.

Icon buttons don’t scale

The icon button sizes is locked to 64px for the large button and 48pc for the small one.

Label wrapping

Buttons labels can be two lines when the parent container limits the button width, though this is generally to be avoided by keeping button labels short and to the point.

Button grouping

If buttons are directly related to each other, align them as a group. Use only one primary button for each button group.

In processes and modal dialogs, buttons are aligned to the right to indicate progress. The button farthest to the right is the primary button; the secondary button is placed on the left.

In forms, we align buttons to the left side of the form content. The primary button is placed on the left and the secondary button on the right.

Scale to container

Buttons can be set to scale to the width of the container, often used on mobile breakpoints.

Loading button

How to set up

The Loading Button extends the ODSButton to show ongoing processes. Designers can customise it in Figma with or without loading text. The spinner sits left of the text or centralised when there’s no text. Make sure the spinner colour contrasts well with the button variant. Please note that the Loading button is a dev asset and is seen here only for demonstration purposes.

The SDK offers the loadingSpinnerProps API to let developers overwrite the spinner’s colour scheme and size. By default, the SDK does not disable the button during loading. If business requirements dictate that the button should be disabled while loading, developers must implement this behaviour manually. Setting up the button to have a loading state:

Choose your Button type: Standard or Icon.
Define the Button size: Specify the proper size.
Detach the button and place the ODS Loading Spinner with the appropriate Colour Scheme inside.
Colour Schemes to be applied on the Loading Spinner for each Button variant: a. Primary Button – Magenta scheme on the ODS Loading Spinner b. Secondary Button – Magenta scheme on the ODS Loading Spinner c. Outline Button – No change required on the ODS Loading Spinner d. Ghost Button – No change required on the ODS Loading Spinner
Remove restrictions for the Outline and Ghost Button.

Colour Setup

The ODS Loading Spinner should be used with the Magenta colour scheme to work for the Primary and Secondary Variants of the ODS Buttons – no further changes are needed for the rest of the variants.

   
Use pattern

The Loading Button shows users that their request is being processed in the background. It gives clear feedback while the system works on their action.

 
### Component Variants

Standard Large

Icon Large

Standard Small

Icon Small

### Colour Schemes

How it works (or is restricted) across colour schemes

White

 
Black

 
Magenta

 
Secondary

 
### Examples

Buttons on desktop

Buttons on mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Ensure all buttons have a meaningful alt text for screen readers (aria-label) shown on hover and focus, to ensure basic accessibility.
To further enhance accessibility of icon-only buttons, add a tooltip to benefit keyboard users and provide additional information for sighted users.
Always use ghost buttons in combination with another button type. Without context, users might confuse them for text.
If you need to disable a button, make sure that the button label doesn’t convey information crucial to understanding the context.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

All buttons should have a meaningful alt text for screen readers (e.g., aria-label).
If a tooltip is used for an icon-only button, ensure that its text matches the alt text (aria-label). Avoid using the title attribute.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSButton` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
