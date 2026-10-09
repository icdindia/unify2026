import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../buttons/cx'
import { Avatar, type AvatarColour } from '../avatar/Avatar'
import { DropdownItem, DropdownMenu, DropdownSeparator, keyboardFocus, menuBelow, menuIcons, relativeBox, type MenuFocus, type MenuPosition } from '../dropdown-menu'
import { InputField, Checkbox, Textarea, TagsField, isImeKey, type TagsFieldItem } from '../form'
import { OptionMenu, nextOptionId, optionDomId, type OptionMenuOption } from '../option-menu/OptionMenu'
import { Modal, ModalActions, ModalBody, ModalButton, ModalHeader, overlayIcons, useModalLayer } from '../overlays'
import { Building16, ChevronDown14Md, Globe16, Lock16 } from '../chat-header/icons'
import './share-modal.css'

// Share modal (inventory row 55). Built for chat-artifact 09 (the chat's Share, Modal Unit 11991:746310) and shaped for
// the wave 4 share journeys (share-artifact 01-10, add-users 02-11): one controlled `view` per designed sub-view
// (URL modal=share, share>search, share>access, share>invite, share>role:<id>), data in, intents out.
//
//   main    access list: invite field, PEOPLE WITH ACCESS, GENERAL ACCESS, Copy Link                    (09, share 01)
//   search  main + the people search under the invite field                                          (share 07)
//   access  main + the general-access menu under "Restricted"                                         (share 03)
//   invite  back arrow, chips + role, Notify people, message, Copy Link / Cancel / Invite             (share 08)
// The role menu of a member row (share 02) opens from its role button over any main view.

export type ShareRole = 'Owner' | 'Editor' | 'Commenter' | 'Viewer'
export type InviteRole = 'Commenter' | 'Editor'
export type ShareGeneralAccess = 'restricted' | 'workspace' | 'link'
export type ShareModalView = 'main' | 'search' | 'access' | 'invite'

/** A person the modal can show (resolve names and fills with the fixtures' person / avatarOn(id, 'share')). */
export type SharePerson = { id: string; name: string; email?: string; initial?: string; colour?: AvatarColour }
export type ShareMemberRow = SharePerson & { role: ShareRole; you?: boolean }

export type ShareInvite = {
  people: SharePerson[]
  /** Free-typed addresses (Q37: they become chips). */
  emails: string[]
  role: InviteRole
  notify: boolean
  message: string
}

export type ShareModalProps = {
  open: boolean
  /** Escape, the X, the scrim. */
  onClose: () => void
  /** "Share Artifact" as drawn on the chat (fix share-title-chat: "Share chat"); resolve SHARE_TITLE first. */
  title: string
  /** People with access, owner first (fixtures shareFor(scenario, target).members, resolved). */
  members: ShareMemberRow[]
  /** The general access line (shareFor(...).access, resolved). `role` draws the role button beside workspace / link access. */
  access: { id: ShareGeneralAccess; label: string; description: string; role?: InviteRole }
  /** Rows of the general-access menu (fixtures GENERAL_ACCESS: label + menuDescription). */
  accessOptions?: { id: ShareGeneralAccess; label: string; description: string }[]
  onAccessChange?: (id: ShareGeneralAccess) => void
  /** People the invite search offers (fixtures PEOPLE_SEARCH plus the chat's colleagues). Members are left out. */
  directory: SharePerson[]
  /** Role menu rows (fixtures roleOptions(target), resolved). */
  roleOptions?: { role: InviteRole; description: string }[]
  onInvite?: (invite: ShareInvite) => void
  onCopyLink?: () => void
  onMemberRoleChange?: (personId: string, role: InviteRole) => void
  onRemoveMember?: (personId: string) => void
  /** Controlled sub-view (URL). Uncontrolled when omitted. */
  view?: ShareModalView
  onViewChange?: (view: ShareModalView) => void
  /** Seed the invite view (seed invite-2 / invite-5, notify). */
  initialInvite?: Partial<Omit<ShareInvite, 'role'>> & { role?: InviteRole }
  /** Figma node of the Modal Unit instance (chat-artifact 09: 11991:746310). */
  nodeId?: string
}

const DEFAULT_ROLES: { role: InviteRole; description: string }[] = [
  { role: 'Commenter', description: 'Comment and view project' },
  { role: 'Editor', description: 'Chat and edit project' },
]

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

