'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', coralDark: '#C73641', text: '#F8F9FA',
  muted: '#8B9BB4', green: '#52B788',
  greenBg: 'rgba(45,106,79,0.15)', greenBorder: 'rgba(82,183,136,0.25)',
};

interface Airport { name: string; city: string; country: string; iata: string; }
let _cache: Airport[] | null = null;
async function loadAirports(): Promise<Airport[]> {
  if (_cache) return _cache;
  const res = await fetch('/airports.json');
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

const Icon = {
  Logo: () => (<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="20" r="6" fill="none" stroke="white" stroke-width="2.5"/><circle cx="12" cy="20" r="2.5" fill="white"/><line x1="12" y1="26" x2="12" y2="36" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="15" y1="33" x2="33" y2="18" stroke="white" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/><circle cx="36" cy="12" r="8" fill="white"/><circle cx="36" cy="12" r="3.5" fill="#E84855"/><line x1="36" y1="20" x2="36" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>),
  Arrow: () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Swap: () => (<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Pin: () => (<svg width="15" height="15" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="10" r="3" stroke={C.muted} strokeWidth="2"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={C.muted} strokeWidth="2"/></svg>),
  Cal: () => (<svg width="15" height="15" viewBox="0 0 48 48" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke={C.muted} strokeWidth="2"/><path d="M3 9h18M8 2v4M16 2v4" stroke={C.muted} strokeWidth="2" strokeLinecap="round"/></svg>),
  Wgt: () => (<svg width="15" height="15" viewBox="0 0 48 48" fill="none"><path d="M12 3a3 3 0 100 6 3 3 0 000-6z" stroke={C.muted} strokeWidth="2"/><path d="M6.5 9h11l2 12h-15L6.5 9z" stroke={C.muted} strokeWidth="2" strokeLinejoin="round"/></svg>),
  Search: () => (<svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  Plane: () => (<svg width="13" height="13" viewBox="0 0 48 48" fill="none"><path d="M21 16l-9-9-1 5-5 1 9 9 1-5 5-1z" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Savings: ({ color = C.coral }: { color?: string }) => (<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 0h5.5a1.5 1.5 0 010 3H9" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Shield: ({ color = C.coral }: { color?: string }) => (<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><path d="M12 3l8 3v5c0 5-3.5 9-8 10C7.5 20 4 16 4 11V6l8-3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  MapPin: ({ color = C.coral }: { color?: string }) => (<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.8"/></svg>),
  Verify: ({ color = C.coral }: { color?: string }) => (<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M16 6l1.5 1.5L21 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Globe: ({ color = C.coral }: { color?: string }) => (<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/><path d="M12 3c-4 3-4 15 0 18M12 3c4 3 4 15 0 18M3 12h18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>),
  Camera: ({ color = C.coral }: { color?: string }) => (<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="2" y="7" width="20" height="14" rx="3" stroke={color} strokeWidth="1.8"/><circle cx="12" cy="14" r="3.5" stroke={color} strokeWidth="1.8"/><path d="M8 7l2-3h4l2 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

function AirportInput({ placeholder, value, onChange, icon }: {
  placeholder: string; value: string; onChange: (v: string, airport?: Airport) => void; icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = useAirportSearch(value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', height: '56px', background: focused ? 'rgba(255,255,255,0.04)' : 'transparent', borderRadius: '10px', transition: 'background 150ms' }}>
        <span style={{ flexShrink: 0, opacity: 0.5 }}>{icon}</span>
        <input value={value} onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.text, fontSize: '14px', fontWeight: 500, fontFamily: 'inherit', minWidth: 0 }} />
      </div>
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#162738', border: `1px solid ${C.border}`, borderRadius: '12px', zIndex: 500, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
          {results.map(a => (
            <button key={a.iata} onMouseDown={() => { onChange(`${a.city}, ${a.country} (${a.iata})`, a); setOpen(false); setFocused(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 100ms' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ background: 'rgba(232,72,85,0.1)', border: `1px solid rgba(232,72,85,0.2)`, color: C.coral, fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', flexShrink: 0, letterSpacing: '0.5px' }}>{a.iata}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{a.city}</span>
                <span style={{ color: C.muted, marginLeft: '6px' }}>{a.country}</span>
              </span>
              <span style={{ color: '#3D5166', fontSize: '11px', flexShrink: 0 }}>{a.name.length > 24 ? a.name.slice(0, 24) + '…' : a.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SL = ({ text }: { text: string }) => (
  <p style={{ color: C.coral, fontWeight: 700, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '14px' }}>{text}</p>
);

const StepRow = ({ children, label, index }: { children: React.ReactNode; label: string; index: number }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 0', borderBottom: index < 3 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}>
    <div style={{ minWidth: '44px', height: '44px', borderRadius: '12px', background: 'rgba(232,72,85,0.08)', border: `1px solid rgba(232,72,85,0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</div>
    <div style={{ paddingTop: '3px' }}>
      <span style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: C.coral, letterSpacing: '1.5px', marginBottom: '4px' }}>STEP {index + 1}</span>
      <span style={{ fontSize: '14px', color: '#C8D3E0', lineHeight: 1.6 }}>{label}</span>
    </div>
  </div>
);

const FCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', transition: 'transform 200ms ease, border-color 200ms ease' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,72,85,0.3)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = C.border; }}>
    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(232,72,85,0.08)', border: `1px solid rgba(232,72,85,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>{icon}</div>
    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: C.text }}>{title}</h3>
    <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
  </div>
);

type UserSession = { initials: string; role: 'carrier' | 'sender' | null; name: string; } | null;

export default function TapaLanding() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [user, setUser] = useState<UserSession>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Load signed-in user
  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (u) {
          const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', u.id).single();
          const name = profile?.name || u.email || '';
          const initials = name.trim().split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase() || 'U';
          setUser({ initials, role: profile?.role || 'sender', name });
        }
      } catch { /* not logged in */ }
      finally { setUserLoaded(true); }
    };
    load();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);
    if (weight) params.set('weight', weight);
    router.push(`/search?${params.toString()}`);
  };

  const W = { maxWidth: '1100px', margin: '0 auto', width: '100%' };
  const S = { padding: 'clamp(48px, 7vw, 72px) clamp(20px, 5vw, 48px)' };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        input::placeholder { color: #3D5166; }
        .tb { transition: transform 120ms ease, filter 120ms ease; }
        .tb:active { transform: scale(0.96) !important; filter: brightness(0.88) !important; }
        .tapa-stats { display: grid; grid-template-columns: repeat(4,1fr); }
        .tapa-how { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 24px; }
        .tapa-conn { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .tapa-feat { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 18px; }
        .tapa-use { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 18px; }
        .tapa-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .sbox { display: flex; align-items: stretch; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 18px; overflow: visible; box-shadow: 0 8px 48px rgba(0,0,0,0.28); }
        .sfields { display: flex; align-items: stretch; flex: 1; min-width: 0; }
        .sdiv { width: 1px; background: ${C.border}; flex-shrink: 0; margin: 10px 0; }
        .user-menu { position: absolute; top: 'calc(100% + 8px)'; right: 0; background: #162738; border: 1px solid ${C.border}; border-radius: 14px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.5); min-width: 180px; z-index: 300; }
        .user-menu-item { width: 100%; text-align: left; padding: 11px 16px; background: transparent; border: none; color: ${C.text}; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; display: block; transition: background 100ms; }
        .user-menu-item:hover { background: rgba(255,255,255,0.05); }
        .user-menu-item.danger { color: ${C.coral}; }
        @media (max-width: 768px) {
          .sbox { flex-direction: column; }
          .sfields { flex-direction: column; }
          .sdiv { width: auto; height: 1px; margin: 0 14px; }
          .sbtn { border-radius: 0 0 16px 16px !important; height: 52px !important; }
          .tapa-stats { grid-template-columns: repeat(2,1fr) !important; }
          .tapa-stats > div:nth-child(2) { border-right: none !important; }
          .tapa-stats > div:nth-child(1), .tapa-stats > div:nth-child(2) { border-bottom: 1px solid ${C.border}; }
          .tapa-conn { grid-template-columns: 1fr !important; gap: 32px !important; }
          .tapa-cta button { width: 100%; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 480px) {
          .tapa-how { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: '68px', display: 'flex', alignItems: 'center', padding: '0 clamp(20px,4vw,48px)', justifyContent: 'space-between', background: scrolled ? 'rgba(13,27,42,0.94)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent', transition: 'all 300ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${C.coral},${C.coralDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,72,85,0.38)' }}><Icon.Logo /></div>
          <span style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.5px' }}>tapa</span>
        </div>

        {/* Nav right — signed in vs signed out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: userLoaded ? 1 : 0, transition: 'opacity 150ms ease' }}>
            {user ? (
              // SIGNED IN
              <>
                {user.role === 'carrier' ? (
                  <button className="tb hide-mobile" style={{ background: C.coral, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} onClick={() => router.push('/trip/new')}>
                    + Post a Trip
                  </button>
                ) : (
                  <button className="tb hide-mobile" style={{ background: C.coral, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }} onClick={() => router.push('/search')}>
                    Find a Carrier
                  </button>
                )}
                {/* Avatar + dropdown */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                  <button onClick={() => setMenuOpen(v => !v)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: C.coral, border: `2px solid ${menuOpen ? C.text : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 150ms' }}>
                    {user.initials}
                  </button>
                  {menuOpen && (
                    <div className="user-menu" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0 }}>
                      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, marginBottom: '2px' }}>{user.name.split(' ')[0]}</div>
                        <div style={{ fontSize: '11px', color: C.muted, textTransform: 'capitalize' }}>{user.role} account</div>
                      </div>
                      <button className="user-menu-item" onClick={() => { router.push('/dashboard'); setMenuOpen(false); }}>My Dashboard</button>
                      {user.role === 'carrier'
                        ? <button className="user-menu-item" onClick={() => { router.push('/trip/new'); setMenuOpen(false); }}>Post a Trip</button>
                        : <button className="user-menu-item" onClick={() => { router.push('/search'); setMenuOpen(false); }}>Find a Carrier</button>
                      }
                      <button className="user-menu-item" onClick={() => { router.push('/feed'); setMenuOpen(false); }}>Feed</button>
                      <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
                      <button className="user-menu-item danger" onClick={handleSignOut}>Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // SIGNED OUT
              <>
                <button className="tb hide-mobile" style={{ background: 'transparent', color: C.text, border: `1.5px solid ${C.border}`, padding: '8px 16px', borderRadius: '12px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push('/auth/signup?role=carrier')}>
                  I'm a Carrier
                </button>
                <button className="tb" style={{ background: C.coral, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,72,85,0.35)' }} onClick={() => router.push('/auth/signup')}>
                  Get Started
                </button>
              </>
            )}
          </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(110px,15vh,150px) clamp(20px,5vw,48px) 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '700px', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(232,72,85,0.06) 0%,transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: 'radial-gradient(circle,#F8F9FA 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
        <div style={{ ...W, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: '100px', padding: '8px 18px', marginBottom: '36px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, display: 'inline-block' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.green }}>Now open — peer-to-peer delivery across borders</span>
          </div>
          <h1 style={{ fontSize: 'clamp(38px,7.5vw,84px)', fontWeight: 800, lineHeight: 1.02, letterSpacing: 'clamp(-1.5px,-0.03em,-3px)', marginBottom: '20px', maxWidth: '860px' }}>
            Your item.<br /><span style={{ color: C.coral }}>Their journey.</span><br />Delivered.
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: C.muted, maxWidth: '480px', lineHeight: 1.8, marginBottom: '40px' }}>
            Connect with real travelers going your way. Ship anything across borders — faster, cheaper, and more human than any courier.
          </p>

          {/* SEARCH BOX */}
          <div style={{ maxWidth: '860px', marginBottom: '16px' }}>
            <div className="sbox">
              <div className="sfields">
                <AirportInput placeholder="From — city, country or IATA" value={from} onChange={setFrom} icon={<Icon.Pin />} />
                <div className="sdiv" />
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', flexShrink: 0 }}>
                  <button className="tb" onClick={() => { const t = from; setFrom(to); setTo(t); }}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(232,72,85,0.1)', border: `1px solid rgba(232,72,85,0.22)`, color: C.coral, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon.Swap />
                  </button>
                </div>
                <div className="sdiv" />
                <AirportInput placeholder="To — city, country or IATA" value={to} onChange={setTo} icon={<Icon.Pin />} />
                <div className="sdiv" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', height: '56px', flexShrink: 0, width: '155px' }}>
                  <span style={{ opacity: 0.5, flexShrink: 0 }}><Icon.Cal /></span>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: date ? C.text : '#3D5166', fontSize: '13px', fontFamily: 'inherit', minWidth: 0, cursor: 'pointer' }} />
                </div>
                <div className="sdiv" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', height: '56px', flexShrink: 0, width: '130px' }}>
                  <span style={{ opacity: 0.5, flexShrink: 0 }}><Icon.Wgt /></span>
                  <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.text, fontSize: '13px', fontFamily: 'inherit', minWidth: 0 }} />
                </div>
              </div>
              <button className="tb sbtn" onClick={handleSearch}
                style={{ background: `linear-gradient(135deg,${C.coral},${C.coralDark})`, color: '#fff', border: 'none', padding: '0 28px', height: '56px', borderRadius: '0 16px 16px 0', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Icon.Search /> Search
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#3D5166' }}>Popular:</span>
              {[
                { f: 'Douala, Cameroon (DLA)', t: 'Paris, France (CDG)' },
                { f: 'Lagos, Nigeria (LOS)', t: 'London, United Kingdom (LHR)' },
                { f: 'Manila, Philippines (MNL)', t: 'Dubai, United Arab Emirates (DXB)' },
              ].map(eg => (
                <button key={eg.f} onClick={() => { setFrom(eg.f); setTo(eg.t); }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.muted, fontSize: '12px', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,72,85,0.35)'; (e.currentTarget as HTMLElement).style.color = C.text; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}>
                  {eg.f.split(',')[0]} → {eg.t.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {!user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '12px' }}>
              <button className="tb" style={{ background: 'transparent', color: C.coral, border: `1.5px solid rgba(232,72,85,0.35)`, padding: '11px 24px', borderRadius: '12px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push('/auth/signup?role=carrier')}>
                Become a Carrier — earn on your travels
              </button>
              <span style={{ fontSize: '13px', color: '#3D5166' }}>No subscription. Free to join.</span>
            </div>
          )}
        </div>
      </section>

      {/* STATS — honest for a new product */}
      <section style={{ padding: '0 clamp(20px,5vw,48px) 80px' }}>
        <div style={W}>
          <div className="tapa-stats" style={{ border: `1px solid ${C.border}`, borderRadius: '20px', overflow: 'hidden' }}>
            {[
              { n: '195', l: 'Countries reachable' },
              { n: 'Up to 70%', l: 'Cheaper than couriers' },
              { n: '6,072+', l: 'Airports in our network' },
              { n: '100%', l: 'Escrow protected' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.surface, padding: 'clamp(20px,3vw,36px) clamp(12px,2vw,24px)', textAlign: 'center', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, color: C.coral, letterSpacing: '-1px', marginBottom: '6px' }}>{s.n}</div>
                <div style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={S}>
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <SL text="Simple process" />
            <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-1px' }}>How Tapa works</h2>
          </div>
          <div className="tapa-how">
            {[
              { role: 'For Senders', sub: 'Need something delivered?', icon: <svg width="26" height="26" viewBox="0 0 48 48" fill="none"><rect x="3" y="9" width="18" height="13" rx="2" stroke={C.coral} strokeWidth="2"/><path d="M8 9V7a4 4 0 018 0v2" stroke={C.coral} strokeWidth="2" strokeLinecap="round"/></svg>,
                steps: ['Search for a carrier going to your destination', 'Book based on dates, weight, and price', 'Hand over item with photo documentation', 'Confirm delivery and release payment'] },
              { role: 'For Carriers', sub: 'Travelling? Earn on the way.', icon: <svg width="26" height="26" viewBox="0 0 48 48" fill="none"><path d="M20 12V22H4V12" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7H2v5h20V7z" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                steps: ['Post your route, dates, and available space', 'Receive and accept delivery requests', 'Carry the item on your journey', 'Deliver and get paid instantly'] },
            ].map(card => (
              <div key={card.role} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '24px', padding: 'clamp(24px,3vw,36px)' }}>
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(232,72,85,0.08)', border: `1px solid rgba(232,72,85,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{card.icon}</div>
                  <h3 style={{ fontSize: '21px', fontWeight: 800, marginBottom: '6px' }}>{card.role}</h3>
                  <p style={{ fontSize: '13px', color: C.muted }}>{card.sub}</p>
                </div>
                {card.steps.map((step, i) => (
                  <StepRow key={i} index={i} label={step}><Icon.Plane /></StepRow>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECTED ROUTE — concept illustration, not live data */}
      <section style={S}>
        <div style={W}>
          <div style={{ background: 'linear-gradient(140deg,#112236,#0D1B2A)', border: `1px solid ${C.border}`, borderRadius: '28px', padding: 'clamp(28px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle at top right,rgba(232,72,85,0.05),transparent 65%)', pointerEvents: 'none' }} />
            <div className="tapa-conn">
              <div>
                <SL text="Key innovation" />
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '20px' }}>No direct route?<br />No problem.</h2>
                <p style={{ color: C.muted, fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>Like a flight with a layover, Tapa chains two carriers together. No one flies Zürich to Manila directly — but two travelers can make it happen, fully coordinated through the platform.</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Automated matching', 'Secure handoff', 'Full tracking'].map(tag => (
                    <span key={tag} style={{ background: 'rgba(232,72,85,0.08)', border: `1px solid rgba(232,72,85,0.22)`, color: '#F9A8B0', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '100px' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '12px', opacity: 0.6 }}>Example route</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { city: 'Zürich', role: 'Carrier A departs', dot: C.coral },
                    { city: 'Singapore', role: 'Secure handoff', dot: '#F59E0B' },
                    { city: 'Manila', role: 'Carrier B delivers', dot: C.green },
                  ].map((n, i) => (
                    <div key={n.city}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px 20px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="10" r="3" stroke={n.dot} strokeWidth="2"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={n.dot} strokeWidth="2"/></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 700 }}>{n.city}</div>
                          <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{n.role}</div>
                        </div>
                        <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: n.dot, boxShadow: `0 0 8px ${n.dot}`, display: 'inline-block', flexShrink: 0 }} />
                      </div>
                      {i < 2 && (
                        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 28px' }}>
                          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg,${C.border},transparent)` }} />
                          <svg width="14" height="14" viewBox="0 0 48 48" fill="none" style={{ margin: '0 8px' }}><path d="M21 16l-9-9-1 5-5 1 9 9 1-5 5-1z" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <div style={{ flex: 1, height: '1px', background: `linear-gradient(270deg,${C.border},transparent)` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TAPA */}
      <section style={S}>
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <SL text="Why Tapa" />
            <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-1px' }}>Built for the long term</h2>
            <p style={{ color: C.muted, fontSize: '15px', marginTop: '14px', maxWidth: '440px', margin: '14px auto 0', lineHeight: 1.7 }}>Every feature designed with consistency, trust, and scale in mind.</p>
          </div>
          <div className="tapa-feat">
            <FCard icon={<Icon.Savings />} title="Up to 70% cheaper" desc="Real travelers with spare luggage space beat couriers on price — every time." />
            <FCard icon={<Icon.Shield />} title="Escrow protection" desc="Payments are held securely until delivery is confirmed. Zero risk on both sides." />
            <FCard icon={<Icon.MapPin />} title="Real-time tracking" desc="Know exactly where your item is at every step of the journey." />
            <FCard icon={<Icon.Verify />} title="Verified carriers" desc="Every carrier completes identity verification before they can carry items." />
            <FCard icon={<Icon.Globe />} title="Any route worldwide" desc="If someone flies it, Tapa covers it. 195 countries, any direction." />
            <FCard icon={<Icon.Camera />} title="Photo proof" desc="Full photo documentation at pickup and delivery — complete accountability." />
          </div>
        </div>
      </section>

      {/* USE CASES — framed as possibilities, not past events */}
      <section style={{ ...S, background: 'rgba(255,255,255,0.01)' }}>
        <div style={W}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <SL text="What you can send" />
            <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-1px' }}>Any item. Any route.</h2>
            <p style={{ color: C.muted, fontSize: '15px', marginTop: '14px', maxWidth: '440px', margin: '14px auto 0', lineHeight: 1.7 }}>If a traveler is going there, your item can go with them.</p>
          </div>
          <div className="tapa-use">
            {[
              { from: 'Vietnam', to: 'Cameroon', item: 'Hair extensions', saving: 'Est. 70% cheaper than DHL' },
              { from: 'Switzerland', to: 'Philippines', item: 'Medicine & vitamins', saving: 'Est. 65% cheaper than FedEx' },
              { from: 'New York', to: 'Lagos', item: 'Sneakers & clothing', saving: 'Est. 60% cheaper than courier' },
            ].map(c => (
              <div key={c.item} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.muted }}>{c.from}</span>
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><line x1="0" y1="5" x2="12" y2="5" stroke={C.coral} strokeWidth="1.5"/><path d="M9 2l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.muted }}>{c.to}</span>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{c.item}</p>
                <span style={{ display: 'inline-block', background: C.greenBg, border: `1px solid ${C.greenBorder}`, color: C.green, fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px' }}>{c.saving}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — honest for a new product */}
      <section style={S}>
        <div style={W}>
          <div style={{ background: `linear-gradient(140deg,${C.coral},${C.coralDark})`, borderRadius: '28px', padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px)', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 80px rgba(232,72,85,0.28)' }}>
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Be an early mover</p>
            <h2 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff', marginBottom: '16px', lineHeight: 1.05 }}>Ready to ship smarter?</h2>
            <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(255,255,255,0.72)', maxWidth: '420px', margin: '0 auto 44px', lineHeight: 1.75 }}>Join now and be among the first to ship across borders the human way.</p>
            <div className="tapa-cta">
              <button className="tb" style={{ background: '#fff', color: C.coral, border: 'none', padding: 'clamp(14px,2vw,17px) clamp(28px,4vw,40px)', borderRadius: '12px', fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={() => router.push('/search')}>
                Find a Carrier <Icon.Arrow />
              </button>
              <button className="tb" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', padding: 'clamp(14px,2vw,17px) clamp(28px,4vw,40px)', borderRadius: '12px', fontSize: 'clamp(14px,2vw,16px)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => router.push('/auth/signup?role=carrier')}>
                Become a Carrier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: 'clamp(32px,4vw,48px) clamp(20px,5vw,48px)' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg,${C.coral},${C.coralDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Logo /></div>
              <span style={{ fontSize: '17px', fontWeight: 800 }}>tapa</span>
            </div>
            <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.7, maxWidth: '210px' }}>Trust in motion. A stranger becomes your carrier. Distance becomes irrelevant.</p>
            <p style={{ fontSize: '12px', color: '#3D5166', marginTop: '20px' }}>© 2026 Tapa. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
            {[
              { heading: 'Product', links: ['How it works', 'Find a Carrier', 'Become a Carrier', 'Connected Routes'] },
              { heading: 'Company', links: ['About', 'Safety', 'Trust & Verify', 'Contact'] },
            ].map(col => (
              <div key={col.heading}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: C.muted, letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '18px' }}>{col.heading}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.links.map(link => (<a key={link} href="#" style={{ fontSize: '13px', color: '#4A6380', textDecoration: 'none' }}>{link}</a>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
