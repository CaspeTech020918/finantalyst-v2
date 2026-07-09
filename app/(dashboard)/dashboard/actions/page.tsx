"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Bot, CheckCircle2, XCircle, Clock, AlertTriangle,
  TrendingUp, FileText, ShieldCheck, Inbox, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface AgentAction {
  id: string;
  type: string;
  status: "PENDING" | "APPROVED" | "DISMISSED" | "EXECUTED" | "FAILED";
  draftContent: string;
  rationale: string;
  referencedFigures: Record<string, unknown>;
  isReversible: boolean;
  isRegulated: boolean;
  regulatedNote: string | null;
  createdAt: string;
  approvedAt: string | null;
  dismissedAt: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ReactNode> = {
  TAX_ESTIMATE:         <FileText size={16} />,
  RUNWAY_ALERT:         <AlertTriangle size={16} />,
  CASH_GAP_ALERT:       <AlertTriangle size={16} />,
  INVOICE_DRAFT:        <FileText size={16} />,
  COMPLIANCE_REMINDER:  <ShieldCheck size={16} />,
  PORTFOLIO_BRIEFING:   <TrendingUp size={16} />,
  DEDUCTION_SUGGESTION: <TrendingUp size={16} />,
  CFO_INSIGHT:          <Bot size={16} />,
};

const TYPE_COLOR: Record<string, string> = {
  RUNWAY_ALERT:    "var(--color-red)",
  CASH_GAP_ALERT:  "var(--color-red)",
  COMPLIANCE_REMINDER: "var(--color-amber)",
  TAX_ESTIMATE:    "var(--color-indigo)",
  DEDUCTION_SUGGESTION: "var(--color-emerald)",
  PORTFOLIO_BRIEFING: "var(--color-emerald)",
  CFO_INSIGHT:     "var(--color-indigo)",
  INVOICE_DRAFT:   "var(--color-amber)",
};

const STATUS_CHIP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pending",   color: "var(--color-amber)",   bg: "var(--color-amber-dim)"   },
  APPROVED:  { label: "Approved",  color: "var(--color-emerald)", bg: "var(--color-emerald-dim)" },
  DISMISSED: { label: "Dismissed", color: "var(--color-text-muted)", bg: "var(--color-glass)"   },
  EXECUTED:  { label: "Executed",  color: "var(--color-emerald)", bg: "var(--color-emerald-dim)" },
  FAILED:    { label: "Failed",    color: "var(--color-red)",     bg: "var(--color-red-dim)"     },
};

// ─── Action Card ──────────────────────────────────────────────

function ActionCard({ action, onAction }: { action: AgentAction; onAction: (id: string, status: "APPROVED" | "DISMISSED") => void }) {
  const chip   = STATUS_CHIP[action.status];
  const color  = TYPE_COLOR[action.type] ?? "var(--color-indigo)";
  const icon   = TYPE_ICON[action.type]  ?? <Bot size={16} />;
  const isPending = action.status === "PENDING";

  return (
    <GlassCard variant="raised" padding="md">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: color + "22", color }}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
              {action.type.replace(/_/g, " ")}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ color: chip.color, background: chip.bg }}>
              {chip.label}
            </span>
          </div>

          <p className="text-sm text-[var(--color-text-primary)] mb-1.5 leading-snug">{action.draftContent}</p>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-2">{action.rationale}</p>

          {action.isRegulated && (
            <div className="flex items-start gap-1.5 px-2.5 py-2 rounded-lg bg-[var(--color-red-dim)] border border-[var(--color-red)]/25 mb-2">
              <AlertTriangle size={12} className="text-[var(--color-red)] mt-0.5 shrink-0" />
              <p className="text-xs text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-red)]">[REGULATED]</span>{" "}
                {action.regulatedNote ?? "This action requires a licensed partner before execution."}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Clock size={11} />
              {new Date(action.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              {!action.isReversible && <span className="text-[var(--color-amber)]">· Irreversible</span>}
            </div>

            {isPending && (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onAction(action.id, "DISMISSED")} className="gap-1 text-xs px-2.5 py-1 h-auto">
                  <XCircle size={12} /> Dismiss
                </Button>
                <Button variant="primary" size="sm" onClick={() => onAction(action.id, "APPROVED")} className="gap-1 text-xs px-2.5 py-1 h-auto"
                  disabled={action.isRegulated}>
                  <CheckCircle2 size={12} /> {action.isRegulated ? "Needs partner" : "Approve"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function ActionsPage() {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "DISMISSED">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/actions");
    const data = await res.json() as { actions: AgentAction[] };
    setActions(data.actions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAction(id: string, status: "APPROVED" | "DISMISSED") {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await fetch("/api/actions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  const filtered = actions.filter(a => filter === "ALL" || a.status === filter);
  const pendingCount = actions.filter(a => a.status === "PENDING").length;

  return (
    <div>
      <PageHeader
        title="Agent Inbox"
        description="AI-suggested actions waiting for your approval. Nothing executes without your explicit sign-off."
        icon={<Bot size={20} />}
      />

      {/* Safety notice */}
      <div className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-[var(--color-indigo-dim)] border border-[var(--color-indigo)]/25 mb-5">
        <ShieldCheck size={14} className="text-[var(--color-indigo)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-indigo)]">Human-in-the-loop.</span> The AI CFO suggests actions — you decide what happens. Regulated actions (filing, payments, banking) are locked until a licensed partner is connected. No money, data, or file is moved without your explicit approval.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[var(--color-text-muted)] text-sm">
          <RefreshCw size={16} className="animate-spin" /> Loading inbox…
        </div>
      ) : actions.length === 0 ? (
        <GlassCard variant="raised" padding="lg" className="text-center py-14 max-w-lg mx-auto">
          <Inbox size={40} className="text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-base font-bold text-[var(--color-text-primary)] mb-2">Inbox is empty</p>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mx-auto">
            As you use the AI CFO and compliance tools, suggested actions will appear here for your review.
          </p>
        </GlassCard>
      ) : (
        <>
          {/* Filter + count */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)]">
              {(["ALL", "PENDING", "APPROVED", "DISMISSED"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn("text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
                    filter === f ? "bg-[var(--color-indigo)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>
                  {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                  {f === "PENDING" && pendingCount > 0 && (
                    <span className="ml-1.5 text-xs bg-[var(--color-amber)] text-white px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={load} className="gap-1.5">
              <RefreshCw size={12} /> Refresh
            </Button>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-text-muted)] py-10">No {filter.toLowerCase()} actions.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map(a => <ActionCard key={a.id} action={a} onAction={handleAction} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
