import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-[var(--color-indigo-dim)] flex items-center justify-center text-[var(--color-indigo)] mb-3">
              {icon}
            </div>
          )}
          <h1 className="text-display text-[var(--color-text-primary)] mb-1">{title}</h1>
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl">{description}</p>
        </div>
        {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
      </div>
    </div>
  );
}
