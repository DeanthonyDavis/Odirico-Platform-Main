# Operations Web Architecture

## Canonical workspace role

`apps/web/operations-web` is the canonical and physical home for the main Odirico browser app and the single-project route shell for the ecosystem.

## Current layout

```text
apps/web/operations-web/
|-- .git/
|-- src/
|   `-- app/
|       |-- (marketing)/
|       |-- (auth)/
|       |-- (platform)/
|       `-- api/
|-- public/
|-- supabase/
|-- scripts/
|-- .env.example
|-- .env.local
|-- .gitignore
|-- next-env.d.ts
|-- next.config.ts
|-- package.json
|-- proxy.ts
|-- tsconfig.json
|-- README.md
|-- CONTRIBUTING.md
|-- ARCHITECTURE.md
`-- app.manifest.json
```

## Scope boundary

This app owns:

- the route-based Odirico platform shell
- the operational dashboard and ticket workflows
- its own repo boundary and Git directory
- its own environment files and Next.js configuration
- direct workspace-source consumption for shared contracts and helpers from:
  - `D:\Odirico\packages\core`
  - `D:\Odirico\packages\auth`
  - `D:\Odirico\packages\api`

This app does not own:

- `D:\Odirico\Odirico-OS\Sol`
- `D:\Odirico\Odirico-OS\Ember`
- `D:\Odirico\Odirico-OS\tools`
- `D:\Odirico\Odirico-OS\prototypes`

## Migration outcome

- the live app source was moved out of `D:\Odirico\Odirico-OS`
- the app repo boundary moved with it
- `D:\Odirico\Odirico-OS` is now an umbrella workspace folder instead of the root app location

## Shared package boundary

Current shared ownership is explicit:

- `@odirico/core` owns the shared Odirico app catalog plus platform-neutral domain contracts, settings, validation, tickets, and designer helpers
- `@odirico/auth` owns reusable role parsing and user-context construction
- `@odirico/api` owns reusable request identity, JSON response, and CORS helpers

## Platform decision

The preferred architecture is now:

- one Next.js App Router project
- one shared Supabase auth/session layer
- one future billing surface
- route-based app homes for Ember, Sol, Surge, and PoleQA inside the same shell

That means this app is no longer only a PoleQA runtime. It is the ecosystem shell that additional product runtimes will be folded into over time.

## Git access

Normal `git -C` may still require a safe-directory exception on this filesystem.

Use:

- `D:\Odirico\tooling\git\operations-web-git.ps1`

when you want a stable Git entrypoint without changing global settings first.
