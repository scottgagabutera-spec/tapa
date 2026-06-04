"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0D1B2A", surface: "#1A2F45", border: "#243B55",
  accent: "#E84855", accentDark: "#C73641", accentGlow: "rgba(232,72,85,0.12)",
  text: "#F8F9FA", muted: "#8B9BB4", inputBg: "#0A1520",
  white: "#FFFFFF", whiteDim: "#F0F4F8",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // If no error, browser redirects automatically
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
        router.push(profile?.role === "carrier" ? "/dashboard/carrier" : "/dashboard/sender");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "14px 16px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "12px", color: C.text, fontSize: "15px", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s ease", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #3D5166; }
        .tb { transition: transform 120ms ease, filter 120ms ease; }
        .tb:active { transform: scale(0.97) !important; filter: brightness(0.88) !important; }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px clamp(16px,4vw,24px)", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s ease", background: scrolled ? "rgba(13,27,42,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", background: C.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${C.accentGlow}` }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="13" cy="18" r="4" fill="none" stroke="white" stroke-width="1.8"/><circle cx="13" cy="18" r="1.6" fill="white"/><line x1="13" y1="22" x2="13" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="13" y1="26" x2="35" y2="16" stroke="white" stroke-width="1" stroke-dasharray="3 2.5" stroke-linecap="round"/><circle cx="35" cy="13" r="5" fill="white"/><circle cx="35" cy="13" r="2" fill="#E84855"/><line x1="35" y1="18" x2="35" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>tapa</span>
        </a>
        <a href="/auth/signup" className="tb" style={{ padding: "8px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, fontSize: "14px", fontWeight: 500, textDecoration: "none", display: "inline-block" }}>Create account</a>
      </nav>

      <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px clamp(16px,4vw,24px) 40px", position: "relative", zIndex: 1 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", width: "100%", maxWidth: "440px", padding: "clamp(28px,5vw,40px)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ width: "36px", height: "36px", background: C.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="13" cy="18" r="4" fill="none" stroke="white" stroke-width="1.8"/><circle cx="13" cy="18" r="1.6" fill="white"/><line x1="13" y1="22" x2="13" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="13" y1="26" x2="35" y2="16" stroke="white" stroke-width="1" stroke-dasharray="3 2.5" stroke-linecap="round"/><circle cx="35" cy="13" r="5" fill="white"/><circle cx="35" cy="13" r="2" fill="#E84855"/><line x1="35" y1="18" x2="35" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <span style={{ fontSize: "22px", fontWeight: 700, color: C.text }}>tapa</span>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: C.text, marginBottom: "8px", letterSpacing: "-0.5px" }}>Welcome back</h1>
            <p style={{ fontSize: "15px", color: C.muted }}>Sign in to continue shipping smarter</p>
          </div>

          {error && <div style={{ background: "rgba(232,72,85,0.1)", border: "1px solid rgba(232,72,85,0.3)", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: C.accent, textAlign: "center", marginBottom: "16px" }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "0" }}>
            {/* Google */}
            <button className="tb" onClick={handleGoogleLogin} disabled={googleLoading}
              style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: `1px solid ${C.border}`, background: C.white, color: "#1A1A2E", fontSize: "15px", fontWeight: 600, cursor: googleLoading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "inherit", opacity: googleLoading ? 0.7 : 1 }}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>

            {/* Email toggle */}
            <button className="tb" style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: "15px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "inherit" }}
              onClick={() => setShowEmailForm(!showEmailForm)}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Continue with Email
            </button>
          </div>

          {showEmailForm && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
                <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500 }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" style={inp}
                  onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={inp}
                    onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()} />
                  <div style={{ textAlign: "right", marginTop: "6px" }}><a href="#" style={{ fontSize: "13px", color: C.accent, fontWeight: 500, textDecoration: "none" }}>Forgot password?</a></div>
                </div>
                <button className="tb" style={{ width: "100%", padding: "14px", background: C.accent, border: "none", borderRadius: "12px", color: C.text, fontSize: "15px", fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", boxShadow: `0 4px 20px rgba(232,72,85,0.3)`, opacity: loading ? 0.8 : 1 }} onClick={handleLogin}>
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </div>
            </>
          )}

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: C.muted }}>
            Don't have an account?{" "}<a href="/auth/signup" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Sign up</a>
          </p>
        </div>
      </main>
    </div>
  );
}
