'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A',
  surface: '#1A2F45',
  surfaceHover: '#1F3650',
  border: '#243B55',
  borderHover: '#2E4A6A',
  coral: '#E84855',
  coralDark: '#C73641',
  accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA',
  muted: '#8B9BB4',
  gold: '#F59E0B',
  goldSoft: 'rgba(245,158,11,0.12)',
  goldBorder: 'rgba(245,158,11,0.3)',
  green: '#2D9E6B',
  greenSoft: 'rgba(45,158,107,0.12)',
  greenBorder: 'rgba(45,158,107,0.3)',
  blue: '#3B82F6',
  blueSoft: 'rgba(59,130,246,0.12)',
  blueBorder: 'rgba(59,130,246,0.3)',
  inputBg: '#0A1520',
};

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    carrierId: 'c1',
    carrierName: 'Maria Santos',
    carrierAvatar: 'MS',
    carrierAvatarColor: '#7C3AED',
    carrierRating: 4.9,
    from: 'Manila',
    to: 'Dubai',
    date: 'Jun 12, 2026',
    airline: 'Emirates',
    flightNo: 'EK 334',
    itemType: 'Electronics',
    itemDesc: 'Laptop and accessories',
    weight: '2',
    totalPrice: 16,
    status: 'confirmed',
    bookedOn: 'May 28, 2026',
  },
  {
    id: 'b2',
    carrierId: 'c4',
    carrierName: 'Carlos Mendez',
    carrierAvatar: 'CM',
    carrierAvatarColor: '#059669',
    carrierRating: 5.0,
    from: 'Sao Paulo',
    to: 'Miami',
    date: 'Jun 17, 2026',
    airline: 'LATAM Airlines',
    flightNo: 'LA 8084',
    itemType: 'Clothes',
    itemDesc: 'Seasonal clothing',
    weight: '3',
    totalPrice: 27,
    status: 'pending',
    bookedOn: 'May 30, 2026',
  },
  {
    id: 'b3',
    carrierId: 'c2',
    carrierName: 'James Okonkwo',
    carrierAvatar: 'JO',
    carrierAvatarColor: '#0891B2',
    carrierRating: 4.8,
    from: 'Lagos',
    to: 'London',
    date: 'May 20, 2026',
    airline: 'British Airways',
    flightNo: 'BA 076',
    itemType: 'Documents',
    itemDesc: 'Legal documents',
    weight: '0.5',
    totalPrice: 5,
    status: 'delivered',
    bookedOn: 'May 15, 2026',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',    color: C.gold,  bg: C.goldSoft,  border: C.goldBorder },
  confirmed: { label: 'Confirmed',  color: C.blue,  bg: C.blueSoft,  border: C.blueBorder },
  in_transit:{ label: 'In Transit', color: C.coral, bg: C.accentGlow,border: 'rgba(232,72,85,0.3)' },
  delivered: { label: 'Delivered',  color: C.green, bg: C.greenSoft, border: C.greenBorder },
  cancelled: { label: 'Cancelled',  color: C.muted, bg: 'rgba(139,155,180,0.1)', border: 'rgba(139,155,180,0.2)' },
};

export default function SenderDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const active = MOCK_BOOKINGS.filter(b => b.status !== 'delivered' && b.status !== 'cancelled');
  const history = MOCK_BOOKINGS.filter(b => b.status === 'delivered' || b.status === 'cancelled');
  const displayed = activeTab === 'active' ? active : history;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${C.accentGlow}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 20H4L12 3Z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/search')} style={{ padding: '8px 20px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
            Find a Carrier
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            SC
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: '64px', maxWidth: '900px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: C.muted, marginBottom: '6px' }}>Welcome back</p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Scott C.</h1>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Sender account · Manila, PH</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Total Bookings', value: MOCK_BOOKINGS.length },
            { label: 'Active', value: active.length, color: C.blue },
            { label: 'Delivered', value: history.length, color: C.green },
          ].map(stat => (
            <div key={stat.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: '800', color: stat.color || C.text, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
          {(['active', 'history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', background: activeTab === tab ? C.coral : 'transparent', color: activeTab === tab ? C.text : C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {tab === 'active' ? `Active (${active.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {/* Booking cards */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
            <p style={{ color: C.muted, fontSize: '15px', margin: 0 }}>No bookings here yet.</p>
            <button onClick={() => router.push('/search')} style={{ marginTop: '20px', padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Find a Carrier</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayed.map(booking => {
              const status = STATUS_CONFIG[booking.status];
              const hovered = hoveredCard === booking.id;
              return (
                <div key={booking.id}
                  onMouseEnter={() => setHoveredCard(booking.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ background: hovered ? C.surfaceHover : C.surface, border: `1px solid ${hovered ? C.borderHover : C.border}`, borderRadius: '16px', padding: '20px 24px', transition: 'all 0.2s', cursor: 'default' }}>

                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: booking.carrierAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                        {booking.carrierAvatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>{booking.carrierName}</div>
                        <div style={{ fontSize: '13px', color: C.muted }}>⭐ {booking.carrierRating} · {booking.airline} {booking.flightNo}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: status.color, background: status.bg, border: `1px solid ${status.border}` }}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.from}</span>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                      <line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/>
                      <path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.to}</span>
                    <span style={{ fontSize: '13px', color: C.muted, marginLeft: '4px' }}>· {booking.date}</span>
                  </div>

                  {/* Item + price row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', background: C.accentGlow, border: `1px solid rgba(232,72,85,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{booking.itemType}</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>{booking.weight} kg</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>Booked {booking.bookedOn}</span>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: C.text }}>${booking.totalPrice}</div>
                  </div>

                  {/* Actions */}
                  {booking.status !== 'delivered' && booking.status !== 'cancelled' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
                      <button onClick={() => router.push(`/carrier/${booking.carrierId}`)} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '9px', color: C.text, fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        View Carrier
                      </button>
                      <button style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '9px', color: C.muted, fontSize: '13px', fontWeight: '500', cursor: 'not-allowed', fontFamily: 'inherit', opacity: 0.6 }}>
                        Track
                      </button>
                      <button style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '9px', color: C.muted, fontSize: '13px', fontWeight: '500', cursor: 'not-allowed', fontFamily: 'inherit', opacity: 0.6 }}>
                        Message
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '40px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Need to send something?</div>
            <div style={{ fontSize: '14px', color: C.muted }}>Browse verified carriers going your way.</div>
          </div>
          <button onClick={() => router.push('/search')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 20px ${C.accentGlow}`, transition: 'all 0.2s' }}>
            Find a Carrier
          </button>
        </div>

      </div>
    </div>
  );
}
