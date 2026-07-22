"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Bot, BarChart3, ShieldCheck, FileText, Rocket, ArrowRight, IndianRupee, Zap, Lock, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

/* ── hooks ── */

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(target: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0, raf = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

type Ripple = { id: number; x: number; y: number };
function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const add = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  };
  return { ripples, add };
}

/* ── canvas mesh ── */

function CanvasMesh() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const COLS = ["#6366F1","#4F46E5","#10B981","#059669","#7C3AED","#2563EB"];
    const pts = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      c: COLS[i],
    }));
    let raf = 0;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const r = Math.max(w, h) * 0.4;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, p.c + "1E"); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

/* ── browser mockup ── */

function BrowserMockup() {
  return (
    <div style={{ width:"100%", borderRadius:"14px 14px 0 0", border:"1px solid #252640", borderBottom:"none", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)" }}>
      <div style={{ background:"#161728", padding:"9px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #252640" }}>
        <div style={{ display:"flex", gap:5 }}>
          {["#EF4444","#F59E0B","#10B981"].map(c=><div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }} />)}
        </div>
        <div style={{ flex:1, background:"#0C0D14", borderRadius:5, padding:"3px 0", fontSize:10, color:"#555570", textAlign:"center" }}>
          🔒 finantalyst-v2.vercel.app/dashboard
        </div>
        <div style={{ display:"flex", gap:4 }}>{[0,1,2].map(i=><div key={i} style={{ width:14, height:8, borderRadius:2, background:"#252640" }} />)}</div>
      </div>
      <div style={{ display:"flex", height:390, background:"#0C0D14", overflow:"hidden" }}>
        {/* sidebar */}
        <div style={{ width:162, background:"#08090F", borderRight:"1px solid #1A1B2E", padding:"16px 10px", display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:18, padding:"0 6px" }}>
            <div style={{ width:22, height:22, borderRadius:6, background:"linear-gradient(135deg,#6366F1,#10B981)", flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:800, color:"#EEEDF8" }}>Finantalyst</span>
          </div>
          {[{l:"Dashboard",a:true},{l:"AI CFO",a:false},{l:"Tax Planning",a:false},{l:"Compliance",a:false},{l:"Investments",a:false},{l:"Cashflow",a:false},{l:"Deal Room",a:false}].map(item=>(
            <div key={item.l} style={{ padding:"7px 10px", borderRadius:8, background:item.a?"rgba(99,102,241,0.14)":"transparent", color:item.a?"#A5B4FC":"#3A3958", fontSize:10.5, fontWeight:item.a?700:400, borderLeft:`2px solid ${item.a?"#6366F1":"transparent"}` }}>{item.l}</div>
          ))}
          <div style={{ marginTop:"auto", padding:"10px", borderRadius:8, background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.14)" }}>
            <div style={{ fontSize:8, color:"#6EE7B7", marginBottom:2, letterSpacing:"0.5px" }}>AI CFO ACTIVE</div>
            <div style={{ fontSize:9.5, color:"#10B981", fontWeight:600 }}>Ask anything →</div>
          </div>
        </div>
        {/* main panel */}
        <div style={{ flex:1, background:"#0E0F1C", padding:"18px 20px", display:"flex", flexDirection:"column", gap:12, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#EEEDF8" }}>Good morning 👋</div>
              <div style={{ fontSize:9.5, color:"#3A3958", marginTop:1 }}>FY 2025-26 · 22 Jul 2026</div>
            </div>
            <div style={{ display:"flex", gap:7, alignItems:"center" }}>
              <div style={{ padding:"4px 10px", borderRadius:6, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", fontSize:9, color:"#A5B4FC", fontWeight:600 }}>New vs Old Regime ↗</div>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#6366F1,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"white" }}>S</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[{l:"Net Worth",v:"₹14.2L",d:"+8.3% this month",c:"#10B981"},{l:"Tax Saved",v:"₹1.4L",d:"80C + HRA + NPS",c:"#6366F1"},{l:"Compliance",v:"38 / 40",d:"2 items due soon",c:"#F59E0B"}].map(s=>(
              <div key={s.l} style={{ background:"#131523", border:"1px solid #252640", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:8, color:"#555570", letterSpacing:"0.5px", marginBottom:4 }}>{s.l.toUpperCase()}</div>
                <div style={{ fontSize:19, fontWeight:800, color:"#EEEDF8", fontFamily:"Georgia,serif", lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:8.5, color:s.c, marginTop:4 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <div style={{ flex:1, background:"#131523", border:"1px solid #252640", borderRadius:12, padding:"12px 16px", overflow:"hidden" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontSize:10, fontWeight:600, color:"#EEEDF8" }}>Portfolio Performance</div>
              <div style={{ display:"flex", gap:5 }}>
                {["1M","3M","6M","1Y"].map((t,i)=>(
                  <span key={t} style={{ fontSize:8.5, padding:"2px 6px", borderRadius:4, background:i===2?"rgba(99,102,241,0.15)":"transparent", color:i===2?"#A5B4FC":"#3A3958", fontWeight:i===2?700:400 }}>{t}</span>
                ))}
              </div>
            </div>
            <svg width="100%" height="108" viewBox="0 0 460 108" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gbf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[27,54,81].map(y=><line key={y} x1="0" y1={y} x2="460" y2={y} stroke="#1E2035" strokeWidth="0.8"/>)}
              <path d="M0 90 C70 82 120 72 180 57 C230 44 280 34 340 22 C380 14 420 10 460 6 L460 108 L0 108Z" fill="url(#gbf)"/>
              <path d="M0 90 C70 82 120 72 180 57 C230 44 280 34 340 22 C380 14 420 10 460 6" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
              <path d="M0 98 C70 94 120 90 180 82 C230 74 280 68 340 60 C380 53 420 50 460 46" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" strokeDasharray="4,4"/>
              <circle cx="460" cy="6" r="3" fill="#6366F1"/>
              <circle cx="460" cy="6" r="6" fill="#6366F1" fillOpacity="0.22"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── tilt card ── */

function TiltCard({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-4px)`;
    el.style.boxShadow = "0 16px 40px rgba(99,102,241,0.25)";
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  };
  return (
    <div ref={ref} className={className} style={{ ...style, transition:"transform 0.18s ease, box-shadow 0.18s ease", willChange:"transform" }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ── reveal wrapper ── */

function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ ...style, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(28px)", transition:`opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── animated stats bar ── */

function StatsBar() {
  const { ref, visible } = useReveal(0.4);
  const c1 = useCounter(12, 1200, visible);
  const c2 = useCounter(10000, 1500, visible);
  const c3 = useCounter(40, 1000, visible);
  return (
    <div ref={ref} style={{ borderTop:"1px solid #252640", borderBottom:"1px solid #252640", background:"#0E0F1C" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"22px 28px", display:"flex", justifyContent:"center", gap:60, flexWrap:"wrap" }}>
        {[
          { value:`₹${c1}L+`,                           label:"Tax-free under new regime" },
          { value:c2>=10000?"10K+":c2>0?`${c2}+`:"10K+",label:"MF schemes tracked live" },
          { value:c3>=40?"40+":c3>0?`${c3}+`:"40+",     label:"Compliance dates pre-loaded" },
          { value:"₹0",                                  label:"Moved without your approval" },
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:800, color:"#EEEDF8", letterSpacing:"-1px", fontFamily:"Georgia,serif" }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#555570", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── constants ── */

const AVATARS = [
  {init:"R",c1:"#6366F1",c2:"#4F46E5"},{init:"A",c1:"#10B981",c2:"#059669"},
  {init:"P",c1:"#F59E0B",c2:"#D97706"},{init:"S",c1:"#8B5CF6",c2:"#7C3AED"},
  {init:"M",c1:"#EF4444",c2:"#DC2626"},
];

const FEATURES = [
  { icon:Bot,         color:"#6366F1", bg:"rgba(99,102,241,0.1)",  title:"AI CFO",           desc:"Ask anything — tax estimates, regime comparison, advance tax. Plain English, India-specific answers every time." },
  { icon:FileText,    color:"#F59E0B", bg:"rgba(245,158,11,0.1)",  title:"Tax Planning",     desc:"New vs Old regime with your real numbers. 80C, 80D, HRA, NPS tracked. Know exactly what you owe before March 31." },
  { icon:ShieldCheck, color:"#10B981", bg:"rgba(16,185,129,0.1)",  title:"Compliance",       desc:"ITR, GST, TDS, advance tax — pre-populated for your entity type, colour-coded by urgency. Never miss a deadline." },
  { icon:BarChart3,   color:"#6366F1", bg:"rgba(99,102,241,0.1)",  title:"Live Market Data", desc:"Real-time NSE/BSE prices, NIFTY 50, SENSEX. Mutual fund NAV for 10,000+ schemes — always from the market." },
  { icon:IndianRupee, color:"#10B981", bg:"rgba(16,185,129,0.1)",  title:"Cashflow",         desc:"Track every rupee. Manual entry or bank import. Auto-categorisation, monthly P&L, runway alerts." },
  { icon:Rocket,      color:"#F59E0B", bg:"rgba(245,158,11,0.1)",  title:"Deal Room",        desc:"Startups list fundraising rounds. Investors express interest. Private matchmaking — zero money on platform." },
];

const TRUST = [
  { icon:Lock,         text:"No money movement — ever" },
  { icon:ShieldCheck,  text:"AI never files, sends, or pays without your approval" },
  { icon:CheckCircle2, text:"India-first — GST, ITR, NSE/BSE, SEBI rules built in" },
  { icon:CheckCircle2, text:"All prices from market APIs, never invented" },
];

/* ── main ── */

export default function LandingPage() {
  const heroRipple = useRipple();

  return (
    <>
      <style>{`
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes rippleOut{from{transform:scale(0);opacity:1}to{transform:scale(8);opacity:0}}
        @keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
        @keyframes floatB{0%,100%{transform:translateY(0) rotate(1deg)}50%{transform:translateY(-9px) rotate(-2deg)}}
        .grad-text{
          background:linear-gradient(90deg,#818CF8,#34D399,#FCD34D,#818CF8);
          background-size:300%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;animation:gradShift 5s ease infinite;
          font-style:italic;font-weight:800;
        }
        .feat-glass{
          background:rgba(15,16,28,0.6);
          backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,0.065);border-radius:16px;padding:26px;
        }
        .feat-glass .fi{transition:transform 0.2s ease}
        .feat-glass:hover .fi{transform:scale(1.12) rotate(-3deg)}
        .live-dot{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse 2s ease-in-out infinite;display:inline-block}
        .coin-a{animation:floatA 7s ease-in-out infinite}
        .coin-b{animation:floatB 9s ease-in-out infinite 1.5s}
        .uc-item{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:#131523;border:1px solid #252640;border-radius:12px}
        @media(max-width:900px){
          .hero-h1{font-size:44px !important;letter-spacing:-1.5px !important}
          .two-col{flex-direction:column !important}
          .three-col{flex-direction:column !important}
          .feat-grid{grid-template-columns:1fr !important}
          .stats-row{gap:24px !important;flex-wrap:wrap !important}
          .mock-hide{display:none !important}
        }
      `}</style>

      <div style={{ background:"#0C0D14", color:"#EEEDF8", minHeight:"100vh", fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif" }}>
        <MarketingNav />

        {/* ── HERO ── */}
        <section style={{ textAlign:"center", padding:"88px 24px 0", position:"relative", overflow:"hidden", minHeight:580 }}>
          <CanvasMesh />

          <div style={{ position:"relative", maxWidth:780, margin:"0 auto", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.22)", borderRadius:100, padding:"5px 16px", marginBottom:28, fontSize:12, color:"#A5B4FC", fontWeight:600, letterSpacing:"0.4px" }}>
              <Zap size={11} strokeWidth={2.5} /> India&apos;s AI Financial Operating System
            </div>
            <h1 className="hero-h1" style={{ fontSize:"clamp(42px,6.5vw,74px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-2.5px", marginBottom:22, fontFamily:"Georgia,'Times New Roman',serif", color:"#EEEDF8" }}>
              Where your{" "}
              <span className="grad-text">money</span><br />
              grows smarter
            </h1>
            <p style={{ fontSize:18, color:"#8B8AA8", lineHeight:1.75, maxWidth:520, margin:"0 auto 38px" }}>
              An AI-powered financial OS built for India — tax planning, compliance, investments, and cashflow in one place. Your CFO never sleeps.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link
                href="/register"
                onClick={heroRipple.add}
                style={{ background:"#6366F1", color:"white", fontSize:15, fontWeight:700, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 24px rgba(99,102,241,0.45)", position:"relative", overflow:"hidden" }}
              >
                Get started — it&apos;s free <ArrowRight size={14} />
                {heroRipple.ripples.map(r=>(
                  <span key={r.id} style={{ position:"absolute", left:r.x-25, top:r.y-25, width:50, height:50, borderRadius:"50%", background:"rgba(255,255,255,0.3)", animation:"rippleOut 0.7s ease-out forwards", pointerEvents:"none" }} />
                ))}
              </Link>
              <Link href="/login" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#EEEDF8", fontSize:15, fontWeight:600, textDecoration:"none", padding:"14px 30px", borderRadius:100 }}>
                Sign in
              </Link>
            </div>
            <p style={{ marginTop:14, fontSize:12, color:"#3A3958" }}>No credit card · Free for individuals · Built for India</p>

            {/* Social proof */}
            <div style={{ marginTop:32, display:"flex", alignItems:"center", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
              <div style={{ display:"flex" }}>
                {AVATARS.map((a,i)=>(
                  <div key={i} style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${a.c1},${a.c2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"white", border:"2px solid #0C0D14", marginLeft:i>0?-10:0, zIndex:AVATARS.length-i, position:"relative" }}>
                    {a.init}
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"left" }}>
                <div style={{ display:"flex", gap:2 }}>
                  {[0,1,2,3,4].map(i=><span key={i} style={{ fontSize:11, color:"#F59E0B" }}>★</span>)}
                </div>
                <div style={{ fontSize:11, color:"#555570", marginTop:1 }}>Trusted by founders, freelancers &amp; MSME owners across India</div>
              </div>
            </div>
          </div>

          {/* Browser mockup */}
          <div className="mock-hide" style={{ position:"relative", maxWidth:900, margin:"52px auto 0", zIndex:1, padding:"0 24px" }}>
            <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 72%)", filter:"blur(50px)", pointerEvents:"none" }} />
            <BrowserMockup />
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <StatsBar />

        {/* ── WHAT IS FINANTALYST ── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"96px 28px 0" }}>
          <Reveal>
            <div className="two-col" style={{ display:"flex", gap:64, alignItems:"flex-start" }}>
              <div style={{ flex:"0 0 auto" }}>
                <h2 style={{ fontSize:"clamp(34px,4vw,52px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.08, maxWidth:360, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>
                  What is<br />Finantalyst?
                </h2>
                <Link href="/product" style={{ marginTop:28, display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"#EEEDF8", textDecoration:"none", fontSize:14, fontWeight:700, padding:"10px 22px", borderRadius:100 }}>
                  Explore now <ArrowRight size={13} />
                </Link>
              </div>
              <div style={{ flex:1, paddingTop:8 }}>
                <p style={{ fontSize:"clamp(17px,2.2vw,22px)", color:"#EEEDF8", lineHeight:1.65, fontFamily:"Georgia,serif", fontWeight:400, opacity:.9 }}>
                  Finantalyst is an AI-first financial operating system that helps you understand your money, stay compliant with Indian regulations, and grow your wealth — without needing a CA on speed dial.
                </p>
                <p style={{ fontSize:15, color:"#8B8AA8", lineHeight:1.75, marginTop:16 }}>
                  Built specifically for Indian founders, freelancers, salaried professionals, and MSMEs — it speaks GST, ITR, TDS, and NSE/BSE natively.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── SPOTLIGHT CARDS ── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"60px 28px" }}>
          <Reveal>
            <div className="three-col" style={{ display:"flex", gap:16 }}>
              <div style={{ flex:"2 1 0", background:"linear-gradient(145deg,#131430 0%,#1A1B3A 100%)", border:"1px solid #2A2B4A", borderRadius:20, padding:"36px 36px 0", overflow:"hidden", position:"relative", minHeight:320 }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#6366F1", letterSpacing:"2px", textTransform:"uppercase" }}>Core intelligence</span>
                <h3 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.8px", marginTop:10, marginBottom:12, fontFamily:"Georgia,serif", color:"#EEEDF8", lineHeight:1.15 }}>
                  Money that works<br />for you
                </h3>
                <p style={{ fontSize:14, color:"rgba(238,237,248,0.5)", lineHeight:1.7, maxWidth:320 }}>
                  Deploy capital into the right deductions, tax regime, and investments. Your AI CFO does the heavy lifting.
                </p>
                <div style={{ marginTop:32, height:120, overflow:"hidden" }}>
                  <svg width="100%" height="120" viewBox="0 0 400 120">
                    <defs><linearGradient id="cdf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity="0.25"/><stop offset="100%" stopColor="#6366F1" stopOpacity="0"/></linearGradient></defs>
                    <path d="M0 90 C50 80 100 70 160 55 C220 40 280 30 400 15 L400 120 L0 120Z" fill="url(#cdf)"/>
                    <path d="M0 90 C50 80 100 70 160 55 C220 40 280 30 400 15" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="340" cy="30" r="28" fill="#6366F1" fillOpacity="0.15"/>
                    <circle cx="340" cy="30" r="20" fill="#6366F1" fillOpacity="0.25"/>
                    <text x="340" y="37" textAnchor="middle" fontSize="15" fontWeight="800" fill="#A5B4FC">₹</text>
                  </svg>
                </div>
              </div>
              <TiltCard style={{ flex:"1 1 0", background:"#080912", border:"1px solid #1A1B2E", borderRadius:20, padding:"36px", minHeight:320, display:"flex", flexDirection:"column" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"rgba(165,180,252,0.6)", letterSpacing:"2px", textTransform:"uppercase" }}>Compliance</span>
                <h3 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.6px", marginTop:10, marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8", lineHeight:1.2 }}>Always<br />compliant,<br />never late</h3>
                <p style={{ fontSize:14, color:"rgba(238,237,248,0.45)", lineHeight:1.7, flex:1 }}>40+ statutory due dates. ITR, GST, TDS — colour-coded by urgency.</p>
                <div style={{ marginTop:24, display:"flex", gap:8 }}>
                  {["ITR","GST","TDS","ADV"].map((t,i)=>(
                    <span key={t} style={{ fontSize:10, fontWeight:700, color:i===0?"#10B981":i===1?"#F59E0B":"rgba(165,180,252,0.55)", background:i===0?"rgba(16,185,129,0.1)":i===1?"rgba(245,158,11,0.1)":"rgba(165,180,252,0.06)", border:`1px solid ${i===0?"rgba(16,185,129,0.18)":i===1?"rgba(245,158,11,0.18)":"rgba(165,180,252,0.1)"}`, borderRadius:6, padding:"4px 8px" }}>{t}</span>
                  ))}
                </div>
              </TiltCard>
              <TiltCard style={{ flex:"1 1 0", background:"#0D0E20", border:"1px solid #1A1B2E", borderRadius:20, padding:"36px", minHeight:320, display:"flex", flexDirection:"column" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"rgba(165,180,252,0.6)", letterSpacing:"2px", textTransform:"uppercase" }}>Trust</span>
                <h3 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.6px", marginTop:10, marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8", lineHeight:1.2 }}>100%<br />your<br />decision</h3>
                <p style={{ fontSize:14, color:"rgba(238,237,248,0.45)", lineHeight:1.7, flex:1 }}>The AI suggests, you approve. Nothing files, transfers, or sends without your explicit sign-off.</p>
                <div style={{ marginTop:24, display:"flex", gap:7, alignItems:"center" }}>
                  <span className="live-dot" />
                  <span style={{ fontSize:12, color:"rgba(238,237,248,0.4)" }}>Human-in-the-loop always</span>
                </div>
              </TiltCard>
            </div>
          </Reveal>
        </section>

        {/* ── USE CASES ── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"20px 28px 80px" }}>
          <Reveal>
            <div className="two-col" style={{ display:"flex", gap:48, alignItems:"stretch" }}>
              <div style={{ flex:"1 1 0" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#6366F1", letterSpacing:"2px", textTransform:"uppercase" }}>Finantalyst in action</span>
                <h2 style={{ fontSize:"clamp(32px,3.5vw,48px)", fontWeight:800, letterSpacing:"-1.2px", lineHeight:1.1, marginTop:10, marginBottom:18, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Use cases</h2>
                <p style={{ fontSize:15, color:"#8B8AA8", lineHeight:1.75, marginBottom:24, maxWidth:380 }}>Finantalyst adapts to how you work — founder, freelancer, salaried, or business.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    {label:"Founders & Startups",    desc:"Runway, board reports, Deal Room fundraising"},
                    {label:"Freelancers",             desc:"TDS, advance tax, 44ADA regime optimiser"},
                    {label:"Salaried Professionals", desc:"HRA, 80C, New vs Old regime, Form 16 planning"},
                    {label:"MSMEs & Businesses",     desc:"GST calendar, TDS compliance, cashflow P&L"},
                  ].map(uc=>(
                    <div key={uc.label} className="uc-item">
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#6366F1", marginTop:6, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#EEEDF8", marginBottom:2 }}>{uc.label}</div>
                        <div style={{ fontSize:12, color:"#555570" }}>{uc.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex:"1 1 0", background:"linear-gradient(145deg,#0A0820 0%,#12103A 100%)", border:"1px solid #2A2B4A", borderRadius:20, padding:"40px", display:"flex", flexDirection:"column", minHeight:420, position:"relative", overflow:"hidden" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"rgba(165,180,252,0.6)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Business</span>
                <h3 style={{ fontSize:26, fontWeight:800, fontFamily:"Georgia,serif", color:"#EEEDF8", lineHeight:1.25, marginBottom:14, letterSpacing:"-0.5px" }}>Your business&apos;s<br />financial command<br />centre</h3>
                <p style={{ fontSize:14, color:"rgba(238,237,248,0.5)", lineHeight:1.75, flex:1 }}>GST calendar with GSTR-1 and GSTR-3B scheduled. TDS quarterly filings. Cashflow P&L with burn rate alerts.</p>
                <Link href="/deal-room" style={{ marginTop:28, display:"inline-flex", alignItems:"center", gap:6, color:"#A5B4FC", textDecoration:"none", fontSize:14, fontWeight:600 }}>
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── FEATURES GRID ── */}
        <section style={{ background:"#0E0F1C", borderTop:"1px solid #252640", borderBottom:"1px solid #252640", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"15%", left:"10%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 72%)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"10%", right:"10%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 72%)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px", position:"relative" }}>
            <Reveal>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:12, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Everything your finances need</h2>
                <p style={{ fontSize:15, color:"#555570", maxWidth:420, margin:"0 auto" }}>Six modules working together — all India-specific, no data leaves without your knowledge.</p>
              </div>
            </Reveal>
            <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {FEATURES.map((f,i)=>{
                const Icon=f.icon;
                return (
                  <Reveal key={f.title} delay={i*70}>
                    <TiltCard className="feat-glass">
                      <div className="fi" style={{ width:42, height:42, borderRadius:12, background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                        <Icon size={18} color={f.color} strokeWidth={2} />
                      </div>
                      <h3 style={{ fontSize:15, fontWeight:700, marginBottom:7, color:"#EEEDF8", letterSpacing:"-0.2px" }}>{f.title}</h3>
                      <p style={{ fontSize:13, color:"#555570", lineHeight:1.65 }}>{f.desc}</p>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"72px 28px" }}>
          <Reveal>
            <div style={{ background:"linear-gradient(135deg,#0A0820 0%,#12103A 100%)", border:"1px solid #2A2B4A", borderRadius:24, padding:"52px" }}>
              <p style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"rgba(165,180,252,0.55)", letterSpacing:"2.5px", textTransform:"uppercase", marginBottom:10 }}>Our guarantees</p>
              <h2 style={{ textAlign:"center", fontSize:"clamp(22px,3vw,32px)", fontWeight:800, color:"#EEEDF8", fontFamily:"Georgia,serif", letterSpacing:"-0.6px", marginBottom:40 }}>Built on trust, by design</h2>
              <div className="two-col" style={{ display:"flex", flexWrap:"wrap", gap:16, justifyContent:"center" }}>
                {TRUST.map(t=>{
                  const Icon=t.icon;
                  return (
                    <div key={t.text} style={{ flex:"0 1 280px", display:"flex", alignItems:"center", gap:12, padding:"16px 20px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(165,180,252,0.1)", borderRadius:14 }}>
                      <div style={{ width:32, height:32, borderRadius:10, background:"rgba(99,102,241,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={14} color="#A5B4FC" />
                      </div>
                      <span style={{ fontSize:14, color:"rgba(238,237,248,0.65)", lineHeight:1.45 }}>{t.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding:"0 28px 96px" }}>
          <Reveal>
            <div style={{ maxWidth:800, margin:"0 auto", background:"#131523", border:"1px solid #252640", borderRadius:28, padding:"64px 48px", textAlign:"center", boxShadow:"0 8px 40px rgba(0,0,0,0.4)" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#6366F1,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", boxShadow:"0 8px 24px rgba(99,102,241,0.4)" }}>
                <Zap size={22} color="white" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Ready to take control?</h2>
              <p style={{ fontSize:16, color:"#555570", maxWidth:420, margin:"0 auto 36px" }}>Join users who let Finantalyst handle the numbers while they focus on what matters.</p>
              <Link href="/register" style={{ background:"#6366F1", color:"white", fontSize:15, fontWeight:700, textDecoration:"none", padding:"15px 34px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 6px 24px rgba(99,102,241,0.45)" }}>
                Create free account <ArrowRight size={15} />
              </Link>
              <p style={{ marginTop:14, fontSize:13, color:"#3A3958" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color:"#6366F1", textDecoration:"none", fontWeight:600 }}>Sign in</Link>
              </p>
            </div>
          </Reveal>
        </section>

        <MarketingFooter />
      </div>
    </>
  );
}
