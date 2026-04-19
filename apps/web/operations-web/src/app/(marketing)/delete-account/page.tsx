import Link from "next/link";

export const metadata = {
  title: "Delete Account | Odirico Platform",
  description:
    "Request deletion of your Odirico Platform account and associated data across Ember, Sol, and Surge.",
};

export default function DeleteAccountPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Delete Account</p>
            <h1>Request deletion of your Odirico account and associated platform data.</h1>
          </div>
          <div className="policy-stack">
            <p>
              This page is for requests to delete your Odirico Platform account and associated data
              across Ember, Sol, and Surge.
            </p>
            <p>
              If you want to proceed, use the request link below so the support thread starts with
              the right subject line.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell policy-grid">
          <article className="policy-card">
            <h3>Start a deletion request</h3>
            <p>
              Use the link below to send a deletion request to Odirico support:
            </p>
            <p>
              <a href="mailto:contact@odirico.com?subject=Odirico%20Account%20Deletion%20Request">
                Request account deletion by email
              </a>
            </p>
            <p>
              Please send the request from the email address connected to your account whenever
              possible so the request can be verified more quickly.
            </p>
          </article>

          <article className="policy-card">
            <h3>What to include</h3>
            <ul className="policy-list">
              <li>Your Odirico account email address.</li>
              <li>Your full name if it appears on the account.</li>
              <li>
                A short note confirming that you want your account and associated platform data
                deleted.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>What happens next</h3>
            <ul className="policy-list">
              <li>Odirico may ask for limited verification before processing the request.</li>
              <li>
                Some information may be retained where necessary for security, fraud prevention, or
                legal compliance.
              </li>
              <li>
                Additional details about data handling remain available in the{" "}
                <Link href="/privacy">privacy policy</Link>.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Need another support path?</h3>
            <p>
              If your issue is not a deletion request, use the general <Link href="/contact">contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
