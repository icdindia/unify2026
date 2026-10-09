# Table

A table organizes data into rows and columns. Additional functions like filtering or sorting offer the user the option to adjust the presentation of the data to their own needs. Detach and adapt the table component to customize as needed.

- **ODS name:** `ODSTable`
- **Storybook:** Components/Table/Table
- **Stories:** Example, Basic, Selectable, Expandable, Sortable, Scrollable, Pagination, CustomCells

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectable` | boolean | false | controls the selectable state of the Table. |
| `expandable` | boolean | false | controls the expandable state of the Table. |
| `pagination` | boolean | false | controls the visibility of the Table Pagination Footer. |
| `initialPage` | number | 0 | the initial page index of the Table. |
| `page` | number | – |  |
| `pageSize` | number | – |  |
| `initialPageSize` | number | – |  |
| `totalRows` | number | 0 | the total amount of rows. This is only used for the pagination. |
| `pageSizeOptions` | contains the rows per page options. If the table pagination prop is false, it will be ignored. \| pagination \| false | [10, 25, 50, 100] | number[] |
| `wrapperProps` | height \| width \| maxHeight \| maxWidth | – | ODSComponentProps<"div"> |
| `paginationAriaLabel` | string | "Table pagination" | This can be used to provide a meaningful aria label to the pagination footer when "pagination" is set to true. |
| `onPaginationChange` | ((event: ODSPaginationTableChangeEventOptions) => void) | – | Callback event for pagination changes. |
| `paginationTableProps` | ODSPaginationTableProps | – | Props for the pagination |

## Guidelines (from the ODS docs page)

### General

A table organizes data into rows and columns. Additional functions like filtering or sorting offer the user the option to adjust the presentation of the data to their own needs. Detach and adapt the table component to customize as needed.

When to use:

Use a table when you need to display a large amount of structured data in a clear, organized manner.
Use when users need to compare data across multiple rows and columns.
Use when the data set has multiple attributes or categories that are best understood in a grid format.
When not to use:

Avoid using a table for small data sets or when the information can be presented more effectively using lists.
Avoid when the data does not have a clear tabular structure, making it hard to read or interpret.
Avoid when the table would become too complex or cluttered, making it difficult for users to navigate or understand.

### Anatomy

### Use Directives

### General

The table component needs to be detached before customisation. This way you can add, remove and combine columns and rows as needed, and make sure they span the desired width.

Guide for setting up a table

1. Select whether checkboxes and dropdowns should be used and then detach the component.

2. To copy or delete a column of a specific type, select the corresponding header cell and the data cell together.

3. By copy and paste, the new column is placed on the right.

4. If header cell and data cell of a column are selected together, they can be freely arranged by drag and drop.

5. When the table structure is correct, the row must be selected as a layer.

6. The required number of rows can be added by copy and paste. The filled table must be converted into a component for handoff.

Hug & Fill Settings

By copying with simultaneous selection of data and header cell of a column, the correct settings are already applied. All header and data cells of a column must have the same horizontal resizing (Hug or Fill), Alinement (Right or Left) and minimal width.

Small viewport scroll

As soon as the available width is no longer enough and the cells overlap, all rows and the header must be assigned a fixed width. This allows horizontal scrolling in the scroll container.

Dropdown

There is already a hidden dropdown in the row if the function is to be offered in the table. In use this can be expanded and collapsed via the dropdown cell using the expanded and collapsed button. The dropdown cell, if used, is the last one on the right.

How to use

In order to swap the component, simply select the slot component frame and swap the component instance.

Behaviours

Row per page

You can select how many rows should be shown on a page.

Column sorting

By clicking on a header cell, the table is sorted in descending order according to this column. The second click changes the order to ascending. The third time the sorting is cleared again.

### Component Variants

Table Variants

Cell - Data Variants

Cell - Header Variants

Cell - Header States

### Colour Schemes

White

Black

Magenta

The table can only be used on neutral color schemes

Secondary

The table can only be used on neutral color schemes

### Examples

Data table on web

### Accessibility

This ODS component is compliant with WCAG 2.2 A and AA standards.

Key considerations for keyboard interactions and screenreaders are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Column headers must be clear, concise, and descriptive, so users understand what each column represents.
Interactive elements inside cells (links, buttons, menus) must be clearly recognizable and not visually overwhelmed by surrounding content.
Ensure the table is usable with: Keyboard only, Screen readers, Screen magnification (no clipped content, no horizontal scroll traps).
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Ensure the table has an accessible name by using aria-label, aria-labelledby, or a title attribute.
Ensure screen readers can correctly associate each data cell with its header(s).
If the table supports sorting, use aria-sort="ascending|descending" on the active column header.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTable` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
