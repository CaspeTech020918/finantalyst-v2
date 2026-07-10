"use client";
import Link from "next/link";
import { ArrowRight, Zap, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

const ENTITIES = [
  { type:"Individual",   desc:"Salaried / investor",     events:["ITR-1 / ITR-2","Advance tax (4 instalments)","Form 26AS reconciliation"] },
  { type:"Freelancer",   desc:"Section 44ADA / 44AB",    events:["ITR-3 / ITR-4","Advance tax (4 instalments)","Presumptive taxation deadlines"] },
  { type:"Business",     desc:"MSME / Private Ltd",      events:["Monthly GSTR-1 + GSTR-3B","TDS quarterly (24Q/26Q)","Advance tax","Annual GSTR-9"] },
  { type:"LLP",          desc:"ROC + Income Tax",        events:["ROC Annual Return (Form 11)","LLP-8 (financials)","ITR-5","Advance tax"] },
];

const FILING_TYPES = [
  { category:"Income Tax",  color:"#6366F1", items:["ITR filing — Jul 31 (non-audit) / Oct 31 (audit)","Advance tax — 4 instalments across the FY","Form 26AS and AIS reconciliation"] },
  { category:"GST",         color:"#10B981", items:["GSTR-1 — 11th of every month (outward supplies)","GSTR-3B — 20th of every month (tax payment)","GSTR-9 — Annual return by Dec 31"] },
  { category:"TDS",         color:"#F59E0B", items:["TDS quarterly filing (Form 24Q/26Q/27Q)","TDS certificate issuance (Form 16/16A)","Annual TDS return reconciliation"] },
  { category:"Corporate",   color:"#6366F1", items:["ROC Annual Return (MCA)","Board resolution deadlines","LLP Form 11 + 8 filings"] },
];

const URGENCY = [
  { color:"#EF4444", bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.2)",  label:"Overdue / Due in 7 days",   desc:"Immediate action required. Penalties and interest may already be accruing." },
  { color:"#F59E0B", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.2)", label:"Due in 8–30 days",           desc:"Plan and prepare now. Gather documents, check figures, avoid last-minute rush." },
  { color:"#10B981", bg:"rgba(16,185,129,0.1)", border:"rgba(16,185,129,0.2)", label:"More than 30 days away",     desc:"Upcoming — on your radar, no immediate action needed." },
  { color:"#555570", bg:"rgba(85,85,112,0.1)",  border:"rgba(85,85,112,0.2)",  label:"Completed / Filed",          desc:"Mark done in one click. Finantalyst logs the completion date for your records." },
];

export default function CompliancePage() {
  return (
    <>
      <style>{`
        @media(max-width:900px){.two-col{flex-direction:column !important}.ent-grid{grid-template-columns:1fr !important}}
      `}</style>
      <div style={{ background:"#0C0D14", color:"#EEEDF8", minHeight:"100vh", fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif" }}>
        <MarketingNav active="Compliance" />

        {/* Hero */}
        <section style={{ textAlign:"center", padding:"96px 28px 72px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:560, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.16) 0%,transparent 72%)", filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"relative", maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.22)", borderRadius:100, padding:"5px 16px", marginBottom:24, fontSize:12, color:"#6EE7B7", fontWeight:600, letterSpacing:"0.4px" }}>
              <ShieldCheck size={11} /> FY 2025-26 Compliance Calendar
            </div>
            <h1 style={{ fontSize:"clamp(38px,6vw,68px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-2.5px", marginBottom:20, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>
              40+ deadlines.<br />
              <em style={{ color:"#10B981", fontStyle:"italic" }}>30 seconds</em> to set up.
            </h1>
            <p style={{ fontSize:18, color:"#8B8AA8", lineHeight:1.75, maxWidth:520, margin:"0 auto 36px" }}>
              Generate your complete FY 2025-26 compliance calendar — ITR, GST, TDS, advance tax, ROC — customised to your entity type. Never miss a deadline again.
            </p>
            <Link href="/register" style={{ background:"#10B981", color:"white", fontSize:15, fontWeight:800, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 4px 24px rgba(16,185,129,0.4)" }}>
              Set up my calendar <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Stats strip */}
        <div style={{ borderTop:"1px solid #252640", borderBottom:"1px solid #252640", background:"#0E0F1C" }}>
          <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 28px", display:"flex", justifyContent:"center", gap:52, flexWrap:"wrap" }}>
            {[{v:"40+",l:"Pre-loaded events"},{v:"4",l:"Entity types supported"},{v:"< 30s",l:"Setup time"},{v:"₹0",l:"CA fee for calendar setup"}].map(s=>(
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"#10B981", fontFamily:"Georgia,serif" }}>{s.v}</div>
                <div style={{ fontSize:12, color:"#555570", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Entity picker */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#10B981", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Your entity, your calendar</p>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:40, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Pick your entity type — we do the rest</h2>
          <div className="ent-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
            {ENTITIES.map((e,i)=>(
              <div key={e.type} style={{ background:i===0?"linear-gradient(145deg,#0A1A14,#0F2820)":i===1?"linear-gradient(145deg,#0D1A0A,#122016)":"#131523", border:`1px solid ${i<2?"rgba(16,185,129,0.2)":"#252640"}`, borderRadius:16, padding:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#EEEDF8", letterSpacing:"-0.3px" }}>{e.type}</div>
                    <div style={{ fontSize:12, color:"#555570", marginTop:3 }}>{e.desc}</div>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:10, background:"rgba(16,185,129,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <CheckCircle2 size={16} color="#10B981" />
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {e.events.map(ev=>(
                    <div key={ev} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#8B8AA8" }}>
                      <div style={{ width:4, height:4, borderRadius:"50%", background:"#10B981", flexShrink:0 }} />{ev}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filing types */}
        <section style={{ background:"#0E0F1C", borderTop:"1px solid #252640", borderBottom:"1px solid #252640" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#555570", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Types of filings</p>
            <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:40, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Every filing type, all in one calendar</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
              {FILING_TYPES.map(ft=>(
                <div key={ft.category} style={{ background:"#131523", border:"1px solid #252640", borderRadius:16, padding:"24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:ft.color }} />
                    <span style={{ fontSize:14, fontWeight:700, color:"#EEEDF8" }}>{ft.category}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {ft.items.map(item=>(
                      <div key={item} style={{ fontSize:13, color:"#8B8AA8", lineHeight:1.5, paddingLeft:16, borderLeft:`2px solid ${ft.color}30` }}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Urgency system */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 28px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"#6366F1", letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Colour-coded urgency</p>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:36, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>What needs attention — at a glance</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {URGENCY.map(u=>(
              <div key={u.label} style={{ display:"flex", alignItems:"center", gap:20, padding:"20px 24px", background:u.bg, border:`1px solid ${u.border}`, borderRadius:14 }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:u.color, flexShrink:0 }} />
                <div style={{ flex:"0 0 220px" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:u.color }}>{u.label}</div>
                </div>
                <div style={{ fontSize:13, color:"#8B8AA8", lineHeight:1.5 }}>{u.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 28px 80px" }}>
          <div style={{ background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:16, padding:"24px 28px", display:"flex", gap:16 }}>
            <AlertTriangle size={20} color="#A5B4FC" style={{ flexShrink:0, marginTop:2 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#A5B4FC", marginBottom:6 }}>Planning tool — not a filing service</div>
              <div style={{ fontSize:13, color:"#8B8AA8", lineHeight:1.7 }}>
                Finantalyst&apos;s Compliance Calendar provides deadline reminders and planning guidance. It does not file your returns or make representations to tax authorities. For actual ITR, GST, or TDS filing, use a qualified CA, licensed ERI, or GST Suvidha Provider.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"0 28px 96px" }}>
          <div style={{ maxWidth:700, margin:"0 auto", background:"linear-gradient(135deg,#0A1A14,#0F2820)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:24, padding:"56px 48px", textAlign:"center" }}>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:800, letterSpacing:"-0.8px", marginBottom:14, fontFamily:"Georgia,serif", color:"#EEEDF8" }}>Your FY 2025-26 calendar, ready in 30 seconds.</h2>
            <p style={{ fontSize:15, color:"rgba(238,237,248,0.45)", marginBottom:32 }}>Pick your entity type, toggle GST and TDS — all 40+ deadlines generated instantly.</p>
            <Link href="/register" style={{ background:"#10B981", color:"white", fontSize:15, fontWeight:800, textDecoration:"none", padding:"14px 30px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(16,185,129,0.4)" }}>
              Set up my calendar <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </>
  );
}
