import docUrl from '../../assets/artifact-types/glyph-documents.svg'
import xlsUrl from '../../assets/artifact-types/glyph-spreadsheets.svg'
import pptUrl from '../../assets/artifact-types/glyph-presentation.svg'
import pdfUrl from '../../assets/artifact-types/glyph-pdfs.svg'
import mdUrl from '../../assets/artifact-types/glyph-markdowns.svg'
import htmlUrl from '../../assets/artifact-types/glyph-app.svg'
import htmlWindowUrl from '../../assets/artifact-types/glyph-app-window.svg'
import csvUrl from '../../assets/artifact-types/glyph-csv.svg'
import flowUrl from '../../assets/artifact-types/glyph-connector.svg'
import jsonUrl from '../../assets/artifact-types/glyph-json.svg'
import pdfV2Url from '../../assets/artifact-types/glyph-pdf-v2.svg'
import type { ArtifactType, InlineCardState } from '../../fixtures/artifacts'

// The type mark on the paper sheet of an inline artifact card and of a files-panel artifact row. Multicolour marks, kept
// as files in src/assets/artifact-types (provenance in each file). Shapes, measured on the 1440 reference PNGs:
//   doc   folded-corner document, 18.13 x 20 (DOCX blue, XLSX green, PDF red, MD and CSV dark, JSON slate)
//   tile  rounded tile, 20.6 x 20.25 (PPTX orange layout, Interactive HTML purple window of 15 / 15a, Flow terracotta)
//   window  the wide purple browser window of 16-18 (Interactive HTML), 23 x 16.73
//   pdf-v2  the newer PDF mark of 16a (14876:285160): red stacked page with an orange badge, drawn 26 x 26
export type ArtifactGlyph =
  | 'doc' | 'xls' | 'ppt' | 'pdf' | 'md' | 'html' | 'html-window' | 'csv' | 'flow' | 'json' | 'pdf-v2'

export type GlyphShape = 'doc' | 'tile' | 'window' | 'pdf-v2'

export const GLYPHS: Record<ArtifactGlyph, { url: string; shape: GlyphShape; label: string }> = {
  doc: { url: docUrl, shape: 'doc', label: 'Document' },
  xls: { url: xlsUrl, shape: 'doc', label: 'Spreadsheet' },
  ppt: { url: pptUrl, shape: 'tile', label: 'Presentation' },
  pdf: { url: pdfUrl, shape: 'doc', label: 'PDF' },
  md: { url: mdUrl, shape: 'doc', label: 'Markdown' },
  html: { url: htmlUrl, shape: 'tile', label: 'Interactive HTML' },
  'html-window': { url: htmlWindowUrl, shape: 'window', label: 'Interactive HTML' },
  csv: { url: csvUrl, shape: 'doc', label: 'Table' },
  flow: { url: flowUrl, shape: 'tile', label: 'Flow diagram' },
  json: { url: jsonUrl, shape: 'doc', label: 'JSON' },
  'pdf-v2': { url: pdfV2Url, shape: 'pdf-v2', label: 'PDF' },
}

/** `Inline Artifact Cards / State=…` (set 5288:119600) to its glyph. Application-HTML takes the window mark that most
 *  frames draw (16, 17, 18); 15 / 15a draw the purple tile ('html'). */
export const GLYPH_OF_STATE: Record<InlineCardState, ArtifactGlyph> = {
  DOC: 'doc', XLS: 'xls', PPT: 'ppt', PDF: 'pdf', Markdown: 'md', 'Application-HTML': 'html-window',
  'Table CSV': 'csv', 'Flow Diagram': 'flow', JSON: 'json',
}

/** The glyph an artifact type gets (fixture ArtifactType). */
export const GLYPH_OF_TYPE: Record<ArtifactType, ArtifactGlyph> = {
  document: 'doc', spreadsheet: 'xls', presentation: 'ppt', pdf: 'pdf', markdown: 'md', application: 'html-window',
  csv: 'csv', flow: 'flow', json: 'json', playbook: 'md', email: 'doc',
}

/** The variant of set 5288:119600 that draws a glyph (data-node-id of a card). */
export const CARD_VARIANT_OF_GLYPH: Record<ArtifactGlyph, string> = {
  doc: '5288:119599', xls: '5288:119598', ppt: '5288:119595', pdf: '5288:119594', 'pdf-v2': '5288:119594',
  md: '5288:119596', html: '5288:119597', 'html-window': '5288:119597', csv: '6190:143273', flow: '8589:239203',
  json: '10157:488545',
}
