"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, Wallet, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { icon: <FileText size={20} />, label: "Log income", desc: "Record client payments & projects", href: "/dashboard/cashflow", color: "var(--color-emerald)" },
  { icon: <Calculator size={20} />, label: "Advance tax", desc: "Q1–Q4 instalment calculator", href: "/dashboard/tax", color: "var(--color-amber)" },
  { icon: <Wallet size={20} />, label: "Track expenses", desc: "Deductible business costs", href: "/dashboard/cashflow", color: "var(--color-indigo)" },
  { icon: <Bot size={20} />, label: "AI CFO", desc: "Ask about deductions & savings", href: "/dashboard/cfo", color: "var(--color-indigo)" },
];

export function FreelancerDashboard() {
  return (
    <div className="space-y-6">
      <GlassCard variant="accent-emerald" padding="lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-subheading text-[var(--color-emerald)] mb-1">Freelancer setup</p>
            <h2 className="text-heading text-[var(--color-text-primary)] mb-2">Your freelance finance hub</h2>
            <p className="text-caption text-[var(--color-text-secondary)] max-w-lg">
              Track client income, log deductible expenses, calculate advance tax instalments and get AI guidance on maximising your tax savings — designed for independent professionals.
            </p>
          </div>
          <Link href="/dashboard/cashflow">
            <Button variant="emerald" size="md">
              Log first income <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </GlassCard>

      <div>
        <p className="text-subheading text-[var(--color-text-muted)] mb-3">What Finantalyst tracks for you</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Revenue YTD", desc: "Total client payments received this financial year." },
            { title: "Advance Tax Due", desc: "Q1–Q4 instalments calculated from your actual income." },
            { title: "Deductions Logged", desc: "Section 80C, 80D, home office, equipment and more." },
            { title: "Net Tax Liability", desc: "Estimated ITR amount after all deductions." },
          ].map((item) => (
            <GlassCard key={item.title} padding="md">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{item.desc}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">No data yet — start logging income.</p>
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
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-emerald)] transition-colors">{a.label}</p>
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
