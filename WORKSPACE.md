# Workspace Guide

## Canonical repo

The canonical Odirico platform repo is:

- `D:\Odirico\publish\Odirico-platform-main`

Open this folder in VS Code when working on the platform.

## Primary app paths

- Web: `apps/web/operations-web`
- Mobile: `apps/mobile/odirico-mobile`
- Desktop: `apps/desktop/odirico-desktop`

## Shared packages

- `packages/core`
- `packages/auth`
- `packages/api`
- `packages/design-tokens`
- `packages/ui-web`
- `packages/ui-mobile`
- `packages/ui-desktop`

## Deployment rule

Vercel should deploy from this repo, with the project root set to:

- `apps/web/operations-web`

## Do not use as source of truth

These paths may still exist locally for reference or archive purposes, but they should not be
used as the primary platform repo:

- `D:\Odirico`
- `D:\Odirico\apps\web\operations-web`
