"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Link2, Link2Off, AlertTriangle, CheckCircle2,
  ExternalLink, RefreshCw, Shield, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

interface Connection { broker: string; clientId: string | null; connectedAt: string; isActive: boolean; }

// ─── Broker catalog ───────────────────────────────────────────

interface BrokerDef {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: "live" | "coming_soon" | "regulated";
  connectUrl?: string;
  regulatedNote?: string;
  docsUrl?: string;
}

const BROKERS: BrokerDef[] = [
  {
    id: "ZERODHA",
    name: "Zerodha",
    description: "India's largest stockbroker. Connect via Kite Connect OAuth to sync holdings, positions, and portfolio P&L.",
    logo: "Z",
    status: "live",
    connectUrl: "/api/integrations/zerodha",
    docsUrl: "https://kite.trade/docs",
  },
  {
    id: "ANGEL_ONE",
    name: "Angel One",
    description: "Angel One SmartAPI integration for portfolio sync. Register a developer account and add your API key.",
    logo: "A",
    status: "coming_soon",
  },
  {
    id: "UPSTOX",
    name: "Upstox",
    description: "Upstox Developer API — free tier available for retail investors to sync their portfolio.",
    logo: "U",
    status: "coming_soon",
  },
  {
    id: "GROWW",
    name: "Groww",
    description: "Groww does not currently offer a public API. Data can be imported via CAMS statement.",
    logo: "G",
    status: "coming_soon",
  },
];

interface PartnerDef {
  name: string;
  description: string;
  license: string;
  regulator: string;
  applyUrl: string;
  icon: React.ReactNode;
}

const REGULATED_PARTNERS: PartnerDef[] = [
  {
    name: "Account Aggregator (Bank Data)",
    description: "Read-only access to all your bank accounts, FDs, and insurance data via RBI's Account Aggregator framework. Requires an FIU (Financial Information User) licence from RBI.",
    license: "FIU Licence",
    regulator: "RBI",
    applyUrl: "https://www.rbi.org.in",
    icon: <Shield size={16} />,
  },
  {
    name: "ITR e-Filing (Tax Filing)",
    description: "Automated ITR preparation and submission directly to the Income Tax portal. Requires partnership with a registered CA / ERI (e-Return Intermediary).",
    license: "CA / ERI Registration",
    regulator: "CBDT",
    applyUrl: "https://www.incometax.gov.in",
    icon: <Lock size={16} />,
  },
  {
    name: "GST Filing Automation",
    description: "Automated GSTR-1, GSTR-3B, and GSTR-9 filing. Requires a GSP (GST Suvidha Provider) licence or partnership with an existing GSP.",
    license: "GSP Licence",
    regulator: "GSTN",
    applyUrl: "https://www.gst.gov.in",
    icon: <Lock size={16} />,
  },
  {
    name: "Investment Advisory",
    description: "Personalised investment recommendations and portfolio rebalancing. Requires SEBI Registered Investment Adviser (RIA) registration.",
    license: "SEBI RIA Registration",
    regulator: "SEBI",
    applyUrl: "https://www.sebi.gov.in",
    icon: <Lock size={16} />,
  },
];

// ─── Components ───────────────────────────────────────────────

