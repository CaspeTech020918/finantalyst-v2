"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Rocket, TrendingUp, Users, Plus, X, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Deal {
  id: string; companyName: string; tagline: string; description: string;
  sector: string; targetAmount: number; minInvestment: number; equityPct: number;
  preMoneyVal: number; raised: number; status: string;
  _count: { interests: number };
  myInterest: { amount: number; status: string } | null;
  user: { name: string | null };
}

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function ProgressBar({ raised, target }: { raised: number; target: number }) {
  const pct = Math.min(100, (raised / target) * 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-[var(--color-glass)] overflow-hidden">
      <div className="h-full bg-[var(--color-indigo)] rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function InterestModal({ deal, onClose, onDone }: { deal: Deal; onClose: () => void; onDone: () => void }) {
  const [amount, setAmount] = useState(String(deal.minInvestment));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/deals/${deal.id}/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), message }),
    });
    const data = await res.json() as { error?: string };
    if (!res.ok) { setError(data.error ?? "Failed"); setSaving(false); return; }
    setDone(true);
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading text-[var(--color-text-primary)]">Express investment interest</h2>
          <button onClick={onClose}><X size={18} className="text-[var(--color-text-muted)]" /></button>
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-[var(--color-emerald)] mx-auto mb-3" />
            <p className="font-semibold text-[var(--color-text-primary)] mb-1">Interest registered!</p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-5">
              The startup will reach out to you directly. No money has been moved — this is an expression of interest only.
            </p>
            <Button variant="primary" size="md" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-5">
              <p className="text-xs text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-amber)]">No money moves here.</span> This is an expression of interest only. Actual investment, share issuance, and KYC happen offline with the startup directly after mutual agreement.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
                  Investment amount (₹) — minimum {fmt(deal.minInvestment)}
                </label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min={deal.minInvestment} required
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Message to startup <span className="text-[var(--color-text-muted)]">(optional)</span></label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} maxLength={500}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors resize-none"
                  placeholder="Why are you interested? Any questions?" />
              </div>
              {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
                <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">
                  {saving ? "Submitting…" : "Submit interest"}
                </Button>
              </div>
            </form>
          </>
        )}
      </GlassCard>
    </div>
  );
}

