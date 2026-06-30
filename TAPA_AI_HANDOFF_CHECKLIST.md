# Tapa — Working Checklist for AI Assistants

Read this before touching any file. This is Scott's standing working method for every project (Tapa, Annie, Margo). It does not change between sessions or between AI tools.

This file supersedes CLAUDE.md and AGENTS.md for project-specific rules — it's the single merged source of truth. AGENTS.md's Next.js version warning still applies and should be checked separately when relevant.

## Who you're working with

Scott is a solo international founder (Makati, Philippines) building Tapa under real financial constraints, pursuing investment and partnerships at the same time as building. He needs efficient, accurate help — not padding, not generic boilerplate, not unconfirmed assumptions presented as fact.

## The eleven non-negotiable statements

Every single change, every file, every suggestion, must be evaluated against all eleven of these. They are equal weight — none of them outranks another, and skipping one to satisfy another is not acceptable without flagging the tradeoff explicitly. If even one fails, do not merge.

1. Mobile first
2. Mobile app ready soon (anticipate the native build, don't build things that will need redoing)
3. Modern
4. Premium
5. Giants Way — would Airbnb, Uber, Grab, DHL, or Google Flights engineers/designers approve this?
6. Consistency
7. Long term
8. User friendly
9. Very logical
10. Top-notch modern CSS tools and features
11. Unique

(Note: an earlier version of this checklist in CLAUDE.md listed only nine statements, missing #2 and #10. This eleven-item list is the current, correct version — update or retire any file still showing nine.)

Do not silently optimize for one and ignore the rest. If a request only serves one or two of these, say so and explain the tradeoff before proceeding.

## How Scott works — operating rules

- **Read the actual code/files before suggesting changes.** Don't guess at file contents or assume structure. Ask for the file via `Get-Content <path> -Encoding UTF8` in PowerShell if you don't have it.
- **Always use `-Encoding UTF8`** when asking Scott to paste file contents — without it, PowerShell mangles em-dashes and accented characters (this came up repeatedly and wasted time).
- **Full file replacements, not diffs.** Scott prefers complete corrected blocks/files over instructions like "change line 4 to X."
- **Deep audit before schema or structural changes.** Don't touch database schema or core architecture without understanding the existing setup first.
- **Logic before code.** Explain the reasoning and the plan before writing implementation.
- **No AI-sounding copy.** No em dashes, no generic filler phrases, no "in today's fast-paced world" style language. First-person founder voice. Fact-based claims only — no unsourced stats like "70% cheaper" without a real source or clearly labeled estimate.
- **Branch before changes**, git discipline matters — don't suggest changes that bypass version control habits.
- **Single source of truth for design tokens.** Colors, type scale, spacing live in one place (see BRAND.md). Never let inline styles, Tailwind config, and documentation drift out of sync — check all three when changing any visual value.

## Bug prevention rules (learned from real production bugs)

### URL param state initialization
Any page that reads URL params on load MUST initialize state from those params — never default to `false` or empty when params are present.

Wrong:
```ts
const [searched, setSearched] = useState(false);
```

Correct:
```ts
const [searched, setSearched] = useState(!!(searchParams.get("from") || searchParams.get("to")));
```

This applies to any boolean or derived state that controls rendering based on URL params. Skipping this causes results to show on mobile (different re-render timing) but not desktop — this exact bug happened once already.

### Mobile-first verification (concrete procedure)
Before every merge, open DevTools → toggle device toolbar → Samsung Galaxy A51 (412px width). Every screen must look premium at this size, not like a stacked plain form. This is the practical test for statement #1 — don't just claim "mobile first," verify it at this exact viewport before calling anything done.

### Consistency check before building new UI
Before adding any UI pattern (search bar, input field, card, button), grep the codebase for existing implementations of that pattern first. Never build the same thing twice with different styles.

```bash
grep -rn "AirportInput\|AirportField\|search.*form" app/ | grep -v ".next"
```

## Tapa project specifics

- Stack: Next.js, Supabase, deployed on Vercel (live at tapa-blue.vercel.app)
- GitHub: `https://github.com/scottgagabutera-spec/tapa` (lowercase — repo was moved, local remote already updated to match)
- Core distinction from Grabr: Tapa carries items the sender already owns; Grabr buys on the sender's behalf
- Core differentiator vs other couriers: real travelers, not logistics companies — cheaper and built on trust, not necessarily faster (don't force rigid delivery date guarantees — most travelers don't know exact return dates; the honest promise is price and human connection, not speed)
- "Connected Route" feature: chains two carriers through a hub city when no single direct carrier covers the full route
- Unsolved/unanswered product questions that any new assistant should know are still open:
  - Reviews/ratings system is not yet built (no completed transactions yet to seed it) — now a top build priority, since it's load-bearing for the trust model, not just a nice-to-have. See TAPA_TRUST_SAFETY_ESCROW.md.
  - ID verification (Stripe Identity) is not yet built — pair with Stripe Connect integration since they share a vendor. See TAPA_TRUST_SAFETY_ESCROW.md.
  - Immutable in-app messaging (no edit/delete after booking confirmed) is not yet built — needed as the dispute record. See TAPA_TRUST_SAFETY_ESCROW.md.
  - Exact dispute resolution process (who reviews a flagged dispute, what evidence is weighted, timeline) is not designed yet.
  - Weight/size handling is currently a free-text kg field; moving to fixed size tiers (small/medium/large, Vinted-style) is on the roadmap but not built.
- Escrow/fraud-prevention mechanism: **resolved as of June 30, 2026.** Full reasoning, the BlaBlaCar/Grabr comparable research, and the resulting model live in TAPA_TRUST_SAFETY_ESCROW.md — read that file before touching anything escrow, trust, or fraud related. Short version: escrow means payment escrow only (Stripe Connect, delayed payout to carrier), not item insurance; fraud is minimized through trust infrastructure (ID verification, reviews, immutable messaging), not through underwriting.
- BRAND.md (saved alongside this file) is the real, current source of truth for colors, typography, logo, and CSS strategy as of June 30, 2026. Treat it as accurate, not aspirational — it was rewritten to match the live codebase, not the other way around.
- TAPA_TRUST_SAFETY_ESCROW.md (saved alongside this file) is the source of truth for trust, safety, escrow, and customs decisions as of June 30, 2026. Read it before working on any of those areas.

## Known live bug to fix

None currently open. The JSX nesting bug in `app/page.tsx` (Date and Weight fields nested inside the "To" field's closing div instead of being sibling rows) was fixed and pushed June 30, 2026. Verify at 412px width before assuming it's fully resolved if picking this up in a new session.

## Imagery decision (as of this doc)

Tapa stays icon-and-color only in functional explainer sections (How it works, Why Tapa, stats bar). AI-generated imagery (Scott uses ChatGPT for image generation) is reserved for the hero section and any "trending items by destination" content, to keep the page light/fast while still feeling premium where it emotionally matters. Any images added must match the midnight/coral palette, be compressed (WebP, lazy-loaded below the fold), and be generated as a consistent set rather than one-offs.

## What "done evaluating a change" looks like

Before telling Scott a change is ready, confirm:
- Checked against all 11 statements, tradeoffs flagged if any were deprioritized
- No new hardcoded color/font values introduced outside BRAND.md's table
- Mobile behavior verified at 412px (Samsung Galaxy A51), not just assumed
- Grepped for existing implementations before building a new UI pattern
- URL param state initialized correctly if the page reads search params
- No unsourced claims/stats added to copy
- File encoding stays UTF-8

*Created June 30, 2026, for continuity between AI sessions on the Tapa project. Merged with CLAUDE.md's bug-prevention rules same day. Updated same day to mark escrow/fraud-prevention as resolved and link TAPA_TRUST_SAFETY_ESCROW.md.*