import { useRef, useState } from 'react'
import {
  DropdownItem, DropdownMenu, keyboardFocus, menuBelow, menuIcons, relativeBox, type MenuFocus, type MenuPosition,
} from '../../components/dropdown-menu'
import {
  Modal, ModalActions, ModalBody, ModalButton, ModalHeader, ModalSurface, Popover, ToastProvider, Tooltip,
  overlayIcons, useModalLayer, useToast, type ModalScrim,
} from '../../components/overlays'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './overlays-gallery.css'

export const meta: GalleryMeta = {
  title: 'Modal',
  figmaNodeIds: ['11933:738629', '12294:613120', '12024:449614', '1969:507322', '12057:581131', '6802:236145'],
  group: 'Overlays',
  description:
    'Modal Unit, Modal header and Modal actions as the file draws them: 360 / 440 / 960 wide, title in Spectral, back arrow ' +
    'for sub-views, right-aligned or fill-container actions, destructive footers, a 25% scrim. Live: focus stays inside, ' +
    'Escape and the scrim close, focus returns to the button that opened it. "With fixes" applies modal-radius-16 and ' +
    'modal-scrim-black-25.',
}

/** Stand-in for body content another component owns, at the height the frame gives it. */
function Slot({ h, label }: { h: number; label: string }) {
  return <div className="ovg-slot" style={{ height: h }}>{label}</div>
}

const noop = () => {}

