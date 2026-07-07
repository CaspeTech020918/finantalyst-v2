"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Building2,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

type UserMode = "INDIVIDUAL" | "FREELANCER" | "BUSINESS" | "STARTUP";

interface ModeOption {
  id: UserMode;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  accentVar: string;
  features: string[];
}

const MODES: ModeOption[] = [
  {
    id: "INDIVIDUAL",
    label: "Individual",
    tagline: "Personal finance, tax, and investments",
    icon: <User size={22} />,
    accentVar: "--color-indigo",
    features: ["Tax estimation (New / Old regime)", "Investment portfolio briefings", "Compliance reminders"],
  },
  {
    id: "FREELANCER",
    label: "Freelancer",
    tagline: "Invoices, advance tax, and deductions",
    icon: <Briefcase size={22} />,
    accentVar: "--color-emerald",
    features: ["Advance tax calculator", "Expense categorisation", "Client invoice drafts"],
  },
  {
    id: "BUSINESS",
    label: "Business",
    tagline: "P&L, cash flow, and team finance ops",
    icon: <Building2 size={22} />,
    accentVar: "--color-amber",
    features: ["Cash flow runway monitor", "GST compliance alerts 🔴 Licensed partner req.", "CFO narrative reports"],
  },
  {
    id: "STARTUP",
    label: "Startup",
    tagline: "Burn rate, runway, and investor metrics",
    icon: <Rocket size={22} />,
    accentVar: "--color-indigo",
    features: ["Runway & burn tracking", "MIS / board-ready reports", "Cap table milestone alerts"],
  },
];

const SLIDE_VARIANTS = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"welcome" | "mode" | "done">("welcome");
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function completeOnboarding() {
    if (!selectedMode) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/user/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: selectedMode }),
    });

    if (!res.ok) {
      setError("Failed to save preferences. Please try again.");
      setSaving(false);
      return;
    }

    setStep("done");
    setTimeout(() => window.location.href = "/dashboard", 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-base)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-indigo)]/8 rounded-full blur-[160px]" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {(["welcome", "mode", "done"] as const).map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                step === s
                  ? "w-6 bg-[var(--color-indigo)]"
                  : i < ["welcome", "mode", "done"].indexOf(step)
                  ? "w-1.5 bg-[var(--color-indigo)]/50"
                  : "w-1.5 bg-[var(--color-border-subtle)]"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <GlassCard variant="raised" padding="lg" className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
                  className="text-5xl mb-4"
                >
                  👋
                </motion.div>
                <h1 className="text-hero text-[var(--color-text-primary)] mb-2">
                  Welcome to Finantalyst
                </h1>
                <p className="text-body text-[var(--color-text-secondary)] max-w-md mx-auto mb-8">
                  Your AI CFO is ready. Let&apos;s take 30 seconds to personalise it for how you work.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setStep("mode")}
                  className="mx-auto"
                >
                  Get started
                  <ArrowRight size={16} />
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {step === "mode" && (
            <motion.div
              key="mode"
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-subheading text-[var(--color-text-primary)] text-center mb-2">
                How do you use money?
              </h2>
              <p className="text-caption text-[var(--color-text-muted)] text-center mb-6">
                Pick the mode that fits — you can change it later in Settings.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all duration-150 outline-none group",
                      selectedMode === mode.id
                        ? "border-[var(--color-indigo)] bg-[var(--color-indigo)]/10 shadow-lg shadow-[var(--color-indigo)]/10"
                        : "border-[var(--color-border-subtle)] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--color-border-strong)]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors",
                        selectedMode === mode.id
                          ? "bg-[var(--color-indigo)] text-white"
                          : "bg-white/[0.06] text-[var(--color-text-secondary)]"
                      )}
                    >
                      {mode.icon}
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
                      {mode.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] leading-snug mb-3">
                      {mode.tagline}
                    </p>
                    <ul className="space-y-1">
                      {mode.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]"
                        >
                          <span className="text-[var(--color-indigo)] mt-px shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-xs text-[var(--color-red)] text-center mb-3">{error}</p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setStep("welcome")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={completeOnboarding}
                  disabled={!selectedMode || saving}
                  className="flex-[2]"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue
                      <ArrowRight size={15} />
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <GlassCard variant="raised" padding="lg" className="text-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex justify-center mb-4"
                >
                  <CheckCircle2
                    size={56}
                    className="text-[var(--color-emerald)]"
                  />
                </motion.div>
                <h2 className="text-subheading text-[var(--color-text-primary)] mb-2">
                  You&apos;re all set!
                </h2>
                <p className="text-caption text-[var(--color-text-muted)]">
                  Taking you to your dashboard…
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
