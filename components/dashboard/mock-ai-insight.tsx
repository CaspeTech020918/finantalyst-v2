"use client";

import { useEffect, useState } from "react";
import { Bot, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import type { TaskType } from "@/lib/ai/provider";

interface MockAIInsightProps {
  task: TaskType;
  title: string;
  prompt: string;
}

export function MockAIInsight({ task, title, prompt }: MockAIInsightProps) {
  const [text, setText] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>("mock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetch() {
    setLoading(true);
    setError(false);
    try {
      const res = await window.fetch("/api/ai/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, prompt }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { result: string; provider: string };
      setText(data.result);
      setProvider(data.provider);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlassCard variant="accent-indigo" padding="md" className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={15} className="text-[var(--color-indigo)]" />
        <h3 className="text-subheading text-[var(--color-text-secondary)] flex-1">
          {title}
        </h3>
        <Badge variant={provider === "mock" ? "neutral" : "indigo"} size="sm">
          {provider === "mock" ? "Mock AI" : provider}
        </Badge>
        <button
          onClick={fetch}
          disabled={loading}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-indigo)] transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-3 rounded bg-white/[0.06] animate-pulse"
                style={{ width: `${70 + (i % 3) * 10}%` }}
              />
            ))}
          </div>
        )}
        {!loading && error && (
          <p className="text-xs text-[var(--color-red)]">
            Failed to load insight. Check your API configuration.
          </p>
        )}
        {!loading && !error && text && (
          <p className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed line-clamp-[12]">
            {text}
          </p>
        )}
      </div>
    </GlassCard>
  );
}
