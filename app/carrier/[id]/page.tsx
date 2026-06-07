'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', coralDark: '#C73641', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4',
  gold: '#F59E0B', green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  inputBg: '#0A1520',
};

type Carrier = {
  id: string; name: string; avatar: string; avatarColor: string;
  from: string; to: string; date: string; airline: string; flightNo: string;
  verified: boolean; idVerified: boolean; rating: number; trips: number;
  capacity: string; price: number; perUnit: string; responseTime: string;
  badge: string | null; tags: string[]; bio: string;
  reviews: { name: string; avatar: string; rating: number; text: string; date: string }[];
};

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 48 48"
          fill={i <= full ? C.gold : (i === full + 1 && half ? 'url(#half)' : C.border)}>
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

export default function CarrierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setMounted(true);
    params.then(async (p) => {
      const id = p.id;
      const isUUID = /^[0-9a-f-]{36}$/.test(id);

      if (!isUUID) {
        // Not a real UUID — show not found (old mock IDs no longer work)
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Try loading as a trip ID first (search results link to trips)
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*, profiles(id, name, rating, id_verified, avatar_color)')
          .eq('id', id)
          .single();

        if (!tripError && tripData) {
          const profile = tripData.profiles as any;
          const nameStr = profile?.name || 'Carrier';
          const initials = nameStr.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
          setTripId(tripData.id);
          setCarrier({
            id: profile?.id || id,
            name: nameStr,
            avatar: initials,
            avatarColor: profile?.avatar_color || '#E84855',
            from: tripData.from_city,
            to: tripData.to_city,
            date: new Date(tripData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            airline: tripData.airline || '—',
            flightNo: tripData.flight_no || '—',
            verified: true,
            idVerified: profile?.id_verified || false,
            rating: profile?.rating || 0,
            trips: profile?.total_trips || 1,
            capacity: tripData.capacity_kg + ' kg',
            price: tripData.price_per_kg,
            perUnit: 'kg',
            responseTime: '~1 hr',
            badge: profile?.rating >= 4.8 ? 'Top Carrier' : null,
            tags: tripData.item_types || [],
            bio: 'Verified carrier on Tapa.',
            reviews: [],
          });
          setLoading(false);
          return;
        }

        // Try as a carrier profile ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, trips(id, from_city, to_city, date, airline, flight_no, capacity_kg, price_per_kg, item_types, status)')
          .eq('id', id)
          .single();

        if (!profileError && profileData) {
          const activeTrip = (profileData.trips as any[])?.find((t: any) => t.status === 'active');
          const nameStr = profileData.name || 'Carrier';
          const initials = nameStr.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
          if (activeTrip) setTripId(activeTrip.id);
          setCarrier({
            id: profileData.id,
            name: nameStr,
            avatar: initials,
            avatarColor: profileData.avatar_color || '#E84855',
            from: activeTrip?.from_city || '—',
            to: activeTrip?.to_city || '—',
            date: activeTrip?.date ? new Date(activeTrip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
            airline: activeTrip?.airline || '—',
            flightNo: activeTrip?.flight_no || '—',
            verified: true,
            idVerified: profileData.id_verified || false,
            rating: profileData.rating || 0,
            trips: profileData.total_trips || 0,
            capacity: activeTrip ? activeTrip.capacity_kg + ' kg' : '—',
            price: activeTrip?.price_per_kg || 0,
            perUnit: 'kg',
            responseTime: '~1 hr',
            badge: profileData.rating >= 4.8 ? 'Top Carrier' : null,
            tags: activeTrip?.item_types || [],
            bio: 'Verified carrier on Tapa.',
            reviews: [],
          });
          setLoading(false);
          return;
        }

        setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  const badgeStyle = (type: 'top' | 'verified' | 'id'): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
    background: type === 'top' ? 'rgba(245,158,11,0.12)' : type === 'verified' ? C.greenSoft : 'rgba(99,102,241,0.12)',
    color: type === 'top' ? C.gold : type === 'verified' ? C.green : '#818CF8',
    border: `1px solid ${type === 'top' ? 'rgba(245,158,11,0.3)' : type === 'verified' ? C.greenBorder : 'rgba(99,102,241,0.3)'}`,
  });

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text },
    nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` },
    main: { maxWidth: '720px', margin: '0 auto', padding: '100px 24px 120px' },
    heroCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '32px', marginBottom: '16px' },
    sectionCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px', marginBottom: '16px' },
    sectionTitle: { fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '16px' },
    stickyBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(13,27,42,0.96)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', zIndex: 50 },
    bookBtn: { padding: '14px 32px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '16px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(232,72,85,0.35)' },
  };

  if (!mounted) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: C.muted, fontFamily: "'Inter', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (notFound || !carrier) {
    return (
      <div style={{ ...s.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: C.text }}>Carrier not found</div>
        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>This carrier may no longer be active.</p>
        <button style={{ ...s.bookBtn, padding: '12px 24px' }} onClick={() => router.push('/search')}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 520px) {
          .carrier-sticky-bar { flex-direction: column !important; align-items: stretch !important; }
          .carrier-sticky-bar button { width: 100% !important; }
        }
      `}</style>
      <nav style={s.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${C.accentGlow}` }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="20" r="6" fill="none" stroke="white" stroke-width="2.5"/><circle cx="12" cy="20" r="2.5" fill="white"/><line x1="12" y1="26" x2="12" y2="36" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="15" y1="33" x2="33" y2="18" stroke="white" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/><circle cx="36" cy="12" r="8" fill="white"/><circle cx="36" cy="12" r="3.5" fill="#E84855"/><line x1="36" y1="20" x2="36" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <button onClick={() => router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign in
        </button>
      </nav>

      <main style={s.main}>
        <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', padding: '0', fontFamily: 'inherit' }}>
          <svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to results
        </button>

        {/* Hero */}
        <div style={s.heroCard}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: carrier.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
              {carrier.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: C.text, marginBottom: '8px', letterSpacing: '-0.3px' }}>Verified Carrier</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {carrier.badge && (
                  <span style={badgeStyle('top')}>
                    <svg width="10" height="10" viewBox="0 0 48 48" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {carrier.badge}
                  </span>
                )}
                {carrier.verified && (
                  <span style={badgeStyle('verified')}>
                    <svg width="10" height="10" viewBox="0 0 48 48" fill="none" stroke={C.green} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Verified
                  </span>
                )}
                {carrier.idVerified && (
                  <span style={badgeStyle('id')}>
                    <svg width="10" height="10" viewBox="0 0 48 48" fill="none" stroke="#818CF8" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/></svg>
                    ID Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '16px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginBottom: '20px' }}>
            {[
              { label: 'Rating', value: carrier.rating > 0 ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Stars rating={carrier.rating} />
                  <span>{carrier.rating}</span>
                </span>
              ) : '—' },
              { label: 'Trips', value: carrier.trips || '—' },
              { label: 'Response', value: carrier.responseTime },
              { label: 'Available', value: carrier.capacity },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: C.text }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: C.muted }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '15px', color: C.muted, lineHeight: '1.7', margin: 0 }}>{carrier.bio}</p>
        </div>

        {/* Trip details */}
        {carrier.from !== '—' && (
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Trip Details</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>{carrier.from}</div>
                <div style={{ fontSize: '13px', color: C.muted }}>Origin</div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ flex: 1, height: '1px', background: C.border }} />
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round">
                  <path d="M21 16l-9-9-1 5-5 1 9 9 1-5 5-1z"/>
                </svg>
                <div style={{ flex: 1, height: '1px', background: C.border }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>{carrier.to}</div>
                <div style={{ fontSize: '13px', color: C.muted }}>Destination</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: C.inputBg, borderRadius: '12px', padding: '12px 16px' }}>
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round"><path d="M21 16l-9-9-1 5-5 1 9 9 1-5 5-1z"/></svg>
              <span style={{ fontSize: '13px', color: C.muted, fontStyle: 'italic' }}>Flight details revealed after booking</span>


              <span style={{ fontSize: '14px', color: C.muted }}>·</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: C.text }}>{carrier.date}</span>
            </div>
          </div>
        )}

        {/* Pricing */}
        {carrier.price > 0 && (
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Pricing & Capacity</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '28px', fontWeight: '800', color: C.coral, letterSpacing: '-0.5px' }}>${carrier.price}</span>
                <span style={{ fontSize: '14px', color: C.muted }}> / {carrier.perUnit}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{carrier.capacity}</div>
                <div style={{ fontSize: '13px', color: C.muted }}>Space available</div>
              </div>
            </div>
            {carrier.tags.length > 0 && (
              <>
                <div style={{ fontSize: '13px', color: C.muted, marginBottom: '10px' }}>Accepted item types</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {carrier.tags.map(tag => (
                    <span key={tag} style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '500', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.muted }}>{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Reviews */}
        {carrier.reviews.length > 0 && (
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Reviews ({carrier.reviews.length})</div>
            {carrier.reviews.map((review, i) => (
              <div key={i} style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: C.muted, flexShrink: 0 }}>
                    {review.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: C.text, marginBottom: '2px' }}>{review.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Stars rating={review.rating} />
                      <span style={{ fontSize: '12px', color: C.muted }}>{review.date}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: C.muted, lineHeight: '1.6', margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </div>
        )}

        {carrier.reviews.length === 0 && (
          <div style={{ ...s.sectionCard, textAlign: 'center', padding: '32px' }}>
            <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>No reviews yet — be the first to book this carrier.</p>
          </div>
        )}
      </main>

      <div className="carrier-sticky-bar" style={s.stickyBar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {carrier.price > 0 ? (
            <>
              <div style={{ fontSize: '20px', fontWeight: '800', color: C.coral }}>
                ${carrier.price}<span style={{ fontSize: '14px', fontWeight: '400', color: C.muted }}>/{carrier.perUnit}</span>
              </div>
              <div style={{ fontSize: '13px', color: C.muted }}>{carrier.capacity} available</div>
            </>
          ) : (
            <div style={{ fontSize: '14px', color: C.muted }}>Contact carrier for pricing</div>
          )}
        </div>
        <button style={{ width: '100%', padding: '13px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '14px', color: C.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '10px', transition: 'all 150ms' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.coral; e.currentTarget.style.color = C.coral; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
          onClick={() => { supabase.auth.getUser().then(({data:{user}}) => { if (!user) { window.location.href = `/auth/login?redirectTo=${window.location.pathname}`; } else { window.location.href = `/messages/${tripId || carrier.id}__${carrier.id}`; } }); }}>
          💬 Message Carrier
        </button>
        <button style={s.bookBtn}
          onClick={() => router.push(`/book/${tripId || carrier.id}`)}
          onMouseEnter={e => { e.currentTarget.style.background = C.coralDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Book Now
        </button>
      </div>
    </div>
  );
}