/** Share modal: the access list, people search, general access and the invite form. Built on Modal + OptionMenu + form. */
export function ShareModal({ open, onClose, nodeId, view: viewProp, onViewChange, ...content }: ShareModalProps) {
  const [ownView, setOwnView] = useState<ShareModalView>('main')
  const view = viewProp ?? ownView
  const setView = (v: ShareModalView) => { if (viewProp === undefined) setOwnView(v); onViewChange?.(v) }
  useEffect(() => { if (!open) setOwnView('main') }, [open])
  return (
    <Modal open={open} onClose={onClose} width={440} viewKey={view === 'invite' ? 'invite' : 'main'} nodeId={nodeId ?? '11991:746310'}>
      <ShareModalContent {...content} view={view} onViewChange={setView} />
    </Modal>
  )
}

export type ShareModalContentProps = Omit<ShareModalProps, 'open' | 'onClose' | 'nodeId' | 'view' | 'onViewChange'> & {
  view: ShareModalView
  onViewChange: (view: ShareModalView) => void
}

/**
 * The modal's header, body and actions without the Modal around them: ShareModal renders it in a live Modal; the gallery
 * renders it in a static ModalSurface. The invite form's state lives here, so Back keeps it and every opening (a fresh
 * mount) starts from `initialInvite`. The lists hung under the invite field and the general-access selector need the
 * live modal's layer, so a static surface draws the views without them.
 */
export function ShareModalContent(props: ShareModalContentProps) {
  const { view, onViewChange: setView, initialInvite: seed } = props
  const [chips, setChips] = useState<TagsFieldItem[]>(() => (seed ? [...(seed.people ?? []).map(personChip), ...(seed.emails ?? []).map(emailChip)] : []))
  const [role, setRole] = useState<InviteRole>(seed?.role ?? 'Commenter')
  const [notify, setNotify] = useState(seed?.notify ?? false)
  const [message, setMessage] = useState(seed?.message ?? '')
  const people = useMemo(() => new Map(props.directory.map(p => [p.id, p])), [props.directory])

  const startInvite = (p: SharePerson) => {
    setChips(c => (c.some(x => x.id === p.id) ? c : [...c, personChip(p)]))
    setView('invite')
  }
  const invite = () => {
    const picked = chips.map(c => people.get(c.id)).filter((p): p is SharePerson => !!p)
    const emails = chips.filter(c => c.id.startsWith('email:')).map(c => c.label)
    props.onInvite?.({ people: picked, emails, role, notify, message })
    setChips([])
    setMessage('')
    setNotify(false)
    setView('main')
  }

  return view === 'invite' ? (
    <InviteView
      {...props}
      chips={chips} setChips={setChips} role={role} setRole={setRole} notify={notify} setNotify={setNotify}
      message={message} setMessage={setMessage}
      onBack={() => setView('main')} onCancel={() => { setChips([]); setView('main') }} onInvite={invite}
    />
  ) : (
    <MainView {...props} view={view} setView={setView} onPick={startInvite} />
  )
}

const personChip = (p: SharePerson): TagsFieldItem => ({ id: p.id, label: p.name, avatar: { name: p.name, initial: p.initial } })
const emailChip = (e: string): TagsFieldItem => ({ id: `email:${e}`, label: e, avatar: { name: e } })

// ------------------------------------------------------------------------------------------------ main view

type MainViewProps = ShareModalContentProps & { setView: (v: ShareModalView) => void; onPick: (p: SharePerson) => void }

