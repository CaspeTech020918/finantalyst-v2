// Simple in-memory sliding-window rate limiter.
// Works within a single serverless instance lifetime — good enough for brute-force
// prevention on auth endpoints. For multi-instance prod, replace with @upstash/ratelimit.

interface Window { count: number; resetAt: number }
const store = new Map<string, Window>();

// Prune stale entries every 500 calls to avoid unbounded growth
let callsSinceClean = 0;
function maybePrune() {
  if (++callsSinceClean < 500) return;
  callsSinceClean = 0;
  const now = Date.now();
  for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key       Unique identifier — e.g. "login:1.2.3.4"
 * @param limit     Max requests per window
 * @param windowMs  Window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  maybePrune();
  const now = Date.now();
  const w = store.get(key);
  if (!w || w.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (w.count >= limit) return false;
  w.count++;
  return true;
}

/** Convenience: extract IP from Next.js Request headers (Vercel forwards x-forwarded-for) */
export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
