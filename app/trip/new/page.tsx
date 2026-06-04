'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  inputBg: '#0A1520',
};

const ITEM_TYPES = ['Electronics', 'Documents', 'Clothes', 'Food', 'Cosmetics', 'Small items', 'Medicine', 'Books', 'Gifts', 'Other'];
const AIRLINES = ['Emirates', 'British Airways', 'Singapore Airlines', 'LATAM Airlines', 'Qantas', 'Delta', 'Lufthansa', 'Air France', 'KLM', 'Turkish Airlines', 'Qatar Airways', 'Etihad Airways', 'Philippine Airlines', 'Cebu Pacific', 'Kenya Airways', 'Ethiopian Airlines', 'Other'];

interface Airport { name: string; city: string; country: string; iata: string; type?: string; lat?: number; lng?: number; keywords?: string; }
let _cache: Airport[] | null = null;
async function loadAirports(): Promise<Airport[]> {
  if (_cache) return _cache;
  const res = await fetch('/airports.json');
  _cache = await res.json();
  return _cache!;
}
function useAirportSearch(query: string) {
  const [results, setResults] = useState<Airport[]>([]);
  const search = useCallback(async (q: string) => {
    if (!q || q.length < 1) { setResults([]); return; }
    const airports = await loadAirports();
    const lower = q.toLowerCase();
    const matches = airports.filter(a =>
      a.iata.toLowerCase().startsWith(lower) || a.city.toLowerCase().includes(lower) ||
      a.country.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower) || (a.keywords && a.keywords.toLowerCase().includes(lower))
    );
    matches.sort((a, b) => {
      const ai = a.iata.toLowerCase() === lower ? 0 : a.city.toLowerCase().startsWith(lower) ? 1 : 2;
      const bi = b.iata.toLowerCase() === lower ? 0 : b.city.toLowerCase().startsWith(lower) ? 1 : 2;
      return ai - bi;
    });
    setResults(matches.slice(0, 7));
  }, []);
  useEffect(() => { search(query); }, [query, search]);
  return results;
}

