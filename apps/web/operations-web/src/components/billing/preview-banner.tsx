import Link from "next/link";

type PreviewBannerProps = {
  title: string;
  copy: string;
  checkoutConfigured: boolean;
};

export function PreviewBanner({ title, copy, checkoutConfigured }: PreviewBannerProps) {
  return (
    <section className="panel preview-banner">
      <div className="preview-banner-head">
        <div>
          <p className="sidebar-label">Preview mode</p>
          <h3>{title}</h3>
        </div>
        <p className="muted">{copy}</p>
      </div>

      <div className="preview-banner-actions">
        <Link className="marketing-button marketing-button-primary" href="/billing">
          {checkoutConfigured ? "Unlock full access" : "Open billing setup"}
        </Link>
        <Link className="marketing-button marketing-button-secondary" href="/settings#appearance">
          Theme and settings
        </Link>
      </div>
    </section>
  );
}
