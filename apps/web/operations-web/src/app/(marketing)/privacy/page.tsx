import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Odirico Platform",
  description:
    "Privacy policy for Odirico Platform, including Ember, Sol, and Surge across web, mobile, and desktop.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Privacy Policy</p>
            <h1>How Odirico handles platform, device, and user data.</h1>
          </div>
          <div className="policy-stack">
            <p>
              This privacy policy applies to Odirico Platform, including Ember, Sol, and Surge
              across web, mobile, and desktop experiences.
            </p>
            <p>Effective date: April 18, 2026.</p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell policy-grid">
          <article className="policy-card">
            <h3>What we collect</h3>
            <p>
              We collect the information needed to operate the platform, secure accounts, and keep
              your work in sync across devices.
            </p>
            <ul className="policy-list">
              <li>Account details such as name, email address, and authentication identifiers.</li>
              <li>
                Content you create or upload, including schedules, notes, budgets, tasks, goals,
                application data, resumes, cover letters, and related files.
              </li>
              <li>
                Device, browser, and diagnostic information such as IP address, session data,
                crash details, and performance logs.
              </li>
              <li>Support messages and feedback you send to Odirico.</li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>How we use data</h3>
            <ul className="policy-list">
              <li>To create and manage your account and authenticate access.</li>
              <li>To power Ember, Sol, and Surge features and keep data synced.</li>
              <li>
                To generate user-requested outputs such as planning suggestions, summaries, and
                career documents.
              </li>
              <li>To detect abuse, secure the service, and diagnose bugs or outages.</li>
              <li>To communicate important product, security, and support updates.</li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Third-party services</h3>
            <p>
              Odirico relies on infrastructure and platform vendors to deliver the service. These
              providers process data only as needed to host, authenticate, store, or support the
              product.
            </p>
            <ul className="policy-list">
              <li>Supabase for authentication and application data storage.</li>
              <li>Vercel for web hosting and deployment infrastructure.</li>
              <li>Expo for mobile application tooling and delivery workflows.</li>
              <li>Tauri and operating-system distribution channels for desktop packaging.</li>
            </ul>
            <p>
              If you choose to connect supported third-party accounts or services in the future,
              Odirico will access that information only to provide the feature you requested.
            </p>
          </article>

          <article className="policy-card">
            <h3>Sharing and retention</h3>
            <ul className="policy-list">
              <li>We do not sell personal data.</li>
              <li>
                We share data with service providers only when necessary to operate the platform.
              </li>
              <li>
                We may disclose information when required by law, to enforce our terms, or to
                protect users and the service.
              </li>
              <li>
                We keep account data for as long as your account remains active or as needed to
                meet legal, security, and operational obligations.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Security and your choices</h3>
            <ul className="policy-list">
              <li>We use reasonable technical and organizational safeguards to protect data.</li>
              <li>We limit access to user information to authorized systems and personnel.</li>
              <li>
                You can request account support, data access, or deletion help by contacting
                Odirico.
              </li>
              <li>
                You should also protect your own account by using secure credentials and keeping
                devices updated.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Children&apos;s privacy</h3>
            <p>
              Odirico Platform is not directed to children under 13, and we do not knowingly
              collect personal information from children under 13. If you believe a child has
              provided personal information, contact us so we can review and remove it when
              appropriate.
            </p>
          </article>

          <article className="policy-card">
            <h3>Contact</h3>
            <p>
              For privacy questions, support, or deletion requests, email{" "}
              <a href="mailto:contact@odirico.com">contact@odirico.com</a> or use the{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
