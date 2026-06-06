'use client';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', text: '#F8F9FA', muted: '#8B9BB4',
  green: '#2D9E6B',
};

export default function SafetyPage() {
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
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Safety and Trust</h1>
        <p style={{ color: C.muted, fontSize: '16px', marginBottom: '40px' }}>What Tapa does, and what you are responsible for.</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>What Tapa provides</h2>
          <p>Tapa provides the platform that connects senders and carriers. We hold payments in escrow so that carriers are only paid after successful delivery. We provide a rating and review system so both parties can build a track record over time. We provide a 7-stage tracking system so senders can follow the progress of their item from handover to delivery.</p>
          <p>We also keep personal information private until a booking is mutually confirmed. Before that point, carriers appear anonymously with trust signals only. After confirmation, both parties can coordinate directly.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Your responsibility as a sender</h2>
          <p>You are responsible for what you send. Before handing anything to a carrier, you must be confident that the item is legal to transport across the relevant borders, is not prohibited under the customs laws of the origin or destination country, and is packaged appropriately.</p>
          <p>Tapa does not inspect items and cannot guarantee delivery. If your item is lost, damaged, confiscated by customs, or not delivered, Tapa will not issue a refund for the value of the item itself. The escrow payment to the carrier will not be released if delivery is not confirmed, but Tapa bears no liability for the item's value.</p>
          <p>Do not send anything you cannot afford to lose. If you are sending something of significant value, that is a decision you make with full awareness of the risk involved.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Your responsibility as a carrier</h2>
          <p>You are responsible for what you agree to carry. Before accepting a booking, you must be satisfied that the item is something you are comfortable transporting, that it complies with the airline's baggage rules, and that it is legal to bring into your destination country.</p>
          <p>Do not carry anything you have not inspected. Do not carry anything on behalf of someone you have not communicated with through the platform. If you are at all uncertain about an item, decline the booking.</p>
          <p>Carriers who fail to deliver confirmed bookings without valid reason, or who are found to have misrepresented their trip details, may be suspended from the platform.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Customs and legal compliance</h2>
          <p>Every country has its own customs rules. It is the joint responsibility of the sender and carrier to understand what is and is not permitted to cross the borders involved in their transaction. Tapa does not provide customs advice and is not liable for any customs seizure, fine, or legal consequence arising from a delivery made through the platform.</p>
          <p>Common items that may cause issues include liquids over 100ml in cabin baggage, certain food products, electronics above certain values, perfumes and cosmetics in large quantities, and any item that could be classified as a controlled substance. Always check the customs regulations of both countries before proceeding.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Verification roadmap</h2>
          <p>Currently Tapa uses ratings, reviews, and trip history as trust signals. We are working toward optional identity verification for users who want to establish a higher level of trust on the platform. This will be voluntary initially and will become part of a tiered trust system over time.</p>
          <p>If you have concerns about a user or a transaction, contact us at support@trytapa.com.</p>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: 0 }}>© {new Date().getFullYear()} Tapa. All rights reserved.</p>
      </footer>
    </div>
  );
}
