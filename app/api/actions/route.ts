import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  id:     z.string().min(1),
  status: z.enum(["APPROVED", "DISMISSED"]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const actions = await db.agentAction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ actions });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const { id, status } = parsed.data;

  const action = await db.agentAction.findUnique({ where: { id } });
  if (!action || action.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.agentAction.update({
    where: { id },
    data: {
      status,
      approvedAt:  status === "APPROVED"  ? new Date() : undefined,
      dismissedAt: status === "DISMISSED" ? new Date() : undefined,
    },
  });

  return NextResponse.json({ action: updated });
}
