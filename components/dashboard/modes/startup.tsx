"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Flame, TrendingUp, Users, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { icon: <Flame size={20} />, label: "Burn & runway", desc: "Monthly burn, cash left, months", href: "/dashboard/cashflow", color: "var(--color-red)" },
  { icon: <TrendingUp size={20} />, label: "MRR tracking", desc: "Revenue growth & churn", href: "/dashboard/cashflow", color: "var(--color-emerald)" },
  { icon: <Users size={20} />, label: "Investor report", desc: "AI-generated board update", href: "/dashboard/cfo", color: "var(--color-indigo)" },
  { icon: <Bot size={20} />, label: "AI CFO", desc: "Fundraising & unit economics", href: "/dashboard/cfo", color: "var(--color-indigo)" },
];

export function StartupDashboard() {
  return (
    <div className="space-y-6">
      <GlassCard variant="accent-indigo" padding="lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-subheading text-[var(--color-indigo)] mb-1">Startup setup</p>
            <h2 className="text-heading text-[var(--color-text-primary)] mb-2">Your startup finance cockpit</h2>
            <p className="text-caption text-[var(--color-text-secondary)] max-w-lg">
              Monitor burn rate and runway in real time, track MRR growth, generate investor-ready board updates and get AI analysis of your unit economics — built for founders.
            </p>
          </div>
          <Link href="/dashboard/cashflow">
            <Button variant="primary" size="md">
              Add bank data <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </GlassCard>

      <div>
        <p className="text-subheading text-[var(--color-text-muted)] mb-3">What Finantalyst tracks for you</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Runway", desc: "Months of runway at current net burn rate." },
            { title: "Net Burn", desc: "Monthly cash consumed minus revenue." },
            { title: "MRR", desc: "Monthly recurring revenue with MoM growth." },
            { title: "Default Alive", desc: "Projected month when revenue covers burn." },
          ].map((item) => (
            <GlassCard key={item.title} padding="md">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{item.desc}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">No data yet — connect your bank account.</p>
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
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-indigo)] transition-colors">{a.label}</p>
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