function MainView({ title, members, access, accessOptions, onAccessChange, directory, roleOptions, onCopyLink, onMemberRoleChange, onRemoveMember, view, setView, onPick }: MainViewProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<string | null>(null)
  // elements in state: a view opened from the URL hangs its list under them on the render after mount
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null)
  const [accessEl, setAccessEl] = useState<HTMLButtonElement | null>(null)
  const listId = `shm-search${useId().replace(/:/g, '')}`
  const memberIds = new Set(members.map(m => m.id))
  const q = query.trim().toLowerCase()
  // a name matches when one of its words, or the whole name, starts with the query; an email when it starts with it
  const matches = (p: SharePerson) => {
    const name = p.name.toLowerCase()
    return name.startsWith(q) || name.split(/\s+/).some(w => w.startsWith(q)) || !!p.email?.toLowerCase().startsWith(q)
  }
  const results = directory.filter(p => !memberIds.has(p.id) && (!q || matches(p)))
  const options: OptionMenuOption[] = results.map(p => ({
    id: p.id, label: p.name, supporting: p.email, avatar: { name: p.name, initial: p.initial, colour: p.colour },
  }))
  const searching = view === 'search'
  const typedEmail = isEmail(query.trim()) ? query.trim() : null

  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isImeKey(e)) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!searching) setView('search')
      setActive(nextOptionId(options, active, e.key === 'ArrowDown' ? 'next' : 'prev'))
    } else if (e.key === 'Enter') {
      const pick = results.find(p => p.id === active)
      if (pick) { e.preventDefault(); onPick(pick) }
      else if (typedEmail) { e.preventDefault(); onPick({ id: `email:${typedEmail}`, name: typedEmail, email: typedEmail }) }
    } else if (e.key === 'Escape' && searching) {
      setView('main') // the open list is a [data-popover], so the modal leaves this Escape alone
      setActive(null)
    }
  }

  return (
    <>
      <ModalHeader title={title} />
      <ModalBody gap={24} className="shm-body">
        <InputField
          ref={setInputEl}
          size="lg"
          className="shm-invite"
          placeholder="Invite people and groups"
          aria-label="Invite people and groups"
          role="combobox"
          aria-expanded={searching}
          aria-controls={searching ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={searching && active ? optionDomId(listId, active) : undefined}
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(null); if (!searching) setView('search') }}
          onClick={() => { if (!searching) setView('search') }}
          onKeyDown={keyDown}
          nodeId="I11991:746310;2533:410634"
        />
        <ShareSection label="People with access" nodeId="I11991:746310;2533:410636">
          {members.map(m => (
            <MemberRow key={m.id} member={m} roleOptions={roleOptions ?? DEFAULT_ROLES} onRoleChange={onMemberRoleChange} onRemove={onRemoveMember} />
          ))}
        </ShareSection>
        <ShareSection label="General access" nodeId="I11991:746310;2533:410658">
          <div className="shm-row" data-node-id="I11991:746310;2533:410661">
            <span className={cx('shm-access-icon', `shm-access-icon--${access.id}`)} aria-hidden="true">
              <AccessGlyph id={access.id} />
            </span>
            <span className="shm-row__text">
              <button
                ref={setAccessEl}
                type="button"
                className="shm-access-btn"
                aria-haspopup="listbox"
                aria-expanded={view === 'access'}
                aria-label={`General access: ${access.label}`}
                onClick={() => setView(view === 'access' ? 'main' : 'access')}
              >
                <span className="shm-row__name">{access.label}</span>
                <ChevronDown14Md className="shm-chev shm-chev--primary" />
              </button>
              <span className="shm-row__sub">{access.description}</span>
            </span>
            {access.role && <span className="shm-row__end"><span className="shm-role"><span className="shm-role__t">{access.role}</span><ChevronDown14Md className="shm-chev" /></span></span>}
          </div>
        </ShareSection>
      </ModalBody>
      <ModalActions align="fill" nodeId="I11991:746310;2533:410663">
        <ModalButton kind="secondary" size="md" icon={overlayIcons.link01} label="Copy Link" fill onClick={onCopyLink} />
      </ModalActions>

      {searching && (
        <ModalDropdown anchor={inputEl} id={listId} label="People" onDismiss={() => { setView('main'); setActive(null) }}>
          {options.length > 0 ? (
            <OptionMenu
              id={listId}
              items={options}
              size="md"
              stacking="double"
              focusable={false}
              activeId={active}
              onActiveChange={setActive}
              onSelect={o => { const p = results.find(r => r.id === o.id); if (p) onPick(p) }}
              maxHeight={360}
              aria-label="People"
              nodeId="11832:31555"
            />
          ) : (
            <p className="shm-empty" id={listId} role="status">
              {typedEmail ? `Press Enter to invite ${typedEmail}` : 'No people match'}
            </p>
          )}
        </ModalDropdown>
      )}
      {view === 'access' && (
        <ModalDropdown anchor={accessEl?.closest('.shm-row') ?? null} label="General access" gap={4} focusList onDismiss={() => setView('main')}>
          <OptionMenu
            items={(accessOptions ?? []).map(o => ({ id: o.id, label: o.label, supporting: o.description, leading: <span className={cx('shm-access-icon', 'shm-access-icon--sm', `shm-access-icon--${o.id}`)}><AccessGlyph id={o.id} /></span> }))}
            size="md"
            stacking="double"
            selectedId={access.id}
            onSelect={o => { onAccessChange?.(o.id as ShareGeneralAccess); setView('main'); accessEl?.focus() }}
            onClose={() => { setView('main'); accessEl?.focus() }}
            aria-label="General access"
            nodeId="11832:31555"
          />
        </ModalDropdown>
      )}
    </>
  )
}

