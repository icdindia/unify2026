# TableHeadCell

The Table Head Cell component from the ODS web library.

- **ODS name:** `ODSTableHeadCell`
- **Storybook:** Components/Table/Table Head Cell
- **Stories:** Example, In Table

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | "unsorted" \| "sortedDown" \| "sortedUp" | "unsorted" | the Sorting Type of the Cell. |
| `label` | string | – | the Label of the Cell. |
| `alignment` | "left" \| "right" | "left" | controls the alignment of the content of the Cell. |
| `sortable` | boolean | – |  |
| `showSortIndicator` | boolean | true | controls the sortable state of the Cell. If this value is true, then the Cell can be interacted with. |
| `onSort` | ((direction?: "desc" \| "asc") => void) | – | Pass the action to be performed on click of sortIndicator. |
| `sortableIcon` | ReactNode | – | Icon to be displayed when showSortIndicator is set to true. If nothing is set the default icon logic will be used. |

## What the consumer provides

The ODS React component `ODSTableHeadCell` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
