'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#0D1B2A', surface: '#1A2F45', surfaceHover: '#1F3650',
  border: '#243B55', borderHover: '#2E4A6A',
  coral: '#E84855', accentGlow: 'rgba(232,72,85,0.12)',
  text: '#F8F9FA', muted: '#8B9BB4', inputBg: '#0A1520',
  green: '#2D9E6B', greenSoft: 'rgba(45,158,107,0.12)', greenBorder: 'rgba(45,158,107,0.3)',
  red: '#E84855', redSoft: 'rgba(232,72,85,0.08)', redBorder: 'rgba(232,72,85,0.25)',
};

const SUPABASE_URL = 'https://ilhhqbjhljfcjlwtzxon.supabase.co';

export default function AccountPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login?redirectTo=/account'); return; }
      setUserId(user.id);
      const { data } = await supabase.from('profiles').select('name, phone, bio, avatar_url').eq('id', user.id).single();
      if (data) {
        setName(data.name || '');
        setPhone(data.phone || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || null);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.push('/auth/login?redirectTo=/account');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAvatarClick = () => fileRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    setError('');
    const { error: uploadError } = await supabase.storage.from('avatars').upload(userId, file, { upsert: true });
    if (uploadError) { setError('Upload failed. Try again.'); setUploading(false); return; }
    const url = `${SUPABASE_URL}/storage/v1/object/public/avatars/${userId}?t=${Date.now()}`;
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId);
    setAvatarUrl(url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setError('');
    const { error: saveError } = await supabase.from('profiles').update({ name: name.trim(), phone: phone.trim(), bio: bio.trim() }).eq('id', userId);
    if (saveError) { setError('Failed to save. Try again.'); setSaving(false); return; }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    setDeleting(true);
    await supabase.from('profiles').delete().eq('id', userId);
    await supabase.auth.signOut();
    router.push('/');
  };

  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'ME';

  if (!mounted) return <div style={{ minHeight: '100vh', background: C.bg }} />;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input, textarea { outline: none; } textarea { resize: vertical; }`}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '36px', height: '36px', background: C.coral, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="12" cy="20" r="6" fill="none" stroke="white" strokeWidth="2.5"/><circle cx="12" cy="20" r="2.5" fill="white"/><line x1="12" y1="26" x2="12" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="33" x2="33" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/><circle cx="36" cy="12" r="8" fill="white"/><circle cx="36" cy="12" r="3.5" fill="#E84855"/><line x1="36" y1="20" x2="36" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: C.text, letterSpacing: '-0.5px' }}>tapa</span>
        </div>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '13px', fontWeight: '500', padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
      </nav>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '96px clamp(16px,4vw,24px) 60px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px', letterSpacing: '-0.5px' }}>Account Settings</h1>

        {/* Avatar */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>Profile Photo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div onClick={handleAvatarClick} style={{ width: '72px', height: '72px', borderRadius: '50%', background: avatarUrl ? 'transparent' : C.coral, border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>{initials}</span>}
              {uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '11px', color: '#fff' }}>...</span></div>}
            </div>
            <div>
              <button onClick={handleAvatarClick} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '13px', fontWeight: '600', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '6px', display: 'block' }}>{uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Add photo'}</button>
              <div style={{ fontSize: '12px', color: C.muted }}>Optional · JPG, PNG or WebP · Max 50MB</div>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
        </div>

        {/* Profile info */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>Profile</div>
          {[
            { label: 'Full Name', value: name, set: setName, placeholder: 'Your full name', type: 'text' },
            { label: 'Phone', value: phone, set: setPhone, placeholder: '+63 912 345 6789', type: 'tel' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: C.muted, marginBottom: '6px', display: 'block' }}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.text, fontSize: '14px', fontFamily: 'inherit' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '13px', color: C.muted, marginBottom: '6px', display: 'block' }}>Bio <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span></label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell carriers or senders a bit about yourself…" rows={3}
              style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.text, fontSize: '14px', fontFamily: 'inherit', lineHeight: 1.6 }} />
          </div>
        </div>

        {error && <div style={{ background: C.redSoft, border: `1px solid ${C.redBorder}`, borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: C.coral, marginBottom: '16px' }}>{error}</div>}

        <button onClick={handleSave} disabled={saving}
          style={{ width: '100%', padding: '14px', background: saved ? C.green : C.coral, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: '32px', transition: 'background 0.3s' }}>
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>

        {/* Danger zone */}
        <div style={{ background: C.redSoft, border: `1px solid ${C.redBorder}`, borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: C.coral, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Danger Zone</div>
          <p style={{ fontSize: '13px', color: C.muted, marginBottom: '16px', lineHeight: 1.6 }}>Deleting your account is permanent and cannot be undone. All your trips, bookings, and data will be removed.</p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} style={{ background: 'transparent', border: `1px solid ${C.redBorder}`, borderRadius: '10px', color: C.coral, fontSize: '13px', fontWeight: '600', padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>Delete Account</button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleDeleteAccount} disabled={deleting} style={{ background: C.coral, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: '700', padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>{deleting ? 'Deleting…' : 'Yes, delete my account'}</button>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.muted, fontSize: '13px', fontWeight: '600', padding: '8px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
