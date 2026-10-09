import { useMemo } from 'react'
import {
  artifact, CHAT_FILES, CHAT_FILES_GRID_ORDER, FILES_PANEL_ARTIFACTS, type ArtifactId, type ChatFile, type FileKind,
} from '../../fixtures/artifacts'
import { pick, useFixPredicate, useResolved } from '../../fixtures/drift'
import { useArtifactCardFix } from '../inline-artifact-card/fixes'
import { GLYPH_OF_TYPE, type ArtifactGlyph } from '../inline-artifact-card/glyphs'
import fileImg from '../../assets/artifact-types/file-img.svg'
import filePdf from '../../assets/artifact-types/file-pdf.svg'
import fileCsv from '../../assets/artifact-types/file-csv.svg'
import fileDoc from '../../assets/artifact-types/file-doc.svg'
import filePpt from '../../assets/artifact-types/file-ppt.svg'
import fileJson from '../../assets/artifact-types/file-json.svg'
import fileSvg from '../../assets/artifact-types/file-svg.svg'
import fileXlsx from '../../assets/artifact-types/file-xlsx.svg'
import thumbDoc from '../../assets/artifact-types/thumb-doc.png'
import thumbSheet from '../../assets/artifact-types/thumb-sheet.png'

/** "File type icon/Label" set 12882:505765: the variant each file kind uses (24 x 24; rows draw it at 36, chips at 12). */
export const FILE_ICON: Record<FileKind, { url: string; nodeId: string }> = {
  IMG: { url: fileImg, nodeId: '12882:505766' },
  PDF: { url: filePdf, nodeId: '12882:505775' },
  CSV: { url: fileCsv, nodeId: '12882:505780' },
  DOC: { url: fileDoc, nodeId: '12882:505776' },
  PPT: { url: filePpt, nodeId: '12882:505783' },
  JSON: { url: fileJson, nodeId: '12882:505804' },
  SVG: { url: fileSvg, nodeId: '12882:505773' },
  XLSX: { url: fileXlsx, nodeId: '12882:505782' },
}

/** Grid thumbnails (image fills of 14607:405534 / 405536, cropped from the 1440 PNG of 14607:403125: the image fill
 *  itself cannot be exported). As drawn, the left column shows the document cover and the right one the sheet. */
export const FILE_THUMB: Record<FileKind, string> = {
  DOC: thumbDoc, IMG: thumbDoc, JSON: thumbDoc, CSV: thumbDoc, PPT: thumbSheet, PDF: thumbSheet, SVG: thumbSheet, XLSX: thumbSheet,
}

/** One row of the panel's "Artifacts" list. `id` is unique per row (Figma repeats Pipeline Command). */
export type FilesPanelArtifact = { id: string; artifact: ArtifactId; name: string; meta: string; glyph: ArtifactGlyph }

export type FilesPanelView = 'list' | 'grid'

/** The marks each frame draws on its artifact rows (they do not follow the meta: a PPT mark on "Document • DOCX"). */
const DRAWN_GLYPHS: Record<FilesPanelView, ArtifactGlyph[]> = {
  list: ['ppt', 'pdf', 'doc', 'doc', 'doc'], // 5975:413714
  grid: ['ppt', 'pdf', 'doc'], // 14607:403125
}

/** 14607:403125 (grid) draws three "Pipeline Command" rows with the inline card's meta. */
const GRID_ROWS_AS_DRAWN = Array.from({ length: 3 }, () => ({ artifact: 'pipeline-command' as const, meta: 'Interactive HTML • 123 KB • Version 1' }))

export type FilesPanelData = {
  artifacts: FilesPanelArtifact[]
  /** The count beside "Artifacts": 3 in every frame (5975:413714 draws five rows under it). */
  artifactCount: number
  /** Files in the view's order: the list keeps CHAT_FILES order, the grid the drawn order (DOC PPT / IMG PDF / …). */
  files: ChatFile[]
  fileCount: number
}

/**
 * The commit chat's files panel content for a view, resolved against the review bar's switch.
 * As designed: the rows each frame draws (17: five rows, three files in the list; 18: three Pipeline Command rows, eight
 * tiles). With fixes: the chat's three artifacts with their own meta and mark (fix files-panel-artifacts), and every
 * file in the list too (fix files-list-all-files).
 */
export function useFilesPanelData(view: FilesPanelView): FilesPanelData {
  const applies = useFixPredicate()
  const rowsFixed = applies('files-panel-artifacts')
  const allFiles = useArtifactCardFix('files-list-all-files')
  const resolvedRows = useResolved(FILES_PANEL_ARTIFACTS)
  return useMemo(() => {
    const rows = !rowsFixed && view === 'grid' ? GRID_ROWS_AS_DRAWN : resolvedRows
    const artifacts = rows.map((r, i): FilesPanelArtifact => {
      const a = artifact(r.artifact)
      return {
        id: `${r.artifact}-${i}`, artifact: r.artifact, name: pick(a.name, applies), meta: r.meta,
        glyph: rowsFixed ? GLYPH_OF_TYPE[a.type] : DRAWN_GLYPHS[view][i] ?? GLYPH_OF_TYPE[a.type],
      }
    })
    const byId = new Map(CHAT_FILES.map(f => [f.id, f]))
    const files = view === 'grid'
      ? CHAT_FILES_GRID_ORDER.map(id => byId.get(id)).filter((f): f is ChatFile => !!f)
      : allFiles ? CHAT_FILES : CHAT_FILES.slice(0, 3)
    return { artifacts, artifactCount: 3, files, fileCount: CHAT_FILES.length }
  }, [view, rowsFixed, resolvedRows, allFiles, applies])
}
