# Auth Package

Canonical role:

- shared auth role and user-context logic that does not depend on app routing or server runtime wiring

Current files:

- `src/roles.ts` for role parsing, display-name logic, access helpers, and user-context shaping
- `src/index.ts` as the package entrypoint

Current consumer:

- `D:\Odirico\apps\web\operations-web`

Current note:

- Next.js redirects, Supabase session fetching, and demo-session wiring still stay inside
  `operations-web` because they are runtime-specific, not cross-platform auth contracts
