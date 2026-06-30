# Tapa — Working Checklist for AI Assistants

Read this before touching any file. This is Scott's standing working method for every project (Tapa, Annie, Margo). It does not change between sessions or between AI tools.

## Who you're working with

Scott is a solo international founder (Makati, Philippines) building Tapa under real financial constraints, pursuing investment and partnerships at the same time as building. He needs efficient, accurate help — not padding, not generic boilerplate, not unconfirmed assumptions presented as fact.

## The eleven non-negotiable statements

Every single change, every file, every suggestion, must be evaluated against all eleven of these. They are equal weight — none of them outranks another, and skipping one to satisfy another is not acceptable without flagging the tradeoff explicitly.

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

## Tapa project specifics

- Stack: Next.js, Supabase, deployed on Vercel (live at tapa-blue.vercel.app)
- Core distinction from Grabr: Tapa carries items the sender already owns; Grabr buys on the sender's behalf
- Core differentiator vs other couriers: real travelers, not logistics companies — cheaper and built on trust, not necessarily faster (don't force rigid delivery date guarantees — most travelers don't know exact return dates; the honest promise is price and human connection, not speed)
- "Connected Route" feature: chains two carriers through a hub city when no single direct carrier covers the full route
- Unsolved/unanswered product questions that any new assistant should know are still open:
  - Exact escrow/fraud-prevention mechanism is not fully specified — this is the single most important unanswered question before serious investor conversations. Don't assume a solution exists; help Scott work through it if asked.
  - No reviews/ratings data exists yet (too early, no completed transactions)
  - Weight/size handling is currently a free-text kg field; moving to fixed size tiers (small/medium/large, Vinted-style) is on the roadmap but not built
- BRAND.md (saved alongside this file) is the real, current source of truth for colors, typography, logo, and CSS strategy as of June 30, 2026. Treat it as accurate, not aspirational — it was rewritten to match the live codebase, not the other way around.

## Known live bug to fix

In `app/page.tsx`, the hero search card has a JSX nesting error: the Date and Weight input rows are nested inside the "To" airport input's closing div instead of being sibling elements. It doesn't visibly break the page due to flexbox, but it's structurally wrong and should be corrected to three separate sibling `sfield-row` divs (To / Date / Weight) rather than nested.

## Imagery decision (as of this doc)

Tapa stays icon-and-color only in functional explainer sections (How it works, Why Tapa, stats bar). AI-generated imagery (Scott uses ChatGPT for image generation) is reserved for the hero section and any "trending items by destination" content, to keep the page light/fast while still feeling premium where it emotionally matters. Any images added must match the midnight/coral palette, be compressed (WebP, lazy-loaded below the fold), and be generated as a consistent set rather than one-offs.

## What "done evaluating a change" looks like

Before telling Scott a change is ready, confirm:
- Checked against all 11 statements, tradeoffs flagged if any were deprioritized
- No new hardcoded color/font values introduced outside BRAND.md's table
- Mobile behavior considered, not just desktop
- No unsourced claims/stats added to copy
- File encoding stays UTF-8

*Created June 30, 2026, for continuity between AI sessions on the Tapa project.*