export default function ModalGallery() {
  return (
    <ToastProvider gated={false}>
      <GallerySection
        title="Units as drawn"
        description="Static cards at the file's sizes. The grey boxes stand in for body content built by other components (list items, fields), at the height the frame gives it."
      >
        <Specimens min="lg">
          <Specimen label="Delete Artifact: 360, radius 10, Subtext Single line, no X, Destructive" nodeId="12057:581132">
            <ModalSurface width={360} radius={10} nodeId="12057:581132">
              <ModalHeader title="Delete Artifact" subtitle="This will delete the artifact forever. It cannot be undone." hideClose titleWeight="regular" />
              <ModalActions>
                <ModalButton kind="secondary" label="Cancel" />
                <ModalButton kind="destructive" label="Delete" />
              </ModalActions>
            </ModalSurface>
          </Specimen>
          <Specimen label="Publish Artifact (c01): 440, radius 12, back=no" nodeId="1969:507322">
            <ModalSurface width={440} radius={12} nodeId="1969:507322" onClose={noop}>
              <ModalHeader title="Publish Artifact" />
              <ModalBody gap={16}><Slot h={156} label="ARTIFACT URL · VISIBLE TO (List Item xs)" /></ModalBody>
              <ModalActions><ModalButton kind="primary" label="Publish" /></ModalActions>
            </ModalSurface>
          </Specimen>
          <Specimen label="Who can view this? (c02): back=yes" nodeId="1969:507360">
            <ModalSurface width={440} radius={12} nodeId="1969:507360" onClose={noop}>
              <ModalHeader title="Who can view this?" onBack={noop} />
              <ModalBody gap={16}><Slot h={112} label="Everyone at UnifyApps · Restricted" /></ModalBody>
              <ModalActions><ModalButton kind="primary" label="Done" /></ModalActions>
            </ModalSurface>
          </Specimen>
          <Specimen label="Publish Artifact, second time (c11): tertiary Unpublish on the left, Publish hovered" nodeId="11933:737092">
            <ModalSurface width={440} radius={12} nodeId="11933:737092" onClose={noop}>
              <ModalHeader title="Publish Artifact" />
              <ModalBody gap={16}><Slot h={156} label="ARTIFACT URL · VISIBLE TO" /></ModalBody>
              <ModalActions leading={<ModalButton kind="tertiary" icon={overlayIcons.slashCircle} label="Unpublish" />}>
                <ModalButton kind="secondary" label="Cancel" />
                <ModalButton kind="primary" label="Publish" className="is-hover" />
              </ModalActions>
            </ModalSurface>
          </Specimen>
          <Specimen label="Share Artifact (1819:316164): Modal Unit 440, radius 16, full-width Copy Link" nodeId="11991:747113">
            <ModalSurface width={440} nodeId="11991:747113" onClose={noop}>
              <ModalHeader title="Share Artifact" />
              <ModalBody gap={24}><Slot h={328} label="Invite field · People with access · General access" /></ModalBody>
              <ModalActions align="fill">
                <ModalButton kind="secondary" size="md" icon={overlayIcons.link01} label="Copy Link" fill />
              </ModalActions>
            </ModalSurface>
          </Specimen>
          <Specimen label="Ask for more Usage (cost 08): Size=sm, divider, note on the left, md buttons" nodeId="6802:236146">
            <ModalSurface width={440} size="sm" nodeId="6802:236146" onClose={noop}>
              <ModalHeader title="Ask for more Usage" subtitle="You have used $250 of $250 this month." divider />
              <ModalBody gap={24}><Slot h={200} label="How much more · Why" /></ModalBody>
              <ModalActions leading={<span className="ovg-note">Goes to your workspace admin</span>}>
                <ModalButton kind="secondary" label="Cancel" />
                <ModalButton kind="primary" label="Send" />
              </ModalActions>
            </ModalSurface>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Modal header" description="Set 12294:613120. Type × Size × back. The X is Buttons/Button Neutral md tertiary icon-only; back is Small Icon Button lg.">
        <Specimens min="lg">
          <Specimen label="Type=Default, Size=xs, back=no" nodeId="12294:613127">
            <ModalSurface onClose={noop}><ModalHeader title="Publish Artifact" /></ModalSurface>
          </Specimen>
          <Specimen label="Type=Default, Size=xs, back=yes" nodeId="12294:613128">
            <ModalSurface onClose={noop}><ModalHeader title="Who can view this?" onBack={noop} /></ModalSurface>
          </Specimen>
          <Specimen label="Type=Subtext Single line, Size=xs, back=no" nodeId="12294:613123">
            <ModalSurface onClose={noop}><ModalHeader title="Delete Artifact" subtitle="This will delete the artifact forever." /></ModalSurface>
          </Specimen>
          <Specimen label="Type=Subtext Single line, Size=xs, back=yes" nodeId="12294:613124">
            <ModalSurface onClose={noop}><ModalHeader title="Restricted" subtitle="Only the people and groups you choose" onBack={noop} /></ModalSurface>
          </Specimen>
          <Specimen label="Type=Default, Size=sm, back=no" nodeId="12294:613125">
            <ModalSurface size="sm" onClose={noop}><ModalHeader title="Ask for more Usage" /></ModalSurface>
          </Specimen>
          <Specimen label="Type=Subtext Single line, Size=sm, back=yes, divider" nodeId="12294:613122">
            <ModalSurface size="sm" onClose={noop}><ModalHeader title="Ask for more Usage" subtitle="You have used $250 of $250 this month." onBack={noop} divider /></ModalSurface>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Modal actions" description="Set 12024:449614. Right aligned (with an optional left slot: checkbox, note or tertiary button) or fill container; xs = 28px buttons, sm = 32px.">
        <Specimens min="lg">
          <Specimen label="Horizontal right aligned, Size=xs, Destructive=False" nodeId="12024:449645">
            <ModalSurface><ModalActions><ModalButton kind="secondary" label="Cancel" /><ModalButton kind="primary" label="Invite" /></ModalActions></ModalSurface>
          </Specimen>
          <Specimen label="Horizontal right aligned, Size=xs, Destructive=True" nodeId="12024:449651">
            <ModalSurface><ModalActions><ModalButton kind="secondary" label="Cancel" /><ModalButton kind="destructive" label="Delete" /></ModalActions></ModalSurface>
          </Specimen>
          <Specimen label="Horizontal right aligned, left slot (Copy Link, share 08)" nodeId="1819:316471">
            <ModalSurface>
              <ModalActions leading={<ModalButton kind="tertiary" icon={overlayIcons.link01} label="Copy Link" />}>
                <ModalButton kind="secondary" label="Cancel" /><ModalButton kind="primary" label="Invite" />
              </ModalActions>
            </ModalSurface>
          </Specimen>
          <Specimen label="Horizontal fill container, Size=xs, Destructive=True" nodeId="12024:449641">
            <ModalSurface width={344}><ModalActions align="fill"><ModalButton kind="secondary" label="Cancel" /><ModalButton kind="destructive" label="Delete" /></ModalActions></ModalSurface>
          </Specimen>
          <Specimen label="Horizontal right aligned, Size=sm, Divider=Yes" nodeId="12024:449623">
            <ModalSurface size="sm"><ModalActions divider><ModalButton kind="secondary" label="Cancel" /><ModalButton kind="primary" label="Send" /></ModalActions></ModalSurface>
          </Specimen>
          <Specimen label="Disabled primary (Send before a reason is typed)">
            <ModalSurface size="sm"><ModalActions><ModalButton kind="secondary" label="Cancel" /><ModalButton kind="primary" label="Send" disabled /></ModalActions></ModalSurface>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Footer buttons" description="ModalButton: Button Brand Primary, Button Neutral Secondary / Tertiary, Button Error Primary at sm (28) and md (32), each Default / Hover / Disabled.">
        <Specimens min="md">
          {(['primary', 'secondary', 'destructive', 'tertiary'] as const).map(kind => (
            <Specimen key={kind} label={kind} surface="primary">
              <div className="ovg-grid">
                {(['sm', 'md'] as const).map(size => (
                  <div key={size} className="ovg-row">
                    <ModalButton kind={kind} size={size} label="Default" />
                    <ModalButton kind={kind} size={size} label="Hover" className="is-hover" />
                    <ModalButton kind={kind} size={size} label="Disabled" disabled />
                  </div>
                ))}
              </div>
            </Specimen>
          ))}
        </Specimens>
      </GallerySection>

      <GallerySection
        title="Live"
        description="Real modals: Tab and Shift+Tab stay inside, Escape closes (an open menu, popover or tooltip inside closes first), a press on the scrim closes, focus goes back to the button that opened it. When that button is disabled or gone by then (Delete Q3 Forecast, a deleted row), focus goes to the next control where it was, never to the page body; closing two nested modals at once returns to the first one's button."
      >
        <div className="ovg-live">
          <PublishDemo />
          <DeleteDemo />
          <SettingsDemo />
          <MenuInModalDemo />
          <NestedDemo />
          {(['black-25', 'slate-25', 'slate-35'] as ModalScrim[]).map(s => <ScrimDemo key={s} scrim={s} />)}
        </div>
        <RowsDemo />
      </GallerySection>
    </ToastProvider>
  )
}