function AccessGlyph({ id }: { id: ShareGeneralAccess }) {
  return id === 'workspace' ? <Building16 /> : id === 'link' ? <Globe16 /> : <Lock16 />
}

/** Section label (Level 1, 10/12 Medium all caps) + its rows, 6 apart. */
function ShareSection({ label, nodeId, children }: { label: string; nodeId?: string; children: ReactNode }) {
  const id = useId()
  return (
    <section className="shm-section" aria-labelledby={id} data-node-id={nodeId}>
      <h3 className="shm-section__label" id={id}>{label}</h3>
      <div className="shm-section__rows">{children}</div>
    </section>
  )
}

/** List Item Cardified (52): 32 avatar, name + " (you)", email; the role at the end (Owner as text, others a menu button). */
function MemberRow({ member, roleOptions, onRoleChange, onRemove }: {
  member: ShareMemberRow
  roleOptions: { role: InviteRole; description: string }[]
  onRoleChange?: (id: string, role: InviteRole) => void
  onRemove?: (id: string) => void
}) {
  const layer = useModalLayer()
  const button = useRef<HTMLButtonElement>(null)
  const [menu, setMenu] = useState<{ position: MenuPosition; focus?: MenuFocus } | null>(null)
  const editable = member.role !== 'Owner' && (onRoleChange || onRemove)
  return (
    <div className="shm-row" data-node-id="I11991:746310;2533:410639">
      <Avatar name={member.name} initial={member.initial} colour={member.colour ?? 'brand-solid'} size="sm" decorative className="shm-row__av" />
      <span className="shm-row__text">
        <span className="shm-row__line">
          <span className="shm-row__name">{member.name}</span>
          {member.you && <span className="shm-row__you">(you)</span>}
        </span>
        {member.email && <span className="shm-row__sub">{member.email}</span>}
      </span>
      <span className="shm-row__end">
        {editable ? (
          <button
            ref={button}
            type="button"
            className="shm-role shm-role--btn"
            aria-haspopup="menu"
            aria-expanded={!!menu}
            aria-label={`${member.name}: ${member.role}`}
            onClick={e => {
              if (menu || !layer || !button.current) { setMenu(null); return }
              setMenu({ position: menuBelow(relativeBox(button.current, layer), 224), focus: keyboardFocus(e) })
            }}
          >
            <span className="shm-role__t">{member.role}</span><ChevronDown14Md className="shm-chev" />
          </button>
        ) : (
          <span className="shm-role shm-role--static"><span className="shm-role__t">{member.role}</span></span>
        )}
      </span>
      {menu && layer && (
        <DropdownMenu
          width={224} shadow="small" position={menu.position} anchor={button.current} portalTo={layer} autoFocus={menu.focus}
          onClose={() => setMenu(null)} aria-label={`${member.name}'s access`} nodeId="11991:747744"
        >
          {roleOptions.map(o => (
            <DropdownItem
              key={o.role} label={o.role} description={o.description} selected={member.role === o.role} className="ddi--pad-end-lg"
              onClick={() => { setMenu(null); onRoleChange?.(member.id, o.role) }}
            />
          ))}
          {onRemove && <DropdownSeparator size="md" />}
          {onRemove && (
            <DropdownItem label="Remove Access" danger leading={<img alt="" src={menuIcons.prohibition} />} onClick={() => { setMenu(null); onRemove(member.id) }} />
          )}
        </DropdownMenu>
      )}
    </div>
  )
}

/**
 * A list hung under a control inside the modal: portaled into the modal's full-screen layer so it can run past the
 * card's bottom edge (share 03 and 07 draw it over the Copy Link button), placed under `anchor` at its width.
 * data-popover tells the modal to leave Escape to the list; a press outside the list and its anchor dismisses it.
 */
