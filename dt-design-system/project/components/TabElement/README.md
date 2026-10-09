# TabElement

When a tab is selected, the typography color changes to Magenta, and a visual marker—a line—is placed underneath to highlight the selected page.

- **ODS name:** `ODSTabElement`
- **Storybook:** Components/Tabs/Tab Element
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | "small" \| "large" | "small" | The size of the tab element. Can be "small" or "large". The default value is small |
| `variant` | "fill" \| "hug" | "hug" | The variant of the tab element. Can be "hug" or "fill". The default value is fill |
| `selected` | boolean | false | Indicates whether the tab element is selected. The default value is false. |
| `label` | string | – |  |
| `text` | string | – | The label text of the tab element. |
| `index` | number | 0 | The index of the tab element. |
| `icon` | ReactNode | – | The icon name to be displayed in the tab element. |
| `badge` | ReactNode | false | The badge to be displayed in the tab element. |

## Guidelines (from the ODS docs page)

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
States

Icons and Labels

Badge

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

No further design and development considerations required.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTabElement` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
