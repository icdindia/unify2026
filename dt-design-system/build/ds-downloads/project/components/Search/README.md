# Search

A search component allows users to find content efficiently across multiple pages or datasets with structured suggestions and results.

- **ODS name:** `ODSSearch`
- **Storybook:** Components/Search
- **Stories:** ExampleStory, Modal, CustomList

## Example (story args)

```tsx
<ODSSearchResultList
  data-qa="Result List Example"
  items={[
    {
      "data-qa": "Result 1",
      labelText: "Result 1",
    },
    {
      "data-qa": "Result 2",
      labelText: "Result 2",
    },
    {
      "data-qa": "Result 3",
      labelText: "Result 3",
    },
    {
      "data-qa": "Result 4",
      labelText: "Result 4",
    },
  ]}
/>
Copy
```

```tsx
<ODSSearchResultList
  data-qa="Result List Example"
  items={[
    {
      "data-qa": "Result 1",
      labelText: "Result 1",
    },
    {
      "data-qa": "Result 2",
      labelText: "Result 2",
    },
    {
      "data-qa": "Result 3",
      labelText: "Result 3",
    },
    {
      "data-qa": "Result 4",
      labelText: "Result 4",
    },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onChange` * | (arg: string) => void | – | handle the input text change (mandatory since result list is a slot). |
| `disabled` | boolean | false |  |
| `placeholderText` | string[] | ['Search Something', 'Find Something else'] |  |
| `inputText` * | string | – | the value of the search input (mandatory since result list is a slot). |
| `clearButtonProps` | ODSButtonProps | – | Add additional functionality to the clear button. |
| `backButtonProps` | ODSButtonProps | – | Add functionality on back button for small screens. |
| `focusOnInput` | ((arg: number) => void) | – | Handle the item from the result list you want to focus on. |
| `resultList` * | ReactNode | – | Select between the resultList component provided or add your own custom component. |
| `setListVisible` * | (arg: boolean) => void | – | Controls if the items list is visible or not (mandatory since result list is a slot). |
| `isListVisible` * | boolean | – | shows if the items list is visible or not (mandatory since result list is a slot). |
| `listId` * | string | – | The unique id of the list. It creates a connections between the search input with the items list (mandatory since result list is a slot). |
| `inputAriaLabel` | string | "search" | The aria label for the input field. |
| `searchIcon` | ReactNode | <ODSSearchIcon /> | Search Icon. If nothing is set, the default icon will be used. |

## Guidelines (from the ODS docs page)

### Anatomy

<ODSSearchResultList
  data-qa="Result List Example"
  items={[
    {
      "data-qa": "Result 1",
      labelText: "Result 1",
    },
    {
      "data-qa": "Result 2",
      labelText: "Result 2",
    },
    {
      "data-qa": "Result 3",
      labelText: "Result 3",
    },
    {
      "data-qa": "Result 4",
      labelText: "Result 4",
    },
  ]}
/>
Copy
ODSSearchResultList

type ODSSearchResultListProps = ODSComponentPropsWithRef<"div"> & {
  /** Label of the list */
  label?: string;
  /** list of items */
  items?: ODSResultListItemProps[];
  /** text that already has been inserted by user in the input */
  recessiveLabelText?: string;
  /** the references of the items */
  setRefs?: (ref: HTMLLIElement) => void;
  /** Fires when a value is selected*/
  onSearchMouseDown?: (value: ODSResultListItemProps) => void;
  /** Fires when use is navigated in the list with arrows*/
  onSearchItemKeyDown?: (
    event: KeyboardEvent,
    value: ODSResultListItemProps,
    index: number
  ) => void;
};
Copy
ODSResultListItem

type ODSResultListItemSize = "large" | "small";

type ODSResultListItemProps = Omit<
  ODSComponentPropsWithRef<"li">,
  "onMouseDown" | "onKeyDown"
> & {
  icon?: ReactNode;
  /** The search result or option to be selected */
  labelText: string;
  recessiveLabel?: string;
  size?: ODSResultListItemSize;
  fragMagenta?: boolean;
  /** Custom `onClick` function to handle the click of the list item. */
  onMouseDown?: (value: ODSResultListItemProps) => void;
  /** Custom `onKeyDown` function to handle the key down of the list item (for a11y purpose) */
  onKeyDown?: (event: KeyboardEvent, value: ODSResultListItemProps) => void;
};
Copy
### General

A search component allows users to find content efficiently across multiple pages or datasets with structured suggestions and results.

When to use

For searching across multiple pages, sections or as the global search.
If a dedicated search experience improves usability.
When not to use

When a simple, contextual search within a single page is sufficient (use Inline Search instead).
If users can easily find content through navigation or filtering.
When search functionality would be redundant or unnecessary.

