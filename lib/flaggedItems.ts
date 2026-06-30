// lib/flaggedItems.ts
// Reference data and matching logic for Tapa's safety notice system.
// Backs TAPA_SAFETY_NOTICES.md and TAPA_FLAGGED_ITEMS.md — read those first.
//
// Two layers:
// 1. Category notices — keyed to the fixed ITEM_TYPES dropdown already used
//    in app/posts/new, app/trip/new, and app/book/[id]. Direct lookup, no scanning.
// 2. Keyword notices — scanned against the free-text item_desc field, since a
//    sender can pick a broad category but describe something more specific.

export type NoticeRisk = 'informational' | 'caution' | 'restricted'
export type NoticeType = 'air-safety' | 'customs' | 'both' | 'general'

export interface FlagNotice {
  risk: NoticeRisk
  type: NoticeType
  notice: string
}

// Layer 1: category-level notices.
// Keys must match ITEM_TYPES exactly. Not every category needs a notice —
// Clothes, Small items, Books, and Other are intentionally omitted here since
// they carry no inherent flag on their own (Other and Small items still get
// caught by the keyword scan on item_desc if something specific is named).
export const CATEGORY_NOTICES: Record<string, FlagNotice> = {
  Electronics: {
    risk: 'caution',
    type: 'air-safety',
    notice: 'Devices with batteries have airline rules — spare batteries and power banks are carry-on only. Worth checking before the trip.',
  },
  Documents: {
    risk: 'informational',
    type: 'general',
    notice: 'No air or customs issue here, but the risk is loss, not confiscation. Keeping a digital copy before handing over originals is worth it.',
  },
  Food: {
    risk: 'caution',
    type: 'customs',
    notice: 'Food import rules vary by country. Check the destination\'s customs rules before sending.',
  },
  Cosmetics: {
    risk: 'caution',
    type: 'air-safety',
    notice: 'Liquids and gels over 100ml need to go in checked baggage, not carry-on.',
  },
  Medicine: {
    risk: 'caution',
    type: 'customs',
    notice: 'Carrying the prescription or a doctor\'s note is recommended in case it\'s questioned at either end.',
  },
  Gifts: {
    risk: 'informational',
    type: 'general',
    notice: '"Gifts" can mean almost anything — the more specific the description, the better the carrier and customs notices we can show.',
  },
}

// Layer 2: keyword notices, scanned against item_desc.
// Matching is case-insensitive substring matching — simple on purpose, see
// TAPA_SAFETY_NOTICES.md for why this doesn't need a full AI model yet.
interface KeywordEntry extends FlagNotice {
  keywords: string[]
}

