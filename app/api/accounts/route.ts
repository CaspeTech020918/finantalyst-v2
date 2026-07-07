import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["BANK_SAVINGS","BANK_CURRENT","CASH","CREDIT_CARD","BROKERAGE","MUTUAL_FUND","FD","PPF","NPS","REAL_ESTATE","SALARY","OTHER"]),
  branch: z.string().optional(),
  openingBal: z.number().default(0),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = await db.financialAccount.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { transactions: true } },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ accounts });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const account = await db.financialAccount.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json({ account }, { status: 201 });
}
