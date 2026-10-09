# ChargePoint CLM — Playbook Agent, design notes

Prototype: **Playbook Studio** (published artifact, 15 Sep 2026). Clickable HTML, ChargePoint-branded, single accent.

## The flow
1. **Start** — 9 contract-type cards + free-text composer (Claude-style bottom panel). Type is inferred from prose if typed.
2. **Connect a source** — picking a type immediately asks where the executed agreements live: **SharePoint** (`Legal — Contracts › Executed › <type>`) or **OneDrive** (`Contracts (shared with you) › Executed`), each shown with its file count and last-modified. No third-party CLM vendors — ChargePoint's own Microsoft 365 tenancy.
3. **Permission** — inline cards, not a settings screen. Three actions every time: *Always allow / Allow once / Don't allow*, with a "What I will read" disclosure and an explicit "never" line. Granted sources show in the left rail with scope + Revoke, and in a Permissions sheet in the header.
   - `Connect a document source` — SharePoint or OneDrive, read-only, the chosen folder only
   - `Version history on those files` — earlier versions and tracked changes; this is where positions *given up* live, as opposed to where they landed
   - `Deal Desk approval matrix` — requested **mid-question**, at the moment of need, as an answer option. This is the showpiece moment.
4. **Learning** — visible extraction steps with real counts, then a findings card that shows the arithmetic: *N settled the same way every time (won't ask), M new issues added to the library, K contradictions between template and signed paper (the only things needing a human).*
5. **Questions** — three, one at a time, in the bottom panel. Each carries: question, evidence from the corpus, what it *affects* (named clauses), 2–3 option chips, keyboard 1/2/3, "Skip — use the precedent", and free text. This is how the volume stays low: the agent decides everything precedent can decide and asks only where the evidence conflicts.
6. **Playbook artifact** — provisions with a five-tier ladder, each with copy-ready language. Click a tier to set it as the standard. Six views; the clause view is the "which clauses does this issue impact" answer. Publishes back to the Legal library.

## Question-design rules used
- Never more than one question on screen.
- Every question states its evidence and its blast radius in clauses.
- Every question has an escape hatch that costs nothing.
- Answers are consequential — they pre-select tiers in the playbook and are labelled "set by you".
- Permissions are requested where they are needed, never batched upfront.

## Knowledge base
9 contract types, ~76 provisions, each with risk tier, category, clause impacts, rationale and tiered positions:
MSA · Fleet CaaS · Site Host · Reseller/Channel · Public Sector · Utility Program · NDA · Vendor/Installation · DPA.
Two provisions in the MSA set are flagged **New** (firmware sunset/EOL, OCPP 2.0.1 portability) to demonstrate the agent extending its own library from the connected documents.

## Open questions for the team
- Does the approver ladder come from Deal Desk or live in the playbook itself?
- Which SharePoint site is the real home for executed agreements, and is version history retained far enough back to be useful?
- Should publishing version the playbook, or open a review cycle first?
- Segment-specific playbooks (multifamily vs retail site host) — one playbook with segment rules, or two?
