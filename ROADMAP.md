# Tapa — Product Roadmap

> Mobile first. User friendly. Modern. Premium. Giants Way. Long term. Consistent. Unique.

Last updated: May 31, 2026

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
- [ ] Actual authentication logic (Firebase / Supabase / NextAuth)
- [ ] Session management
- [ ] Protected routes

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
- [ ] Live search against real data
- [ ] Real filter logic

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
- [ ] Accept / Decline flow (carrier side — wired in dashboard, needs persistence)
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
- [ ] Publish to live search results (requires real data layer)

---

## Phase 9 — Real Data Layer ⏳
- [ ] Firebase / Supabase setup
- [ ] Auth — login, signup, session, protected routes
- [ ] Carrier trips stored and queryable
- [ ] Bookings stored and status-tracked
- [ ] Accept/Decline persisted to database
- [ ] Search pulls live carrier data
- [ ] Dashboards pull real user data

---

## Phase 10 — Trust & Safety 📋
- [ ] Prohibited items checklist
- [ ] Photo proof at pickup and delivery
- [ ] Ratings after delivery
- [ ] Verified ID for Carriers
- [ ] Country customs flagging

---

## Phase 11 — Payments 📋
- [ ] Stripe integration
- [ ] Escrow logic
- [ ] Carrier payouts
- [ ] Transaction history

---

## Phase 12 — Tracking 📋
- [ ] /tracking/[id] — Live status tracker
- [ ] Status updates: Booked → Picked Up → In Transit → Delivered
- [ ] Push notifications

---

## Phase 13 — Mobile App 💡
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

*Last updated: May 31, 2026*
