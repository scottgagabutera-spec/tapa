'use client';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', text: '#F8F9FA', muted: '#8B9BB4',
};

export default function TermsPage() {
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
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Terms of Service</h1>
        <p style={{ color: C.muted, fontSize: '14px', marginBottom: '40px' }}>Last updated: June 2026</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>1. About Tapa</h2>
          <p>Tapa is a peer-to-peer delivery platform that connects people who need to send items across borders with travelers who have spare luggage capacity on their flights. Tapa operates as a marketplace and technology platform only. We are not a courier, freight company, or logistics provider.</p>
          <p>By creating an account and using Tapa, you agree to these terms in full. If you do not agree, do not use the platform.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>2. Eligibility</h2>
          <p>You must be at least 18 years old to use Tapa. By registering, you confirm that the information you provide is accurate and that you have the legal capacity to enter into a binding agreement.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>3. The platform and its role</h2>
          <p>Tapa provides tools to help senders and carriers find each other, communicate, agree on terms, and complete transactions. All agreements for delivery are made directly between the sender and the carrier. Tapa is not a party to those agreements and is not responsible for the performance of either party.</p>
          <p>Tapa holds payment in escrow during the transaction period. Escrow funds are released to the carrier only upon confirmation of delivery by the sender. Tapa reserves the right to withhold or return escrow funds in cases of dispute, fraud, or violation of these terms.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>4. Prohibited items and conduct</h2>
          <p>You may not use Tapa to send or carry any item that is illegal under the laws of the origin country, destination country, or any country of transit. This includes but is not limited to controlled substances, weapons, counterfeit goods, stolen property, and items subject to trade sanctions.</p>
          <p>You may not use Tapa to facilitate fraud, money laundering, or any other unlawful activity. Any user found to be doing so will be immediately suspended and reported to the relevant authorities.</p>
          <p>Carriers must not carry items they have not physically inspected and agreed to transport. Senders must not misrepresent the nature, weight, or value of items submitted through the platform.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>5. Limitation of liability</h2>
          <p>Tapa is not liable for the loss, damage, theft, or customs seizure of any item transported through the platform. The risk of sending or carrying any item rests entirely with the sender and carrier involved in that transaction.</p>
          <p>Tapa is not liable for any indirect, incidental, or consequential damages arising from use of the platform, including but not limited to loss of item value, missed delivery, or customs penalties.</p>
          <p>To the maximum extent permitted by law, Tapa's total liability to any user for any claim arising out of or relating to these terms or use of the platform shall not exceed the amount of the transaction fee paid by that user in the relevant transaction.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>6. Account termination</h2>
          <p>Tapa reserves the right to suspend or terminate any account at any time for violation of these terms, fraudulent activity, or conduct that harms other users or the platform. Users may also delete their own account at any time through the account settings page.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>7. Changes to these terms</h2>
          <p>We may update these terms from time to time. When we do, we will update the date at the top of this page. Continued use of Tapa after any change constitutes acceptance of the updated terms.</p>
          <p>For questions about these terms, contact us at legal@trytapa.com.</p>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: 0 }}>© {new Date().getFullYear()} Tapa. All rights reserved.</p>
      </footer>
    </div>
  );
}
