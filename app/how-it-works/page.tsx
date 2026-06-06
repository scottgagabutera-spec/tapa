'use client';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', text: '#F8F9FA', muted: '#8B9BB4',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
};

export default function HowItWorksPage() {
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
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>How Tapa Works</h1>
        <p style={{ color: C.muted, fontSize: '16px', marginBottom: '40px' }}>Peer delivery in plain language.</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: C.coral }}>For Senders</h2>
          <p>You need to get something from one country to another. Instead of paying a courier company and waiting up to two weeks, you search Tapa for a real traveler going from your origin to your destination.</p>
          <p>Once you find a carrier whose route and dates work for you, you submit a booking request with a description of what you are sending, its approximate weight and value, and optionally a photo of the item. The carrier reviews your request and either accepts or declines.</p>
          <p>If they accept, you coordinate directly to hand over the item before their flight. Your payment is held in escrow by Tapa and is only released to the carrier once you confirm that your item has been delivered. If delivery does not happen, the payment is not released.</p>
          <p>Most international flights land within 36 hours. In many cases your item arrives faster than any courier service, at a fraction of the cost.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: C.green }}>For Carriers</h2>
          <p>You are traveling and you have spare capacity in your checked luggage. Instead of leaving that space empty, you post your trip on Tapa with your route, travel date, and how many kilos you are willing to carry.</p>
          <p>Senders on your route will find your listing and send you booking requests. You can see what they want to send, including photos and a description, before you decide to accept. You are never obligated to carry anything you are not comfortable with.</p>
          <p>Once you accept a request, you collect the item before your flight, carry it in your checked bag, and deliver it to the sender at the destination. When they confirm delivery, your payment is released from escrow directly to you.</p>
          <p>It is a simple way to earn from travel you were already doing, or to offset the cost of extra baggage fees on your flight.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Connecting Routes</h2>
          <p>Not every destination has a direct carrier available, especially as Tapa grows. To help with this, our platform also shows carriers on connecting routes. If no one is flying directly from City A to City C, we can show you carriers going from A to B, and others going from B to C, giving you the option to coordinate a two-stage delivery.</p>
          <p>This is how we make sure the platform is useful even when direct coverage is limited.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Payment and Escrow</h2>
          <p>Tapa holds payment in escrow from the moment a booking is confirmed. The carrier does not receive payment until the sender confirms that the item has been delivered. This protects senders from paying for a delivery that never happened, and it gives carriers a clear commitment from the sender before they agree to carry anything.</p>
          <p>All pricing is agreed between the sender and carrier at the time of booking based on the weight and route. Tapa does not set prices.</p>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: 0 }}>© {new Date().getFullYear()} Tapa. All rights reserved.</p>
      </footer>
    </div>
  );
}
