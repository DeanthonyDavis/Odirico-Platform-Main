import { PageIntro, SectionLabel } from "@/components/sections/shared";
import { InquirySection } from "@/components/forms/inquiry-section";
import { TextLink } from "@/components/ui/link-button";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Acquisitions",
  "Conversations with owners and intermediaries about the next chapter of a business and long-term ownership.",
  "/acquisitions",
);
export const dynamic = "force-dynamic";
export default function Acquisitions() {
  return (
    <>
      <PageIntro
        label="Acquisitions"
        title={
          <>
            Considering
            <br />
            what comes next?
          </>
        }
      >
        <p>
          We welcome conversations with owners of durable businesses where
          long-term stewardship matters.
        </p>
      </PageIntro>
      <section className="wrap section-space editorial ruled">
        <SectionLabel>A thoughtful introduction</SectionLabel>
        <div className="editorial-body">
          <h2>
            Start with
            <br />
            the business.
          </h2>
          <p className="lead">
            For an owner, a transition is about more than a transaction. It is
            also about people, relationships, and what has been built over time.
          </p>
          <p>
            ŌDIRICO is interested in learning about businesses across
            industries, directly from owners or through brokers and other
            intermediaries. We consider each opportunity in context, without a
            fixed public checklist of industries or financial thresholds.
          </p>
          <TextLink href="#inquiry">Introduce your business</TextLink>
          <p className="note">
            An introduction does not guarantee an offer, financing, or a
            transaction. Any confidential exchange would require appropriate
            arrangements agreed separately. This page is not an investment
            solicitation.
          </p>
        </div>
      </section>
      <InquirySection
        kind="acquisition"
        title={
          <>
            A conversation
            <br />
            about the future.
          </>
        }
        description="A name, an email address, and a short introduction are enough to begin. Share other details only if you are ready to do so."
      />
    </>
  );
}
