"use client";

import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  delta?: { value: string; positive: boolean } | null;
  subtitle?: string;
  size?: "md" | "lg" | "xl";
  className?: string;
}

const valueClasses = {
  md: "text-number-md",
  lg: "text-number-lg",
  xl: "text-number-xl",
};

export function Stat({ label, value, delta, subtitle, size = "lg", className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-subheading text-[var(--color-text-tertiary)]">{label}</p>
      <p className={cn(valueClasses[size], "text-[var(--color-text-primary)]")}>{value}</p>
      {delta && (
        <div
          className={cn(
            "flex items-center gap-1 text-small font-medium",
            delta.positive ? "text-[var(--color-emerald)]" : "text-[var(--color-red)]"
          )}
        >
          {delta.positive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {delta.value}
        </div>
      )}
      {subtitle && (
        <p className="text-small text-[var(--color-text-tertiary)]">{subtitle}</p>
      )}
    </div>
  );
}
