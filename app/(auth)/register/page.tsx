"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterForm) {
    setServerError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setServerError(body.error ?? "Registration failed. Please try again.");
      return;
    }

    // Auto sign-in and redirect to onboarding
    const { signIn } = await import("next-auth/react");
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/onboarding",
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
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
            AI Financial OS
          </p>
          <h1 className="text-hero text-[var(--color-text-primary)]">
            Finantalyst
          </h1>
        </div>

        <GlassCard variant="raised" padding="lg">
          <h2 className="text-subheading text-[var(--color-text-primary)] mb-1">
            Create your account
          </h2>
          <p className="text-caption text-[var(--color-text-muted)] mb-6">
            Get your AI CFO up and running in minutes
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                autoComplete="name"
                {...register("name")}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-120",
                  "focus:ring-1 focus:ring-[var(--color-indigo)] focus:border-[var(--color-indigo)]",
                  errors.name
                    ? "border-[var(--color-red)]"
                    : "border-[var(--color-border-subtle)]"
                )}
                placeholder="Priya Sharma"
              />
              {errors.name && (
                <p className="text-xs text-[var(--color-red)] mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register("email")}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-120",
                  "focus:ring-1 focus:ring-[var(--color-indigo)] focus:border-[var(--color-indigo)]",
                  errors.email
                    ? "border-[var(--color-red)]"
                    : "border-[var(--color-border-subtle)]"
                )}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-[var(--color-red)] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  className={cn(
                    "w-full px-3 py-2.5 pr-10 rounded-lg text-sm bg-white/[0.04] border text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-120",
                    "focus:ring-1 focus:ring-[var(--color-indigo)] focus:border-[var(--color-indigo)]",
                    errors.password
                      ? "border-[var(--color-red)]"
                      : "border-[var(--color-border-subtle)]"
                  )}
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[var(--color-red)] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-2 rounded-lg bg-[var(--color-red-dim)] border border-[var(--color-red)]/20 text-sm text-[var(--color-red)]"
              >
                {serverError}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={15} />
                  Get started free
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--color-text-muted)] mt-5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-indigo)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
