import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fixesMode, rail, useStore } from '../../app/store'
import { useScreenNav } from '../../app/screenNav'
import { ChatHeader, CHAT_HEADER_INSTANCES, useAccessPeople, useHeaderPeople } from '../../components/chat-header'
import { TITLE_MENU_PROJECTS, type ChatTitleAction } from '../../components/chat-title-menu'
import { TypingIndicator, useAuthorOf, useChatMessageFix } from '../../components/chat-messages'
import { Composer, type ComposerHandle, type ComposerHover } from '../../components/composer'
import { FilesPanel, FilesPanelPopover, useFilesPanelData, type FilesPanelArtifact } from '../../components/files-panel'
import { useMentionPicker } from '../../components/mention-picker'
import { useToast } from '../../components/overlays'
import { ShareModal, useShareModalData, type ShareModalView } from '../../components/share-modal'
import { ArtifactPane, SplitView } from '../../components/split-view'
import type { ArtifactId } from '../../fixtures/artifacts'
import { CHATS } from '../../fixtures/chats'
import { useResolved } from '../../fixtures/drift'
import { ME, type PersonId } from '../../fixtures/people'
import { scenarioOf } from '../../fixtures/seeds'
import type { ThreadItem } from '../../fixtures/script'
import { COMMIT_QUESTION } from '../../fixtures/copy'
import { useMediaQuery } from '../../shell/useMediaQuery'
import { navigate } from '../../router/router'
import { buildUrl, setUi } from '../../router/uiParams'
import { cx } from '../../components/buttons/cx'
import { drawnFor, type Drawn } from './drawn'
import { useChatScreenFix } from './fixes'
import { presetOfText, presetText } from '../landing/route'
import { CHAT, CHAT_PRESETS, SCRIPT, type ChatPreset, type ChatRouteState } from './route'
import { Thread } from './Thread'
import { useChatPlayback, type ChatPlayback } from './useChatPlayback'
import type { FrameRef } from '../../figma/frames'
import './chat-screen.css'

/** "Frame 2147265764" of the chat frames (1809:488482 in the split): the area right of the nav. */
const CHAT_AREA_NODE = '1707:136011'
const NO_SEEDS = scenarioOf(null)
const NARROW = '(max-width: 599.98px)'

export type ChatScreenProps = {
  state: ChatRouteState
  /** The chat-artifact frame this route reproduces exactly (screens/chat/drawn.ts), if any. */
  frame?: FrameRef
}

/** A pending focus target after a route change inside the chat (the card that opened the artifact). */
let focusCardOnReturn = false

/**
 * The commit chat (BUILD-PLAN 2.1 `/chat/commit`, chat-artifact 03-18) and the chat + artifact split
 * (`/chat/commit/:artifact`, 19-22): the chat header, the thread played from the commit script, the docked composer
 * with the "@" mention picker, the share modal, the people-with-access popover, the title menu, the files panel (docked
 * beside the chat, or a dropdown in the split) and the artifact pane. Every overlay lives in the URL (menu=, pop=,
 * modal=, panel=, edit=, full=), so each step of the journey has its frame URL and the review bar links the frame on view.
 */
