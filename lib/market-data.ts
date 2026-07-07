// Market Data Service
// Indian stocks (NSE/BSE): Yahoo Finance — free, no key, real-time
// US stocks/ETFs: Twelve Data — free tier (800 req/day), needs TWELVE_DATA_API_KEY
// Mutual Funds: MFAPI.in — free, no key, official AMFI data
// All prices are deterministic API values — the LLM never produces a number.

const TWELVE_BASE = "https://api.twelvedata.com";
const MFAPI_BASE  = "https://api.mfapi.in/mf";
const YAHOO_BASE  = "https://query1.finance.yahoo.com/v8/finance/chart";

const YAHOO_HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; Finantalyst/1.0)" };

function twelveKey() {
  return process.env.TWELVE_DATA_API_KEY ?? "";
}

// Indian exchange suffix for Yahoo Finance
function toYahooSymbol(symbol: string): string {
  const upper = symbol.toUpperCase();
  if (upper.endsWith(".NS") || upper.endsWith(".BO")) return upper;
  return `${upper}.NS`; // default to NSE
}

// ─── Stock / ETF ──────────────────────────────────────────────

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  exchange: string;
  currency: string;
  fetchedAt: string;
}

// Indian stocks via Yahoo Finance (free, no key)
export async function getIndianStockQuote(symbol: string): Promise<StockQuote> {
  const yahooSym = toYahooSymbol(symbol);
  const url = `${YAHOO_BASE}/${encodeURIComponent(yahooSym)}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: YAHOO_HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Yahoo Finance ${res.status} for ${yahooSym}`);

  const data = await res.json() as {
    chart: {
      result: {
        meta: {
          regularMarketPrice: number;
          previousClose: number;
          shortName: string;
          exchangeName: string;
          currency: string;
          symbol: string;
        };
      }[];
      error?: { description: string };
    };
  };

  if (data.chart.error) throw new Error(data.chart.error.description);
  const meta = data.chart.result?.[0]?.meta;
  if (!meta) throw new Error(`No data for ${yahooSym}`);

  const change = meta.regularMarketPrice - meta.previousClose;
  const changePct = (change / meta.previousClose) * 100;

  return {
    symbol:    meta.symbol,
    name:      meta.shortName ?? symbol,
    price:     meta.regularMarketPrice,
    change:    parseFloat(change.toFixed(2)),
    changePct: parseFloat(changePct.toFixed(2)),
    exchange:  meta.exchangeName,
    currency:  meta.currency,
    fetchedAt: new Date().toISOString(),
  };
}

// US stocks via Twelve Data (free tier 800 req/day)
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  // Route Indian symbols to Yahoo Finance
  const upper = symbol.toUpperCase();
  if (upper.endsWith(".NS") || upper.endsWith(".BO") || !symbol.includes(".")) {
    // Try Yahoo first for any symbol without a dot (likely Indian)
    try {
      return await getIndianStockQuote(symbol);
    } catch {
      // fall through to Twelve Data
    }
  }

  if (!twelveKey()) throw new Error("TWELVE_DATA_API_KEY not set");
  const url = `${TWELVE_BASE}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${twelveKey()}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Twelve Data ${res.status}`);

  const d = await res.json() as Record<string, string>;
  if (d.status === "error") throw new Error(d.message ?? "Twelve Data error");

  return {
    symbol:    d.symbol,
    name:      d.name,
    price:     parseFloat(d.close),
    change:    parseFloat(d.change),
    changePct: parseFloat(d.percent_change),
    exchange:  d.exchange,
    currency:  d.currency,
    fetchedAt: new Date().toISOString(),
  };
}

export async function getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (symbols.length === 0) return [];
  return Promise.all(symbols.map(s => getStockQuote(s)));
}

// ─── Mutual Funds (MFAPI.in — free, AMFI official data) ───────

export interface MFScheme {
  schemeCode: number;
  schemeName: string;
}

export interface MFNav {
  schemeCode: number;
  schemeName: string;
  nav: number;
  date: string;
}

export interface MFDetail {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  schemeType: string;
  schemeCategory: string;
  nav: number;
  date: string;
}

export async function searchMutualFunds(query: string): Promise<MFScheme[]> {
  const res = await fetch(`${MFAPI_BASE}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("MFAPI unavailable");
  const all = await res.json() as MFScheme[];
  const q = query.toLowerCase();
  return all.filter(s => s.schemeName.toLowerCase().includes(q)).slice(0, 20);
}

export async function getMFNav(schemeCode: number): Promise<MFDetail> {
  const res = await fetch(`${MFAPI_BASE}/${schemeCode}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`MFAPI ${res.status} for scheme ${schemeCode}`);

  const d = await res.json() as {
    meta: { scheme_code: number; scheme_name: string; fund_house: string; scheme_type: string; scheme_category: string };
    data: { nav: string; date: string }[];
  };

  const latest = d.data[0];
  return {
    schemeCode:      d.meta.scheme_code,
    schemeName:      d.meta.scheme_name,
    fundHouse:       d.meta.fund_house,
    schemeType:      d.meta.scheme_type,
    schemeCategory:  d.meta.scheme_category,
    nav:             parseFloat(latest.nav),
    date:            latest.date,
  };
}

export async function getMFNavHistory(schemeCode: number, days = 30): Promise<{ date: string; nav: number }[]> {
  const res = await fetch(`${MFAPI_BASE}/${schemeCode}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`MFAPI ${res.status}`);
  const d = await res.json() as { data: { nav: string; date: string }[] };
  return d.data.slice(0, days).map(r => ({ date: r.date, nav: parseFloat(r.nav) })).reverse();
}
