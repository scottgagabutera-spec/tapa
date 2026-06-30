# Tapa — Trust, Safety, Escrow & Customs Model

Decided June 30, 2026. This document resolves the previously open "escrow/fraud-prevention mechanism" question flagged in TAPA_AI_HANDOFF_CHECKLIST.md. Read alongside that file — this is a child document covering one product area in depth.

## The core positioning decision (read this first)

Tapa is infrastructure, not an insurer. The closest comparable is Booking.com or Agoda: the platform makes a transaction between strangers easier and safer to evaluate, but does not guarantee the outcome of that transaction. The sender is a mature customer making an informed choice — they research the carrier, review the conversation history, confirm the flight and meeting point, and decide for themselves whether to send something they can afford to lose. Tapa's job is to make that research easy and the information available trustworthy, not to underwrite the risk itself.

This single decision determines every item below. If this positioning changes later, this whole document needs to be revisited.

## What "escrow" means on Tapa (and what it does not mean)

Escrow on Tapa refers only to payment escrow between sender and carrier. It does not mean item insurance. This matches how Grabr — the closest live comparable doing exactly this kind of cross-border peer transport — actually operates: payment is held once a traveler is matched, released only after the sender confirms delivery, and item loss or damage is not separately insured by the platform.

Mechanism:
- Sender pays at booking; funds held via Stripe Connect with delayed payout to the carrier.
- Funds release to carrier only after sender confirms delivery in-app.
- Either party can flag a dispute before release, which freezes the payout pending manual review.
- Carrier cancellation before pickup triggers full refund to sender.

This is the only piece of this document that is a hard technical build (payment plumbing). Everything else below is trust infrastructure, not insurance.

## Why no item insurance (and what replaces it)

Standard parcel insurance products (Shipsurance, EasyPost/XCover, Shippo, ParcelGuard) are built around commercial carrier shipments with a tracking number and a defined chain of custody. None of them can underwrite an item hand-carried in someone's personal luggage, because there's no scan event to verify a claim against. This isn't a build gap to solve — it's a structural mismatch between that product category and what Tapa is. Building or licensing a custom underwritten insurance product is a multi-month enterprise insurance deal, not a feature, and shouldn't block the roadmap.

What replaces insurance is information quality, so the sender's own risk judgment is actually well informed:
- Declared item value entered by sender at booking (not verified by Tapa — same as Grabr's model)
- Photo of the item at handover, tied to the booking record
- ID-verified identity on both sides, so the declared value and the people exchanging it are tied to real, checkable identities
- Full review/rating history on both carrier and sender profiles
- Preserved, unmodifiable in-app message thread as the dispute record

## Fraud minimization model (adapted from BlaBlaCar's trust framework)

BlaBlaCar solved trust-between-strangers at 27 million users for an even more intimate transaction (sharing a car) without insurance. Their framework is the right shape for Tapa. Adapted version:

| Pillar | Tapa implementation |
|---|---|
| Declared | Name, photo, short bio on every profile |
| Rated | Two-way rating after every completed delivery |
| Engaged | Payment commitment at booking (already financially invested) |
| Active | Last-active timestamp and response rate shown on profile |
| Moderated | Tapa can suspend accounts on reported abuse; messages are platform-visible for dispute review |
| Social | Optional — phone/email verified at minimum; deferred for v1 |

Build priority, in order:
1. ID verification (Stripe Identity — same vendor as payment escrow, single integration)
2. Two-way review/rating system (flagged as not yet built in the main checklist; this is now the top priority item from that list)
3. Immutable message thread — once a booking is confirmed, messages cannot be edited or deleted by either party
4. Response-rate / last-active display on carrier and sender profiles

## Customs and prohibited items

There is no single worldwide customs database, and Tapa should not attempt to build or own one. Even logistics majors license this (e.g. Descartes' Customs Info Database, a paid product covering 170+ countries) rather than maintain it themselves. Grabr's terms put full responsibility for customs duties, import legality, and compliance on the traveler, and Tapa should adopt the same structure:

- Terms of Use: customs duties, import legality, and compliance are the traveler's sole responsibility (needs real legal review before launch — this is not a place to use AI-drafted legal language unreviewed)
- Booking flow: traveler is prompted to factor estimated customs costs into their fee before accepting
- Resource layer: link out to existing official sources per major destination country (CBP-style "know before you go" pages), rather than building proprietary data
- One genuinely universal layer worth surfacing in-app: IATA Dangerous Goods Regulations — this is the one customs-adjacent rule set that is consistent across all airlines and destinations (lithium battery limits, liquids, prohibited dangerous goods), so it's worth a simple in-app checklist before a trip is posted or a delivery accepted

## What this changes in the existing roadmap

From the "unsolved product questions" section of TAPA_AI_HANDOFF_CHECKLIST.md:
- Escrow/fraud-prevention mechanism: **resolved** — payment-only escrow via Stripe Connect, fraud minimized through trust infrastructure (ID verification, reviews, immutable messaging), not through insurance. No further open question here unless the positioning itself changes.
- Reviews/ratings: **moves up in priority** — this is now load-bearing for the whole trust model, not a nice-to-have for later.
- ID verification: **new build item**, not previously listed. Pair with the Stripe Connect integration since they share a vendor.

No new hardcoded values, colors, or fonts are introduced by any of this — it's backend/product logic, not UI styling, so it doesn't touch the eleven statements' visual requirements directly. It does serve statement #5 (Giants Way) directly, since this is the same trust model BlaBlaCar and Grabr both run at scale.

## Open items still genuinely unresolved

- Exact dispute resolution process once a flag is raised (who reviews, what evidence is weighted, timeline) — not designed yet
- Whether Tapa takes any cut responsibility in disputes versus pure pass-through arbitration
- Legal review of Terms of Use language for liability shifting — needs an actual lawyer, not just this document
- Whether/when to revisit insurance as a paid add-on once transaction volume justifies an underwriting conversation

*Created June 30, 2026, resolving the escrow/fraud-prevention open question from TAPA_AI_HANDOFF_CHECKLIST.md. Intended either as a standalone reference or to be merged into that file under a new "Trust, Safety & Escrow" section.*