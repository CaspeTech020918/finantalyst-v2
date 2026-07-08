"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  FileText, AlertTriangle, Plus, Trash2, TrendingDown,
  CheckCircle2, RefreshCw, IndianRupee, ChevronRight, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface IncomeSource { id: string; type: string; label: string | null; amount: number; financialYear: string; }
interface Deduction    { id: string; section: string; label: string | null; amount: number; financialYear: string; }
interface TaxProfile   { id: string; pan: string | null; regime: string; financialYear: string; incomeSources: IncomeSource[]; deductions: Deduction[]; }

interface Estimate {
  grossIncome: number;
  isSalaried: boolean;
  newRegime: { stdDeduction: number; taxableIncome: number; tax: number; };
  oldRegime: { stdDeduction: number; totalDeductions: number; deductionSummary: { section: string; claimed: number; cap: number; allowed: number }[]; taxableIncome: number; tax: number; };
  recommended: "NEW" | "OLD";
  savings: number;
  advanceTax: { date: string; pct: number; amount: number; label: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const INCOME_TYPES = ["SALARY", "FREELANCE", "BUSINESS", "RENTAL", "CAPITAL_GAINS_EQUITY", "CAPITAL_GAINS_DEBT", "OTHER"];
const DEDUCTION_SECTIONS = [
  { value: "80C",      label: "80C — PPF / ELSS / LIC / EPF / NSC",      cap: 150000 },
  { value: "80D",      label: "80D — Health Insurance Premium",            cap: 75000  },
  { value: "80CCD(1B)",label: "80CCD(1B) — NPS additional contribution",  cap: 50000  },
  { value: "24(b)",    label: "24(b) — Home Loan Interest",               cap: 200000 },
  { value: "HRA",      label: "HRA — House Rent Allowance",               cap: 0      },
  { value: "80G",      label: "80G — Charitable Donations",               cap: 0      },
];

// ─── Tab ──────────────────────────────────────────────────────

type Tab = "income" | "deductions" | "estimate";

// ─── Add Income Modal ─────────────────────────────────────────

function AddIncomeModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [type, setType] = useState("SALARY");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/tax/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label: label || undefined, amount: Number(amount) }),
    });
    if (!res.ok) { setError("Failed to save"); setSaving(false); return; }
    onAdded(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-sm">
        <h3 className="text-heading text-[var(--color-text-primary)] mb-4">Add income source</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]">
              {INCOME_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Label <span className="text-[var(--color-text-muted)]">(optional)</span></label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Employer name"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Annual amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min={1} placeholder="1200000"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]" />
          </div>
          {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">{saving ? "Saving…" : "Add income"}</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

// ─── Add Deduction Modal ──────────────────────────────────────

function AddDeductionModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [section, setSection] = useState("80C");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const cap = DEDUCTION_SECTIONS.find(d => d.value === section)?.cap ?? 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/tax/deduction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, label: label || undefined, amount: Number(amount) }),
    });
    onAdded(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-sm">
        <h3 className="text-heading text-[var(--color-text-primary)] mb-4">Add deduction</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Deductions only apply under the <strong className="text-[var(--color-text-secondary)]">Old Regime</strong>.</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]">
              {DEDUCTION_SECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            {cap > 0 && <p className="text-xs text-[var(--color-text-muted)] mt-1">Max deductible: {fmt(cap)}</p>}
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Label <span className="text-[var(--color-text-muted)]">(optional)</span></label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. HDFC Life LIC"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min={0}
              max={cap > 0 ? cap : undefined} placeholder="150000"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]" />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">{saving ? "Saving…" : "Add deduction"}</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

// ─── Estimate View ────────────────────────────────────────────

