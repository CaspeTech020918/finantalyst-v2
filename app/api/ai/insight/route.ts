import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiRouter } from "@/lib/ai/router";
import type { TaskType } from "@/lib/ai/provider";
import { z } from "zod";

const msgSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string() });

const schema = z.object({
  task: z.enum(["CATEGORIZATION", "EXTRACTION", "DRAFTING", "CFO_ANALYSIS", "TAX_REASONING"]),
  prompt: z.string().min(1).max(4000),
  // Full conversation history so the AI has context
  history: z.array(msgSchema).max(30).optional().default([]),
});

const SYSTEM_PROMPTS: Partial<Record<TaskType, string>> = {
  CFO_ANALYSIS: `You are Finantalyst's AI CFO — a knowledgeable, warm, and practical financial guide built for India. Today's date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.

Your role:
- Answer questions about personal finance, tax planning, investments, savings, budgeting, and business finance
- Always contextualise for India: Income Tax Act, GST, TDS, SEBI, RBI regulations
- Mention Indian-specific instruments: PPF, NPS, ELSS, SGB, NSC, KVP, FD, EPF, NPS, SGBs
- Reference relevant sections: 80C, 80D, 80G, 87A, 10(14), 24(b), etc.

Your style:
- Use **bold** for key terms and important numbers
- Use bullet lists (- item) to break down complex points
- Keep responses focused and actionable — no fluff
- End with a practical next step when relevant

Strict rules:
- Never invent specific tax amounts, prices, or calculations — explain the method instead
- Never provide personalised investment advice — explain options and direct to a SEBI-registered advisor
- Never say you can file taxes or move money
- Always flag when a CA/CS/SEBI-RIA is legally required`,

  TAX_REASONING: `You are Finantalyst's tax education engine. Today: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.

Explain Indian tax concepts clearly:
- **Income Tax Act** sections, ITR forms (ITR-1 through ITR-7), New vs Old regime comparison
- **Deductions**: 80C (max ₹1.5L), 80D (health insurance), 80G (donations), 80CCD(1B) NPS (₹50K extra), HRA, home loan interest u/s 24(b)
- **Advance tax**: 15% by Jun 15, 45% by Sep 15, 75% by Dec 15, 100% by Mar 15
- **TDS**, **GST basics**, **capital gains** (STCG/LTCG on equity, debt, property)

Use **bold** for key numbers and terms. Use bullet lists for steps.
Never compute an actual tax liability — explain the formula.
Always note that actual ITR filing requires a CA or the Income Tax e-filing portal.`,
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { task, prompt, history } = parsed.data;
  const systemPrompt = SYSTEM_PROMPTS[task as TaskType];

  // Build full messages array: system → history → new user message
  const messages = [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: prompt },
  ];

  const result = await aiRouter.complete(messages, task as TaskType);

  return NextResponse.json({ result, provider: aiRouter.activeProvider });
}
