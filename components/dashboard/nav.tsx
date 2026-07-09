"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { LayoutDashboard, Wallet, BarChart3, FileText, ShieldCheck, Settings, LogOut, Bot, Rocket, Link2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard",              label: "Dashboard",    icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/cashflow",     label: "Cash Flow",    icon: <Wallet size={18} /> },
  { href: "/dashboard/investments",  label: "Investments",  icon: <BarChart3 size={18} /> },
  { href: "/dashboard/tax",          label: "Tax",          icon: <FileText size={18} /> },
  { href: "/dashboard/compliance",   label: "Compliance",   icon: <ShieldCheck size={18} /> },
  { href: "/dashboard/cfo",          label: "AI CFO",       icon: <Bot size={18} /> },
  { href: "/dashboard/raise",        label: "Deal Room",    icon: <Rocket size={18} /> },
  { href: "/dashboard/actions",      label: "Agent Inbox",  icon: <Inbox size={18} /> },
  { href: "/dashboard/integrations", label: "Integrations", icon: <Link2 size={18} /> },
];

export function DashboardNav({ session }: { session: Session }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-0)] z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-0.5">AI Financial OS</p>
        <h1 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">Finantalyst</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-120",
                active
                  ? "bg-[var(--color-indigo-dim)] text-[var(--color-indigo)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <span className={active ? "text-[var(--color-indigo)]" : "text-[var(--color-text-muted)]"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-0.5">
        <div className="flex items-center justify-between px-3 py-1 mb-1">
          <span className="text-xs text-[var(--color-text-muted)]">Theme</span>
          <ThemeToggle />
        </div>
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-120",
            pathname.startsWith("/dashboard/settings")
              ? "bg-[var(--color-indigo-dim)] text-[var(--color-indigo)] font-medium"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]"
          )}
        >
          <Settings size={18} className="text-[var(--color-text-muted)]" />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-red)] transition-colors duration-120"
        >
          <LogOut size={18} className="text-[var(--color-text-muted)]" />
          Sign out
        </button>
        <div className="px-3 pt-2">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate">{session.user?.name}</p>
          <p className="text-xs text-[var(--color-text-muted)] truncate">{session.user?.email}</p>
        </div>
      </div>
    </aside>
  );
}
