// Seed initial TaxRuleConfig rows — FY 2025-26 both regimes
// Run: npx tsx prisma/seed.ts

import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // FY 2025-26 — New Regime
  await prisma.taxRuleConfig.upsert({
    where: { financialYear_regime: { financialYear: "2025-26", regime: "NEW" } },
    update: {},
    create: {
      financialYear: "2025-26",
      regime: "NEW",
      basicExemption: 300000,
      rebateLimit: 700000,
      slabs: [
        { upTo: 300000, rate: 0 },
        { upTo: 600000, rate: 5 },
        { upTo: 900000, rate: 10 },
        { upTo: 1200000, rate: 15 },
        { upTo: 1500000, rate: 20 },
        { upTo: null, rate: 30 },
      ],
      deductionLimits: {
        standardDeduction: 75000,
        npsEmployer: 0.14,
      },
      surchargeRules: [
        { aboveIncome: 5000000, rate: 10 },
        { aboveIncome: 10000000, rate: 15 },
        { aboveIncome: 20000000, rate: 25 },
        { aboveIncome: 50000000, rate: 37 },
      ],
    },
  });

  // FY 2025-26 — Old Regime
  await prisma.taxRuleConfig.upsert({
    where: { financialYear_regime: { financialYear: "2025-26", regime: "OLD" } },
    update: {},
    create: {
      financialYear: "2025-26",
      regime: "OLD",
      basicExemption: 250000,
      rebateLimit: 500000,
      slabs: [
        { upTo: 250000, rate: 0 },
        { upTo: 500000, rate: 5 },
        { upTo: 1000000, rate: 20 },
        { upTo: null, rate: 30 },
      ],
      deductionLimits: {
        section80C: 150000,
        section80D_self: 25000,
        section80D_parents: 25000,
        section80D_parents_senior: 50000,
        section80G: "varies",
        section80TTA: 10000,
        section80TTB: 50000,
        hra: "actual",
        standardDeduction: 50000,
        npsEmployee: 50000,
      },
      surchargeRules: [
        { aboveIncome: 5000000, rate: 10 },
        { aboveIncome: 10000000, rate: 15 },
        { aboveIncome: 20000000, rate: 25 },
        { aboveIncome: 50000000, rate: 37 },
      ],
    },
  });

  console.log("✓ TaxRuleConfig seeded for FY 2025-26 (OLD + NEW)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
