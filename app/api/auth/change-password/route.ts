import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { isStrongPassword } from "@/lib/security";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!rateLimit(`change-pw:${session.user.id}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const { currentPassword, newPassword } = parsed.data;

  if (!isStrongPassword(newPassword)) {
    return NextResponse.json(
      { error: "New password must include uppercase, number, and special character." },
      { status: 422 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ error: "Account uses social login — cannot change password here." }, { status: 400 });
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });

  const hash = await bcrypt.hash(newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } });

  return NextResponse.json({ ok: true });
}
