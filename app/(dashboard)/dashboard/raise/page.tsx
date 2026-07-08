"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Rocket, TrendingUp, Users, Plus, X, CheckCircle2, Lock,
  Eye, Edit3, Trash2, PhoneCall, ChevronDown, ChevronUp, MessageSquare,
  ArrowRight, Building2, Handshake, FileText, IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Deal {
  id: string;
  userId: string;
  companyName: string;
  tagline: string;
  description: string;
  sector: string;
  targetAmount: number;
  minInvestment: number;
  equityPct: number;
  preMoneyVal: number;
  raised: number;
  views: number;
  status: string;
  isOwner: boolean;
  contactCount: number;
  _count: { interests: number };
  myInterest: { amount: number; status: string; wantsContact: boolean } | null;
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

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const [open, setOpen] = useState(false);
  const steps = [
    {
      icon: <Building2 size={16} />,
      title: "Startup lists their deal",
      desc: "A STARTUP or BUSINESS mode user fills in company details, funding target, equity %, and pre-money valuation. The deal goes live on the Deal Room board.",
    },
    {
      icon: <Eye size={16} />,
      title: "Investors discover it",
      desc: "All logged-in users can browse open deals. Each card shows key metrics — target, equity offered, sector, and number of interested parties.",
    },
    {
      icon: <TrendingUp size={16} />,
      title: "Investor expresses interest",
      desc: "An investor clicks 'Express interest', enters a ticket size (at or above the minimum), an optional message, and can check 'Request direct contact'. No money moves.",
    },
    {
      icon: <Handshake size={16} />,
      title: "Startup reviews and connects",
      desc: "The startup owner sees all interest entries in their stats panel — names, amounts, messages. They reach out directly to interested parties to begin due diligence.",
    },
    {
      icon: <FileText size={16} />,
      title: "Deal happens offline",
      desc: "Actual investment, KYC, share issuance, and fund transfer happen between the parties — governed by Companies Act 2013 and SEBI regulations. A CA/CS must be involved.",
    },
    {
      icon: <IndianRupee size={16} />,
      title: "Finantalyst closes the loop",
      desc: "Once agreed, the startup owner can mark the deal as FUNDED or CLOSED. No money or securities ever pass through this platform.",
    },
  ];

  return (
    <GlassCard variant="default" padding="md" className="mb-6">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between text-sm font-semibold text-[var(--color-text-primary)]"
      >
        <span className="flex items-center gap-2">
          <Rocket size={15} className="text-[var(--color-indigo)]" />
          How the Deal Room works
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {open && (
        <div className="mt-4 space-y-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--color-indigo)]/15 flex items-center justify-center text-[var(--color-indigo)] shrink-0">
                  {s.icon}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-[var(--color-border)] mt-1 mb-1" />}
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">{s.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

// ─── Interest Modal ───────────────────────────────────────────────────────────

function InterestModal({ deal, onClose, onDone }: { deal: Deal; onClose: () => void; onDone: () => void }) {
  const [amount, setAmount] = useState(String(deal.minInvestment));
  const [message, setMessage] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/deals/${deal.id}/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), message, wantsContact }),
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
              The startup will reach out to you directly. No money has moved — this is an expression of interest only.
            </p>
            <Button variant="primary" size="md" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-5">
              <p className="text-xs text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-amber)]">No money moves here.</span> This is an expression of interest only. Actual investment happens offline.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
                  Investment amount (₹) — minimum {fmt(deal.minInvestment)}
                </label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  min={deal.minInvestment} required
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
                  Message to startup <span className="text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} maxLength={500}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors resize-none"
                  placeholder="Why are you interested? Any questions?" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={wantsContact} onChange={e => setWantsContact(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--color-indigo)]" />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Request direct contact</span> — the founder will reach out to me
                </span>
              </label>
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

// ─── Deal Form (shared by List + Edit) ───────────────────────────────────────

type DealFormData = {
  companyName: string; tagline: string; description: string; sector: string;
  targetAmount: string; minInvestment: string; equityPct: string; preMoneyVal: string;
};

const EMPTY_FORM: DealFormData = {
  companyName: "", tagline: "", description: "", sector: "",
  targetAmount: "", minInvestment: "1000", equityPct: "", preMoneyVal: "",
};

const FIELDS: { label: string; key: keyof DealFormData; type?: string; placeholder?: string; multi?: boolean }[] = [
  { label: "Company name", key: "companyName", placeholder: "Acme Tech Pvt Ltd" },
  { label: "One-line tagline", key: "tagline", placeholder: "AI for Indian supply chains" },
  { label: "What you do", key: "description", multi: true },
  { label: "Sector", key: "sector", placeholder: "FinTech / AgriTech / SaaS / D2C…" },
  { label: "Funding target (₹)", key: "targetAmount", type: "number", placeholder: "1000000" },
  { label: "Min. investment (₹)", key: "minInvestment", type: "number", placeholder: "1000" },
  { label: "Equity offered (%)", key: "equityPct", type: "number", placeholder: "10" },
  { label: "Pre-money valuation (₹)", key: "preMoneyVal", type: "number", placeholder: "10000000" },
];

function DealFormModal({
  title, initial, submitLabel, onSubmit, onClose,
}: {
  title: string;
  initial?: Partial<DealFormData>;
  submitLabel: string;
  onSubmit: (form: DealFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DealFormData>({ ...EMPTY_FORM, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof DealFormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading text-[var(--color-text-primary)]">{title}</h2>
          <button onClick={onClose}><X size={18} className="text-[var(--color-text-muted)]" /></button>
        </div>
        <div className="px-4 py-3 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25 mb-5">
          <p className="text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-red)]">Regulatory notice:</span> This is a private expression-of-interest platform only. No actual securities are issued here. Actual equity issuance requires compliance with Companies Act 2013, SEBI regulations, and must involve a practicing CA/CS.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">{f.label}</label>
              {f.multi
                ? <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} rows={3} required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors resize-none" />
                : <input type={f.type ?? "text"} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                    required placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />}
            </div>
          ))}
          {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">
              {saving ? "Saving…" : submitLabel}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ deal, onClose, onDeleted }: { deal: Deal; onClose: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setDeleting(true);
    const res = await fetch(`/api/deals/${deal.id}`, { method: "DELETE" });
    if (!res.ok) { setError("Failed to delete. Try again."); setDeleting(false); return; }
    onDeleted();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-red-dim)] flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-[var(--color-red)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">Delete listing?</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{deal.companyName}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-5">
          This will permanently remove your deal listing and all associated interest records. This cannot be undone.
        </p>
        {error && <p className="text-xs text-[var(--color-red)] mb-3">{error}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" size="md" disabled={deleting} onClick={confirm}
            className="flex-1 !bg-[var(--color-red)] hover:!bg-[var(--color-red)]/80">
            {deleting ? "Deleting…" : "Yes, delete"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Stats Panel (owner only) ──────────────────────────────────────────────────

function OwnerStatsBadge({ deal }: { deal: Deal }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="px-2 py-2 rounded-lg bg-[var(--color-glass)]">
        <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] mb-0.5">
          <Eye size={11} /><span className="text-xs">Views</span>
        </div>
        <p className="text-sm font-bold text-[var(--color-text-primary)]">{deal.views}</p>
      </div>
      <div className="px-2 py-2 rounded-lg bg-[var(--color-glass)]">
        <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] mb-0.5">
          <TrendingUp size={11} /><span className="text-xs">Interested</span>
        </div>
        <p className="text-sm font-bold text-[var(--color-indigo)]">{deal._count.interests}</p>
      </div>
      <div className="px-2 py-2 rounded-lg bg-[var(--color-glass)]">
        <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] mb-0.5">
          <PhoneCall size={11} /><span className="text-xs">Reach outs</span>
        </div>
        <p className="text-sm font-bold text-[var(--color-emerald)]">{deal.contactCount}</p>
      </div>
    </div>
  );
}

// ─── Deal Card ─────────────────────────────────────────────────────────────────

function DealCard({
  deal, onInterest, onEdit, onDelete, isOwnCard,
}: {
  deal: Deal;
  onInterest: (d: Deal) => void;
  onEdit: (d: Deal) => void;
  onDelete: (d: Deal) => void;
  isOwnCard: boolean;
}) {
  return (
    <GlassCard variant="raised" padding="md" className="flex flex-col gap-4">
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
        {!isOwnCard && (
          <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
            <Users size={11} />{deal._count.interests} interested
          </div>
        )}
      </div>

      {isOwnCard ? (
        <div className="space-y-3">
          <OwnerStatsBadge deal={deal} />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(deal)} className="flex-1 gap-1.5">
              <Edit3 size={12} /> Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onDelete(deal)} className="flex-1 gap-1.5 !text-[var(--color-red)]">
              <Trash2 size={12} /> Delete
            </Button>
          </div>
        </div>
      ) : deal.myInterest ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-emerald-dim)] text-xs text-[var(--color-emerald)]">
          <CheckCircle2 size={13} />
          You expressed interest for {fmt(deal.myInterest.amount)}
          {deal.myInterest.wantsContact && (
            <span className="ml-auto flex items-center gap-1 text-[var(--color-indigo)]">
              <PhoneCall size={11} /> Contact requested
            </span>
          )}
        </div>
      ) : (
        <Button variant="primary" size="sm" onClick={() => onInterest(deal)} className="w-full">
          <TrendingUp size={13} /> Express interest
        </Button>
      )}
    </GlassCard>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function RaisePage() {
  const { data: session } = useSession();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestDeal, setInterestDeal] = useState<Deal | null>(null);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);
  const [deleteDeal, setDeleteDeal] = useState<Deal | null>(null);
  const [showList, setShowList] = useState(false);

  const mode = (session?.user as { mode?: string })?.mode ?? "INDIVIDUAL";
  const canList = mode === "STARTUP" || mode === "BUSINESS";

  async function load() {
    setLoading(true);
    const res = await fetch("/api/deals");
    const data = await res.json() as { deals: Deal[] };
    const fetched = data.deals ?? [];
    setDeals(fetched);
    setLoading(false);

    // Fire-and-forget view tracking for non-owned deals
    fetched
      .filter(d => !d.isOwner)
      .forEach(d => {
        fetch(`/api/deals/${d.id}/view`, { method: "POST" }).catch(() => {});
      });
  }

  useEffect(() => { load(); }, []);

  const myDeals = deals.filter(d => d.isOwner);
  const otherDeals = deals.filter(d => !d.isOwner);

  async function handleList(form: { companyName: string; tagline: string; description: string; sector: string; targetAmount: string; minInvestment: string; equityPct: string; preMoneyVal: string }) {
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
    if (!res.ok) throw new Error("Failed to list deal. Check all fields.");
    load();
    setShowList(false);
  }

  async function handleEdit(form: { companyName: string; tagline: string; description: string; sector: string; targetAmount: string; minInvestment: string; equityPct: string; preMoneyVal: string }) {
    if (!editDeal) return;
    const res = await fetch(`/api/deals/${editDeal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName, tagline: form.tagline, description: form.description,
        sector: form.sector, targetAmount: Number(form.targetAmount),
        minInvestment: Number(form.minInvestment), equityPct: Number(form.equityPct),
        preMoneyVal: Number(form.preMoneyVal),
      }),
    });
    if (!res.ok) throw new Error("Failed to update deal.");
    load();
    setEditDeal(null);
  }

  return (
    <div>
      <PageHeader
        title="Deal Room"
        description="Private fundraising marketplace. Startups list funding rounds; investors express interest. No money moves on this platform."
        icon={<Rocket size={20} />}
      >
        {canList && (
          <Button variant="primary" size="sm" onClick={() => setShowList(true)}>
            <Plus size={14} /> List your company
          </Button>
        )}
      </PageHeader>

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-4">
        <AlertTriangle size={15} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <div className="text-xs text-[var(--color-text-secondary)] space-y-0.5">
          <p><span className="font-semibold text-[var(--color-amber)]">Expression of interest only.</span> No money moves through Finantalyst. This platform connects startups with potential investors for offline conversation.</p>
          <p className="flex items-center gap-1"><Lock size={11} /> Share issuance, KYC, and fund transfer happen directly between parties under Companies Act 2013 and SEBI regulations.</p>
        </div>
      </div>

      <HowItWorks />

      {/* Upgrade prompt for non-startup modes */}
      {!canList && (
        <GlassCard variant="accent-indigo" padding="md" className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Running a startup or business?</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Switch to Startup or Business mode to list your company.</p>
            </div>
            <a href="/dashboard/settings">
              <Button variant="secondary" size="sm">Change mode <ArrowRight size={12} /></Button>
            </a>
          </div>
        </GlassCard>
      )}

      {/* Modals */}
      {interestDeal && <InterestModal deal={interestDeal} onClose={() => setInterestDeal(null)} onDone={load} />}
      {showList && (
        <DealFormModal title="List your company" submitLabel="List deal" onClose={() => setShowList(false)} onSubmit={handleList} />
      )}
      {editDeal && (
        <DealFormModal
          title="Edit listing"
          submitLabel="Save changes"
          initial={{
            companyName: editDeal.companyName, tagline: editDeal.tagline,
            description: editDeal.description, sector: editDeal.sector,
            targetAmount: String(editDeal.targetAmount), minInvestment: String(editDeal.minInvestment),
            equityPct: String(editDeal.equityPct), preMoneyVal: String(editDeal.preMoneyVal),
          }}
          onClose={() => setEditDeal(null)}
          onSubmit={handleEdit}
        />
      )}
      {deleteDeal && <DeleteConfirm deal={deleteDeal} onClose={() => setDeleteDeal(null)} onDeleted={load} />}

      {loading ? (
        <div className="text-center py-16 text-[var(--color-text-muted)] text-sm">Loading deals…</div>
      ) : (
        <>
          {/* My Deals section */}
          {myDeals.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  <span className="flex items-center gap-2"><Building2 size={15} className="text-[var(--color-indigo)]" /> My listings</span>
                </h2>
                {canList && (
                  <Button variant="secondary" size="sm" onClick={() => setShowList(true)}>
                    <Plus size={12} /> Add another
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {myDeals.map(deal => (
                  <DealCard key={deal.id} deal={deal} isOwnCard
                    onInterest={() => {}} onEdit={setEditDeal} onDelete={setDeleteDeal} />
                ))}
              </div>
            </div>
          )}

          {/* Other open deals */}
          {otherDeals.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <TrendingUp size={15} className="text-[var(--color-emerald)]" /> Open deals
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {otherDeals.map(deal => (
                  <DealCard key={deal.id} deal={deal} isOwnCard={false}
                    onInterest={setInterestDeal} onEdit={() => {}} onDelete={() => {}} />
                ))}
              </div>
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-16">
              <Rocket size={36} className="text-[var(--color-text-muted)] mx-auto mb-4" />
              <h3 className="text-heading text-[var(--color-text-primary)] mb-2">No open deals yet</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
                {canList
                  ? "Be the first to list your company and attract investors from our community."
                  : "Check back later — startups will list their fundraising rounds here."}
              </p>
              {canList && (
                <Button variant="primary" size="md" onClick={() => setShowList(true)}>
                  <Plus size={15} /> List your company
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-40" />
              No other open deals right now. Check back later.
            </div>
          )}
        </>
      )}
    </div>
  );
}
