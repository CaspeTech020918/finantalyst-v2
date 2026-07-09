import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { sendWelcomeEmail, isEmailConfigured } from "@/lib/email";
import { isStrongPassword } from "@/lib/security";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  // Rate limit: 10 registrations per IP per hour
  if (!rateLimit(`register:${getIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many registration attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, password } = parsed.data;

  if (!isStrongPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters and include an uppercase letter, a number, and a special character." },
      { status: 422 }
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { name, email, passwordHash },
    select: { id: true, email: true, name: true },
  });

  // Fire-and-forget welcome email
  if (isEmailConfigured()) {
    sendWelcomeEmail({ to: email, name }).catch(() => {});
  }

  return NextResponse.json({ user }, { status: 201 });
}
