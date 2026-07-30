# AEMET A1 Trainer

A web/PWA study system for preparing the Spanish public opposition exam:

Grupo A1 – Cuerpo Superior de Meteorólogos del Estado, AEMET.

## Goals

- Track the official syllabus.
- Build a past-question bank.
- Schedule study sessions.
- Improve focus.
- Monitor BOE/AEMET official sources.
- Support countdowns and progress analytics.
- Use Notion as an editable knowledge layer.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Notion API
- Google Calendar API later
- Vercel

## Current status

Private production deployment:

- Vercel project: `deanpm1994s-projects/web`
- Production URL: `https://web-konn52wdr-deanpm1994s-projects.vercel.app`
- Deployment protection: Vercel SSO disabled; app-level Supabase auth remains available.

Implemented:

- Phase 1: read-only study checklist MVP.
- Phase 2: question bank MVP.
- Phase 3: focus and calendar MVP.
- Phase 4: Notion sync for topics and resources; questions remain an optional editorial/import path.
- Phase 5: Supabase-backed auth, settings, study sessions, focus outcomes, topic progress, question progress, and question attempt history.
- Phase 6: manual-only monitoring workflow skeleton.
- Phase 7: basic PWA installability metadata.
- Complete verified BOE syllabus import, preserving source-owned wording and provenance.
- Canonical Supabase question bank with a checked-in verified-official fallback for private study.

Not yet fully operating:

- The remaining historical and recent past-question candidates require visual/editorial review before they can be learner-visible.
- Monitoring is not automated; there is no polling, snapshot comparison, event detection, or alert delivery.
- Reminder settings are saved preferences only; browser notifications, push subscriptions, service worker, offline cache, and scheduled delivery are not active.

## Notion sync

Phase 4 uses server-side Notion integrations for:

- `/topics`
- `/resources`

The learner-facing question bank is loaded from Supabase and falls back to a
checked-in verified official subset if Supabase cannot provide learner-eligible
questions. Notion questions remain an optional editorial/import path and are
not the runtime source of truth.

Required environment variables:

- `NOTION_TOKEN`
- `NOTION_TOPICS_DATA_SOURCE_ID`
- `NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID`

Behavior:

- when the relevant route config is present and the Notion sync succeeds, the app shows live Notion data
- when configuration is missing, the app shows local fallback data with an explicit warning
- when the sync fails or mapping is invalid, the app shows local fallback data with an explicit error

The app does not expose the Notion token to the browser.

## Supabase settings persistence

Phase 5.1 expects:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Current scope:

- saves user settings when an authenticated Supabase session exists
- now provides email/password auth UI for sign-up and sign-in
- does not yet send notifications

Current auth scope:

- email/password sign-up
- email/password sign-in
- sign-out
- no Google auth yet
- no password reset yet

## Safety

Official exam information must be verified from official sources before being displayed as official.

Use:
- `verified`
- `unverified`
- `needs_review`
- `deprecated`

Never invent official dates, deadlines, answer keys or syllabus wording.
