'use client';
import React, { useState, useEffect, useRef } from 'react';
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
};

const MILESTONES = [
  { key: 'confirmed',  label: 'Confirmed',  icon: '✅', desc: 'You accepted the booking' },
  { key: 'in_transit', label: 'Departed',   icon: '✈️', desc: 'Tap when you board your flight' },
  { key: 'landed',     label: 'Landed',     icon: '🛬', desc: 'Tap when you arrive' },
  { key: 'delivered',  label: 'Delivered',  icon: '🎉', desc: 'Tap when item is handed over' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: 'Pending',    color: C.gold,  bg: C.goldSoft,  border: C.goldBorder },
  confirmed:  { label: 'Confirmed',  color: C.blue,  bg: C.blueSoft,  border: C.blueBorder },
  in_transit: { label: 'In Transit', color: C.coral, bg: C.accentGlow, border: 'rgba(232,72,85,0.3)' },
  landed:     { label: 'Landed',     color: C.gold,  bg: C.goldSoft,  border: C.goldBorder },
  delivered:  { label: 'Delivered',  color: C.green, bg: C.greenSoft, border: C.greenBorder },
  cancelled:  { label: 'Cancelled',  color: C.muted, bg: 'rgba(139,155,180,0.1)', border: 'rgba(139,155,180,0.2)' },
  active:     { label: 'Active',     color: C.blue,  bg: C.blueSoft,  border: C.blueBorder },
  completed:  { label: 'Completed',  color: C.green, bg: C.greenSoft, border: C.greenBorder },
};

type Request = {
  id: string; senderName: string; senderAvatar: string; senderAvatarColor: string;
  from: string; to: string; date: string; itemType: string; itemDesc: string;
  weight: string; totalPrice: number; status: string; requestedOn: string;
};
type TripBooking = { id: string; senderName: string; status: string; itemType: string; weight: string; totalPrice: number; };
type Trip = {
  id: string; from: string; to: string; date: string; airline: string; flightNo: string;
  capacity: string; status: string; bookings: TripBooking[];
};
type ModalType = 'report_delay' | 'flag_item' | 'no_show' | 'cancel_trip' | 'customs' | 'report_issue' | null;

