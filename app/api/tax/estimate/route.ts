import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// ── FY 2025-26 Tax Calculation (Deterministic — not AI) ─────────
// Source: Income Tax Act as amended by Finance Act 2025
// [REGULATED] Actual ITR filing requires a licensed CA / authorised e-filing portal.

function newRegimeTax(grossIncome: number, isSalaried: boolean): number {
  const stdDed = isSalaried ? 75000 : 0;
  const taxable = Math.max(0, grossIncome - stdDed);

  // Slabs FY 2025-26 (new regime)
  const slabs = [
    { upto: 400000,  rate: 0 },
    { upto: 800000,  rate: 0.05 },
    { upto: 1200000, rate: 0.10 },
    { upto: 1600000, rate: 0.15 },
    { upto: 2000000, rate: 0.20 },
    { upto: 2400000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];

  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    if (taxable <= prev) break;
    tax += (Math.min(taxable, s.upto) - prev) * s.rate;
    prev = s.upto;
  }

  // Rebate 87A: if taxable income ≤ ₹12L → full rebate (zero tax)
  if (taxable <= 1200000) tax = 0;

  // Health & Education cess: 4%
  return Math.round(tax * 1.04);
}

function oldRegimeTax(grossIncome: number, isSalaried: boolean, deductionTotal: number): number {
  const stdDed = isSalaried ? 50000 : 0;
  const taxable = Math.max(0, grossIncome - stdDed - deductionTotal);

  // Slabs FY 2025-26 (old regime, age < 60)
  const slabs = [
    { upto: 250000,  rate: 0 },
    { upto: 500000,  rate: 0.05 },
    { upto: 1000000, rate: 0.20 },
    { upto: Infinity, rate: 0.30 },
  ];

  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    if (taxable <= prev) break;
    tax += (Math.min(taxable, s.upto) - prev) * s.rate;
    prev = s.upto;
  }

  // Rebate 87A: if taxable ≤ ₹5L, rebate up to ₹12,500
  if (taxable <= 500000) tax = Math.max(0, tax - 12500);

  // Cess: 4%
  return Math.round(tax * 1.04);
}

// Deduction limits (old regime only)
const DEDUCTION_CAPS: Record<string, number> = {
  "80C": 150000,
  "80D": 75000,      // 25K self + 50K parents
  "80CCD(1B)": 50000, // NPS extra
  "80G": Infinity,
  "HRA": Infinity,
  "24(b)": 200000,   // Home loan interest
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.taxProfile.findUnique({
    where: { userId: session.user.id },
    include: { incomeSources: true, deductions: true },
  });

  if (!profile) return NextResponse.json({ estimate: null });

  const FY = "2025-26";
  const sources = profile.incomeSources.filter(s => s.financialYear === FY);
  const deds = profile.deductions.filter(d => d.financialYear === FY);

  const grossIncome = sources.reduce((sum, s) => sum + Number(s.amount), 0);
  const isSalaried = sources.some(s => s.type === "SALARY");

  // Capped deductions for old regime
  let totalDeds = 0;
  const dedSummary: { section: string; claimed: number; cap: number; allowed: number }[] = [];
  const bySection: Record<string, number> = {};
  for (const d of deds) {
    bySection[d.section] = (bySection[d.section] ?? 0) + Number(d.amount);
  }
  for (const [section, claimed] of Object.entries(bySection)) {
    const cap = DEDUCTION_CAPS[section] ?? 0;
    const allowed = Math.min(claimed, cap);
    totalDeds += allowed;
    dedSummary.push({ section, claimed, cap, allowed });
  }

  const newTax = newRegimeTax(grossIncome, isSalaried);
  const oldTax = oldRegimeTax(grossIncome, isSalaried, totalDeds);
  const savings = oldTax - newTax; // positive → new regime saves money
  const recommended = savings >= 0 ? "NEW" : "OLD";

  // Advance tax schedule (if annual tax > ₹10,000)
  const advTax = newTax > 10000 ? [
    { date: "15 Jun 2025", pct: 15, amount: Math.round(newTax * 0.15), label: "1st instalment (15%)" },
    { date: "15 Sep 2025", pct: 45, amount: Math.round(newTax * 0.45), label: "Cumulative 45%" },
    { date: "15 Dec 2025", pct: 75, amount: Math.round(newTax * 0.75), label: "Cumulative 75%" },
    { date: "15 Mar 2026", pct: 100, amount: newTax, label: "Final instalment (100%)" },
  ] : [];

  return NextResponse.json({
    estimate: {
      grossIncome,
      isSalaried,
      newRegime: {
        stdDeduction: isSalaried ? 75000 : 0,
        taxableIncome: Math.max(0, grossIncome - (isSalaried ? 75000 : 0)),
        tax: newTax,
      },
      oldRegime: {
        stdDeduction: isSalaried ? 50000 : 0,
        totalDeductions: totalDeds,
        deductionSummary: dedSummary,
        taxableIncome: Math.max(0, grossIncome - (isSalaried ? 50000 : 0) - totalDeds),
        tax: oldTax,
      },
      recommended,
      savings: Math.abs(savings),
      advanceTax: advTax,
    },
  });
}
