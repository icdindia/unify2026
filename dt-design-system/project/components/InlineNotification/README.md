# InlineNotification

Notifications give users feedback about the status of the system or an action. The three main types are banner, toast and inline notifications.

- **ODS name:** `ODSInlineNotification`
- **Storybook:** Components/Alerts & Notifications/Inline Notification
- **Stories:** Example, Success, Information, Warning, Error

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | – |  |
| `text` | string | – |  |
| `type` | "error" \| "success" \| "warning" \| "information" | – |  |
| `mode` | "error" \| "success" \| "informative" \| "warning" | – | contains the mode of the Component and controls the icon. The default value is informative. |
| `errorIcon` | ReactNode | – |  |
| `onClose` | ((event?: MouseEvent<HTMLButtonElement, MouseEvent>) => void) | – | callback function that will be invoked when the close button is clicked. |
| `buttonProps` | Omit<ODSButtonProps, "onClick" \| "size" \| "buttonType" \| "variant"> | – | contains the Close Button props of the Component. |
| `showCloseButton` | boolean | – | controls the visibility of the Close button |
| `link1Props` | Omit<ODSLinkProps, "variant"> | – | contains the link 1 props Component. |
| `link2Props` | Omit<ODSLinkProps, "variant"> | – | contains the link 2 props Component. |
| `opened` | boolean | – |  |
| `successIcon` | ReactNode | – |  |
| `warningIcon` | ReactNode | – |  |
| `informationIcon` | ReactNode | – |  |
| `titleHeading` | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" | – | Define heading level |

## Guidelines (from the ODS docs page)

### General

Notifications give users feedback about the status of the system or an action. The three main types are banner, toast and inline notifications.

When to use:

When we want to inform users about the status of an action, provide a system message, or communicate updates like "New Message".

When not to use:

Don't use a notification when the user needs to confirm a decision to prevent or correct critical errors (here, use a modal instead).

### Anatomy

This section serves to show, in image form, the parts of the component, whether labels, icons, borders and even other components that are part of the whole.

### Use Directives

Inline notifications provide immediate feedback on user actions, seamlessly integrated within the relevant section of the page.

The background colour of the inline notification match there purpose, for example when it is conveying a success message it is in green. This is carries a softer and more subtle meaning than the other notification with their stark black backgrounds.

Notification Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

Link
Link

Notification modes

Success

The success notification confirms a successfully performed action.

Information

The informational notification gives users additional helpful information.

Warning

The warning notification informs users about potentially unwanted results.

Alert

The error notification informs users about a failed action or error and may require an action to continue.

Interaction states

Link text states

All alerts have the option of hiding or showing one or two links. Users can open a link by clicking anywhere along the link text.

Close icon states

All alerts can be closed by selecting the close icon. The ghost icon button is used for this element.

Behaviours

Inline notifications usually appear at the top of the primary content area or close to the item needing attention. An inline notification can be persistant or remains visible until the user resolves or dismisses it.

Sizing & Placement

The width of inline notifications varies based on content and layout, it is up to the users discretion to decide on the best width. They can expand to the fill the container or content area they relate to. Their height is based on the content length, which should not exceed three lines of text. Inline notifications appear near their related items.

Title: Max lines 2
Text: Max lines 3
Min width: 248
**By default, the component has no height limit, and text won't be truncated. However, keep content concise as much as possible. Be aware that text may wrap into more lines on smaller viewports.

Position inline notifications in the appropriate page area.

 
### Colour Schemes

White

Dark

Magenta (restricted)

Secondary (restricted)

### Examples

Desktop

Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Ensure the notification's purpose is communicated clearly in the title, not just through the icon.
Avoid interactive elements like links or buttons in toasts, unless they allow action reversal or the action remains accessible after the toast is dismissed.
For iOS, avoid using scroll views for toast messages.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

For toast notification, the notification should not get an automatic focus, whereas for the inline notification the focus should automatically go to the notification.
Ensure toast notifications are displayed for an appropriate time in order to read them.
When the notification has links, the focus order should be: Close button → Link 1 → Link 2, whereas the linear reading order should be: Close button → Notification title → Notification text → Link 1 → Link 2
A screen reader should announce the notification type when any notification pops up, for this assign:
aria role=”alert”, for urgent warnings or error messages. This is equivalent to aria-live="assertive"
aria-live="polite", for a less critical updates or messages.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSInlineNotification` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
