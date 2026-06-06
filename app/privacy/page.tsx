'use client';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', border: '#243B55',
  coral: '#E84855', text: '#F8F9FA', muted: '#8B9BB4',
};

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Privacy Policy</h1>
        <p style={{ color: C.muted, fontSize: '14px', marginBottom: '40px' }}>Last updated: June 2026</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>What we collect</h2>
          <p>When you create an account, we collect your name, email address, and optionally your phone number and a profile photo. When you post a trip as a carrier, we collect your route, travel date, and luggage capacity. When you submit a booking as a sender, we collect a description of your item, its weight and approximate value, and any photos you choose to upload.</p>
          <p>We also collect standard usage data such as pages visited and actions taken within the platform, to help us improve the product.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>How we use your information</h2>
          <p>We use your information to operate the platform, process transactions, display your profile to other users in the appropriate context, and communicate with you about your bookings and account.</p>
          <p>We do not sell your personal information to third parties. We do not use your data for advertising purposes. We do not share your contact details with other users until a booking is mutually confirmed.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>How we protect your information</h2>
          <p>Your data is stored securely using Supabase, which provides encrypted storage and row-level security. Passwords are never stored in plain text. Profile photos and item photos are stored in secure cloud storage with access controlled by authentication policies.</p>
          <p>We do not store payment card details. Payment processing is handled by third-party payment providers who are independently responsible for the security of financial data.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Privacy between users</h2>
          <p>Tapa is designed to keep personal information private until trust is established. Carriers are displayed anonymously to senders during search, showing only trust signals such as ratings, trips completed, and route details. Full identity is only revealed after a booking is confirmed by both parties.</p>
          <p>The same applies in reverse. Carriers do not see sender contact details until a booking is accepted.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Your rights</h2>
          <p>You can update your profile information at any time from the account settings page. You can delete your account and all associated data from the same page. If you want to request a copy of your data or have it removed in a way not covered by the self-service tools, contact us at privacy@trytapa.com.</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Changes to this policy</h2>
          <p>We may update this policy as the platform evolves. When we do, we will update the date at the top of this page. Continued use of Tapa after any update means you accept the revised policy.</p>
          <p>For privacy questions, contact us at privacy@trytapa.com.</p>
        </div>
      </main>
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: 0 }}>© {new Date().getFullYear()} Tapa. All rights reserved.</p>
      </footer>
    </div>
  );
}
