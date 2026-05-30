"use client";
import React, { useState, useEffect } from "react";

const C = {
  bg: "#0D1B2A",
  surface: "#1A2F45",
  surfaceHover: "#1F3650",
  border: "#243B55",
  borderHover: "#2E4A6A",
  accent: "#E84855",
  accentDark: "#C73641",
  accentGlow: "rgba(232,72,85,0.12)",
  accentSoft: "rgba(232,72,85,0.08)",
  text: "#F8F9FA",
  muted: "#8B9BB4",
  mutedLight: "#A8B8CC",
  inputBg: "#0A1520",
  white: "#FFFFFF",
  green: "#2D9E6B",
  greenSoft: "rgba(45,158,107,0.12)",
  gold: "#F5A623",
  goldSoft: "rgba(245,166,35,0.12)",
};

// ── Mock carrier data ──
const MOCK_CARRIERS = [
  {
    id: "c1",
    name: "Maria Santos",
    avatar: "MS",
    avatarColor: "#7C3AED",
    from: "Manila",
    to: "Dubai",
    date: "Jun 12, 2026",
    airline: "Emirates",
    flightNo: "EK 334",
    verified: true,
    idVerified: true,
    rating: 4.9,
    trips: 47,
    capacity: "5 kg",
    price: 8,
    currency: "USD",
    perUnit: "kg",
    responseTime: "~1 hr",
    badge: "Top Carrier",
    tags: ["Electronics", "Documents", "Clothes"],
    bio: "Frequent traveler between PH and UAE. Fast response, safe handling guaranteed.",
  },
  {
    id: "c2",
    name: "James Okonkwo",
    avatar: "JO",
    avatarColor: "#0891B2",
    from: "Lagos",
    to: "London",
    date: "Jun 14, 2026",
    airline: "British Airways",
    flightNo: "BA 076",
    verified: true,
    idVerified: true,
    rating: 4.8,
    trips: 31,
    capacity: "8 kg",
    price: 10,
    currency: "USD",
    perUnit: "kg",
    responseTime: "~2 hrs",
    badge: null,
    tags: ["Documents", "Clothes", "Food"],
    bio: "Business traveler, Lagos–London route monthly. Professional and reliable.",
  },
  {
    id: "c3",
    name: "Priya Nair",
    avatar: "PN",
    avatarColor: "#DC2626",
    from: "Mumbai",
    to: "Singapore",
    date: "Jun 15, 2026",
    airline: "Singapore Airlines",
    flightNo: "SQ 422",
    verified: true,
    idVerified: false,
    rating: 4.7,
    trips: 18,
    capacity: "3 kg",
    price: 7,
    currency: "USD",
    perUnit: "kg",
    responseTime: "~3 hrs",
    badge: null,
    tags: ["Documents", "Small items"],
    bio: "Student, travel frequently for work. Happy to carry small packages.",
  },
  {
    id: "c4",
    name: "Carlos Mendez",
    avatar: "CM",
    avatarColor: "#059669",
    from: "São Paulo",
    to: "Miami",
    date: "Jun 17, 2026",
    airline: "LATAM Airlines",
    flightNo: "LA 8084",
    verified: true,
    idVerified: true,
    rating: 5.0,
    trips: 62,
    capacity: "10 kg",
    price: 9,
    currency: "USD",
    perUnit: "kg",
    responseTime: "< 30 min",
    badge: "Top Carrier",
    tags: ["Electronics", "Clothes", "Documents", "Food"],
    bio: "Top-rated carrier on Tapa. 62 trips, zero issues. Fast responses always.",
  },
  {
    id: "c5",
    name: "Aiko Tanaka",
    avatar: "AT",
    avatarColor: "#D97706",
    from: "Tokyo",
    to: "Sydney",
    date: "Jun 20, 2026",
    airline: "Qantas",
    flightNo: "QF 26",
    verified: true,
    idVerified: true,
    rating: 4.6,
    trips: 9,
    capacity: "4 kg",
    price: 12,
    currency: "USD",
    perUnit: "kg",
    responseTime: "~4 hrs",
    badge: null,
    tags: ["Documents", "Cosmetics", "Clothes"],
    bio: "Design professional traveling for work. Careful with all items.",
  },
  {
    id: "c6",
    name: "Kwame Asante",
    avatar: "KA",
    avatarColor: "#7C3AED",
    from: "Accra",
    to: "New York",
    date: "Jun 22, 2026",
    airline: "Delta",
    flightNo: "DL 460",
    verified: true,
    idVerified: true,
    rating: 4.9,
    trips: 24,
    capacity: "6 kg",
    price: 11,
    currency: "USD",
    perUnit: "kg",
    responseTime: "~1 hr",
    badge: null,
    tags: ["Electronics", "Documents", "Clothes"],
    bio: "Tech consultant, Ghana–NYC quarterly. Trusted by 24 senders so far.",
  },
];

