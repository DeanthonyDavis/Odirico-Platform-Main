# Odirico Desktop Release Guide

This desktop release path is built around the guidance in the official Tauri Windows installer and Windows code-signing docs:

- Tauri Windows installers support NSIS setup executables and WiX MSI packages. Odirico uses NSIS for release builds because the local WiX path already failed and NSIS gives a cleaner single-file installer flow. Source: [Tauri Windows Installer](https://tauri.app/distribute/windows-installer/)
- Tauri supports a custom `bundle.windows.signCommand`, which is the hook used here to sign the Windows installer with either `signtool` or Azure Trusted Signing. Source: [Tauri Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/)

## What ships from this repo

- Local verification build: `npm run release:windows:unsigned`
- Trusted release build: `npm run release:windows`
- GitHub Actions workflow: `.github/workflows/windows-desktop-release.yml`

The release command builds a Windows NSIS installer from `apps/desktop/odirico-desktop`.

- For `signtool-pfx` and `signtool-store`, it uses Tauri's native Windows signing support by injecting the certificate thumbprint, digest algorithm, and timestamp server into a generated release config.
- For `trusted-signing-cli`, it falls back to the custom hook at `src-tauri/windows/sign-windows.ps1`.

## Release output

After a successful Windows release build, the installer artifacts are written to:

`apps/desktop/odirico-desktop/src-tauri/target/release/bundle/nsis/`

The main file will be a `*-setup.exe` installer. Do not publish unsigned installers on the public site.

## Supported signing modes

Set `ODIRICO_WINDOWS_SIGNING_MODE` to one of:

- `signtool-pfx`
- `signtool-store`
- `trusted-signing-cli`

### Recommended GitHub Actions mode

Use `signtool-pfx` for the first production path. It is the mode already wired into the GitHub Actions workflow.

Required GitHub secrets for `signtool-pfx`:

- `ODIRICO_WINDOWS_SIGNING_MODE` = `signtool-pfx`
- `ODIRICO_WINDOWS_PFX_BASE64` = base64-encoded contents of your `.pfx` code-signing certificate
- `ODIRICO_WINDOWS_CERTIFICATE_PASSWORD` = password for the `.pfx`
- `ODIRICO_WINDOWS_TIMESTAMP_URL` = timestamp URL from your certificate authority

The workflow decodes `ODIRICO_WINDOWS_PFX_BASE64` into a temporary file and passes that file to the Tauri signing hook.
The release script then imports the `.pfx` into the Windows certificate store for that build and lets Tauri sign with the returned thumbprint.

### Optional local mode: certificate store

`signtool-store` is useful when the certificate is already imported into the Windows certificate store.

Required environment variables:

- `ODIRICO_WINDOWS_SIGNING_MODE=signtool-store`
- `ODIRICO_WINDOWS_CERTIFICATE_THUMBPRINT`
- `ODIRICO_WINDOWS_TIMESTAMP_URL`

Optional:

- `ODIRICO_WINDOWS_CERTIFICATE_STORE` defaults to `My`
- `ODIRICO_WINDOWS_CERTIFICATE_STORE_LOCATION` defaults to `CurrentUser`

### Optional future mode: Azure Trusted Signing

The signing hook also accepts `trusted-signing-cli`, but the current GitHub Actions workflow intentionally does not install that CLI for you yet.

Required environment variables:

- `ODIRICO_WINDOWS_SIGNING_MODE=trusted-signing-cli`
- `ODIRICO_WINDOWS_TRUSTED_SIGNING_ENDPOINT`
- `ODIRICO_WINDOWS_TRUSTED_SIGNING_ACCOUNT`
- `ODIRICO_WINDOWS_TRUSTED_SIGNING_PROFILE`

Optional:

- `ODIRICO_WINDOWS_TRUSTED_SIGNING_CLI_PATH`
- `ODIRICO_WINDOWS_SIGNING_DESCRIPTION`

## Local commands

Unsigned smoke test:

```powershell
cd D:\Odirico\publish\Odirico-platform-main\apps\desktop\odirico-desktop
npm run release:windows:unsigned
```

Signed local build with `.pfx`:

```powershell
$env:ODIRICO_WINDOWS_SIGNING_MODE = "signtool-pfx"
$env:ODIRICO_WINDOWS_CERTIFICATE_PATH = "C:\path\to\odirico-signing.pfx"
$env:ODIRICO_WINDOWS_CERTIFICATE_PASSWORD = "your-password"
$env:ODIRICO_WINDOWS_TIMESTAMP_URL = "https://timestamp.example.com"
npm run release:windows
```

## GitHub Actions release flow

The workflow supports two paths:

- `workflow_dispatch`: builds a signed installer and uploads the bundle as a workflow artifact
- tag push matching `desktop-v*`: builds the signed installer, uploads artifacts, and creates a draft GitHub Release

Example tag:

```powershell
git tag desktop-v0.1.0
git push origin desktop-v0.1.0
```

## Before restoring a public Windows download

Do all of the following first:

1. Use a real code-signing certificate.
2. Produce a signed NSIS installer through this workflow.
3. Download the installer in Chrome and verify it is no longer flagged as dangerous.
4. Confirm Windows SmartScreen shows your publisher instead of the unknown-app warning.
5. Only then point the public install page to the GitHub Release asset or your signed distribution endpoint.

## What this does not finish by itself

- Microsoft reputation building still depends on the certificate type and download history.
- Extended Validation certificates generally establish SmartScreen trust faster than Organization Validated certificates.
- Desktop auto-updates still require the Tauri updater plugin and signed updater artifacts to be wired end to end.

This release path solves the first blocker: trustworthy signed installer generation instead of publishing unsigned zip downloads.
