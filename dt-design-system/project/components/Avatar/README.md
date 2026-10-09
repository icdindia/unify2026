# Avatar

The avatar with image is a representation of a specific user. In the fill section of the component you can swap in the correct image.

- **ODS name:** `ODSAvatar`
- **Storybook:** Components/Avatar
- **Stories:** Example, Number Avatar, Icon Avatar

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | "avatar" \| "icon" \| "initials" | "avatar" | contains the value of the Avatar variant. |
| `size` | "small" \| "large" \| "medium" | "large" | contains the value of the Avatar size. |
| `showBackground` | boolean | true | controls the visibility of the Avatar background. |
| `showBadge` | boolean | – | controls the visibility of the Avatar Badge. |
| `badgeType` | "number" \| "icon" | "number" |  |
| `icon` | ReactNode | – |  |
| `name` | string | – |  |
| `imageProps` | image \| variant \| avatar | – | ImgHTMLAttributes<HTMLImageElement> |
| `badgeIconProps` | ODSBadgeIconProps | – |  |
| `badgeNumberProps` | ODSBadgeNumberProps | – |  |

## Guidelines (from the ODS docs page)

### Anatomy

### Use Directives

How designers should use the component

Variants

Profile avatar

The avatar with image is a representation of a specific user. In the fill section of the component you can swap in the correct image.

Icon avatar

If an image is not available then use the avatar with icon. This can also be used for other types of avatar’s such as notifications.

Initials avatar

The avatar with initials should be used when the user already has a profile but hasn't uploaded a picture yet.

Badge types

Avatar with badges

The avatar also has the option of including a badge notification icon.The badge could be an icon badge or a number badge.

The avatar with the number badge variant should be used to display notifications to the user and the number can go up to 999+, although it's not recommended to use three digit values in a badge.

The avatar with the icon badge variant should be used to display success/error or an unique icon, when needed.

Badge position

The badge should always remain on the upper right side of the avatar.

Avatar / Badge size proportion

Although it is available in the properties for the avatar component, the badge size should always match the avatar size. If the avatar is set to the Large variant, then the badge should also be set to the Large variant. The availability to change each size separately is there due to a Figma limitation which doesn't allow some properties to be made unavailable, which would make sense in a design system where components are reusable.

Sizes

Available sizes

Avatar comes in three sizes and they should follow context and available space. The small size avatar comes also with a small size badge, which is just a hint to the user that there's something they should check.

Size choice

Be mindful while choosing the appropriate size.

Background

Avatar background

The icon and the initials avatar have the background colour as an optional boolean, which could be turned on and off, depending on the use case.

Other dos and dont's

Background colour

Don't change the background colour.

Icon usage

Use icons that are immediately understandable by the user.

Circular shape

The avatar should never change its circular shape.

Colour restrictions

On magenta colour scheme, the success/error variant of the icon avatar with badge should not be used.

On secondary colour scheme, the success/error variant of the icon avatar with badge should not be used.

Behaviours

How the component will behave in a live environment

Fixed sizes

Avatars don't scale to fit layouts. The avatar is built with a fixed widths and heights.

### Component Variants

Avatar with number badge - notification and neutral

Avatar with icon badge - success and error

### Colour Schemes

White

12

11

9
8
EM
6
EM
5
E

3

2

1
2
EM
4
EM
5
E

EM

EM

E

EM

EM

E

Black

12

11

9
8
EM
6
EM
5
E

3

2

1
2
EM
4
EM
5
E

EM

EM

E

EM

EM

E

Magenta

Only the badge number variation works on Magenta.
The badge icon variation is restricted on Magenta.

12

11

9
8
EM
6
EM
5
E

3

2

1
2
EM
4
EM
5
E
Secondary

Only the badge number variation works on Secondary.
The badge icon variation is restricted on Secondary.

12

11

9
8
EM
6
EM
5
E

3

2

1
2
EM
4
EM
5
E
### Examples

Avatar on Headers

You may use the avatar to personalise the experience.

### Accessibility

This OneDS component is compliant with WCAG 2.2 AA Standards.

Key considerations for keyboard interactions and screen readers are included. Additionally, all components meet requirements for the contrast ratios.

No further design and development considerations required.

Refer to the AX annotation guide for detailed designer instructions on accessibility annotations.

While this individual component is accessible, building fully usable interfaces requires further attention. For guidance, refer to our OneExperience accessibility resources.

## What the consumer provides

The ODS React component `ODSAvatar` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
