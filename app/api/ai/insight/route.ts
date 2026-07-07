import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { aiRouter } from "@/lib/ai/router";
import type { TaskType } from "@/lib/ai/provider";
import { z } from "zod";

const schema = z.object({
  task: z.enum(["CATEGORIZATION", "EXTRACTION", "DRAFTING", "CFO_ANALYSIS", "TAX_REASONING"]),
  prompt: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { task, prompt } = parsed.data;

  const SYSTEM_PROMPTS: Partial<Record<TaskType, string>> = {
    CFO_ANALYSIS: `You are Finantalyst's AI CFO — a knowledgeable financial guide for Indian individuals, freelancers and businesses. Answer in plain English, be concise and practical. Focus on Indian tax laws (Income Tax Act, GST, TDS), Indian investment instruments (mutual funds, PPF, NPS, FDs, ELSS) and Indian financial regulations. Never invent specific numbers, prices or tax calculations — instead explain concepts and direct the user to verify with authoritative sources. Do not provide personalised investment advice. Always clarify when professional CA or advisor consultation is needed.`,
    TAX_REASONING: `You are Finantalyst's tax reasoning engine. Explain Indian tax concepts clearly — Income Tax Act sections, ITR forms, New vs Old regime, deductions under 80C/80D/80G/HRA, advance tax instalments, TDS, GST basics. Never compute an actual tax liability — explain the rules and formulas so the user can understand their situation. Always note that actual filing requires a licensed CA or authorised e-filing portal.`,
  };

  const systemPrompt = SYSTEM_PROMPTS[task as TaskType];
  const messages = systemPrompt
    ? [{ role: "system" as const, content: systemPrompt }, { role: "user" as const, content: prompt }]
    : [{ role: "user" as const, content: prompt }];

  const result = await aiRouter.complete(messages, task as TaskType);

  return NextResponse.json({ result, provider: aiRouter.activeProvider });
}
