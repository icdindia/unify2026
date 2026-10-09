import { useMemo, useState } from 'react'
import { ShareModal, ShareModalContent, useShareModalData, type ShareModalView } from '../../components/share-modal'
import { ModalButton, ModalSurface, ToastProvider, useToast } from '../../components/overlays'
import { scenarioOf } from '../../fixtures/seeds'
import { INVITES, INVITE_MESSAGE } from '../../fixtures/share'
import { PEOPLE, type PersonId } from '../../fixtures/people'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './share-modal.css'

export const meta: GalleryMeta = {
  title: 'Share modal',
  figmaNodeIds: ['11991:746310', '11933:738629', '1809:446980', '1819:316164', '11991:750142'],
  group: 'Chat',
  description:
    'Share for a chat (chat-artifact 09) or an artifact (share-artifact): invite field with people search, people with ' +
    'access (owner, members with a role menu), general access (Restricted, Everyone at UnifyApps, Anyone with the link), ' +
    'Copy Link, and the invite form (chips, role, Notify people, message). One controlled `view` per designed sub-view. ' +
    '"With fixes" applies share-title-chat and share-owner-persona.',
}

const noop = () => {}

/** Static cards: the views as drawn, without the live modal's layer (the lists under the controls need it). */
function StaticViews() {
  const solo = useShareModalData('chat', useMemo(() => scenarioOf(''), []))
  const shared = useShareModalData('artifact', useMemo(() => scenarioOf('shared-2'), []))
  const link = useShareModalData('artifact', useMemo(() => scenarioOf('shared-2,access-link'), []))
  const invite2 = useMemo(() => ({
    people: [{ id: 'phoenix', name: PEOPLE.phoenix.name, email: PEOPLE.phoenix.email }],
    emails: INVITES[2].flatMap(c => ('email' in c ? [c.email] : [])),
  }), [])
  return (
    <GallerySection title="Views as drawn" description="Static ModalSurface cards (no scrim). The live section below opens the real modal at each view.">
      <Specimens min="lg">
        <Specimen label="chat-artifact 09 · the chat, owner only, Restricted" nodeId="11991:746310">
          <ModalSurface width={440} nodeId="11991:746310" onClose={noop}>
            <ShareModalContent {...solo} view="main" onViewChange={noop} />
          </ModalSurface>
        </Specimen>
        <Specimen label="share-artifact 01 · two commenters" nodeId="1819:316164">
          <ModalSurface width={440} nodeId="1819:316164" onClose={noop}>
            <ShareModalContent {...shared} view="main" onViewChange={noop} onMemberRoleChange={noop} onRemoveMember={noop} />
          </ModalSurface>
        </Specimen>
        <Specimen label="share-artifact 06 · Anyone with the link, Editor" nodeId="1819:316373">
          <ModalSurface width={440} nodeId="1819:316373" onClose={noop}>
            <ShareModalContent {...link} access={{ ...link.access, role: 'Editor' }} view="main" onViewChange={noop} onMemberRoleChange={noop} />
          </ModalSurface>
        </Specimen>
        <Specimen label="share-artifact 08 / 10 · invite form (seed invite-2, notify)" nodeId="11991:750142">
          <ModalSurface width={440} nodeId="11991:750142" onClose={noop}>
            <ShareModalContent {...shared} view="invite" onViewChange={noop} initialInvite={{ ...invite2, notify: true, message: INVITE_MESSAGE }} />
          </ModalSurface>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}

/** The real modal, opened at each view; invites add members, Copy Link and invites toast. */
function Live() {
  const toast = useToast()
  const [open, setOpen] = useState<ShareModalView | null>(null)
  const [view, setView] = useState<ShareModalView>('main')
  const [extra, setExtra] = useState<{ person: PersonId; role: 'Commenter' | 'Editor' }[]>([])
  const [access, setAccess] = useState<'restricted' | 'workspace' | 'link' | undefined>()
  const scenario = useMemo(() => scenarioOf(''), [])
  const data = useShareModalData('chat', scenario, { extraMembers: extra, access })
  const show = (v: ShareModalView) => { setView(v); setOpen(v) }
  return (
    <GallerySection
      title="Live"
      description="Opens over the page with the 25% scrim. Type in the invite field (try “m”): ArrowUp / ArrowDown move through the people, Enter picks one and opens the invite form; Enter in the form adds a typed name or email as a chip. Restricted ⌄ opens the general-access list. Escape closes the open list first, then the modal; focus returns to the button that opened it."
    >
      <div className="shg-live">
        <ModalButton kind="secondary" label="Share chat (09)" data-open="09" onClick={() => show('main')} />
        <ModalButton kind="secondary" label="… with the people search" onClick={() => show('search')} />
        <ModalButton kind="secondary" label="… with general access open" onClick={() => show('access')} />
        <ModalButton kind="secondary" label="… on the invite form" onClick={() => show('invite')} />
      </div>
      <ShareModal
        open={open !== null}
        onClose={() => setOpen(null)}
        {...data}
        view={view}
        onViewChange={setView}
        onAccessChange={setAccess}
        onCopyLink={() => toast.show({ message: 'Link copied' })}
        onMemberRoleChange={(id, role) => setExtra(m => m.map(x => (x.person === id ? { ...x, role } : x)))}
        onRemoveMember={id => setExtra(m => m.filter(x => x.person !== id))}
        onInvite={inv => {
          setExtra(m => [...m, ...inv.people.map(p => ({ person: p.id as PersonId, role: inv.role })).filter(p => !m.some(x => x.person === p.person))])
          toast.show({ message: `Invited ${[...inv.people.map(p => p.name), ...inv.emails].join(', ')}` })
        }}
      />
    </GallerySection>
  )
}

export default function ShareModalGallery() {
  return (
    <ToastProvider gated={false}>
      <StaticViews />
      <Live />
    </ToastProvider>
  )
}
