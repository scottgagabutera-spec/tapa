# Tapa — Brand Identity

> "Trust in motion. A stranger becomes your carrier. Distance becomes irrelevant."

## The Standard

Every single decision, every file, every change, must be checked against all eleven of these. They are equal weight. None of them is optional and none outranks another.

1. **Mobile first** — designed for the phone screen first, then expanded to web
2. **Mobile app ready** — every decision anticipates a future React Native / native build; nothing built now should have to be redone for mobile app
3. **Modern** — current patterns, nothing dated, feels like 2026 and beyond
4. **Premium** — feels expensive even when free, quality in every pixel
5. **Giants Way** — would Airbnb, Uber, Grab, DHL, or Google Flights engineers/designers approve this?
6. **Consistency** — same design language, same tokens, same rules, everywhere, every state
7. **Long term** — architecture and design that still makes sense in three years, not just today
8. **User friendly** — nothing confusing, one clear action per screen
9. **Very logical** — self-explanatory, no instructions needed
10. **Top-notch modern CSS** — one deliberate styling strategy, not several stacked on top of each other
11. **Unique** — Tapa has its own identity, not a clone of Grabr, DHL, or anyone else

## Brand Statement

Tapa is a premium, mobile-first peer-to-peer traveler delivery platform. Real travelers with spare luggage space carry items for people who need them delivered across borders, faster and cheaper than traditional couriers.

## Colors — single source of truth

These are the only colors used anywhere in the product. No other hex values should appear in code, in Tailwind config, or in this document. If a new color is needed, it gets added here first.

| Name | Hex | Usage |
|---|---|---|
| Midnight (background) | `#0D1B2A` | Primary background |
| Midnight light (surface) | `#1A2F45` | Cards, surfaces |
| Midnight lighter (border) | `#243B55` | Borders, dividers |
| Coral | `#E84855` | CTAs, highlights, primary brand color |
| Coral dark | `#C73641` | Coral gradients, hover states |
| Off White (text) | `#F8F9FA` | Primary text on dark |
| Muted | `#8B9BB4` | Secondary text |
| Green | `#52B788` | Success states, savings badges — this is the live, correct value (replaces the old, unused `#2D6A4F`) |
| Green background | `rgba(45,106,79,0.15)` | Background behind green badges |
| Green border | `rgba(82,183,136,0.25)` | Border on green badges |
| Sand | `#F5F0E8` | Reserved for future light-mode background (not currently in use) |

Status: this table is the only correct version. The old Tailwind config `emerald: #2D6A4F` is wrong and must be updated to match `#52B788` the next time anyone touches that file.

## Typography

Font: Inter — clean, modern, globally readable.

To keep this light for the web, the type system is intentionally narrow. Do not introduce new weights or sizes outside this table without updating it here first.

| Name | Size | Weight | Usage |
|---|---|---|---|
| Display | clamp(32px, 4.5vw, 60px) | 800 | Hero headlines |
| H1 | clamp(26px, 4vw, 46px) | 800 | Section titles |
| H2 | 21px | 800 | Card titles |
| Body | 14–16px | 400 | Default body text |
| Small | 11–13px | 600–700 | Labels, captions, metadata, eyebrow text |

Weight rule: only three weights exist in the system — 400 (body), 600–700 (emphasis, labels), 800 (headlines). Do not use 500 or 900.

## Logo

Current live mark: a route pin with a dashed flight path leading to a small plane departure point, rendered as `Icon.Logo` in code. Coral circle marker, white pin and line work.

(Previous version of this document described a "letter T formed by a route line" — that was never built and should be discarded. The pin-to-plane mark is the real logo going forward unless a redesign is explicitly commissioned.)

Logo must remain legible at 16px (browser tab / app icon size) and clean at large sizes (hero, presentation decks).

## Imagery Policy

Tapa is icon-and-color only in functional sections (How it works, Why Tapa, stats) because icons are clearer than photos there. Real or AI-generated imagery is reserved for emotional/projection moments — primarily the hero section and any "trending items by destination" content — so the page stays light and fast while still feeling premium where it counts.

Any imagery added must:
- Match the midnight/coral palette in tone and lighting, not look pasted in from a different visual world
- Be compressed/optimized (WebP preferred) and lazy-loaded if below the fold
- Be generated or sourced as a deliberate, consistent set — not one-off images added ad hoc in different styles

## Buttons

- Primary: Coral background, white text, 12px radius, 48px minimum height on mobile (meets Apple/Google touch target minimum)
- Secondary: Transparent, coral border, coral text
- Ghost: No border, muted text
- Full width on mobile, auto width on desktop
- Active/tap state: scale(0.97), opacity 0.82, 80ms — defined globally in `globals.css`, do not override per-component

## Cards

- Background: `#1A2F45`
- Border: 1px `#243B55`
- Radius: 16–20px depending on card size
- Shadow: `0 4px 24px rgba(0,0,0,0.3)`
- Hover (desktop only): translateY(-4px), border brightens toward coral

## Motion

- Fast: 150ms — micro interactions, button taps
- Base: 200ms — hover states
- Slow: 300ms — page transitions
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

## Mobile App Readiness Notes

These are not yet implemented but must be kept in mind for every new screen:

- All tap targets minimum 44–48px
- Design with safe-area insets in mind (notches, home indicators) even on web, so the visual language transfers cleanly
- Avoid web-only patterns (hover-dependent interactions, `:hover` as the only affordance signal) since mobile app has no hover state — every hover effect needs a tap/active equivalent already, which the current button system does correctly

## CSS Strategy

Single decided approach: inline `style={{}}` objects driven by a shared, centralized color/spacing constants file (not redefined per component), supplemented by a `<style>` block per page only for things inline styles cannot do (media queries, pseudo-classes, animations). Tailwind config exists but is not actively used for utility classes in current pages — it should either be adopted properly across new components going forward, or removed to avoid two competing systems. This decision should be made and documented here before the next major page is built.

*Last updated: June 30, 2026*