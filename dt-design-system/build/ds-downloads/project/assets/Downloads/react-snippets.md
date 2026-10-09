# React snippets

## Button

```tsx
import { ODSButton } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSButton } from "@telekom-ods/react-ui-kit/ODSButton";

<ODSButton label="Button" size="large" buttonType="standard" variant="primary" leftIcon={false} rightIcon={false} />
```

## FloatingActionButton

```tsx
import { ODSFloatingActionButton } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFloatingActionButton } from "@telekom-ods/react-ui-kit/ODSFloatingActionButton";

<ODSFloatingActionButton label="" size="large" disabled={false} type="extended" variant="primary" leftIcon={false} />
```

## Link

```tsx
import { ODSLink } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSLink } from "@telekom-ods/react-ui-kit/ODSLink";

<ODSLink label="Link" type="primary" linkType="standard" disabled={false} alignment="left">Content</ODSLink>
```

## SegmentedButton

```tsx
import { ODSSegmentedButton } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSegmentedButton } from "@telekom-ods/react-ui-kit/ODSSegmentedButton";

<ODSSegmentedButton variant="hug" size="large" type="primary" />
```

## Segments

```tsx
import { ODSSegments } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSegments } from "@telekom-ods/react-ui-kit/ODSSegments";

<ODSSegments label="Segments" size="large" type="primary" selected={false} variant="hug" disabled={false} />
```

## Checkbox

```tsx
import { ODSCheckbox } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSCheckbox } from "@telekom-ods/react-ui-kit/ODSCheckbox";

<ODSCheckbox label="Checkbox" size="large" mode="standard" disabled={false} readonly={false} checked={false} />
```

## CheckboxGroup

```tsx
import { ODSCheckboxGroup } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSCheckboxGroup } from "@telekom-ods/react-ui-kit/ODSCheckboxGroup";

<ODSCheckboxGroup size="large" type="standard" />
```

## CheckboxIcon

```tsx
import { ODSCheckboxIcon } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSCheckboxIcon } from "@telekom-ods/react-ui-kit/ODSCheckboxIcon";

<ODSCheckboxIcon size="large" error={false} indeterminate={false} disabled={false} readonly={false} checkmarkIcon={<ODSCheckmark />} />
```

## ChipSet

```tsx
import { ODSChipSet } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSChipSet } from "@telekom-ods/react-ui-kit/ODSChipSet";

<ODSChipSet />
```

## DismissibleChip

```tsx
import { ODSDismissibleChip } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDismissibleChip } from "@telekom-ods/react-ui-kit/ODSDismissibleChip";

<ODSDismissibleChip label="DismissibleChip" variant="withIcon" closeIcon={<ODSClose />} />
```

## DropdownSelect

```tsx
import { ODSDropdownSelect } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDropdownSelect } from "@telekom-ods/react-ui-kit/ODSDropdownSelect";

<ODSDropdownSelect label="DropdownSelect" size="large" disabled={false} readonly={false} items={[]} mode="standard" />
```

## FileUpload

```tsx
import { ODSFileUpload } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFileUpload } from "@telekom-ods/react-ui-kit/ODSFileUpload";

<ODSFileUpload label="FileUpload" subtle={true} showThumbnail={true} type="simple" loading={false} />
```

## FilterChip

```tsx
import { ODSFilterChip } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFilterChip } from "@telekom-ods/react-ui-kit/ODSFilterChip";

<ODSFilterChip label="FilterChip" items={[]} collapseDownIcon={<ODSCollapseDown />} collapseUpIcon={<ODSCollapseUp />} transparentBg={true} />
```

## FilterChipDropdownItem

```tsx
import { ODSFilterChipDropdownItem } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFilterChipDropdownItem } from "@telekom-ods/react-ui-kit/ODSFilterChipDropdownItem";

<ODSFilterChipDropdownItem labelText="Labeltext" value="Value" disabled={false} checkmarkIcon={<ODSCheckmark />} selected={false} />
```

## Search

```tsx
import { ODSSearch } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSearch } from "@telekom-ods/react-ui-kit/ODSSearch";

<ODSSearch listId="Listid" inputText="Inputtext" disabled={false} placeholderText={['Search Something', 'Find Something else']} inputAriaLabel="search" searchIcon={<ODSSearchIcon />} />
```

## Slider

```tsx
import { ODSSlider } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSlider } from "@telekom-ods/react-ui-kit/ODSSlider";

<ODSSlider minTrackLabel={0} maxTrackLabel={130} />
```

## Switch

```tsx
import { ODSSwitch } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSwitch } from "@telekom-ods/react-ui-kit/ODSSwitch";

<ODSSwitch label="Switch" size="large" defaultSelected={false} disabled={false} readonly={false} loading={false} />
```

## SwitchIcon

```tsx
import { ODSSwitchIcon } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSwitchIcon } from "@telekom-ods/react-ui-kit/ODSSwitchIcon";

<ODSSwitchIcon size="large" defaultSelected={false} disabled={false} readonly={false} loading={false} disableFocusVisible={false} />
```

