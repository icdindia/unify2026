# CheckboxGroup

Checkbox Group is a grouping of checkboxes. It enables users to toggle options on or off, providing a straightforward method for answering yes-no questions and selecting one or more options from multiple choices.

- **ODS name:** `ODSCheckboxGroup`
- **Storybook:** Components/Checkbox/Checkbox Group
- **Stories:** Example, With Support Message, Mixed Readonly Disabled, Controlled

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checkboxProps` | Omit<ODSCheckboxProps, "aria-checked" \| "onChange" \| "size" \| "checked" \| "indeterminate" \| "disabled" \| "readonly" \| "mode"> | – | The Checkbox props. If the type is standard, this property will be ignored. |
| `size` | "small" \| "large" | "large" | the size of the checkbox |
| `disabled` | boolean | – |  |
| `readonly` | boolean | – |  |
| `titleText` | string | – | Additional titleText - if needed |
| `type` | "standard" \| "nested" | "standard" | it is either a standard type or a nested type, which means that the Checkbox Group has a parent element |
| `supportMessageProps` | ODSSupportMessageProps | – | the support message of checkbox group |
| `value` | string[] | – | Controlled: ids of the checked checkboxes |
| `onChildCheckboxChange` | ((event: ODSCheckboxGroupChangeEvent) => void) | – | Change handler for the Checkboxes |

## Guidelines (from the ODS docs page)

### General

Checkbox Group is a grouping of checkboxes. It enables users to toggle options on or off, providing a straightforward method for answering yes-no questions and selecting one or more options from multiple choices.

Building on the simplicity of individual checkboxes, a checkbox group enables users to select multiple options from a list of choices. This component supports hierarchical structures, allowing primary options to expand into secondary lists of checkboxes, providing a flexible way to manage complex selections.

When to use :

Use the Checkbox Group to allow users to select one or more options from a list, like filtering items in a shop or choosing settings.

Nested: Options are grouped under a parent checkbox, making it ideal when many users are likely to select all options. Checkbox documentation

When not to use :

For mutually exclusive choices, use the Radio Button Group.

If only one checkbox is needed, use the Checkbox component.

### Anatomy

Property Table

### Use Directives

How designers should use the component

Types

Default

The default variant is a group of checkboxes. Activating a checkbox does not affect other selections. It is considered to be selected when the control box has a checkmark.

Nested groups

When the parent checkbox is checked, all child checkboxes are checked. If a parent checkbox is unchecked, all child checkboxes are unchecked.

When some child checkboxes are selected, the parent checkbox shows an indeterminate state. Selecting the parent checkbox checks all child items, while deselecting it unchecks them all.

Sizes

Large and small

The Checkbox Group comes in two sizes, which should be chosen based on the size of the surrounding content. For Breakpoint S always use the small size.

Title and Labels

Title

A title is optional and unnecessary if surrounding content already explains the checkbox group's purpose and details.

Labels

Make sure the user can quickly scan the labels of the checkbox.

Support Message

Additional context

Display the Support Message component when additional context or user feedback is needed, such as for required checkbox groups.

List items

List container

The Checkbox Group's list container typically include 2-5 items. While 2-5 checkboxes are advised, more can be added if needed.

Behaviours

How the component will behave in a live environment.

Support messages

Required input

Checkbox groups can be optional or required. For required checkbox groups you can use the asterisk (*) in the Title.

Error Message

When a selection in a required group is missing, show the error message. The message refers to the group and is shown below the list container.

Selection states

Interactive labels

Users are able to select either the text label or the checkbox to select an option.

Selected, unselected & indeterminated

The parent checkbox has three states: selected, unselected and indeterminate. The child checkbox has two states: selected and unselected.

Nested groups

Parenting

When the parent checkbox is checked, all child checkboxes are checked. If a parent checkbox is uncheced, all child checkboxes are unchecked.

When some child checkboxes are selected, the parent checkbox shows an indeterminate state. Selecting the parent checkbox checks all child itmes, while deselecting it unchecks them all.

Dos and don'types

Indeterminate

The indeterminate state is only for parent checkboxes in nested checkbox groups.

Group Support Message

A support message should apply only to a checkbox group, as it refers to the entire group rather than individual checkboxes.

### Component Variants

Standard Large

Support Message Informative Large

Support Message Error Large

Standard Small

Support Message Informative Small

Support Message Error Small

### Colour Schemes

How it works (or is restricted) across colour schemes

White

Black

Magenta

This scheme is restricted. Checkbox Group component can only be used on neutral, white and black colour schemes.

Secondary

This scheme is restricted. Checkbox Group component can only be used on neutral, white and black colour schemes.

### Examples

Web Desktop

Web Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

A disabled checkbox must not have a support message, and its label should not convey any crucial information needed to understand the context.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSCheckboxGroup` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
