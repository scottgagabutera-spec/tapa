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

// Shared, dismissible safety/customs notice banner. Used at every touchpoint
// listed in TAPA_SAFETY_NOTICES.md — never blocks the primary action.
export default function SafetyNotice({ notices, dismissed, onDismiss }: SafetyNoticeProps) {
  const visible = notices.filter(n => !dismissed.includes(n.notice));
  if (visible.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {visible.map(n => {
        const strong = n.risk === 'restricted';
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
            <span style={{ fontSize: '15px', lineHeight: '1.4', flexShrink: 0 }}>
              {strong ? '⚠️' : 'ℹ️'}
            </span>
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