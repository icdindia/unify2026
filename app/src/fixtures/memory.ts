// Memory (new-memory 01 and 03). Copy read from 9915:762550 and the Settings > Memory pane 10112:408460
// (an instance of "Memory" 10112:406770 on the Settings page).

/** The bar above the composer (Alert / Size=md, Color=Grey). Q30: md only; sm (10112:411197) is the dimmed alternative. */
export const MEMORY_BAR = { label: 'Memory update:', items: 'Tricon, Areas and 2 more', cta: 'View Memory' }

export const SETTINGS_SECTIONS = ['General', 'Memory', 'Models', 'Skills', 'Get App & Extensions'] as const

export type MemoryItem = { id: string; title: string; summary: string; updated: string; isNew?: boolean }

/** Settings > Memory pane. Items under the fold (Proofpoint and below) are listed as drawn. */
export const MEMORY_SETTINGS = {
  title: 'Memory',
  generate: {
    title: 'Generate memory from chats',
    body: "Allow Unify's AI to remember relevant context from your chats. This setting controls memory for both chats and projects",
    on: true,
  },
  importer: {
    title: 'Import memory from other AI providers',
    body: "Bring relevant context and data from another AI provider to Unify's AI. We'll provide a prompt you can use to fetch the memory from your other account",
    cta: 'Start Import',
  },
  groups: [
    {
      title: 'Profile',
      items: [
        { id: 'week', title: 'How the week runs', summary: 'The fixed points in a normal week, and the two he will not give up', updated: 'Updated 13 Sept', isNew: true },
        { id: 'role', title: 'Role and book', summary: 'Eleven renewal accounts, what he owns on them, and where his authority stops', updated: 'Updated 12 Sept' },
      ],
    },
    {
      title: 'Topics',
      items: [{ id: 'cycling', title: 'Cycling', summary: 'Weekend riding, and the part of it he actually likes', updated: 'Updated 8 Sept' }],
    },
    {
      title: 'Areas',
      items: [
        { id: 'tricon', title: 'Tricon renewal', summary: 'An $840k renewal due 30 November, held up by a clause rather than by the product', updated: 'Updated 14 hours ago', isNew: true },
        { id: 'proofpoint', title: 'Proofpoint evaluation', summary: 'A security-led evaluation, and what the room will actually ask', updated: 'Updated 15 Sept' },
        { id: 'iron-mountain', title: 'Iron Mountain', summary: 'An account that changed hands mid-quarter and has not settled since', updated: 'Updated 11 Sept' },
        { id: 'greif', title: 'Greif expansion', summary: 'A seat expansion with a board date on it and pricing that has not gone out', updated: 'Updated 10 Sept' },
      ],
    },
    { title: 'People', items: [] },
  ] as { title: string; items: MemoryItem[] }[],
  input: "Tell Unify's AI what to change or remove",
}
