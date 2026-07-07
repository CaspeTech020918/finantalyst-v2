import Anthropic from "@anthropic-ai/sdk";
import type { AIMessage, AIProvider, TaskType } from "../provider";

export class AnthropicAdapter implements AIProvider {
  readonly name = "anthropic";
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(model: string) {
    this.model = model;
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async complete(messages: AIMessage[], _task: TaskType): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: messages.map((m) => ({
        role: m.role === "system" ? "user" : m.role,
        content: m.content,
      })),
      system: messages.find((m) => m.role === "system")?.content,
    });

    const block = response.content[0];
    if (block?.type !== "text") throw new Error("Anthropic returned no text block");
    return block.text;
  }

  async *stream(messages: AIMessage[], _task: TaskType): AsyncIterable<string> {
    const stream = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      stream: true,
      messages: messages.map((m) => ({
        role: m.role === "system" ? "user" : m.role,
        content: m.content,
      })),
      system: messages.find((m) => m.role === "system")?.content,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }
}