export const KEYWORD_NOTICES: KeywordEntry[] = [
  {
    keywords: ['power bank', 'spare battery', 'loose battery', 'lithium battery'],
    risk: 'caution',
    type: 'air-safety',
    notice: 'Carry-on only, never checked baggage. Most are fine under 100Wh — higher may need airline approval.',
  },
  {
    keywords: ['e-cigarette', 'vape', 'e cigarette'],
    risk: 'caution',
    type: 'air-safety',
    notice: 'Carry-on only, cannot be charged on board, not permitted in checked baggage.',
  },
  {
    keywords: ['hoverboard', 'e-bike', 'electric bike', 'balance board'],
    risk: 'restricted',
    type: 'air-safety',
    notice: 'Most airlines prohibit these outright due to non-removable batteries. Worth confirming with the carrier\'s airline before agreeing to this one.',
  },
  {
    keywords: ['drone'],
    risk: 'caution',
    type: 'both',
    notice: 'Battery rules apply like any lithium device. Some countries also restrict drone import — check the destination.',
  },
  {
    keywords: ['perfume', 'cologne', 'nail polish'],
    risk: 'caution',
    type: 'air-safety',
    notice: 'Treated as a liquid — 100ml limit in carry-on applies.',
  },
  {
    keywords: ['alcohol', 'wine', 'whisky', 'whiskey', 'vodka', 'liquor'],
    risk: 'caution',
    type: 'air-safety',
    notice: 'Allowed in limited quantities depending on proof. Over 70% ABV is prohibited outright.',
  },
  {
    keywords: ['knife', 'scissors', 'blade', 'razor'],
    risk: 'restricted',
    type: 'air-safety',
    notice: 'Checked baggage only, never carry-on.',
  },
  {
    keywords: ['weapon', 'gun', 'ammunition', 'ammo', 'ballistic'],
    risk: 'restricted',
    type: 'air-safety',
    notice: 'Heavily restricted — real weapons need checked baggage, a locked case, and often advance airline approval. Worth reconsidering this one.',
  },
  {
    keywords: ['pepper spray', 'mace', 'taser', 'stun gun'],
    risk: 'restricted',
    type: 'air-safety',
    notice: 'Prohibited outright in carry-on and checked baggage on virtually all airlines.',
  },
  {
    keywords: ['firework', 'flare', 'explosive'],
    risk: 'restricted',
    type: 'air-safety',
    notice: 'Prohibited outright, no exceptions.',
  },
  {
    keywords: ['lighter fluid', 'camping gas', 'gas canister'],
    risk: 'restricted',
    type: 'air-safety',
    notice: 'Prohibited outright on commercial flights.',
  },
  {
    keywords: ['meat', 'dairy', 'cheese', 'milk'],
    risk: 'restricted',
    type: 'customs',
    notice: 'Animal-origin products are heavily restricted or banned in many countries. Verify before sending.',
  },
  {
    keywords: ['plant', 'seed', 'produce', 'fruit', 'vegetable'],
    risk: 'restricted',
    type: 'customs',
    notice: 'Common agricultural quarantine target — many countries require permits or ban these outright.',
  },
  {
    keywords: ['cbd', 'cannabis', 'thc', 'weed'],
    risk: 'restricted',
    type: 'customs',
    notice: 'Legality varies enormously by country and region. Strongly recommend verifying legality at both ends before booking.',
  },
  {
    keywords: ['cash', 'currency', 'banknotes'],
    risk: 'caution',
    type: 'customs',
    notice: 'Most countries require declaration above a threshold (commonly around USD 10,000 equivalent). Check the destination\'s rules.',
  },
  {
    keywords: ['jewelry', 'jewellery', 'watch', 'diamond', 'gold'],
    risk: 'caution',
    type: 'general',
    notice: 'No air-safety issue, but this is exactly where declared value and a handover photo matter most.',
  },
  {
    keywords: ['branded', 'designer', 'luxury'],
    risk: 'caution',
    type: 'customs',
    notice: 'Some countries scrutinize branded goods for counterfeit risk, which can mean delays regardless of authenticity.',
  },
  {
    keywords: ['passport', 'legal document', 'id card'],
    risk: 'caution',
    type: 'general',
    notice: 'No air or customs issue, but loss risk is real. Keeping a digital copy before handover is worth it.',
  },
]

// Returns the category-level notice for a given ITEM_TYPES value, or null
// if that category carries no inherent flag.
export function getCategoryNotice(itemType: string): FlagNotice | null {
  return CATEGORY_NOTICES[itemType] ?? null
}

// Scans free-text item_desc for flagged keywords. Case-insensitive substring
// match. Returns every match found, not just the first — a description can
// reasonably trigger more than one notice (e.g. "laptop and a knife").
export function scanDescription(desc: string): FlagNotice[] {
  if (!desc) return []
  const lower = desc.toLowerCase()
  return KEYWORD_NOTICES.filter(entry =>
    entry.keywords.some(keyword => lower.includes(keyword))
  ).map(({ keywords, ...notice }) => notice)
}

// Combines both layers for a single booking/post. Dedupes by notice text so
// the UI never shows the same message twice if both layers happen to match.
export function getNoticesForItem(itemType: string, itemDesc: string): FlagNotice[] {
  const categoryNotice = getCategoryNotice(itemType)
  const keywordNotices = scanDescription(itemDesc)
  const all = categoryNotice ? [categoryNotice, ...keywordNotices] : keywordNotices
  const seen = new Set<string>()
  return all.filter(n => {
    if (seen.has(n.notice)) return false
    seen.add(n.notice)
    return true
  })
}