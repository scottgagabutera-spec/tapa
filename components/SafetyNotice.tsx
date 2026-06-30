'use client';
import React from 'react';
import { FlagNotice } from '@/lib/flaggedItems';

const C = {
  muted: '#8B9BB4',
  coral: '#E84855',
  coralBg: 'rgba(232,72,85,0.1)',
  coralBgSoft: 'rgba(232,72,85,0.12)',
  coralBorder: 'rgba(232,72,85,0.3)',
  coralBorderSoft: 'rgba(232,72,85,0.2)',
};

interface SafetyNoticeProps {
  notices: FlagNotice[];
  dismissed: string[];
  onDismiss: (notice: string) => void;
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
      <path d="M12 3L22 20H2L12 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  );
}

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <line x1="12" y1="11" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1" fill={color} />
    </svg>
  );
}

// Shared, dismissible safety/customs notice banner. Used at every touchpoint
// listed in TAPA_SAFETY_NOTICES.md. Never blocks the primary action.
export default function SafetyNotice({ notices, dismissed, onDismiss }: SafetyNoticeProps) {
  const visible = notices.filter(n => !dismissed.includes(n.notice));
  if (visible.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {visible.map(n => {
        const strong = n.risk === 'restricted';
        const iconColor = strong ? C.coral : C.muted;
        return (
          <div
            key={n.notice}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: strong ? C.coralBg : C.coralBgSoft,
              border: `1px solid ${strong ? C.coralBorder : C.coralBorderSoft}`,
              borderRadius: '12px',
              padding: '12px 14px',
            }}
          >
            {strong ? <WarningIcon color={iconColor} /> : <InfoIcon color={iconColor} />}
            <p style={{ flex: 1, fontSize: '13px', color: strong ? C.coral : C.muted, margin: 0, lineHeight: '1.6' }}>
              {n.notice}
            </p>
            <button
              onClick={() => onDismiss(n.notice)}
              aria-label="Dismiss notice"
              style={{
                background: 'transparent',
                border: 'none',
                color: C.muted,
                fontSize: '16px',
                lineHeight: '1',
                cursor: 'pointer',
                padding: '0 0 0 4px',
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}