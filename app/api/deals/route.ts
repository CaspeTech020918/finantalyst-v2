import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  companyName:  z.string().min(1).max(100),
  tagline:      z.string().min(1).max(200),
  description:  z.string().min(10),
  sector:       z.string().min(1),
  targetAmount: z.number().positive(),
  minInvestment:z.number().positive().default(1000),
  equityPct:    z.number().positive().max(100),
  preMoneyVal:  z.number().positive(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deals = await db.dealListing.findMany({
    where: { status: { in: ["OPEN", "FUNDED"] } },
    include: {
      user: { select: { name: true } },
      _count: { select: { interests: true } },
      interests: {
        where: { investorId: session.user.id },
        select: { amount: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const dealIds = deals.map((d: { id: string }) => d.id);

  // Raised amount per deal
  const raised = await db.investmentInterest.groupBy({
    by: ["dealId"],
    where: { dealId: { in: dealIds }, status: "PENDING" },
    _sum: { amount: true },
  });
  const raisedMap: Record<string, number> = {};
  for (const r of raised) raisedMap[r.dealId] = r._sum.amount ?? 0;

  // Contact request count per deal
  const contacts = await db.investmentInterest.groupBy({
    by: ["dealId"],
    where: { dealId: { in: dealIds }, wantsContact: true },
    _count: true,
  });
  const contactMap: Record<string, number> = {};
  for (const c of contacts) contactMap[c.dealId] = c._count;

  type DealRow = typeof deals[number];
  return NextResponse.json({
    deals: deals.map((d: DealRow) => ({
      ...d,
      raised: raisedMap[d.id] ?? 0,
      contactCount: contactMap[d.id] ?? 0,
      isOwner: d.userId === session.user.id,
      myInterest: d.interests[0] ?? null,
      interests: undefined,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const deal = await db.dealListing.create({
    data: { ...parsed.data, userId: session.user.id, status: "OPEN" },
  });

  return NextResponse.json({ deal }, { status: 201 });
}
