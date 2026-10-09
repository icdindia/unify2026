# Provision model — what the playbook artefact contains

Adopted 15 Sep 2026 from the client's reference artefact ("ChargePoint NDA Negotiation Playbook — Complete Provision Inventory"). Implemented in **Playbook Studio**.

Vocabulary changed throughout: **provisions**, not issues. The artefact is a *provision inventory*.

## Five-tier position ladder
Every provision carries a ladder; not every provision carries every rung.

| Tier | Meaning | Approval |
|---|---|---|
| **CP Template** | Strongest position, as drafted | None — sign as is |
| **Also acceptable** | Alternate we will take without escalating | None |
| **Fallback 1** | First approved concession | Contracts Manager to $250k ACV, then Associate GC |
| **Fallback 2** | Second approved concession | Always above the Contracts Manager; named per provision |
| **Red line** | Do not accept | General Counsel only, not delegable at any deal size |

A provision with no approved fallback runs CP Template → Also acceptable → Red line and shows a `BASELINE` badge. One with fallbacks shows `FALLBACKS` plus the frequency pill.

Approval routing was later removed from the artefact UI for being visually overwhelming; the table above remains the policy of record.

## Per-provision metadata
- Sequential number within the type (it is an *inventory*)
- `Template §N` reference into the ChargePoint template, derived from the first clause it moves
- Fallback status — none / one tier / two tiers
- **Negotiation frequency** — % of executed deals where it was negotiated
- **Where it settled** — which tier, most often
- **Average rounds**
- Clauses it moves
- `Off template` flag — the provision is not in ChargePoint paper at all
- Risk tier (critical / elevated / standard)
- **Citation count per tier** — how many executed agreements closed at that rung, derived by `tierCounts()` and reconciling exactly with the record line

## Six views
1. **All provisions** — search, `All / Has fallbacks / Baseline only`, risk filter
2. **By clause** — every template section and which provisions move it, counterparty sections mapped onto ChargePoint numbering
3. **Counterparty-introduced** — provisions that arrive on their paper; the off-template ones open at "strike it" and the ladder is what happens when striking fails
4. **Deferred decisions** — open questions with owner and due. **A question skipped in the interview lands here** rather than being silently decided
5. **Negotiation data** — the full table plus the headline: which three provisions account for most of the negotiation effort
6. **Quick reference** — every red line on one screen, where the time goes, critical provisions with their current standard

## Colour
Five tiers, five hues, low saturation: green (CP Template), blue (Also acceptable), yellow (Fallback 1), orange (Fallback 2), red (Red line). Each position is a tinted card with the tier name in the matching hue and the position text in a white inset box. This replaced an earlier two-hue scheme plus a legend — the tint identifies the tier, so no legend is needed.

## Content count
Nine contract types, ~76 provisions, 25 of them carrying a second fallback tier, 9 off-template provisions found on counterparty paper, one to two deferred decisions seeded per type.