/** First-time publish: main view and the "Who can view this?" sub-view with a back arrow (publish-artifact c01, c02). */
function PublishDemo() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'main' | 'visibility'>('main')
  const [who, setWho] = useState<'everyone' | 'restricted'>('everyone')
  const toast = useToast()
  const close = () => { setOpen(false); setView('main') }
  return (
    <>
      <ModalButton kind="secondary" label="Publish Artifact…" onClick={() => setOpen(true)} />
      <Modal open={open} onClose={close} width={440} radius={12} viewKey={view} nodeId={view === 'main' ? '1969:507322' : '1969:507360'}>
        {view === 'main' ? (
          <>
            <ModalHeader title="Publish Artifact" />
            <ModalBody gap={16}>
              <div className="ovg-field"><span className="ovg-label">ARTIFACT URL</span><code>pipeline-command</code></div>
              <div className="ovg-field">
                <span className="ovg-label">VISIBLE TO</span>
                <button type="button" className="ovg-choice" onClick={() => setView('visibility')}>
                  {who === 'everyone' ? 'Everyone at UnifyApps' : 'Restricted'} ›
                </button>
              </div>
            </ModalBody>
            <ModalActions>
              <ModalButton kind="primary" label="Publish" onClick={() => { close(); toast.show({ message: 'Pipeline Command is published' }) }} />
            </ModalActions>
          </>
        ) : (
          <>
            <ModalHeader title="Who can view this?" onBack={() => setView('main')} />
            <ModalBody gap={16}>
              <div role="radiogroup" aria-label="Who can view this?" className="ovg-field">
                {(['everyone', 'restricted'] as const).map(v => (
                  <button key={v} type="button" role="radio" aria-checked={who === v} className="ovg-choice" onClick={() => setWho(v)}>
                    {v === 'everyone' ? 'Everyone at UnifyApps' : 'Restricted'} {who === v ? '●' : '○'}
                  </button>
                ))}
              </div>
            </ModalBody>
            <ModalActions><ModalButton kind="primary" label="Done" onClick={() => setView('main')} /></ModalActions>
          </>
        )}
      </Modal>
    </>
  )
}

