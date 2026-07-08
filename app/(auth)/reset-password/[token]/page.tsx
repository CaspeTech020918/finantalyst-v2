"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token, password }),
    });
    const data = await res.json() as { ok?: boolean; error?: string };
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Failed to reset password"); return; }
    setDone(true);
    setTimeout(() => router.push("/login"), 3000);
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
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-emerald-dim)] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-[var(--color-emerald)]" />
              </div>
              <h2 className="text-subheading text-[var(--color-text-primary)] mb-2">Password reset!</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-5">Your password has been updated. Redirecting to login…</p>
              <Link href="/login">
                <Button variant="primary" size="md">Go to login</Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-5 transition-colors">
                <ArrowLeft size={13} /> Back to login
              </Link>

              <h2 className="text-subheading text-[var(--color-text-primary)] mb-1">Set new password</h2>
              <p className="text-caption text-[var(--color-text-muted)] mb-6">Choose a strong password — at least 8 characters.</p>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">New password</label>
                  <div className="relative">
                    <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all focus:ring-1 focus:ring-[var(--color-indigo)] focus:border-[var(--color-indigo)]"
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]" tabIndex={-1}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Confirm password</label>
                  <input
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className={cn(
                      "w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all focus:ring-1",
                      mismatch
                        ? "border-[var(--color-red)] focus:ring-[var(--color-red)]"
                        : "border-[var(--color-border-subtle)] focus:ring-[var(--color-indigo)] focus:border-[var(--color-indigo)]"
                    )}
                  />
                  {mismatch && <p className="text-xs text-[var(--color-red)] mt-1">Passwords do not match</p>}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-3 py-2 rounded-lg bg-[var(--color-red-dim)] border border-[var(--color-red)]/20 text-sm text-[var(--color-red)]">
                    {error}
                  </motion.div>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full mt-2"
                  disabled={loading || mismatch}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting…
                    </span>
                  ) : "Reset password"}
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
