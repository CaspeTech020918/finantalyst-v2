import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  mode: z.enum(["INDIVIDUAL", "FREELANCER", "BUSINESS", "STARTUP"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid mode" }, { status: 422 });

  await db.user.update({
    where: { id: session.user.id },
    data: { mode: parsed.data.mode },
  });

  return NextResponse.json({ ok: true });
}
