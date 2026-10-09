// Artifact type marks ("Artifact-Icons / Type=…", set 12910:607505..: Documents 12910:607508, Spreadsheets 12910:607509),
// the multicolour .md-shaped glyphs of shared/svg-icons (82.9 x 91.4, drawn at 18.13 x 20 in the header's 28px slot).
// The reference frames were exported with this generation; the library has since moved to the badged 20px
// "Artifact Icon" (15193:1281888), which no frame of this journey draws. Vite inlines each as a data URI, which also
// keeps their gradient ids apart.
import type { HeaderIcon } from '../../fixtures/artifacts'
import documents from '../../assets/artifact/type-documents.svg'
import markdowns from '../../assets/artifact/type-markdowns.svg'
import app from '../../assets/artifact/type-app.svg'
import spreadsheets from '../../assets/artifact/type-spreadsheets.svg'
import pdfs from '../../assets/artifact/type-pdfs.svg'
import presentation from '../../assets/artifact/type-presentation.svg'
import csv from '../../assets/artifact/type-csv.svg'

/** The type mark for each header icon. connector and JSON have no mark in this generation: they borrow the closest. */
export const TYPE_ICONS: Record<HeaderIcon, string> = {
  App: app,
  Spreadsheets: spreadsheets,
  Documents: documents,
  PDFs: pdfs,
  Markdowns: markdowns,
  Presentation: presentation,
  connector: documents,
  JSON: markdowns,
}

/** Table CSV's mark (orange grid), for callers that show CSV files. */
export const CSV_ICON = csv

/** Figma node of each "Artifact-Icons" variant that has one in this file. */
export const TYPE_ICON_NODES: Partial<Record<HeaderIcon, string>> = {
  Documents: '12910:607508',
  Spreadsheets: '12910:607509',
}
