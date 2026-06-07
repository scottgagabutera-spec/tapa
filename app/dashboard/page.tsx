'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', surfaceHover: '#1F3650',
  border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4', mutedLight: '#A8B8CC', inputBg: '#0A1520',
  gold: '#F59E0B', goldSoft: 'rgba(245,158,11,0.12)', goldBorder: 'rgba(245,158,11,0.3)',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  blue: '#3B82F6', blueSoft: 'rgba(59,130,246,0.12)', blueBorder: 'rgba(59,130,246,0.3)',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; step: number }> = {
  pending:          { label: 'Pending',          color: C.gold,  bg: C.goldSoft,   border: C.goldBorder,  step: 0 },
  confirmed:        { label: 'Confirmed',        color: C.blue,  bg: C.blueSoft,   border: C.blueBorder,  step: 1 },
  item_received:    { label: 'Item Received',    color: C.blue,  bg: C.blueSoft,   border: C.blueBorder,  step: 2 },
  in_transit:       { label: 'In Transit',       color: C.coral, bg: C.accentGlow, border: 'rgba(232,72,85,0.3)', step: 3 },
  landed:           { label: 'Landed',           color: C.gold,  bg: C.goldSoft,   border: C.goldBorder,  step: 4 },
  customs_hold:     { label: 'Customs Hold',     color: C.gold,  bg: C.goldSoft,   border: C.goldBorder,  step: 4 },
  out_for_delivery: { label: 'Out for Delivery', color: C.coral, bg: C.accentGlow, border: 'rgba(232,72,85,0.3)', step: 5 },
  delivered:        { label: 'Delivered',        color: C.green, bg: C.greenSoft,  border: C.greenBorder, step: 6 },
  completed:        { label: 'Completed',        color: C.green, bg: C.greenSoft,  border: C.greenBorder, step: 6 },
  cancelled:        { label: 'Cancelled',        color: C.muted, bg: 'rgba(139,155,180,0.1)', border: 'rgba(139,155,180,0.2)', step: -1 },
  active:           { label: 'Active',           color: C.blue,  bg: C.blueSoft,   border: C.blueBorder,  step: 0 },
};

