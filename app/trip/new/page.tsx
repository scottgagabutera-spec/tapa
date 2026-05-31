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
  green: '#2D9E6B',
  greenSoft: 'rgba(45,158,107,0.12)',
  greenBorder: 'rgba(45,158,107,0.3)',
  inputBg: '#0A1520',
};

const ITEM_TYPES = ['Electronics', 'Documents', 'Clothes', 'Food', 'Cosmetics', 'Small items', 'Medicine', 'Books', 'Gifts', 'Other'];

const AIRLINES = [
  'Emirates', 'British Airways', 'Singapore Airlines', 'LATAM Airlines', 'Qantas', 'Delta',
  'Lufthansa', 'Air France', 'KLM', 'Turkish Airlines', 'Qatar Airways', 'Etihad Airways',
  'Philippine Airlines', 'Cebu Pacific', 'Kenya Airways', 'Ethiopian Airlines', 'Other',
];

export default function TripNewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Route
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');

  // Step 2 — Capacity & pricing
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [acceptedTypes, setAcceptedTypes] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const toggleType = (t: string) => {
    setAcceptedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const step1Valid = from && to && date && airline && flightNo;
  const step2Valid = capacity && price && parseFloat(price) > 0 && acceptedTypes.length > 0;

  const stepDot = (n: number): React.CSSProperties => ({
    width: '32px', height: '32px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', flexShrink: 0,
    background: step > n ? C.green : step === n ? C.coral : C.border,
    color: step >= n ? '#fff' : C.muted,
    transition: 'all 0.3s ease',
  });

  const stepLine = (n: number): React.CSSProperties => ({
    flex: 1, height: '2px',
    background: step > n ? C.green : C.border,
    transition: 'background 0.3s ease',
  });

  const stepLabel = (n: number): React.CSSProperties => ({
    fontSize: '11px', fontWeight: '600', marginTop: '6px',
    color: step === n ? C.text : C.muted,
    transition: 'color 0.3s ease',
  });

  const typeChip = (selected: boolean): React.CSSProperties => ({
    padding: '8px 14px', borderRadius: '100px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer',
    background: selected ? C.coral : 'rgba(255,255,255,0.04)',
    color: selected ? '#fff' : C.muted,
    border: `1px solid ${selected ? C.coral : C.border}`,
    transition: 'all 0.15s ease',
  });

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text },
    nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` },
    logoWrap: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' },
    logoIcon: { width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${C.accentGlow}` },
    logoText: { fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' },
    main: { maxWidth: '680px', margin: '0 auto', padding: '100px 24px 60px' },
    backBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', padding: '0', fontFamily: 'inherit', transition: 'color 0.15s ease' },
    card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', marginBottom: '16px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.3s ease, transform 0.3s ease' },
    sectionTitle: { fontSize: '16px', fontWeight: '700', color: C.text, marginBottom: '4px' },
    sectionSub: { fontSize: '14px', color: C.muted, marginBottom: '20px' },
    label: { fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '13px 16px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box' },
    select: { width: '100%', padding: '13px 16px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '13px 16px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '14px' },
    typeGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` },
    summaryLabel: { fontSize: '14px', color: C.muted },
    summaryVal: { fontSize: '14px', fontWeight: '600', color: C.text },
    primaryBtn: { width: '100%', padding: '14px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(232,72,85,0.3)' },
    disabledBtn: { width: '100%', padding: '14px', background: C.border, border: 'none', borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '700', cursor: 'not-allowed', fontFamily: 'inherit' },
    backStepBtn: { padding: '14px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', flexShrink: 0 },
    successIcon: { width: '72px', height: '72px', borderRadius: '50%', background: C.greenSoft, border: `2px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
    previewCard: { background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', marginBottom: '20px' },
  };

  if (!mounted) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: C.muted }}>Loading...</div></div>;

  if (submitted) {
    return (
      <div style={s.page}>
        <nav style={s.nav}>
          <div style={s.logoWrap} onClick={() => router.push('/')}>
            <div style={s.logoIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg></div>
            <span style={s.logoText}>tapa</span>
          </div>
        </nav>
        <main style={{ ...s.main, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ ...s.card, textAlign: 'center', padding: '48px 32px', maxWidth: '480px', margin: '0 auto' }}>
            <div style={s.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: C.text, marginBottom: '10px' }}>Trip Posted!</div>
            <div style={{ fontSize: '15px', color: C.muted, lineHeight: '1.7', marginBottom: '28px' }}>
              Your route from <strong style={{ color: C.text }}>{from}</strong> to <strong style={{ color: C.text }}>{to}</strong> on {date} is now live. Senders can find and book you.
            </div>
            <div style={{ background: C.inputBg, borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '4px' }}>Trip reference</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: C.coral, letterSpacing: '1px' }}>
                TRP-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={s.primaryBtn} onClick={() => router.push('/search')}
                onMouseEnter={e => { e.currentTarget.style.background = C.coralDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = 'translateY(0)'; }}>
                See All Carriers
              </button>
              <button style={{ ...s.backStepBtn, width: '100%' }} onClick={() => { setStep(1); setSubmitted(false); setFrom(''); setTo(''); setDate(''); setAirline(''); setFlightNo(''); setCapacity(''); setPrice(''); setAcceptedTypes([]); setBio(''); }}>
                Post Another Trip
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logoWrap} onClick={() => router.push('/')}>
          <div style={s.logoIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg></div>
          <span style={s.logoText}>tapa</span>
        </div>
        <a href="/auth/login" style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Sign in</a>
      </nav>

      <main style={s.main}>
        <button style={s.backBtn} onClick={() => router.back()}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: C.text, letterSpacing: '-0.3px', marginBottom: '6px' }}>Post Your Trip</div>
          <div style={{ fontSize: '15px', color: C.muted }}>Tell senders where you are going and what you can carry.</div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={stepDot(1)}>{step > 1 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> : '1'}</div>
            </div>
            <div style={stepLine(1)}/>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={stepDot(2)}>{step > 2 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> : '2'}</div>
            </div>
            <div style={stepLine(2)}/>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={stepDot(3)}>3</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ ...stepLabel(1), textAlign: 'center', width: '32px' }}>Route</div>
            <div style={{ ...stepLabel(2), textAlign: 'center', width: '32px' }}>Capacity</div>
            <div style={{ ...stepLabel(3), textAlign: 'center', width: '32px' }}>Review</div>
          </div>
        </div>

        {/* Step 1 — Route */}
        {step === 1 && (
          <div style={s.card}>
            <div style={s.sectionTitle}>Your route</div>
            <div style={s.sectionSub}>Enter your origin, destination, and flight details.</div>
            <div style={s.fieldGroup}>
              <div style={s.row}>
                <div>
                  <label style={s.label}>From</label>
                  <input type="text" placeholder="e.g. Manila" value={from} onChange={e => setFrom(e.target.value)} style={s.input}
                    onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
                </div>
                <div>
                  <label style={s.label}>To</label>
                  <input type="text" placeholder="e.g. Dubai" value={to} onChange={e => setTo(e.target.value)} style={s.input}
                    onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
                </div>
              </div>
              <div>
                <label style={s.label}>Travel date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...s.input, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
              </div>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Airline</label>
                  <select value={airline} onChange={e => setAirline(e.target.value)} style={s.select}>
                    <option value="">Select airline</option>
                    {AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Flight number</label>
                  <input type="text" placeholder="e.g. EK 334" value={flightNo} onChange={e => setFlightNo(e.target.value)} style={s.input}
                    onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button style={step1Valid ? s.primaryBtn : s.disabledBtn} onClick={() => step1Valid && setStep(2)}
                onMouseEnter={e => { if (step1Valid) { e.currentTarget.style.background = C.coralDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                onMouseLeave={e => { if (step1Valid) { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = 'translateY(0)'; }}}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Capacity & pricing */}
        {step === 2 && (
          <div style={s.card}>
            <div style={s.sectionTitle}>Capacity & pricing</div>
            <div style={s.sectionSub}>Set how much you can carry and what you charge.</div>
            <div style={s.fieldGroup}>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Available capacity (kg)</label>
                  <input type="number" min="0.5" max="50" step="0.5" placeholder="e.g. 5" value={capacity} onChange={e => setCapacity(e.target.value)} style={s.input}
                    onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
                </div>
                <div>
                  <label style={s.label}>Price per kg (USD)</label>
                  <input type="number" min="1" max="100" step="0.5" placeholder="e.g. 8" value={price} onChange={e => setPrice(e.target.value)} style={s.input}
                    onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
                  {capacity && price && (
                    <div style={{ fontSize: '13px', color: C.muted, marginTop: '6px' }}>
                      Max earnings: <span style={{ color: C.coral, fontWeight: '600' }}>${(parseFloat(capacity) * parseFloat(price)).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={s.label}>Item types you will carry</label>
                <div style={s.typeGrid}>
                  {ITEM_TYPES.map(t => (
                    <div key={t} style={typeChip(acceptedTypes.includes(t))} onClick={() => toggleType(t)}>{t}</div>
                  ))}
                </div>
              </div>
              <div>
                <label style={s.label}>About you <span style={{ fontWeight: '400' }}>(optional)</span></label>
                <textarea placeholder="Tell senders a bit about yourself — how often you travel, your reliability, any special handling you offer..." value={bio} onChange={e => setBio(e.target.value)} style={s.textarea}
                  onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)}/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={s.backStepBtn} onClick={() => setStep(1)}>Back</button>
              <button style={step2Valid ? s.primaryBtn : s.disabledBtn} onClick={() => step2Valid && setStep(3)}
                onMouseEnter={e => { if (step2Valid) { e.currentTarget.style.background = C.coralDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                onMouseLeave={e => { if (step2Valid) { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = 'translateY(0)'; }}}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div style={s.card}>
            <div style={s.sectionTitle}>Review your trip</div>
            <div style={s.sectionSub}>Make sure everything looks right before publishing.</div>

            <div style={s.previewCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                  {from.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: C.text }}>{from} → {to}</div>
                  <div style={{ fontSize: '13px', color: C.muted, marginTop: '2px' }}>{airline} · {flightNo} · {date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: C.coral }}>${price}<span style={{ fontSize: '13px', fontWeight: '400', color: C.muted }}>/kg</span></div>
                  <div style={{ fontSize: '12px', color: C.muted }}>Price</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: C.text }}>{capacity} kg</div>
                  <div style={{ fontSize: '12px', color: C.muted }}>Capacity</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Route</span>
                <span style={s.summaryVal}>{from} → {to}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Flight</span>
                <span style={s.summaryVal}>{airline} {flightNo}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Date</span>
                <span style={s.summaryVal}>{date}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Capacity</span>
                <span style={s.summaryVal}>{capacity} kg</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Price</span>
                <span style={s.summaryVal}>${price} / kg</span>
              </div>
              <div style={{ ...s.summaryRow, borderBottom: 'none' }}>
                <span style={s.summaryLabel}>Accepts</span>
                <span style={{ ...s.summaryVal, textAlign: 'right', maxWidth: '240px' }}>{acceptedTypes.join(', ')}</span>
              </div>
            </div>

            {bio && (
              <div style={{ background: C.inputBg, borderRadius: '12px', padding: '14px', marginBottom: '16px', fontSize: '14px', color: C.muted, lineHeight: '1.6' }}>
                {bio}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={s.backStepBtn} onClick={() => setStep(2)}>Back</button>
              <button style={s.primaryBtn} onClick={() => setSubmitted(true)}
                onMouseEnter={e => { e.currentTarget.style.background = C.coralDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Publish Trip
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
