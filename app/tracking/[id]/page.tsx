'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

const STATUSES = [
  { key: 'pending',    label: 'Booked',      desc: 'Booking request sent to carrier',         icon: '📦' },
  { key: 'confirmed',  label: 'Confirmed',   desc: 'Carrier accepted your booking',           icon: '✅' },
  { key: 'in_transit', label: 'In Transit',  desc: 'Your item is on its way',                 icon: '✈️' },
  { key: 'delivered',  label: 'Delivered',   desc: 'Item delivered to recipient',             icon: '🎉' },
];

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  in_transit: 2,
  delivered: 3,
  cancelled: -1,
};

// Mock fallback booking for demo
const MOCK_BOOKING = {
  id: 'demo',
  ref: 'TPA-DEMO01',
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
  senderName: 'Scott C.',
};

type Booking = {
  id: string;
  ref: string;
  carrierName: string;
  carrierAvatar: string;
  carrierAvatarColor: string;
  carrierRating: number;
  from: string;
  to: string;
  date: string;
  airline: string;
  flightNo: string;
  itemType: string;
  itemDesc: string;
  weight: string;
  totalPrice: number;
  status: string;
  bookedOn: string;
  senderName: string;
};

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setMounted(true);
    params.then(async (p) => {
      const id = p.id;

      if (id === 'demo') {
        setBooking(MOCK_BOOKING);
        setLoading(false);
        return;
      }

      const isUUID = /^[0-9a-f-]{36}$/.test(id);
      if (!isUUID) {
        setBooking(MOCK_BOOKING);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            item_type,
            item_desc,
            weight_kg,
            total_price,
            status,
            created_at,
            sender_name,
            carrier_id,
            trips (
              from_city,
              to_city,
              date,
              airline,
              flight_no
            ),
            carrier:profiles!bookings_carrier_id_fkey (
              name,
              rating,
              avatar_color
            )
          `)
          .eq('id', id)
          .single();

        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const trip = data.trips as any;
        const carrier = data.carrier as any;
        const carrierName = carrier?.name || 'Carrier';
        const initials = carrierName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

        setBooking({
          id: data.id,
          ref: 'TPA-' + data.id.substring(0, 8).toUpperCase(),
          carrierName,
          carrierAvatar: initials,
          carrierAvatarColor: carrier?.avatar_color || '#E84855',
          carrierRating: carrier?.rating || 0,
          from: trip?.from_city || '—',
          to: trip?.to_city || '—',
          date: trip?.date ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
          airline: trip?.airline || '—',
          flightNo: trip?.flight_no || '—',
          itemType: data.item_type || '—',
          itemDesc: data.item_desc || '',
          weight: String(data.weight_kg || 0),
          totalPrice: data.total_price || 0,
          status: data.status || 'pending',
          bookedOn: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          senderName: data.sender_name || 'Sender',
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  if (!mounted || loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: C.muted, fontFamily: "'Inter', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <div style={{ fontSize: '18px', fontWeight: '700' }}>Booking not found</div>
        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>This tracking ID doesn't exist or has been removed.</p>
        <button onClick={() => router.push('/dashboard/sender')} style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          My Bookings
        </button>
      </div>
    );
  }

  const currentStep = STATUS_ORDER[booking.status] ?? 0;
  const isCancelled = booking.status === 'cancelled';

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${C.accentGlow}` }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="13" cy="18" r="4" fill="none" stroke="white" stroke-width="1.8"/><circle cx="13" cy="18" r="1.6" fill="white"/><line x1="13" y1="22" x2="13" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="13" y1="26" x2="35" y2="16" stroke="white" stroke-width="1" stroke-dasharray="3 2.5" stroke-linecap="round"/><circle cx="35" cy="13" r="5" fill="white"/><circle cx="35" cy="13" r="2" fill="#E84855"/><line x1="35" y1="18" x2="35" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <button onClick={() => router.push('/dashboard/sender')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>
          My Bookings
        </button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px', padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Track your delivery</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: C.muted }}>Ref:</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: C.coral, letterSpacing: '0.5px' }}>{booking.ref}</span>
          </div>
        </div>

        {/* Cancelled banner */}
        {isCancelled && (
          <div style={{ background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.3)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', fontSize: '14px', color: C.muted, textAlign: 'center', fontWeight: '600' }}>
            This booking was cancelled.
          </div>
        )}

        {/* Status timeline */}
        {!isCancelled && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {STATUSES.map((s, i) => {
                const isDone = currentStep > i;
                const isActive = currentStep === i;
                const isLast = i === STATUSES.length - 1;
                return (
                  <div key={s.key} style={{ display: 'flex', gap: '16px' }}>
                    {/* Left — dot + line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isDone ? C.green : isActive ? C.coral : C.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isDone ? '14px' : '16px',
                        fontWeight: '700',
                        color: isDone || isActive ? '#fff' : C.muted,
                        flexShrink: 0,
                        boxShadow: isActive ? `0 0 0 4px ${C.accentGlow}` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {isDone ? (
                          <svg width="14" height="14" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                        ) : (
                          s.icon
                        )}
                      </div>
                      {!isLast && (
                        <div style={{ width: '2px', flex: 1, minHeight: '32px', background: isDone ? C.green : C.border, margin: '4px 0', transition: 'background 0.3s' }} />
                      )}
                    </div>

                    {/* Right — label + desc */}
                    <div style={{ paddingBottom: isLast ? '0' : '28px', paddingTop: '4px' }}>
                      <div style={{ fontSize: '15px', fontWeight: isActive ? '700' : '600', color: isDone ? C.green : isActive ? C.text : C.muted, marginBottom: '3px', transition: 'color 0.3s' }}>
                        {s.label}
                        {isActive && (
                          <span style={{ marginLeft: '8px', padding: '2px 8px', background: C.accentGlow, border: `1px solid rgba(232,72,85,0.3)`, borderRadius: '100px', fontSize: '11px', color: C.coral, fontWeight: '600' }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '13px', color: C.muted }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Carrier card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your carrier</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: booking.carrierAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
              {booking.carrierAvatar}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>{booking.carrierName}</div>
              {booking.carrierRating > 0 && (
                <div style={{ fontSize: '13px', color: C.muted }}>⭐ {booking.carrierRating}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.from}</span>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/>
              <path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '15px', fontWeight: '700' }}>{booking.to}</span>
            <span style={{ fontSize: '13px', color: C.muted }}>· {booking.date}</span>
          </div>
          <div style={{ fontSize: '13px', color: C.muted }}>{booking.airline} {booking.flightNo}</div>
        </div>

        {/* Item details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Item type', value: booking.itemType },
              { label: 'Description', value: booking.itemDesc || '—' },
              { label: 'Weight', value: `${booking.weight} kg` },
              { label: 'Total paid', value: `$${booking.totalPrice}` },
              { label: 'Booked on', value: booking.bookedOn },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: '13px', color: C.muted }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => router.push('/dashboard/sender')} style={{ flex: 1, padding: '13px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 20px ${C.accentGlow}` }}>
            My Bookings
          </button>
          <button onClick={() => router.push('/search')} style={{ flex: 1, padding: '13px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
            Find a Carrier
          </button>
        </div>

      </div>
    </div>
  );
}
