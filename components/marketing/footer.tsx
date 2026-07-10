import Link from "next/link";
import { Zap } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: "1px solid #252640", background: "#0C0D14", padding: "28px 28px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#6366F1,#10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={10} color="white" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#EEEDF8" }}>Finantalyst</span>
          <span style={{ fontSize: 12, color: "#3A3958" }}>© 2026</span>
        </div>
        <p style={{ fontSize: 11, color: "#3A3958", textAlign: "center", maxWidth: 480 }}>
          Not a SEBI-registered advisor · Not for actual tax filing · For planning purposes only · All market data from third-party APIs
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Product","/product"],["Tax","/tax"],["Compliance","/compliance"],["Deal Room","/deal-room"],["Sign in","/login"]].map(([label,href]) => (
            <Link key={label} href={href} style={{ fontSize: 12, color: "#555570", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
