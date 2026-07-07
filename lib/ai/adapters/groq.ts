import type { AIMessage, AIProvider, TaskType } from "../provider";

const GROQ_MODELS: Record<TaskType, string> = {
  CATEGORIZATION:  "llama-3.1-8b-instant",
  EXTRACTION:      "llama-3.1-8b-instant",
  DRAFTING:        "llama-3.3-70b-versatile",
  CFO_ANALYSIS:    "llama-3.3-70b-versatile",
  TAX_REASONING:   "llama-3.3-70b-versatile",
  DOCUMENT_PARSE:  "llama-3.3-70b-versatile",
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  };
}

export class GroqAdapter implements AIProvider {
  readonly name = "groq";

  async complete(messages: AIMessage[], task: TaskType): Promise<string> {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model: GROQ_MODELS[task],
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq ${res.status}: ${await res.text()}`);
    }

    const data = await res.json() as { choices: { message: { content: string } }[] };
    return data.choices[0]?.message?.content ?? "";
  }

  async *stream(messages: AIMessage[], task: TaskType): AsyncIterable<string> {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model: GROQ_MODELS[task],
        messages,
        max_tokens: 2048,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq ${res.status}: ${await res.text()}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const chunk = JSON.parse(payload) as { choices: { delta: { content?: string } }[] };
          const text = chunk.choices[0]?.delta?.content;
          if (text) yield text;
        } catch { /* ignore malformed chunks */ }
      }
    }
  }
}
