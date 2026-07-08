import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  companyName:  z.string().min(1).max(100).optional(),
  tagline:      z.string().min(1).max(200).optional(),
  description:  z.string().min(10).optional(),
  sector:       z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  minInvestment:z.number().positive().optional(),
  equityPct:    z.number().positive().max(100).optional(),
  preMoneyVal:  z.number().positive().optional(),
  status:       z.enum(["DRAFT", "OPEN", "CLOSED", "FUNDED"]).optional(),
});

// GET /api/deals/[id] — returns deal with stats for the owner
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deal = await db.dealListing.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { interests: true } },
      interests: {
        select: { investorId: true, amount: true, message: true, wantsContact: true, createdAt: true,
          investor: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only the deal owner can see the full interest list
  const isOwner = deal.userId === session.user.id;
  const contactCount = deal.interests.filter(i => i.wantsContact).length;

  return NextResponse.json({
    deal: {
      ...deal,
      isOwner,
      contactCount,
      interests: isOwner ? deal.interests : undefined,
    },
  });
}

// PATCH /api/deals/[id] — owner updates their deal
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deal = await db.dealListing.findUnique({ where: { id }, select: { userId: true } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const updated = await db.dealListing.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ deal: updated });
}

// DELETE /api/deals/[id] — owner deletes their deal
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deal = await db.dealListing.findUnique({ where: { id }, select: { userId: true } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (deal.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.dealListing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
