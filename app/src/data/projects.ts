// Mock project data for the Projects screens. Names, owner and dates are the Figma file's placeholder content
// (Projects list 11657:386523); the slugs are the prototype's addressing scheme (#/projects/<slug>).

export type Project = {
  slug: string
  name: string
  /** Card meta line. */
  items: number
  owner: string
  updated: string
  /**
   * The breadcrumb label as drawn in Figma, when it differs from the name. Every dashboard frame leaves the crumb on
   * the placeholder "New Project Name". The "crumb-shows-project-name" fix replaces it with the name.
   */
  crumbAsDesigned?: string
  /**
   * The page title as drawn in Figma, when it differs from the name. The dashboard is drawn once, for "Client
   * Onboarding", so a project opened from a card is titled that way "As designed"; the fix shows its own name.
   */
  titleAsDesigned?: string
}

/** The dashboard frame's breadcrumb placeholder (14045:584747, 15054:105151, 13701:756891, 11780:448662). */
const CRUMB_AS_DRAWN = 'New Project Name'

const CARD_NAMES = [
  'Banking Issues', 'Docebo UI Assets', 'DT ODS System', 'Product Development', 'Quarterly Reports', 'HR Documents',
  'Customer Support', 'Legal Documents', 'Sales Materials', 'Product Development', 'Quarterly Reports', 'HR Documents',
]

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** The 12 cards of the Projects landing, in the file's order. Repeated names get -2, -3 … so every slug is unique. */
export const PROJECT_CARDS: Project[] = (() => {
  const seen = new Map<string, number>()
  return CARD_NAMES.map(name => {
    const base = slugify(name)
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    return {
      slug: n === 1 ? base : `${base}-${n}`, name, items: 12, owner: 'Ajeetabh Narayan', updated: '12.04.2026',
      crumbAsDesigned: CRUMB_AS_DRAWN, titleAsDesigned: 'Client Onboarding',
    }
  })
})()

/** The project the dashboard frame (14045:584747 / 15054:105151) was drawn for. It has no card on the landing. */
export const DESIGNED_PROJECT: Project = {
  slug: 'client-onboarding', name: 'Client Onboarding', items: 12, owner: 'Ajeetabh Narayan', updated: '12.04.2026',
  crumbAsDesigned: CRUMB_AS_DRAWN,
}

/**
 * The project page of the Chat + Artifacts nav-behaviour frames (13701:756891, 11780:448662): a pinned project opened
 * from the rail. Its title is the file's placeholder, typo included; its crumb is the same "New Project Name".
 */
export const NAV_BEHAVIOUR_PROJECT: Project = {
  slug: 'project-name', name: 'Project Name Longname comes till herea', items: 12, owner: 'Ajeetabh Narayan', updated: '12.04.2026',
  crumbAsDesigned: CRUMB_AS_DRAWN,
}

export function projectBySlug(slug: string): Project | undefined {
  return [DESIGNED_PROJECT, NAV_BEHAVIOUR_PROJECT].find(p => p.slug === slug) ?? PROJECT_CARDS.find(p => p.slug === slug)
}

/** Description under the dashboard title: option 1 draws the long one, option 2 the short one. */
export const PROJECT_DESCRIPTION = {
  long: 'Tracking Q1 close activities, variance analysis, and exec reporting, including a review of key performance indicators and strategic alignment.',
  short: 'Tracking Q1 close activities',
}

/** "Move to project" submenu targets (14045:569049). */
export const MOVE_TARGETS = ['test', 'Desktop app', 'knowledge retrieval', 'testingg']
