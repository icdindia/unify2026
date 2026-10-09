import { useState } from 'react'
import { ChatTitleMenu, CHAT_TITLE_MENU_NODES, TITLE_MENU_PROJECTS, type ChatTitleAction } from '../../components/chat-title-menu'
import { keyboardFocus, openMenuOnArrowDown, type MenuFocus } from '../../components/dropdown-menu'
import { ToastProvider, useToast } from '../../components/overlays'
import { useResolved } from '../../fixtures/drift'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './chat-title-menu.css'

export const meta: GalleryMeta = {
  title: 'Chat title menu',
  // literal ids (CHAT_TITLE_MENU_NODES): the gallery suite reads them from this source
  figmaNodeIds: ['6405:329854', 'I6405:329854;6052:427308', 'I6405:329854;4770:196323'],
  group: 'Chat',
  description:
    'The chat title’s menu (chat-artifact 03): View files in Chat, Pin Chat, Rename, Add to Project › (search, projects, ' +
    '+ Start a New Project), Archive, Delete. Dropdown Menu 190 wide, the submenu 240, opened 2px to the right. "With fixes" ' +
    'applies title-menu-archive-row and project-picker-names.',
}

/** The menu hung under a stand-in title button, in a positioned stage. */
function Demo({ pinnedOpen, submenu, hoverProject, onAction }: {
  pinnedOpen?: boolean; submenu?: boolean; hoverProject?: number; onAction?: (a: ChatTitleAction) => void
}) {
  const projects = useResolved(TITLE_MENU_PROJECTS)
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [button, setButton] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(!!pinnedOpen)
  const [focus, setFocus] = useState<MenuFocus | undefined>()
  const [pinned, setPinned] = useState(false)
  return (
    <div ref={setStage} className="ctg-stage">
      <button
        ref={setButton} type="button" className="ctg-title" aria-haspopup="menu" aria-expanded={open}
        onClick={e => { setFocus(open ? undefined : keyboardFocus(e)); setOpen(o => !o) }}
        onKeyDown={openMenuOnArrowDown}
      >
        How does commit actually look? <span aria-hidden="true">⌄</span>
      </button>
      {open && stage && button && (
        <ChatTitleMenu
          anchor={button} layer={stage} projects={projects} pinned={pinned} submenuOpen={submenu} hoverProject={hoverProject}
          autoFocus={focus}
          onClose={() => { if (!pinnedOpen) setOpen(false) }}
          onAction={a => { if (a.type === 'pin') setPinned(p => !p); onAction?.(a); if (!pinnedOpen) setOpen(false) }}
        />
      )}
    </div>
  )
}

function Live() {
  const toast = useToast()
  return (
    <Demo
      onAction={a => toast.show({ message: a.type === 'add-to-project' ? `Added to ${a.project}` : a.type === 'pin' ? 'Pinned state toggled' : `Chosen: ${a.type}` })}
    />
  )
}

export default function ChatTitleMenuGallery() {
  return (
    <ToastProvider gated={false}>
      <GallerySection title="As drawn" description="chat-artifact 03: the menu with Add to Project open and its “Settings” row hovered.">
        <Specimens min="lg">
          <Specimen label="Menu + Add to Project submenu (03)" nodeId={CHAT_TITLE_MENU_NODES.wrapper} wide overflow="visible">
            <Demo pinnedOpen submenu hoverProject={1} />
          </Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection
        title="Live"
        description="Click the title, or focus it and press Enter / ArrowDown. Hover Add to Project, or press ArrowRight on it, for the submenu; type to filter the projects; ArrowLeft goes back; Escape closes and returns focus to the title."
      >
        <Specimens min="lg">
          <Specimen label="Live" wide overflow="visible"><Live /></Specimen>
        </Specimens>
      </GallerySection>
    </ToastProvider>
  )
}
