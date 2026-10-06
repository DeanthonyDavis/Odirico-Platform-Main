import { PageIntro, SectionLabel } from "@/components/sections/shared";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { InquiryUnavailable } from "@/components/forms/inquiry-unavailable";
import { TextLink } from "@/components/ui/link-button";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Contact",
  "Get in touch with Odirico. General inquiries and introductions from business owners and intermediaries.",
  "/contact",
);
export const dynamic = "force-dynamic";
export default function Contact() {
  const mode = process.env.INQUIRY_DELIVERY || "disabled";
  const accepting = mode === "live" || mode === "preview";
  return (
    <>
      <PageIntro
        label="Contact"
        title={
          <>
            An introduction
            <br />
            is a place to start.
          </>
        }
      >
        <p>
          General inquiries, potential relationships, and introductions from
          business owners will each have a place here as ŌDIRICO develops.
        </p>
      </PageIntro>
      <section className="wrap contact-layout">
        <aside className="contact-aside">
          <SectionLabel>General inquiries</SectionLabel>
          <p>Our online inquiry channel is being established.</p>
          <div className="contact-acquisition">
            <h2>A business to discuss?</h2>
            <p>
              Learn about our approach to conversations with owners and intermediaries.
            </p>
            <TextLink href="/acquisitions#inquiry">
              Acquisition inquiries
            </TextLink>
          </div>
        </aside>
        <div id="contact-form" className="contact-form-panel">
          {accepting ? <InquiryForm kind="contact" mode={mode} /> : <InquiryUnavailable />}
        </div>
      </section>
    </>
  );
}
