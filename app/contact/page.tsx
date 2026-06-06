'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', text: '#F8F9FA', muted: '#8B9BB4',
  inputBg: '#0A1520', green: '#2D9E6B',
};

export default function ContactPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !message) return;
    window.location.href = `mailto:support@trytapa.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}`;
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input, textarea { outline: none; } textarea { resize: vertical; }`}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="20" r="6" fill="none" stroke="white" strokeWidth="2.5"/><circle cx="12" cy="20" r="2.5" fill="white"/><line x1="12" y1="26" x2="12" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="33" x2="33" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/><circle cx="36" cy="12" r="8" fill="white"/><circle cx="36" cy="12" r="3.5" fill="#E84855"/><line x1="36" y1="20" x2="36" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '13px', padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
      </nav>
      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '96px clamp(16px,4vw,24px) 80px' }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Get in Touch</h1>
        <p style={{ color: C.muted, fontSize: '16px', marginBottom: '40px', lineHeight: 1.7 }}>We are a small team and we read every message. Whether you have a question, a problem, or just want to share feedback, reach out.</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Message opened</div>
              <p style={{ color: C.muted, fontSize: '14px', lineHeight: 1.7 }}>Your email client should have opened with your message ready to send to support@trytapa.com. If it did not, you can email us directly.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', color: C.muted, marginBottom: '6px', display: 'block' }}>Your name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.text, fontSize: '14px', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', color: C.muted, marginBottom: '6px', display: 'block' }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.text, fontSize: '14px', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: C.muted, marginBottom: '6px', display: 'block' }}>Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What is on your mind?" rows={5}
                  style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.text, fontSize: '14px', fontFamily: 'inherit', lineHeight: 1.6 }} />
              </div>
              <button onClick={handleSubmit} disabled={!name || !email || !message}
                style={{ width: '100%', padding: '13px', background: name && email && message ? C.coral : C.border, border: 'none', borderRadius: '12px', color: name && email && message ? '#fff' : C.muted, fontSize: '15px', fontWeight: '700', cursor: name && email && message ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                Send Message
              </button>
            </>
          )}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '13px', color: C.muted, marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Direct contact</div>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>General: <a href="mailto:support@trytapa.com" style={{ color: C.coral, textDecoration: 'none' }}>support@trytapa.com</a></div>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Legal: <a href="mailto:legal@trytapa.com" style={{ color: C.coral, textDecoration: 'none' }}>legal@trytapa.com</a></div>
          <div style={{ fontSize: '14px' }}>Privacy: <a href="mailto:privacy@trytapa.com" style={{ color: C.coral, textDecoration: 'none' }}>privacy@trytapa.com</a></div>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: 0 }}>© {new Date().getFullYear()} Tapa. All rights reserved.</p>
      </footer>
    </div>
  );
}
