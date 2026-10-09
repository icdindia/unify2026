# SideNavigation

When surfacing a large amount of related content, destinations, or account functionality (such as profiles, dashboards, saved content, documents, or calendars) that would be difficult to access efficiently through primary navigation alone.

- **ODS name:** `ODSSideNavigation`
- **Storybook:** Components/Side Navigation/Side Navigation
- **Stories:** Example, Without Icons, Example · expanded, Without Icons · expanded

## Example (story args)

```tsx
{
  render: () => {
    const items: ODSSideNavigationItemProps[] = [{
      icon: <ODSHome />,
      label: "Dashboard"
    }, {
      icon: <ODSSearch />,
      label: "Search",
      showBadge: true
    }, {
      icon: <ODSCalendar />,
      label: "Calendar"
    }, {
      icon: <ODSUser />,
      label: "Team",
      flyoutProps: {
        showTitle: false
      },
      items: [{
        label: "Members"
      }, {
        label: "Roles",
        locked: true
      }, {
        label: "Invitations",
        showBadge: true
      }]
    }, {
      icon: <ODSSettings />,
      label: "Settings",
      locked: true,
      items: [{
        label: "Profile"
      }, {
        label: "Security"
      }, {
        label: "Notifications"
      }]
    }, {
      icon: <ODSHelp />,
      label: "Help",
      loading: true,
      items: [{
        label: "About us"
      }, {
        label: "Contact"
      }, {
        label: "Support"
      }]
    }];
    return <ODSSideNavigation items={items} bottomActionSlot={<BottomAction />} bottomLeftSlot={<BottomLeft />} onItemClicked={(itemIndex, subItemIndex) => {
      console.log(`Clicked item ${itemIndex}` + (subItemIndex !== null ? `, subitem ${subItemIndex}` : ""));
    }} />;
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `showBottomBar` | boolean | true | Whether to show the bottom bar containing the bottomLeftSlot and bottomActionSlot. |
| `headerSlot` | ReactNode \| ReactNode[] | – | The content to display in the header area of the side navigation. |
| `bottomLeftSlot` | ReactNode \| ReactNode[] | – | The content to display in the bottom left area of the side navigation. |
| `bottomActionSlot` | ReactNode \| ReactNode[] | – | The content to display in the bottom action area of the side navigation. |
| `expanded` | boolean | – | Whether the side navigation is expanded or collapsed. |
| `defaultExpanded` | boolean | – | Sets the state of the SideNavigation upon initialization |
| `navigationLeftIcon` | ReactNode | <ODSNavigationLeft /> | The icon to use for the navigation toggle button. |
| `menuIcon` | ReactNode | <ODSMenu /> | The icon to use for the menu button in collapsed mode. |
| `items` | ODSSideNavigationItemProps[] | – | The list of items to display in the side navigation. Each item can optionally have a list of subitems. |
| `navigationLeftIconButtonProps` | ODSButtonProps | – | Props to spread onto the navigation toggle button (shown when expanded). |
| `menuIconButtonProps` | ODSButtonProps | – | Props to spread onto the menu button (shown when collapsed). |
| `onExpandedChanged` | ((expanded: boolean) => void) | – | Callback that returns the new expanded state when the navigation is toggled. |
| `onItemClicked` | ((itemIndex: number, subItemIndex: number \| null) => void) | – | Callback that returns the index of the item that was clicked. subItemIndex is null if the item is a leaf. |

## Guidelines (from the ODS docs page)

When to use

When surfacing a large amount of related content, destinations, or account functionality (such as profiles, dashboards, saved content, documents, or calendars) that would be difficult to access efficiently through primary navigation alone.
When content belongs to the same domain and hierarchical level, items are clearly distinguishable, and user actions are not mixed with read-only content where possible.
When not to use

As an overspill for primary navigation
For additional content that does not neatly fit categorisation
When reverse orientation can be achieved with breadcrumbs

### Anatomy

 
### Use Directives

Set up

Height

The Side Navigation is set to Fill, so it fills the height of the container it is placed in.

Due to a known Figma issue, the Fill value may need to be reset after moving the component to a new container.

Width

Collapsed

The width is fixed and determined by the component.
Expanded

The Side Navigation fills 100% of its container width. Products define the container width according to their layout needs.
There is no prescribed grid-column width or default expanded width. Products may define their own widths.
Regarding width, the Storybook example is also illustrative.
At XXL viewports, it’s not specified whether the Side Navigation sits inside or outside the grid, both is acceptable. Its placement and container width are determined by the product layout.

 
Format

The component provides four configurable slots — Header Slot at the top, Bottom Left Slot (typically avatar or status), and Bottom Action Slot (typically sign-out or primary action).

Each slot has its own boolean toggle to show or hide it:

Show Header Slot
Show Left Slot (for Bottom Left)
Show Action Slot (for Bottom Action)
Show Bottom Bar (hides the entire bottom region in one switch)
Each slot accepts any instance, you can use ODS or custom product level instances — choose the component that matches your design needs

Scrollable

Add a scroll bar only when the content exceeds the Scroll Container height. Do not show a scroll bar when all items fit within the container.

The scroll bar should appear only in the relevant state and not when the Side Navigation is collapsed.See the Do's and Don'ts section for details.

Label items and Subitems

Label your items to represent the content or functions they represent.

Keep labels short, descriptive, and literal. The labels should all be of roughly the same length whenever possible.

There are details guidelines for labeling in the 'Do Maintain Information Hierarchy Standards', in the Do's and Dont's section on the Use Directives page of this document.

Collapsed state

When the side navigation is collapsed, items render as icon-only but remain fully interactive. Parent items automatically display a small right-side indicator to mark that they contain children.

Set the NavExpanded property on items to match the parent nav's state — when Expanded=False on the parent, NavExpanded should be False on all items.

Flyout

Each Parent item with children needs an associated Flyout List Container that opens on hover or keyboard focus when the nav is collapsed.

Place the Flyout List Container instance next to the relevant item. Set its Title to match the parent item's label. The container holds the same subitems shown in the expanded state.

Dos and Don’ts

Do maintain Information Hierarchy Standards

Labels of a set should be of comparable length (letters and words) and level of hierarchy. For example: Apples > Pears > Oranges - equal level of hierarchy Braeburn > Pears > Oranges - inequal level of hierarchy

Labels of a set should be items of the same single group. For example: Apples > Pears > Oranges - single group Cars > Trucks > Running shoes - multiple groups

Labels should group locations or functions, but not mix the two: For example: Mobile > Internet > TV - three locations Profile > Services > Bills - three function Profile > Mobile > Internet - one function and two locations

Use the side navigation as an addition to, rather than replacement of, the primary navigation, tabs, and breadcrumbs

The side navigation is an option to defer to when other navigation options are not available or not well suited to the specific data set.

For example:

a group of inter-related pages that sit within a specific sub-domain of the website, and don’t belong in other navigation structures
additional or unrelated functional content such as account management
The component is not designed to replace the primary site navigation, tabs, or breadcrumb component. These serve specific purposes, are easily recognised, and have intuitively associated interaction patterns.

 
Do use the side navigation for small groups of inter-related content

Use the side navigation for webs of interrelated items under the same domain, of the same hierarchy, that don’t need to be discoverable from the main navigation.

Try to keep the items contained: if any element takes the user to a location where the side navigation doesn’t already exist it either:

makes traveling backward difficult or
means the side navigation has to be added to single pages in other domains, breaking their visual consistency.
Avoid using the side navigation for unrelated miscellaneous items, they will not be intuitive to find and their discoverability will decrease.

Fix broken Side Navigation by checking the NavExpanded property

If the Side Navigation component appears broken, check the NavExpanded property on the .ODS Side Navigation Item subcomponent. This property should only be set to True (or On) when the main Side Navigation component is in its expanded state. When the main component is collapsed (narrow version, in this example), NavExpanded must be False (or Off).

Incorrect values can cause the navigation to display or behave incorrectly.

Add icons

Only level-one navigation items can use an icon. If icons are used, they must be applied consistently across all list items — you cannot mix iconed and non-iconed items. They should be clear enough to aid understanding without relying on the label, and not merely decorative; if an icon adds nothing, leave it out.

When the navigation supports a collapsed state, icons are required on every item, since the collapsed nav renders icon-only and an item without one would appear blank.

 
Don't put deep hierarchies in the flyout

The flyout is single-level — it shows a Parent's direct children, nothing more. If your information architecture requires deeper nesting, restructure the content so it fits in one level.

Behaviour

Design your information hierarchy

Use the variants of list items to represent your information architecture.

How many items are there in total? Do any of the items need to be collapsible? For any collapsible items, how many Subitems do they need? Do the items have an implicit hierarchy? Will the navigation be used in a collapsed state? Is there any data on which are used the most?

When choosing labels, aim for them to be short, descriptive, and of equal length wherever possible.

### States

The active state and all interactive states (except deactivated) will be prompted by user action in prototype mode and do not need to be set manually unless required.

Please note that all content is for example only.

Collapsed items

When the nav is collapsed, items stay clickable and navigate as usual. Hovering or focusing a parent item opens a flyout with its children. The flyout closes on mouse leave or when the user presses Escape.

Loading

Use the List's Loading variant when subitems are loaded asynchronously. This state preserves the layout until the content is available.

Locked items

Use the Locked variant for items the user cannot currently access, such as features that need an upgrade or specific permissions. Locked items display a lock icon and cannot be selected.

Behaviour — Note

You may notice a slight shift between the Expanded (True) and Collapsed (False) variants. This is caused by the inner stroke applied to the navigation container, which is required for the component's visual definition. Because the stroke is drawn inside the bounds, it reduces the available inner content area by roughly 1px, producing minor misalignment between the two states. This is a Figma-only rendering artifact it does not affect the coded component and will not appear in production.

### Component Variants

ODS Side Navigation

Expanded

Scrollable

Show Header Slot

Show Bottom Bar

Show Left Slot

Show Action Slot

ODS Side Navigation Item

State

Parent

Expanded

NavExpanded

Active

Show Icon

Show Badge

Locked

ODS Side Navigation Subitem

State

Active

Show Badge

Locked

Color Schemes

### Behavior on Color Schemes

The usage of this component is restricted – it can only be used on Neutrals.

White

Black

Magenta (Restricted)

This scheme is restricted. The component can only be used on Neutral colour schemes.

Secondary (Restricted)

This scheme is restricted. The component can only be used on Neutral colour schemes.

### Examples

XXL Large Desktop

Please note all content is example only.

XL Desktop

L Laptop

M Tablet

S Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 A and AA standards.  

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios. 

Design considerations

Provide short and meaningful labels for menu items.
When the user expands or collapses the menu, focus should not be trapped.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

The side navigation container has to be focusable (tabindex="0" or tabindex="-1" with programmatic focus).
It should allow keyboard scrolling via Arrow Down/Up or PageDown/PageUp.
Contextual information such as locked state, expandable sections, or badges with notifications should also be programmatically exposed to ensure screen reader users receive the same cues and context.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSSideNavigation` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSideNavigation } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSideNavigation } from "@telekom-ods/react-ui-kit/ODSSideNavigation";

<ODSSideNavigation showBottomBar={true} navigationLeftIcon={<ODSNavigationLeft />} menuIcon={<ODSMenu />} />
```

Static HTML: download **SideNavigation.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
