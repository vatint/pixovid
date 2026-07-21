/**
 * Lightweight sliding-window rate limiter (in-process).
 * Good enough for a single backend instance in Phase 0; swap for Redis later.
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/** Returns true if the request is allowed; false if over the limit. */
export function allowRequest(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }
  bucket.hits.push(now);
  return { allowed: true, remaining: limit - bucket.hits.length, retryAfterSec: 0 };
}

/** Client IP from Express (respects first X-Forwarded-For hop when behind a proxy). */
export function clientIp(req: { ip?: string; headers: Record<string, unknown>; socket?: { remoteAddress?: string } }): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0]!.trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

// Periodic cleanup so the map does not grow without bound.
setInterval(() => {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000;
  for (const [k, b] of buckets) {
    b.hits = b.hits.filter((t) => now - t < maxAge);
    if (b.hits.length === 0) buckets.delete(k);
  }
}, 10 * 60 * 1000).unref?.();
