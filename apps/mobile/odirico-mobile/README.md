# Odirico Mobile

Canonical role:

- native mobile app shell for iOS and Android
- phone-first workflows with platform-appropriate UX

Current scaffold:

- Expo-based app shell
- shared token dependency on `D:\Odirico\packages\design-tokens`
- TypeScript mobile entry at `src/main.tsx`
- first adaptive app surface at `src/App.tsx`

Recommended product split inside this shell:

- shared mobile navigation shell
- module-specific surfaces for Odirico OS workflows
- mobile-safe authentication, sync, notifications, uploads, and offline behavior

Active stack:

- Expo
- React Native
- shared logic from `D:\Odirico\packages\core`
- shared auth from `D:\Odirico\packages\auth`
- shared API contracts from `D:\Odirico\packages\api`
- mobile UI wrappers from `D:\Odirico\packages\ui-mobile`
