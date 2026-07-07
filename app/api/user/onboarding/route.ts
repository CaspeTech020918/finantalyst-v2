import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  mode: z.enum(["INDIVIDUAL", "FREELANCER", "BUSINESS", "STARTUP"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 422 });
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      mode: parsed.data.mode,
      onboardingDone: true,
    },
  });

  return NextResponse.json({ ok: true });
}
