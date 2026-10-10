import type { ArtifactType } from '../../fixtures/artifacts'
import all from '../../assets/artifact-filter/all.svg'
import document from '../../assets/artifact-filter/document.svg'
import spreadsheet from '../../assets/artifact-filter/spreadsheet.svg'
import presentation from '../../assets/artifact-filter/presentation.svg'
import application from '../../assets/artifact-filter/application.svg'
import pdf from '../../assets/artifact-filter/pdf.svg'
import email from '../../assets/artifact-filter/email.svg'
import json from '../../assets/artifact-filter/json.svg'
import flow from '../../assets/artifact-filter/flow.svg'
import playbook from '../../assets/artifact-filter/playbook.svg'

/** The "All Types" menu's 14 x 20 row icons (Menu items 12266:650710, exported 2026-10-10). Markdown and CSV have no row. */
export const FILTER_ICONS: Record<'all' | ArtifactType, string | undefined> = {
  all, document, spreadsheet, presentation, application, pdf, email, json, flow, playbook, markdown: undefined, csv: undefined,
}
