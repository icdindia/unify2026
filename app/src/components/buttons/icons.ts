// Icons the button primitives are used with, exported from Figma (via prototypes/project-dashboard/assets).
// Vite inlines each as a data URI.
import tabChats from '../../assets/chrome/tab-chats.svg'
import tabRoutines from '../../assets/chrome/tab-routines.svg'
import tabArtifacts from '../../assets/chrome/tab-artifacts.svg'
import tabFiles from '../../assets/chrome/tab-files.svg'
import tabSettings from '../../assets/chrome/tab-settings.svg'
import filter14 from '../../assets/chrome/pl-filter-14.svg'
import sort14 from '../../assets/chrome/pl-sort-14.svg'
import filter16 from '../../assets/chrome/pl-filter.svg'
import sort16 from '../../assets/chrome/pl-sort.svg'
import moreVertical16 from '../../assets/chrome/row-dots-vertical.svg'
import plusWhite14 from '../../assets/chrome/pl-plus-white.svg'
import refresh14 from '../../assets/chrome/refresh-ccw-01.svg'

/** 14px icons of the option 1 underline tabs (inside page). */
export const tabIcons = { chats: tabChats, routines: tabRoutines, artifacts: tabArtifacts, files: tabFiles, settings: tabSettings }

/** FilterButton icons: 14px for size sm (inside page), 16px for size xs (Projects page). */
export const toolbarIcons = { filter14, sort14, filter16, sort16 }

/**
 * IconButton md "more" (the table row ⋮), BrandButton md "New Project" plus, and refresh-ccw-01 14 (#6A6662, rebuilt
 * from the vector of I6944:511817;70877:13907;3466:438465) for Button md Secondary "Recreate the Artifact".
 */
export const buttonIcons = { moreVertical16, plusWhite14, refresh14 }
