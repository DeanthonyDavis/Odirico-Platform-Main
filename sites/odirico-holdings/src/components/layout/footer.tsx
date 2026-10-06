import Link from "next/link";
import { navigation } from "@/config/navigation";
import { Wordmark } from "@/components/ui/wordmark";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div>
          <Link href="/" aria-label="Odirico — home">
            <Wordmark />
          </Link>
          <p>
            A private holding company.
            <br />
            Building for the long term.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="footer-domain">
          <a href="https://odirico.com">odirico.com</a>
          <span>
            Independent businesses.
            <br />
            An enduring perspective.
          </span>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>© {new Date().getFullYear()} Odirico</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
