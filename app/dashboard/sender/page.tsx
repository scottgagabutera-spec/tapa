'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', surfaceHover: '#1F3650',
  border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', coralDark: '#C73641', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4', inputBg: '#0A1520',
  gold: '#F59E0B', goldSoft: 'rgba(245,158,11,0.12)', goldBorder: 'rgba(245,158,11,0.3)',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  blue: '#3B82F6', blueSoft: 'rgba(59,130,246,0.12)', blueBorder: 'rgba(59,130,246,0.3)',
  red: '#E84855', redSoft: 'rgba(232,72,85,0.1)', redBorder: 'rgba(232,72,85,0.3)',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; step: number }> = {
  pending:    { label: 'Pending',    color: C.gold,  bg: C.goldSoft,   border: C.goldBorder,  step: 0 },
  confirmed:  { label: 'Confirmed',  color: C.blue,  bg: C.blueSoft,   border: C.blueBorder,  step: 1 },
  in_transit: { label: 'In Transit', color: C.coral, bg: C.accentGlow, border: C.redBorder,   step: 2 },
  delivered:  { label: 'Delivered',  color: C.green, bg: C.greenSoft,  border: C.greenBorder, step: 3 },
  cancelled:  { label: 'Cancelled',  color: C.muted, bg: 'rgba(139,155,180,0.1)', border: 'rgba(139,155,180,0.2)', step: -1 },
};

const TRACKING_STEPS = [
  { key: 'pending',    label: 'Booked',      desc: 'Waiting for carrier to confirm', icon: '📦' },
  { key: 'confirmed',  label: 'Confirmed',   desc: 'Carrier accepted your booking',  icon: '✅' },
  { key: 'in_transit', label: 'In Transit',  desc: 'Your item is on its way',        icon: '✈️' },
  { key: 'delivered',  label: 'Delivered',   desc: 'Item delivered successfully',    icon: '🎉' },
];

interface Airport { name: string; city: string; country: string; iata: string; }
let _airportCache: Airport[] | null = null;
async function loadAirports(): Promise<Airport[]> {
  if (_airportCache) return _airportCache;
  const res = await fetch('/airports.json');
  _airportCache = await res.json();
  return _airportCache!;
}
function useAirportSearch(query: string) {
  const [results, setResults] = useState<Airport[]>([]);
  const search = useCallback(async (q: string) => {
    if (!q || q.length < 1) { setResults([]); return; }
    const airports = await loadAirports();
    const lower = q.toLowerCase();
    const matches = airports.filter(a =>
      a.iata.toLowerCase().startsWith(lower) || a.city.toLowerCase().includes(lower) ||
      a.country.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower)
    );
    matches.sort((a, b) => {
      const ai = a.iata.toLowerCase() === lower ? 0 : a.city.toLowerCase().startsWith(lower) ? 1 : 2;
      const bi = b.iata.toLowerCase() === lower ? 0 : b.city.toLowerCase().startsWith(lower) ? 1 : 2;
      return ai - bi;
    });
    setResults(matches.slice(0, 6));
  }, []);
  useEffect(() => { search(query); }, [query, search]);
  return results;
}

function AirportInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = useAirportSearch(value);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <input value={value} onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} placeholder={placeholder}
        style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#162738', border: `1px solid ${C.border}`, borderRadius: '12px', zIndex: 500, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
          {results.map(a => (
            <button key={a.iata} onMouseDown={() => { onChange(`${a.city}, ${a.country} (${a.iata})`); setOpen(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ background: 'rgba(232,72,85,0.1)', border: '1px solid rgba(232,72,85,0.2)', color: C.coral, fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}>{a.iata}</span>
              <span><span style={{ fontWeight: 600 }}>{a.city}</span><span style={{ color: C.muted, marginLeft: '6px' }}>{a.country}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Booking = {
  id: string; carrierId: string; carrierName: string; carrierAvatar: string;
  carrierAvatarColor: string; carrierRating: number; from: string; to: string;
  date: string; airline: string; flightNo: string; itemType: string; itemDesc: string;
  weight: string; totalPrice: number; status: string; bookedOn: string;
};

type ModalType = 'report' | 'cancel' | 'dispute' | 'help' | 'review' | null;

export default function SenderDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'bookings' | 'history'>('send');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('U');
  const [userRole, setUserRole] = useState<'sender' | 'carrier'>('sender');
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: ModalType; bookingId: string | null }>({ type: null, bookingId: null });
  const [modalText, setModalText] = useState('');
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setNotLoggedIn(true); setLoading(false); return; }
        const { data: profile } = await supabase.from('profiles').select('name, avatar_color, role').eq('id', user.id).single();
        if (profile?.name) {
          setUserName(profile.name);
          setUserInitials(profile.name.trim().split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase());
        } else {
          setUserInitials((user.email || 'U').substring(0, 2).toUpperCase());
        }
        if (profile?.role) setUserRole(profile.role);
        const { data: rawBookings } = await supabase
          .from('bookings')
          .select(`id, item_type, item_desc, weight_kg, total_price, status, created_at, carrier_id, trip_id,
            trips(from_city, to_city, date, airline, flight_no),
            carrier:profiles!bookings_carrier_id_fkey(name, rating, avatar_color)`)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });
        if (rawBookings) {
          setBookings(rawBookings.map((b: any) => {
            const trip = b.trips as any; const carrier = b.carrier as any;
            const carrierName = carrier?.name || 'Carrier';
            return {
              id: b.id, carrierId: b.carrier_id || '', carrierName,
              carrierAvatar: carrierName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
              carrierAvatarColor: carrier?.avatar_color || '#E84855',
              carrierRating: carrier?.rating || 0,
              from: trip?.from_city || '—', to: trip?.to_city || '—',
              date: trip?.date ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
              airline: trip?.airline || '—', flightNo: trip?.flight_no || '—',
              itemType: b.item_type || '—', itemDesc: b.item_desc || '',
              weight: String(b.weight_kg || 0), totalPrice: b.total_price || 0,
              status: b.status || 'pending',
              bookedOn: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
          }));
        }
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitchRole = async () => {
    const newRole = userRole === 'sender' ? 'carrier' : 'sender';
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    router.push(newRole === 'carrier' ? '/dashboard/carrier' : '/dashboard/sender');
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);
    if (weight) params.set('weight', weight);
    router.push(`/search?${params.toString()}`);
  };

  const handleCancelBooking = async (bookingId: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    setModal({ type: null, bookingId: null });
  };

  const handleSubmitReport = async () => {
    if (!modalText.trim()) return;
    // In production: insert into a reports table
    setModalSubmitted(true);
    setTimeout(() => { setModal({ type: null, bookingId: null }); setModalText(''); setModalSubmitted(false); }, 2000);
  };

  if (!mounted || loading) return null;

  if (notLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Sign in to continue</h2>
          <p style={{ color: C.muted, fontSize: '14px', marginBottom: '24px' }}>Track your deliveries and manage your orders.</p>
          <button onClick={() => router.push('/auth/login')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
        </div>
      </div>
    );
  }

  const active = bookings.filter(b => b.status !== 'delivered' && b.status !== 'cancelled');
  const history = bookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');
  const firstName = (userName || 'there').split(' ')[0];

  const modalBooking = bookings.find(b => b.id === modal.bookingId);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .sd-tabs { display: flex; gap: 4px; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 12px; padding: 4px; margin-bottom: 24px; }
        .sd-tab { flex: 1; padding: 9px 12px; border-radius: 9px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-align: center; }
        .sd-search-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .sd-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid ${C.border}; }
        .sd-action-btn { padding: 7px 14px; background: transparent; border: 1px solid ${C.border}; border-radius: 8px; color: ${C.muted}; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .sd-action-btn:hover { border-color: ${C.borderHover}; color: ${C.text}; }
        .sd-action-btn.danger { border-color: rgba(232,72,85,0.3); color: ${C.coral}; }
        .sd-action-btn.danger:hover { background: rgba(232,72,85,0.08); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 20px; padding: 28px; width: 100%; max-width: 440px; }
        @media (max-width: 480px) {
          .sd-search-row { grid-template-columns: 1fr !important; }
          .sd-actions { gap: 6px; }
          .sd-action-btn { font-size: 11px; padding: 6px 10px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(v => !v)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: C.coral, border: `2px solid ${menuOpen ? C.text : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 150ms' }}>
            {userInitials}
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#162738', border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', minWidth: '200px', zIndex: 300 }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '2px' }}>{firstName}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>Sender account</div>
              </div>
              {(['send', 'bookings', 'history'] as const).map((t, i) => (
                <button key={t} onClick={() => { setActiveTab(t); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: activeTab === t ? C.coral : C.text, fontSize: '13px', fontWeight: activeTab === t ? '600' : '400', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 100ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {['Send a Package', `My Bookings (${active.length})`, 'History'][i]}
                </button>
              ))}
              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
              <button onClick={() => { router.push('/feed'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Feed</button>
              <button onClick={() => { handleSwitchRole(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.blue, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Switch to Carrier ✈️</button>
              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
              <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.coral, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Sign Out</button>
            </div>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', color: C.muted, marginBottom: '4px' }}>Welcome back</p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: '800', margin: '0', letterSpacing: '-0.5px' }}>{firstName}.</h1>
        </div>

        {/* Tabs */}
        <div className="sd-tabs">
          {([['send', '📦 Send'], ['bookings', `📋 Bookings${active.length > 0 ? ` (${active.length})` : ''}`], ['history', '🕐 History']] as const).map(([t, label]) => (
            <button key={t} className="sd-tab" onClick={() => setActiveTab(t as any)}
              style={{ background: activeTab === t ? C.coral : 'transparent', color: activeTab === t ? C.text : C.muted }}>
              {label}
            </button>
          ))}
        </div>

        {/* SEND TAB */}
        {activeTab === 'send' && (
          <div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: 'clamp(20px,3vw,32px)', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>Where are you sending to?</h2>
              <p style={{ fontSize: '14px', color: C.muted, marginBottom: '20px' }}>Search carriers going your way — real travelers, real routes.</p>
              <div className="sd-search-row">
                <div>
                  <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>From</label>
                  <AirportInput placeholder="City, country or IATA" value={from} onChange={setFrom} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>To</label>
                  <AirportInput placeholder="City, country or IATA" value={to} onChange={setTo} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>Travel date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>Weight (kg)</label>
                  <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 2"
                    style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={handleSearch} style={{ width: '100%', padding: '14px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' }}>
                Search Carriers
              </button>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {[
                { icon: '📋', label: 'Post a request', sub: 'Let carriers find you', action: () => router.push('/posts/new') },
                { icon: '📬', label: 'Browse feed', sub: 'See all open posts', action: () => router.push('/feed') },
                { icon: '✈️', label: 'Become a carrier', sub: 'Earn on your travels', action: handleSwitchRole },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; (e.currentTarget as HTMLElement).style.background = C.surfaceHover; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.surface; }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: C.text, marginBottom: '3px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: C.muted }}>{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {active.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
                <p style={{ color: C.muted, fontSize: '15px', margin: '0 0 6px' }}>No active bookings yet.</p>
                <p style={{ color: C.muted, fontSize: '13px', margin: '0 0 20px' }}>Find a carrier going your way and book your first delivery.</p>
                <button onClick={() => setActiveTab('send')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Find a Carrier</button>
              </div>
            ) : active.map(booking => {
              const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG['pending'];
              const currentStep = statusCfg.step;
              const isExpanded = expandedId === booking.id;
              return (
                <div key={booking.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s' }}>
                  {/* Card header */}
                  <div style={{ padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: booking.carrierAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>{booking.carrierAvatar}</div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '15px' }}>{booking.carrierName}</div>
                          <div style={{ fontSize: '12px', color: C.muted }}>{booking.airline} {booking.flightNo}</div>
                        </div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>{statusCfg.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.from}</span>
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/><path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.to}</span>
                      <span style={{ fontSize: '13px', color: C.muted }}>· {booking.date}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{booking.itemType}</span>
                        <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{booking.weight} kg</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontWeight: '800', fontSize: '16px' }}>${booking.totalPrice}</div>
                        <button onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                          style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', padding: '4px 8px', borderRadius: '6px' }}>
                          {isExpanded ? '▲ Less' : '▼ Track'}
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="sd-actions">
                      <button className="sd-action-btn" onClick={() => router.push(`/carrier/${booking.carrierId}`)}>View Carrier</button>
                      <button className="sd-action-btn" onClick={() => setModal({ type: 'help', bookingId: booking.id })}>🆘 Help</button>
                      <button className="sd-action-btn" onClick={() => setModal({ type: 'report', bookingId: booking.id })}>⚠️ Report Issue</button>
                      {booking.status === 'pending' && (
                        <button className="sd-action-btn danger" onClick={() => setModal({ type: 'cancel', bookingId: booking.id })}>Cancel</button>
                      )}
                      {booking.status === 'in_transit' && (
                        <button className="sd-action-btn" onClick={() => setModal({ type: 'dispute', bookingId: booking.id })}>🔴 Raise Dispute</button>
                      )}
                    </div>
                  </div>

                  {/* Inline tracking timeline */}
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px clamp(16px,3vw,24px)', background: 'rgba(0,0,0,0.15)' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery status</div>
                      {TRACKING_STEPS.map((step, i) => {
                        const isDone = currentStep > i;
                        const isActive = currentStep === i;
                        const isLast = i === TRACKING_STEPS.length - 1;
                        return (
                          <div key={step.key} style={{ display: 'flex', gap: '14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isDone ? C.green : isActive ? C.coral : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? '12px' : '14px', flexShrink: 0, boxShadow: isActive ? `0 0 0 4px ${C.accentGlow}` : 'none' }}>
                                {isDone ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> : step.icon}
                              </div>
                              {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '24px', background: isDone ? C.green : C.border, margin: '3px 0' }} />}
                            </div>
                            <div style={{ paddingBottom: isLast ? '0' : '20px', paddingTop: '3px' }}>
                              <div style={{ fontSize: '14px', fontWeight: isActive ? '700' : '500', color: isDone ? C.green : isActive ? C.text : C.muted, marginBottom: '2px' }}>
                                {step.label}
                                {isActive && <span style={{ marginLeft: '8px', padding: '2px 8px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.3)', borderRadius: '100px', fontSize: '11px', color: C.coral, fontWeight: '600' }}>Now</span>}
                              </div>
                              <div style={{ fontSize: '12px', color: C.muted }}>{step.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🕐</div>
                <p style={{ color: C.muted, fontSize: '15px', margin: '0 0 6px' }}>No completed deliveries yet.</p>
                <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Your delivery history will appear here.</p>
              </div>
            ) : history.map(booking => {
              const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG['cancelled'];
              const isDelivered = booking.status === 'delivered';
              return (
                <div key={booking.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: booking.carrierAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{booking.carrierAvatar}</div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{booking.carrierName}</div>
                        <div style={{ fontSize: '12px', color: C.muted }}>{booking.from} → {booking.to} · {booking.date}</div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>{statusCfg.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral }}>{booking.itemType}</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{booking.weight} kg</span>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '15px' }}>${booking.totalPrice}</div>
                  </div>
                  {isDelivered && (
                    <div className="sd-actions">
                      <button className="sd-action-btn" onClick={() => setModal({ type: 'review', bookingId: booking.id })}>⭐ Leave Review</button>
                      <button className="sd-action-btn danger" onClick={() => setModal({ type: 'dispute', bookingId: booking.id })}>Didn't receive it?</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal.type && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal({ type: null, bookingId: null }); }}>
          <div className="modal-box">
            {modal.type === 'help' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>🆘 Need help?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { icon: '📵', label: 'Carrier not responding', desc: 'No reply for 24+ hours' },
                    { icon: '✈️', label: 'Flight cancelled or delayed', desc: 'Carrier\'s flight was affected' },
                    { icon: '📦', label: 'Item not picked up', desc: 'Carrier never collected the item' },
                    { icon: '🛃', label: 'Customs issue', desc: 'Item held at customs' },
                    { icon: '💳', label: 'Payment question', desc: 'Issue with escrow or payment' },
                  ].map(issue => (
                    <button key={issue.label} onClick={() => { setModalText(issue.label); setModal({ type: 'report', bookingId: modal.bookingId }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHover)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                      <span style={{ fontSize: '20px' }}>{issue.icon}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{issue.label}</div>
                        <div style={{ fontSize: '12px', color: C.muted }}>{issue.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setModal({ type: null, bookingId: null })} style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
              </>
            )}

            {modal.type === 'report' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>⚠️ Report an issue</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>Describe what happened. Our team will review within 24 hours.</p>
                {modalSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Report submitted</div>
                    <div style={{ fontSize: '13px', color: C.muted }}>We'll follow up shortly.</div>
                  </div>
                ) : (
                  <>
                    <textarea value={modalText} onChange={e => setModalText(e.target.value)} placeholder="Describe the issue..." rows={4}
                      style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setModal({ type: null, bookingId: null })} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                      <button onClick={handleSubmitReport} style={{ flex: 2, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Submit Report</button>
                    </div>
                  </>
                )}
              </>
            )}

            {modal.type === 'cancel' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Cancel booking?</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '8px' }}>Cancelling before the carrier departs is free. Once in transit, the escrow policy applies.</p>
                <div style={{ background: C.goldSoft, border: `1px solid ${C.goldBorder}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: C.gold }}>
                  Booking for {modalBooking?.from} → {modalBooking?.to} · {modalBooking?.date}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setModal({ type: null, bookingId: null })} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Keep booking</button>
                  <button onClick={() => modal.bookingId && handleCancelBooking(modal.bookingId)} style={{ flex: 1, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Yes, cancel</button>
                </div>
              </>
            )}

            {modal.type === 'dispute' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>🔴 Raise a dispute</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>Escrow is held until this is resolved. Our team will mediate within 48 hours.</p>
                {modalSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Dispute opened</div>
                    <div style={{ fontSize: '13px', color: C.muted }}>Escrow is frozen. We'll contact both parties.</div>
                  </div>
                ) : (
                  <>
                    <textarea value={modalText} onChange={e => setModalText(e.target.value)} placeholder="What went wrong?" rows={4}
                      style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setModal({ type: null, bookingId: null })} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                      <button onClick={handleSubmitReport} style={{ flex: 2, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Open Dispute</button>
                    </div>
                  </>
                )}
              </>
            )}

            {modal.type === 'review' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>⭐ Leave a review</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>How was your experience with {modalBooking?.carrierName}?</p>
                {modalSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🙏</div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Review submitted</div>
                    <div style={{ fontSize: '13px', color: C.muted }}>Thank you for your feedback.</div>
                  </div>
                ) : (
                  <>
                    <textarea value={modalText} onChange={e => setModalText(e.target.value)} placeholder="Share your experience..." rows={4}
                      style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setModal({ type: null, bookingId: null })} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Skip</button>
                      <button onClick={handleSubmitReport} style={{ flex: 2, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Submit Review</button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
