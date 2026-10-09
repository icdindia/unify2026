# TagStatic

A tag is a static or dismissible component that displays metadata, drawing the user's attention to certain content elements. They usually represent a category, an attribute or a status.

- **ODS name:** `ODSTagStatic`
- **Storybook:** Components/Tag/Tag Static
- **Stories:** Example, With Icon

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` * | string | – | Label to be displayed in tag |
| `type` | "strong" \| "error" \| "subtle" \| "success" \| "medium" \| "warning" \| "savings" \| "promotion" | "basic" | Type of tag |
| `disabled` | boolean | false | Disables tag |
| `icon` | ReactNode | – | Icon to be displayed inside tag |
| `size` | "small" \| "standard" \| "medium" | "standard" | Size of tag |

## Guidelines (from the ODS docs page)

### General
A tag is a static or dismissible component that displays metadata, drawing the user's attention to certain content elements. They usually represent a category, an attribute or a status.

When to use:
Highlighting and categorizing items or content
Indicate the status of an item
When not to use:
If users could confuse them with buttons
If users might not be able to recognise relevant content (particularly if there are too many tags)
Filtering content (use chips instead)
Types
Static (includes a signal type: warnings, savings and promotion)
Dismissible (can be closed)
### Anatomy

### Use Directives
How designers should use the component.

Tag Static
A static tag has no interactive function. It only conveys information, for instance a category within a table.

Types

For basic tags use either ‘Basic’ if you’re on subtle background colour, or ‘Subtle’ if you’re on a standard background colour. For prominent tags, ‘Promotion’ uses the primary accent colour while ‘Savings’ uses a more subtle shade of it. For secondary tags, there’s a hierarchy of ‘Strong’, ‘Medium’ and ‘Secondary Subtle’ which map to the accent-secondary colour of your scheme. Lastly, use ‘Success’, ‘Warning’ or ‘Error’ to convey statuses on neutral schemes.

Optional icon

Icon is optional. Swap between fitting icons. Be sure to use Icon Type Standard, not Bold.

Disabled

Tag can be disabled when inside other parent components.

Tag group spacing

When horizontal space is limited in a tag group, the individual tags wrap to form another line. The spacing between Static Tags should 8px horizontally and vertically.

Where to use Static Tags

Static tags can be placed in cards, structured list's and table row's cells.

Arrangement
Horizontally

Tags should stack horizontally and wrap when needed.

In inputfields

Dismissible tags can be used in an input field. The field can contain multiple dismissible tags horizontally.

If you want to use the dismissible tag in the overflow menu, use tag item as a single line item property.

Use dismissible tags to sort information, not as filtering. For filtering use Chips.

Dismissible tag can be created on input fields and can be transformed to tag. These tags can be also editable on an input field. The tags are preferred to remove by using delete key or hitting the remove icon when using the component on input field. Also dismissible tag’s label should carry one word. If the text character reaches to max inner-padding with its container, truncate the text.

 
Dos and don’ts
Standard On-Background & Standard On-Subtle varitaions

Always use the type that contrasts the background, so the tag doesn’t blend into the background color.

 
Text length

The length of a tag component should be short and concise, ideally limited to one to two words. Text should not wrap into two lines.

 
Don’t mix tag functions

Each tag should follow the function it was designed to do. When communicating success, warning, error, savings or promotions, always use the appropriate tag.

 
Use Tags to communicate status

Success, Warning and Error types use clear status labels, e.g. when a bill is overdue. They don’t replace alerts. For detailed info or instructions, use Alerts & Notifications.

 
Be concise with your wording

Use short tag lengths when displaying multiple tags together. Otherwise they could fill the screen really fast.

 
Don’t mix Static and Dismissible

Don’t mix Static Tags and Interactive Tags when grouping.

 
Don’t use Dismissible Tags as filtering

For filtering use ODS Chips.

Behaviour
How designers should use the component.

Tag Dismissible
Dismissible

Dismissible Tags are dismissible and will disappear when users click on the close button. Multiple Dismissible Tags in a wrapped group will be rearranged when tags are removed. Use 8 px for horizontal and vertical gap between the tags.

Touch target

Dismissible tags can be removed by clicking on the entire tag surface.

Interactive states

Dismissible Tag is actionable and has states.

### Colour Schemes
The Interactive tag component works across all colour schemes while the Static Tag variants indicating status are restricted to neutral schemes.

White

Black

Magenta
Static Tag variants indicating status are restricted to neutral schemes.

Secondary
Static Tag variants indicating status are restricted to neutral schemes.

Colourful
 
Additional Colours
Accent and neutral shades
These colour variables give you access to various shades of the page background colour and the accent colours.

The accent colours can be used to created hierarchy within more prominent elements of the page.

The neutral colour ramp is used for some very specific component requirements and for illustrations.

 
Interaction colours
These interaction colours are mostly just duplicates of the basic colour set but in various states of interactivity.

You will only really need to use these if you’re building basic, atom-level components.

 
Data Viz Colours
These tokens are used purely for data viz components such as bar and line graphs. There are two sets of tokens:

Neutral Data Viz Tokens

Used when the colour of the bars and lines are from the same colour scheme as the background colour. (e.g. dark grey bars on a white background, dark aperitif lines on an aperitif background.)

Secondary Data Viz Tokens

Used when the colours of the bars and lines are on a neutral background but follow a secondary colour scheme. (e.g. kingfisher bars on a white background, iguana lines on a black background.)

Functional colours
These are mostly used for providing feedback to user interactions. They appear mostly at the atom level.

Deprecated
Accent and neutral shades

### Examples
Static Tags – Standard

Dismissible Tags

old example, tags in text field

### Accessibility
This ODS component is compliant with WCAG 2.2 A and AA standards.
Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations
When using a tag on a background or subtle fill, manually change the color scheme of the tag to “inverted” to ensure accessibility by changing the color to dark grey.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSTagStatic` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
