'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A',
  surface: '#1A2F45',
  border: '#243B55',
  borderHover: '#2E4A6A',
  coral: '#E84855',
  coralDark: '#C73641',
  accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA',
  muted: '#8B9BB4',
  gold: '#F59E0B',
  green: '#2D9E6B',
  greenSoft: 'rgba(45,158,107,0.12)',
  greenBorder: 'rgba(45,158,107,0.3)',
  inputBg: '#0A1520',
};

const MOCK_CARRIERS = [
  {
    id: 'c1', name: 'Maria Santos', avatar: 'MS', avatarColor: '#7C3AED',
    from: 'Manila', to: 'Dubai', date: 'Jun 12, 2026', airline: 'Emirates', flightNo: 'EK 334',
    verified: true, idVerified: true, rating: 4.9, trips: 47, capacity: '5 kg', price: 8,
    currency: 'USD', perUnit: 'kg', responseTime: '~1 hr', badge: 'Top Carrier',
    tags: ['Electronics', 'Documents', 'Clothes'],
    bio: 'Frequent traveler between PH and UAE. Fast response, safe handling guaranteed. I have carried everything from documents to small electronics without any issues. Always on time, always communicative.',
    reviews: [
      { name: 'Raj P.', avatar: 'RP', rating: 5, text: 'Incredible experience. Maria kept me updated the whole way. My package arrived in perfect condition.', date: 'May 2026' },
      { name: 'Sandra K.', avatar: 'SK', rating: 5, text: 'Super fast response, very professional. Would book again without hesitation.', date: 'Apr 2026' },
      { name: 'Ahmed H.', avatar: 'AH', rating: 4, text: 'Good communication and safe delivery. Slight delay but she let me know in advance.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'c2', name: 'James Okonkwo', avatar: 'JO', avatarColor: '#0891B2',
    from: 'Lagos', to: 'London', date: 'Jun 14, 2026', airline: 'British Airways', flightNo: 'BA 076',
    verified: true, idVerified: true, rating: 4.8, trips: 31, capacity: '8 kg', price: 10,
    currency: 'USD', perUnit: 'kg', responseTime: '~2 hrs', badge: null,
    tags: ['Documents', 'Clothes', 'Food'],
    bio: 'Business traveler, Lagos-London route monthly. Professional and reliable. I understand the value of what you entrust me with and treat every item with care.',
    reviews: [
      { name: 'Chioma A.', avatar: 'CA', rating: 5, text: 'James was amazing. My documents arrived safe and on time. Very professional.', date: 'May 2026' },
      { name: 'Tom B.', avatar: 'TB', rating: 5, text: 'Reliable, fast, great communicator. Highly recommend.', date: 'Apr 2026' },
      { name: 'Fatima D.', avatar: 'FD', rating: 4, text: 'Good experience overall. Will use again.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'c3', name: 'Priya Nair', avatar: 'PN', avatarColor: '#DC2626',
    from: 'Mumbai', to: 'Singapore', date: 'Jun 15, 2026', airline: 'Singapore Airlines', flightNo: 'SQ 422',
    verified: true, idVerified: false, rating: 4.7, trips: 18, capacity: '3 kg', price: 7,
    currency: 'USD', perUnit: 'kg', responseTime: '~3 hrs', badge: null,
    tags: ['Documents', 'Small items'],
    bio: 'Student, travel frequently for work. Happy to carry small packages. I am careful with every item and always respond promptly to messages.',
    reviews: [
      { name: 'Meera S.', avatar: 'MS', rating: 5, text: 'Priya was wonderful. Very communicative and careful.', date: 'May 2026' },
      { name: 'Leon C.', avatar: 'LC', rating: 4, text: 'Good service, item arrived safely.', date: 'Apr 2026' },
      { name: 'Anita R.', avatar: 'AR', rating: 5, text: 'Would definitely book again. Very trustworthy.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'c4', name: 'Carlos Mendez', avatar: 'CM', avatarColor: '#059669',
    from: 'Sao Paulo', to: 'Miami', date: 'Jun 17, 2026', airline: 'LATAM Airlines', flightNo: 'LA 8084',
    verified: true, idVerified: true, rating: 5.0, trips: 62, capacity: '10 kg', price: 9,
    currency: 'USD', perUnit: 'kg', responseTime: '< 30 min', badge: 'Top Carrier',
    tags: ['Electronics', 'Clothes', 'Documents', 'Food'],
    bio: 'Top-rated carrier on Tapa. 62 trips, zero issues. Fast responses always. I take this seriously your package is my responsibility from pickup to delivery.',
    reviews: [
      { name: 'Isabella M.', avatar: 'IM', rating: 5, text: 'Carlos is the best! Zero issues, super fast. My go-to carrier.', date: 'May 2026' },
      { name: 'David L.', avatar: 'DL', rating: 5, text: 'Perfect experience from start to finish. 5 stars all day.', date: 'Apr 2026' },
      { name: 'Sofia R.', avatar: 'SR', rating: 5, text: 'Incredibly professional. Responded within minutes. Delivered perfectly.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'c5', name: 'Aiko Tanaka', avatar: 'AT', avatarColor: '#D97706',
    from: 'Tokyo', to: 'Sydney', date: 'Jun 20, 2026', airline: 'Qantas', flightNo: 'QF 26',
    verified: true, idVerified: true, rating: 4.6, trips: 9, capacity: '4 kg', price: 12,
    currency: 'USD', perUnit: 'kg', responseTime: '~4 hrs', badge: null,
    tags: ['Documents', 'Cosmetics', 'Clothes'],
    bio: 'Design professional traveling for work. Careful with all items. I travel Tokyo-Sydney for client projects and am happy to carry small packages along the way.',
    reviews: [
      { name: 'Yuki H.', avatar: 'YH', rating: 5, text: 'Aiko was incredibly careful and communicated well throughout.', date: 'May 2026' },
      { name: 'Ben W.', avatar: 'BW', rating: 4, text: 'Good experience. Package arrived safely.', date: 'Apr 2026' },
      { name: 'Mia T.', avatar: 'MT', rating: 5, text: 'Very professional and easy to work with.', date: 'Mar 2026' },
    ],
  },
  {
    id: 'c6', name: 'Kwame Asante', avatar: 'KA', avatarColor: '#7C3AED',
    from: 'Accra', to: 'New York', date: 'Jun 22, 2026', airline: 'Delta', flightNo: 'DL 460',
    verified: true, idVerified: true, rating: 4.9, trips: 24, capacity: '6 kg', price: 11,
    currency: 'USD', perUnit: 'kg', responseTime: '~1 hr', badge: null,
    tags: ['Electronics', 'Documents', 'Clothes'],
    bio: 'Tech consultant, Ghana-NYC quarterly. Trusted by 24 senders so far. I treat every delivery like it is my own property with full care and accountability.',
    reviews: [
      { name: 'Akosua B.', avatar: 'AB', rating: 5, text: 'Kwame was fantastic. Super responsive and my items arrived perfectly.', date: 'May 2026' },
      { name: 'Marcus J.', avatar: 'MJ', rating: 5, text: 'Professional and trustworthy. Would book again.', date: 'Apr 2026' },
      { name: 'Esi M.', avatar: 'EM', rating: 4, text: 'Good communication. Smooth delivery.', date: 'Mar 2026' },
    ],
  },
];

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
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
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(p => setId(p.id));
  }, [params]);

  const carrier = MOCK_CARRIERS.find(c => c.id === id);

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text },
    nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` },
    logoWrap: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' },
    logoIcon: { width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${C.accentGlow}` },
    logoText: { fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' },
    main: { maxWidth: '720px', margin: '0 auto', padding: '100px 24px 120px' },
    backBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', padding: '0', fontFamily: 'inherit', transition: 'color 0.15s ease' },
    heroCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '32px', marginBottom: '16px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.3s ease, transform 0.3s ease' },
    avatarRow: { display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' },
    avatar: { width: '72px', height: '72px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#fff', flexShrink: 0 },
    nameBlock: { flex: 1 },
    name: { fontSize: '22px', fontWeight: '700', color: C.text, marginBottom: '6px', letterSpacing: '-0.3px' },
    badgeRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
    statsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '16px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginBottom: '20px' },
    stat: { display: 'flex', flexDirection: 'column', gap: '2px' },
    statVal: { fontSize: '18px', fontWeight: '700', color: C.text },
    statLabel: { fontSize: '12px', color: C.muted },
    sectionCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px', marginBottom: '16px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s' },
    sectionTitle: { fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '16px' },
    routeRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
    city: { fontSize: '18px', fontWeight: '700', color: C.text },
    cityMuted: { fontSize: '13px', color: C.muted, marginTop: '2px' },
    arrowLine: { flex: 1, height: '1px', background: C.border },
    flightRow: { display: 'flex', alignItems: 'center', gap: '10px', background: C.inputBg, borderRadius: '12px', padding: '12px 16px' },
    flightText: { fontSize: '14px', color: C.muted },
    flightVal: { fontSize: '14px', fontWeight: '600', color: C.text },
    priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
    tagsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tag: { padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '500', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.muted },
    bio: { fontSize: '15px', color: C.muted, lineHeight: '1.7' },
    reviewCard: { background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' },
    reviewHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
    reviewAvatar: { width: '36px', height: '36px', borderRadius: '10px', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: C.muted, flexShrink: 0 },
    reviewText: { fontSize: '14px', color: C.muted, lineHeight: '1.6' },
    stickyBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(13,27,42,0.96)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', zIndex: 50 },
    bookBtn: { padding: '14px 32px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '16px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(232,72,85,0.35)' },
  };

  const badgeStyle = (type: 'top' | 'verified' | 'id'): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '600',
    background: type === 'top' ? 'rgba(245,158,11,0.12)' : type === 'verified' ? C.greenSoft : 'rgba(99,102,241,0.12)',
    color: type === 'top' ? C.gold : type === 'verified' ? C.green : '#818CF8',
    border: `1px solid ${type === 'top' ? 'rgba(245,158,11,0.3)' : type === 'verified' ? C.greenBorder : 'rgba(99,102,241,0.3)'}`,
  });

  if (!mounted || !id) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: C.muted, fontSize: '15px' }}>Loading...</div>
      </div>
    );
  }

  if (!carrier) {
    return (
      <div style={{ ...s.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: C.text }}>Carrier not found</div>
        <button style={{ ...s.bookBtn, padding: '12px 24px' }} onClick={() => router.push('/search')}>Back to Search</button>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logoWrap} onClick={() => router.push('/')}>
          <div style={s.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 20H4L12 3Z" fill="white"/>
            </svg>
          </div>
          <span style={s.logoText}>tapa</span>
        </div>
        <a href="/auth/login" style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
          Sign in
        </a>
      </nav>

      <main style={s.main}>
        <button style={s.backBtn} onClick={() => router.back()}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to results
        </button>

        <div style={s.heroCard}>
          <div style={s.avatarRow}>
            <div style={{ ...s.avatar, background: carrier.avatarColor }}>{carrier.avatar}</div>
            <div style={s.nameBlock}>
              <div style={s.name}>{carrier.name}</div>
              <div style={s.badgeRow}>
                {carrier.badge && (
                  <span style={badgeStyle('top')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {carrier.badge}
                  </span>
                )}
                {carrier.verified && (
                  <span style={badgeStyle('verified')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Verified
                  </span>
                )}
                {carrier.idVerified && (
                  <span style={badgeStyle('id')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/></svg>
                    ID Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={s.statsRow}>
            <div style={s.stat}>
              <div style={{ ...s.statVal, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stars rating={carrier.rating} />
                <span>{carrier.rating}</span>
              </div>
              <div style={s.statLabel}>Rating</div>
            </div>
            <div style={s.stat}>
              <div style={s.statVal}>{carrier.trips}</div>
              <div style={s.statLabel}>Trips</div>
            </div>
            <div style={s.stat}>
              <div style={s.statVal}>{carrier.responseTime}</div>
              <div style={s.statLabel}>Response</div>
            </div>
            <div style={s.stat}>
              <div style={s.statVal}>{carrier.capacity}</div>
              <div style={s.statLabel}>Available</div>
            </div>
          </div>

          <p style={s.bio}>{carrier.bio}</p>
        </div>

        <div style={s.sectionCard}>
          <div style={s.sectionTitle}>Trip Details</div>
          <div style={s.routeRow}>
            <div>
              <div style={s.city}>{carrier.from}</div>
              <div style={s.cityMuted}>Origin</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={s.arrowLine}/>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round">
                <path d="M21 16l-9-9-1 5-5 1 9 9 1-5 5-1z"/>
              </svg>
              <div style={s.arrowLine}/>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={s.city}>{carrier.to}</div>
              <div style={s.cityMuted}>Destination</div>
            </div>
          </div>
          <div style={s.flightRow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round">
              <path d="M21 16l-9-9-1 5-5 1 9 9 1-5 5-1z"/>
            </svg>
            <span style={s.flightText}>{carrier.airline}</span>
            <span style={{ ...s.flightText, margin: '0 4px' }}>·</span>
            <span style={s.flightVal}>{carrier.flightNo}</span>
            <span style={{ ...s.flightText, margin: '0 4px' }}>·</span>
            <span style={s.flightVal}>{carrier.date}</span>
          </div>
        </div>

        <div style={s.sectionCard}>
          <div style={s.sectionTitle}>Pricing & Capacity</div>
          <div style={s.priceRow}>
            <div>
              <span style={{ fontSize: '28px', fontWeight: '800', color: C.coral, letterSpacing: '-0.5px' }}>${carrier.price}</span>
              <span style={{ fontSize: '14px', color: C.muted, fontWeight: '400' }}> / {carrier.perUnit}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: C.text }}>{carrier.capacity}</div>
              <div style={{ fontSize: '13px', color: C.muted }}>Space available</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: C.muted, marginBottom: '16px' }}>Accepted item types</div>
          <div style={s.tagsRow}>
            {carrier.tags.map(tag => <span key={tag} style={s.tag}>{tag}</span>)}
          </div>
        </div>

        <div style={s.sectionCard}>
          <div style={s.sectionTitle}>Reviews ({carrier.reviews.length})</div>
          {carrier.reviews.map((review, i) => (
            <div key={i} style={s.reviewCard}>
              <div style={s.reviewHeader}>
                <div style={s.reviewAvatar}>{review.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: C.text, marginBottom: '2px' }}>{review.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stars rating={review.rating} />
                    <span style={{ fontSize: '12px', color: C.muted }}>{review.date}</span>
                  </div>
                </div>
              </div>
              <p style={s.reviewText}>{review.text}</p>
            </div>
          ))}
        </div>
      </main>

      <div style={s.stickyBar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: C.coral }}>
            ${carrier.price}<span style={{ fontSize: '14px', fontWeight: '400', color: C.muted }}>/{carrier.perUnit}</span>
          </div>
          <div style={{ fontSize: '13px', color: C.muted }}>{carrier.capacity} available · {carrier.responseTime} response</div>
        </div>
        <button style={s.bookBtn}
          onClick={() => router.push(`/book/${carrier.id}`)}
          onMouseEnter={e => { e.currentTarget.style.background = C.coralDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Book Now
        </button>
      </div>
    </div>
  );
}
