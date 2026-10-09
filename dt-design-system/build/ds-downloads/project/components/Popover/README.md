# Popover

A popover is a small, interactive pop-up that appears when a user clicks, or taps on an element, providing additional information about that element. It offers brief, contextual insights without cluttering the UI.

- **ODS name:** `ODSPopover`
- **Storybook:** Components/Popover
- **Stories:** Action Links, Action Buttons, Custom Actions, Controlled Popover

## Example (story args)

```tsx
{
  args: {
    ...defaultArgs,
    placement: "top",
    alignment: "center",
    trigger: <ODSButton label="information" buttonType="iconOnly" buttonIcon={<ODSShoppingCart />} variant="outline" size="small" />,
    actionSlot: <ODSPopoverPreferredActions {...linkActionArgs} />
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` * | string | – | Label to be shown on popover top |
| `closeButtonLabel` | string | – | Label for close button as read by screenreader. @deprecated Use closeButtonProps.label instead. |
| `closeButtonProps` | Omit<ODSButtonProps, "size" \| "buttonIcon" \| "buttonType" \| "variant"> | – | Props for the close button (accessibility and behavior only, style is managed internally) |
| `contentSlot` | ReactNode \| ReactNode[] | – | Dynamic content of popover |
| `actionSlot` | ReactNode \| ReactNode[] | – | Dynamic actions of popover. Suggested Preferred Content: ODSPopoverPreferredActions |
| `secondActionSlot` | ReactNode \| ReactNode[] | – | Deprecated |
| `firstActionSlot` | ReactNode \| ReactNode[] | – | Deprecated |
| `text` * | string | – | Text to be shown under popover label |
| `className` | string | – |  |
| `closeIcon` | ReactNode | – | Icon to be rendered for the close button. Accepts an SVG React component. If it is not set the default icon will be used. |
| `placement` | "left" "right" "top" "bottom" | – | The placement of the arrow can be placed at the top, bottom, left or right of the popover |
| `alignment` | "center" "start" "end" | – | The placement of the arrow can be aligned on the left hand, right hand or centrally on the popover |
| `defaultOpen` | boolean | – | The initial value for the open state. |
| `open` | boolean | – | Whether the sheet is open or not. Use together with onOpenChange. |
| `onOpenChange` | ((open: boolean) => void) | – | Fires when the open state changes. |
| `offset` | number | – | Offset (in pixels) of popover from Trigger element |
| `arrowOffset` | number | – | Offset (in pixels) of popover from Trigger element |
| `trigger` | ReactNode | – | Element that will be used as trigger for the popover to open |

## Guidelines (from the ODS docs page)

### General

A popover is a small, interactive pop-up that appears when a user clicks, or taps on an element, providing additional information about that element. It offers brief, contextual insights without cluttering the UI.

When to use

To provide explanations or extra details about buttons, icons, or other interface elements.
When subtle guidance is needed to enhance user understanding without permanently altering the interface layout.
When not to use

For conveying essential information necessary for task completion, which should be visibly accessible in the main interface.
When frequent use of tooltips and popovers might overwhelm or confuse the user.

### Anatomy

### Use Directives

How designers should use the component

Subcomponents for Web and Mobile

The Popover component can be used for both native mobile and web prototypes. In case of native mobile the popover can be substituted by the Bottom Sheet.

Web

Mobile

Popover

Bottom sheet (Alternative)

Placement

The placement of the arrow can be placed at the top, bottom, left or right of the popover as shown in the examples below.

Alignment

The placement of the arrow can be aligned on the left-hand side, right-hand side, or centered on the popover.

Positioning

Ensure Smart Positioning

Ensure the popover dynamically adjusts its position to avoid obscuring content and to stay within the screen's boundaries.

Do's and don'ts

Don't change the text size

Your popover should always follow the text size in which it comes with.

Optimize Text Length

Keep popover text concise; aim for no more than a sentence or two to ensure the message is quickly understood.

Keep popover title short; it is preferable that the title should not wrap to a second line.

Optimize Actions

Keep popover actions labels concise; use straightforward and action-oriented language. It is preferable that the 2 actions should not wrap to a second line.

Optimize Slot

Popover slot content has a maximum height of 180px. Popover content should not be scrollable.

Ensure High Contrast

Popovers should have high text-to-background contrast to ensure readability for all users, including those with visual impairments.

Colour

Colour restrictions

Can be used on Black colour scheme.

Can be used on Magenta colour scheme.

And on Secondary colour scheme.

Behaviours

How the component will behave in a live environment

Context-Sensitive Display

Popovers should appear only when users interact with the element they are associated with and disappear when the interaction ends.

Alternatively the popover can appear when we want to introduce features to the users, in that case they might also appear when the screen loads.

Easy Dismissal

Popovers should be dismissible through straightforward interactions, such as clicking away or pressing the escape key.

Position

The popover’s position will adjust dynamically to ensure visibility and avoid obscuring the element it's associated with.

Tooltip and Popover Usage with Text Fields

The tooltip works seamlessly with text fields. It appears on hover or focus without interrupting the user’s input flow.

The popover needs focus to stay open. If you connect it directly to a text field, it will take focus away from the field. This can disrupt typing or other interactions.

To avoid this, the design system supports a manual override at the product level. Here, a button is placed in an absolute position over the text field. This button acts as the popover trigger instead of the text field icon. Users keep focus on the text field while still accessing the popover.

This approach keeps interactions smooth and predictable. It respects keyboard and focus behavior standards without reinventing the wheel.

### Component Variants

Placement Top

Placement Bottom

Placement Left

Placement Right

### Colour Schemes

How it works (or is restricted) across colour schemes

Colour Modes

Light

Dark

### Colour Schemes

White

Black

Magenta

Secondary

### Examples

Used to label an icon button

Used to introduce a new feature

Used in a form

Phone

Email

Button label
Accessibility WIP

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Keep popover content minimal.
For additional form element info, use an info-icon next to the form element rather than applying it directly (e.g., avoid placing on a text field).
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Ensure the popover becomes visible when the text field receives focus (pending A11y test).
Position popovers in the centre of the screen to avoid additional scrolling.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSPopover` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSPopover } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSPopover } from "@telekom-ods/react-ui-kit/ODSPopover";

<ODSPopover text="Popover" label="Popover" />
```

Static HTML: download **Popover.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
