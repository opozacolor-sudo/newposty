const windows = new Map<string, { count: number; resetAt: number }>();

function prune(now: number) {
  if (windows.size < 500) return;
  for (const [key, row] of windows) {
    if (now > row.resetAt) windows.delete(key);
  }
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  prune(now);
  const row = windows.get(key);
  if (!row || now > row.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1 };
  }
  if (row.count >= limit) {
    return { ok: false as const, remaining: 0, retryAfterSec: Math.max(1, Math.ceil((row.resetAt - now) / 1000)) };
  }
  row.count += 1;
  return { ok: true as const, remaining: limit - row.count };
}

export function tooMany(retryAfterSec: number) {
  return Response.json(
    { error: "TOO_MANY_REQUESTS" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}
