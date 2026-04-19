import Link from "next/link";

export default function NotFound() {
  return (
    <main className="landing-shell">
      <section className="landing-panel">
        <p className="eyebrow">404</p>
        <h1>That page does not exist.</h1>
        <p className="muted">Use the platform home to get back to Ember, Sol, and Surge.</p>
        <Link className="primary-button" href="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}
