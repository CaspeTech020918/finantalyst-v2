"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, AlertTriangle, Search, TrendingUp, TrendingDown,
  Loader2, X, ChevronDown, ChevronUp, RefreshCw,
  FileText, Mail, Upload, CheckCircle, ExternalLink, Info
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── Types ────────────────────────────────────────────────────

interface StockQuote {
  symbol: string; name: string; price: number;
  change: number; changePct: number; exchange: string; currency: string;
}
interface MFScheme { schemeCode: number; schemeName: string; }
interface MFDetail {
  schemeCode: number; schemeName: string; fundHouse: string;
  schemeType: string; schemeCategory: string; nav: number; date: string;
}

// ─── Market snapshot config ───────────────────────────────────

const INDICES = [
  { symbol: "^NSEI",  label: "NIFTY 50",  suffix: "" },
  { symbol: "^BSESN", label: "SENSEX",    suffix: "" },
  { symbol: "^NSMIDCP50", label: "NIFTY Midcap 50", suffix: "" },
];

const POPULAR_STOCKS = [
  { symbol: "RELIANCE.NS", label: "Reliance" },
  { symbol: "TCS.NS",      label: "TCS" },
  { symbol: "HDFCBANK.NS", label: "HDFC Bank" },
  { symbol: "INFY.NS",     label: "Infosys" },
  { symbol: "ICICIBANK.NS",label: "ICICI Bank" },
  { symbol: "WIPRO.NS",    label: "Wipro" },
  { symbol: "BAJFINANCE.NS",label: "Bajaj Finance" },
  { symbol: "SBIN.NS",     label: "SBI" },
];

// ─── Sub-components ───────────────────────────────────────────