function ModalDropdown({ anchor, id, label, gap = 4, focusList, onDismiss, children }: {
  anchor: Element | null; id?: string; label: string; gap?: number
  /** Move focus to the listbox inside once placed (a list the user operates directly, not through an input). */
  focusList?: boolean
  onDismiss?: () => void
  children: ReactNode
}) {
  const layer = useModalLayer()
  const box = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null)
  useLayoutEffect(() => {
    if (!layer || !anchor) return
    const place = () => {
      const b = relativeBox(anchor, layer)
      setPos({ left: b.left, top: b.bottom + gap, width: b.width })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [layer, anchor, gap])
  const placed = pos !== null
  useLayoutEffect(() => {
    if (placed && focusList) box.current?.querySelector<HTMLElement>('[role="listbox"]')?.focus({ preventScroll: true })
  }, [placed, focusList])
  const dismiss = useRef(onDismiss)
  dismiss.current = onDismiss
  useEffect(() => {
    const down = (e: PointerEvent) => {
      const t = e.target
      if (!(t instanceof Node) || box.current?.contains(t) || anchor?.contains(t)) return
      dismiss.current?.()
    }
    document.addEventListener('pointerdown', down, true)
    return () => document.removeEventListener('pointerdown', down, true)
  }, [anchor])
  if (!layer || !pos) return null
  return createPortal(
    <div ref={box} className="shm-drop" data-popover="" data-for={id} aria-label={label} style={{ left: pos.left, top: pos.top, width: pos.width }}>
      {children}
    </div>,
    layer,
  )
}

// ------------------------------------------------------------------------------------------------ invite view

type InviteViewProps = ShareModalContentProps & {
  chips: TagsFieldItem[]; setChips: (c: TagsFieldItem[]) => void
  role: InviteRole; setRole: (r: InviteRole) => void
  notify: boolean; setNotify: (n: boolean) => void
  message: string; setMessage: (m: string) => void
  onBack: () => void; onCancel: () => void; onInvite: () => void
}

/** share-artifact 08 (Modal Unit 11991:750142): chips + role, Notify people, the note, Copy Link / Cancel / Invite. */
function InviteView({ title, directory, members, roleOptions, onCopyLink, chips, setChips, role, setRole, notify, setNotify, message, setMessage, onBack, onCancel, onInvite }: InviteViewProps) {
  const layer = useModalLayer()
  const roleBtn = useRef<HTMLButtonElement>(null)
  const [roleMenu, setRoleMenu] = useState<{ position: MenuPosition; focus?: MenuFocus } | null>(null)
  const memberIds = new Set(members.map(m => m.id))
  // typed text becomes a person chip when it names someone in the directory, an email chip when it is an address
  const toItem = (text: string): TagsFieldItem | null => {
    const t = text.toLowerCase()
    const p = directory.find(d => !memberIds.has(d.id) && (d.name.toLowerCase() === t || d.email?.toLowerCase() === t))
      ?? directory.find(d => !memberIds.has(d.id) && d.name.toLowerCase().startsWith(t))
    if (p) return personChip(p)
    return isEmail(text) ? emailChip(text) : null
  }
  const options = roleOptions ?? DEFAULT_ROLES
  return (
    <>
      <ModalHeader title={title} onBack={onBack} />
      <ModalBody gap={16} className="shm-body">
        <TagsField
          value={chips}
          onChange={setChips}
          toItem={toItem}
          aria-label="People to invite"
          placeholder="Add people, groups or emails"
          data-autofocus=""
          trailing={(
            <button
              ref={roleBtn}
              type="button"
              className="shm-role shm-role--btn"
              aria-haspopup="menu"
              aria-expanded={!!roleMenu}
              aria-label={`Invite as ${role}`}
              onClick={e => {
                if (roleMenu || !layer || !roleBtn.current) { setRoleMenu(null); return }
                setRoleMenu({ position: menuBelow(relativeBox(roleBtn.current, layer), 224), focus: keyboardFocus(e) })
              }}
            >
              <span className="shm-role__t">{role}</span><ChevronDown14Md className="shm-chev" />
            </button>
          )}
        />
        <div className="shm-note">
          <Checkbox size="sm" label="Notify people" checked={notify} onCheckedChange={setNotify} />
          <Textarea rows={4} placeholder="Type a personalized invite message..." aria-label="Invite message" value={message} onChange={e => setMessage(e.target.value)} />
        </div>
      </ModalBody>
      <ModalActions leading={<ModalButton kind="tertiary" icon={overlayIcons.link01} label="Copy Link" onClick={onCopyLink} />}>
        <ModalButton kind="secondary" label="Cancel" onClick={onCancel} />
        <ModalButton kind="primary" label="Invite" disabled={chips.length === 0} onClick={onInvite} />
      </ModalActions>
      {roleMenu && layer && (
        <DropdownMenu
          width={224} shadow="small" position={roleMenu.position} anchor={roleBtn.current} portalTo={layer} autoFocus={roleMenu.focus}
          onClose={() => setRoleMenu(null)} aria-label="Invite as" nodeId="12264:347642"
        >
          {options.map(o => (
            <DropdownItem
              key={o.role} label={o.role} description={o.description} selected={role === o.role} className="ddi--pad-end-lg"
              onClick={() => { setRoleMenu(null); setRole(o.role) }}
            />
          ))}
        </DropdownMenu>
      )}
    </>
  )
}
