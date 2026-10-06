# Odirico corporate production site

The public corporate site lives in `sites/odirico-holdings` and uses the existing Vercel project `deanthonydavis-projects/odirico-platform-main`. Canonical domain: https://odirico.com.

## Scope approved October 5, 2026

The owner explicitly authorized replacing the legacy platform, including the loss of its Forge/calendar routes, and launching with inquiries unavailable. Legacy source remains in `apps/web/operations-web`, the other apps, and shared packages. Legacy databases, credentials, integrations and authentication configuration are not deleted or rotated. This deployment contains no private Holdings Admin or Solutions CRM code.

The active old production build was uploaded by CLI and contains features absent from GitHub main. This repository therefore does not reproduce every feature in that old build.

## Run and verify

From this folder:

```sh
npm ci
npm run dev
npm run test:all
npm run build
npm run start
```

Default local inquiries are disabled. The automated form tests use preview/mocked delivery and never send email. All form source remains available for a later, separately configured release.

## Deployment

Production branch: `main`. Vercel root directory: `sites/odirico-holdings`. Framework: Next.js. Build: `npm run build`. Install: `npm ci`. Output: framework default. Node: 24.x. The folder is intentionally outside the legacy npm workspaces and has its own lockfile.

Use a feature branch preview before merging to main. The existing project is reused; do not create another production project. `vercel.json` contains only non-secret launch settings: canonical HTTPS URL, inquiry delivery disabled, indexing requested. Preview deployments remain noindex because indexing also checks `VERCEL_ENV`.

The public site does not consume legacy Supabase, Stripe, Plaid, calendar or AI credentials. Existing project environment variables are preserved. Do not add client-side references to these secrets.

## Future inquiry activation

Required names only: `INQUIRY_DELIVERY`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `INQUIRY_FROM`, `INQUIRY_TO`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_SECRET`. Review the configuration precedence in `vercel.json` before enabling delivery. Confirm the recipient, sender, retention practices and privacy contact; update the current informational notices and obtain appropriate legal review before collecting messages. Test server validation, distributed rate limiting, origin checks and real delivery before enabling public forms. No legal-compliance claim is made by this release.

## Domain and legacy transition

Production was verified October 6, 2026: HTTPS apex serves the corporate site and www redirects to apex (308), preserving paths and queries. Before this replacement, Vercel served www and redirected apex to www (307). Cloudflare DNS records were unchanged. Product URLs are deliberately retired; they return 404, not misleading redirects to corporate pages. Corporate redirects remain `/about` to `/company`, `/companies` to `/portfolio`, `/partnerships` to `/contact`.

`public/sw.js` retires the previous platform service worker and removes only its known shell cache. Other cookies and browser storage are not erased. New corporate pages do not register a service worker or access the former login session.

## Rollback

Old production deployment: `E9Z9HMH8jKZQQnEX85seig8wHrFw`.
Immutable hostname: `odirico-platform-main-oa63fmlxc-deanthonydavis-projects.vercel.app`.
Source shown by Vercel: `vercel deploy`, May 26; source commit unknown.

Before promotion, confirm the deployment is still retained/restorable. Vercel exposes Instant Rollback; the project retention setting was 30 days at inspection. Do not assume indefinite archival.

For a critical regression, roll back/promote that exact retained deployment, restore apex-to-www 307 and www Production assignment, and verify legacy login/routes. To restore the old Git deployment configuration for later builds, use root `apps/web/operations-web`, build `turbo run build`, install `npm install`, Next.js default output, Node 24.x. That old Git source is NOT equivalent to the recorded CLI production build. Keep its build settings separate from the act of restoring the known-good deployment.

A Git revert alone is insufficient to recreate the CLI build. Do not delete databases or change secrets during rollback. Prevent a subsequent push from unintentionally replacing the restored deployment by resolving the desired code/configuration first.

## Launch review

The current privacy/terms pages are limited factual website notices for a release that does not accept inquiries. Earlier legal review drafts are preserved in `docs/legal-review-drafts-2026-10-05`. Entity-specific legal review, a verified privacy contact and inquiry retention rules remain follow-up work; no jurisdiction or guaranteed compliance is invented.

See [the production report](docs/PRODUCTION-RELEASE-2026-10-06.md) for the application release commit, checks, domain verification, remaining work and evidence. Documentation-only follow-up commits deploy through the same main-branch workflow.
