import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// POST /api/deals/[id]/view — fire-and-forget view counter increment (non-owners only)
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await params;

  // Don't count the deal owner viewing their own listing
  const deal = await db.dealListing.findUnique({ where: { id }, select: { userId: true } });
  if (!deal || deal.userId === session.user.id) return NextResponse.json({ ok: false });

  await db.dealListing.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}
