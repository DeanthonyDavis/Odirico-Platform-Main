# ŌDIRICO production release

Verified October 6, 2026. Status: **live and verified** at https://odirico.com.

## Release and hosting

- Application release: `96c1bc92a2c63355ad65fbf177b6702c7118c310` on `main` in `DeanthonyDavis/Odirico-Platform-Main`.
- Initial successful production deployment: [`85mfuXxbJQMCjWHVB1CVsMcCN2x9`](https://vercel.com/deanthonydavis-projects/odirico-platform-main/85mfuXxbJQMCjWHVB1CVsMcCN2x9).
- Existing Vercel project reused: `deanthonydavis-projects/odirico-platform-main`; no second production project.
- Root: `sites/odirico-holdings`; Next.js; Node 24.x; `npm ci`; `npm run build`; framework-default output.
- Git pushes to `main` deploy production. This report and screenshots are documentation-only follow-up changes to that application release.

## Verification results

| Check | Result |
| --- | --- |
| Clean install, lint, TypeScript and production build | Passed |
| Unit tests | 20 passed |
| Desktop/mobile end-to-end suite | 22 passed |
| Disabled-inquiry launch suite | 4 passed after production build |
| Live public pages | Homepage, Company, Approach, Portfolio, Acquisitions, Contact, Privacy and Terms returned 200 |
| Branding and metadata | ŌDIRICO display brand, apex canonicals, Open Graph, favicon, sitemap and indexing checked |
| Assets | 15 font/style/script/image/icon/worker assets returned 200 |
| Browser verification | Desktop and mobile layout, loaded fonts, no horizontal overflow, mobile menu open/close/navigation, no observed console errors on inspected pages |
| Inquiry handling | Contact/acquisitions show unavailable notices without inputs; empty API request returned 503 and “Nothing has been sent”; no real inquiry email sent |
| Protected/legacy URLs | Admin, login, Forge, calendar, old product/API paths and unpublished Solutions entry returned 404 |
| Production dependency audit | Zero production vulnerabilities at check time |

Machine-readable evidence: [production verification](production-verification-2026-10-06.json). Repeat the HTTP checks with `node scripts/verify-deployment.mjs https://odirico.com` from the application folder. Browser review and screenshots are additional checks, not implied by the HTTP script.

Screenshots: [desktop home](screenshots/production-homepage-desktop.png), [mobile home](screenshots/production-homepage-mobile.png), [desktop contact](screenshots/production-contact-desktop.png), [mobile contact](screenshots/production-contact-mobile.png), [desktop acquisitions](screenshots/production-acquisitions-desktop.png), [mobile acquisitions](screenshots/production-acquisitions-mobile.png).

## Domains and redirects

HTTPS `odirico.com` serves 200. `www.odirico.com` redirects 308 to apex, including path/query preservation. Both domains show Valid Configuration in Vercel. Existing Cloudflare DNS was unchanged: apex A `216.198.79.1`, www CNAME `dbf1859a64499c06.vercel-dns-017.com`; nameservers `irena.ns.cloudflare.com` and `jimmy.ns.cloudflare.com`.

Corporate 308 redirects: `/about` → `/company`; `/companies` → `/portfolio`; `/partnerships` → `/contact`. Retired product routes return 404; no redirects to nonexistent products or blanket homepage redirects were introduced.

## Legacy preservation and private applications

The owner explicitly authorized replacing the legacy platform despite losing its current Forge/calendar routes. Old `apps/` and `packages/` source was preserved unchanged. Existing databases, environment variables, authentication configuration, integration credentials and deployment projects were not deleted or rotated. Legacy functionality is **not served by the new public deployment**.

The previous production build was a May 26 CLI upload with newer features missing from GitHub main; preserved Git source does not recreate that exact build. Local Holdings Admin and Solutions CRM were not deployed, merged or made public. The new Odirico OS roadmap is a separate architecture review, not part of this release. No admin or Oritryx domain was provisioned here.

The retirement service worker removes only the known `odirico-platform-shell-v1` cache and unregisters itself. Other browser cookies/storage are not erased; the corporate site does not consume old sessions.

## Rollback

Use the [runbook](../README.md#rollback). Prior known-good CLI deployment: `E9Z9HMH8jKZQQnEX85seig8wHrFw`; hostname `odirico-platform-main-oa63fmlxc-deanthonydavis-projects.vercel.app`. Confirm that Vercel still retains it before invoking Instant Rollback or promotion; the inspected retention setting was 30 days, not an archival guarantee. Restore the original apex→www 307 and www Production assignment when restoring the old experience. A Git revert alone cannot reconstruct that CLI build.

## Outstanding items

1. Inquiries are intentionally unavailable. Before enabling them, confirm sender/recipient, secure rate-limit/delivery configuration, retention and privacy contact; review notices and test real delivery under separate authorization. Required variable names appear in the runbook; no secret values are included.
2. Full dependency audit identified five high-severity entries associated with the dev-only `braces` dependency chain used by lint tooling. No compatible patch was available during this release; production dependency audit is clear. Do not force the suggested incompatible Next ESLint downgrade. Recheck upstream tooling before the next code release.
3. Privacy/terms are limited factual notices for the current non-transactional website. Entity-specific legal review and a verified privacy contact remain follow-up work. This report makes no claim of comprehensive legal compliance.
4. Keep rollback retention under review. Preserve the old source and infrastructure until a deliberate migration/archive decision is made.
