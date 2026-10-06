import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Website privacy",
  "Information about the current Odirico corporate website and its handling of visitor information.",
  "/privacy",
);
export default function Privacy() {
  return (
    <article className="wrap legal">
      <p className="eyebrow">Website information · October 5, 2026</p>
      <h1>WEBSITE PRIVACY.</h1>
      <p>
        This notice describes the current Odirico corporate website. It does not
        describe the former consumer applications or independently operated companies.
      </p>
      <h2>Inquiries and accounts</h2>
      <p>
        Online inquiries are currently unavailable. This website does not accept
        messages, document uploads, account registrations, or payments. Disabled
        inquiry requests are rejected without processing their contents through
        an email provider or an inquiry database.
      </p>
      <h2>Hosting and technical information</h2>
      <p>
        Vercel hosts this website. Delivering pages and protecting the service
        involves technical information such as IP addresses, requested URLs,
        browser information, and request times. Hosting providers may process
        this information for operation, security, and diagnostics. See{" "}
        <a href="https://vercel.com/legal/privacy-notice">Vercel’s privacy notice</a>{" "}
        for information about its practices.
      </p>
      <h2>Cookies and browser storage</h2>
      <p>
        The corporate application does not set advertising cookies or include
        behavioral analytics. It does not use the former platform’s login
        cookies to identify visitors. Previously stored browser data may remain
        until it expires or you remove it through your browser settings.
      </p>
      <h2>Changes to this website</h2>
      <p>
        Inquiry handling, contact information, and retention details will be
        published before an online inquiry channel is enabled. This notice will
        be updated when the website’s handling of information changes.
      </p>
    </article>
  );
}
