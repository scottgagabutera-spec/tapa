"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0D1B2A",
  surface: "#1A2F45",
  border: "#243B55",
  borderHover: "#2E4A6A",
  accent: "#E84855",
  accentDark: "#C73641",
  accentGlow: "rgba(232,72,85,0.12)",
  accentSoft: "rgba(232,72,85,0.08)",
  text: "#F8F9FA",
  muted: "#8B9BB4",
  inputBg: "#0A1520",
  white: "#FFFFFF",
  whiteDim: "#F0F4F8",
  green: "#2D9E6B",
  greenSoft: "rgba(45,158,107,0.1)",
};

const COUNTRY_CODES = [
  { flag: "🇵🇭", code: "+63", name: "PH" },
  { flag: "🇺🇸", code: "+1", name: "US" },
  { flag: "🇬🇧", code: "+44", name: "GB" },
  { flag: "🇮🇳", code: "+91", name: "IN" },
  { flag: "🇰🇪", code: "+254", name: "KE" },
  { flag: "🇳🇬", code: "+234", name: "NG" },
  { flag: "🇨🇭", code: "+41", name: "CH" },
  { flag: "🇩🇪", code: "+49", name: "DE" },
  { flag: "🇧🇷", code: "+55", name: "BR" },
  { flag: "🇦🇺", code: "+61", name: "AU" },
  { flag: "🇸🇬", code: "+65", name: "SG" },
  { flag: "🇯🇵", code: "+81", name: "JP" },
];

type Role = "sender" | "carrier" | "both" | null;

const roleCardStyle = (selected: boolean): React.CSSProperties => ({
  background: selected ? C.accentSoft : C.inputBg,
  border: `2px solid ${selected ? C.accent : C.border}`,
  borderRadius: "16px",
  padding: "24px 16px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "all 0.2s ease",
  transform: selected ? "translateY(-2px)" : "none",
  boxShadow: selected ? `0 8px 24px ${C.accentGlow}` : "none",
});

