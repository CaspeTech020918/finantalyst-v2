import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const addSchema = z.object({
  type: z.string().min(1),
  label: z.string().max(100).optional(),
  amount: z.number().positive(),
  financialYear: z.string().default("2025-26"),
});

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

  const parsed = addSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const profile = await ensureProfile(session.user.id);
  const source = await db.incomeSource.create({
    data: { taxProfileId: profile.id, ...parsed.data },
  });

  return NextResponse.json({ source }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Verify ownership via taxProfile
  const source = await db.incomeSource.findUnique({
    where: { id },
    include: { taxProfile: { select: { userId: true } } },
  });
  if (!source || source.taxProfile.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.incomeSource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
