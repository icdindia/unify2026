# MapCard

The Map Card component is provided as an optional UI element that can be used within a map interface.

- **ODS name:** `ODSMapCard`
- **Storybook:** Components/Map Card/Map Card
- **Stories:** Default, Returned With Results List, Returned With Single Result, Working Example

## Example (story args)

```tsx
{
  render: args => {
    type DataType = {
      title: string;
      listData: ODSTagStaticProps[];
      id: string;
      distance: string;
    };
    const [list, setList] = useState([] as ODSSearchItemProps[]);
    const [inputValue, setInputValue] = useState("");
    const [results, setResults] = useState<DataType[]>([]);
    const [type, setType] = useState<ODSMapCardType>("default");
    useEffect(() => {
      const debouncedSearch = (value?: string) => {
        setList(!value ? [] : addresses.filter(x => (x.labelText ?? "").toLocaleLowerCase().indexOf(value?.toLocaleLowerCase()) > -1));
      };
      const handler = setTimeout(() => {
        if (inputValue !== "") debouncedSearch(inputValue);else setList([]);
      }, 1000);
      return () => {
        clearTimeout(handler);
      };
    }, [inputValue]);
    const populateResults = () => {
      setResults(staticList);
      setType("returned");
    };
    return <>
        <ODSColumn style={{
        position: "absolute",
        top: "2rem",
        left: "2rem",
        bottom: "2rem"
      }}>
          <ODSMapCard {...args} type={type} showTitleBackButton={false} searchInlineInputProps={{
          labelText: "Search",
          options: list,
          onChange: e => {
            setInputValue(e.target.value);
          },
          onSelectValue: () => {
            populateResults();
          }
        }} slotContent={<ODSMapPreferredContentStoreList>
                {results.map(result => {
            return <ODSMapCardTags key={result.id} icon={<ODSMapBrandIconPreferredContent />} listData={result.listData} showTitleBar showTitleTag tagStaticProps={{
              icon: <ODSLocation />,
              label: result.distance,
              type: "promotion"
            }} title={result.title} />;
          })}
              </ODSMapPreferredContentStoreList>} />
        </ODSColumn>
        <ODSInlineNotification mode="informative" opened showCloseButton={false} text="Start typing 'Street' to see result list" style={{
        position: "absolute",
        bottom: "2rem",
        right: "2rem",
        width: "300px"
      }} />
      </>;
  },
  args: {
    type: "active"
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `showSearchBar` | boolean | true | Defines if search bar should be shown |
| `subtitle` | string | – | Text to be shown in subtitle section |
| `showTitle` | boolean | true | Shows entire title section |
| `actionSlotContent` | ReactNode \| ReactNode[] | – | Slot that can be populated with actions |
| `slotContent` | ReactNode \| ReactNode[] | – | Main slot that can be populated with results |
| `cardTitle` | string | – | Text to be shown as card title |
| `type` | "default" "active" "returned" | "default" | Defines the state of the card. Change to "returned" order to show results |
| `searchInlineInputProps` | ODSInlineSearchProps | – | Props to be applies to ODS Search Inline |
| `dividerProps` | ODSDividerProps | – | Props to be applies to ODS Divider |
| `buttonProps` | ODSButtonProps | – | Props to be applies to back button |
| `tagStaticProps` | ODSTagStaticProps | – | Props to be applies to tag |
| `showTitleBackButton` | boolean | true | Defines if back button bar should be shown |

## What the consumer provides

The ODS React component `ODSMapCard` (props above) or, for static HTML, the markup in this card's preview with `bundle.css` loaded. Colours follow the surrounding theme (`data-theme`) and any `data-scheme` wrapper.
