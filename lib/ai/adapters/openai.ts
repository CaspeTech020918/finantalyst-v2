import OpenAI from "openai";
import type { AIMessage, AIProvider, TaskType } from "../provider";

// Model mapping: Anthropic task-model → OpenAI equivalent
const MODEL_MAP: Record<string, string> = {
  "claude-haiku-4-5-20251001": "gpt-4o-mini",
  "claude-sonnet-4-6": "gpt-4o",
  "claude-opus-4-8": "gpt-4o",
};

function mapModel(anthropicModel: string): string {
  return MODEL_MAP[anthropicModel] ?? "gpt-4o";
}

export class OpenAIAdapter implements AIProvider {
  readonly name = "openai";
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(anthropicModel: string) {
    this.model = mapModel(anthropicModel);
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async complete(messages: AIMessage[], _task: TaskType): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.choices[0]?.message.content;
    if (!text) throw new Error("OpenAI returned empty content");
    return text;
  }

  async *stream(messages: AIMessage[], _task: TaskType): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      stream: true,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
