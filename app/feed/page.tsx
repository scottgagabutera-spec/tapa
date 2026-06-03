'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', surfaceHover: '#1F3650',
  border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', coralDark: '#C73641', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  gold: '#F59E0B', goldSoft: 'rgba(245,158,11,0.12)', goldBorder: 'rgba(245,158,11,0.3)',
  blue: '#3B82F6', blueSoft: 'rgba(59,130,246,0.12)', blueBorder: 'rgba(59,130,246,0.3)',
};

type Post = {
  id: string; senderId: string; senderName: string; senderAvatar: string;
  senderAvatarColor: string; from: string; to: string; neededBy: string;
  itemType: string; itemDesc: string; weight: string; budget: number;
  note: string; postedOn: string; status: string;
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
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('U');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', user.id).single();
          if (profile?.name) {
            setUserName(profile.name);
            setUserInitials(profile.name.trim().split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase());
          } else {
            setUserInitials((user.email || 'U').substring(0, 2).toUpperCase());
          }
          if (profile?.role === 'carrier') setRole('carrier');
          else setRole('sender');
        }

        const { data: rawPosts, error } = await supabase
          .from('posts')
          .select(`id, from_city, to_city, needed_by, item_type, item_desc, weight_kg, budget, note, status, created_at, sender_id,
            sender:profiles!posts_sender_id_fkey(name, avatar_color)`)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (!error && rawPosts) {
          const colors = ['#7C3AED', '#0891B2', '#DC2626', '#059669', '#D97706', '#E84855', '#3B82F6'];
          setPosts(rawPosts.map((p: any) => {
            const sender = p.sender as any;
            const senderName = sender?.name || 'Sender';
            return {
              id: p.id, senderId: p.sender_id || '',
              senderName,
              senderAvatar: senderName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
              senderAvatarColor: sender?.avatar_color || colors[senderName.charCodeAt(0) % colors.length],
              from: p.from_city, to: p.to_city,
              neededBy: p.needed_by ? new Date(p.needed_by).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible',
              itemType: p.item_type || '—', itemDesc: p.item_desc || '',
              weight: String(p.weight_kg || 0), budget: p.budget || 0, note: p.note || '',
              postedOn: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: p.status,
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

  const handleClaim = async (postId: string) => {
    setClaimedIds(prev => [...prev, postId]);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('posts').update({ status: 'claimed', claimed_by: user.id }).eq('id', postId);
  };

  const handleSwitchRole = async () => {
    const newRole = role === 'sender' ? 'carrier' : 'sender';
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    setRole(newRole);
    router.push(newRole === 'carrier' ? '/dashboard/carrier' : '/dashboard/sender');
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (!mounted || loading) return (<div style={{ minHeight: "100vh", background: "#0D1B2A" }} />);

  const routeOptions = ['All routes', ...Array.from(new Set(posts.map(p => `${p.from} → ${p.to}`)))];
  const filtered = posts.filter(p => {
    if (routeFilter === 'All routes') return true;
    const [f, t] = routeFilter.split(' → ');
    return p.from === f && p.to === t;
  });

  const firstName = userName.split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .feed-role-toggle { display: flex; gap: 4px; background: ${C.surface}; border: 1px solid ${C.border}; border-radius: 10px; padding: 3px; }
        .feed-role-btn { padding: 6px 14px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .feed-filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .feed-filters::-webkit-scrollbar { display: none; }
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
          <div className="feed-role-toggle">
            {(['carrier', 'sender'] as const).map(r => (
              <button key={r} className="feed-role-btn" onClick={() => setRole(r)}
                style={{ background: role === r ? C.coral : 'transparent', color: role === r ? C.text : C.muted }}>
                {r === 'carrier' ? 'Carrier' : '📦 Sender'}
              </button>
            ))}
          </div>
          {currentUserId ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(v => !v)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.coral, border: `2px solid ${menuOpen ? C.text : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                {userInitials}
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#162738', border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', minWidth: '190px', zIndex: 300 }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: C.text }}>{firstName || 'Account'}</div>
                    <div style={{ fontSize: '11px', color: C.muted, textTransform: 'capitalize' }}>{role} account</div>
                  </div>
                  {[
                    { label: 'My Dashboard', action: () => router.push(role === 'carrier' ? '/dashboard/carrier' : '/dashboard/sender') },
                    { label: role === 'sender' ? 'Post a delivery' : 'Post a Trip', action: () => router.push(role === 'sender' ? '/posts/new' : '/trip/new') },
                  ].map(item => (
                    <button key={item.label} onClick={() => { item.action(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>{item.label}</button>
                  ))}
                  <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
                  <button onClick={() => { handleSwitchRole(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.blue, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    Switch to {role === 'carrier' ? 'Sender 📦' : 'Carrier ✈️'}
                  </button>
                  <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
                  <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', color: C.coral, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            role === 'sender' && (
              <button onClick={() => router.push('/posts/new')} style={{ padding: '8px 18px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>+ Post</button>
            )
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {role === 'carrier' ? 'Delivery requests' : 'Open deliveries'}
          </h1>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
            {role === 'carrier' ? 'Senders looking for a carrier on your routes.' : 'Browse posts or create your own delivery request.'}
          </p>
        </div>

        {/* Route filters */}
        {posts.length > 0 && (
          <div className="feed-filters" style={{ marginBottom: '20px' }}>
            {routeOptions.map(r => (
              <button key={r} onClick={() => setRouteFilter(r)}
                style={{ padding: '7px 14px', background: routeFilter === r ? C.accentGlow : 'transparent', border: `1px solid ${routeFilter === r ? C.coral : C.border}`, borderRadius: '100px', color: routeFilter === r ? C.coral : C.muted, fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}>
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{posts.length === 0 ? '📭' : '🔍'}</div>
              <p style={{ color: C.muted, fontSize: '15px', margin: '0 0 6px', fontWeight: '600' }}>
                {posts.length === 0 ? 'No posts yet.' : 'No posts on this route.'}
              </p>
              <p style={{ color: C.muted, fontSize: '13px', margin: '0 0 20px' }}>
                {posts.length === 0
                  ? role === 'sender' ? 'Be the first to post a delivery request.' : 'Post a trip and senders will find you.'
                  : 'Try a different route filter.'}
              </p>
              <button onClick={() => router.push(role === 'sender' ? '/posts/new' : '/trip/new')}
                style={{ padding: '10px 24px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                {role === 'sender' ? 'Post a delivery' : 'Post a Trip'}
              </button>
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
                  <div style={{ position: 'absolute', top: '14px', right: '14px', padding: '3px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.3)', borderRadius: '100px', fontSize: '11px', color: C.coral, fontWeight: '600' }}>Your post</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: post.senderAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{post.senderAvatar}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{showAsOwn ? 'You' : post.senderName}</div>
                    <div style={{ fontSize: '12px', color: C.muted }}>Posted {post.postedOn}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800' }}>{post.from}</span>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><line x1="0" y1="6" x2="15" y2="6" stroke={C.coral} strokeWidth="1.5"/><path d="M12 3l3 3-3 3" stroke={C.coral} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: '16px', fontWeight: '800' }}>{post.to}</span>
                  <span style={{ fontSize: '13px', color: C.muted }}>· by {post.neededBy}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: post.itemDesc ? '10px' : '0' }}>
                  <span style={{ padding: '4px 10px', background: C.accentGlow, border: '1px solid rgba(232,72,85,0.2)', borderRadius: '8px', fontSize: '12px', color: C.coral, fontWeight: '500' }}>{post.itemType}</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(139,155,180,0.1)', border: '1px solid rgba(139,155,180,0.2)', borderRadius: '8px', fontSize: '12px', color: C.muted }}>{post.weight} kg</span>
                  {post.budget > 0 && <span style={{ padding: '4px 10px', background: C.goldSoft, border: `1px solid ${C.goldBorder}`, borderRadius: '8px', fontSize: '12px', color: C.gold, fontWeight: '600' }}>${post.budget} budget</span>}
                </div>

                {post.itemDesc && <p style={{ fontSize: '13px', color: C.muted, margin: '10px 0 0', lineHeight: '1.5' }}>{post.itemDesc}{post.note ? ` — ${post.note}` : ''}</p>}

                {role === 'carrier' && !isOwn && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
                    {claimed ? (
                      <div style={{ padding: '10px', background: C.greenSoft, border: `1px solid ${C.greenBorder}`, borderRadius: '10px', textAlign: 'center', fontSize: '14px', color: C.green, fontWeight: '600' }}>
                        ✓ Claimed — sender will be notified
                      </div>
                    ) : (
                      <button onClick={() => handleClaim(post.id)}
                        style={{ width: '100%', padding: '11px', background: C.coral, border: 'none', borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        Claim this delivery
                      </button>
                    )}
                  </div>
                )}

                {showAsOwn && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '8px' }}>
                    <button onClick={() => router.push('/search')} style={{ flex: 1, padding: '8px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Find carrier instead</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {role === 'sender' && (
          <div style={{ marginTop: '24px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>Need to send something?</div>
            <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 16px' }}>Post your delivery and let carriers come to you.</p>
            <button onClick={() => router.push('/posts/new')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              Post a delivery
            </button>
          </div>
        )}
        {role === 'carrier' && !currentUserId && (
          <div style={{ marginTop: '24px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>Travelling soon?</div>
            <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 16px' }}>Post your trip and earn from your spare luggage space.</p>
            <button onClick={() => router.push('/auth/signup?role=carrier')} style={{ padding: '12px 28px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              Become a Carrier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
