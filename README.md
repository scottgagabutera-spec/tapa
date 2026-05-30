# Tapa

> P2P traveler delivery platform — carry items across borders.

**"Trust in motion. A stranger becomes your carrier. Distance becomes irrelevant."**

---

## What is Tapa?

Tapa connects people who need items transported between countries with travelers who are already making that journey. A traveler posts their route. A sender finds them. The item travels with a real person.

Think: Airbnb meets DHL meets Google Flights.

---

## The Problem We Solve

Shipping hair from Vietnam to Cameroon costs a fortune.
Sending a gift from Switzerland to the Philippines takes weeks.
International shipping is broken for individuals and small businesses.
Meanwhile, thousands of real people fly those exact routes every day with empty bag space.
Tapa connects them.

---

## How It Works

### For Carriers (Travelers)
1. Post your route — origin, destination, dates, available weight, item types, fee
2. Receive booking requests
3. Accept, carry the item, deliver, get paid

### For Senders
1. Search for Carriers going to your destination
2. Get Direct or Connected Route matches
3. Book, hand over the item with photo proof, confirm delivery, release payment

---

## The Connected Route (Our Key Innovation)

No direct Carrier from Switzerland to Philippines?
Tapa chains two Carriers like a flight layover:
- Carrier A: Zurich → Singapore
- Carrier B: Singapore → Manila

Both must accept. Handoff is coordinated through the platform.

---

## User Roles

| Role | Description |
|---|---|
| Carrier | Traveler who posts their route and carries items |
| Sender | Person who needs something transported |
| Parcel / Drop | The item being transported |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + React + TypeScript |
| Styling | Tailwind CSS + Custom Design System |
| Hosting | Vercel |
| Mobile (future) | React Native |

---

## Design Standard: GIANTS WAY

Every decision is evaluated against:
> Would engineers at Airbnb, Uber, Grab, DHL, and Google Flights approve this?

Mobile first. User friendly. Modern. Premium. Consistent. Unique. Long term.
See BRAND.md for the full design system.

---

## Project Info

| Property | Value |
|---|---|
| GitHub | github.com/scottgagabutera-spec/tapa |
| Owner | Scott Gaga Butera (scottgagabutera@gmail.com) |
| Live URL | tapa.vercel.app (temporary — own domain planned when budget allows) |
| Started | May 30, 2026 |

---

## Important Context for AI Assistants

**Two projects, one GitHub account.**

Scott owns two separate projects — Margo and Tapa — both hosted under the same GitHub account: scottgagabutera-spec. This is intentional and due to budget constraints, not a mistake.

**Margo** came first. It is a social music platform for emotional expression through lyrics and songs. It has its own domain: trymargo.com. It is already live in production. Its repo is: github.com/scottgagabutera-spec/Margo

**Tapa** came second, started May 30, 2026. It is this project — a P2P traveler delivery platform. It does not yet have its own domain. It currently runs at tapa.vercel.app. A dedicated domain (tapa.com or similar) will be purchased when budget allows.

The two projects are completely independent — separate repos, separate Vercel deployments, separate codebases, separate purposes. They share only the GitHub account owner.

**Rules for working on Tapa:**
- Never work directly on main — always create a branch first
- Branch naming: feat/name for features, fix/name for fixes, docs/name for documentation
- Read BRAND.md and ROADMAP.md before making any changes
- Every session: confirm you are on Tapa, not Margo
- Update ROADMAP.md when items are completed

---

*Last updated: May 30, 2026*
