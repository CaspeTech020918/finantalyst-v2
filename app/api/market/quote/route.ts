import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStockQuote, getIndianStockQuote } from "@/lib/market-data";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = new URL(req.url).searchParams;
  const symbol = params.get("symbol");
  const symbols = params.get("symbols"); // comma-separated batch

  if (!symbol && !symbols) return NextResponse.json({ error: "symbol or symbols required" }, { status: 400 });

  try {
    if (symbols) {
      const list = symbols.split(",").map(s => s.trim()).filter(Boolean);
      const results = await Promise.allSettled(list.map(s => getStockQuote(s)));
      const quotes = results.map((r, i) =>
        r.status === "fulfilled" ? r.value : { symbol: list[i], error: (r.reason as Error).message }
      );
      return NextResponse.json({ quotes });
    }

    const quote = await getStockQuote(symbol!);
    return NextResponse.json({ quote });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 502 });
  }
}
