'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', coralDark: '#C73641', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4', inputBg: '#0A1520', green: '#2D9E6B',
  greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export default function MessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [tripId, setTripId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [myId, setMyId] = useState('');
  const [myName, setMyName] = useState('');
  const [otherName, setOtherName] = useState('Carrier');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(async (p) => {
      // id format: tripId__receiverId
      const [tId, rId] = p.id.split('__');
      setTripId(tId);
      setReceiverId(rId);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/auth/login?redirectTo=/messages/${p.id}`); return; }
      setMyId(user.id);

      // Get my name
      const { data: myProfile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
      if (myProfile) setMyName(myProfile.name?.split(' ')[0] || 'You');

      // Get other person's name
      const { data: otherProfile } = await supabase.from('profiles').select('name').eq('id', rId).single();
      if (otherProfile) setOtherName(otherProfile.name?.split(' ')[0] || 'Carrier');

      // Check booking status for this trip between these two users
      const { data: booking } = await supabase
        .from('bookings')
        .select('status')
        .eq('trip_id', tId)
        .or(`sender_id.eq.${user.id},carrier_id.eq.${user.id}`)
        .single();
      if (booking) setBookingStatus(booking.status);

      // Load messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('trip_id', tId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${rId}),and(sender_id.eq.${rId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (msgs) setMessages(msgs);
      setLoading(false);

      // Mark received messages as read
      await supabase.from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('trip_id', tId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      // Realtime subscription
      const channel = supabase.channel(`messages-${tId}-${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'messages',
          filter: `trip_id=eq.${tId}`,
        }, (payload) => {
          const msg = payload.new as Message;
          if (msg.sender_id === rId || msg.sender_id === user.id) {
            setMessages(prev => [...prev, msg]);
            if (msg.receiver_id === user.id) {
              supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', msg.id);
            }
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !myId || !receiverId || !tripId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput('');
    await supabase.from('messages').insert({
      trip_id: tripId,
      sender_id: myId,
      receiver_id: receiverId,
      content,
    });
    setSending(false);
  };

  const isClosed = bookingStatus === 'delivered' || bookingStatus === 'cancelled';
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });

  if (!mounted) return <div style={{ minHeight: '100vh', background: C.bg }} />;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input, textarea { outline: none; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '16px', padding: '0 clamp(16px,4vw,32px)' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: 'inherit', padding: '0', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
          {otherName[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: C.text }}>{otherName}</div>
          <div style={{ fontSize: '12px', color: C.muted }}>{isClosed ? 'Conversation closed' : bookingStatus === 'confirmed' ? 'Booking confirmed' : 'Pre-booking chat'}</div>
        </div>
        {bookingStatus !== 'confirmed' && !isClosed && (
          <button onClick={() => router.push(`/book/${tripId}`)} style={{ background: C.coral, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: '700', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(232,72,85,0.3)', flexShrink: 0 }}>
            Book Now
          </button>
        )}
      </nav>

      {/* Messages */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '80px 0 100px', maxWidth: '680px', width: '100%', margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: '24px', height: '24px', border: `2px solid ${C.border}`, borderTopColor: C.coral, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Start the conversation</div>
            <div style={{ fontSize: '14px', color: C.muted, lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>Ask about the trip, the pickup, or anything you need to know before booking.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 16px' }}>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === myId;
              const prevMsg = messages[i - 1];
              const showDate = !prevMsg || formatDate(msg.created_at) !== formatDate(prevMsg.created_at);
              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
                      <span style={{ fontSize: '12px', color: C.muted, background: C.surface, padding: '4px 12px', borderRadius: '100px', border: `1px solid ${C.border}` }}>{formatDate(msg.created_at)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '2px' }}>
                    <div style={{ maxWidth: '72%' }}>
                      <div style={{ background: isMe ? C.coral : C.surface, color: isMe ? '#fff' : C.text, padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '14px', lineHeight: 1.5, border: isMe ? 'none' : `1px solid ${C.border}`, wordBreak: 'break-word' }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '11px', color: C.muted, marginTop: '3px', textAlign: isMe ? 'right' : 'left', paddingLeft: isMe ? '0' : '4px', paddingRight: isMe ? '4px' : '0' }}>
                        {formatTime(msg.created_at)}{isMe && msg.read_at ? ' · Seen' : ''}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Input */}
      {isClosed ? (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(13,27,42,0.97)', borderTop: `1px solid ${C.border}`, padding: '16px clamp(16px,4vw,32px)', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: C.muted }}>This conversation is closed. The delivery is complete and the chat is kept as a record.</span>
        </div>
      ) : (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(13,27,42,0.97)', borderTop: `1px solid ${C.border}`, padding: '12px clamp(16px,4vw,32px)' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message..." rows={1}
              style={{ flex: 1, background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '12px 16px', color: C.text, fontSize: '14px', fontFamily: 'inherit', resize: 'none', lineHeight: 1.5, maxHeight: '120px', transition: 'border-color 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(232,72,85,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,72,85,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }} />
            <button onClick={handleSend} disabled={!input.trim() || sending}
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: input.trim() ? C.coral : C.border, border: 'none', color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms', boxShadow: input.trim() ? '0 4px 16px rgba(232,72,85,0.3)' : 'none' }}>
              {sending ? <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M46 2L26 22M46 2L30 46 26 22 2 16l44-14z"/></svg>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
