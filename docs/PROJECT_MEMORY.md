# Project Memory

This file stores persistent project context for Codex and contributors.

## Project

Name: AEMET A1 Trainer

Purpose:
A web/PWA app for preparing the Spanish public opposition exam:
Grupo A1 – Cuerpo Superior de Meteorólogos del Estado, AEMET.

## User

The primary user is preparing for the next AEMET A1 opening.

Known constraints:
- Works 12:30–23:00.
- Best study time: morning.
- Background: Meteorology degree from Cuba.
- Spanish qualification: Master in Meteorology and Geophysics.
- Wants calendar-based checklist and focus support.
- Wants a question bank from past exams.
- Wants countdowns for future openings and exam phases.
- Wants official BOE/AEMET monitoring.
- Husband is a software developer and wants this as a GitHub portfolio project.

## Study defaults

Morning deep work is preferred.

Default weekday plan:
- 07:30–09:00 deep technical study
- 09:10–10:10 problems/practical case
- 10:20–11:00 legal/informatics/flashcards
- 23:30–00:00 optional light review

Avoid heavy study after 23:00.

## Official syllabus size

Current known structure from latest referenced A1 programme:
- Mathematics: 18 topics
- Physics: 18 topics
- Meteorology and Climatology: 59 topics
- Informatics and Communications: 10 topics
- General/Common topics: 23 topics from BOE-A-2026-1292 acceso libre Temas generales

Total: 128 topics

Important:
The exact topic wording must be verified against the official BOE call before importing.

## Core app modules

1. Dashboard
2. Official topic checklist
3. Question bank
4. Practical case trainer
5. Focus mode
6. Calendar planner
7. Countdown system
8. BOE/AEMET monitor
9. Notion sync
10. Progress analytics

## Architecture direction

Preferred stack:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Notion API
- Google Calendar API later
- Vercel deployment
- PWA-first design

## Official-source policy

Only official-source verified data may be displayed as official.

Official preferred sources:
- BOE
- AEMET
- Spanish government legal sources
- WMO
- ECMWF
- EUMETSAT

Use `TODO_VERIFY_OFFICIAL_SOURCE` for uncertain data.

## Current implementation handoff

Date: 2026-07-05

Branch:
- `past-exam-import`

Private deployment:
- Vercel project created and linked from `apps/web`: `deanpm1994s-projects/web`
- Production URL: `https://web-konn52wdr-deanpm1994s-projects.vercel.app`
- Required production env vars copied from local `.env.local` into Vercel production: Notion token/data source IDs and Supabase URL/publishable/secret keys
- Vercel SSO deployment protection disabled so the URL is directly reachable; app-level Supabase auth remains available for persisted user data
- Live route smoke checks returned HTTP 200 for `/`, `/dashboard`, `/calendar`, `/focus`, `/manifest.webmanifest`, `/auth/sign-up`, `/auth/sign-in`, `/topics`, `/questions`, and `/settings`

Phase 5 status:
- Phase 5.1 Supabase-backed user settings persistence implemented
- Phase 5.2 Supabase email/password auth implemented
- Phase 5.3 Supabase-backed calendar study-session persistence implemented and merged
- Phase 5.4 Supabase-backed focus-session timer and review outcome persistence implemented
- Phase 5.5 Supabase-backed topic progress overlay persistence implemented
- Phase 5.6 Supabase-backed question progress overlay persistence implemented
- Phase 5.7 Supabase-backed question attempt history implemented and remote migration applied
- Phase 5.8 completed focus sessions update topic/question progress overlays

Phase 6 status:
- Monitoring skeleton implemented as a read-only manual workflow dashboard
- Monitoring source verification readiness queue implemented
- No BOE/AEMET polling, scraping, snapshot comparison, event detection, or alerts are active

Phase 7 status:
- Basic PWA installability metadata and project-owned icon placeholders implemented
- Reminder preferences remain saved settings only
- Countdown/status widget shell implemented; it explicitly shows no verified official date until source-backed date records exist
- No browser notifications, push subscriptions, service worker, offline cache, or scheduled reminder delivery are active

i18n status:
- Spanish-first UI foundation implemented with internal `es`/`en` dictionaries
- The root app language defaults to Spanish (`es`)
- Shared shell, navigation, homepage, source-state, and content-readiness UI copy use the i18n helper
- Spanish UI pass 2 translated remaining primary route, form, auth, planner, focus, question, topic, resource, monitoring, settings, manifest, and user-facing status copy
- English fallback strings exist in code, but no user-facing language selector or persisted language preference is implemented yet
- Product UI strings may be translated; source-owned topic/question fields and future BOE/AEMET official wording must not be machine-translated or rewritten by the i18n layer
- Unverified starter study fixture content in `mock-data.ts` may still contain English study statements, names, objectives, bibliography titles, and source notes; treat that as content cleanup/import work, not UI chrome

