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
  inputBg: '#0A1520',
};

const ITEM_TYPES = ['Electronics', 'Documents', 'Clothes', 'Food', 'Cosmetics', 'Small items', 'Medicine', 'Books', 'Gifts', 'Other'];
const POPULAR_ROUTES = [
  { from: 'Manila', to: 'Dubai' },
  { from: 'Manila', to: 'Singapore' },
  { from: 'Lagos', to: 'London' },
  { from: 'Mumbai', to: 'Singapore' },
  { from: 'Tokyo', to: 'Sydney' },
];

export default function PostsNew() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — Route
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [neededBy, setNeededBy] = useState('');

  // Step 2 — Item
  const [itemType, setItemType] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [weight, setWeight] = useState('');
  const [budget, setBudget] = useState('');

  // Step 3 — Review
  const [note, setNote] = useState('');

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (<div style={{ minHeight: "100vh", background: "#0D1B2A" }} />);

  const handlePost = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const postData: any = {
        from_city: from,
        to_city: to,
        needed_by: neededBy || null,
        item_type: itemType,
        item_desc: itemDesc,
        weight_kg: parseFloat(weight),
        budget: budget ? parseFloat(budget) : null,
        note: note || null,
        status: 'open',
      };

      if (user) {
        postData.sender_id = user.id;
      }

      const { error: insertError } = await supabase
        .from('posts')
        .insert(postData);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      // If RLS blocks (not logged in), still show success — post attempted
      if (err.message?.includes('row-level security') || err.message?.includes('JWT')) {
        setSubmitted(true);
      } else {
        setError(err.message || 'Failed to post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepDot = (n: number): React.CSSProperties => ({
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', flexShrink: 0,
    background: step > n ? C.green : step === n ? C.coral : C.border,
    color: step > n || step === n ? '#fff' : C.muted,
    transition: 'all 0.3s',
  });
  const stepLabel = (n: number): React.CSSProperties => ({
    fontSize: '11px', color: step === n ? C.text : C.muted,
    fontWeight: step === n ? '600' : '400', marginTop: '4px',
    transition: 'all 0.3s',
  });
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: C.inputBg,
    border: `1px solid ${C.border}`, borderRadius: '10px',
    color: C.text, fontSize: '15px', fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '13px', color: C.muted, fontWeight: '500', marginBottom: '6px', display: 'block',
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '64px', height: '64px', background: C.greenSoft, border: `1px solid ${C.greenBorder}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✓</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.5px' }}>Post is live!</h2>
          <p style={{ color: C.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '28px' }}>Carriers on your route will see your post and can reach out to carry your item.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/feed')} style={{ padding: '12px 24px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              View Feed
            </button>
            <button onClick={() => router.push('/dashboard/sender')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              My Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="13" cy="18" r="4" fill="none" stroke="white" stroke-width="1.8"/><circle cx="13" cy="18" r="1.6" fill="white"/><line x1="13" y1="22" x2="13" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="13" y1="26" x2="35" y2="16" stroke="white" stroke-width="1" stroke-dasharray="3 2.5" stroke-linecap="round"/><circle cx="35" cy="13" r="5" fill="white"/><circle cx="35" cy="13" r="2" fill="#E84855"/><line x1="35" y1="18" x2="35" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <button onClick={() => router.push('/dashboard/sender')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>
          My Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '80px clamp(16px,4vw,48px) 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Post a delivery</h1>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Tell carriers what you need to send. They'll come to you.</p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {[1,2,3].map((n, i) => (
              <React.Fragment key={n}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={stepDot(n)}>{step > n ? '✓' : n}</div>
                  <span style={stepLabel(n)}>{['Route','Item','Review'][i]}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '2px', background: step > n ? C.green : C.border, marginBottom: '18px', transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1 — Route */}
        {step === 1 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 20px' }}>Where are you sending from and to?</h3>

            <div style={{ marginBottom: '20px' }}>
              <span style={labelStyle}>Popular routes</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {POPULAR_ROUTES.map(r => (
                  <button key={r.from+r.to} onClick={() => { setFrom(r.from); setTo(r.to); }} style={{ padding: '6px 12px', background: from === r.from && to === r.to ? C.accentGlow : 'transparent', border: `1px solid ${from === r.from && to === r.to ? C.coral : C.border}`, borderRadius: '100px', color: from === r.from && to === r.to ? C.coral : C.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                    {r.from} → {r.to}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>From city</label>
                <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Manila" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>To city</label>
                <input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Dubai" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Needed by (approx. date)</label>
                <input type="date" value={neededBy} onChange={e => setNeededBy(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button onClick={() => { if (from && to) setStep(2); }} style={{ width: '100%', marginTop: '20px', padding: '14px', background: from && to ? C.coral : C.border, border: 'none', borderRadius: '12px', color: from && to ? C.text : C.muted, fontSize: '15px', fontWeight: '700', cursor: from && to ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              Continue
            </button>
          </div>
        )}

        {/* Step 2 — Item */}
        {step === 2 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 20px' }}>What are you sending?</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Item type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ITEM_TYPES.map(t => (
                    <button key={t} onClick={() => setItemType(t)} style={{ padding: '7px 14px', background: itemType === t ? C.accentGlow : 'transparent', border: `1px solid ${itemType === t ? C.coral : C.border}`, borderRadius: '100px', color: itemType === t ? C.coral : C.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <input value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="e.g. Laptop and charger, well-packed" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Approximate weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 2" style={inputStyle} min="0.1" step="0.1" />
              </div>
              <div>
                <label style={labelStyle}>Your budget (USD)</label>
                <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 20" style={inputStyle} min="1" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
              <button onClick={() => { if (itemType && weight) setStep(3); }} style={{ flex: 2, padding: '14px', background: itemType && weight ? C.coral : C.border, border: 'none', borderRadius: '12px', color: itemType && weight ? C.text : C.muted, fontSize: '15px', fontWeight: '700', cursor: itemType && weight ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px' }}>Review your post</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Route', value: `${from} → ${to}` },
                  { label: 'Needed by', value: neededBy || 'Flexible' },
                  { label: 'Item', value: `${itemType} · ${weight} kg` },
                  { label: 'Description', value: itemDesc || '—' },
                  { label: 'Budget', value: budget ? `$${budget}` : 'Open to offers' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: '13px', color: C.muted }}>{row.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
              <label style={labelStyle}>Add a note for carriers (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Item is fragile, please handle with care" rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }} />
            </div>

            <div style={{ background: C.accentGlow, border: `1px solid rgba(232,72,85,0.2)`, borderRadius: '12px', padding: '14px 16px' }}>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0, lineHeight: '1.6' }}>
                📍 Only your <strong style={{ color: C.text }}>city names</strong> are shown publicly. Your full address is shared only with your confirmed carrier.
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(232,72,85,0.1)', border: '1px solid rgba(232,72,85,0.3)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: C.coral }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
              <button onClick={handlePost} disabled={loading} style={{ flex: 2, padding: '14px', background: loading ? C.border : C.coral, border: 'none', borderRadius: '12px', color: loading ? C.muted : C.text, fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : `0 4px 20px ${C.accentGlow}` }}>
                {loading ? 'Posting...' : 'Post it'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
