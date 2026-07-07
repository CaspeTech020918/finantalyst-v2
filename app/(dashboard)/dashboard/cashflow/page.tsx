"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Wallet, Plus, Upload, Trash2, TrendingUp, TrendingDown,
  Building2, RefreshCw, AlertCircle, CheckCircle2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCOUNT_TYPES: Record<string, string> = {
  BANK_SAVINGS: "Bank Savings", BANK_CURRENT: "Bank Current", CASH: "Cash",
  CREDIT_CARD: "Credit Card", BROKERAGE: "Brokerage / Demat", MUTUAL_FUND: "Mutual Fund",
  FD: "Fixed Deposit", PPF: "PPF", NPS: "NPS", REAL_ESTATE: "Real Estate Income",
  SALARY: "Salary Account", OTHER: "Other",
};

const CHART_COLORS = ["#6366F1","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#F97316","#84CC16"];

interface Account {
  id: string; name: string; type: string; branch?: string;
  _count: { transactions: number };
}

interface Txn {
  id: string; date: string; amount: number; description: string;
  category?: string; reference?: string; source: string;
}

interface Analytics {
  totalIn: number; totalOut: number; net: number;
  thisMonth: { in: number; out: number };
  lastMonth: { in: number; out: number };
  daily: { date: string; credits: number; debits: number; net: number }[];
  categories: { name: string; value: number }[];
  txnCount: number;
}

