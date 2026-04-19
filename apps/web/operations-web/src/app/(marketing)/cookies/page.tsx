import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Odirico Platform",
  description:
    "Cookie policy for Odirico Platform, including essential cookies, local storage, and future consent controls.",
};

export default function CookiesPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Cookie Policy</p>
            <h1>How Odirico uses cookies and local storage across the platform.</h1>
          </div>
          <div className="policy-stack">
            <p>
              This page explains how Odirico handles essential browser storage for sign-in,
              security, and platform continuity.
            </p>
            <p>Effective date: April 18, 2026.</p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell policy-grid">
          <article className="policy-card">
            <h3>What cookies are</h3>
            <p>
              Cookies are small text files placed in your browser. Odirico may also use local
              storage to remember settings on your device. Both help the platform function
              consistently and securely.
            </p>
          </article>

          <article className="policy-card">
            <h3>What Odirico uses now</h3>
            <ul className="policy-list">
              <li>Essential sign-in and session continuity for authenticated areas of the product.</li>
              <li>Security-related storage used to protect accounts and reduce abuse.</li>
              <li>Local storage for basic device-side preferences such as cookie consent state.</li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>What is not enabled by default</h3>
            <ul className="policy-list">
              <li>Advertising cookies are not part of the current baseline setup.</li>
              <li>
                If optional analytics, marketing tools, or payment-related browser storage are
                introduced later, Odirico will update this page and present appropriate controls
                before enabling them.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>How consent works</h3>
            <ul className="policy-list">
              <li>A cookie banner appears so you can acknowledge essential storage usage.</li>
              <li>
                Your choice is saved locally on your device so the notice does not reappear on
                every visit.
              </li>
              <li>
                You can also clear browser storage or block cookies in your browser settings, but
                essential platform features may stop working correctly if you do.
              </li>
            </ul>
          </article>

          <article className="policy-card">
            <h3>Third-party infrastructure</h3>
            <p>
              Hosting, authentication, and application infrastructure providers may set or rely on
              strictly necessary cookies when you sign in or use protected features. For more
              information about data handling, see the <Link href="/privacy">privacy policy</Link>.
            </p>
          </article>

          <article className="policy-card">
            <h3>Questions</h3>
            <p>
              If you have questions about cookies or storage on Odirico, email{" "}
              <a href="mailto:contact@odirico.com">contact@odirico.com</a> or use the{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