const TRACKING_STEPS = [
  { key: 'pending',          label: 'Booked',           desc: 'Waiting for carrier to confirm',  icon: '📦' },
  { key: 'confirmed',        label: 'Confirmed',        desc: 'Carrier accepted your booking',   icon: '✅' },
  { key: 'item_received',    label: 'Item Received',    desc: 'Carrier collected your item',     icon: '🤝' },
  { key: 'in_transit',       label: 'In Transit',       desc: 'Your item is on its way',         icon: '✈️' },
  { key: 'landed',           label: 'Landed',           desc: 'Carrier has landed',              icon: '🛬' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Carrier is heading to you',       icon: '🏍️' },
  { key: 'delivered',        label: 'Delivered',        desc: 'Item delivered successfully',     icon: '🎉' },
];

const MILESTONES = [
  { key: 'confirmed',        label: 'Confirmed',        nextLabel: 'Mark Item Received' },
  { key: 'item_received',    label: 'Item Received',    nextLabel: 'Mark Departed' },
  { key: 'in_transit',       label: 'Departed',         nextLabel: 'Mark Landed' },
  { key: 'landed',           label: 'Landed',           nextLabel: 'Mark Out for Delivery' },
  { key: 'out_for_delivery', label: 'Out for Delivery', nextLabel: 'Mark Delivered' },
  { key: 'delivered',        label: 'Delivered',        nextLabel: null },
];

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

type SendBooking = {
  id: string; carrierId: string; carrierName: string; carrierAvatar: string;
  carrierAvatarColor: string; from: string; to: string; date: string;
  airline: string; flightNo: string; itemType: string; weight: string;
  totalPrice: number; status: string; bookedOn: string;
};
type CarryRequest = {
  id: string; senderName: string; senderAvatar: string; senderAvatarColor: string;
  from: string; to: string; date: string; itemType: string;
  weight: string; totalPrice: number; status: string; requestedOn: string;
  itemDesc: string; itemValue: number | null; itemPhotos: string[]; pickupNotes: string;
};
type CarryTrip = {
  id: string; from: string; to: string; date: string; airline: string;
  flightNo: string; capacity: string; status: string;
  bookings: { id: string; senderName: string; status: string; itemType: string; weight: string; totalPrice: number }[];
};
type ModalType = 'report' | 'cancel' | 'dispute' | 'help' | 'review' | 'report_delay' | 'flag_item' | 'no_show' | 'cancel_trip' | 'customs' | 'confirm_delivery' | null;

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'carry'>('send');
  const [sendSubTab, setSendSubTab] = useState<'search' | 'bookings' | 'history'>('search');
  const [carrySubTab, setCarrySubTab] = useState<'requests' | 'trips'>('requests');

  // User
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('U');
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Send state
  const [sendFrom, setSendFrom] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendDate, setSendDate] = useState('');
  const [sendWeight, setSendWeight] = useState('');
  const [sendBookings, setSendBookings] = useState<SendBooking[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  // Carry state
  const [carryRequests, setCarryRequests] = useState<CarryRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [carryTrips, setCarryTrips] = useState<CarryTrip[]>([]);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  // Modal
  const [modal, setModal] = useState<{ type: ModalType; id: string | null }>({ type: null, id: null });
  const [modalText, setModalText] = useState('');
  const [modalDone, setModalDone] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setNotLoggedIn(true); setLoading(false); return; }
        setUserId(user.id);

        const { data: profile } = await supabase.from('profiles').select('name, avatar_color').eq('id', user.id).single();
        if (profile?.name) {
          setUserName(profile.name);
          setUserInitials(profile.name.trim().split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase());
        } else {
          setUserInitials((user.email || 'U').substring(0, 2).toUpperCase());
        }

        // Load send bookings (as sender)
        const { data: rawSendBookings } = await supabase
          .from('bookings')
          .select(`id, item_type, weight_kg, total_price, status, created_at, carrier_id, trip_id,
            trips(from_city, to_city, date, airline, flight_no),
            carrier:profiles!bookings_carrier_id_fkey(name, avatar_color)`)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });

        if (rawSendBookings) {
          setSendBookings(rawSendBookings.map((b: any) => {
            const trip = b.trips as any; const carrier = b.carrier as any;
            const carrierName = carrier?.name || 'Carrier';
            return {
              id: b.id, carrierId: b.carrier_id || '', carrierName,
              carrierAvatar: carrierName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
              carrierAvatarColor: carrier?.avatar_color || C.coral,
              from: trip?.from_city || '—', to: trip?.to_city || '—',
              date: trip?.date ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
              airline: trip?.airline || '—', flightNo: trip?.flight_no || '—',
              itemType: b.item_type || '—', weight: String(b.weight_kg || 0),
              totalPrice: b.total_price || 0, status: b.status || 'pending',
              bookedOn: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
          }));
        }

        // Load carry data (as carrier)
        const { data: rawTrips } = await supabase.from('trips').select('*').eq('carrier_id', user.id).order('created_at', { ascending: false });
        const { data: rawCarryBookings } = await supabase
          .from('bookings')
          .select(`id, item_type, item_desc, item_value, item_photos, pickup_notes, weight_kg, total_price, status, created_at, trip_id,
            sender:profiles!bookings_sender_id_fkey(name, avatar_color),
            trips(from_city, to_city, date)`)
          .eq('carrier_id', user.id)
          .order('created_at', { ascending: false });

        if (rawTrips) {
          setCarryTrips((rawTrips as any[]).map((t: any) => {
            const tripBkgs = (rawCarryBookings || []).filter((b: any) => b.trip_id === t.id).map((b: any) => ({
              id: b.id,
              senderName: (b.sender as any)?.name || 'Sender',
              status: b.status || 'pending',
              itemType: b.item_type || '—',
              weight: String(b.weight_kg || 0),
              totalPrice: b.total_price || 0,
            }));
            return {
              id: t.id, from: t.from_city, to: t.to_city,
              date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              airline: t.airline || '—', flightNo: t.flight_no || '—',
              capacity: t.capacity_kg + ' kg',
              status: t.status === 'active' ? 'active' : 'completed',
              bookings: tripBkgs,
            };
          }));
        }

        if (rawCarryBookings) {
          setCarryRequests((rawCarryBookings as any[]).map((b: any) => {
            const sender = b.sender as any; const trip = b.trips as any;
            const senderName = sender?.name || 'Sender';
            return {
              id: b.id, senderName,
              senderAvatar: senderName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
              senderAvatarColor: sender?.avatar_color || C.blue,
              from: trip?.from_city || '—', to: trip?.to_city || '—',
              date: trip?.date ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
              itemType: b.item_type || '—', itemDesc: b.item_desc || '', itemValue: b.item_value || null,
              itemPhotos: b.item_photos || [], pickupNotes: b.pickup_notes || '',
              weight: String(b.weight_kg || 0),
              totalPrice: b.total_price || 0, status: b.status || 'pending',
              requestedOn: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
          }));
        }
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  // Reactive auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setNotLoggedIn && setNotLoggedIn(true); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  const handleAccept = async (id: string) => {
    setActionLoading(id + '-accept');
    setCarryRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
    setActionLoading(null);
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id);
  };
  const handleDecline = async (id: string) => {
    setActionLoading(id + '-decline');
    setCarryRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    setActionLoading(null);
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
  };
  const handleMilestone = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId + '-milestone');
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
    setCarryTrips(prev => prev.map(t => ({ ...t, bookings: t.bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b) })));
    setCarryRequests(prev => prev.map(r => r.id === bookingId ? { ...r, status: newStatus } : r));
    setActionLoading(null);
  };
  const handleCancelBooking = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    setSendBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    closeModal();
  };
  const handleSubmitModal = async () => {
    if (!modalText.trim()) return;
    setModalDone(true);
    setTimeout(() => { closeModal(); }, 2000);
  };
  const closeModal = () => { setModal({ type: null, id: null }); setModalText(''); setModalDone(false); };

  const getNextMilestone = (status: string) => {
    const order = ['confirmed', 'item_received', 'in_transit', 'landed', 'out_for_delivery', 'delivered'];
    const idx = order.indexOf(status);
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
  };
  const getMilestoneLabel = (key: string) => ({ confirmed: 'Confirmed', item_received: 'Item Received', in_transit: 'Departed', landed: 'Landed', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' }[key] || key);

  if (!mounted) return <div style={{ minHeight: '100vh', background: C.bg }} />;

  if (notLoggedIn) return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <div style={{ width: '64px', height: '64px', background: C.accentGlow, border: `1px solid ${C.border}`, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Sign in to continue</h2>
        <p style={{ color: C.muted, fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>Send packages or earn as a carrier — all from one account.</p>
        <button onClick={() => router.push('/auth/login?redirectTo=/dashboard')} style={{ padding: '12px 32px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
      </div>
    </div>
  );

  const firstName = (userName || 'there').split(' ')[0];
  const activeSendBookings = sendBookings.filter(b => b.status !== 'delivered' && b.status !== 'cancelled');
  const historySendBookings = sendBookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');
  const pendingCount = carryRequests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dash-main-tabs { display: flex; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 14px; padding: 4px; gap: 4px; margin-bottom: 28px; }
        .dash-main-tab { flex: 1; padding: 11px 12px; border-radius: 11px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; text-align: center; }
        .dash-sub-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
        .dash-sub-tab { padding: 7px 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .action-btn { padding: 7px 14px; background: transparent; border: 1px solid ${C.border}; border-radius: 8px; color: ${C.muted}; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .action-btn:hover { border-color: ${C.borderHover}; color: ${C.text}; }
        .action-btn.warn { border-color: rgba(245,158,11,0.3); color: ${C.gold}; }
        .action-btn.danger { border-color: rgba(232,72,85,0.3); color: ${C.coral}; }
        .actions-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid ${C.border}; }
        .milestone-btn { flex: 1; padding: 11px 8px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; background: ${C.coral}; color: ${C.text}; transition: all 0.15s; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 20px; padding: 28px; width: 100%; max-width: 440px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 540px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .actions-row { gap: 6px; }
          .action-btn { font-size: 11px; padding: 6px 10px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="20" r="6" fill="none" stroke="white" stroke-width="2.5"/><circle cx="12" cy="20" r="2.5" fill="white"/><line x1="12" y1="26" x2="12" y2="36" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="15" y1="33" x2="33" y2="18" stroke="white" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/><circle cx="36" cy="12" r="8" fill="white"/><circle cx="36" cy="12" r="3.5" fill="#E84855"/><line x1="36" y1="20" x2="36" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
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
                <div style={{ fontSize: '14px', fontWeight: '700', color: C.text }}>{firstName}</div>
                <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>Tapa member</div>
              </div>
              {[
                { label: 'Send a Package', action: () => { setActiveTab('send'); setSendSubTab('search'); setMenuOpen(false); } },
                { label: 'My Bookings', action: () => { setActiveTab('send'); setSendSubTab('bookings'); setMenuOpen(false); } },
                { label: 'Carry & Earn', action: () => { setActiveTab('carry'); setCarrySubTab('requests'); setMenuOpen(false); } },
                { label: 'Post a Trip', action: () => { router.push('/trip/new'); setMenuOpen(false); } },
                { label: 'Feed', action: () => { router.push('/feed'); setMenuOpen(false); } },
                { label: 'Account Settings', action: () => { router.push('/account'); setMenuOpen(false); } },
                { label: 'Messages', action: () => { router.push('/dashboard'); setMenuOpen(false); } },
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>{item.label}</button>
              ))}
              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
              <button onClick={handleSignOut}
                style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.coral, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Sign Out</button>
            </div>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '13px', color: C.muted, marginBottom: '4px' }}>Welcome back</p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: '800', letterSpacing: '-0.5px' }}>{firstName}.</h1>
        </div>

        {/* Main tabs — Send / Carry */}
        <div className="dash-main-tabs">
          <button className="dash-main-tab" onClick={() => setActiveTab('send')}
            style={{ background: activeTab === 'send' ? C.coral : 'transparent', color: activeTab === 'send' ? '#fff' : C.muted }}>
            Send a Package
          </button>
          <button className="dash-main-tab" onClick={() => setActiveTab('carry')}
            style={{ background: activeTab === 'carry' ? C.coral : 'transparent', color: activeTab === 'carry' ? '#fff' : C.muted, position: 'relative' }}>
            Carry &amp; Earn
            {pendingCount > 0 && <span style={{ position: 'absolute', top: '6px', right: '10px', width: '18px', height: '18px', background: C.gold, borderRadius: '50%', fontSize: '11px', fontWeight: '700', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingCount}</span>}
          </button>
        </div>

        {/* ── SEND TAB ── */}
        {activeTab === 'send' && (
          <>
            {/* Sub tabs */}
            <div className="dash-sub-tabs">
              {[
                { key: 'search', label: 'Find a Carrier' },
                { key: 'bookings', label: `Bookings${activeSendBookings.length > 0 ? ` (${activeSendBookings.length})` : ''}` },
                { key: 'history', label: 'History' },
              ].map(t => (
                <button key={t.key} className="dash-sub-tab" onClick={() => setSendSubTab(t.key as any)}
                  style={{ background: sendSubTab === t.key ? `${C.coral}22` : 'transparent', color: sendSubTab === t.key ? C.coral : C.muted, border: `1px solid ${sendSubTab === t.key ? C.coral : 'transparent'}` }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search */}
            {sendSubTab === 'search' && (
              <div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: 'clamp(20px,3vw,32px)', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>Where are you sending to?</h2>
                  <p style={{ fontSize: '14px', color: C.muted, marginBottom: '20px' }}>Real travelers going your way — verified, rated, trusted.</p>
                  <div className="grid-2" style={{ marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>From</label>
                      <AirportInput placeholder="City, country or IATA" value={sendFrom} onChange={setSendFrom} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>To</label>
                      <AirportInput placeholder="City, country or IATA" value={sendTo} onChange={setSendTo} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>Date</label>
                      <input type="date" value={sendDate} onChange={e => setSendDate(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: sendDate ? C.text : C.muted, fontSize: '14px', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: C.muted, fontWeight: '600', display: 'block', marginBottom: '6px' }}>My item weight (kg)</label>
                      <input type="number" placeholder="e.g. 2" value={sendWeight} onChange={e => setSendWeight(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                  </div>
                  <button onClick={() => {
                    const params = new URLSearchParams();
                    if (sendFrom) params.set('from', sendFrom);
                    if (sendTo) params.set('to', sendTo);
                    if (sendDate) params.set('date', sendDate);
                    if (sendWeight) params.set('weight', sendWeight);
                    router.push(`/search?${params.toString()}`);
                  }} style={{ width: '100%', padding: '14px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Search Carriers
                  </button>
                </div>
                {/* Quick actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {[
                    { icon: <svg width="22" height="22" viewBox="0 0 48 48" fill="none" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: 'Post a request', sub: 'Let carriers find you', action: () => router.push('/posts/new') },
                    { icon: <svg width="22" height="22" viewBox="0 0 48 48" fill="none" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Browse feed', sub: 'See open requests', action: () => router.push('/feed') },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; (e.currentTarget as HTMLElement).style.background = C.surfaceHover; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.surface; }}>
                      <div style={{ marginBottom: '10px' }}>{item.icon}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: C.text, marginBottom: '3px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: C.muted }}>{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active bookings */}
            {sendSubTab === 'bookings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeSendBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={C.muted} strokeWidth="1" strokeLinecap="round" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <p style={{ color: C.muted, fontSize: '15px', marginBottom: '6px', fontWeight: '600' }}>No active bookings yet.</p>
                    <p style={{ color: C.muted, fontSize: '13px', marginBottom: '20px' }}>Find a carrier going your way and book your first delivery.</p>
                    <button onClick={() => setSendSubTab('search')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Find a Carrier</button>
                  </div>
                ) : activeSendBookings.map(b => {
                  const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG['pending'];
                  const isExpanded = expandedBooking === b.id;
                  const currentStep = sc.step;
                  return (
                    <div key={b.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{ padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: b.carrierAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>{b.carrierAvatar}</div>
                            <div>
                              {/* Privacy: first name only until confirmed */}
                              <div style={{ fontWeight: '700', fontSize: '15px' }}>{b.status === 'pending' ? b.carrierName.split(' ')[0] : b.carrierName}</div>
                              <div style={{ fontSize: '12px', color: C.muted }}>{b.airline} {b.flightNo}</div>
                            </div>
                          </div>
                          <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700' }}>{b.from}</span>
                          <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/><path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/></svg>
                          <span style={{ fontSize: '15px', fontWeight: '700' }}>{b.to}</span>
                          <span style={{ fontSize: '13px', color: C.muted }}>· {b.date}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral }}>{b.itemType}</span>
                            <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{b.weight} kg</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontWeight: '800', fontSize: '16px' }}>${b.totalPrice}</div>
                            <button onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                              style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', padding: '4px 8px', borderRadius: '6px' }}>
                              {isExpanded ? '▲ Less' : '▼ Track'}
                            </button>
                          </div>
                        </div>
                        <div className="actions-row">
                          <button className="action-btn" onClick={() => router.push(`/carrier/${b.carrierId}`)}>View Carrier</button>
                          <button className="action-btn" onClick={() => setModal({ type: 'help', id: b.id })}>Help</button>
                          <button className="action-btn" onClick={() => setModal({ type: 'report', id: b.id })}>Report Issue</button>
                          {b.status === 'pending' && <button className="action-btn danger" onClick={() => setModal({ type: 'cancel', id: b.id })}>Cancel</button>}
                          {b.status === 'in_transit' && <button className="action-btn danger" onClick={() => setModal({ type: 'dispute', id: b.id })}>Raise Dispute</button>}
                          {b.status === 'delivered' && <button onClick={() => setModal({ type: 'confirm_delivery', id: b.id })} style={{ padding: '7px 14px', background: C.green, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>✓ Confirm Received</button>}
                        </div>
                      </div>
                      {/* Inline tracking */}
                      {isExpanded && (
                        <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px clamp(16px,3vw,24px)', background: 'rgba(0,0,0,0.15)' }}>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: C.muted, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery status</div>
                          {TRACKING_STEPS.map((step, i) => {
                            const isDone = currentStep > i;
                            const isActive = currentStep === i;
                            const isLast = i === TRACKING_STEPS.length - 1;
                            return (
                              <div key={step.key} style={{ display: 'flex', gap: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isDone ? C.green : isActive ? C.coral : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? '0' : '14px', flexShrink: 0, boxShadow: isActive ? `0 0 0 4px ${C.accentGlow}` : 'none' }}>
                                    {isDone ? <svg width="12" height="12" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> : <span style={{ fontSize: '13px' }}>{step.icon}</span>}
                                  </div>
                                  {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '24px', background: isDone ? C.green : C.border, margin: '3px 0' }} />}
                                </div>
                                <div style={{ paddingBottom: isLast ? 0 : '20px', paddingTop: '3px' }}>
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

            {/* History */}
            {sendSubTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {historySendBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                    <p style={{ color: C.muted, fontSize: '15px', marginBottom: '6px', fontWeight: '600' }}>No completed deliveries yet.</p>
                    <p style={{ color: C.muted, fontSize: '13px' }}>Your delivery history will appear here.</p>
                  </div>
                ) : historySendBookings.map(b => {
                  const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG['cancelled'];
                  return (
                    <div key={b.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{b.carrierName}</div>
                          <div style={{ fontSize: '13px', color: C.muted }}>{b.from} → {b.to} · {b.date}</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral }}>{b.itemType}</span>
                          <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{b.weight} kg</span>
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '15px' }}>${b.totalPrice}</div>
                      </div>
                      {b.status === 'delivered' && (
                        <div className="actions-row">
                          <button className="action-btn" onClick={() => setModal({ type: 'review', id: b.id })}>Leave Review</button>
                          <button className="action-btn danger" onClick={() => setModal({ type: 'dispute', id: b.id })}>Didn't receive it?</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── CARRY TAB ── */}
        {activeTab === 'carry' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div className="dash-sub-tabs" style={{ marginBottom: 0 }}>
                {[
                  { key: 'requests', label: `Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
                  { key: 'trips', label: `My Trips${carryTrips.length > 0 ? ` (${carryTrips.length})` : ''}` },
                ].map(t => (
                  <button key={t.key} className="dash-sub-tab" onClick={() => setCarrySubTab(t.key as any)}
                    style={{ background: carrySubTab === t.key ? `${C.coral}22` : 'transparent', color: carrySubTab === t.key ? C.coral : C.muted, border: `1px solid ${carrySubTab === t.key ? C.coral : 'transparent'}` }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => router.push('/trip/new')} style={{ padding: '9px 18px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>+ Post a Trip</button>
            </div>

            {/* Requests */}
            {carrySubTab === 'requests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {carryRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={C.muted} strokeWidth="1" strokeLinecap="round" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <p style={{ color: C.muted, fontSize: '15px', marginBottom: '6px', fontWeight: '600' }}>No requests yet.</p>
                    <p style={{ color: C.muted, fontSize: '13px', marginBottom: '20px' }}>Post a trip and senders on your route will find you.</p>
                    <button onClick={() => router.push('/trip/new')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Post a Trip</button>
                  </div>
                ) : carryRequests.map(req => {
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG['pending'];
                  const isPending = req.status === 'pending';
                  const nextMs = getNextMilestone(req.status);
                  return (
                    <div key={req.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: req.senderAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>{req.senderAvatar}</div>
                          <div>
                            {/* Privacy: first name only until accepted */}
                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{isPending ? req.senderName.split(' ')[0] : req.senderName}</div>
                            <div style={{ fontSize: '12px', color: C.muted }}>Requested {req.requestedOn}</div>
                          </div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>{req.from}</span>
                        <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/><path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>{req.to}</span>
                        <span style={{ fontSize: '13px', color: C.muted }}>· {req.date}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral }}>{req.itemType}</span>
                          <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{req.weight} kg</span>
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '16px' }}>${req.totalPrice}</div>
                      </div>
                      {req.itemDesc && <div style={{ fontSize: '13px', color: C.muted, marginTop: '8px', lineHeight: 1.5 }}>{req.itemDesc}</div>}
                      {req.itemValue && <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>Approx. value: <span style={{ color: C.text, fontWeight: 600 }}>${req.itemValue}</span></div>}
                      {req.pickupNotes && <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>Notes: <span style={{ color: C.text }}>{req.pickupNotes}</span></div>}
                      {req.itemPhotos && req.itemPhotos.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {req.itemPhotos.map((url: string, i: number) => (
                            <img key={i} src={url} alt="item" style={{ width: '72px', height: '72px', borderRadius: '10px', objectFit: 'cover', border: `1px solid ${C.border}`, cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />
                          ))}
                        </div>
                      )}
                      {req.status === 'confirmed' && (
                        <button onClick={() => router.push(`/messages/${req.id}__${userId}`)} style={{ width: '100%', padding: '10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '10px', transition: 'all 150ms' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.coral; e.currentTarget.style.color = C.coral; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                          💬 Message Sender
                        </button>
                      )}
                      {isPending && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${C.border}` }}>
                          <button onClick={() => handleAccept(req.id)} disabled={!!actionLoading} style={{ flex: 1, padding: '10px', background: C.green, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: actionLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: actionLoading === req.id + '-accept' ? 0.7 : 1, transition: 'opacity 150ms' }}>{actionLoading === req.id + '-accept' ? 'Accepting…' : 'Accept'}</button>
                          <button onClick={() => handleDecline(req.id)} disabled={!!actionLoading} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: actionLoading === req.id + '-decline' ? 0.7 : 1, transition: 'opacity 150ms' }}>{actionLoading === req.id + '-decline' ? 'Declining…' : 'Decline'}</button>
                        </div>
                      )}
                      {!isPending && req.status !== 'cancelled' && req.status !== 'delivered' && (
                        <div className="actions-row">
                          {nextMs && <button className="milestone-btn" onClick={() => handleMilestone(req.id, nextMs)} disabled={!!actionLoading} style={{ minWidth: '140px', opacity: actionLoading === req.id + '-milestone' ? 0.7 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer', transition: 'opacity 150ms' }}>{actionLoading === req.id + '-milestone' ? 'Updating…' : `Mark ${getMilestoneLabel(nextMs)}`}</button>}
                          <button className="action-btn warn" onClick={() => setModal({ type: 'report_delay', id: req.id })}>Report Delay</button>
                          <button className="action-btn" onClick={() => setModal({ type: 'flag_item', id: req.id })}>Flag Item</button>
                          <button className="action-btn" onClick={() => setModal({ type: 'customs', id: req.id })}>Customs Hold</button>
                          <button className="action-btn danger" onClick={() => setModal({ type: 'no_show', id: req.id })}>No-Show</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trips */}
            {carrySubTab === 'trips' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {carryTrips.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={C.muted} strokeWidth="1" strokeLinecap="round" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <p style={{ color: C.muted, fontSize: '15px', marginBottom: '6px', fontWeight: '600' }}>No trips posted yet.</p>
                    <p style={{ color: C.muted, fontSize: '13px', marginBottom: '20px' }}>Post your first trip and start earning from your travels.</p>
                    <button onClick={() => router.push('/trip/new')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Post Your First Trip</button>
                  </div>
                ) : carryTrips.map(trip => {
                  const sc = STATUS_CONFIG[trip.status] || STATUS_CONFIG['active'];
                  const isExpanded = expandedTrip === trip.id;
                  return (
                    <div key={trip.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{ padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '16px', fontWeight: '800' }}>{trip.from}</span>
                              <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/><path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/></svg>
                              <span style={{ fontSize: '16px', fontWeight: '800' }}>{trip.to}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: C.muted }}>{trip.airline} {trip.flightNo} · {trip.date}</div>
                          </div>
                          <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{trip.capacity} capacity</span>
                          {trip.bookings.length > 0 && <span style={{ padding: '4px 10px', background: C.blueSoft, border: `1px solid ${C.blueBorder}`, borderRadius: '8px', fontSize: '12px', color: C.blue, fontWeight: '600' }}>{trip.bookings.length} booking{trip.bookings.length !== 1 ? 's' : ''}</span>}
                        </div>
                        <div className="actions-row">
                          {trip.bookings.length > 0 && (
                            <button className="action-btn" onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}>
                              {isExpanded ? 'Hide bookings' : `View bookings (${trip.bookings.length})`}
                            </button>
                          )}
                          {trip.status === 'active' && (
                            <>
                              <button className="action-btn warn" onClick={() => setModal({ type: 'report_delay', id: trip.id })}>Report Delay</button>
                              <button className="action-btn danger" onClick={() => setModal({ type: 'cancel_trip', id: trip.id })}>Cancel Trip</button>
                            </>
                          )}
                        </div>
                      </div>
                      {isExpanded && trip.bookings.length > 0 && (
                        <div style={{ borderTop: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.15)' }}>
                          {trip.bookings.map((bkg, i) => {
                            const bsc = STATUS_CONFIG[bkg.status] || STATUS_CONFIG['pending'];
                            const nextMs = getNextMilestone(bkg.status);
                            return (
                              <div key={bkg.id} style={{ padding: '16px clamp(16px,3vw,24px)', borderBottom: i < trip.bookings.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{bkg.senderName}</div>
                                    <div style={{ fontSize: '12px', color: C.muted }}>{bkg.itemType} · {bkg.weight} kg · ${bkg.totalPrice}</div>
                                  </div>
                                  <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', color: bsc.color, background: bsc.bg, border: `1px solid ${bsc.border}` }}>{bsc.label}</span>
                                </div>
                                {bkg.status !== 'cancelled' && bkg.status !== 'delivered' && nextMs && (
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button className="milestone-btn" onClick={() => handleMilestone(bkg.id, nextMs)} style={{ minWidth: '140px' }}>Mark {getMilestoneLabel(nextMs)}</button>
                                    <button className="action-btn warn" onClick={() => setModal({ type: 'flag_item', id: bkg.id })}>Flag</button>
                                    <button className="action-btn danger" onClick={() => setModal({ type: 'no_show', id: bkg.id })}>No-Show</button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={() => router.push('/trip/new')} style={{ padding: '14px', background: 'transparent', border: `1px dashed ${C.border}`, borderRadius: '16px', color: C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                  + Post a new trip
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {modal.type && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-box">
            {modal.type === 'help' && !modalDone && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Need help?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { icon: '📵', label: 'Carrier not responding', desc: 'No reply for 24+ hours' },
                    { icon: '✈️', label: 'Flight cancelled or delayed', desc: "Carrier's flight was affected" },
                    { icon: '📦', label: 'Item not picked up', desc: 'Carrier never collected the item' },
                    { icon: '🛃', label: 'Customs issue', desc: 'Item held at customs' },
                    { icon: '💳', label: 'Payment question', desc: 'Issue with escrow or payment' },
                  ].map(issue => (
                    <button key={issue.label} onClick={() => { setModalText(issue.label); setModal({ type: 'report', id: modal.id }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHover)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                      <span style={{ fontSize: '20px' }}>{issue.icon}</span>
                      <div><div style={{ fontSize: '14px', fontWeight: '600' }}>{issue.label}</div><div style={{ fontSize: '12px', color: C.muted }}>{issue.desc}</div></div>
                    </button>
                  ))}
                </div>
                <button onClick={closeModal} style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
              </>
            )}

            {['report', 'dispute', 'review', 'report_delay', 'flag_item', 'customs', 'no_show', 'cancel_trip', 'confirm_delivery'].includes(modal.type!) && (
              <>
                {!modalDone ? (
                  <>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
                      {{ report: 'Report an issue', cancel: 'Cancel booking', help: 'Help & Support', dispute: modal.type === 'dispute' && sendSubTab === 'history' ? "Didn't receive it?" : 'Raise a dispute', review: 'Leave a review', report_delay: 'Report a delay', flag_item: 'Flag item issue', customs: 'Customs hold', no_show: 'Sender no-show', cancel_trip: 'Cancel this trip?', confirm_delivery: 'Confirm delivery?' }[modal.type!]}
                    </h3>
                    <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>
                      {{ report: 'Describe what happened. Our team reviews within 24 hours.', cancel: 'This will cancel your booking. This action cannot be undone.', help: 'Contact our support team for assistance.', dispute: 'Escrow is held until this is resolved. Our team will mediate within 48 hours.', review: 'How was your experience?', report_delay: "Let senders know about the delay. They'll be notified automatically.", flag_item: "Item doesn't match description, is overweight, or has a packaging issue.", customs: "Item is held at customs. We'll notify the sender and pause the escrow clock.", no_show: "The sender didn't show up for pickup. This will trigger a refund review.", cancel_trip: 'All active bookings will be cancelled and senders refunded. This cannot be undone.', confirm_delivery: 'Confirm you received your item. This releases the escrow to the carrier.' }[modal.type!]}
                    </p>
                    <textarea value={modalText} onChange={e => setModalText(e.target.value)} placeholder="Add details..." rows={4}
                      style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={closeModal} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                      <button onClick={handleSubmitModal} style={{ flex: 2, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Submit</button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Submitted</div>
                    <div style={{ fontSize: '13px', color: C.muted }}>Our team has been notified.</div>
                  </div>
                )}
              </>
            )}

            {modal.type === 'cancel' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Cancel booking?</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '20px' }}>Cancelling before the carrier departs is free. Once in transit, the escrow policy applies.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={closeModal} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Keep booking</button>
                  <button onClick={() => modal.id && handleCancelBooking(modal.id)} style={{ flex: 1, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Yes, cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
