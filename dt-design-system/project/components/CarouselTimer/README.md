# CarouselTimer

A carousel timer has a double function: The first one is to indicate the amount of elements in a carousel and the second one displays the time left until it changes to the next element. The purpose of a carousel timer is to automatically transition between carousel slides, enhancing user engagement by providing dynamic and continuous content display without requiring manual interaction

- **ODS name:** `ODSCarouselTimer`
- **Storybook:** Components/Carousel Timer
- **Stories:** Example, Integration, Controlled

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | number | 2 | The number of items the timer should display. Suggest max segments is 5. |
| `onSegmentChange` | Fires when the segment moves automatically. Pass null to disable automatic movement. \| null | – | ((activeIndex: number) => void) \| null |
| `onSegmentComplete` | ((index: number) => void) | – | Fires when a progress animation is finished. |
| `activeIndex` | number | – | The index of the active segment, zero-based. |
| `delay` | number | 5000 | The time between each segment, in milliseconds. |
| `changeDelay` | number | 60 | The time after one segment is complete and the next one starts, in milliseconds. |
| `loop` | boolean | true | Loop indefinitely between segments |
| `pause` | boolean | – | Pause the animation |
| `enableAssistiveMessage` | boolean | false | Enable the existence of assistiveMessage for screen readers |
| `assistiveMessage` | ((delay: number, activeIndex: number, total?: number) => string) | ( delay: number, activeIndex: number, total: number ) => { r | Useful for customizing or translating the message for screen readers. |

## Guidelines (from the ODS docs page)

### General

A carousel timer has a double function: The first one is to indicate the amount of elements in a carousel and the second one displays the time left until it changes to the next element. The purpose of a carousel timer is to automatically transition between carousel slides, enhancing user engagement by providing dynamic and continuous content display without requiring manual interaction

When to use:

In auto-advancing carousels where media items change automatically after a predetermined time.

When users need visual feedback on the duration left for the current item and the progress through a sequence of items.

When not to use:

When there is only one element in the carousel
When the elements you want to display are fixed
### Anatomy

### Use Directives

How designers should use the component

### General

Utilise this component for building your carousel. Ensure the carousel includes options for pausing and stopping the timer using buttons and/or gestures.

### Dos and don'ts

Minimum requirements

The carousel requires at least two items to operate effectively, ensuring smooth navigation and continuous flow between slides.

For video content, however, a single item can still use the carousel timer to reflect the video’s duration.

Videos

Videos can be part of a carousel or showcased on their own.

In a carousel with multiple media, the carousel timer referring to a video indicates also the remaining running time of the video in display.

In case of a carousel consisting only of a single video playing in loop, use the single segment carousel timer variant to ensure transparency of the remaining running time of the video in display.

Readability on media

Always make sure the carousel timer is visible when combining with media.

ReadabilityOnMediaDo

Colour restrictions

Can be used on all colour schemes

Can be used on Black colour scheme.

Can be used on Magenta colour scheme.

And on Secondary colour scheme.

Behaviours

How the component will behave in a live environment

Disabled elements

If one of the elements is disabled, it will be removed so that it won't be shown as a part of the timer

Segment duration

The default duration of each segment is set to 5 seconds.

Carousel loop

When all the segments are completed, the timer will start again from the first slide.

Carousel interaction

Native gestures like click, tap, or swipe don’t reliably navigate carousel segments.

Always include a play/pause button. It lets users stop the carousel when they want, reducing distraction and giving them time to read and absorb the content.

Additionally to that, the content type can help determine whether navigation buttons need to be added:

When the content presented along a carousel timer is vital for the user in order to make a decision it is important to include navigation buttons that will allow the user to go to the previous or the next segment.
When the content presented along a carousel timer is promotional you can skip the navigation buttons.
These rules apply both for web and mobile components.

ODS provides only the carousel timer. You are free to implement the control buttons in your design in any way you see fit following the aforementioned rules.

### Component Variants

Status idle

Status in progress

Status complete

### Colour Schemes

How it works (or is restricted) across colour schemes

Neutral

2 Segments
3 Segments
4 Segments
5 Segments
Black

2 Segments
3 Segments
4 Segments
5 Segments
Magenta

2 Segments
3 Segments
4 Segments
5 Segments
Secondary

2 Segments
3 Segments
4 Segments
5 Segments
### Examples

Used on a horizontal card

Used on a vertical card

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

Design considerations

Provide high contrast between the timer segments and the background so that their states (active / inactive / elapsed) are fully perceivable.
Consider users with motion sensitivity: avoid fast or abrupt transitions. Pausing must immediately stop all animation, including progress indicators.
Ensure that users can control autoplay via keyboard, mouse, touch, and assistive technology without friction.
Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

Development considerations

Use role="progressbar" only if the timer communicates meaningful progress. If purely decorative or abstract, avoid additional semantics and use aria-hidden="true".
If role="progressbar" is used, include:
aria-valuemin="0"
aria-valuemax="100"
aria-valuenow="…", dynamically updated
Ensuring updates occur without excessive announcements (avoid aria-live unless necessary).
Do not use aria-live on the progress indicator unless the progress itself is critical. Timer updates every few milliseconds would overwhelm screen readers.
State changes in the Pause/Play button must update the aria-label dynamically with no delay.
Ensure all timer segments have aria-hidden="true" if they are visual-only and not meant for assistive technologies.
Maintain a visible focus ring for the Pause/Play button that meets WCAG contrast and thickness requirements.
The timer must not cause animations that violate WCAG 2.3.1 (three flashes per second). Progress animations should be smooth, non-flashing.
While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSCarouselTimer` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
