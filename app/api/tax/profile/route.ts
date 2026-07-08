import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  pan: z.string().max(10).optional(),
  regime: z.enum(["OLD", "NEW"]).optional(),
  financialYear: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.taxProfile.findUnique({
    where: { userId: session.user.id },
    include: { incomeSources: true, deductions: true },
  });

  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const profile = await db.taxProfile.upsert({
    where: { userId: session.user.id },
    update: { ...parsed.data },
    create: { userId: session.user.id, ...parsed.data },
    include: { incomeSources: true, deductions: true },
  });

  return NextResponse.json({ profile });
}
