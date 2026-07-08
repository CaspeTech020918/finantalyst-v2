"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Bot, Send, AlertTriangle, Sparkles, Trash2, Copy, CheckCircle2, RefreshCw } from "lucide-react";

const STARTER_QUESTIONS = [
  "What is the difference between New and Old tax regime for FY 2025-26?",
  "How much can I save under 80C, 80D and NPS this year?",
  "What are the advance tax due dates and how do I calculate them?",
  "My income is ₹15 lakhs. Which regime should I pick?",
  "Explain LTCG and STCG on mutual funds and stocks.",
  "What is the ITR filing deadline for FY 2025-26?",
];

interface Message { role: "user" | "assistant"; content: string; }

// Simple markdown → HTML renderer
function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="font-size:14px;font-weight:700;margin:14px 0 6px">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-size:15px;font-weight:700;margin:16px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-size:16px;font-weight:800;margin:16px 0 8px">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1</li>')
    .replace(/^• (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1</li>')
    // Wrap consecutive li elements in ul
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, m => `<ul style="padding-left:18px;margin:8px 0">${m}</ul>`)
    // Inline code
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-family:var(--font-mono,monospace);font-size:12px">$1</code>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

function AssistantBubble({ content, onCopy }: { content: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex justify-start group">
      <div className="flex items-start gap-2.5 max-w-[85%]">
        <div className="w-7 h-7 rounded-full bg-[var(--color-indigo-dim)] border border-[var(--color-indigo)]/30 flex items-center justify-center shrink-0 mt-1">
          <Bot size={13} className="text-[var(--color-indigo)]" />
        </div>
        <div className="relative">
          <div
            className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
          <button onClick={copy}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center">
            {copied ? <CheckCircle2 size={11} className="text-[var(--color-emerald)]" /> : <Copy size={11} className="text-[var(--color-text-muted)]" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CFOPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setInput("");
    const history = messages; // capture before state update
    const newMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "CFO_ANALYSIS",
          prompt: question,
          history: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json() as { result?: string; error?: string };
      if (!res.ok || !data.result) throw new Error(data.error ?? "No response");
      setMessages([...newMessages, { role: "assistant", content: data.result }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setMessages([...newMessages, { role: "assistant", content: `Sorry, I hit an error: ${msg} Please try again.` }]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() { setMessages([]); }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
      <PageHeader
        title="AI CFO"
        description="Ask your AI Chief Financial Officer anything. Tax planning, investment options, compliance — plain English, India-specific."
        icon={<Bot size={20} />}
      >
        {messages.length > 0 && (
          <button onClick={clearChat} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)]">
            <Trash2 size={12} /> Clear chat
          </button>
        )}
      </PageHeader>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-4 shrink-0">
        <AlertTriangle size={14} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          AI CFO provides financial education only — not personalised investment advice, not tax filing. Verify important decisions with a qualified CA or SEBI-registered advisor.
        </p>
      </div>

      {/* Chat area */}
      <GlassCard variant="raised" padding="none" className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-indigo-dim)] border border-[var(--color-indigo)]/20 flex items-center justify-center text-[var(--color-indigo)] mb-5">
                <Sparkles size={30} />
              </div>
              <h3 className="text-heading text-[var(--color-text-primary)] mb-2">Ask your AI CFO anything</h3>
              <p className="text-caption text-[var(--color-text-secondary)] mb-6 max-w-sm">
                Tax planning, regime comparison, investment options, compliance deadlines — all India-specific.
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
                {STARTER_QUESTIONS.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="text-left px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-indigo)]/50 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-indigo-dim)] transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm bg-[var(--color-indigo)] text-white text-sm leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <AssistantBubble key={i} content={m.content} onCopy={() => navigator.clipboard.writeText(m.content)} />
                )
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-indigo-dim)] border border-[var(--color-indigo)]/30 flex items-center justify-center shrink-0">
                      <RefreshCw size={12} className="text-[var(--color-indigo)] animate-spin" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-indigo)]"
                            style={{ animation: "bounce 1s infinite", animationDelay: `${i * 150}ms` }} />
                        ))}
                        <span className="text-xs text-[var(--color-text-muted)] ml-2">Thinking…</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--color-border)] shrink-0">
          <div className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask anything about taxes, investments, compliance…"
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
