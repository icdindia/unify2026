import { useState, type ReactNode } from 'react'
import {
  ChatHeader, CHAT_HEADER_INSTANCES, CostPill, useAccessPeople, useHeaderPeople, type ChatHeaderProps,
} from '../../components/chat-header'
import { TITLE_MENU_PROJECTS } from '../../components/chat-title-menu'
import { ShareModal, useShareModalData } from '../../components/share-modal'
import { ToastProvider, useToast } from '../../components/overlays'
import { useResolved } from '../../fixtures/drift'
import { scenarioOf } from '../../fixtures/seeds'
import type { PersonId } from '../../fixtures/people'
import { useUiParam } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './chat-header.css'

export const meta: GalleryMeta = {
  title: 'Chat header',
  // literal ids: the gallery suite reads them from this source ('1097:162688' is ES_BREADCRUMB_SET)
  figmaNodeIds: ['1097:162688', '1731:255804', '6424:330601', '1809:365546', '6077:427818', '6077:427883'],
  group: 'Chat',
  description:
    'ES Breadcrumb of a chat: the title with its menu, the collaborator stack (people with access on hover or click), the ' +
    'cost pill, Share (lock until shared, people after), files with its count, comments. Each frame below is drawn at the ' +
    'width of its Figma strip; the Live sheet is a working header. "With fixes" applies title-menu-archive-row, ' +
    'title-hover-keeps-size, header-cost-ring-state, header-files-pressed, header-split-avatars and access-popover-manage.',
  sheets: [{ id: 'default', label: 'Frames as designed' }, { id: 'live', label: 'Live' }],
}

const TITLE = 'How does commit actually look?'
const TEAM: PersonId[] = ['matt-rivera', 'john-whitaker', 'grace-coleman']
const CROWD4: PersonId[] = ['matt-rivera', 'john-whitaker', 'grace-coleman', 'zoe-hart']
const COST: ChatHeaderProps['cost'] = { label: '$1.23', state: 'within', ringAsDrawn: 'approaching' }
const noop = () => {}

/** A strip at its Figma width; the stage is the positioned layer the open menus render into. */
function Frame({ width, height = 40, diff, children }: { width: number; height?: number; diff?: string; children: (layer: HTMLElement | null) => ReactNode }) {
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  return (
    <div className="chg-scroll">
      <div ref={setLayer} className="chg-frame" style={{ width, height }} data-diff={diff}>{layer && children(layer)}</div>
    </div>
  )
}

/**
 * Two sheets: the frames (menus and the access popover pinned open, as drawn) and the live header. They are apart
 * because a pinned popover listens for Escape on the whole page and would take it from the live menus.
 */
export default function ChatHeaderGallery() {
  const [sheet] = useUiParam('sheet')
  return (
    <ToastProvider gated={false}>
      {sheet === 'live' ? <LiveSection /> : (
        <>
          <FramesSection />
          <CostSection />
        </>
      )}
    </ToastProvider>
  )
}

