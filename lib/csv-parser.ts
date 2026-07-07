export interface ParsedRow {
  date: Date;
  description: string;
  amount: number; // positive = credit, negative = debit
  reference?: string;
  balance?: number;
}

export interface ParseResult {
  rows: ParsedRow[];
  skipped: number;
  errors: string[];
}

function parseDate(raw: string): Date | null {
  if (!raw) return null;
  const s = raw.trim().replace(/\//g, "-");

  // DD-MM-YYYY or DD-MM-YY
  const dmy = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = y.length === 2 ? 2000 + Number(y) : Number(y);
    return new Date(year, Number(m) - 1, Number(d));
  }

  // YYYY-MM-DD
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) {
    const [, y, m, d] = ymd;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  // Try native parse as last resort
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function parseAmount(raw: string): number {
  if (!raw || raw.trim() === "" || raw.trim() === "-") return 0;
  return parseFloat(raw.replace(/[₹,\s]/g, "")) || 0;
}

function detectColumns(headers: string[]): {
  dateIdx: number;
  descIdx: number;
  debitIdx: number;
  creditIdx: number;
  amountIdx: number;
  refIdx: number;
  balIdx: number;
} {
  const h = headers.map((x) => x.toLowerCase().trim());
  const find = (...terms: string[]) =>
    h.findIndex((col) => terms.some((t) => col.includes(t)));

  return {
    dateIdx:   find("date", "txn date", "trans date", "value date", "posting date"),
    descIdx:   find("narration", "description", "particulars", "remarks", "details", "transaction remarks"),
    debitIdx:  find("debit", "withdrawal", "dr", "debit amount"),
    creditIdx: find("credit", "deposit", "cr", "credit amount"),
    amountIdx: find("amount"),
    refIdx:    find("ref", "cheque", "reference", "chq"),
    balIdx:    find("balance", "closing balance"),
  };
}

export function parseCSV(csvText: string): ParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { rows: [], skipped: 0, errors: ["File is empty or has no data rows"] };
  }

  // Find header row (first row with recognisable column names)
  let headerIdx = 0;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const lower = lines[i].toLowerCase();
    if (lower.includes("date") && (lower.includes("amount") || lower.includes("debit") || lower.includes("credit"))) {
      headerIdx = i;
      break;
    }
  }

  const splitLine = (line: string): string[] =>
    line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());

  const headers = splitLine(lines[headerIdx]);
  const cols = detectColumns(headers);

  const rows: ParsedRow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    if (cells.length < 2) { skipped++; continue; }

    // Date
    const rawDate = cols.dateIdx >= 0 ? cells[cols.dateIdx] : cells[0];
    const date = parseDate(rawDate);
    if (!date) { skipped++; continue; }

    // Description
    const description = cols.descIdx >= 0 ? cells[cols.descIdx] : cells[1] ?? "";
    if (!description) { skipped++; continue; }

    // Amount
    let amount = 0;
    if (cols.amountIdx >= 0) {
      amount = parseAmount(cells[cols.amountIdx]);
    } else if (cols.debitIdx >= 0 || cols.creditIdx >= 0) {
      const debit  = cols.debitIdx  >= 0 ? parseAmount(cells[cols.debitIdx])  : 0;
      const credit = cols.creditIdx >= 0 ? parseAmount(cells[cols.creditIdx]) : 0;
      amount = credit - debit; // positive = money in
    }

    if (amount === 0) { skipped++; continue; }

    const reference = cols.refIdx >= 0 ? cells[cols.refIdx] || undefined : undefined;
    const balance   = cols.balIdx >= 0 ? parseAmount(cells[cols.balIdx]) || undefined : undefined;

    rows.push({ date, description, amount, reference, balance });
  }

  return { rows, skipped, errors };
}