/** Delete Artifact (artifacts-landing 06) with the Undo toast of Q57. */
function DeleteDemo() {
  const [open, setOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const toast = useToast()
  return (
    <>
      <ModalButton kind="secondary" label={deleted ? 'Q3 Forecast (deleted)' : 'Delete Q3 Forecast…'} disabled={deleted} onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} width={360} radius={10} scrim="slate-25" nodeId="12057:581132">
        <ModalHeader title="Delete Artifact" subtitle="This will delete the artifact forever. It cannot be undone." hideClose titleWeight="regular" />
        <ModalActions>
          <ModalButton kind="secondary" label="Cancel" onClick={() => setOpen(false)} />
          <ModalButton
            kind="destructive" label="Delete"
            onClick={() => {
              setOpen(false)
              setDeleted(true)
              toast.show({ id: 'delete', message: 'Q3 Forecast deleted', action: { label: 'Undo', onClick: () => setDeleted(false) } })
            }}
          />
        </ModalActions>
      </Modal>
    </>
  )
}

/** The 960 x 720 Settings size (new-memory 03): the body scrolls, header and actions stay. */
function SettingsDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ModalButton kind="secondary" label="Settings (960 × 720)…" onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} width={960} height={720} size="sm" scrim="slate-35" nodeId="10112:408460">
        <ModalHeader title="Memory" subtitle="Generate memory from chats" />
        <ModalBody gap={24}>
          {Array.from({ length: 14 }, (_, i) => <Slot key={i} h={72} label={`Memory item ${i + 1}`} />)}
        </ModalBody>
        <ModalActions><ModalButton kind="primary" label="Done" onClick={() => setOpen(false)} /></ModalActions>
      </Modal>
    </>
  )
}

/** A role menu, a popover and a tooltip inside a modal: each closes on Escape before the modal does. */
function MenuInModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ModalButton kind="secondary" label="Menu, popover and tooltip in a modal…" onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} width={440}>
        <ModalHeader title="Share Artifact" />
        <ModalBody gap={16}><InsideModal /></ModalBody>
        <ModalActions>
          <ModalButton kind="secondary" label="Cancel" onClick={() => setOpen(false)} />
          <ModalButton kind="primary" label="Invite" onClick={() => setOpen(false)} />
        </ModalActions>
      </Modal>
    </>
  )
}

function InsideModal() {
  const layer = useModalLayer()
  const [role, setRole] = useState('Commenter')
  const [menu, setMenu] = useState<MenuPosition | null>(null)
  const [pop, setPop] = useState(false)
  const roleBtn = useRef<HTMLButtonElement>(null)
  const popBtn = useRef<HTMLButtonElement>(null)
  const toggleMenu = () => {
    if (menu || !roleBtn.current || !layer) return setMenu(null)
    setMenu(menuBelow(relativeBox(roleBtn.current, layer), 170))
  }
  return (
    <div className="ovg-field">
      <div className="ovg-row">
        <button ref={roleBtn} type="button" className="ovg-choice" aria-haspopup="menu" aria-expanded={!!menu} onClick={toggleMenu}>
          Candice Wu · {role} ˅
        </button>
        <Tooltip text="People who can see the chat" arrow="bottom-center">
          <button ref={popBtn} type="button" className="ovg-choice" aria-expanded={pop} onClick={() => setPop(p => !p)}>Who has access</button>
        </Tooltip>
      </div>
      {menu && (
        <DropdownMenu position={menu} width={170} portalTo={layer} anchor={roleBtn.current} onClose={() => setMenu(null)} aria-label="Role">
          {['Editor', 'Commenter', 'Viewer'].map(r => (
            <DropdownItem key={r} label={r} onClick={() => { setRole(r); setMenu(null) }} />
          ))}
        </DropdownMenu>
      )}
      <Popover open={pop} anchor={popBtn.current} onClose={() => setPop(false)} placement="bottom-end" aria-label="People with access">
        <ul className="ovg-pop-list">
          <li>Roger Bennett (you) · Owner</li>
          <li>Candice Wu · {role}</li>
          <li>Natali Craig · Commenter</li>
        </ul>
      </Popover>
    </div>
  )
}

