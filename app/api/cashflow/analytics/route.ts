import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId"); // optional — null = all accounts

  const where = {
    userId: session.user.id,
    ...(accountId ? { accountId } : {}),
  };

  // Last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [allTxns, recentTxns, accounts] = await Promise.all([
    db.txn.findMany({ where, select: { amount: true, date: true, category: true } }),
    db.txn.findMany({ where: { ...where, date: { gte: since } }, select: { amount: true, date: true } }),
    db.financialAccount.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { transactions: true } } },
    }),
  ]);

  // Totals
  const totalIn  = allTxns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = allTxns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  // This month vs last month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonth = allTxns.filter((t) => new Date(t.date) >= thisMonthStart);
  const lastMonth = allTxns.filter((t) => {
    const d = new Date(t.date);
    return d >= lastMonthStart && d < thisMonthStart;
  });

  const sumIn  = (arr: { amount: number }[]) => arr.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const sumOut = (arr: { amount: number }[]) => arr.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  // Daily chart: last 30 days
  const dailyMap: Record<string, { credits: number; debits: number }> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    dailyMap[fmtDate(d)] = { credits: 0, debits: 0 };
  }
  for (const t of recentTxns) {
    const key = fmtDate(new Date(t.date));
    if (dailyMap[key]) {
      if (t.amount > 0) dailyMap[key].credits += t.amount;
      else dailyMap[key].debits += Math.abs(t.amount);
    }
  }
  const daily = Object.entries(dailyMap).map(([date, v]) => ({
    date: date.slice(5), // MM-DD
    credits: Math.round(v.credits),
    debits: Math.round(v.debits),
    net: Math.round(v.credits - v.debits),
  }));

  // Category breakdown (top 8)
  const catMap: Record<string, number> = {};
  for (const t of allTxns) {
    if (t.amount < 0) {
      const cat = t.category ?? "Uncategorised";
      catMap[cat] = (catMap[cat] ?? 0) + Math.abs(t.amount);
    }
  }
  const categories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value: Math.round(value) }));

  // Per-account summary
  const accountSummary = accounts.map((acc: { id: string; name: string; type: string; branch: string | null; _count: { transactions: number } }) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    branch: acc.branch,
    txnCount: acc._count.transactions,
  }));

  return NextResponse.json({
    totalIn:  Math.round(totalIn),
    totalOut: Math.round(totalOut),
    net:      Math.round(totalIn - totalOut),
    thisMonth: { in: Math.round(sumIn(thisMonth)), out: Math.round(sumOut(thisMonth)) },
    lastMonth: { in: Math.round(sumIn(lastMonth)), out: Math.round(sumOut(lastMonth)) },
    daily,
    categories,
    accountSummary,
    txnCount: allTxns.length,
  });
}
