"use client";
import Link from "next/link";
import { ArrowRight, Zap, AlertTriangle, CheckCircle2, IndianRupee } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

const INCOME_TYPES = [
  { label:"Salary / CTC",        tag:"Salaried",   color:"#6366F1" },
  { label:"Freelance / Consulting", tag:"44ADA",    color:"#F59E0B" },
  { label:"Rental Income",       tag:"Section 24b", color:"#10B981" },
  { label:"Long-term Capital Gains (LTCG)", tag:"Equity/Debt", color:"#6366F1" },
  { label:"Short-term Capital Gains (STCG)", tag:"15%",        color:"#F59E0B" },
  { label:"Other Sources",       tag:"FD/Dividend", color:"#10B981" },
];

const DEDUCTIONS = [
  { section:"80C",  limit:"₹1,50,000", items:"PF, ELSS, PPF, LIC, home loan principal" },
  { section:"80D",  limit:"₹25,000+",  items:"Health insurance — self, spouse, children, parents" },
  { section:"NPS",  limit:"₹50,000",   items:"Additional deduction under 80CCD(1B)" },
  { section:"HRA",  limit:"Actual rent", items:"Exempt portion calculated from salary + rent paid" },
  { section:"24(b)",limit:"₹2,00,000", items:"Home loan interest deduction" },
  { section:"80TTA",limit:"₹10,000",   items:"Savings account interest (Old regime)" },
];

const ADVANCE_TAX = [
  { date:"15 June 2025",     pct:"15%",  label:"1st instalment" },
  { date:"15 September 2025",pct:"45%",  label:"2nd instalment (cumulative)" },
  { date:"15 December 2025", pct:"75%",  label:"3rd instalment (cumulative)" },
  { date:"15 March 2026",    pct:"100%", label:"Final instalment" },
];

