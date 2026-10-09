# Dialog

Dialogs require immediate attention and interrupt the user's workflow. They appear whenever the user needs information or has to make a decision to complete a task.

- **ODS name:** `ODSDialog`
- **Storybook:** Components/Dialog
- **Stories:** Side By Side Actions, Side By Side Fill Actions, Stacked Actions, No Actions, Content Slot With Image, Content Slot With Text Area, Custom Slot, Long Text Scroll, With Form Elements, Dialog Close

## Example (story args)

```tsx
type ODSDialogProps = {
  /** The initial value for the open state. */
  defaultOpen?: boolean;
  /** Whether the dialog is open or not. Use together with `onOpenChange`. */
  open?: boolean;
  /** Fires when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Callback when dialog is closed (with trigger) */
  onClose?: (
    trigger: "closeButton" | "backdropClick" | "keyboardEscape" | "unknown"
  ) => void;
  /** Whether clicking the backdrop should close the dialog */
  dismissOnBackdropClick?: boolean;
  /** Trigger and content. */
  children: ReactNode;
};
Copy
```

```tsx
type ODSDialogProps = {
  /** The initial value for the open state. */
  defaultOpen?: boolean;
  /** Whether the dialog is open or not. Use together with `onOpenChange`. */
  open?: boolean;
  /** Fires when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Callback when dialog is closed (with trigger) */
  onClose?: (
    trigger: "closeButton" | "backdropClick" | "keyboardEscape" | "unknown"
  ) => void;
  /** Whether clicking the backdrop should close the dialog */
  dismissOnBackdropClick?: boolean;
  /** Trigger and content. */
  children: ReactNode;
};
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | string | – | Used to define variant of actionSlot inside ODSDialogSheetPreferredActions |
| `mainActionProps` | object | – | Used on mainAction inside ODSDialogSheetPreferredActions |
| `secondaryActionProps` | object | – | Used on secondaryAction inside ODSDialogSheetPreferredActions |
| `tertiaryActionProps` | object | – | Used on tertiaryAction inside ODSDialogSheetPreferredActions |
| `headerText` * | string | – | Heading for the dialog. |
| `headingElement` | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" | "h2" | the heading element that will be used for the Dialog Title. |
| `contentSlot` | ReactNode | – |  |
| `actionSlot` | ReactNode | – | The dialog buttons action slot. |
| `showCloseButton` | boolean | true | Whether the close button is displayed. |
| `closeButtonLabel` | string | "Close dialog" | Label for the close button for assistive technologies. |
| `closeButtonProps` | Omit<ODSButtonProps, "className" \| "size" \| "buttonIcon" \| "buttonType" \| "variant"> | – | Props for the close button (accessibility and behavior only, style is managed internally) |
| `showTitle` | boolean | true |  |
| `stickyButton` | boolean | true | Whether the action slot should be sticky |
| `bodyText` | ReactNode | – |  |
| `dismissOnBackdropClick` | boolean | – |  |
| `actionsLayout` | "sideBySide" \| "stacked" | sideBySide |  |
| `onClose` | - | – | Callback when dialog is closed (provides the close trigger) |

## Guidelines (from the ODS docs page)

### General

Dialogs require immediate attention and interrupt the user's workflow. They appear whenever the user needs information or has to make a decision to complete a task.

We distinguish between modal and non-modal dialogues.

A modal dialog requires the users to interact with it before they can return to the parent content. It creates a strong focus on the task at hand, ensuring that users complete the required action before proceeding.

A non-modal dialog allows the user to interact with other parts of the content while the dialog is open. It provides flexibility and is less intrusive.

When to use a modal dialog:

Critical decisions or actions:
Confirmation dialogs: For actions that could have significant consequences (e.g., deleting data), a modal ensures the user intentionally confirms their choice.
Warnings or alerts: When you need to make sure the user reads and acknowledges important information.
Focused task completion:
Form submissions or settings changes: When the user needs to complete a specific task, such as filling out a form, without distraction.
Authentication or permissions: When requesting credentials or permissions, ensuring the user focuses on completing the authentication process.
Simplifying a complex task:
Wizards or multi-step processes: Modal dialogs are useful for guiding users through a series of steps where it’s important they complete each one in order.
When not to use a non-modal dialog:

Browsing and Navigation
Viewing Details: Use expandable sections or sidebars instead of modals for viewing additional information (e.g., product specs). This approach allows users to access details without interrupting their browsing experience.
Continuous Interaction:
Editing Content: Implement non-modal toolbars or panels for tasks like text formatting, enabling users to make changes seamlessly while staying focused on their primary task.
Multitasking
Notifications: Display non-critical notifications or messages (e.g., chat popups or tooltips) in non-modal formats, allowing users to continue their work without interruption.

### Use Directives

How designers should use the component

Modal and non-modal dialog examples

Modal Dialog

Modal Dialogs are interface elements that demand the user's full attention and interaction before they can continue with the main content. They typically block access to the rest of the page or application until an action (like confirmation or dismissal) is taken within the modal.

Example: User Sign-Up Confirmation

Action: After a user fills in a sign-up form and hits "Submit," a modal dialogue appears.
Why Modal? The action is crucial as it confirms account creation, and the user needs to acknowledge it before continuing.

Non-modal Dialog

Non-Modal Dialogs are interface elements that allow the user to continue interacting with the main content while the dialogue remains open. They do not block interaction with other parts of the application, enabling multitasking or parallel actions.

Example: User is typing in a search bar

Action: As the user types, a non-modal dialogue dropdown appears below the search bar, showing suggestions or autocomplete options related to the input.
Why Non-Modal? It allows the user to continue typing or select a suggestion without blocking interaction with the rest of the page.

Slot component principles

Default slot component

The slot component allows the user to create bespoke elements to live inside the dialog component.

Dialog preferred content

There has been two sub component ‘Dialog preferred content’ options already set up for the user to swap the slot component for. These will help the user create dialogs for a variety of use cases. The first type is the ‘General with image’, this allows the user to insert an image with supporting text within the dialog. When using this slot option be sure to turn off the text section on the parent component.

 
The second type is the ‘Text area input’, this allows the user to insert a text area form field with content.

Slot hidden

The slot component can also be hidden to just show the heading label, body content and action buttons.

Component variations

Close icon hidden

A modal that cannot be closed by the user.

Scroll bar visible

For dialog’s that have a large amount of content then you can use a scrollbar.

Text section hidden

For simple dialog’s where only the title is needed you can hide the text section.

Action container hidden

The whole action container can be hidden, removing all buttons.

Fadeout boolean

The text section of the component has a max height of 300px, this is to prevent the component becoming too long and helps this users cognitive flow. When the 300px limit has hit the use then must activate the fadeout boolean. The content should visibly fade at the end of the modal body area to indicate there is additional content out of view.

### Size

Desktop

For web, dialogs can be 4, 6, 8, or 12 columns, respectively. Select the modal size that best fits the amount of content for your use case. The modal width is set to match that of the viewport columns, meaning that it will re-size responsively depending on the viewport size of the parent frame.

  
Action slot

Number of buttons on display

The user has the option of showing 1, 2 or 3 buttons at any given time depending on then dialog use case.

Action slot set to hug or fill

The buttons in the action slot can either be set to hug or fill depending on the dialog size and use case. For larger dialogs then use the hug variant. For smaller viewports where there is limited space then use the fill variant, ensuring visual consistency.

Best practices

Dialog best practices

Clearly describe the confirmed action and explain the potential consequences.
Both title and button should indicate which action will occur.
Never use a primary button if the action is destructive or irreversible.
### Component Variants

Behaviours

How the component will behave in a live environment

Background overlay for modal dialog

A dim background is used for modal dialogues to focus the user's attention, signaling that immediate action is needed before continuing. It visually separates the modal from the rest of the interface, ensuring critical interactions are not missed.

Remove overlay for non-modal dialogue

Background dimming is typically removed for non-modal dialogs because the purpose of non-modal dialogs is to allow the user to interact with both the dialog and the rest of the interface simultaneously. Dimming the background would suggest that the user needs to focus exclusively on the dialog.

### Colour Schemes

How it works (or is restricted) across colour schemes

White

Black

Magenta

Secondary

### Examples

Tabs example

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Organise dialog content logically, prioritising the most important information at the top.
Dialogs take focus on appearance, and the tab order is constrained to the modal’s controls until the modal is closed by choosing one of the buttons with Enter or Space, or is dismissed by pressing Esc.
The tab order should proceed left (tab) and right (shift+tab) as usual.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Set focus on the first interactive element (e.g., close button) when the dialog opens.
Return focus to the triggering element when the dialog closes.
When the dialog is opened, its context should be announced to the user by screenreaders.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSDialog` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