/** A modal that opens a second one; "Close both" closes them together and focus returns to the first one's button. */
function NestedDemo() {
  const [outer, setOuter] = useState(false)
  const [inner, setInner] = useState(false)
  return (
    <>
      <ModalButton kind="secondary" label="Nested modals…" onClick={() => setOuter(true)} />
      <Modal open={outer} onClose={() => setOuter(false)} width={440}>
        <ModalHeader title="Publish Artifact" />
        <ModalBody gap={16}>
          <button type="button" className="ovg-choice" onClick={() => setInner(true)}>Who can view this? ›</button>
        </ModalBody>
        <ModalActions><ModalButton kind="secondary" label="Cancel" onClick={() => setOuter(false)} /></ModalActions>
        <Modal open={inner} onClose={() => setInner(false)} width={360}>
          <ModalHeader title="Who can view this?" subtitle="A second modal on top of the first." />
          <ModalActions>
            <ModalButton kind="secondary" label="Back" onClick={() => setInner(false)} />
            <ModalButton kind="primary" label="Close both" onClick={() => { setInner(false); setOuter(false) }} />
          </ModalActions>
        </Modal>
      </Modal>
    </>
  )
}

const ROWS = ['Q3 Forecast', 'Pipeline Command', 'Hiring Plan']

/** Rows with a ⋯ menu: Delete… opens a confirm that removes the row, so the button that opened it is gone. */
function RowsDemo() {
  const [rows, setRows] = useState(ROWS)
  const [menu, setMenu] = useState<{ row: string; anchor: HTMLElement; pos: MenuPosition; focus?: MenuFocus } | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const remove = (row: string) => {
    const before = rows
    setRows(rows.filter(r => r !== row))
    toast.show({ id: 'row-delete', message: `${row} deleted`, action: { label: 'Undo', onClick: () => setRows(before) } })
  }
  return (
    <div className="ovg-field ovg-narrow">
      <span className="ovg-label">ROWS (Delete… removes the row)</span>
      <div ref={box} style={{ position: 'relative' }}>
        <ul className="ovg-pop-list">
          {rows.map(row => (
            <li key={row} className="ovg-row">
              <span>{row}</span>
              <button
                type="button" className="ovg-choice" aria-label={`Actions for ${row}`} aria-haspopup="menu" aria-expanded={menu?.row === row}
                onClick={e => {
                  if (menu?.row === row || !box.current) return setMenu(null)
                  const anchor = e.currentTarget
                  setMenu({ row, anchor, pos: menuBelow(relativeBox(anchor, box.current), 140), focus: keyboardFocus(e) })
                }}
              >⋯</button>
            </li>
          ))}
          {!rows.length && <li><button type="button" className="ovg-choice" onClick={() => setRows(ROWS)}>Restore rows</button></li>}
        </ul>
        {menu && (
          <DropdownMenu
            position={menu.pos} width={140} shadow="small" autoFocus={menu.focus} anchor={menu.anchor}
            onClose={() => setMenu(null)} aria-label={`${menu.row} actions`}
          >
            <DropdownItem icon={menuIcons.trash} label="Delete…" danger onClick={() => { setConfirm(menu.row); setMenu(null) }} />
          </DropdownMenu>
        )}
      </div>
      <Modal open={confirm !== null} onClose={() => setConfirm(null)} width={360} radius={10} scrim="slate-25">
        <ModalHeader title={`Delete ${confirm ?? ''}`} subtitle="This will delete the artifact forever. It cannot be undone." hideClose titleWeight="regular" />
        <ModalActions>
          <ModalButton kind="secondary" label="Cancel" onClick={() => setConfirm(null)} />
          <ModalButton kind="destructive" label="Delete" onClick={() => { if (confirm) remove(confirm); setConfirm(null) }} />
        </ModalActions>
      </Modal>
    </div>
  )
}

function ScrimDemo({ scrim }: { scrim: ModalScrim }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ModalButton kind="tertiary" label={`Scrim ${scrim}`} onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} width={360} scrim={scrim}>
        <ModalHeader title={`Scrim ${scrim}`} subtitle="Press Escape or the scrim to close." />
        <ModalActions><ModalButton kind="primary" label="Close" onClick={() => setOpen(false)} /></ModalActions>
      </Modal>
    </>
  )
}
