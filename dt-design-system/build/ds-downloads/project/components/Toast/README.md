# Toast

Notifications give users feedback about the status of the system or an action. The three main types are banner, toast and inline notifications.

- **ODS name:** `ODSToast`
- **Storybook:** Components/Alerts & Notifications/Toast
- **Stories:** Example, Success, Information

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | – |  |
| `text` | string | – |  |
| `type` | "success" \| "information" | – |  |
| `mode` | "success" \| "informative" | – | contains the mode of the Component and controls the icon. The default value is informative. |
| `errorIcon` | ReactNode | – |  |
| `onClose` | ((event?: MouseEvent<HTMLButtonElement, MouseEvent>) => void) | – | callback function that will be invoked when the close button is clicked. |
| `buttonProps` | Omit<ODSButtonProps, "onClick" \| "size" \| "buttonType" \| "variant"> | – | contains the Close Button props of the Component. |
| `timeout` | number | – | contains the value of the Toast timeout in milliseconds. Once this timeout period has ended, the Toast will automatically close. If there is no timeout provided or the value is 0, the Toast won't automatically close and the close button will appear, leaving the option to the user to close it on demand. The default value is 0. |
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

Toast notifications appear immediately after a specific event. They don’t refer to an object on the page and are temporarily displayed in a global position. Toast notifications can cover other content and hide automatically after a short time. Alternatively, users can actively close them. Since toast notifications are time-based, avoid using them in error cases and only use links for specific actions like “Redo” if a user has deleted a file or in similar cases.

Notification Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

Link
Link

Notification modes

Success

The success notification confirms a successfully performed action.

Notification Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

Link
Link

Information

The informational notification gives users additional helpful information.

Notification Title
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor

Link
Link

Interaction states

Link text states

All alerts have the option of hiding or showing one or two links. Users can open a link by clicking anywhere along the link text.

Close icon states

All alerts can be closed by selecting the close icon. The ghost icon button is used for this element.

Behaviours

Toasts are non-modal, time-based window elements used to display short messages; they usually appear at the top of the screen. As they don’t interrupt the user flow, toasts are best for low-priority feedback and confirmation of task completions. These both can be dismissed manually by the user (by tapping the close button) or dismiss automatically after 3 seconds.

The width of toasts varies based on content and layout, it is up to the users discretion to decide on the best banner width.

Title: Max lines 2
Text: Max lines 3
Min width: 248
By default, the component has no height limit, and text won't be truncated. However, keep content concise as much as possible. Be aware that text may wrap into more lines on smaller viewports.

Toast notifications are usually placed on the top left or top right and can cover other content.

 
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

The ODS React component `ODSToast` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSToast } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSToast } from "@telekom-ods/react-ui-kit/ODSToast";

<ODSToast text="Toast" title="Toast" />
```

Static HTML: download **Toast.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
