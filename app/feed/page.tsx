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
  green: '#2D9E6B',
  greenSoft: 'rgba(45,158,107,0.12)',
  greenBorder: 'rgba(45,158,107,0.3)',
  gold: '#F59E0B',
  goldSoft: 'rgba(245,158,11,0.12)',
  goldBorder: 'rgba(245,158,11,0.3)',
};

const MOCK_POSTS = [
  { id: 'p1', senderId: '', senderName: 'Ana Reyes', senderAvatar: 'AR', senderAvatarColor: '#7C3AED', from: 'Manila', to: 'Dubai', neededBy: 'Jun 15, 2026', itemType: 'Electronics', itemDesc: 'Laptop and charger, well packed', weight: '2', budget: 20, note: 'Item is fragile, please handle with care', postedOn: 'May 31, 2026', status: 'open' },
  { id: 'p2', senderId: '', senderName: 'Ben Cruz', senderAvatar: 'BC', senderAvatarColor: '#0891B2', from: 'Manila', to: 'Singapore', neededBy: 'Jun 10, 2026', itemType: 'Documents', itemDesc: 'Legal contracts in sealed envelope', weight: '0.3', budget: 10, note: '', postedOn: 'May 30, 2026', status: 'open' },
  { id: 'p3', senderId: '', senderName: 'Chloe Tan', senderAvatar: 'CT', senderAvatarColor: '#DC2626', from: 'Lagos', to: 'London', neededBy: 'Jun 20, 2026', itemType: 'Clothes', itemDesc: 'Traditional garments for family event', weight: '1.5', budget: 15, note: 'No wrinkles please!', postedOn: 'May 29, 2026', status: 'open' },
  { id: 'p4', senderId: '', senderName: 'David Kim', senderAvatar: 'DK', senderAvatarColor: '#059669', from: 'Tokyo', to: 'Sydney', neededBy: 'Jun 25, 2026', itemType: 'Gifts', itemDesc: 'Birthday gifts, small boxes', weight: '1', budget: 18, note: '', postedOn: 'May 28, 2026', status: 'open' },
  { id: 'p5', senderId: '', senderName: 'Eva Santos', senderAvatar: 'ES', senderAvatarColor: '#D97706', from: 'Mumbai', to: 'Singapore', neededBy: 'Flexible', itemType: 'Medicine', itemDesc: 'OTC medicine, all sealed', weight: '0.5', budget: 8, note: 'Can adjust budget if needed', postedOn: 'May 27, 2026', status: 'open' },
];

const ROUTES = ['All routes', 'Manila → Dubai', 'Manila → Singapore', 'Lagos → London', 'Tokyo → Sydney', 'Mumbai → Singapore'];

type Post = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderAvatarColor: string;
  from: string;
  to: string;
  neededBy: string;
  itemType: string;
  itemDesc: string;
  weight: string;
  budget: number;
  note: string;
  postedOn: string;
  status: string;
};

