import { createHash } from "node:crypto";
import { Resend } from "resend";
import type { Inquiry } from "./inquiry-schema";
export async function deliverInquiry(data: Inquiry): Promise<void> {
  const key = process.env.RESEND_API_KEY,
    from = process.env.INQUIRY_FROM,
    to = process.env.INQUIRY_TO;
  if (!key || !from || !to || process.env.INQUIRY_DELIVERY !== "live")
    throw new Error("DELIVERY_UNAVAILABLE");
  const labels: Partial<Record<keyof Inquiry, string>> = {
    fullName: "Full name",
    email: "Email",
    phone: "Telephone",
    category: "Inquiry category",
    companyName: "Company / organization",
    companyWebsite: "Company website",
    relationship: "Relationship to business",
    industry: "Industry",
    location: "Location",
    yearsOperating: "Years operating",
    revenueRange: "Approximate annual revenue (USD)",
    employees: "Number of employees",
    reasonForSale: "Reason for contact",
    message: "Message / additional comments",
  };
  const text = Object.entries(labels)
    .filter(([key]) => data[key as keyof Inquiry])
    .map(([key, label]) => `${label}:\n${data[key as keyof Inquiry]}`)
    .join("\n\n");
  const idempotencyKey = `inquiry/${createHash("sha256").update(JSON.stringify(data)).digest("hex")}`;
  const result = await new Resend(key).emails.send(
    {
      from,
      to,
      replyTo: data.email,
      subject: `Odirico website: ${data.kind} inquiry`,
      text,
    },
    { idempotencyKey },
  );
  if (result.error || !result.data?.id) throw new Error("DELIVERY_FAILED");
}