export default function CarrierDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'trips'>('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('C');
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: ModalType; tripId: string | null; bookingId: string | null }>({ type: null, tripId: null, bookingId: null });
  const [modalText, setModalText] = useState('');
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setNotLoggedIn(true); setLoading(false); return; }
        const { data: profile } = await supabase.from('profiles').select('name, avatar_color').eq('id', user.id).single();
        if (profile?.name) {
          setUserName(profile.name);
          setUserInitials(profile.name.trim().split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase());
        } else { setUserInitials((user.email || 'CA').substring(0, 2).toUpperCase()); }

        const { data: rawTrips } = await supabase.from('trips').select('*').eq('carrier_id', user.id).order('created_at', { ascending: false });
        const { data: rawBookings } = await supabase.from('bookings').select(`
          id, item_type, item_desc, weight_kg, total_price, status, created_at, sender_name, trip_id,
          sender:profiles!bookings_sender_id_fkey(name, avatar_color), trips(from_city, to_city, date)
        `).eq('carrier_id', user.id).order('created_at', { ascending: false });

        if (rawTrips) {
          const tripsWithBookings: Trip[] = (rawTrips as any[]).map((t: any) => {
            const tripBookings = (rawBookings || []).filter((b: any) => b.trip_id === t.id).map((b: any) => ({
              id: b.id,
              senderName: (b.sender as any)?.name || b.sender_name || 'Sender',
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
              bookings: tripBookings,
            };
          });
          setTrips(tripsWithBookings);
        }

        if (rawBookings) {
          setRequests(rawBookings.filter((b: any) => !b.trip_id || rawTrips?.find((t: any) => t.id === b.trip_id)).map((b: any) => {
            const sender = b.sender as any; const trip = b.trips as any;
            const senderName = sender?.name || b.sender_name || 'Sender';
            return {
              id: b.id, senderName,
              senderAvatar: senderName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
              senderAvatarColor: sender?.avatar_color || '#3B82F6',
              from: trip?.from_city || '—', to: trip?.to_city || '—',
              date: trip?.date ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
              itemType: b.item_type || '—', itemDesc: b.item_desc || '',
              weight: String(b.weight_kg || 0), totalPrice: b.total_price || 0,
              status: b.status || 'pending',
              requestedOn: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

  const handleAccept = async (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id);
  };
  const handleDecline = async (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
  };

  const handleMilestone = async (bookingId: string, newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
    setTrips(prev => prev.map(t => ({ ...t, bookings: t.bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b) })));
    setRequests(prev => prev.map(r => r.id === bookingId ? { ...r, status: newStatus } : r));
  };

  const handleSwitchRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ role: 'sender' }).eq('id', user.id);
    router.push('/dashboard/sender');
  };
  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  const handleSubmitModal = async () => {
    if (!modalText.trim()) return;
    setModalSubmitted(true);
    setTimeout(() => { setModal({ type: null, tripId: null, bookingId: null }); setModalText(''); setModalSubmitted(false); }, 2000);
  };

  const getNextMilestone = (status: string) => {
    const order = ['confirmed', 'in_transit', 'landed', 'delivered'];
    const idx = order.indexOf(status);
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
  };
  const getMilestoneLabel = (key: string) => MILESTONES.find(m => m.key === key)?.label || key;

  if (!mounted || loading) return (<div style={{ minHeight: "100vh", background: "#0D1B2A" }} />);

  if (notLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Sign in to continue</h2>
          <p style={{ color: C.muted, fontSize: '14px', marginBottom: '24px' }}>Manage your trips and booking requests.</p>
          <button onClick={() => router.push('/auth/login')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeTrips = trips.filter(t => t.status === 'active');
  const firstName = (userName || 'Carrier').split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .cd-tabs { display: flex; gap: 4px; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 12px; padding: 4px; margin-bottom: 24px; }
        .cd-tab { flex: 1; padding: 9px 12px; border-radius: 9px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; text-align: center; position: relative; }
        .cd-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid ${C.border}; }
        .cd-action-btn { padding: 7px 14px; background: transparent; border: 1px solid ${C.border}; border-radius: 8px; color: ${C.muted}; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .cd-action-btn:hover { border-color: ${C.borderHover}; color: ${C.text}; }
        .cd-action-btn.warn { border-color: rgba(245,158,11,0.3); color: ${C.gold}; }
        .cd-action-btn.danger { border-color: rgba(232,72,85,0.3); color: ${C.coral}; }
        .milestone-btn { flex: 1; padding: 11px 8px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 20px; padding: 28px; width: 100%; max-width: 440px; }
        @media (max-width: 480px) {
          .cd-actions { gap: 6px; }
          .cd-action-btn { font-size: 11px; padding: 6px 10px; }
          .milestone-btn { font-size: 12px; padding: 10px 6px; }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => router.push('/trip/new')} style={{ padding: '8px clamp(12px,2vw,20px)', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>+ Post a Trip</button>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(v => !v)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#7C3AED', border: `2px solid ${menuOpen ? C.text : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 150ms' }}>
              {userInitials}
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#162738', border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', minWidth: '200px', zIndex: 300 }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: C.text, marginBottom: '2px' }}>{firstName}</div>
                  <div style={{ fontSize: '11px', color: C.muted }}>Carrier account</div>
                </div>
                {[['requests', `Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}`], ['trips', 'My Trips']].map(([t, label]) => (
                  <button key={t} onClick={() => { setActiveTab(t as any); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: activeTab === t ? C.coral : C.text, fontSize: '13px', fontWeight: activeTab === t ? '600' : '400', cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>{label}</button>
                ))}
                <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
                <button onClick={() => { router.push('/feed'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Feed</button>
                <button onClick={() => { handleSwitchRole(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.blue, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Switch to Sender 📦</button>
                <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
                <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.coral, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', color: C.muted, marginBottom: '4px' }}>Carrier dashboard</p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' }}>{firstName}.</h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: C.green, background: C.greenSoft, border: `1px solid ${C.greenBorder}`, padding: '3px 10px', borderRadius: '100px', fontWeight: '600' }}>✓ Verified</span>
            {activeTrips.length > 0 && <span style={{ fontSize: '12px', color: C.blue, background: C.blueSoft, border: `1px solid ${C.blueBorder}`, padding: '3px 10px', borderRadius: '100px', fontWeight: '600' }}>{activeTrips.length} active trip{activeTrips.length > 1 ? 's' : ''}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="cd-tabs">
          <button className="cd-tab" onClick={() => setActiveTab('requests')}
            style={{ background: activeTab === 'requests' ? C.coral : 'transparent', color: activeTab === 'requests' ? C.text : C.muted }}>
            📬 Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
          <button className="cd-tab" onClick={() => setActiveTab('trips')}
            style={{ background: activeTab === 'trips' ? C.coral : 'transparent', color: activeTab === 'trips' ? C.text : C.muted }}>
            My Trips{trips.length > 0 ? ` (${trips.length})` : ''}
          </button>
        </div>

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📬</div>
                <p style={{ color: C.muted, fontSize: '15px', margin: '0 0 6px' }}>No requests yet.</p>
                <p style={{ color: C.muted, fontSize: '13px', margin: '0 0 20px' }}>Post a trip and senders on your route will find you.</p>
                <button onClick={() => router.push('/trip/new')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Post a Trip</button>
              </div>
            ) : requests.map(req => {
              const isPending = req.status === 'pending';
              const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG['pending'];
              const nextMilestone = getNextMilestone(req.status);
              return (
                <div key={req.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: req.senderAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>{req.senderAvatar}</div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>{req.senderName}</div>
                        <div style={{ fontSize: '12px', color: C.muted }}>Requested {req.requestedOn}</div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>{statusCfg.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{req.from}</span>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/><path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{req.to}</span>
                    <span style={{ fontSize: '13px', color: C.muted }}>· {req.date}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{req.itemType}</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{req.weight} kg</span>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>${req.totalPrice}</div>
                  </div>

                  {/* Accept/Decline for pending */}
                  {isPending && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${C.border}` }}>
                      <button onClick={() => handleAccept(req.id)} style={{ flex: 1, padding: '10px', background: C.green, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Accept</button>
                      <button onClick={() => handleDecline(req.id)} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Decline</button>
                    </div>
                  )}

                  {/* Milestone tap buttons for active bookings */}
                  {!isPending && req.status !== 'cancelled' && req.status !== 'delivered' && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: '11px', color: C.muted, fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Update delivery status</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {nextMilestone && (
                          <button className="milestone-btn" onClick={() => handleMilestone(req.id, nextMilestone)}
                            style={{ background: C.coral, color: C.text, flex: 2 }}>
                            ✈️ Mark as {getMilestoneLabel(nextMilestone)}
                          </button>
                        )}
                        <button className="cd-action-btn warn" onClick={() => setModal({ type: 'report_delay', tripId: null, bookingId: req.id })}>Report Delay</button>
                        <button className="cd-action-btn" onClick={() => setModal({ type: 'flag_item', tripId: null, bookingId: req.id })}>Flag Item</button>
                        <button className="cd-action-btn" onClick={() => setModal({ type: 'customs', tripId: null, bookingId: req.id })}>🛃 Customs Hold</button>
                        <button className="cd-action-btn danger" onClick={() => setModal({ type: 'no_show', tripId: null, bookingId: req.id })}>Sender No-Show</button>
                      </div>
                    </div>
                  )}

                  {req.status === 'delivered' && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '8px' }}>
                      <button className="cd-action-btn" onClick={() => setModal({ type: 'report_issue', tripId: null, bookingId: req.id })}>Report Issue</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TRIPS TAB */}
        {activeTab === 'trips' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
                <p style={{ color: C.muted, fontSize: '15px', margin: '0 0 6px' }}>No trips posted yet.</p>
                <p style={{ color: C.muted, fontSize: '13px', margin: '0 0 20px' }}>Post your first trip and start earning from your travels.</p>
                <button onClick={() => router.push('/trip/new')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Post Your First Trip</button>
              </div>
            ) : trips.map(trip => {
              const statusCfg = STATUS_CONFIG[trip.status] || STATUS_CONFIG['active'];
              const isExpanded = expandedTrip === trip.id;
              const activeBkgs = trip.bookings.filter(b => b.status !== 'cancelled' && b.status !== 'delivered');
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
                      <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>{statusCfg.label}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{trip.capacity} capacity</span>
                      {trip.bookings.length > 0 && <span style={{ padding: '4px 10px', background: C.blueSoft, border: `1px solid ${C.blueBorder}`, borderRadius: '8px', fontSize: '12px', color: C.blue, fontWeight: '600' }}>{trip.bookings.length} booking{trip.bookings.length > 1 ? 's' : ''}</span>}
                    </div>

                    <div className="cd-actions">
                      {trip.bookings.length > 0 && (
                        <button className="cd-action-btn" onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}>
                          {isExpanded ? '▲ Hide bookings' : `▼ View bookings (${trip.bookings.length})`}
                        </button>
                      )}
                      {trip.status === 'active' && (
                        <>
                          <button className="cd-action-btn warn" onClick={() => setModal({ type: 'report_delay', tripId: trip.id, bookingId: null })}>Report Delay</button>
                          <button className="cd-action-btn danger" onClick={() => setModal({ type: 'cancel_trip', tripId: trip.id, bookingId: null })}>Cancel Trip</button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded bookings */}
                  {isExpanded && trip.bookings.length > 0 && (
                    <div style={{ borderTop: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.15)' }}>
                      {trip.bookings.map((bkg, i) => {
                        const bStatusCfg = STATUS_CONFIG[bkg.status] || STATUS_CONFIG['pending'];
                        const nextMs = getNextMilestone(bkg.status);
                        return (
                          <div key={bkg.id} style={{ padding: '16px clamp(16px,3vw,24px)', borderBottom: i < trip.bookings.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '700' }}>{bkg.senderName}</div>
                                <div style={{ fontSize: '12px', color: C.muted }}>{bkg.itemType} · {bkg.weight} kg · ${bkg.totalPrice}</div>
                              </div>
                              <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', color: bStatusCfg.color, background: bStatusCfg.bg, border: `1px solid ${bStatusCfg.border}` }}>{bStatusCfg.label}</span>
                            </div>
                            {bkg.status !== 'cancelled' && bkg.status !== 'delivered' && nextMs && (
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button className="milestone-btn" onClick={() => handleMilestone(bkg.id, nextMs)}
                                  style={{ background: C.coral, color: C.text, flex: 2, minWidth: '140px' }}>
                                  ✈️ Mark {getMilestoneLabel(nextMs)}
                                </button>
                                <button className="cd-action-btn warn" onClick={() => setModal({ type: 'flag_item', tripId: trip.id, bookingId: bkg.id })}>Flag</button>
                                <button className="cd-action-btn danger" onClick={() => setModal({ type: 'no_show', tripId: trip.id, bookingId: bkg.id })}>No-Show</button>
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
      </div>

      {/* MODALS */}
      {modal.type && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal({ type: null, tripId: null, bookingId: null }); }}>
          <div className="modal-box">
            {modal.type === 'report_delay' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>⏱️ Report a delay</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>Let senders know about the delay. They'll be notified automatically.</p>
              </>
            )}
            {modal.type === 'flag_item' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>⚠️ Flag item issue</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>Item doesn't match description, is overweight, or has a packaging issue.</p>
              </>
            )}
            {modal.type === 'customs' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>🛃 Customs hold</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>Item is being held at customs. We'll notify the sender and pause the escrow clock.</p>
              </>
            )}
            {modal.type === 'no_show' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>🚫 Sender no-show</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>The sender didn't show up for pickup. This will trigger a refund review.</p>
              </>
            )}
            {modal.type === 'cancel_trip' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Cancel this trip?</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>All active bookings will be cancelled and senders refunded. This cannot be undone.</p>
              </>
            )}
            {modal.type === 'report_issue' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Report an issue</h3>
                <p style={{ fontSize: '14px', color: C.muted, marginBottom: '16px' }}>Something went wrong after delivery. Our team will review within 24 hours.</p>
              </>
            )}

            {modalSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>Submitted</div>
                <div style={{ fontSize: '13px', color: C.muted }}>Our team has been notified.</div>
              </div>
            ) : (
              <>
                <textarea value={modalText} onChange={e => setModalText(e.target.value)} placeholder="Add details (optional)..." rows={3}
                  style={{ width: '100%', padding: '12px 14px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setModal({ type: null, tripId: null, bookingId: null }); setModalText(''); }} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                  <button onClick={handleSubmitModal} style={{ flex: 2, padding: '12px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
