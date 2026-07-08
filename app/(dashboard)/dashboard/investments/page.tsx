"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, AlertTriangle, Search, TrendingUp, TrendingDown,
  Loader2, X, ChevronDown, ChevronUp, RefreshCw,
  FileText, Mail, Upload, CheckCircle, ExternalLink, Info,
  Activity,
} from "lucide-react";

interface StockQuote {
  symbol: string; name: string; price: number;
  change: number; changePct: number; exchange: string; currency: string;
}
interface MFScheme { schemeCode: number; schemeName: string; }
interface MFDetail {
  schemeCode: number; schemeName: string; fundHouse: string;
  schemeType: string; schemeCategory: string; nav: number; date: string;
}

const INDICES = [
  { symbol: "^NSEI",      label: "NIFTY 50",       desc: "National benchmark" },
  { symbol: "^BSESN",     label: "SENSEX",          desc: "BSE flagship index" },
  { symbol: "^NSMIDCP50", label: "NIFTY Midcap 50", desc: "Mid-cap barometer" },
];

const POPULAR_STOCKS = [
  { symbol: "RELIANCE.NS",  label: "Reliance",      sector: "Energy" },
  { symbol: "TCS.NS",       label: "TCS",           sector: "IT" },
  { symbol: "HDFCBANK.NS",  label: "HDFC Bank",     sector: "Banking" },
  { symbol: "INFY.NS",      label: "Infosys",       sector: "IT" },
  { symbol: "ICICIBANK.NS", label: "ICICI Bank",    sector: "Banking" },
  { symbol: "WIPRO.NS",     label: "Wipro",         sector: "IT" },
  { symbol: "BAJFINANCE.NS",label: "Bajaj Finance", sector: "NBFC" },
  { symbol: "SBIN.NS",      label: "SBI",           sector: "Banking" },
];

// ─── Index Tile ───────────────────────────────────────────────

function IndexTile({ symbol, label, desc }: { symbol: string; label: string; desc: string }) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`)
      .then(r => r.json())
      .then((d: { quote?: StockQuote }) => { if (d.quote) setQuote(d.quote); })
      .finally(() => setLoading(false));
  }, [symbol]);

  const up = (quote?.changePct ?? 0) >= 0;
  const color = up ? "var(--color-emerald)" : "#EF4444";

  return (
    <div className="flex flex-col gap-2 px-5 py-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass)] hover:border-[var(--color-border-strong)] transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          {up ? <TrendingUp size={14} style={{ color }} /> : <TrendingDown size={14} style={{ color }} />}
        </div>
      </div>

      {loading ? (
        <div>
          <div className="h-7 w-28 rounded-lg bg-[var(--color-border)] animate-pulse mb-1.5" />
          <div className="h-4 w-20 rounded bg-[var(--color-border)] animate-pulse" />
        </div>
      ) : quote ? (
        <>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            {quote.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color, background: `${color}18` }}>
              {up ? "+" : ""}{(quote.changePct ?? 0).toFixed(2)}%
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {up ? "+" : ""}{(quote.change ?? 0).toFixed(2)} pts
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)]">Data unavailable</p>
      )}
    </div>
  );
}

// ─── Stock Card ───────────────────────────────────────────────

function StockCard({ symbol, label, sector }: { symbol: string; label: string; sector: string }) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`)
      .then(r => r.json())
      .then((d: { quote?: StockQuote }) => { if (d.quote) setQuote(d.quote); })
      .finally(() => setLoading(false));
  }, [symbol]);

  const changePct = quote?.changePct ?? 0;
  const up = changePct >= 0;
  const color = up ? "var(--color-emerald)" : "#EF4444";

  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] hover:border-[var(--color-border-strong)] transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--color-text-primary)]">{label}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{sector}</p>
        </div>
        {!loading && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color, background: `${color}18` }}>
            {up ? "+" : ""}{changePct.toFixed(2)}%
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-5 w-24 rounded bg-[var(--color-border)] animate-pulse" />
      ) : quote ? (
        <p className="text-base font-bold text-[var(--color-text-primary)]">
          ₹{quote.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)]">—</p>
      )}
    </div>
  );
}

