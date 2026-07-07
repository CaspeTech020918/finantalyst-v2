// AIProvider router — all LLM calls go through here.
// Changing provider = config change, not a rewrite.

export type TaskType =
  | "CATEGORIZATION"   // fast + cheap — Groq LLaMA 8B
  | "EXTRACTION"       // fast + cheap — Groq LLaMA 8B
  | "DRAFTING"         // quality writing — GPT-4o
  | "CFO_ANALYSIS"     // deep reasoning — Claude Opus
  | "TAX_REASONING"    // deep reasoning — Claude Opus
  | "DOCUMENT_PARSE";  // long context — Gemini 1.5 Pro

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProvider {
  complete(messages: AIMessage[], task: TaskType): Promise<string>;
  stream(messages: AIMessage[], task: TaskType): AsyncIterable<string>;
  name: string;
}

export interface AIProviderRouter {
  route(task: TaskType): AIProvider;
  complete(messages: AIMessage[], task: TaskType): Promise<string>;
}

// Per-task preferred provider order.
// Router tries providers left-to-right, falls back on error.
export const TASK_ROUTING: Record<TaskType, { preferredProviders: string[]; model: string }> = {
  CATEGORIZATION:  { preferredProviders: ["groq", "anthropic", "openai", "gemini"], model: "llama-3.1-8b-instant" },
  EXTRACTION:      { preferredProviders: ["groq", "anthropic", "openai", "gemini"], model: "llama-3.1-8b-instant" },
  DRAFTING:        { preferredProviders: ["openai", "anthropic", "groq", "gemini"], model: "gpt-4o" },
  CFO_ANALYSIS:    { preferredProviders: ["anthropic", "openai", "groq", "gemini"], model: "claude-opus-4-8" },
  TAX_REASONING:   { preferredProviders: ["anthropic", "openai", "groq", "gemini"], model: "claude-opus-4-8" },
  DOCUMENT_PARSE:  { preferredProviders: ["gemini", "anthropic", "openai", "groq"], model: "gemini-1.5-pro" },
};
