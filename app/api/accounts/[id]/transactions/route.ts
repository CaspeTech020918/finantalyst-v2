import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const addSchema = z.object({
  date: z.string(),
  amount: z.number(),
  description: z.string().min(1),
  category: z.string().optional(),
  reference: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const account = await db.financialAccount.findUnique({ where: { id } });
  if (!account || account.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const transactions = await db.txn.findMany({
    where: { accountId: id },
    orderBy: { date: "desc" },
    take: 200,
  });

  return NextResponse.json({ transactions });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const account = await db.financialAccount.findUnique({ where: { id } });
  if (!account || account.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = addSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const txn = await db.txn.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      userId: session.user.id,
      accountId: id,
    },
  });

  return NextResponse.json({ txn }, { status: 201 });
}
