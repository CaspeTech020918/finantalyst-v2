// Mock AI adapter — always works, no API key needed.
// Returns realistic-looking placeholder responses by task type.
// Swap for real adapter by updating the router config.

import type { AIMessage, AIProvider, TaskType } from "../provider";

const MOCK_RESPONSES: Record<TaskType, (messages: AIMessage[]) => string> = {
  CATEGORIZATION: () =>
    JSON.stringify({ category: "SALARY", confidence: 0.94, reasoning: "[Mock] Categorized based on description pattern." }),

  EXTRACTION: () =>
    JSON.stringify({ amount: 50000, date: "2025-04-01", description: "[Mock] Extracted from document.", vendor: "Sample Corp" }),

  DRAFTING: (messages) => {
    const lastUser = messages.findLast((m) => m.role === "user")?.content ?? "";
    return `[Mock Draft — ${new Date().toLocaleDateString("en-IN")}]\n\nBased on your financial data, here is a drafted response.\n\nContext: ${lastUser.slice(0, 80)}...\n\nThis is a placeholder response from the Mock AI adapter. Provide an ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_AI_API_KEY in .env.local to switch to a real model.`;
  },

  CFO_ANALYSIS: () =>
    `[Mock CFO Analysis]\n\nYour current runway is approximately 8 months based on mock cash flow data. Key insight: operating expenses are trending 12% above plan. Recommended action: review headcount costs in Q3.\n\n⚠️ This is a mock response. Wire an LLM API key for real analysis.`,

  TAX_REASONING: () =>
    `[Mock Tax Reasoning]\n\nUnder the New Regime (FY 2025-26), estimated tax liability on ₹12,00,000 income: ₹1,17,000 + cess. Under Old Regime with standard deductions (₹80C: ₹1,50,000), estimated liability: ₹1,32,500.\n\n⚠️ These are mock figures from the Mock adapter. Wire a real LLM key for actual analysis.`,

  DOCUMENT_PARSE: () =>
    `[Mock Document Parse]\n\nDocument parsed successfully. Extracted 12 transactions totalling ₹45,230. ⚠️ Mock response — wire Gemini API key for real document parsing.`,
};

export class MockAIAdapter implements AIProvider {
  name = "mock";

  async complete(messages: AIMessage[], task: TaskType): Promise<string> {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    return MOCK_RESPONSES[task](messages);
  }

  async *stream(messages: AIMessage[], task: TaskType): AsyncIterable<string> {
    const response = await this.complete(messages, task);
    const words = response.split(" ");
    for (const word of words) {
      yield word + " ";
      await new Promise((r) => setTimeout(r, 20));
    }
  }
}
