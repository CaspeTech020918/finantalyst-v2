import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium",
  {
    variants: {
      variant: {
        indigo: "bg-[var(--color-indigo-dim)] text-[var(--color-indigo)] border border-[var(--color-indigo)]/20",
        emerald: "bg-[var(--color-emerald-dim)] text-[var(--color-emerald)] border border-[var(--color-emerald)]/20",
        amber: "bg-[var(--color-amber-dim)] text-[var(--color-amber)] border border-[var(--color-amber)]/20",
        red: "bg-[var(--color-red-dim)] text-[var(--color-red)] border border-[var(--color-red)]/20",
        neutral: "bg-white/[0.06] text-[var(--color-text-secondary)] border border-white/[0.08]",
      },
      size: {
        sm: "px-1.5 py-px text-[10px]",
        md: "px-2 py-0.5 text-micro",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  size?: "sm" | "md";
}

export function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}
