import { inquirySchema, type Inquiry } from "./inquiry-schema";
import type { LimitResult } from "./rate-limit";
type Dependencies = {
  limit: (request: Request) => Promise<LimitResult>;
  deliver: (data: Inquiry) => Promise<void>;
  mode: string;
  canonicalOrigin?: string;
};
function json(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
const unavailable = () =>
  json(
    {
      message:
        "Inquiry delivery is currently unavailable. Nothing has been sent. Please try again later.",
    },
    503,
  );
export async function handleInquiry(
  request: Request,
  deps: Dependencies,
): Promise<Response> {
  // Disabled deployments reject before reading a body or contacting a provider.
  if (deps.mode !== "live" && deps.mode !== "preview") return unavailable();
  if (
    deps.mode === "live" &&
    (!deps.canonicalOrigin || !deps.canonicalOrigin.startsWith("https://"))
  )
    return unavailable();
  const origin = request.headers.get("origin");
  const expectedOrigin = deps.canonicalOrigin || new URL(request.url).origin;
  if (
    !origin ||
    origin !== expectedOrigin ||
    (deps.mode === "live" && !expectedOrigin.startsWith("https://"))
  )
    return json(
      {
        message:
          "This submission could not be verified. Please submit from the website.",
      },
      403,
    );
  if (
    request.headers.get("content-type")?.toLowerCase().split(";")[0].trim() !==
    "application/json"
  )
    return json({ message: "Unsupported submission format." }, 415);
  const MAX_BYTES = 24000;
  if (Number(request.headers.get("content-length")) > MAX_BYTES)
    return json({ message: "Your submission is too long." }, 413);
  try {
    const limited = await deps.limit(request);
    if (!limited.allowed)
      return json(
        { message: "Too many attempts. Please wait before trying again." },
        429,
        { "Retry-After": String(limited.retryAfter) },
      );
  } catch {
    return unavailable();
  }
  let raw: unknown;
  try {
    if (!request.body)
      return json({ message: "Please complete the inquiry form." }, 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) {
          await reader.cancel();
          return json({ message: "Your submission is too long." }, 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    raw = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return json(
      { message: "We couldn’t read your submission. Please try again." },
      400,
    );
  }
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues)
      if (issue.path[0]) fields[String(issue.path[0])] = issue.message;
    return json(
      { message: "Please check the highlighted fields.", fields },
      422,
    );
  }
  if (parsed.data.website)
    return json(
      { message: "This submission could not be verified. Please try again." },
      400,
    );
  if (deps.mode === "preview")
    return json({
      status: "preview",
      message:
        "Form validation passed. This is a preview: no inquiry was sent or saved.",
    });
  if (deps.mode !== "live") return unavailable();
  try {
    await deps.deliver(parsed.data);
  } catch {
    return json(
      {
        message:
          "We couldn’t confirm delivery. Please try again later; repeating the same inquiry will not create a second email within 24 hours.",
      },
      502,
    );
  }
  // A future private pipeline can consume a separately authorized, minimal event here.
  // No public record endpoint, CRM write, or persistent acquisition data is created.
  return json({
    status: "success",
    message:
      "Your inquiry has been submitted to Odirico Holdings. Thank you for starting the conversation.",
  });
}
