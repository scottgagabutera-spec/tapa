'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', surfaceHover: '#1F3650',
  border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', coralDark: '#C73641',
  accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4',
  gold: '#F59E0B', goldSoft: 'rgba(245,158,11,0.12)', goldBorder: 'rgba(245,158,11,0.3)',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  blue: '#3B82F6', blueSoft: 'rgba(59,130,246,0.12)', blueBorder: 'rgba(59,130,246,0.3)',
  inputBg: '#0A1520',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: 'Pending',    color: C.gold,  bg: C.goldSoft,   border: C.goldBorder },
  confirmed:  { label: 'Confirmed',  color: C.blue,  bg: C.blueSoft,   border: C.blueBorder },
  in_transit: { label: 'In Transit', color: C.coral, bg: C.accentGlow, border: 'rgba(232,72,85,0.3)' },
  delivered:  { label: 'Delivered',  color: C.green, bg: C.greenSoft,  border: C.greenBorder },
  cancelled:  { label: 'Cancelled',  color: C.muted, bg: 'rgba(139,155,180,0.1)', border: 'rgba(139,155,180,0.2)' },
};

type Booking = {
  id: string; carrierId: string; carrierName: string; carrierAvatar: string;
  carrierAvatarColor: string; carrierRating: number; from: string; to: string;
  date: string; airline: string; flightNo: string; itemType: string; itemDesc: string;
  weight: string; totalPrice: number; status: string; bookedOn: string;
};

export default function SenderDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('U');
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setNotLoggedIn(true);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('name, avatar_color')
          .eq('id', user.id)
          .single();

        if (profile?.name) {
          setUserName(profile.name);
          setUserInitials(
            profile.name.trim().split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
          );
        } else {
          setUserInitials((user.email || 'U').substring(0, 2).toUpperCase());
        }

        const { data: rawBookings, error } = await supabase
          .from('bookings')
          .select(`
            id, item_type, item_desc, weight_kg, total_price, status, created_at,
            carrier_id, trip_id,
            trips(from_city, to_city, date, airline, flight_no),
            carrier:profiles!bookings_carrier_id_fkey(name, rating, avatar_color)
          `)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && rawBookings) {
          setBookings(rawBookings.map((b: any) => {
            const trip = b.trips as any;
            const carrier = b.carrier as any;
            const carrierName = carrier?.name || 'Carrier';
            return {
              id: b.id,
              carrierId: b.carrier_id || '',
              carrierName,
              carrierAvatar: carrierName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
              carrierAvatarColor: carrier?.avatar_color || '#E84855',
              carrierRating: carrier?.rating || 0,
              from: trip?.from_city || '—',
              to: trip?.to_city || '—',
              date: trip?.date
                ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—',
              airline: trip?.airline || '—',
              flightNo: trip?.flight_no || '—',
              itemType: b.item_type || '—',
              itemDesc: b.item_desc || '',
              weight: String(b.weight_kg || 0),
              totalPrice: b.total_price || 0,
              status: b.status || 'pending',
              bookedOn: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
          }));
        }
      } catch {
        // silent — empty state handles it
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!mounted || loading) return null;

  if (notLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Sign in to view your bookings</h2>
          <p style={{ color: C.muted, fontSize: '14px', marginBottom: '24px' }}>Track your deliveries and manage your orders.</p>
          <button onClick={() => router.push('/auth/login')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const active = bookings.filter(b => b.status !== 'delivered' && b.status !== 'cancelled');
  const history = bookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');
  const displayed = activeTab === 'active' ? active : history;
  const firstWord = (userName || 'there').split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .sender-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
        .booking-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .booking-actions { display: flex; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid ${C.border}; flex-wrap: wrap; }
        @media (max-width: 480px) {
          .sender-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .sender-stats > div:last-child { grid-column: 1 / -1; }
          .booking-actions button { flex: 1 1 auto; min-width: 80px; }
        }
      `}</style>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => router.push('/search')} style={{ padding: '8px clamp(12px,2vw,20px)', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Find a Carrier
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
            {userInitials}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: C.muted, marginBottom: '6px' }}>Welcome back</p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{firstWord}.</h1>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Sender account</p>
        </div>

        <div className="sender-stats">
          {[
            { label: 'Total Bookings', value: bookings.length },
            { label: 'Active', value: active.length, color: C.blue },
            { label: 'Delivered', value: history.filter(b => b.status === 'delivered').length, color: C.green },
          ].map(stat => (
            <div key={stat.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: '800', color: stat.color || C.text, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
          {(['active', 'history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px clamp(14px,3vw,20px)', borderRadius: '9px', border: 'none', background: activeTab === tab ? C.coral : 'transparent', color: activeTab === tab ? C.text : C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {tab === 'active' ? `Active (${active.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
            <p style={{ color: C.muted, fontSize: '15px', margin: '0 0 6px' }}>
              {activeTab === 'active' ? 'No active bookings yet.' : 'No completed deliveries yet.'}
            </p>
            <p style={{ color: C.muted, fontSize: '13px', margin: '0 0 20px' }}>
              Find a carrier going your way and send your first package.
            </p>
            <button onClick={() => router.push('/search')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Find a Carrier
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayed.map(booking => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG['pending'];
              const hovered = hoveredCard === booking.id;
              return (
                <div key={booking.id}
                  onMouseEnter={() => setHoveredCard(booking.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ background: hovered ? C.surfaceHover : C.surface, border: `1px solid ${hovered ? C.borderHover : C.border}`, borderRadius: '16px', padding: 'clamp(16px,3vw,20px) clamp(16px,3vw,24px)', transition: 'all 0.2s' }}>
                  <div className="booking-top-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: booking.carrierAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                        {booking.carrierAvatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>{booking.carrierName}</div>
                        <div style={{ fontSize: '13px', color: C.muted }}>
                          {booking.carrierRating > 0 ? `⭐ ${booking.carrierRating} · ` : ''}{booking.airline} {booking.flightNo}
                        </div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: status.color, background: status.bg, border: `1px solid ${status.border}` }}>
                      {status.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.from}</span>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                      <line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/>
                      <path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.to}</span>
                    <span style={{ fontSize: '13px', color: C.muted }}>· {booking.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', background: C.accentGlow, border: `1px solid rgba(232,72,85,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{booking.itemType}</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>{booking.weight} kg</span>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>${booking.totalPrice}</div>
                  </div>
                  {booking.status !== 'delivered' && booking.status !== 'cancelled' && (
                    <div className="booking-actions">
                      <button onClick={() => router.push(`/carrier/${booking.carrierId}`)} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '9px', color: C.text, fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>
                        View Carrier
                      </button>
                      <button onClick={() => router.push(`/tracking/${booking.id}`)} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '9px', color: C.text, fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Track
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '40px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: 'clamp(20px,3vw,28px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Need to send something?</div>
            <div style={{ fontSize: '14px', color: C.muted }}>Browse verified carriers going your way.</div>
          </div>
          <button onClick={() => router.push('/search')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            Find a Carrier
          </button>
        </div>
      </div>
    </div>
  );
}
