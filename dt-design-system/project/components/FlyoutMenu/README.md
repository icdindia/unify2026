# FlyoutMenu

A flyout menu provides users with access to additional navigation or actions in a compact and non-intrusive manner. It exists in a hierarchy of four types and comes with variations in icon placement and sizes.

- **ODS name:** `ODSFlyoutMenu`
- **Storybook:** Components/Flyout Menu
- **Stories:** Example, Submenu, Controlled, Checkbox Item, Icons Helper Text, Disabled, Links

## Example (story args)

```tsx
<ODSFlyoutMenu
  items={[
    {
      id: "Option 1",
      label: "Option 1",
      variant: "standard",
    },
    {
      iconAfter: <ODSSettings />,
      id: "Option 2",
      label: "Option 2",
      variant: "standard",
    },
    {
      disabled: true,
      id: "Option 7",
      label: "Option 7",
      variant: "standard",
    },
    {
      helperText: "Helper text",
      id: "Option 8",
      label: "Option 8",
      variant: "checked",
    },
  ]}
  menuSize="large"
  onOpenChange={() => {}}
  trigger={
    <ODSButton
      buttonIcon={<ODSSettings />}
      buttonType="iconOnly"
      label="Open Menu"
      size="small"
      variant="outline"
    />
  }
/>
Copy
```

