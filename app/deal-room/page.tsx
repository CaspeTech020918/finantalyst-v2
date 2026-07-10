"use client";
import Link from "next/link";
import { ArrowRight, Rocket, Eye, TrendingUp, Lock, AlertTriangle, Users, BarChart3 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

const HOW_IT_WORKS = [
  { n:"01", icon:Rocket,    title:"Startups list their round",     body:"Add your company name, stage (pre-seed to Series B), ask amount, brief, and investor preferences. Your listing is private — only approved investors browse it." },
  { n:"02", icon:Users,     title:"Investors browse and filter",   body:"Investors see the listing and can express interest — preferred contact method and indicative amount. No commitments, no term sheets on platform." },
  { n:"03", icon:TrendingUp,title:"You see the stats and decide",  body:"Track view count, interest count, and reach-out count in real time. You decide who to follow up with and how — Finantalyst steps back completely." },
];

const FOR_STARTUPS = [
  "List your round in under 5 minutes — stage, ask, brief, sector",
  "See how many investors viewed your listing",
  "Track interest expressions with contact preference",
  "Edit or remove your listing at any time",
  "No exclusivity — list on multiple platforms simultaneously",
];

const FOR_INVESTORS = [
  "Browse live fundraising opportunities across stages",
  "Filter by sector, stage, and ask size",
  "Express interest with preferred contact method",
  "No commitment — expressions of interest only",
  "Connect your own deal flow with Finantalyst's AI CFO",
];

const STAGES = [
  { label:"Pre-Seed",  color:"#6366F1", desc:"Idea to MVP, raising ₹25L – ₹2Cr" },
  { label:"Seed",      color:"#10B981", desc:"MVP to product-market fit, ₹1Cr – ₹10Cr" },
  { label:"Series A",  color:"#F59E0B", desc:"Scaling revenue, ₹10Cr – ₹100Cr" },
  { label:"Series B+", color:"#6366F1", desc:"Growth & expansion" },
];

export default function DealRoomPage() {
  return (
    <>
      <style>{`
        @media(max-width:900px){.two-col{flex-direction:column !important}}
        .deal-card-mock{background:#131523;border:1px solid #252640;border-radius:16px;padding:24px}
      `}</style>
      <div style={{ background:"#0C0D14", color:"#EEEDF8", minHeight:"100vh", fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif" }}>
        <MarketingNav active="Deal Room" />

        {/* Hero */}
        <section style={{ textAlign:"center", padding:"96px 28px 72px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"10%", left:"30%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 72%)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"5%", right:"20%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 72%)", filter:"blur(48px)", pointerEvents:"none" }} />
          <div style={{ position:"relative", maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.22)", borderRadius:100, padding:"5px 16px", marginBottom:24, fontSize:12, color:"#A5B4FC", fontWeight:600, letterSpacing:"0.4px" }}>
              <Rocket size={11} /> Private fundraising
            </div>
            <h1 style={{ fontSize:"clamp(38px,6vw,68px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-2.5px", marginBottom:20, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>
              Private fundraising,<br />
              <em style={{ color:"#6366F1", fontStyle:"italic" }}>without the noise.</em>
            </h1>
            <p style={{ fontSize:18, color:"#8B8AA8", lineHeight:1.75, maxWidth:520, margin:"0 auto 36px" }}>
              Startups list rounds. Investors express interest. No money on platform, no middlemen, no public exposure. Just qualified conversations.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/register" style={{ background:"#6366F1", color:"white", fontSize:15, fontWeight:700, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 24px rgba(99,102,241,0.45)" }}>
                List my round <ArrowRight size={14} />
              </Link>
              <Link href="/register" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#EEEDF8", fontSize:15, fontWeight:600, textDecoration:"none", padding:"14px 30px", borderRadius:100 }}>
                Browse deals
              </Link>
            </div>
          </div>
        </section>

        {/* Mock deal card */}
        <section style={{ maxWidth:900, margin:"0 auto", padding:"0 28px 80px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#555570", letterSpacing:"2px", textTransform:"uppercase", marginBottom:24, textAlign:"center" }}>What a listing looks like</p>
          <div className="deal-card-mock">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#6366F1,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"white" }}>F</div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#EEEDF8" }}>FinStack Technologies</div>
                  <div style={{ fontSize:12, color:"#555570" }}>B2B SaaS · Fintech · Delhi NCR</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ fontSize:10, fontWeight:700, background:"rgba(99,102,241,0.1)", color:"#A5B4FC", border:"1px solid rgba(99,102,241,0.2)", borderRadius:6, padding:"4px 10px" }}>SEED</span>
                <span style={{ fontSize:10, fontWeight:700, background:"rgba(16,185,129,0.1)", color:"#6EE7B7", border:"1px solid rgba(16,185,129,0.2)", borderRadius:6, padding:"4px 10px" }}>ACTIVE</span>
              </div>
            </div>
            <div style={{ fontSize:14, color:"#8B8AA8", lineHeight:1.75, marginBottom:24 }}>
              Building the financial operating layer for Indian SMEs — GST, compliance, and cashflow in one API. 200+ paying customers, ₹18L MRR, growing 25% MoM.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              {[{l:"Round Size",v:"₹3 Cr"},{l:"Instrument",v:"CCPS"},{l:"Lead Investor",v:"Open"}].map(s=>(
                <div key={s.l} style={{ padding:"12px 16px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
                  <div style={{ fontSize:11, color:"#555570", marginBottom:4 }}>{s.l}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#EEEDF8" }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:16, padding:"14px 0", borderTop:"1px solid #252640" }}>
              {[{icon:Eye,v:"142",l:"Views"},{icon:Users,v:"8",l:"Interested"},{icon:TrendingUp,v:"3",l:"Reached out"}].map(s=>{
                const Icon=s.icon;
                return (
                  <div key={s.l} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Icon size={14} color="#555570" />
                    <span style={{ fontSize:13, fontWeight:700, color:"#EEEDF8" }}>{s.v}</span>
                    <span style={{ fontSize:12, color:"#555570" }}>{s.l}</span>
                  </div>
                );
              })}
              <div style={{ marginLeft:"auto" }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#6366F1", display:"flex", alignItems:"center", gap:5 }}>
                  Express interest <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ background:"#0E0F1C", borderTop:"1px solid #252640", borderBottom:"1px solid #252640" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#6366F1", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>How it works</p>
            <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:52, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Three steps to a qualified conversation</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {HOW_IT_WORKS.map((s,i)=>{
                const Icon=s.icon;
                return (
                  <div key={s.n} style={{ display:"flex", gap:28, alignItems:"flex-start", padding:"32px 0", borderBottom:i<HOW_IT_WORKS.length-1?"1px solid #252640":"none" }}>
                    <div style={{ flex:"0 0 auto", width:52, height:52, borderRadius:16, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon size={20} color="#6366F1" />
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <span style={{ fontFamily:"Georgia,serif", fontSize:12, fontWeight:800, color:"#3A3958" }}>{s.n}</span>
                        <h3 style={{ fontSize:20, fontWeight:700, color:"#EEEDF8", letterSpacing:"-0.3px" }}>{s.title}</h3>
                      </div>
                      <p style={{ fontSize:15, color:"#8B8AA8", lineHeight:1.75, maxWidth:560 }}>{s.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Startups + For Investors */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
          <div className="two-col" style={{ display:"flex", gap:20 }}>
            {/* Startups */}
            <div style={{ flex:1, background:"linear-gradient(145deg,#0A0820,#12103A)", border:"1px solid #2A2B4A", borderRadius:20, padding:"36px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(99,102,241,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Rocket size={16} color="#A5B4FC" />
                </div>
                <h3 style={{ fontSize:20, fontWeight:800, color:"#EEEDF8", letterSpacing:"-0.3px" }}>For Startups</h3>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {FOR_STARTUPS.map(item=>(
                  <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:"rgba(238,237,248,0.65)", lineHeight:1.5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#6366F1", marginTop:6, flexShrink:0 }} />{item}
                  </div>
                ))}
              </div>
              <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#6366F1", color:"white", textDecoration:"none", fontSize:13, fontWeight:700, padding:"10px 20px", borderRadius:100, boxShadow:"0 4px 16px rgba(99,102,241,0.4)" }}>
                List my round <ArrowRight size={12} />
              </Link>
            </div>
            {/* Investors */}
            <div style={{ flex:1, background:"#131523", border:"1px solid #252640", borderRadius:20, padding:"36px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(16,185,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <BarChart3 size={16} color="#10B981" />
                </div>
                <h3 style={{ fontSize:20, fontWeight:800, color:"#EEEDF8", letterSpacing:"-0.3px" }}>For Investors</h3>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {FOR_INVESTORS.map(item=>(
                  <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:"#8B8AA8", lineHeight:1.5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#10B981", marginTop:6, flexShrink:0 }} />{item}
                  </div>
                ))}
              </div>
              <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", color:"#10B981", textDecoration:"none", fontSize:13, fontWeight:700, padding:"10px 20px", borderRadius:100 }}>
                Browse deals <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stages */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 72px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#555570", letterSpacing:"2px", textTransform:"uppercase", marginBottom:20 }}>Stages supported</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
            {STAGES.map(s=>(
              <div key={s.label} style={{ background:"#131523", border:"1px solid #252640", borderRadius:14, padding:"20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:s.color }} />
                  <span style={{ fontSize:15, fontWeight:700, color:"#EEEDF8" }}>{s.label}</span>
                </div>
                <div style={{ fontSize:12, color:"#555570", lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Important disclaimer */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 80px" }}>
          <div style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.18)", borderRadius:16, padding:"28px" }}>
            <div style={{ display:"flex", gap:14 }}>
              <AlertTriangle size={20} color="#EF4444" style={{ flexShrink:0, marginTop:2 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#FCA5A5", marginBottom:8 }}>Important — regulatory notice</div>
                <div style={{ fontSize:13, color:"#8B8AA8", lineHeight:1.8 }}>
                  <strong style={{ color:"#EEEDF8" }}>No money moves on this platform.</strong> Deal Room is a private directory for startups to display fundraising intent and for investors to express interest. It is not a SEBI-registered stock exchange, alternative investment platform, or crowdfunding platform. All expressions of interest are non-binding. Actual investment agreements must be executed offline through appropriate legal channels. Finantalyst does not provide investment advice and is not responsible for any transactions entered into between parties who connect through this platform.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"0 28px 96px" }}>
          <div style={{ maxWidth:700, margin:"0 auto", background:"linear-gradient(135deg,#0A0820,#12103A)", border:"1px solid #2A2B4A", borderRadius:24, padding:"56px 48px", textAlign:"center" }}>
            <Lock size={28} color="#A5B4FC" style={{ margin:"0 auto 20px" }} />
            <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:800, letterSpacing:"-0.8px", marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Private. Qualified. Your terms.</h2>
            <p style={{ fontSize:15, color:"rgba(238,237,248,0.45)", marginBottom:32 }}>List your round or explore live deals — free, no commitment, no public exposure.</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/register" style={{ background:"#6366F1", color:"white", fontSize:14, fontWeight:700, textDecoration:"none", padding:"13px 26px", borderRadius:100, display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 20px rgba(99,102,241,0.4)" }}>
                List my round <ArrowRight size={13} />
              </Link>
              <Link href="/register" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#EEEDF8", fontSize:14, fontWeight:600, textDecoration:"none", padding:"13px 26px", borderRadius:100 }}>
                Browse deals
              </Link>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </>
  );
}
