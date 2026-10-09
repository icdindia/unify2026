# TagDismissible

The Interactive Tags are dismissible and will disappears when user clicks on the close button. Multiple Interactive Tags in a wrapped group will rearranged when tags are removed. Use 8 px for horizontal and vertical gap between the tags.

- **ODS name:** `ODSTagDismissible`
- **Storybook:** Components/Tag/Tag Dismissible
- **Stories:** Example, Custom Icon, Dismissible

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` * | string | – | Label to be displayed in tag |
| `type` | "strong" \| "subtle" \| "basic" | "basic" | Type of tag |
| `icon` | ReactNode | – | Icon to be displayed inside tag |
| `closeIcon` | ReactNode | <ODSClose /> | Icon to be displayed to dismiss the chip. If nothing is set the default Close Icon will be displayed. |
| `onDismiss` | ((label: string, ev: MouseEvent<Element, MouseEvent>) => void) | – | Callback fired when tag is dismissed by user |

## Guidelines (from the ODS docs page)

### Anatomy

Behaviour
Dismissible
The Interactive Tags are dismissible and will disappears when user clicks on the close button. Multiple Interactive Tags in a wrapped group will rearranged when tags are removed. Use 8 px for horizontal and vertical gap between the tags.

Touch target
Interactive tags can be dismissed by clicking on the entire tag surface.

In input fields
Interactive tags can be used in an input field, the field can contain multiple interactive tags horizontally.

If you want to use the interactive tag in the overflow menu, use tag item as a single line item property.?

Use Interactive tags to sort information, not as filtering. For filtering use Chips.

Interactive tag can be created on input fields and can be transformed to tag. These tags can be also editable on an input field. The tags are preferred to remove by using delete key or hitting the remove icon when using the component on input field. Also Interactive tag's label should carry one word. If the text character reaches to max inner-padding with its container truncate the text..

 
Interactive states
Interactive Tag is actionable and has states.

Colors Schemes
White

Black

Magenta

Secondary
  
Secondary
  
Colourful
 
### Examples
Dismissible Tags

Old example, tags in text field

### Accessibility
This OneDS component is compliant with WCAG 2.2 A and AA standards.
Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios. 

Design considerations
When using a tag on a background or subtle fill, manually change the color scheme of the tag to “inverted” to ensure accessibility by changing the color to dark grey.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTagDismissible` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSTagDismissible } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTagDismissible } from "@telekom-ods/react-ui-kit/ODSTagDismissible";

<ODSTagDismissible label="TagDismissible" type="basic" closeIcon={<ODSClose />} />
```

Static HTML: download **TagDismissible.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
