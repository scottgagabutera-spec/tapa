"use client";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0D1B2A", surface: "#1A2F45", surfaceHover: "#1F3650",
  border: "#243B55", borderHover: "#2E4A6A",
  accent: "#E84855", accentDark: "#C73641",
  accentGlow: "rgba(232,72,85,0.12)", accentSoft: "rgba(232,72,85,0.08)",
  text: "#F8F9FA", muted: "#8B9BB4", mutedLight: "#A8B8CC",
  inputBg: "#0A1520", white: "#FFFFFF",
  green: "#2D9E6B", greenSoft: "rgba(45,158,107,0.12)",
  gold: "#F5A623", goldSoft: "rgba(245,166,35,0.12)",
};

interface Airport { name: string; city: string; country: string; iata: string; }
let _cache: Airport[] | null = null;
async function loadAirports(): Promise<Airport[]> {
  if (_cache) return _cache;
  const res = await fetch("/airports.json");
  _cache = await res.json();
  return _cache!;
}

function useAirportSearch(query: string) {
  const [results, setResults] = useState<Airport[]>([]);
  const search = useCallback(async (q: string) => {
    if (!q || q.length < 1) { setResults([]); return; }
    const airports = await loadAirports();
    const lower = q.toLowerCase();
    const matches = airports.filter(a =>
      a.iata.toLowerCase().startsWith(lower) ||
      a.city.toLowerCase().includes(lower) ||
      a.country.toLowerCase().includes(lower) ||
      a.name.toLowerCase().includes(lower)
    );
    matches.sort((a, b) => {
      const ai = a.iata.toLowerCase() === lower ? 0 : a.city.toLowerCase().startsWith(lower) ? 1 : 2;
      const bi = b.iata.toLowerCase() === lower ? 0 : b.city.toLowerCase().startsWith(lower) ? 1 : 2;
      return ai - bi;
    });
    setResults(matches.slice(0, 7));
  }, []);
  useEffect(() => { search(query); }, [query, search]);
  return results;
}

