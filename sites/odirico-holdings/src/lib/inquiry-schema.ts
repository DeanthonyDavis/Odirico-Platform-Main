import { z } from "zod";
export const inquiryKinds = ["contact", "acquisition", "partnership"] as const;
export type InquiryKind = (typeof inquiryKinds)[number];
export const categories = [
  "General inquiries",
  "Business acquisitions",
  "Strategic partnerships",
  "Other inquiries",
] as const;
export const revenueRanges = [
  "Under $500,000",
  "$500,000–$1 million",
  "$1–$5 million",
  "$5–$10 million",
  "$10–$25 million",
  "$25 million or more",
  "Prefer to discuss",
] as const;
const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (s) => !/[\r\n\x00-\x08]/.test(s),
      "Please use a single line of text.",
    );
export const inquirySchema = z
  .object({
    kind: z.enum(inquiryKinds),
    fullName: line(100).pipe(z.string().min(2, "Please enter your full name.")),
    email: line(254).pipe(z.email("Please enter a valid email address.")),
    phone: line(40).refine(
      (s) => !s || /^[+\d\s().-]{7,40}$/.test(s),
      "Please enter a valid telephone number.",
    ),
    category: z.enum(categories),
    companyName: line(180),
    companyWebsite: line(500)
      .refine((value) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          return (
            ["https:", "http:"].includes(url.protocol) &&
            !url.username &&
            !url.password
          );
        } catch {
          return false;
        }
      }, "Enter a full website address beginning with https:// or http://.")
      .optional(),
    relationship: line(120),
    industry: line(160),
    location: line(180),
    yearsOperating: line(4).refine(
      (s) => !s || (/^\d{1,3}$/.test(s) && Number(s) <= 300),
      "Enter a whole number from 0 to 300.",
    ),
    revenueRange: z.enum(["", ...revenueRanges]),
    employees: line(8).refine(
      (s) => !s || /^\d{1,7}$/.test(s),
      "Enter a whole number.",
    ),
    reasonForSale: z.string().trim().max(2000),
    message: z
      .string()
      .trim()
      .max(4000, "Please keep your message under 4,000 characters."),
    consent: z
      .boolean()
      .refine((v) => v, "Please acknowledge the privacy notice."),
    website: z.string().max(200),
  })
  .strict()
  .superRefine((data, ctx) => {
    const requireField = (key: keyof typeof data, label: string) => {
      if (!data[key])
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `Please enter ${label}.`,
        });
    };
    requireField("message", "a brief message");
    if (data.kind === "partnership")
      requireField("companyName", "your organization name");
  });
export type Inquiry = z.infer<typeof inquirySchema>;
export function emptyInquiry(kind: InquiryKind): Inquiry {
  return {
    kind,
    fullName: "",
    email: "",
    phone: "",
    category:
      kind === "acquisition"
        ? "Business acquisitions"
        : kind === "partnership"
          ? "Strategic partnerships"
          : "General inquiries",
    companyName: "",
    companyWebsite: "",
    relationship: "",
    industry: "",
    location: "",
    yearsOperating: "",
    revenueRange: "",
    employees: "",
    reasonForSale: "",
    message: "",
    consent: false,
    website: "",
  };
}
