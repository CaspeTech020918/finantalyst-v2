"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-120 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-indigo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-base)] cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-indigo)] text-white rounded-[10px] hover:brightness-110 active:brightness-95 shadow-lg shadow-[var(--color-indigo)]/20",
        secondary:
          "bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text-primary)] rounded-[10px] hover:bg-white/[0.06]",
        ghost:
          "bg-transparent text-[var(--color-text-secondary)] rounded-[10px] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]",
        danger:
          "bg-[var(--color-red-dim)] text-[var(--color-red)] border border-[var(--color-red)]/20 rounded-[10px] hover:bg-[var(--color-red)]/20",
        emerald:
          "bg-[var(--color-emerald)] text-[var(--color-base)] rounded-[10px] hover:brightness-110 font-bold shadow-lg shadow-[var(--color-emerald)]/20",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "w-9 h-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={{ y: -1 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
