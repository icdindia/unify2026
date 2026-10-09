# ToggleChip

Chips allow users to enter information, make selections or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

- **ODS name:** `ODSToggleChip`
- **Storybook:** Components/Chips/Toggle Chip
- **Stories:** Example, Set

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` * | string | – | The label of the Chip. |
| `disabled` | boolean | – | Handles the disabled state of the component |
| `checkmarkIcon` | ReactNode | <ODSCheckmark /> | Icon to be displayed when the chip is selected. If nothing is set the default checkMark Icon will be used. |
| `selected` | boolean | – | Controls the selected state of the Toggle Chip. |
| `loading` | boolean | – | When true, a loading spinner is displayed. |
| `loadingSpinnerProps` | ODSLoadingSpinnerProps | – | Loading spinner properties |
| `icon` | ReactNode | – | Icon to be displayed. |
| `defaultSelected` | boolean | – | The initial value for the selected state, when uncontrolled. |
| `onSelectedChange` | ((value: boolean) => void) | – | Fires when the selected value changes. |
| `showImage` | boolean | false | Controls the visibility of the Picture. If the value is true, the Icon will be replaced with the provided image. |
| `pictureProps` | element. This property is mandatory if \| is | – | ImgHTMLAttributes<HTMLImageElement> |
| `transparentBg` | boolean | true | Determines if the chip has a transparent background. |
| `showPicture` | boolean | false |  |
| `label` * | string | – | The label of the Chip. |
| `disabled` | boolean | – | Handles the disabled state of the component |
| `checkmarkIcon` | ReactNode | <ODSCheckmark /> | Icon to be displayed when the chip is selected. If nothing is set the default checkMark Icon will be used. |
| `selected` | boolean | – | Controls the selected state of the Toggle Chip. |
| `loading` | boolean | – | When true, a loading spinner is displayed. |
| `loadingSpinnerProps` | ODSLoadingSpinnerProps | – | Loading spinner properties |
| `icon` | ReactNode | – | Icon to be displayed. |
| `defaultSelected` | boolean | – | The initial value for the selected state, when uncontrolled. |
| `onSelectedChange` | ((value: boolean) => void) | – | Fires when the selected value changes. |
| `showImage` | boolean | false | Controls the visibility of the Picture. If the value is true, the Icon will be replaced with the provided image. |
| `pictureProps` | element. This property is mandatory if \| is | – | ImgHTMLAttributes<HTMLImageElement> |
| `transparentBg` | boolean | true | Determines if the chip has a transparent background. |
| `showPicture` | boolean | false |  |

## Guidelines (from the ODS docs page)

### General

Chips allow users to enter information, make selections or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

Chips consist of relevant keywords in a container. They often appear dynamically (triggered by a user action) and as a group.

When to use:

Give users filtering possibilities
Display the filters users set
Suggest options to users (search criteria, possible answers).
When not to use:

You want to mark a category (use tags instead)
You can use a button instead

### Anatomy

 
### Use Directives

The default toggle chip has a text label. Text labels are required and should briefly and clearly communicate their purpose to the user. The toggle chip also has the functionality of having a left icon or an avatar, these UI elements can help support the chip label.

The toggle chip has the option of being selected or un-selected, filtering content. When it has been selected it turns black.

Behaviours

Chip group overflow

When horizontal space is limited in a chip group, the individual chips wrap to form another line. The spacing between chips is 16px.

Allow bulk actions

In some instances, it's possible to add an action next to a group of chips to provide a way to easily take an action on the entire group at once. Make sure the action is only visible when there is more than one chip.

### Colour Schemes

White

Black

Magenta

Secondary

Chip

ODSToggleChip extends the native HTMLButtonElement properties as React props. On top of the additional properties that are listed below, you can also pass the native HTMLButtonElement properties as React props. You can read more about those properties here.

Name	Description	Default	Control
label*	
The label of the Chip.
string
-	

disabled	
Handles the disabled state of the component
boolean
-	FalseTrue
checkmarkIcon	
Icon to be displayed when the chip is selected. If nothing is set the default checkMark Icon will be used.
ReactNode

<ODSCheckmark />
Set object
selected	
Controls the selected state of the Toggle Chip.
boolean
-	Set boolean
loading	
When true, a loading spinner is displayed.
boolean
-	Set boolean
loadingSpinnerProps	
Loading spinner properties
ODSLoadingSpinnerProps
-	Set object
icon	
Icon to be displayed.
ReactNode
-	

icon :{
$$typeof : Symbol(react.transitional.element)
type : function(e){var i=e.size,r=e.fill,t=r===void 0?"currentColor":r,a=e.color,j=a===void 0?"currentColor":a,c=e.selected,x=c===void 0?!1:c,d=e.decorative,g=d===void 0?!1:d,f=e.title,n=e.accessibilityTitle,p=e.description,v=e.focusable,b=v===void 0?!1:v,h=e.small,s=h===void 0?!1:h,m=e.className,y=O(e,["size","fill","color","selected","decorative","title","accessibilityTitle","description","focusable","small","className"]),u=i||(s?16:24);return n&&console.warn("The `accessibilityTitle` prop is deprecated and will be removed in a future version. Please use `title` instead."),l.jsxs("svg",o({className:["ODSIcon",m].filter(Boolean).join(" "),xmlns:"http://www.w3.org/2000/svg",width:u,height:u,viewBox:s?"0 0 16 16":"0 0 24 24","aria-hidden":!!g,tabIndex:b?0:-1},y,{children:[(f||n)&&l.jsx("title",{children:f||n}),p&&l.jsx("desc",{children:p}),l.jsx("g",{fill:t==="currentColor"?j:t,children:x?s?l.jsxs("g",{children:[l.jsx("path",{d:"M8.266.9a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2"}),l.jsx("path",{d:"M5.172 2.25a.8.8 0 0 0-1.552.39 5.16 5.16 0 0 0 2.251 3.107v6.496a.8.8 0 0 0 .24.572l2 1.957a.8.8 0 0 0 1.12-1.144l-1.76-1.722v-1.873h1.25l1.045.557-.378 1.813a.8.8 0 1 0 1.566.327l.5-2.4a.8.8 0 0 0-.406-.87L9.47 8.62V6.475A5.17 5.17 0 0 0 13.06 4.03a.8.8 0 1 0-1.373-.822 3.564 3.564 0 0 1-6.514-.959"})]}):l.jsxs("g",{children:[l.jsx("path",{d:"M9.65 4a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0"}),l.jsx("path",{d:"M7.199 3.513a1.25 1.25 0 1 0-2.425.61A7.8 7.8 0 0 0 8.15 8.798v9.266c0 .297.105.585.298.811l2.5 2.936a1.25 1.25 0 1 0 1.903-1.622l-2.201-2.585V15.25H13v-.05l1.104.804-.202 2.91a1.25 1.25 0 1 0 2.494.173l.25-3.6a1.25 1.25 0 0 0-.511-1.098l-1.686-1.225v-3.44a7.8 7.8 0 0 0 4.576-3.502 1.25 1.25 0 0 0-2.146-1.283A5.295 5.295 0 0 1 7.2 3.513"})]}):s?l.jsxs("g",{children:[l.jsx("path",{d:"M6.568 2.6a1.4 1.4 0 1 1 2.8 0 1.4 1.4 0 0 1-2.8 0"}),l.jsx("path",{d:"M4.877 2.3a.6.6 0 1 0-1.163.292A4.96 4.96 0 0 0 5.97 5.636v6.807a.6.6 0 0 0 .18.43l2 1.956a.6.6 0 1 0 .84-.858l-1.82-1.78V9.834h1.5l1.22.65-.408 1.96a.6.6 0 1 0 1.175.245l.5-2.4a.6.6 0 0 0-.305-.652L9.171 8.74V6.303a4.97 4.97 0 0 0 3.616-2.375.6.6 0 0 0-1.03-.616A3.763 3.763 0 0 1 4.877 2.3"})]}):l.jsxs("g",{children:[l.jsx("path",{d:"M11.9 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"}),l.jsx("path",{d:"M6.956 3.574a1 1 0 0 0-1.94.488A7.55 7.55 0 0 0 8.4 8.66v9.405a1 1 0 0 0 .238.649l2.5 2.935a1 1 0 0 0 1.523-1.296l-2.261-2.656V15h2.125l1.832.977-.205 2.954a1 1 0 1 0 1.995.138l.25-3.6a1 1 0 0 0-.527-.951L13.4 13.2V9.691a7.54 7.54 0 0 0 5.411-3.598 1 1 0 1 0-1.716-1.026A5.545 5.545 0 0 1 6.956 3.574"})]})})]}))}
key : null
ref : null
props :{...} 0 keys
}
defaultSelected	
The initial value for the selected state, when uncontrolled.
boolean
-	Set boolean
onSelectedChange	
Fires when the selected value changes.
((value: boolean) => void)
-	-
showImage	
Controls the visibility of the Picture. If the value is true, the Icon will be replaced with the provided image.

boolean
false
FalseTrue
pictureProps	
The Native HTMLImageElement properties that will be used for the image element. This property is mandatory if showImage is true`, otherwise it is ignored.

ImgHTMLAttributes<HTMLImageElement>
-	

pictureProps :{
src : "https://ods.trap.ng.telekom.net/assets/avatar-profile-BHCvDehJ.png"
alt : "Erika Mustermann"
title : "Erika Mustermann"
aria-label : "Erika Mustermann"
}
transparentBg	
Determines if the chip has a transparent background.
boolean
true
FalseTrue
showPicture	
boolean
false
Set boolean
### Component Variants

### Examples

Filter, dismissible and toggle chips

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Provide clear and short chip label.
Chips should only be used in groups.
If there is no other context in the surrounding, chip groups should have a meaningful label.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

No further development considerations required.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSToggleChip` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSToggleChip } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSToggleChip } from "@telekom-ods/react-ui-kit/ODSToggleChip";

<ODSToggleChip label="ToggleChip" label="ToggleChip" checkmarkIcon={<ODSCheckmark />} showImage={false} transparentBg={true} showPicture={false} />
```

Static HTML: download **ToggleChip.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
