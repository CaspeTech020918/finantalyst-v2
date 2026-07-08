"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Calendar, AlertTriangle, CheckCircle2, Clock, ChevronDown,
  ChevronRight, RefreshCw, Settings2, FileText, BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface ComplianceEvent {
  id: string;
  type: string;
  label: string;
  dueDate: string;
  status: "PENDING" | "DONE" | "SKIPPED";
  filedAt: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  ADVANCE_TAX: "Advance Tax",
  ITR_FILING:  "ITR Filing",
  TAX_AUDIT:   "Tax Audit",
  GST_RETURN:  "GST Return",
  GST_ANNUAL:  "GST Annual",
  TDS_PAYMENT: "TDS Payment",
  TDS_RETURN:  "TDS Return",
  ROC_ANNUAL:  "ROC Annual",
};

const TYPE_COLOR: Record<string, string> = {
  ADVANCE_TAX: "var(--color-indigo)",
  ITR_FILING:  "var(--color-emerald)",
  TAX_AUDIT:   "var(--color-amber)",
  GST_RETURN:  "#a855f7",
  GST_ANNUAL:  "#a855f7",
  TDS_PAYMENT: "var(--color-red)",
  TDS_RETURN:  "var(--color-red)",
  ROC_ANNUAL:  "var(--color-amber)",
};

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
}

function urgencyClass(event: ComplianceEvent): { bg: string; text: string; badge: string } {
  if (event.status === "DONE")    return { bg: "var(--color-emerald-dim)", text: "var(--color-emerald)", badge: "Done" };
  if (event.status === "SKIPPED") return { bg: "var(--color-glass)",       text: "var(--color-text-muted)", badge: "Skipped" };
  const d = daysUntil(event.dueDate);
  if (d < 0)   return { bg: "var(--color-red-dim)",    text: "var(--color-red)",            badge: `${Math.abs(d)}d overdue` };
  if (d <= 7)  return { bg: "var(--color-red-dim)",    text: "var(--color-red)",            badge: `${d}d left` };
  if (d <= 30) return { bg: "var(--color-amber-dim)",  text: "var(--color-amber)",          badge: `${d}d left` };
  return       { bg: "var(--color-glass)",             text: "var(--color-text-secondary)", badge: `${d}d left` };
}

