import "server-only";

import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "anonymous";
}

export function enforceRateLimit(request: Request, scope: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const key = `${scope}:${getClientKey(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      { error: "Too many requests. Give your pup a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  current.count += 1;
  return null;
}

export function requestId() {
  return crypto.randomUUID();
}

export function safeApiError(message: string, id: string, status = 500) {
  return NextResponse.json({ error: message, requestId: id }, { status });
}

type ProviderError = { status?: number; code?: number | string; message?: string; headers?: Headers | Record<string, string> };

export function geminiRateLimitResponse(error: unknown) {
  const candidate = error as ProviderError | null;
  const message = candidate?.message ?? "";
  const isRateLimited = candidate?.status === 429 || candidate?.code === 429 || /429|resource_exhausted|rate limit|quota/i.test(message);
  if (!isRateLimited) return null;

  const rawHeader = candidate?.headers instanceof Headers
    ? candidate.headers.get("retry-after")
    : candidate?.headers?.["retry-after"];
  const messageDelay = message.match(/retry(?:Delay| after)?["':=\s]+(\d+)/i)?.[1];
  const retryAfter = Math.max(1, Number.parseInt(rawHeader ?? messageDelay ?? "30", 10) || 30);

  return NextResponse.json(
    { error: `The dog decoder is fetching a lot of sticks right now. Try again in about ${retryAfter} seconds.`, retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
