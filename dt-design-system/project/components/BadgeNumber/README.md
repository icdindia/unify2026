# BadgeNumber

The Badge Number component from the ODS web library.

- **ODS name:** `ODSBadgeNumber`
- **Storybook:** Components/Badge/Badge Number
- **Stories:** Example, Notification, Neutral

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | "notification" \| "neutral" | – |  |
| `variant` | "notification" \| "neutral" | "notification" | contains the value of the BadgeNumber type. |
| `size` | "small" \| "large" \| "standard" | "large" | contains the value of the BadgeNumber size. |
| `notificationNumber` | number | – |  |
| `innerAriaLabel` | string | – | contains the text that represents an ARIA label for the inner content of the ODSBadgeNumber component. |

> Chat Bubble Deprecated Global Header (Deprecated) BottomSheetDeprecated CardNotificationDeprecated CardNotificationStackDeprecated CardProductDeprecated PageHeaderDeprecated

## What the consumer provides

The ODS React component `ODSBadgeNumber` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
