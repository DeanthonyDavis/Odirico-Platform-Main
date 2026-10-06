import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Website terms",
  "Information about the purpose and use of the Odirico corporate website.",
  "/terms",
);
export default function Terms() {
  return (
    <article className="wrap legal">
      <p className="eyebrow">Website information · October 5, 2026</p>
      <h1>WEBSITE TERMS.</h1>
      <h2>Purpose</h2>
      <p>
        This website introduces Odirico and its intended approach to building,
        acquiring, and supporting businesses. Portfolio development and other
        future plans describe intentions, not completed achievements or commitments.
      </p>
      <h2>Business information</h2>
      <p>
        Content is general information. It is not an investment solicitation,
        professional advice, an offer to acquire a business, or a promise of
        funding. Any transaction, services, or confidentiality obligations would
        require separate appropriate arrangements.
      </p>
      <h2>Using the website</h2>
      <p>
        Do not interfere with the website, attempt unauthorized access, or use it
        to distribute harmful or unlawful content. The public website does not
        provide access to internal company records or administrative applications.
      </p>
      <h2>Availability and links</h2>
      <p>
        Content and availability may change. A link to an external website does
        not make that website part of Odirico’s systems; its own notices and
        practices apply.
      </p>
      <h2>Inquiries</h2>
      <p>
        Online inquiries are currently unavailable. Read the{" "}
        <Link href="/privacy">website privacy notice</Link> for information
        about this version of the corporate website.
      </p>
    </article>
  );
}