export default function FeedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<'carrier' | 'sender'>('carrier');
  const [routeFilter, setRouteFilter] = useState('All routes');
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          // Set role from profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          if (profile?.role === 'carrier') setRole('carrier');
          else setRole('sender');
        }

        // Fetch live posts
        const { data: rawPosts, error } = await supabase
          .from('posts')
          .select(`
            id,
            from_city,
            to_city,
            needed_by,
            item_type,
            item_desc,
            weight_kg,
            budget,
            note,
            status,
            created_at,
            sender_id,
            sender:profiles!posts_sender_id_fkey (
              name,
              avatar_color
            )
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (!error && rawPosts && rawPosts.length > 0) {
          const mapped: Post[] = rawPosts.map((p: any) => {
            const sender = p.sender as any;
            const senderName = sender?.name || 'Sender';
            const initials = senderName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
            const colors = ['#7C3AED', '#0891B2', '#DC2626', '#059669', '#D97706', '#E84855', '#3B82F6'];
            const colorIndex = senderName.charCodeAt(0) % colors.length;
            return {
              id: p.id,
              senderId: p.sender_id || '',
              senderName,
              senderAvatar: initials,
              senderAvatarColor: sender?.avatar_color || colors[colorIndex],
              from: p.from_city,
              to: p.to_city,
              neededBy: p.needed_by ? new Date(p.needed_by).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible',
              itemType: p.item_type || '—',
              itemDesc: p.item_desc || '',
              weight: String(p.weight_kg || 0),
              budget: p.budget || 0,
              note: p.note || '',
              postedOn: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: p.status,
            };
          });
          setPosts(mapped);
        } else {
          setPosts(MOCK_POSTS);
          setUsingMock(true);
        }
      } catch {
        setPosts(MOCK_POSTS);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClaim = async (postId: string) => {
    setClaimedIds(prev => [...prev, postId]);
    // Update post status in Supabase if real post (UUID)
    const isUUID = /^[0-9a-f-]{36}$/.test(postId);
    if (isUUID) {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('posts')
        .update({ status: 'claimed', claimed_by: user?.id || null })
        .eq('id', postId);
    }
  };

  if (!mounted || loading) return null;

  const filtered = posts.filter(p => {
    if (routeFilter !== 'All routes') {
      const [f, t] = routeFilter.split(' → ');
      if (p.from !== f || p.to !== t) return false;
    }
    return true;
  });

  // Build dynamic route filters from real posts
  const liveRoutes = ['All routes', ...Array.from(new Set(posts.map(p => `${p.from} → ${p.to}`)))];
  const routeOptions = usingMock ? ROUTES : liveRoutes;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '4px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '3px' }}>
            {(['carrier', 'sender'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: role === r ? C.coral : 'transparent', color: role === r ? C.text : C.muted, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {r === 'carrier' ? 'Carrier' : 'Sender'}
              </button>
            ))}
          </div>
          {role === 'sender' && (
            <button onClick={() => router.push('/posts/new')} style={{ padding: '8px 18px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              + Post
            </button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {role === 'carrier' ? 'Delivery requests' : 'Posts near your route'}
          </h1>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
            {role === 'carrier' ? 'Senders looking for carriers on your routes. Claim to connect.' : 'Browse posts or create your own delivery request.'}
          </p>
        </div>

        {/* Mock notice */}
        {usingMock && (
          <div style={{ background: C.goldSoft, border: `1px solid ${C.goldBorder}`, borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: C.gold }}>
            Showing sample posts — real sender posts will appear here once senders start posting.
          </div>
        )}

        {/* Route filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px', scrollbarWidth: 'none' }}>
          {routeOptions.map(r => (
            <button key={r} onClick={() => setRouteFilter(r)} style={{ padding: '7px 14px', background: routeFilter === r ? C.accentGlow : 'transparent', border: `1px solid ${routeFilter === r ? C.coral : C.border}`, borderRadius: '100px', color: routeFilter === r ? C.coral : C.muted, fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}>
              {r}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
              <p style={{ color: C.muted, margin: 0 }}>No posts on this route yet.</p>
            </div>
          ) : filtered.map(post => {
            const hovered = hoveredCard === post.id;
            const claimed = claimedIds.includes(post.id);
            const isOwn = post.senderId === currentUserId;
            const showAsOwn = isOwn && role === 'sender';
            return (
              <div key={post.id}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ background: hovered ? C.surfaceHover : C.surface, border: `1px solid ${showAsOwn ? C.coral : hovered ? C.borderHover : C.border}`, borderRadius: '16px', padding: '20px', transition: 'all 0.2s', position: 'relative' }}>

                {showAsOwn && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', padding: '3px 10px', background: C.accentGlow, border: `1px solid rgba(232,72,85,0.3)`, borderRadius: '100px', fontSize: '11px', color: C.coral, fontWeight: '600' }}>
                    Your post
                  </div>
                )}

                {/* Sender info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: post.senderAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                    {post.senderAvatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{showAsOwn ? 'You' : post.senderName}</div>
                    <div style={{ fontSize: '12px', color: C.muted }}>Posted {post.postedOn}</div>
                  </div>
                </div>

                {/* Route */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800' }}>{post.from}</span>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                    <line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/>
                    <path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: '16px', fontWeight: '800' }}>{post.to}</span>
                  <span style={{ fontSize: '13px', color: C.muted }}>· by {post.neededBy}</span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: post.itemDesc ? '10px' : '0' }}>
                  <span style={{ padding: '4px 10px', background: C.accentGlow, border: `1px solid rgba(232,72,85,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{post.itemType}</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: `1px solid rgba(139,155,180,0.2)`, borderRadius: '8px', fontSize: '12px', color: C.muted }}>{post.weight} kg</span>
                  {post.budget > 0 && <span style={{ padding: '4px 10px', background: C.goldSoft, border: `1px solid ${C.goldBorder}`, borderRadius: '8px', fontSize: '12px', color: C.gold, fontWeight: '600' }}>${post.budget} budget</span>}
                </div>

                {/* Description */}
                {post.itemDesc && <p style={{ fontSize: '13px', color: C.muted, margin: '10px 0 0', lineHeight: '1.5' }}>{post.itemDesc}{post.note ? ` — ${post.note}` : ''}</p>}

                {/* Claim — carrier only, not own post */}
                {role === 'carrier' && !isOwn && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
                    {claimed ? (
                      <div style={{ padding: '10px', background: C.greenSoft, border: `1px solid ${C.greenBorder}`, borderRadius: '10px', textAlign: 'center', fontSize: '14px', color: C.green, fontWeight: '600' }}>
                        ✓ Claimed — sender will be notified
                      </div>
                    ) : (
                      <button onClick={() => handleClaim(post.id)} style={{ width: '100%', padding: '11px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: `0 4px 16px ${C.accentGlow}` }}>
                        Claim this delivery
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sender CTA */}
        {role === 'sender' && (
          <div style={{ marginTop: '24px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>Need to send something?</div>
            <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 16px' }}>Post your delivery and let carriers come to you.</p>
            <button onClick={() => router.push('/posts/new')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              Post a delivery
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