function BrokerCard({ broker, connection, onDisconnect }: {
  broker: BrokerDef;
  connection?: Connection;
  onDisconnect: (id: string) => void;
}) {
  const isConnected = !!connection;

  return (
    <GlassCard variant="raised" padding="md">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0",
          isConnected ? "bg-[var(--color-emerald)]" : broker.status === "live" ? "bg-[var(--color-indigo)]" : "bg-[var(--color-glass)] text-[var(--color-text-muted)]")}>
          {broker.logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">{broker.name}</p>
            {broker.status === "live" && !isConnected && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-emerald-dim)] text-[var(--color-emerald)] font-medium">Available</span>
            )}
            {broker.status === "coming_soon" && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-glass)] text-[var(--color-text-muted)] font-medium">Coming soon</span>
            )}
            {isConnected && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-emerald-dim)] text-[var(--color-emerald)] font-medium flex items-center gap-1">
                <CheckCircle2 size={10} /> Connected
              </span>
            )}
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">{broker.description}</p>

          {isConnected && connection && (
            <p className="text-xs text-[var(--color-text-muted)] mb-2">
              Client ID: {connection.clientId ?? "—"} · Connected {new Date(connection.connectedAt).toLocaleDateString("en-IN")}
            </p>
          )}

          <div className="flex items-center gap-2">
            {isConnected ? (
              <Button variant="danger" size="sm" onClick={() => onDisconnect(broker.id)} className="gap-1.5 text-xs">
                <Link2Off size={12} /> Disconnect
              </Button>
            ) : broker.status === "live" && broker.connectUrl ? (
              <a href={broker.connectUrl}>
                <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                  <Link2 size={12} /> Connect {broker.name}
                </Button>
              </a>
            ) : (
              <Button variant="secondary" size="sm" disabled className="gap-1.5 text-xs opacity-50">
                Coming soon
              </Button>
            )}
            {broker.docsUrl && (
              <a href={broker.docsUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-indigo)] flex items-center gap-1 transition-colors">
                <ExternalLink size={11} /> Docs
              </a>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function RegulatedCard({ partner }: { partner: PartnerDef }) {
  return (
    <GlassCard variant="raised" padding="md">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-red-dim)] text-[var(--color-red)] shrink-0">
          {partner.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">{partner.name}</p>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-red-dim)] text-[var(--color-red)] font-medium">[REGULATED]</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-2">{partner.description}</p>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span>Licence: <strong className="text-[var(--color-text-secondary)]">{partner.license}</strong></span>
            <span>Regulator: <strong className="text-[var(--color-text-secondary)]">{partner.regulator}</strong></span>
            <a href={partner.applyUrl} target="_blank" rel="noopener noreferrer"
              className="text-[var(--color-indigo)] hover:underline flex items-center gap-1">
              <ExternalLink size={10} /> Apply
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const connected = searchParams.get("connected");
  const error     = searchParams.get("error");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/integrations/connections");
    const data = await res.json() as { connections: Connection[] };
    setConnections(data.connections ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function disconnect(broker: string) {
    setConnections(prev => prev.filter(c => c.broker !== broker));
    await fetch(`/api/integrations/connections?broker=${broker}`, { method: "DELETE" });
  }

  const connectionMap = Object.fromEntries(connections.map(c => [c.broker, c]));

  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect your brokerage accounts and understand what requires licensed partners."
        icon={<Link2 size={20} />}
      />

      {/* Status messages */}
      {connected && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-emerald-dim)] border border-[var(--color-emerald)]/25 mb-4">
          <CheckCircle2 size={14} className="text-[var(--color-emerald)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong className="text-[var(--color-emerald)] capitalize">{connected}</strong> connected successfully.
          </p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25 mb-4">
          <AlertTriangle size={14} className="text-[var(--color-red)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Connection {error === "zerodha_cancelled" ? "was cancelled." : "failed. Please try again."}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-[var(--color-text-muted)] text-sm">
          <RefreshCw size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-8">
          {/* Brokerages */}
          <section>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-3">Brokerage Accounts</h2>
            <div className="space-y-3">
              {BROKERS.map(b => (
                <BrokerCard key={b.id} broker={b} connection={connectionMap[b.id]} onDisconnect={disconnect} />
              ))}
            </div>
          </section>

          {/* Zerodha setup note */}
          <GlassCard variant="raised" padding="md">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">Setting up Zerodha Kite Connect</h3>
            <ol className="text-xs text-[var(--color-text-secondary)] space-y-1 list-decimal list-inside">
              <li>Register at <a href="https://developers.kite.trade" target="_blank" rel="noopener noreferrer" className="text-[var(--color-indigo)] underline">developers.kite.trade</a> and create an app.</li>
              <li>Set the redirect URL to: <code className="bg-[var(--color-glass)] px-1.5 py-0.5 rounded text-xs">https://finantalyst-v2.vercel.app/api/integrations/zerodha/callback</code></li>
              <li>Add <code className="bg-[var(--color-glass)] px-1 py-0.5 rounded">ZERODHA_API_KEY</code> and <code className="bg-[var(--color-glass)] px-1 py-0.5 rounded">ZERODHA_API_SECRET</code> to Vercel environment variables.</li>
              <li>Redeploy — the Connect button above will become active.</li>
            </ol>
          </GlassCard>

          {/* Regulated partners */}
          <section>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-1">Regulated Partner Requirements</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">These features require licences from Indian regulators before going live. The app scaffolding is ready — these are the approvals needed.</p>
            <div className="space-y-3">
              {REGULATED_PARTNERS.map(p => <RegulatedCard key={p.name} partner={p} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
