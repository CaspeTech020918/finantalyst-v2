"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, FileText, PiggyBank, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { icon: <Wallet size={20} />, label: "Track expenses", desc: "Log your income & spending", href: "/dashboard/cashflow", color: "var(--color-indigo)" },
  { icon: <TrendingUp size={20} />, label: "View investments", desc: "Mutual funds, stocks, gold", href: "/dashboard/investments", color: "var(--color-emerald)" },
  { icon: <FileText size={20} />, label: "Plan your tax", desc: "New vs Old regime estimate", href: "/dashboard/tax", color: "var(--color-amber)" },
  { icon: <PiggyBank size={20} />, label: "Talk to AI CFO", desc: "Get personalised insights", href: "/dashboard/cfo", color: "var(--color-indigo)" },
];

export function IndividualDashboard() {
  return (
    <div className="space-y-6">
      {/* Setup banner */}
      <GlassCard variant="accent-indigo" padding="lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-subheading text-[var(--color-indigo)] mb-1">Get started</p>
            <h2 className="text-heading text-[var(--color-text-primary)] mb-2">Set up your personal finance tracker</h2>
            <p className="text-caption text-[var(--color-text-secondary)] max-w-lg">
              Finantalyst helps you track income & expenses, estimate your tax liability, monitor investments and get AI-powered financial insights — all in one place.
            </p>
          </div>
          <Link href="/dashboard/cashflow">
            <Button variant="primary" size="md">
              Start setup <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* What this dashboard tracks */}
      <div>
        <p className="text-subheading text-[var(--color-text-muted)] mb-3">What Finantalyst tracks for you</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Net Worth", desc: "Your assets minus liabilities — updated as you add accounts." },
            { title: "Monthly Cash Flow", desc: "Income vs expenses broken down by category." },
            { title: "Tax Estimate", desc: "Real-time ITR estimate under New or Old regime." },
            { title: "Investment Returns", desc: "XIRR across mutual funds, stocks, FDs and gold." },
          ].map((item) => (
            <GlassCard key={item.title} padding="md">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{item.desc}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">No data yet — connect your accounts to see this.</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-subheading text-[var(--color-text-muted)] mb-3">Quick actions</p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href} href={a.href}>
              <GlassCard padding="md" className="hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${a.color} 15%, transparent)`, color: a.color }}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-indigo)] transition-colors">{a.label}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{a.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-indigo)] transition-colors" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
