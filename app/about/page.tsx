'use client';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', text: '#F8F9FA', muted: '#8B9BB4',
};

export default function AboutPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } p { line-height: 1.8; margin-bottom: 16px; }`}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="20" r="6" fill="none" stroke="white" strokeWidth="2.5"/><circle cx="12" cy="20" r="2.5" fill="white"/><line x1="12" y1="26" x2="12" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="33" x2="33" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/><circle cx="36" cy="12" r="8" fill="white"/><circle cx="36" cy="12" r="3.5" fill="#E84855"/><line x1="36" y1="20" x2="36" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '13px', padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
      </nav>
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '96px clamp(16px,4vw,24px) 80px' }}>
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>About Tapa</h1>
        <p style={{ color: C.muted, fontSize: '16px', marginBottom: '40px' }}>A platform built from real life, for real people.</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Where the idea came from</h2>
          <p>A friend of mine teaches in Asia and regularly sends things back home to sell. The cost of using shipping companies was high, and finding someone trustworthy traveling to her destination was nearly impossible, especially when things were needed urgently.</p>
          <p>That problem stuck with me. Having lived across Africa, Europe and Asia myself, I had been on both sides of that situation many times. I had sent things with people, received things through travelers, and seen firsthand how common and how frustrating this problem was.</p>
          <p>Millions of people travel every day. Many of them have a few spare kilos in their luggage and nothing to fill them with. On the other side, millions of people need to get something from one country to another without paying courier prices or waiting two weeks. Tapa connects those two groups.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Why the name Tapa</h2>
          <p>Tapa is a Filipino cured beef dish. Simple, satisfying, something you share. The name came from time spent living in the Philippines, where the idea began to take shape over many plates of tapsilog with a good friend. We wanted the name to carry that memory and that warmth.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>How it works in practice</h2>
          <p>Think about the last time you asked a cousin, a friend, or a friend of a friend to bring something back from abroad. That is exactly what Tapa is, just with tools that make it safer, more organized, and accessible to everyone regardless of whether you know someone traveling your route.</p>
          <p>A carrier posts their upcoming trip. A sender finds them, agrees on what to send, hands it over, and the carrier brings it in their checked luggage. Most international flights land within 36 hours. Payment is held in escrow and only released when the sender confirms delivery. That is the whole model.</p>
          <p>We also know that not every route has a direct carrier available. So our platform shows connecting routes too, helping senders find carriers who can get their item to a transit point that another carrier covers, completing the journey in stages.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>What we are building toward</h2>
          <p>Right now Tapa is focused on making that connection simple and trustworthy. Over time we want to build the tools that make cross-border peer delivery as normal and reliable as ordering a ride. Verification, ratings, route coverage, and smart matching are all part of where this is going.</p>
          <p>We are a small team building something we believe in, for a problem we have lived ourselves.</p>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: 0 }}>© {new Date().getFullYear()} Tapa. All rights reserved.</p>
      </footer>
    </div>
  );
}
