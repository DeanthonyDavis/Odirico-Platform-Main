export default function ContactPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Contact</p>
            <h1>Start with the path that matches what you need.</h1>
          </div>
          <p>
            The cleanest way to keep this simple is to route people by intent: using the platform,
            getting early access, or discussing partnerships around the ecosystem.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell contact-path-grid">
          <a className="contact-path-card" href="mailto:contact@odirico.com?subject=Odirico%20Platform%20Access">
            <p className="platform-module-kicker">Access</p>
            <h2>Need help getting started?</h2>
            <p>Use this for platform access questions, onboarding help, or account setup issues.</p>
          </a>

          <a className="contact-path-card" href="mailto:contact@odirico.com?subject=Odirico%20Beta%20Interest">
            <p className="platform-module-kicker">Beta</p>
            <h2>Want early access to new module work?</h2>
            <p>Use this for Ember, Sol, and Surge beta interest, roadmap feedback, and testing access.</p>
          </a>

          <a className="contact-path-card" href="mailto:contact@odirico.com?subject=Odirico%20Partnership">
            <p className="platform-module-kicker">Partnership</p>
            <h2>Have a partnership or platform conversation?</h2>
            <p>Use this for ecosystem partnerships, product conversations, or future distribution paths.</p>
          </a>
        </div>
      </section>
    </>
  );
}
