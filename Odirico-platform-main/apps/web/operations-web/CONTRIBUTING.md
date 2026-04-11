# Contributing to Operations Web

## Branching

- `main` for stable production-ready work
- `feature/*` for new features
- `fix/*` for bug fixes
- `refactor/*` for cleanup and architectural changes
- `docs/*` for documentation-only work
- `chore/*` for tooling and maintenance

Do not push direct feature work to `main`.

## App structure

- keep route and app-shell code in `src/app/`
- keep reusable UI in `src/components/`
- keep feature and service logic in `src/lib/`
- keep migrations in `supabase/`
- keep app-only scripts in `scripts/`

## Environment

- copy `.env.example` to `.env.local` for local setup
- keep real secrets in `.env.local` only
- update `.env.example` whenever a required variable changes

## Before opening a PR

- run the app locally
- check types and linting where available
- keep architectural changes reflected in `ARCHITECTURE.md`