const roleIconStyle = (selected: boolean): React.CSSProperties => ({
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: selected ? C.accent : C.border,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "14px",
  transition: "all 0.2s ease",
});

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [countryCode, setCountryCode] = useState("+63");
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const goToStep = (next: number) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 200);
  };

  // Step 1 — create account, send confirmation email
  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      if (data.user) {
        // Save basic profile — role will be set in step 2
        await supabase.from("profiles").insert({
          id: data.user.id,
          name,
          phone: "",
          role: "sender", // default, updated in step 2
        });
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — role selection, update profile
  const handleSetRole = async () => {
    if (!role) return;
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ role, phone: countryCode + phone }).eq("id", user.id);
      }
      router.push(role === "carrier" ? "/dashboard/carrier" : "/dashboard/sender");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
    glow: {
      position: "absolute",
      top: "-100px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "700px",
      height: "600px",
      background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
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
      maxWidth: step === 2 ? "500px" : "440px",
      padding: "40px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      opacity: mounted && !animating ? 1 : 0,
      transform: mounted && !animating ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.3s ease, transform 0.3s ease, max-width 0.3s ease",
    },
    progress: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "28px",
    },
    dot: {
      width: "8px",
      height: "8px",
      borderRadius: "4px",
      transition: "all 0.3s ease",
    },
    cardTop: {
      textAlign: "center" as const,
      marginBottom: "28px",
    },
    logoCenter: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    h1: {
      fontSize: "26px",
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
    btnGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
      marginBottom: "20px",
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
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "20px 0",
    },
    dividerLine: { flex: 1, height: "1px", background: C.border },
    dividerText: { fontSize: "12px", color: C.muted, fontWeight: "500", letterSpacing: "0.5px" },
    inputGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
      marginBottom: "16px",
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
      boxShadow: `0 4px 20px rgba(232,72,85,0.3)`,
    },
    btnPrimaryDisabled: {
      width: "100%",
      padding: "14px",
      background: C.border,
      border: "none",
      borderRadius: "12px",
      color: C.muted,
      fontSize: "15px",
      fontWeight: "700",
      cursor: "not-allowed",
      fontFamily: "inherit",
    },
    errorBox: {
      background: "rgba(232,72,85,0.1)",
      border: "1px solid rgba(232,72,85,0.3)",
      borderRadius: "10px",
      padding: "12px 14px",
      fontSize: "13px",
      color: C.accent,
      marginBottom: "14px",
      textAlign: "center" as const,
    },
    successBox: {
      background: C.greenSoft,
      border: "1px solid rgba(45,158,107,0.3)",
      borderRadius: "10px",
      padding: "12px 14px",
      fontSize: "13px",
      color: C.green,
      marginBottom: "14px",
      textAlign: "center" as const,
      fontWeight: "600",
    },
    bottomText: {
      textAlign: "center" as const,
      marginTop: "20px",
      fontSize: "14px",
      color: C.muted,
    },
    link: {
      color: C.accent,
      fontWeight: "600",
      textDecoration: "none",
      cursor: "pointer",
    },
    roleGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "16px",
    },
    roleTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: C.text,
      marginBottom: "6px",
    },
    roleDesc: {
      fontSize: "12px",
      color: C.muted,
      lineHeight: "1.5",
    },
    bothLink: {
      textAlign: "center" as const,
      fontSize: "14px",
      color: C.muted,
      cursor: "pointer",
      marginBottom: "20px",
      padding: "8px",
      borderRadius: "8px",
      transition: "color 0.2s ease",
    },
  };

  const ProgressDots = () => (
    <div style={s.progress}>
      {[1, 2].map(n => (
        <div key={n} style={{
          ...s.dot,
          width: step === n ? "24px" : "8px",
          background: step >= n ? C.accent : C.border,
        }} />
      ))}
    </div>
  );

  const LogoCenter = () => (
    <div style={s.logoCenter}>
      <div style={s.logoIcon}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L20 20H4L12 3Z" fill="white"/>
        </svg>
      </div>
      <span style={{...s.logoText, fontSize: "22px"}}>tapa</span>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <a href="/" style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 20H4L12 3Z" fill="white"/>
            </svg>
          </div>
          <span style={s.logoText}>tapa</span>
        </a>
        <a href="/auth/login" style={{
          padding: "8px 20px",
          background: "transparent",
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          color: C.text,
          fontSize: "14px",
          fontWeight: "500",
          textDecoration: "none",
        }}>
          Sign in
        </a>
      </nav>

      <div style={s.glow} />

      <main style={s.main}>
        <div style={s.card}>

          {/* ── EMAIL SENT SCREEN ── */}
          {emailSent ? (
            <>
              <div style={s.cardTop}>
                <LogoCenter />
                <h1 style={s.h1}>Check your email</h1>
                <p style={s.subtext}>
                  We sent a confirmation link to{" "}
                  <strong style={{ color: C.text }}>{email}</strong>.
                  Click it to verify your account, then sign in.
                </p>
              </div>
              <div style={s.successBox}>✓ Account created — confirmation email sent</div>
              <button
                style={s.btnPrimary}
                onClick={() => router.push("/auth/login")}
                onMouseEnter={e => { e.currentTarget.style.background = C.accentDark; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
              >
                Go to Sign In
              </button>
              <p style={s.bottomText}>
                Didn't get the email?{" "}
                <span style={s.link} onClick={handleCreateAccount}>Resend</span>
              </p>
            </>
          ) : (
            <>
              <ProgressDots />

              {/* ── STEP 1: Create account ── */}
              {step === 1 && (
                <>
                  <div style={s.cardTop}>
                    <LogoCenter />
                    <h1 style={s.h1}>Join Tapa</h1>
                    <p style={s.subtext}>Ship anything, anywhere.</p>
                  </div>

                  <div style={s.btnGroup}>
                    <button style={s.btnOauth}
                      onMouseEnter={e => (e.currentTarget.style.background = C.whiteDim)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                    <button style={s.btnOauth}
                      onMouseEnter={e => (e.currentTarget.style.background = C.whiteDim)}
                      onMouseLeave={e => (e.currentTarget.style.background = C.white)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.24.72 3.01.76 1.15-.22 2.25-.89 3.47-.76 1.47.17 2.58.82 3.3 2.07-3.04 1.86-2.29 5.94.68 7.05-.47 1.29-1.08 2.56-2.46 3.74zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>

                  <div style={s.divider}>
                    <div style={s.dividerLine} />
                    <span style={s.dividerText}>OR</span>
                    <div style={s.dividerLine} />
                  </div>

                  {error && <div style={s.errorBox}>{error}</div>}

                  <div style={s.inputGroup}>
                    <input type="text" placeholder="Full name" style={s.input} value={name} onChange={e => setName(e.target.value)}
                      onFocus={e => (e.target.style.borderColor = C.accent)}
                      onBlur={e => (e.target.style.borderColor = C.border)} />
                    <input type="email" placeholder="Email address" style={s.input} value={email} onChange={e => setEmail(e.target.value)}
                      onFocus={e => (e.target.style.borderColor = C.accent)}
                      onBlur={e => (e.target.style.borderColor = C.border)} />
                    <input type="password" placeholder="Create password (min 6 chars)" style={s.input} value={password} onChange={e => setPassword(e.target.value)}
                      onFocus={e => (e.target.style.borderColor = C.accent)}
                      onBlur={e => (e.target.style.borderColor = C.border)} />
                  </div>

                  <button
                    style={s.btnPrimary}
                    onClick={handleCreateAccount}
                    onMouseEnter={e => { e.currentTarget.style.background = C.accentDark; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>

                  <p style={s.bottomText}>
                    Already have an account?{" "}
                    <a href="/auth/login" style={s.link}>Sign in</a>
                  </p>
                </>
              )}

              {/* ── STEP 2: Role selection ── */}
              {step === 2 && (
                <>
                  <div style={s.cardTop}>
                    <LogoCenter />
                    <h1 style={s.h1}>How will you use Tapa?</h1>
                    <p style={s.subtext}>You can always do both — change anytime in settings.</p>
                  </div>

                  {error && <div style={s.errorBox}>{error}</div>}

                  <div style={s.roleGrid}>
                    <div
                      style={roleCardStyle(role === "sender")}
                      onClick={() => setRole(role === "sender" ? null : "sender")}
                      onMouseEnter={e => { if (role !== "sender") e.currentTarget.style.borderColor = C.borderHover; }}
                      onMouseLeave={e => { if (role !== "sender") e.currentTarget.style.borderColor = C.border; }}
                    >
                      <div style={roleIconStyle(role === "sender")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div style={s.roleTitle}>Sender</div>
                      <div style={s.roleDesc}>Ship items with real travelers going your way</div>
                    </div>

                    <div
                      style={roleCardStyle(role === "carrier")}
                      onClick={() => setRole(role === "carrier" ? null : "carrier")}
                      onMouseEnter={e => { if (role !== "carrier") e.currentTarget.style.borderColor = C.borderHover; }}
                      onMouseLeave={e => { if (role !== "carrier") e.currentTarget.style.borderColor = C.border; }}
                    >
                      <div style={roleIconStyle(role === "carrier")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div style={s.roleTitle}>Carrier</div>
                      <div style={s.roleDesc}>Earn money carrying items on your trips</div>
                    </div>
                  </div>

                  <div
                    style={{
                      ...s.bothLink,
                      color: role === "both" ? C.accent : C.muted,
                      background: role === "both" ? C.accentSoft : "transparent",
                      border: `1px solid ${role === "both" ? C.accent : "transparent"}`,
                    }}
                    onClick={() => setRole(role === "both" ? null : "both")}
                    onMouseEnter={e => { if (role !== "both") e.currentTarget.style.color = C.text; }}
                    onMouseLeave={e => { if (role !== "both") e.currentTarget.style.color = C.muted; }}
                  >
                    {role === "both" ? "✓ I'll do both" : "I'll do both"}
                  </div>

                  <button
                    style={role ? s.btnPrimary : s.btnPrimaryDisabled}
                    onClick={handleSetRole}
                    onMouseEnter={e => { if (role) e.currentTarget.style.background = C.accentDark; }}
                    onMouseLeave={e => { if (role) e.currentTarget.style.background = C.accent; }}
                  >
                    {loading ? "Saving..." : "Get Started"}
                  </button>

                  <p style={s.bottomText}>
                    By continuing you agree to Tapa's{" "}
                    <a href="#" style={{...s.link, fontWeight: "500", fontSize: "14px"}}>Terms</a>
                    {" "}&amp;{" "}
                    <a href="#" style={{...s.link, fontWeight: "500", fontSize: "14px"}}>Privacy Policy</a>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
