# TextArea

Text Areas enable users to enter free-form text data that has longer, multi-line entries. The Text Area can have basic input validation.

- **ODS name:** `ODSTextArea`
- **Storybook:** Components/Text Area
- **Stories:** Example, Validation On Blur, Long Label Wrap

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | "small" \| "large" | "large" | The size of the Text Area element can be either "small" or "large". |
| `mode` | "error" \| "standard" \| "informative" | "standard" |  |
| `supportMessage` | string | "" |  |
| `containerProps` | DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> | – | use this property to assign props to parent container of this component, for example, id or data attributes, etc |
| `supportMessageProps` | ODSSupportMessageProps | – | use this property to assign customized props to support message, such as data attributes |
| `labelText` * | string | – | The label of the input field. |
| `showAsterisk` | boolean | – |  |
| `showCounter` | boolean | false | Shows a counter in the bottom right if true. Can be clubbed with maxLength. |
| `inputText` | string | – | The controlled value of the textarea |
| `counterLimitMessage` | string | – | optional message that will read out loud by screen readers when the character limit is reached |
| `counterMilestone` | number | – | use this optional property to declare the number of characters required to trigger a specialised message to the screen reader users. When using along with maxLength this value should always be kept less than the maxLength. |
| `counterMilestoneMessage` | string | – | optional message that will read out loud by screen readers when the counterMilestone is reached. |
| `showHandle` | boolean | true | Can be used to show/hide the resize handle, leading to enabling/disabling the resizing of the component. |
| `messageOnFocus` | string | – |  |
| `readOnly` | A boolean that represents the element's readonly attribute, indicating that the user cannot modify the value of the control. \| readonly | false | - |
| `disabled` | A boolean that represents the element's disabled attribute, indicating that the control is not available for interaction. The input values will not be submitted with the form. See also readonly. \| di | false | - |
| `placeholder` | - | – | A string that represents the element's placeholder attribute, containing a hint to the user of what can be entered in the control. The placeholder text must not contain carriage returns or line-feeds. |
| `required` | A boolean that represents the element's required attribute, indicating that the user must fill in a value before submitting a form. \| required | false | - |
| `maxLength` | A number that represents the element's maxlength attribute, containing the maximum number of characters (in Unicode code points) that the value can have. \| maxlength | – | - |

## Guidelines (from the ODS docs page)

### General

Text Areas enable users to enter free-form text data that has longer, multi-line entries. The Text Area can have basic input validation.

When to use:

When users need to input longer, multi-line text entries.
Suitable for capturing detailed explanations, comments, or narratives.
Ideal for scenarios where free-form, unstructured input is required, such as providing feedback or writing descriptions.
When not to use:

When users are expected to provide only short, single-line inputs.
When input validation or formatting requirements are strict and can be effectively enforced with single-line input fields, as text areas may not provide as granular control over input restrictions.
### Anatomy

### Use Directives

How designers should use the component

Type

Filled or empty states

Users have the option of choosing between a filled or empty text area.
Examples are shown below

Not filled
Label
Filled
Label
Mode

Support messages

The text areas can also provide supporting messages to provide more information around its role and usage. Examples shown below.

Standard
Label
Informative
Label
Info Message
Error
Label
Error Message
Disabled and read only variations

Disabled fields indicate that a user does not have permission to edit a field, while a read-only field can indicate that the field is pre-populated with data that cannot be changed

Disabled
Label
Read only
Label
Dos and don’ts

Label overflow

Keep labels concise and scannable. They should not be so long they don’t fit inside the text area.

Behaviours

How the component will behave in a live environment

Scroll

When the amount of text exceeds the text area field then a scroll bar in introduced.

Label
Large

Standard

Support message - Informative

Support message - Error

Small

Standard

Support message - Informative

Support message - Error

### Colour Schemes

How it works (or is restricted) across colour schemes

White

  
Black

  
Magenta and Secondary

This component can only be used on neutral colour schemes

### Examples

Text area as part of a form

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Keep the labels for the Text Area short and concise.
Size the input fields based on the expected amount of user input.
A disabled text area must not have a support message, and its label should not convey any crucial information needed to understand the context.
Numbers should be announced as single numbers by the screenreader (1,5,8,4 and not 1584).
Keyboard navigation: each input field is a Tab stop, as are any preceding/following information icons (which open with Enter/Space and close with Esc)
On focus, users can type directly into the input field. Any existing text in the input is highlighted on focus and will be replaced when the user begins typing.
Users can interact inside text inputs and text areas using standard arrow keys and modifiers (Ctrl for Windows, Option for Mac).
For text field type Password: when a password is hidden, the label for the view icon is Show password, and when the password is visible, the label is Hide password
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Labels should be properly associated with inputs using the for attribute.
Helper text is surfaced to assistive technology through aria-describedby.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTextArea` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
