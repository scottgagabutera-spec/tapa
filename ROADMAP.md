# Tapa — Product Roadmap

> Mobile first. User friendly. Modern. Premium. Giants Way. Long term. Consistent. Unique.

Last updated: Jun 1, 2026

## Status Legend
✅ Done | 🔄 In progress | ⏳ Up next | 📋 Planned | 💡 Future

---

## Phase 0 — Foundation ✅
- [x] Project concept defined
- [x] User roles named: Carrier, Sender, Parcel/Drop
- [x] GitHub repo created: scottgagabutera-spec/tapa
- [x] Next.js 15 + TypeScript + Tailwind initialized
- [x] Pushed to GitHub (main branch)
- [x] VS Code + Cline configured
- [x] Brand identity defined (BRAND.md)
- [x] README written
- [x] ROADMAP created
- [x] Branching rule enforced: never work on main directly

---

## Phase 1 — Design System & Shell ✅
- [x] Brand colors defined and locked (C constants in every page)
- [x] Inter font loaded
- [x] Logo locked — coral square, clean triangle M12 3L20 20H4L12 3Z, "tapa" wordmark
- [x] Logo consistent across all pages — no variants, no dot
- [x] Button system (Primary coral, Outline, Ghost) with hover states
- [x] Card system (surface #1A2F45, border #243B55, radius 16px)
- [x] Top navigation (desktop + mobile)
- [x] Inline style system with brand constants (no Tailwind dependency)
- [ ] Global CSS design tokens
- [ ] Bottom navigation (mobile)
- [ ] Loading / skeleton screens
- [ ] Empty states
- [ ] Error states

---

## Phase 2 — Landing Page ✅
- [x] Hero section with headline, subheadline, CTA buttons
- [x] Status badge — Live, peer-to-peer delivery across borders
- [x] How it works (Carrier + Sender flows)
- [x] Connected Route explainer
- [x] Use case section
- [x] Trust signals
- [x] Footer
- [x] Mobile responsive
- [x] Deployed to Vercel (tapa-blue.vercel.app)
- [x] Landing page buttons wired — Find a Carrier → /search, Become a Carrier → /auth/signup
- [x] Tapa brand kit built — all logo variants, colors, typography, mockups (HTML)

---

## Phase 3 — Auth ✅
- [x] /auth/login — Login page
- [x] /auth/signup — 3-step signup (create account → phone OTP → role selection)
- [x] TypeScript errors resolved
- [x] Supabase Auth — real signup with email confirmation
- [x] Session management — user persisted across pages
- [x] Login routes by role to correct dashboard

---

## Phase 4 — Search & Carrier Results ✅
- [x] /search — Carrier results page
- [x] Search bar — From / To / Date / Weight fields
- [x] Popular route chips (Manila→Dubai, Lagos→London, Mumbai→Singapore, São Paulo→Miami)
- [x] Carrier cards — name, avatar, verified badge, route, flight, tags, rating, price, capacity
- [x] Filter chips — ID Verified, Top Carrier
- [x] Sort — Recommended / Price / Rating / Date / Capacity
- [x] Hover interactions, staggered fade-in animations
- [x] "View & Book" button linking to /carrier/[id]
- [x] Live search pulls real trips from Supabase (falls back to mock if empty)
- [ ] Real filter logic (route, date, weight)

---

## Phase 5 — Carrier Profile ✅
- [x] /carrier/[id] — Carrier detail page
- [x] Carrier bio, avatar initials, verified badges
- [x] Route details — origin, destination, date, flight info
- [x] Capacity and item types accepted
- [x] Ratings and reviews (mock)
- [x] Pricing breakdown
- [x] Book Now CTA → /book/[id]

---

## Phase 6 — Booking Flow ✅
- [x] /book/[id] — 3-step booking request form
- [x] Step 1 — Item declaration (type, weight, description, photo note)
- [x] Step 2 — Sender info (name, phone, pickup/dropoff address)
- [x] Step 3 — Review and confirm
- [x] Booking confirmation / success screen
- [x] Accept / Decline flow — wired in carrier dashboard, persists to Supabase
- [ ] Real messaging
- [ ] /tracking/[id] — Status tracker

---

## Phase 7 — Dashboards ✅
- [x] /dashboard/sender — Sender dashboard
- [x] Active bookings with status badges (Pending, Confirmed, In Transit, Delivered)
- [x] Booking history tab
- [x] Stats row — total bookings, active, delivered
- [x] View Carrier, Track, Message actions (Track + Message pending real data)
- [x] /dashboard/carrier — Carrier dashboard
- [x] Incoming booking requests with Accept / Decline (live UI state)
- [x] My Trips tab with capacity bar and earnings
- [x] Pending requests badge on tab
- [x] Stats row — total trips, pending requests, total earned
- [x] Post a Trip CTA → /trip/new

---

## Phase 8 — Carrier Posting ✅
- [x] /trip/new — Post a new carrier route
- [x] Step 1 — Route details (from, to, date, airline, flight number)
- [x] Step 2 — Capacity and pricing (weight, item types, price/kg)
- [x] Step 3 — Review and publish
- [x] Publish to live search results — trips saved to Supabase, appear in /search

---


## Phase 9 — Sender Post Feed ✅
Two-sided marketplace: senders post delivery requests, carriers browse and claim them.

- [x] /posts/new — Sender creates a delivery post (3-step: route, item details, review)
- [x] /feed — Role-aware feed (carriers see all posts with Claim, senders see their own posts)
- [x] Privacy rule — city-level route shown publicly only
- [ ] Claim flow — carrier claims a post → triggers reverse booking (Phase 11)
- [ ] Sender notified when carrier claims their post
- [ ] Free tier: 3 posts/month limit (Phase 12)

---
## Phase 10 — Real Data Layer ✅
- [x] Supabase project created (Singapore region, PostgreSQL)
- [x] Schema — profiles, trips, bookings, posts tables with RLS policies
- [x] Auth — signup with email confirmation, login routes by role
- [x] Carrier trips stored and queryable
- [x] Bookings stored and status-tracked
- [x] Accept/Decline persisted to database
- [x] Search pulls live carrier data, falls back to mock
- [x] Sender dashboard pulls real bookings
- [x] Carrier dashboard pulls real trips and booking requests
- [x] Booking page pre-fills sender info from logged-in profile
- [x] Vercel env vars configured — live on tapa-blue.vercel.app

---

## Phase 11 — Trust & Safety 📋
- [ ] Prohibited items checklist
- [ ] Photo proof at pickup and delivery
- [ ] Ratings after delivery
- [ ] Verified ID for Carriers
- [ ] Country customs flagging

---

## Phase 12 — Payments 📋
- [ ] Stripe integration
- [ ] Escrow logic
- [ ] Carrier payouts
- [ ] Transaction history

---

## Phase 13 — Tracking 📋
- [ ] /tracking/[id] — Live status tracker
- [ ] Status updates: Booked → Picked Up → In Transit → Delivered
- [ ] Push notifications

---

## Phase 14 — Mobile App 💡
- [ ] React Native project
- [ ] Core screens
- [ ] Push notifications
- [ ] App Store + Google Play

---

## Branch Rules
- NEVER work directly on main
- Every feature or fix gets its own branch: feat/name or fix/name
- Merge to main only when complete and tested

## Update Rules
- Mark items [x] when done
- Commit: `docs: update roadmap — [what was completed]`
- Push after every session

*Last updated: Jun 1, 2026*