## TextArea

```tsx
import { ODSTextArea } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTextArea } from "@telekom-ods/react-ui-kit/ODSTextArea";

<ODSTextArea labelText="Labeltext" size="large" mode="standard" supportMessage="" showCounter={false} showHandle={true} />
```

## TextField

```tsx
import { ODSTextField } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTextField } from "@telekom-ods/react-ui-kit/ODSTextField";

<ODSTextField labelText="Labeltext" size="large" mode="standard" required={false} disabled={false} readonly={false} />
```

## TimePicker

```tsx
import { ODSTimePicker } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTimePicker } from "@telekom-ods/react-ui-kit/ODSTimePicker";

<ODSTimePicker size="large" disableFuture={false} disablePast={false} maxTime={dayjs().endOf("D").startOf("minute").toDate()} minTime={dayjs().startOf("D").startOf("minute").toDate()} minutesStep={1} />
```

## ToggleChip

```tsx
import { ODSToggleChip } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSToggleChip } from "@telekom-ods/react-ui-kit/ODSToggleChip";

<ODSToggleChip label="ToggleChip" label="ToggleChip" checkmarkIcon={<ODSCheckmark />} showImage={false} transparentBg={true} showPicture={false} />
```

## UploadBox

```tsx
import { ODSUploadBox } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSUploadBox } from "@telekom-ods/react-ui-kit/ODSUploadBox";

<ODSUploadBox title="UploadBox" />
```

## BadgeIcon

```tsx
import { ODSBadgeIcon } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBadgeIcon } from "@telekom-ods/react-ui-kit/ODSBadgeIcon";

<ODSBadgeIcon mode="success" size="large" checkmarkIcon={<ODSCheckmark />} errorIcon={<ODSError />} />
```

## BadgeNumber

```tsx
import { ODSBadgeNumber } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBadgeNumber } from "@telekom-ods/react-ui-kit/ODSBadgeNumber";

<ODSBadgeNumber variant="notification" size="large" />
```

## Banner

```tsx
import { ODSBanner } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBanner } from "@telekom-ods/react-ui-kit/ODSBanner";

<ODSBanner text="Banner" title="Banner" />
```

## Dim

```tsx
import { ODSDim } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDim } from "@telekom-ods/react-ui-kit/ODSDim";

<ODSDim />
```

## InlineNotification

```tsx
import { ODSInlineNotification } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSInlineNotification } from "@telekom-ods/react-ui-kit/ODSInlineNotification";

<ODSInlineNotification text="InlineNotification" title="InlineNotification" />
```

## Popover

```tsx
import { ODSPopover } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSPopover } from "@telekom-ods/react-ui-kit/ODSPopover";

<ODSPopover text="Popover" label="Popover" />
```

## TagDismissible

```tsx
import { ODSTagDismissible } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTagDismissible } from "@telekom-ods/react-ui-kit/ODSTagDismissible";

<ODSTagDismissible label="TagDismissible" type="basic" closeIcon={<ODSClose />} />
```

## TagStatic

```tsx
import { ODSTagStatic } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTagStatic } from "@telekom-ods/react-ui-kit/ODSTagStatic";

<ODSTagStatic label="TagStatic" type="basic" disabled={false} size="standard" />
```

## Toast

```tsx
import { ODSToast } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSToast } from "@telekom-ods/react-ui-kit/ODSToast";

<ODSToast text="Toast" title="Toast" />
```

## Tooltip

```tsx
import { ODSTooltip } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTooltip } from "@telekom-ods/react-ui-kit/ODSTooltip";

<ODSTooltip label="Tooltip" />
```

## Breadcrumb

```tsx
import { ODSBreadcrumb } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBreadcrumb } from "@telekom-ods/react-ui-kit/ODSBreadcrumb";

<ODSBreadcrumb showMoreLabel="Show more paths" getOverflowAriaLabel={func} getItemAriaLabel={func} />
```

## CarouselNavigation

```tsx
import { ODSCarouselNavigation } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSCarouselNavigation } from "@telekom-ods/react-ui-kit/ODSCarouselNavigation";

<ODSCarouselNavigation dots={0} activeIndex={0} loop={false} />
```

## CarouselTimer

```tsx
import { ODSCarouselTimer } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSCarouselTimer } from "@telekom-ods/react-ui-kit/ODSCarouselTimer";

<ODSCarouselTimer segments={2} delay={5000} changeDelay={60} loop={true} enableAssistiveMessage={false} />
```

## FlyoutMenu

```tsx
import { ODSFlyoutMenu } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSFlyoutMenu } from "@telekom-ods/react-ui-kit/ODSFlyoutMenu";

<ODSFlyoutMenu disabled={false} type="flyout" loading={false} loop={false} defaultOpen={false} menuSize={large} />
```

## ProfileMenu

```tsx
import { ODSProfileMenu } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSProfileMenu } from "@telekom-ods/react-ui-kit/ODSProfileMenu";

<ODSProfileMenu loggedIn={false} />
```

