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
};

const MOCK_REQUESTS = [
  {
    id: 'r1',
    senderName: 'Ana Reyes',
    senderAvatar: 'AR',
    senderAvatarColor: '#7C3AED',
    from: 'Manila',
    to: 'Dubai',
    date: 'Jun 12, 2026',
    itemType: 'Electronics',
    itemDesc: 'Laptop and accessories',
    weight: '2',
    totalPrice: 16,
    status: 'pending',
    requestedOn: 'May 30, 2026',
  },
  {
    id: 'r2',
    senderName: 'Ben Cruz',
    senderAvatar: 'BC',
    senderAvatarColor: '#0891B2',
    from: 'Manila',
    to: 'Dubai',
    date: 'Jun 12, 2026',
    itemType: 'Documents',
    itemDesc: 'Legal contracts',
    weight: '0.5',
    totalPrice: 4,
    status: 'pending',
    requestedOn: 'May 31, 2026',
  },
];

const MOCK_TRIPS = [
  {
    id: 't1',
    from: 'Manila',
    to: 'Dubai',
    date: 'Jun 12, 2026',
    airline: 'Emirates',
    flightNo: 'EK 334',
    capacity: '5 kg',
    booked: '2.5 kg',
    requests: 2,
    earnings: 20,
    status: 'active',
  },
  {
    id: 't2',
    from: 'Manila',
    to: 'Singapore',
    date: 'May 10, 2026',
    airline: 'Singapore Airlines',
    flightNo: 'SQ 921',
    capacity: '4 kg',
    booked: '4 kg',
    requests: 3,
    earnings: 36,
    status: 'completed',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',   color: C.gold,  bg: C.goldSoft,  border: C.goldBorder },
  active:    { label: 'Active',    color: C.blue,  bg: C.blueSoft,  border: C.blueBorder },
  completed: { label: 'Completed', color: C.green, bg: C.greenSoft, border: C.greenBorder },
};

export default function CarrierDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'trips'>('requests');
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeTrips = MOCK_TRIPS.filter(t => t.status === 'active');
  const totalEarnings = MOCK_TRIPS.reduce((sum, t) => sum + t.earnings, 0);

  function handleAccept(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  }
  function handleDecline(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  }

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
          <button onClick={() => router.push('/trip/new')} style={{ padding: '8px 20px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
            + Post a Trip
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            MS
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: C.muted, marginBottom: '6px' }}>Carrier dashboard</p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Maria Santos</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '13px', color: C.green, background: C.greenSoft, border: `1px solid ${C.greenBorder}`, padding: '3px 10px', borderRadius: '100px', fontWeight: '600' }}>✓ ID Verified</span>
            <span style={{ fontSize: '13px', color: C.gold, background: C.goldSoft, border: `1px solid ${C.goldBorder}`, padding: '3px 10px', borderRadius: '100px', fontWeight: '600' }}>⭐ Top Carrier</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Total Trips', value: MOCK_TRIPS.length },
            { label: 'Pending Requests', value: pendingCount, color: C.gold },
            { label: 'Total Earned', value: `$${totalEarnings}`, color: C.green },
          ].map(stat => (
            <div key={stat.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: '800', color: stat.color || C.text, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
          {(['requests', 'trips'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '9px', border: 'none', background: activeTab === tab ? C.coral : 'transparent', color: activeTab === tab ? C.text : C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', position: 'relative' }}>
              {tab === 'requests' ? `Requests` : 'My Trips'}
              {tab === 'requests' && pendingCount > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', background: C.gold, borderRadius: '50%', fontSize: '10px', fontWeight: '700', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Requests tab */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
                <p style={{ color: C.muted, fontSize: '15px', margin: 0 }}>No requests yet.</p>
              </div>
            ) : requests.map(req => {
              const hovered = hoveredCard === req.id;
              const isPending = req.status === 'pending';
              const statusColor = req.status === 'accepted' ? C.green : req.status === 'declined' ? C.muted : C.gold;
              const statusLabel = req.status === 'accepted' ? 'Accepted' : req.status === 'declined' ? 'Declined' : 'Pending';
              return (
                <div key={req.id}
                  onMouseEnter={() => setHoveredCard(req.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ background: hovered ? C.surfaceHover : C.surface, border: `1px solid ${hovered ? C.borderHover : C.border}`, borderRadius: '16px', padding: '20px 24px', transition: 'all 0.2s' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: req.senderAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                        {req.senderAvatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>{req.senderName}</div>
                        <div style={{ fontSize: '13px', color: C.muted }}>Requested {req.requestedOn}</div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: statusColor, background: 'rgba(0,0,0,0.2)', border: `1px solid ${statusColor}40` }}>
                      {statusLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{req.from}</span>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                      <line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/>
                      <path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{req.to}</span>
                    <span style={{ fontSize: '13px', color: C.muted }}>· {req.date}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: isPending ? '16px' : '0' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', background: C.accentGlow, border: `1px solid rgba(232,72,85,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{req.itemType}</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>{req.weight} kg</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>{req.itemDesc}</span>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>${req.totalPrice}</div>
                  </div>

                  {isPending && (
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
                      <button onClick={() => handleAccept(req.id)} style={{ flex: 1, padding: '10px', background: C.green, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        Accept
                      </button>
                      <button onClick={() => handleDecline(req.id)} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Trips tab */}
        {activeTab === 'trips' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_TRIPS.map(trip => {
              const status = STATUS_CONFIG[trip.status];
              const hovered = hoveredCard === trip.id;
              const capacityNum = parseFloat(trip.capacity);
              const bookedNum = parseFloat(trip.booked);
              const pct = Math.round((bookedNum / capacityNum) * 100);
              return (
                <div key={trip.id}
                  onMouseEnter={() => setHoveredCard(trip.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ background: hovered ? C.surfaceHover : C.surface, border: `1px solid ${hovered ? C.borderHover : C.border}`, borderRadius: '16px', padding: '20px 24px', transition: 'all 0.2s' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800' }}>{trip.from}</span>
                        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                          <line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/>
                          <path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: '16px', fontWeight: '800' }}>{trip.to}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: C.muted }}>{trip.airline} {trip.flightNo} · {trip.date}</div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: status.color, background: status.bg, border: `1px solid ${status.border}` }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Capacity bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.muted, marginBottom: '6px' }}>
                      <span>Capacity used</span>
                      <span>{trip.booked} / {trip.capacity} ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', background: C.border, borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? C.green : C.coral, borderRadius: '100px', transition: 'width 0.4s' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>{trip.requests} requests</span>
                    <span style={{ padding: '4px 10px', background: C.greenSoft, border: `1px solid ${C.greenBorder}`, borderRadius: '8px', fontSize: '12px', color: C.green, fontWeight: '600' }}>+${trip.earnings} earned</span>
                  </div>
                </div>
              );
            })}

            <button onClick={() => router.push('/trip/new')} style={{ padding: '14px', background: 'transparent', border: `1px dashed ${C.border}`, borderRadius: '16px', color: C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              + Post a new trip
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
