import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import crypto from "crypto";

const schema = z.object({ email: z.email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const { email } = parsed.data;

  // Silently succeed if user not found — prevents email enumeration
  const user = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ ok: true });

  // Invalidate any existing unused tokens for this user
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  // Derive origin from the incoming request — works on any environment
  const origin = new URL(req.url).origin;
  const resetUrl = `${origin}/reset-password/${token}`;

  return NextResponse.json({ ok: true, resetUrl, expiresInMinutes: 60 });
}
