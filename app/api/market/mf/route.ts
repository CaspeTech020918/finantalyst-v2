import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchMutualFunds, getMFNav } from "@/lib/market-data";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const code  = searchParams.get("code");

  try {
    if (code) {
      const detail = await getMFNav(Number(code));
      return NextResponse.json({ detail });
    }
    if (query) {
      const schemes = await searchMutualFunds(query);
      return NextResponse.json({ schemes });
    }
    return NextResponse.json({ error: "q or code required" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 502 });
  }
}
