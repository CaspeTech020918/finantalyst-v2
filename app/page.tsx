import Link from "next/link";
import {
  Bot, BarChart3, ShieldCheck, FileText, TrendingUp, Rocket,
  ArrowRight, IndianRupee, Zap, Lock, CheckCircle2, Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Bot size={20} />,
    color: "indigo",
    title: "AI CFO",
    desc: "Ask your AI CFO anything — tax estimates, savings tips, regime comparison, advance tax. Plain English answers, India-specific.",
  },
  {
    icon: <FileText size={20} />,
    color: "amber",
    title: "Tax Planning",
    desc: "New vs Old regime comparison with your actual numbers. 80C, 80D, HRA, NPS deductions tracked. Know exactly what to pay.",
  },
  {
    icon: <ShieldCheck size={20} />,
    color: "emerald",
    title: "Compliance Calendar",
    desc: "Never miss a deadline. ITR, GST, TDS, advance tax — all pre-populated for your entity type, colour-coded by urgency.",
  },
  {
    icon: <BarChart3 size={20} />,
    color: "indigo",
    title: "Live Market Data",
    desc: "Real-time NSE/BSE prices, NIFTY 50, SENSEX, and MIDCAP 50. Mutual fund NAV lookup for 10,000+ schemes via AMFI.",
  },
  {
    icon: <IndianRupee size={20} />,
    color: "emerald",
    title: "Cashflow Tracker",
    desc: "Track every rupee. Manual entry or bank import. Automatic categorisation, monthly P&L, and runway alerts.",
  },
  {
    icon: <Rocket size={20} />,
    color: "amber",
    title: "Deal Room",
    desc: "Startups list fundraising rounds. Investors express interest. Private matchmaking with live stats — no money on platform.",
  },
];

const TRUST = [
  { icon: <Lock size={14} />, text: "No money movement — ever" },
  { icon: <ShieldCheck size={14} />, text: "AI never files, sends, or pays without your approval" },
  { icon: <CheckCircle2 size={14} />, text: "India-first — GST, ITR, NSE/BSE, SEBI rules built in" },
  { icon: <Star size={14} />, text: "All prices come from market APIs, never invented" },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  indigo: {
    bg: "rgba(99,102,241,0.12)",
    text: "#6366F1",
    border: "rgba(99,102,241,0.2)",
  },
  emerald: {
    bg: "rgba(16,185,129,0.12)",
    text: "#10B981",
    border: "rgba(16,185,129,0.2)",
  },
  amber: {
    bg: "rgba(245,158,11,0.12)",
    text: "#F59E0B",
    border: "rgba(245,158,11,0.2)",
  },
};

export default function LandingPage() {
  return (
    <div style={{ background: "#0A0B0F", color: "#F1F5F9", minHeight: "100vh", fontFamily: "var(--font-sans, system-ui)" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", background: "rgba(10,11,15,0.8)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366F1, #10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>Finantalyst</span>
            <span style={{ fontSize: 10, color: "#6366F1", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>BETA</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/login" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", padding: "6px 14px" }}>Sign in</Link>
            <Link href="/register" style={{ background: "#6366F1", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "8px 18px", borderRadius: 10, display: "flex", alignItems: "center", gap: 6 }}>
              Get started free <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "30%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 32, fontSize: 13, color: "#A5B4FC" }}>
            <Zap size={12} /> India&apos;s AI Financial Operating System
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 24 }}>
            Your{" "}
            <span style={{ background: "linear-gradient(135deg, #6366F1 0%, #10B981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI CFO
            </span>{" "}
            that never sleeps
          </h1>

          <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Finantalyst handles tax planning, compliance deadlines, cashflow tracking, and investment data — built specifically for India. Ask before it acts. Always.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "14px 28px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(99,102,241,0.4)" }}>
              Get started free — it&apos;s free <ArrowRight size={15} />
            </Link>
            <Link href="/login" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#F1F5F9", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "14px 28px", borderRadius: 12 }}>
              Sign in
            </Link>
          </div>

          <p style={{ marginTop: 16, fontSize: 13, color: "#475569" }}>No credit card required · Free forever for individuals</p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[
            { value: "₹12L+", label: "Tax-free under new regime" },
            { value: "10K+", label: "MF schemes tracked" },
            { value: "0", label: "Rupees moved without approval" },
            { value: "6", label: "Financial modules in one app" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#6366F1", letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 14 }}>
            Everything your finances need
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", maxWidth: 480, margin: "0 auto" }}>
            Six modules working together. All India-specific. No data leaves your account without your knowledge.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => {
            const c = colorMap[f.color];
            return (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 28px 32px", transition: "border-color 0.2s" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.text, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.3px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 20, maxWidth: 900, margin: "0 auto 80px", padding: "40px 40px" }}>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6366F1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 28 }}>Our guarantees</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {TRUST.map((t) => (
            <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ color: "#6366F1", flexShrink: 0 }}>{t.icon}</div>
              <span style={{ fontSize: 14, color: "#94A3B8" }}>{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: "center", padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "56px 40px" }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 14 }}>
            Ready to take control?
          </div>
          <p style={{ fontSize: 16, color: "#64748B", marginBottom: 32 }}>
            Join users who let Finantalyst handle the numbers while they focus on what matters.
          </p>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "14px 32px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(99,102,241,0.4)" }}>
            Create free account <ArrowRight size={15} />
          </Link>
          <p style={{ marginTop: 14, fontSize: 13, color: "#334155" }}>Already have an account? <Link href="/login" style={{ color: "#6366F1", textDecoration: "none" }}>Sign in</Link></p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#334155" }}>
          © 2026 Finantalyst · India-first AI Financial OS ·{" "}
          <span style={{ color: "#475569" }}>Not a SEBI-registered advisor · Not for actual tax filing · For planning only</span>
        </p>
      </footer>
    </div>
  );
}
