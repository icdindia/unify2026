# Link

A link is an interactive text element that directs users to another location or file. It can appear independently or within a larger text, such as a sentence or paragraph.

- **ODS name:** `ODSLink`
- **Storybook:** Components/Link
- **Stories:** Example Story, Label Only, Label Only Disabled, Icon Before, Icon After, Icon Before And After, Library Icon Before, Library Icon After, Library Icon Before And After, Label Only Secondary, Link As A Button, With Meaningful Icon, With Decorative Icon, With Custom Component

## Example (story args)

```tsx
{
  args: {
    type: "primary",
    label: "Link",
    disabled: false,
    alignment: "left",
    linkType: "standard",
    href: "https://www.telekom.com/",
    target: "_blank"
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | string | – |  |
| `target` | string | – |  |
| `variant` | "primary" "secondary" | – | contains the value of the Link variant. |
| `type` | "primary" "secondary" | "primary" | contains the value of the Link type. |
| `label` | string | – | contains the value of the Link label. |
| `as` | "a" "button" | – | Element to render. Use "button" to render a real <button type="button"> for click-action links. Defaults to "a". Ignored when Component is set. |
| `linkType` | "button" "standard" | "standard" | contains the linkType, which is either a standard Link or a Button working like a link. |
| `disabled` | boolean | false | controls whether the Link is disabled |
| `leftIcon` | ReactNode | – | contains the left icon of the Link. While setting the icons, make sure that they are 16px * 16px in size. |
| `rightIcon` | ReactNode | – | contains the right icon of the Link. While setting the icons, make sure that they are 16px * 16px in size. |
| `alignment` | "left" "right" "centered" | "left" | the alignment of the link inside of the container. can be 'right', 'left' or 'centered' |
| `Component` | ElementType | – | Custom component to render as the link root (e.g., NextLink). |
| `ariaLabelLeftIcon` | string | – | Optional aria-label for the left icon, used to improve accessibility by providing a meaningful description for screen readers. |
| `ariaLabelRightIcon` | string | – | Optional aria-label for the left icon, used to improve accessibility by providing a meaningful description for screen readers. |
| `children` | - | – |  |

## Guidelines (from the ODS docs page)

### General
A link is an interactive text element that directs users to another location or file. It can appear independently or within a larger text, such as a sentence or paragraph.

When to use

Forward users to a different page (within your product/service or from an external site)
Direct users to another section on the same page
Make phone numbers or emails interactive
When not to use

Use a button instead when you want users to perform a specific action.

### Anatomy

### Use Directives
Variants
Primary and secondary

Links should be used preferably in their primary version, specially in white/neutral backgrounds.

Text and icon

Add an icon to label certain categories, e.g., links to external sites, documents, downloads, etc. Make sure to use icons consistently within your product or service.

Link Text

Each link text should be unique to avoid problems with screen readers.
A link text should be as short as possible - typically one to three words. However, a link needs to be long enough to clearly convey its purpose. In certain cases, you can link a full sentence, but avoid longer links wherever possible.
A link text should make sense without any additional context. Using "more information" or "click here" can cause problems for people using screen readers.
Behaviours
How the component will behave in a live environment

Interactive area
The link has a minimum interactive area of 48 x 48px which expands as needed to contain longer links.

Positioning
Links can appear on their own.

Links can appear following a block of copy.

External links
To communicate an external link add an appropriate icon to the right of the text. In order to maintain consistency use the same icon to denote external links across a product or service.

Inline links
Inline links do not use the Link component.

Instead, simply select the text you wish to designate a link, apply the appropriate link style to it, and lastly apply the text-link colour token.

Available link styles:

Link M Bold
Link M Regular
Link S Regular

Link and tooltips
Tooltips can provide additional context or information about an element when users hover over or interact with it. This can be particularly useful for inline links when you want to provide more details without cluttering the interface.

### Component Variants

;

### Colour Schemes
How it works (or is restricted) across colour schemes

White

Black

Magenta
Primary link only works on Magenta. The secondary link is restricted.

Secondary
Primary link only works on Secondary. The secondary link is restricted.

### Examples
Inline text link followed by stand-alone text link

### Accessibility
This OneDS component is compliant with WCAG 2.2 AA Standards.
Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

If you need to disable a link, please make sure that the link label doesn’t convey an information which is crucial to understand the context.
Links to external pages should clearly indicate with an icon that they open in a new window or tab.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

If using tooltip next to the label, do not use title attribute, use the tooltip component instead (Tooltip component is in progress, coming soon).
Use aria-describedby="ext" for external links, referencing an ID within the same DOM.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSLink` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSLink } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSLink } from "@telekom-ods/react-ui-kit/ODSLink";

<ODSLink label="Link" type="primary" linkType="standard" disabled={false} alignment="left">Content</ODSLink>
```

Static HTML: download **Link.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
