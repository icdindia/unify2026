# Checkbox

With checkboxes, users toggle options on or off. They can answer simple yes-no questions in this way. Furthermore, users can select one or more options from a number of choices.

- **ODS name:** `ODSCheckbox`
- **Storybook:** Components/Checkbox/Checkbox
- **Stories:** Example, Controlled, Uncontrolled

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | string | – |  |
| `defaultChecked` | boolean | – |  |
| `label` | string | – | the label of checkbox |
| `size` | "small" \| "large" | "large" | the size of the checkbox |
| `mode` | "error" \| "standard" \| "informative" | "standard" | the mode of the checkbox. |
| `disabled` | boolean | false |  |
| `readonly` | boolean | false | Sets the checkbox as readonly if true. |
| `supportMessage` | string | – | the support message of checkbox |
| `checked` | boolean | false | A boolean that represents the current state of the element. Use this api to set the checked state when using the component as a controlled component. |
| `indeterminate` | boolean | false | the indeterminate state of checkbox |
| `ariaLabelCheckbox` | string | – | the arial label of checkbox |
| `containerProps` | ODSComponentPropsWithRef<"div"> | – | use this property to assign props to parent container of this component, for example, id or data attributes, etc |
| `supportMessageProps` | ODSSupportMessageProps | – | use this property to assign customized props to support message, such as data attributes |
| `inputProps` | Omit<ODSComponentPropsWithRef<"input">, "checked"> | – | Assign props on the actual input element * |
| `onCheckedChange` | ((event: ChangeEvent<HTMLInputElement, Element>) => void) | – | Checkbox can be used as controlled component, use this api to set the checked state when using component as controlled. |

## Guidelines (from the ODS docs page)

### General

With checkboxes, users toggle options on or off. They can answer simple yes-no questions in this way. Furthermore, users can select one or more options from a number of choices.

A checkbox is a selection control that allows users to choose between two states. It consists of a control box and a corresponding label. Activating a checkbox does not affect other selections. It is considered to be selected when the control box has a checkmark. In the initial state, a checkbox can switch on or off.

When to use :

Single: Use a standalone checkbox for toggling an option on or off, such as agreeing to terms or selecting a preference in a form.

Multiple: Use checkboxes to allow users to select one or more options from a list, like filtering items in a shop or choosing settings.

When not to use :

For mutually exclusive states, use radio buttons instead of checkboxes.

### Anatomy

### Use Directives

Sizes

Large or Small

Checkboxes can have two sizes that should be chosen according to the space available.

Modes

Standard, Informative or Error

If additional user feedback is needed we can show the message component..

Selected

Checkbox deselected

If there is no checkmark, a checkbox is considered to be deselected.

Checkbox selected

If a checkbox has a check mark, it is considered to be selected.

### Dos and don'ts

Label

The label explicitly describes what happens when users select or deselect a checkbox. It should convey two opposite states. Always formulate the label positively to avoid double negatives.

Behaviours

Required input

When checking a box is required, use an asterisk (*) in the text label.

Multiple choice option

Use a checkbox for multi-choice selection. Users can select multiple options in a group.

Information label (optional)

If necessary, you can also provide additional information.

Error

An error message appears if an option is mandatory but not selected, e.g., when it’s required to execute the next steps in the process.

Parenting

When the parent checkbox is checked, all child checkboxes are checked. If a parent checkbox is unchecked, all child checkboxes are unchecked.

If some, but not all, child checkboxes are checked, the parent checkbox becomes an indeterminate checkbox. Selecting an indeterminate checkbox checks all child items.

Labels should be scannable

Make sure the user can quickly scan the labels of the checkbox.

Interactive Labels

Users should be able to select either the text label or the checkbox to select an option.

### Component Variants

Standard Large

Inforamtive Large

Error Large

Standard Small

Inforamtive Small

Error Small

### Colour Schemes

White

  
Black

  
Magenta

This component can only be used on neutral colour schemes

  
Secondary

This component can only be used on neutral colour schemes

  
### Examples

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

The ODS React component `ODSCheckbox` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
