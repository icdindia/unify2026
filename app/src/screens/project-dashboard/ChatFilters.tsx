import { ButtonGroup, FilterButton, cx, toolbarIcons } from '../../components'
import { useProjectFixes } from '../../fixes/projects'

export type ChatFiltersProps = {
  /** Review harness only (?state=frame): draw "All Chats" in the hover state the frame draws. */
  pinnedHover?: boolean
}

/**
 * Inside page option 1, right of the tabs: the chats filter ("All Chats") and sort ("Newest"). Neither has a designed
 * menu yet, so they only have a hover state.
 *
 * As designed: Buttons/Button Neutral, Tertiary, md dropdowns, label + chevron-down-sm, 2px apart, centred on the
 * 32px tab strip. Three fixes (src/fixes/projects.ts) restyle them, each on its own:
 *   filter-sort-icons      leading filter / sort icon instead of the chevron (FilterButton)
 *   filter-sort-tab-specs  the tabs' _Tab base Size=sm specs, 8px apart
 *   filter-sort-aligned    centred on the tab labels' 28px box
 */
export function ChatFilters({ pinnedHover }: ChatFiltersProps) {
  const fx = useProjectFixes()
  const icons = fx('filter-sort-icons')
  const hover = pinnedHover ? 'is-hover' : undefined
  return (
    <ButtonGroup
      className={cx(
        'pd__filters',
        fx('filter-sort-tab-specs') && 'pd__filters--tabspec',
        fx('filter-sort-aligned') && 'pd__filters--aligned',
      )}
    >
      {icons ? (
        <>
          <FilterButton icon={toolbarIcons.filter14} label="All Chats" aria-label="Filter chats: All Chats" className={hover} />
          <FilterButton icon={toolbarIcons.sort14} label="Newest" aria-label="Sort chats: Newest first" />
        </>
      ) : (
        <>
          {/* the file's text box is 55px: "All Chats " with a trailing space, kept by white-space: pre */}
          <button type="button" className={cx('fbtn', hover)} aria-label="Filter chats: All Chats">
            <span className="fbtn__t fbtn__t--allchats">{'All Chats '}</span>
            <span className="fbtn__c" aria-hidden="true" />
          </button>
          <button type="button" className="fbtn fbtn--pl12" aria-label="Sort chats: Newest first">
            <span className="fbtn__t">Newest</span>
            <span className="fbtn__c" aria-hidden="true" />
          </button>
        </>
      )}
    </ButtonGroup>
  )
}
