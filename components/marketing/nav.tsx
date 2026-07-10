"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

const LINKS = [
  { label: "Product",      href: "/product"    },
  { label: "Tax Planning", href: "/tax"         },
  { label: "Compliance",   href: "/compliance"  },
  { label: "Deal Room",    href: "/deal-room"   },
];

export function MarketingNav({ active }: { active?: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "rgba(12,13,20,0.96)" : "#0C0D14",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: `1px solid ${scrolled ? "#252640" : "transparent"}`,
      transition: "border-color 0.2s, background 0.2s",
    }}>
      <style>{`
        .mk-nav-link { color:#8B8AA8; font-size:14px; text-decoration:none; padding:6px 13px; border-radius:8px; transition:color 0.15s,background 0.15s; font-weight:400; }
        .mk-nav-link:hover { color:#EEEDF8; background:rgba(255,255,255,0.06); }
        .mk-nav-link.active { color:#EEEDF8; background:rgba(255,255,255,0.06); font-weight:600; }
        @media(max-width:840px){ .mk-nav-center{ display:none !important; } }
      `}</style>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={14} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.4px", color: "#EEEDF8" }}>Finantalyst</span>
          <span style={{ fontSize: 9, color: "#6366F1", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 4, padding: "2px 7px", fontWeight: 700, letterSpacing: "1px" }}>BETA</span>
        </Link>
        {/* Centre */}
        <div className="mk-nav-center" style={{ display: "flex", gap: 2 }}>
          {LINKS.map(l => (
            <Link key={l.label} href={l.href} className={`mk-nav-link${active === l.label ? " active" : ""}`}>{l.label}</Link>
          ))}
        </div>
        {/* CTA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#8B8AA8", fontSize: 14, textDecoration: "none", padding: "6px 14px" }}>Sign in</Link>
          <Link href="/register" style={{ background: "#6366F1", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "9px 22px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
            Launch App <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