function QuoteTile({ symbol, label, large = false }: { symbol: string; label: string; large?: boolean }) {
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

  if (large) {
    return (
      <div className="px-4 py-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] flex flex-col gap-1">
        <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
        {loading ? (
          <div className="h-6 w-20 rounded bg-[var(--color-border)] animate-pulse" />
        ) : quote ? (
          <>
            <p className="text-lg font-bold text-[var(--color-text-primary)]">
              {quote.currency === "INR" ? "₹" : ""}{quote.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
            <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-[var(--color-emerald)]" : "text-red-400"}`}>
              {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {up ? "+" : ""}{(quote.change ?? 0).toFixed(2)} ({up ? "+" : ""}{(quote.changePct ?? 0).toFixed(2)}%)
            </div>
          </>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">Unavailable</p>
        )}
      </div>
    );
  }

  return (
    <div className="px-3 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)]">
      <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{label}</p>
      {loading ? (
        <div className="h-4 w-16 rounded bg-[var(--color-border)] animate-pulse" />
      ) : quote ? (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            ₹{quote.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          <span className={`text-xs font-medium ${up ? "text-[var(--color-emerald)]" : "text-red-400"}`}>
            {up ? "+" : ""}{(quote.changePct ?? 0).toFixed(2)}%
          </span>
        </div>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)]">—</p>
      )}
    </div>
  );
}

// CAMS connect accordion
const CAMS_STEPS = [
  {
    icon: <ExternalLink size={15} />,
    title: "Visit CAMS Online",
    desc: "Go to camsonline.com → click 'Mailback Services' → select 'Consolidated Account Statement (CAMS + KFintech)'",
    action: { label: "Open CAMS", href: "https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement" },
  },
  {
    icon: <Mail size={15} />,
    title: "Request your CAS",
    desc: "Enter your PAN and the email registered with your mutual funds. Choose 'Detailed' statement and set date range to 'Since inception'. Hit Send.",
    action: null,
  },
  {
    icon: <FileText size={15} />,
    title: "Check your email",
    desc: "You'll receive a password-protected PDF within a few minutes. The password is your PAN in uppercase (e.g. ABCDE1234F).",
    action: null,
  },
  {
    icon: <Upload size={15} />,
    title: "Upload here",
    desc: "Upload the CAS PDF below. We'll parse all your mutual fund holdings automatically — scheme name, units, current NAV, XIRR.",
    action: { label: "Upload CAS PDF", href: null },
  },
];

function CAMSConnect({ onUpload }: { onUpload: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard variant="raised" padding="none" className="overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-glass)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-indigo)]/15 flex items-center justify-center">
            <FileText size={16} className="text-[var(--color-indigo)]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Connect CAMS — Import Mutual Fund Portfolio</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Auto-fetch all your MF holdings via CAMS · Takes 2 minutes</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[var(--color-text-muted)]" /> : <ChevronDown size={16} className="text-[var(--color-text-muted)]" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[var(--color-border)]">
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/20 mt-4 mb-5">
            <Info size={13} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)]">
              CAMS is India's largest MF registrar. This process fetches <span className="font-medium text-[var(--color-text-primary)]">read-only</span> data — no login, no passwords, no money movement.
            </p>
          </div>

          <div className="space-y-3">
            {CAMS_STEPS.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-indigo)]/15 flex items-center justify-center text-[var(--color-indigo)]">
                    {step.icon}
                  </div>
                  {i < CAMS_STEPS.length - 1 && <div className="w-px flex-1 bg-[var(--color-border)]" style={{ minHeight: 16 }} />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      Step {i + 1}: {step.title}
                    </p>
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
              <span className="font-medium text-[var(--color-text-primary)]">KFintech holdings</span> are also included in the same CAS PDF — so you get 100% of your mutual fund portfolio in one go.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// MF NAV search
function MFSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MFScheme[]>([]);
  const [selected, setSelected] = useState<MFDetail | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setSearching(true); setHasSearched(true);
    const res = await fetch(`/api/market/mf?q=${encodeURIComponent(query)}`);
    const data = await res.json() as { schemes?: MFScheme[] };
    setResults(data.schemes ?? []);
    setSearching(false);
  }

  async function viewDetail(code: number) {
    const res = await fetch(`/api/market/mf?code=${code}`);
    const data = await res.json() as { detail?: MFDetail };
    if (data.detail) setSelected(data.detail);
  }

  return (
    <GlassCard variant="raised" padding="lg">
      <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">Mutual Fund NAV Lookup</p>
      <p className="text-xs text-[var(--color-text-secondary)] mb-4">Live NAVs from AMFI — search any Indian mutual fund scheme</p>

      <div className="flex gap-3 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="e.g. Mirae Asset Large Cap, Axis Bluechip, HDFC Flexi Cap…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-indigo)] transition-colors"
        />
        <Button variant="primary" size="md" onClick={search} disabled={!query.trim() || searching}>
          {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {searching ? "Searching…" : "Search"}
        </Button>
      </div>

      {hasSearched && results.length === 0 && !searching && (
        <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No schemes found for "{query}"</p>
      )}

      {results.length > 0 && (
        <div className="space-y-1 max-h-56 overflow-y-auto">
          {results.map(s => (
            <button key={s.schemeCode} onClick={() => viewDetail(s.schemeCode)}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[var(--color-glass)] border border-transparent hover:border-[var(--color-border)] transition-colors">
              <p className="text-sm text-[var(--color-text-primary)]">{s.schemeName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Code: {s.schemeCode}</p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-[var(--color-text-primary)] text-sm">{selected.schemeName}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{selected.fundHouse}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              <X size={15} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "NAV", value: `₹${selected.nav.toFixed(4)}` },
              { label: "As of", value: selected.date },
              { label: "Category", value: selected.schemeCategory },
              { label: "Type", value: selected.schemeType },
            ].map(item => (
              <div key={item.label} className="px-3 py-2 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{item.label}</p>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">Source: AMFI India via MFAPI.in · Updated daily</p>
        </div>
      )}
    </GlassCard>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function InvestmentsPage() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    setLastRefresh(new Date());
  }, []);

  return (
    <div>
      <PageHeader
        title="Investments"
        description="Live market snapshot, portfolio tracker, and mutual fund NAV lookup — all prices from official sources."
        icon={<BarChart3 size={20} />}
      />

      {/* Regulatory notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-6">
        <AlertTriangle size={15} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-amber)]">Regulatory notice:</span> Prices shown are for information only. Finantalyst is not a SEBI-registered investment adviser. All investment decisions are yours alone.
        </p>
      </div>

      {/* ── LIVE MARKET SNAPSHOT ── */}
      <GlassCard variant="raised" padding="lg" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Live Market</p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              NSE/BSE · Last updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {/* Indices */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {INDICES.map(idx => (
            <QuoteTile key={`${idx.symbol}-${refreshKey}`} symbol={idx.symbol} label={idx.label} large />
          ))}
        </div>

        {/* Popular stocks */}
        <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">Popular Stocks</p>
        <div className="grid grid-cols-4 gap-2">
          {POPULAR_STOCKS.map(s => (
            <QuoteTile key={`${s.symbol}-${refreshKey}`} symbol={s.symbol} label={s.label} />
          ))}
        </div>
      </GlassCard>

      {/* ── CAMS CONNECT ── */}
      <div className="mb-6">
        <CAMSConnect onUpload={() => setShowUploadModal(true)} />
      </div>

      {/* ── MF NAV SEARCH ── */}
      <div className="mb-6">
        <MFSearch />
      </div>

      {/* Upload modal placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard variant="raised" padding="lg" className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[var(--color-text-primary)]">Upload CAS PDF</p>
              <button onClick={() => setShowUploadModal(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X size={16} />
              </button>
            </div>
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center">
              <Upload size={28} className="text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Drop your CAS PDF here</p>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4">Password: your PAN in uppercase (e.g. ABCDE1234F)</p>
              <Button variant="primary" size="md">
                <Upload size={14} /> Choose File
              </Button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
              CAS PDF parsing coming in the next build — Gemini AI will extract all holdings automatically.
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