function EstimateView({ estimate }: { estimate: Estimate }) {
  const { newRegime: nr, oldRegime: or, recommended, savings, advanceTax, grossIncome } = estimate;
  const newSaves = recommended === "NEW";

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 rounded-xl bg-[var(--color-indigo-dim)] border border-[var(--color-indigo)]/25">
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-bold text-[var(--color-indigo)]">Gross income: {fmt(grossIncome)}</span>
          {estimate.isSalaried && " · Salaried — standard deduction applies"}
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* New Regime */}
        <div className={cn("rounded-2xl border p-4", recommended === "NEW" ? "border-[var(--color-emerald)]/40 bg-[var(--color-emerald-dim)]" : "border-[var(--color-border)] bg-[var(--color-glass)]")}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">New Regime</p>
            {recommended === "NEW" && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-emerald)] text-white font-semibold">Recommended</span>}
          </div>
          <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
            <div className="flex justify-between"><span>Gross income</span><span className="font-medium text-[var(--color-text-primary)]">{fmt(grossIncome)}</span></div>
            <div className="flex justify-between"><span>Standard deduction</span><span className="font-medium text-[var(--color-text-primary)]">−{fmt(nr.stdDeduction)}</span></div>
            <div className="flex justify-between font-semibold border-t border-[var(--color-border)] pt-1.5"><span>Taxable income</span><span>{fmt(nr.taxableIncome)}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] mb-0.5">Estimated tax + cess</p>
            <p className={cn("text-2xl font-bold", recommended === "NEW" ? "text-[var(--color-emerald)]" : "text-[var(--color-text-primary)]")}>{fmt(nr.tax)}</p>
          </div>
        </div>

        {/* Old Regime */}
        <div className={cn("rounded-2xl border p-4", recommended === "OLD" ? "border-[var(--color-emerald)]/40 bg-[var(--color-emerald-dim)]" : "border-[var(--color-border)] bg-[var(--color-glass)]")}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">Old Regime</p>
            {recommended === "OLD" && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-emerald)] text-white font-semibold">Recommended</span>}
          </div>
          <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
            <div className="flex justify-between"><span>Gross income</span><span className="font-medium text-[var(--color-text-primary)]">{fmt(grossIncome)}</span></div>
            <div className="flex justify-between"><span>Standard deduction</span><span className="font-medium text-[var(--color-text-primary)]">−{fmt(or.stdDeduction)}</span></div>
            <div className="flex justify-between"><span>Other deductions</span><span className="font-medium text-[var(--color-text-primary)]">−{fmt(or.totalDeductions)}</span></div>
            <div className="flex justify-between font-semibold border-t border-[var(--color-border)] pt-1.5"><span>Taxable income</span><span>{fmt(or.taxableIncome)}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] mb-0.5">Estimated tax + cess</p>
            <p className={cn("text-2xl font-bold", recommended === "OLD" ? "text-[var(--color-emerald)]" : "text-[var(--color-text-primary)]")}>{fmt(or.tax)}</p>
          </div>
        </div>
      </div>

      {/* Savings callout */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-emerald-dim)] border border-[var(--color-emerald)]/25">
        <Scale size={16} className="text-[var(--color-emerald)] shrink-0" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          The <strong className="text-[var(--color-text-primary)]">{recommended === "NEW" ? "New" : "Old"} Regime</strong> saves you approximately{" "}
          <strong className="text-[var(--color-emerald)]">{fmt(savings)}</strong> in taxes.
          {newSaves ? " Lower rate slabs and high basic exemption make new regime better for you." : " Your deductions reduce taxable income enough that old regime wins."}
        </p>
      </div>

      {/* Deduction breakdown (old regime) */}
      {or.deductionSummary.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Deductions applied (Old Regime)</p>
          <div className="space-y-1.5">
            {or.deductionSummary.map(d => (
              <div key={d.section} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-glass)] border border-[var(--color-border)] text-xs">
                <span className="text-[var(--color-text-secondary)]">{d.section}</span>
                <div className="flex items-center gap-3">
                  {d.claimed > d.allowed && (
                    <span className="text-[var(--color-amber)]">Claimed {fmt(d.claimed)} → capped at {fmt(d.cap)}</span>
                  )}
                  <span className="font-semibold text-[var(--color-text-primary)]">−{fmt(d.allowed)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advance tax */}
      {advanceTax.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
            <TrendingDown size={12} /> Advance Tax Schedule (based on New Regime)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {advanceTax.map(a => {
              const due = new Date(a.date.replace(" ", " ") + " 2025") < new Date();
              return (
                <div key={a.date} className={cn("px-3 py-2.5 rounded-xl border text-xs", due ? "border-[var(--color-border)] opacity-50" : "border-[var(--color-indigo)]/30 bg-[var(--color-indigo-dim)]")}>
                  <p className="font-semibold text-[var(--color-text-primary)]">{a.date}</p>
                  <p className="text-[var(--color-text-secondary)] mt-0.5">{a.label}</p>
                  <p className="font-bold text-[var(--color-indigo)] mt-1">{fmt(a.amount)}</p>
                  {due && <p className="text-[var(--color-text-muted)] mt-0.5">Date passed</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-4 py-3 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25">
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-red)]">Estimates only.</span> These figures are based on FY 2025-26 statutory tax slabs (Finance Act 2025). They assume age &lt; 60, no surcharge, and no foreign income. Consult a CA for your actual ITR filing.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function TaxPage() {
  const [tab, setTab] = useState<Tab>("income");
  const [profile, setProfile] = useState<TaxProfile | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [estimating, setEstimating] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddDed, setShowAddDed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/tax/profile");
    const data = await res.json() as { profile: TaxProfile | null };
    setProfile(data.profile ?? null);
    setLoading(false);
  }, []);

  const loadEstimate = useCallback(async () => {
    setEstimating(true);
    const res = await fetch("/api/tax/estimate");
    const data = await res.json() as { estimate: Estimate | null };
    setEstimate(data.estimate ?? null);
    setEstimating(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab === "estimate") loadEstimate();
  }, [tab, loadEstimate]);

  async function deleteIncome(id: string) {
    await fetch(`/api/tax/income?id=${id}`, { method: "DELETE" });
    load();
  }

  async function deleteDed(id: string) {
    await fetch(`/api/tax/deduction?id=${id}`, { method: "DELETE" });
    load();
  }

  const sources = profile?.incomeSources ?? [];
  const deductions = profile?.deductions ?? [];
  const totalIncome = sources.reduce((s, i) => s + Number(i.amount), 0);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "income",     label: "Income Sources",   count: sources.length },
    { id: "deductions", label: "Deductions",        count: deductions.length },
    { id: "estimate",   label: "Tax Estimate" },
  ];

  return (
    <div>
      <PageHeader
        title="Tax Planning"
        description="FY 2025-26 · New vs Old regime comparison, deductions tracker, and advance tax schedule."
        icon={<FileText size={20} />}
      />

      {/* Regulated notice */}
      <div className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25 mb-5">
        <AlertTriangle size={14} className="text-[var(--color-red)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-red)]">Planning tool only.</span> Tax estimates here are for your own understanding. Actual ITR filing requires a licensed CA or the official Income Tax e-filing portal (incometax.gov.in). Not valid as tax advice.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] mb-5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all",
              tab === t.id
                ? "bg-[var(--color-indigo)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full", tab === t.id ? "bg-white/20" : "bg-[var(--color-glass)]")}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">Loading…</div>
      ) : (
        <>
          {/* ── Income tab ── */}
          {tab === "income" && (
            <div className="space-y-4">
              {totalIncome > 0 && (
                <GlassCard variant="accent-indigo" padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Total gross income (FY 2025-26)</p>
                      <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-0.5">{fmt(totalIncome)}</p>
                    </div>
                    <IndianRupee size={28} className="text-[var(--color-indigo)]/40" />
                  </div>
                </GlassCard>
              )}

              {sources.length === 0 ? (
                <GlassCard variant="raised" padding="lg" className="text-center py-10">
                  <IndianRupee size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No income sources yet</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-4 max-w-sm mx-auto">Add all your income sources for FY 2025-26 — salary, freelance, rent, capital gains — to get an accurate tax estimate.</p>
                  <Button variant="primary" size="md" onClick={() => setShowAddIncome(true)}><Plus size={14} /> Add income source</Button>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {sources.map(s => (
                    <GlassCard key={s.id} variant="raised" padding="md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{s.type.replace(/_/g, " ")}</p>
                          {s.label && <p className="text-xs text-[var(--color-text-secondary)]">{s.label}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-base font-bold text-[var(--color-text-primary)]">{fmt(Number(s.amount))}</p>
                          <button onClick={() => deleteIncome(s.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  <Button variant="secondary" size="sm" onClick={() => setShowAddIncome(true)} className="w-full gap-2">
                    <Plus size={13} /> Add another income source
                  </Button>
                </div>
              )}

              {sources.length > 0 && (
                <div className="pt-2 flex justify-end">
                  <Button variant="primary" size="md" onClick={() => setTab("estimate")} className="gap-2">
                    View tax estimate <ChevronRight size={14} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Deductions tab ── */}
          {tab === "deductions" && (
            <div className="space-y-4">
              <div className="px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  <span className="font-semibold text-[var(--color-amber)]">Old Regime only.</span> Deductions under 80C, 80D, NPS, HRA, home loan interest reduce your taxable income only in the Old Regime. The New Regime does not allow most deductions.
                </p>
              </div>

              {deductions.length === 0 ? (
                <GlassCard variant="raised" padding="lg" className="text-center py-10">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">No deductions added</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-4">Add 80C, 80D, NPS, HRA and home loan interest to see if the Old Regime saves more than the New Regime.</p>
                  <Button variant="primary" size="md" onClick={() => setShowAddDed(true)}><Plus size={14} /> Add deduction</Button>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {deductions.map(d => (
                    <GlassCard key={d.id} variant="raised" padding="md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{d.section}</p>
                          {d.label && <p className="text-xs text-[var(--color-text-secondary)]">{d.label}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-base font-bold text-[var(--color-text-primary)]">−{fmt(Number(d.amount))}</p>
                          <button onClick={() => deleteDed(d.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  <Button variant="secondary" size="sm" onClick={() => setShowAddDed(true)} className="w-full gap-2">
                    <Plus size={13} /> Add another deduction
                  </Button>
                </div>
              )}

              {deductions.length > 0 && (
                <div className="pt-2 flex justify-end">
                  <Button variant="primary" size="md" onClick={() => setTab("estimate")} className="gap-2">
                    View tax estimate <ChevronRight size={14} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Estimate tab ── */}
          {tab === "estimate" && (
            <div>
              {estimating ? (
                <div className="flex items-center justify-center gap-2 py-12 text-[var(--color-text-muted)] text-sm">
                  <RefreshCw size={16} className="animate-spin" /> Calculating…
                </div>
              ) : !estimate || estimate.grossIncome === 0 ? (
                <GlassCard variant="raised" padding="lg" className="text-center py-10">
                  <CheckCircle2 size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Add income sources first</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-4">Go to the Income Sources tab and add your salary, freelance income, etc. to get a tax estimate.</p>
                  <Button variant="secondary" size="md" onClick={() => setTab("income")}>Go to Income Sources</Button>
                </GlassCard>
              ) : (
                <EstimateView estimate={estimate} />
              )}
            </div>
          )}
        </>
      )}

      {showAddIncome && <AddIncomeModal onClose={() => setShowAddIncome(false)} onAdded={load} />}
      {showAddDed && <AddDeductionModal onClose={() => setShowAddDed(false)} onAdded={load} />}
    </div>
  );
}
