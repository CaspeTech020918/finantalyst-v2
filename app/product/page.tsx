"use client";
import Link from "next/link";
import { ArrowRight, Bot, FileText, ShieldCheck, BarChart3, IndianRupee, Rocket, Zap, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

const MODULES = [
  { icon: Bot,         color:"#6366F1", bg:"rgba(99,102,241,0.1)",  title:"AI CFO",           desc:"Conversational AI with India-specific financial knowledge. Ask about taxes, investments, compliance — get plain English answers.",    href:"/register" },
  { icon: FileText,    color:"#F59E0B", bg:"rgba(245,158,11,0.1)",  title:"Tax Planning",     desc:"FY 2025-26 New vs Old regime comparison with your actual income and deductions. Advance tax schedule auto-generated.",               href:"/tax" },
  { icon: ShieldCheck, color:"#10B981", bg:"rgba(16,185,129,0.1)",  title:"Compliance",       desc:"40+ statutory deadlines pre-loaded for your entity type — ITR, GST, TDS, advance tax. Colour-coded urgency. One-click mark-done.",   href:"/compliance" },
  { icon: BarChart3,   color:"#6366F1", bg:"rgba(99,102,241,0.1)",  title:"Investments",      desc:"Live NSE/BSE quotes, NIFTY 50, SENSEX. MF NAV search for 10,000+ schemes. CAMS import. Sector breakdown.",                         href:"/register" },
  { icon: IndianRupee, color:"#10B981", bg:"rgba(16,185,129,0.1)",  title:"Cashflow",         desc:"Track every rupee. Manual entry or bank import. Auto-categorisation, monthly P&L, burn rate alerts for businesses.",               href:"/register" },
  { icon: Rocket,      color:"#F59E0B", bg:"rgba(245,158,11,0.1)",  title:"Deal Room",        desc:"Startups list funding rounds. Investors express interest. Private matchmaking with live view/interest stats.",                      href:"/deal-room" },
];

const STEPS = [
  { n:"01", title:"Connect your financial picture", body:"Add your income sources, accounts, and entity type. Finantalyst builds your financial profile — no bank credentials, no account linking required." },
  { n:"02", title:"Ask your AI CFO anything",       body:"Type any financial question in plain English. Get India-specific answers about tax saving, compliance dates, investment options, regime comparison." },
  { n:"03", title:"Decide — never be surprised",    body:"Every suggestion, estimate, and recommendation waits for your explicit approval. The AI proposes; you decide. Nothing moves without your sign-off." },
];

const INDIA = [
  "GST — GSTR-1, GSTR-3B, GSTR-9 deadlines built in",
  "Income Tax — New vs Old regime, 87A rebate, cess calculations",
  "TDS — quarterly filing calendar for businesses",
  "NSE/BSE — real-time quotes from Yahoo Finance API",
  "AMFI — 10,000+ mutual fund NAV lookup via MFAPI.in",
  "Advance Tax — four instalment schedule for FY 2025-26",
];

export default function ProductPage() {
  return (
    <>
      <style>{`
        .mod-card{background:#131523;border:1px solid #252640;border-radius:16px;padding:26px;transition:box-shadow 0.2s,transform 0.2s;text-decoration:none;display:block}
        .mod-card:hover{box-shadow:0 8px 32px rgba(99,102,241,0.16);transform:translateY(-3px)}
        @media(max-width:900px){.two-col{flex-direction:column !important}.feat-grid{grid-template-columns:1fr !important}}
      `}</style>
      <div style={{ background:"#0C0D14", color:"#EEEDF8", minHeight:"100vh", fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif" }}>
        <MarketingNav active="Product" />

        {/* Hero */}
        <section style={{ textAlign:"center", padding:"96px 28px 80px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"10%", left:"20%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 72%)", filter:"blur(56px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"5%", right:"18%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 72%)", filter:"blur(48px)", pointerEvents:"none" }} />
          <div style={{ position:"relative", maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.22)", borderRadius:100, padding:"5px 16px", marginBottom:24, fontSize:12, color:"#A5B4FC", fontWeight:600, letterSpacing:"0.4px" }}>
              <Zap size={11} /> Platform overview
            </div>
            <h1 style={{ fontSize:"clamp(38px,6vw,68px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-2.5px", marginBottom:20, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>
              One platform for your<br />
              <em style={{ color:"#6366F1", fontStyle:"italic" }}>complete financial life</em>
            </h1>
            <p style={{ fontSize:18, color:"#8B8AA8", lineHeight:1.75, maxWidth:540, margin:"0 auto 36px" }}>
              Tax planning, compliance, investments, cashflow, AI intelligence, and fundraising — six modules built for India, in one login.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/register" style={{ background:"#6366F1", color:"white", fontSize:15, fontWeight:700, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 24px rgba(99,102,241,0.45)" }}>
                Start for free <ArrowRight size={14} />
              </Link>
              <Link href="/login" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#EEEDF8", fontSize:15, fontWeight:600, textDecoration:"none", padding:"14px 30px", borderRadius:100 }}>
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Modules */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 80px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#555570", letterSpacing:"2px", textTransform:"uppercase", marginBottom:32, textAlign:"center" }}>Six modules, one login</p>
          <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {MODULES.map(m=>{
              const Icon=m.icon;
              return (
                <Link key={m.title} href={m.href} className="mod-card">
                  <div style={{ width:44, height:44, borderRadius:12, background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                    <Icon size={20} color={m.color} strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8, color:"#EEEDF8", letterSpacing:"-0.2px" }}>{m.title}</h3>
                  <p style={{ fontSize:13, color:"#555570", lineHeight:1.65, marginBottom:12 }}>{m.desc}</p>
                  <span style={{ fontSize:12, color:m.color, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>Learn more <ArrowRight size={11} /></span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section style={{ background:"#0E0F1C", borderTop:"1px solid #252640", borderBottom:"1px solid #252640" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#6366F1", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>How it works</p>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:800, letterSpacing:"-1px", marginBottom:56, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Three steps to financial clarity</h2>
            <div className="two-col" style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {STEPS.map((s,i)=>(
                <div key={s.n} style={{ display:"flex", gap:32, alignItems:"flex-start", padding:"32px 0", borderBottom: i<STEPS.length-1 ? "1px solid #252640" : "none" }}>
                  <div style={{ flex:"0 0 auto", width:56, height:56, borderRadius:16, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:18, fontWeight:800, color:"#6366F1" }}>{s.n}</div>
                  <div>
                    <h3 style={{ fontSize:20, fontWeight:700, color:"#EEEDF8", marginBottom:8, letterSpacing:"-0.3px" }}>{s.title}</h3>
                    <p style={{ fontSize:15, color:"#8B8AA8", lineHeight:1.75, maxWidth:560 }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for India */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
          <div className="two-col" style={{ display:"flex", gap:64, alignItems:"flex-start" }}>
            <div style={{ flex:"0 0 auto", maxWidth:360 }}>
              <p style={{ fontSize:10, fontWeight:700, color:"#10B981", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>India-first by design</p>
              <h2 style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:800, letterSpacing:"-1px", lineHeight:1.1, fontFamily:"Georgia,serif", color:"#EEEDF8", marginBottom:16 }}>Speaks the language of Indian finance</h2>
              <p style={{ fontSize:14, color:"#8B8AA8", lineHeight:1.75 }}>Every calculation, deadline, and regulation is built specifically for India — not adapted from a US/EU product.</p>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
              {INDIA.map(item=>(
                <div key={item} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#131523", border:"1px solid #252640", borderRadius:12 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span style={{ fontSize:14, color:"#EEEDF8" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"0 28px 96px" }}>
          <div style={{ maxWidth:700, margin:"0 auto", background:"linear-gradient(135deg,#0A0820 0%,#12103A 100%)", border:"1px solid #2A2B4A", borderRadius:24, padding:"56px 48px", textAlign:"center" }}>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:800, letterSpacing:"-0.8px", marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>All six modules. One free account.</h2>
            <p style={{ fontSize:15, color:"rgba(238,237,248,0.55)", marginBottom:32 }}>Start with tax planning, add compliance, connect investments — build your financial OS at your own pace.</p>
            <Link href="/register" style={{ background:"#6366F1", color:"white", fontSize:15, fontWeight:700, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(99,102,241,0.45)" }}>
              Get started free <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </>
  );
}
