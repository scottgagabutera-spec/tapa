"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0D1B2A", surface: "#1A2F45", border: "#243B55", borderHover: "#2E4A6A",
  accent: "#E84855", accentDark: "#C73641", accentGlow: "rgba(232,72,85,0.12)", accentSoft: "rgba(232,72,85,0.08)",
  text: "#F8F9FA", muted: "#8B9BB4", inputBg: "#0A1520",
  white: "#FFFFFF", whiteDim: "#F0F4F8", green: "#2D9E6B", greenSoft: "rgba(45,158,107,0.1)",
};

type Role = "sender" | "carrier" | "both" | null;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleGoogleSignup = async () => {
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
  };

  const handleCreateAccount = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from("profiles").upsert({ id: data.user.id, name, role: "sender" });
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetRole = async () => {
    if (!role) return;
    setLoading(true); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ role }).eq("id", user.id);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "14px 16px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: "12px", color: C.text, fontSize: "15px", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s ease", boxSizing: "border-box" };

  const roleCard = (r: Role): React.CSSProperties => ({
    background: role === r ? C.accentSoft : C.inputBg,
    border: `2px solid ${role === r ? C.accent : C.border}`,
    borderRadius: "16px", padding: "24px 16px", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    transition: "all 0.2s ease",
    transform: role === r ? "translateY(-2px)" : "none",
    boxShadow: role === r ? `0 8px 24px ${C.accentGlow}` : "none",
  });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #3D5166; }
        .tb { transition: transform 120ms ease, filter 120ms ease; }
        .tb:active { transform: scale(0.97) !important; filter: brightness(0.88) !important; }
        @media (max-width: 400px) { .role-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", background: C.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${C.accentGlow}` }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="13" cy="18" r="4" fill="none" stroke="white" stroke-width="1.8"/><circle cx="13" cy="18" r="1.6" fill="white"/><line x1="13" y1="22" x2="13" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="13" y1="26" x2="35" y2="16" stroke="white" stroke-width="1" stroke-dasharray="3 2.5" stroke-linecap="round"/><circle cx="35" cy="13" r="5" fill="white"/><circle cx="35" cy="13" r="2" fill="#E84855"/><line x1="35" y1="18" x2="35" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>tapa</span>
        </a>
        <a href="/auth/login" className="tb" style={{ padding: "8px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, fontSize: "14px", fontWeight: 500, textDecoration: "none", display: "inline-block" }}>Sign in</a>
      </nav>

      <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "600px", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "20px", width: "100%", maxWidth: step === 2 ? "500px" : "440px", padding: "40px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", opacity: mounted && !animating ? 1 : 0, transform: mounted && !animating ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.3s ease, transform 0.3s ease, max-width 0.3s ease" }}>

          {/* Progress dots */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
            {[1, 2].map(n => (
              <div key={n} style={{ height: "8px", borderRadius: "4px", transition: "all 0.3s ease", width: step === n ? "24px" : "8px", background: step >= n ? C.accent : C.border }} />
            ))}
          </div>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "36px", height: "36px", background: C.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><circle cx="13" cy="18" r="4" fill="none" stroke="white" stroke-width="1.8"/><circle cx="13" cy="18" r="1.6" fill="white"/><line x1="13" y1="22" x2="13" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/><line x1="13" y1="26" x2="35" y2="16" stroke="white" stroke-width="1" stroke-dasharray="3 2.5" stroke-linecap="round"/><circle cx="35" cy="13" r="5" fill="white"/><circle cx="35" cy="13" r="2" fill="#E84855"/><line x1="35" y1="18" x2="35" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <span style={{ fontSize: "22px", fontWeight: 700, color: C.text }}>tapa</span>
            </div>

            {emailSent ? (
              <>
                <h1 style={{ fontSize: "26px", fontWeight: 700, color: C.text, marginBottom: "8px", letterSpacing: "-0.5px" }}>Check your email</h1>
                <p style={{ fontSize: "15px", color: C.muted, lineHeight: 1.6 }}>We sent a confirmation link to <strong style={{ color: C.text }}>{email}</strong>. Click it to verify, then sign in.</p>
              </>
            ) : step === 1 ? (
              <>
                <h1 style={{ fontSize: "26px", fontWeight: 700, color: C.text, marginBottom: "8px", letterSpacing: "-0.5px" }}>Join Tapa</h1>
                <p style={{ fontSize: "15px", color: C.muted }}>Ship anything, anywhere.</p>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: "26px", fontWeight: 700, color: C.text, marginBottom: "8px", letterSpacing: "-0.5px" }}>How will you use Tapa?</h1>
                <p style={{ fontSize: "15px", color: C.muted, lineHeight: 1.5 }}>You can always do both — change anytime in settings.</p>
              </>
            )}
          </div>

          {error && <div style={{ background: "rgba(232,72,85,0.1)", border: "1px solid rgba(232,72,85,0.3)", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: C.accent, marginBottom: "14px", textAlign: "center" }}>{error}</div>}

          {emailSent ? (
            <>
              <div style={{ background: C.greenSoft, border: "1px solid rgba(45,158,107,0.3)", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: C.green, marginBottom: "14px", textAlign: "center", fontWeight: 600 }}>✓ Account created — confirmation email sent</div>
              <button className="tb" style={{ width: "100%", padding: "14px", background: C.accent, border: "none", borderRadius: "12px", color: C.text, fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={() => router.push("/auth/login")}>Go to Sign In</button>
              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: C.muted }}>Didn't get it? <span style={{ color: C.accent, fontWeight: 600, cursor: "pointer" }} onClick={handleCreateAccount}>Resend</span></p>
            </>
          ) : step === 1 ? (
            <>
              {/* Google */}
              <button className="tb" onClick={handleGoogleSignup} disabled={googleLoading}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: `1px solid ${C.border}`, background: C.white, color: "#1A1A2E", fontSize: "15px", fontWeight: 600, cursor: googleLoading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "inherit", marginBottom: "10px", opacity: googleLoading ? 0.7 : 1 }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? "Redirecting…" : "Continue with Google"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
                <span style={{ fontSize: "12px", color: C.muted, fontWeight: 500, letterSpacing: "0.5px" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                <input type="text" placeholder="Full name" style={inp} value={name} onChange={e => setName(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                <input type="email" placeholder="Email address" style={inp} value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                <input type="password" placeholder="Create password (min 6 chars)" style={inp} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)}
                  onKeyDown={e => e.key === "Enter" && handleCreateAccount()} />
              </div>

              <button className="tb" style={{ width: "100%", padding: "14px", background: C.accent, border: "none", borderRadius: "12px", color: C.text, fontSize: "15px", fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", boxShadow: `0 4px 20px rgba(232,72,85,0.3)`, opacity: loading ? 0.8 : 1 }} onClick={handleCreateAccount}>
                {loading ? "Creating account…" : "Create Account"}
              </button>

              <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: C.muted }}>
                Already have an account?{" "}<a href="/auth/login" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Sign in</a>
              </p>
            </>
          ) : (
            <>
              <div className="role-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { r: "sender" as Role, label: "Sender", desc: "Ship items with real travelers going your way", icon: <svg width="22" height="22" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
                  { r: "carrier" as Role, label: "Carrier", desc: "Earn money carrying items on your trips", icon: <svg width="22" height="22" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                ].map(({ r, label, desc, icon }) => (
                  <div key={r} style={roleCard(r)} onClick={() => setRole(role === r ? null : r)}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: role === r ? C.accent : C.border, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", transition: "all 0.2s ease" }}>{icon}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", fontSize: "14px", color: role === "both" ? C.accent : C.muted, cursor: "pointer", marginBottom: "20px", padding: "8px", borderRadius: "8px", transition: "color 0.2s ease", background: role === "both" ? C.accentSoft : "transparent", border: `1px solid ${role === "both" ? C.accent : "transparent"}` }}
                onClick={() => setRole(role === "both" ? null : "both")}>
                {role === "both" ? "✓ I'll do both" : "I'll do both"}
              </div>

              <button className="tb" style={{ width: "100%", padding: "14px", background: role ? C.accent : C.border, border: "none", borderRadius: "12px", color: role ? C.text : C.muted, fontSize: "15px", fontWeight: 700, cursor: role ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: loading ? 0.8 : 1 }} onClick={handleSetRole} disabled={!role || loading}>
                {loading ? "Saving…" : "Get Started"}
              </button>

              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: C.muted }}>
                By continuing you agree to Tapa's{" "}
                <a href="#" style={{ color: C.accent, fontWeight: 500, textDecoration: "none" }}>Terms</a>{" "}&amp;{" "}
                <a href="#" style={{ color: C.accent, fontWeight: 500, textDecoration: "none" }}>Privacy Policy</a>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
