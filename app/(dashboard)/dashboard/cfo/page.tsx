"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Bot, Send, AlertTriangle, Sparkles } from "lucide-react";

const STARTER_QUESTIONS = [
  "What should I focus on financially this month?",
  "Am I saving enough for retirement?",
  "How can I reduce my tax liability this year?",
  "Explain the difference between New and Old tax regime for me.",
  "What is a good emergency fund target for my income level?",
];

interface Message { role: "user" | "assistant"; content: string; }

export default function CFOPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const question = text ?? input.trim();
    if (!question) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "CFO_ANALYSIS", prompt: question }),
      });
      const data = await res.json() as { result: string };
      setMessages([...newMessages, { role: "assistant", content: data.result }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <PageHeader
        title="AI CFO"
        description="Ask your AI Chief Financial Officer anything about your finances. Get plain-English explanations, estimates and actionable guidance."
        icon={<Bot size={20} />}
      />

      {/* Disclaimer */}
      <div className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-4">
        <AlertTriangle size={14} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          AI CFO provides general financial education only. It does not give personalised investment advice, file taxes, or move money. Always verify important decisions with a qualified professional.
        </p>
      </div>

      {/* Chat area */}
      <GlassCard variant="raised" padding="none" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-indigo-dim)] flex items-center justify-center text-[var(--color-indigo)] mb-4">
                <Sparkles size={28} />
              </div>
              <h3 className="text-heading text-[var(--color-text-primary)] mb-2">Ask your AI CFO anything</h3>
              <p className="text-caption text-[var(--color-text-secondary)] mb-6 max-w-md">
                Get plain-English answers about taxes, savings, investments and financial planning — tailored to India.
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-indigo)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--color-indigo)] text-white rounded-br-sm"
                  : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-sm"
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-indigo)] animate-bounce" style={{ animationDelay: `${i*150}ms` }} />)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask your AI CFO anything…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-indigo)] transition-colors"
            />
            <Button variant="primary" size="icon" onClick={() => send()} disabled={!input.trim() || loading}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
