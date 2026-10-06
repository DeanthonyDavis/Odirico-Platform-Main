import { createHmac } from "node:crypto";
export type LimitResult = { allowed: boolean; retryAfter: number };
const WINDOW = 15 * 60;
const memory = new Map<string, { count: number; expires: number }>();
export function localRateLimit(
  key: string,
  now = Date.now(),
  limit = 5,
): LimitResult {
  for (const [k, v] of memory) if (v.expires <= now) memory.delete(k);
  let entry = memory.get(key);
  if (!entry) {
    if (memory.size >= 10000) return { allowed: false, retryAfter: WINDOW };
    entry = { count: 0, expires: now + WINDOW * 1000 };
    memory.set(key, entry);
  }
  entry.count++;
  return {
    allowed: entry.count <= limit,
    retryAfter: Math.max(1, Math.ceil((entry.expires - now) / 1000)),
  };
}
export async function checkRateLimit(request: Request): Promise<LimitResult> {
  const live = process.env.INQUIRY_DELIVERY === "live";
  if (!live) return localRateLimit("local-preview", Date.now(), 30);
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const secret = process.env.RATE_LIMIT_SECRET;
  // Trust only the Vercel-injected address on the intended deployment platform.
  if (
    process.env.VERCEL !== "1" ||
    !url?.startsWith("https://") ||
    !token ||
    !secret ||
    secret.length < 32
  )
    throw new Error("RATE_LIMIT_UNAVAILABLE");
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (!ip) throw new Error("RATE_LIMIT_IDENTITY_UNAVAILABLE");
  const hash = createHmac("sha256", secret).update(ip).digest("hex");
  // Atomic fixed windows. Store only keyed hashes/counts, with automatic expiry.
  const script =
    "local a=redis.call('INCR',KEYS[1]); if a==1 then redis.call('EXPIRE',KEYS[1],900) end; local b=redis.call('INCR',KEYS[2]); if b==1 then redis.call('EXPIRE',KEYS[2],3600) end; local t=math.max(redis.call('TTL',KEYS[1]),redis.call('TTL',KEYS[2])); if a>5 or b>30 then return {0,t} end; return {1,t}";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      script,
      "2",
      `odirico:inquiry:${hash}`,
      "odirico:inquiry:global",
    ]),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("RATE_LIMIT_UNAVAILABLE");
  const result = await response.json();
  if (
    !Array.isArray(result.result) ||
    result.result.length !== 2 ||
    ![0, 1].includes(result.result[0]) ||
    !Number.isFinite(result.result[1]) ||
    result.result[1] <= 0
  )
    throw new Error("RATE_LIMIT_UNAVAILABLE");
  return {
    allowed: result.result[0] === 1,
    retryAfter: Math.max(1, result.result[1]),
  };
}
