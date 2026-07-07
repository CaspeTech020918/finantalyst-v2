import type { AIMessage, AIProvider, AIProviderRouter, TaskType } from "./provider";
import { TASK_ROUTING } from "./provider";
import { MockAIAdapter } from "./adapters/mock";

type ProviderName = "anthropic" | "openai" | "gemini" | "groq" | "mock";

function hasKey(envVar: string): boolean {
  const val = process.env[envVar];
  return typeof val === "string" && val.trim().length > 0;
}

function availableSet(): Set<ProviderName> {
  const s = new Set<ProviderName>();
  if (hasKey("ANTHROPIC_API_KEY")) s.add("anthropic");
  if (hasKey("OPENAI_API_KEY"))    s.add("openai");
  if (hasKey("GOOGLE_AI_API_KEY")) s.add("gemini");
  if (hasKey("GROQ_API_KEY"))      s.add("groq");
  s.add("mock");
  return s;
}

// Returns providers for a task in preferred order, filtered to those with keys
function resolveProviders(task: TaskType, available: Set<ProviderName>): ProviderName[] {
  const preferred = TASK_ROUTING[task].preferredProviders as ProviderName[];
  const ordered = preferred.filter(p => available.has(p));
  if (!ordered.includes("mock")) ordered.push("mock");
  return ordered;
}

async function buildAdapter(name: ProviderName, task: TaskType): Promise<AIProvider> {
  switch (name) {
    case "anthropic": {
      const { AnthropicAdapter } = await import("./adapters/anthropic");
      return new AnthropicAdapter(TASK_ROUTING[task].model);
    }
    case "openai": {
      const { OpenAIAdapter } = await import("./adapters/openai");
      return new OpenAIAdapter(TASK_ROUTING[task].model);
    }
    case "gemini": {
      const { GeminiAdapter } = await import("./adapters/gemini");
      return new GeminiAdapter(task);
    }
    case "groq": {
      const { GroqAdapter } = await import("./adapters/groq");
      return new GroqAdapter();
    }
    default:
      return new MockAIAdapter();
  }
}

class FinantalystAIRouter implements AIProviderRouter {
  private readonly available: Set<ProviderName>;

  constructor() {
    this.available = availableSet();
    const active = [...this.available].filter(p => p !== "mock");
    console.log(`[AIRouter] Active providers: ${active.join(", ") || "none (mock only)"}`);
  }

  route(task: TaskType): AIProvider {
    return new MockAIAdapter();
  }

  async complete(messages: AIMessage[], task: TaskType): Promise<string> {
    const providers = resolveProviders(task, this.available);
    const errors: string[] = [];

    for (const name of providers) {
      try {
        const adapter = await buildAdapter(name, task);
        const result = await adapter.complete(messages, task);
        if (name !== "mock") console.log(`[AIRouter] ${task} served by ${name}`);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${name}: ${msg}`);
        console.warn(`[AIRouter] ${name} failed for ${task}: ${msg}`);
      }
    }

    throw new Error(`All providers failed for task ${task}. Errors: ${errors.join(" | ")}`);
  }

  async *stream(messages: AIMessage[], task: TaskType): AsyncIterable<string> {
    const providers = resolveProviders(task, this.available);

    for (const name of providers) {
      try {
        const adapter = await buildAdapter(name, task);
        yield* adapter.stream(messages, task);
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[AIRouter] ${name} stream failed for ${task}: ${msg} — trying next`);
      }
    }

    throw new Error(`All providers failed streaming for task ${task}`);
  }

  get activeProviders(): string[] {
    return [...this.available].filter(p => p !== "mock");
  }

  // Legacy compat
  get activeProvider(): string {
    return this.activeProviders[0] ?? "mock";
  }

  get providerList(): ProviderName[] {
    return [...this.available];
  }
}

const globalForRouter = globalThis as unknown as { aiRouter: FinantalystAIRouter };

export const aiRouter: FinantalystAIRouter =
  globalForRouter.aiRouter ?? new FinantalystAIRouter();

if (process.env.NODE_ENV !== "production") {
  globalForRouter.aiRouter = aiRouter;
}
