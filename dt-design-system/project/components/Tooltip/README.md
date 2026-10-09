# Tooltip

A tooltip is a small, interactive pop-up that appears when a user hovers, clicks, or taps on an element, providing additional information about that element. It offers brief, contextual insights without cluttering the UI.

- **ODS name:** `ODSTooltip`
- **Storybook:** Components/Tooltip
- **Stories:** Example, Multiple Lines, Controlled Tooltip, Form With Tooltip

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `placement` | "left" \| "right" \| "top" \| "bottom" | – | The placement of the arrow can be placed at the top, bottom, left or right of the tooltip |
| `alignment` | "center" \| "start" \| "end" | – | The placement of the arrow can be aligned on the left hand, right hand or centrally on the tooltip |
| `triggerEvent` | "hover" \| "focus" \| "hover-focus" | – | The event(s) that trigger tooltip to be shown |
| `defaultOpen` | boolean | – | The initial value for the open state. |
| `open` | boolean | – | Whether the tooltip is open or not. Use together with `onOpenChange |
| `onOpenChange` | ((open: boolean) => void) | – | Fires when the open state changes. |
| `offset` | number | – | Offset (in pixels) of tooltip from Trigger element |
| `flip` | boolean | – | Determines if tooltip should flip position when there is not enough space |
| `trigger` | ReactNode | – | Element that will be used as trigger for the tooltip to open * |
| `label` * | string | – | Text to be displayed inside tooltip |
| `className` | string | – |  |
| `openDelay` | number | – | Delay for opening the tooltip (in milliseconds) |
| `closeDelay` | number | – | Delay for closing the tooltip (in milliseconds) |

## Guidelines (from the ODS docs page)

### General

A tooltip is a small, interactive pop-up that appears when a user hovers, clicks, or taps on an element, providing additional information about that element. It offers brief, contextual insights without cluttering the UI.

When to use:

To provide explanations or extra details about buttons, icons, or other interface elements.
When subtle guidance is needed to enhance user understanding without permanently altering the interface layout.
When not to use:

For conveying essential information necessary for task completion, which should be visibly accessible in the main interface.
When frequent use of tooltips might overwhelm or confuse the user.
### Anatomy

### Use Directives

How designers should use the component

Type

Placement

The placement of the arrow can be placed at the top, bottom, left or right of the tooltip as shown in the examples below.

Alignment

The placement of the arrow can be aligned on the left-hand side, right-hand side, or centered on the tooltip.

Positioning

Implement Deliberate Timing

Tooltips should appear after a deliberate short delay (e.g., 500 milliseconds), preventing accidental triggers during casual cursor movements.

Ensure Smart Positioning

Ensure the tooltip dynamically adjusts its position to avoid obscuring content and to stay within the screen's boundaries.

Shopping cart
Dos and dont's

Don't change the text size

Your tooltip should always follow the text size in which it comes with.

Optimize Text Length

Keep tooltip text concise; aim for no more than a sentence or two to ensure the message is quickly understood.

Ensure High Contrast

Tooltips should have high text-to-background contrast to ensure readability for all users, including those with visual impairments.

Colour

Colour restrictions

Can be used on Black colour scheme.

Colour restrictions

Can be used on Magenta colour scheme.

Colour restrictions

And on Secondary colour scheme.

Behaviours

How the component will behave in a live environment

Context-Sensitive Display

Tooltips should appear only when users interact with the element they are associated with and disappear when the interaction ends.

Easy Dismissal

Tooltips should be dismissible through straightforward interactions, such as clicking away or pressing the escape key.

Position

The tooltip's position may adjust dynamically to ensure visibility and avoid obscuring the element it's associated with.

### Component Variants

Placement Top

Placement Bottom

Placement Left

Placement Right

### Colour Schemes

How it works (or is restricted) across colour schemes

Neutral

Black

Magenta

Secondary

### Examples

Used to label an icon button

Shopping cart
Used in a form

Phone

Email

We require an email to keep you up to date
Button label
### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Annotate the tooltips for the developers to implement it accordingly.
For mobile (iOS, Android Flutter): Do not use tooltip when tooltip text is too long. Use an additional info-icon button with a Popover instead.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Avoid using the title attribute for the tooltip.
Ensure the tooltip span has role="tooltip" and aria-hidden="true".
The trigger should use aria-labelledby to announce the tooltip text.
For mobile, maintain tooltip visibility for at least 10 seconds (iOS Flutter: appearAnimationDuration, disappearAnimationDuration)
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTooltip` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
