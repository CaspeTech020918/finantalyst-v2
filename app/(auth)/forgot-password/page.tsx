"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json() as { ok?: boolean; resetUrl?: string; error?: string };
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
    setResetUrl(data.resetUrl ?? null);
  }

  function copy() {
    if (!resetUrl) return;
    navigator.clipboard.writeText(resetUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-base)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-indigo)]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">AI Financial OS</p>
          <h1 className="text-hero text-[var(--color-text-primary)]">Finantalyst</h1>
        </div>

        <GlassCard variant="raised" padding="lg">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-5 transition-colors">
            <ArrowLeft size={13} /> Back to login
          </Link>

          {resetUrl ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-emerald-dim)] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-[var(--color-emerald)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">Reset link generated</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Valid for 60 minutes</p>
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber)]/25 mb-4">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  <span className="font-semibold text-[var(--color-amber)]">Email coming soon.</span> Until email delivery is configured, share this reset link directly with the user. Do not post it publicly.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-border)] mb-4">
                <p className="text-xs text-[var(--color-text-secondary)] flex-1 truncate font-mono">{resetUrl}</p>
                <button onClick={copy} className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-indigo)] transition-colors">
                  {copied ? <CheckCircle2 size={15} className="text-[var(--color-emerald)]" /> : <Copy size={15} />}
                </button>
              </div>

              <Button variant="primary" size="md" className="w-full" onClick={copy}>
                {copied ? "Copied!" : "Copy reset link"}
              </Button>

              <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
                <Link href="/login" className="text-[var(--color-indigo)] hover:underline">Return to login</Link>
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-subheading text-[var(--color-text-primary)] mb-1">Forgot password</h2>
              <p className="text-caption text-[var(--color-text-muted)] mb-6">Enter the email address associated with the account.</p>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={cn(
                        "w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all",
                        "focus:ring-1 focus:ring-[var(--color-indigo)] focus:border-[var(--color-indigo)] border-[var(--color-border-subtle)]"
                      )}
                    />
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-[var(--color-red)] px-1">{error}</motion.p>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating link…
                    </span>
                  ) : "Generate reset link"}
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
