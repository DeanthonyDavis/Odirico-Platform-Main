import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Odirico Platform",
  description:
    "General, AI, accessibility, and use disclaimers for Odirico Platform across Ember, Sol, and Surge.",
};

export default function DisclaimerPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Disclaimer</p>
            <h1>Important baseline limitations for platform guidance, accessibility, and reliance.</h1>
          </div>
          <div className="policy-stack">
            <p>
              Odirico is built to help with planning, organization, and execution, but it is still
              your responsibility to review and decide how to use the output.
            </p>
            <p>Effective date: April 18, 2026.</p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell policy-grid">
          <article className="policy-card">
            <h3>General information only</h3>
            <p>
              Content across Ember, Sol, and Surge is provided for general productivity,
              informational, and organizational purposes. It is not a substitute for independent
              review or professional judgment.
            </p>
          </article>

          <article className="policy-card">
            <h3>No professional advice</h3>
            <ul className="policy-list">
              <li>Odirico does not provide legal, tax, accounting, or financial advice.</li>
              <li>Odirico does not provide medical, therapeutic, or emergency guidance.</li>
              <li>
                Career-facing outputs such as resumes, cover letters, summaries, and application
                materials should be reviewed by you before submission.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>AI and automation review</h3>
            <ul className="policy-list">
              <li>Generated outputs may be incomplete, outdated, or imperfect.</li>
              <li>
                Before relying on a result, verify dates, numbers, credentials, deadlines, links,
                and final wording.
              </li>
              <li>
                You remain responsible for final decisions, submissions, communications, and
                actions taken from platform output.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Accessibility basics</h3>
            <ul className="policy-list">
              <li>Odirico aims to support keyboard access, readable structure, and responsive layouts.</li>
              <li>
                We try to use semantic markup, visible focus states, descriptive labels, and
                alternative text where appropriate.
              </li>
              <li>
                Accessibility work is ongoing, and if you encounter a barrier we want to hear about
                it so we can improve it.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Service availability and security</h3>
            <ul className="policy-list">
              <li>No online service can guarantee uninterrupted availability or perfect security.</li>
              <li>
                Odirico uses baseline safeguards and managed infrastructure, but users should keep
                their own credentials, devices, and backups secure as well.
              </li>
              <li>
                For platform-level security details, see the <Link href="/privacy">privacy policy</Link>.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Contact and accessibility feedback</h3>
            <p>
              To report an accessibility issue or ask about platform limitations, email{" "}
              <a href="mailto:contact@odirico.com">contact@odirico.com</a> or use the{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