export function ChatScreen({ state, frame }: ChatScreenProps) {
  const fixes = useStore(fixesMode) === 'on'
  const drawn: Drawn = drawnFor(frame)
  const playback = useChatPlayback(state.at, fixes ? [] : drawn.drawsFixed)
  const { view } = playback
  const toast = useToast()
  const gap = useCallback((what: string) => toast.show({ message: `${what}: not drawn in Figma yet` }), [toast])

  const split = state.artifact !== null
  const panelOpen = state.panel === 'files' || state.panel === 'files-grid'
  // the rail highlights New Session in every chat frame; as designed 21-22 highlight Artifacts (fix rail-selection-follows-page)
  const railFix = useChatScreenFix('rail-selection-follows-page')
  useScreenNav(!railFix && drawn.navArtifacts ? 'artifacts' : 'new')

  // as designed, 19 draws the chat column wider than the split's 650 maximum (fix split-chat-width-max)
  const widthFix = useChatScreenFix('split-chat-width-max')
  const drawnWidth = !widthFix && drawn.chatWidth ? drawn.chatWidth : undefined

  // ---- files badge: as designed only 16 draws it; with fix files-badge-until-seen it shows from the artifact answer
  // until the panel has been opened
  const badgeFix = useChatScreenFix('files-badge-until-seen')
  const hasFiles = view.items.some(i => i.kind === 'assistant' && i.answer?.blocks.some(b => b.kind === 'artifact'))
  const [filesSeen, setFilesSeen] = useState(false)
  if (panelOpen && !filesSeen) setFilesSeen(true)
  const filesBadge = badgeFix
    ? (hasFiles && !filesSeen && !panelOpen ? CHATS.commit.filesBadge : undefined)
    : drawn.filesBadge

  // ---- the comments icon: as designed in 10-14; never with fix comments-icon-only-with-comments (the chat has none)
  const commentsFix = useChatScreenFix('comments-icon-only-with-comments')
  const comments = !commentsFix && drawn.comments ? {} : null

  // ---- share: people invited in this session join through the script's `joined` beat (Q35)
  const [invited, setInvited] = useState<{ person: PersonId; role: 'Commenter' | 'Editor' }[]>([])
  const members = useMemo(() => {
    const joined = view.participants.map(person => ({ person, role: 'Editor' as const }))
    return [...joined, ...invited.filter(i => !view.participants.includes(i.person))]
  }, [view.participants, invited])
  const share = useShareModalData('chat', NO_SEEDS, { extraMembers: members })
  const invitedNow = useRef(false)

  // ---- header
  const title = useResolved(SCRIPT.title)
  const people = useHeaderPeople(view.header.people)
  const access = useAccessPeople()
  const projects = useResolved(TITLE_MENU_PROJECTS)
  const [pinned, setPinned] = useState(false)
  const filesBtn = useRef<HTMLButtonElement | null>(null)
  const [filesAnchor, setFilesAnchor] = useState<HTMLButtonElement | null>(null)
  const setFilesRef = useCallback((el: HTMLButtonElement | null) => { filesBtn.current = el; setFilesAnchor(el) }, [])
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const onTitleAction = (a: ChatTitleAction) => {
    if (a.type === 'view-files') { setUi(split ? { panel: 'files', cw: 650 } : { panel: 'files' }); return }
    if (a.type === 'pin') { setPinned(p => !p); toast.show({ message: pinned ? 'Chat unpinned' : 'Chat pinned' }); return }
    if (a.type === 'add-to-project') { toast.show({ message: `Added to ${a.project}` }); return }
    gap({ rename: 'Rename', archive: 'Archive', delete: 'Delete', 'new-project': 'Start a New Project' }[a.type])
  }

  const toggleFiles = (button: HTMLButtonElement) => {
    setKeyboardOpen(button.matches(':focus-visible'))
    if (panelOpen) {
      setUi(split ? { panel: null, cw: null } : { panel: null })
      button.focus()
    } else {
      setUi(split ? { panel: 'files', cw: 650 } : { panel: 'files' })
    }
  }
  const closeFiles = (refocus = true) => {
    setUi(split ? { panel: null, cw: null } : { panel: null })
    if (refocus) filesBtn.current?.focus()
  }

  // ---- opening and closing the artifact (a new screen path: a history entry)
  const railKey = () => (rail.get() === 'collapsed' ? 'c' : 'e')
  const atNow = () => new URLSearchParams(location.hash.split('?')[1] ?? '').get('at') ?? undefined
  const openArtifact = (id: ArtifactId, withFiles = false) => {
    focusCardOnReturn = false
    navigate(buildUrl(`/chat/${CHAT}/${id}`, { at: atNow(), panel: withFiles ? 'files' : null, cw: withFiles ? 650 : null, rail: 'c' }))
  }
  const closeArtifact = () => {
    focusCardOnReturn = true
    navigate(buildUrl(`/chat/${CHAT}`, { at: atNow(), rail: railKey() }))
  }
  // a row of the files panel opens its artifact with the files dropdown still open over the chat column (step 19)
  const onPanelArtifact = (row: FilesPanelArtifact) => openArtifact(row.artifact, true)

  // as designed, 21-21b draw the split column's header as ES Breadcrumb / Variant=with Icon (fix split-header-one-variant)
  const headerFix = useChatScreenFix('split-header-one-variant')
  const withIcon = split && !headerFix && !!drawn.headerWithIcon

  const header = (
    <ChatHeader
      title={title}
      variant={split ? 'split' : 'default'}
      className={withIcon ? 'chat-hdr--with-icon' : undefined}
      shared={withIcon ? false : undefined}
      people={people}
      cost={{ label: view.cost.label, state: view.cost.state, ringAsDrawn: 'approaching' }}
      filesBadge={filesBadge}
      comments={comments}
      titleMenu={{
        projects, pinned,
        open: state.menu.title,
        submenuOpen: state.menu.submenu,
        onOpenChange: open => setUi({ menu: open ? 'title' : null }),
        onSubmenuChange: open => setUi({ menu: open ? 'title>add-to-project' : 'title' }),
        onAction: onTitleAction,
        hoverProject: drawn.hoverProject,
      }}
      access={people.length ? {
        people: access,
        open: state.pop === 'access',
        onOpenChange: open => setUi({ pop: open ? 'access' : null }),
        onManage: () => setUi({ pop: null, modal: 'share' }),
      } : undefined}
      onShare={() => setUi({ modal: 'share', pop: null, menu: null })}
      onFiles={toggleFiles}
      filesOpen={panelOpen}
      onCost={() => gap('The cost popover')}
      controlRefs={{ files: setFilesRef }}
      hover={(['title', 'cost', 'share', 'files', 'comments', 'people'] as const).find(h => h === state.hover) ?? null}
      nodeId={drawn.headerNode ?? (frame?.stepId ? CHAT_HEADER_INSTANCES[frame.stepId] : undefined)}
    />
  )

  const column = (
    <ChatColumn
      split={split} state={state} drawn={drawn} fixes={fixes} playback={playback} header={split ? header : null}
      onOpenArtifact={id => openArtifact(id)} onShare={() => setUi({ modal: 'share' })} gap={gap}
    />
  )

  const files = useFilesPanelData(state.panel === 'files-grid' ? 'grid' : 'list')
  const filesProps = {
    ...files,
    view: state.panel === 'files-grid' ? 'grid' as const : 'list' as const,
    onViewChange: (v: 'list' | 'grid') => setUi({ panel: v === 'grid' ? 'files-grid' : 'files' }),
    onOpenArtifact: onPanelArtifact,
    onDownloadArtifact: (row: FilesPanelArtifact) => toast.show({ message: `Downloading ${row.name}` }),
    onDownloadAll: () => toast.show({ message: 'Downloading all files' }),
    onDownloadFile: (f: { name: string }) => toast.show({ message: `Downloading ${f.name}` }),
    hoverFile: frame?.stepId === '17' || frame?.stepId === '19' ? 'f-screenshot' : frame?.stepId === '18' ? 'f-json' : null,
  }

  // the docked panel closes on a press outside it (not on the files button, which toggles it, nor the review tools)
  const panelRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!panelOpen || split) return
    const down = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (!t || panelRef.current?.contains(t) || filesBtn.current?.contains(t) || t.closest('.shell__tools, .shell__nav')) return
      if (t.closest('[role=dialog], [role=menu], .iac')) return
      setUi({ panel: null })
    }
    document.addEventListener('pointerdown', down)
    return () => document.removeEventListener('pointerdown', down)
  }, [panelOpen, split])

  const shareView: ShareModalView | undefined = state.modal ?? undefined

  return (
    <div className={cx('chat', split && 'chat--split', !!drawnWidth && drawn.canvasLow && 'chat--canvas-low')} data-node-id={frame?.nodeId ?? CHAT_AREA_NODE}>
      <h1 className="chat__h1" tabIndex={-1}>{title}</h1>
      {split ? (
        <SplitView
          chat={column}
          full={state.full}
          chatWidth={drawnWidth ?? state.cw ?? undefined}
          maxChatWidth={drawnWidth}
          onChatWidthChange={w => { if (state.cw !== null) setUi({ cw: w }) }}
          artifact={
            <ArtifactPane
              id={state.artifact!}
              full={state.full}
              menuOpen={state.menu.version}
              onMenuOpenChange={open => setUi({ menu: open ? 'version' : null })}
              editing={state.edit}
              onEditingChange={e => setUi({ edit: e ? 'name' : null })}
              nameHover={state.hover === 'artifact-name'}
              onToggleFull={() => setUi({ full: state.full ? null : 1, menu: null, edit: null }, { push: true })}
              onClose={closeArtifact}
              onCopy={() => toast.show({ message: 'Copied' })}
              onRefresh={() => gap('Refresh')}
              onPublish={() => gap('Publish')}
              onComment={() => gap('Comments')}
              onCommentMenu={() => gap('Comment options')}
              onDownload={() => gap('Download')}
            />
          }
        />
      ) : (
        <>
        {header}
        <div className="chat__body">
          {column}
          {panelOpen && (
            <aside className="chat__panel" ref={el => { panelRef.current = el }}>
              <FilesPanel id="chat-files-panel" {...filesProps} onClose={() => closeFiles()} />
            </aside>
          )}
        </div>
        </>
      )}
      {split && (
        <FilesPanelPopover
          open={panelOpen && !state.full} anchor={filesAnchor} autoFocus={keyboardOpen}
          onClose={reason => closeFiles(reason === 'escape')} {...filesProps}
        />
      )}
      <ShareModal
        open={state.modal !== null}
        onClose={() => setUi({ modal: null })}
        view={shareView}
        onViewChange={v => { if (!invitedNow.current) setUi({ modal: v === 'main' ? 'share' : `share>${v}` }) }}
        {...share}
        onCopyLink={() => toast.show({ message: 'Link copied' })}
        onInvite={inv => {
          const ids = inv.people.map(p => p.id as PersonId)
          setInvited(list => [...list, ...ids.filter(id => !list.some(l => l.person === id)).map(person => ({ person, role: inv.role }))])
          toast.show({ message: `Invited ${[...inv.people.map(p => p.name), ...inv.emails].join(', ')}` })
          // the script's next beat: Matt, John and Grace join (step 10). Close the modal with it (the modal's own return to
          // its main view right after must not reopen it).
          invitedNow.current = true
          queueMicrotask(() => { invitedNow.current = false })
          setUi({ modal: null })
          playback.act('invite')
        }}
      />
    </div>
  )
}

