# DismissibleChip

Chips allow users to enter information, make selections or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

- **ODS name:** `ODSDismissibleChip`
- **Storybook:** Components/Chips/Dismissible Chip
- **Stories:** Example, Set

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | boolean | – |  |
| `label` * | string | – | The label of the Chip. |
| `type` | "standard" \| "withIcon" \| "withPicture" | – |  |
| `variant` | "standard" \| "withIcon" \| "withPicture" | "withIcon" | The variant of the Chip. |
| `icon` | ReactNode | – | Icon element. |
| `closeIcon` | ReactNode | <ODSClose /> | Close Icon to dismiss the chip. If nothing is set, the default icon will be used. |
| `pictureProps` | type \| withPicture | – | ImgHTMLAttributes<HTMLImageElement> |
| `onDismiss` | ((label: string, event: MouseEvent<HTMLButtonElement, MouseEvent>) => void) | – | Fires when clicked. Use to remove the chip from the set. |
| `assistiveDescription` | string | – | Additional aria-describedby text for the chip e.g. "remove element". |

## Guidelines (from the ODS docs page)

### General

Chips allow users to enter information, make selections or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

Chips consist of relevant keywords in a container. They often appear dynamically (triggered by a user action) and as a group.

When to use:

Give users filtering possibilities
Display the filters users set
Suggest options to users (search criteria, possible answers).
When not to use:

You want to mark a category (use tags instead)
You can use a button instead

### Anatomy

 
### Component Variants

### Use Directives

Once a chip has been selected it can also be dismissible. The whole chip is tappable therefore it is a separate component.

Behaviours

Chip group overflow

When horizontal space is limited in a chip group, the individual chips wrap to form another line. The spacing between chips is 16px.

Allow bulk actions

In some instances, it's possible to add an action next to a group of chips to provide a way to easily take an action on the entire group at once. Make sure the action is only visible when there is more than one chip.

### Colour Schemes

White

Black

Magenta

Secondary

### Examples

Filter, dismissible and toggle chips

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Provide clear and short chip label.
Chips should only be used in groups.
If there is no other context in the surrounding, chip groups should have a meaningful label.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSDismissibleChip` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSDismissibleChip } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDismissibleChip } from "@telekom-ods/react-ui-kit/ODSDismissibleChip";

<ODSDismissibleChip label="DismissibleChip" variant="withIcon" closeIcon={<ODSClose />} />
```

Static HTML: download **DismissibleChip.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