## ProfileMenuListItem

```tsx
import { ODSProfileMenuListItem } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSProfileMenuListItem } from "@telekom-ods/react-ui-kit/ODSProfileMenuListItem";

<ODSProfileMenuListItem label="ProfileMenuListItem" />
```

## SideNavigation

```tsx
import { ODSSideNavigation } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSideNavigation } from "@telekom-ods/react-ui-kit/ODSSideNavigation";

<ODSSideNavigation showBottomBar={true} navigationLeftIcon={<ODSNavigationLeft />} menuIcon={<ODSMenu />} />
```

## TabElement

```tsx
import { ODSTabElement } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTabElement } from "@telekom-ods/react-ui-kit/ODSTabElement";

<ODSTabElement text="TabElement" label="TabElement" size="small" variant="hug" selected={false} index={0} />
```

## Tabs

```tsx
import { ODSTabs } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTabs } from "@telekom-ods/react-ui-kit/ODSTabs";

<ODSTabs fallbackMessage="Error! This tab has no children!" size="small" variant="fill" divider={false} />
```

## Accordion

```tsx
import { ODSAccordion } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSAccordion } from "@telekom-ods/react-ui-kit/ODSAccordion";

<ODSAccordion size="large" disabled={false} headingElement="h2" expanded={false} />
```

## ActionCard

```tsx
import { ODSActionCard } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSActionCard } from "@telekom-ods/react-ui-kit/ODSActionCard";

<ODSActionCard />
```

## ChoiceCard

```tsx
import { ODSChoiceCard } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSChoiceCard } from "@telekom-ods/react-ui-kit/ODSChoiceCard";

<ODSChoiceCard />
```

## ContainerCard

```tsx
import { ODSContainerCard } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSContainerCard } from "@telekom-ods/react-ui-kit/ODSContainerCard";

<ODSContainerCard />
```

## Dialog

```tsx
import { ODSDialog } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDialog } from "@telekom-ods/react-ui-kit/ODSDialog";

<ODSDialog headerText="Headertext" headingElement="h2" showCloseButton={true} closeButtonLabel="Close dialog" showTitle={true} stickyButton={true} />
```

## Divider

```tsx
import { ODSDivider } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDivider } from "@telekom-ods/react-ui-kit/ODSDivider";

<ODSDivider variant="vertical" inset={false} spacing={false} />
```

## MapCard

```tsx
import { ODSMapCard } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSMapCard } from "@telekom-ods/react-ui-kit/ODSMapCard";

<ODSMapCard showSearchBar={true} showTitle={true} type="default" showTitleBackButton={true} />
```

## TextBody

```tsx
import { ODSTextBody } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTextBody } from "@telekom-ods/react-ui-kit/ODSTextBody";

<ODSTextBody text="TextBody" />
```

## Avatar

```tsx
import { ODSAvatar } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSAvatar } from "@telekom-ods/react-ui-kit/ODSAvatar";

<ODSAvatar variant="avatar" size="large" showBackground={true} badgeType="number" />
```

## BarChart

```tsx
import { ODSBarChart } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSBarChart } from "@telekom-ods/react-ui-kit/ODSBarChart";

<ODSBarChart barShape="squared" />
```

## DonutChart

```tsx
import { ODSDonutChart } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSDonutChart } from "@telekom-ods/react-ui-kit/ODSDonutChart";

<ODSDonutChart content={[]} type="donut" />
```

## LineChart

```tsx
import { ODSLineChart } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSLineChart } from "@telekom-ods/react-ui-kit/ODSLineChart";

<ODSLineChart options={{ }} showPoints={true} showTooltip={true} pointType="solid" />
```

## Sparkline

```tsx
import { ODSSparkline } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSparkline } from "@telekom-ods/react-ui-kit/ODSSparkline";

<ODSSparkline type="progressBar" percentage={0} size="large" />
```

## Speedometer

```tsx
import { ODSSpeedometer } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSSpeedometer } from "@telekom-ods/react-ui-kit/ODSSpeedometer";

<ODSSpeedometer width={350} height={320} showTopic={true} />
```

## Table

```tsx
import { ODSTable } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTable } from "@telekom-ods/react-ui-kit/ODSTable";

<ODSTable selectable={false} expandable={false} pagination={false} initialPage={0} totalRows={0} pageSizeOptions={[10, 25, 50, 100]} />
```

## TableHeadCell

```tsx
import { ODSTableHeadCell } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTableHeadCell } from "@telekom-ods/react-ui-kit/ODSTableHeadCell";

<ODSTableHeadCell label="TableHeadCell" type="unsorted" alignment="left" showSortIndicator={true} />
```

## TableRowCell

```tsx
import { ODSTableRowCell } from "@telekom-ods/react-ui-kit";
// Next.js: import { ODSTableRowCell } from "@telekom-ods/react-ui-kit/ODSTableRowCell";

<ODSTableRowCell label="TableRowCell" type="label" spacer={false} alignment="left" elementType="td" />
```

