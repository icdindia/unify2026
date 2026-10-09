import { useState, type ReactNode } from 'react'
import { ArtifactHeader, type ArtifactView } from '../../components/artifact-header'
import { ArtifactPanel } from '../../components/split-view'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
import './artifact-panel.css'

export const meta: GalleryMeta = {
  title: 'Artifact header',
  figmaNodeIds: ['3805:105688', '7416:161222', '3838:245967', '4376:395816', '6405:306289', '6424:336265', '3805:106484'],
  group: 'Artifacts',
  description:
    'Arifact Header (sic) in the split and as the page header when expanded. The name is a button: click to rename in ' +
    'place (Enter or blur saves, Escape cancels; a truncated name shows in full in a tooltip). "v3" opens Version History. ' +
    'As designed the tools change between frames (preview / code + copy at rest, copy + refresh with a menu, hover, rename ' +
    'or expanded); fix artifact-header-one-icon-set keeps one set. Under 640px of header the optional tools fold into More.',
}

const VERSIONS = [
  { n: 3, label: 'all header icons for reference.xls', when: 'Today • Latest' },
  { n: 2, label: 'Artifact name 1', when: 'Yesterday • 14:14' },
  { n: 1, label: 'Artifact name 2', when: '3 days ago • 08:12' },
]

/** A header in a panel card (so its menus have a container), 927 wide as in the 440 split unless `w` says otherwise. */
function InPanel({ w = 927, h = 200, children }: { w?: number | '100%'; h?: number; children: (log: (s: string) => void) => ReactNode }) {
  const [log, setLog] = useState('—')
  return (
    <div className="apg-col">
      <div className="apg-frame" style={{ width: w, maxWidth: '100%', height: h, padding: 0 }}>
        <ArtifactPanel label="Untitled.xls" header={children(setLog)}><div /></ArtifactPanel>
      </div>
      <span className="apg-log" aria-live="polite">last action: {log}</span>
    </div>
  )
}

function LiveHeader({ w, full, long }: { w?: number | '100%'; full?: boolean; long?: boolean }) {
  const [name, setName] = useState(long ? 'all header icons for reference all header icons for reference.xls' : 'Untitled.xls')
  const [version, setVersion] = useState(3)
  const [view, setView] = useState<ArtifactView>('preview')
  return (
    <InPanel w={w}>
      {log => (
        <ArtifactHeader
          name={name} icon="Documents" variant={full ? 'full' : 'split'} versions={VERSIONS} version={version}
          onVersionChange={n => { setVersion(n); log(`version ${n}`) }} view={view} onViewChange={v => { setView(v); log(v) }}
          onRename={n => { setName(n); log(`renamed to "${n}"`) }} onCopy={() => log('copy')} onRefresh={() => log('refresh')}
          onPublish={() => log('publish')} onComment={() => log('comments')} onCommentMenu={() => log('comment options')}
          onDownload={() => log('download')} onToggleFull={() => log(full ? 'collapse' : 'expand')} onClose={() => log('close')}
        />
      )}
    </InPanel>
  )
}

export default function ArtifactHeaderGallery() {
  return (
    <>
      <GallerySection title="Live" description="Every control works; actions without a frame are logged under the bar.">
        <Specimens>
          <Specimen wide label="Split, at rest (20, 3838:245967)" nodeId="3838:245967" surface="primary"><LiveHeader /></Specimen>
          <Specimen wide label="Expanded page header (22, 3805:106484)" nodeId="3805:106484" surface="primary"><LiveHeader w="100%" full /></Specimen>
          <Specimen wide label="Long name, truncated (hover it for the full name)" nodeId="7418:306089" surface="primary"><LiveHeader long /></Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Pinned states" description="The review states of chat-artifact 21, 21a and 21b.">
        <Specimens>
          <Specimen wide label="21 · Version History open (1795:359260)" nodeId="7416:161222" surface="primary">
            <InPanel>{() => <ArtifactHeader name="Untitled.xls" icon="Documents" versions={VERSIONS} menuOpen />}</InPanel>
          </Specimen>
          <Specimen wide label="21a · name hover (6405:306202)" nodeId="6405:306289" surface="primary">
            <InPanel h={60}>{() => <ArtifactHeader name="Untitled.xls" icon="Documents" versions={VERSIONS} nameHover />}</InPanel>
          </Specimen>
          <Specimen wide label="21b · rename (6405:308388)" nodeId="6424:336265" surface="primary">
            <InPanel h={60}>{() => <ArtifactHeader name="Untitled.xls" icon="Documents" versions={VERSIONS} editing draft="Untitled name here.xls" focusOnEdit={false} />}</InPanel>
          </Specimen>
        </Specimens>
      </GallerySection>

      <GallerySection title="Narrow" description="Under 640px the preview / code toggle, copy, refresh and download fold into More; under 440px Publish and the comment options too.">
        <Specimens>
          <Specimen wide label="600 wide" surface="primary"><LiveHeader w={600} /></Specimen>
          <Specimen wide label="400 wide" surface="primary"><LiveHeader w={400} /></Specimen>
        </Specimens>
      </GallerySection>
    </>
  )
}
