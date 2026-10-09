# TableRowCell

The Table Row Cell component from the ODS web library.

- **ODS name:** `ODSTableRowCell`
- **Storybook:** Components/Table/Table Row Cell
- **Stories:** Example, In Table

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | "label" \| "link" \| "menu" \| "progress" \| "slot" \| "action" \| "tags" | "label" | the Type of the Cell. |
| `label` | string \| number | – |  |
| `spacer` | boolean | false | spacer controls the visibility of the content. If spacer is true, all of the other properties are ignored and the content is not showing. This is used for cells that are empty. |
| `alignment` | "left" \| "right" | "left" | controls the alignment of the content of the Cell. |
| `tagsProps` | it is an array of Tags properties. This property is used only when the type is tags, otherwise it is ignored. \| type \| tags | – | ODSTableRowCellTagProps[] |
| `progressBarProps` | ODSProgressBarProps | – |  |
| `actionProps` | ODSButtonProps | – |  |
| `linkProps` | ODSLinkProps | – |  |
| `tableMultipleActionsFlyoutProps` | ODSTableMultipleActionsFlyoutProps | – |  |
| `listData` | the properties of the list of buttons to be displayed in the Multiple ActionsFlyout Menu. This property is used only when the type is menu, otherwise it is ignored. \| type \| menu | – | ODSButtonProps[] |
| `contentSlot` | Dynamic content of the cell. This property is used only when the type is slot, otherwise it is ignored. \| type \| slot | – | ReactNode \| ReactNode[] |
| `elementType` | "td" \| "th" | "td" |  |
| `data-content` | string \| number | – |  |

## What the consumer provides

The ODS React component `ODSTableRowCell` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSTableRowCell } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTableRowCell } from "@telekom-ods/react-ui-kit/ODSTableRowCell";

<ODSTableRowCell label="TableRowCell" type="label" spacer={false} alignment="left" elementType="td" />
```

Static HTML: download **TableRowCell.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