function groupByMonth(events: ComplianceEvent[]): Map<string, ComplianceEvent[]> {
  const map = new Map<string, ComplianceEvent[]>();
  for (const e of events) {
    const key = new Date(e.dueDate).toLocaleString("en-IN", { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return map;
}

// ─── Setup Wizard ─────────────────────────────────────────────

type EntityType = "INDIVIDUAL" | "FREELANCER" | "BUSINESS" | "LLP";

function SetupWizard({ onDone }: { onDone: () => void }) {
  const [entity, setEntity] = useState<EntityType>("INDIVIDUAL");
  const [gst, setGst]       = useState(false);
  const [tds, setTds]       = useState(false);
  const [loading, setLoading] = useState(false);

  const options: { id: EntityType; label: string; description: string }[] = [
    { id: "INDIVIDUAL", label: "Individual / Salaried",   description: "ITR + advance tax only"           },
    { id: "FREELANCER", label: "Freelancer / Consultant", description: "ITR + advance tax + optional TDS" },
    { id: "BUSINESS",   label: "Proprietor / Pvt Ltd",    description: "Full compliance suite"            },
    { id: "LLP",        label: "LLP / Partnership",       description: "ITR + GST + TDS + ROC filings"   },
  ];

  async function generate() {
    setLoading(true);
    await fetch("/api/compliance/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType: entity, isGstRegistered: gst, hasTds: tds }),
    });
    setLoading(false);
    onDone();
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <GlassCard variant="raised" padding="lg">
        <h3 className="text-heading text-[var(--color-text-primary)] mb-1">Set up your Compliance Calendar</h3>
        <p className="text-xs text-[var(--color-text-secondary)] mb-5">Takes 30 seconds. We&apos;ll generate all your statutory due dates for FY 2025-26.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">Entity type</label>
            <div className="grid grid-cols-2 gap-2">
              {options.map(o => (
                <button key={o.id} onClick={() => setEntity(o.id)}
                  className={cn("text-left p-3 rounded-xl border transition-all",
                    entity === o.id
                      ? "border-[var(--color-indigo)] bg-[var(--color-indigo-dim)]"
                      : "border-[var(--color-border)] bg-[var(--color-glass)] hover:border-[var(--color-indigo)]/50")}>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{o.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{o.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)]">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">GST registered?</p>
              <p className="text-xs text-[var(--color-text-muted)]">Adds monthly GSTR-1 + GSTR-3B due dates</p>
            </div>
            <button onClick={() => setGst(v => !v)}
              className={cn("w-11 h-6 rounded-full transition-colors relative shrink-0", gst ? "bg-[var(--color-emerald)]" : "bg-[var(--color-border)]")}>
              <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow", gst ? "left-5" : "left-0.5")} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)]">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Deduct TDS?</p>
              <p className="text-xs text-[var(--color-text-muted)]">Adds quarterly TDS payment + return dates</p>
            </div>
            <button onClick={() => setTds(v => !v)}
              className={cn("w-11 h-6 rounded-full transition-colors relative shrink-0", tds ? "bg-[var(--color-emerald)]" : "bg-[var(--color-border)]")}>
              <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow", tds ? "left-5" : "left-0.5")} />
            </button>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={generate} disabled={loading} className="w-full mt-5 gap-2">
          {loading
            ? <><RefreshCw size={14} className="animate-spin" /> Generating…</>
            : <><Calendar size={14} /> Generate my calendar</>}
        </Button>
      </GlassCard>

      <div className="px-4 py-3 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25">
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-red)]">[REGULATED]</span> Dates shown are based on standard statutory calendars for FY 2025-26. Actual filing must be done on official portals (incometax.gov.in, gst.gov.in, traces.gov.in). Due dates may change; always verify with a CA.
        </p>
      </div>
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────

function EventRow({ event, onStatusChange }: {
  event: ComplianceEvent;
  onStatusChange: (id: string, status: "PENDING" | "DONE" | "SKIPPED") => void;
}) {
  const u = urgencyClass(event);
  const color = TYPE_COLOR[event.type] ?? "var(--color-indigo)";

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border)] transition-all"
      style={{ background: u.bg }}>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{event.label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-medium" style={{ background: color, opacity: 0.85 }}>
            {TYPE_LABEL[event.type] ?? event.type}
          </span>
          <span className="text-xs" style={{ color: u.text }}>
            {new Date(event.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color: u.text, borderColor: u.text + "33" }}>
          {u.badge}
        </span>

        {event.status === "DONE" ? (
          <button onClick={() => onStatusChange(event.id, "PENDING")} title="Mark as pending" className="text-[var(--color-emerald)] hover:opacity-70 transition-opacity">
            <CheckCircle2 size={16} />
          </button>
        ) : (
          <button onClick={() => onStatusChange(event.id, "DONE")} title="Mark as filed"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--color-border)] hover:border-[var(--color-emerald)] hover:bg-[var(--color-emerald-dim)] transition-all text-[var(--color-text-muted)] hover:text-[var(--color-emerald)]">
            <CheckCircle2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Summary Stats ────────────────────────────────────────────

function SummaryBar({ events }: { events: ComplianceEvent[] }) {
  const done     = events.filter(e => e.status === "DONE").length;
  const overdue  = events.filter(e => e.status === "PENDING" && daysUntil(e.dueDate) < 0).length;
  const urgent   = events.filter(e => e.status === "PENDING" && daysUntil(e.dueDate) >= 0 && daysUntil(e.dueDate) <= 7).length;
  const upcoming = events.filter(e => e.status === "PENDING" && daysUntil(e.dueDate) > 7 && daysUntil(e.dueDate) <= 30).length;

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {[
        { label: "Total",    value: events.length, color: "var(--color-text-primary)", icon: <FileText size={14} /> },
        { label: "Done",     value: done,           color: "var(--color-emerald)",      icon: <BadgeCheck size={14} /> },
        { label: "Urgent",   value: urgent + overdue, color: "var(--color-red)",       icon: <AlertTriangle size={14} /> },
        { label: "Upcoming", value: upcoming,       color: "var(--color-amber)",        icon: <Clock size={14} /> },
      ].map(s => (
        <GlassCard key={s.label} variant="raised" padding="md">
          <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>{s.icon}<span className="text-xs font-semibold">{s.label}</span></div>
          <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
        </GlassCard>
      ))}
    </div>
  );
}

// ─── Month Section ────────────────────────────────────────────

function MonthSection({ month, events, onStatusChange }: {
  month: string;
  events: ComplianceEvent[];
  onStatusChange: (id: string, status: "PENDING" | "DONE" | "SKIPPED") => void;
}) {
  const [open, setOpen] = useState(() => {
    const now = new Date();
    const d   = new Date(events[0].dueDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const doneCount    = events.filter(e => e.status === "DONE").length;
  const overdueCount = events.filter(e => e.status === "PENDING" && daysUntil(e.dueDate) < 0).length;
  const urgentCount  = events.filter(e => e.status === "PENDING" && daysUntil(e.dueDate) >= 0 && daysUntil(e.dueDate) <= 7).length;

  return (
    <div className="mb-3">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] hover:border-[var(--color-indigo)]/40 transition-all">
        <div className="flex items-center gap-3">
          {open ? <ChevronDown size={14} className="text-[var(--color-text-muted)]" /> : <ChevronRight size={14} className="text-[var(--color-text-muted)]" />}
          <p className="text-sm font-bold text-[var(--color-text-primary)]">{month}</p>
          <span className="text-xs text-[var(--color-text-muted)]">{events.length} deadline{events.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && <span className="text-xs font-semibold text-[var(--color-red)]   bg-[var(--color-red-dim)]   px-2 py-0.5 rounded-full">{overdueCount} overdue</span>}
          {urgentCount  > 0 && <span className="text-xs font-semibold text-[var(--color-amber)]  bg-[var(--color-amber-dim)] px-2 py-0.5 rounded-full">{urgentCount} urgent</span>}
          <span className="text-xs text-[var(--color-text-muted)]">{doneCount}/{events.length} done</span>
        </div>
      </button>

      {open && (
        <div className="mt-1.5 space-y-1.5 pl-2">
          {events.map(e => <EventRow key={e.id} event={e} onStatusChange={onStatusChange} />)}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function CompliancePage() {
  const [events, setEvents]     = useState<ComplianceEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [filter, setFilter]     = useState<"ALL" | "PENDING" | "DONE" | "URGENT">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/compliance/events");
    const data = await res.json() as { events: ComplianceEvent[] };
    setEvents(data.events ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(id: string, status: "PENDING" | "DONE" | "SKIPPED") {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    await fetch("/api/compliance/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  const filtered = events.filter(e => {
    if (filter === "PENDING") return e.status === "PENDING";
    if (filter === "DONE")    return e.status === "DONE";
    if (filter === "URGENT")  return e.status === "PENDING" && daysUntil(e.dueDate) <= 30;
    return true;
  });

  const grouped = groupByMonth(filtered);

  if (showSetup) {
    return (
      <div>
        <PageHeader title="Compliance Calendar" description="Set up your compliance calendar for FY 2025-26." icon={<Calendar size={20} />} />
        <SetupWizard onDone={() => { setShowSetup(false); load(); }} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Compliance Calendar"
        description="FY 2025-26 · All your statutory due dates in one place."
        icon={<Calendar size={20} />}
      >
        <Button variant="secondary" size="sm" onClick={() => setShowSetup(true)} className="gap-1.5">
          <Settings2 size={13} /> Reconfigure
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[var(--color-text-muted)] text-sm">
          <RefreshCw size={16} className="animate-spin" /> Loading calendar…
        </div>
      ) : events.length === 0 ? (
        <div className="max-w-xl mx-auto">
          <GlassCard variant="raised" padding="lg" className="text-center py-12">
            <Calendar size={36} className="text-[var(--color-text-muted)] mx-auto mb-4" />
            <p className="text-base font-bold text-[var(--color-text-primary)] mb-2">No events yet</p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-xs mx-auto">
              Set up your compliance calendar — takes 30 seconds. We&apos;ll generate all statutory due dates based on your entity type.
            </p>
            <Button variant="primary" size="md" onClick={() => setShowSetup(true)} className="gap-2">
              <Calendar size={14} /> Set up calendar
            </Button>
          </GlassCard>
        </div>
      ) : (
        <>
          <SummaryBar events={events} />

          <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] mb-4">
            {(["ALL", "URGENT", "PENDING", "DONE"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("flex-1 text-xs font-semibold py-2 rounded-lg transition-all",
                  filter === f
                    ? "bg-[var(--color-indigo)] text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>
                {f === "ALL" ? "All" : f === "URGENT" ? "Urgent / Overdue" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {grouped.size === 0 ? (
            <p className="text-center text-sm text-[var(--color-text-muted)] py-10">No events match this filter.</p>
          ) : (
            Array.from(grouped.entries()).map(([month, evts]) => (
              <MonthSection key={month} month={month} events={evts} onStatusChange={handleStatusChange} />
            ))
          )}

          <div className="mt-4 px-4 py-3 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25">
            <p className="text-xs text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-red)]">[REGULATED]</span> Dates are informational only. Statutory due dates may change via CBDT/GST Council circulars. Always verify on incometax.gov.in, gst.gov.in, and traces.gov.in. Consult a CA for your specific obligations.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
