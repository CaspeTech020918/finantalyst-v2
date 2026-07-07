"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, ShieldCheck, Bot, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { icon: <Wallet size={20} />, label: "Cash flow", desc: "Inflows, outflows & runway", href: "/dashboard/cashflow", color: "var(--color-emerald)" },
  { icon: <TrendingUp size={20} />, label: "P&L snapshot", desc: "Revenue, costs and margins", href: "/dashboard/cashflow", color: "var(--color-indigo)" },
  { icon: <ShieldCheck size={20} />, label: "Compliance", desc: "GST, TDS, ROC deadlines", href: "/dashboard/compliance", color: "var(--color-amber)" },
  { icon: <Bot size={20} />, label: "AI CFO", desc: "Narrative reports for your team", href: "/dashboard/cfo", color: "var(--color-indigo)" },
];

export function BusinessDashboard() {
  return (
    <div className="space-y-6">
      {/* Regulated notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25">
        <AlertTriangle size={15} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-amber)]">Important:</span> GST filing, TDS remittance and payroll require a licensed CA or GSP partner. Finantalyst prepares and alerts — you approve before anything is filed or paid.
        </p>
      </div>

      <GlassCard variant="accent-amber" padding="lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-subheading text-[var(--color-amber)] mb-1">Business setup</p>
            <h2 className="text-heading text-[var(--color-text-primary)] mb-2">Your business command centre</h2>
            <p className="text-caption text-[var(--color-text-secondary)] max-w-lg">
              Connect your accounting data to monitor P&L, track cash flow, stay ahead of GST and TDS deadlines and get AI-generated CFO narratives — built for Indian SMBs.
            </p>
          </div>
          <Link href="/dashboard/cashflow">
            <Button variant="primary" size="md">
              Connect accounts <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </GlassCard>

      <div>
        <p className="text-subheading text-[var(--color-text-muted)] mb-3">What Finantalyst tracks for you</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Monthly Revenue", desc: "Total inflows from all revenue streams." },
            { title: "Cash Runway", desc: "Months of operations left at current burn rate." },
            { title: "GST Payable", desc: "GSTR-3B estimate for the current filing period." },
            { title: "Gross Margin", desc: "Revenue minus direct costs as a percentage." },
          ].map((item) => (
            <GlassCard key={item.title} padding="md">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{item.desc}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">No data yet — connect your books.</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div>
        <p className="text-subheading text-[var(--color-text-muted)] mb-3">Quick actions</p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.label} href={a.href}>
              <GlassCard padding="md" className="hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${a.color} 15%, transparent)`, color: a.color }}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-amber)] transition-colors">{a.label}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{a.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--color-text-muted)]" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
