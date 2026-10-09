# Where the card metadata comes from

Decided 15 Sep 2026, after the question "how will the app get the metadata in each contract type?". Implemented on the landing page of **Playbook Studio**.

## Two provenances, shown separately

Every contract-type card carries two rows, and they must never be collapsed into one number:

| Row | Source | Example |
|---|---|---|
| `LIBRARY` | The seeded issue library — authored by legal ops with outside counsel, versioned like code | `11 issues · 19 clauses` |
| `YOUR PAPER` | Derived from the connected SharePoint / OneDrive folder | `14 signed · 2 to decide` `+2 new` |

The library row is a claim about what the tool knows. The paper row is a claim about the evidence behind it. A card showing only the first reads as more authoritative than it is.

## Cold start
Before any source is connected, cards show the library row only, and a single bar above the grid offers to connect — not nine "not connected" labels. Types whose library is thin (six issues or fewer) additionally show a `THIN — no signed paper read yet` row, so the weak cards declare themselves rather than looking equally solid.

## Unclassified files are a first-class state
Classification is probabilistic and it fails in ordinary ways: a scanned parties block, an amendment with no parent, an MOU that may not be a contract. Those files are excluded from every count and surfaced with a Review action (now in the Permissions sheet, after the landing status bar was removed). Classifying one adds it to that type's count immediately; nothing is moved or renamed in the source. Seeded examples in the prototype are real failure shapes, not placeholders.

## Pipeline behind the paper row
1. Enumerate the folder via Microsoft Graph, filter to contract file types
2. Classify each document to a type — from the first page, defined-terms block and clause headings, **not** the filename
3. Parse structure for the clause inventory
4. Match clauses to library issues (defined-term and heading rules first, embeddings for the remainder)
5. Extract the settled position per issue; diff against the template, and diff signed against earlier versions to find what was conceded

## Third layer, later
Published playbooks write back which tier was chosen and which fallbacks survived live negotiation. That, not an author's guess, should eventually drive risk tier and frequency metadata.

## Still open
- **Canonical clause list** — argued position: always ChargePoint's own template, with counterparty sections mapped onto it. Otherwise "§12" means nothing across 14 counterparties, and the By-clause view is unreadable.
- Who owns library versioning and its review cycle.
- Whether classification corrections are a user action (current design) or a silent retrain.
