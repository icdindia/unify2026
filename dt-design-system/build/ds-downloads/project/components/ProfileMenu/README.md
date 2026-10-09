# ProfileMenu

The Profile Menu component from the ODS web library.

- **ODS name:** `ODSProfileMenu`
- **Storybook:** Components/Global Header/Profile Menu/Profile Menu
- **Stories:** Logged In, Not Logged In

## Example (story args)

```tsx
<ODSGlobalHeaderProfileMenu
  headerIconButtonAriaLabel="Max status: logged in"
  loggedIn
  userFirstName="Max"
>
  <ODSGlobalHeaderProfileMenuHeaderContainer>
    <ODSGlobalHeaderProfileMenuTitle>Username</ODSGlobalHeaderProfileMenuTitle>
    <ODSGlobalHeaderProfileMenuSubTitle>
      Username@t-online.de
    </ODSGlobalHeaderProfileMenuSubTitle>
  </ODSGlobalHeaderProfileMenuHeaderContainer>
  <ODSGlobalHeaderProfileMenuListItem
    href="https://www.telekom.de/start?gclid=EAIaIQobChMIlePNo7iNhgMVD4xQBh1SYQ4WEAAYASAAEgJtQvD_BwE&wt_cc7=e_telekom&wt_mc=sb_sososoxx_14_ko-gat_377519096_26446146296_697426532849_"
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
  <ODSGlobalHeaderProfileMenuListItem icon="mail-opened-type-standard">
    Option
  </ODSGlobalHeaderProfileMenuListItem>
  <ODSGlobalHeaderProfileMenuListItem icon="device-tv-type-standard">
    Option
  </ODSGlobalHeaderProfileMenuListItem>
  <ODSGlobalHeaderProfileMenuListItem icon="upload-to-cloud-type-standard">
    Option
  </ODSGlobalHeaderProfileMenuListItem>
  <ODSGlobalHeaderProfileMenuLogoutButton />
</ODSGlobalHeaderProfileMenu>
Copy
```

```tsx
<ODSGlobalHeaderProfileMenu
  headerIconButtonAriaLabel="Max status: logged in"
  loggedIn
  userFirstName="Max"
>
  <ODSGlobalHeaderProfileMenuHeaderContainer>
    <ODSGlobalHeaderProfileMenuTitle>Username</ODSGlobalHeaderProfileMenuTitle>
    <ODSGlobalHeaderProfileMenuSubTitle>
      Username@t-online.de
    </ODSGlobalHeaderProfileMenuSubTitle>
  </ODSGlobalHeaderProfileMenuHeaderContainer>
  <ODSGlobalHeaderProfileMenuListItem
    href="https://www.telekom.de/start?gclid=EAIaIQobChMIlePNo7iNhgMVD4xQBh1SYQ4WEAAYASAAEgJtQvD_BwE&wt_cc7=e_telekom&wt_mc=sb_sososoxx_14_ko-gat_377519096_26446146296_697426532849_"
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
  <ODSGlobalHeaderProfileMenuListItem icon="mail-opened-type-standard">
    Option
  </ODSGlobalHeaderProfileMenuListItem>
  <ODSGlobalHeaderProfileMenuListItem icon="device-tv-type-standard">
    Option
  </ODSGlobalHeaderProfileMenuListItem>
  <ODSGlobalHeaderProfileMenuListItem icon="upload-to-cloud-type-standard">
    Option
  </ODSGlobalHeaderProfileMenuListItem>
  <ODSGlobalHeaderProfileMenuLogoutButton />
</ODSGlobalHeaderProfileMenu>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `applicationName` | string | – | Text that presents Application Name |
| `buttonProps` | ODSButtonProps | – | Props applied to close button |
| `trigger` * | ReactElement<any, string \| JSXElementConstructor<any>> | – | Trigger element that opens Profile Menu. Must be a ODSGlobalHeaderMenuButton component |
| `loggedIn` | boolean | false | Defines the layout shown to user, based on whether they are logged in or not |

## What the consumer provides

The ODS React component `ODSProfileMenu` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.

## Use it

```tsx
import { ODSProfileMenu } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSProfileMenu } from "@telekom-ods/react-ui-kit/ODSProfileMenu";

<ODSProfileMenu loggedIn={false} />
```

Static HTML: download **ProfileMenu.html** from Assets › Component pages (markup, DT tokens and the ODS CSS it uses). Everything at once: the kit zip on the DT Design System showcase page.
