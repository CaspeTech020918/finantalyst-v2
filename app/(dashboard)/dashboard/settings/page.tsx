"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Building2, Rocket, Sun, Moon, Check, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

type UserMode = "INDIVIDUAL" | "FREELANCER" | "BUSINESS" | "STARTUP";

const MODES = [
  { id: "INDIVIDUAL" as UserMode, label: "Individual", desc: "Personal finance, tax & investments", icon: <User size={20} /> },
  { id: "FREELANCER" as UserMode, label: "Freelancer", desc: "Invoices, advance tax & deductions", icon: <Briefcase size={20} /> },
  { id: "BUSINESS" as UserMode, label: "Business", desc: "P&L, cash flow & compliance", icon: <Building2 size={20} /> },
  { id: "STARTUP" as UserMode, label: "Startup", desc: "Burn rate, runway & investor metrics", icon: <Rocket size={20} /> },
];

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);

  const currentMode = (session?.user as { mode?: string })?.mode as UserMode | undefined;

  async function saveMode() {
    if (!selectedMode || selectedMode === currentMode) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/user/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: selectedMode }),
    });

    if (!res.ok) {
      setError("Failed to update mode. Please try again.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    // Hard redirect to dashboard to reload with new mode
    setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-subheading text-[var(--color-text-muted)] mb-1">Settings</p>
        <h1 className="text-display text-[var(--color-text-primary)]">Account Settings</h1>
        <p className="text-caption text-[var(--color-text-secondary)] mt-1">Manage your preferences, mode and account details.</p>
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
            <button
              onClick={toggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] transition-colors"
            >
              {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              {theme === "dark" ? "Dark" : "Light"} mode
            </button>
          </div>
        </GlassCard>

        {/* Mode switching */}
        <GlassCard variant="raised" padding="lg">
          <p className="text-subheading text-[var(--color-text-muted)] mb-1">Finance Mode</p>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            Change your mode to switch the dashboard, tools and AI guidance to match how you use money. Your data is preserved.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {MODES.map((mode) => {
              const active = selectedMode ? selectedMode === mode.id : currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={cn(
                    "text-left p-4 rounded-xl border transition-all",
                    active
                      ? "border-[var(--color-indigo)] bg-[var(--color-indigo-dim)]"
                      : "border-[var(--color-border)] bg-[var(--color-glass)] hover:border-[var(--color-border-strong)]"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", active ? "bg-[var(--color-indigo)] text-white" : "bg-[var(--color-glass)] text-[var(--color-text-muted)]")}>
                    {mode.icon}
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{mode.label}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{mode.desc}</p>
                  {currentMode === mode.id && !selectedMode && (
                    <span className="text-xs text-[var(--color-indigo)] font-medium mt-1 block">Current mode</span>
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-red)] mb-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-emerald)] mb-3">
              <Check size={14} /> Mode updated! Redirecting to dashboard…
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={saveMode}
            disabled={!selectedMode || selectedMode === currentMode || saving || saved}
            className="w-full"
          >
            {saving ? "Saving…" : saved ? "Saved!" : `Switch to ${selectedMode ? MODES.find(m => m.id === selectedMode)?.label : "selected"} mode`}
          </Button>
        </GlassCard>

        {/* Danger zone */}
        <GlassCard variant="raised" padding="lg">
          <p className="text-subheading text-[var(--color-text-muted)] mb-4">Account</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Sign out</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Sign out of your Finantalyst account</p>
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
