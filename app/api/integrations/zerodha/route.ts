import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Zerodha Kite Connect OAuth initiation
// Requires: ZERODHA_API_KEY env var (register at developers.kite.trade)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.ZERODHA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Zerodha integration not configured. Add ZERODHA_API_KEY to environment variables." },
      { status: 503 }
    );
  }

  const loginUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}`;
  return NextResponse.redirect(loginUrl);
}
