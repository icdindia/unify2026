import { useState, type ReactNode } from 'react'
import { ArtifactPane, SplitView, CHAT_WIDTH, SPLIT_FILES_DROPDOWN } from '../../components/split-view'
import { useUiParam } from '../../router/uiParams'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './artifact-panel.css'

export const meta: GalleryMeta = {
  title: 'Split view (chat + artifact)',
  figmaNodeIds: ['1809:488482', '1809:488594', '6213:501974', '4376:395812', '4376:395815'],
  group: 'Artifacts',
  description:
    'The chat column (440 by default, 360-650) beside the artifact panel, with the drag handle between them: drag it, or ' +
    'focus it and use ← → (Shift: 50px), Home / End, Enter or double-click to reset. Expand puts the artifact over the chat ' +
    '(the chat stays mounted); under 968px of width the artifact always opens over the chat. The files dropdown slot sits ' +
    'over the chat column at a fixed 720.',
  sheets: [
    { id: 'default', label: 'Live split' },
    { id: 'frames', label: 'Frames 19-22 at 1440' },
  ],
}

/** A stand-in chat column (the screens build the real one: header, thread, composer). */
export function StandInChat({ title = 'How does commit actually look?' }: { title?: string }) {
  return (
    <div className="apg-chat">
      <div className="apg-chat__head">{title}</div>
      <div className="apg-chat__body">
        <p className="apg-chat__answer">Interactive. Forecast against quota, the stage funnel, where the quarter moved, the rep leaderboard and the deals the graph flagged.</p>
        <p className="apg-chat__msg">Coverage by rep is the number I would act on.</p>
        <p className="apg-chat__msg apg-chat__msg--own">We are two-thirds through the quarter. How does commit actually look?</p>
      </div>
      <div className="apg-chat__composer">Ask anything...</div>
    </div>
  )
}

function StandInFiles() {
  return (
    <div className="apg-files" role="dialog" aria-label="Files in this chat (stand-in)">
      Files dropdown slot: {SPLIT_FILES_DROPDOWN.width} × {SPLIT_FILES_DROPDOWN.height}, top {SPLIT_FILES_DROPDOWN.top}, right {SPLIT_FILES_DROPDOWN.right}.
      The files panel fills it and scrolls itself.
    </div>
  )
}

function Box({ w, h, children }: { w?: number; h: number; children: ReactNode }) {
  return <div className={w ? 'apg-frame' : 'apg-frame apg-fluid'} style={{ width: w, height: h }}>{children}</div>
}

function LiveSplit({ height = 640 }: { height?: number }) {
  const [full, setFull] = useState(false)
  const [files, setFiles] = useState(false)
  const [width, setWidth] = useState<number>(CHAT_WIDTH.default)
  const [log, setLog] = useState('—')
  return (
    <div className="apg-col">
      <div className="apg-row">
        <button type="button" className="apg-btn" aria-pressed={files} onClick={() => setFiles(f => !f)}>Files dropdown</button>
        <button type="button" className="apg-btn" aria-pressed={full} onClick={() => setFull(f => !f)}>Expanded</button>
        <span className="apg-log" aria-live="polite">chat {width}px · last action: {log}</span>
      </div>
      <Box h={height}>
        <SplitView
          autoCollapseRail={false} full={full} onChatWidthChange={setWidth}
          chat={<StandInChat />} chatOverlay={files ? <StandInFiles /> : undefined}
          artifact={
            <ArtifactPane
              id="pipeline-command" onToggleFull={() => setFull(f => !f)} onClose={() => { setFull(false); setLog('close') }}
              onCopy={() => setLog('copy')} onRefresh={() => setLog('refresh')} onPublish={() => setLog('publish')}
              onComment={() => setLog('comments')} onCommentMenu={() => setLog('comment options')} onDownload={() => setLog('download')}
              onRename={n => setLog(`renamed to "${n}"`)}
            />
          }
        />
      </Box>
    </div>
  )
}

const W = 1384 // the main area at 1440 (the 56 rail is the shell's)
const H = 900

function Frames() {
  return (
    <GallerySection title="Frames at 1440 (the main area, rail excluded)" description="Each box is the 1384 × 900 main area of the frame named, so it can be diffed against the reference PNG from x 56.">
      <Specimens min="lg">
        <Specimen wide label="20 · split, default (1809:488480)" nodeId="1809:488480">
          <Box w={W} h={H}><SplitView autoCollapseRail={false} chat={<StandInChat />} artifact={<ArtifactPane id="pipeline-command" />} /></Box>
        </Specimen>
        <Specimen wide label="19 · chat at 650 + files dropdown (13722:383349)" nodeId="13722:383349">
          <Box w={W} h={H}>
            <SplitView autoCollapseRail={false} chatWidth={650} chat={<StandInChat />} chatOverlay={<StandInFiles />} artifact={<ArtifactPane id="pipeline-command" />} />
          </Box>
        </Specimen>
        <Specimen wide label="21 · version menu open (1795:359260)" nodeId="1795:359260">
          <Box w={W} h={H}><SplitView autoCollapseRail={false} chat={<StandInChat />} artifact={<ArtifactPane id="pipeline-command" menuOpen />} /></Box>
        </Specimen>
        <Specimen wide label="21a · name hover (6405:306202)" nodeId="6405:306202">
          <Box w={W} h={H}><SplitView autoCollapseRail={false} chat={<StandInChat />} artifact={<ArtifactPane id="pipeline-command" nameHover />} /></Box>
        </Specimen>
        <Specimen wide label="21b · rename (6405:308388)" nodeId="6405:308388">
          <Box w={W} h={H}><SplitView autoCollapseRail={false} chat={<StandInChat />} artifact={<ArtifactPane id="pipeline-command" editing focusOnEdit={false} />} /></Box>
        </Specimen>
        <Specimen wide label="22 · expanded (1809:484624)" nodeId="1809:484624">
          <Box w={W} h={H}><SplitView autoCollapseRail={false} full chat={<StandInChat />} artifact={<ArtifactPane id="pipeline-command" />} /></Box>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}

export default function SplitViewGallery() {
  const [sheet] = useUiParam('sheet')
  if (sheet === 'frames') return <Frames />
  return (
    <>
      <GallerySection title="Live" description="Pipeline Command in the split. Every header control works; actions without a frame are logged here.">
        <Specimens>
          <Specimen wide label="Frame 2147265764 · split, resizable" nodeId="1809:488482"><LiveSplit /></Specimen>
        </Specimens>
      </GallerySection>
      <GallerySection title="Narrow" description="Under 968px of width (a window under 1024) the artifact opens over the chat; close goes back to the chat.">
        <Specimens>
          <Specimen label="Stacked, 720 wide">
            <Box w={720} h={520}><SplitView autoCollapseRail={false} chat={<StandInChat />} artifact={<ArtifactPane id="pipeline-command" />} /></Box>
          </Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
