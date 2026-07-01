# PWA Reminder Shell Design

Date: 2026-07-01
Branch: `develop`

## Goal

Make the web app installable as a basic PWA and keep reminder settings visible as saved preferences only, without claiming browser notifications or scheduled delivery are active.

## Current State

- The app is a Next.js TypeScript web app with server-rendered routes.
- `/settings` already persists `reminderPreferences` for signed-in users through Supabase-backed user settings.
- The settings UI clearly says notification delivery is not active yet.
- No web app manifest, app icons, service worker, offline cache, notification permission request, push subscription, or scheduled reminder delivery exists.

## Scope

This slice adds installability and a reminder readiness shell only:

- Add a web app manifest with AEMET A1 Trainer identity, Spanish study-app metadata, theme color, and app icon references.
- Add simple app icons in `apps/web/public` that are clearly project-owned placeholders, not official AEMET marks.
- Wire Next.js metadata so supported browsers can discover the manifest and theme color.
- Keep reminder settings as persisted preferences only.
- Add a small PWA/reminder status surface in settings or app metadata that says installability is available while notification delivery remains pending.
- Update project docs to record exactly what exists and what remains inactive.

## Non-Goals

- No browser push notifications.
- No notification permission prompt.
- No service worker.
- No offline review cache.
- No scheduled reminder jobs.
- No official AEMET, BOE, or Spanish government logo usage.
- No future exam call, deadline, or countdown assumptions.
- No active monitoring claims.

## Application Design

Use Next.js built-in metadata and static public assets:

- Create `apps/web/app/manifest.ts` to return a typed `MetadataRoute.Manifest`.
- Create project-owned SVG icon assets under `apps/web/public`:
  - `icon.svg`
  - `apple-icon.svg`
- Update `apps/web/app/layout.tsx` metadata with manifest, icons, Apple web app metadata, and theme color.

Do not add `next-pwa`, Workbox, or any service-worker dependency in this slice. Installability can be established by manifest metadata first; offline behavior and push notifications require separate implementation and verification.

For reminders, keep the existing persisted settings model:

- `remindersEnabled`
- `reminderChannel`
- `morningReminderTime`
- `eveningReminderTime`

Improve copy only where needed so users understand these are saved preferences for a future notification phase.

## Data and Official-Source Policy

This feature does not add official exam data. The app name and study purpose are product metadata, not official AEMET claims.

Icon assets must be original project placeholders and must not imply official AEMET branding.

## Error Handling

- Manifest generation should be static and not depend on Supabase, auth, or external services.
- Settings persistence behavior remains unchanged:
  - signed-in users can save preferences;
  - anonymous users see local defaults and cannot sync;
  - failed Supabase loads keep existing fallback messages.

## Testing

Use test-first changes for the manifest:

- Add a failing unit test that calls the manifest export and verifies:
  - app name is `AEMET A1 Trainer`;
  - `display` is `standalone`;
  - `start_url` is `/`;
  - icon entries include maskable and any-purpose assets;
  - the description does not claim active reminders, monitoring, or official status.
- Run the focused test and confirm it fails before implementation.
- Implement the manifest.
- Run the focused test until it passes.

Manual verification after implementation:

- Run lint, tests, and build.
- Confirm `/manifest.webmanifest` or the framework-generated manifest endpoint is produced by the build.
- Confirm settings copy still says notification delivery is not active.

## Documentation

Update:

- `docs/PROJECT_MEMORY.md` with Phase 7 installability status.
- `docs/ROADMAP.md` to mark manifest/installability shell progress without marking notifications complete.
- `docs/DATA_MODEL.md` only if reminder preference behavior needs clearer wording.

## Acceptance Criteria

- Browsers can discover a valid web app manifest.
- App icons are project-owned placeholders and do not reuse official marks.
- Settings still avoid claiming active notification delivery.
- No service worker, push subscription, notification permission prompt, or scheduled reminder job is introduced.
- Tests, lint, and build have fresh verification results.
