# Odirico Platform Main

This is the clean publish-ready workspace for the current Odirico platform app.

## What it contains

- `apps/web/operations-web`
- `packages/core`
- `packages/auth`
- `packages/api`
- root `package.json`
- root `turbo.json`

## Use this for deployment

If you want to push the current platform shell to GitHub and connect it to Vercel, use this folder instead of the older `Odirico-OS-main` publish repo.

## Vercel root directory

Set the Vercel project root directory to:

- `apps/web/operations-web`

## Supabase schema file

Run this file in Supabase SQL Editor:

- `apps/web/operations-web/supabase/migrations/20260402_initial_schema.sql`
