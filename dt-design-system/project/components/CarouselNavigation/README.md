# CarouselNavigation

The Carousel Navigation enables users to browse through a series of content items, such as those in the Card Carousel.

- **ODS name:** `ODSCarouselNavigation`
- **Storybook:** Components/Carousel Navigation
- **Stories:** Example

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `dots` | number | 0 | The number of items in the carousel. |
| `activeIndex` | number | 0 | The index of the active item, zero-based. |
| `loop` | boolean | false | Whether the carousel should loop. |
| `onActiveChange` | ((index: number) => void) | – | Fires whenever the active index changes. |
| `navigationLeftButtonProps` | ButtonHTMLAttributes<HTMLButtonElement> \| ODSButtonProps | – | Can be used to give props to the previous element button, like "aria-label" etc to override the current props. |
| `navigationRightButtonProps` | ButtonHTMLAttributes<HTMLButtonElement> \| ODSButtonProps | – | Can be used to give props to the next element button, like "aria-label" etc to override the current props. |

## Guidelines (from the ODS docs page)

### General

The Carousel Navigation enables users to browse through a series of content items, such as those in the Card Carousel.

When to use:

Use the Carousel Navigation for any gallery that requires navigation.

### Anatomy

### Use Directives

How designers should use the component

Number of dots

Limit the content to a maximum of 6 dots (slides) to avoid overwhelming the user.

Behaviours

How the component will behave in a live environment

Sizing & Positioning

Width

The carousel navigation width is set to fill and adjusts based on the number of displayed dots.

Heigth

The component's height is set to hug. This ensures accessibility, as it includes the ODS Button with a minimum size of 48px by 48px.

Looping vs. linear behaviour

The Carousel Navigation can be used with two primary behaviors: infinite looping and linear (non-looping) navigation. Both should feature seamless transitions between slides.

Disabled state

Users can click or tap the 'Previous' or 'Next' buttons to navigate through items. When the Carousel isn’t infinite looping and the first or last dot is selected, the corresponding arrow button is disabled.

### Component Variants

Carousel Navigation

### Colour Schemes

How it works (or is restricted) across colour schemes

White

Black

Magenta

Secondary

### Examples

### Accessibility

This ODS components is compliant with WCAG 2.2 A and AA standards.  

Key considerations for keyboard interactions and screenreaders are included. Additionally, all components meet requirements for the contrast ratios. 

Design considerations

Ensure that both arrow controls and pagination dots have clear visual states (default, hover, focus, active, disabled). Users must always understand which elements are interactive.
Each pagination dot must visually indicate which slide is currently active.
Navigation must be possible using keyboard, mouse, touch, and assistive technologies at all times.
Users must not be forced to use only arrows or only dots. Both navigation paths (sequential and direct jump) should be fully accessible.
Ensure adequate spacing between navigation elements so that users do not accidentally activate the wrong control—especially important for users with motor impairments.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

For images: If Label 1 or text 1 conveys the meaning of the image (e.g., profile image with Label 1 as the username), set the alt attribute to alt=""
Arrow and dot controls must be interactive elements (e.g., <button>) to ensure built-in accessibility: keyboard support, focusability, and programmatic control.
Each arrow button must have a clear and descriptive accessible name.
Each pagination dot must also have a meaningful accessible name communicating position and state.
Pagination dots must be fully keyboard accessible (with Tab and/or Arrow keys).
Ensure no focus trap exists: users must be able to Tab past the carousel once navigation controls are reached.
Hidden slides must have aria-hidden="true" and be removed from the accessibility tree when offscreen to prevent screen readers from reading multiple slides at once.
If the carousel updates content dynamically, avoid placing aria-live on the entire container, unless essential. Only announce necessary slide changes to avoid verbosity.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSCarouselNavigation` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
