# Odirico Platform Main

This is the canonical git-backed workspace for the current Odirico platform.

## What it contains

- `apps/web/operations-web`
- `apps/mobile/odirico-mobile`
- `apps/desktop/odirico-desktop`
- `packages/core`
- `packages/auth`
- `packages/api`
- `packages/design-tokens`
- `packages/ui-web`
- `packages/ui-mobile`
- `packages/ui-desktop`
- root `package.json`
- root `turbo.json`

## Use this for development and deployment

If you want to edit, build, deploy, or push the platform, use this folder.

## Vercel root directory

Set the Vercel project root directory to:

- `apps/web/operations-web`

## Notes

- This repo is the source of truth that GitHub and Vercel should follow.
- Older local copies under `D:\Odirico\apps\...` should not be treated as canonical deploy targets.