function ListDealModal({ onClose, onListed }: { onClose: () => void; onListed: () => void }) {
  const [form, setForm] = useState({ companyName: "", tagline: "", description: "", sector: "", targetAmount: "", minInvestment: "1000", equityPct: "", preMoneyVal: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName, tagline: form.tagline, description: form.description,
        sector: form.sector, targetAmount: Number(form.targetAmount),
        minInvestment: Number(form.minInvestment), equityPct: Number(form.equityPct),
        preMoneyVal: Number(form.preMoneyVal),
      }),
    });
    if (!res.ok) { setError("Failed to list. Check all fields."); setSaving(false); return; }
    onListed();
    onClose();
  }

  const fields: { label: string; key: string; type?: string; placeholder?: string; multi?: boolean }[] = [
    { label: "Company name", key: "companyName", placeholder: "Acme Tech Pvt Ltd" },
    { label: "One-line tagline", key: "tagline", placeholder: "AI for Indian supply chains" },
    { label: "What you do", key: "description", multi: true },
    { label: "Sector", key: "sector", placeholder: "FinTech / AgriTech / SaaS / D2C…" },
    { label: "Funding target (₹)", key: "targetAmount", type: "number", placeholder: "1000000" },
    { label: "Min. investment (₹)", key: "minInvestment", type: "number", placeholder: "1000" },
    { label: "Equity offered (%)", key: "equityPct", type: "number", placeholder: "10" },
    { label: "Pre-money valuation (₹)", key: "preMoneyVal", type: "number", placeholder: "10000000" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading text-[var(--color-text-primary)]">List your company</h2>
          <button onClick={onClose}><X size={18} className="text-[var(--color-text-muted)]" /></button>
        </div>
        <div className="px-4 py-3 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25 mb-5">
          <p className="text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-red)]">Regulatory notice:</span> This is a private expression-of-interest platform only. No actual securities are issued here. Actual equity issuance requires compliance with Companies Act 2013 (private placement rules), SEBI regulations, and must involve a practicing CA/CS. Share certificates via NSDL/CDSL require a depository participant.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">{f.label}</label>
              {f.multi
                ? <textarea value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)} rows={3} required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors resize-none" />
                : <input type={f.type ?? "text"} value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)} required placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />}
            </div>
          ))}
          {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">
              {saving ? "Listing…" : "List deal"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

export default function RaisePage() {
  const { data: session } = useSession();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestDeal, setInterestDeal] = useState<Deal | null>(null);
  const [showList, setShowList] = useState(false);

  const mode = (session?.user as { mode?: string })?.mode ?? "INDIVIDUAL";

  async function load() {
    setLoading(true);
    const res = await fetch("/api/deals");
    const data = await res.json() as { deals: Deal[] };
    setDeals(data.deals ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const canList = mode === "STARTUP" || mode === "BUSINESS";

  return (
    <div>
      <PageHeader
        title="Deal Room"
        description="Private fundraising marketplace. Startups list funding rounds; investors express interest. No money moves on this platform — it's a matchmaking layer."
        icon={<Rocket size={20} />}
      >
        {canList && (
          <Button variant="primary" size="sm" onClick={() => setShowList(true)}>
            <Plus size={14} /> List your company
          </Button>
        )}
      </PageHeader>

      {/* Regulated notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-6">
        <AlertTriangle size={15} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <p><span className="font-semibold text-[var(--color-amber)]">Expression of interest only.</span> No money moves through Finantalyst. This platform connects startups with potential investors for offline conversation.</p>
          <p className="flex items-center gap-1"><Lock size={11} /> Actual share issuance, KYC, and fund transfer happen directly between the parties, governed by Companies Act 2013 and SEBI regulations.</p>
        </div>
      </div>

      {/* List your deal CTA (for non-startup modes) */}
      {!canList && (
        <GlassCard variant="accent-indigo" padding="md" className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Running a startup or business?</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Switch to Startup or Business mode to list your company and attract investors.</p>
            </div>
            <a href="/dashboard/settings">
              <Button variant="secondary" size="sm">Change mode</Button>
            </a>
          </div>
        </GlassCard>
      )}

      {interestDeal && <InterestModal deal={interestDeal} onClose={() => setInterestDeal(null)} onDone={load} />}
      {showList && <ListDealModal onClose={() => setShowList(false)} onListed={load} />}

      {loading ? (
        <div className="text-center py-16 text-[var(--color-text-muted)] text-sm">Loading deals…</div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16">
          <Rocket size={36} className="text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-heading text-[var(--color-text-primary)] mb-2">No open deals yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
            {canList ? "Be the first to list your company and attract investors from our community." : "Check back later — startups will list their fundraising rounds here."}
          </p>
          {canList && <Button variant="primary" size="md" onClick={() => setShowList(true)}><Plus size={15} /> List your company</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {deals.map(deal => {
            const pct = Math.min(100, (deal.raised / deal.targetAmount) * 100);
            const isOwn = deal.user.name === session?.user?.name;
            return (
              <GlassCard key={deal.id} variant="raised" padding="md" className="flex flex-col gap-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">{deal.companyName}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{deal.tagline}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-emerald-dim)] text-[var(--color-emerald)] shrink-0">{deal.sector}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-2">{deal.description}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Raised</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{fmt(deal.raised)} / {fmt(deal.targetAmount)}</span>
                  </div>
                  <ProgressBar raised={deal.raised} target={deal.targetAmount} />
                  <div className="flex gap-4 text-[var(--color-text-muted)]">
                    <span>Equity: <strong className="text-[var(--color-text-primary)]">{deal.equityPct}%</strong></span>
                    <span>Val: <strong className="text-[var(--color-text-primary)]">{fmt(deal.preMoneyVal)}</strong></span>
                    <span>Min: <strong className="text-[var(--color-text-primary)]">{fmt(deal.minInvestment)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                    <Users size={11} />{deal._count.interests} interested
                  </div>
                </div>

                {deal.myInterest ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-emerald-dim)] text-xs text-[var(--color-emerald)]">
                    <CheckCircle2 size={13} /> You expressed interest for {fmt(deal.myInterest.amount)}
                  </div>
                ) : isOwn ? (
                  <div className="text-xs text-[var(--color-text-muted)] text-center py-1">Your listing</div>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => setInterestDeal(deal)} className="w-full">
                    <TrendingUp size={13} /> Express interest
                  </Button>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
