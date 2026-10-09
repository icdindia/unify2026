# ProfileMenuSubComponent

The Profile Menu Sub Component component from the ODS web library.

- **ODS name:** `ODSProfileMenuSubComponent`
- **Storybook:** Components/Global Header/Profile Menu/Profile Menu Sub Component
- **Stories:** Not Logged In, Logged In

## Example (story args)

```tsx
<ODSGlobalHeaderProfileMenuHeaderContainer>
  <ODSGlobalHeaderProfileMenuTitle>
    Username
  </ODSGlobalHeaderProfileMenuTitle>
  <ODSGlobalHeaderProfileMenuSubTitle>
    Username@t-online.de
  </ODSGlobalHeaderProfileMenuSubTitle>
</ODSGlobalHeaderProfileMenuHeaderContainer>
<ODSGlobalHeaderProfileMenuListItem
  href="#"
  icon="credit-card-type-standard"
>
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="mail-opened-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="device-tv-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="upload-to-cloud-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="t-product-7-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuLogoutButton />
Copy
```

```tsx
<ODSGlobalHeaderProfileMenuHeaderContainer>
  <ODSGlobalHeaderProfileMenuTitle>
    Username
  </ODSGlobalHeaderProfileMenuTitle>
  <ODSGlobalHeaderProfileMenuSubTitle>
    Username@t-online.de
  </ODSGlobalHeaderProfileMenuSubTitle>
</ODSGlobalHeaderProfileMenuHeaderContainer>
<ODSGlobalHeaderProfileMenuListItem
  href="#"
  icon="credit-card-type-standard"
>
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="mail-opened-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="device-tv-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="upload-to-cloud-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuListItem icon="t-product-7-type-standard">
  Option
</ODSGlobalHeaderProfileMenuListItem>
<ODSGlobalHeaderProfileMenuLogoutButton />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | – |  |
| `children` | object | – |  |
| `loggedIn` | boolean | – | Defines the data rendered based on user logged in status |
| `subtitle` | string | – | Subtitle text |
| `registerLabel` | string | – | Label text over Register link, in case of not-loggedin user |
| `buttonLogoutProps` | ODSButtonProps | – | Props applied to logout button |
| `buttonLoginProps` | ODSButtonProps | – | Props applied to login button |
| `helpWithLoginLinkProps` | ODSLinkProps | – | Props applied to help with login link |
| `registerNowLinkProps` | ODSLinkProps | – | Props applied to register link |

## What the consumer provides

The ODS React component `ODSProfileMenuSubComponent` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
