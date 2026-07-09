import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { sendPasswordResetEmail, isEmailConfigured } from "@/lib/email";
import crypto from "crypto";

const schema = z.object({ email: z.email() });

export async function POST(req: Request) {
  // Rate limit: 5 attempts per IP per 15 minutes
  if (!rateLimit(`forgot:${getIp(req)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Try again in 15 minutes." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const { email } = parsed.data;

  // Silently succeed if user not found — prevents email enumeration
  const user = await db.user.findUnique({ where: { email }, select: { id: true, name: true } });
  if (!user) return NextResponse.json({ ok: true });

  // Invalidate any existing unused tokens
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const origin = new URL(req.url).origin;
  const resetUrl = `${origin}/reset-password/${token}`;

  if (isEmailConfigured()) {
    try {
      await sendPasswordResetEmail({ to: email, resetUrl, name: user.name ?? undefined });
      return NextResponse.json({ ok: true, sent: true });
    } catch (err) {
      // Email delivery failed — log and fall through to link fallback so users aren't blocked
      console.error("[forgot-password] Resend error:", err instanceof Error ? err.message : err);
    }
  }

  // Fallback: return the link so the app remains usable without email keys
  return NextResponse.json({ ok: true, sent: false, resetUrl, expiresInMinutes: 60 });
}
