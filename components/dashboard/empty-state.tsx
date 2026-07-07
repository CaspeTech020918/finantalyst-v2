"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface SetupStep {
  step: number;
  title: string;
  description: string;
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  steps: SetupStep[];
  ctaLabel: string;
  ctaHref?: string;
  onCta?: () => void;
}

export function EmptyState({ icon, title, description, steps, ctaLabel, ctaHref, onCta }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-2xl mx-auto py-8"
    >
      <GlassCard variant="raised" padding="lg">
        {/* Icon + headline */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-indigo-dim)] flex items-center justify-center text-[var(--color-indigo)] mx-auto mb-4">
            {icon}
          </div>
          <h2 className="text-heading text-[var(--color-text-primary)] mb-2">{title}</h2>
          <p className="text-body text-[var(--color-text-secondary)]">{description}</p>
        </div>

        {/* Setup steps */}
        <div className="space-y-3 mb-8">
          <p className="text-subheading text-[var(--color-text-tertiary)] mb-3">How to get started</p>
          {steps.map((s) => (
            <div key={s.step} className="flex gap-3 p-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)]">
              <div className="w-6 h-6 rounded-full bg-[var(--color-indigo)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{s.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onCta ?? (() => ctaHref && (window.location.href = ctaHref))}
        >
          {ctaLabel}
          <ArrowRight size={16} />
        </Button>
      </GlassCard>
    </motion.div>
  );
}
