# TextField

A text field allows users to enter a single line of text.

- **ODS name:** `ODSTextField`
- **Storybook:** Components/Text Field/Text Field
- **Stories:** Example, Controlled, Masked Date, Right Icon Only, Credit Card, Text Prefix, Phone Number, Email, Password, Url

## Example (story args)

```tsx
<ODSTextField
    labelText="label"
    value={value} // handle the value from here
    defaultValue={'Init value'} // handle the defaultValue from here
    inputProps={{ onChange: (e) => setValue(e.target.value) }} // handle the change event from here
/>
Copy
```

```tsx
<ODSTextField
    labelText="label"
    value={value} // handle the value from here
    defaultValue={'Init value'} // handle the defaultValue from here
    inputProps={{ onChange: (e) => setValue(e.target.value) }} // handle the change event from here
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | "small" \| "large" | "large" | Set the size of the textfield. |
| `mode` | "error" \| "standard" \| "informative" | "standard" |  |
| `required` | boolean | false |  |
| `showAsterisk` | boolean | – |  |
| `disabled` | boolean | false | Whether the input is disabled. Disables interaction and applies a disabled style. |
| `readonly` | boolean | false | Whether the input is read-only. Prevents changes but allows focus and text selection. |
| `placeholderText` | string | – | Placeholder text displayed inside the input when it's empty. |
| `showCounter` | boolean | false |  |
| `leftIconValue` | ReactNode | – | The left icon. |
| `prefixText` | string | – | The prefix text for the input value, typically used for currency symbols. |
| `suffixText` | string | – | The suffix text for the input value, typically used for units of measure. |
| `labelText` * | string | – | The label of the input field. |
| `supportMessageProps` | ODSSupportMessageProps | – | Props for displaying support messages such as helper text. |
| `showRightIcon` | boolean | false |  |
| `textFieldIconProps` | ODSTextFieldIconProps | – | Additional props to customize the right side icon used inside the TextField. |
| `inputProps` | Props to apply directly to the underlying <input> element. value and defaultValue are excluded. \| <input> \| value \| defaultValue | – | Omit<ODSComponentPropsWithRef<"input">, "defaultValue" \| "value"> |

> The component previously known as ODSTextField has been deprecated and renamed to ODSTextFieldDeprecated. A new, improved version of ODSTextField has been introduced with updated APIs and consistent styling with the latest ODS design guidelines. The TextField component has been upgraded to follow the latest ODS design and API standards. The previous API is now deprecated and will be removed in an upcoming release. To ensure compatibility and benefit from new features, please migrate your usage to the new API.

## Guidelines (from the ODS docs page)

### General

A text field allows users to enter a single line of text.

When to use:

Use input fields when users should enter information like:

Email addresses
Passwords
Phone numbers
Date, month, week and time
Any other kind of information as free text
When not to use:

Don't use a text field when users need to:

search for something (here use the search component) or
enter more than one line of input (use a text area instead).

### Anatomy

### Use Directives

How designers should use the component

Type

Option explanations

The text field component has a lot of options. Here’s a guide to what they can be used for.

Best practices

Declare text fields for specific data formats accordingly (e.g., for types like text, number, email, or password).
Group text fields that are related to the same topic.
Arrange input fields in a single-column layout to not disturb the user's editing flow. Exceptions are logically related fields like postal code and city.
Mark mandatory inputs and reduce optional inputs as much as possible.
Explain all input requirements, for example for passwords or credit card numbers.
Dos and don’ts

Label overflow

Keep labels concise and scannable. They should not be so long they don’t fit inside the text field.

Behaviours

How the component will behave in a live environment

Input overflow

If the content is too long for the single line of a text input, then the user can horizontally scroll inside the field either by scrolling or moving the cursor.

### Component Variants

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

  
Magenta

This component can only be used on neutral colour schemes

  
Secondary

This component can only be used on neutral colour schemes

  
### Examples

Add new address form

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

-Make labels for the field and support messages short and specific, include format information in the labels. -Provide clear error messages (see Support Messages). -A disabled text field must not have a support message, and its label should not convey any crucial information needed to understand the context.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

TextFields and Labels are associated with each other using the for attribute.
Known A11y issue in Mobile android app: the textfield has to be activated twice to be edited.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTextField` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