function AirportField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const results = useAirportSearch(value);
  const inp: React.CSSProperties = { width: '100%', padding: '13px 16px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '6px', display: 'block' };

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={lbl}>{label}</label>
      <input value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIndex(-1); }}
        onFocus={e => { setOpen(true); e.target.style.borderColor = C.coral; }}
        onBlur={e => { e.target.style.borderColor = C.border; }}
        onKeyDown={e => {
          if (!open || results.length === 0) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
          else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); const a = results[activeIndex]; onChange(`${a.city}, ${a.country} (${a.iata})`); setOpen(false); setActiveIndex(-1); }
          else if (e.key === 'Escape') { setOpen(false); setActiveIndex(-1); }
        }}
        placeholder="City or country"
        style={inp} />
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#162738', border: `1px solid ${C.border}`, borderRadius: '12px', zIndex: 500, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
          {results.map((a, idx) => (
            <button key={a.iata} onMouseDown={() => { onChange(`${a.city}, ${a.country} (${a.iata})`); setOpen(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: idx === activeIndex ? 'rgba(232,72,85,0.1)' : 'transparent', border: 'none', color: C.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}
              onMouseEnter={e => { setActiveIndex(idx); e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = idx === activeIndex ? 'rgba(232,72,85,0.1)' : 'transparent'; }}>
              <span style={{ background: 'rgba(232,72,85,0.1)', border: '1px solid rgba(232,72,85,0.2)', color: C.coral, fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}>{a.iata}</span>
              <span><span style={{ fontWeight: 600 }}>{a.city}</span><span style={{ color: C.muted, marginLeft: '6px' }}>{a.country}</span></span>
              <span style={{ color: '#3D5166', fontSize: '11px', marginLeft: 'auto', flexShrink: 0 }}>{a.name.length > 24 ? a.name.slice(0, 24) + '…' : a.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TripNewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [acceptedTypes, setAcceptedTypes] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const toggleType = (t: string) => setAcceptedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const step1Valid = from.length > 3 && to.length > 3 && date && airline && flightNo;
  const step2Valid = capacity && price && parseFloat(price) > 0 && acceptedTypes.length > 0;

  const handlePublish = async () => {
    setLoading(true); setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { error: insertError } = await supabase.from('trips').insert({
        carrier_id: user.id,
        from_city: from,
        to_city: to,
        date, airline,
        flight_no: flightNo,
        capacity_kg: parseFloat(capacity),
        price_per_kg: parseFloat(price),
        item_types: acceptedTypes,
        status: 'active',
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError((err as any).message || 'Failed to publish trip');
    } finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '13px 16px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '6px', display: 'block' };
  const stepDot = (n: number): React.CSSProperties => ({ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0, background: step > n ? C.green : step === n ? C.coral : C.border, color: step >= n ? '#fff' : C.muted, transition: 'all 0.3s ease' });
  const typeChip = (sel: boolean): React.CSSProperties => ({ padding: '8px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', background: sel ? C.coral : 'rgba(255,255,255,0.04)', color: sel ? '#fff' : C.muted, border: `1px solid ${sel ? C.coral : C.border}`, transition: 'all 0.15s ease' });

  if (!mounted) return <div style={{ minHeight: '100vh', background: C.bg }} />;

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px clamp(16px,4vw,24px)', display: 'flex', alignItems: 'center', background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg></div>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>tapa</span>
        </div>
      </nav>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px clamp(16px,4vw,24px) 40px' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: 'clamp(32px,5vw,48px)', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: C.greenSoft, border: `2px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>Trip Posted!</div>
          <div style={{ fontSize: '15px', color: C.muted, lineHeight: '1.7', marginBottom: '28px' }}>
            Your route from <strong style={{ color: C.text }}>{from.split('(')[0].trim()}</strong> to <strong style={{ color: C.text }}>{to.split('(')[0].trim()}</strong> on {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} is now live.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{ padding: '14px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => router.push('/search')}>See All Carriers</button>
            <button style={{ padding: '14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .trip-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .trip-row { grid-template-columns: 1fr !important; } }
      `}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 clamp(16px,4vw,24px)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 20H4L12 3Z" fill="white"/></svg></div>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>tapa</span>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '9px', color: C.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Dashboard</button>
      </nav>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '80px clamp(16px,4vw,24px) 60px' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: C.muted, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', padding: '0', fontFamily: 'inherit' }} onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: 'clamp(20px,4vw,24px)', fontWeight: '700', marginBottom: '6px' }}>Post Your Trip</div>
          <div style={{ fontSize: '15px', color: C.muted }}>Tell senders where you're going and what you can carry.</div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[1,2,3].map((n, i) => (
              <React.Fragment key={n}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={stepDot(n)}>{step > n ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> : n}</div>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '2px', background: step > n ? C.green : C.border, transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            {['Route', 'Capacity', 'Review'].map((l, i) => (
              <div key={l} style={{ fontSize: '11px', fontWeight: '600', color: step === i+1 ? C.text : C.muted, width: '32px', textAlign: 'center' }}>{l}</div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: 'clamp(20px,3vw,28px)' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Your route</div>
            <div style={{ fontSize: '14px', color: C.muted, marginBottom: '20px' }}>Select the airports you're flying between.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="trip-row">
                <AirportField label="From" value={from} onChange={setFrom} />
                <AirportField label="To" value={to} onChange={setTo} />
              </div>
              <div>
                <label style={lbl}>Travel date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)} />
              </div>
              <div className="trip-row">
                <div>
                  <label style={lbl}>Airline</label>
                  <select value={airline} onChange={e => setAirline(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">Select airline</option>
                    {AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Flight number</label>
                  <input type="text" placeholder="e.g. EK 334" value={flightNo} onChange={e => setFlightNo(e.target.value)} style={inp} onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
              </div>
            </div>
            <button style={{ width: '100%', marginTop: '20px', padding: '14px', background: step1Valid ? C.coral : C.border, border: 'none', borderRadius: '12px', color: step1Valid ? C.text : C.muted, fontSize: '15px', fontWeight: '700', cursor: step1Valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }} onClick={() => step1Valid && setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: 'clamp(20px,3vw,28px)' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Capacity & pricing</div>
            <div style={{ fontSize: '14px', color: C.muted, marginBottom: '20px' }}>Set how much you can carry and what you charge per kg.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="trip-row">
                <div>
                  <label style={lbl}>Available capacity (kg)</label>
                  <input type="number" min="0.5" max="50" step="0.5" placeholder="e.g. 5" value={capacity} onChange={e => setCapacity(e.target.value)} style={inp} onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
                <div>
                  <label style={lbl}>Price per kg (USD)</label>
                  <input type="number" min="1" max="200" step="0.5" placeholder="e.g. 8" value={price} onChange={e => setPrice(e.target.value)} style={inp} onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)} />
                  {capacity && price && <div style={{ fontSize: '13px', color: C.muted, marginTop: '6px' }}>Max earning: <span style={{ color: C.coral, fontWeight: '600' }}>${(parseFloat(capacity) * parseFloat(price)).toFixed(2)}</span></div>}
                </div>
              </div>
              <div>
                <label style={lbl}>Item types you'll carry</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ITEM_TYPES.map(t => <div key={t} style={typeChip(acceptedTypes.includes(t))} onClick={() => toggleType(t)}>{t}</div>)}
                </div>
              </div>
              <div>
                <label style={lbl}>About you <span style={{ fontWeight: '400', color: C.muted }}>(optional)</span></label>
                <textarea placeholder="Tell senders about yourself — builds trust." value={bio} onChange={e => setBio(e.target.value)} style={{ ...inp, resize: 'vertical', minHeight: '80px' }} onFocus={e => (e.target.style.borderColor = C.coral)} onBlur={e => (e.target.style.borderColor = C.border)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={{ padding: '14px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }} onClick={() => setStep(1)}>Back</button>
              <button style={{ flex: 1, padding: '14px', background: step2Valid ? C.coral : C.border, border: 'none', borderRadius: '12px', color: step2Valid ? C.text : C.muted, fontSize: '15px', fontWeight: '700', cursor: step2Valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }} onClick={() => step2Valid && setStep(3)}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '20px', padding: 'clamp(20px,3vw,28px)' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Review your trip</div>
            <div style={{ fontSize: '14px', color: C.muted, marginBottom: '20px' }}>Make sure everything looks right before publishing.</div>
            <div style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{from.split('(')[0].trim()} → {to.split('(')[0].trim()}</div>
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '16px' }}>{airline} · {flightNo} · {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div><div style={{ fontSize: '20px', fontWeight: '800', color: C.coral }}>${price}<span style={{ fontSize: '13px', fontWeight: '400', color: C.muted }}>/kg</span></div><div style={{ fontSize: '12px', color: C.muted }}>Price</div></div>
                <div><div style={{ fontSize: '20px', fontWeight: '700' }}>{capacity} kg</div><div style={{ fontSize: '12px', color: C.muted }}>Capacity</div></div>
              </div>
            </div>
            <div style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: '13px', color: C.muted }}>Accepts</span>
              <span style={{ fontSize: '14px', fontWeight: '600', float: 'right', maxWidth: '60%', textAlign: 'right' }}>{acceptedTypes.join(', ')}</span>
            </div>
            {bio && <div style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: '13px', color: C.muted }}>About you</span>
              <span style={{ fontSize: '13px', color: C.muted, display: 'block', marginTop: '4px' }}>{bio}</span>
            </div>}
            {error && <div style={{ background: 'rgba(232,72,85,0.1)', border: '1px solid rgba(232,72,85,0.3)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: C.coral, margin: '16px 0 0' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={{ padding: '14px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '12px', color: C.muted, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }} onClick={() => setStep(2)}>Back</button>
              <button style={{ flex: 1, padding: '14px', background: C.coral, border: 'none', borderRadius: '12px', color: C.text, fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }} onClick={handlePublish}>
                {loading ? 'Publishing…' : 'Publish Trip'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
