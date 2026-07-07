"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "default" | "raised" | "accent-indigo" | "accent-emerald" | "accent-amber";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: Variant;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses: Record<Variant, string> = {
  default: "glass-card",
  raised: "glass-card glass-card--raised",
  "accent-indigo": "glass-card glass-card--accent-indigo",
  "accent-emerald": "glass-card glass-card--accent-emerald",
  "accent-amber": "glass-card glass-card--accent-amber",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(variantClasses[variant], paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
