"use client";

import { useState } from "react";
import { User, Briefcase, Building2, Rocket, Sun, Moon, Check, AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { checkPasswordStrength } from "@/lib/security";

type UserMode = "INDIVIDUAL" | "FREELANCER" | "BUSINESS" | "STARTUP";

const MODES = [
  { id: "INDIVIDUAL" as UserMode, label: "Individual", desc: "Personal finance, tax & investments", icon: <User size={20} /> },
  { id: "FREELANCER" as UserMode, label: "Freelancer", desc: "Invoices, advance tax & deductions", icon: <Briefcase size={20} /> },
  { id: "BUSINESS"  as UserMode, label: "Business",   desc: "P&L, cash flow & compliance",        icon: <Building2 size={20} /> },
  { id: "STARTUP"   as UserMode, label: "Startup",    desc: "Burn rate, runway & investor metrics",icon: <Rocket size={20} /> },
];

// ─── Change Password Form ─────────────────────────────────────

function ChangePasswordSection() {
  const [current, setCurrent]       = useState("");
  const [next, setNext]             = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const issues  = checkPasswordStrength(next);
  const matches = next === confirm || confirm === "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (issues.length > 0) { setError("Password doesn't meet requirements."); return; }
    if (next !== confirm)  { setError("Passwords do not match."); return; }
    setSaving(true); setError(null);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });

    const data = await res.json() as { error?: string };
    setSaving(false);

    if (!res.ok) { setError(data.error ?? "Failed to update password."); return; }
    setSuccess(true);
    setCurrent(""); setNext(""); setConfirm("");
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <GlassCard variant="raised" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lock size={16} className="text-[var(--color-text-muted)]" />
        <p className="text-subheading text-[var(--color-text-muted)]">Change Password</p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {/* Current password */}
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Current password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={current} onChange={e => setCurrent(e.target.value)} required
              className="w-full px-3 py-2.5 pr-10 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]"
            />
            <button type="button" onClick={() => setShowCurrent(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">New password</label>
          <div className="relative">
            <input
              type={showNext ? "text" : "password"}
              value={next} onChange={e => setNext(e.target.value)} required
              className="w-full px-3 py-2.5 pr-10 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]"
            />
            <button type="button" onClick={() => setShowNext(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
              {showNext ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {/* Strength hints */}
          {next.length > 0 && issues.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {issues.map(i => (
                <li key={i} className="text-xs text-[var(--color-amber)] flex items-center gap-1">
                  <span className="text-[8px]">●</span>{i}
                </li>
              ))}
            </ul>
          )}
          {next.length > 0 && issues.length === 0 && (
            <p className="text-xs text-[var(--color-emerald)] mt-1 flex items-center gap-1"><Check size={11} /> Strong password</p>
          )}
        </div>

        {/* Confirm */}
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Confirm new password</label>
          <input
            type="password"
            value={confirm} onChange={e => setConfirm(e.target.value)} required
            className={cn("w-full px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-indigo)]",
              confirm && !matches ? "border-[var(--color-red)]" : "border-[var(--color-border)]")}
          />
          {confirm && !matches && <p className="text-xs text-[var(--color-red)] mt-1">Passwords do not match.</p>}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-red)]">
            <AlertCircle size={13} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-emerald)]">
            <Check size={13} /> Password updated successfully.
          </div>
        )}

        <Button variant="primary" size="md" type="submit"
          disabled={saving || !current || issues.length > 0 || next !== confirm || !confirm}
          className="w-full">
          {saving ? "Updating…" : "Update password"}
        </Button>
      </form>
    </GlassCard>
  );
}

// ─── Security Overview ────────────────────────────────────────