Study content readiness:
- Dashboard, topics, and questions show whether loaded content is ready for private study tracking
- Unverified starter topics/questions are explicitly not treated as official-ready
- Verified official syllabus wording and verified past-question imports remain the main blocker before calling the app official-content ready
- Official content import foundation exists for syllabus-first ingestion and question-contract validation
- Verified BOE syllabus import from Annex I of BOE-A-2026-1292 now includes the full acceso libre programme: Mathematics, Physics, Meteorology and Climatology, Informatics and Communications, and General/Common. The earlier 127-topic count was corrected to 128 because BOE-A-2026-1292 lists 23 acceso libre Temas generales.
- Verified past-exam subset is imported from official MITECO/AEMET acceso libre primer ejercicio sources. Current checked-in questions: 2018 questions 8, 10, 13, 17, and 19; 2017 questions 12, 13, 14, 15, and 16; 2016 questions 14, 15, 16, 17, and 20; 2015 questions 19, 20, 21, and 22. The subset includes official answer-source provenance from official answer-template resolutions, including the corrected 2016 answer-template resolution and the 2015 MITECO answer-template agreement.
- AEMET official Grupo A1 guide URL for accesso libre work: `https://www.aemet.es/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre`.
- AEMET previous-call page for historical exam discovery: `https://www.aemet.es/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias`; use the Acceso Libre column.
- Remaining past-exam import work: continue importing official AEMET/MITECO PDFs in batches, keep no-answer official exams as `needs_review`, exclude annulled questions from verified practice import unless explicitly modeled, and manually review formula-heavy or OCR-sensitive question text before checked-in import.
- Source-backed official date records remain required before showing a real countdown to any convocatoria, deadline, or exam phase

Supabase notes:
- Project URL configured in local env
- Project ref linked locally: `adwapclevjpltyxprbyx`
- Supabase now uses publishable and secret keys instead of legacy anon/service-role labels
- Local auth issue was caused by a mistyped publishable key prefix in `.env.local`; working prefix is `sb_publishable_...`
- Dev server restart is required after local env changes
- Remote migrations verified applied: `20260623`, `20260630`, `20260701`, `20260702`, `20260703`

Verified working recently:
- `npm --prefix apps/web test`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`
- Focus/session persistence issue #2 was closed after focused verification: 4 files, 27 tests passed.
- Topic/question progress persistence issue #3 was closed after focused verification: 7 files, 24 tests passed.
- GitHub issues #2, #3, #6, #9, and #12 are closed; issues #4, #5, #8, and #13 remain open. Issue #8 requires a real candidate phone smoke test; issue #13 tracks the next verified historical-exam import batch.
- Vercel production deployment completed with ready state `READY`
- Sign-up and sign-in flow worked after env fix
- Local `/calendar` smoke test returned HTTP 200 and rendered the planner
- Focus route now loads the next persisted actionable session for signed-in users and saves timer/review transitions through `study_sessions`
- Topic list and detail routes overlay signed-in user progress from `topic_progress` without mutating source-owned official metadata
- Question route overlays signed-in user practice progress from `question_progress` without mutating source-owned statements, options, answer keys, or verification metadata
- Monitoring route shows manual-only source checklist and review queue placeholders; it does not claim active monitoring
- Dashboard now acts as a Today study cockpit, combining next session, weak topics, overdue questions, and monitoring readiness with signed-in persistence overlays
- Question bank now records signed-in user attempts and derives aggregate review progress from attempt history
- Focus completion now saves related topic/question progress overlays for signed-in users
- Basic PWA manifest/installability metadata builds cleanly and exposes `/manifest.webmanifest`
- Dashboard, topics, and questions show study-content readiness without treating unverified starter content as official
- Study MVP now adds Spanish study cards with three detailed review prompts for every verified topic. Cards are explicitly labelled `Material didáctico no oficial`; they do not replace source-owned BOE titles, URLs, retrieval dates, or verification status.
- Questions route now adds one unverified syllabus-scope practice question per verified topic, topic quiz entry points, deterministic random quiz selection, and immediate Spanish feedback. Official historical questions retain their own provenance and status.
- Calendar recommended week now ranks due review, weak, and unstarted topics and creates editable weekday 07:30–11:00 topic/question/review sessions. It does not use an official exam date.

Next recommended MVP steps:
- Order of action:
  1. Run #8 private MVP phone smoke test: sign in, create or use session, focus timer, complete review, reload, verify topic/question progress updates.
  2. Continue official historical past-exam import in a newly scoped issue, starting with 2014 Acceso Libre only after source inspection.
  3. Implement #4 BOE/AEMET monitoring MVP: persisted checks, snapshot/hash comparison, keyword/event detection, review queue, and no invented official conclusions.
  4. Implement remaining #5 PWA/reminder work: visible in-app reminders first, then notification/offline support only if scoped and verified.
  5. Add a settings language selector if the candidate wants to switch between Spanish and English.

Ignored local artifacts:
- `apps/web/package-lock.json`
- `supabase/.temp/`
