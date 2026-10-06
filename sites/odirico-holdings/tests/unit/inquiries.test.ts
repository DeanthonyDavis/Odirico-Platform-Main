import { describe, it, expect, vi, afterEach } from "vitest";
import { handleInquiry } from "../../src/lib/handle-inquiry";
import {
  emptyInquiry,
  inquirySchema,
  type Inquiry,
} from "../../src/lib/inquiry-schema";
import { checkRateLimit, localRateLimit } from "../../src/lib/rate-limit";
import { getPublishedCompanies, portfolio } from "../../src/config/portfolio";
const valid = (): Inquiry => ({
  ...emptyInquiry("contact"),
  fullName: "Test Sender",
  email: "sender@example.invalid",
  message: "Local test inquiry only.",
  consent: true,
});
const dependencies = (mode = "live") => ({
  mode,
  canonicalOrigin: "https://odirico.example",
  limit: vi.fn(async () => ({ allowed: true, retryAfter: 900 })),
  deliver: vi.fn(async () => {}),
});
const request = (
  data: unknown = valid(),
  headers: Record<string, string> = {},
) =>
  new Request("https://odirico.example/api/inquiries", {
    method: "POST",
    headers: {
      origin: "https://odirico.example",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("public inquiry protection", () => {
  it("rejects disabled inquiries before reading data or contacting providers", async () => {
    const d = dependencies("disabled");
    const r = request();
    expect((await handleInquiry(r, d)).status).toBe(503);
    expect(r.bodyUsed).toBe(false);
    expect(d.limit).not.toHaveBeenCalled();
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("delivers validated contact data through an injected fake mailer", async () => {
    const d = dependencies();
    const r = await handleInquiry(request(), d);
    expect(r.status).toBe(200);
    expect(d.deliver).toHaveBeenCalledOnce();
    expect((await r.json()).status).toBe("success");
  });
  it("never invokes delivery in disabled or preview mode", async () => {
    for (const mode of ["disabled", "preview"]) {
      const d = dependencies(mode);
      const r = await handleInquiry(request(), d);
      expect(r.status).toBe(mode === "disabled" ? 503 : 200);
      expect(d.deliver).not.toHaveBeenCalled();
      expect(r.headers.get("cache-control")).toBe("no-store");
    }
  });
  it("rejects cross-origin requests before accessing delivery or limits", async () => {
    const d = dependencies();
    expect(
      (
        await handleInquiry(
          request(valid(), { origin: "https://evil.example" }),
          d,
        )
      ).status,
    ).toBe(403);
    expect(d.limit).not.toHaveBeenCalled();
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("rejects missing origin and live delivery over HTTP", async () => {
    const d = dependencies();
    const r = request();
    r.headers.delete("origin");
    expect((await handleInquiry(r, d)).status).toBe(403);
    expect(
      (
        await handleInquiry(
          request(valid(), { origin: "http://localhost:3000" }),
          { ...d, canonicalOrigin: "http://localhost:3000" },
        )
      ).status,
    ).toBe(503);
  });
  it("rejects malformed JSON and non-JSON bodies", async () => {
    const d = dependencies();
    expect(
      (
        await handleInquiry(
          new Request("https://odirico.example/api/inquiries", {
            method: "POST",
            headers: {
              origin: "https://odirico.example",
              "content-type": "application/json",
            },
            body: "{",
          }),
          d,
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await handleInquiry(
          request(valid(), { "content-type": "text/plain" }),
          d,
        )
      ).status,
    ).toBe(415);
  });
  it("limits actual streamed bytes even without a content-length header", async () => {
    const d = dependencies();
    expect(
      (
        await handleInquiry(
          request({ ...valid(), message: "a".repeat(25000) }),
          d,
        )
      ).status,
    ).toBe(413);
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("validates server-side and rejects unknown fields", async () => {
    for (const data of [
      { ...valid(), email: "bad" },
      { ...valid(), consent: false },
      { ...valid(), fullName: "A\nB" },
      { ...valid(), admin: true },
    ]) {
      const d = dependencies();
      expect((await handleInquiry(request(data), d)).status).toBe(422);
      expect(d.deliver).not.toHaveBeenCalled();
    }
  });
  it("blocks honeypot submissions without email", async () => {
    const d = dependencies();
    expect(
      (
        await handleInquiry(
          request({ ...valid(), website: "https://spam.example" }),
          d,
        )
      ).status,
    ).toBe(400);
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("returns Retry-After when throttled", async () => {
    const d = dependencies();
    d.limit.mockResolvedValue({ allowed: false, retryAfter: 42 });
    const r = await handleInquiry(request(), d);
    expect(r.status).toBe(429);
    expect(r.headers.get("retry-after")).toBe("42");
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("fails closed on rate service failure without leaking errors", async () => {
    const d = dependencies();
    d.limit.mockRejectedValue(new Error("secret-service-value"));
    const r = await handleInquiry(request(), d);
    expect(r.status).toBe(503);
    expect(await r.text()).not.toContain("secret-service-value");
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("does not claim successful delivery after email-provider failure", async () => {
    const d = dependencies();
    d.deliver.mockRejectedValue(new Error("secret-token"));
    const r = await handleInquiry(request(), d);
    expect(r.status).toBe(502);
    expect(await r.text()).not.toContain("secret-token");
  });
  it("accepts a minimal acquisition introduction and validates optional business details", () => {
    const a = { ...valid(), kind: "acquisition" };
    expect(inquirySchema.safeParse(a).success).toBe(true);
    expect(inquirySchema.safeParse({ ...a, message: "" }).success).toBe(false);
    expect(
      inquirySchema.safeParse({ ...a, companyWebsite: "javascript:alert(1)" })
        .success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({ ...a, companyWebsite: "https://example.com" })
        .success,
    ).toBe(true);
    const complete = {
      ...a,
      companyName: "Test business",
      relationship: "Owner",
      industry: "Services",
      location: "Test location",
      reasonForSale: "Succession",
      employees: "12",
      yearsOperating: "8",
    };
    expect(inquirySchema.safeParse(complete).success).toBe(true);
    expect(
      inquirySchema.safeParse({ ...complete, employees: "-1" }).success,
    ).toBe(false);
  });
  it("requires an organization for partnerships", () => {
    expect(
      inquirySchema.safeParse({ ...valid(), kind: "partnership" }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({
        ...valid(),
        kind: "partnership",
        companyName: "Test organization",
      }).success,
    ).toBe(true);
  });
  it("enforces a local rate window and resets after expiry", () => {
    const key = "unit-" + Math.random();
    for (let i = 0; i < 5; i++)
      expect(localRateLimit(key, 1000).allowed).toBe(true);
    expect(localRateLimit(key, 1001).allowed).toBe(false);
    expect(localRateLimit(key, 901001).allowed).toBe(true);
  });
  it("requires distributed production safeguards in live mode", async () => {
    vi.stubEnv("INQUIRY_DELIVERY", "live");
    vi.stubEnv("VERCEL", "");
    await expect(checkRateLimit(request())).rejects.toThrow(
      "RATE_LIMIT_UNAVAILABLE",
    );
  });
});
describe("live configuration", () => {
  it("rejects live delivery without an explicitly configured origin", async () => {
    const d = { ...dependencies(), canonicalOrigin: undefined };
    expect((await handleInquiry(request(), d)).status).toBe(503);
    expect(d.limit).not.toHaveBeenCalled();
    expect(d.deliver).not.toHaveBeenCalled();
  });
  it("requires the exact JSON media type", async () => {
    expect(
      (
        await handleInquiry(
          request(valid(), { "content-type": "application/jsonp" }),
          dependencies(),
        )
      ).status,
    ).toBe(415);
  });
  it("fails closed when the distributed limiter returns invalid expiry", async () => {
    vi.stubEnv("INQUIRY_DELIVERY", "live");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.invalid");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "unit-test-only");
    vi.stubEnv(
      "RATE_LIMIT_SECRET",
      "unit-test-only-secret-with-at-least-32-characters",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ result: [1, -1] })),
    );
    const r = request();
    r.headers.set("x-vercel-forwarded-for", "192.0.2.1");
    await expect(checkRateLimit(r)).rejects.toThrow("RATE_LIMIT_UNAVAILABLE");
  });
});
describe("portfolio publication", () => {
  it("does not publish Odirico Solutions before confirmation", () => {
    expect(portfolio.some((c) => c.slug === "odirico-solutions")).toBe(true);
    expect(getPublishedCompanies()).toEqual([]);
  });
});
