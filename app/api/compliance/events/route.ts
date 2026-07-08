import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "DONE", "SKIPPED"]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.taxProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) return NextResponse.json({ events: [] });

  const events = await db.complianceEvent.findMany({
    where: { taxProfileId: profile.id },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json({ events });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { id, status } = parsed.data;

  // Verify ownership
  const event = await db.complianceEvent.findUnique({
    where: { id },
    include: { taxProfile: { select: { userId: true } } },
  });
  if (!event || event.taxProfile.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.complianceEvent.update({
    where: { id },
    data: {
      status,
      filedAt: status === "DONE" ? new Date() : null,
    },
  });

  return NextResponse.json({ event: updated });
}