// ─── CAMS Connect ─────────────────────────────────────────────

const CAMS_STEPS = [
  {
    icon: <ExternalLink size={14} />,
    title: "Visit CAMS Online",
    desc: "Go to camsonline.com → 'Mailback Services' → 'Consolidated Account Statement (CAMS + KFintech)'",
    action: { label: "Open CAMS", href: "https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement" },
  },
  {
    icon: <Mail size={14} />,
    title: "Request your CAS",
    desc: "Enter PAN and email registered with your mutual funds. Choose 'Detailed' statement, date range 'Since inception'. Hit Send.",
    action: null,
  },
  {
    icon: <FileText size={14} />,
    title: "Check your email",
    desc: "You'll receive a password-protected PDF. The password is your PAN in UPPERCASE (e.g. ABCDE1234F).",
    action: null,
  },
  {
    icon: <Upload size={14} />,
    title: "Upload here",
    desc: "Upload the CAS PDF — Gemini AI will parse all your MF holdings: scheme name, units, NAV, XIRR.",
    action: { label: "Upload CAS PDF", href: null },
  },
];

function CAMSConnect({ onUpload }: { onUpload: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard variant="raised" padding="none" className="overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-glass)] transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-indigo)]/15 flex items-center justify-center">
            <FileText size={16} className="text-[var(--color-indigo)]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Connect CAMS — Import Mutual Fund Portfolio</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Auto-fetch all MF holdings via CAMS · Takes 2 minutes</p>
          </div>
        </div>
        {open ? <ChevronUp size={15} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={15} className="text-[var(--color-text-muted)]" />}
      </button>

      {open && (
        <div className="px-5 pb-6 border-t border-[var(--color-border)]">
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/20 mt-4 mb-5">
            <Info size={12} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)]">
              CAMS is India&apos;s largest MF registrar. This fetches <strong className="text-[var(--color-text-primary)]">read-only</strong> data — no login, no passwords, no money movement.
            </p>
          </div>
          <div className="space-y-3">
            {CAMS_STEPS.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-indigo)]/15 flex items-center justify-center text-[var(--color-indigo)]">
                    {step.icon}
                  </div>
                  {i < CAMS_STEPS.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)] mt-1 mb-1" style={{ minHeight: 16 }} />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">Step {i + 1}: {step.title}</p>
                    {step.action?.href && (
                      <a href={step.action.href} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm">{step.action.label}</Button>
                      </a>
                    )}
                    {step.action && !step.action.href && (
                      <Button variant="primary" size="sm" onClick={onUpload}>{step.action.label}</Button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-start gap-2">
            <CheckCircle size={13} className="text-[var(--color-emerald)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-text-primary)]">KFintech holdings</strong> are also included in the same CAS PDF — 100% of your MF portfolio in one upload.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ─── MF NAV Search ────────────────────────────────────────────

function MFSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MFScheme[]>([]);
  const [selected, setSelected] = useState<MFDetail | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setSearching(true); setHasSearched(true); setSelected(null);
    const res = await fetch(`/api/market/mf?q=${encodeURIComponent(query)}`);
    const data = await res.json() as { schemes?: MFScheme[] };
    setResults(data.schemes ?? []);
    setSearching(false);
  }

  async function viewDetail(code: number) {
    const res = await fetch(`/api/market/mf?code=${code}`);
    const data = await res.json() as { detail?: MFDetail };
    if (data.detail) setSelected(data.detail);
    setResults([]);
  }

  return (
    <GlassCard variant="raised" padding="lg">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-emerald-dim)] flex items-center justify-center">
          <Activity size={15} className="text-[var(--color-emerald)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Mutual Fund NAV Lookup</p>
          <p className="text-xs text-[var(--color-text-secondary)]">Live NAVs from AMFI — 10,000+ Indian MF schemes</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
          placeholder="e.g. Mirae Asset Large Cap, Axis Bluechip, HDFC Flexi Cap…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-indigo)] transition-colors" />
        <Button variant="primary" size="md" onClick={search} disabled={!query.trim() || searching}>
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {searching ? "Searching…" : "Search"}
        </Button>
      </div>

      {hasSearched && results.length === 0 && !searching && (
        <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No schemes found for &quot;{query}&quot;</p>
      )}

      {results.length > 0 && (
        <div className="space-y-1 max-h-56 overflow-y-auto rounded-xl border border-[var(--color-border)] p-1">
          {results.slice(0, 15).map(s => (
            <button key={s.schemeCode} onClick={() => viewDetail(s.schemeCode)}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[var(--color-glass)] transition-colors">
              <p className="text-sm text-[var(--color-text-primary)]">{s.schemeName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Code: {s.schemeCode}</p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-bold text-[var(--color-text-primary)] text-sm leading-tight">{selected.schemeName}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{selected.fundHouse}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors ml-4">
              <X size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Current NAV", value: `₹${selected.nav.toFixed(4)}`, highlight: true },
              { label: "As of", value: selected.date },
              { label: "Category", value: selected.schemeCategory },
              { label: "Type", value: selected.schemeType },
            ].map(item => (
              <div key={item.label} className="px-3 py-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.highlight ? "text-[var(--color-emerald)]" : "text-[var(--color-text-primary)]"}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-3 flex items-center gap-1.5">
            <CheckCircle size={11} className="text-[var(--color-emerald)]" />
            Source: AMFI India via MFAPI.in · Updated daily
          </p>
        </div>
      )}
    </GlassCard>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function InvestmentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showUploadModal, setShowUploadModal] = useState(false);

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    setLastRefresh(new Date());
  }, []);

  return (
    <div>
      <PageHeader
        title="Investments"
        description="Live NSE/BSE market data, mutual fund NAV lookup, and portfolio import — all prices from official sources."
        icon={<BarChart3 size={20} />}
      />

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-6">
        <AlertTriangle size={14} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-amber)]">For information only.</span> Prices are sourced from Yahoo Finance/AMFI. Finantalyst is not a SEBI-registered investment adviser. All investment decisions are yours alone.
        </p>
      </div>

      {/* ── LIVE MARKET ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-emerald)] animate-pulse inline-block" />
              Live Market
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              NSE/BSE · Refreshed at {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button onClick={refresh}
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-indigo)] transition-colors px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-indigo)]/40">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>

        {/* Indices */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {INDICES.map(idx => (
            <IndexTile key={`${idx.symbol}-${refreshKey}`} {...idx} />
          ))}
        </div>

        {/* Stocks */}
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Popular Stocks</p>
        <div className="grid grid-cols-4 gap-3">
          {POPULAR_STOCKS.map(s => (
            <StockCard key={`${s.symbol}-${refreshKey}`} {...s} />
          ))}
        </div>
      </div>

      {/* ── CAMS ── */}
      <div className="mb-5">
        <CAMSConnect onUpload={() => setShowUploadModal(true)} />
      </div>

      {/* ── MF SEARCH ── */}
      <MFSearch />

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard variant="raised" padding="lg" className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[var(--color-text-primary)]">Upload CAS PDF</p>
              <button onClick={() => setShowUploadModal(false)}><X size={16} className="text-[var(--color-text-muted)]" /></button>
            </div>
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center bg-[var(--color-glass)]">
              <Upload size={28} className="text-[var(--color-indigo)] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Drop your CAS PDF here</p>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4">Password: your PAN in uppercase · e.g. ABCDE1234F</p>
              <Button variant="primary" size="md"><Upload size={14} /> Choose File</Button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
              Gemini AI will extract all holdings automatically — coming in the next build.
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