```tsx
<ODSFlyoutMenu
  items={[
    {
      id: "Option 1",
      label: "Option 1",
      variant: "standard",
    },
    {
      iconAfter: <ODSSettings />,
      id: "Option 2",
      label: "Option 2",
      variant: "standard",
    },
    {
      disabled: true,
      id: "Option 7",
      label: "Option 7",
      variant: "standard",
    },
    {
      helperText: "Helper text",
      id: "Option 8",
      label: "Option 8",
      variant: "checked",
    },
  ]}
  menuSize="large"
  onOpenChange={() => {}}
  trigger={
    <ODSButton
      buttonIcon={<ODSSettings />}
      buttonType="iconOnly"
      label="Open Menu"
      size="small"
      variant="outline"
    />
  }
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | boolean | false |  |
| `items` | ODSMenuListItemProps[] | – | The content of the flyout menu. |
| `type` | "flyout" \| "header-flyout" | "flyout" | Whether the element will be used in the header or not |
| `loading` | boolean | false | Shows a loading spinner instead of the menu items. |
| `loadingSpinnerProps` | ODSLoadingSpinnerProps | – |  |
| `loop` | boolean | false | Wheather focus should loop with keyboard navigation. |
| `open` | boolean | – |  |
| `defaultOpen` | boolean | false | The initial value for the open state. |
| `onOpenChange` | ((open: boolean) => void) | – | Fires when the open state changes. |
| `menuSize` | "small" \| "large" | large | Size of the Flyout menu, can either be large or small |
| `verticalOffset` | number | 0 | Vertical offset from trigger element. |
| `horizontalOffset` | number | 0 | Horizontal offset from trigger element. |
| `openOnHover` | boolean | false | Determines if flyout will open on trigger element hover. |
| `trigger` | ReactNode | – | Element that will be used as trigger for the flyout to open |
| `className` | - | – | Class that will be added to flyout menu |

## Guidelines (from the ODS docs page)

### General

A flyout menu provides users with access to additional navigation or actions in a compact and non-intrusive manner. It exists in a hierarchy of four types and comes with variations in icon placement and sizes.

When to use:

Use a flyout menu to temporarily display secondary or contextual actions or to navigate between pages within the product.
When not to use:

Avoid using flyout menus on mobile platforms – bottom sheets are recommended in this case.
Avoid using a flyout menu when the content or navigation options are extensive, as it may lead to user frustration or navigation issues.

### Anatomy

API Reference

Notable changes

There are some notable changes in latest version of ODSFlyoutMenu

Trigger element is now passed as prop to <ODSFlyoutMenu>, not as child element
The root trigger element for ODSFlyoutMenu should be the actual trigger element (eg. link, button). The wrapper <ODSFlyoutMenuTrigger> has been removed
(eg. <ODSFlyoutMenu trigger={<ODSButton ... />}>).
For submenu triggers you should still use ODSFlyoutMenuSubTrigger component
(eg.<ODSFlyoutMenuSub trigger={<ODSFlyoutMenuSubTrigger label="Option 2" />}> )
Menu Items should be added as direct children of <ODSFlyoutMenu> or <ODSFlyoutMenuSub>. (<ODSFlyoutMenuContent> and <ODSFlyoutMenuSubContent> wrappers have been removed)
Previous versions

<ODSFlyoutMenu trigger={<ODSButton label="Open Menu" variant="outline" />}>
  <ODSFlyoutMenuContent>
    <ODSFlyoutMenuItem label="Option 1" />
    <ODSFlyoutMenuSub>
      <ODSFlyoutMenuSubTrigger label="Option 2" />
      <ODSFlyoutMenuSubContent>
        <ODSFlyoutMenuItem label="Option 3" />
        <ODSFlyoutMenuItem label="Option 4" />
      </ODSFlyoutMenuSubContent>
    </ODSFlyoutMenuSub>
  </ODSFlyoutMenuContent>
</ODSFlyoutMenu>
Copy
Latest version

<ODSFlyoutMenu trigger={<ODSButton label="Open Menu" variant="outline" />}>
  <ODSFlyoutMenuItem label="Option 1" />
  <ODSFlyoutMenuSub trigger={<ODSFlyoutMenuSubTrigger label="Option 2" />}>
    <ODSFlyoutMenuItem label="Option 3" />
    <ODSFlyoutMenuItem label="Option 4" />
  </ODSFlyoutMenuSub>
</ODSFlyoutMenu>
Copy
### Anatomy

<ODSFlyoutMenu trigger={<MyElement .../>}>
  <ODSFlyoutMenuItem />
  <ODSFlyoutMenuItem />
</ODSFlyoutMenu>
Copy
ODSFlyoutMenu

type ODSFlyoutMenuProps = {
  /** The initial value for the open state. */
  defaultOpen?: boolean;
  /** Whether the sheet is open or not. Use together with `onOpenChange`. */
  open?: boolean;
  /** Fires when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Wheather focus should loop with keyboard navigation. */
  loop?: boolean;
  /** Disables the menu by setting `disabled` on the trigger. */
  disabled?: boolean;
  /** vertical offset from trigger element. */
  verticalOffset?: number;
  /** horizontal offset from trigger element. */
  horizontalOffset?: number;
  /** determines if flyout will open on trigger element hover */
  openOnHover?: boolean;
  /** Element that will be used as trigger for the flyout to open **/
  trigger?: ReactNode;
  /** Size of the Flyout menu, can either be large or small */
  menuSize?: "large" | "small";
  /** Class that will be added to flyout menu **/
  className?: string;
};
Copy
ODSFlyoutMenuItem

type ODSFlyoutMenuItemProps = {
  className?: string;
  /** The label text. */
  label: string;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /**
   * Fires when the item is selected, namely clicked.
   * Calling `event.preventDefault()` will prevent the menu from closing.
   */
  onSelect?: (event: SyntheticEvent) => void;
  /** An alternative text for typeahead. */
  textValue?: string;
  /** A helper text, displayed below the label. */
  helperText?: string;
  /** For an icon prefix. */
  iconBefore?: string | ReactNode;
  /** For an icon suffix. */
  iconAfter?: string | ReactNode;
  /** Size of the Flyout menu, can either be large or small **/
  size?: "large" | "small";
} & Omit<HTMLAttributes<HTMLDivElement>, "size">;
Copy
ODSFlyoutMenuItemLink

Same as ODSFlyoutMenuItem, but renders an <a> element

type ODSFlyoutMenuItemProps = {
  className?: string;
  /** The label text. */
  label: string;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /**
   * Fires when the item is selected, namely clicked.
   * Calling `event.preventDefault()` will prevent the menu from closing.
   */
  onSelect?: (event: SyntheticEvent) => void;
  /** An alternative text for typeahead. */
  textValue?: string;
  /** A helper text, displayed below the label. */
  helperText?: string;
  /** For an icon prefix. */
  iconBefore?: string | ReactNode;
  /** For an icon suffix. */
  iconAfter?: string | ReactNode;
  /** Size of the Flyout menu, can either be large or small **/
  size?: "large" | "small";
} & Omit<HTMLAttributes<HTMLDivElement>, "size">;
Copy
ODSFlyoutMenuCheckboxItem

type ODSFlyoutMenuItemCheckboxProps = {
  className?: string;
  /** The label text. */
  label: string;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /**
   * Fires when the item is selected, namely clicked.
   * Calling `event.preventDefault()` will prevent the menu from closing.
   */
  onSelect?: (event: SyntheticEvent) => void;
  /** Whether the item is checked. */
  checked?: boolean;
  /** Fires when clicked, use to set `checked` (controlled only). */
  onCheckedChange?: (checked: boolean) => void;
  /** An alternative text for typeahead. */
  textValue?: string;
  /** A helper text, displayed below the label. */
  helperText?: string;
  /** For an icon prefix. */
  iconBefore?: string | ReactNode;
};
Copy
ODSFlyoutMenuSub

type ODSFlyoutMenuSubProps = {
  /** Wheather focus should loop with keyboard navigation. */
  loop?: boolean;
};
Copy
ODSFlyoutMenuSubTrigger

type ODSFlyoutMenuSubTriggerProps = {
  /** The label text. */
  label: string;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /** An alternative text for typeahead. */
  textValue?: string;
  /** A helper text, displayed below the label. */
  helperText?: string;
  /** For an icon prefix. */
  iconBefore?: string | ReactNode;
  /** Size of the Flyout menu, can either be large or small **/
  size?: "large" | "small";
  /** Classname applied to container element */
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "size">;
Copy
### Use Directives

Types

Sizes

We offer two sizes for the flyout menu—large and small—to ensure optimal usability and visual balance across various interfaces:

Large Size: Ideal for displaying more detailed content or multiple options, providing users with comprehensive choices and information. Use the large size on larger viewports such as desktop and laptop where there is more space available.

Small Size: Perfect for simpler, less content-heavy interactions, maintaining a clean and organised layout for a streamlined user experience. Use the small size on smaller viewports such as mobile where there is much less space available.

Closed

Closed by default

Expanded

Expanded and first level showing

Expanded and two levels visible

Disabled

Menu expansion principles

Extra expansion

To add another level to the flyout menu, duplicate the Menu List Container.

Move the new container so the left edge aligns with the right edge of the previous container.

Then move it so the top edge aligns with the top edge of the selected option in the previous container.

Nudge the new container 8px to the left so they overlap.

Then select your new menu container and replace the elevation level effect with the next highest level. (e.g. a third level container would have an ‘level-2’ elevation effect.)

Right-aligned menus

Menus can be right-aligned if required. The default direction of the flyout menu is left aligned, if you need the menu levels to be right aligned (to go in the opposite direction) then you will need to detach the flyout component and reposition the menus as so:

Do's and Dont's

Labels should be scannable

Make sure the user can quickly scan the labels of the menu.

Icons on the left

Either none of the options in the flyout menu should have left icons, or all options should have icons.

### Component Variants

### Size

Flyout menu

Subcomponent – menu list container

Subcomponent – menu list item

  
Behaviours

First level interactions

Expand menu container when trigger is clicked. Close menu when a non-cascade element is clicked or the user clicks outside of the menu container.

Second level interactions

Expand a higher level of the flyout when a menu item with cascade is hovered.

Keep the second level expanded when the second level is hovered. Close on hover out.

Short and concise menu labels

Keep the menu labels short and concise.

When the text is too long for one line, an ellipsis is added (…) for overflow content, and accompany with the tooltip component to show the full string of text.

Ideally, designers should avoid having options that are long enough to need truncation.

### Colour Schemes

White

Black

Magenta

Secondary

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Provide clear and concise menu item labels.
Ensure the button to open a flyout menu has a meaningful alt text for screen readers (aria-label) to ensure basic accessibility.
To further enhance accessibility, add a tooltip to benefit keyboard users and provide additional information for sighted users.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

If the flyout menu button opens with an Icon-Only button, ensure:

it has a meaningful alt text for screen readers (aria-label).
if a tooltip is used, ensure that its text matches the alt text (aria-label). Avoid using the title attribute.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSFlyoutMenu` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