function fmt(n: number) {
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── Add Account Modal ────────────────────────────────────────────────────────
function AddAccountModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("BANK_SAVINGS");
  const [branch, setBranch] = useState("");
  const [openingBal, setOpeningBal] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, branch: branch || undefined, openingBal: Number(openingBal) || 0 }),
    });
    if (!res.ok) { setError("Failed to add account"); setSaving(false); return; }
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading text-[var(--color-text-primary)]">Add account</h2>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Account name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. HDFC Savings, Zerodha Demat"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Account type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors">
              {Object.entries(ACCOUNT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Branch / Location <span className="text-[var(--color-text-muted)]">(optional)</span></label>
            <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. Andheri, Bandra, Mumbai HQ"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Opening balance (₹) <span className="text-[var(--color-text-muted)]">(optional)</span></label>
            <input type="number" value={openingBal} onChange={e => setOpeningBal(e.target.value)} placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors" />
          </div>
          {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">
              {saving ? "Adding…" : "Add account"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

// ─── CSV Upload Modal ─────────────────────────────────────────────────────────
function CSVUploadModal({ accounts, onClose, onImported }: { accounts: Account[]; onClose: () => void; onImported: () => void }) {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ imported: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file || !accountId) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("accountId", accountId);
    const res = await fetch("/api/cashflow/import", { method: "POST", body: form });
    const data = await res.json() as { imported?: number; skipped?: number; error?: string };
    if (!res.ok) { setError(data.error ?? "Import failed"); setUploading(false); return; }
    setStatus({ imported: data.imported ?? 0, skipped: data.skipped ?? 0 });
    setUploading(false);
    onImported();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard variant="raised" padding="lg" className="w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading text-[var(--color-text-primary)]">Import CSV statement</h2>
          <button onClick={onClose}><X size={18} className="text-[var(--color-text-muted)]" /></button>
        </div>

        {status ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-[var(--color-emerald)] mx-auto mb-3" />
            <p className="font-semibold text-[var(--color-text-primary)] mb-1">{status.imported} transactions imported</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{status.skipped} rows skipped (invalid format)</p>
            <Button variant="primary" size="md" onClick={onClose} className="mt-5">Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Import into account</label>
              <select value={accountId} onChange={e => setAccountId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)] transition-colors">
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}{a.branch ? ` — ${a.branch}` : ""}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-2 block">CSV file</label>
              <div
                className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-indigo)] transition-colors"
                onClick={() => document.getElementById("csv-file-input")?.click()}
              >
                <Upload size={24} className="text-[var(--color-text-muted)] mx-auto mb-2" />
                {file
                  ? <p className="text-sm text-[var(--color-indigo)]">{file.name}</p>
                  : <><p className="text-sm text-[var(--color-text-secondary)]">Click to choose CSV file</p>
                     <p className="text-xs text-[var(--color-text-muted)] mt-1">Supports HDFC, SBI, ICICI, Axis, Kotak and most Indian bank formats</p></>}
                <input id="csv-file-input" type="file" accept=".csv,.txt" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            {error && <div className="flex items-center gap-2 text-xs text-[var(--color-red)]"><AlertCircle size={13} />{error}</div>}
            <div className="flex gap-3">
              <Button variant="secondary" size="md" onClick={onClose} className="flex-1">Cancel</Button>
              <Button variant="primary" size="md" onClick={upload} disabled={!file || !accountId || uploading} className="flex-1">
                {uploading ? "Importing…" : "Import"}
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CashflowPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  async function loadAccounts() {
    const res = await fetch("/api/accounts");
    const data = await res.json() as { accounts: Account[] };
    setAccounts(data.accounts ?? []);
    if (!selectedId && data.accounts?.[0]) setSelectedId(data.accounts[0].id);
  }

  async function loadAnalytics(accountId?: string | null) {
    const url = `/api/cashflow/analytics${accountId ? `?accountId=${accountId}` : ""}`;
    const res = await fetch(url);
    const data = await res.json() as Analytics;
    setAnalytics(data);
  }

  async function loadTxns(accountId: string) {
    const res = await fetch(`/api/accounts/${accountId}/transactions`);
    const data = await res.json() as { transactions: Txn[] };
    setTxns(data.transactions ?? []);
  }

  async function deleteAccount(id: string) {
    if (!confirm("Delete this account and all its transactions?")) return;
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (selectedId === id) setSelectedId(accounts.find(a => a.id !== id)?.id ?? null);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAccounts();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    loadAnalytics(selectedId);
    if (selectedId) loadTxns(selectedId);
  }, [selectedId]);

  const selectedAccount = accounts.find(a => a.id === selectedId);

  return (
    <div>
      <PageHeader
        title="Cash Flow"
        description="Track income and expenses across all your accounts and branches. Import bank statements or add transactions manually."
        icon={<Wallet size={20} />}
      >
        <Button variant="secondary" size="sm" onClick={() => setShowCSV(true)} disabled={accounts.length === 0}>
          <Upload size={14} /> Import CSV
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowAddAccount(true)}>
          <Plus size={14} /> Add account
        </Button>
      </PageHeader>

      {/* Modals */}
      {showAddAccount && <AddAccountModal onClose={() => setShowAddAccount(false)} onSaved={loadAccounts} />}
      {showCSV && <CSVUploadModal accounts={accounts} onClose={() => setShowCSV(false)} onImported={() => { loadAnalytics(selectedId); if (selectedId) loadTxns(selectedId); }} />}

      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <Wallet size={36} className="text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-heading text-[var(--color-text-primary)] mb-2">No accounts yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
            Add your bank accounts, investment accounts, or any income source. You can add multiple accounts for different branches or income streams.
          </p>
          <Button variant="primary" size="md" onClick={() => setShowAddAccount(true)}>
            <Plus size={15} /> Add your first account
          </Button>
        </div>
      ) : (
        <div className="flex gap-5">
          {/* Sidebar: account list */}
          <div className="w-56 shrink-0 space-y-2">
            <button
              onClick={() => setSelectedId(null)}
              className={cn("w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors", !selectedId
                ? "border-[var(--color-indigo)] bg-[var(--color-indigo-dim)] text-[var(--color-indigo)] font-medium"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]")}
            >
              <p className="font-semibold">All accounts</p>
              <p className="text-xs mt-0.5 opacity-70">{analytics?.txnCount ?? 0} transactions</p>
            </button>
            {accounts.map(acc => (
              <div key={acc.id} className="relative group">
                <button
                  onClick={() => setSelectedId(acc.id)}
                  className={cn("w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors", selectedId === acc.id
                    ? "border-[var(--color-indigo)] bg-[var(--color-indigo-dim)] text-[var(--color-indigo)] font-medium"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]")}
                >
                  <p className="font-semibold pr-5">{acc.name}</p>
                  {acc.branch && <p className="text-xs opacity-70">{acc.branch}</p>}
                  <p className="text-xs mt-0.5 opacity-60">{ACCOUNT_TYPES[acc.type] ?? acc.type}</p>
                  <p className="text-xs opacity-50">{acc._count.transactions} txns</p>
                </button>
                <button
                  onClick={() => deleteAccount(acc.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-text-muted)] hover:text-[var(--color-red)]"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={() => setShowAddAccount(true)} className="w-full px-4 py-2.5 rounded-xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-[var(--color-indigo)] hover:text-[var(--color-indigo)] transition-colors flex items-center justify-center gap-2">
              <Plus size={13} /> Add account
            </button>
          </div>

          {/* Main panel */}
          <div className="flex-1 space-y-5 min-w-0">
            {/* Summary cards */}
            {analytics && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total In", value: analytics.totalIn, icon: <TrendingUp size={16} />, color: "var(--color-emerald)" },
                  { label: "Total Out", value: analytics.totalOut, icon: <TrendingDown size={16} />, color: "var(--color-red)" },
                  { label: "Net", value: analytics.net, icon: <Wallet size={16} />, color: analytics.net >= 0 ? "var(--color-indigo)" : "var(--color-red)" },
                ].map(c => (
                  <GlassCard key={c.label} padding="md">
                    <div className="flex items-center gap-2 mb-1" style={{ color: c.color }}>{c.icon}<span className="text-xs font-medium">{c.label}</span></div>
                    <p className="text-xl font-bold" style={{ color: c.color }}>{fmt(c.value)}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      This month: {fmt(c.label === "Total In" ? analytics.thisMonth.in : c.label === "Total Out" ? analytics.thisMonth.out : analytics.thisMonth.in - analytics.thisMonth.out)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Daily chart */}
            {analytics && analytics.daily.some(d => d.credits > 0 || d.debits > 0) && (
              <GlassCard variant="raised" padding="md">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Daily cash flow — last 30 days</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.daily} barGap={2}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                    <Tooltip
                      contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(v: any, name: any) => [fmt(Number(v)), name === "credits" ? "Money in" : "Money out"]}
                    />
                    <Bar dataKey="credits" fill="var(--color-emerald)" radius={[3,3,0,0]} maxBarSize={16} />
                    <Bar dataKey="debits" fill="var(--color-red)" radius={[3,3,0,0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            )}

            {/* Category breakdown + account breakdown */}
            {analytics && analytics.categories.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <GlassCard variant="raised" padding="md">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Spending by category</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={analytics.categories} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {analytics.categories.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Tooltip formatter={(v: any) => fmt(Number(v))} contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                      <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </GlassCard>

                <GlassCard variant="raised" padding="md">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Month comparison</p>
                  <div className="space-y-3">
                    {[
                      { label: "This month income", cur: analytics.thisMonth.in, prev: analytics.lastMonth.in },
                      { label: "This month spend", cur: analytics.thisMonth.out, prev: analytics.lastMonth.out },
                    ].map(row => {
                      const pct = row.prev > 0 ? ((row.cur - row.prev) / row.prev) * 100 : 0;
                      return (
                        <div key={row.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[var(--color-text-secondary)]">{row.label}</span>
                            <span className={pct >= 0 ? "text-[var(--color-emerald)]" : "text-[var(--color-red)]"}>
                              {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-lg font-bold text-[var(--color-text-primary)]">{fmt(row.cur)}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">vs {fmt(row.prev)} last month</p>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Transaction table */}
            {selectedId && (
              <GlassCard variant="raised" padding="none">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Transactions — {selectedAccount?.name}
                    {selectedAccount?.branch ? ` (${selectedAccount.branch})` : ""}
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setShowCSV(true)}>
                    <Upload size={13} /> Import CSV
                  </Button>
                </div>
                {txns.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[var(--color-text-secondary)]">No transactions yet.</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Import a CSV bank statement to populate this account.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]">
                          {["Date","Description","Category","Amount","Source"].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs text-[var(--color-text-muted)] font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {txns.map(t => (
                          <tr key={t.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-glass)] transition-colors">
                            <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                            <td className="px-5 py-3 text-[var(--color-text-primary)] max-w-[200px] truncate">{t.description}</td>
                            <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">{t.category ?? "—"}</td>
                            <td className={cn("px-5 py-3 font-semibold", t.amount >= 0 ? "text-[var(--color-emerald)]" : "text-[var(--color-red)]")}>
                              {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                            </td>
                            <td className="px-5 py-3 text-xs text-[var(--color-text-muted)]">{t.source.startsWith("csv:") ? t.source.slice(4) : t.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>
            )}

            {/* All-accounts view */}
            {!selectedId && analytics && analytics.txnCount === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-[var(--color-text-secondary)]">No transactions across any account yet.</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Select an account and import a CSV, or add transactions manually.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
