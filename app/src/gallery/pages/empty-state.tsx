import { BrandButton, Button, buttonIcons } from '../../components/buttons'
import { EmptyState } from '../../components/empty-state'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'

export const meta: GalleryMeta = {
  title: 'Empty state',
  figmaNodeIds: ['7100:233066', '7100:232903'],
  group: 'Feedback',
  description: 'ES Empty State, Level 1 (page / panel: Spectral) and Level 2 (side panel: Text xs). The illustrations are SVG exports of _ES Illustration.',
}

export default function EmptyStateGallery() {
  return (
    <GallerySection title="Level × Type=Create" description="Actions are a slot: Button (components/buttons) at md, as drawn.">
      <Specimens min="lg">
        <Specimen label="Level 1: deleted artifact, on the artifact canvas (6944:511817)" nodeId="6944:511817" surface="workspace" wide>
          <EmptyState
            title="Oops! Artifact is deleted" description="This artifact no longer exisits"
            actions={<Button kind="secondary" size="md" icon={buttonIcons.refresh14} label="Recreate the Artifact" nodeId="I6944:511817;70877:13907" />}
          />
        </Specimen>
        <Specimen label="Level 1: artifacts landing, empty (6660:536040)" nodeId="6660:536040" surface="primary" wide>
          <EmptyState
            title="Create an Artifact" description="Personalize templates for doc, presentations and data management."
            actions={<><Button kind="secondary" size="md" label="New Artifact" /><BrandButton size="md" icon={buttonIcons.plusWhite14} label="New Routine" /></>}
          />
        </Specimen>
        <Specimen label="Level 2: comments panel (8279:223418)" nodeId="8279:223418" surface="primary">
          <EmptyState level={2} title="No comments yet" description="Yours and other commentators messages  will appear here." />
        </Specimen>
        <Specimen label="Level 1 at phone width (fluid)" surface="primary">
          <div style={{ width: 300 }}>
            <EmptyState title="Oops! Artifact is deleted" description="This artifact no longer exisits" />
          </div>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