type SortKey = "recommended" | "price_low" | "rating" | "date_soon" | "capacity";

// ── Star rating component ──
const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= full ? C.gold : (i === full + 1 && half ? "url(#half)" : C.border)}>
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor={C.gold}/>
              <stop offset="50%" stopColor={C.border}/>
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
};

export default function SearchPage() {
  const [mounted, setMounted] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterTopCarrier, setFilterTopCarrier] = useState(false);
  const [results, setResults] = useState(MOCK_CARRIERS);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = () => {
    setSearched(true);
    let filtered = [...MOCK_CARRIERS];
    if (filterVerified) filtered = filtered.filter(c => c.idVerified);
    if (filterTopCarrier) filtered = filtered.filter(c => c.badge === "Top Carrier");
    if (sort === "price_low") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === "capacity") filtered.sort((a, b) => parseInt(b.capacity) - parseInt(a.capacity));
    setResults(filtered);
  };

  const applyFilters = (newSort: SortKey, newVerified: boolean, newTop: boolean) => {
    let filtered = [...MOCK_CARRIERS];
    if (newVerified) filtered = filtered.filter(c => c.idVerified);
    if (newTop) filtered = filtered.filter(c => c.badge === "Top Carrier");
    if (newSort === "price_low") filtered.sort((a, b) => a.price - b.price);
    else if (newSort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    else if (newSort === "capacity") filtered.sort((a, b) => parseInt(b.capacity) - parseInt(a.capacity));
    setResults(filtered);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.3s ease",
    }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 24px",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: `${C.bg}EE`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "34px", height: "34px", background: C.accent, borderRadius: "9px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 12px ${C.accentGlow}`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 20H4L12 3Z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: "19px", fontWeight: "700", color: C.text, letterSpacing: "-0.5px" }}>tapa</span>
        </a>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="/auth/login" style={{
            padding: "7px 18px", background: "transparent",
            border: `1px solid ${C.border}`, borderRadius: "9px",
            color: C.muted, fontSize: "14px", fontWeight: "500", textDecoration: "none",
          }}>Sign in</a>
          <a href="/auth/signup" style={{
            padding: "7px 18px", background: C.accent,
            border: "none", borderRadius: "9px",
            color: C.white, fontSize: "14px", fontWeight: "600", textDecoration: "none",
            boxShadow: `0 4px 12px ${C.accentGlow}`,
          }}>Get Started</a>
        </div>
      </nav>

      {/* ── SEARCH HERO ── */}
      <div style={{
        paddingTop: "64px",
        background: `linear-gradient(180deg, #0A1520 0%, ${C.bg} 100%)`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 32px" }}>
          <h1 style={{
            fontSize: "28px", fontWeight: "700", color: C.text,
            margin: "0 0 6px", letterSpacing: "-0.5px",
          }}>Find a Carrier</h1>
          <p style={{ fontSize: "15px", color: C.muted, margin: "0 0 24px" }}>
            Real travelers going your way — verified, rated, trusted.
          </p>

          {/* Search bar */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "16px",
            padding: "6px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
            gap: "4px",
          }}>
            {/* From */}
            <div style={{ padding: "10px 14px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" }}>From</div>
              <input
                type="text"
                placeholder="City or country"
                value={from}
                onChange={e => setFrom(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: C.text, fontSize: "15px", fontWeight: "500",
                  fontFamily: "inherit", width: "100%", padding: 0,
                }}
              />
            </div>
            {/* To */}
            <div style={{ padding: "10px 14px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" }}>To</div>
              <input
                type="text"
                placeholder="City or country"
                value={to}
                onChange={e => setTo(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: C.text, fontSize: "15px", fontWeight: "500",
                  fontFamily: "inherit", width: "100%", padding: 0,
                }}
              />
            </div>
            {/* Date */}
            <div style={{ padding: "10px 14px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" }}>Travel Date</div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: date ? C.text : C.muted, fontSize: "15px", fontWeight: "500",
                  fontFamily: "inherit", width: "100%", padding: 0,
                  colorScheme: "dark",
                }}
              />
            </div>
            {/* Weight */}
            <div style={{ padding: "10px 14px" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" }}>Weight (kg)</div>
              <input
                type="number"
                placeholder="e.g. 2"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: C.text, fontSize: "15px", fontWeight: "500",
                  fontFamily: "inherit", width: "100%", padding: 0,
                }}
              />
            </div>
            {/* Search button */}
            <button
              onClick={handleSearch}
              style={{
                padding: "0 28px",
                background: C.accent,
                border: "none",
                borderRadius: "12px",
                color: C.white,
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 4px 16px ${C.accentGlow}`,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.accentDark;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.accent;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── RESULTS AREA ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>

        {!searched ? (
          /* ── Empty state ── */
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "20px",
              background: C.accentSoft, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: C.text, margin: "0 0 8px" }}>
              Find carriers going your way
            </h2>
            <p style={{ fontSize: "15px", color: C.muted, maxWidth: "360px", margin: "0 auto", lineHeight: "1.6" }}>
              Enter your origin, destination, and travel date above to see verified carriers on that route.
            </p>
            {/* Popular routes */}
            <div style={{ marginTop: "40px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: C.muted, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
                Popular routes
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { from: "Manila", to: "Dubai" },
                  { from: "Lagos", to: "London" },
                  { from: "Mumbai", to: "Singapore" },
                  { from: "São Paulo", to: "Miami" },
                ].map(r => (
                  <button
                    key={r.from}
                    onClick={() => { setFrom(r.from); setTo(r.to); }}
                    style={{
                      padding: "8px 16px",
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: "20px",
                      color: C.mutedLight,
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = C.accent;
                      e.currentTarget.style.color = C.accent;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.color = C.mutedLight;
                    }}
                  >
                    {r.from} → {r.to}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Filters + sort bar ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "20px", flexWrap: "wrap", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", color: C.muted }}>
                  <span style={{ color: C.text, fontWeight: "700" }}>{results.length}</span> carriers found
                  {(from || to) && <span> · {from}{from && to ? " → " : ""}{to}</span>}
                </span>
                {/* Filter chips */}
                {[
                  { label: "ID Verified", active: filterVerified, toggle: () => {
                    const next = !filterVerified;
                    setFilterVerified(next);
                    applyFilters(sort, next, filterTopCarrier);
                  }},
                  { label: "Top Carrier", active: filterTopCarrier, toggle: () => {
                    const next = !filterTopCarrier;
                    setFilterTopCarrier(next);
                    applyFilters(sort, filterVerified, next);
                  }},
                ].map(f => (
                  <button
                    key={f.label}
                    onClick={f.toggle}
                    style={{
                      padding: "6px 14px",
                      background: f.active ? C.accentSoft : C.surface,
                      border: `1px solid ${f.active ? C.accent : C.border}`,
                      borderRadius: "20px",
                      color: f.active ? C.accent : C.muted,
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {f.active ? "✓ " : ""}{f.label}
                  </button>
                ))}
              </div>
              {/* Sort */}
              <select
                value={sort}
                onChange={e => {
                  const v = e.target.value as SortKey;
                  setSort(v);
                  applyFilters(v, filterVerified, filterTopCarrier);
                }}
                style={{
                  padding: "7px 14px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: "10px",
                  color: C.text,
                  fontSize: "13px",
                  fontFamily: "inherit",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
                <option value="date_soon">Soonest Departure</option>
                <option value="capacity">Most Capacity</option>
              </select>
            </div>

            {/* ── Carrier cards ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {results.map((carrier, idx) => (
                <div
                  key={carrier.id}
                  style={{
                    background: hoveredCard === carrier.id ? C.surfaceHover : C.surface,
                    border: `1px solid ${hoveredCard === carrier.id ? C.borderHover : C.border}`,
                    borderRadius: "16px",
                    padding: "20px 24px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: hoveredCard === carrier.id ? "translateY(-2px)" : "none",
                    boxShadow: hoveredCard === carrier.id ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
                    opacity: mounted ? 1 : 0,
                    animation: mounted ? `fadeUp 0.4s ease ${idx * 0.06}s both` : "none",
                  }}
                  onMouseEnter={() => setHoveredCard(carrier.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.location.href = `/carrier/${carrier.id}`}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    {/* Avatar */}
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: carrier.avatarColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: "700", color: C.white,
                      flexShrink: 0,
                      position: "relative",
                    }}>
                      {carrier.avatar}
                      {carrier.verified && (
                        <div style={{
                          position: "absolute", bottom: "-4px", right: "-4px",
                          width: "18px", height: "18px", borderRadius: "50%",
                          background: C.green,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `2px solid ${C.surface}`,
                        }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Main info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700", color: C.text }}>{carrier.name}</span>
                        {carrier.badge && (
                          <span style={{
                            padding: "2px 8px", background: C.goldSoft,
                            border: `1px solid ${C.gold}`, borderRadius: "20px",
                            fontSize: "11px", fontWeight: "700", color: C.gold,
                            letterSpacing: "0.3px",
                          }}>{carrier.badge}</span>
                        )}
                        {carrier.idVerified && (
                          <span style={{
                            padding: "2px 8px", background: C.greenSoft,
                            border: `1px solid ${C.green}`, borderRadius: "20px",
                            fontSize: "11px", fontWeight: "600", color: C.green,
                          }}>ID Verified</span>
                        )}
                      </div>

                      {/* Route + flight */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", color: C.text, fontWeight: "600" }}>{carrier.from}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                        <span style={{ fontSize: "14px", color: C.text, fontWeight: "600" }}>{carrier.to}</span>
                        <span style={{ fontSize: "13px", color: C.muted }}>·</span>
                        <span style={{ fontSize: "13px", color: C.muted }}>{carrier.date}</span>
                        <span style={{ fontSize: "13px", color: C.muted }}>·</span>
                        <span style={{ fontSize: "13px", color: C.muted }}>{carrier.airline} {carrier.flightNo}</span>
                      </div>

                      {/* Tags */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {carrier.tags.map(tag => (
                          <span key={tag} style={{
                            padding: "3px 10px",
                            background: C.inputBg,
                            border: `1px solid ${C.border}`,
                            borderRadius: "20px",
                            fontSize: "12px", color: C.muted,
                          }}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Right column — stats + CTA */}
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "flex-end",
                      gap: "8px", flexShrink: 0,
                    }}>
                      {/* Price */}
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "22px", fontWeight: "800", color: C.text }}>${carrier.price}</span>
                        <span style={{ fontSize: "13px", color: C.muted }}>/{carrier.perUnit}</span>
                      </div>

                      {/* Rating + trips */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Stars rating={carrier.rating} />
                        <span style={{ fontSize: "13px", fontWeight: "600", color: C.text }}>{carrier.rating}</span>
                        <span style={{ fontSize: "12px", color: C.muted }}>({carrier.trips} trips)</span>
                      </div>

                      {/* Capacity */}
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                        <span style={{ fontSize: "12px", color: C.muted }}>{carrier.capacity} available</span>
                      </div>

                      {/* Response time */}
                      <div style={{ fontSize: "12px", color: C.muted }}>
                        Responds {carrier.responseTime}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={e => { e.stopPropagation(); window.location.href = `/carrier/${carrier.id}`; }}
                        style={{
                          marginTop: "4px",
                          padding: "9px 20px",
                          background: C.accent,
                          border: "none",
                          borderRadius: "10px",
                          color: C.white,
                          fontSize: "13px",
                          fontWeight: "700",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: `0 4px 12px ${C.accentGlow}`,
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.accentDark; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
                      >
                        View &amp; Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {results.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <p style={{ fontSize: "16px", color: C.muted }}>No carriers match your filters. Try adjusting them.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input::placeholder { color: ${C.muted}; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
