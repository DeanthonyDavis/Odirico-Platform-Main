import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Odirico Platform",
  description:
    "Terms and conditions for using Odirico Platform across Ember, Sol, and Surge on web, mobile, and desktop.",
};

export default function TermsPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Terms &amp; Conditions</p>
            <h1>The baseline rules for using Odirico Platform and its connected apps.</h1>
          </div>
          <div className="policy-stack">
            <p>
              These terms apply to Odirico Platform, including Ember, Sol, and Surge across web,
              mobile, and desktop experiences.
            </p>
            <p>Effective date: April 18, 2026.</p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell policy-grid">
          <article className="policy-card">
            <h3>Acceptance and eligibility</h3>
            <ul className="policy-list">
              <li>By accessing or using Odirico, you agree to these terms and related policies.</li>
              <li>You must provide accurate account information and keep it reasonably current.</li>
              <li>
                If you use Odirico on behalf of an organization, you represent that you have
                authority to bind that organization.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Accounts and security</h3>
            <ul className="policy-list">
              <li>You are responsible for maintaining the confidentiality of your login details.</li>
              <li>
                You should notify Odirico promptly if you believe your account has been accessed
                without authorization.
              </li>
              <li>
                You are responsible for activity that occurs through your account unless the access
                resulted from our failure to maintain reasonable safeguards.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Acceptable use</h3>
            <ul className="policy-list">
              <li>Do not misuse the service, interfere with security, or disrupt other users.</li>
              <li>
                Do not upload malware, unlawful content, or material that infringes another
                party&apos;s rights.
              </li>
              <li>
                Do not attempt to scrape, reverse engineer, or bypass controls outside permitted
                product behavior.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>User content and generated outputs</h3>
            <ul className="policy-list">
              <li>You keep ownership of the content and files you submit to Odirico.</li>
              <li>
                You grant Odirico a limited right to host, process, display, and transmit that
                content only to operate the service you requested.
              </li>
              <li>
                AI-assisted outputs, planning suggestions, summaries, resumes, and cover letters
                should be reviewed by you before use, submission, or reliance.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Billing and subscriptions</h3>
            <ul className="policy-list">
              <li>Some features may require a paid plan now or in the future.</li>
              <li>
                If billing is enabled, pricing, renewal terms, taxes, and refund terms will be
                shown at checkout or in the applicable commercial agreement.
              </li>
              <li>Failure to pay applicable charges may result in limited or suspended access.</li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Availability and changes</h3>
            <ul className="policy-list">
              <li>
                Odirico may update, improve, pause, or remove features, especially beta or
                experimental workflows.
              </li>
              <li>
                We may revise these terms from time to time, and continued use after updates means
                the revised terms apply.
              </li>
              <li>
                We do not promise uninterrupted availability, error-free operation, or fit for
                every workflow.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Suspension and termination</h3>
            <ul className="policy-list">
              <li>You may stop using the platform at any time.</li>
              <li>
                Odirico may suspend or terminate access for security, abuse, legal compliance, or
                material breaches of these terms.
              </li>
              <li>
                Data handling after account closure remains subject to the <Link href="/privacy">privacy policy</Link>.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Contact</h3>
            <p>
              For questions about these terms, email <a href="mailto:contact@odirico.com">contact@odirico.com</a> or use the{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
