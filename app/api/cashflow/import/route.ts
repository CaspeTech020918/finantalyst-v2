import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { parseCSV } from "@/lib/csv-parser";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const accountId = form.get("accountId") as string | null;

  if (!file || !accountId) return NextResponse.json({ error: "file and accountId required" }, { status: 400 });

  // Verify account belongs to this user
  const account = await db.financialAccount.findUnique({ where: { id: accountId } });
  if (!account || account.userId !== userId)
    return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const text = await file.text();
  const { rows, skipped, errors } = parseCSV(text);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid rows found", errors, skipped }, { status: 422 });
  }

  // Batch insert
  await db.txn.createMany({
    data: rows.map((r) => ({
      userId,
      accountId,
      date: r.date,
      amount: r.amount,
      description: r.description,
      reference: r.reference ?? null,
      source: `csv:${file.name}`,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ imported: rows.length, skipped, errors });
}
