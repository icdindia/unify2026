import { useState, type ReactNode } from 'react'
import { DropdownGroup, DropdownItem, DropdownMenu, DropdownSeparator, menuIcons } from '../../components/dropdown-menu'
import { GallerySection, Specimen, Specimens } from '../GalleryPage'
import type { GalleryMeta } from '../registry'
// the Apps / Download menu's 14px leads, exported from 3780:178345 (google-sheets, sharepoint-microsoft, coloured
// logos Type=excel, Artifact Icon Type=PDFs / Type=CSV, copy-01)
import sheetsLogo from '../../assets/menus/google-sheets.svg'
import sharepointLogo from '../../assets/menus/sharepoint.svg'
import excelLogo from '../../assets/menus/excel.svg'
import pdfIcon from '../../assets/menus/pdf.svg'
import csvIcon from '../../assets/menus/csv.svg'
import copyIcon from '../../assets/menus/copy-01.svg'

export const meta: GalleryMeta = {
  title: 'Dropdown list item (rich)',
  figmaNodeIds: ['11750:513212', '11780:383826'],
  group: 'Menus',
  description: 'Contract ask 5 on DropdownItem: description (Supporting Text=On), selected (check, menuitemradio), shortcut, a leading node or a 22px avatar, and the H2 header row. Plain items render exactly as before.',
}

/** A menu laid out in place (flip off) inside a box of its height, so the gallery can show it open. */
function Open({ width, height, className, children }: { width: number; height: number; className?: string; children: ReactNode }) {
  return (
    <div style={{ position: 'relative', flex: 'none', width, height }}>
      <DropdownMenu position={{ left: 0, top: 0 }} width={width} flip={false} className={className} aria-label="Sample menu">{children}</DropdownMenu>
    </div>
  )
}

/** A 14px lead image (decorative: the row is named by its label). */
const Logo = ({ src }: { src: string }) => <img alt="" src={src} />

export default function DropdownItemsGallery() {
  const [role, setRole] = useState<'commenter' | 'editor'>('commenter')
  return (
    <GallerySection title="Variants" description="Real :hover fills; keyboard: ↑ ↓ Home End move through every row, including the radio rows.">
      <Specimens min="md">
        <Specimen label="Role menu: Supporting Text=On, Selected=On, divider, danger (9256:470679)" nodeId="11991:747744" overflow="visible">
          <Open width={224} height={137}>
            {/* the frame overrides the Commenter row's content to 6 / 12 / 6 / 8, gap 6 (check at x 196) */}
            <DropdownItem label="Commenter" description="Comment and view project" selected={role === 'commenter'} onClick={() => setRole('commenter')} className="ddi--pad-end-lg" />
            <DropdownItem label="Editor" description="Chat and edit project" selected={role === 'editor'} onClick={() => setRole('editor')} />
            <DropdownSeparator size="md" />
            <DropdownItem label="Remove Access" danger icon={menuIcons.prohibition} />
          </Open>
        </Specimen>
        {/* 332 wide, as drawn: at phone width the stage scrolls sideways instead of the page */}
        <Specimen label="Apps / Download: H2 headers, leading logo, description (3780:178345)" nodeId="3780:178345">
          <Open width={332} height={342} className="dd--r10">
            <DropdownGroup label="Open in">
              <DropdownItem label="Google Sheets" description="Exports a copy to your Google Drive" leading={<Logo src={sheetsLogo} />} />
              <DropdownItem label="Sharepoint" description="Exports a copy of the spreadsheet to SharePoint" leading={<Logo src={sharepointLogo} />} />
            </DropdownGroup>
            <DropdownSeparator size="md" />
            <DropdownGroup label="Download">
              <DropdownItem label="Excel" description="Downloads a file you can open in Excel or Numbers" leading={<Logo src={excelLogo} />} />
              <DropdownItem label="PDF" description="Downloads the spreadsheet as a PDF" leading={<Logo src={pdfIcon} />} />
              <DropdownItem label="CSV" description="Downloads a plain file for anything that takes CSV" leading={<Logo src={csvIcon} />} />
            </DropdownGroup>
            <DropdownSeparator size="md" />
            <DropdownItem label="Copy to clipboard" description="Copies the table so you can paste it straight in" leading={<Logo src={copyIcon} />} />
          </Open>
        </Specimen>
        <Specimen label="End Type=Shortcut, Selected=On without description, State=Disabled" nodeId="11750:513283" overflow="visible">
          <Open width={240} height={112}>
            <DropdownItem label="Copy" icon={menuIcons.pencil} shortcut="⌘C" />
            <DropdownItem label="Newest" selected />
            <DropdownItem label="Archive" icon={menuIcons.archive} shortcut="⌘E" disabled />
          </Open>
        </Specimen>
        <Specimen label="Start Type=Default (14px icon), Supporting Text=On: the icon top-aligned 2px down" nodeId="11750:513212" overflow="visible">
          <Open width={240} height={96}>
            <DropdownItem label="Pin Chat" description="Keeps it at the top of the rail" icon={menuIcons.pin} />
            <DropdownItem label="Archive" description="Hides it from Chats" icon={menuIcons.archive} />
          </Open>
        </Specimen>
        <Specimen label="Start Type=Avatar (22px), Supporting Text=On / Off" nodeId="11750:513212" overflow="visible">
          <Open width={240} height={128}>
            <DropdownItem label="Matt Rivera" description="mattrivera@unifyapps.com" avatar={{ name: 'Matt Rivera', colour: 'plum-700' }} />
            <DropdownItem label="Grace Coleman" description="gracecoleman@unifyapps.com" avatar={{ name: 'Grace Coleman', colour: 'warm-blue-700' }} />
            <DropdownItem label="John Whitaker" avatar={{ name: 'John Whitaker', colour: 'error-600' }} shortcut="⌘J" />
          </Open>
        </Specimen>
        <Specimen label="Unchanged: the Projects card menu (4767:135942)" overflow="visible">
          <Open width={140} height={142}>
            <DropdownItem icon={menuIcons.pin} label="Pin" />
            <DropdownItem icon={menuIcons.pencil} label="Edit Project" />
            <DropdownItem icon={menuIcons.users} label="Share Project" />
            <DropdownSeparator />
            <DropdownItem icon={menuIcons.trash} label="Delete" danger />
          </Open>
        </Specimen>
      </Specimens>
    </GallerySection>
  )
}
