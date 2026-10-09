// Arifact Header (3805:105688) and its Version History menu (7416:161222): inventory rows 43-44 (chat-artifact 19-22,
// 21a, 21b). Gallery: #/gallery/artifact-header. The artifact panel's FIXES live in ./fixes.ts (header, split, canvas).
export {
  ArtifactHeader, ArtifactPanelContext, ARTIFACT_HEADER_NODE,
  type ArtifactHeaderProps, type ArtifactView, type ArtifactHeaderIconSet,
} from './ArtifactHeader'
export { VersionMenu, type VersionMenuProps, type ArtifactVersionRow } from './VersionMenu'
export { VersionBanner, type VersionBannerProps } from './VersionBanner'
export { TYPE_ICONS, TYPE_ICON_NODES, CSV_ICON } from './typeIcons'
export { ARTIFACT_PANEL_FIXES, useArtifactFix, type ArtifactPanelFixId } from './fixes'
export * as artifactHeaderIcons from './icons'
