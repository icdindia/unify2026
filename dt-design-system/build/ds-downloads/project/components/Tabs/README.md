# Tabs

Tabs allow users to quickly switch between various sections of a topic.

- **ODS name:** `ODSTabs`
- **Storybook:** Components/Tabs/Tabs
- **Stories:** Example Story, With Navigation Button

## Example (story args)

```tsx
type ODSTabsProps = {
  /** The child elements to be displayed inside the tabs. */
  children: ReactNode;
  /** The fallback message to be displayed if no tabs are available. */
  fallbackMessage?: string;
  /** The size of the tabs. Can be "small" or "large". The default value is small */
  size?: "small" | "large";
  /** The variant of the tabs. Can be "hug" or "fill". The default value is fill */
  variant?: "hug" | "fill";
  /** Whether to display a divider between the tabs and the content. */
  divider?: boolean;
};
Copy
```

```tsx
type ODSTabsProps = {
  /** The child elements to be displayed inside the tabs. */
  children: ReactNode;
  /** The fallback message to be displayed if no tabs are available. */
  fallbackMessage?: string;
  /** The size of the tabs. Can be "small" or "large". The default value is small */
  size?: "small" | "large";
  /** The variant of the tabs. Can be "hug" or "fill". The default value is fill */
  variant?: "hug" | "fill";
  /** Whether to display a divider between the tabs and the content. */
  divider?: boolean;
};
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `fallbackMessage` | string | "Error! This tab has no children!" | The fallback message to be displayed if no tabs are available. |
| `size` | "small" \| "large" | "small" | The size of the tabs. Can be "small" or "large". The default value is small |
| `variant` | "fill" \| "hug" | "fill" | The variant of the tabs. Can be "hug" or "fill". The default value is fill |
| `divider` | boolean | false | Whether to display a divider between the tabs and the content. |
| `leftButtonProps` | ODSButtonProps | – | Left navigation button props. |
| `rightButtonProps` | ODSButtonProps | – | Right navigation button props. |
| `leftButtonContainerProps` | Omit<ODSNavigationButtonProps, "buttonProps"> | – | Left navigation button container props. |
| `rightButtonContainerProps` | Omit<ODSNavigationButtonProps, "buttonProps"> | – | Right navigation button container props. |

## Guidelines (from the ODS docs page)

### General

Tabs allow users to quickly switch between various sections of a topic.

Tabs help organize content into logical sections, ideally arranged horizontally with up to 5 tabs in a single row. Each tab should present related, equally hierarchical content. The first tab is active by default.

When to use:

Use tabs to separate and present a large amount of content without reloading the page. Ensure the content:

Is related and from the same hierarchical level
Is clearly distinguished from each other
Can be understood as stand-alone content
When not to use:

Users need to compare content
Content must be read in a specific order, such as processes
Content can be optimized and displayed within a single viewing element

### Anatomy

### Use Directives

Component level

Number of tabs

Select the number of tabs to display.

Size of tabs

Select the size of the tabs.

Variant of tabs

Choose the variant of tabs.

Sub-component level

Tab states

Selected

When a tab is selected, the typography color changes to Magenta, and a visual marker—a line—is placed underneath to highlight the selected page.

Icons and labels

A tab can have an label, icon, and badge. For accessibility, we strongly recommend always using a label unless there is good reason not to.

Badge

Only one item per tab set should have a badge as a highlight. Use the badge sparingly when there is special content you want to draw attention to.

Additional guidance

Label text should be balanced

Make sure the labels have comparable length, level of detail, and similar context. The label should clearly describe the content represented by a particular tab. Since shorter labels are more scannable, use no more than 1-2 words.

See the do’s and don’t section for further guidance on labels.

Icon and label combinations should be consistent

Maintain a consistent pattern across sets of tabs.

Best practices

When the user switches between sections, only the tab and its content area should change—nothing else

Arrange the tabs according to the needs of our users
Always use a label for a tab element unless there is good reason not to

Use short, descriptive labels that all describe their content at the same level of detail

Use consistent combinations of icons and labels across tab sets
Dos and don’ts

Avoid mixing unrelated items or topics.

The names and categories of the tabs should be similiar and make sense from a grouping point of view.

Avoid mixing unrelated items or themes

Avoid using labels with different level of description.

Avoid mixing icon and label combinations

Avoid inconsistent UI patterns across sets of tabs

Avoid using icons only

Icons are intended to aid scannability, and reinforce state. They should not be used instead of of labels as they are less explicit.

Avoid using icons on secondary color schemes

The label and icon color do not do not display consistently on the secondary backgrounds.

Bold style for selected tabs icons

When an tab element is in the selected state, it’s icon should use bold (fill) style, not standard (line).

Default badge only

When the badge is used, it’s parameters should remain as default: notification, small. Note that the badge has a consistent colour across all states, it does not change colour for hovered and pressed states as the icon, label, and indicator line do.

Avoid using more that one badge per tab list

No stacking

Don’t place tabs below one another.

No nesting

Don’t nest tabs within tabs.

Behaviours

How designers should use the component

Manual intervention required for fill variant

When a fill variant is initially placed inside a container, or a hug component is switched to fill, Figma looses the fill setting of it’s width parameter. It needs to be re-set by the designer, after which it will behave as expected.

If an element is switched between hug and fill multiple times, and the manual intervention is performed once it will likely have to performed for all following switches.

Desktop and mobile styles

As a general principle the large/hug variant is designed for desktops, and the small/fill version designed for mobile devices. Note that on mobile devices the container that the component is set to fill may need to be wider than the screen and use scrolling behaviour to maintain text legibility, and avoid overlap.

Overflow and scrolling

In some cases, especially on smaller screens, the content of the tabs may exceed the width of the screen.

In these cases the tabs should be put into a container that can hold all tabs, without them overlapping, which overflows screen right. Users can then scroll content, with the overflow itself acting as a visual signifier that the content is scrollable.

Single choice option

Only one tab can be selected (shown by underline) at a time

### Component Variants

Number Of Tabs

Size Of Tabs

Variant Of Tabs

Divider

### Colour Schemes

The accordion works across all colour schemes

White

Tab One
Tab Two
Tab Three
Tab Four
Tab Five
Black

Tab One
Tab Two
Tab Three
Tab Four
Tab Five
Magenta

Tab One
Tab Two
Tab Three
Tab Four
Tab Five
Secondary

Tab One
Tab Two
Tab Three
Tab Four
Tab Five
### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Ensure all tabs have clear, descriptive text labels that accurately convey the destination or section they control. Avoid ambiguous labels.
Ensure the tabs do not become overly condensed on smaller screens. When space is limited, allow for horizontal scrolling or a collapsible overflow mechanism while maintaining visibility of the active tab.
Avoid automatic tab changes (e.g., on hover). Always require explicit activation to change content, preventing disorientation for cognitive and screen-reader users.
Keyboard navigation must follow the ARIA Tabs Pattern: Left/Right arrows: move focus between tabs. Enter or Space: activate the focused tab.
If tabs overflow, arrow buttons or scroll area should be keyboard-focusable and screen readers should announce overflow navigation controls correctly.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTabs` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSTabs } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTabs } from "@telekom-ods/react-ui-kit/ODSTabs";

<ODSTabs fallbackMessage="Error! This tab has no children!" size="small" variant="fill" divider={false} />
```

Static HTML: download **Tabs.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
