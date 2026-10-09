# Banner

Notifications give users feedback about the status of the system or an action. The three main types are banner, toast and inline notifications.

- **ODS name:** `ODSBanner`
- **Storybook:** Components/Alerts & Notifications/Banner
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

Banner notifications effectively convey system messages, appearing prominently and persistently above page content.

Notification Title
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.

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

Banners take over the top of an interface, but are not sticky – banners should scroll away with content. They persist until they are dismissed by the user. They are responsive and take up the whole width of the screen.

Center banner notifications above the page content.

The banner component width is set to fill so that it takes up the full width of the screen.

Title: Max lines 2
Text: Max lines 3
Min width: 320
**By default, the component has no height limit, and text won't be truncated. However, keep content concise as much as possible. Be aware that text may wrap into more lines on smaller viewports.

### Colour Schemes

White

Dark

Magenta

Secondary

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

The ODS React component `ODSBanner` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
