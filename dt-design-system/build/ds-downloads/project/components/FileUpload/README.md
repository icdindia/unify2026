# FileUpload

Users need to provide documents, images, or media as part of a workflow (e.g., profile photos, resumes, receipts).

- **ODS name:** `ODSFileUpload`
- **Storybook:** Components/Upload/File Upload
- **Stories:** Example Story, Custom Thumbnail Icon Story, Successful Upload Story, Failed Upload Story

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `subtle` | boolean | true | Defines the background of the component. |
| `showThumbnail` | boolean | true | Shows/Hides the thumbnail. |
| `thumbnailProps` | ODSThumbnailProps | – | Defines the properties of the icon thumbnail. |
| `buttonProps` | ODSButtonProps | – | Defines the properties of the action Button. |
| `actionButtonProps` | ODSButtonProps | – | Defines the properties of the action Button. |
| `type` | "extended" \| "simple" | "simple" | Defines the type of the component. |
| `progressBarProps` | ODSProgressBarProps | – |  |
| `loading` | boolean | false |  |
| `label` | string | – |  |

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

### Use Directives

File upload types

Extended

Use this type when you want to display more detailed information by utilizing the progress bar nested inside.

Simple

Use this type when you want to display a quick preview with minimum information.

Show thumbnail

A thumbnail in a file upload component can hold filetype thumbnails, for example, representing different file formats visually for quick identification.

Behaviours

Upload states

The button is not tied up to the uploading states of the progress bar for full flexibility. You can customise the button to align with the products needs. Following there are a few suggestions of how this would work.

Uploading

The button icon is set to Cancel and it will cancel the upload before completion.

Upload completed

The button icon is set to Delete and it will remove the file from the list.

Upload failed

The button icon is set to Restart and it will attempt the upload again.

### Component Variants

Type

Extended

Simple

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

Design considerations

File requirements (accepted formats, maximum size) must be clearly visible before upload to prevent errors and should be announced by the screen reader.
Provide multiple ways to upload files (button + drag & drop) without making drag & drop the only option.
Ensure the upload area is visually distinct and clearly recognizable as interactive.
Ensure to announce (visually and by the screen reader) when the upload is finished with success (e.g. "upload completed", "upload 100%") or with errors.
Be sure to adapt labels and instructions to the context.
Upload progress bars will use the same considerations of the Progress Bar component.
Development considerations

Associate the file input with a visible label using <label for> or aria-labelledby.
The upload container may use role="region" with a descriptive aria-label (e.g. “Document upload”) to help screen reader users orient themselves.
Keyboard and screen reader users must be able to upload files using the button.
When files are added, ensure the file list updates are announced appropriately using aria-live="polite" region to announce meaningful changes (e.g. “File added”, “Upload complete”, “Upload failed”).
If thumbnails are shown, mark them decorative (alt="") unless they convey meaningful information
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSFileUpload` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSFileUpload } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFileUpload } from "@telekom-ods/react-ui-kit/ODSFileUpload";

<ODSFileUpload label="FileUpload" subtle={true} showThumbnail={true} type="simple" loading={false} />
```

Static HTML: download **FileUpload.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
