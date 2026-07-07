import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIMessage, AIProvider, TaskType } from "../provider";

// Task → Gemini model mapping (use latest free models)
const TASK_MODEL_MAP: Record<TaskType, string> = {
  CATEGORIZATION:  "gemini-2.0-flash",
  EXTRACTION:      "gemini-2.0-flash",
  DRAFTING:        "gemini-2.0-flash",
  CFO_ANALYSIS:    "gemini-2.0-flash",
  TAX_REASONING:   "gemini-2.0-flash",
  DOCUMENT_PARSE:  "gemini-2.0-flash",
};

function mapModel(task: TaskType): string {
  return TASK_MODEL_MAP[task] ?? "gemini-2.0-flash";
}

function toGeminiHistory(
  messages: AIMessage[]
): { role: string; parts: { text: string }[] }[] {
  // Gemini: roles are "user" | "model"; no "system" role in history
  return messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

export class GeminiAdapter implements AIProvider {
  readonly name = "gemini";
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor(task: TaskType) {
    this.modelName = mapModel(task);
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? "");
  }

  async complete(messages: AIMessage[], _task: TaskType): Promise<string> {
    const systemInstruction = messages.find((m) => m.role === "system")?.content;
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      ...(systemInstruction ? { systemInstruction } : {}),
    });

    const history = toGeminiHistory(messages.slice(0, -1));
    const lastMessage = messages.at(-1);
    if (!lastMessage) throw new Error("No messages provided");

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  }

  async *stream(messages: AIMessage[], _task: TaskType): AsyncIterable<string> {
    const systemInstruction = messages.find((m) => m.role === "system")?.content;
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      ...(systemInstruction ? { systemInstruction } : {}),
    });

    const history = toGeminiHistory(messages.slice(0, -1));
    const lastMessage = messages.at(-1);
    if (!lastMessage) throw new Error("No messages provided");

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }
}
