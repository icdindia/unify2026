# FloatingActionButton

A Floating Action Button (FAB) is a button that floats above the UI and is used for a primary or most common action in an application. It is typically found in mobile applications but can also be used in web interfaces. The primary purpose of a FAB is to provide quick and prominent access to the main action users are likely to take in an app. It helps to ensure that the primary action is always accessible, no matter where the user is in the app.

- **ODS name:** `ODSFloatingActionButton`
- **Storybook:** Components/Floating Action Button
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onClick` | function | – |  |
| `label` | string | "" |  |
| `size` | "small" \| "large" | "large" | Size of the button, big or small |
| `disabled` | boolean | false | Disables all the events and appears blurred if true. |
| `type` | "standard" \| "extended" | "extended" | Extended or standard content. |
| `buttonIcon` | ReactNode | – |  |
| `variant` | "primary" \| "secondary" \| "outline" | "primary" | The desired styles can be applied through this. |
| `leftIcon` | boolean | false | Toggle the left icon, if true the icon provided will be displayed to the left of the label. |
| `rightIcon` | boolean | false | Toggle the right icon, if true the icon provided will be displayed to the right of the label. |

## Guidelines (from the ODS docs page)

### General

A Floating Action Button (FAB) is a button that floats above the UI and is used for a primary or most common action in an application. It is typically found in mobile applications but can also be used in web interfaces. The primary purpose of a FAB is to provide quick and prominent access to the main action users are likely to take in an app. It helps to ensure that the primary action is always accessible, no matter where the user is in the app.

When to use

Use a FAB to represent the primary action of the application, such as creating a new item, sending a message, or initiating a process.
When you want the action to be prominently displayed and easily accessible at all times.
When not to use

Avoid using FABs if your app has multiple primary actions. Using multiple FABs can clutter the interface and confuse users.
If the primary action changes based on different sections or screens within the app.
In interfaces with limited screen space where a FAB might obstruct important content.
For secondary actions or less important actions, use other types of buttons or interface elements.

### Anatomy

### Use Directives

Types

Primary FAB

The primary button is a core element for brand recognition. We recommend using it only for the main call to action on a page or viewport to strengthen the visual hierarchy of the content and functionality.

Secondary FAB

The secondary button is intended for actions that are less critical than the main call to action. Reserve it for actions that are important but not the primary focus on a page, yet still require emphasis.

Outline FAB

Use the outline button as an alternative or addition to the secondary button, to strenghthen the visual hierarchy.

Variants

Text, Text and Icon, Icon only

Icon placement

Proper placement of the icon and text is crucial for ensuring usability and maintaining a clean, balanced design. When it comes to extended FABs icon placement it really depends on the extended FAB placement on the screen. For example if the FAB is placed bottom right, the logical approach for the icon placement is left. The opposite goes for when the extended FAB is placed on the left hand side of the screen.

Sizes

Large FAB

A large FAB is useful when the layout calls for a clear and prominent primary action, and where a larger footprint would help the user engage. For example, when appearing in a medium window size.

Small FAB

A small FAB is used for a secondary, supporting action, or in place of a default FAB for smaller screen sizes. One or more small FABs can be paired with a standard or extended FAB.

### Dos and don'ts

Don’t have more than one extended floating action button per screen.

To avoid disrupting the visual hierarchy don’t use more than one extended FAB in a screen. Use a standard FAB for any secondary action.

Use FAB only for positive actions

Because the FAB is characteful, it’s generally a positive action, like create, share, explore, and so on. FAB shouldn’t be destructive action, like delete or archive.

Use only one main action FAB per screen

Because FABs are so prominent/intrusive, there should only be a main action FAB per screen along with it’s secondary actions.

Colour restrictions

On Magenta colour scheme, the Secondary FAB are not to be used.

On Secondary colour scheme, the Outline FAB are not to be used.

Behaviours

(WIP)

### Component Variants

Standard Large

Extended Large

Standard Small

Extended Small

### Colour Schemes

White

 
Black

 
Magenta

 
Secondary

 
### Examples

Desktop

Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Ensure all buttons have a meaningful alt text for screen readers (aria-label) shown on hover and focus, to ensure basic accessibility.
To further enhance accessibility of icon-only buttons, add a tooltip to benefit keyboard users and provide additional information for sighted users.
If you need to disable a button, make sure that the button label doesn’t convey information crucial to understanding the context.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

All buttons should have a meaningful alt text for screen readers (e.g., aria-label).
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSFloatingActionButton` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSFloatingActionButton } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFloatingActionButton } from "@telekom-ods/react-ui-kit/ODSFloatingActionButton";

<ODSFloatingActionButton label="" size="large" disabled={false} type="extended" variant="primary" leftIcon={false} />
```

Static HTML: download **FloatingActionButton.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
