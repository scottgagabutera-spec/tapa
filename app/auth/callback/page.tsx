"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (!profile) {
          // New user — create profile with default role sender
          await supabase.from("profiles").upsert({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            role: "sender",
            avatar_color: "#E84855",
          });
        }
        // Always go to unified dashboard — no role-based routing
        const redirectTo = typeof window !== 'undefined' ? localStorage.getItem('tapa_redirect') : null;
        if (redirectTo) localStorage.removeItem('tapa_redirect');
        router.push(redirectTo || "/dashboard");
      } else {
        router.push("/auth/login");
      }
    };
    handleCallback();
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #243B55", borderTopColor: "#E84855", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#8B9BB4", fontSize: "14px" }}>Signing you in…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
