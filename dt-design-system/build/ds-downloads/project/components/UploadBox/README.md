# UploadBox

Users need to provide documents, images, or media as part of a workflow (e.g., profile photos, resumes, receipts).

- **ODS name:** `ODSUploadBox`
- **Storybook:** Components/Upload/Upload Box
- **Stories:** Example Story, Complete Example Story

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | – |  |
| `icon` | ReactNode | – | Sets an icon to the component |
| `description` | string | – | The description of the component. |
| `infoText` | string | – | The infoText of the component. |
| `buttonProps` | ODSComponentPropsWithRef<"button"> | – | Defined the properties for the upload Button. |
| `inputProps` | ODSComponentPropsWithRef<"input"> | – | Defined the properties for the upload input. |
| `onFileUpload` | ((files: FileList) => void) | – | Callback that returns the list of files uploaded. |

## Guidelines (from the ODS docs page)

When to use

Users need to provide documents, images, or media as part of a workflow (e.g., profile photos, resumes, receipts).
File-based input is essential and cannot be replaced by text, form fields, or structured data entry.
Multiple files or large file types need to be collected efficiently.
Users benefit from previews, progress indicators, or drag-and-drop functionality to simplify the process.
When not to use

The same information can be entered as text or selected from predefined options (e.g., entering a name vs. uploading a form).
Files already exist in the system and can be referenced or reused instead of re-uploaded.
Uploading increases complexity without adding value (e.g., requiring images when a short description would suffice).
### Anatomy

Behaviours

The upload box allows users to upload files directly to the application by either dragging/dropping their files or by using the button and opening their system file browser.

### Component Variants

### States

Extended

### Colour Schemes

White

Black

Magenta

Use this component only with neutral colour schemes.

Secondary

Use this component only with neutral colour schemes.

### Examples

Desktop

Mobile

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSUploadBox` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSUploadBox } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSUploadBox } from "@telekom-ods/react-ui-kit/ODSUploadBox";

<ODSUploadBox title="UploadBox" />
```

Static HTML: download **UploadBox.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