// ------------------------------------------------------------------------------------------------ the chat column

type ColumnProps = {
  split: boolean
  state: ChatRouteState
  drawn: Drawn
  fixes: boolean
  playback: ChatPlayback
  header: ReactNode
  onOpenArtifact: (id: ArtifactId) => void
  onShare: () => void
  gap: (what: string) => void
}

/** Header, thread and composer: the whole chat, or the left column of the split. */
function ChatColumn({ split, state, drawn, fixes, playback, header, onOpenArtifact, onShare, gap }: ColumnProps) {
  const { player, view, act } = playback
  const toast = useToast()
  const narrow = useMediaQuery(NARROW)
  const scrollFix = useChatScreenFix('chat-scroll-to-latest')
  const thinkingFix = useChatScreenFix('thinking-row-under-menu')
  const splitFix = useChatScreenFix('split-thread-as-chat')
  const answerFix = useChatScreenFix('answer-head-gap')
  const cardHoverFix = useChatScreenFix('card-hover-follows-pointer')
  const groupFix = useChatMessageFix('message-group-spacing')
  const authorOf = useAuthorOf()
  const column = split ? 'split' : 'full'

  // the split frames end the column with the first question again (as designed only)
  const items = useMemo(() => {
    if (!split || splitFix || !drawn.splitTail) return view.items
    const tail: Extract<ThreadItem, { kind: 'user' }> = { kind: 'user', id: 'm-split-tail', from: ME, body: [COMMIT_QUESTION] }
    return [...view.items, tail] as typeof view.items
  }, [split, splitFix, drawn.splitTail, view.items])

  // ---- the composer: State=Generating while the viewer's own question is being answered
  const runningIndex = view.running ? view.items.findIndex(i => i.id === view.running) : -1
  const asker = runningIndex > 0 ? [...view.items.slice(0, runningIndex)].reverse().find(i => i.kind === 'user') : undefined
  const [stopped, setStopped] = useState<string | null>(null)
  const generating = !!view.running && asker?.kind === 'user' && asker.from === ME && stopped !== view.running

  // compose= is the preset the composer was loaded with; its own typing rewrites it (replace), an outside change reloads it
  const handle = useRef<ComposerHandle>(null)
  const written = useRef<string | null>(state.compose)
  const [seed, setSeed] = useState<{ key: number; text: string }>({ key: 0, text: state.compose ? presetText(state.compose) : '' })
  const [seenCompose, setSeenCompose] = useState(state.compose)
  if (state.compose !== seenCompose) {
    setSeenCompose(state.compose)
    if (state.compose !== written.current) {
      written.current = state.compose
      setSeed(s => ({ key: s.key + 1, text: state.compose ? presetText(state.compose) : '' }))
    }
  }
  const onChange = (text: string) => {
    const preset = presetOfText<ChatPreset>(text, CHAT_PRESETS)
    if (preset === written.current) return
    written.current = preset
    setUi({ compose: preset })
  }
  const onSubmit = () => {
    written.current = null
    if (player.next?.trigger.after === 'user' && player.next.trigger.action === 'send') {
      setUi({ compose: null })
      act('send')
    } else {
      setUi({ compose: null })
      toast.show({ message: player.next?.trigger.after === 'user' ? `Next in this chat: ${player.next.trigger.hint}` : 'The Assistant is still answering' })
    }
  }

  const mention = useMentionPicker({
    composer: handle, participants: view.participants as PersonId[],
    hoverId: state.hover === 'mention:matt' ? 'matt-rivera' : undefined,
  })
  const composerHover = (['send', 'stop', 'chip:research', 'chip:company'] as const).find(h => h === state.hover) as ComposerHover | undefined

  // ---- scrolling: as designed, the frame's offset; otherwise the latest message stays in view
  const scroller = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const userScrolled = useRef(false)
  const anchor = drawn.scroll && !fixes && !scrollFix ? drawn.scroll : null
  const place = useCallback(() => {
    const sc = scroller.current
    if (!sc) return
    if (anchor) {
      const el = sc.querySelector<HTMLElement>(`[data-item="${anchor.item}"]`)
      if (el) {
        const delta = el.getBoundingClientRect().top - anchor.y
        sc.scrollTop = Math.max(0, sc.scrollTop + delta)
        return
      }
    }
    sc.scrollTop = sc.scrollHeight
  }, [anchor])
  const anchorKey = anchor ? `${anchor.item}:${anchor.y}` : ''
  useLayoutEffect(() => {
    userScrolled.current = false
    place()
  }, [player.index, anchorKey, split, items.length, place])
  useEffect(() => {
    let live = true
    document.fonts?.ready.then(() => { if (live && !userScrolled.current) place() })
    const el = content.current
    if (!el || typeof ResizeObserver === 'undefined') return () => { live = false }
    const ro = new ResizeObserver(() => { if (!userScrolled.current) place() })
    ro.observe(el)
    return () => { live = false; ro.disconnect() }
  }, [place])
  const markScrolled = () => { userScrolled.current = true }

  // back from the artifact: focus the card that opened it
  useEffect(() => {
    if (!focusCardOnReturn || split) return
    focusCardOnReturn = false
    scroller.current?.querySelector<HTMLElement>('.iac__open')?.focus({ preventScroll: true })
  }, [split])

  const typing = view.typing.people[0]

  return (
    <div className={cx('chat-col', `chat-col--${column}`, split && !splitFix && drawn.lowComposer && 'chat-col--low-dock')}>
      {header}
      <div
        ref={scroller} className="chat-col__scroll" tabIndex={-1}
        onWheel={markScrolled} onTouchMove={markScrolled} onKeyDown={markScrolled}
      >
        <div ref={content} className="chat-col__thread" role="log" aria-label="Conversation" aria-live="polite">
          <Thread
            items={items} column={column} still={player.instant}
            presentation={state.cot ?? 'steps'} glyph={state.glyph === 'bare' ? 'bare' : 'round'}
            hideThinking={!thinkingFix && drawn.hideThinking}
            bubbleGap={groupFix ? undefined : drawn.bubbleGap}
            nameGap={groupFix ? undefined : drawn.nameGap}
            groupGap={groupFix ? undefined : drawn.groupGap}
            groupBreaks={groupFix ? undefined : drawn.groupBreaks}
            answerGap={answerFix ? undefined : drawn.answerGap}
            mentionText={drawn.mentionText}
            cardHovered={!cardHoverFix && drawn.cardHover}
            smallBubbles={!splitFix && drawn.smallBubbles}
            card={drawn.card}
            cardHover={state.hover}
            compact={['matt-replied', 'artifact-cot-2'].includes(player.beat.id)}
            hang={!narrow && !split}
            onOpenArtifact={id => onOpenArtifact(id)}
            onDownloadArtifact={() => toast.show({ message: 'Downloading Pipeline Command' })}
            onCopied={ok => toast.show({ message: ok ? 'Copied' : 'Could not copy' })}
            onEdit={text => { written.current = null; setSeed(s => ({ key: s.key + 1, text })) }}
            onShare={onShare}
            onGap={gap}
          />
          {/* the frame's scroll offset needs room under the last message (the frames leave up to a screen of it) */}
          {anchor && <div className="chat-col__runout" aria-hidden="true" />}
        </div>
      </div>
      <div className="chat-col__dock">
        {typing && (
          <div className="chat-col__typing">
            <TypingIndicator person={authorOf(typing as PersonId)} column={column} hang={!narrow && !split} still={player.instant} />
          </div>
        )}
        <Composer
          key={seed.key}
          type="bottom"
          tools
          state={generating ? 'generating' : 'default'}
          defaultValue={seed.text}
          onChange={onChange}
          onSubmit={onSubmit}
          onStop={() => { setStopped(view.running); player.pause(); toast.show({ message: 'Stopped' }) }}
          handleRef={handle}
          mentions={mention.names}
          onTrigger={mention.onTrigger}
          onTriggerKeyDown={mention.onTriggerKeyDown}
          hover={composerHover}
          label="Message the chat"
        />
        {mention.picker}
      </div>
    </div>
  )
}