function FramesSection() {
  const team = useHeaderPeople(TEAM)
  const crowd = useHeaderPeople(CROWD4)
  const access = useAccessPeople()
  const projects = useResolved(TITLE_MENU_PROJECTS)
  const titleMenu = (open = false): ChatHeaderProps['titleMenu'] => ({
    open, submenuOpen: open, hoverProject: open ? 1 : undefined, projects, onAction: noop, onOpenChange: noop,
  })
  const rows: { step: string; label: string; width: number; height?: number; props: Partial<ChatHeaderProps> }[] = [
    { step: '03', label: '03 · title menu open, Add to Project › with "Settings" hovered; solo chat (lock)', width: 1384, height: 440, props: { titleMenu: titleMenu(true) } },
    { step: '08', label: '08 · answer complete, rail expanded (1160 wide)', width: 1160, props: {} },
    { step: '10', label: '10 · three people joined: M J G, Share with the people icon, comments', width: 1384, props: { people: team, comments: {} } },
    { step: '15', label: '15 · people with access (hover or click the stack)', width: 1384, height: 260, props: { people: team, access: { people: access, open: true } } },
    { step: '16', label: '16 · files badge "2"', width: 1384, props: { people: team, filesBadge: 2 } },
    { step: '17', label: '17 · files panel open (pressed clipboard)', width: 1384, props: { people: team, filesOpen: true } },
    { step: '19', label: '19 · split chat column 670, files dropdown open', width: 670, props: { variant: 'split', people: team, filesOpen: true } },
    { step: '20', label: '20 · split chat column 440: the title ellipsizes', width: 440, props: { variant: 'split', people: team } },
  ]
  return (
    <GallerySection
      title="Frames as designed"
      description="chat-artifact 03-20 and header-dropdowns c06 / c07, each at the width of its strip (scroll sideways inside a frame on a narrow screen)."
    >
      <Specimens min="lg">
        {rows.map(r => (
          <Specimen key={r.step} label={r.label} nodeId={CHAT_HEADER_INSTANCES[r.step]} wide>
            <Frame width={r.width} height={r.height} diff={r.step}>
              {layer => (
                <ChatHeader title={TITLE} cost={COST} titleMenu={titleMenu()} menuLayer={layer} nodeId={CHAT_HEADER_INSTANCES[r.step]} {...r.props} />
              )}
            </Frame>
          </Specimen>
        ))}
        <Specimen label="c06 · default: M J G Z +5, no chevron" nodeId="6077:427818" wide>
          <Frame width={1384} diff="c06">
            {layer => <ChatHeader title={TITLE} people={crowd} peopleTotal={9} maxPeople={4} shared={false} cost={COST} menuLayer={layer} nodeId="6077:427818" />}
          </Frame>
        </Specimen>
        <Specimen label="c07 · the title hovered" nodeId="6077:427883" wide>
          <Frame width={1384} diff="c07">
            {layer => <ChatHeader title={TITLE} people={crowd} peopleTotal={9} maxPeople={4} shared={false} cost={COST} hover="title" menuLayer={layer} nodeId="6077:427883" />}
          </Frame>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}

function CostSection() {
  return (
    <GallerySection title="Cost pill" description="The ring is a state glyph (cost 01-06): within budget is the dark partial arc, approaching the orange two-thirds ring, over the full red ring. Hover and an open popover fill it bg-tertiary.">
      <Specimens min="sm">
        <Specimen label="within ($0.56)" nodeId="6802:235991"><CostPill label="$0.56" state="within" /></Specimen>
        <Specimen label="approaching ($3.65)" nodeId="6802:236050"><CostPill label="$3.65" state="approaching" /></Specimen>
        <Specimen label="over ($19.45)" nodeId="6802:236066"><CostPill label="$19.45" state="over" /></Specimen>
        <Specimen label="hover" nodeId="6802:236034"><CostPill label="$1.23" state="within" className="is-hover" /></Specimen>
        <Specimen label="chat-artifact as drawn: $1.23, approaching ring" nodeId="1731:255804"><CostPill label="$1.23" state="within" ringAsDrawn="approaching" /></Specimen>
      </Specimens>
    </GallerySection>
  )
}

/** A working header: title menu (actions toast), people with access, Share opens the share modal, files toggle. */
function LiveSection() {
  const toast = useToast()
  const [people, setPeople] = useState<PersonId[]>([])
  const [shareOpen, setShareOpen] = useState(false)
  const [filesOpen, setFilesOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [split, setSplit] = useState(false)
  const team = useHeaderPeople(people)
  const access = useAccessPeople()
  const projects = useResolved(TITLE_MENU_PROJECTS)
  const scenario = useState(() => scenarioOf(''))[0]
  const extra = useState(() => [] as { person: PersonId; role: 'Editor' | 'Commenter' }[])
  const share = useShareModalData('chat', scenario, { extraMembers: extra[0] })
  return (
    <GallerySection
      title="Live"
      description="Click the title (or focus it and press ArrowDown): the menu and its Add to Project submenu work by pointer and keyboard; Escape returns focus to the title. Share opens the share modal: pick people in the invite search (try “m”), Invite, and the stack fills in. Hover the stack for people with access; click pins it."
    >
      <div className="chg-live">
        <label className="chg-toggle"><input type="checkbox" checked={split} onChange={e => setSplit(e.target.checked)} /> Split column</label>
        <div className={split ? 'chg-live__strip chg-live__strip--split' : 'chg-live__strip'}>
          <ChatHeader
            title={TITLE}
            variant={split ? 'split' : 'default'}
            people={team}
            cost={COST}
            filesBadge={filesOpen ? undefined : 2}
            filesOpen={filesOpen}
            titleMenu={{
              projects, pinned,
              onAction: a => {
                if (a.type === 'pin') setPinned(p => !p)
                if (a.type === 'view-files') setFilesOpen(true)
                toast.show({ message: a.type === 'add-to-project' ? `Added to ${a.project}` : `Chat action: ${a.type}` })
              },
            }}
            access={people.length ? { people: access, onManage: () => setShareOpen(true) } : undefined}
            onShare={() => setShareOpen(true)}
            onFiles={() => setFilesOpen(o => !o)}
            onCost={() => toast.show({ message: 'The cost popover is CostPopover (inventory row 37)' })}
          />
        </div>
      </div>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        {...share}
        onCopyLink={() => toast.show({ message: 'Link copied' })}
        onInvite={inv => {
          const ids = inv.people.map(p => p.id as PersonId)
          setPeople(p => [...p, ...ids.filter(id => !p.includes(id))])
          extra[1](m => [...m, ...ids.map(person => ({ person, role: inv.role }))])
          toast.show({ message: `Invited ${[...inv.people.map(p => p.name), ...inv.emails].join(', ')}` })
        }}
      />
    </GallerySection>
  )
}
