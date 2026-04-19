# Operations Web

This folder is the canonical and physical home for the unified browser-based Odirico platform app.

## What lives here

- the live Next.js source in `src/`
- static assets in `public/`
- Supabase migrations in `supabase/`
- app scripts in `scripts/`
- app environment templates and local env files
- the app Git directory for this web product

## Platform route model

This app is now the single-project route shell for the Odirico ecosystem.

Current core routes:

- `/`
- `/login`
- `/callback`
- `/dashboard`
- `/tickets`
- `/billing`
- `/settings`

Current app routes:

- `/ember`
- `/sol`
- `/surge`
- `/dashboard` for the live PoleQA workspace

## Shared packages used here

- `@odirico/core` for platform-neutral contracts and domain helpers
- `@odirico/auth` for shared auth role and user-context logic
- `@odirico/api` for shared request, response, and CORS helpers

## Repo note

The app repo boundary now lives here too.

If you need Git commands for this app from the broader workspace, use:

- `D:\Odirico\tooling\git\operations-web-git.ps1`

## Build note

Type checking runs fine in place on `D:`.

If production builds fail with filesystem `readlink` or junction errors on this drive, use:

- `D:\Odirico\tooling\build\operations-web-build-on-ntfs.ps1`

That helper copies the app to an NTFS temp workspace on `C:` and builds there while keeping
this folder as the canonical source of truth.

## Product note

- `Sol` and `Ember` still stay inside `D:\Odirico\Odirico-OS`
- they remain sibling workspaces under the broader OS umbrella
- `Surge` still lives under `D:\Odirico\Odirico-OS\tools\surge` while its route shell now lives here

## Editing rule

Edit the operations app here.

Do not rebuild a second copy of the app under `D:\Odirico\Odirico-OS`.
