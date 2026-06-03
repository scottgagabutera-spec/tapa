'use client';

import { useState, useEffect, useRef } from 'react';

export default function GagaraHome() {
  const [linked, setLinked] = useState(false);
  const [funded, setFunded] = useState(false);
  const [released, setReleased] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setLinked(true), 1200);
    const t2 = setTimeout(() => setFunded(true), 2400);
    const t3 = setTimeout(() => { setActiveStep(1); }, 3200);
    const t4 = setTimeout(() => { setActiveStep(2); }, 5000);
    const t5 = setTimeout(() => setReleased(true), 6000);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:    #07070A;
          --obsidian: #0B0B10;
          --surface:  #0F0F18;
          --surface2: #141420;
          --surface3: #1C1C2E;
          --indigo:   #5B4FE8;
          --indigo-l: #7B70F0;
          --indigo-d: rgba(91,79,232,0.15);
          --gold:     #C9A84C;
          --gold-d:   rgba(201,168,76,0.08);
          --green:    #3DBA78;
          --white:    #F0F0F5;
          --muted:    rgba(240,240,245,0.42);
          --faint:    rgba(240,240,245,0.1);
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.1);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Geist', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        ::selection { background: rgba(91,79,232,0.3); color: var(--white); }

        /* ── NOISE OVERLAY ── */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        /* ── GRID ── */
        .g-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(91,79,232,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,79,232,0.028) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* ── GLOWS ── */
        .g-glow-a {
          position: fixed; z-index: 0; pointer-events: none;
          width: 800px; height: 800px; border-radius: 50%;
          top: -300px; right: -300px;
          background: radial-gradient(circle, rgba(91,79,232,0.06) 0%, transparent 65%);
        }
        .g-glow-b {
          position: fixed; z-index: 0; pointer-events: none;
          width: 600px; height: 600px; border-radius: 50%;
          bottom: -200px; left: -200px;
          background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%);
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 56px; height: 68px;
          background: rgba(7,7,10,0.75);
          backdrop-filter: blur(32px) saturate(1.4);
          border-bottom: 0.5px solid var(--border);
        }

        .nav-logo {
          display: flex; align-items: center; gap: 11px;
          font-family: 'Geist', sans-serif;
          font-size: 17px; font-weight: 600;
          letter-spacing: -0.4px; color: var(--white);
          text-decoration: none; user-select: none;
        }

        .nav-mark {
          width: 30px; height: 30px; position: relative;
        }

        .nav-center {
          display: flex; align-items: center; gap: 40px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }

        .nav-center a {
          font-size: 13px; font-weight: 400; color: var(--muted);
          text-decoration: none; letter-spacing: 0.01em;
          transition: color 0.15s;
        }
        .nav-center a:hover { color: var(--white); }

        .nav-right {
          display: flex; align-items: center; gap: 12px;
        }

        .nav-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--gold);
          border: 0.5px solid rgba(201,168,76,0.3);
          padding: 4px 10px; border-radius: 4px;
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 140px 56px 80px;
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
        }

        .hero-kicker {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--indigo-l);
          margin-bottom: 44px;
          display: flex; align-items: center; gap: 14px;
          opacity: 0;
          animation: rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s forwards;
        }

        .hero-kicker::before {
          content: ''; flex-shrink: 0;
          width: 28px; height: 0.5px; background: var(--indigo-l);
        }

        .hero-h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(58px, 7.5vw, 110px);
          font-weight: 400; line-height: 0.9;
          letter-spacing: -2px; color: var(--white);
          margin-bottom: 0;
          opacity: 0;
          animation: rise 1s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
        }

        .hero-h1 em {
          font-style: italic; color: var(--indigo-l);
        }

        .hero-h1 .g-word {
          color: var(--gold);
          font-style: italic;
        }

        .hero-rule {
          width: 100%; height: 0.5px;
          background: linear-gradient(90deg, var(--indigo), transparent);
          margin: 48px 0;
          opacity: 0;
          animation: rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s forwards;
        }

        .hero-bottom {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
          opacity: 0;
          animation: rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s forwards;
        }

        .hero-desc {
          font-size: 17px; font-weight: 300;
          color: var(--muted); line-height: 1.7;
          max-width: 420px;
        }

        .hero-desc strong {
          color: var(--white); font-weight: 500;
        }

        .hero-actions {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 20px;
        }

        .hero-stat-row {
          display: flex; gap: 40px;
        }

        .h-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 36px; color: var(--white);
          letter-spacing: -1px; line-height: 1;
          margin-bottom: 4px;
        }
        .h-stat-num span { color: var(--indigo-l); }

        .h-stat-label {
          font-size: 11px; color: var(--muted);
          font-weight: 300; line-height: 1.4;
        }

        /* ── VAULT SECTION ── */
        .vault-section {
          position: relative; z-index: 1;
          padding: 0 56px 120px;
          max-width: 1280px; margin: 0 auto;
        }

        .vault-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 32px;
          display: flex; align-items: center; gap: 14px;
        }

        .vault-label::before {
          content: ''; flex-shrink: 0;
          width: 28px; height: 0.5px; background: var(--muted);
        }

        .vault {
          background: var(--surface);
          border: 0.5px solid var(--border2);
          border-radius: 20px;
          overflow: hidden;
        }

        .vault-top {
          padding: 40px 48px;
          border-bottom: 0.5px solid var(--border);
          display: flex; align-items: center;
          justify-content: space-between;
        }

        .vault-title {
          font-family: 'Geist Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--muted);
        }

        .vault-id {
          font-family: 'Geist Mono', monospace;
          font-size: 13px; color: var(--indigo-l);
          letter-spacing: 0.06em;
        }

        .vault-status {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
        }

        .status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 8px var(--green);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .vault-body {
          display: grid; grid-template-columns: 1fr 120px 1fr;
          align-items: center; gap: 0;
          padding: 56px 48px;
        }

        /* PARTY NODE */
        .party {
          display: flex; flex-direction: column; gap: 20px;
        }

        .party-role {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
        }

        .party-identity {
          display: flex; align-items: center; gap: 14px;
        }

        .party-avatar {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--surface3);
          border: 0.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Geist', sans-serif;
          font-size: 16px; font-weight: 600; color: var(--white);
          flex-shrink: 0;
        }

        .party-name {
          font-family: 'Geist', sans-serif;
          font-size: 18px; font-weight: 600;
          color: var(--white); letter-spacing: -0.3px;
        }

        .party-verified {
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: var(--green);
          display: flex; align-items: center; gap: 5px;
        }

        .party-amount {
          font-family: 'Instrument Serif', serif;
          font-size: 40px; letter-spacing: -1.5px;
          color: var(--white); line-height: 1;
        }

        .party-amount.receiver {
          color: var(--muted);
          font-style: italic;
        }

        .party-amount.released {
          color: var(--green);
          font-style: normal;
          transition: color 0.5s;
        }

        .party-sub {
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: var(--muted);
          letter-spacing: 0.04em;
        }

        .party-sub.locked { color: var(--indigo-l); }
        .party-sub.released-sub { color: var(--green); }

        /* WIRE */
        .wire-col {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
        }

        .wire {
          width: 100%; height: 1px; position: relative;
          background: linear-gradient(90deg,
            transparent,
            rgba(91,79,232,0.4),
            var(--indigo),
            rgba(91,79,232,0.4),
            transparent
          );
        }

        .wire-pulse {
          position: absolute;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--indigo);
          top: 50%; transform: translateY(-50%);
          box-shadow: 0 0 12px var(--indigo);
          animation: wire-travel 2s ease-in-out infinite;
        }

        @keyframes wire-travel {
          0% { left: -5px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: calc(100% - 5px); opacity: 0; }
        }

        .wire-badge {
          font-family: 'Geist Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px; border-radius: 4px;
          white-space: nowrap;
          transition: all 0.4s;
        }

        .wire-badge.linked {
          color: var(--indigo-l);
          background: var(--indigo-d);
          border: 0.5px solid rgba(91,79,232,0.25);
        }

        .wire-badge.released {
          color: var(--green);
          background: rgba(61,186,120,0.1);
          border: 0.5px solid rgba(61,186,120,0.25);
        }

        /* VAULT AUDIT */
        .vault-audit {
          border-top: 0.5px solid var(--border);
          padding: 28px 48px;
          display: flex; gap: 40px; overflow-x: auto;
        }

        .audit-entry {
          display: flex; flex-direction: column; gap: 4px;
          flex-shrink: 0;
          opacity: 0; animation: fadeIn 0.4s ease forwards;
        }

        .audit-time {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: var(--muted);
          letter-spacing: 0.04em;
        }

        .audit-event {
          font-size: 12px; color: var(--white);
          font-weight: 400;
        }

        .audit-actor {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: var(--indigo-l);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── FULL-WIDTH DIVIDER ── */
        .fw-divider {
          height: 0.5px;
          background: var(--border);
          position: relative; z-index: 1;
        }

        /* ── SECTION ── */
        .section {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 100px 56px;
        }

        .s-kicker {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--indigo-l);
          margin-bottom: 20px;
        }

        .s-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 4vw, 58px);
          font-weight: 400; line-height: 1;
          letter-spacing: -1.5px; color: var(--white);
          margin-bottom: 20px;
        }

        .s-h2 em { font-style: italic; color: var(--indigo-l); }

        .s-sub {
          font-size: 15px; color: var(--muted);
          font-weight: 300; line-height: 1.7;
          max-width: 480px; margin-bottom: 56px;
        }

        /* ── DEAL FLOW ── */
        .flow {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          position: relative;
        }

        .flow::before {
          content: '';
          position: absolute;
          top: 32px; left: 32px; right: 32px;
          height: 0.5px;
          background: linear-gradient(90deg,
            transparent,
            var(--indigo) 20%,
            var(--indigo) 80%,
            transparent
          );
          z-index: 0;
        }

        .flow-step {
          display: flex; flex-direction: column;
          align-items: flex-start;
          padding: 0 24px 0 0;
          position: relative; z-index: 1;
        }

        .flow-node {
          width: 64px; height: 64px; border-radius: 14px;
          background: var(--surface2);
          border: 0.5px solid var(--border2);
          display: flex; align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: border-color 0.3s, background 0.3s;
        }

        .flow-step.active .flow-node {
          background: var(--indigo-d);
          border-color: rgba(91,79,232,0.4);
        }

        .flow-step.done .flow-node {
          background: rgba(61,186,120,0.08);
          border-color: rgba(61,186,120,0.3);
        }

        .flow-n {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: var(--muted);
          letter-spacing: 0.1em; margin-bottom: 8px;
        }

        .flow-title {
          font-family: 'Geist', sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--white); margin-bottom: 6px;
        }

        .flow-desc {
          font-size: 12px; color: var(--muted);
          font-weight: 300; line-height: 1.5;
        }

        /* ── MODES ── */
        .modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }

        .mode {
          background: var(--surface);
          padding: 48px 40px;
          position: relative;
          transition: background 0.25s;
        }

        .mode:hover { background: var(--surface2); }

        .mode::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: var(--indigo);
          opacity: 0; transition: opacity 0.25s;
        }

        .mode:hover::after { opacity: 1; }

        .mode-n {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          color: var(--faint); margin-bottom: 32px;
        }

        .mode-icon-wrap {
          width: 52px; height: 52px; border-radius: 12px;
          background: var(--surface3);
          border: 0.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }

        .mode-title {
          font-family: 'Instrument Serif', serif;
          font-size: 26px; font-weight: 400;
          color: var(--white); letter-spacing: -0.5px;
          margin-bottom: 12px; line-height: 1.1;
        }

        .mode-desc {
          font-size: 14px; color: var(--muted);
          font-weight: 300; line-height: 1.65;
          margin-bottom: 28px;
        }

        .mode-range {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px; color: var(--gold);
          background: var(--gold-d);
          border: 0.5px solid rgba(201,168,76,0.18);
          padding: 5px 12px; border-radius: 6px;
        }

        .mode-list {
          list-style: none; margin-top: 20px;
          display: flex; flex-direction: column; gap: 8px;
        }

        .mode-list li {
          font-size: 13px; color: var(--muted);
          font-weight: 300;
          display: flex; align-items: flex-start; gap: 10px;
          line-height: 1.4;
        }

        .mode-list li::before {
          content: '';
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--indigo);
          flex-shrink: 0; margin-top: 6px;
        }

        /* ── PAYOUT ── */
        .payout-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px; background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }

        .payout-row-g {
          background: var(--surface);
          padding: 28px 36px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center; gap: 24px;
          transition: background 0.2s;
          border-bottom: 0.5px solid var(--border);
        }

        .payout-row-g:hover { background: var(--surface2); }
        .payout-row-g:last-child,
        .payout-row-g:nth-last-child(2) { border-bottom: none; }

        .payout-row-g.header-row {
          background: rgba(91,79,232,0.06);
          padding: 16px 36px;
          cursor: default;
        }

        .payout-row-g.header-row:hover { background: rgba(91,79,232,0.06); }

        .p-method {
          font-size: 14px; font-weight: 400; color: var(--white);
          margin-bottom: 3px;
        }

        .p-desc {
          font-size: 12px; color: var(--muted); font-weight: 300;
        }

        .p-speed {
          font-family: 'Geist Mono', monospace;
          font-size: 13px; font-weight: 500;
          color: var(--green); text-align: right;
          white-space: nowrap;
        }

        .p-speed.slow { color: var(--muted); }

        /* ── PRINCIPLES ── */
        .principles-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px; background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }

        .prin {
          background: var(--surface);
          padding: 32px 28px;
          transition: background 0.2s;
        }

        .prin:hover { background: var(--surface2); }

        .prin-n {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: var(--faint);
          margin-bottom: 16px; letter-spacing: 0.08em;
        }

        .prin-line {
          width: 24px; height: 1px;
          background: var(--indigo);
          margin-bottom: 16px;
          transition: width 0.3s;
        }

        .prin:hover .prin-line { width: 40px; }

        .prin-title {
          font-size: 13px; font-weight: 500;
          color: var(--white); line-height: 1.35;
          letter-spacing: -0.1px;
        }

        /* ── BOTTOM STATEMENT ── */
        .statement-section {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 100px 56px 140px;
        }

        .statement-box {
          background: var(--surface);
          border: 0.5px solid var(--border2);
          border-radius: 24px; padding: 96px 80px;
          position: relative; overflow: hidden;
          text-align: center;
        }

        .statement-box::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 400px; height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .statement-box::after {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(91,79,232,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .statement-inner { position: relative; z-index: 1; }

        .statement-kicker {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold);
          margin-bottom: 40px;
          display: flex; align-items: center;
          justify-content: center; gap: 14px;
        }

        .statement-kicker::before,
        .statement-kicker::after {
          content: ''; flex: 1; max-width: 60px;
          height: 0.5px; background: var(--gold);
          opacity: 0.4;
        }

        .statement-h {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 400; line-height: 1.05;
          letter-spacing: -1.5px; color: var(--white);
          margin-bottom: 28px;
          max-width: 800px; margin-left: auto; margin-right: auto;
        }

        .statement-h em {
          font-style: italic; color: var(--indigo-l);
        }

        .statement-p {
          font-size: 16px; color: var(--muted);
          font-weight: 300; line-height: 1.7;
          max-width: 540px; margin: 0 auto 56px;
        }

        .statement-badges {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 8px;
          margin-top: 48px;
        }

        .s-badge {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          color: var(--muted);
          background: rgba(255,255,255,0.03);
          border: 0.5px solid var(--border2);
          padding: 6px 14px; border-radius: 6px;
        }

        /* ── FOOTER ── */
        footer {
          position: relative; z-index: 1;
          border-top: 0.5px solid var(--border);
          padding: 48px 56px;
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between;
        }

        .f-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Geist', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--white); letter-spacing: -0.3px;
        }

        .f-nav {
          display: flex; gap: 28px; list-style: none;
        }

        .f-nav a {
          font-size: 13px; color: var(--muted); font-weight: 300;
          text-decoration: none; transition: color 0.15s;
        }

        .f-nav a:hover { color: var(--white); }

        .f-right {
          font-family: 'Geist Mono', monospace;
          font-size: 10px; color: var(--faint);
          letter-spacing: 0.06em;
        }

        /* ── ANIMATIONS ── */
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .nav { padding: 0 24px; }
          .nav-center { display: none; }
          .hero { padding: 120px 24px 60px; }
          .hero-h1 { letter-spacing: -1.5px; }
          .hero-bottom { grid-template-columns: 1fr; gap: 40px; }
          .hero-actions { align-items: flex-start; }
          .hero-stat-row { gap: 24px; }
          .vault-section { padding: 0 24px 80px; }
          .vault-body { grid-template-columns: 1fr; gap: 32px; padding: 32px 24px; }
          .wire-col { flex-direction: row; }
          .wire { width: 100%; height: 1px; }
          .vault-audit { padding: 24px; }
          .vault-top { padding: 24px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .section { padding: 60px 24px; }
          .flow { grid-template-columns: 1fr; gap: 32px; }
          .flow::before { display: none; }
          .modes-grid { grid-template-columns: 1fr; }
          .payout-grid { grid-template-columns: 1fr; }
          .principles-grid { grid-template-columns: repeat(2, 1fr); }
          .statement-section { padding: 60px 24px 80px; }
          .statement-box { padding: 56px 32px; }
          footer { flex-direction: column; gap: 24px; padding: 40px 24px; text-align: center; }
          .f-nav { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* BG LAYERS */}
      <div className="g-grid" />
      <div className="g-glow-a" />
      <div className="g-glow-b" />

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <svg className="nav-mark" viewBox="0 0 30 30" fill="none">
            <circle cx="7" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.25"/>
            <circle cx="23" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.25"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5B4FE8" strokeWidth="1.25"/>
            <circle cx="15" cy="15" r="2.5" fill="#5B4FE8"/>
            <circle cx="7" cy="15" r="2" fill="#5B4FE8"/>
            <circle cx="23" cy="15" r="2" fill="#5B4FE8"/>
          </svg>
          Gagara
        </a>
        <div className="nav-center">
          <a href="#deal">How a deal works</a>
          <a href="#modes">Deal modes</a>
          <a href="#payouts">Payouts</a>
          <a href="#principles">Principles</a>
        </div>
        <div className="nav-right">
          <span className="nav-tag">In development</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-kicker">
          Programmable escrow — built on Interledger Open Payments
        </div>
        <h1 className="hero-h1">
          The oldest problem<br/>
          in work — <em>solved.</em>
        </h1>
        <div className="hero-rule" />
        <div className="hero-bottom">
          <p className="hero-desc">
            How do you trust a stranger with your money — or your time —
            before the relationship is proven?<br/><br/>
            <strong>Gagara locks funds and makes them visible to both parties.</strong> Neither can touch the money alone. Release only happens when both sides confirm.
          </p>
          <div className="hero-actions">
            <div className="hero-stat-row">
              <div>
                <div className="h-stat-num">3<span>×</span></div>
                <div className="h-stat-label">Deal modes —<br/>Personal · Business · Enterprise</div>
              </div>
              <div>
                <div className="h-stat-num">&lt;<span>1s</span></div>
                <div className="h-stat-label">Internal release<br/>speed on Gagara</div>
              </div>
              <div>
                <div className="h-stat-num"><span>∞</span></div>
                <div className="h-stat-label">Simultaneous<br/>deals per user</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLASS VAULT ── */}
      <div className="vault-section" id="deal">
        <div className="vault-label">The glass vault — live deal</div>
        <div className="vault">
          <div className="vault-top">
            <div>
              <div className="vault-title">Deal</div>
              <div className="vault-id" style={{marginTop:6}}>GGR-4829-KXMT</div>
            </div>
            <div className="vault-status" style={{color: released ? 'var(--green)' : 'var(--muted)'}}>
              <div className="status-dot" style={{background: released ? 'var(--green)' : linked ? 'var(--indigo-l)' : 'var(--muted)', boxShadow: released ? '0 0 8px var(--green)' : linked ? '0 0 8px var(--indigo-l)' : 'none'}} />
              {released ? 'Completed' : funded ? 'Funded & locked' : linked ? 'Linked' : 'Pending link'}
            </div>
          </div>

          <div className="vault-body">
            {/* PAYER */}
            <div className="party">
              <div className="party-role">Payer</div>
              <div className="party-identity">
                <div className="party-avatar">G</div>
                <div>
                  <div className="party-name">@gaga</div>
                  <div className="party-verified">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.5" fill="var(--green)" fillOpacity="0.15" stroke="var(--green)" strokeWidth="0.5"/>
                      <path d="M3 5l1.5 1.5L7 3.5" stroke="var(--green)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    KYC verified
                  </div>
                </div>
              </div>
              <div>
                <div className="party-amount">$800.00</div>
                <div className={`party-sub ${funded ? 'locked' : ''}`} style={{marginTop:6}}>
                  {funded ? '⟳ locked in escrow' : 'funding...'}
                </div>
              </div>
            </div>

            {/* WIRE */}
            <div className="wire-col">
              <div className="wire">
                {linked && <div className="wire-pulse"/>}
              </div>
              <div className={`wire-badge ${released ? 'released' : 'linked'}`}>
                {released ? 'released' : linked ? '⚡ linked' : 'pending'}
              </div>
            </div>

            {/* RECEIVER */}
            <div className="party" style={{alignItems:'flex-end', textAlign:'right'}}>
              <div className="party-role">Receiver</div>
              <div className="party-identity" style={{flexDirection:'row-reverse'}}>
                <div className="party-avatar">C</div>
                <div style={{textAlign:'right'}}>
                  <div className="party-name">@client</div>
                  <div className="party-verified" style={{justifyContent:'flex-end'}}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4.5" fill="var(--green)" fillOpacity="0.15" stroke="var(--green)" strokeWidth="0.5"/>
                      <path d="M3 5l1.5 1.5L7 3.5" stroke="var(--green)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    KYC verified
                  </div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className={`party-amount ${released ? 'released' : 'receiver'}`}>
                  {released ? '$800.00' : 'awaiting'}
                </div>
                <div className={`party-sub ${released ? 'released-sub' : ''}`} style={{marginTop:6}}>
                  {released ? '✓ funds received' : 'confirmation pending'}
                </div>
              </div>
            </div>
          </div>

          {/* AUDIT LOG */}
          <div className="vault-audit">
            {[
              {time:'09:12:04', event:'Deal created', actor:'@gaga'},
              ...(linked ? [{time:'09:15:22', event:'Deal linked — The Link closed', actor:'@client accepted'}] : []),
              ...(funded ? [{time:'09:23:41', event:'$800.00 locked in escrow', actor:'@gaga funded'}] : []),
              ...(activeStep >= 1 ? [{time:'10:44:08', event:'Milestone 1 marked complete', actor:'@client'}] : []),
              ...(activeStep >= 2 ? [{time:'11:02:15', event:'Completion confirmed', actor:'@gaga'}] : []),
              ...(released ? [{time:'11:02:16', event:'$800.00 released via Interledger', actor:'→ instant transfer'}] : []),
            ].map((e,i) => (
              <div key={i} className="audit-entry" style={{animationDelay:`${i*0.1}s`}}>
                <div className="audit-time">{e.time}</div>
                <div className="audit-event">{e.event}</div>
                <div className="audit-actor">{e.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fw-divider" />

      {/* ── DEAL FLOW ── */}
      <section className="section">
        <div className="s-kicker">Deal flow</div>
        <h2 className="s-h2">Five states. <em>No exceptions.</em></h2>
        <p className="s-sub">
          Every deal on Gagara follows the same deterministic sequence.
          No state can be skipped. Every transition is logged permanently.
        </p>
        <div className="flow">
          {[
            {
              n:'01', title:'Pending Link',
              desc:'Deal created. Code generated. Awaiting receiver to connect.',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            },
            {
              n:'02', title:'Linked',
              desc:'Both parties connected. The Link closed. Awaiting fund lock.',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            },
            {
              n:'03', title:'Funded & Locked',
              desc:'Funds in escrow. Visible to both. Neither can act alone. Work begins.',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            },
            {
              n:'04', title:'Confirming',
              desc:'Conditions met. Both parties confirm. Every action is recorded.',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            },
            {
              n:'05', title:'Released',
              desc:'Payout routed instantly via Interledger. Deal archived permanently.',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            },
          ].map((s,i) => (
            <div key={i} className={`flow-step ${i === activeStep ? 'active' : ''} ${i < activeStep || released ? 'done' : ''}`}>
              <div className="flow-node" style={{color: i < activeStep || released ? 'var(--green)' : i === activeStep ? 'var(--indigo-l)' : 'var(--muted)'}}>
                {s.icon}
              </div>
              <div className="flow-n">{s.n}</div>
              <div className="flow-title">{s.title}</div>
              <div className="flow-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="fw-divider" />

      {/* ── MODES ── */}
      <section className="section" id="modes">
        <div className="s-kicker">Deal modes</div>
        <h2 className="s-h2">One platform. <em>Every context.</em></h2>
        <p className="s-sub">
          Account type is set once at signup — who you are legally on Gagara.
          Deal mode is chosen each time — what kind of agreement this is.
        </p>
        <div className="modes-grid">
          {[
            {
              n:'01',
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.25" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
              title:'Personal',
              desc:'Informal agreements, freelance work, P2P transactions. Simple terms, fast setup.',
              range:'$1 – $2,000',
              items:['Single-release condition','48-hour Deal Code expiry','Instant mutual release','Full audit trail']
            },
            {
              n:'02',
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-l)" strokeWidth="1.25" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              title:'Business',
              desc:'Service contracts, supplier agreements, milestone-based deals between SMBs and individuals.',
              range:'$200 – $50,000',
              items:['Multi-milestone releases','Flexible timeline editing','Invoice generation','Priority dispute resolution']
            },
            {
              n:'03',
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.25" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
              title:'Enterprise',
              desc:'Large multi-milestone contracts, multi-party agreements, API-driven integrations.',
              range:'$10,000+',
              items:['Multi-party deals','API access','Compliance documentation','Dedicated mediation']
            },
          ].map((m,i) => (
            <div key={i} className="mode">
              <div className="mode-n">{m.n}</div>
              <div className="mode-icon-wrap">{m.icon}</div>
              <div className="mode-title">{m.title}</div>
              <div className="mode-desc">{m.desc}</div>
              <div className="mode-range">{m.range}</div>
              <ul className="mode-list">
                {m.items.map((item,j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="fw-divider" />

      {/* ── PAYOUTS ── */}
      <section className="section" id="payouts">
        <div className="s-kicker">Payout infrastructure</div>
        <h2 className="s-h2">Fastest route to <em>your money.</em></h2>
        <p className="s-sub">
          The receiver chooses. Gagara shows speed before confirmation — always.
          Powered by Interledger Protocol: currency-agnostic, network-agnostic.
        </p>
        <div className="payout-grid">
          <div className="payout-row-g header-row" style={{gridColumn:'1/-1'}}>
            <span style={{fontFamily:'Geist Mono', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--faint)'}}>Method</span>
            <span style={{fontFamily:'Geist Mono', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--faint)', textAlign:'right'}}>Estimated speed</span>
          </div>
          {[
            {method:'Gagara internal transfer', desc:'Both parties on Gagara — funds stay on-network', speed:'< 1 second', fast:true},
            {method:'SEPA Instant', desc:'European bank accounts — always-on instant rail', speed:'< 10 seconds', fast:true},
            {method:'Faster Payments (UK)', desc:'UK bank accounts — free, 24/7', speed:'< 2 minutes', fast:true},
            {method:'Stablecoin (USDC · USDT)', desc:'Cross-border, unbanked — minimal operational cost', speed:'2 – 5 minutes', fast:true},
            {method:'Mobile wallet (M-Pesa · GCash)', desc:'Africa · Southeast Asia — reaches the unbanked', speed:'< 5 minutes', fast:true},
            {method:'Standard bank transfer', desc:'Universal fallback — all global accounts', speed:'1 – 3 days', fast:false},
          ].map((p,i) => (
            <div key={i} className="payout-row-g">
              <div>
                <div className="p-method">{p.method}</div>
                <div className="p-desc">{p.desc}</div>
              </div>
              <div className={`p-speed ${p.fast ? '' : 'slow'}`}>{p.speed}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="fw-divider" />

      {/* ── PRINCIPLES ── */}
      <section className="section" id="principles">
        <div className="s-kicker">The standard</div>
        <h2 className="s-h2">Ten principles. <em>Every decision.</em></h2>
        <p className="s-sub">
          Every feature, screen, and line of code is measured against these.
          If something does not serve all ten — we do not build it.
        </p>
        <div className="principles-grid">
          {[
            {n:'01', title:'Trustworthy'},
            {n:'02', title:'Mathematically logical'},
            {n:'03', title:'Encrypted without compromise'},
            {n:'04', title:'Modern'},
            {n:'05', title:'Premium'},
            {n:'06', title:'Exceptional user experience'},
            {n:'07', title:'Uniquely Gagara'},
            {n:'08', title:'Consistent'},
            {n:'09', title:'Mobile-first'},
            {n:'10', title:"Giant's vision"},
          ].map((p,i) => (
            <div key={i} className="prin">
              <div className="prin-n">{p.n}</div>
              <div className="prin-line"/>
              <div className="prin-title">{p.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <div className="statement-section">
        <div className="statement-box">
          <div className="statement-inner">
            <div className="statement-kicker">Built on Interledger Open Payments</div>
            <h2 className="statement-h">
              Trust is <em>built into</em><br/>the system.
            </h2>
            <p className="statement-p">
              Gagara is being built now. The infrastructure for trust in work —
              transparent, encrypted, mathematically certain — for everyone,
              everywhere.
            </p>
            <div className="statement-badges">
              {['Interledger Open Payments','ILP Protocol','Web Monetization','AES-256 Encryption','KYC Verified','Audit Trail','Mobile-first'].map((b,i) => (
                <span key={i} className="s-badge">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="f-logo">
          <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
            <circle cx="7" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.25"/>
            <circle cx="23" cy="15" r="5" stroke="#5B4FE8" strokeWidth="1.25"/>
            <line x1="12" y1="15" x2="18" y2="15" stroke="#5B4FE8" strokeWidth="1.25"/>
            <circle cx="15" cy="15" r="2.5" fill="#5B4FE8"/>
            <circle cx="7" cy="15" r="2" fill="#5B4FE8"/>
            <circle cx="23" cy="15" r="2" fill="#5B4FE8"/>
          </svg>
          Gagara
        </div>
        <ul className="f-nav">
          <li><a href="#deal">How a deal works</a></li>
          <li><a href="#modes">Deal modes</a></li>
          <li><a href="#payouts">Payouts</a></li>
          <li><a href="#principles">Principles</a></li>
        </ul>
        <div className="f-right">v0.1 · In development · June 2026</div>
      </footer>
    </>
  );
}
