# Tapa — Safety Notices, Flagged Items & Customs Guidance Model

Decided June 30, 2026. This document is a child of TAPA_TRUST_SAFETY_ESCROW.md, covering one specific piece in depth: what notices Tapa shows sender and carrier, when, and what data backs them. Read the trust doc first for the positioning this builds on — Tapa is infrastructure, not an insurer, and that same logic applies here.

## What this system is and is not

This is an informational nudge system, not a compliance gate. Tapa does not block a booking because an item might have customs or air-safety issues. It surfaces what it knows, says clearly what it doesn't know, and leaves the decision with the sender or carrier — same as the rest of the trust model. Nothing here should ever read as Tapa guaranteeing an item will clear customs or pass airport security.

## Two different kinds of rules — keep them separate

These get confused constantly, and the copy needs to keep them apart or it becomes misleading.

**1. Air travel safety rules (lithium batteries, aerosols, liquids, weapons, sharp objects).** These come from IATA, TSA, and FAA passenger baggage guidance. They're consistent worldwide because they're aviation safety rules, not import law — the same rule about lithium battery watt-hour limits applies regardless of destination. This is the one category Tapa can speak about with real confidence.

**2. Customs and import legality per destination country.** This varies by country, changes without notice, and Tapa has no authority to confirm it. The honest answer here is always "verify this yourself," paired with a link to that country's official resource, never a yes/no from Tapa.

## Data source: curated internal table, not a licensed feed

The full IATA Dangerous Goods Regulations dataset (Section 4.2, 4,000+ records) is a paid commercial product licensed to airlines, freight forwarders, and cargo handlers. It's built for air cargo operations and is not the right tool here — Tapa carriers are passengers carrying luggage, not cargo handlers processing freight.

The right-sized resource is the free, public passenger baggage guidance already published by IATA, TSA, and FAA. This becomes a small internal table — realistically 40 to 60 categories, not thousands — built once from those sources and reviewed periodically (rules do shift occasionally, e.g. lithium battery watt-hour limits, power bank restrictions). No API subscription, no licensing cost, no live feed dependency.

Initial category list to seed the table (not exhaustive, expand as real bookings surface edge cases):

- Lithium batteries / power banks / spare batteries
- Liquids, gels, aerosols (the 100ml carry-on rule)
- Electronics with built-in batteries (laptops, phones, e-cigarettes, vapes)
- Weapons, ammunition, anything weapon-shaped (including toys/replicas)
- Sharp objects and cutting implements
- Flammable items (lighters, lighter fluid, matches)
- Compressed gas / aerosol cans
- Food, plant, or animal-origin products
- Medications (prescription documentation may be needed)
- Currency / cash over typical declaration thresholds
- Branded/luxury goods (counterfeit risk at customs, not an air-safety issue)
- Documents (passports, legal paperwork — sensitivity is about loss/fraud risk, not customs)

Each category needs: a short plain-language notice, a risk level (informational / caution / likely restricted), and whether it's an air-safety rule or a customs-variability flag, since the copy differs for each.

## How the matching actually works

Sender or carrier types a free-text item description. The system checks that text against the category table using keyword/category matching — not a full AI model. This is intentionally simple: fast, free, no per-check API cost, no latency. "Power bank," "laptop battery," "perfume," "knife" match directly against table entries and surface the matching notice instantly.

A fuzzier matching layer (catching "spare battery" and "extra phone battery" as the same thing) is a real upgrade path worth doing later, once there's enough real description data to know what variations actually show up. Not needed for v1 — keyword matching against a well-built category list covers the common cases.

## Where notices appear in the flow

Same notice component everywhere — small, dismissible with a close button, never blocks the primary action (posting, messaging, accepting, paying). Inline banner or small modal, never a full-screen interrupt.

**Sender side:**
- While typing the item description (on blur or real-time, whichever tests better at 412px) — first chance to catch a flagged item before they've invested more time in the listing
- Final review screen before posting the request — last chance before it goes live
- Booking confirmation / payment step — last chance before money moves

**Carrier side:**
- Viewing a request before messaging the sender — so they're not three messages deep before realizing the item is a problem
- Accepting the request — last chance before they've committed to carrying it

## Notice copy pattern

Short, factual, no hedge-everything legal language, no AI-sounding filler — matches the existing no-AI-copy rule in the main checklist.

Air-safety example (lithium battery):
> Power banks and spare batteries have airline rules — usually carry-on only, with a watt-hour limit. Worth checking with the carrier's airline before the trip.

Customs-variability example (branded goods):
> Customs treatment for items like this varies by country. We can't confirm it'll clear — check [destination]'s import rules before committing.

Generic fallback when nothing in the description matches the table (still worth a light-touch reminder, not silence):
> Based on what's been shared, nothing here looks flagged in our reference list — but that's not a guarantee. Worth a quick check of the destination country's customs rules if you're unsure.

## What this changes in the existing roadmap

This is a new build item, not previously listed in TAPA_AI_HANDOFF_CHECKLIST.md or TAPA_TRUST_SAFETY_ESCROW.md. It sits alongside the booking interface work (sender flow first, per current priority) rather than the trust-layer build order (reviews, ID verification, messaging) — this is about the listing/booking flow itself, not identity or reputation.

Build order for this piece specifically:
1. Curate the category table (content work — no code yet, just getting categories and copy right)
2. Build the shared notice component (one reusable banner/modal, used at every touchpoint listed above)
3. Wire keyword matching against the item description field
4. Place the component at each of the five touchpoints listed above

## Open items still genuinely unresolved

- Exact wording and risk-level tiering for each category — needs a full pass once the table is drafted, not just the examples above
- Whether the carrier-side notice should differ in tone from the sender-side notice (carrier is the one physically carrying legal risk through security, sender is the one who decided what to send)
- Whether to log when a sender/carrier dismisses a flagged notice, for dispute-record purposes later (ties into the immutable messaging item in the trust doc — same underlying need: a record of what was shown and acknowledged)
- Per-country resource links — needs an actual list of official customs "know before you go" pages for whatever the first handful of active destination countries turn out to be, not built speculatively for every country upfront

*Created June 30, 2026, as a child document of TAPA_TRUST_SAFETY_ESCROW.md, covering the notice/flagged-item system specifically.*