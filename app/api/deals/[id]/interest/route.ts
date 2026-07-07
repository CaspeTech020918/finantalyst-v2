import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
  message: z.string().max(500).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deal = await db.dealListing.findUnique({ where: { id } });
  if (!deal || deal.status !== "OPEN")
    return NextResponse.json({ error: "Deal not found or not open" }, { status: 404 });

  if (deal.userId === session.user.id)
    return NextResponse.json({ error: "Cannot invest in your own deal" }, { status: 400 });

  if (deal.minInvestment) {
    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

    if (body.data.amount < deal.minInvestment)
      return NextResponse.json({ error: `Minimum investment is ₹${deal.minInvestment}` }, { status: 400 });

    const interest = await db.investmentInterest.upsert({
      where: { dealId_investorId: { dealId: id, investorId: session.user.id } },
      update: { amount: body.data.amount, message: body.data.message },
      create: {
        dealId: id,
        investorId: session.user.id,
        amount: body.data.amount,
        message: body.data.message,
      },
    });

    return NextResponse.json({ interest }, { status: 201 });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
