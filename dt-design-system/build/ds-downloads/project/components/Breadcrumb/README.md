# Breadcrumb

A breadcrumb serves as a secondary navigation element, enhancing user orientation within the information architecture and enabling user navigation. A breadcrumb reflects the information hierarchy of your product or service. The first entry is typically the site's homepage; the last entry is the current page.

- **ODS name:** `ODSBreadcrumb`
- **Storybook:** Components/Breadcrumb
- **Stories:** Example, Two Levels, Three Levels, Four Levels, Five Levels, Six Plus Levels

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` * | ODSBreadcrumbMenuItemProps[] | – | The breadcrumb items. |
| `showMoreLabel` | string | "Show more paths" | aria-label for show more dots (a11y) |
| `getOverflowAriaLabel` | ODSBreadcrumbOverflowLabelFormatter | func | Builds the overflow trigger aria-label from hidden count. |
| `getItemAriaLabel` | ODSBreadcrumbItemLabelFormatter | func | Builds the accessible name for every breadcrumb item (visible and hidden), carrying its position within the full trail (e.g. "Level 3, breadcrumb 3 of 6"). This is how screen readers announce the correct count/position given the component's flex layout removes native list semantics. |

## Guidelines (from the ODS docs page)

### General

A breadcrumb serves as a secondary navigation element, enhancing user orientation within the information architecture and enabling user navigation. A breadcrumb reflects the information hierarchy of your product or service. The first entry is typically the site's homepage; the last entry is the current page.

When to use:

Use a breadcrumb particularly for complex products or services with three or more levels of navigation. Always use breadcrumbs on all the pages of a website.

When not to use:

If your product or service has a flat architecture with only one or two levels of hierarchy, a breadcrumb will not necessarily enhance the user experience. Never use it as a replacement for the primary navigation.

### Anatomy

This section serves to show, in image form, the parts of the component, whether labels, icons, borders and even other components that are part of the whole.

### Use Directives

Length and menu principles

Length of breadcrumb path

The user can choose the number of breadcrumb levels to show. The user can resort to the overflow item whenever it’s needed in order to fit the content to the viewport.

Overflow menu

When there are more than 4 levels of the breadcrumb path or when the text is too long, then an overflow menu is used to accomodate for the overall length of the path. The overflow menu is represented by the use of three dots (indicating a truncation) on hover the user can then select their intended level.

Content wrapping

Hug and Fill

By default the component comes with the hug wrapping set to its items, except for the current page, which is always set to fill. The user can modify the items to fill. The moment they do this, they also have to adjust the autolayout to fill.

Labelling

Current page

The current page is the last item in the breadcrumb trail, this last item should not be a link. The breadcrumbs show current location within the hierarchical structure of the website, not the history of the user's session. The level labelling match the path trail of the clicked menu labels / links.

First page

Level 1 can be shown when there’s available space in the viewport. This should also be linked.

Size and spacing

Width

For the sake of readability, the breadcrumb width should not exceed more than half of the page.

Mobile

Mobile is set to display max three levels.

Dos and don’ts

One single breadcrumb trail

Only use one breadcrumb trail, not multiple.

Left aligned

Breadcrumbs are left-align to simplify scanning. This is the natural reading flow, making it intuitive and easy to read for users.

Use only when hierarchical navigation is possible

Do not use a breadcrumb if the navigation’s hierarchy contains only one level.

Don't use icons in breadcrumb labels

Breadcrumbs should only contain text, not icons.

Behaviours

Truncation

When you navigate to the fifth level of a website, the breadcrumb trail will truncate to display only the pages that fit into the viewport. By clicking on the truncate breadcrumbs, you can unveil and access the other pages.

Actionable

All elements are clickable, except the last level, Current page, and and the separators.

### Colour Schemes

Light mode

Dark mode

Magenta

Secondary

### Examples

Desktop Light mode

Desktop Dark mode

Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Each page link in the breadcrumb is reached by Tab and activated by Enter.
The current page, if listed in the breadcrumb, is not a link.
If the breadcrumb is truncated, the ellipsis button for the overflow menu is in the tab order.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Wrap the breadcrumb in a HTML nav tag with an aria label. E.g: <nav aria-label="Breadcrumb"> tag.
Visual separators don't need to be text or navigable.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSBreadcrumb` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSBreadcrumb } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBreadcrumb } from "@telekom-ods/react-ui-kit/ODSBreadcrumb";

<ODSBreadcrumb showMoreLabel="Show more paths" getOverflowAriaLabel={func} getItemAriaLabel={func} />
```

Static HTML: download **Breadcrumb.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
