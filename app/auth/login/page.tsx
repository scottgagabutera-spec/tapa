"use client";
import React, { useState, useEffect } from "react";

const C = {
  bg: "#0D1B2A",
  surface: "#1A2F45",
  border: "#243B55",
  borderHover: "#2E4A6A",
  accent: "#E84855",
  accentDark: "#C73641",
  accentGlow: "rgba(232,72,85,0.12)",
  text: "#F8F9FA",
  muted: "#8B9BB4",
  inputBg: "#0A1520",
  white: "#FFFFFF",
  whiteDim: "#F0F4F8",
};

export default function LoginPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const s: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.3s ease",
      background: scrolled ? "rgba(13,27,42,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
    },
    logoWrap: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
    },
    logoIcon: {
      width: "36px",
      height: "36px",
      background: C.accent,
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 16px ${C.accentGlow}`,
    },
    logoText: {
      fontSize: "20px",
      fontWeight: "700",
      color: C.text,
      letterSpacing: "-0.5px",
    },
    glow1: {
      position: "absolute",
      top: "-100px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "600px",
      height: "600px",
      background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
      pointerEvents: "none",
      zIndex: 0,
    },
    glow2: {
      position: "absolute",
      bottom: "-200px",
      right: "-200px",
      width: "500px",
      height: "500px",
      background: "radial-gradient(circle, rgba(13,60,100,0.3) 0%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    main: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px 40px",
      position: "relative",
      zIndex: 1,
    },
    card: {
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: "20px",
      width: "100%",
      maxWidth: "440px",
      padding: "40px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    },
    cardTop: {
      textAlign: "center" as const,
      marginBottom: "32px",
    },
    logoCenter: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "24px",
    },
    h1: {
      fontSize: "28px",
      fontWeight: "700",
      color: C.text,
      margin: "0 0 8px",
      letterSpacing: "-0.5px",
    },
    subtext: {
      fontSize: "15px",
      color: C.muted,
      margin: 0,
      lineHeight: "1.5",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "24px 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: C.border,
    },
    dividerText: {
      fontSize: "12px",
      color: C.muted,
      fontWeight: "500",
      letterSpacing: "0.5px",
    },
    btnGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
      marginBottom: "0",
    },
    btnOauth: {
      width: "100%",
      padding: "13px 16px",
      borderRadius: "12px",
      border: `1px solid ${C.border}`,
      background: C.white,
      color: "#1A1A2E",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    btnEmail: {
      width: "100%",
      padding: "13px 16px",
      borderRadius: "12px",
      border: `1px solid ${C.border}`,
      background: "transparent",
      color: C.muted,
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    emailForm: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      background: C.inputBg,
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      color: C.text,
      fontSize: "15px",
      fontFamily: "inherit",
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box" as const,
    },
    btnPrimary: {
      width: "100%",
      padding: "14px",
      background: C.accent,
      border: "none",
      borderRadius: "12px",
      color: C.text,
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      letterSpacing: "0.2px",
      boxShadow: `0 4px 20px rgba(232,72,85,0.3)`,
    },
    bottomText: {
      textAlign: "center" as const,
      marginTop: "24px",
      fontSize: "14px",
      color: C.muted,
    },
    link: {
      color: C.accent,
      fontWeight: "600",
      textDecoration: "none",
      cursor: "pointer",
    },
    forgotLink: {
      textAlign: "right" as const,
      fontSize: "13px",
    },
  };

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <a href="/" style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 20H4L12 3Z" fill="white" strokeLinejoin="round"/>
              <path d="M12 8V14M12 17V17.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={s.logoText}>tapa</span>
        </a>
        <a href="/auth/signup" style={{
          padding: "8px 20px",
          background: "transparent",
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          color: C.text,
          fontSize: "14px",
          fontWeight: "500",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}>
          Create account
        </a>
      </nav>

      {/* Background glows */}
      <div style={s.glow1} />
      <div style={s.glow2} />

      {/* Main */}
      <main style={s.main}>
        <div style={s.card}>
          {/* Card top */}
          <div style={s.cardTop}>
            <div style={s.logoCenter}>
              <div style={s.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L20 20H4L12 3Z" fill="white"/>
                </svg>
              </div>
              <span style={{...s.logoText, fontSize: "22px"}}>tapa</span>
            </div>
            <h1 style={s.h1}>Welcome back</h1>
            <p style={s.subtext}>Sign in to continue shipping smarter</p>
          </div>

          {/* OAuth buttons */}
          <div style={s.btnGroup}>
            <button
              style={s.btnOauth}
              onMouseEnter={e => (e.currentTarget.style.background = C.whiteDim)}
              onMouseLeave={e => (e.currentTarget.style.background = C.white)}
            >
              {/* Google G */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              style={s.btnOauth}
              onMouseEnter={e => (e.currentTarget.style.background = C.whiteDim)}
              onMouseLeave={e => (e.currentTarget.style.background = C.white)}
            >
              {/* Apple */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.24.72 3.01.76 1.15-.22 2.25-.89 3.47-.76 1.47.17 2.58.82 3.3 2.07-3.04 1.86-2.29 5.94.68 7.05-.47 1.29-1.08 2.56-2.46 3.74zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>

            <button
              style={s.btnEmail}
              onClick={() => setShowEmailForm(!showEmailForm)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.borderHover;
                e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.muted;
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Continue with Email
            </button>
          </div>

          {/* Email form — shown on toggle */}
          {showEmailForm && (
            <>
              <div style={s.divider}>
                <div style={s.dividerLine} />
                <span style={s.dividerText}>OR</span>
                <div style={s.dividerLine} />
              </div>
              <div style={s.emailForm}>
                <input
                  type="email"
                  placeholder="Email address"
                  style={s.input}
                  onFocus={e => (e.target.style.borderColor = C.accent)}
                  onBlur={e => (e.target.style.borderColor = C.border)}
                />
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    style={s.input}
                    onFocus={e => (e.target.style.borderColor = C.accent)}
                    onBlur={e => (e.target.style.borderColor = C.border)}
                  />
                  <div style={s.forgotLink}>
                    <a href="#" style={{...s.link, fontSize: "13px", fontWeight: "500"}}>Forgot password?</a>
                  </div>
                </div>
                <button
                  style={s.btnPrimary}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = C.accentDark;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = C.accent;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Sign In
                </button>
              </div>
            </>
          )}

          {/* Bottom */}
          <p style={s.bottomText}>
            Don't have an account?{" "}
            <a href="/auth/signup" style={s.link}>Sign up</a>
          </p>
        </div>
      </main>
    </div>
  );
}
