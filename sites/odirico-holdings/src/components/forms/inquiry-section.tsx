import { InquiryForm } from "./inquiry-form";
import { InquiryUnavailable } from "./inquiry-unavailable";
import { SectionLabel } from "@/components/sections/shared";
import type { InquiryKind } from "@/lib/inquiry-schema";
export function InquirySection({
  kind,
  title,
  description,
}: {
  kind: InquiryKind;
  title: React.ReactNode;
  description: string;
}) {
  const mode = process.env.INQUIRY_DELIVERY || "disabled";
  const accepting = mode === "live" || mode === "preview";
  return (
    <section id="inquiry" className="inquiry-section">
      <div className="wrap inquiry-grid">
        <div className="inquiry-aside">
          <SectionLabel>Start a conversation</SectionLabel>
          <h2>{title}</h2>
          {accepting && <p>{description}</p>}
        </div>
        {accepting ? <InquiryForm kind={kind} mode={mode} /> : <InquiryUnavailable />}
      </div>
    </section>
  );
}
