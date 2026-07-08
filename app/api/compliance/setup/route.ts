import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const setupSchema = z.object({
  entityType: z.enum(["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"]),
  isGstRegistered: z.boolean().default(false),
  hasTds: z.boolean().default(false),
  financialYear: z.string().default("2025-26"),
});

// ── FY 2025-26 Compliance Events (Deterministic — not AI) ────────
// Source: Income Tax Act, GST Act, TDS provisions
// [REGULATED] Actual filing must be done via incometax.gov.in / GST portal / authorised ERI

interface EventTemplate {
  type: string;
  label: string;
  dueDate: string; // ISO date
  entityTypes: string[];
  requiresGst?: boolean;
  requiresTds?: boolean;
}

const EVENTS: EventTemplate[] = [
  // ── Income Tax ──────────────────────────────────────────────────
  {
    type: "ADVANCE_TAX",
    label: "Advance Tax — 1st instalment (15%)",
    dueDate: "2025-06-15",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
  },
  {
    type: "ADVANCE_TAX",
    label: "Advance Tax — 2nd instalment (45% cumulative)",
    dueDate: "2025-09-15",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
  },
  {
    type: "ADVANCE_TAX",
    label: "Advance Tax — 3rd instalment (75% cumulative)",
    dueDate: "2025-12-15",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
  },
  {
    type: "ADVANCE_TAX",
    label: "Advance Tax — Final instalment (100%)",
    dueDate: "2026-03-15",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
  },
  {
    type: "ITR_FILING",
    label: "ITR Filing deadline (non-audit)",
    dueDate: "2025-07-31",
    entityTypes: ["INDIVIDUAL", "FREELANCER"],
  },
  {
    type: "ITR_FILING",
    label: "ITR Filing deadline (audit cases / LLP / company)",
    dueDate: "2025-10-31",
    entityTypes: ["BUSINESS", "LLP"],
  },
  {
    type: "TAX_AUDIT",
    label: "Tax Audit Report (Form 3CB / 3CD) due",
    dueDate: "2025-09-30",
    entityTypes: ["BUSINESS", "LLP"],
  },

  // ── GST ─────────────────────────────────────────────────────────
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — April 2025",
    dueDate: "2025-05-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — April 2025",
    dueDate: "2025-05-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — May 2025",
    dueDate: "2025-06-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — May 2025",
    dueDate: "2025-06-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Jun 2025",
    dueDate: "2025-07-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Jun 2025",
    dueDate: "2025-07-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Jul 2025",
    dueDate: "2025-08-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Jul 2025",
    dueDate: "2025-08-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Aug 2025",
    dueDate: "2025-09-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Aug 2025",
    dueDate: "2025-09-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Sep 2025",
    dueDate: "2025-10-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Sep 2025",
    dueDate: "2025-10-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Oct 2025",
    dueDate: "2025-11-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Oct 2025",
    dueDate: "2025-11-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Nov 2025",
    dueDate: "2025-12-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Nov 2025",
    dueDate: "2025-12-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Dec 2025",
    dueDate: "2026-01-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Dec 2025",
    dueDate: "2026-01-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Jan 2026",
    dueDate: "2026-02-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Jan 2026",
    dueDate: "2026-02-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-1 filing — Feb 2026",
    dueDate: "2026-03-11",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_RETURN",
    label: "GSTR-3B filing — Feb 2026",
    dueDate: "2026-03-20",
    entityTypes: ["INDIVIDUAL", "FREELANCER", "BUSINESS", "LLP"],
    requiresGst: true,
  },
  {
    type: "GST_ANNUAL",
    label: "GSTR-9 Annual Return (FY 2024-25)",
    dueDate: "2025-12-31",
    entityTypes: ["BUSINESS", "LLP"],
    requiresGst: true,
  },

  // ── TDS ─────────────────────────────────────────────────────────
  {
    type: "TDS_PAYMENT",
    label: "TDS payment — Q1 FY 2025-26 (Apr–Jun 2025)",
    dueDate: "2025-07-07",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_RETURN",
    label: "TDS Return (Form 26Q) — Q1 FY 2025-26",
    dueDate: "2025-07-31",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_PAYMENT",
    label: "TDS payment — Q2 FY 2025-26 (Jul–Sep 2025)",
    dueDate: "2025-10-07",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_RETURN",
    label: "TDS Return (Form 26Q) — Q2 FY 2025-26",
    dueDate: "2025-10-31",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_PAYMENT",
    label: "TDS payment — Q3 FY 2025-26 (Oct–Dec 2025)",
    dueDate: "2026-01-07",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_RETURN",
    label: "TDS Return (Form 26Q) — Q3 FY 2025-26",
    dueDate: "2026-01-31",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_PAYMENT",
    label: "TDS payment — Q4 FY 2025-26 (Jan–Mar 2026)",
    dueDate: "2026-04-07",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },
  {
    type: "TDS_RETURN",
    label: "TDS Return (Form 26Q) — Q4 FY 2025-26",
    dueDate: "2026-05-31",
    entityTypes: ["BUSINESS", "LLP", "FREELANCER"],
    requiresTds: true,
  },

  // ── ROC / LLP annual filings ─────────────────────────────────
  {
    type: "ROC_ANNUAL",
    label: "LLP Form 11 (Annual Return) — FY 2024-25",
    dueDate: "2025-05-30",
    entityTypes: ["LLP"],
  },
  {
    type: "ROC_ANNUAL",
    label: "LLP Form 8 (Statement of Account) — FY 2024-25",
    dueDate: "2025-10-30",
    entityTypes: ["LLP"],
  },
];

async function ensureProfile(userId: string) {
  return db.taxProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = setupSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { entityType, isGstRegistered, hasTds, financialYear } = parsed.data;

  const profile = await ensureProfile(session.user.id);

  // Delete existing events for this FY before re-generating
  await db.complianceEvent.deleteMany({
    where: { taxProfileId: profile.id },
  });

  // Filter applicable events
  const applicable = EVENTS.filter((e) => {
    if (!e.entityTypes.includes(entityType)) return false;
    if (e.requiresGst && !isGstRegistered) return false;
    if (e.requiresTds && !hasTds) return false;
    return true;
  });

  const created = await db.complianceEvent.createMany({
    data: applicable.map((e) => ({
      taxProfileId: profile.id,
      type: e.type,
      label: e.label,
      dueDate: new Date(e.dueDate),
      status: "PENDING",
    })),
  });

  return NextResponse.json({ count: created.count, financialYear }, { status: 201 });
}