### Anatomy

Behaviours

Interaction

Hover

When the mouse hovers over the unselected input field of the search component, the field enters a hover state. However after clicking in the field, when hovering over the buttons or list items, these will enter their own hover state independently.

List items

Frag Magenta: Always displayed first, highlighted in magenta with the Frag Magenta Icon.

Autocomplete Result: Completes the user's input with a relevant suggestion.

Relevant Result: Matches the user's input, offering a related result.

Icons can be changed or hidden based on the design needs.

Search prompts

The prompt can either be static or 5 different prompts can change continuously.

List Item Behaviour

Input & Suggestion wrapping

In Figma, input text and suggestion text are managed as two separate layers (input = Hug, suggestion = Fill).
This may cause suggestions to wrap independently of the input, resulting in broken visual alignment.
Expected runtime behaviour:

In code, the input and suggestion are concatenated and rendered as one inline string.
When wrapping occurs, the whole text flows to the next line together.
This ensures consistent alignment, improved readability, and compliance with accessibility rules (no truncation).

Design note:This wrapping behaviour cannot be accurately simulated in Figma. Designers may see overflow or misalignment in prototypes — please refer to runtime implementation for the correct behaviour.

Breakpoints

Small Viewports (S-M)

In the small viewport, a separate page with the search opens as soon as you interact with it. Therefore only Submitted, Unselected and Disabled are excluded. You can close the search page again by clicking the back button.

Large Viewports (L-XXL)

Depending on the specific requirements, the search component can be used in different ways. For example, by pushing out the other content or as a modal with Dim. In this case, the entire component must be on the modal.

Global Search S-M

With a small viewport, the Global Search opens its own search page as soon as the search icon in the header is clicked.

Global Search L-XXL

When used as a global search, pressing the search icon in the header opens the flyout of the header with the search. The padding is the same as for the other header flyouts. The flyout becomes larger when the list is visible.

### Colour Schemes

White

Black

Magenta

Secondary

### Use Directives

Types

Standard

The search field is empty with suggestion promts, with the cursor active inside it.

Cleared

The search field is empty with no prompts, with the cursor active inside it.

Typing

The user is actively entering text.

Submitted

The search query has been confirmed, and the input field is not selected.

Unselected

The search field is empty and not selected.

Breakpoints (Size)

L-XXL (Large)

The large version of the search should only be used in breakpoint L-XXL.

S-M (Small)

The small version of the search should only be used in breakpoint S-M.

List

Suggestions before input

The suggestions list can either be displayed or hidden, based on the requirements or user interaction.

Results for the input

The result list can either be displayed or hidden, based on the requirements or user interaction.

Slot for list

The suggestions and results lists can contain different numbers of items, label and icons, depending on the context.

For specific requirements, the list can be replaced by other content.

Disabled

When disabled, the search loses its interactivity. Use this state when interactions are restricted by permissions or dependencies.

Best practices

Search field icons

The icons of the search field should not be changed because they should follow a common interaction concept.

### Component Variants

ODS Search

L-XXL (Large)

S-M (Small)

Search Input

L-XXL (Large)

S-M (Small)

Search Result List

List

Item

### Accessibility

This OneDS component is compliant with WCAG 2.2 A and AA standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Use the Search component when the user can search existing data or content (e.g. products, locations, articles).
Avoid inserting it if there is no searchable dataset → risk of frustration or empty behavior. In that case use the Inline search instead.
If there are no results pleas be specific with the message (e.g. No result for “label”) and make the screen reader announce it.
Users should be able to use assistive technology to make all the actions regarding search: activate a search bar, view the search suggestion, input text, complete a search, clear the search field, interact with search results.
Screen readers should announce that the search bar is an autocomplete field. They should also announce when autocomplete results appear on screen.
Keyboard interaction:
Users can type directly into the search input on focus and press Enter to submit the query.
When the user starts typing, the Clear button appears in the Search string.
For the Search in Modal window: Dialogs take focus on appearance, and the tab order is constrained to the modal’s controls until the modal is closed.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

In cases where a custom list is used:

Keep your DOM flat under role="listbox": only role="group" or role="option" children allowed.
Avoid extra tabindex on wrappers.
Add an aria-label to options only if you need to override/mask the on-screen wording for assistive users.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSSearch` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSSearch } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSearch } from "@telekom-ods/react-ui-kit/ODSSearch";

<ODSSearch listId="Listid" inputText="Inputtext" disabled={false} placeholderText={['Search Something', 'Find Something else']} inputAriaLabel="search" searchIcon={<ODSSearchIcon />} />
```

Static HTML: download **Search.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
