# Odirico Desktop

Canonical role:

- native desktop shell for Windows and macOS
- higher-density operational workspace than mobile

Current scaffold:

- Tauri shell with Vite frontend
- shared token dependency on `D:\Odirico\packages\design-tokens`
- frontend entry at `src/main.ts`
- native shell config under `src-tauri/`

Active stack:

- Tauri
- shared logic from `D:\Odirico\packages\core`
- shared auth from `D:\Odirico\packages\auth`
- shared API contracts from `D:\Odirico\packages\api`
- desktop UI wrappers from `D:\Odirico\packages\ui-desktop`

UX note:

- the desktop shell should not just be a wrapped mobile app
- it should use desktop patterns such as sidebars, toolbars, keyboard shortcuts, and multi-panel layouts
