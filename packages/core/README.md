# Core Package

Canonical role:

- platform-agnostic business logic and shared source-of-truth contracts

Current files:

- `src/apps.ts` for the shared Odirico app catalog and route metadata
- `src/env.ts` for validated environment access
- `src/database.ts` for shared Supabase database typing
- `src/designers.ts` for shared designer roster and alias helpers
- `src/platform.ts` for shared role and dashboard-mode primitives
- `src/settings.ts` for shared settings defaults and settings types
- `src/tickets.ts` for shared ticket-domain contracts and date/priority helpers
- `src/validation.ts` for shared input schemas and API-safe validation contracts
- `src/index.ts` as the package entrypoint

Current consumer:

- `D:\Odirico\apps\web\operations-web`

Next likely extraction targets:

- additional platform-neutral schemas
- shared domain types
- state and workflow contracts that do not depend on app-only UI logic
