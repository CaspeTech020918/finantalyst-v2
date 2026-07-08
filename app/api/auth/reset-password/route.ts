import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { token, password } = parsed.data;

  const record = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!record) return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  if (record.usedAt) return NextResponse.json({ error: "This reset link has already been used" }, { status: 400 });
  if (record.expiresAt < new Date()) return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
