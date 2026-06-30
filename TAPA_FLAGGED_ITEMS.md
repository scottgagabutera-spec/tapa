# Tapa — Flagged Items Reference Table

Decided June 30, 2026. This is the data backing TAPA_SAFETY_NOTICES.md — the actual category list, risk levels, and notice copy that the keyword-matching system checks item descriptions against. Read TAPA_SAFETY_NOTICES.md first for how this table is used and why it exists.

Source basis: free public passenger baggage guidance from IATA, TSA, and FAA. Not the licensed IATA cargo dataset — see the notices doc for why that distinction matters. This table should be reviewed periodically since some rules shift (battery watt-hour limits, power bank restrictions have changed before).

## How to read this table

**Type** is either:
- **Air-safety** — consistent worldwide, this is an aviation safety rule, Tapa can speak to it with confidence
- **Customs** — varies by destination country, Tapa cannot confirm, always points the user to verify themselves
- **Both** — has an air-safety component and a separate customs-variability component

**Risk level** is informational / caution / likely restricted, matching the tiers from the notices doc.

## Batteries & electronics

| Item | Risk | Type | Notice |
|---|---|---|---|
| Spare/loose lithium batteries, power banks | Caution | Air-safety | Carry-on only, never checked baggage. Most are fine under 100Wh — anything higher may need airline approval or be refused. |
| Laptops, phones, cameras (battery installed) | Informational | Air-safety | Generally fine in carry-on or checked. Power the device on if asked at security. |
| E-cigarettes / vapes | Caution | Air-safety | Carry-on only, cannot be charged on board, not permitted in checked baggage. |
| Hoverboards, e-bikes, balance boards with non-removable lithium battery | Likely restricted | Air-safety | Most airlines prohibit these outright due to large non-removable batteries. Worth confirming with the carrier's airline before agreeing to this one. |
| Drones | Caution | Both | Battery rules same as other lithium devices. Some countries also restrict drone import or require registration — worth checking the destination. |
| Magnets (consumer-grade, e.g. fridge magnets, phone cases) | Informational | Air-safety | Low-strength consumer magnets are fine. Industrial or high-strength magnets are not. |

## Liquids, gels, aerosols

| Item | Risk | Type | Notice |
|---|---|---|---|
| Liquids, gels, creams over 100ml | Likely restricted | Air-safety | Not allowed in carry-on over 100ml per container. Must go in checked baggage. |
| Perfume, cologne | Caution | Air-safety | Same 100ml carry-on rule applies as any other liquid. |
| Nail polish, nail polish remover | Caution | Air-safety | Treated as a flammable liquid — limited quantities, same 100ml rule. |
| Aerosol sprays (personal care — deodorant, hairspray) | Caution | Air-safety | Allowed in small personal-use quantities only, non-flammable/non-toxic types. |
| Alcohol over 70% ABV | Likely restricted | Air-safety | Prohibited outright on most airlines. |
| Alcohol 24-70% ABV | Caution | Air-safety | Allowed only in retail packaging, limited quantity per person. |
| Alcohol under 24% ABV | Informational | Air-safety | Generally unrestricted. |

## Sharp objects, weapons, restricted devices

| Item | Risk | Type | Notice |
|---|---|---|---|
| Knives, scissors, blades | Likely restricted | Air-safety | Checked baggage only, never carry-on. |
| Weapons, ammunition, weapon replicas/toys | Likely restricted | Air-safety | Heavily restricted — real weapons need checked baggage, locked case, and often advance airline approval. Replicas can still trigger security issues. Recommend the sender reconsider this one. |
| Pepper spray, mace, stun guns, self-defense devices | Likely restricted | Air-safety | Prohibited outright in carry-on and checked baggage on virtually all airlines. |
| Fireworks, flares, explosives | Likely restricted | Air-safety | Prohibited outright, no exceptions. |
| Camping gas, fuel canisters, lighter fluid | Likely restricted | Air-safety | Prohibited outright. |
| Lighters | Caution | Air-safety | Usually carried on the person only, not in baggage. Torch lighters and some lithium-powered lighters are banned entirely. |
| Matches | Caution | Air-safety | Limited quantity, strike-anywhere matches are banned. |

## Food, plant, and animal products

| Item | Risk | Type | Notice |
|---|---|---|---|
| Homemade or packaged food (dry/solid) | Informational | Customs | Generally fine for air travel, but many countries restrict food imports at customs — check the destination's rules. |
| Meat, dairy, animal-origin products | Likely restricted | Customs | Heavily restricted or banned in many countries (EU, Australia, and others have strict rules here). Verify before sending. |
| Plants, seeds, fresh produce | Likely restricted | Customs | Common agricultural quarantine target — many countries require permits or ban these outright. |

## Medication and controlled substances

| Item | Risk | Type | Notice |
|---|---|---|---|
| Prescription medication | Caution | Customs | Usually fine for personal use, but carrying the prescription or a doctor's note is strongly recommended in case it's questioned at either end. |
| CBD, cannabis, or related products | Likely restricted | Customs | Legality varies enormously by country and even by state/region within a country. This is one of the highest-risk categories — strongly recommend the sender verify legality at both origin and destination before booking. |

## Money and valuables

| Item | Risk | Type | Notice |
|---|---|---|---|
| Cash / currency | Caution | Customs | Most countries require declaration above a threshold (commonly equivalent to USD 10,000, but this varies). Check the destination's declaration rules. |
| Jewelry, watches, other high-value items | Caution | Informational | No air-safety restriction, but this is exactly the kind of item the declared-value-plus-photo step in the trust model matters most for. |
| Branded or luxury goods | Caution | Customs | Customs in some countries scrutinizes branded goods for counterfeit risk, which can mean delays or seizure regardless of authenticity. Worth knowing before sending high-value branded items. |

## Documents

| Item | Risk | Type | Notice |
|---|---|---|---|
| Passports, legal documents, official paperwork | Caution | Informational | No air-safety or customs issue, but the risk here is loss or fraud, not confiscation. Recommend the sender keep a digital copy before handing originals over. |

## Generally unrestricted (no notice needed)

Worth listing explicitly so the matching system doesn't over-flag and erode trust in the notices. These should not trigger any notice: books, clothing, shoes, selfie sticks/tripods (no battery or with small removable battery), SIM cards, small accessories, toys without batteries or weapon resemblance, stationery, non-liquid cosmetics (lipstick, powder).

## Maintenance notes

- This table needs a recurring review, not a one-time build — battery watt-hour limits and similar air-safety rules do change periodically (IATA updates its passenger guidance most years).
- As real item descriptions come in through actual bookings, expect to find gaps — log any description that doesn't match anything here but probably should, and add it.
- Per-country customs links (the actual URLs to each destination country's official import page) are intentionally not included in this version — TAPA_SAFETY_NOTICES.md already flags this as an open item, to be built per active destination country rather than speculatively for every country upfront.

*Created June 30, 2026, as the data file backing TAPA_SAFETY_NOTICES.md.*