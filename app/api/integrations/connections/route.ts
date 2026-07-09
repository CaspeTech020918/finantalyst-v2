import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connections = await db.brokerageConnection.findMany({
    where: { userId: session.user.id, isActive: true },
    select: { broker: true, clientId: true, connectedAt: true, isActive: true },
  });

  return NextResponse.json({ connections });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const broker = searchParams.get("broker");
  if (!broker) return NextResponse.json({ error: "Missing broker" }, { status: 400 });

  await db.brokerageConnection.updateMany({
    where: { userId: session.user.id, broker },
    data: { isActive: false, accessToken: null, refreshToken: null },
  });

  return NextResponse.json({ ok: true });
}