function AirportInput({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = useAirportSearch(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div style={{ padding: "10px 14px", borderRight: `1px solid ${C.border}` }} className="sfield">
        <div style={{ fontSize: "10px", fontWeight: 600, color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" as const }}>{label}</div>
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          placeholder={placeholder}
          style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: "15px", fontWeight: 500, fontFamily: "inherit", width: "100%", padding: 0 }}
        />
      </div>
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#162738", border: `1px solid ${C.border}`, borderRadius: "12px", zIndex: 500, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", marginTop: "4px" }}>
          {results.map(a => (
            <button key={a.iata} onMouseDown={() => { onChange(`${a.city}, ${a.country} (${a.iata})`); setOpen(false); setFocused(false); }}
              style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "transparent", border: "none", color: C.text, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "10px", transition: "background 100ms" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span style={{ background: "rgba(232,72,85,0.1)", border: "1px solid rgba(232,72,85,0.2)", color: C.accent, fontSize: "11px", fontWeight: 800, padding: "2px 7px", borderRadius: "6px", flexShrink: 0 }}>{a.iata}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{a.city}</span>
                <span style={{ color: C.muted, marginLeft: "6px" }}>{a.country}</span>
              </span>
              <span style={{ color: "#3D5166", fontSize: "11px", flexShrink: 0 }}>{a.name.length > 22 ? a.name.slice(0, 22) + "…" : a.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type SortKey = "recommended" | "price_low" | "rating" | "date_soon" | "capacity";

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= full ? C.gold : (i === full + 1 && half ? "url(#half)" : C.border)}>
          <defs><linearGradient id="half"><stop offset="50%" stopColor={C.gold}/><stop offset="50%" stopColor={C.border}/></linearGradient></defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
};

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [weight, setWeight] = useState(searchParams.get("weight") || "");
  const [searched, setSearched] = useState(!!(searchParams.get("from") || searchParams.get("to")));
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterTopCarrier, setFilterTopCarrier] = useState(false);
  const [allCarriers, setAllCarriers] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Load real carriers from Supabase on mount
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("trips")
        .select("*, profiles(name, rating, total_trips, id_verified, avatar_color)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.profiles?.name || "Carrier",
          avatar: (t.profiles?.name || "CA").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
          avatarColor: t.profiles?.avatar_color || C.accent,
          from: t.from_city, to: t.to_city,
          date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          airline: t.airline || "", flightNo: t.flight_no || "",
          verified: t.profiles?.id_verified || false,
          idVerified: t.profiles?.id_verified || false,
          rating: t.profiles?.rating || 0,
          trips: t.profiles?.total_trips || 0,
          capacity: (t.capacity_kg || 0) + " kg",
          price: t.price_per_kg || 0,
          currency: "USD", perUnit: "kg", responseTime: "~1 hr",
          badge: null, tags: t.item_types || [], bio: t.notes || "",
        }));
        setAllCarriers(mapped);
      } else {
        // No data — show empty, not mock
        setAllCarriers([]);
      }
      setLoading(false);
    };
    fetchTrips();
  }, []);

  // Auto-search if params come from landing page
  useEffect(() => {
    if (searchParams.get("from") || searchParams.get("to")) {
      setSearched(true);
    }
  }, [searchParams]);

  // Re-apply filters whenever allCarriers, filters, or sort change after a search
  useEffect(() => {
    if (searched) applyFilters(sort, filterVerified, filterTopCarrier, from, to);
  }, [allCarriers, searched, from, to]);

  const applyFilters = (newSort: SortKey, newVerified: boolean, newTop: boolean, newFrom?: string, newTo?: string) => {
    let filtered = [...allCarriers];
    const f = (newFrom ?? from).toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
    const t = (newTo ?? to).toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
    const cityOnly = (s: string) => s.split(",")[0].toLowerCase().trim();
    const fCity = f.split(",")[0].trim();
    const tCity = t.split(",")[0].trim();
    if (fCity) filtered = filtered.filter(c => cityOnly(c.from).includes(fCity));
    if (tCity) filtered = filtered.filter(c => cityOnly(c.to).includes(tCity));
    if (date) { const d = new Date(date + 'T00:00:00'); const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); filtered = filtered.filter(c => c.date === formatted); }
    if (newVerified) filtered = filtered.filter(c => c.idVerified);
    if (newTop) filtered = filtered.filter(c => c.badge === "Top Carrier");
    if (newSort === "price_low") filtered.sort((a, b) => a.price - b.price);
    else if (newSort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    else if (newSort === "capacity") filtered.sort((a, b) => parseInt(b.capacity) - parseInt(a.capacity));
    setResults(filtered);
  };

  const handleSearch = () => {
    setSearched(true);
    applyFilters(sort, filterVerified, filterTopCarrier);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    if (weight) params.set("weight", weight);
    router.replace(`/search?${params.toString()}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #3D5166; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        .tb { transition: transform 120ms ease, filter 120ms ease; }
        .tb:active { transform: scale(0.96) !important; filter: brightness(0.88) !important; }
        .sbar { display: grid; grid-template-columns: 1fr 1fr 180px 130px auto; }
        .sfield { border-right: 1px solid ${C.border}; }
        .sfield:last-of-type { border-right: none; }
        .fbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .card-inner { display: flex; align-items: flex-start; gap: 16px; }
        .card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
        @media (max-width: 700px) {
          .sbar { grid-template-columns: 1fr 1fr !important; }
          .sfield { border-right: none !important; border-bottom: 1px solid ${C.border}; }
          .sfield:last-of-type { border-bottom: none; }
          .sbtn { grid-column: 1 / -1; border-radius: 10px !important; padding: 14px !important; }
        }
        @media (max-width: 480px) {
          .sbar { grid-template-columns: 1fr !important; }
          .card-inner { flex-direction: column !important; gap: 12px !important; }
          .card-right { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; width: 100% !important; }
          .fbar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "0 clamp(16px,4vw,24px)", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `${C.bg}EE`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "34px", height: "34px", background: C.accent, borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${C.accentGlow}` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="17" r="2.5" fill="white"/><path d="M7.5 17 Q12 6 19 9" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="19" cy="9" r="3.5" fill="white"/><circle cx="19" cy="9" r="1.5" fill="currentColor"/></svg>
          </div>
          <span style={{ fontSize: "19px", fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>tapa</span>
        </a>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href="/auth/login" className="tb" style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "9px", color: C.muted, fontSize: "13px", fontWeight: 500, textDecoration: "none", display: "inline-block" }}>Sign in</a>
          <a href="/auth/signup" className="tb" style={{ padding: "7px 14px", background: C.accent, borderRadius: "9px", color: C.white, fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "inline-block", boxShadow: `0 4px 12px ${C.accentGlow}` }}>Get Started</a>
        </div>
      </nav>

      {/* SEARCH HERO */}
      <div style={{ paddingTop: "64px", background: `linear-gradient(180deg, #0A1520 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px clamp(16px,4vw,24px) 28px" }}>
          <h1 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, color: C.text, marginBottom: "6px", letterSpacing: "-0.5px" }}>Find a Carrier</h1>
          <p style={{ fontSize: "14px", color: C.muted, marginBottom: "20px" }}>Real travelers going your way — verified, rated, trusted.</p>
          <div className="sbar" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "visible" }}>
            <AirportInput label="From" placeholder="City, country or IATA" value={from} onChange={setFrom} />
            <AirportInput label="To" placeholder="City, country or IATA" value={to} onChange={setTo} />
            <div style={{ padding: "10px 14px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" as const }}>Travel Date</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: date ? C.text : C.muted, fontSize: "14px", fontWeight: 500, fontFamily: "inherit", width: "100%", padding: 0, colorScheme: "dark" }} />
            </div>
            <div style={{ padding: "10px 14px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: C.muted, letterSpacing: "0.8px", marginBottom: "4px", textTransform: "uppercase" as const }}>Weight (kg)</div>
              <input type="number" placeholder="e.g. 2" value={weight} onChange={e => setWeight(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: "14px", fontWeight: 500, fontFamily: "inherit", width: "100%", padding: 0 }} />
            </div>
            <button className="tb sbtn" onClick={handleSearch} style={{ padding: "0 28px", background: C.accent, border: "none", borderRadius: "0 14px 14px 0", color: C.white, fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1)` }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px clamp(16px,4vw,24px)" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ width: "40px", height: "40px", border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: C.muted, fontSize: "14px" }}>Finding carriers…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : !searched ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: C.accentSoft, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>Find carriers going your way</h2>
            <p style={{ fontSize: "15px", color: C.muted, maxWidth: "360px", margin: "0 auto", lineHeight: 1.6 }}>Enter your origin, destination, and travel date above to see verified carriers on that route.</p>
            <div style={{ marginTop: "40px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: C.muted, letterSpacing: "0.8px", textTransform: "uppercase" as const, marginBottom: "12px" }}>Popular routes</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { from: "Douala, Cameroon (DLA)", to: "Paris, France (CDG)" },
                  { from: "Lagos, Nigeria (LOS)", to: "London, United Kingdom (LHR)" },
                  { from: "Manila, Philippines (MNL)", to: "Dubai, United Arab Emirates (DXB)" },
                  { from: "São Paulo, Brazil (GRU)", to: "Miami, USA (MIA)" },
                ].map(r => (
                  <button key={r.from} className="tb" onClick={() => { setFrom(r.from); setTo(r.to); setSearched(true); applyFilters(sort, filterVerified, filterTopCarrier); }}
                    style={{ padding: "8px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", color: C.mutedLight, fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    {r.from.split(",")[0]} → {r.to.split(",")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="fbar">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", color: C.muted }}>
                  <span style={{ color: C.text, fontWeight: 700 }}>{results.length}</span> carrier{results.length !== 1 ? "s" : ""} found
                  {(from || to) && <span style={{ color: C.muted }}> · {from.split("(")[0].trim()}{from && to ? " → " : ""}{to.split("(")[0].trim()}</span>}
                </span>
                {[
                  { label: "ID Verified", active: filterVerified, toggle: () => { const n = !filterVerified; setFilterVerified(n); applyFilters(sort, n, filterTopCarrier); }},
                  { label: "Top Carrier", active: filterTopCarrier, toggle: () => { const n = !filterTopCarrier; setFilterTopCarrier(n); applyFilters(sort, filterVerified, n); }},
                ].map(f => (
                  <button key={f.label} className="tb" onClick={f.toggle} style={{ padding: "6px 14px", background: f.active ? C.accentSoft : C.surface, border: `1px solid ${f.active ? C.accent : C.border}`, borderRadius: "20px", color: f.active ? C.accent : C.muted, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {f.active ? "✓ " : ""}{f.label}
                  </button>
                ))}
              </div>
              <select className="tb" value={sort} onChange={e => { const v = e.target.value as SortKey; setSort(v); applyFilters(v, filterVerified, filterTopCarrier); }}
                style={{ padding: "7px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, fontSize: "13px", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
                <option value="date_soon">Soonest Departure</option>
                <option value="capacity">Most Capacity</option>
              </select>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "16px" }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.text, marginBottom: "8px" }}>No carriers on this route yet</h3>
                <p style={{ fontSize: "14px", color: C.muted, maxWidth: "320px", margin: "0 auto", lineHeight: 1.6 }}>Be the first to post this route, or try a nearby city. Carriers are added daily.</p>
                <button className="tb" onClick={() => router.push("/trip/new")} style={{ marginTop: "24px", padding: "10px 24px", background: C.accent, border: "none", borderRadius: "10px", color: C.white, fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Post this route as a Carrier
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {results.map(carrier => (
                  <div key={carrier.id}
                    style={{ background: hoveredCard === carrier.id ? C.surfaceHover : C.surface, border: `1px solid ${hoveredCard === carrier.id ? C.borderHover : C.border}`, borderRadius: "16px", padding: "clamp(16px,3vw,20px) clamp(16px,3vw,24px)", cursor: "pointer", transition: "all 0.18s ease", transform: hoveredCard === carrier.id ? "translateY(-2px)" : "none", boxShadow: hoveredCard === carrier.id ? "0 8px 32px rgba(0,0,0,0.3)" : "none" }}
                    onMouseEnter={() => setHoveredCard(carrier.id)} onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => router.push(`/carrier/${carrier.id}`)}>
                    <div className="card-inner">
                      <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: carrier.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: C.white, flexShrink: 0, position: "relative" }}>
                        {carrier.avatar}
                        {carrier.verified && (
                          <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "18px", height: "18px", borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.surface}` }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>{carrier.name}</span>
                          {carrier.badge && <span style={{ padding: "2px 8px", background: C.goldSoft, border: `1px solid ${C.gold}`, borderRadius: "20px", fontSize: "11px", fontWeight: 700, color: C.gold }}>{carrier.badge}</span>}
                          {carrier.idVerified && <span style={{ padding: "2px 8px", background: C.greenSoft, border: `1px solid ${C.green}`, borderRadius: "20px", fontSize: "11px", fontWeight: 600, color: C.green }}>ID Verified</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "14px", color: C.text, fontWeight: 600 }}>{carrier.from}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          <span style={{ fontSize: "14px", color: C.text, fontWeight: 600 }}>{carrier.to}</span>
                          <span style={{ fontSize: "13px", color: C.muted }}>· {carrier.date}</span>
                          {carrier.airline && <span style={{ fontSize: "13px", color: C.muted }}>· {carrier.airline} {carrier.flightNo}</span>}
                        </div>
                        {carrier.tags.length > 0 && (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {carrier.tags.map((tag: string) => (
                              <span key={tag} style={{ padding: "3px 10px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "20px", fontSize: "12px", color: C.muted }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="card-right">
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "22px", fontWeight: 800, color: C.text }}>${carrier.price}</span>
                          <span style={{ fontSize: "13px", color: C.muted }}>/{carrier.perUnit}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Stars rating={carrier.rating} />
                          <span style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{carrier.rating || "—"}</span>
                          <span style={{ fontSize: "12px", color: C.muted }}>({carrier.trips})</span>
                        </div>
                        <div style={{ fontSize: "12px", color: C.muted }}>{carrier.capacity} available</div>
                        <button className="tb" onClick={e => { e.stopPropagation(); router.push(`/carrier/${carrier.id}`); }}
                          style={{ marginTop: "4px", padding: "9px 20px", background: C.accent, border: "none", borderRadius: "10px", color: C.white, fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 12px ${C.accentGlow}` }}>
                          View &amp; Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0D1B2A" }} />}>
      <SearchPageInner />
    </Suspense>
  );
}