export default function TaxPage() {
  return (
    <>
      <style>{`
        @media(max-width:900px){.two-col{flex-direction:column !important}}
        .regime-card{border-radius:16px;padding:28px;flex:1}
      `}</style>
      <div style={{ background:"#0C0D14", color:"#EEEDF8", minHeight:"100vh", fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif" }}>
        <MarketingNav active="Tax Planning" />

        {/* Hero */}
        <section style={{ textAlign:"center", padding:"96px 28px 72px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:560, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,158,11,0.14) 0%,transparent 72%)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"relative", maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.22)", borderRadius:100, padding:"5px 16px", marginBottom:24, fontSize:12, color:"#FCD34D", fontWeight:600, letterSpacing:"0.4px" }}>
              <IndianRupee size={11} /> FY 2025-26 Tax Planning
            </div>
            <h1 style={{ fontSize:"clamp(38px,6vw,68px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-2.5px", marginBottom:20, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>
              Know exactly what<br />
              <em style={{ color:"#F59E0B", fontStyle:"italic" }}>you owe.</em> Not an estimate.
            </h1>
            <p style={{ fontSize:18, color:"#8B8AA8", lineHeight:1.75, maxWidth:520, margin:"0 auto 36px" }}>
              Deterministic New vs Old regime comparison using your actual income and deductions — all calculations for FY 2025-26 done without an AI ever inventing a number.
            </p>
            <Link href="/register" style={{ background:"#F59E0B", color:"#0C0D14", fontSize:15, fontWeight:800, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:8 }}>
              Try Tax Planning <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Regime comparison mock */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 80px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#555570", letterSpacing:"2px", textTransform:"uppercase", marginBottom:28, textAlign:"center" }}>New vs Old Regime — side by side</p>
          <div className="two-col" style={{ display:"flex", gap:16 }}>
            {/* New Regime */}
            <div className="regime-card" style={{ background:"linear-gradient(145deg,#0A0820,#12103A)", border:"2px solid #6366F1" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#A5B4FC", letterSpacing:"0.5px" }}>NEW REGIME</span>
                <span style={{ fontSize:10, fontWeight:700, background:"rgba(99,102,241,0.15)", color:"#A5B4FC", border:"1px solid rgba(99,102,241,0.3)", borderRadius:6, padding:"3px 8px" }}>Default FY26</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {[["₹0 – ₹3L","0%"],["₹3L – ₹7L","5%"],["₹7L – ₹10L","10%"],["₹10L – ₹12L","15%"],["₹12L – ₹15L","20%"],["Above ₹15L","30%"]].map(([slab,rate])=>(
                  <div key={slab} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:"rgba(99,102,241,0.06)", borderRadius:8 }}>
                    <span style={{ fontSize:13, color:"#8B8AA8" }}>{slab}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#A5B4FC" }}>{rate}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:10 }}>
                <div style={{ fontSize:11, color:"#6EE7B7", marginBottom:3 }}>87A Rebate</div>
                <div style={{ fontSize:13, color:"#10B981", fontWeight:600 }}>₹0 tax if income ≤ ₹12,00,000</div>
              </div>
            </div>
            {/* Old Regime */}
            <div className="regime-card" style={{ background:"#131523", border:"1px solid #252640" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#8B8AA8", letterSpacing:"0.5px" }}>OLD REGIME</span>
                <span style={{ fontSize:10, fontWeight:700, background:"rgba(245,158,11,0.1)", color:"#FCD34D", border:"1px solid rgba(245,158,11,0.2)", borderRadius:6, padding:"3px 8px" }}>More deductions</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {[["₹0 – ₹2.5L","0%"],["₹2.5L – ₹5L","5%"],["₹5L – ₹10L","20%"],["Above ₹10L","30%"]].map(([slab,rate])=>(
                  <div key={slab} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}>
                    <span style={{ fontSize:13, color:"#8B8AA8" }}>{slab}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#EEEDF8" }}>{rate}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 14px", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:10 }}>
                <div style={{ fontSize:11, color:"#FCD34D", marginBottom:3 }}>80C + 80D + HRA + more</div>
                <div style={{ fontSize:13, color:"#F59E0B", fontWeight:600 }}>Up to ₹3.5L+ in deductions possible</div>
              </div>
            </div>
          </div>
          <p style={{ textAlign:"center", fontSize:12, color:"#555570", marginTop:16 }}>Finantalyst shows you exactly which regime saves more <em>with your specific numbers.</em></p>
        </section>

        {/* Deductions tracked */}
        <section style={{ background:"#0E0F1C", borderTop:"1px solid #252640", borderBottom:"1px solid #252640" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#F59E0B", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Deductions we track</p>
            <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:40, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Every section, every rupee</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:14 }}>
              {DEDUCTIONS.map(d=>(
                <div key={d.section} style={{ background:"#131523", border:"1px solid #252640", borderRadius:14, padding:"20px 22px", display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:800, color:"#F59E0B", minWidth:52 }}>{d.section}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#EEEDF8", marginBottom:3 }}>Limit: {d.limit}</div>
                    <div style={{ fontSize:12, color:"#555570", lineHeight:1.5 }}>{d.items}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Income types */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#6366F1", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Income we handle</p>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:36, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>All income types, one view</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
            {INCOME_TYPES.map(t=>(
              <div key={t.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#131523", border:"1px solid #252640", borderRadius:12 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:t.color, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#EEEDF8" }}>{t.label}</div>
                  <div style={{ fontSize:11, color:"#555570" }}>{t.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advance tax */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 72px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#10B981", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Advance Tax</p>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:32, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>FY 2025-26 instalment schedule</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:0, background:"#131523", border:"1px solid #252640", borderRadius:16, overflow:"hidden" }}>
            {ADVANCE_TAX.map((a,i)=>(
              <div key={a.date} style={{ display:"flex", alignItems:"center", gap:20, padding:"18px 24px", borderBottom:i<ADVANCE_TAX.length-1?"1px solid #252640":"none" }}>
                <div style={{ flex:"0 0 180px", fontSize:13, fontWeight:600, color:"#EEEDF8" }}>{a.date}</div>
                <div style={{ flex:"0 0 60px", fontSize:22, fontWeight:800, color:"#10B981", fontFamily:"Georgia,serif" }}>{a.pct}</div>
                <div style={{ fontSize:13, color:"#555570" }}>{a.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:"#3A3958", marginTop:12 }}>Missed advance tax = 1% interest per month under Section 234B/234C.</p>
        </section>

        {/* Regulated disclaimer */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 80px" }}>
          <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:16, padding:"24px 28px", display:"flex", gap:16 }}>
            <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink:0, marginTop:2 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#F59E0B", marginBottom:6 }}>Planning tool only — not a tax filing service</div>
              <div style={{ fontSize:13, color:"#8B8AA8", lineHeight:1.7 }}>
                Finantalyst is a financial planning and estimation tool. All tax calculations are for informational purposes only and do not constitute tax advice. For actual ITR filing, consult a qualified CA or use an ERI-registered platform. Numbers shown are indicative and based on the information you provide.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"0 28px 96px" }}>
          <div style={{ maxWidth:700, margin:"0 auto", background:"linear-gradient(135deg,#0A0820,#12103A)", border:"1px solid #2A2B4A", borderRadius:24, padding:"56px 48px", textAlign:"center" }}>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:800, letterSpacing:"-0.8px", marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Know your tax number today.</h2>
            <p style={{ fontSize:15, color:"rgba(238,237,248,0.5)", marginBottom:32 }}>Add your income and deductions — see New vs Old regime in seconds. Free, no CA needed.</p>
            <Link href="/register" style={{ background:"#F59E0B", color:"#0C0D14", fontSize:15, fontWeight:800, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:8 }}>
              Try Tax Planning <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </>
  );
}
