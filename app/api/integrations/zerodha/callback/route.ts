import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

// Zerodha OAuth callback — called after user authorizes on Kite
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { searchParams } = new URL(req.url);
  const requestToken = searchParams.get("request_token");
  const status       = searchParams.get("status");

  if (status !== "success" || !requestToken) {
    const url = new URL("/dashboard/integrations", req.url);
    url.searchParams.set("error", "zerodha_cancelled");
    return NextResponse.redirect(url);
  }

  const apiKey    = process.env.ZERODHA_API_KEY    ?? "";
  const apiSecret = process.env.ZERODHA_API_SECRET ?? "";

  try {
    // Exchange request_token for access_token
    const checksum = crypto
      .createHash("sha256")
      .update(apiKey + requestToken + apiSecret)
      .digest("hex");

    const tokenRes = await fetch("https://api.kite.trade/session/token", {
      method: "POST",
      headers: { "X-Kite-Version": "3", "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ api_key: apiKey, request_token: requestToken, checksum }),
    });

    const tokenData = await tokenRes.json() as { status: string; data?: { access_token: string; user_id: string; user_name: string } };

    if (tokenData.status !== "success" || !tokenData.data) throw new Error("Token exchange failed");

    const { access_token, user_id } = tokenData.data;

    // Upsert the connection — access_token stored as-is (consider encrypting for higher security)
    await db.brokerageConnection.upsert({
      where: { userId_broker: { userId: session.user.id, broker: "ZERODHA" } },
      update: { accessToken: access_token, clientId: user_id, isActive: true, expiresAt: null, updatedAt: new Date() },
      create: { userId: session.user.id, broker: "ZERODHA", accessToken: access_token, clientId: user_id },
    });

    const url = new URL("/dashboard/integrations", req.url);
    url.searchParams.set("connected", "zerodha");
    return NextResponse.redirect(url);
  } catch {
    const url = new URL("/dashboard/integrations", req.url);
    url.searchParams.set("error", "zerodha_failed");
    return NextResponse.redirect(url);
  }
}
