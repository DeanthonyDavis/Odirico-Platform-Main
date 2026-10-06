import { handleInquiry } from "@/lib/handle-inquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { deliverInquiry } from "@/lib/delivery";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  let canonicalOrigin: string | undefined;
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL)
      canonicalOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
  } catch {
    return Response.json(
      {
        message:
          "Inquiry delivery is currently unavailable. Nothing has been sent.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return handleInquiry(request, {
    limit: checkRateLimit,
    deliver: deliverInquiry,
    mode: process.env.INQUIRY_DELIVERY || "disabled",
    canonicalOrigin,
  });
}