function SecuritySection() {
  const checks = [
    { label: "Passwords hashed with bcrypt (12 rounds)",       ok: true },
    { label: "JWT-only sessions — no server-side session store", ok: true },
    { label: "Rate limiting on all auth endpoints",             ok: true },
    { label: "Security headers (HSTS, X-Frame, CSP etc.)",      ok: true },
    { label: "HTTPS enforced via Vercel",                        ok: true },
    { label: "Email verification",                               ok: false, note: "Coming — Resend domain setup required" },
    { label: "Two-factor authentication (TOTP)",                 ok: false, note: "Planned in Phase 3"                    },
  ];

  return (
    <GlassCard variant="raised" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className="text-[var(--color-text-muted)]" />
        <p className="text-subheading text-[var(--color-text-muted)]">Security Status</p>
      </div>
      <div className="space-y-2.5">
        {checks.map(c => (
          <div key={c.label} className="flex items-start gap-2.5">
            <div className={cn("mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0",
              c.ok ? "bg-[var(--color-emerald-dim)]" : "bg-[var(--color-amber-dim)]")}>
              {c.ok
                ? <Check size={9} className="text-[var(--color-emerald)]" />
                : <span className="text-[8px] text-[var(--color-amber)] font-bold">!</span>}
            </div>
            <div>
              <p className={cn("text-sm", c.ok ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]")}>{c.label}</p>
              {c.note && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);

  const currentMode = (session?.user as { mode?: string })?.mode as UserMode | undefined;

  async function saveMode() {
    if (!selectedMode || selectedMode === currentMode) return;
    setSaving(true); setError(null);

    const res = await fetch("/api/user/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: selectedMode }),
    });

    if (!res.ok) { setError("Failed to update mode."); setSaving(false); return; }
    setSaved(true); setSaving(false);
    setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-subheading text-[var(--color-text-muted)] mb-1">Settings</p>
        <h1 className="text-display text-[var(--color-text-primary)]">Account Settings</h1>
        <p className="text-caption text-[var(--color-text-secondary)] mt-1">Manage your preferences, mode, password, and security.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <GlassCard variant="raised" padding="lg">
          <p className="text-subheading text-[var(--color-text-muted)] mb-4">Profile</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-indigo)] flex items-center justify-center text-white font-bold text-lg">
              {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">{session?.user?.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{session?.user?.email}</p>
              <p className="text-xs text-[var(--color-indigo)] mt-0.5 capitalize">{currentMode?.toLowerCase() ?? "—"} mode</p>
            </div>
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard variant="raised" padding="lg">
          <p className="text-subheading text-[var(--color-text-muted)] mb-4">Appearance</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Theme</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Switch between dark and light mode</p>
            </div>
            <button onClick={toggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] transition-colors">
              {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              {theme === "dark" ? "Dark" : "Light"} mode
            </button>
          </div>
        </GlassCard>

        {/* Finance Mode */}
        <GlassCard variant="raised" padding="lg">
          <p className="text-subheading text-[var(--color-text-muted)] mb-1">Finance Mode</p>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            Change your mode to switch the dashboard, tools and AI guidance. Your data is preserved.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {MODES.map((mode) => {
              const active = selectedMode ? selectedMode === mode.id : currentMode === mode.id;
              return (
                <button key={mode.id} onClick={() => setSelectedMode(mode.id)}
                  className={cn("text-left p-4 rounded-xl border transition-all",
                    active ? "border-[var(--color-indigo)] bg-[var(--color-indigo-dim)]" : "border-[var(--color-border)] bg-[var(--color-glass)] hover:border-[var(--color-border-strong)]")}>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", active ? "bg-[var(--color-indigo)] text-white" : "bg-[var(--color-glass)] text-[var(--color-text-muted)]")}>
                    {mode.icon}
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{mode.label}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{mode.desc}</p>
                  {currentMode === mode.id && !selectedMode && <span className="text-xs text-[var(--color-indigo)] font-medium mt-1 block">Current mode</span>}
                </button>
              );
            })}
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-[var(--color-red)] mb-3"><AlertCircle size={14} /> {error}</div>}
          {saved  && <div className="flex items-center gap-2 text-sm text-[var(--color-emerald)] mb-3"><Check size={14} /> Mode updated! Redirecting…</div>}
          <Button variant="primary" size="md" onClick={saveMode}
            disabled={!selectedMode || selectedMode === currentMode || saving || saved} className="w-full">
            {saving ? "Saving…" : saved ? "Saved!" : `Switch to ${selectedMode ? MODES.find(m => m.id === selectedMode)?.label : "selected"} mode`}
          </Button>
        </GlassCard>

        {/* Change Password */}
        <ChangePasswordSection />

        {/* Security Status */}
        <SecuritySection />

        {/* Sign out */}
        <GlassCard variant="raised" padding="lg">
          <p className="text-subheading text-[var(--color-text-muted)] mb-4">Account</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Sign out</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Sign out of your Finantalyst account on this device</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => { import("next-auth/react").then(m => m.signOut({ callbackUrl: "/login" })); }}>
              Sign out
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
