# DropdownSelect

With a dropdown, users select a single option from a collapsible list of available options.

- **ODS name:** `ODSDropdownSelect`
- **Storybook:** Components/Dropdown Select
- **Stories:** Example, Controlled, Uncontrolled, Custom Icons

## Example (story args)

```tsx
<ODSDropdownSelect
  items={[
    {
      label: "Option 1",
    },
    {
      label: "Option 2",
    },
    {
      label: "Option 3",
    },
    {
      disabled: true,
      label: "Option 4",
    },
  ]}
  label="Label"
  mode="standard"
  onExpandedChange={() => {}}
  onValueChange={() => {}}
  supportMessage="Support message"
  value="Option 1"
/>
Copy
```

```tsx
<ODSDropdownSelect
  items={[
    {
      label: "Option 1",
    },
    {
      label: "Option 2",
    },
    {
      label: "Option 3",
    },
    {
      disabled: true,
      label: "Option 4",
    },
  ]}
  label="Label"
  mode="standard"
  onExpandedChange={() => {}}
  onValueChange={() => {}}
  supportMessage="Support message"
  value="Option 1"
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultValue` | string | – |  |
| `label` * | string | – | The text of the DropdownSelect |
| `size` | "small" \| "large" | "large" | Use this prop to choose the size of the dropdown |
| `disabled` | boolean | false |  |
| `readonly` | boolean | false |  |
| `items` | ODSMenuListItemProps[] | [] | The items of the DropdownSelect. |
| `value` | string | – | The value of the DropdownSelect. This value is used for the controlled case of the DropdownSelect Component, alongside with the onValueChange callback. |
| `mode` | "error" \| "standard" \| "informative" | "standard" | The mode of the DropdownSelect. |
| `supportMessage` | string | – | The support message text. It also controls the visibility of the support message. If the mode is standard, then this property is ignored. |
| `supportMessageProps` | ODSSupportMessageProps | – | The extra props for the SupportMessage Component. |
| `required` | boolean | false | Use this prop to show the asterisk(*) sign along side label. The required behavior needs to be handled. |
| `icon` | ReactNode | – | The icon on the left side of the DropdownSelect text |
| `expanded` | boolean | – | default expanded state for the flyout menu |
| `collapseDownIcon` | ReactNode | <ODSCollapseDown /> | The icon used for the collapsed state (down). |
| `collapseUpIcon` | ReactNode | <ODSCollapseUp /> | The icon element used for the expanded state (up). |
| `labelText` | string | – |  |
| `showAsterisk` | boolean | – |  |
| `onValueChange` | ((selected: { id?: string; value?: string; label?: string \| undefined; }) => void) \| undefined | – | Fires when the selected value changes. |
| `onExpandedChange` | ((expanded: boolean) => void) | – | Fires when the dropdown state changes. |

## Guidelines (from the ODS docs page)

### General

With a dropdown, users select a single option from a collapsible list of available options.

When to use

Use dropdowns to present selectable options in a form or to filter or sort content.

To select options within a form
To select a single option
To filter or sort content
When not to use

Few options: Use radio buttons instead of a dropdown to avoid hiding content from the user

Many choices: An input field with auto-fill is more efficient and time-saving

Several options: Use checkboxes instead of a dropdown
### Anatomy

1. Label

The label clearly indicates what kind of options the dropdown provides.

2. Arrow icon

The direction of the arrow indicates whether the dropdown menu is open or closed.

3. Information (optional)

Additional information can help clarify the content or purpose of a dropdown.

4. Label and value

When a Value from the dropdown is selected, it takes the place of the Label and the Label collapses into a smaller size.

5. Expanded menu

The dropdown menu contains the available options or groups of options.

### Use Directives

How designers should use the component

Support information

Selected

Dropdown contexts

If additional user feedback is needed we can show the message component.

Modes

Labels should be scannable

Make sure the user can quickly scan the labels of the menu.

Dos and dont´s

Don’t add icons to the right on the dropdown menu

The space on the right is reserved to mark which option has been selected.

Icons on the left

Either none of the options in the dropdown menu should have left icons, or all options should have icons.

Behaviours

Interactions

Expand when clicked, close when the user selects an option.

Overflow content

Avoid having multiple lines of text in a dropdown.

If the text is too long for one line, add an ellipsis (…) for overflow content, and accompany with a browser-based tooltip to show the full string of text.

Ideally, designers should avoid having options that are long enough to need truncation.

### Component Variants

Standard

Informative

Error

### Colour Schemes

How it works (or is restricted) across colour schemes

White

Black

Magenta

This component can only be used on neutral colour schemes

Secondary

This component can only be used on neutral colour schemes

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Provide clear and short option label.
A disabled dropdown select must not have a support message, and its label should not convey any crucial information needed to understand the context.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSDropdownSelect` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSDropdownSelect } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDropdownSelect } from "@telekom-ods/react-ui-kit/ODSDropdownSelect";

<ODSDropdownSelect label="DropdownSelect" size="large" disabled={false} readonly={false} items={[]} mode="standard" />
```

Static HTML: download **DropdownSelect.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
