# Accordion

An accordion efficiently organizes and presents extensive content while conserving space. It empowers users to navigate content seamlessly and select specific topics for exploration.

- **ODS name:** `ODSAccordion`
- **Storybook:** Components/Accordion/Accordion
- **Stories:** Example, Basic, Only One Expanded, Controlled, Uncontrolled

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | "small" \| "large" | "large" | contains the size value of the Accordion. |
| `disabled` | boolean | false | controls whether the Accordion is expanded or collapsed. |
| `onToggle` | ((state: boolean) => void) | – | Toggle will also be able to be handled outside the component using this function. |
| `headerText` * | ReactNode | – | contains the content of the header. The value can either be text or JSX. |
| `headingElement` | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" | "h2" | the heading element that will be used for the Accordion Header. As described in w3.org, accordion header trigger is wrapped in an element with role heading that is appropriate for the information architecture of the page. There is no visual impact. Please update this to fit the content of your page. |
| `expanded` | boolean | false | controls whether the Accordion is expanded or collapsed. |
| `contentSlot` | contains the type of content in the dropdown. The value can either be text or slot. Suggested Preferred Content: ODSTextBody \| ODSTextBody | – | ReactNode \| ReactNode[] |
| `collapseDownIcon` | ReactNode | – |  |
| `collapseUpIcon` | ReactNode | – |  |

## Guidelines (from the ODS docs page)

### General

An accordion efficiently organizes and presents extensive content while conserving space. It empowers users to navigate content seamlessly and select specific topics for exploration.

When to use

Help users find relevant content more quickly
Organise a large amount of related content in a small space
Show content which users don't necessarily need to read all the way through
When not to use

Bear in mind that accordions require a great deal of interaction. Don't use an accordion when:

Users might need to open the majority of the subtopics
Users might want to print out the entire page
You're only trying to shorten the page

### Anatomy

### Use Directives

### Size

Small

Use the small size on smaller viewports such as mobile or where space is at a premium.

Large

Use the large size on larger viewports such as XXL - Large and when conveying important pieces of information such as FAQs.

Expanded

True

Open state (text expanded area) – Once selected, the chevron points upwards to indicate it has been expanded. You can add a simple body text or also insert headlines, split text into paragraphs, and add images or illustrations. Keep it as simple and clear as possible.

False

Closed state – The chevron points downwards to indicate the accordion is closed.

Disabled

True

Accordion is non-interactive. This state prevents expansion/collapse, mutes hover states, and changes color for visual feedback. Use for conditional content.

False

Accordion functions normally, it can expand/collapse content, with full interactivity including all interaction states.

### States

Header Text

Choose a topic title which is as clear and descriptive as possible. Try to keep it short so users can grasp the content quickly. The title and icon are the control for opening the panel.

### Dos and don'ts

Width and character count recommendation

A line of text shouldn't be longer than 80 characters. This helps users with certain reading or visual disabilities that have trouble keeping their place when reading long lines of text.

As the accordion component uses body regular, the size of the component frame should not exceed 575px (this equates to 5 columns on the XL viewport grid). The number of characters will not exceed 80 when using this guideline.

Multiple items

A user can then independently expand each section of the accordion, allowing for multiple sections to be open at a time. If there are multiple accordion elements in use then use the divider component as a tool to separate each element.

### Component Variants

### Size

Small

Large

### Colour Schemes

### Behavior on Color Schemes

This component isn’t restricted – it works across all color schemes.

White

Black

Magenta

Secondary

### Examples

Large

Small

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

No further design and development considerations required.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSAccordion` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSAccordion } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSAccordion } from "@telekom-ods/react-ui-kit/ODSAccordion";

<ODSAccordion size="large" disabled={false} headingElement="h2" expanded={false} />
```

Static HTML: download **Accordion.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
