"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bot, BarChart3, ShieldCheck, FileText, Rocket,
  ArrowRight, IndianRupee, Zap, Lock, CheckCircle2,
} from "lucide-react";

const FEATURES = [
  { icon: Bot, color: "#6366F1", bg: "rgba(99,102,241,0.1)", title: "AI CFO", desc: "Ask anything — tax estimates, savings tips, regime comparison, advance tax. Plain English, India-specific answers every time." },
  { icon: FileText, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", title: "Tax Planning", desc: "New vs Old regime with your real numbers. 80C, 80D, HRA, NPS tracked. Know exactly what you owe before March 31." },
  { icon: ShieldCheck, color: "#10B981", bg: "rgba(16,185,129,0.1)", title: "Compliance Calendar", desc: "ITR, GST, TDS, advance tax — pre-populated for your entity type, colour-coded by urgency. Never miss a deadline again." },
  { icon: BarChart3, color: "#6366F1", bg: "rgba(99,102,241,0.1)", title: "Live Market Data", desc: "Real-time NSE/BSE prices, NIFTY 50, SENSEX, MIDCAP 50. Mutual fund NAV for 10,000+ schemes — always from the market, never invented." },
  { icon: IndianRupee, color: "#10B981", bg: "rgba(16,185,129,0.1)", title: "Cashflow Tracker", desc: "Track every rupee. Manual entry or bank import. Auto-categorisation, monthly P&L, and runway alerts for your business." },
  { icon: Rocket, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", title: "Deal Room", desc: "Startups list fundraising rounds. Investors express interest. Private matchmaking with live stats — zero money on platform." },
];

const TRUST = [
  { icon: Lock, text: "No money movement — ever" },
  { icon: ShieldCheck, text: "AI never files, sends, or pays without your approval" },
  { icon: CheckCircle2, text: "India-first — GST, ITR, NSE/BSE, SEBI rules built in" },
  { icon: CheckCircle2, text: "All prices from market APIs, never invented" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(1deg); }
          50%      { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-18px); }
        }
        @keyframes driftOrb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(24px,-18px) scale(1.05); }
          66%      { transform: translate(-16px,-28px) scale(0.97); }
        }
        @keyframes driftOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-20px,12px) scale(1.04); }
          66%      { transform: translate(18px,-20px) scale(0.98); }
        }
        @keyframes chartDraw {
          from { stroke-dashoffset: 800; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .coin-a { animation: floatA 7s ease-in-out infinite; }
        .coin-b { animation: floatB 9s ease-in-out infinite 1.5s; }
        .coin-c { animation: floatC 6s ease-in-out infinite 3s; }
        .orb-1  { animation: driftOrb  20s ease-in-out infinite; }
        .orb-2  { animation: driftOrb2 26s ease-in-out infinite 4s; }
        .chart-line { stroke-dasharray: 800; animation: chartDraw 2.2s ease-out forwards 0.5s; }
        .fade-up { animation: fadeUp 0.7s ease-out both; }
        .nav-link-item { color:#5B5A7E; font-size:14px; text-decoration:none; padding:6px 12px; border-radius:8px; transition:color 0.15s, background 0.15s; }
        .nav-link-item:hover { color:#0D0B2A; background:rgba(13,11,42,0.05); }
        .feature-card-sm { background:#fff; border:1px solid #E8E6F4; border-radius:16px; padding:26px; transition:box-shadow 0.2s, transform 0.2s; }
        .feature-card-sm:hover { box-shadow:0 8px 32px rgba(99,102,241,0.12); transform:translateY(-3px); }
        .use-card { background:#12103A; border-radius:20px; padding:36px; color:#F1F0FA; }
        .cta-card:hover { box-shadow:0 20px 60px rgba(99,102,241,0.18); }
        .cta-card { transition:box-shadow 0.3s; }
        @media(max-width:900px) {
          .nav-center { display:none !important; }
          .hero-h1 { font-size:44px !important; letter-spacing:-1.5px !important; }
          .two-col  { flex-direction:column !important; }
          .three-col{ flex-direction:column !important; }
          .feat-grid{ grid-template-columns:1fr !important; }
          .stats-row{ gap:24px !important; flex-wrap:wrap !important; }
        }
      `}</style>

      <div style={{ background: "#F5F4FC", color: "#0D0B2A", minHeight: "100vh", fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif" }}>

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          background: scrolled ? "rgba(245,244,252,0.94)" : "#F5F4FC",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: `1px solid ${scrolled ? "#E8E6F4" : "transparent"}`,
          transition: "border-color 0.2s, background 0.2s",
        }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={14} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.4px" }}>Finantalyst</span>
              <span style={{ fontSize: 9, color: "#6366F1", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 4, padding: "2px 7px", fontWeight: 700, letterSpacing: "1px" }}>BETA</span>
            </div>
            {/* Centre links */}
            <div className="nav-center" style={{ display: "flex", gap: 2 }}>
              {["Product","Tax Planning","Compliance","Investments","Deal Room"].map(l => (
                <Link key={l} href="/register" className="nav-link-item">{l}</Link>
              ))}
            </div>
            {/* CTA */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/login" style={{ color: "#5B5A7E", fontSize: 14, textDecoration: "none", padding: "6px 14px" }}>Sign in</Link>
              <Link href="/register" style={{ background: "#12103A", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "9px 22px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 12px rgba(18,16,58,0.25)" }}>
                Launch App <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section style={{ textAlign: "center", padding: "88px 24px 0", position: "relative", overflow: "hidden" }}>
          {/* Background orbs */}
          <div className="orb-1" style={{ position: "absolute", top: "8%", left: "18%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 72%)", filter: "blur(48px)", pointerEvents: "none" }} />
          <div className="orb-2" style={{ position: "absolute", top: "4%", right: "14%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 72%)", filter: "blur(44px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "28%", left: "55%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 72%)", filter: "blur(36px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }} className="fade-up">
            {/* Pill badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 100, padding: "5px 16px", marginBottom: 28, fontSize: 12, color: "#6366F1", fontWeight: 600, letterSpacing: "0.4px" }}>
              <Zap size={11} strokeWidth={2.5} /> India&apos;s AI Financial Operating System
            </div>

            {/* Headline */}
            <h1 className="hero-h1" style={{ fontSize: "clamp(42px,6.5vw,74px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-2.5px", marginBottom: 22, fontFamily: "Georgia,'Times New Roman',serif", color: "#0D0B2A" }}>
              Where your{" "}
              <em style={{ fontStyle: "italic", color: "#6366F1", fontWeight: 800 }}>money</em><br />
              grows smarter
            </h1>

            <p style={{ fontSize: 18, color: "#5B5A7E", lineHeight: 1.75, marginBottom: 38, maxWidth: 520, margin: "0 auto 38px" }}>
              An AI-powered financial OS built for India — tax planning, compliance, investments, and cashflow in one place. Your CFO never sleeps.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" style={{ background: "#12103A", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "14px 30px", borderRadius: 100, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(18,16,58,0.3)" }}>
                Get started — it&apos;s free <ArrowRight size={14} />
              </Link>
              <Link href="/login" style={{ background: "white", border: "1px solid #E8E6F4", color: "#0D0B2A", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "14px 30px", borderRadius: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                Sign in
              </Link>
            </div>
            <p style={{ marginTop: 14, fontSize: 12, color: "#9B9AB8" }}>No credit card · Free for individuals · Built for India</p>
          </div>

          {/* Hero visual */}
          <div style={{ position: "relative", maxWidth: 1060, margin: "60px auto 0", height: 300, overflow: "visible" }}>
            {/* Shelf gradient */}
            <div style={{ position: "absolute", bottom: 0, left: "5%", right: "5%", height: 220, background: "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.07) 60%, rgba(99,102,241,0.12) 100%)", borderRadius: "28px 28px 0 0", backdropFilter: "blur(2px)" }} />

            {/* Chart SVG */}
            <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: 280 }} viewBox="0 0 1060 280" preserveAspectRatio="xMidYMax meet">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#10B981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Fill under chart */}
              <path d="M60 220 C160 200 240 185 340 168 C440 150 540 138 640 118 C740 100 840 110 980 88 L980 280 L60 280 Z" fill="url(#chartFill)" />
              {/* Chart line */}
              <path className="chart-line" d="M60 220 C160 200 240 185 340 168 C440 150 540 138 640 118 C740 100 840 110 980 88" fill="none" stroke="url(#chartStroke)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Dots */}
              {([{x:60,y:220},{x:200,y:192},{x:340,y:168},{x:480,y:146},{x:640,y:118},{x:800,y:106},{x:980,y:88}]).map((p,i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4.5" fill={i % 2 === 0 ? "#6366F1" : "#10B981"} />
                  <circle cx={p.x} cy={p.y} r="9" fill={i % 2 === 0 ? "#6366F1" : "#10B981"} fillOpacity="0.15" />
                </g>
              ))}
              {/* Dashed baseline grid */}
              {[200,240].map((y,i) => (
                <line key={i} x1="40" y1={y} x2="1020" y2={y} stroke="#6366F1" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="6,8" />
              ))}
            </svg>

            {/* Coin — left */}
            <div className="coin-a" style={{ position: "absolute", left: "8%", bottom: 60, width: 96, height: 96, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%, #A5A7FA, #6366F1)", boxShadow: "0 12px 40px rgba(99,102,241,0.45), inset 0 2px 0 rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1 }}>₹</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "1px", marginTop: 2 }}>INDIA</span>
              {/* Ring */}
              <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid rgba(99,102,241,0.3)" }} />
              <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.12)" }} />
            </div>

            {/* Coin — right (emerald) */}
            <div className="coin-b" style={{ position: "absolute", right: "10%", bottom: 48, width: 116, height: 116, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%, #34D399, #10B981)", boxShadow: "0 14px 44px rgba(16,185,129,0.42), inset 0 2px 0 rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: "rgba(255,255,255,0.95)", lineHeight: 1 }}>₹</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "1px", marginTop: 2 }}>BLOOM</span>
              <div style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "1.5px solid rgba(16,185,129,0.3)" }} />
              <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: "1px solid rgba(16,185,129,0.12)" }} />
            </div>

            {/* Coin — center small (amber) */}
            <div className="coin-c" style={{ position: "absolute", left: "46%", bottom: 88, width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%, #FCD34D, #F59E0B)", boxShadow: "0 10px 28px rgba(245,158,11,0.4), inset 0 2px 0 rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.9)" }}>AI</span>
              <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "1px solid rgba(245,158,11,0.35)" }} />
            </div>

            {/* Floating data labels */}
            <div style={{ position: "absolute", left: "22%", bottom: 160, background: "white", border: "1px solid #E8E6F4", borderRadius: 10, padding: "6px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#10B981" }}>+₹1.4L saved</span>
            </div>
            <div style={{ position: "absolute", right: "26%", bottom: 170, background: "white", border: "1px solid #E8E6F4", borderRadius: 10, padding: "6px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6366F1" }}>0 missed deadlines</span>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #E8E6F4", borderBottom: "1px solid #E8E6F4", background: "white", marginTop: 0 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px", display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }} className="stats-row">
            {[
              { value: "₹12L+", label: "Tax-free under new regime" },
              { value: "10K+",  label: "MF schemes tracked live" },
              { value: "40+",   label: "Compliance dates pre-loaded" },
              { value: "₹0",    label: "Moved without your approval" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0D0B2A", letterSpacing: "-0.8px", fontFamily: "Georgia,serif" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#9B9AB8", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT IS FINANTALYST? ─────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 28px 0" }}>
          <div className="two-col" style={{ display: "flex", gap: 64, alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 auto" }}>
              <h2 style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.08, maxWidth: 360, fontFamily: "Georgia,serif", color: "#0D0B2A" }}>
                What is<br />Finantalyst?
              </h2>
              <Link href="/register" style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 6, background: "#12103A", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700, padding: "10px 22px", borderRadius: 100, boxShadow: "0 4px 16px rgba(18,16,58,0.22)" }}>
                Explore now <ArrowRight size={13} />
              </Link>
            </div>
            <div style={{ flex: 1, paddingTop: 8 }}>
              <p style={{ fontSize: "clamp(18px,2.2vw,22px)", color: "#0D0B2A", lineHeight: 1.65, fontFamily: "Georgia,serif", fontWeight: 400 }}>
                Finantalyst is an AI-first financial operating system that helps you understand your money, stay compliant with Indian regulations, and grow your wealth — without needing a CA on speed dial.
              </p>
              <p style={{ fontSize: 15, color: "#5B5A7E", lineHeight: 1.75, marginTop: 16 }}>
                Built specifically for Indian founders, freelancers, salaried professionals, and MSMEs — it speaks GST, ITR, TDS, and NSE/BSE natively.
              </p>
            </div>
          </div>
        </section>

        {/* ── FEATURE SPOTLIGHT CARDS ─────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 28px" }}>
          <div className="three-col" style={{ display: "flex", gap: 16 }}>

            {/* Card 1 — wide, light */}
            <div style={{ flex: "2 1 0", background: "linear-gradient(145deg, #EEEDF9 0%, #E6E4F7 100%)", borderRadius: 20, padding: "36px 36px 0", overflow: "hidden", position: "relative", minHeight: 320 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#6366F1", letterSpacing: "2px", textTransform: "uppercase" }}>Core intelligence</span>
              <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", marginTop: 10, marginBottom: 12, fontFamily: "Georgia,serif", color: "#0D0B2A", lineHeight: 1.15 }}>
                Money that works<br />for you
              </h3>
              <p style={{ fontSize: 14, color: "#5B5A7E", lineHeight: 1.7, maxWidth: 320 }}>
                Deploy your capital into the right deductions, tax regime, and investments. Your AI CFO does the heavy lifting — you just approve.
              </p>
              {/* Mini chart visual */}
              <div style={{ marginTop: 32, position: "relative", height: 120, overflow: "hidden" }}>
                <svg width="100%" height="120" viewBox="0 0 400 120">
                  <defs>
                    <linearGradient id="cardFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 90 C50 80 100 70 160 55 C220 40 280 30 400 15 L400 120 L0 120 Z" fill="url(#cardFill)" />
                  <path d="M0 90 C50 80 100 70 160 55 C220 40 280 30 400 15" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Coin floating in card */}
                  <circle cx="340" cy="30" r="30" fill="#6366F1" fillOpacity="0.2" />
                  <circle cx="340" cy="30" r="22" fill="#6366F1" fillOpacity="0.35" />
                  <text x="340" y="37" textAnchor="middle" fontSize="16" fontWeight="800" fill="#6366F1">₹</text>
                </svg>
              </div>
            </div>

            {/* Card 2 — dark */}
            <div style={{ flex: "1 1 0", background: "#12103A", borderRadius: 20, padding: "36px", minHeight: 320, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(165,180,252,0.7)", letterSpacing: "2px", textTransform: "uppercase" }}>Compliance</span>
              <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginTop: 10, marginBottom: 14, fontFamily: "Georgia,serif", color: "#F1F0FA", lineHeight: 1.2 }}>
                Always<br />compliant,<br />never late
              </h3>
              <p style={{ fontSize: 14, color: "rgba(241,240,250,0.55)", lineHeight: 1.7, flex: 1 }}>
                40+ statutory due dates pre-loaded for your entity type. ITR, GST, TDS, advance tax — colour-coded by urgency. Mark done in one click.
              </p>
              <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
                {["ITR","GST","TDS","ADV"].map((t,i) => (
                  <span key={t} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", color: i === 0 ? "#10B981" : i === 1 ? "#F59E0B" : "rgba(165,180,252,0.6)", background: i === 0 ? "rgba(16,185,129,0.12)" : i === 1 ? "rgba(245,158,11,0.12)" : "rgba(165,180,252,0.08)", border: `1px solid ${i === 0 ? "rgba(16,185,129,0.2)" : i === 1 ? "rgba(245,158,11,0.2)" : "rgba(165,180,252,0.12)"}`, borderRadius: 6, padding: "4px 8px" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Card 3 — dark */}
            <div style={{ flex: "1 1 0", background: "#1E1B4B", borderRadius: 20, padding: "36px", minHeight: 320, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(165,180,252,0.7)", letterSpacing: "2px", textTransform: "uppercase" }}>Trust</span>
              <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginTop: 10, marginBottom: 14, fontFamily: "Georgia,serif", color: "#F1F0FA", lineHeight: 1.2 }}>
                100%<br />your<br />decision
              </h3>
              <p style={{ fontSize: 14, color: "rgba(241,240,250,0.55)", lineHeight: 1.7, flex: 1 }}>
                The AI suggests, you approve. Nothing files, transfers, or sends without your explicit sign-off. Every action requires your click.
              </p>
              <div style={{ marginTop: 24, display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 12, color: "rgba(241,240,250,0.5)" }}>Human-in-the-loop always</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── USE CASES ──────────────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px 80px" }}>
          <div className="two-col" style={{ display: "flex", gap: 48, alignItems: "stretch" }}>
            {/* Left */}
            <div style={{ flex: "1 1 0" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#6366F1", letterSpacing: "2px", textTransform: "uppercase" }}>Finantalyst in action</span>
              <h2 style={{ fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.1, marginTop: 10, marginBottom: 18, fontFamily: "Georgia,serif", color: "#0D0B2A" }}>
                Use cases
              </h2>
              <p style={{ fontSize: 15, color: "#5B5A7E", lineHeight: 1.75, marginBottom: 28, maxWidth: 380 }}>
                Finantalyst adapts to how you work — whether you&apos;re a founder, freelancer, salaried professional, or running a business.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Founders & Startups", desc: "Runway tracking, board reports, Deal Room fundraising" },
                  { label: "Freelancers", desc: "TDS deduction, advance tax, 44ADA regime optimiser" },
                  { label: "Salaried Professionals", desc: "HRA, 80C, new vs old regime, Form 16 planning" },
                  { label: "MSMEs & Businesses", desc: "GST calendar, TDS compliance, cashflow P&L" },
                ].map(uc => (
                  <div key={uc.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "white", border: "1px solid #E8E6F4", borderRadius: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0D0B2A", marginBottom: 2 }}>{uc.label}</div>
                      <div style={{ fontSize: 12, color: "#9B9AB8" }}>{uc.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — card */}
            <div style={{ flex: "1 1 0", background: "#12103A", borderRadius: 20, padding: "40px", display: "flex", flexDirection: "column", minHeight: 440, position: "relative", overflow: "hidden" }}>
              {/* Building illustration using CSS */}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 200, height: 200, opacity: 0.08 }}>
                <svg viewBox="0 0 200 200" width="200" height="200">
                  {/* Abstract building columns */}
                  <rect x="20" y="60" width="30" height="140" rx="4" fill="#A5B4FC" />
                  <rect x="60" y="40" width="30" height="160" rx="4" fill="#A5B4FC" />
                  <rect x="100" y="50" width="30" height="150" rx="4" fill="#A5B4FC" />
                  <rect x="140" y="70" width="30" height="130" rx="4" fill="#A5B4FC" />
                  {/* Pediment */}
                  <polygon points="10,60 190,60 100,10" fill="#A5B4FC" />
                  <rect x="5" y="60" width="190" height="8" rx="2" fill="#A5B4FC" />
                  <rect x="5" y="192" width="190" height="8" rx="2" fill="#A5B4FC" />
                </svg>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(165,180,252,0.7)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Business</span>
              <h3 style={{ fontSize: 26, fontWeight: 800, fontFamily: "Georgia,serif", color: "#F1F0FA", lineHeight: 1.25, marginBottom: 14, letterSpacing: "-0.5px" }}>
                Your business&apos;s<br />financial command centre
              </h3>
              <p style={{ fontSize: 14, color: "rgba(241,240,250,0.6)", lineHeight: 1.75, flex: 1 }}>
                GST calendar with GSTR-1 and GSTR-3B pre-scheduled. TDS quarterly filings. Cashflow P&L with burn rate alerts. AI CFO that answers your finance questions in plain language.
              </p>
              <Link href="/register" style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 6, color: "#A5B4FC", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                Learn more <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── ALL FEATURES ─────────────────────────────────────── */}
        <section style={{ background: "white", borderTop: "1px solid #E8E6F4", borderBottom: "1px solid #E8E6F4" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 28px" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 12, fontFamily: "Georgia,serif", color: "#0D0B2A" }}>
                Everything your finances need
              </h2>
              <p style={{ fontSize: 15, color: "#9B9AB8", maxWidth: 420, margin: "0 auto" }}>
                Six modules working together — all India-specific, no data leaves your account without your knowledge.
              </p>
            </div>
            <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="feature-card-sm">
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Icon size={18} color={f.color} strokeWidth={2} />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 7, color: "#0D0B2A", letterSpacing: "-0.2px" }}>{f.title}</h3>
                    <p style={{ fontSize: 13, color: "#9B9AB8", lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TRUST ────────────────────────────────────────────── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 28px" }}>
          <div style={{ background: "linear-gradient(135deg, #12103A 0%, #1E1B4B 100%)", borderRadius: 24, padding: "52px 52px" }}>
            <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "rgba(165,180,252,0.6)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 10 }}>Our guarantees</p>
            <h2 style={{ textAlign: "center", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#F1F0FA", fontFamily: "Georgia,serif", letterSpacing: "-0.6px", marginBottom: 40 }}>
              Built on trust, by design
            </h2>
            <div className="two-col" style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
              {TRUST.map(t => {
                const Icon = t.icon;
                return (
                  <div key={t.text} style={{ flex: "0 1 280px", display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(165,180,252,0.12)", borderRadius: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color="#A5B4FC" />
                    </div>
                    <span style={{ fontSize: 14, color: "rgba(241,240,250,0.75)", lineHeight: 1.45 }}>{t.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section style={{ padding: "0 28px 96px" }}>
          <div className="cta-card" style={{ maxWidth: 800, margin: "0 auto", background: "white", border: "1px solid #E8E6F4", borderRadius: 28, padding: "64px 48px", textAlign: "center", boxShadow: "0 8px 40px rgba(99,102,241,0.08)" }}>
            {/* Small decorative orbs */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
                <Zap size={22} color="white" strokeWidth={2.5} />
              </div>
            </div>
            <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 14, fontFamily: "Georgia,serif", color: "#0D0B2A" }}>
              Ready to take control?
            </h2>
            <p style={{ fontSize: 16, color: "#9B9AB8", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
              Join users who let Finantalyst handle the numbers while they focus on what matters.
            </p>
            <Link href="/register" style={{ background: "#12103A", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "15px 34px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 6px 24px rgba(18,16,58,0.28)" }}>
              Create free account <ArrowRight size={15} />
            </Link>
            <p style={{ marginTop: 14, fontSize: 13, color: "#C4C2D8" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#6366F1", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid #E8E6F4", background: "white", padding: "28px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#6366F1,#10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={10} color="white" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0B2A" }}>Finantalyst</span>
              <span style={{ fontSize: 12, color: "#C4C2D8" }}>© 2026</span>
            </div>
            <p style={{ fontSize: 12, color: "#C4C2D8", textAlign: "center" }}>
              Not a SEBI-registered advisor · Not for actual tax filing · For planning purposes only
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <Link href="/login" style={{ fontSize: 12, color: "#9B9AB8", textDecoration: "none" }}>Sign in</Link>
              <Link href="/register" style={{ fontSize: 12, color: "#9B9AB8", textDecoration: "none" }}>Register</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
